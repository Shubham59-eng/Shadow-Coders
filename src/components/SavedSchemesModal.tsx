import React from 'react';
import { 
  Bookmark, 
  X, 
  Trash2, 
  ArrowRight
} from 'lucide-react';
import type { Language, Scheme } from '../types';
import { translations } from '../data/translations';
import { schemesData } from '../data/schemesData';

interface SavedSchemesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  savedIds: string[];
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
  onViewScheme: (scheme: Scheme) => void;
}

export const SavedSchemesModal: React.FC<SavedSchemesModalProps> = ({
  isOpen,
  onClose,
  language,
  savedIds,
  onRemoveBookmark,
  onClearAll,
  onViewScheme,
}) => {
  const t = translations[language].savedSection;

  if (!isOpen) return null;

  const savedSchemes = savedIds
    .map((id) => schemesData.find((s) => s.id === id))
    .filter((s): s is Scheme => Boolean(s));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Tricolour Accent */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-amber-500"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-emerald-600"></div>
        </div>

        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Bookmark className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                {t.title} ({savedSchemes.length})
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedSchemes.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {t.clearAll}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {savedSchemes.length > 0 ? (
            savedSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {scheme.category}
                    </span>
                    <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-900">
                      {scheme.level === 'Maharashtra' ? 'महाराष्ट्र शासन' : 'Central'}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 hover:text-blue-900 transition-colors">
                    {scheme.title[language]}
                  </h4>
                  {scheme.keyHighlight && (
                    <p className="text-xs font-semibold text-emerald-700">
                      ✨ {scheme.keyHighlight[language]}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      onClose();
                      onViewScheme(scheme);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(scheme.id)}
                    title="Remove from saved"
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 px-4">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
                <Bookmark className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                {t.emptyTitle}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                {t.emptyDesc}
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {t.exploreBtn}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
