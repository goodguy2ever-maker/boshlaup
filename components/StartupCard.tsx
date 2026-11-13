'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { FEATURES } from '@/lib/config';
import {
  MapPin,
  ExternalLink,
  MessageCircle,
  ChevronUp,
  Sparkles,
  Gift,
  Briefcase
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
    earlyUserOffer?: string | null;
    investorAsk?: string | null;
    investorEquity?: string | null;
    userMetrics?: string | null;
    mrrMetrics?: string | null;
    telegramContact?: string | null;
  };
  rank?: number;
}

export default function StartupCard({ startup, rank }: StartupCardProps) {
  const { t, investorMode, isUpvoted, toggleUpvote } = useApp();
  const upvoted = isUpvoted(startup.id);
  const [upvotesCount, setUpvotesCount] = useState(startup.upvotes);
  const [animating, setAnimating] = useState(false);
  const [isPending, setIsPending] = useState(false);

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
    <div className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-[#FF5A1F]/40 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-200 flex flex-col gap-3">
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Rank number */}
        {rank !== undefined && (
          <div className="hidden sm:flex flex-col items-center justify-center font-black text-slate-300 group-hover:text-[#FF5A1F] transition-colors text-sm w-4 pt-2">
            {rank}
          </div>
        )}

        {/* Square Logo */}
        <Link href={`/startups/${startup.id}`} className="shrink-0">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform relative">
            {startup.logoUrl ? (
              <img
                src={startup.logoUrl}
                alt={startup.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-lg text-[#FF5A1F] bg-orange-50">
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

            {/* Visit site external link */}
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

            {/* Stage badge */}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getStageColor(startup.stage)}`}>
              {startup.stage}
            </span>

            {/* First launch badge */}
            {startup.firstLaunch && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{t.card.firstLaunch}</span>
              </span>
            )}
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
              {startup.category}
            </span>

            {/* Region / City */}
            <span className="inline-flex items-center gap-1 font-medium text-slate-500 text-[11px]">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{startup.region}</span>
            </span>

            {/* Founder need */}
            <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-semibold border border-blue-100">
              {startup.founderNeed}
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
          onClick={handleUpvote}
          className={`shrink-0 flex flex-col items-center justify-center min-w-[54px] sm:min-w-[60px] h-16 sm:h-[68px] rounded-2xl border transition-all duration-150 px-2 active:scale-90 ${
            animating ? 'scale-110' : ''
          } ${
            upvoted
              ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-md shadow-orange-500/25 font-black'
              : 'bg-white border-slate-200 text-slate-700 hover:border-[#FF5A1F] hover:bg-[#FF5A1F]/5 hover:text-[#FF5A1F]'
          }`}
        >
          <ChevronUp className={`w-5 h-5 stroke-[3] transition-transform ${upvoted ? 'text-white' : 'text-slate-400 group-hover:text-[#FF5A1F]'}`} />
          <span className="text-xs sm:text-sm font-black mt-0.5">{upvotesCount}</span>
        </button>
      </div>

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
