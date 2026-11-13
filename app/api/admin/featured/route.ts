import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { startupId, featured } = await request.json();

    if (!startupId) {
      return NextResponse.json({ error: 'Не указан startupId' }, { status: 400 });
    }

    // If making this startup featured, un-feature others so there's one primary featured
    if (featured) {
      await prisma.startup.updateMany({
        where: { featured: true },
        data: { featured: false },
      });
    }

    const updated = await prisma.startup.update({
      where: { id: startupId },
      data: { featured: Boolean(featured) },
    });

    return NextResponse.json({ success: true, startup: updated });
  } catch (error) {
    console.error('Error toggling featured:', error);
    return NextResponse.json({ error: 'Ошибка обновления статуса' }, { status: 500 });
  }
}
