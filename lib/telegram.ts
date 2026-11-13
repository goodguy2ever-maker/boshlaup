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

/**
 * Automatically format and broadcast a new startup to the Telegram channel
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

  const caption = `<b>НОВЫЙ ЗАПУСК НА BOSHLAUP!</b>\n\n` +
    `<b>${startup.name}</b>\n` +
    `<i>${startup.category} • ${startup.region} • ${startup.stage}</i>\n\n` +
    `<b>О проекте:</b>\n${startup.tagline}\n\n` +
    (startup.problem ? `<b>Какую проблему решает:</b>\n${startup.problem.slice(0, 150)}...\n\n` : '') +
    (startup.earlyUserOffer ? `<b>Бонус для первых тестеров:</b>\n${startup.earlyUserOffer}\n\n` : '') +
    (startup.telegramContact ? `Фаундер: ${startup.telegramContact}\n\n` : '') +
    `<i>Поддержите проект и станьте первым бета-тестером:</i>`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: 'Поддержать проект ▲', url: startupUrl },
        { text: 'Оставить фидбек', url: `${startupUrl}#comments` },
      ],
      [
        { text: 'Запустить свой проект', url: `${siteUrl}/submit` }
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
