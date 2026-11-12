import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Demo code generation is disabled in production' }, { status: 403 });
}
