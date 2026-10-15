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
  Award
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

  // Category visual setup
  const categoryConfig: Record<SchemeCategory, {
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgHover: string;
    iconBg: string;
  }> = {
    students: {
      icon: GraduationCap,
      accentColor: 'border-blue-500 text-blue-700',
      bgHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
      iconBg: 'bg-blue-100 text-blue-800',
    },
    scholarships: {
      icon: Award,
      accentColor: 'border-blue-600 text-blue-800',
      bgHover: 'hover:border-blue-500 hover:shadow-blue-500/10',
      iconBg: 'bg-blue-100 text-blue-900',
    },
    farmers: {
      icon: Sprout,
      accentColor: 'border-emerald-500 text-emerald-700',
      bgHover: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
      iconBg: 'bg-emerald-100 text-emerald-800',
    },
    women: {
      icon: HeartHandshake,
      accentColor: 'border-pink-500 text-pink-700',
      bgHover: 'hover:border-pink-400 hover:shadow-pink-500/10',
      iconBg: 'bg-pink-100 text-pink-800',
    },
    disability: {
      icon: Accessibility,
      accentColor: 'border-purple-500 text-purple-700',
      bgHover: 'hover:border-purple-400 hover:shadow-purple-500/10',
      iconBg: 'bg-purple-100 text-purple-800',
    },
    seniors: {
      icon: UserCheck,
      accentColor: 'border-amber-500 text-amber-700',
      bgHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
      iconBg: 'bg-amber-100 text-amber-800',
    },
    employment: {
      icon: Briefcase,
      accentColor: 'border-indigo-500 text-indigo-700',
      bgHover: 'hover:border-indigo-400 hover:shadow-indigo-500/10',
      iconBg: 'bg-indigo-100 text-indigo-800',
    },
    healthcare: {
      icon: Stethoscope,
      accentColor: 'border-red-500 text-red-700',
      bgHover: 'hover:border-red-400 hover:shadow-red-500/10',
      iconBg: 'bg-red-100 text-red-800',
    },
    financial: {
      icon: Coins,
      accentColor: 'border-teal-500 text-teal-700',
      bgHover: 'hover:border-teal-400 hover:shadow-teal-500/10',
      iconBg: 'bg-teal-100 text-teal-800',
    },
  };

  const categoriesList: SchemeCategory[] = [
    'farmers',
    'students',
    'scholarships',
    'women',
    'disability',
    'healthcare',
    'employment',
    'seniors',
    'financial',
  ];

  const handleCardClick = (cat: string) => {
    onSelectCategory(cat);
    const element = document.getElementById('schemes');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            {t.sectionTitle}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* "All Categories" Card */}
          <div
            onClick={() => handleCardClick('all')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white flex flex-col justify-between ${
              selectedCategory === 'all'
                ? 'border-blue-900 ring-2 ring-blue-900/20 shadow-md'
                : 'border-slate-200 hover:border-blue-400 hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-lg">
                  🇮🇳
                </div>
                <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full">
                  {schemesData.length} Schemes
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1">
                {t.all}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'mr' 
                  ? 'सर्व कल्याणकारी योजना एकाच ठिकाणी पहा' 
                  : language === 'hi' 
                  ? 'सभी जनकल्याणकारी योजनाएं एक स्थान पर' 
                  : 'View all national and state welfare schemes'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-900">
              <span>{language === 'mr' ? 'सर्व योजना उघडा' : language === 'hi' ? 'सभी योजनाएं देखें' : 'View All'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Individual Category Cards */}
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
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white flex flex-col justify-between ${
                  isSelected
                    ? `${cfg.accentColor} border-current ring-2 ring-current/20 shadow-md`
                    : `border-slate-200 ${cfg.bgHover} hover:shadow-md`
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.iconBg}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                      {count} {language === 'mr' ? 'योजना' : language === 'hi' ? 'योजना' : 'Schemes'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1">
                    {catData.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {catData.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{language === 'mr' ? 'योजनांची यादी' : language === 'hi' ? 'योजना सूची' : 'Explore'}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
