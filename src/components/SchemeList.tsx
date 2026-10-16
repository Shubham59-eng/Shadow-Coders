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
    <section id="schemes" className="relative py-14 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold mb-2 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{filteredSchemes.length} Verified Programs Available</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.sectionTitle}
            </h2>
            <p className="text-indigo-200/50 text-sm sm:text-base mt-1">
              {t.sectionSubtitle}
            </p>
          </div>

          {/* Quick Counter */}
          <div className="text-sm font-semibold text-indigo-200 bg-white/6 border border-white/10 px-4 py-2 rounded-xl self-start md:self-auto">
            {t.searchResultCount(filteredSchemes.length)}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 sm:p-5 rounded-2xl mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search Input Box */}
            <div className="lg:col-span-5 relative">
              <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={translations[language].hero.searchPlaceholder}
                className="w-full pl-10 pr-9 py-2.5 bg-white/8 border border-white/12 rounded-xl text-sm font-medium text-white placeholder-indigo-300/40 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="lg:col-span-4 relative">
              <Layers className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                aria-label="Filter by Category"
                className="w-full pl-10 pr-8 py-2.5 bg-white/8 border border-white/12 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-amber-500/50 cursor-pointer appearance-none"
              >
                <option value="all" className="bg-slate-900">{catTranslations.all}</option>
                {Object.entries(catTranslations.items).map(([key, item]) => (
                  <option key={key} value={key} className="bg-slate-900">
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Dropdown */}
            <div className="lg:col-span-3 relative">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedLevel}
                onChange={(e) => onLevelChange(e.target.value)}
                aria-label="Filter by Level"
                className="w-full pl-10 pr-8 py-2.5 bg-white/8 border border-white/12 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-amber-500/50 cursor-pointer appearance-none"
              >
                <option value="all" className="bg-slate-900">{t.filterAllLevels}</option>
                <option value="Central" className="bg-slate-900">{t.filterCentral}</option>
                <option value="Maharashtra" className="bg-slate-900">{t.filterMaharashtra}</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips and Reset */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/8 text-xs text-slate-400">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-slate-500">Filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-medium flex items-center gap-1 border border-indigo-500/20">
                    {catTranslations.items[selectedCategory as SchemeCategory]?.name}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => onCategoryChange('all')} />
                  </span>
                )}
                {selectedLevel !== 'all' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-medium flex items-center gap-1 border border-amber-500/20">
                    {selectedLevel === 'Maharashtra' ? t.filterMaharashtra : t.filterCentral}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => onLevelChange('all')} />
                  </span>
                )}
                {searchTerm && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/8 text-slate-300 font-medium flex items-center gap-1 border border-white/10">
                    "{searchTerm}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => onSearchChange('')} />
                  </span>
                )}
              </div>

              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 cursor-pointer"
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
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white/4 rounded-2xl border border-dashed border-white/10 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-300 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{t.noResultsTitle}</h3>
            <p className="text-sm text-slate-400 mb-6">{t.noResultsDesc}</p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
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
