import React from 'react';
import {
  GraduationCap,
  Sprout,
  HeartHandshake,
  UserCheck,
  Briefcase,
  Stethoscope,
  Coins,
  ArrowUpRight,
  Accessibility,
  Award,
  LayoutGrid,
} from 'lucide-react';
import type { Language, SchemeCategory } from '../types';
import { translations } from '../data/translations';
import { schemesData } from '../data/schemesData';

interface CategorySectionProps {
  language: Language;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  language,
  selectedCategory,
  onSelectCategory,
}) => {
  const t = translations[language].categories;

  const categoryConfig: Record<SchemeCategory, {
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    glow: string;
    accent: string;
  }> = {
    students: {
      icon: GraduationCap,
      gradient: 'from-blue-600 to-indigo-700',
      glow: 'shadow-blue-900/50',
      accent: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
    },
    scholarships: {
      icon: Award,
      gradient: 'from-violet-600 to-purple-700',
      glow: 'shadow-violet-900/50',
      accent: 'border-violet-500/50 bg-violet-500/10 text-violet-300',
    },
    farmers: {
      icon: Sprout,
      gradient: 'from-emerald-600 to-teal-700',
      glow: 'shadow-emerald-900/50',
      accent: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
    },
    women: {
      icon: HeartHandshake,
      gradient: 'from-pink-600 to-rose-700',
      glow: 'shadow-pink-900/50',
      accent: 'border-pink-500/50 bg-pink-500/10 text-pink-300',
    },
    disability: {
      icon: Accessibility,
      gradient: 'from-purple-600 to-violet-700',
      glow: 'shadow-purple-900/50',
      accent: 'border-purple-500/50 bg-purple-500/10 text-purple-300',
    },
    seniors: {
      icon: UserCheck,
      gradient: 'from-amber-600 to-yellow-700',
      glow: 'shadow-amber-900/50',
      accent: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
    },
    employment: {
      icon: Briefcase,
      gradient: 'from-indigo-600 to-blue-700',
      glow: 'shadow-indigo-900/50',
      accent: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300',
    },
    healthcare: {
      icon: Stethoscope,
      gradient: 'from-red-600 to-rose-700',
      glow: 'shadow-red-900/50',
      accent: 'border-red-500/50 bg-red-500/10 text-red-300',
    },
    financial: {
      icon: Coins,
      gradient: 'from-teal-600 to-cyan-700',
      glow: 'shadow-teal-900/50',
      accent: 'border-teal-500/50 bg-teal-500/10 text-teal-300',
    },
  };

  const categoriesList: SchemeCategory[] = [
    'farmers', 'students', 'scholarships', 'women',
    'disability', 'healthcare', 'employment', 'seniors', 'financial',
  ];

  const handleCardClick = (cat: string) => {
    onSelectCategory(cat);
    document.getElementById('schemes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categories" className="relative py-16 sm:py-24 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px section-divider" />
        <div className="absolute bottom-0 left-0 w-full h-px section-divider" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] orb-purple rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-4">
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{language === 'mr' ? 'सर्व श्रेण्या' : language === 'hi' ? 'सभी श्रेणियाँ' : 'All Categories'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            {t.sectionTitle}
          </h2>
          <p className="text-indigo-200/60 text-sm sm:text-base">{t.sectionSubtitle}</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {/* "All" Card */}
          <div
            onClick={() => handleCardClick('all')}
            className={`group relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 card-lift overflow-hidden ${
              selectedCategory === 'all'
                ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-900/40'
                : 'border-white/8 bg-white/4 hover:border-indigo-500/40 hover:bg-indigo-500/10'
            }`}
          >
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-900/50 mb-4 group-hover:scale-110 transition-transform icon-ring">
                <span className="text-2xl">🇮🇳</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-base text-white">{t.all}</h3>
                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  {schemesData.length}
                </span>
              </div>
              <p className="text-xs text-indigo-200/50 leading-relaxed mb-4">
                {language === 'mr' ? 'सर्व योजना पहा' : language === 'hi' ? 'सभी योजनाएं' : 'All welfare schemes'}
              </p>
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                <span>{language === 'mr' ? 'सर्व उघडा' : language === 'hi' ? 'देखें' : 'View All'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Category Cards */}
          {categoriesList.map((catKey) => {
            const catData = t.items[catKey];
            const cfg = categoryConfig[catKey];
            const IconComponent = cfg.icon;
            const count = schemesData.filter((s) => s.category === catKey).length;
            const isSelected = selectedCategory === catKey;

            return (
              <div
                key={catKey}
                onClick={() => handleCardClick(catKey)}
                className={`group relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 card-lift overflow-hidden ${
                  isSelected
                    ? `border-current bg-white/10 shadow-lg ${cfg.glow} ${cfg.accent}`
                    : `border-white/8 bg-white/4 hover:border-white/20 hover:bg-white/8`
                }`}
              >
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-lg ${cfg.glow} mb-4 group-hover:scale-110 transition-transform icon-ring`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-base text-white">{catData.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400 bg-white/8 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400/70 leading-relaxed line-clamp-2 mb-4">
                    {catData.description}
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                    <span>{language === 'mr' ? 'पहा' : language === 'hi' ? 'देखें' : 'Explore'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
