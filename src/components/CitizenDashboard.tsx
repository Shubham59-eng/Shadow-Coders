import React, { useState } from 'react';
import { 
  Bookmark, 
  Bell, 
  CheckCircle2, 
  Mic, 
  ArrowRight, 
  Trash2, 
  Sparkles, 
  FolderLock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import type { 
  Language, 
  CitizenProfile, 
  SchemeRecord, 
  NotificationDeliveryLog,
  DigiLockerSession,
  DigiLockerDocument
} from '../types';
import { rankCitizenSchemes } from '../services/smartEligibilityEngine';
import { DocumentReadinessChecker } from './DocumentReadinessChecker';

interface CitizenDashboardProps {
  language: Language;
  profile: CitizenProfile | null;
  schemes: SchemeRecord[];
  notifications: NotificationDeliveryLog[];
  digiLockerSession: DigiLockerSession;
  digiLockerDocs: DigiLockerDocument[];
  onOpenAuth: () => void;
  onOpenDigiLocker: () => void;
  onOpenEligibilityChecker: () => void;
  onOpenVoiceAssistant: () => void;
  onViewScheme: (scheme: SchemeRecord) => void;
  onRemoveSavedScheme: (id: string) => void;
  onMarkNotificationRead: (id: string) => void;
  onWithdrawConsent: () => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  language,
  profile,
  schemes,
  notifications,
  digiLockerSession,
  digiLockerDocs,
  onOpenAuth,
  onOpenDigiLocker,
  onOpenEligibilityChecker,
  onOpenVoiceAssistant,
  onViewScheme,
  onRemoveSavedScheme,
  onMarkNotificationRead,
  onWithdrawConsent,
}) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'saved' | 'documents' | 'notifications' | 'privacy'>('matches');
  const [selectedSchemeForReadiness, setSelectedSchemeForReadiness] = useState<SchemeRecord | null>(null);

  // Compute profile readiness score (0 - 100%)
  const computeReadinessScore = () => {
    let score = 20; // Base score for guest
    if (profile?.mobile) score += 20;
    if (profile?.familyIncome) score += 15;
    if (profile?.state) score += 10;
    if (digiLockerSession.isConnected) score += 20;
    if (digiLockerDocs.length > 2) score += 15;
    return Math.min(score, 100);
  };

  const readinessScore = computeReadinessScore();

  // Evaluate schemes for current citizen profile
  const mockProfile: CitizenProfile = profile || {
    id: 'guest',
    name: 'Citizen Guest',
    mobile: '9876543210',
    state: 'Maharashtra',
    district: 'Pune',
    age: 21,
    gender: 'Female',
    socialCategory: 'Open',
    minorityStatus: 'None',
    familyIncome: 200000,
    occupation: 'Student',
    farmerStatus: 'None',
    isStudent: true,
    educationLevel: 'Engineering',
    currentCourse: 'B.Tech',
    previousMarksPercentage: 78,
    isHostelite: false,
    disabilityStatus: false,
    existingBenefitsReceived: [],
    availableDocCodes: digiLockerDocs.map(d => d.docCode),
    consentGiven: true,
    dataSharingPreferences: { allowDigiLockerSync: true, allowNotificationDispatch: true, allowAnonymousAnalytics: false },
    savedSchemeIds: [],
    appliedSchemeIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const evaluated = rankCitizenSchemes(mockProfile, schemes);
  const savedSchemes = schemes.filter(s => (profile?.savedSchemeIds || []).includes(s.id));

  const t = {
    mr: {
      dashboardTitle: 'नागरिक व विद्यार्थी डॅशबोर्ड (Citizen Dashboard)',
      profileSummary: 'वैयक्तिक माहिती व पात्रता स्थिती',
      readiness: 'प्रोफाईल व कागदपत्रे तयारी',
      digiLockerBanner: 'डिजिटल डॉक्युमेंट लॉकर स्थिती',
      tabMatches: 'पात्र योजना (Matches)',
      tabSaved: 'जतन केलेल्या योजना (Saved)',
      tabDocs: 'कागदपत्रे तपासणी (Document Vault)',
      tabNotifs: 'सूचना व संदेश नोंद (Delivery Logs)',
      tabPrivacy: 'गोपनीयता व संमती (Privacy & Consent)',
      potentially: 'पात्र असण्याची दाट शक्यता',
      moreInfo: 'अधिक माहिती आवश्यक',
      notMet: 'अटी पूर्ण नाहीत',
      noSaved: 'कोणतीही योजना जतन केलेली नाही. योजना शोधून ⭐ वर क्लिक करा.',
      noNotifs: 'सर्व सूचना वाचल्या आहेत. नवीन मुदत सूचना येथे दिसतील.',
      officialPortal: 'अधिकृत पोर्टलवर जा'
    },
    hi: {
      dashboardTitle: 'नागरिक एवं छात्र डैशबोर्ड (Citizen Dashboard)',
      profileSummary: 'व्यक्तिगत विवरण एवं पात्रता स्थिति',
      readiness: 'प्रोफाइल एवं दस्तावेज तैयारी',
      digiLockerBanner: 'डिजिटल डॉक्यूमेंट लॉकर स्थिति',
      tabMatches: 'पात्र योजनाएं (Matches)',
      tabSaved: 'सहेजी गई योजनाएं (Saved)',
      tabDocs: 'दस्तावेज वॉल्ट (Document Vault)',
      tabNotifs: 'सूचनाएं एवं वितरण लॉग (Delivery Logs)',
      tabPrivacy: 'गोपनीयता एवं सहमति (Privacy & Consent)',
      potentially: 'पात्र होने की पूरी संभावना',
      moreInfo: 'अतिरिक्त जानकारी आवश्यक',
      notMet: 'शर्तें पूरी नहीं',
      noSaved: 'कोई योजना सहेजी नहीं गई है।',
      noNotifs: 'सभी सूचनाएं अद्यतित हैं।',
      officialPortal: 'आधिकारिक पोर्टल पर जाएं'
    },
    en: {
      dashboardTitle: 'Citizen & Student Dashboard (Sahayakon 2.0)',
      profileSummary: 'Verified Citizen Profile & Readiness Status',
      readiness: 'Profile & Document Readiness',
      digiLockerBanner: 'Digital Document Locker Status',
      tabMatches: 'Matched Schemes',
      tabSaved: 'Saved Schemes & Deadlines',
      tabDocs: 'Document Readiness Vault',
      tabNotifs: 'Notifications & Delivery Logs',
      tabPrivacy: 'Privacy & Consent Controls',
      potentially: 'Potentially Eligible',
      moreInfo: 'More Info Required',
      notMet: 'Conditions Not Met',
      noSaved: 'No saved schemes yet. Explore schemes and click ⭐ to save.',
      noNotifs: 'You are all caught up! Deadline alerts will appear here.',
      officialPortal: 'Visit Official Portal'
    }
  }[language];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Profile & DigiLocker Hero Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-2xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {profile ? 'Verified Citizen Profile' : 'Guest Citizen Session'}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-2xs font-extrabold ${
              digiLockerSession.isConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-700 text-slate-300'
            }`}>
              {digiLockerSession.isConnected ? '🟢 DigiLocker Synced' : '⚪ DigiLocker Unlinked'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {profile?.name || 'Welcome to Sahayakon 2.0'}
          </h2>

          <p className="text-xs text-slate-300">
            {profile 
              ? `${profile.state} • ${profile.district} • ${profile.occupation} • ${profile.socialCategory} Category`
              : 'Complete your profile and connect DigiLocker to discover personalized government welfare schemes.'}
          </p>
        </div>

        {/* Readiness Meter Card */}
        <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl flex items-center gap-4 shrink-0">
          <div>
            <span className="text-2xs uppercase tracking-wider text-slate-300 block font-semibold">{t.readiness}</span>
            <span className="text-3xl font-black text-amber-400">{readinessScore}%</span>
          </div>
          <div className="space-y-1.5">
            <button
              onClick={profile ? onOpenAuth : onOpenAuth}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold transition-all cursor-pointer block text-center"
            >
              {profile ? 'Edit Profile' : 'Student / Citizen Login'}
            </button>
            <button
              onClick={onOpenDigiLocker}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all cursor-pointer block text-center"
            >
              {digiLockerSession.isConnected ? 'Manage Locker' : 'Connect DigiLocker'}
            </button>
            <button
              onClick={onOpenVoiceAssistant}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full text-center"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'matches'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t.tabMatches} ({evaluated.potentiallyEligible.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'saved'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-4 h-4 text-emerald-400" />
          <span>{t.tabSaved} ({savedSchemes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'documents'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderLock className="w-4 h-4 text-indigo-400" />
          <span>{t.tabDocs} ({digiLockerDocs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4 text-rose-400" />
          <span>{t.tabNotifs} ({notifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'privacy'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>{t.tabPrivacy}</span>
        </button>
      </div>

      {/* TAB 1: MATCHED SCHEMES */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Schemes Matching Your Current Citizen Profile
              </h3>
              <p className="text-xs text-slate-500">
                Rule-based outcomes evaluated without guessing criteria.
              </p>
            </div>
            <button
              onClick={onOpenEligibilityChecker}
              className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Retake Eligibility Questionnaire</span>
            </button>
          </div>

          {/* Section A: Potentially Eligible */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.potentially} ({evaluated.potentiallyEligible.length})</span>
            </h4>

            {evaluated.potentiallyEligible.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No schemes currently match 100% of criteria. Review "More Info Needed" below.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evaluated.potentiallyEligible.map((result) => {
                  const s = schemes.find(item => item.id === result.schemeId);
                  return (
                    <div key={result.schemeId} className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 shadow-2xs space-y-3 transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Potentially Eligible ({result.matchScore}%)
                          </span>
                          <span className="text-2xs font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            {result.category}
                          </span>
                        </div>
                        <h5 className="font-extrabold text-sm text-slate-900">
                          {result.schemeTitle[language] || result.schemeTitle.en}
                        </h5>
                        <p className="text-xs text-slate-600">
                          Benefit: <strong className="text-emerald-950">{result.verifiedBenefit[language] || result.verifiedBenefit.en}</strong>
                        </p>
                        <p className="text-2xs text-slate-500">
                          Deadline: <strong className="text-slate-800">{result.verifiedDeadline || 'Announced Soon'}</strong>
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => s && onViewScheme(s)}
                          className="text-xs font-bold text-blue-900 hover:underline"
                        >
                          View Details &rarr;
                        </button>
                        <button
                          onClick={() => {
                            if (s) setSelectedSchemeForReadiness(s);
                            setActiveTab('documents');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                        >
                          Check Docs
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section B: More Info Required */}
          {evaluated.moreInfoRequired.length > 0 && (
            <div className="space-y-3 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{t.moreInfo} ({evaluated.moreInfoRequired.length})</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evaluated.moreInfoRequired.map((result) => {
                  const s = schemes.find(item => item.id === result.schemeId);
                  return (
                    <div key={result.schemeId} className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-300 shadow-2xs space-y-3 transition-all flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                            More Info Required ({result.matchScore}%)
                          </span>
                          <span className="text-2xs font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            {result.category}
                          </span>
                        </div>
                        <h5 className="font-extrabold text-sm text-slate-900">
                          {result.schemeTitle[language] || result.schemeTitle.en}
                        </h5>
                        <div className="p-2.5 rounded-xl bg-amber-50 text-2xs text-amber-900 space-y-1">
                          <span className="font-bold block">Missing Attributes:</span>
                          {result.missingInformation.map((m, i) => (
                            <p key={i}>• {m[language] || m.en}</p>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => s && onViewScheme(s)}
                          className="text-xs font-bold text-blue-900 hover:underline"
                        >
                          View Criteria &rarr;
                        </button>
                        <button
                          onClick={onOpenEligibilityChecker}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold"
                        >
                          Complete Info
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED SCHEMES & DEADLINES */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">
              Your Bookmarked Schemes &amp; Approaching Deadlines
            </h3>
            <span className="text-xs text-slate-500 font-medium">{savedSchemes.length} Schemes Tracked</span>
          </div>

          {savedSchemes.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">{t.noSaved}</p>
              <button
                onClick={() => setActiveTab('matches')}
                className="px-4 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold"
              >
                Explore Matched Schemes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedSchemes.map((scheme) => (
                <div key={scheme.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold bg-blue-100 text-blue-800">
                        {scheme.status}
                      </span>
                      <span className="text-2xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
                        {scheme.category}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900">
                      {scheme.title ? (scheme.title[language] || scheme.title.en) : (scheme.name ? (scheme.name[language] || scheme.name.en) : scheme.id)}
                    </h4>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <p className="text-slate-500 font-medium">Deadline: <strong className="text-slate-900">{scheme.applicationDeadline || 'Announced Soon'}</strong></p>
                      <p className="text-slate-500 font-medium">Department: <strong className="text-slate-900">{scheme.issuingOrganization}</strong></p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onRemoveSavedScheme(scheme.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewScheme(scheme)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-100"
                      >
                        Details
                      </button>
                      <a
                        href={scheme.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DIGITAL DOCUMENT LOCKER & READINESS CHECKER */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-blue-900" />
                <span>Digital Document Locker (DigiLocker Integration)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {digiLockerSession.isConnected
                  ? `Active session synced: ${digiLockerDocs.length} verified documents loaded.`
                  : 'Link your DigiLocker account to automatically verify document eligibility.'}
              </p>
            </div>

            <button
              onClick={onOpenDigiLocker}
              className="px-5 py-2.5 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{digiLockerSession.isConnected ? 'Manage Vault' : 'Connect DigiLocker'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Scheme-Specific Readiness Checker */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">
              Scheme-Specific Document Readiness Comparator
            </h4>

            {schemes.length > 0 && (
              <DocumentReadinessChecker
                language={language}
                scheme={selectedSchemeForReadiness || schemes[0]}
                availableDocs={digiLockerDocs}
                onOpenDigiLocker={onOpenDigiLocker}
              />
            )}
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS & DELIVERY LOGS */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900">
              Notification Center &amp; Deduplicated Delivery Logs
            </h3>
            <span className="text-2xs text-slate-400">
              Prevents duplicate alerts within 24-hour window
            </span>
          </div>

          {notifications.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-2">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">{t.noNotifs}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((log) => (
                <div
                  key={log.id}
                  onClick={() => onMarkNotificationRead(log.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    log.read ? 'bg-white border-slate-200 text-slate-700' : 'bg-blue-50/80 border-blue-300 text-blue-950 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black">{log.title[language] || log.title.en}</span>
                        <span className="text-3xs uppercase font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {log.channel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {log.message[language] || log.message.en}
                      </p>
                      <span className="text-2xs text-slate-400 mt-1 block">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <span className="text-2xs font-bold text-blue-900 shrink-0">
                    {log.read ? 'Read' : 'New Alert'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PRIVACY & CONSENT CONTROLS */}
      {activeTab === 'privacy' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Informed Consent, Privacy &amp; Data Deletion Controls</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Under Indian Digital Personal Data Protection standards, you have the right to revoke consent and delete stored session information at any time.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">External Notification Channels Consent</span>
                <span className="text-2xs text-slate-500">Allow receiving permitted scheme match reminders via SMS / Email</span>
              </div>
              <button
                onClick={onWithdrawConsent}
                className="px-3.5 py-1.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-2xs font-bold"
              >
                Withdraw Consent
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Digital Document Locker Revocation</span>
                <span className="text-2xs text-slate-500">Wipes all cached document metadata and disconnects DigiLocker session</span>
              </div>
              <button
                onClick={onOpenDigiLocker}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-2xs font-bold"
              >
                Revoke Locker Access
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-950 block">Delete Account &amp; Wipe All Data</span>
                <span className="text-2xs text-rose-800">Irreversibly delete profile, saved schemes, and notifications</span>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your profile and wipe all data?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-2xs font-bold"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
