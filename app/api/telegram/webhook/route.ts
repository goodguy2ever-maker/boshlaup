import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TELEGRAM_BOT_TOKEN, broadcastStartupToChannel } from '@/lib/telegram';

const API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const APP_URL = 'https://boshlaup.uz';

async function sendTelegramMessage(chatId: string | number, text: string, replyMarkup?: any) {
  try {
    const payload: any = {
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
    return await res.json();
  } catch (err: any) {
    console.error('Failed to send message via Webhook:', err.message);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    // Optional: verify Telegram secret token header if set
    const secretToken = request.headers.get('x-telegram-bot-api-secret-token');
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (expectedSecret && secretToken !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const update = await request.json();

    // 1. Detect channel actions (when bot is added to channel or message is posted in channel)
    const channelPost = update?.channel_post;
    const myChatMember = update?.my_chat_member;
    const targetChat = channelPost?.chat || myChatMember?.chat;

    if (targetChat && (targetChat.type === 'channel' || targetChat.type === 'supergroup')) {
      const channelId = String(targetChat.id);
      console.log('Detected Telegram Channel ID:', channelId, targetChat.title, targetChat.username);

      await prisma.userAccount.upsert({
        where: { telegramId: 'TELEGRAM_CHANNEL' },
        update: {
          username: targetChat.username ? `@${targetChat.username}` : channelId,
          firstName: targetChat.title || 'Channel',
          role: channelId,
        },
        create: {
          telegramId: 'TELEGRAM_CHANNEL',
          username: targetChat.username ? `@${targetChat.username}` : channelId,
          firstName: targetChat.title || 'Channel',
          role: channelId,
        },
      }).catch(() => {});

      // Immediately broadcast latest startup to this channel
      const latest = await prisma.startup.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
      if (latest) {
        await broadcastStartupToChannel(latest);
      }

      return NextResponse.json({ ok: true, channelId });
    }

    const msg = update?.message;

    if (!msg || !msg.from || !msg.chat) {
      return NextResponse.json({ ok: true });
    }

    const chatId = msg.chat.id;
    const telegramId = String(msg.from.id);
    const username = msg.from.username ? `@${msg.from.username}` : '';
    const firstName = msg.from.first_name || 'Фаундер';

    // Parallelize code check and user lookup to cut DB latency in half
    const [existingCode, existingUser] = await Promise.all([
      prisma.telegramAuthCode.findFirst({
        where: {
          telegramId,
          used: false,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.userAccount.findUnique({
        where: { telegramId },
      }),
    ]);

    let code: string;

    if (existingCode && Date.now() - new Date(existingCode.createdAt).getTime() < 5 * 60 * 1000) {
      code = existingCode.code;
    } else {
      code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

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

    const inlineKeyboard = {
      inline_keyboard: [
        [{ text: "BoshlaUp ga kirish ➔", url: APP_URL }],
        [
          { text: "Loyiha qo'shish 🚀", url: `${APP_URL}/submit` },
          { text: "Loyihalar katalogi 📂", url: APP_URL },
        ],
      ],
    };

    let replyText: string;

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

    await sendTelegramMessage(chatId, replyText, inlineKeyboard);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error handling Telegram webhook:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
