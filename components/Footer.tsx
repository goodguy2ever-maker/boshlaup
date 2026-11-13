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
        <div className="flex flex-col items-center md:items-start shrink-0">
          <img
            src="/logo.svg"
            alt="BoshlaUp"
            className="h-6 w-auto object-contain mb-1"
          />
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
            IDEA LAUNCHPAD
          </p>
        </div>

        {/* Navigation & Legal Links (Locked to exactly 2 neat rows, never wraps to 3) */}
        <div className="flex flex-col items-center justify-center gap-2">
          {/* Main Navigation Row - Strictly 1 Line */}
          <div className="flex items-center gap-3 sm:gap-5 md:gap-6 text-[11px] sm:text-xs text-slate-700 font-bold flex-nowrap whitespace-nowrap justify-center">
            <Link href="/" className="hover:text-[#FF5A1F] transition-colors shrink-0">
              {f.catalog}
            </Link>
            <Link href="/community" className="hover:text-[#FF5A1F] transition-colors shrink-0">
              {f.community}
            </Link>
            <Link href="/submit" className="hover:text-[#FF5A1F] transition-colors shrink-0">
              {f.addProject}
            </Link>
            <a
              href="https://t.me/boshlaup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF5A1F] hover:underline transition-colors font-extrabold shrink-0"
            >
              {f.channel}
            </a>
          </div>

          {/* Legal Sub-Row - Strictly 1 Line below */}
          <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] text-slate-400 font-medium flex-nowrap whitespace-nowrap justify-center">
            <Link
              href="/terms"
              className="hover:text-slate-700 hover:underline transition-colors shrink-0"
            >
              {f.termsFull}
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/privacy"
              className="hover:text-slate-700 hover:underline transition-colors shrink-0"
            >
              {f.privacyFull}
            </Link>
          </div>
        </div>

        {/* Tagline */}
        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium text-center md:text-right shrink-0">
          <span>{f.tagline}</span>
          <Heart className="w-3.5 h-3.5 text-[#FF5A1F] fill-[#FF5A1F] mx-0.5 inline shrink-0" />
        </div>
      </div>
    </footer>
  );
}
