import Link from 'next/link';
import { Rocket, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white py-12 text-slate-500 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col">
          <p className="font-black text-xl text-slate-900 tracking-tight leading-none">
            Boshla<span className="text-[#FF5A1F]">Up</span>
          </p>
          <p className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 mt-1">
            IDEA LAUNCHPAD
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-600 font-semibold">
          <Link href="/" className="hover:text-[#FF5A1F] transition-colors">Каталог</Link>
          <Link href="/community" className="hover:text-[#FF5A1F] transition-colors">Сообщество</Link>
          <Link href="/submit" className="hover:text-[#FF5A1F] transition-colors">Опубликовать проект</Link>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
          <span>Сделано для смелых фаундеров и тестеров</span>
          <Heart className="w-3.5 h-3.5 text-[#FF5A1F] fill-[#FF5A1F] mx-0.5 inline" />
        </div>
      </div>
    </footer>
  );
}
