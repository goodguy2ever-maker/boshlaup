import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalStartups, totalUsers, totalComments, totalReviews] = await Promise.all([
      prisma.startup.count(),
      prisma.userAccount.count(),
      prisma.startupComment.count(),
      prisma.review.count(),
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
