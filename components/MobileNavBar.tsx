'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Compass, MessageSquare, Plus, Send } from 'lucide-react';

export default function MobileNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, user, setAuthModalOpen } = useApp();

  const isCatalog = pathname === '/';
  const isCommunity = pathname.startsWith('/community');
  const isProfile = pathname.startsWith('/profile');

  const labels = {
    uz: { catalog: 'Katalog', community: 'Hamjamiyat', add: "Loyiha", profile: 'Profil', login: 'Kirish' },
    ru: { catalog: 'Каталог', community: 'Сообщество', add: 'Проект', profile: 'Профиль', login: 'Войти' },
    en: { catalog: 'Catalog', community: 'Community', add: 'Project', profile: 'Profile', login: 'Sign in' },
  }[lang] || { catalog: 'Каталог', community: 'Сообщество', add: 'Проект', profile: 'Профиль', login: 'Войти' };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-3 py-1.5 flex items-center justify-around safe-area-pb">
      {/* 1. Catalog */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          isCatalog
            ? 'text-[#FF5A1F] font-bold'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <Compass className={`w-5 h-5 ${isCatalog ? 'stroke-[2.6]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">{labels.catalog}</span>
      </Link>

      {/* 2. Community */}
      <Link
        href="/community"
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          isCommunity
            ? 'text-[#FF5A1F] font-bold'
            : 'text-slate-500 hover:text-slate-900 font-medium'
        }`}
      >
        <MessageSquare className={`w-5 h-5 ${isCommunity ? 'stroke-[2.6]' : 'stroke-[1.8]'}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">{labels.community}</span>
      </Link>

      {/* 3. Central Add Project Action Button */}
      <button
        type="button"
        onClick={() => {
          if (!user.isLoggedIn) {
            setAuthModalOpen(true);
          } else {
            router.push('/submit');
          }
        }}
        className="flex flex-col items-center justify-center -mt-5 group cursor-pointer"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A1F] to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/35 group-active:scale-95 transition-transform border-2 border-white">
          <Plus className="w-6 h-6 stroke-[3]" />
        </div>
        <span className="text-[10px] font-bold text-slate-800 mt-0.5 tracking-tight">{labels.add}</span>
      </button>

      {/* 4. Profile / Telegram Auth */}
      {user.isLoggedIn ? (
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            isProfile
              ? 'text-[#FF5A1F] font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-300">
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{labels.profile}</span>
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setAuthModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
        >
          <Send className="w-5 h-5 -rotate-12 text-[#FF5A1F]" />
          <span className="text-[10px] mt-0.5 tracking-tight">{labels.login}</span>
        </button>
      )}
    </nav>
  );
}
