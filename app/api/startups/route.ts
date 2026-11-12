import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { broadcastStartupToChannel } from '@/lib/telegram';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { sanitizeText, sanitizeUrl } from '@/lib/sanitize';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const tab = searchParams.get('tab') || 'topDay';
    const category = searchParams.get('category') || '';
    const stage = searchParams.get('stage') || '';
    const founderNeed = searchParams.get('founderNeed') || '';
    const hasTesterBonus = searchParams.get('hasTesterBonus');

    const where: any = {};

    if (hasTesterBonus === 'true') {
      where.hasTesterBonus = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { tagline: { contains: search } },
        { description: { contains: search } },
        { problem: { contains: search } },
        { solution: { contains: search } },
      ];
    }

    if (category && category !== 'Все' && category !== 'All' && category !== 'Barchasi') {
      where.category = category;
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
    const cleanWebsiteUrl = sanitizeUrl(websiteUrl);
    const cleanCategory = sanitizeText(category, 50);

    if (!cleanName || !cleanTagline || !cleanWebsiteUrl || !cleanCategory) {
      return NextResponse.json(
        { error: 'Заполните корректно обязательные поля: название, слоган, ссылку и категорию' },
        { status: 400 }
      );
    }

    const newStartup = await prisma.startup.create({
      data: {
        name: cleanName,
        tagline: cleanTagline.slice(0, 80),
        description: sanitizeText(description || tagline, 5000),
        problem: problem ? sanitizeText(problem, 2000) : null,
        solution: solution ? sanitizeText(solution, 2000) : null,
        targetAudience: targetAudience ? sanitizeText(targetAudience, 1000) : null,
        websiteUrl: cleanWebsiteUrl,
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

    // Broadcast to Telegram channel
    broadcastStartupToChannel(newStartup).catch(() => {});

    return NextResponse.json(newStartup, { status: 201 });
  } catch (error) {
    console.error('Error creating startup:', error);
    return NextResponse.json({ error: 'Failed to create startup' }, { status: 500 });
  }
}
