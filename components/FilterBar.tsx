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
  Gift,
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
  bonusOnly = false,
  setBonusOnly,
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

  const hasActiveFilters = category !== 'Все' || stage !== 'Все' || founderNeed !== 'Все' || search.trim() !== '' || bonusOnly;

  const handleReset = () => {
    setCategory('Все');
    setStage('Все');
    setFounderNeed('Все');
    setSearch('');
    if (setBonusOnly) setBonusOnly(false);
  };

  return (
    <div className="space-y-3 mb-6">
      {/* Row 1: Unified Segmented Navigation & View Switcher (Linear Style) */}
      <div className="flex items-center justify-between gap-3 flex-wrap bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        {/* Left: Sorting Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTab('topDay')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              tab === 'topDay'
                ? 'bg-[#FF5A1F] text-white shadow-sm shadow-orange-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>{t.filters.tabs.topDay}</span>
          </button>

          <button
            onClick={() => setTab('topWeek')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              tab === 'topWeek'
                ? 'bg-[#FF5A1F] text-white shadow-sm shadow-orange-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{t.filters.tabs.topWeek}</span>
          </button>

          <button
            onClick={() => setTab('newLaunch')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              tab === 'newLaunch'
                ? 'bg-[#FF5A1F] text-white shadow-sm shadow-orange-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.filters.tabs.newLaunch}</span>
          </button>
        </div>

        {/* Right: View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-0.5 border border-slate-200/60">
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
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
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

        {/* Filter Controls Row */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Category Dropdown */}
          <div className="w-full sm:w-44">
            <CustomSelect
              options={CATEGORIES}
              value={category}
              onChange={setCategory}
              placeholder={t.filters.categories.all}
            />
          </div>

          {/* Stage Dropdown */}
          <div className="w-full sm:w-44">
            <CustomSelect
              options={STAGE_OPTIONS}
              value={stage}
              onChange={setStage}
              placeholder={t.filters.stages.all}
            />
          </div>

          {/* Founder Need Dropdown (Wider to prevent truncation) */}
          <div className="w-full sm:w-52">
            <CustomSelect
              options={NEED_OPTIONS}
              value={founderNeed}
              onChange={setFounderNeed}
              placeholder={t.filters.needs.all}
            />
          </div>

          {/* Quick Bonus Toggle Chip (Teal #14B8A6 accent) */}
          {setBonusOnly && (
            <button
              type="button"
              onClick={() => setBonusOnly(!bonusOnly)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                bonusOnly
                  ? 'bg-[#14B8A6] text-white border-[#14B8A6] shadow-sm shadow-teal-500/25'
                  : 'bg-teal-50/70 text-teal-800 border-teal-200 hover:bg-teal-100 hover:border-teal-300'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{t.filters.bonusOnly}</span>
            </button>
          )}

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