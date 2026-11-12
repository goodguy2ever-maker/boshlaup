'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Briefcase,
  ExternalLink,
  ChevronUp,
  MapPin,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface InvestorTableProps {
  startups: any[];
}

export default function InvestorTable({ startups }: InvestorTableProps) {
  const { isUpvoted, toggleUpvote } = useApp();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="p-4 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950">
            Инвестиционная таблица сделок (Dealflow Table)
          </h3>
        </div>
        <span className="text-[11px] text-emerald-800 font-semibold">
          Всего проектов: {startups.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Стартап</th>
              <th className="py-3 px-3">Сфера</th>
              <th className="py-3 px-3">Стадия</th>
              <th className="py-3 px-3">Локация</th>
              <th className="py-3 px-3">MRR</th>
              <th className="py-3 px-3">Трэкшн</th>
              <th className="py-3 px-3">Раунд / Доля</th>
              <th className="py-3 px-4 text-right">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {startups.map((st) => (
              <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={st.logoUrl || ''}
                      alt={st.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <Link href={`/startups/${st.id}`} className="font-extrabold text-slate-900 hover:text-blue-600 block">
                        {st.name}
                      </Link>
                      <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[180px]">
                        {st.tagline}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                    {st.category}
                  </span>
                </td>

                <td className="py-3 px-3">
                  <span className="text-[11px] font-semibold text-slate-700">
                    {st.stage}
                  </span>
                </td>

                <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                  📍 {st.region}
                </td>

                <td className="py-3 px-3 font-bold text-slate-900">
                  {st.mrrMetrics || '$0'}
                </td>

                <td className="py-3 px-3 text-slate-600">
                  {st.userMetrics || 'Бета'}
                </td>

                <td className="py-3 px-3">
                  <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {st.investorAsk || 'Открыт'} {st.investorEquity ? `(${st.investorEquity})` : ''}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/startups/${st.id}?tab=investor`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-2xs"
                  >
                    <span>Контакты</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
