const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function broadcastLatest() {
  const startup = await prisma.startup.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  if (!startup) {
    console.log('No startups in DB');
    return;
  }

  console.log('Broadcasting latest startup:', startup.name, `(${startup.id})`);

  const token = process.env.TELEGRAM_BOT_TOKEN || '9073543052:AAFj4tmSOUWaMXaOexSU9A2uB79DpNi-xTg';
  const channel = process.env.TELEGRAM_CHANNEL_ID || '@boshlaup_project';
  const siteUrl = 'https://boshlaup.uz';
  const startupUrl = `${siteUrl}/startups/${startup.id}`;

  const text = `🚀 <b>НОВЫЙ ЗАПУСК НА BOSHLAUP!</b>\n\n` +
    `<b>${startup.name}</b>\n` +
    `<i>${startup.category} • ${startup.region} • ${startup.stage}</i>\n\n` +
    `<b>О проекте:</b>\n${startup.tagline}\n\n` +
    (startup.problem ? `<b>Какую проблему решает:</b>\n${startup.problem.slice(0, 150)}...\n\n` : '') +
    (startup.earlyUserOffer ? `🎁 <b>Бонус для первых тестеров:</b>\n${startup.earlyUserOffer}\n\n` : '') +
    (startup.telegramContact ? `👤 <b>Фаундер:</b> ${startup.telegramContact}\n\n` : '') +
    `<i>Поддержите проект и станьте первым бета-тестером:</i>`;

  const replyMarkup = {
    inline_keyboard: [
      [
        { text: 'Поддержать проект ▲', url: startupUrl },
        { text: 'Оставить фидбек 💬', url: `${startupUrl}#comments` },
      ],
      [
        { text: 'Запустить свой проект 🚀', url: `${siteUrl}/submit` }
      ]
    ],
  };

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: channel,
      text,
      parse_mode: 'HTML',
      reply_markup: replyMarkup,
    }),
  });

  const result = await res.json();
  console.log('Telegram API result:', JSON.stringify(result, null, 2));
}

broadcastLatest().finally(() => prisma.$disconnect());
