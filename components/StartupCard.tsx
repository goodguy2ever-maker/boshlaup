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

  const getStageBadge = (stg: string) => {
    if (stg.includes('продажи') || stg.includes('Sales')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    }
    if (stg.includes('MVP') || stg.includes('Прототип')) {
      return 'bg-amber-50 text-amber-800 border-amber-200/80';
    }
    return 'bg-zinc-100 text-zinc-700 border-zinc-200';
  };

  return (
    <div className="group relative bg-white rounded-xl p-4 sm:p-5 border border-zinc-200/90 hover:border-zinc-300 transition-all duration-150 shadow-subtle hover:shadow-card flex flex-col gap-3">
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Rank */}
        {rank !== undefined && (
          <div className="hidden sm:flex flex-col items-center justify-center font-bold text-zinc-300 group-hover:text-zinc-600 transition-colors text-xs w-4 pt-2.5">
            {rank}
          </div>
        )}

        {/* Square Logo */}
        <Link href={`/startups/${startup.id}`} className="shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-zinc-50 border border-zinc-200/80 relative">
            {startup.logoUrl ? (
              <img
                src={startup.logoUrl}
                alt={startup.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#FF5A1F] bg-orange-50/60">
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
              className="font-bold text-sm sm:text-base text-zinc-950 hover:text-[#FF5A1F] transition-colors truncate"
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
              className="text-zinc-400 hover:text-zinc-700 transition-colors p-0.5 rounded"
              title="Перейти на сайт"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Stage badge */}
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getStageBadge(startup.stage)}`}>
              {startup.stage}
            </span>

            {/* First launch badge */}
            {startup.firstLaunch && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                <span>{t.card.firstLaunch}</span>
              </span>
            )}
          </div>

          {/* 1-line Tagline */}
          <p className="text-zinc-600 text-xs sm:text-sm line-clamp-1 mb-2.5 font-normal leading-relaxed">
            {startup.tagline}
          </p>

          {/* Badges and metadata */}
          <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-500">
            {/* Founder Need Pill (Key Information) */}
            {startup.founderNeed && startup.founderNeed !== 'Все' && (
              <span className="text-[11px] font-medium text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200/80">
                Ищет: <strong className="font-semibold">{startup.founderNeed}</strong>
              </span>
            )}

            {/* Category */}
            <span className="text-[11px] font-medium text-zinc-600 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200/60">
              {startup.category}
            </span>

            {/* Region / City */}
            <span className="inline-flex items-center gap-1 font-medium text-zinc-500 text-[11px]">
              <MapPin className="w-3 h-3 text-zinc-400" />
              <span>{startup.region}</span>
            </span>

            {/* Comments count */}
            <Link
              href={`/startups/${startup.id}#comments`}
              className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-700 transition-colors ml-auto text-[11px]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{startup.commentCount || 0}</span>
            </Link>
          </div>
        </div>

        {/* Upvote Button (Product Hunt signature clean button) */}
        <button
          onClick={handleUpvote}
          aria-label="Upvote project"
          className={`shrink-0 flex flex-col items-center justify-center w-12 h-14 sm:w-14 sm:h-14 rounded-lg border transition-all duration-150 px-1 active:scale-95 ${
            animating ? 'scale-105' : ''
          } ${
            upvoted
              ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs font-bold'
              : 'bg-white border-zinc-200 text-zinc-800 hover:border-[#FF5A1F] hover:text-[#FF5A1F] hover:bg-orange-50/30'
          }`}
        >
          <ChevronUp className={`w-4 h-4 stroke-[2.5] transition-transform ${upvoted ? 'text-white' : 'text-zinc-400 group-hover:text-[#FF5A1F]'}`} />
          <span className="text-xs font-bold mt-0.5">{upvotesCount}</span>
        </button>
      </div>

      {/* Investor Mode snippet bar (Feature Flagged for Phase 2) */}
      {FEATURES.ENABLE_INVESTOR_MODE && investorMode && (
        <div className="pt-2 mt-1 border-t border-emerald-100 bg-emerald-50/60 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-2.5 sm:px-4 rounded-b-xl flex items-center justify-between text-xs text-emerald-950 flex-wrap gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              {t.card.investorSnippet} <strong className="font-semibold text-emerald-900">{startup.investorAsk || 'Открыт'}</strong> {startup.investorEquity ? `(${startup.investorEquity})` : ''}
            </span>
            <span className="text-emerald-400">•</span>
            <span>MRR <strong>{startup.mrrMetrics || '$0'}</strong></span>
          </div>

          <Link
            href={`/startups/${startup.id}?tab=investor`}
            className="text-emerald-800 hover:text-emerald-950 font-semibold text-[11px] ml-auto"
          >
            Инвест-детали →
          </Link>
        </div>
      )}
    </div>
  );
}
