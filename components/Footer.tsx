import Link from 'next/link';
import { Rocket, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white py-12 text-slate-500 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col">
          <img
            src="/logo.svg"
            alt="BoshlaUp"
            className="h-6 w-auto object-contain mb-1"
          />
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
            IDEA LAUNCHPAD
          </p>
        </div>

        <div className="flex items-center gap-5 sm:gap-6 text-xs text-slate-600 font-semibold flex-wrap">
          <Link href="/" className="hover:text-[#FF5A1F] transition-colors">Каталог</Link>
          <Link href="/community" className="hover:text-[#FF5A1F] transition-colors">Сообщество</Link>
          <Link href="/submit" className="hover:text-[#FF5A1F] transition-colors">Опубликовать проект</Link>
          <Link href="/terms" className="hover:text-[#FF5A1F] transition-colors">Оферта</Link>
          <Link href="/privacy" className="hover:text-[#FF5A1F] transition-colors">Конфиденциальность</Link>
          <a
            href="https://t.me/boshlaup_project"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF5A1F] hover:underline transition-colors font-bold"
          >
            Telegram-канал
          </a>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
          <span>Сделано для смелых фаундеров и тестеров</span>
          <Heart className="w-3.5 h-3.5 text-[#FF5A1F] fill-[#FF5A1F] mx-0.5 inline" />
        </div>
      </div>
    </footer>
  );
}
