'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Rocket,
  Users,
  MousePointerClick,
  ChevronUp,
  MessageCircle,
  MapPin,
  Layers,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  Award,
  Globe,
  Bot,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Eye,
  BarChart3,
  Check,
  Lock
} from 'lucide-react';

export default function AdminAnalyticsDashboard() {
  const { user, isAdmin, setAuthModalOpen } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const toggleFeatured = async (startupId: string, featured: boolean) => {
    try {
      const res = await fetch('/api/admin/featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId, featured }),
      });
      if (res.ok) {
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 text-[#FF5A1F] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-50 text-[#FF5A1F] border border-orange-200 mb-2 inline-block">
          Admin Gate
        </span>
        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">
          Доступ только для создателя BoshlaUp
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
          Панель сквозной аналитики и управления экосистемой предназначена исключительно для администратора платформы <strong>@nazarov_df</strong> (Telegram ID: 5463769569).
        </p>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="w-full py-3 px-5 bg-[#18181B] hover:bg-black text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#FF5A1F]" />
            <span>Войти через Telegram (@nazarov_df)</span>
          </button>

          <Link
            href="/"
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all block text-center"
          >
            Вернуться в каталог стартапов
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <RefreshCw className="w-8 h-8 text-[#FF5A1F] animate-spin mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Загрузка аналитики BoshlaUp...</h2>
        <p className="text-xs text-slate-400 mt-1">Собираем данные по пользователям, стартапам и кликам</p>
      </div>
    );
  }

  const startups = data?.startups || [];
  const filteredStartups = startups.filter((s: any) => {
    const matchesSearch = !searchQuery.trim() || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.founderName && s.founderName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = selectedStage === 'ALL' || s.stage === selectedStage;
    const matchesRegion = selectedRegion === 'ALL' || s.region === selectedRegion;

    return matchesSearch && matchesStage && matchesRegion;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-50 text-[#FF5A1F] border border-orange-200">
              Admin & Ecosystem Pulse
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/30">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Администратор: @nazarov_df (ID: 5463769569)</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>База данных онлайн</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              <Bot className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>@boshlaupbot активен</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Панель управления и аналитики Boshla<span className="text-[#FF5A1F]">Up</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Сквозная статистика стартап-экосистемы, воронка тестирования, распределение по стадиям и кликабельность
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#FF5A1F]' : ''}`} />
            <span>Обновить</span>
          </button>

          <Link
            href="/submit"
            className="px-4 py-2 bg-[#FF5A1F] hover:bg-[#E04810] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Запустить стартап</span>
          </Link>
        </div>
      </div>

      {/* 5 Main Platform KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8">
        {/* KPI 1: Total Users */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Всего юзеров</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A1F] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {data?.totalUsers || 0}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Telegram</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {data?.totalAuthCodes || 0} запросов кода входа
          </p>
        </div>

        {/* KPI 2: Total Startups */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Стартапов</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Rocket className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {data?.totalStartups || 0}
            </span>
            <span className="text-xs font-semibold text-blue-600">проектов</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            В каталоге платформы
          </p>
        </div>

        {/* KPI 3: Total Website Clicks (High CTR) */}
        <div className="bg-white rounded-3xl p-5 border border-orange-200 shadow-2xs bg-gradient-to-br from-white via-orange-50/20 to-orange-50/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#FF5A1F] uppercase tracking-wider">Переходов на сайт</span>
            <div className="w-8 h-8 rounded-xl bg-[#FF5A1F] text-white flex items-center justify-center shadow-xs">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#FF5A1F] tracking-tight">
              {data?.totalClicks || 0}
            </span>
            <span className="text-xs font-bold text-[#FF5A1F]">кликов</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            «Попробовать продукт»
          </p>
        </div>

        {/* KPI 4: Total Upvotes */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Собрано апвоутов</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ChevronUp className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {data?.totalUpvotes || 0}
            </span>
            <span className="text-xs font-bold text-amber-600">▲ голосов</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Поддержка сообщества
          </p>
        </div>

        {/* KPI 5: Feedback & Bugs */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Фидбек и баги</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#14B8A6] flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {data?.totalFeedback || 0}
            </span>
            <span className="text-xs font-semibold text-[#14B8A6]">отчётов</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Тестирование стартапов
          </p>
        </div>
      </div>

      {/* 3 Analytics Columns: Stages (%), Regions (%), Categories (%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Stages Breakdown with Percentages */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF5A1F]" />
              <span>Стадии развития проектов</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">{data?.stages?.length || 0} стадии</span>
          </div>

          <div className="space-y-3.5 mt-4">
            {data?.stages?.map((stg: any) => (
              <div key={stg.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700 truncate">{stg.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] font-semibold">{stg.count} проектов</span>
                    <span className="font-black text-slate-900 text-xs px-2 py-0.5 rounded-md bg-slate-100">
                      {stg.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stg.name.includes('MVP')
                        ? 'bg-[#FF5A1F]'
                        : stg.name.includes('продажи')
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${stg.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regions Breakdown with Percentages */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>География стартапов</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">{data?.regions?.length || 0} регионов</span>
          </div>

          <div className="space-y-3.5 mt-4">
            {data?.regions?.slice(0, 5).map((reg: any) => (
              <div key={reg.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700">{reg.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] font-semibold">{reg.count} стартапов</span>
                    <span className="font-black text-slate-900 text-xs px-2 py-0.5 rounded-md bg-slate-100">
                      {reg.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${reg.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Сферы и категории</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">{data?.categories?.length || 0} сфер</span>
          </div>

          <div className="space-y-3 mt-4">
            {data?.categories?.slice(0, 5).map((cat: any) => (
              <div key={cat.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-xs text-slate-800">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">{cat.count} стартапов</span>
                  <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard: Top by Clicks, Top by Upvotes, Top by Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Most Clicked (High CTR) */}
        <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-[#FF5A1F] text-white flex items-center justify-center font-bold">
              <MousePointerClick className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Самый активный по кликам</h4>
              <p className="text-[10px] text-slate-400">Переходы на продукт фаундера</p>
            </div>
          </div>

          <div className="space-y-3">
            {data?.topByClicks?.slice(0, 3).map((st: any, idx: number) => (
              <div key={st.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50/40 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-black text-xs text-slate-400 w-4 text-center">#{idx + 1}</span>
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                    <img src={st.logoUrl || ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <Link href={`/startups/${st.id}`} className="font-extrabold text-xs text-slate-900 hover:text-[#FF5A1F] truncate block">
                      {st.name}
                    </Link>
                    <span className="text-[10px] text-slate-400 truncate block">{st.category}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-orange-50 text-[#FF5A1F] border border-orange-200 text-xs font-black shrink-0">
                  {st.websiteClicks || 0} кликов
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Upvoted (Community Favorite) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <ChevronUp className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Самый любимый (Апвоуты)</h4>
              <p className="text-[10px] text-slate-400">Голоса и поддержка комьюнити</p>
            </div>
          </div>

          <div className="space-y-3">
            {data?.topByUpvotes?.slice(0, 3).map((st: any, idx: number) => (
              <div key={st.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-amber-50/40 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-black text-xs text-slate-400 w-4 text-center">#{idx + 1}</span>
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                    <img src={st.logoUrl || ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <Link href={`/startups/${st.id}`} className="font-extrabold text-xs text-slate-900 hover:text-[#FF5A1F] truncate block">
                      {st.name}
                    </Link>
                    <span className="text-[10px] text-slate-400 truncate block">{st.category}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black shrink-0">
                  {st.upvotes} ▲
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Discussed / Feedback */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Топ по багам и фидбеку</h4>
              <p className="text-[10px] text-slate-400">Активность бета-тестеров</p>
            </div>
          </div>

          <div className="space-y-3">
            {data?.topByFeedback?.slice(0, 3).map((st: any, idx: number) => (
              <div key={st.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-teal-50/40 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-black text-xs text-slate-400 w-4 text-center">#{idx + 1}</span>
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                    <img src={st.logoUrl || ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <Link href={`/startups/${st.id}`} className="font-extrabold text-xs text-slate-900 hover:text-[#FF5A1F] truncate block">
                      {st.name}
                    </Link>
                    <span className="text-[10px] text-slate-400 truncate block">{st.category}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-black shrink-0">
                  {(st.commentCount || 0) + (st.reviewCount || 0)} фидбеков
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Master Data Table: All Startups with Filter & Search */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-lg text-slate-900 tracking-tight">Реестр стартапов платформы</h3>
            <p className="text-xs text-slate-500 font-medium">Найдено: {filteredStartups.length} из {startups.length} проектов</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию..."
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20 focus:border-[#FF5A1F] font-medium"
              />
            </div>

            {/* Stage Filter */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20"
            >
              <option value="ALL">Все стадии</option>
              <option value="MVP / Прототип">MVP / Прототип</option>
              <option value="Есть первые продажи">Есть первые продажи</option>
              <option value="Только идея">Только идея</option>
            </select>

            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/20"
            >
              <option value="ALL">Все регионы</option>
              <option value="Ташкент">Ташкент</option>
              <option value="Самарканд">Самарканд</option>
              <option value="Бухара">Бухара</option>
              <option value="Фергана">Фергана</option>
              <option value="Узбекистан">Весь Узбекистан</option>
              <option value="Global">Global</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4">Проект</th>
                <th className="py-3 px-4">Сфера</th>
                <th className="py-3 px-4">Регион</th>
                <th className="py-3 px-4">Стадия</th>
                <th className="py-3 px-4 text-center">Кликов</th>
                <th className="py-3 px-4 text-center">Апвоутов</th>
                <th className="py-3 px-4 text-center">Фидбек</th>
                <th className="py-3 px-4">Фаундер</th>
                <th className="py-3 px-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStartups.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img src={s.logoUrl || ''} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <Link href={`/startups/${s.id}`} className="font-extrabold text-slate-900 hover:text-[#FF5A1F] truncate block">
                          {s.name}
                        </Link>
                        <p className="text-[11px] text-slate-400 truncate font-normal">{s.tagline}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]">
                      {s.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {s.region}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      s.stage === 'Есть первые продажи'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : s.stage === 'MVP / Прототип'
                        ? 'bg-orange-50 text-[#FF5A1F] border-orange-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {s.stage}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-black text-[#FF5A1F]">
                    {s.websiteClicks || 0}
                  </td>

                  <td className="py-3.5 px-4 text-center font-black text-slate-800">
                    {s.upvotes} ▲
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-slate-600">
                    {(s.commentCount || 0) + (s.reviewCount || 0)}
                  </td>

                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    <div className="text-xs font-bold text-slate-800">{s.founderName || 'Фаундер'}</div>
                    <div className="text-[10px] text-slate-400">{s.telegramContact || '—'}</div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(s.id, !s.featured)}
                        title={s.featured ? "Снять статус Проект дня" : "Сделать Проектом дня на главной"}
                        className={`p-1.5 rounded-lg border transition-all flex items-center gap-1 ${
                          s.featured
                            ? "bg-amber-100 text-amber-800 border-amber-300 font-bold shadow-2xs"
                            : "text-slate-400 hover:text-amber-600 hover:bg-amber-50 border-slate-200"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {s.featured && <span className="text-[10px] hidden sm:inline">Проект дня</span>}
                      </button>
                      <a
                        href={s.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Открыть сайт"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                      <Link
                        href={`/startups/${s.id}`}
                        className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
                      >
                        Карточка →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Users List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#FF5A1F]" />
            <span>Последние зарегистрированные участники</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">{data?.recentUsers?.length || 0} недавних</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {data?.recentUsers?.map((u: any) => (
            <div key={u.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-black text-xs text-slate-900 truncate">{u.firstName}</div>
                <div className="text-[11px] font-semibold text-[#FF5A1F] truncate">
                  {u.username ? u.username : `ID: ${u.telegramId}`}
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 shrink-0">
                {u.role || 'Участник'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
