const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '9073543052:AAFj4tmSOUWaMXaOexSU9A2uB79DpNi-xTg';
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

let offset = 0;

async function sendMessage(chatId, text, replyMarkup) {
  try {
    const payload = {
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    };
    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }
    const res = await fetch(`${API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.ok) {
      console.error('[Telegram API Error]:', json.description);
    }
    return json;
  } catch (err) {
    console.error('Failed to send message:', err.message);
    return null;
  }
}

async function handleMessage(msg) {
  if (!msg || !msg.from || !msg.chat) return;

  const chatId = msg.chat.id;
  const telegramId = String(msg.from.id);
  const username = msg.from.username ? `@${msg.from.username}` : '';
  const firstName = msg.from.first_name || 'Фаундер';

  try {
    // Check if user already has an active, unexpired, unused code generated recently (< 5 mins ago)
    const existingCode = await prisma.telegramAuthCode.findFirst({
      where: {
        telegramId,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    let code;
    let expiresAt;

    if (existingCode && (Date.now() - new Date(existingCode.createdAt).getTime()) < 5 * 60 * 1000) {
      // Reuse existing valid code so user does not get conflicting numbers
      code = existingCode.code;
      expiresAt = existingCode.expiresAt;
    } else {
      // Generate new 6-digit PIN code
      code = Math.floor(100000 + Math.random() * 900000).toString();
      expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

      // Save new code in SQLite
      await prisma.telegramAuthCode.create({
        data: {
          code,
          telegramId,
          username,
          firstName,
          expiresAt,
          used: false,
        },
      });
    }

    // Check if user is already registered in StartHub
    const existingUser = await prisma.userAccount.findUnique({
      where: { telegramId },
    });

    let replyText;
    const inlineKeyboard = {
      inline_keyboard: [
        [{ text: 'Войти на BoshlaUp →', url: SITE_URL }],
        [
          { text: 'Опубликовать стартап', url: `${SITE_URL}/submit` },
          { text: 'Каталог проектов', url: SITE_URL }
        ]
      ]
    };

    if (existingUser) {
      replyText = 
        `<b>С возвращением в BoshlaUp, ${existingUser.firstName || firstName}!</b>\n\n` +
        `Ваш аккаунт: <b>${username || existingUser.username || existingUser.firstName}</b>\n` +
        `Роль: <b>${existingUser.role || 'Фаундер / Бета-тестер'}</b>\n\n` +
        `<b>Код для входа на сайте:</b>\n` +
        `<code>${code}</code>\n` +
        `<i>(код действителен 15 минут)</i>\n\n` +
        `<i>Бот активен: сюда мгновенно приходят отзывы, баги и запросы бонусов от первых тестеров ваших стартапов.</i>`;
    } else {
      replyText = 
        `<b>Ассалому алейкум, ${firstName}!</b>\n\n` +
        `Добро пожаловать в <b>BoshlaUp</b> — платформу для запуска IT-стартапов, поиска первых бета-тестеров и привлечения инвестиций в Узбекистане.\n\n` +
        `<b>Что дает BoshlaUp:</b>\n` +
        `• <b>Фаундерам:</b> запуск MVP за 3 минуты, получение реальных первых пользователей и сбор багов.\n` +
        `• <b>Тестерам:</b> бонусы от создателей продуктов за качественные отзывы и поиск багов.\n` +
        `• <b>Инвесторам:</b> радар ранних перспективных проектов региона с прямыми контактами фаундеров.\n\n` +
        `<b>Ваш код для входа на сайте:</b>\n` +
        `<code>${code}</code>\n` +
        `<i>(код действителен 15 минут)</i>\n\n` +
        `<b>Как войти:</b>\n` +
        `1. Нажмите кнопку <b>«Войти на BoshlaUp»</b> ниже.\n` +
        `2. В окне входа введите 6-значный код: <code>${code}</code>.\n\n` +
        `После входа ваш Telegram будет привязан, и вы начнете получать уведомления о фидбеке!`;
    }

    const result = await sendMessage(chatId, replyText, inlineKeyboard);
    if (result && result.ok) {
      console.log(`[Bot SUCCESS] Sent login code ${code} to ${username || firstName} (ID: ${telegramId})`);
    } else {
      console.error(`[Bot FAIL] Could not deliver message to ${chatId}`);
    }
  } catch (err) {
    console.error('[Bot Database Error]:', err);
  }
}

async function pollUpdates() {
  try {
    const res = await fetch(`${API_URL}/getUpdates?offset=${offset}&timeout=25`);
    const data = await res.json();

    if (data.ok && Array.isArray(data.result)) {
      for (const update of data.result) {
        offset = update.update_id + 1;
        if (update.message) {
          await handleMessage(update.message);
        }
      }
    }
  } catch (err) {
    console.error('[Poll Error]:', err.message);
    await new Promise((r) => setTimeout(r, 3000));
  }

  // Continue polling
  setImmediate(pollUpdates);
}

console.log('🤖 BoshlaUp Telegram Bot daemon started...');
pollUpdates();
