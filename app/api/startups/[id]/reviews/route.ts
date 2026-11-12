import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { author, role, rating, pros, cons, comment } = body;

    if (!author || !rating || !comment) {
      return NextResponse.json(
        { error: 'Имя, оценка и текст отзыва обязательны' },
        { status: 400 }
      );
    }

    const numRating = Math.max(1, Math.min(5, Number(rating)));

    // Create review
    const newReview = await prisma.review.create({
      data: {
        startupId: params.id,
        author,
        role: role || 'Пользователь',
        rating: numRating,
        pros: pros || '',
        cons: cons || '',
        comment,
      },
    });

    // Recalculate average rating and count
    const allReviews = await prisma.review.findMany({
      where: { startupId: params.id },
      select: { rating: true },
    });

    const total = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Number((total / allReviews.length).toFixed(1));

    await prisma.startup.update({
      where: { id: params.id },
      data: {
        rating: avgRating,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}
