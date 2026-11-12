import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updated = await prisma.post.update({
      where: { id: params.id },
      data: {
        upvotes: {
          increment: 1,
        },
      },
      select: {
        id: true,
        upvotes: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error upvoting post:', error);
    return NextResponse.json({ error: 'Failed to upvote' }, { status: 500 });
  }
}
