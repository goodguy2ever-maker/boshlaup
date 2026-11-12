import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import StartupDetailClient from '@/components/StartupDetailClient';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://boshlaup.uz';

interface PageProps {
  params: {
    id: string;
  };
}

const REGION_GEO_MAP: Record<string, { placename: string; position: string; countryCode: string }> = {
  'Ташкент': { placename: 'Tashkent, Uzbekistan', position: '41.2995;69.2401', countryCode: 'UZ' },
  'Самарканд': { placename: 'Samarkand, Uzbekistan', position: '39.6270;66.9749', countryCode: 'UZ' },
  'Бухара': { placename: 'Bukhara, Uzbekistan', position: '39.7681;64.4556', countryCode: 'UZ' },
  'Фергана': { placename: 'Fergana, Uzbekistan', position: '40.3842;71.7843', countryCode: 'UZ' },
  'Андижан': { placename: 'Andijan, Uzbekistan', position: '40.7821;72.3442', countryCode: 'UZ' },
  'Наманган': { placename: 'Namangan, Uzbekistan', position: '40.9983;71.6726', countryCode: 'UZ' },
  'Узбекистан': { placename: 'Uzbekistan', position: '41.3775;64.5853', countryCode: 'UZ' },
  'Центральная Азия': { placename: 'Central Asia', position: '45.0000;65.0000', countryCode: 'Central Asia' },
  'Global': { placename: 'Global / Central Asia', position: '41.2995;69.2401', countryCode: 'UZ' },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const startup = await prisma.startup.findUnique({
      where: { id: params.id },
    });

    if (!startup) {
      return {
        title: 'Стартап не найден | BoshlaUp',
        description: 'Запрашиваемый стартап не найден на платформе BoshlaUp.',
      };
    }

    const title = `${startup.name} — ${startup.tagline} | BoshlaUp`;
    const description =
      startup.description
        ? startup.description.slice(0, 160) + (startup.description.length > 160 ? '...' : '')
        : `${startup.name} (${startup.category}) на стадии ${startup.stage}. Запуск в регионе ${startup.region}.`;

    const regionGeo = REGION_GEO_MAP[startup.region] || REGION_GEO_MAP['Ташкент'];

    const ogParams = new URLSearchParams({
      title: startup.name,
      tagline: startup.tagline || '',
      category: startup.category,
      stage: startup.stage,
      region: startup.region,
      upvotes: String(startup.upvotes || 0),
    });

    const ogImageUrl = `/api/og?${ogParams.toString()}`;

    return {
      title,
      description,
      keywords: [
        startup.name,
        startup.category,
        startup.region,
        'стартап узбекистан',
        'mvp ташкент',
        'центральная азия',
        'boshlaup',
      ],
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${APP_URL}/startups/${startup.id}`,
        siteName: 'BoshlaUp — IDEA LAUNCHPAD',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${startup.name} — BoshlaUp`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
      },
      other: {
        'geo.region': regionGeo.countryCode,
        'geo.placename': regionGeo.placename,
        'geo.position': regionGeo.position,
        'ICBM': regionGeo.position.replace(';', ', '),
      },
    };
  } catch (e) {
    return {
      title: 'Стартап | BoshlaUp',
      description: 'Платформа запуска стартапов Центральной Азии',
    };
  }
}

export default async function StartupPage({ params }: PageProps) {
  const startup = await prisma.startup.findUnique({
    where: { id: params.id },
    include: {
      comments: {
        orderBy: { createdAt: 'desc' },
      },
      changelogs: {
        orderBy: { date: 'desc' },
      },
      reviews: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!startup) {
    notFound();
  }

  // Schema.org SoftwareApplication / Organization
  const regionGeo = REGION_GEO_MAP[startup.region] || REGION_GEO_MAP['Ташкент'];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: startup.name,
    headline: startup.tagline,
    description: startup.description || startup.tagline,
    applicationCategory: startup.category,
    operatingSystem: 'Web, Mobile',
    url: startup.websiteUrl || `${APP_URL}/startups/${startup.id}`,
    image: startup.logoUrl || `${APP_URL}/api/og?title=${encodeURIComponent(startup.name)}`,
    datePublished: startup.createdAt ? new Date(startup.createdAt).toISOString() : undefined,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      ratingCount: Math.max(1, startup.upvotes),
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Person',
      name: startup.founderName || 'Фаундер',
    },
    spatialCoverage: {
      '@type': 'Place',
      name: regionGeo.placename,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: regionGeo.position.split(';')[0],
        longitude: regionGeo.position.split(';')[1],
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StartupDetailClient initialStartup={startup} />
    </>
  );
}
