import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Building2, 
  FileText, 
  ListOrdered, 
  Sparkles, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Share2, 
  Bookmark,
  Calendar,
  AlertCircle,
  Bell,
  ArrowLeft
} from 'lucide-react';
import type { Language, Scheme, DigiLockerDocument } from '../types';
import { translations } from '../data/translations';
import { DocumentReadinessChecker } from './DocumentReadinessChecker';
import { VERIFIED_GOVERNMENT_NOTIFICATIONS } from '../data/notificationsData';

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  language: Language;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (schemeId: string) => void;
  onShare: (scheme: Scheme) => void;
  availableDocs?: DigiLockerDocument[];
  onOpenDigiLocker?: () => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  language,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onShare,
  availableDocs = [],
  onOpenDigiLocker,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'benefits' | 'eligibility' | 'documents' | 'steps' | 'notifications'>('overview');
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const t = translations[language].schemeDetail;

  useEffect(() => {
    setCheckedDocs({});
    setActiveTab('overview');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [scheme]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!scheme) return null;

  const schemeTitle = scheme.title?.[language] || scheme.name?.[language] || scheme.title?.en || '';
  const schemeHighlight = scheme.keyHighlight?.[language] || scheme.keyHighlight?.en || '';

  // Related verified notifications
  const relatedNotifications = VERIFIED_GOVERNMENT_NOTIFICATIONS.filter(
    (notif) => notif.schemeId === scheme.id || (notif.schemeId && scheme.id.includes(notif.schemeId))
  );

  const toggleDocumentCheck = (doc: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [doc]: !prev[doc]
    }));
  };

  const handleCopySummary = () => {
    const textToCopy = `${schemeTitle}\n` +
      `Authority: ${scheme.authority || scheme.issuingOrganization || ''}\n` +
      (schemeHighlight ? `Highlight: ${schemeHighlight}\n` : '') +
      `Overview: ${scheme.shortDescription[language]}\n` +
      `Status: ${scheme.status || 'Open'}\n` +
      `Official Portal: ${scheme.officialUrl}\n` +
      `Last Verified: ${scheme.lastVerifiedDate}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${schemeTitle}. ${scheme.shortDescription[language]}. ${schemeHighlight}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    if (language === 'mr') {
      utterance.lang = 'mr-IN';
    } else if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const completedDocsCount = Object.values(checkedDocs).filter(Boolean).length;
  const totalDocsCount = scheme.requiredDocuments[language]?.length || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Tricolour Accent Stripe */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-amber-500"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-emerald-600"></div>
        </div>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
          <div className="space-y-1.5 flex-1 min-w-0">
            
            {/* Back Button & Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <button
                onClick={onClose}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer mr-1"
                title="Back to Schemes List"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-blue-900" />
                <span>{language === 'mr' ? 'योजना यादीकडे परत' : language === 'hi' ? 'योजनाओं पर वापस' : 'Back to Schemes'}</span>
              </button>

              <span className={`text-2xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                scheme.level === 'Maharashtra' ? 'bg-amber-100 text-amber-950' : 'bg-blue-100 text-blue-900'
              }`}>
                {scheme.level === 'Maharashtra' ? 'महाराष्ट्र शासन' : 'भारत सरकार (Central)'}
              </span>

              <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                <span>{scheme.status || 'Open'}</span>
              </span>

              <span className="text-2xs text-slate-500 font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{scheme.lastVerifiedDate}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {schemeTitle}
            </h2>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{scheme.authority || scheme.issuingOrganization || scheme.department}</span>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleToggleSpeech}
              title={isSpeaking ? t.stopAudio : t.listenAudio}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isSpeaking 
                  ? 'bg-amber-500 text-white animate-pulse' 
                  : 'bg-white text-slate-600 hover:text-amber-600 border border-slate-200 hover:border-amber-300'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={() => onToggleBookmark(scheme.id)}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                isBookmarked 
                  ? 'bg-amber-50 text-amber-600 border-amber-300' 
                  : 'bg-white text-slate-600 hover:text-amber-600 border-slate-200'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={() => onShare(scheme)}
              title="Share"
              className="p-2 rounded-xl bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              title="Close modal"
              className="p-2 rounded-xl bg-white text-slate-400 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto px-5 sm:px-6 pt-3 border-b border-slate-200 bg-white shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.overviewTab}
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'benefits'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.benefitsTab}
          </button>
          <button
            onClick={() => setActiveTab('eligibility')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'eligibility'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.eligibilityTab}
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'documents'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>{t.documentsTab}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-2xs font-mono">
              {completedDocsCount}/{totalDocsCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'steps'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.stepsTab}
          </button>

          {/* Related Notifications Tab */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'notifications'
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'mr' ? 'संबंधित अधिसूचना' : language === 'hi' ? 'संबंधित नोटिस' : 'Related Notices'}</span>
            {relatedNotifications.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-2xs font-bold font-mono">
                {relatedNotifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Highlight Card */}
              {scheme.keyHighlight && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border border-emerald-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      {translations[language].schemesList.keyHighlightLabel}
                    </h4>
                    <p className="text-base font-extrabold text-emerald-900 mt-0.5">
                      {scheme.keyHighlight[language]}
                    </p>
                  </div>
                </div>
              )}

              {/* Important Official Dates Panel (Requirement 8) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {language === 'mr' ? 'सद्य स्थिती (Current Status)' : language === 'hi' ? 'वर्तमान स्थिति' : 'Current Status'}
                  </span>
                  <span className="text-sm font-black text-emerald-700 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{scheme.status || 'Open'}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {language === 'mr' ? 'अंतिम मुदत (Application Deadline)' : language === 'hi' ? 'अंतिम तिथि' : 'Official Deadline'}
                  </span>
                  <span className="text-sm font-black text-slate-900 mt-0.5 block">
                    {scheme.applicationDeadline || (language === 'mr' ? 'अधिकृत पोर्टलवर पहा' : language === 'hi' ? 'पोर्टल पर देखें' : 'Ongoing / Per Portal')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {language === 'mr' ? 'शेवटची पडताळणी (Last Verified)' : language === 'hi' ? 'अंतिम सत्यापन' : 'Last Verified Date'}
                  </span>
                  <span className="text-sm font-black text-blue-900 mt-0.5 block">
                    {scheme.lastVerifiedDate}
                  </span>
                </div>
              </div>

              {scheme.targetGroup && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {translations[language].schemesList.targetLabel}
                  </h4>
                  <p className="text-sm font-medium text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {scheme.targetGroup[language]}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {t.overviewTab}
                </h4>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  {scheme.shortDescription[language]}
                </p>
              </div>

              {/* Source verification block */}
              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200/80 flex items-start gap-2.5 text-xs text-blue-950">
                <ShieldCheck className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{t.sourceLabel} </span>
                  <span className="font-medium">{scheme.officialSource}</span>
                  <div className="text-blue-800 mt-0.5">{t.verifiedOn} {scheme.lastVerifiedDate}</div>
                </div>
              </div>
            </div>
          )}

          {/* BENEFITS TAB */}
          {activeTab === 'benefits' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{t.benefitsTab}</span>
              </h4>
              <div className="grid gap-3">
                {scheme.benefits[language]?.map((benefit, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-800 font-medium leading-relaxed">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ELIGIBILITY TAB */}
          {activeTab === 'eligibility' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-900" />
                <span>{t.eligibilityTab}</span>
              </h4>
              <div className="grid gap-3">
                {(scheme.eligibility?.[language] || scheme.eligibilityCriteria?.[language] || []).map((crit: string, i: number) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✓
                    </div>
                    <span className="text-sm text-slate-800 font-medium leading-relaxed">
                      {crit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOCUMENTS CHECKLIST TAB */}
          {activeTab === 'documents' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>{t.documentsTab}</span>
                </h4>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  {completedDocsCount} of {totalDocsCount} Ready
                </span>
              </div>

              <p className="text-xs text-slate-500 font-medium">
                {t.documentChecklistNote}
              </p>

              <div className="grid gap-2.5">
                {scheme.requiredDocuments[language]?.map((doc, idx) => {
                  const isChecked = !!checkedDocs[doc];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleDocumentCheck(doc)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isChecked 
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-2xs' 
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer pointer-events-none"
                      />
                      <span className={`text-sm font-medium ${isChecked ? 'line-through text-emerald-900' : ''}`}>
                        {doc}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <DocumentReadinessChecker
                  scheme={scheme}
                  language={language}
                  availableDocs={availableDocs}
                  onOpenDigiLocker={onOpenDigiLocker || (() => {})}
                />
              </div>
            </div>
          )}

          {/* APPLICATION STEPS TAB */}
          {activeTab === 'steps' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-indigo-700" />
                <span>{t.stepsTab}</span>
              </h4>

              <div className="space-y-3 relative pl-2">
                <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-slate-200 -z-10"></div>
                {scheme.applicationSteps[language]?.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 relative">
                    <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-800 font-medium pt-1 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RELATED NOTIFICATIONS TAB (Requirement 8) */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>
                  {language === 'mr' ? 'या योजनेशी संबंधित अधिकृत शासन निर्णय व सूचना' : language === 'hi' ? 'इस योजना से संबंधित सरकारी सूचनाएं' : 'Official Circulars & Notifications for this Scheme'}
                </span>
              </h4>

              {relatedNotifications.length > 0 ? (
                <div className="space-y-3">
                  {relatedNotifications.map((notif) => (
                    <div key={notif.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-2xs font-semibold text-slate-500">
                        <span className="text-blue-900 font-bold bg-blue-100 px-2 py-0.5 rounded">
                          {notif.notificationType}
                        </span>
                        <span>{notif.officialAnnouncementDate}</span>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900">{notif.title[language] || notif.title.en}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{notif.summary[language] || notif.summary.en}</p>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-2xs text-slate-400 font-mono">{notif.officialCircularNo || notif.issuingAuthority}</span>
                        <a
                          href={notif.officialSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg bg-blue-900 text-white text-xs font-bold inline-flex items-center gap-1"
                        >
                          <span>{language === 'mr' ? 'शासन निर्णय पहा' : 'View Notice'}</span>
                          <ExternalLink className="w-3 h-3 text-amber-300" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'mr' 
                      ? 'या योजनेसाठी कोणतीही प्रलंबित किंवा मुदतवाढ सूचना नाही. योजना सध्या सामान्य नियमांनुसार सुरू आहे.' 
                      : 'No pending circulars or critical status changes. The scheme is operating under current verified guidelines.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Explicit Legal & Official Disclaimer (Requirement 8) */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-[11px] block text-amber-900">
                {language === 'mr' ? 'अधिकृत शासकीय अस्वीकृती (Disclaimer)' : language === 'hi' ? 'आधिकारिक अस्वीकरण' : 'Official Government Notice & Disclaimer'}
              </span>
              <p className="leading-relaxed">
                {language === 'mr'
                  ? 'अंतिम पात्रता, कागदपत्रांची पडताळणी आणि लाभांचे वाटप संबंधित शासकीय विभाग / प्राधिकरणाच्या अधिकृत नियमांनुसारच केले जाते. Sahayakon हे एक स्वतंत्र नागरिक माहिती व्यासपीठ असून येथे कोणत्याही मध्यस्थाची किंवा शुल्काची आवश्यकता नाही.'
                  : language === 'hi'
                  ? 'अंतिम पात्रता, दस्तावेज सत्यापन एवं लाभ की स्वीकृति संबंधित सरकारी विभाग/प्राधिकरण के नियमों पर ही निर्भर करती है। Sahayakon एक स्वतंत्र नागरिक सहायता मंच है और कोई शुल्क नहीं लेता।'
                  : 'Final eligibility, document verification, and sanctioning of benefits depend exclusively on the respective issuing Government Department or Authority. Sahayakon is an independent informational discovery platform and does not charge any fees or store citizen credentials.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions (Requirement 8) */}
        <div className="p-4 sm:p-6 pt-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'योजना यादीकडे परत' : language === 'hi' ? 'वापस' : 'Back to Schemes'}</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? t.copied : t.copyDetails}</span>
            </button>
          </div>

          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 hover:from-blue-800 hover:to-indigo-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-900/20 transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{t.officialPortalBtn}</span>
            <ExternalLink className="w-4 h-4 text-amber-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
