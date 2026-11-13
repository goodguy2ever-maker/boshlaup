import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TELEGRAM_BOT_TOKEN } from '@/lib/telegram';

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
        [{ text: 'Войти на BoshlaUp →', url: APP_URL }],
        [
          { text: 'Опубликовать стартап', url: `${APP_URL}/submit` },
          { text: 'Каталог проектов', url: APP_URL },
        ],
      ],
    };

    let replyText: string;

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

    await sendTelegramMessage(chatId, replyText, inlineKeyboard);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error handling Telegram webhook:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
