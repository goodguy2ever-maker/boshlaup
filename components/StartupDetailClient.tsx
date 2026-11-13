'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { FEATURES } from '@/lib/config';
import {
  ArrowLeft,
  ExternalLink,
  ChevronUp,
  Share2,
  Gift,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Briefcase,
  Send,
  MessageCircle,
  HelpCircle,
  Bug,
  Lightbulb,
  Flame,
  Check,
  Clock,
  ShieldCheck,
  User,
  Copy,
  ChevronRight,
  Layers,
  Plus,
  ChevronDown,
  Phone,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import { Language } from '@/lib/i18n';
import { localizeStage, localizeRegion, localizeCategory, localizeNeed } from '@/lib/localize';

function formatContactLink(contact: string, lang: Language = 'ru') {
  const trimmed = contact.trim();
  const cleanDigits = trimmed.replace(/[\s\-\(\)]/g, '');
  if (trimmed.startsWith('+') || (/^\d{9,14}$/.test(cleanDigits))) {
    const phone = cleanDigits.startsWith('+') ? cleanDigits : `+${cleanDigits}`;
    const prefix = lang === 'uz' ? "Qo'ng'iroq qilish" : lang === 'en' ? 'Call' : 'Позвонить';
    return {
      href: `tel:${phone}`,
      label: `${prefix} (${trimmed})`,
      type: 'phone'
    };
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    const prefix = lang === 'uz' ? "Bog'lanish" : lang === 'en' ? 'Contact' : 'Связаться';
    return {
      href: trimmed,
      label: `${prefix}: ${trimmed.replace(/^https?:\/\//, '')}`,
      type: 'link'
    };
  }
  if (trimmed.startsWith('t.me/')) {
    return {
      href: `https://${trimmed}`,
      label: `Telegram: ${trimmed}`,
      type: 'telegram'
    };
  }
  const username = trimmed.replace(/^@/, '');
  const prefix = lang === 'uz' ? "Telegram'da yozish" : lang === 'en' ? 'Message on Telegram' : 'Написать в Telegram';
  return {
    href: `https://t.me/${username}`,
    label: `${prefix} (@${username})`,
    type: 'telegram'
  };
}

export default function StartupDetailClient({ initialStartup }: { initialStartup?: any }) {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || initialStartup?.id;

  const { t, lang, user, isUpvoted, toggleUpvote, claimBonus, hasClaimedBonus, addReview } = useApp();

  const [startup, setStartup] = useState<any>(initialStartup || null);
  const [loading, setLoading] = useState(!initialStartup);
  const [activeTab, setActiveTab] = useState<'pitch' | 'changelog' | 'investor'>('pitch');

  // Upvote state
  const upvoted = isUpvoted(id);
  const [upvotesCount, setUpvotesCount] = useState(initialStartup?.upvotes || 0);
  const [upvoting, setUpvoting] = useState(false);

  // Share link toast
  const [copied, setCopied] = useState(false);

  // Investor contact modal
  const [showContactModal, setShowContactModal] = useState(false);

  // Changelog submission state (Founder only)
  const [showChangelogForm, setShowChangelogForm] = useState(false);
  const [changelogVersion, setChangelogVersion] = useState('v1.1');
  const [changelogTitle, setChangelogTitle] = useState('');
  const [changelogContent, setChangelogContent] = useState('');
  const [submittingChangelog, setSubmittingChangelog] = useState(false);

  // Comment submission form
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentRole, setCommentRole] = useState('Тестер');
  const [commentTag, setCommentTag] = useState('Идея');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Bonus claim state
  const claimed = hasClaimedBonus(id);
  const [claimToast, setClaimToast] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (initialStartup) return;
      try {
        const res = await fetch(`/api/startups/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStartup(data);
          setUpvotesCount(data.upvotes);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id && !initialStartup) loadData();
  }, [id, initialStartup]);

  const handleUpvote = async () => {
    if (upvoting) return;
    setUpvoting(true);
    try {
      const nowUpvoted = await toggleUpvote(id);
      setUpvotesCount(prev => nowUpvoted ? prev + 1 : Math.max(0, prev - 1));
    } finally {
      setUpvoting(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleClaimBonus = () => {
    claimBonus(id);
    setClaimToast(true);
    setTimeout(() => setClaimToast(false), 4000);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/startups/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: commentAuthor.trim(),
          role: commentRole,
          tag: commentTag,
          content: commentText.trim(),
        }),
      });

      if (res.ok) {
        const newC = await res.json();
        setStartup((prev: any) => ({
          ...prev,
          comments: [newC, ...(prev.comments || [])],
          commentCount: (prev.commentCount || 0) + 1,
        }));
        addReview({
          startupId: id,
          startupName: startup?.name || 'Стартап',
          tag: commentTag,
          content: commentText.trim(),
        });
        setCommentText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentStatusToggle = async (commentId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Решено' ? 'Взято в работу' : 'Решено';
    try {
      await fetch(`/api/startups/${id}/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      setStartup((prev: any) => ({
        ...prev,
        comments: prev.comments.map((c: any) => c.id === commentId ? { ...c, status: nextStatus } : c),
      }));
    } catch (e) {}
  };

  // Founder check: matched by Telegram username, Telegram user ID, or local creation record
  const isOwner = Boolean(
    (user?.isLoggedIn &&
      ((user.telegram && startup?.telegramContact && user.telegram.replace('@', '').toLowerCase() === startup.telegramContact.replace('@', '').toLowerCase()) ||
       (user.telegramId && startup?.telegramUserId && String(user.telegramId) === String(startup.telegramUserId)))) ||
    (typeof window !== 'undefined' && (() => {
      try {
        const localIds = JSON.parse(localStorage.getItem('starthub_my_startup_ids') || '[]');
        return Array.isArray(localIds) && localIds.includes(id);
      } catch {
        return false;
      }
    })())
  );

  const handleAddChangelog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changelogTitle.trim() || !changelogContent.trim()) return;

    setSubmittingChangelog(true);
    try {
      const res = await fetch(`/api/startups/${id}/changelogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: changelogVersion.trim() || 'Обновление',
          title: changelogTitle.trim(),
          content: changelogContent.trim(),
        }),
      });

      if (res.ok) {
        const newLog = await res.json();
        setStartup((prev: any) => ({
          ...prev,
          changelogs: [newLog, ...(prev.changelogs || [])],
        }));
        setChangelogTitle('');
        setChangelogContent('');
        setShowChangelogForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingChangelog(false);
    }
  };

  const [updatingStage, setUpdatingStage] = useState(false);
  const [updatingActive, setUpdatingActive] = useState(false);

  const handleToggleActive = async (newActive: boolean) => {
    setUpdatingActive(true);
    try {
      const res = await fetch(`/api/startups/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newActive }),
      });
      if (res.ok) {
        setStartup((prev: any) => ({ ...prev, isActive: newActive }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingActive(false);
    }
  };

  const handleUpdateStage = async (newStage: string) => {
    setUpdatingStage(true);
    try {
      const res = await fetch(`/api/startups/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (res.ok) {
        setStartup((prev: any) => ({ ...prev, stage: newStage }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStage(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-semibold text-xs sm:text-sm">Загружаем профиль стартапа...</p>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Стартап не найден</h2>
        <Link href="/" className="text-blue-600 font-bold text-sm hover:underline">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  const isInactive = startup.isActive === false;

  if (isInactive && !isOwner) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-2xs">
          <EyeOff className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
          Проект временно отключен
        </h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Автор стартапа временно скрыл этот проект из каталога или проводит обновление.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться в каталог стартапов</span>
        </Link>
      </div>
    );
  }

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Back button (navigates back to previous page or feed) */}
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.detail.back}</span>
      </button>

      {/* Banner for founder if inactive */}
      {isInactive && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <EyeOff className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-amber-950">
                {(t as any).detailExt?.inactiveBanner || 'Проект отключен и скрыт из публичного каталога'}
              </p>
              <p className="text-xs text-amber-800">
                {lang === 'uz'
                  ? 'Katalog tashrif buyuruvchilari bu loyihani ko‘rmaydi. Faqat siz to‘g‘ridan-to‘g‘ri havola orqali ochishingiz mumkin.'
                  : lang === 'en'
                  ? 'Catalog visitors cannot see this startup. Only you can view it via direct link.'
                  : 'Посетители каталога не видят этот проект. Только вы можете открыть эту страницу по прямой ссылке.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggleActive(true)}
            disabled={updatingActive}
            className="px-4 py-2 bg-[#FF5A1F] hover:bg-[#E04810] text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0 active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            {updatingActive ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{(t as any).detailExt?.activateBtn || 'Включить проект в каталог'}</span>
          </button>
        </div>
      )}

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs mb-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Square Logo */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 border border-slate-200 shadow-sm shrink-0 flex items-center justify-center">
              {startup.logoUrl && !logoError ? (
                <img
                  src={startup.logoUrl}
                  alt={startup.name}
                  className="w-full h-full object-cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <span className="font-black text-2xl sm:text-3xl text-[#FF5A1F] select-none">
                  {(startup.name || 'B').slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {startup.name}
                </h1>

                {isOwner ? (
                  <div className="relative inline-flex items-center">
                    <select
                      value={startup.stage || 'MVP / Прототип'}
                      disabled={updatingStage}
                      onChange={(e) => handleUpdateStage(e.target.value)}
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border appearance-none pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        startup.stage?.includes('продажи')
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : startup.stage?.includes('MVP')
                          ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                          : 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100'
                      }`}
                      title="Кликните, чтобы изменить стадию проекта (доступно автору)"
                    >
                      <option value="Только идея">{localizeStage('Только идея', lang)}</option>
                      <option value="MVP / Прототип">{localizeStage('MVP / Прототип', lang)}</option>
                      <option value="Есть первые продажи">{localizeStage('Есть первые продажи', lang)}</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-1.5 pointer-events-none text-slate-500" />
                  </div>
                ) : (
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                    startup.stage?.includes('продажи')
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : startup.stage?.includes('MVP')
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}>
                    {localizeStage(startup.stage, lang)}
                  </span>
                )}

                {startup.firstLaunch && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.card.firstLaunch}</span>
                  </span>
                )}
              </div>

              {/* Tagline */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mb-3 font-normal">
                {startup.tagline}
              </p>

              {/* Badges */}
              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                  {localizeCategory(startup.category, lang)}
                </span>

                <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {localizeRegion(startup.region, lang)}
                </span>

                <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {localizeNeed(startup.founderNeed, lang)}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex sm:flex-col items-center gap-2.5 w-full sm:w-auto shrink-0">
            {startup.websiteUrl ? (
              <a
                href={startup.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  try {
                    fetch(`/api/startups/${id}/click`, { method: 'POST' }).catch(() => {});
                  } catch (err) {}
                }}
                className="flex-1 sm:w-44 py-3 px-4 bg-[#18181B] hover:bg-[#27272A] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-black/10 active:scale-95"
              >
                <span>{t.detail.visitProduct}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <div
                className="flex-1 sm:w-44 py-3 px-3 bg-amber-50 border border-amber-200 text-amber-900 font-extrabold rounded-xl text-xs sm:text-xs flex items-center justify-center gap-1.5 text-center shadow-2xs"
                title="Проект находится на стадии идеи и еще разрабатывается"
              >
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{(t as any).detailExt?.ideaBadge || 'Стадия идеи (сайта нет)'}</span>
              </div>
            )}

            <button
              onClick={handleUpvote}
              className={`flex-1 sm:w-44 py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all active:scale-95 ${
                upvoted
                  ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-md shadow-orange-500/25'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-[#FF5A1F] hover:bg-[#FF5A1F]/5 hover:text-[#FF5A1F]'
              }`}
            >
              <ChevronUp className="w-5 h-5 stroke-[3]" />
              <span>{upvoted ? ((t as any).detailExt?.supported || 'Поддержано') : t.detail.upvoteBtn} ({upvotesCount})</span>
            </button>

            <button
              onClick={handleShare}
              className="py-3 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors sm:w-44"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? ((t as any).detailExt?.copied || 'Скопировано!') : t.detail.share}</span>
            </button>

            {isOwner && !isInactive && (
              <button
                onClick={() => handleToggleActive(false)}
                disabled={updatingActive}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-500 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors sm:w-44 cursor-pointer"
                title="Скрыть проект из каталога"
              >
                {updatingActive ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{(t as any).detailExt?.deactivateBtn || 'Отключить проект'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Media / Screenshot Banner (Shown ONLY if founder uploaded a real screenshot) */}
        {startup.bannerUrl && (
          <div className="mt-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video max-h-96 relative bg-slate-900">
              <img
                src={startup.bannerUrl}
                alt={`${startup.name} preview`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Early Adopter Bonus Card (Highlighted) */}
        {startup.earlyUserOffer && (
          <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 border-2 border-emerald-300 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-wider mb-1 shadow-2xs">
                  <Gift className="w-3.5 h-3.5" />
                  <span>{t.detail.earlyOffer.title}</span>
                </div>
                <p className="text-slate-700 text-xs font-normal">
                  {t.detail.earlyOffer.desc}
                </p>
                <p className="text-slate-900 text-sm sm:text-base font-extrabold leading-snug pt-1 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{startup.earlyUserOffer}</span>
                </p>
              </div>

              <button
                onClick={handleClaimBonus}
                className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all shrink-0 flex items-center gap-2 active:scale-95 ${
                  claimed
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                }`}
              >
                {claimed ? <CheckCircle2 className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                <span>{claimed ? 'Оффер активирован!' : t.detail.earlyOffer.claimBtn}</span>
              </button>
            </div>

            {claimToast && (
              <div className="mt-3 text-xs text-emerald-800 font-bold bg-white/90 p-2.5 rounded-xl border border-emerald-200 animate-in fade-in flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>{t.detail.earlyOffer.claimedText}</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Tabs: Pitch / Changelog (and Investor if enabled) */}
        <div className="flex items-center gap-3 border-b border-slate-200 mt-8 pb-1">
          <button
            onClick={() => setActiveTab('pitch')}
            className={`pb-3 px-3 text-sm font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'pitch'
                ? 'border-[#FF5A1F] text-[#FF5A1F]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{(t as any).detailExt?.structuredPitch || 'Структурированный питч'}</span>
          </button>

          <button
            onClick={() => setActiveTab('changelog')}
            className={`pb-3 px-3 text-sm font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'changelog'
                ? 'border-[#FF5A1F] text-[#FF5A1F]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>{t.detail.changelog.title}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {startup.changelogs?.length || 0}
            </span>
          </button>

          {/* Reserved for Phase 2 via Feature Flag */}
          {FEATURES.ENABLE_INVESTOR_MODE && (
            <button
              onClick={() => setActiveTab('investor')}
              className={`pb-3 px-3 text-sm font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'investor'
                  ? 'border-emerald-600 text-emerald-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-emerald-700'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Панель для инвесторов</span>
            </button>
          )}
        </div>

        {/* Tab 1: Structured Pitch */}
        {activeTab === 'pitch' && (
          <div className="mt-6 space-y-6 animate-in fade-in">
            {/* Problem block */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100">
              <h3 className="font-extrabold text-sm sm:text-base text-rose-950 mb-2 flex items-center gap-2">
                <span>{t.detail.pitchTabs.problem}</span>
              </h3>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {startup.problem || startup.description}
              </p>
            </div>

            {/* Solution block */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
              <h3 className="font-extrabold text-sm sm:text-base text-blue-950 mb-2 flex items-center gap-2">
                <span>{t.detail.pitchTabs.solution}</span>
              </h3>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {startup.solution || startup.description}
              </p>
            </div>

            {/* Target Audience block */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mb-2 flex items-center gap-2">
                <span>{t.detail.pitchTabs.target}</span>
              </h3>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                {startup.targetAudience || 'Широкая аудитория пользователей и бизнес-клиентов в Узбекистане.'}
              </p>
            </div>

            {/* Founder Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{startup.founderName}</h4>
                  <p className="text-xs text-slate-500">{startup.founderBio || (t as any).detailExt?.founderTitle || 'Основатель стартапа'}</p>
                </div>
              </div>

              {startup.telegramContact && (() => {
                const info = formatContactLink(startup.telegramContact, lang);
                return (
                  <a
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#18181B] hover:bg-black text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    {info.type === 'phone' ? (
                      <Phone className="w-3.5 h-3.5 text-[#FF5A1F]" />
                    ) : info.type === 'link' ? (
                      <ExternalLink className="w-3.5 h-3.5 text-[#FF5A1F]" />
                    ) : (
                      <MessageCircle className="w-3.5 h-3.5 text-[#FF5A1F]" />
                    )}
                    <span>{info.label}</span>
                  </a>
                );
              })()}
            </div>
          </div>
        )}

        {/* Tab 2: Changelog / Build in Public */}
        {activeTab === 'changelog' && (
          <div className="mt-6 space-y-4 animate-in fade-in">
            {/* Header with Publish Button for Founder */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{t.detail.changelog.title}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {t.detail.changelog.subtitle}
                </p>
              </div>

              {isOwner && !showChangelogForm && (
                <button
                  onClick={() => setShowChangelogForm(true)}
                  className="px-3.5 py-2 bg-[#FF5A1F] hover:bg-[#E04810] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.detail.changelog.publishBtn}</span>
                </button>
              )}
            </div>

            {/* Form for Founder */}
            {isOwner && showChangelogForm && (
              <form onSubmit={handleAddChangelog} className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                    Новая запись в дневник проекта
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowChangelogForm(false)}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Отмена
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Версия (тег)</label>
                    <input
                      type="text"
                      value={changelogVersion}
                      onChange={(e) => setChangelogVersion(e.target.value)}
                      placeholder="v1.1 или Релиз"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Заголовок релиза</label>
                    <input
                      type="text"
                      value={changelogTitle}
                      onChange={(e) => setChangelogTitle(e.target.value)}
                      placeholder="Например: Запустили прием платежей и исправили авторизацию"
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Что изменилось / сделано</label>
                  <textarea
                    value={changelogContent}
                    onChange={(e) => setChangelogContent(e.target.value)}
                    placeholder="Опишите, какие баги закрыли, что протестировали или какую фичу добавили..."
                    rows={3}
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowChangelogForm(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-white"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={submittingChangelog}
                    className="px-4 py-1.5 bg-[#FF5A1F] hover:bg-[#E04810] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    {submittingChangelog ? 'Публикация...' : 'Опубликовать'}
                  </button>
                </div>
              </form>
            )}

            {startup.changelogs && startup.changelogs.length > 0 ? (
              startup.changelogs.map((log: any) => (
                <div key={log.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs px-2.5 py-0.5 rounded-md bg-[#FF5A1F] text-white">
                        {log.version}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{log.title}</h4>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(log.date).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {log.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-700 font-bold text-xs sm:text-sm mb-1">
                  Записей в дневнике пока нет
                </p>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  {isOwner
                    ? t.detail.changelog.emptyOwner
                    : t.detail.changelog.emptyGuest}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Investor Panel (Only if Enabled) */}
        {FEATURES.ENABLE_INVESTOR_MODE && activeTab === 'investor' && (
          <div className="mt-6 space-y-6 animate-in fade-in p-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 rounded-3xl border border-emerald-200">
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-emerald-200">
              <div>
                <h3 className="text-lg font-black text-emerald-950 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-700" />
                  <span>{t.detail.investorPanel.title}</span>
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  {t.detail.investorPanel.subtitle}
                </p>
              </div>

              <button
                onClick={() => setShowContactModal(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all active:scale-95"
              >
                <span>{t.detail.investorPanel.contactBtn}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {t.detail.investorPanel.ask}
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-900">
                  {startup.investorAsk || '$35,000'}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Доля: {startup.investorEquity || '7-10%'}
                </span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Текущий MRR
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {startup.mrrMetrics || '$0 (Pre-revenue)'}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">Ежемесячная выручка</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Пользователи / Traction
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {startup.userMetrics || 'Ранний бета-тест'}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">Активная аудитория</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Structured Comments Section */}
      <section id="comments" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
        <div className="pb-6 border-b border-slate-100">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span>{t.detail.comments.title}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {startup.comments?.length || 0}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.detail.comments.subtitle}
          </p>
        </div>

        {/* Structured comment form */}
        <form onSubmit={handleAddComment} className="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Выберите тип фидбека:
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { key: 'Идея', label: t.detail.comments.tags.idea, color: 'hover:border-amber-400' },
                { key: 'Баг', label: t.detail.comments.tags.bug, color: 'hover:border-rose-400' },
                { key: 'Похвала', label: t.detail.comments.tags.praise, color: 'hover:border-emerald-400' },
                { key: 'Вопрос', label: t.detail.comments.tags.question, color: 'hover:border-blue-400' },
              ].map((tg) => (
                <button
                  key={tg.key}
                  type="button"
                  onClick={() => setCommentTag(tg.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    commentTag === tg.key
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : `bg-white text-slate-700 border-slate-200 ${tg.color}`
                  }`}
                >
                  {tg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              placeholder={t.detail.comments.authorPlaceholder}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <select
              value={commentRole}
              onChange={(e) => setCommentRole(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Тестер">Бета-тестер</option>
              <option value="Фаундер">Другой фаундер</option>
              <option value="Пользователь">Пользователь</option>
            </select>
          </div>

          <textarea
            required
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t.detail.comments.placeholder}
            className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submittingComment}
              className="px-6 py-2.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/25 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingComment ? 'Отправляем...' : t.detail.comments.sendBtn}</span>
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-3.5">
          {startup.comments && startup.comments.length > 0 ? (
            startup.comments.map((comment: any) => {
              const tagIcons: Record<string, string> = {
                'Идея': 'Идея',
                'Баг': 'Нашел баг',
                'Похвала': 'Похвала',
                'Вопрос': 'Вопрос',
              };

              return (
                <div
                  key={comment.id}
                  className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {comment.author}
                      </span>
                      {comment.role && (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {comment.role}
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        {tagIcons[comment.tag] || comment.tag}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCommentStatusToggle(comment.id, comment.status)}
                      title="Кликните, чтобы изменить статус"
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full transition-all border ${
                        comment.status === 'Решено'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : comment.status === 'Взято в работу'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ✓ {comment.status}
                    </button>
                  </div>

                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {comment.content}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-center py-6 text-slate-400 text-xs">
              {t.detail.comments.empty}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
