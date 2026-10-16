import React, { useState, useEffect } from 'react';
import {
  Languages,
  Bookmark,
  Bot,
  Menu,
  X,
  ShieldCheck,
  MessageSquareHeart,
  GraduationCap,
  Sparkles,
  User,
  Bell,
  Lock,
  Compass
} from 'lucide-react';
import type { Language, StudentProfile } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  activeView: 'schemes' | 'scholarships' | 'dashboard';
  onChangeView: (view: 'schemes' | 'scholarships' | 'dashboard') => void;
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
      allSchemes: 'शासकीय योजना',
      scholarships: 'शिष्यवृत्ती',
      checkEligibility: 'पात्रता तपासा',
      dashboard: 'डॅशबोर्ड',
      digilocker: 'डिजिलॉकर',
      connected: 'जोडलेले',
      admin: 'प्रशासक',
      studentLogin: 'लॉगिन',
      loggedInAs: 'नागरिक',
      notifications: 'सूचना',
    },
    hi: {
      allSchemes: 'सरकारी योजनाएं',
      scholarships: 'छात्रवृत्ति',
      checkEligibility: 'पात्रता जांचें',
      dashboard: 'डैशबोर्ड',
      digilocker: 'डिजिलॉकर',
      connected: 'संबद्ध',
      admin: 'प्रशासक',
      studentLogin: 'लॉगिन',
      loggedInAs: 'नागरिक',
      notifications: 'सूचनाएं',
    },
    en: {
      allSchemes: 'Schemes',
      scholarships: 'Scholarships',
      checkEligibility: 'Eligibility',
      dashboard: 'Dashboard',
      digilocker: 'DigiLocker',
      connected: 'Connected',
      admin: 'Admin',
      studentLogin: 'Login',
      loggedInAs: 'Citizen',
      notifications: 'Alerts',
    }
  }[currentLanguage];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0d0b1e]/95 backdrop-blur-xl shadow-2xl shadow-black/40 border-b border-indigo-900/40'
          : 'bg-[#0d0b1e]/80 backdrop-blur-md border-b border-white/5'
      }`}
    >
      {/* Tricolour Ribbon */}
      <div className="tricolour-ribbon w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">

          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              onChangeView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 flex items-center justify-center shadow-lg shadow-indigo-900/50 border border-indigo-400/30 group-hover:scale-105 transition-transform">
              <span className="text-amber-300 font-black text-xl">स</span>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-[#0d0b1e] flex items-center justify-center">
                <span className="text-[6px] font-black text-slate-900">2.0</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-white">
                  Sahayakon <span className="gradient-text">2.0</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] font-medium text-indigo-300/70 hidden sm:block">
                {currentLanguage === 'mr'
                  ? 'स्मार्ट शासकीय योजना सहाय्यक'
                  : currentLanguage === 'hi'
                  ? 'स्मार्ट सरकारी योजना सहायक'
                  : 'Smart Gov Benefits & Document Assistant'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-sm p-1 rounded-2xl border border-white/10 text-xs font-bold">
            {[
              { view: 'dashboard' as const, icon: <User className="w-3.5 h-3.5 text-amber-400" />, label: labels.dashboard },
              { view: 'scholarships' as const, icon: <GraduationCap className="w-3.5 h-3.5 text-violet-400" />, label: labels.scholarships },
              { view: 'schemes' as const, icon: <Compass className="w-3.5 h-3.5 text-emerald-400" />, label: labels.allSchemes },
            ].map(({ view, icon, label }) => (
              <button
                key={view}
                onClick={() => onChangeView(view)}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeView === view
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
            <button
              onClick={onOpenChecker}
              className="px-4 py-2 rounded-xl text-amber-300 hover:bg-amber-500/15 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{labels.checkEligibility}</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {/* Language Selector */}
            <div className="relative inline-flex items-center bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl px-2 py-1.5 transition-colors">
              <Languages className="w-3.5 h-3.5 text-indigo-300 mr-1.5" />
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

            {/* DigiLocker */}
            {onOpenDigiLocker && (
              <button
                onClick={onOpenDigiLocker}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isDigiLockerConnected
                    ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                    : 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
                }`}
                title="DigiLocker Vault"
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${isDigiLockerConnected ? 'text-emerald-400' : 'text-indigo-400'}`} />
                <span>{labels.digilocker}</span>
                {isDigiLockerConnected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
                {isDigiLockerConnected && digiLockerDocCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-emerald-400/20 text-emerald-300 rounded-full font-mono">
                    {digiLockerDocCount}
                  </span>
                )}
              </button>
            )}

            {/* Auth / Profile */}
            {studentProfile ? (
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center text-[10px] uppercase font-black">
                  {studentProfile.name ? studentProfile.name.charAt(0) : 'S'}
                </div>
                <span className="max-w-[80px] truncate">{studentProfile.name || labels.loggedInAs}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 hover:border-indigo-400/50 bg-white/5 hover:bg-indigo-500/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>{labels.studentLogin}</span>
              </button>
            )}

            {/* Saved */}
            <button
              onClick={onOpenSaved}
              title={t.nav.saved}
              className="relative p-2.5 rounded-xl border border-white/10 hover:border-amber-500/40 bg-white/5 hover:bg-amber-500/10 text-slate-400 hover:text-amber-300 transition-all cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-900 rounded-full text-[9px] font-black flex items-center justify-center shadow">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={() => onChangeView('dashboard')}
              title={labels.notifications}
              className="relative p-2.5 rounded-xl border border-white/10 hover:border-indigo-400/40 bg-white/5 hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-300 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* AI Chat CTA */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/40 transition-all hover:scale-[1.03] cursor-pointer btn-glow-purple"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">{t.nav.chat}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </button>

            {/* Admin */}
            <button
              onClick={onOpenAdmin}
              title="Admin Console"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-colors"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl lg:hidden text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0f0c29]/98 backdrop-blur-xl border-b border-white/10 px-4 pt-4 pb-8 space-y-2 shadow-2xl">
          <div className="flex flex-col gap-1 text-sm">
            {[
              { action: () => { setMobileMenuOpen(false); onChangeView('scholarships'); }, icon: <GraduationCap className="w-4 h-4 text-violet-400" />, label: labels.scholarships },
              { action: () => { setMobileMenuOpen(false); onOpenChecker(); }, icon: <Sparkles className="w-4 h-4 text-amber-400" />, label: labels.checkEligibility },
              { action: () => { setMobileMenuOpen(false); onChangeView('dashboard'); }, icon: <User className="w-4 h-4 text-indigo-400" />, label: labels.dashboard },
              { action: () => { setMobileMenuOpen(false); onChangeView('schemes'); }, icon: <Compass className="w-4 h-4 text-emerald-400" />, label: labels.allSchemes },
            ].map(({ action, icon, label }, i) => (
              <button key={i} onClick={action} className="text-left px-4 py-2.5 rounded-xl hover:bg-white/8 text-slate-300 hover:text-white font-semibold flex items-center gap-2.5 transition-colors">
                {icon}
                <span>{label}</span>
              </button>
            ))}

            {onOpenDigiLocker && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenDigiLocker(); }}
                className="text-left px-4 py-2.5 rounded-xl hover:bg-white/8 text-slate-300 hover:text-emerald-300 font-semibold flex items-center gap-2.5 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{labels.digilocker} {isDigiLockerConnected ? `· ${labels.connected} (${digiLockerDocCount})` : '· Connect'}</span>
              </button>
            )}

            <div className="pt-2 border-t border-white/10 mt-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="w-full text-left px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600/30 to-violet-600/20 hover:from-indigo-600/50 hover:to-violet-600/40 text-white font-bold flex items-center gap-2.5 border border-indigo-500/20 transition-all"
              >
                <User className="w-4 h-4 text-indigo-300" />
                <span>{studentProfile ? (studentProfile.name || 'Student Profile') : labels.studentLogin}</span>
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                className="flex-1 text-left px-3 py-2 rounded-xl hover:bg-white/8 text-slate-500 flex items-center gap-2 transition-colors text-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{labels.admin}</span>
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenFeedback(); }}
                className="flex-1 text-left px-3 py-2 rounded-xl hover:bg-white/8 text-slate-500 flex items-center gap-2 transition-colors text-xs"
              >
                <MessageSquareHeart className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.nav.feedback}</span>
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenPrivacy(); }}
                className="flex-1 text-left px-3 py-2 rounded-xl hover:bg-white/8 text-slate-500 flex items-center gap-2 transition-colors text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>{t.nav.about}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
