'use client';

import { useApp } from '@/context/AppContext';
import CustomSelect from '@/components/ui/CustomSelect';
import {
  Search,
  Flame,
  Zap,
  Sparkles,
  RotateCcw,
  LayoutGrid,
  List,
  X,
  SlidersHorizontal
} from 'lucide-react';

export type ViewMode = 'cards' | 'compact' | 'investorTable';

interface FilterBarProps {
  tab: string;
  setTab: (tab: string) => void;
  category: string;
  setCategory: (category: string) => void;
  stage: string;
  setStage: (stage: string) => void;
  founderNeed: string;
  setFounderNeed: (need: string) => void;
  search: string;
  setSearch: (search: string) => void;
  resultsCount: number;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  bonusOnly?: boolean;
  setBonusOnly?: (val: boolean) => void;
}

export default function FilterBar({
  tab,
  setTab,
  category,
  setCategory,
  stage,
  setStage,
  founderNeed,
  setFounderNeed,
  search,
  setSearch,
  resultsCount,
  viewMode,
  setViewMode,
}: FilterBarProps) {
  const { t } = useApp();

  const CATEGORIES = [
    { value: 'Все', label: t.filters.categories.all },
    { value: 'AI', label: t.filters.categories.ai },
    { value: 'FinTech', label: t.filters.categories.fintech },
    { value: 'EdTech', label: t.filters.categories.edtech },
    { value: 'E-commerce', label: t.filters.categories.ecommerce },
    { value: 'SaaS', label: t.filters.categories.saas },
    { value: 'PropTech', label: (t.filters.categories as any).proptech || 'PropTech & Стройка' },
    { value: 'Логистика', label: (t.filters.categories as any).logistics || 'Логистика & Авто' },
    { value: 'AgriTech', label: t.filters.categories.agritech },
    { value: 'HealthTech', label: t.filters.categories.health },
    { value: 'Услуги', label: (t.filters.categories as any).services || 'Услуги & Сервисы' },
    { value: 'Игры', label: t.filters.categories.games },
    { value: 'Социальные', label: t.filters.categories.social },
    { value: 'Другое', label: (t.filters.categories as any).other || 'Другое' },
  ];

  const STAGE_OPTIONS = [
    { value: 'Все', label: t.filters.stages.all },
    { value: 'Только идея', label: t.filters.stages.idea },
    { value: 'MVP / Прототип', label: t.filters.stages.mvp },
    { value: 'Есть первые продажи', label: t.filters.stages.sales },
  ];

  const NEED_OPTIONS = [
    { value: 'Все', label: t.filters.needs.all },
    { value: 'Ищу тестеров', label: t.filters.needs.testers },
    { value: 'Нужен фидбек', label: t.filters.needs.feedback },
    { value: 'Ищу кофаундера', label: t.filters.needs.cofounder },
  ];

  const hasActiveFilters = category !== 'Все' || stage !== 'Все' || founderNeed !== 'Все' || search.trim() !== '';

  const handleReset = () => {
    setCategory('Все');
    setStage('Все');
    setFounderNeed('Все');
    setSearch('');
  };

  return (
    <div className="space-y-3 mb-6">
      {/* Row 1: Unified Segmented Navigation & View Switcher (Linear Style) */}
      <div className="flex items-center justify-between gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap bg-white p-1.5 rounded-2xl border-2 border-orange-200/80 hover:border-[#FF5A1F]/60 shadow-2xs hover:shadow-md hover:shadow-orange-500/5 transition-all">
        {/* Left: Sorting Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-nowrap w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setTab('topDay')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all ${
              tab === 'topDay'
                ? 'bg-[#FF5A1F] text-white shadow-sm shadow-orange-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{t.filters.tabs.topDay}</span>
          </button>

          <button
            onClick={() => setTab('topWeek')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all ${
              tab === 'topWeek'
                ? 'bg-[#FF5A1F] text-white shadow-sm shadow-orange-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{t.filters.tabs.topWeek}</span>
          </button>

          <button
            onClick={() => setTab('newLaunch')}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all ${
              tab === 'newLaunch'
                ? 'bg-[#FF5A1F] text-white shadow-sm shadow-orange-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">{t.filters.tabs.newLaunch}</span>
          </button>
        </div>

        {/* Right: View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-0.5 border border-slate-200/60 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            title={t.filters.viewCards}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'cards'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t.filters.viewCards}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('compact')}
            title={t.filters.viewList}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'compact'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>{t.filters.viewList}</span>
          </button>
        </div>
      </div>

      {/* Row 2: Unified Command Bar (Search + Dropdowns + Quick Toggle Chip) */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border-2 border-orange-200/80 hover:border-[#FF5A1F]/60 shadow-2xs hover:shadow-md hover:shadow-orange-500/5 transition-all flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.nav.searchPlaceholder}
            className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F] transition-all font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row: wrap smoothly with flexible column widths */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Dropdown */}
          <div className="flex-1 min-w-[140px] max-w-full sm:max-w-[200px]">
            <CustomSelect
              options={CATEGORIES}
              value={category}
              onChange={setCategory}
              placeholder={t.filters.categories.all}
            />
          </div>

          {/* Stage Dropdown */}
          <div className="flex-1 min-w-[140px] max-w-full sm:max-w-[200px]">
            <CustomSelect
              options={STAGE_OPTIONS}
              value={stage}
              onChange={setStage}
              placeholder={t.filters.stages.all}
            />
          </div>

          {/* Founder Need Dropdown */}
          <div className="flex-1 min-w-[160px] max-w-full sm:max-w-[220px]">
            <CustomSelect
              options={NEED_OPTIONS}
              value={founderNeed}
              onChange={setFounderNeed}
              placeholder={t.filters.needs.all}
            />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              title={t.filters.reset}
              className="flex items-center gap-1 px-3 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.filters.reset}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}