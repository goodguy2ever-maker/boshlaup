import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getClientIp, checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { path = '/', sessionId } = body;

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const ip = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || '';
    const cleanPath = String(path).slice(0, 200);
    const cleanSessionId = String(sessionId).slice(0, 100);

    const now = new Date();

    // 1. Update or create real-time active session
    await prisma.activeSession.upsert({
      where: { sessionId: cleanSessionId },
      update: {
        lastSeen: now,
        path: cleanPath,
        ip,
      },
      create: {
        sessionId: cleanSessionId,
        lastSeen: now,
        path: cleanPath,
        ip,
      },
    }).catch(() => {});

    // 2. Record visit (throttle to max 1 visit record per session per 30 seconds to prevent spam/refresh loops)
    const rateCheck = checkRateLimit(`visit_${cleanSessionId}`, {
      intervalMs: 30_000,
      max: 1,
    });

    if (rateCheck.success) {
      await prisma.siteVisit.create({
        data: {
          path: cleanPath,
          sessionId: cleanSessionId,
          ip,
          userAgent: userAgent.slice(0, 250),
          createdAt: now,
        },
      }).catch(() => {});

      // If viewing a startup detail page, also increment viewsCount on that startup
      const startupMatch = cleanPath.match(/\/startups\/([a-zA-Z0-9_-]+)/);
      if (startupMatch && startupMatch[1]) {
        await prisma.startup.update({
          where: { id: startupMatch[1] },
          data: { viewsCount: { increment: 1 } },
        }).catch(() => {});
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
