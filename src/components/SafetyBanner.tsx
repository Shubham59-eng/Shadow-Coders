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
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70 border-y border-amber-200/80 px-4 py-3 sm:py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500 text-white shrink-0 mt-0.5 sm:mt-0 shadow-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-amber-950 mr-1.5 flex-wrap">
              {t.title}
            </span>
            <span className="text-amber-900 font-medium leading-relaxed">
              {t.description}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenPrivacy}
          className="inline-flex items-center gap-1 font-bold text-blue-900 hover:text-blue-700 bg-white/80 hover:bg-white px-3 py-1.5 rounded-md border border-amber-300 shadow-2xs shrink-0 transition-colors cursor-pointer text-xs"
        >
          <Lock className="w-3.5 h-3.5 text-blue-800" />
          <span>{t.learnMore}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
