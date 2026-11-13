import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boshlaup.uz';

  // Base platform routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  try {
    // Dynamic startup routes
    const startups = await prisma.startup.findMany({
      where: { isActive: true },
      select: {
        id: true,
        updatedAt: true,
      },
    });

    const startupUrls: MetadataRoute.Sitemap = startups.map((s) => ({
      url: `${siteUrl}/startups/${s.id}`,
      lastModified: s.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    return [...routes, ...startupUrls];
  } catch (error) {
    console.error('Failed to generate dynamic sitemap:', error);
    return routes;
  }
}
