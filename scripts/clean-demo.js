const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDemoData() {
  const mode = process.argv[2] || '--all';

  console.log(`🧹 Cleaning database (Mode: ${mode})...`);

  try {
    if (mode === '--all') {
      console.log('Removing all startups, comments, changelogs, reviews, community posts...');
      await prisma.startupComment.deleteMany({});
      await prisma.changelog.deleteMany({});
      await prisma.review.deleteMany({});
      await prisma.startup.deleteMany({});
      await prisma.postComment.deleteMany({});
      await prisma.post.deleteMany({});
      await prisma.telegramAuthCode.deleteMany({});
      await prisma.userAccount.deleteMany({
        where: {
          telegramId: { not: '5463769569' }, // Preserve Admin
        },
      });
      console.log('✅ Database fully wiped. Admin account preserved.');
    } else {
      // Remove only test / junk startups created during testing
      const testNames = ['пщщф', 'вапмр', 'SuperApp', 'test', 'Test'];
      const deleted = await prisma.startup.deleteMany({
        where: {
          OR: [
            { name: { in: testNames } },
            { name: { contains: 'тест' } },
            { name: { contains: 'test' } },
          ],
        },
      });
      console.log(`✅ Removed ${deleted.count} test/junk startups.`);
    }

    // Verify Admin user exists and has ADMIN role
    const admin = await prisma.userAccount.upsert({
      where: { telegramId: '5463769569' },
      update: { role: 'ADMIN', username: '@nazarov_df' },
      create: {
        telegramId: '5463769569',
        username: '@nazarov_df',
        firstName: 'Nazarov',
        role: 'ADMIN',
      },
    });
    console.log(`🛡️ Admin account confirmed: ${admin.username} (ID: ${admin.telegramId}, Role: ${admin.role})`);
  } catch (error) {
    console.error('Error during database cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDemoData();
