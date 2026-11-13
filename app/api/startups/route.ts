import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { broadcastStartupToChannel } from '@/lib/telegram';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { sanitizeText, sanitizeUrl } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const tab = searchParams.get('tab') || 'topDay';
    const category = searchParams.get('category') || '';
    const stage = searchParams.get('stage') || '';
    const founderNeed = searchParams.get('founderNeed') || '';
    const hasTesterBonus = searchParams.get('hasTesterBonus');

    const includeInactive = searchParams.get('includeInactive') === 'true';

    const where: any = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (hasTesterBonus === 'true') {
      where.hasTesterBonus = true;
    }

    if (search && search.trim()) {
      const terms = search.trim().split(/\s+/).filter(Boolean);
      where.AND = terms.map(term => ({
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { tagline: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { problem: { contains: term, mode: 'insensitive' } },
          { solution: { contains: term, mode: 'insensitive' } },
          { founderName: { contains: term, mode: 'insensitive' } },
          { telegramContact: { contains: term, mode: 'insensitive' } },
          { category: { contains: term, mode: 'insensitive' } },
          { region: { contains: term, mode: 'insensitive' } },
          { targetAudience: { contains: term, mode: 'insensitive' } },
          { earlyUserOffer: { contains: term, mode: 'insensitive' } },
        ],
      }));
    }

    if (category && category !== 'Все' && category !== 'All' && category !== 'Barchasi') {
      if (category === 'Другое' || category === 'Other' || category === 'Boshqa') {
        where.category = {
          notIn: ['AI', 'FinTech', 'EdTech', 'E-commerce', 'SaaS', 'PropTech', 'Логистика', 'AgriTech', 'HealthTech', 'Услуги', 'Игры', 'Социальные'],
        };
      } else {
        where.category = category;
      }
    }

    if (stage && stage !== 'Все' && stage !== 'All' && stage !== 'Barchasi') {
      where.stage = stage;
    }

    if (founderNeed && founderNeed !== 'Все' && founderNeed !== 'All' && founderNeed !== 'Barchasi') {
      where.founderNeed = founderNeed;
    }

    let orderBy: any = [{ upvotes: 'desc' }, { rating: 'desc' }];
    if (tab === 'newLaunch') {
      where.firstLaunch = true;
      orderBy = { createdAt: 'desc' };
    } else if (tab === 'topWeek') {
      orderBy = [{ rating: 'desc' }, { upvotes: 'desc' }];
    } else {
      orderBy = [{ upvotes: 'desc' }, { rating: 'desc' }];
    }

    const startups = await prisma.startup.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });

    return NextResponse.json(startups);
  } catch (error) {
    console.error('Error fetching startups:', error);
    return NextResponse.json({ error: 'Failed to fetch startups' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Rate limit: max 5 startup submissions per 10 minutes per IP
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`submit_startup_${clientIp}`, {
      intervalMs: 10 * 60 * 1000,
      max: 5,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: `Слишком много запросов. Попробуйте через ${rateCheck.resetInSeconds} сек.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      name,
      tagline,
      description,
      problem,
      solution,
      targetAudience,
      websiteUrl,
      category,
      region,
      logoUrl,
      stage,
      founderNeed,
      earlyUserOffer,
      telegramContact,
      telegramUserId,
      founderName,
    } = body;

    const cleanName = sanitizeText(name, 100);
    const cleanTagline = sanitizeText(tagline, 150);
    const cleanWebsiteUrl = websiteUrl ? sanitizeUrl(websiteUrl) : null;
    const cleanCategory = sanitizeText(category, 50);

    const isIdeaStage = typeof stage === 'string' && (
      stage.toLowerCase().includes('иде') || stage.toLowerCase().includes('idea')
    );

    if (!telegramUserId) {
      return NextResponse.json(
        { error: 'Для запуска стартапа необходимо авторизоваться через Telegram' },
        { status: 401 }
      );
    }

    if (!cleanName || !cleanTagline || (!isIdeaStage && !cleanWebsiteUrl) || !cleanCategory) {
      return NextResponse.json(
        {
          error: !isIdeaStage && !cleanWebsiteUrl
            ? 'Для MVP и стартапов с продажами ссылка на сайт обязательна'
            : 'Заполните корректно обязательные поля: название, слоган и категорию'
        },
        { status: 400 }
      );
    }

    // Deduplication check: prevent multi-click duplicate creation within 60 seconds
    const existingRecent = await prisma.startup.findFirst({
      where: {
        name: { equals: cleanName, mode: 'insensitive' },
        telegramUserId: String(telegramUserId),
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000),
        },
      },
    });

    if (existingRecent) {
      return NextResponse.json(existingRecent, { status: 200 });
    }

    const newStartup = await prisma.startup.create({
      data: {
        name: cleanName,
        tagline: cleanTagline.slice(0, 80),
        description: sanitizeText(description || tagline, 5000),
        problem: problem ? sanitizeText(problem, 2000) : null,
        solution: solution ? sanitizeText(solution, 2000) : null,
        targetAudience: targetAudience ? sanitizeText(targetAudience, 1000) : null,
        websiteUrl: cleanWebsiteUrl || '',
        category: cleanCategory,
        region: sanitizeText(region || 'Ташкент', 60),
        logoUrl: logoUrl ? sanitizeText(logoUrl, 1000) : `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanName)}`,
        stage: sanitizeText(stage || 'MVP / Прототип', 60),
        founderNeed: sanitizeText(founderNeed || 'Ищу тестеров', 60),
        firstLaunch: true,
        earlyUserOffer: earlyUserOffer ? sanitizeText(earlyUserOffer, 1000) : null,
        hasTesterBonus: Boolean(earlyUserOffer),
        telegramContact: telegramContact ? sanitizeText(telegramContact, 120) : null,
        telegramUserId: telegramUserId ? sanitizeText(telegramUserId, 60) : null,
        founderName: founderName ? sanitizeText(founderName, 100) : 'Фаундер',
        upvotes: 1,
        rating: 5.0,
        commentCount: 0,
      },
    });

    // Broadcast to Telegram channel asynchronously without blocking HTTP response
    setTimeout(() => {
      broadcastStartupToChannel(newStartup).catch(() => {});
    }, 0);

    return NextResponse.json(newStartup, { status: 201 });
  } catch (error) {
    console.error('Error creating startup:', error);
    return NextResponse.json({ error: 'Failed to create startup' }, { status: 500 });
  }
}
