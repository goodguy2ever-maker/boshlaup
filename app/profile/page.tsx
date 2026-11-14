'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Rocket,
  Flame,
  MessageCircle,
  ArrowRight,
  Check,
  ShieldCheck,
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';
import StartupCard from '@/components/StartupCard';

export default function ProfilePage() {
  const { t, user, isUpvoted, userReviews, setAuthModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'myProjects' | 'upvoted' | 'reviews'>('myProjects');
  const [allStartups, setAllStartups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [localCreatedIds, setLocalCreatedIds] = useState<string[]>([]);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('starthub_my_startups') || localStorage.getItem('boshlaup_my_startups');
      if (saved) {
        setLocalCreatedIds(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    async function fetchStartups() {
      try {
        const res = await fetch('/api/startups?includeInactive=true', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setAllStartups(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchStartups();
  }, []);

  // Synchronize and clean up localStorage IDs if some projects were deleted from the DB
  useEffect(() => {
    if (allStartups.length > 0 && localCreatedIds.length > 0) {
      const validIds = localCreatedIds.filter(id => allStartups.some(s => s.id === id));
      if (validIds.length !== localCreatedIds.length) {
        setLocalCreatedIds(validIds);
        try {
          localStorage.setItem('starthub_my_startups', JSON.stringify(validIds));
          localStorage.setItem('boshlaup_my_startups', JSON.stringify(validIds));
        } catch (e) {}
      }
    }
  }, [allStartups, localCreatedIds]);

  const handleToggleActive = async (startupId: string, newActive: boolean) => {
    setTogglingId(startupId);
    try {
      const res = await fetch(`/api/startups/${startupId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newActive }),
      });

      if (res.ok) {
        setAllStartups(prev =>
          prev.map(s => (s.id === startupId ? { ...s, isActive: newActive } : s))
        );
        setToastMessage(
          newActive
            ? 'Проект активирован и снова отображается в общем каталоге!'
            : 'Проект отключен и скрыт из каталога.'
        );
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        alert('Не удалось изменить статус проекта');
      }
    } catch (err) {
      console.error('Error toggling startup active state:', err);
      alert('Ошибка при соединении с сервером');
    } finally {
      setTogglingId(null);
    }
  };

  // Filter projects created by this user:
  // Strict rule: If user is logged in via Telegram, ownership is determined strictly by telegramUserId.
  // telegramContact is only a public contact link for visitors/investors and does not grant ownership.
  // localStorage is used only as fallback for guest users who haven't logged in yet.
  const myProjects = allStartups.filter(s => {
    if (user.telegramId) {
      return Boolean(s.telegramUserId && String(user.telegramId) === String(s.telegramUserId));
    }

    if (localCreatedIds.includes(s.id)) return true;

    return false;
  });

  const upvotedStartups = allStartups.filter(s => isUpvoted(s.id));

  // Dynamic Founder Metrics
  const totalUpvotesGathered = myProjects.reduce((sum, p) => sum + (p.upvotes || 0), 0);
  const bugsReportedCount = userReviews.filter(r => 
    r.tag === 'Баг' || r.tag?.toLowerCase().includes('баг')
  ).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md shrink-0 bg-slate-100">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              {user.isLoggedIn && (
                <div className="absolute -bottom-1 -right-1 bg-[#FF5A1F] text-white rounded-full p-1 border-2 border-white shadow-xs" title="Верифицирован через Telegram">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-[#FF5A1F] border border-orange-200">
                  {user.isLoggedIn ? `${t.profile.roles.founder} / ${t.profile.roles.tester}` : t.profile.guest}
                </span>
                {user.isLoggedIn && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>{t.profile.telegramConnected}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 font-medium">
                Telegram:{' '}
                <span className="font-bold text-slate-800">
                  {user.telegram || t.profile.telegramNotConnected}
                </span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {t.profile.ecosystemMember}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!user.isLoggedIn && (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                {t.profile.loginWithTelegram}
              </button>
            )}

            <Link
              href="/submit"
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Rocket className="w-4 h-4" />
              <span>{t.profile.addStartup}</span>
            </Link>
          </div>
        </div>

        {/* Founder Activity & Reputation Metrics (Product Hunt & Indie Hackers Style) */}
        <div className="pt-6 mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Metric 1: Launched */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {(t.profile as any).stats?.launched || 'Проектов запущено'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {myProjects.length}
                </span>
                <span className="text-xs font-semibold text-slate-400">стартапа</span>
              </div>
            </div>

            {/* Metric 2: Upvotes Gathered */}
            <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/80">
              <span className="text-[11px] font-bold text-[#FF5A1F] uppercase tracking-wider block mb-1">
                {(t.profile as any).stats?.upvotes || 'Собрано апвоутов'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-[#FF5A1F] tracking-tight">
                  {totalUpvotesGathered}
                </span>
                <span className="text-xs font-black text-[#FF5A1F]">▲</span>
              </div>
            </div>

            {/* Metric 3: Bug Reports & Feedback */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {(t.profile as any).stats?.reviews || 'Баг-репортов'}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {userReviews.length}
                </span>
                <span className="text-xs font-semibold text-slate-400">отчетов</span>
              </div>
            </div>

            {/* Metric 4: Telegram Verification */}
            <div className={`p-3.5 rounded-2xl border ${
              user.isLoggedIn
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-slate-50 border-slate-200/80'
            }`}>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Верификация
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {user.isLoggedIn ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                    <span className="text-xs font-extrabold text-emerald-800 truncate">
                      {(t.profile as any).stats?.verified || '✓ Подтверждён'}
                    </span>
                  </>
                ) : (
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="text-xs font-bold text-[#FF5A1F] hover:underline"
                  >
                    Привязать ID →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Clean Working Tabs: My Projects, Upvoted, Reviews */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('myProjects')}
          className={`pb-2.5 px-4 text-xs sm:text-sm font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'myProjects'
              ? 'border-[#FF5A1F] text-[#FF5A1F]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.profile.tabs.myProjects} ({myProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('upvoted')}
          className={`pb-2.5 px-4 text-xs sm:text-sm font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'upvoted'
              ? 'border-[#FF5A1F] text-[#FF5A1F]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.profile.tabs.upvoted} ({upvotedStartups.length})
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-2.5 px-4 text-xs sm:text-sm font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-[#FF5A1F] text-[#FF5A1F]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          {t.profile.tabs.myReviews} ({userReviews.length})
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between text-xs font-bold shadow-lg animate-in fade-in slide-in-from-top-2">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-4 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab contents */}
      {activeTab === 'myProjects' && (
        <div className="space-y-4 animate-in fade-in">
          {myProjects.length > 0 ? (
            myProjects.map((s) => (
              <StartupCard
                key={s.id}
                startup={s}
                isOwner={true}
                onToggleActive={handleToggleActive}
                isToggling={togglingId === s.id}
              />
            ))
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-2xs">
              <Rocket className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">У вас пока нет опубликованных проектов</h3>
              <p className="text-slate-500 text-xs max-w-md mx-auto mb-5 leading-relaxed font-medium">
                Опубликуйте свой стартап или MVP за 3 минуты. Это откроет доступ к тестерам и первым отзывам.
              </p>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all active:scale-95"
              >
                <Rocket className="w-4 h-4 stroke-[2.5]" />
                <span>{t.profile.addStartup}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'upvoted' && (
        <div className="space-y-4 animate-in fade-in">
          {upvotedStartups.length > 0 ? (
            upvotedStartups.map((s) => (
              <StartupCard key={s.id} startup={s} />
            ))
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-2xs">
              <Flame className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-700 font-bold text-sm">Вы пока не поддержали проекты</p>
              <p className="text-slate-400 text-xs mt-1 mb-4">
                Голосуйте за интересные идеи в каталоге, чтобы следить за их ростом
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF5A1F] hover:underline"
              >
                <span>Перейти в каталог проектов</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-3 animate-in fade-in">
          {userReviews.length > 0 ? (
            userReviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-xs text-slate-900">
                    Стартап: {rev.startupName || 'Проект'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {rev.tag}
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed font-normal">
                  «{rev.content}»
                </p>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-2xs">
              <MessageCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-700 font-bold text-sm">Вы еще не отправляли отзывы или баги</p>
              <p className="text-slate-400 text-xs mt-1">
                Тестируйте проекты фаундеров и оставляйте полезный фидбек, чтобы получать бонусы
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
