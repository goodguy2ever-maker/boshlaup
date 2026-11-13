'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Language } from '@/lib/i18n';
import {
  Rocket,
  Compass,
  Plus,
  ChevronDown,
  Send,
  LogOut,
  User as UserIcon,
  Check,
  Globe,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t, user, isAdmin, logout, setAuthModalOpen } = useApp();
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const langNames: Record<Language, { label: string; code: string }> = {
    ru: { label: 'Русский', code: 'RU' },
    uz: { label: "O'zbek", code: 'UZ' },
    en: { label: 'English', code: 'EN' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight leading-none">
              Boshla<span className="text-[#FF5A1F]">Up</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold text-zinc-500 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded tracking-wide">
              LAUNCHPAD
            </span>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/'
                  ? 'text-zinc-950 bg-zinc-100 font-bold'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
              }`}
            >
              {t.nav.catalog}
            </Link>
            <Link
              href="/community"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/community'
                  ? 'text-zinc-950 bg-zinc-100 font-bold'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
              }`}
            >
              Сообщество
            </Link>
          </nav>
        </div>

        {/* Right Section: Language, Add Project, Telegram Auth / User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-500" />
              <span className="uppercase text-[11px] font-bold">{lang}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 z-50 animate-in fade-in zoom-in-95">
                {(['ru', 'uz', 'en'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between hover:bg-zinc-50 transition-colors ${
                      lang === l ? 'text-[#FF5A1F] bg-orange-50/60 font-semibold' : 'text-zinc-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase w-5">{langNames[l].code}</span>
                      <span>{langNames[l].label}</span>
                    </span>
                    {lang === l && <Check className="w-3.5 h-3.5 text-[#FF5A1F]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Project CTA */}
          <button
            type="button"
            onClick={() => {
              if (!user.isLoggedIn) {
                setAuthModalOpen(true);
              } else {
                router.push('/submit');
              }
            }}
            className="flex items-center gap-1.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">{t.nav.addProject}</span>
            <span className="sm:hidden">{t.nav.addProjectShort}</span>
          </button>

          {/* Admin shortcut button if Nazarov is logged in */}
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-semibold border border-zinc-800 transition-all hover:border-[#FF5A1F]"
              title="Панель администратора"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Админка</span>
            </Link>
          )}

          {/* Telegram Auth / User Profile */}
          {user.isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-lg hover:bg-zinc-100 transition-colors border border-transparent hover:border-zinc-200"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden border border-zinc-200 bg-zinc-100">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-semibold text-zinc-900 leading-none truncate max-w-[100px]">{user.name}</span>
                  <span className="text-[10px] text-zinc-500 font-medium mt-0.5">{user.telegram || 'Telegram'}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-zinc-400 hidden xl:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                    <p className="font-bold text-xs text-zinc-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate">{user.telegram}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full px-3 py-1.5 text-left text-xs font-semibold text-[#FF5A1F] hover:bg-orange-50 flex items-center gap-2 transition-colors border-b border-zinc-100"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A1F]" />
                      <span>Панель админа</span>
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full px-3 py-1.5 text-left text-xs font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Мой профиль</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Выйти</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white transition-all active:scale-95"
            >
              <Send className="w-3 h-3 -rotate-12 text-[#FF5A1F]" />
              <span>{t.profile.loginWithTelegram}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
