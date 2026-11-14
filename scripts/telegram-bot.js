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
        [{ text: "BoshlaUp ga kirish ➔", url: SITE_URL }],
        [
          { text: "Loyiha qo'shish 🚀", url: `${SITE_URL}/submit` },
          { text: "Loyihalar katalogi 📂", url: SITE_URL }
        ]
      ]
    };

    if (existingUser) {
      replyText = 
        `👋 <b>BoshlaUp ga xush kelibsiz, ${existingUser.firstName || firstName}!</b>\n\n` +
        `Sizning profilingiz: <b>${username || existingUser.username || existingUser.firstName}</b>\n` +
        `Maqom: <b>${existingUser.role || 'Asoschi / Tester'}</b>\n\n` +
        `🔐 <b>Saytga kirish kodingiz:</b>\n` +
        `<code>${code}</code>\n` +
        `<i>(ushbu kod 15 daqiqa davomida amal qiladi)</i>\n\n` +
        `<i>Бот faol: startaplaringiz bo'yicha bildirishnomalar, fikrlar va yangiliklar shu yerga keladi.</i>`;
    } else {
      replyText = 
        `🚀 <b>Assalomu alaykum, ${firstName}!</b>\n\n` +
        `<b>BoshlaUp</b> — O'zbekistondagi IT-startaplarni ishga tushirish, ilk foydalanuvchilar va testerlarni topish platformasiga xush kelibsiz!\n\n` +
        `<b>BoshlaUp nima beradi:</b>\n` +
        `• <b>Asoschilar uchun:</b> MVP'ni 3 daqiqada taqdim etish, ilk foydalanuvchilar va fikr-mulohazalar to'plash.\n` +
        `• <b>Testerlar uchun:</b> yangi loyihalarni birinchilardan bo'lib sinash va asoschilardan bonuslar olish.\n` +
        `• <b>Investorlar uchun:</b> istiqbolli loyihalar va asoschilar bilan to'g'ridan-to'g'ri aloqa.\n\n` +
        `🔐 <b>Saytga kirish kodingiz:</b>\n` +
        `<code>${code}</code>\n` +
        `<i>(ushbu kod 15 daqiqa davomida amal qiladi)</i>\n\n` +
        `<b>Qanday kiriladi:</b>\n` +
        `1. Quyidagi <b>«BoshlaUp ga kirish ➔»</b> tugmasini bosing.\n` +
        `2. Saytdagi oynaga 6 xonali kodni kiriting: <code>${code}</code>\n\n` +
        `<i>Kirganingizdan so'ng Telegram profilingiz ulanadi va barcha bildirishnomalar shu botga keladi!</i>`;
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
