import React, { useMemo } from 'react';
import { 
  Search, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  X,
  SlidersHorizontal
} from 'lucide-react';
import type { Language, Scheme, SchemeCategory } from '../types';
import { translations } from '../data/translations';
import { SchemeCard } from './SchemeCard';
import { searchSchemes } from '../services/searchEngine';

interface SchemeListProps {
  schemes: Scheme[];
  language: Language;
  searchTerm: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedLevel: string;
  onLevelChange: (lvl: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (schemeId: string) => void;
  onViewDetails: (scheme: Scheme) => void;
  onShare: (scheme: Scheme) => void;
}

export const SchemeList: React.FC<SchemeListProps> = ({
  schemes,
  language,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLevel,
  onLevelChange,
  bookmarkedIds,
  onToggleBookmark,
  onViewDetails,
  onShare,
}) => {
  const t = translations[language].schemesList;
  const catTranslations = translations[language].categories;

  // Utilize the centralized multilingual search engine with synonym matching
  const filteredSchemes = useMemo(() => {
    return searchSchemes(schemes, searchTerm, {
      category: selectedCategory,
      level: selectedLevel,
    });
  }, [schemes, selectedCategory, selectedLevel, searchTerm]);

  const handleResetFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
    onLevelChange('all');
  };

  const hasActiveFilters = searchTerm.trim() !== '' || selectedCategory !== 'all' || selectedLevel !== 'all';

  return (
    <section id="schemes" className="relative py-12 sm:py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-2 border border-blue-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />
              <span>
                {language === 'mr' 
                  ? `${filteredSchemes.length} सत्यापित शासकीय योजना उपलब्ध` 
                  : language === 'hi' 
                  ? `${filteredSchemes.length} सत्यापित सरकारी योजनाएं उपलब्ध` 
                  : `${filteredSchemes.length} Verified Government Schemes Available`}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t.sectionTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1 font-medium">
              {t.sectionSubtitle}
            </p>
          </div>

          {/* Result Counter Badge */}
          <div className="text-xs sm:text-sm font-bold text-blue-950 bg-white border border-slate-200 shadow-xs px-4 py-2 rounded-xl self-start md:self-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.searchResultCount(filteredSchemes.length)}</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            
            {/* Search Input Box */}
            <div className="lg:col-span-5 relative">
              <Search className="w-4 h-4 text-blue-900 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  language === 'mr'
                    ? 'योजनेचे नाव, इंग्रजी/मराठी नाव, पात्रता किंवा कीवर्ड शोधा...'
                    : language === 'hi'
                    ? 'योजना का नाम, अंग्रेज़ी/हिन्दी नाम, पात्रता या कीवर्ड खोजें...'
                    : 'Search by full/partial name, category, department, benefits...'
                }
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/15"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="lg:col-span-4 relative">
              <Layers className="w-4 h-4 text-blue-900 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                aria-label="Filter by Category"
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-900 cursor-pointer appearance-none"
              >
                <option value="all">{catTranslations.all}</option>
                {Object.entries(catTranslations.items).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Dropdown */}
            <div className="lg:col-span-3 relative">
              <SlidersHorizontal className="w-4 h-4 text-blue-900 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedLevel}
                onChange={(e) => onLevelChange(e.target.value)}
                aria-label="Filter by Level"
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-900 cursor-pointer appearance-none"
              >
                <option value="all">{t.filterAllLevels}</option>
                <option value="Central">{t.filterCentral}</option>
                <option value="Maharashtra">{t.filterMaharashtra}</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips and Reset */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-slate-500">
                  {language === 'mr' ? 'लागू फिल्टर्स:' : language === 'hi' ? 'लागू फिल्टर्स:' : 'Active Filters:'}
                </span>

                {selectedCategory !== 'all' && (
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-950 font-bold flex items-center gap-1 border border-blue-200">
                    {catTranslations.items[selectedCategory as SchemeCategory]?.name || selectedCategory}
                    <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => onCategoryChange('all')} />
                  </span>
                )}

                {selectedLevel !== 'all' && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-950 font-bold flex items-center gap-1 border border-amber-300">
                    {selectedLevel === 'Maharashtra' ? t.filterMaharashtra : t.filterCentral}
                    <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => onLevelChange('all')} />
                  </span>
                )}

                {searchTerm.trim() && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center gap-1 border border-slate-300">
                    "{searchTerm.trim()}"
                    <X className="w-3 h-3 cursor-pointer hover:text-rose-600" onClick={() => onSearchChange('')} />
                  </span>
                )}
              </div>

              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-800 cursor-pointer px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetFilters}</span>
              </button>
            </div>
          )}
        </div>

        {/* Schemes Grid */}
        {filteredSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSchemes.map((scheme) => (
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
        ) : (
          /* Friendly No-Results Message (Requirement 2) */
          <div className="text-center py-16 px-6 bg-white rounded-3xl border-2 border-dashed border-slate-200 max-w-xl mx-auto shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <Search className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {language === 'mr'
                  ? `"${searchTerm}" शी जुळणारी कोणतीही योजना आढळली नाही`
                  : language === 'hi'
                  ? `"${searchTerm}" से संबंधित कोई योजना नहीं मिली`
                  : `No schemes found matching "${searchTerm}"`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
                {language === 'mr'
                  ? 'कृपया शब्दांचे स्पेलिंग तपासा, कमी शब्द वापरून पहा किंवा खालील बटणावर क्लिक करून सर्व योजना पहा.'
                  : language === 'hi'
                  ? 'कृपया वर्तनी की जांच करें, कम शब्दों का उपयोग करें या सभी योजनाएं देखने के लिए नीचे क्लिक करें।'
                  : 'Check your spelling, try fewer keywords, or browse all available schemes.'}
              </p>
            </div>

            {/* Quick Suggestions in Empty State */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>
                  {language === 'mr' ? 'सर्व योजना पहा' : language === 'hi' ? 'सभी योजनाएं देखें' : 'View All Schemes'}
                </span>
              </button>
              <button
                onClick={() => {
                  handleResetFilters();
                  onCategoryChange('farmers');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                🌾 {language === 'mr' ? 'शेतकरी' : language === 'hi' ? 'किसान' : 'Farmers'}
              </button>
              <button
                onClick={() => {
                  handleResetFilters();
                  onCategoryChange('women');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                👩 {language === 'mr' ? 'महिला' : language === 'hi' ? 'महिला' : 'Women'}
              </button>
              <button
                onClick={() => {
                  handleResetFilters();
                  onCategoryChange('scholarships');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                🎓 {language === 'mr' ? 'शिष्यवृत्ती' : language === 'hi' ? 'छात्रवृत्ति' : 'Scholarships'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
