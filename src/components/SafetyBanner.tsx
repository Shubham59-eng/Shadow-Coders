import React from 'react';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../data/translations';

interface SafetyBannerProps {
  language: Language;
  onOpenPrivacy: () => void;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ language, onOpenPrivacy }) => {
  const t = translations[language].safetyBanner;

  return (
    <div className="relative overflow-hidden border-y border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-orange-500/8 to-amber-500/10 backdrop-blur-sm">
      {/* Subtle animated shimmer */}
      <div className="absolute inset-0 shimmer opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-amber-200 mr-1.5">{t.title}</span>
            <span className="text-amber-200/70 font-medium leading-relaxed">{t.description}</span>
          </div>
        </div>

        <button
          onClick={onOpenPrivacy}
          className="inline-flex items-center gap-1.5 font-bold text-amber-200 hover:text-white bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-3 py-1.5 rounded-lg shrink-0 transition-all cursor-pointer text-xs"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{t.learnMore}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
