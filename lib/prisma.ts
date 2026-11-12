import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const fallbackUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres.dummy:dummy@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: fallbackUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
