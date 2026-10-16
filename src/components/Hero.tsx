import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Shield, 
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import type { Language, Scheme } from '../types';
import { translations } from '../data/translations';
import { getSearchSuggestions } from '../services/searchEngine';

interface HeroProps {
  language: Language;
  searchTerm?: string;
  onSearch: (searchTerm: string) => void;
  onOpenChat: () => void;
  schemes?: Scheme[];
  onViewSchemeDetails?: (scheme: Scheme) => void;
  onSelectCategory?: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  language, 
  searchTerm = '',
  onSearch, 
  onOpenChat,
  schemes = [],
  onViewSchemeDetails,
}) => {
  const [searchInput, setSearchInput] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const t = translations[language].hero;

  // Sync external search term
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = searchInput.trim().length >= 2 
    ? getSearchSuggestions(schemes, searchInput, language, 5) 
    : [];

  const handleInputChange = (val: string) => {
    setSearchInput(val);
    setShowSuggestions(true);
    // Also perform live filtering if desired
    onSearch(val);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(searchInput.trim());
    document.getElementById('schemes')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectSuggestion = (scheme: Scheme) => {
    setShowSuggestions(false);
    if (onViewSchemeDetails) {
      onViewSchemeDetails(scheme);
    } else {
      setSearchInput(scheme.title?.[language] || scheme.title?.en || '');
      onSearch(scheme.title?.[language] || scheme.title?.en || '');
      document.getElementById('schemes')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClear = () => {
    setSearchInput('');
    setShowSuggestions(false);
    onSearch('');
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchInput(tag);
    setShowSuggestions(false);
    onSearch(tag);
    document.getElementById('schemes')?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickSearchTags =
    language === 'mr'
      ? ['शिष्यवृत्ती', 'PM-KISAN', 'माझी लाडकी बहीण', 'आयुष्मान भारत', 'मुद्रा कर्ज', 'रोजगार']
      : language === 'hi'
      ? ['छात्रवृत्ति', 'पीएम किसान', 'लाडली बहना', 'आयुष्मान भारत', 'मुद्रा लोन', 'रोजगार']
      : ['Scholarship', 'PM-KISAN', 'Majhi Ladki Bahin', 'Ayushman Bharat', 'MUDRA Loan', 'Employment'];

  const stats = [
    { value: '20+', label: language === 'mr' ? 'सत्यापित शासकीय योजना' : language === 'hi' ? 'सत्यापित सरकारी योजनाएं' : 'Verified Welfare Schemes', color: 'from-blue-600 to-indigo-700', icon: <Star className="w-4 h-4 text-white" /> },
    { value: '3', label: language === 'mr' ? 'मराठी, हिन्दी, English' : language === 'hi' ? 'मराठी, हिन्दी, English' : '3 Official Languages', color: 'from-amber-500 to-orange-600', icon: <Sparkles className="w-4 h-4 text-white" /> },
    { value: '100%', label: language === 'mr' ? 'मोफत व थेट पोर्टल दुवे' : language === 'hi' ? 'निःशुल्क एवं प्रत्यक्ष लिंक' : 'Free & Direct Portals', color: 'from-emerald-600 to-teal-700', icon: <CheckCircle2 className="w-4 h-4 text-white" /> },
    { value: '2026', label: language === 'mr' ? 'चालू वर्ष २०२६ अद्ययावत' : language === 'hi' ? 'वर्ष 2026 सत्यापित' : 'Updated for 2026', color: 'from-blue-700 to-blue-900', icon: <Shield className="w-4 h-4 text-white" /> },
  ];

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#0f2b5c] via-[#123975] to-[#1e40af] text-white pt-10 pb-16 sm:pb-24 border-b border-blue-900/60 shadow-inner">
      {/* Subtle Ashoka Chakra / Tricolour Ambient Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">

          {/* Saffron & White Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg shadow-blue-950/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-amber-300 text-xs sm:text-sm font-bold tracking-wide">
              {language === 'mr'
                ? '🇮🇳 अधिकृत शासकीय योजना शोध व्यासपीठ'
                : language === 'hi'
                ? '🇮🇳 आधिकारिक सरकारी योजना खोज मंच'
                : '🇮🇳 Official Government Scheme Discovery Platform'}
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-black rounded-full border border-amber-400/30">
              2026 VERIFIED
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            {language === 'mr' ? (
              <>
                तुमच्यासाठी <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200">योग्य शासकीय योजना</span> शोधा
              </>
            ) : language === 'hi' ? (
              <>
                अपने लिए <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200">सही सरकारी योजना</span> खोजें
              </>
            ) : (
              <>
                Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200">Right Government Scheme</span> for You
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg text-blue-100 font-medium max-w-2xl mx-auto leading-relaxed">
            {language === 'mr'
              ? 'महाराष्ट्र शासन व केंद्र सरकारच्या सर्व कल्याणकारी योजना, शिष्यवृत्ती, शेतकरी अनुदान आणि महिला सहाय्य योजनांची अधिकृत व खात्रीशीर माहिती.'
              : language === 'hi'
              ? 'महाराष्ट्र सरकार एवं केंद्र सरकार की सभी जन कल्याणकारी योजनाओं, छात्रवृत्ति, किसान अनुदान और महिला सहायता की आधिकारिक जानकारी।'
              : 'Discover verified Central and Maharashtra government welfare schemes, scholarships, farmer subsidies, and women assistance programs with direct official portal links.'}
          </p>

          {/* ── Prominent Search Bar (Requirement 2 & 7) ── */}
          <div ref={searchContainerRef} className="relative max-w-2xl mx-auto pt-2">
            <form onSubmit={handleSearchSubmit} className="relative z-20">
              <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2 rounded-2xl bg-white shadow-2xl shadow-blue-950/40 border-2 border-amber-400/80 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-400/20 transition-all">
                <div className="relative flex-1 flex items-center pl-3">
                  <Search className="w-5 h-5 text-blue-900 shrink-0 mr-2" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={
                      language === 'mr'
                        ? 'योजनेचे नाव, विभाग, शिष्यवृत्ती, शेतकरी, पात्रता शोधा...'
                        : language === 'hi'
                        ? 'योजना का नाम, विभाग, छात्रवृत्ति, किसान, पात्रता खोजें...'
                        : 'Search schemes by name, category, department, eligibility...'
                    }
                    className="w-full bg-transparent text-slate-900 placeholder-slate-400 font-medium text-sm sm:text-base focus:outline-none py-2"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors mr-1 cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm sm:text-base shadow-md shadow-orange-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{t.searchBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Live Auto-Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-30 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-2xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>
                    {language === 'mr' ? 'थेट सूचना' : language === 'hi' ? 'सीधे परिणाम' : 'Top Scheme Matches'}
                  </span>
                  <span>{suggestions.length} {language === 'mr' ? 'योजना' : language === 'hi' ? 'योजनाएं' : 'found'}</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {suggestions.map(({ id, title, category, level, scheme }) => (
                    <div
                      key={id}
                      onClick={() => handleSelectSuggestion(scheme)}
                      className="p-3.5 hover:bg-blue-50/80 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                            {level === 'Maharashtra' ? 'महाराष्ट्र' : 'Central'}
                          </span>
                          <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                            {category}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-900 truncate">
                          {title}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-blue-900 group-hover:translate-x-0.5 transition-transform">
                        <span>{language === 'mr' ? 'पहा' : language === 'hi' ? 'देखें' : 'View'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  onClick={handleSearchSubmit}
                  className="p-2.5 bg-blue-50 text-center text-xs font-bold text-blue-900 hover:bg-blue-100 cursor-pointer border-t border-blue-100 flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>
                    {language === 'mr'
                      ? `"${searchInput}" साठी सर्व परिणाम पहा`
                      : language === 'hi'
                      ? `"${searchInput}" के सभी परिणाम देखें`
                      : `View all results for "${searchInput}"`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-blue-100 pt-1">
            <span className="font-semibold text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {t.quickTagsLabel}
            </span>
            {quickSearchTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 hover:border-amber-400/50 transition-all font-semibold cursor-pointer text-white hover:scale-105"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* AI Chat Shortcut */}
          <div className="pt-2">
            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs backdrop-blur-xs transition-all cursor-pointer hover:border-amber-400"
            >
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black text-[10px]">
                AI
              </div>
              <span>
                {language === 'mr'
                  ? 'प्रश्न विचारा किंवा पात्रता जाणून घ्या — JanSahayak AI'
                  : language === 'hi'
                  ? 'प्रश्न पूछें या पात्रता जानें — JanSahayak AI'
                  : 'Ask a question or check eligibility — JanSahayak AI'}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
            </button>
          </div>
        </div>

        {/* ── Stats Highlights Row (Requirement 7) ── */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
          {stats.map(({ value, label, color, icon }, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-center hover:bg-white/15 transition-all"
            >
              <div className={`w-8 h-8 mx-auto mb-2 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                {icon}
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">{value}</div>
              <div className="text-2xs sm:text-xs font-semibold text-blue-100 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
