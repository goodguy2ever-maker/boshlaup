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

        const res = await fetch(`/api/startups?${params.toString()}`);
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Investor Mode Alert Bar (Feature Flagged for Phase 2) */}
      {FEATURES.ENABLE_INVESTOR_MODE && investorMode && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <p className="font-bold text-xs sm:text-sm">
                Режим инвестора активирован
              </p>
              <p className="text-[11px] text-emerald-700">
                Вам открыты текущие метрики (MRR, пользователи), размер запрашиваемого раунда и контакты.
              </p>
            </div>
          </div>
          <button
            onClick={toggleInvestorMode}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline shrink-0"
          >
            Выключить
          </button>
        </div>
      )}

      {/* Hero Section: Senior Editorial / Product-Led (Linear/Vercel style) */}
      <section className="mb-10 pt-2 pb-6 border-b border-zinc-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-[11px] font-semibold mb-4 border border-zinc-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
              <span>ЭКОСИСТЕМА СТАРТАПОВ УЗБЕКИСТАНА</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-zinc-950 leading-[1.15] mb-3">
              Запускайте. Тестируйте. Находите первых пользователей.
            </h1>

            <p className="text-zinc-600 text-sm sm:text-base mb-6 leading-relaxed max-w-xl font-normal">
              BoshlaUp помогает локальным фаундерам валидировать идеи, находить первых бета-тестеров и собирать структурированный продуктовый фидбек без бюрократии.
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/submit"
                className="px-4 py-2 bg-[#FF5A1F] hover:bg-[#E04810] text-white font-semibold rounded-lg text-xs sm:text-sm shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Rocket className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Запустить свой проект</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('feed-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold rounded-lg text-xs sm:text-sm border border-zinc-200 transition-colors"
              >
                Смотреть проекты
              </button>
            </div>
          </div>

          {/* Right Column: Product-Oriented Visual (Real interactive anatomy preview) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-zinc-200/90 p-4 shadow-subtle space-y-3 relative">
              {/* Top bar indicator */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium pb-2.5 border-b border-zinc-100">
                <span>Как работает валидация на BoshlaUp</span>
                <span className="text-zinc-600 font-semibold">1. Запуск → 2. Тест → 3. Итерация</span>
              </div>

              {/* Sample Mini Project Card */}
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#FF5A1F] font-bold flex items-center justify-center shrink-0 text-xs border border-orange-200">
                  ZP
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className="font-bold text-xs text-zinc-900 truncate">ZaminPay</p>
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                      MVP
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 line-clamp-1">
                    QR-платежи для малого ритейла в Ташкенте
                  </p>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1">
                    Ищет: <span className="text-zinc-800 font-semibold">10 первых торговых точек</span>
                  </p>
                </div>
              </div>

              {/* Sample Structured Feedback Card */}
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/80 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between text-emerald-900 font-semibold">
                  <span>Структурированный фидбек от тестера</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                    Готов пользоваться: Да
                  </span>
                </div>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  «Отличная скорость сканирования. Добавьте быструю интеграцию с Uzum/Payme в следующем релизе!»
                </p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>Статус: <strong className="text-emerald-700">Взято в работу фаундером</strong></span>
                  <span>+12 голосов</span>
                </div>
              </div>
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
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-xl p-4 border border-zinc-200 animate-pulse flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-zinc-100 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-100 rounded w-1/4" />
                    <div className="h-3 bg-zinc-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : startups.length === 0 ? (
            isFiltering ? (
              <div className="bg-white rounded-xl p-10 text-center border border-zinc-200">
                <Rocket className="w-8 h-8 text-zinc-300 mx-auto mb-2.5" />
                <h3 className="font-bold text-zinc-900 text-sm mb-1">Проекты не найдены</h3>
                <p className="text-zinc-500 text-xs mb-4">
                  Попробуйте изменить категорию или сбросить фильтры
                </p>
                <button
                  onClick={() => {
                    setCategory('Все');
                    setStage('Все');
                    setFounderNeed('Все');
                    setSearch('');
                  }}
                  className="text-xs font-semibold text-[#FF5A1F] hover:underline"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-10 text-center border border-zinc-200 shadow-subtle">
                <div className="w-12 h-12 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto mb-3.5 text-[#FF5A1F]">
                  <Rocket className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-bold text-zinc-950 text-base mb-1.5">
                  Экосистема открыта для первых проектов
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm max-w-md mx-auto mb-5 leading-relaxed font-normal">
                  Будьте первым фаундером, который опубликует свой проект на BoshlaUp, получит верхнюю строчку в каталоге и обратную связь от первых тестеров в Узбекистане.
                </p>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5A1F] hover:bg-[#E04810] text-white text-xs font-semibold rounded-lg shadow-xs transition-all"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Опубликовать свой проект →</span>
                </Link>
              </div>
            )
          ) : viewMode === 'compact' ? (
            <CompactList startups={startups} />
          ) : viewMode === 'investorTable' && FEATURES.ENABLE_INVESTOR_MODE ? (
            <InvestorTable startups={startups} />
          ) : (
            <div className="space-y-3">
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

        {/* Right Column: Refined Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Founder Callout */}
          <div className="bg-zinc-900 text-white rounded-xl p-5 border border-zinc-800">
            <h3 className="font-bold text-white text-sm mb-1.5">
              Создаете свой проект?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4 font-normal">
              Опубликуйте проект за 2 минуты без бюрократии. Получите первых пользователей, честный фидбек и поднимитесь в топ.
            </p>
            <Link
              href="/submit"
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white"
            >
              <span>+ Опубликовать проект</span>
            </Link>
          </div>

          {/* Telegram Community */}
          <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-subtle">
            <h3 className="font-bold text-zinc-950 text-sm mb-1.5">
              Сообщество фаундеров
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed mb-4 font-normal">
              Обсуждайте запуски, делитесь инсайтами и находите единомышленников и разработчиков в Узбекистане.
            </p>
            <a
              href="https://t.me/boshlaupbot"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200"
            >
              <Send className="w-3 h-3 text-[#FF5A1F]" />
              <span>Открыть @boshlaupbot</span>
            </a>
          </div>

          {/* Platform Principles */}
          <div className="bg-white rounded-xl p-5 border border-zinc-200/90 shadow-subtle">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
              Принципы BoshlaUp
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-600">
              <div className="flex items-start gap-2">
                <span className="font-bold text-zinc-900">01</span>
                <span>Только реальные продукты и работающие прототипы.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-zinc-900">02</span>
                <span>Структурированный фидбек вместо бесполезных комментариев.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-zinc-900">03</span>
                <span>Прямая связь между фаундером и пользователями.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
