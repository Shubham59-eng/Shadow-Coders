import React, { useState, useEffect } from 'react';
import {
  Languages,
  Bookmark,
  Bot,
  Menu,
  X,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  User,
  Bell,
  Lock,
  Compass,
  Layers,
  HelpCircle
} from 'lucide-react';
import type { Language, StudentProfile } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  activeView: 'schemes' | 'notifications' | 'scholarships' | 'dashboard';
  onChangeView: (view: 'schemes' | 'notifications' | 'scholarships' | 'dashboard') => void;
  savedCount: number;
  notificationCount: number;
  studentProfile: StudentProfile | null;
  isDigiLockerConnected?: boolean;
  digiLockerDocCount?: number;
  onOpenDigiLocker?: () => void;
  onOpenAuth: () => void;
  onOpenSaved: () => void;
  onOpenFeedback: () => void;
  onOpenPrivacy: () => void;
  onOpenChat: () => void;
  onOpenChecker: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  activeView,
  onChangeView,
  savedCount,
  notificationCount,
  studentProfile,
  isDigiLockerConnected = false,
  digiLockerDocCount = 0,
  onOpenDigiLocker,
  onOpenAuth,
  onOpenSaved,
  onOpenFeedback,
  onOpenPrivacy,
  onOpenChat,
  onOpenChecker,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = translations[currentLanguage];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const languagesList: { code: Language; label: string; native: string }[] = [
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'en', label: 'English', native: 'English' },
  ];

  const labels = {
    mr: {
      schemes: 'शासकीय योजना',
      notifications: 'अधिसूचना',
      categories: 'योजना प्रवर्ग',
      scholarships: 'शिष्यवृत्ती',
      checkEligibility: 'पात्रता तपासा',
      dashboard: 'डॅशबोर्ड',
      digilocker: 'डिजिलॉकर',
      about: 'माहिती व संपर्क',
      admin: 'प्रशासक',
      studentLogin: 'लॉगिन',
      loggedInAs: 'नागरिक',
    },
    hi: {
      schemes: 'सरकारी योजनाएं',
      notifications: 'अधिसूचनाएं',
      categories: 'श्रेणियां',
      scholarships: 'छात्रवृत्ति',
      checkEligibility: 'पात्रता जांचें',
      dashboard: 'डैशबोर्ड',
      digilocker: 'डिजिलॉकर',
      about: 'हमारे बारे में',
      admin: 'प्रशासक',
      studentLogin: 'लॉगिन',
      loggedInAs: 'नागरिक',
    },
    en: {
      schemes: 'Government Schemes',
      notifications: 'Notifications',
      categories: 'Categories',
      scholarships: 'Scholarships',
      checkEligibility: 'Check Eligibility',
      dashboard: 'Dashboard',
      digilocker: 'DigiLocker',
      about: 'About & Help',
      admin: 'Admin',
      studentLogin: 'Login',
      loggedInAs: 'Citizen',
    }
  }[currentLanguage];

  const handleNavClick = (view: 'schemes' | 'notifications' | 'scholarships' | 'dashboard') => {
    onChangeView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToCategories = () => {
    if (activeView !== 'schemes') {
      onChangeView('schemes');
    }
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0f2b5c]/95 backdrop-blur-xl shadow-xl shadow-blue-950/20 border-b border-blue-900/60'
          : 'bg-[#0f2b5c] border-b border-blue-900/40'
      }`}
    >
      {/* Tricolour Ribbon Top Accent */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-amber-500"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-emerald-600"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">

          {/* 1. Sahayakon Logo (Requirement 1: Opens Schemes page directly) */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('schemes')}
            title="Sahayakon Government Schemes Home"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-900 flex items-center justify-center shadow-md border-2 border-amber-400 group-hover:scale-105 transition-transform">
              <span className="text-amber-300 font-black text-xl">स</span>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0f2b5c] flex items-center justify-center">
                <span className="text-[5px] font-black text-white">✓</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-2xl tracking-tight text-white">
                  Sahayakon <span className="text-amber-400">2026</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  GOV VERIFIED
                </span>
              </div>
              <p className="text-[10px] font-medium text-blue-200/80 hidden sm:block">
                {currentLanguage === 'mr'
                  ? 'अधिकृत शासकीय योजना व शिष्यवृत्ती शोध मंच'
                  : currentLanguage === 'hi'
                  ? 'आधिकारिक सरकारी योजना एवं छात्रवृत्ति खोज मंच'
                  : 'Official Government Welfare & Scholarship Discovery'}
              </p>
            </div>
          </div>

          {/* 2. Desktop Navigation Links (Requirement 1, 5, 7) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-sm p-1 rounded-2xl border border-white/15 text-xs font-bold text-white">
            <button
              onClick={() => handleNavClick('schemes')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'schemes'
                  ? 'bg-white text-blue-950 shadow-md font-black'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-blue-900" />
              <span>{labels.schemes}</span>
            </button>

            <button
              onClick={() => handleNavClick('notifications')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'notifications'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>{labels.notifications}</span>
              {notificationCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">
                  {notificationCount}
                </span>
              )}
            </button>

            <button
              onClick={handleScrollToCategories}
              className="px-3.5 py-2 rounded-xl text-blue-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-sky-300" />
              <span>{labels.categories}</span>
            </button>

            <button
              onClick={() => handleNavClick('scholarships')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'scholarships'
                  ? 'bg-white text-blue-950 shadow-md font-black'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-violet-300" />
              <span>{labels.scholarships}</span>
            </button>

            <button
              onClick={onOpenChecker}
              className="px-3.5 py-2 rounded-xl text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{labels.checkEligibility}</span>
            </button>
          </nav>

          {/* 3. Right Header Actions */}
          <div className="flex items-center gap-2">

            {/* Language Selector (Requirement 9) */}
            <div className="relative inline-flex items-center bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl px-2.5 py-1.5 transition-colors">
              <Languages className="w-3.5 h-3.5 text-amber-300 mr-1.5" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Select Language"
                className="bg-transparent font-bold text-xs text-white focus:outline-none pr-1 cursor-pointer"
              >
                {languagesList.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-slate-900 bg-white">
                    {lang.native}
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Bell Icon (Requirement 6) */}
            <button
              onClick={() => handleNavClick('notifications')}
              title={labels.notifications}
              className="relative p-2.5 rounded-xl border border-white/15 hover:border-amber-400 bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer"
              aria-label="Government Scheme Notifications"
            >
              <Bell className="w-4 h-4 text-amber-300" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-500 text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Bookmarks / Saved Schemes */}
            <button
              onClick={onOpenSaved}
              title={t.nav.saved}
              className="relative p-2.5 rounded-xl border border-white/15 hover:border-amber-400 bg-white/10 hover:bg-white/15 text-white transition-all cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow">
                  {savedCount}
                </span>
              )}
            </button>

            {/* DigiLocker Document Shortcut */}
            {onOpenDigiLocker && (
              <button
                onClick={onOpenDigiLocker}
                title={labels.digilocker}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 text-xs font-semibold cursor-pointer transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden 2xl:inline">{labels.digilocker}</span>
                {isDigiLockerConnected && digiLockerDocCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 rounded-full text-[9px] font-black">
                    {digiLockerDocCount}
                  </span>
                )}
              </button>
            )}

            {/* Citizen Profile / Login */}
            <button
              onClick={onOpenAuth}
              title={studentProfile ? studentProfile.name : labels.studentLogin}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span className="truncate max-w-[100px]">
                {studentProfile ? studentProfile.name.split(' ')[0] : labels.studentLogin}
              </span>
            </button>

            {/* Admin Console Shortcut */}
            <button
              onClick={onOpenAdmin}
              title="Government Scheme Admin Console"
              className="p-2.5 rounded-xl border border-white/15 hover:border-white/30 text-blue-200 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl border border-white/15 bg-white/10 text-white hover:bg-white/15 cursor-pointer"
              aria-label="Toggle Mobile Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c234a] border-b border-blue-900 p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-white">
            <button
              onClick={() => handleNavClick('schemes')}
              className={`p-3 rounded-xl flex items-center gap-2 ${
                activeView === 'schemes' ? 'bg-white text-blue-950 font-black' : 'bg-white/10'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{labels.schemes}</span>
            </button>

            <button
              onClick={() => handleNavClick('notifications')}
              className={`p-3 rounded-xl flex items-center justify-between ${
                activeView === 'notifications' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-300" />
                <span>{labels.notifications}</span>
              </div>
              {notificationCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-2xs bg-amber-400 text-slate-950 font-black">
                  {notificationCount}
                </span>
              )}
            </button>

            <button
              onClick={handleScrollToCategories}
              className="p-3 rounded-xl bg-white/10 flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-sky-300" />
              <span>{labels.categories}</span>
            </button>

            <button
              onClick={() => handleNavClick('scholarships')}
              className={`p-3 rounded-xl flex items-center gap-2 ${
                activeView === 'scholarships' ? 'bg-white text-blue-950 font-black' : 'bg-white/10'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-violet-300" />
              <span>{labels.scholarships}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenChecker(); }}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{labels.checkEligibility}</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenChat(); }}
              className="flex-1 py-2.5 rounded-xl bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              <span>JanSahayak AI</span>
            </button>
          </div>

          {/* Additional mobile utility actions */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-white font-medium"
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span>{studentProfile ? studentProfile.name : labels.studentLogin}</span>
            </button>

            {onOpenDigiLocker && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenDigiLocker(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 font-medium"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{labels.digilocker}</span>
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenFeedback(); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-blue-200 hover:text-white"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-300" />
              <span>{labels.about}</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenPrivacy(); }}
              className="text-blue-300/80 hover:text-white underline text-[11px] px-2 py-1"
            >
              Privacy
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
