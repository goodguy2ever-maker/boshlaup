import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`upvote_${params.id}_${clientIp}`, {
      intervalMs: 30_000,
      max: 10,
    });

    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many upvote requests' }, { status: 429 });
    }

    let action = 'upvote';
    try {
      const body = await request.json();
      if (body && body.action) {
        action = body.action;
      }
    } catch {
      // no body passed, defaults to upvote
    }

    const startup = await prisma.startup.findUnique({
      where: { id: params.id },
      select: { upvotes: true },
    });

    if (!startup) {
      return NextResponse.json({ error: 'Startup not found' }, { status: 404 });
    }

    let newUpvotes = startup.upvotes;
    if (action === 'unvote' || action === 'downvote') {
      newUpvotes = Math.max(0, startup.upvotes - 1);
    } else {
      newUpvotes = startup.upvotes + 1;
    }

    const updated = await prisma.startup.update({
      where: { id: params.id },
      data: {
        upvotes: newUpvotes,
      },
      select: {
        id: true,
        upvotes: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error upvoting startup:', error);
    return NextResponse.json({ error: 'Failed to upvote' }, { status: 500 });
  }
}
