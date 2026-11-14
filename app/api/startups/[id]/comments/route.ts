import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifyFounderFeedback } from '@/lib/telegram';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { author, role, tag, content } = body;

    if (!author || !content) {
      return NextResponse.json(
        { error: 'Имя и текст комментария обязательны' },
        { status: 400 }
      );
    }

    const comment = await prisma.startupComment.create({
      data: {
        startupId: params.id,
        author,
        role: role || 'Тестер',
        tag: tag || 'Идея',
        status: 'Новый',
        content,
        upvotes: 0,
      },
    });

    // Increment comment count on startup & get startup details
    const updatedStartup = await prisma.startup.update({
      where: { id: params.id },
      data: {
        commentCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        name: true,
        telegramUserId: true,
      },
    });

    // If founder has connected Telegram ID, send instant DM notification!
    if (updatedStartup.telegramUserId) {
      try {
        await notifyFounderFeedback(
          updatedStartup.telegramUserId,
          updatedStartup.name,
          tag || 'Идея',
          author,
          content,
          params.id
        );
      } catch (notifyErr) {
        console.error('Failed to notify founder on Telegram:', notifyErr);
      }
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
