'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { t } = useApp();
  const f = t.footer || {
    catalog: 'Каталог',
    community: 'Сообщество',
    addProject: 'Опубликовать проект',
    channel: 'Telegram-канал',
    terms: 'Оферта',
    termsFull: 'Публичная оферта',
    privacy: 'Конфиденциальность',
    privacyFull: 'Политика конфиденциальности',
    tagline: 'Сделано для смелых фаундеров и тестеров',
  };

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white py-10 text-slate-500 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="/logo.svg"
            alt="BoshlaUp"
            className="h-6 w-auto object-contain mb-1"
          />
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
            IDEA LAUNCHPAD
          </p>
        </div>

        {/* Navigation & Legal Links */}
        <div className="flex flex-col items-center md:items-center gap-2">
          {/* Main Navigation Row */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-700 font-bold flex-wrap justify-center">
            <Link href="/" className="hover:text-[#FF5A1F] transition-colors">
              {f.catalog}
            </Link>
            <Link href="/community" className="hover:text-[#FF5A1F] transition-colors">
              {f.community}
            </Link>
            <Link href="/submit" className="hover:text-[#FF5A1F] transition-colors">
              {f.addProject}
            </Link>
            <a
              href="https://t.me/boshlaup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF5A1F] hover:underline transition-colors font-extrabold flex items-center gap-1"
            >
              <span>{f.channel}</span>
            </a>
          </div>

          {/* Legal Links Sub-Row (strictly underneath) */}
          <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-medium">
            <Link
              href="/terms"
              className="hover:text-slate-700 hover:underline transition-colors"
            >
              {f.termsFull}
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/privacy"
              className="hover:text-slate-700 hover:underline transition-colors"
            >
              {f.privacyFull}
            </Link>
          </div>
        </div>

        {/* Tagline */}
        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium text-center md:text-right">
          <span>{f.tagline}</span>
          <Heart className="w-3.5 h-3.5 text-[#FF5A1F] fill-[#FF5A1F] mx-0.5 inline shrink-0" />
        </div>
      </div>
    </footer>
  );
}
