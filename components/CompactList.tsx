'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ChevronUp,
  MapPin,
  ExternalLink,
  Gift,
  MessageCircle,
  Briefcase
} from 'lucide-react';

interface CompactListProps {
  startups: any[];
}

export default function CompactList({ startups }: CompactListProps) {
  const { t, isUpvoted, toggleUpvote, investorMode } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
      {startups.map((st, index) => {
        const upvoted = isUpvoted(st.id);
        const upvotesCount = st.upvotes + (upvoted ? 1 : 0);

        return (
          <div
            key={st.id}
            className="group flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50/70 transition-colors gap-3"
          >
            {/* Rank & Logo */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <span className="font-mono text-xs font-bold text-slate-300 w-4 text-center group-hover:text-blue-600 transition-colors">
                {index + 1}
              </span>

              <Link href={`/startups/${st.id}`} className="shrink-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs group-hover:scale-105 transition-transform">
                  <img
                    src={st.logoUrl || ''}
                    alt={st.name}
                    className="w-full h-full object-contain p-0.5 bg-white"
                  />
                </div>
              </Link>

              {/* Title, Tagline, Tags */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <Link
                    href={`/startups/${st.id}`}
                    className="font-extrabold text-sm text-slate-900 hover:text-[#FF5A1F] transition-colors truncate"
                  >
                    {st.name}
                  </Link>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 text-slate-600">
                    {st.category}
                  </span>
                  {st.hasTesterBonus && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#14B8A6] text-white shadow-2xs">
                      <Gift className="w-3 h-3" />
                      <span>{t.card.testerBonus}</span>
                    </span>
                  )}
                  {investorMode && st.investorAsk && (
                    <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      Раунд: {st.investorAsk}
                    </span>
                  )}
                </div>

                <p className="text-slate-500 text-xs truncate max-w-xl font-normal">
                  {st.tagline}
                </p>
              </div>
            </div>

            {/* Region & Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                <MapPin className="w-3 h-3" />
                <span>{st.region}</span>
              </span>

              <Link
                href={`/startups/${st.id}#comments`}
                className="hidden md:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{st.commentCount || 0}</span>
              </Link>

              {/* Upvote button */}
              <button
                onClick={() => toggleUpvote(st.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                  upvoted
                    ? 'bg-[#FF5A1F] text-white border-[#FF5A1F] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-[#FF5A1F] hover:text-[#FF5A1F]'
                }`}
              >
                <ChevronUp className="w-3.5 h-3.5 stroke-[3]" />
                <span>{upvotesCount}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
