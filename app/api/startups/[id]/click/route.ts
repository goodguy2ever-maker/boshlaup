import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const clientIp = getClientIp(request);

    // Rate limit: max 20 clicks per minute per IP for a given startup
    const rateCheck = checkRateLimit(`click_${id}_${clientIp}`, {
      intervalMs: 60_000,
      max: 20,
    });

    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const updated = await prisma.startup.update({
      where: { id },
      data: {
        websiteClicks: { increment: 1 },
      },
      select: {
        id: true,
        name: true,
        websiteClicks: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
