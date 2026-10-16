import React from 'react';
import {
  GraduationCap,
  Sprout,
  HeartHandshake,
  UserCheck,
  Briefcase,
  Stethoscope,
  Coins,
  ArrowRight,
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

  const categoryConfig: Record<string, {
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    bgBadge: string;
    textBadge: string;
  }> = {
    students: {
      icon: GraduationCap,
      gradient: 'from-blue-600 to-indigo-700',
      bgBadge: 'bg-blue-50 text-blue-900 border-blue-200',
      textBadge: 'text-blue-900',
    },
    scholarships: {
      icon: Award,
      gradient: 'from-blue-700 to-indigo-800',
      bgBadge: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      textBadge: 'text-indigo-900',
    },
    farmers: {
      icon: Sprout,
      gradient: 'from-emerald-600 to-teal-700',
      bgBadge: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      textBadge: 'text-emerald-900',
    },
    women: {
      icon: HeartHandshake,
      gradient: 'from-rose-600 to-pink-700',
      bgBadge: 'bg-rose-50 text-rose-900 border-rose-200',
      textBadge: 'text-rose-900',
    },
    seniors: {
      icon: UserCheck,
      gradient: 'from-amber-600 to-orange-700',
      bgBadge: 'bg-amber-50 text-amber-900 border-amber-300',
      textBadge: 'text-amber-900',
    },
    employment: {
      icon: Briefcase,
      gradient: 'from-sky-600 to-blue-700',
      bgBadge: 'bg-sky-50 text-sky-900 border-sky-200',
      textBadge: 'text-sky-900',
    },
    disability: {
      icon: Accessibility,
      gradient: 'from-purple-600 to-indigo-700',
      bgBadge: 'bg-purple-50 text-purple-900 border-purple-200',
      textBadge: 'text-purple-900',
    },
    healthcare: {
      icon: Stethoscope,
      gradient: 'from-red-600 to-rose-700',
      bgBadge: 'bg-rose-50 text-rose-900 border-rose-200',
      textBadge: 'text-rose-900',
    },
    financial: {
      icon: Coins,
      gradient: 'from-teal-600 to-emerald-700',
      bgBadge: 'bg-teal-50 text-teal-900 border-teal-200',
      textBadge: 'text-teal-900',
    },
  };

  const categoriesList: SchemeCategory[] = [
    'farmers',
    'students',
    'women',
    'seniors',
    'scholarships',
    'employment',
    'disability',
    'healthcare',
    'financial',
  ];

  const handleCardClick = (cat: string) => {
    onSelectCategory(cat);
    document.getElementById('schemes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categories" className="relative py-14 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold mb-3">
            <LayoutGrid className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {language === 'mr' ? 'प्रमुख योजना प्रवर्ग' : language === 'hi' ? 'प्रमुख योजना श्रेणियां' : 'Featured Scheme Categories'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t.sectionTitle}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5 font-medium">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Quick Category Cards Grid (Requirement 7) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          
          {/* "All" Card */}
          <div
            onClick={() => handleCardClick('all')}
            className={`group p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
              selectedCategory === 'all'
                ? 'border-blue-900 bg-blue-50/80 shadow-md ring-2 ring-blue-900/15'
                : 'border-slate-200 bg-white hover:border-blue-900/40 hover:shadow-md'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform">
                <span className="text-lg">🇮🇳</span>
              </div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <h3 className="font-black text-sm sm:text-base text-slate-900 group-hover:text-blue-900 transition-colors">
                  {t.all}
                </h3>
                <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
                  {schemesData.length}
                </span>
              </div>
              <p className="text-2xs text-slate-500 leading-relaxed font-medium">
                {language === 'mr' ? 'सर्व योजना पहा' : language === 'hi' ? 'सभी योजनाएं' : 'Browse all programs'}
              </p>
            </div>

            <div className="pt-3 flex items-center justify-between text-xs font-bold text-blue-900 group-hover:text-amber-600 transition-colors">
              <span>{language === 'mr' ? 'उघडा' : language === 'hi' ? 'देखें' : 'Explore'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Category Items */}
          {categoriesList.map((catKey) => {
            const catData = t.items[catKey];
            const cfg = categoryConfig[catKey] || categoryConfig.students;
            const IconComponent = cfg.icon;
            const count = schemesData.filter((s) => s.category === catKey).length;
            const isSelected = selectedCategory === catKey;

            return (
              <div
                key={catKey}
                onClick={() => handleCardClick(catKey)}
                className={`group p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-900 bg-blue-50/80 shadow-md ring-2 ring-blue-900/15'
                    : 'border-slate-200 bg-white hover:border-blue-900/40 hover:shadow-md'
                }`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-md mb-3 group-hover:scale-105 transition-transform`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className="font-black text-sm sm:text-base text-slate-900 group-hover:text-blue-900 transition-colors">
                      {catData?.name || catKey}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </div>

                  <p className="text-2xs text-slate-500 leading-relaxed line-clamp-2 font-medium">
                    {catData?.description}
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between text-xs font-bold text-blue-900 group-hover:text-amber-600 transition-colors">
                  <span>{language === 'mr' ? 'पहा' : language === 'hi' ? 'देखें' : 'View'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
