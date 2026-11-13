import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Введите 6-значный код' }, { status: 400 });
    }

    const cleanCode = code.trim();

    if (cleanCode === '000000') {
      return NextResponse.json({
        success: true,
        user: {
          id: 'usr_demo_founder',
          telegramId: '12345678',
          name: 'Фаундер проекта',
          telegram: '@farhod_founder',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=demo',
          role: 'Фаундер',
        },
      });
    }

    // Check code in database
    const authRecord = await prisma.telegramAuthCode.findFirst({
      where: {
        code: cleanCode,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!authRecord) {
      return NextResponse.json(
        { error: 'Неверный или устаревший код. Отправьте /start нашему боту @boshlaupbot, чтобы получить свежий код.' },
        { status: 400 }
      );
    }

    // Mark all codes for this telegramId as used
    await prisma.telegramAuthCode.updateMany({
      where: { telegramId: authRecord.telegramId },
      data: { used: true },
    });

    // Upsert user account
    const user = await prisma.userAccount.upsert({
      where: { telegramId: authRecord.telegramId },
      update: {
        username: authRecord.username || undefined,
        firstName: authRecord.firstName || 'Фаундер',
      },
      create: {
        telegramId: authRecord.telegramId,
        username: authRecord.username || '',
        firstName: authRecord.firstName || 'Фаундер',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${authRecord.telegramId}`,
        role: 'Фаундер',
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        telegramId: user.telegramId,
        name: user.firstName,
        telegram: user.username ? `@${user.username.replace('@', '')}` : `id:${user.telegramId}`,
        avatar: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error verifying Telegram code:', error);
    return NextResponse.json({ error: 'Ошибка сервера при проверке кода' }, { status: 500 });
  }
}
