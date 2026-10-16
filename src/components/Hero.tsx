import React, { useState } from 'react';
import { Search, Sparkles, CheckCircle2, ArrowRight, Star, Zap, Shield } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../data/translations';

interface HeroProps {
  language: Language;
  onSearch: (searchTerm: string) => void;
  onOpenChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({ language, onSearch, onOpenChat }) => {
  const [searchInput, setSearchInput] = useState('');
  const t = translations[language].hero;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      document.getElementById('schemes')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchInput(tag);
    onSearch(tag);
    document.getElementById('schemes')?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickSearchTags =
    language === 'mr'
      ? ['शिष्यवृत्ती', 'PM-KISAN', 'माझी लाडकी बहीण', 'आयुष्मान भारत', 'मुद्रा कर्ज']
      : language === 'hi'
      ? ['छात्रवृत्ति', 'पीएम किसान', 'लाडली बहना', 'आयुष्मान कार्ड', 'मुद्रा ऋण']
      : ['Scholarship', 'PM-KISAN', 'Majhi Ladki Bahin', 'Ayushman Card', 'MUDRA Loan'];

  const stats = [
    { value: t.stats.schemesCount, label: t.stats.schemesLabel, color: 'from-indigo-500 to-violet-500', icon: <Star className="w-5 h-5" /> },
    { value: t.stats.languagesCount, label: t.stats.languagesLabel, color: 'from-amber-500 to-orange-500', icon: <Zap className="w-5 h-5" /> },
    { value: t.stats.freeAccess, label: t.stats.freeAccessLabel, color: 'from-emerald-500 to-teal-500', icon: <CheckCircle2 className="w-5 h-5" /> },
    { value: t.stats.officialVerified, label: t.stats.officialVerifiedLabel, color: 'from-rose-500 to-pink-500', icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <section id="hero" className="relative overflow-hidden min-h-[90vh] flex flex-col justify-center pt-10 pb-20">

      {/* ── Ambient Orbs ── */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] orb-purple rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] orb-gold rounded-full blur-3xl pointer-events-none -z-10 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] orb-pink rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ── Grid Overlay ── */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Floating Decorative Circles ── */}
      <div className="absolute top-20 right-16 w-20 h-20 rounded-full border border-indigo-500/20 animate-float pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-32 left-10 w-12 h-12 rounded-full border border-amber-500/20 animate-float pointer-events-none" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-5 w-6 h-6 rounded-full bg-violet-500/20 animate-float pointer-events-none" style={{ animationDelay: '0.5s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">

          {/* ── Badge ── */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm shadow-lg shadow-indigo-900/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-indigo-200 text-sm font-semibold">{t.badge}</span>
            <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-bold rounded-full border border-amber-400/20">
              <Sparkles className="w-3 h-3" /> AI Powered
            </span>
          </div>

          {/* ── Main Headline ── */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6">
            {t.titlePart1}{' '}
            <span className="relative inline-block">
              <span className="gradient-text">{t.titleHighlight}</span>
              {/* Animated underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,6 Q50,0 100,5 Q150,10 200,4"
                  stroke="url(#goldGrad)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{' '}
            {t.titlePart2}
          </h1>

          {/* ── Subtitle ── */}
          <p className="text-lg sm:text-xl text-indigo-200/80 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
            {t.description}
          </p>

          {/* ── Search Box ── */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2 rounded-2xl border border-indigo-500/30 bg-white/8 backdrop-blur-md shadow-2xl shadow-indigo-900/30 focus-within:border-amber-500/50 focus-within:bg-white/10 transition-all">
              <div className="relative flex-1 flex items-center pl-3">
                <Search className="w-5 h-5 text-indigo-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-transparent text-white placeholder-indigo-300/50 font-medium text-sm sm:text-base focus:outline-none py-2"
                />
              </div>
              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-black text-sm sm:text-base shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 btn-glow"
              >
                <span>{t.searchBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* ── Quick Tags ── */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300 mb-12">
            <span className="font-semibold text-indigo-300/70 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {t.quickTagsLabel}
            </span>
            {quickSearchTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                className="px-3 py-1 rounded-full bg-white/8 hover:bg-indigo-500/25 border border-white/10 hover:border-indigo-400/40 transition-all font-medium cursor-pointer text-slate-300 hover:text-white hover:scale-105"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* ── AI Chat CTA ── */}
          <div
            onClick={onOpenChat}
            className="inline-flex items-center gap-3 p-2.5 pr-5 rounded-2xl bg-gradient-to-r from-indigo-900/80 via-violet-900/80 to-purple-900/80 backdrop-blur-md text-white shadow-2xl shadow-indigo-900/40 cursor-pointer hover:scale-[1.02] transition-all border border-indigo-500/30 neon-border-purple group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
              AI
            </div>
            <div className="text-left">
              <div className="font-bold text-sm flex items-center gap-1.5">
                <span>
                  {language === 'mr'
                    ? 'AI सहाय्यकास थेट विचारा'
                    : language === 'hi'
                    ? 'AI सहायक से सीधे पूछें'
                    : 'Chat with JanSahayak AI Assistant'}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              </div>
              <div className="text-indigo-300/70 text-xs mt-0.5">
                {language === 'mr'
                  ? 'मराठी, हिन्दी किंवा इंग्रजीत विचारा'
                  : language === 'hi'
                  ? 'मराठी, हिन्दी या अंग्रेज़ी में पूछें'
                  : 'Ask in Marathi, Hindi, or English — free'}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map(({ value, label, color, icon }, i) => (
            <div
              key={i}
              className="stat-card p-5 text-center card-lift group"
            >
              <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mb-1">{value}</div>
              <div className="text-xs font-medium text-indigo-200/60">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
