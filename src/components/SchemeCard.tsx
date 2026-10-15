import React from 'react';
import { 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { Language, Scheme } from '../types';
import { translations } from '../data/translations';

interface SchemeCardProps {
  scheme: Scheme;
  language: Language;
  isBookmarked: boolean;
  onToggleBookmark: (schemeId: string) => void;
  onViewDetails: (scheme: Scheme) => void;
  onShare: (scheme: Scheme) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  language,
  isBookmarked,
  onToggleBookmark,
  onViewDetails,
  onShare,
}) => {
  const t = translations[language].schemesList;

  const categoryName = translations[language].categories.items[scheme.category]?.name || scheme.category;

  const levelBadgeClass = scheme.level === 'Maharashtra' 
    ? 'bg-amber-50 text-amber-900 border-amber-300'
    : 'bg-blue-50 text-blue-900 border-blue-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Banner with Badges */}
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Category Pill */}
            <span className="text-2xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {categoryName}
            </span>

            {/* Level Badge (Central / Maharashtra) */}
            <span className={`text-2xs font-semibold px-2 py-0.5 rounded-full border ${levelBadgeClass}`}>
              {scheme.level === 'Maharashtra' ? 'महाराष्ट्र शासन' : 'भारत सरकार (Central)'}
            </span>
          </div>

          {/* Bookmark & Share Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onShare(scheme)}
              title={t.share}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleBookmark(scheme.id)}
              title={isBookmarked ? t.bookmarked : t.bookmark}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isBookmarked 
                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' 
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Scheme Title */}
        <h3 
          onClick={() => onViewDetails(scheme)}
          className="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors cursor-pointer leading-snug line-clamp-2 mb-2"
        >
          {scheme.title[language]}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
          {scheme.shortDescription[language]}
        </p>

        {/* Key Highlight Banner */}
        {scheme.keyHighlight && (
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/70 border border-emerald-200/80 flex items-start gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-2xs font-bold text-emerald-900 uppercase tracking-wide block">
                {t.keyHighlightLabel}
              </span>
              <span className="text-xs font-bold text-emerald-800">
                {scheme.keyHighlight[language]}
              </span>
            </div>
          </div>
        )}

        {/* Issuing Authority */}
        <div className="flex items-center gap-1.5 text-2xs text-slate-500 mb-2">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{scheme.authority}</span>
        </div>
      </div>

      {/* Card Footer with Verification & View Details Button */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Verification Status */}
        <div className="flex items-center gap-1 text-2xs text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{scheme.lastVerifiedDate}</span>
        </div>

        {/* Primary View Details Button */}
        <button
          onClick={() => onViewDetails(scheme)}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-amber-600 transition-colors cursor-pointer group-hover:translate-x-0.5"
        >
          <span>{t.viewDetails}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
