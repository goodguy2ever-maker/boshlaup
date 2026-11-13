import { prisma } from './prisma';

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9073543052:AAFj4tmSOUWaMXaOexSU9A2uB79DpNi-xTg';
export const TELEGRAM_BOT_USERNAME = 'boshlaupbot';
export const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || ''; // @your_channel_name

const API_BASE = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

/**
 * Send text message to a user or channel
 */
export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  replyMarkup?: any
) {
  try {
    const res = await fetch(`${API_BASE}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      }),
      signal: AbortSignal.timeout(3500),
    });
    return await res.json();
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return null;
  }
}

/**
 * Send photo with caption and inline buttons
 */
export async function sendTelegramPhoto(
  chatId: string | number,
  photoUrl: string,
  caption: string,
  replyMarkup?: any
) {
  try {
    const res = await fetch(`${API_BASE}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        photo: photoUrl,
        caption,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      }),
      signal: AbortSignal.timeout(3500),
    });
    return await res.json();
  } catch (error) {
    console.error('Error sending Telegram photo:', error);
    return null;
  }
}

// Helper to map category/stage/region to clean Uzbek Latin
function formatUzbekMeta(category: string, region: string, stage: string) {
  const catMap: Record<string, string> = {
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

  const regMap: Record<string, string> = {
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

  const stageMap: Record<string, string> = {
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

/**
 * Automatically format and broadcast a new startup to the Telegram channel in Uzbek
 */
export async function broadcastStartupToChannel(startup: {
  id: string;
  name: string;
  tagline: string;
  problem?: string | null;
  solution?: string | null;
  category: string;
  region: string;
  stage: string;
  earlyUserOffer?: string | null;
  logoUrl?: string | null;
  telegramContact?: string | null;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boshlaup.uz';
  const startupUrl = `${siteUrl}/startups/${startup.id}`;
  const { catUz, regUz, stgUz } = formatUzbekMeta(startup.category, startup.region, startup.stage);

  const caption = `🚀 <b>BOSHLAUP'DA YANGI STARTAP!</b>\n\n` +
    `<b>${startup.name}</b>\n` +
    `<i>${catUz} • ${regUz} • ${stgUz}</i>\n\n` +
    `📌 <b>Loyiha haqida:</b>\n${startup.tagline}\n\n` +
    (startup.problem ? `💡 <b>Qanday muammoni hal qiladi:</b>\n${startup.problem.slice(0, 180)}...\n\n` : '') +
    (startup.earlyUserOffer ? `🎁 <b>Ilk testerlar uchun bonus:</b>\n${startup.earlyUserOffer}\n\n` : '') +
    (startup.telegramContact ? `👤 <b>Asoschi:</b> ${startup.telegramContact}\n\n` : '') +
    `<i>Loyihani qo'llab-quvvatlang va ilk sinovchilardan biriga aylaning:</i>`;

  const inlineKeyboard = {
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

  let targetChannel = TELEGRAM_CHANNEL_ID || '@boshlaup_projects';

  try {
    const savedChannel = await prisma.userAccount.findUnique({
      where: { telegramId: 'TELEGRAM_CHANNEL' },
    });
    if (savedChannel && savedChannel.role && savedChannel.role.startsWith('-')) {
      targetChannel = savedChannel.role;
    }
  } catch (e) {}

  if (targetChannel) {
    if (startup.logoUrl && startup.logoUrl.startsWith('http')) {
      return await sendTelegramPhoto(targetChannel, startup.logoUrl, caption, inlineKeyboard);
    } else {
      return await sendTelegramMessage(targetChannel, caption, inlineKeyboard);
    }
  }

  console.log('[Telegram Broadcast Preview]:\n', caption);
  return { ok: true, preview: caption };
}

/**
 * Notify founder in Telegram DM when someone leaves a bug report or feedback
 */
export async function notifyFounderFeedback(
  telegramId: string,
  startupName: string,
  tag: string,
  author: string,
  content: string,
  startupId: string
) {
  if (!telegramId) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boshlaup.uz';
  const tagIcons: Record<string, string> = {
    'Баг': '[БАГ]',
    'Идея': '[ИДЕЯ]',
    'Похвала': '[ПОХВАЛА]',
    'Вопрос': '[ВОПРОС]',
  };

  const title = tagIcons[tag] || '[ОТЗЫВ]';
  const text = `<b>${title} по вашему проекту ${startupName}!</b>\n\n` +
    `<b>От:</b> ${author}\n` +
    `<b>Сообщение:</b>\n"${content}"\n\n` +
    `Ответьте тестеру или пометьте как решено на сайте:`;

  const markup = {
    inline_keyboard: [
      [{ text: 'Открыть на сайте →', url: `${siteUrl}/startups/${startupId}#comments` }]
    ]
  };

  return await sendTelegramMessage(telegramId, text, markup);
}

/**
 * Notify founder when someone claims their early tester bonus
 */
export async function notifyFounderBonusClaim(
  telegramId: string,
  startupName: string,
  userTelegram: string,
  startupId: string
) {
  if (!telegramId) return;

  const text = `<b>Новый запрос бонуса тестера!</b>\n\n` +
    `Пользователь <b>${userTelegram}</b> хочет протестировать ваш стартап <b>${startupName}</b> и получить предложенный бонус.\n\n` +
    `Свяжитесь с ним в Telegram, чтобы выдать доступ!`;

  return await sendTelegramMessage(telegramId, text);
}
