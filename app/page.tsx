'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { FEATURES } from '@/lib/config';
import {
  Rocket,
  Sparkles,
  Briefcase,
  ArrowRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  Flame,
  CheckCircle2,
  Table as TableIcon,
  Users,
  Send
} from 'lucide-react';
import StartupCard from '@/components/StartupCard';
import FilterBar, { ViewMode } from '@/components/FilterBar';
import CompactList from '@/components/CompactList';
import InvestorTable from '@/components/InvestorTable';

export default function HomePage() {
  const { t, investorMode, toggleInvestorMode } = useApp();

  const [startups, setStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalStartups: 0, totalUsers: 0, totalFeedbacks: 0 });

  // Filters state
  const [tab, setTab] = useState('topDay');
  const [category, setCategory] = useState('Все');
  const [stage, setStage] = useState('Все');
  const [founderNeed, setFounderNeed] = useState('Все');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  // Load live database platform metrics
  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.totalStartups === 'number') {
          setStats(data);
        }
      })
      .catch((err) => console.error('Failed to load stats:', err));
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (tab) params.append('tab', tab);
        if (category && category !== 'Все') params.append('category', category);
        if (stage && stage !== 'Все') params.append('stage', stage);
        if (founderNeed && founderNeed !== 'Все') params.append('founderNeed', founderNeed);
        if (search) params.append('search', search);

        const res = await fetch(`/api/startups?${params.toString()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!ignore) setStartups(data);
        }
      } catch (err) {
        console.error('Failed to load startups:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    const timer = setTimeout(loadData, 150);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [tab, category, stage, founderNeed, search]);

  const featuredStartup = startups.find(s => s.featured) || startups[0];
  const isFiltering = search.trim() !== '' || category !== 'Все' || stage !== 'Все' || founderNeed !== 'Все';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Investor Mode Alert Bar (Feature Flagged for Phase 2) */}
      {FEATURES.ENABLE_INVESTOR_MODE && investorMode && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <p className="font-extrabold text-xs sm:text-sm">
                Режим инвестора активирован
              </p>
              <p className="text-[11px] text-emerald-700">
                Вам открыты текущие метрики (MRR, пользователи), размер запрашиваемого раунда и прямые контакты фаундеров.
              </p>
            </div>
          </div>
          <button
            onClick={toggleInvestorMode}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0"
          >
            Выключить
          </button>
        </div>
      )}

      {/* Hero Block (BoshlaUp: Dark Graphite + Coral Orange with Orange Border and Floating Glows) */}
      <section className="mb-8 rounded-3xl bg-[#18181B] p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl border-[3px] border-[#FF5A1F]/60 shadow-orange-500/15">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-gradient-to-br from-[#FF5A1F]/30 via-orange-500/20 to-transparent blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -bottom-20 -left-16 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-500/20 via-[#FF5A1F]/25 to-transparent blur-3xl pointer-events-none animate-float-reverse" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A1F]/15 text-[#FF5A1F] text-xs font-bold mb-3 border border-[#FF5A1F]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-3">
            {t.hero.title}
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base mb-6 leading-relaxed max-w-2xl font-normal">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/submit"
              className="px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all active:scale-95"
            >
              <Rocket className="w-4 h-4 stroke-[2.5]" />
              <span>Запустить свой проект</span>
            </Link>
          </div>

          {/* Quick Metrics (100% Live & Dynamic from Database) */}
          <div className="mt-6 pt-5 border-t border-slate-700/60 flex items-center gap-6 sm:gap-10 text-left">
            <div>
              <p className="text-lg sm:text-xl font-black text-white tracking-tight">
                {stats.totalStartups}
              </p>
              <p className="text-[11px] text-slate-400">Проектов в каталоге</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl font-black text-emerald-400 tracking-tight">
                {stats.totalUsers}
              </p>
              <p className="text-[11px] text-slate-400">Пользователей</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl font-black text-[#FF5A1F] tracking-tight">
                {stats.totalFeedbacks}
              </p>
              <p className="text-[11px] text-slate-400">Идей и баг-репортов</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Feed (8 cols) + Sidebar (4 cols) */}
      <div id="feed-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Startup Feed */}
        <div className="lg:col-span-8">
          <FilterBar
            tab={tab}
            setTab={setTab}
            category={category}
            setCategory={setCategory}
            stage={stage}
            setStage={setStage}
            founderNeed={founderNeed}
            setFounderNeed={setFounderNeed}
            search={search}
            setSearch={setSearch}
            resultsCount={startups.length}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          {/* Feed Content */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-3xl p-5 border border-slate-200 animate-pulse flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded-md w-1/4" />
                    <div className="h-3 bg-slate-100 rounded-md w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : startups.length === 0 ? (
            isFiltering ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Rocket className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-base mb-1">Проекты не найдены</h3>
                <p className="text-slate-500 text-xs mb-4">
                  Попробуйте изменить категорию или фильтр стадии
                </p>
                <button
                  onClick={() => {
                    setCategory('Все');
                    setStage('Все');
                    setFounderNeed('Все');
                    setSearch('');
                  }}
                  className="text-xs font-bold text-[#FF5A1F] hover:underline"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-4 text-[#FF5A1F]">
                  <Rocket className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-1">
                  Каталог готов к запуску первых стартапов
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  Будьте первым фаундером, который опубликует свой проект на BoshlaUp, займет верхнюю строчку в рейтинге и получит первых бета-тестеров!
                </p>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5A1F] hover:bg-[#E04810] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Опубликовать первый проект →</span>
                </Link>
              </div>
            )
          ) : viewMode === 'compact' ? (
            <CompactList startups={startups} />
          ) : viewMode === 'investorTable' && FEATURES.ENABLE_INVESTOR_MODE ? (
            <InvestorTable startups={startups} />
          ) : (
            <div className="space-y-3.5">
              {startups.map((startup, idx) => (
                <StartupCard
                  key={startup.id}
                  startup={startup}
                  rank={idx + 1}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Widgets / Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Featured Startup */}
          {featuredStartup && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50/60 border border-orange-200/80 rounded-3xl p-5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-orange-800 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>Проект дня в Узбекистане</span>
              </div>

              <div className="flex items-center gap-3.5 mb-3">
                <img
                  src={featuredStartup.logoUrl || ''}
                  alt={featuredStartup.name}
                  className="w-12 h-12 rounded-xl object-cover border border-orange-200 bg-white"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 leading-tight">
                    {featuredStartup.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{featuredStartup.region} • {featuredStartup.category}</span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed font-normal">
                {featuredStartup.tagline}
              </p>

              {featuredStartup.earlyUserOffer && (
                <div className="mb-4 p-2.5 rounded-xl bg-white/80 border border-orange-200 text-xs text-orange-950 flex items-start gap-2">
                  <span className="line-clamp-2 text-[11px] font-medium">{featuredStartup.earlyUserOffer}</span>
                </div>
              )}

              <Link
                href={`/startups/${featuredStartup.id}`}
                className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 border border-orange-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <span>Подробнее о проекте</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FF5A1F]" />
              </Link>
            </div>
          )}

          {/* Founder Community Callout with Orange Border and Floating Glow */}
          <div className="bg-[#18181B] text-white rounded-3xl p-5 shadow-xl shadow-orange-500/15 border-[3px] border-[#FF5A1F]/60 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br from-[#FF5A1F]/30 via-orange-400/20 to-transparent blur-2xl pointer-events-none animate-pulse-glow" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-4 h-4 text-[#FF5A1F]" />
                <h3 className="font-extrabold text-white text-sm">
                  Создаете свой стартап?
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4 font-normal">
                Опубликуйте проект за 2 минуты без бюрократии. Получите первых пользователей, честный фидбек и поднимитесь в топ дня!
              </p>
              <Link
                href="/submit"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-[#FF5A1F] hover:bg-[#E04810] text-white shadow-md shadow-orange-500/25 active:scale-95"
              >
                <span>+ Запустить проект бесплатно</span>
              </Link>
            </div>
          </div>

          {/* Telegram Channel / Community */}
          <div className="bg-white rounded-3xl p-5 border-[3px] border-orange-200/90 hover:border-[#FF5A1F]/60 shadow-xs hover:shadow-xl hover:shadow-orange-500/10 transition-all relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-tr from-amber-400/20 via-[#FF5A1F]/20 to-transparent blur-2xl pointer-events-none animate-float-slow" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center border border-orange-200/80">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Сообщество фаундеров
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 font-normal">
                Обсуждайте запуски, делитесь инсайтами и находите единомышленников и разработчиков в экосистеме Узбекистана.
              </p>
              <a
                href="https://t.me/boshlaup_community"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800"
              >
                <Send className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>Присоединиться к Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
