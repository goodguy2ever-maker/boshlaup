import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';

    const where: any = {};
    if (category && category !== 'Все') {
      where.category = category;
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, category, author } = body;

    if (!title || !content || !author) {
      return NextResponse.json(
        { error: 'Заголовок, текст и автор обязательны' },
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        category: category || 'General',
        author,
        upvotes: 1,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
