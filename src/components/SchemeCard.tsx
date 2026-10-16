import React from 'react';
import {
  Bookmark,
  Share2,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight,
  ExternalLink,
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

const categoryGradients: Record<string, string> = {
  students: 'from-blue-600 to-indigo-700',
  scholarships: 'from-blue-700 to-indigo-800',
  farmers: 'from-emerald-600 to-teal-700',
  women: 'from-rose-600 to-pink-700',
  disability: 'from-purple-600 to-indigo-700',
  seniors: 'from-amber-600 to-orange-700',
  employment: 'from-sky-600 to-blue-700',
  healthcare: 'from-rose-600 to-red-700',
  financial: 'from-teal-600 to-emerald-700',
};

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
  const gradientClass = categoryGradients[scheme.category] || 'from-blue-600 to-indigo-700';

  const schemeTitle = scheme.title?.[language] || scheme.name?.[language] || scheme.title?.en || '';
  const schemeDesc = scheme.shortDescription?.[language] || scheme.shortDescription?.en || '';
  const schemeHighlight = scheme.keyHighlight?.[language] || scheme.keyHighlight?.en || '';

  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white hover:border-blue-900/40 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">

      {/* ── Gradient Top Accent Stripe ── */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradientClass}`} />

      {/* ── Card Body ── */}
      <div className="p-5 pb-4 flex-1 flex flex-col">
        {/* Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {categoryName}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              scheme.level === 'Maharashtra'
                ? 'border-amber-300 bg-amber-50 text-amber-900'
                : 'border-blue-200 bg-blue-50 text-blue-900'
            }`}>
              {scheme.level === 'Maharashtra' ? 'महाराष्ट्र शासन' : 'भारत सरकार'}
            </span>
            {scheme.status && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {scheme.status}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
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
                  ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                  : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(scheme)}
          className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-900 transition-colors cursor-pointer leading-snug line-clamp-2 mb-2"
        >
          {schemeTitle}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 font-normal">
          {schemeDesc}
        </p>

        {/* Key Highlight */}
        {schemeHighlight && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-start gap-2 mb-3 mt-auto">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-black text-emerald-950 uppercase tracking-wide block mb-0.5">
                {t.keyHighlightLabel}
              </span>
              <span className="text-xs font-bold text-emerald-900 leading-tight block">
                {schemeHighlight}
              </span>
            </div>
          </div>
        )}

        {/* Authority / Department */}
        <div className="flex items-center gap-1.5 text-2xs sm:text-xs text-slate-500 font-medium pt-1">
          <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{scheme.authority || scheme.issuingOrganization || scheme.department}</span>
        </div>
      </div>

      {/* ── Card Footer ── */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{scheme.lastVerifiedDate}</span>
        </div>

        <button
          onClick={() => onViewDetails(scheme)}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-amber-600 transition-colors cursor-pointer group/btn"
        >
          <span>{t.viewDetails}</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Official link indicator */}
      {scheme.officialUrl && (
        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-16 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-blue-900"
          title="Direct Official Portal"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};
