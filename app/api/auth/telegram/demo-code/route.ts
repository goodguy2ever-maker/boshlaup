import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.telegramAuthCode.create({
      data: {
        code,
        telegramId: "123456789",
        username: "@demo_founder",
        firstName: "Азиз (Demo)",
        expiresAt,
        used: false,
      },
    });

    return NextResponse.json({ code, expiresAt });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate demo code' }, { status: 500 });
  }
}
