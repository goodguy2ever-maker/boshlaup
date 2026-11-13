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
    <div className="bg-white rounded-xl border border-zinc-200/90 shadow-subtle divide-y divide-zinc-100 overflow-hidden">
      {startups.map((st, index) => {
        const upvoted = isUpvoted(st.id);
        const upvotesCount = st.upvotes + (upvoted ? 1 : 0);

        return (
          <div
            key={st.id}
            className="group flex items-center justify-between p-3 sm:p-3.5 hover:bg-zinc-50/70 transition-colors gap-3"
          >
            {/* Rank & Logo */}
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
              <span className="font-mono text-xs font-semibold text-zinc-300 w-4 text-center group-hover:text-zinc-700 transition-colors">
                {index + 1}
              </span>

              <Link href={`/startups/${st.id}`} className="shrink-0">
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
                  <img
                    src={st.logoUrl || ''}
                    alt={st.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              {/* Title, Tagline, Tags */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <Link
                    href={`/startups/${st.id}`}
                    className="font-bold text-xs sm:text-sm text-zinc-950 hover:text-[#FF5A1F] transition-colors truncate"
                  >
                    {st.name}
                  </Link>
                  <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600">
                    {st.category}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-400">
                    {st.stage}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs line-clamp-1 leading-normal">
                  {st.tagline}
                </p>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/startups/${st.id}#comments`}
                className="hidden sm:inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-700 text-xs px-2 py-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{st.commentCount || 0}</span>
              </Link>

              <button
                type="button"
                onClick={() => toggleUpvote(st.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                  upvoted
                    ? 'bg-[#FF5A1F] text-white border-[#FF5A1F]'
                    : 'bg-white border-zinc-200 text-zinc-700 hover:border-[#FF5A1F] hover:text-[#FF5A1F]'
                }`}
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>{upvotesCount}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
