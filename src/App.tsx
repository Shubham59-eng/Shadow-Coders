import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Mic, 
  ArrowRight
} from 'lucide-react';
import type { 
  Language, 
  Scheme, 
  Scholarship, 
  StudentProfile, 
  StudentNotification,
  SchemeRecord,
  CitizenProfile,
  DigiLockerSession,
  DigiLockerDocument
} from './types';
import { schemesData } from './data/schemesData';
import { getAdminScholarships } from './components/AdminScholarshipModal';
import { getStoredProfile, saveStoredProfile } from './services/authService';
import { getStoredNotifications, generateDeadlineNotifications } from './services/notificationService';
import { getStoredSession, getStoredDigiLockerDocs } from './services/digilockerService';

// General Schemes Components
import { Navbar } from './components/Navbar';
import { SafetyBanner } from './components/SafetyBanner';
import { Hero } from './components/Hero';
import { RecentlyViewed } from './components/RecentlyViewed';
import { CategorySection } from './components/CategorySection';
import { SchemeList } from './components/SchemeList';
import { SchemeDetailModal } from './components/SchemeDetailModal';
import { ChatAssistant } from './components/ChatAssistant';
import { SavedSchemesModal } from './components/SavedSchemesModal';
import { FeedbackModal } from './components/FeedbackModal';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';

// Student Scholarship Components
import { ScholarshipDirectory } from './components/ScholarshipDirectory';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentAuthModal } from './components/StudentAuthModal';
import { ScholarshipDetailModal } from './components/ScholarshipDetailModal';
import { AdminScholarshipModal } from './components/AdminScholarshipModal';

// Sahayakon 2.0 Smart Benefits & DigiLocker Components
import { CitizenDashboard } from './components/CitizenDashboard';
import { DigiLockerModal } from './components/DigiLockerModal';
import { SmartEligibilityModal } from './components/SmartEligibilityModal';

export const App: React.FC = () => {
  // 1. Language State
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('jansahayak_lang');
    return (saved as Language) || 'mr'; // Marathi by default as prominent regional language
  });

  // 2. Active View Navigation ('scholarships' | 'schemes' | 'dashboard')
  const [activeView, setActiveView] = useState<'scholarships' | 'schemes' | 'dashboard'>('dashboard');

  // 3. Citizen Profile & DigiLocker Session State (Sahayakon 2.0)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(getStoredProfile);
  const [digiLockerSession, setDigiLockerSession] = useState<DigiLockerSession>(getStoredSession);
  const [digiLockerDocs, setDigiLockerDocs] = useState<DigiLockerDocument[]>(getStoredDigiLockerDocs);
  const [dashboardTab, setDashboardTab] = useState<'citizen' | 'student'>('citizen');

  // 4. Notifications State
  const [notifications, setNotifications] = useState<StudentNotification[]>(getStoredNotifications);

  // 5. Scholarship Directory Data
  const [scholarshipsList, setScholarshipsList] = useState<Scholarship[]>(getAdminScholarships);

  // 6. Saved Scheme & Scholarship IDs
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('jansahayak_saved_schemes') || '[]');
    } catch {
      return [];
    }
  });

  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('jansahayak_saved_scholarships') || '["sch-mah-ebc", "sch-aicte-pragati"]');
    } catch {
      return ['sch-mah-ebc', 'sch-aicte-pragati'];
    }
  });

  // 7. Recently Viewed Schemes
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('jansahayak_recent_schemes') || '[]');
    } catch {
      return [];
    }
  });

  // 8. Schemes Search and Filter States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // 9. Modals States
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCheckerModalOpen, setIsCheckerModalOpen] = useState<boolean>(false);
  const [isDigiLockerModalOpen, setIsDigiLockerModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  // 9. Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Background check for deadline reminders on mount
  useEffect(() => {
    const savedSchs = scholarshipsList.filter((s) => savedScholarshipIds.includes(s.id));
    const newNotifications = generateDeadlineNotifications(savedSchs, studentProfile);
    setNotifications(newNotifications);
  }, [savedScholarshipIds, scholarshipsList, studentProfile]);

  // Language change
  const handleLanguageChange = (newLang: Language) => {
    setCurrentLanguage(newLang);
    localStorage.setItem('jansahayak_lang', newLang);
  };

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Saved Scheme Bookmarks
  const handleToggleSchemeBookmark = (schemeId: string) => {
    setSavedSchemeIds((prev) => {
      let updated: string[];
      if (prev.includes(schemeId)) {
        updated = prev.filter((id) => id !== schemeId);
        showToast(
          currentLanguage === 'mr'
            ? 'योजना जतन यादीतून हटवली.'
            : currentLanguage === 'hi'
            ? 'योजना सहेजी गई सूची से हटा दी गई।'
            : 'Scheme removed from saved list.'
        );
      } else {
        updated = [...prev, schemeId];
        showToast(
          currentLanguage === 'mr'
            ? '⭐ योजना यशस्वीरीत्या जतन केली!'
            : currentLanguage === 'hi'
            ? '⭐ योजना सफलतापूर्वक सहेज ली गई!'
            : '⭐ Scheme saved to your bookmarks!'
        );
      }
      localStorage.setItem('jansahayak_saved_schemes', JSON.stringify(updated));
      return updated;
    });
  };

  // Saved Scholarship Bookmarks
  const handleToggleScholarshipBookmark = (scholarshipId: string) => {
    setSavedScholarshipIds((prev) => {
      let updated: string[];
      if (prev.includes(scholarshipId)) {
        updated = prev.filter((id) => id !== scholarshipId);
        showToast(
          currentLanguage === 'mr'
            ? 'शिष्यवृत्ती डॅशबोर्डमधून हटवली.'
            : currentLanguage === 'hi'
            ? 'छात्रवृत्ति डैशबोर्ड से हटा दी गई।'
            : 'Scholarship removed from saved list.'
        );
      } else {
        updated = [...prev, scholarshipId];
        showToast(
          currentLanguage === 'mr'
            ? '🎓 शिष्यवृत्ती डॅशबोर्डमध्ये जतन केली!'
            : currentLanguage === 'hi'
            ? '🎓 छात्रवृत्ति डैशबोर्ड में सहेज ली गई!'
            : '🎓 Scholarship saved to your dashboard!'
        );
      }
      localStorage.setItem('jansahayak_saved_scholarships', JSON.stringify(updated));

      // Also update student profile savedScholarshipIds if logged in
      if (studentProfile) {
        const updatedProf: StudentProfile = {
          ...studentProfile,
          savedScholarshipIds: updated,
        };
        setStudentProfile(updatedProf);
        saveStoredProfile(updatedProf);
      }

      return updated;
    });
  };

  const handleClearAllBookmarks = () => {
    setSavedSchemeIds([]);
    localStorage.removeItem('jansahayak_saved_schemes');
    showToast(
      currentLanguage === 'mr'
        ? 'सर्व जतन केलेल्या योजना हटवल्या.'
        : currentLanguage === 'hi'
        ? 'सभी सहेजी गई योजनाएं हटा दी गईं।'
        : 'All saved schemes cleared.'
    );
  };

  // Open Scheme Details & Add to Recently Viewed
  const handleViewScheme = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== scheme.id);
      const updated = [scheme.id, ...filtered].slice(0, 6);
      localStorage.setItem('jansahayak_recent_schemes', JSON.stringify(updated));
      return updated;
    });
  };

  // Share Scheme
  const handleShareScheme = (scheme: Scheme) => {
    const title = scheme.title[currentLanguage];
    const highlight = scheme.keyHighlight ? scheme.keyHighlight[currentLanguage] : '';
    const text = `${title}${highlight ? ` - ${highlight}` : ''}\nOfficial Portal: ${scheme.officialUrl}`;

    if (navigator.share) {
      navigator.share({ title, text, url: window.location.href }).catch(() => {
        copyToClipboard(text);
      });
    } else {
      copyToClipboard(text);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(
      currentLanguage === 'mr'
        ? 'योजनेची माहिती क्लिपबोर्डवर कॉपी झाली!'
        : currentLanguage === 'hi'
        ? 'योजना की जानकारी कॉपी हो गई!'
        : 'Scheme information copied to clipboard!'
    );
  };

  // SchemeRecord viewer for Sahayakon 2.0
  const handleViewSchemeRecord = (record: SchemeRecord) => {
    const matchScheme = schemesData.find((s) => s.id === record.id);
    if (matchScheme) {
      handleViewScheme(matchScheme);
      return;
    }
    const matchScholarship = scholarshipsList.find((s) => s.id === record.id);
    if (matchScholarship) {
      setSelectedScholarship(matchScholarship);
      return;
    }
    const synthetic: Scheme = {
      ...record,
      title: record.title || record.name || { en: record.id, mr: record.id, hi: record.id },
      category: record.category || 'students',
      keyHighlight: record.keyHighlight || {
        en: record.benefits?.en?.[0] || '',
        mr: record.benefits?.mr?.[0] || '',
        hi: record.benefits?.hi?.[0] || '',
      },
      tags: record.tags || [],
    };
    handleViewScheme(synthetic);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-amber-500 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        activeView={activeView}
        onChangeView={setActiveView}
        savedCount={savedSchemeIds.length + savedScholarshipIds.length}
        notificationCount={unreadNotificationsCount}
        studentProfile={studentProfile}
        isDigiLockerConnected={digiLockerSession.isConnected}
        digiLockerDocCount={digiLockerSession.totalDocumentsCount || digiLockerDocs.length}
        onOpenDigiLocker={() => setIsDigiLockerModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenChecker={() => setIsCheckerModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* 2. Citizen & Student Safety Advisory Banner */}
      <SafetyBanner
        language={currentLanguage}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      {/* 3. Main Dynamic Content by Active View */}
      <main className="flex-1">
        
        {/* VIEW A: SCHOLARSHIPS DIRECTORY & DISCOVERY (Primary Upgraded Platform) */}
        {activeView === 'scholarships' && (
          <div>
            {/* Scholarship Dedicated Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-indigo-950 text-white pt-10 pb-16 sm:pb-20 border-b border-slate-800">
              {/* Subtle background glow */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
                
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider animate-in fade-in">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {currentLanguage === 'mr'
                      ? 'AI-सक्षम विद्यार्थी शिष्यवृत्ती मंच'
                      : currentLanguage === 'hi'
                      ? 'AI-संचालित छात्रवृत्ति सहायता मंच'
                      : 'AI-Powered Scholarship Discovery Platform'}
                  </span>
                </div>

                {/* Hero Title */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
                  {currentLanguage === 'mr' ? (
                    <>
                      तुमच्या शिक्षणासाठी <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">योग्य शिष्यवृत्ती</span> शोधा
                    </>
                  ) : currentLanguage === 'hi' ? (
                    <>
                      अपनी शिक्षा के लिए <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">सही छात्रवृत्ति</span> खोजें
                    </>
                  ) : (
                    <>
                      Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">Right Scholarships</span> for Your Education
                    </>
                  )}
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                  {currentLanguage === 'mr'
                    ? 'MahaDBT, राष्ट्रीय शिष्यवृत्ती पोर्टल (NSP), AICTE, आणि खाजगी ट्रस्ट्सच्या सर्व सत्यापित योजनांची अचूक माहिती व कृत्रिम बुद्धिमत्ता सहाय्यक.'
                    : currentLanguage === 'hi'
                    ? 'MahaDBT, राष्ट्रीय छात्रवृत्ति पोर्टल (NSP), AICTE और निजी ट्रस्ट्स की सभी सत्यापित योजनाओं की सटीक जानकारी एवं AI सहायक।'
                    : 'Verified central, state, MahaDBT, AICTE, and private foundation scholarships for Indian students, with AI eligibility checking.'}
                </p>

                {/* Action CTAs */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setIsCheckerModalOpen(true)}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>
                      {currentLanguage === 'mr' ? 'पात्रता तपासा (२ मिनिटांत)' : currentLanguage === 'hi' ? 'पात्रता जांचें (२ मिनट में)' : 'Check Your Eligibility'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 backdrop-blur-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Mic className="w-4 h-4 text-amber-400" />
                    <span>
                      {currentLanguage === 'mr' ? 'व्हॉइस AI सहाय्यक' : currentLanguage === 'hi' ? 'वॉयस AI सहायक' : 'AI Voice Assistant'}
                    </span>
                  </button>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-left">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xl sm:text-2xl font-black text-amber-400 block">10+</span>
                    <span className="text-2xs text-slate-300 font-semibold uppercase">Verified Portals</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xl sm:text-2xl font-black text-emerald-400 block">₹50K+</span>
                    <span className="text-2xs text-slate-300 font-semibold uppercase">Max Yearly Grant</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xl sm:text-2xl font-black text-blue-400 block">100%</span>
                    <span className="text-2xs text-slate-300 font-semibold uppercase">Zero Aadhaar Storage</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xl sm:text-2xl font-black text-purple-400 block">30/7/1d</span>
                    <span className="text-2xs text-slate-300 font-semibold uppercase">Deadline Reminders</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Scholarship Directory Component */}
            <ScholarshipDirectory
              language={currentLanguage}
              savedIds={savedScholarshipIds}
              onToggleBookmark={handleToggleScholarshipBookmark}
              onViewDetails={(sch) => setSelectedScholarship(sch)}
              onOpenChecker={() => setIsCheckerModalOpen(true)}
            />
          </div>
        )}

        {/* VIEW B: SAHAYAKON 2.0 CITIZEN DASHBOARD & SCHOLARSHIP TRACKER */}
        {activeView === 'dashboard' && (
          <div>
            {/* View Sub-header Tabs */}
            <div className="bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDashboardTab('citizen')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      dashboardTab === 'citizen'
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>🏛️</span>
                    <span>
                      {currentLanguage === 'mr' ? 'नागरिक लाभ व डिजिलॉकर' : currentLanguage === 'hi' ? 'नागरिक कल्याण एवं डिजिलॉकर' : 'Sahayakon 2.0 Citizen Hub'}
                    </span>
                  </button>

                  <button
                    onClick={() => setDashboardTab('student')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      dashboardTab === 'student'
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>🎓</span>
                    <span>
                      {currentLanguage === 'mr' ? 'विद्यार्थी शिष्यवृत्ती' : currentLanguage === 'hi' ? 'छात्र छात्रवृत्ति' : 'Student Scholarship Tracker'}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsDigiLockerModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span>🔒</span>
                    <span>{digiLockerSession.isConnected ? 'DigiLocker Synced' : 'Connect DigiLocker'}</span>
                  </button>
                  <button
                    onClick={() => setIsCheckerModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentLanguage === 'mr' ? 'पात्रता तपासा' : currentLanguage === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
                  </button>
                </div>
              </div>
            </div>

            {dashboardTab === 'citizen' ? (
              <CitizenDashboard
                language={currentLanguage}
                profile={studentProfile}
                schemes={schemesData}
                notifications={notifications}
                digiLockerSession={digiLockerSession}
                digiLockerDocs={digiLockerDocs}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onOpenDigiLocker={() => setIsDigiLockerModalOpen(true)}
                onOpenEligibilityChecker={() => setIsCheckerModalOpen(true)}
                onOpenVoiceAssistant={() => setIsChatOpen(true)}
                onViewScheme={handleViewSchemeRecord}
                onRemoveSavedScheme={(id) => handleToggleSchemeBookmark(id)}
                onMarkNotificationRead={(id) => {
                  setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
                }}
                onWithdrawConsent={() => {
                  if (studentProfile) {
                    const updated = { ...studentProfile, consentGiven: false };
                    setStudentProfile(updated);
                    saveStoredProfile(updated);
                    showToast(currentLanguage === 'mr' ? 'सहमती मागे घेतली!' : 'Consent withdrawn!');
                  }
                }}
              />
            ) : (
              <StudentDashboard
                language={currentLanguage}
                profile={studentProfile}
                notifications={notifications}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onOpenVoiceAssistant={() => setIsChatOpen(true)}
                onViewScholarship={(sch) => setSelectedScholarship(sch)}
                onRemoveSaved={(id) => handleToggleScholarshipBookmark(id)}
                onRefreshNotifications={() => setNotifications(getStoredNotifications())}
              />
            )}
          </div>
        )}

        {/* VIEW C: ALL GENERAL GOVERNMENT SCHEMES (Preserving Existing Functionality) */}
        {activeView === 'schemes' && (
          <div>
            {/* General Schemes Hero */}
            <Hero
              language={currentLanguage}
              onSearch={(term) => setSearchTerm(term)}
              onOpenChat={() => setIsChatOpen(true)}
            />

            {/* Recently Viewed Schemes Bar */}
            <RecentlyViewed
              language={currentLanguage}
              recentIds={recentlyViewedIds}
              onViewScheme={handleViewScheme}
            />

            {/* Category Explorer Grid */}
            <CategorySection
              language={currentLanguage}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* Main Government Schemes List & Filters */}
            <SchemeList
              schemes={schemesData}
              language={currentLanguage}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedLevel={selectedLevel}
              onLevelChange={setSelectedLevel}
              bookmarkedIds={savedSchemeIds}
              onToggleBookmark={handleToggleSchemeBookmark}
              onViewDetails={handleViewScheme}
              onShare={handleShareScheme}
            />

            {/* FAQs Accordion */}
            <FAQSection language={currentLanguage} />
          </div>
        )}

      </main>

      {/* 4. Global Footer */}
      <Footer
        language={currentLanguage}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      {/* Floating Sticky AI Voice & Chat Assistant Launcher Button */}
      <aside aria-label="AI Assistant Quick Launch" className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatOpen(true)}
          className="group relative flex items-center gap-3 px-4 py-3.5 rounded-full bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm shadow-2xl shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-amber-400"
          aria-label="Open Sahayak AI Chat Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-blue-900 absolute -top-1 -right-1 animate-ping"></span>
          </div>
          <span className="hidden sm:inline">
            {currentLanguage === 'mr' ? 'AI सहाय्यक' : currentLanguage === 'hi' ? 'AI सहायक' : 'Sahayak AI'}
          </span>
          <span className="sm:hidden font-mono text-xs">AI</span>
        </button>
      </aside>

      {/* 5. MODALS */}

      {/* A. Scholarship Detail Modal */}
      {selectedScholarship && (
        <ScholarshipDetailModal
          scholarship={selectedScholarship}
          language={currentLanguage}
          isOpen={Boolean(selectedScholarship)}
          onClose={() => setSelectedScholarship(null)}
          isSaved={savedScholarshipIds.includes(selectedScholarship.id)}
          onToggleSave={handleToggleScholarshipBookmark}
          onOpenVoiceAssistant={() => {
            setSelectedScholarship(null);
            setIsChatOpen(true);
          }}
        />
      )}

      {/* B. General Scheme Detail Modal */}
      {selectedScheme && (
        <SchemeDetailModal
          scheme={selectedScheme}
          language={currentLanguage}
          onClose={() => setSelectedScheme(null)}
          isBookmarked={savedSchemeIds.includes(selectedScheme.id)}
          onToggleBookmark={handleToggleSchemeBookmark}
          onShare={handleShareScheme}
        />
      )}

      {/* C. Sahayakon 2.0 Smart Eligibility Checker Modal */}
      <SmartEligibilityModal
        isOpen={isCheckerModalOpen}
        onClose={() => setIsCheckerModalOpen(false)}
        language={currentLanguage}
        schemes={schemesData}
        currentProfile={studentProfile}
        onSaveProfile={(prof) => {
          setStudentProfile(prof);
          saveStoredProfile(prof);
          showToast(currentLanguage === 'mr' ? 'नागरिक प्रोफाइल अद्यतन केले!' : 'Citizen profile updated!');
        }}
        onViewSchemeDetails={handleViewSchemeRecord}
      />

      {/* C2. DigiLocker Document Locker Modal */}
      <DigiLockerModal
        isOpen={isDigiLockerModalOpen}
        onClose={() => {
          setIsDigiLockerModalOpen(false);
          setDigiLockerSession(getStoredSession());
          setDigiLockerDocs(getStoredDigiLockerDocs());
        }}
        language={currentLanguage}
        onDocumentsUpdated={() => {
          setDigiLockerSession(getStoredSession());
          setDigiLockerDocs(getStoredDigiLockerDocs());
          showToast(currentLanguage === 'mr' ? 'दस्तऐवज अद्यतनित झाले!' : 'DigiLocker documents synced!');
        }}
      />

      {/* D. Student Auth & Profile Modal (Mobile OTP + Manual Form) */}
      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={currentLanguage}
        currentProfile={studentProfile}
        onProfileUpdated={(prof) => {
          setStudentProfile(prof);
          showToast(prof ? 'Student session active!' : 'Logged out.');
        }}
      />

      {/* E. Admin Scholarship Management Modal */}
      <AdminScholarshipModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        language={currentLanguage}
        onScholarshipsUpdated={(updated) => {
          setScholarshipsList(updated);
          showToast('Scholarship repository updated!');
        }}
      />

      {/* F. Multilingual AI Voice & Chat Assistant Modal */}
      <ChatAssistant
        language={currentLanguage}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenSchemeDetail={(scheme) => {
          setIsChatOpen(false);
          handleViewScheme(scheme);
        }}
      />

      {/* G. Saved Bookmarks Modal */}
      <SavedSchemesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        language={currentLanguage}
        savedIds={savedSchemeIds}
        onRemoveBookmark={handleToggleSchemeBookmark}
        onClearAll={handleClearAllBookmarks}
        onViewScheme={handleViewScheme}
      />

      {/* H. Citizen Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        language={currentLanguage}
      />

      {/* I. Citizen Privacy & Data Protection Notice Modal */}
      <PrivacyNoticeModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        language={currentLanguage}
      />

      {/* 6. Dynamic Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
