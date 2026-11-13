const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.startup.delete({
    where: { id: 'cmweyiq2n0001zw22dvdhud13' }
  });
  console.log('Deleted duplicate startup:', deleted.id, deleted.name);
}

main().finally(() => prisma.$disconnect());
