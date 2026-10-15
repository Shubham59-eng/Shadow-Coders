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

  // Filter logic
  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      // Category check
      if (selectedCategory !== 'all' && scheme.category !== selectedCategory) {
        return false;
      }

      // Level / State check
      if (selectedLevel === 'Central' && scheme.level !== 'Central') {
        return false;
      }
      if (selectedLevel === 'Maharashtra' && scheme.level !== 'Maharashtra') {
        return false;
      }

      // Keyword / Search query check
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const titleObj = scheme.title || scheme.name || { en: '', mr: '', hi: '' };
        const titleMatch = 
          titleObj.en.toLowerCase().includes(query) ||
          titleObj.mr.toLowerCase().includes(query) ||
          titleObj.hi.toLowerCase().includes(query);
        const descMatch = 
          (scheme.shortDescription?.en || '').toLowerCase().includes(query) ||
          (scheme.shortDescription?.mr || '').toLowerCase().includes(query) ||
          (scheme.shortDescription?.hi || '').toLowerCase().includes(query);
        const tagMatch = (scheme.tags || []).some(tag => tag.toLowerCase().includes(query));
        const authMatch = ((scheme.authority || scheme.issuingOrganization) || '').toLowerCase().includes(query);

        if (!titleMatch && !descMatch && !tagMatch && !authMatch) {
          return false;
        }
      }

      return true;
    });
  }, [schemes, selectedCategory, selectedLevel, searchTerm]);

  const handleResetFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
    onLevelChange('all');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || selectedLevel !== 'all';

  return (
    <section id="schemes" className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{filteredSchemes.length} Verified Programs Available</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.sectionTitle}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              {t.sectionSubtitle}
            </p>
          </div>

          {/* Quick Counter */}
          <div className="text-sm font-semibold text-slate-700 bg-slate-100 px-4 py-2 rounded-xl self-start md:self-auto">
            {t.searchResultCount(filteredSchemes.length)}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search Input Box */}
            <div className="lg:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={translations[language].hero.searchPlaceholder}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="lg:col-span-4 relative">
              <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                aria-label="Filter by Category"
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs cursor-pointer"
              >
                <option value="all">{catTranslations.all}</option>
                {Object.entries(catTranslations.items).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Jurisdiction / Level Dropdown */}
            <div className="lg:col-span-3 relative">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedLevel}
                onChange={(e) => onLevelChange(e.target.value)}
                aria-label="Filter by Level"
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-2xs cursor-pointer"
              >
                <option value="all">{t.filterAllLevels}</option>
                <option value="Central">{t.filterCentral}</option>
                <option value="Maharashtra">{t.filterMaharashtra}</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips and Reset */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-600">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-slate-500">Filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-medium flex items-center gap-1">
                    {catTranslations.items[selectedCategory as SchemeCategory]?.name}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => onCategoryChange('all')} />
                  </span>
                )}
                {selectedLevel !== 'all' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium flex items-center gap-1">
                    {selectedLevel === 'Maharashtra' ? t.filterMaharashtra : t.filterCentral}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => onLevelChange('all')} />
                  </span>
                )}
                {searchTerm && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-medium flex items-center gap-1">
                    "{searchTerm}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => onSearchChange('')} />
                  </span>
                )}
              </div>

              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetFilters}</span>
              </button>
            </div>
          )}
        </div>

        {/* Schemes Grid */}
        {filteredSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          /* Empty State */
          <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {t.noResultsTitle}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {t.noResultsDesc}
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.resetFilters}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
