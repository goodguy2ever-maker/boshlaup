import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const changelogs = await prisma.changelog.findMany({
      where: { startupId: params.id },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(changelogs);
  } catch (error) {
    console.error('Error fetching changelogs:', error);
    return NextResponse.json({ error: 'Failed to fetch changelogs' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { version, title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Укажите заголовок и описание обновления' },
        { status: 400 }
      );
    }

    const changelog = await prisma.changelog.create({
      data: {
        startupId: params.id,
        version: version?.trim() || 'Обновление',
        title: title.trim(),
        content: content.trim(),
      },
    });

    return NextResponse.json(changelog, { status: 201 });
  } catch (error) {
    console.error('Error creating changelog:', error);
    return NextResponse.json({ error: 'Failed to create changelog' }, { status: 500 });
  }
}