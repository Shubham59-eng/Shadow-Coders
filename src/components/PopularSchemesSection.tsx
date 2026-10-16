import React from 'react';
import { 
  ArrowRight, 
  Clock, 
  Zap
} from 'lucide-react';
import type { Language, Scheme } from '../types';
import { SchemeCard } from './SchemeCard';

interface PopularSchemesSectionProps {
  schemes: Scheme[];
  language: Language;
  bookmarkedIds: string[];
  onToggleBookmark: (schemeId: string) => void;
  onViewDetails: (scheme: Scheme) => void;
  onShare: (scheme: Scheme) => void;
}

export const PopularSchemesSection: React.FC<PopularSchemesSectionProps> = ({
  schemes,
  language,
  bookmarkedIds,
  onToggleBookmark,
  onViewDetails,
  onShare,
}) => {
  // 1. Popular schemes (Top 4 most searched & high impact programs)
  const popularSchemes = schemes.filter(s => s.isPopular).slice(0, 4);

  // 2. Recently updated schemes (Schemes with recent 2026 verification/circulars)
  const recentlyUpdatedSchemes = schemes
    .filter(s => s.isRecentlyUpdated || s.lastVerifiedDate.includes('2026'))
    .slice(0, 4);

  return (
    <div className="space-y-16 py-12 bg-white">
      {/* ── 6. POPULAR GOVERNMENT SCHEMES ── */}
      <section id="popular-schemes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>
                {language === 'mr' ? 'नागरिकांमध्ये सर्वाधिक लोकप्रिय' : language === 'hi' ? 'सर्वाधिक लोकप्रिय योजना' : 'Most Popular Welfare Schemes'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {language === 'mr' ? 'लोकप्रिय शासकीय योजना' : language === 'hi' ? 'लोकप्रिय सरकारी योजनाएं' : 'Popular Government Schemes'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
              {language === 'mr'
                ? 'शेतकरी, महिला, विद्यार्थी व व्यावसायिकांसाठी सर्वाधिक उपयुक्त व मोठ्या प्रमाणावर राबवल्या जाणाऱ्या योजना.'
                : language === 'hi'
                ? 'किसानों, महिलाओं, विद्यार्थियों एवं स्वरोजगार हेतु सर्वाधिक लोकप्रिय योजनाएं।'
                : 'High-impact central and state welfare initiatives with the highest citizen beneficiaries.'}
            </p>
          </div>

          <a
            href="#schemes"
            className="text-xs sm:text-sm font-bold text-blue-900 hover:text-amber-600 flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'mr' ? 'सर्व योजना यादी पहा' : language === 'hi' ? 'सभी योजनाएं देखें' : 'View all schemes'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              language={language}
              isBookmarked={bookmarkedIds.includes(scheme.id)}
              onToggleBookmark={onToggleBookmark}
              onViewDetails={onViewDetails}
              onShare={onShare}
            />
          ))}
        </div>
      </section>

      {/* ── 7. RECENTLY UPDATED SCHEMES (2026 Verified) ── */}
      <section id="recent-updates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold mb-2">
              <Clock className="w-3.5 h-3.5 text-blue-700" />
              <span>
                {language === 'mr' ? '२०२६ मध्ये अद्ययावत केलेल्या योजना' : language === 'hi' ? 'वर्ष 2026 में अद्यतन योजनाएं' : 'Recently Updated for 2026'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {language === 'mr' ? 'नुकत्याच अद्ययावत झालेल्या योजना' : language === 'hi' ? 'हाल ही में अद्यतन योजनाएं' : 'Recently Updated Schemes'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
              {language === 'mr'
                ? 'चालू आर्थिक वर्षात सुधारित मार्गदर्शक सूचना, पात्रता बदल व वाढीव लाभ जाहीर झालेल्या अधिकृत योजना.'
                : language === 'hi'
                ? 'वर्तमान वर्ष में संशोधित दिशानिर्देश, पात्रता एवं लाभ वाली आधिकारिक योजनाएं।'
                : 'Programs with verified new circulars, revised eligibility criteria, or deadline extensions in 2026.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentlyUpdatedSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              language={language}
              isBookmarked={bookmarkedIds.includes(scheme.id)}
              onToggleBookmark={onToggleBookmark}
              onViewDetails={onViewDetails}
              onShare={onShare}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
