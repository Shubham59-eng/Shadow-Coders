import React, { useState } from 'react';
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
  const t = translations[currentLanguage];

  const languagesList: { code: Language; label: string; native: string }[] = [
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'en', label: 'English', native: 'English' },
  ];

  const labels = {
    mr: {
      allSchemes: 'शासकीय योजना',
      scholarships: 'शिष्यवृत्ती पोर्टल',
      checkEligibility: 'पात्रता तपासा',
      dashboard: 'नागरिक डॅशबोर्ड',
      digilocker: 'डिजिलॉकर',
      connected: 'जोडलेले',
      admin: 'प्रशासक',
      studentLogin: 'विद्यार्थी लॉगिन',
      loggedInAs: 'नागरिक',
      notifications: 'सूचना',
    },
    hi: {
      allSchemes: 'सरकारी योजनाएं',
      scholarships: 'छात्रवृत्ति पोर्टल',
      checkEligibility: 'पात्रता जांचें',
      dashboard: 'नागरिक डैशबोर्ड',
      digilocker: 'डिजिलॉकर',
      connected: 'संबद्ध',
      admin: 'प्रशासक',
      studentLogin: 'छात्र लॉगिन',
      loggedInAs: 'नागरिक',
      notifications: 'सूचनाएं',
    },
    en: {
      allSchemes: 'Citizen Schemes',
      scholarships: 'Scholarships Portal',
      checkEligibility: 'Check Eligibility',
      dashboard: 'Citizen Dashboard',
      digilocker: 'DigiLocker',
      connected: 'Connected',
      admin: 'Admin',
      studentLogin: 'Student Login',
      loggedInAs: 'Citizen',
      notifications: 'Notifications',
    }
  }[currentLanguage];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Indian National Tricolour Ribbon Top Accent */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-amber-500" title="Saffron - Courage & Sacrifice"></div>
        <div className="flex-1 bg-slate-100 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-900"></div>
        </div>
        <div className="flex-1 bg-emerald-600" title="Green - Prosperity & Growth"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding: Sahayakon 2.0 */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => {
              onChangeView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center shadow-md shadow-blue-950/20 text-white font-bold text-xl border-2 border-amber-500/40">
              <span className="text-amber-400">स</span>
              <span className="text-emerald-400 text-2xs absolute bottom-1 right-1 font-mono font-black">2.0</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  Sahayakon <span className="text-amber-600">2.0</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-2xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  Gov Benefits & DigiLocker
                </span>
              </div>
              <p className="text-2xs font-semibold text-slate-500 hidden sm:block">
                {currentLanguage === 'mr' ? 'स्मार्ट शासकीय योजना व डिजिटल दस्तऐवज सहाय्यक' : currentLanguage === 'hi' ? 'स्मार्ट सरकारी योजना एवं डिजिटल दस्तावेज़ सहायक' : 'Smart Government Benefits & Digital Document Assistant'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation View Switcher */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => onChangeView('dashboard')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'dashboard'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-white/60'
              }`}
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>{labels.dashboard}</span>
            </button>

            <button
              onClick={() => onChangeView('scholarships')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'scholarships'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-white/60'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>{labels.scholarships}</span>
            </button>

            <button
              onClick={() => onChangeView('schemes')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'schemes'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-blue-900 hover:bg-white/60'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>{labels.allSchemes}</span>
            </button>

            <button
              onClick={onOpenChecker}
              className="px-3.5 py-2 rounded-xl text-amber-900 hover:bg-amber-100/80 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{labels.checkEligibility}</span>
            </button>
          </nav>

          {/* Actions & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Selector Dropdown */}
            <div className="relative inline-flex items-center bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl p-1 transition-colors">
              <Languages className="w-4 h-4 text-slate-600 ml-1.5 mr-1" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Select Language"
                className="bg-transparent font-bold text-xs sm:text-xs text-slate-800 focus:outline-hidden pr-2 py-0.5 cursor-pointer"
              >
                {languagesList.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-slate-900 bg-white">
                    {lang.native}
                  </option>
                ))}
              </select>
            </div>

            {/* DigiLocker Button */}
            {onOpenDigiLocker && (
              <button
                onClick={onOpenDigiLocker}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isDigiLockerConnected
                    ? 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                    : 'border-blue-300 bg-blue-50/80 hover:bg-blue-100 text-blue-900'
                }`}
                title="DigiLocker Document Vault"
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${isDigiLockerConnected ? 'text-emerald-600' : 'text-blue-700'}`} />
                <span>{labels.digilocker}</span>
                {isDigiLockerConnected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                )}
                {isDigiLockerConnected && digiLockerDocCount > 0 && (
                  <span className="px-1.5 py-0.2 text-2xs bg-emerald-200 text-emerald-900 rounded-full font-mono">
                    {digiLockerDocCount}
                  </span>
                )}
              </button>
            )}

            {/* Student Auth / Profile Button */}
            {studentProfile ? (
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-all cursor-pointer"
                title="View Student Profile"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xs uppercase">
                  {studentProfile.name ? studentProfile.name.charAt(0) : 'S'}
                </div>
                <span className="max-w-[100px] truncate">{studentProfile.name || labels.loggedInAs}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-blue-900" />
                <span>{labels.studentLogin}</span>
              </button>
            )}

            {/* Saved Schemes / Scholarships Bookmark Button */}
            <button
              onClick={onOpenSaved}
              title={t.nav.saved}
              className="relative p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/50 text-slate-700 hover:text-amber-700 transition-all cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-2xs font-bold flex items-center justify-center shadow-xs">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Notification Bell with Badge */}
            <button
              onClick={() => onChangeView('dashboard')}
              title={labels.notifications}
              className="relative p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/50 text-slate-700 hover:text-blue-900 transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-2xs font-bold flex items-center justify-center shadow-xs">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Open AI Assistant Button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-blue-900/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{t.nav.chat}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </button>

            {/* Admin Console Shortcut Button */}
            <button
              onClick={onOpenAdmin}
              title="Admin Scholarship Management"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="flex flex-col gap-2 font-medium text-slate-700 text-sm">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onChangeView('scholarships');
              }}
              className="text-left px-3 py-2 rounded-xl hover:bg-amber-50 hover:text-amber-800 font-bold flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>{labels.scholarships}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChecker();
              }}
              className="text-left px-3 py-2 rounded-xl hover:bg-amber-50 hover:text-amber-800 font-bold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{labels.checkEligibility}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onChangeView('dashboard');
              }}
              className="text-left px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-900 font-bold flex items-center gap-2"
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>{labels.dashboard}</span>
            </button>

            {onOpenDigiLocker && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDigiLocker();
                }}
                className="text-left px-3 py-2 rounded-xl hover:bg-emerald-50 hover:text-emerald-900 font-bold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{labels.digilocker} ({isDigiLockerConnected ? `${labels.connected} • ${digiLockerDocCount}` : 'Connect'})</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onChangeView('schemes');
              }}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>{labels.allSchemes}</span>
            </button>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold flex items-center gap-2"
              >
                <User className="w-4 h-4 text-blue-900" />
                <span>{studentProfile ? `${studentProfile.name || 'Student Profile'}` : labels.studentLogin}</span>
              </button>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-slate-500" />
              <span>{labels.admin} Console</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFeedback();
              }}
              className="text-left px-3 py-2 rounded-xl hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2"
            >
              <MessageSquareHeart className="w-4 h-4 text-emerald-600" />
              {t.nav.feedback}
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPrivacy();
              }}
              className="text-left px-3 py-2 rounded-xl hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              {t.nav.about}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
