import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalUsers, totalAuthCodes, totalComments, totalReviews] = await Promise.all([
      prisma.userAccount.count(),
      prisma.telegramAuthCode.count(),
      prisma.startupComment.count(),
      prisma.review.count(),
    ]);

    const startups = await prisma.startup.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        tagline: true,
        category: true,
        region: true,
        stage: true,
        websiteUrl: true,
        logoUrl: true,
        upvotes: true,
        websiteClicks: true,
        commentCount: true,
        reviewCount: true,
        founderName: true,
        telegramContact: true,
        createdAt: true,
      },
    });

    const totalClicks = startups.reduce((acc, s) => acc + (s.websiteClicks || 0), 0);
    const totalUpvotes = startups.reduce((acc, s) => acc + (s.upvotes || 0), 0);

    // Group by stage
    const stageMap: Record<string, number> = {};
    startups.forEach((s) => {
      const stg = s.stage || 'MVP / Прототип';
      stageMap[stg] = (stageMap[stg] || 0) + 1;
    });
    const stages = Object.entries(stageMap).map(([name, count]) => ({
      name,
      count,
      percentage: startups.length ? Math.round((count / startups.length) * 100) : 0,
    })).sort((a, b) => b.count - a.count);

    // Group by region
    const regionMap: Record<string, number> = {};
    startups.forEach((s) => {
      const reg = s.region || 'Ташкент';
      regionMap[reg] = (regionMap[reg] || 0) + 1;
    });
    const regions = Object.entries(regionMap).map(([name, count]) => ({
      name,
      count,
      percentage: startups.length ? Math.round((count / startups.length) * 100) : 0,
    })).sort((a, b) => b.count - a.count);

    // Group by category
    const catMap: Record<string, number> = {};
    startups.forEach((s) => {
      const cat = s.category || 'AI';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const categories = Object.entries(catMap).map(([name, count]) => ({
      name,
      count,
      percentage: startups.length ? Math.round((count / startups.length) * 100) : 0,
    })).sort((a, b) => b.count - a.count);

    // Leaderboards
    const topByClicks = [...startups].sort((a, b) => (b.websiteClicks || 0) - (a.websiteClicks || 0)).slice(0, 5);
    const topByUpvotes = [...startups].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);
    const topByFeedback = [...startups].sort((a, b) => ((b.commentCount || 0) + (b.reviewCount || 0)) - ((a.commentCount || 0) + (a.reviewCount || 0))).slice(0, 5);

    // Recent registered users
    const recentUsers = await prisma.userAccount.findMany({
      take: 12,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        telegramId: true,
        username: true,
        firstName: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      totalUsers,
      totalAuthCodes,
      totalStartups: startups.length,
      totalClicks,
      totalUpvotes,
      totalFeedback: totalComments + totalReviews,
      stages,
      regions,
      categories,
      topByClicks,
      topByUpvotes,
      topByFeedback,
      startups,
      recentUsers,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
