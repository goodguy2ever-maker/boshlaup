const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function formatUzbekMeta(category, region, stage) {
  const catMap = {
    'ai': "AI & Sun'iy intellekt",
    'AI & ИИ': "AI & Sun'iy intellekt",
    'fintech': 'FinTech',
    'FinTech': 'FinTech',
    'edtech': 'EdTech',
    'EdTech': 'EdTech',
    'ecommerce': 'E-commerce',
    'E-commerce': 'E-commerce',
    'saas': 'SaaS & B2B',
    'SaaS & B2B': 'SaaS & B2B',
    'proptech': 'PropTech & Qurilish',
    'PropTech & Стройка': 'PropTech & Qurilish',
    'logistics': 'Logistika & Avto',
    'Логистика & Авто': 'Logistika & Avto',
    'agritech': 'AgriTech',
    'AgriTech': 'AgriTech',
    'health': 'HealthTech',
    'HealthTech': 'HealthTech',
    'services': 'Xizmatlar',
    'Услуги & Сервисы': 'Xizmatlar',
    'games': "O'yinlar",
    'Игры & Развлечения': "O'yinlar",
    'social': 'Ijtimoiy',
    'Социальные': 'Ijtimoiy',
    'other': 'Boshqa',
    'Другое': 'Boshqa',
  };

  const regMap = {
    'Ташкент': 'Toshkent',
    'Фергана': "Farg'ona",
    'Самарканд': 'Samarqand',
    'Андижан': 'Andijon',
    'Бухара': 'Buxoro',
    'Наманган': 'Namangan',
    'Хорезм': 'Xorazm',
    'Кашкадарья': 'Qashqadaryo',
    'Сурхандарья': 'Surxondaryo',
    'Джизак': 'Jizzax',
    'Сырдарья': 'Sirdaryo',
    'Навои': 'Navoiy',
    'Каракалпакстан': "Qoraqalpog'iston",
  };

  const stageMap = {
    'idea': "💡 Faqat g'oya",
    'Только идея': "💡 Faqat g'oya",
    'mvp': '🛠 MVP / Prototip',
    'MVP / Прототип': '🛠 MVP / Prototip',
    'sales': '📈 Dastlabki sotuvlar',
    'Есть первые продажи': '📈 Dastlabki sotuvlar',
  };

  const catUz = catMap[category] || category;
  const regUz = regMap[region] || region;
  const stgUz = stageMap[stage] || stage;

  return { catUz, regUz, stgUz };
}

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
  const channel = process.env.TELEGRAM_CHANNEL_ID || '@boshlaup_projects';
  const siteUrl = 'https://boshlaup.uz';
  const startupUrl = `${siteUrl}/startups/${startup.id}`;
  const { catUz, regUz, stgUz } = formatUzbekMeta(startup.category, startup.region, startup.stage);

  const text = `🚀 <b>BOSHLAUP'DA YANGI STARTAP!</b>\n\n` +
    `<b>${startup.name}</b>\n` +
    `<i>${catUz} • ${regUz} • ${stgUz}</i>\n\n` +
    `📌 <b>Loyiha haqida:</b>\n${startup.tagline}\n\n` +
    (startup.problem ? `💡 <b>Qanday muammoni hal qiladi:</b>\n${startup.problem.slice(0, 180)}...\n\n` : '') +
    (startup.earlyUserOffer ? `🎁 <b>Ilk testerlar uchun bonus:</b>\n${startup.earlyUserOffer}\n\n` : '') +
    (startup.telegramContact ? `👤 <b>Asoschi:</b> ${startup.telegramContact}\n\n` : '') +
    `<i>Loyihani qo‘llab-quvvatlang va ilk sinovchilardan biriga aylaning:</i>`;

  const replyMarkup = {
    inline_keyboard: [
      [
        { text: 'Loyihani qo‘llab-quvvatlash ▲', url: startupUrl },
        { text: 'Fikr bildirish 💬', url: `${startupUrl}#comments` },
      ],
      [
        { text: 'O‘z startapingizni joylang 🚀', url: `${siteUrl}/submit` }
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
