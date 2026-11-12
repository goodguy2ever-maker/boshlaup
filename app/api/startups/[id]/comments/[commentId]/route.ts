import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    const updated = await prisma.startupComment.update({
      where: { id: params.commentId },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating comment status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
