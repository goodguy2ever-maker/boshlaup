import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [totalStartups, totalUsers, totalComments, totalReviews] = await Promise.all([
      prisma.startup.count({ where: { isActive: true } }).catch(() => 0),
      prisma.userAccount.count().catch(() => 0),
      prisma.startupComment.count().catch(() => 0),
      prisma.review.count().catch(() => 0),
    ]);

    return NextResponse.json({
      totalStartups,
      totalUsers,
      totalFeedbacks: totalComments + totalReviews,
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    return NextResponse.json({
      totalStartups: 0,
      totalUsers: 0,
      totalFeedbacks: 0,
    });
  }
}
