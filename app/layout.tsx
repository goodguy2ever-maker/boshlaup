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
    default: 'BoshlaUp — IDEA LAUNCHPAD | Платформа запуска стартапов в Узбекистане',
    template: '%s | BoshlaUp',
  },
  description:
    'Есть идея? Boshla. Запусти MVP, найди первых пользователей и узнай, нужен ли твой продукт рынку.',
  keywords: [
    'стартапы узбекистана',
    'стартапы ташкент',
    'boshlaup',
    'idea launchpad',
    'индихакеры узбекистан',
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
    title: 'BoshlaUp — IDEA LAUNCHPAD | Платформа запуска стартапов в Узбекистане',
    description:
      'Есть идея? Boshla. Запусти MVP, найди первых пользователей и узнай, нужен ли твой продукт рынку.',
    images: [
      {
        url: '/api/og?title=BoshlaUp&tagline=Есть%20идея%3F%20Boshla.&category=Launchpad&stage=Live&region=Узбекистан',
        width: 1200,
        height: 630,
        alt: 'BoshlaUp — IDEA LAUNCHPAD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BoshlaUp — IDEA LAUNCHPAD',
    description: 'Платформа запуска и валидации стартапов в Узбекистане.',
    images: [
      '/api/og?title=BoshlaUp&tagline=Платформа%20запуска%20стартапов&category=Launchpad&stage=Live&region=Узбекистан',
    ],
  },
  icons: {
    icon: '/logo-icon.svg',
    shortcut: '/logo-icon.svg',
    apple: '/logo.png',
  },
  other: {
    'geo.region': 'UZ',
    'geo.placename': 'Tashkent, Uzbekistan',
    'geo.position': '41.2995;69.2401',
    'ICBM': '41.2995, 69.2401',
    'DC.coverage': 'Uzbekistan',
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
      'Платформа запуска, тестирования и продвижения ранних стартапов Узбекистана.',
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
      <body className="min-h-screen flex flex-col antialiased bg-[#FAFAFA] text-[#18181B] selection:bg-[#FF5A1F]/20 selection:text-[#FF5A1F] relative overflow-x-hidden">
        {/* Ambient Floating Glow Lights (Плавающие сияния) */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 sm:w-[500px] h-96 sm:h-[500px] rounded-full bg-gradient-to-br from-[#FF5A1F]/20 via-orange-400/15 to-transparent blur-[120px] animate-float-slow" />
          <div className="absolute top-1/3 -right-32 w-96 sm:w-[550px] h-96 sm:h-[550px] rounded-full bg-gradient-to-bl from-amber-400/20 via-[#FF5A1F]/15 to-transparent blur-[130px] animate-float-reverse" />
          <div className="absolute -bottom-32 left-1/4 w-96 sm:w-[600px] h-96 sm:h-[600px] rounded-full bg-gradient-to-tr from-orange-500/15 via-[#FF5A1F]/15 to-transparent blur-[140px] animate-float-slow" />
        </div>
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
