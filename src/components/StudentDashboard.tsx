import React, { useState } from 'react';
import { 
  GraduationCap, 
  Bookmark, 
  Bell, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  Mic, 
  ArrowRight, 
  Trash2, 
  Sparkles,
  Settings,
  ChevronRight
} from 'lucide-react';
import type { 
  Language, 
  StudentProfile, 
  Scholarship, 
  StudentNotification 
} from '../types';
import { calculateProfileCompletion } from '../services/authService';
import { rankMatchingScholarships } from '../services/eligibilityService';
import { scholarshipsData } from '../data/scholarshipsData';
import { markNotificationAsRead } from '../services/notificationService';

interface StudentDashboardProps {
  language: Language;
  profile: StudentProfile | null;
  notifications: StudentNotification[];
  onOpenAuth: () => void;
  onOpenVoiceAssistant: () => void;
  onViewScholarship: (scholarship: Scholarship) => void;
  onRemoveSaved: (id: string) => void;
  onRefreshNotifications: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  language,
  profile,
  notifications,
  onOpenAuth,
  onOpenVoiceAssistant,
  onViewScholarship,
  onRemoveSaved,
  onRefreshNotifications,
}) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'saved' | 'checklist' | 'notifications'>('matches');

  // Application process tracking steps
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'profile-ready': Boolean(profile?.name),
    'docs-gathered': false,
    'portal-applied': false,
    'college-verified': false,
  });

  const [documentVault, setDocumentVault] = useState<Record<string, boolean>>({
    'domicile': true,
    'income': true,
    'marksheet': true,
    'caste-cert': false,
    'caste-validity': false,
    'fee-receipt': false,
    'bonafide': false,
  });

  const completionPct = calculateProfileCompletion(profile);

  // Match ranked scholarships for student
  const matchedResults = profile 
    ? rankMatchingScholarships(profile, scholarshipsData)
    : [];

  const savedScholarships = ((profile?.savedScholarshipIds as string[]) || [])
    .map((id: string) => scholarshipsData.find((s: Scholarship) => s.id === id))
    .filter((s): s is Scholarship => Boolean(s));

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const handleStepToggle = (stepId: string) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleDocToggle = (docId: string) => {
    setDocumentVault(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const handleNotificationClick = (notif: StudentNotification) => {
    markNotificationAsRead(notif.id);
    onRefreshNotifications();
    if (notif.scholarshipId) {
      const scheme = scholarshipsData.find(s => s.id === notif.scholarshipId);
      if (scheme) onViewScholarship(scheme);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-900 font-extrabold text-2xl flex items-center justify-center shadow-lg">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : '🎓'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black">
                    {profile?.name ? profile.name : 'Welcome, Student!'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold bg-amber-400 text-slate-950">
                    {profile?.educationLevel || 'Student Account'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {profile 
                    ? `${profile.currentCourse} • ${profile.institutionName || profile.state} • Category: ${profile.socialCategory}`
                    : 'Create your profile to receive automated scholarship match results and deadline alerts.'}
                </p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={onOpenVoiceAssistant}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Mic className="w-4 h-4 text-slate-950" />
                <span>Voice Assistant</span>
              </button>

              <button
                onClick={onOpenAuth}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-amber-400" />
                <span>{profile ? 'Edit Profile' : 'Setup Profile'}</span>
              </button>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex-1 max-w-md">
              <div className="flex justify-between font-bold mb-1">
                <span>Profile Completion Status:</span>
                <span className="text-amber-400 font-mono">{completionPct}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${completionPct}%` }}
                ></div>
              </div>
            </div>

            <span className="text-2xs text-slate-300">
              🔒 Zero-Aadhaar Guaranteed • Stored with Student Consent
            </span>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none font-bold text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('matches')}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'matches'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Matching Scholarships ({matchedResults.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'saved'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>Saved Scholarships ({savedScholarships.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'checklist'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Document Vault & Checklist</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer relative ${
              activeTab === 'notifications'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-4 h-4 text-blue-900" />
            <span>Reminders & Alerts</span>
            {unreadNotifsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-2xs flex items-center justify-center font-bold">
                {unreadNotifsCount}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: MATCHING SCHOLARSHIPS */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">
                Scholarships Matching Your Profile
              </h3>
              <span className="text-2xs font-semibold text-slate-500">
                Sorted by Eligibility Confidence
              </span>
            </div>

            {matchedResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {matchedResults.map((result) => {
                  const s = result.scholarship;
                  const isEligible = result.status === 'Eligible';

                  return (
                    <div
                      key={s.id}
                      className={`p-5 rounded-2xl border-2 transition-all bg-white flex flex-col justify-between ${
                        isEligible ? 'border-emerald-300' : 'border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-2xs font-extrabold px-2 py-0.5 rounded-full ${
                            isEligible ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                          }`}>
                            {result.status} ({result.matchScore}%)
                          </span>
                          <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {s.type}
                          </span>
                        </div>

                        <h4 
                          onClick={() => onViewScholarship(s)}
                          className="font-bold text-sm sm:text-base text-slate-900 hover:text-blue-900 cursor-pointer line-clamp-2 mb-1"
                        >
                          {s.name[language]}
                        </h4>
                        <div className="text-2xs text-slate-500 mb-3 truncate">
                          {s.issuingOrganization}
                        </div>

                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-900 font-bold text-xs mb-3">
                          {s.benefits[language][0]}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-2xs">
                          Deadline: {s.applicationDeadline || 'Announced soon'}
                        </span>
                        <button
                          onClick={() => onViewScholarship(s)}
                          className="font-bold text-blue-900 hover:text-amber-600 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Checklist & Apply</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200">
                <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h4 className="font-bold text-base text-slate-900">No profile matches computed yet</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">Please set up your student profile to view tailored scholarships.</p>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 rounded-xl bg-blue-900 text-white font-bold text-xs"
                >
                  Configure Profile
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED SCHOLARSHIPS WITH DEADLINE COUNTDOWN */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              Your Bookmarked Scholarships & Deadline Calendar
            </h3>

            {savedScholarships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedScholarships.map((s) => {
                  const deadline = s.applicationDeadline ? new Date(s.applicationDeadline) : null;
                  const diffDays = deadline ? Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

                  return (
                    <div key={s.id} className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between gap-4 shadow-2xs">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                            {s.type}
                          </span>

                          {diffDays !== null ? (
                            <span className={`text-2xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              diffDays <= 7 ? 'bg-red-100 text-red-900' : 'bg-amber-100 text-amber-900'
                            }`}>
                              <Clock className="w-3 h-3" />
                              <span>{diffDays >= 0 ? `${diffDays} days remaining` : 'Deadline passed'}</span>
                            </span>
                          ) : (
                            <span className="text-2xs text-slate-400">Date Not Announced</span>
                          )}
                        </div>

                        <h4 className="font-bold text-base text-slate-900 mb-1">
                          {s.name[language]}
                        </h4>
                        <p className="text-xs text-emerald-800 font-bold mb-2">
                          {s.benefits[language][0]}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => onViewScholarship(s)}
                          className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs"
                        >
                          View Roadmap
                        </button>
                        <button
                          onClick={() => onRemoveSaved(s.id)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200">
                <Bookmark className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h4 className="font-bold text-base text-slate-900">No saved scholarships yet</h4>
                <p className="text-xs text-slate-500 mt-1">Click the bookmark icon on any scholarship card to track its deadline here.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DOCUMENT VAULT & CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Document Readiness Checklist */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-emerald-600" />
                  <span>Student Document Readiness Vault</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Tick off documents you have prepared to streamline your online portal applications:
                </p>

                <div className="space-y-2.5">
                  {[
                    { id: 'domicile', label: 'Maharashtra Domicile Certificate' },
                    { id: 'income', label: 'Current Year Tehsildar Income Certificate (< ₹8L)' },
                    { id: 'marksheet', label: 'Previous Academic Year Marksheet' },
                    { id: 'caste-cert', label: 'Caste Certificate (For SC/ST/OBC/VJNT)' },
                    { id: 'caste-validity', label: 'Caste Validity Certificate (For Professional Courses)' },
                    { id: 'bonafide', label: 'Current Year College Bonafide Certificate' },
                    { id: 'fee-receipt', label: 'College Tuition Fee Official Receipt' },
                  ].map(doc => {
                    const isChecked = !!documentVault[doc.id];
                    return (
                      <div
                        key={doc.id}
                        onClick={() => handleDocToggle(doc.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isChecked ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-emerald-600 pointer-events-none"
                        />
                        <span className="text-xs">{doc.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Application & Renewal Steps Tracker */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-900" />
                  <span>Application & Renewal Progress Stages</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Track your real-world progress for government scholarship disbursement:
                </p>

                <div className="space-y-3">
                  {[
                    { id: 'profile-ready', step: 'Step 1', title: 'Sahayak AI Eligibility Check Completed', desc: 'Matched matching schemes based on income and academic percentage.' },
                    { id: 'docs-gathered', step: 'Step 2', title: 'Mandatory Documents Collected & Scanned', desc: 'Income certificate, bonafide, and fee receipts prepared.' },
                    { id: 'portal-applied', step: 'Step 3', title: 'Applied on Official Portal (NSP / MahaDBT)', desc: 'Submitted online application and saved Application ID.' },
                    { id: 'college-verified', step: 'Step 4', title: 'College & District Authority Verification', desc: 'College clerk verified original documents.' },
                  ].map((s) => {
                    const done = !!completedSteps[s.id];
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleStepToggle(s.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          done ? 'bg-blue-50/80 border-blue-300 text-blue-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          done ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {done ? '✓' : s.step.replace('Step ', '')}
                        </div>
                        <div>
                          <div className="text-xs font-bold">{s.title}</div>
                          <div className="text-2xs text-slate-500 mt-0.5">{s.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS & REMINDERS */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">
                In-App Deadline Reminders & Updates
              </h3>
              <span className="text-2xs text-slate-400">
                Configurable: 30 days, 7 days, 1 day before verified deadlines
              </span>
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      notif.read ? 'bg-white border-slate-200 text-slate-700' : 'bg-blue-50/80 border-blue-300 text-blue-950 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold">{notif.title[language]}</div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {notif.message[language]}
                        </p>
                        <span className="text-2xs text-slate-400 mt-1 block">
                          {new Date(notif.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-blue-900">
                      <span>View</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-base text-slate-900">No active alerts</h4>
                <p className="text-xs text-slate-500 mt-1">You are all caught up! Deadline alerts will appear here as dates approach.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
