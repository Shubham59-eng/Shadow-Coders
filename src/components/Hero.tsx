import React, { useState } from 'react';
import { Search, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../data/translations';

interface HeroProps {
  language: Language;
  onSearch: (searchTerm: string) => void;
  onOpenChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onSearch,
  onOpenChat,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const t = translations[language].hero;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      const element = document.getElementById('schemes');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchInput(tag);
    onSearch(tag);
    const element = document.getElementById('schemes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickSearchTags = language === 'mr' 
    ? ['शिष्यवृत्ती', 'PM-KISAN', 'माझी लाडकी बहीण', 'आयुष्मान भारत', 'मुद्रा कर्ज']
    : language === 'hi'
    ? ['छात्रवृत्ति', 'पीएम किसान', 'लाडली बहना', 'आयुष्मान कार्ड', 'मुद्रा ऋण']
    : ['Scholarship', 'PM-KISAN', 'Majhi Ladki Bahin', 'Ayushman Card', 'MUDRA Loan'];

  return (
    <section id="hero" className="relative overflow-hidden bg-white pt-10 pb-16 sm:pt-14 sm:pb-20 border-b border-slate-200">
      {/* Decorative Subtle Tricolour Gradient Ambient Shapes */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 -z-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Official Citizen Portal Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-xs sm:text-sm font-semibold mb-6 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{t.badge}</span>
          </div>

          {/* Main Headline with Tricolor Accents */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-tight mb-5">
            {t.titlePart1}{' '}
            <span className="relative whitespace-nowrap">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                {t.titleHighlight}
              </span>
              <svg 
                className="absolute -bottom-2 left-0 w-full h-2 text-amber-500/30" 
                viewBox="0 0 100 20" 
                preserveAspectRatio="none"
              >
                <path d="M0,10 Q50,0 100,10" stroke="currentColor" strokeWidth="6" fill="none" />
              </svg>
            </span>{' '}
            {t.titlePart2}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            {t.description}
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/60 border-2 border-slate-300 focus-within:border-amber-500 transition-all">
              <div className="relative flex-1 flex items-center pl-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-transparent text-slate-900 placeholder-slate-400 font-medium text-sm sm:text-base focus:outline-hidden py-2"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm sm:text-base shadow-md shadow-orange-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{t.searchBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 mb-10">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {t.quickTagsLabel}
            </span>
            {quickSearchTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-800 border border-slate-200 hover:border-amber-300 transition-colors font-medium cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* AI Floating Suggestion Prompt */}
          <div 
            onClick={onOpenChat}
            className="inline-flex items-center gap-3 p-2.5 pr-4 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white shadow-lg shadow-blue-900/15 cursor-pointer hover:scale-[1.01] transition-transform text-xs sm:text-sm border border-blue-700/50"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              AI
            </div>
            <div className="text-left">
              <div className="font-semibold flex items-center gap-1">
                <span>{language === 'mr' ? 'AI सहाय्यकास थेट विचारा' : language === 'hi' ? 'AI सहायक से सीधे पूछें' : 'Chat with JanSahayak AI Assistant'}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div className="text-slate-300 text-2xs sm:text-xs">
                {language === 'mr' ? 'कोणतीही कागदपत्रे किंवा पात्रता विचारण्यासाठी क्लिक करा' : language === 'hi' ? 'दस्तावेज या पात्रता संबंधित जानकारी के लिए क्लिक करें' : 'Click to ask questions in Marathi, Hindi, or English'}
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-900">
              {t.stats.schemesCount}
            </div>
            <div className="text-xs font-medium text-slate-600 mt-1">
              {t.stats.schemesLabel}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
              {t.stats.languagesCount}
            </div>
            <div className="text-xs font-medium text-slate-600 mt-1">
              {t.stats.languagesLabel}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {t.stats.freeAccess}
            </div>
            <div className="text-xs font-medium text-slate-600 mt-1">
              {t.stats.freeAccessLabel}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-900 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>{t.stats.officialVerified}</span>
            </div>
            <div className="text-xs font-medium text-slate-600 mt-1">
              {t.stats.officialVerifiedLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
