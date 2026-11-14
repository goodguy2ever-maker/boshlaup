import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [totalUsers, totalAuthCodes, totalComments, totalReviews] = await Promise.all([
      prisma.userAccount.count().catch(() => 0),
      prisma.telegramAuthCode.count().catch(() => 0),
      prisma.startupComment.count().catch(() => 0),
      prisma.review.count().catch(() => 0),
    ]);

    const startups = await prisma.startup.findMany({
      where: { isActive: true },
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
        isActive: true,
        featured: true,
        createdAt: true,
      },
    }).catch(() => []);

    let totalClicks = 0;
    let totalUpvotes = 0;
    for (const s of startups) {
      totalClicks += (s as any).websiteClicks || 0;
      totalUpvotes += (s as any).upvotes || 0;
    }

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
    }).catch(() => []);

    // Real-time active users & traffic analytics
    const now = new Date();
    const threeMinAgo = new Date(Date.now() - 3 * 60 * 1000);
    // Start of today in Tashkent timezone (UTC+5)
    const tashkentOffsetMs = 5 * 60 * 60 * 1000;
    const tashkentNow = new Date(now.getTime() + tashkentOffsetMs);
    const todayStartUtc = new Date(Date.UTC(tashkentNow.getUTCFullYear(), tashkentNow.getUTCMonth(), tashkentNow.getUTCDate()) - tashkentOffsetMs);
    const sevenDaysAgo = new Date(todayStartUtc.getTime() - 6 * 24 * 60 * 60 * 1000);

    const [
      onlineUsers,
      totalVisits,
      todayVisitsList,
      recentVisits,
    ] = await Promise.all([
      prisma.activeSession.count({
        where: { lastSeen: { gte: threeMinAgo } },
      }).catch(() => 0),
      prisma.siteVisit.count().catch(() => 0),
      prisma.siteVisit.findMany({
        where: { createdAt: { gte: todayStartUtc } },
        select: { sessionId: true, path: true },
      }).catch(() => []),
      prisma.siteVisit.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true },
      }).catch(() => []),
    ]);

    const visitsToday = todayVisitsList.length;
    const uniqueVisitorsToday = new Set(todayVisitsList.map(v => v.sessionId).filter(Boolean)).size;

    // Group visits by day for last 7 days
    const daysMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStartUtc.getTime() - i * 24 * 60 * 60 * 1000 + tashkentOffsetMs);
      const key = `${d.getUTCDate()} ${['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'][d.getUTCMonth()]}`;
      daysMap[key] = 0;
    }

    recentVisits.forEach(v => {
      const d = new Date(v.createdAt.getTime() + tashkentOffsetMs);
      const key = `${d.getUTCDate()} ${['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'][d.getUTCMonth()]}`;
      if (daysMap[key] !== undefined) {
        daysMap[key]++;
      }
    });

    const dailyTraffic = Object.entries(daysMap).map(([date, visits]) => ({
      date,
      visits,
    }));

    // Top paths visited today
    const pathCountMap: Record<string, number> = {};
    todayVisitsList.forEach(v => {
      const p = v.path || '/';
      pathCountMap[p] = (pathCountMap[p] || 0) + 1;
    });
    const topPagesToday = Object.entries(pathCountMap)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      totalUsers,
      totalAuthCodes,
      totalStartups: startups.length,
      totalClicks,
      totalUpvotes,
      totalFeedback: totalComments + totalReviews,
      onlineUsers,
      visitsToday,
      uniqueVisitorsToday,
      totalVisits,
      dailyTraffic,
      topPagesToday,
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
    return NextResponse.json({
      totalUsers: 0,
      totalAuthCodes: 0,
      totalStartups: 0,
      totalClicks: 0,
      totalUpvotes: 0,
      totalFeedback: 0,
      stages: [],
      regions: [],
      categories: [],
      topByClicks: [],
      topByUpvotes: [],
      topByFeedback: [],
      startups: [],
      recentUsers: [],
      error: error.message,
    });
  }
}
