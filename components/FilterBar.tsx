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
    { value: 'AgriTech', label: t.filters.categories.agritech },
    { value: 'HealthTech', label: t.filters.categories.health },
    { value: 'Игры', label: t.filters.categories.games },
    { value: 'Социальные', label: t.filters.categories.social },
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
    <div className="space-y-2.5 mb-5">
      {/* Row 1: Segmented Tabs & View Switcher */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-white p-1 rounded-xl border border-zinc-200/80 shadow-subtle">
        {/* Left: Sorting Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTab('topDay')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'topDay'
                ? 'bg-zinc-900 text-white font-bold'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{t.filters.tabs.topDay}</span>
          </button>

          <button
            onClick={() => setTab('topWeek')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'topWeek'
                ? 'bg-zinc-900 text-white font-bold'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{t.filters.tabs.topWeek}</span>
          </button>

          <button
            onClick={() => setTab('newLaunch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'newLaunch'
                ? 'bg-zinc-900 text-white font-bold'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.filters.tabs.newLaunch}</span>
          </button>
        </div>

        {/* Right: View Mode Toggle */}
        <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg gap-0.5 border border-zinc-200/60">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            title={t.filters.viewCards}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'cards'
                ? 'bg-white text-zinc-950 font-semibold shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.filters.viewCards}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('compact')}
            title={t.filters.viewList}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === 'compact'
                ? 'bg-white text-zinc-950 font-semibold shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.filters.viewList}</span>
          </button>
        </div>
      </div>

      {/* Row 2: Search + Filter Dropdowns */}
      <div className="bg-white rounded-xl p-2 sm:p-2.5 border border-zinc-200/80 shadow-subtle flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.nav.searchPlaceholder}
            className="w-full pl-9 pr-7 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] focus:border-[#FF5A1F] transition-all font-medium text-zinc-900"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="flex-1 min-w-[130px] sm:w-36">
            <CustomSelect
              options={CATEGORIES}
              value={category}
              onChange={setCategory}
              placeholder={t.filters.categories.all}
            />
          </div>

          {/* Stage Dropdown */}
          <div className="flex-1 min-w-[130px] sm:w-36">
            <CustomSelect
              options={STAGE_OPTIONS}
              value={stage}
              onChange={setStage}
              placeholder={t.filters.stages.all}
            />
          </div>

          {/* Founder Need Dropdown */}
          <div className="flex-1 min-w-[140px] sm:w-40">
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
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200/80 transition-colors shrink-0"
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