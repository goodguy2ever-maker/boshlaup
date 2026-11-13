const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const startups = await prisma.startup.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, createdAt: true, telegramContact: true }
  });
  console.log('All startups in DB:');
  console.log(JSON.stringify(startups, null, 2));
}

main().finally(() => prisma.$disconnect());
