import React from 'react';
import { History, ArrowRight } from 'lucide-react';
import type { Language, Scheme } from '../types';
import { translations } from '../data/translations';
import { schemesData } from '../data/schemesData';

interface RecentlyViewedProps {
  language: Language;
  recentIds: string[];
  onViewScheme: (scheme: Scheme) => void;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  language,
  recentIds,
  onViewScheme,
}) => {
  const t = translations[language].recentSection;

  const recentSchemes = recentIds
    .map((id) => schemesData.find((s) => s.id === id))
    .filter((s): s is Scheme => Boolean(s));

  if (recentSchemes.length === 0) return null;

  return (
    <div className="bg-slate-100/70 border-b border-slate-200 py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider shrink-0">
          <History className="w-4 h-4 text-blue-900" />
          <span>{t.title}:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {recentSchemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => onViewScheme(scheme)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs font-semibold text-slate-800 hover:text-amber-900 transition-all shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span className="truncate max-w-[200px]">{scheme.title[language]}</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
