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
  ShieldCheck,
  MessageSquare
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <Link href="/" className="shrink-0 flex items-center group py-1">
            <img
              src="/logo.svg"
              alt="BoshlaUp"
              className="h-6 sm:h-7.5 w-auto object-contain transition-transform group-hover:scale-[1.02] shrink-0"
            />
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs sm:text-sm font-medium shrink-0">
            <Link
              href="/"
              className={`h-10 px-3.5 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                pathname === '/'
                  ? 'text-[#FF5A1F] bg-orange-50 font-bold border border-orange-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>{t.nav.catalog}</span>
            </Link>
            <Link
              href="/community"
              className={`h-10 px-3.5 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                pathname.startsWith('/community')
                  ? 'text-[#FF5A1F] bg-orange-50 font-bold border border-orange-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>{t.nav.community || 'Сообщество'}</span>
            </Link>
          </nav>
        </div>

        {/* Right Section: Language, Add Project, Telegram Auth / User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Switcher */}
          <div className="relative shrink-0">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="h-9 sm:h-10 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 transition-colors shadow-2xs whitespace-nowrap shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="uppercase text-[11px] font-black">{lang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                {(['ru', 'uz', 'en'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      lang === l ? 'text-[#FF5A1F] bg-[#FF5A1F]/10 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase w-5">{langNames[l].code}</span>
                      <span>{langNames[l].label}</span>
                    </span>
                    {lang === l && <Check className="w-3.5 h-3.5 text-[#FF5A1F] stroke-[3]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Project CTA - Desktop only, mobile has it in Bottom Nav */}
          <button
            type="button"
            onClick={() => {
              if (!user.isLoggedIn) {
                setAuthModalOpen(true);
              } else {
                router.push('/submit');
              }
            }}
            className="hidden sm:inline-flex h-10 items-center gap-1.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white px-4 rounded-xl text-sm font-bold shadow-sm shadow-orange-500/25 hover:shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.8] shrink-0" />
            <span className="whitespace-nowrap">{t.nav.addProject}</span>
          </button>

          {/* Admin shortcut button if Nazarov is logged in */}
          {isAdmin && (
            <Link
              href="/logovo"
              className="hidden md:inline-flex items-center gap-1.5 h-10 px-3 rounded-xl bg-[#18181B] hover:bg-black text-white text-xs font-bold shadow-xs border border-slate-700 transition-all hover:border-[#FF5A1F] whitespace-nowrap shrink-0"
              title={(t.nav as any).adminLairTooltip || 'Логово администратора'}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
              <span>{(t.nav as any).adminLair || 'Логово'}</span>
            </Link>
          )}

          {/* Telegram Auth / User Profile - Desktop only, mobile has it in Bottom Nav */}
          {user.isLoggedIn ? (
            <div className="hidden sm:block relative shrink-0">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="h-10 flex items-center gap-2 px-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 shrink-0"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-2xs shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-none truncate max-w-[100px]">{user.name}</span>
                  <span className="text-[10px] text-blue-600 font-semibold mt-0.5">{user.telegram || 'Telegram'}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden xl:block shrink-0" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2 border-b border-slate-100 mb-1">
                    <p className="font-extrabold text-xs text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.telegram}</p>
                  </div>

                  {isAdmin && (
                    <Link
                      href="/logovo"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full px-3.5 py-2 text-left text-xs font-bold text-[#FF5A1F] hover:bg-orange-50 flex items-center gap-2 transition-colors border-b border-slate-100"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A1F]" />
                      <span>{(t.nav as any).adminLair || 'Логово админа'}</span>
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Мой профиль</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{lang === 'uz' ? 'Chiqish' : lang === 'en' ? 'Sign out' : 'Выйти'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="hidden sm:inline-flex h-10 items-center gap-1.5 px-3.5 rounded-xl text-xs font-bold bg-[#18181B] hover:bg-[#27272A] text-white transition-all active:scale-95 shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
              title={t.profile.loginWithTelegram}
            >
              <Send className="w-3.5 h-3.5 -rotate-12 text-[#FF5A1F] shrink-0" />
              <span className="whitespace-nowrap">{t.profile.loginWithTelegram}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
