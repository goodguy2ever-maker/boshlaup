import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TelegramAuthModal from '@/components/TelegramAuthModal';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://boshlaup.uz';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'BoshlaUp — IDEA LAUNCHPAD | Платформа запуска стартапов Центральной Азии',
    template: '%s | BoshlaUp',
  },
  description:
    'Платформа №1 в Центральной Азии и Узбекистане для запуска, тестирования и продвижения стартапов. Презентуйте продукт, собирайте обратную связь и находите первых пользователей.',
  keywords: [
    'стартапы узбекистана',
    'стартапы ташкент',
    'boshlaup',
    'idea launchpad',
    'индихакеры узбекистан',
    'стартапы центральная азия',
    'it стартапы',
    'ранний доступ mvp',
    'тестирование стартапов',
    'продукты узбекистан',
    'product hunt uzbekistan',
    'y combinator tashkent',
  ],
  authors: [{ name: 'BoshlaUp Team', url: APP_URL }],
  creator: 'BoshlaUp',
  publisher: 'BoshlaUp',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: APP_URL,
    siteName: 'BoshlaUp — IDEA LAUNCHPAD',
    title: 'BoshlaUp — IDEA LAUNCHPAD | Платформа запуска стартапов Центральной Азии',
    description:
      'Платформа №1 в Центральной Азии и Узбекистане для запуска, тестирования и продвижения стартапов.',
    images: [
      {
        url: '/api/og?title=BoshlaUp&tagline=Платформа%20запуска%20стартапов%20Центральной%20Азии&category=Launchpad&stage=Live&region=Узбекистан',
        width: 1200,
        height: 630,
        alt: 'BoshlaUp — IDEA LAUNCHPAD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BoshlaUp — IDEA LAUNCHPAD',
    description: 'Платформа запуска и валидации стартапов Центральной Азии.',
    images: [
      '/api/og?title=BoshlaUp&tagline=Платформа%20запуска%20стартапов%20Центральной%20Азии&category=Launchpad&stage=Live&region=Узбекистан',
    ],
  },
  other: {
    'geo.region': 'UZ',
    'geo.placename': 'Tashkent, Uzbekistan',
    'geo.position': '41.2995;69.2401',
    'ICBM': '41.2995, 69.2401',
    'DC.coverage': 'Uzbekistan, Central Asia',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaOrgSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BoshlaUp',
    alternateName: 'BoshlaUp — IDEA LAUNCHPAD',
    url: APP_URL,
    description:
      'Платформа запуска, тестирования и продвижения ранних стартапов Узбекистана и Центральной Азии.',
    inLanguage: 'ru-RU',
    publisher: {
      '@type': 'Organization',
      name: 'BoshlaUp',
      url: APP_URL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Tashkent',
        addressCountry: 'UZ',
      },
    },
  };

  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgSite) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[#FAFAFA] text-[#18181B] selection:bg-[#FF5A1F]/20 selection:text-[#FF5A1F]">
        <AppProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <TelegramAuthModal />
        </AppProvider>
      </body>
    </html>
  );
}
