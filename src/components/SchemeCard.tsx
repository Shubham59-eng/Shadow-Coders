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
  scholarships: 'from-violet-600 to-purple-700',
  farmers: 'from-emerald-600 to-teal-700',
  women: 'from-pink-600 to-rose-700',
  disability: 'from-purple-600 to-violet-700',
  seniors: 'from-amber-600 to-yellow-700',
  employment: 'from-indigo-600 to-blue-700',
  healthcare: 'from-red-600 to-rose-700',
  financial: 'from-teal-600 to-cyan-700',
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
  const gradientClass = categoryGradients[scheme.category] || 'from-indigo-600 to-violet-700';

  return (
    <div className="group relative rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm hover:bg-white/8 hover:border-indigo-500/30 transition-all duration-300 card-lift flex flex-col overflow-hidden">

      {/* ── Gradient Top Bar ── */}
      <div className={`h-1 w-full bg-gradient-to-r ${gradientClass}`} />

      {/* ── Shimmer on hover ── */}
      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />

      {/* ── Card Body ── */}
      <div className="relative z-10 p-5 pb-4 flex-1">
        {/* Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/8 text-slate-400 border border-white/8">
              {categoryName}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              scheme.level === 'Maharashtra'
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
            }`}>
              {scheme.level === 'Maharashtra' ? 'महाराष्ट्र' : 'भारत सरकार'}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onShare(scheme)}
              title={t.share}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleBookmark(scheme.id)}
              title={isBookmarked ? t.bookmarked : t.bookmark}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isBookmarked
                  ? 'text-amber-400 bg-amber-500/15 hover:bg-amber-500/25'
                  : 'text-slate-500 hover:text-amber-400 hover:bg-white/10'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(scheme)}
          className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer leading-snug line-clamp-2 mb-2"
        >
          {scheme.title[language]}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400/80 leading-relaxed line-clamp-3 mb-4">
          {scheme.shortDescription[language]}
        </p>

        {/* Key Highlight */}
        {scheme.keyHighlight && (
          <div className="p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 flex items-start gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide block mb-0.5">
                {t.keyHighlightLabel}
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                {scheme.keyHighlight[language]}
              </span>
            </div>
          </div>
        )}

        {/* Authority */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{scheme.authority}</span>
        </div>
      </div>

      {/* ── Card Footer ── */}
      <div className="relative z-10 px-5 py-3.5 border-t border-white/6 bg-white/3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
          <span>{scheme.lastVerifiedDate}</span>
        </div>
        <button
          onClick={() => onViewDetails(scheme)}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-300 hover:text-amber-300 transition-colors cursor-pointer group/btn"
        >
          <span>{t.viewDetails}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Official link indicator */}
      {(scheme as { officialSourceUrl?: string }).officialSourceUrl && (
        <a
          href={(scheme as { officialSourceUrl?: string }).officialSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-12 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-slate-500 hover:text-indigo-300"
          title="Official Portal"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};
