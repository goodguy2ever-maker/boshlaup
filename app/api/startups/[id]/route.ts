import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const startup = await prisma.startup.findUnique({
      where: { id: params.id },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
        },
        changelogs: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!startup) {
      return NextResponse.json({ error: 'Стартап не найден' }, { status: 404 });
    }

    return NextResponse.json(startup);
  } catch (error) {
    console.error('Error fetching startup:', error);
    return NextResponse.json({ error: 'Failed to fetch startup' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { stage, founderNeed, tagline, name } = body;

    const updated = await prisma.startup.update({
      where: { id: params.id },
      data: {
        ...(stage ? { stage } : {}),
        ...(founderNeed ? { founderNeed } : {}),
        ...(tagline ? { tagline } : {}),
        ...(name ? { name } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating startup:', error);
    return NextResponse.json({ error: 'Failed to update startup' }, { status: 500 });
  }
}
