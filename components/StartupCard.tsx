'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { FEATURES } from '@/lib/config';
import { localizeStage, localizeRegion, localizeCategory, localizeNeed } from '@/lib/localize';
import {
  MapPin,
  ExternalLink,
  MessageCircle,
  ChevronUp,
  Sparkles,
  Gift,
  Briefcase,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

interface StartupCardProps {
  startup: {
    id: string;
    name: string;
    tagline: string;
    description: string;
    websiteUrl: string;
    category: string;
    region: string;
    logoUrl?: string | null;
    upvotes: number;
    rating: number;
    commentCount?: number;
    stage: string;
    founderNeed: string;
    firstLaunch: boolean;
    hasTesterBonus: boolean;
    isActive?: boolean;
    earlyUserOffer?: string | null;
    investorAsk?: string | null;
    investorEquity?: string | null;
    userMetrics?: string | null;
    mrrMetrics?: string | null;
    telegramContact?: string | null;
  };
  rank?: number;
  isOwner?: boolean;
  onToggleActive?: (id: string, newActive: boolean) => void;
  isToggling?: boolean;
}

export default function StartupCard({ startup, rank, isOwner, onToggleActive, isToggling }: StartupCardProps) {
  const { t, lang, investorMode, isUpvoted, toggleUpvote } = useApp();
  const upvoted = isUpvoted(startup.id);
  const [upvotesCount, setUpvotesCount] = useState(startup.upvotes);
  const [animating, setAnimating] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;

    setIsPending(true);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    try {
      const nowUpvoted = await toggleUpvote(startup.id);
      setUpvotesCount(prev => nowUpvoted ? prev + 1 : Math.max(0, prev - 1));
    } finally {
      setIsPending(false);
    }
  };

  const isInactive = startup.isActive === false;

  const getStageColor = (stg: string) => {
    if (stg.includes('продажи') || stg.includes('Sales') || stg.includes('savdolar')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (stg.includes('MVP') || stg.includes('Прототип')) {
      return 'bg-orange-50 text-[#FF5A1F] border-orange-200';
    }
    return 'bg-purple-50 text-purple-700 border-purple-200';
  };

  return (
    <div
      className={`group relative rounded-2xl p-4 sm:p-5 border-2 transition-all duration-200 flex flex-col gap-3 ${
        isInactive
          ? 'bg-slate-100/80 border-dashed border-slate-300 opacity-70 grayscale hover:grayscale-0 hover:opacity-100'
          : 'bg-white border-slate-200/90 hover:border-[#FF5A1F] hover:shadow-xl hover:shadow-orange-500/10'
      }`}
    >
      {/* Inactive Project Notice & Re-enable button */}
      {isInactive && (
        <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-slate-200/80 border border-slate-300 text-slate-700 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>Проект отключен и скрыт из публичного каталога</span>
          </div>
          {isOwner && onToggleActive && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleActive(startup.id, true);
              }}
              disabled={isToggling}
              className="px-3 py-1.5 rounded-lg bg-[#FF5A1F] hover:bg-[#E04810] text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
            >
              {isToggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
              <span>Включить проект</span>
            </button>
          )}
        </div>
      )}

      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Rank number */}
        {rank !== undefined && (
          <div className="hidden sm:flex flex-col items-center justify-center font-black text-slate-300 group-hover:text-[#FF5A1F] transition-colors text-sm w-4 pt-2">
            {rank}
          </div>
        )}

        {/* Square Logo */}
        <Link href={`/startups/${startup.id}`} className="shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform relative flex items-center justify-center">
            {startup.logoUrl && !logoError ? (
              <img
                src={startup.logoUrl}
                alt={startup.name}
                className="w-full h-full object-contain p-1"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-lg text-[#FF5A1F] bg-orange-50 select-none">
                {startup.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link
              href={`/startups/${startup.id}`}
              className="font-extrabold text-base sm:text-lg text-slate-900 hover:text-[#FF5A1F] transition-colors truncate"
            >
              {startup.name}
            </Link>

            {/* Visit site external link (only if website is provided) */}
            {startup.websiteUrl ? (
              <a
                href={startup.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    fetch(`/api/startups/${startup.id}/click`, { method: 'POST' }).catch(() => {});
                  } catch (err) {}
                }}
                className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded"
                title="Перейти на сайт"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : null}

            {/* Stage badge */}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStageColor(startup.stage)}`}>
              {localizeStage(startup.stage, lang)}
            </span>
          </div>

          {/* 1-line Tagline */}
          <p className="text-slate-600 text-xs sm:text-sm line-clamp-1 mb-2 font-normal leading-relaxed">
            {startup.tagline}
          </p>

          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
            {/* Early tester bonus badge (Teal #14B8A6 accent) */}
            {startup.hasTesterBonus && (
              <span className="inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-0.5 rounded-full bg-[#14B8A6] text-white shadow-xs">
                <Gift className="w-3 h-3" />
                <span>{t.card.testerBonus}</span>
              </span>
            )}

            {/* Category */}
            <span className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
              {localizeCategory(startup.category, lang)}
            </span>

            {/* Region / City */}
            <span className="inline-flex items-center gap-1 font-medium text-slate-500 text-[11px]">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{localizeRegion(startup.region, lang)}</span>
            </span>

            {/* Founder need */}
            <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-semibold border border-blue-100">
              {localizeNeed(startup.founderNeed, lang)}
            </span>

            {/* Comments count */}
            <Link
              href={`/startups/${startup.id}#comments`}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors ml-auto text-[11px]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{startup.commentCount || 0} {t.card.comments}</span>
            </Link>
          </div>
        </div>

        {/* Upvote Button (Product Hunt signature orange) */}
        <button
          onClick={isInactive ? undefined : handleUpvote}
          disabled={isInactive}
          className={`shrink-0 flex flex-col items-center justify-center min-w-[54px] sm:min-w-[60px] h-16 sm:h-[68px] rounded-2xl border transition-all duration-150 px-2 ${
            isInactive
              ? 'bg-slate-200/70 border-slate-300 text-slate-400 cursor-not-allowed'
              : animating
              ? 'scale-110'
              : 'active:scale-90'
          } ${
            !isInactive &&
            (upvoted
              ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-md shadow-orange-500/25 font-black'
              : 'bg-white border-slate-200 text-slate-700 hover:border-[#FF5A1F] hover:bg-[#FF5A1F]/5 hover:text-[#FF5A1F]')
          }`}
          title={isInactive ? 'Проект отключен' : 'Поддержать проект'}
        >
          <ChevronUp
            className={`w-5 h-5 stroke-[3] transition-transform ${
              isInactive ? 'text-slate-400' : upvoted ? 'text-white' : 'text-slate-400 group-hover:text-[#FF5A1F]'
            }`}
          />
          <span className="text-xs sm:text-sm font-black mt-0.5">{upvotesCount}</span>
        </button>
      </div>

      {/* Founder Control Bar (Profile view) */}
      {isOwner && onToggleActive && !isInactive && (
        <div className="flex items-center justify-between pt-2.5 mt-0.5 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Активен в каталоге</span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleActive(startup.id, false);
            }}
            disabled={isToggling}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="Скрыть проект из каталога"
          >
            {isToggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>Отключить проект</span>
          </button>
        </div>
      )}

      {/* Investor Mode snippet bar (Feature Flagged for Phase 2) */}
      {FEATURES.ENABLE_INVESTOR_MODE && investorMode && (
        <div className="pt-2.5 mt-1 border-t border-emerald-100 bg-emerald-50/60 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3 sm:px-5 rounded-b-2xl flex items-center justify-between text-xs text-emerald-950 flex-wrap gap-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <Briefcase className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              {t.card.investorSnippet} <strong className="font-bold text-emerald-900">{startup.investorAsk || 'Открыт'}</strong> {startup.investorEquity ? `(${startup.investorEquity})` : ''}
            </span>
            <span className="text-emerald-400">•</span>
            <span>{t.card.mrr} <strong>{startup.mrrMetrics || '$0'}</strong></span>
            <span className="text-emerald-400">•</span>
            <span>{t.card.users} <strong>{startup.userMetrics || '—'}</strong></span>
          </div>

          <Link
            href={`/startups/${startup.id}?tab=investor`}
            className="text-emerald-800 hover:text-emerald-950 font-bold underline text-[11px] ml-auto"
          >
            Инвест-детали & Контакты →
          </Link>
        </div>
      )}
    </div>
  );
}
