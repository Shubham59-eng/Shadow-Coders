import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Calendar, 
  Building2, 
  GraduationCap, 
  IndianRupee, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  Check,
  ChevronRight
} from 'lucide-react';
import type { Language, Scholarship } from '../types';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship;
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onOpenVoiceAssistant?: () => void;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  language,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const labels = {
    mr: {
      type: 'प्रकार',
      status: 'सद्यस्थिती',
      open: 'सुरू आहे',
      upcoming: 'लवकरच सुरू होईल',
      closed: 'मुदत संपली',
      notAnnounced: 'तारीख घोषित नाही',
      organization: 'वितरक प्राधिकरण / विभाग',
      financialBenefit: 'आर्थिक लाभ व सवलत',
      eligibilityRules: 'पात्रतेचे नियम व अटी',
      academicReq: 'शैक्षणिक पात्रता व किमान टक्केवारी',
      incomeLimit: 'कौटुंबिक वार्षिक उत्पन्न मर्यादा',
      category: 'पात्र सामाजिक प्रवर्ग व जात',
      domicile: 'अधिवास (राज्य)',
      requiredDocs: 'आवश्यक कागदपत्रांची यादी',
      renewalRules: 'नूतनीकरण व पुढील वर्षाचे नियम',
      stepByStepApply: 'अर्ज कसा करावा? (मार्गदर्शक टप्पे)',
      officialPortal: 'अधिकृत पोर्टलवर अर्ज करा',
      verifiedOn: 'माहिती पडताळणी तारीख',
      safeNotice: 'अस्वीकरण: ही माहिती अधिकृत सरकारी/संस्थेच्या नियमावलीनुसार आहे. अंतिम मंजुरी आणि पात्रता तपासणी संबंधित अधिकृत प्राधिकरणाकडे राखीव असते. कृपया कोणालाही आधार OTP किंवा बँक पासवर्ड देऊ नका.',
      share: 'शेअर करा',
      saved: 'जतन केले',
      save: 'जतन करा',
      close: 'बंद करा',
      copied: 'लिंक कॉपी झाली!'
    },
    hi: {
      type: 'प्रकार',
      status: 'वर्तमान स्थिति',
      open: 'आवेदन प्रारंभ',
      upcoming: 'शीघ्र प्रारंभ',
      closed: 'आवेदन समाप्त',
      notAnnounced: 'तारीख घोषित नहीं',
      organization: 'जारीकर्ता प्राधिकरण / विभाग',
      financialBenefit: 'वित्तीय लाभ व सहायता राशि',
      eligibilityRules: 'पात्रता नियम एवं शर्तें',
      academicReq: 'शैक्षणिक योग्यता एवं न्यूनतम प्रतिशत',
      incomeLimit: 'पारिवारिक वार्षिक आय सीमा',
      category: 'पात्र सामाजिक वर्ग व जाति',
      domicile: 'मूल निवास (राज्य)',
      requiredDocs: 'अनिवार्य दस्तावेजों की सूची',
      renewalRules: 'नवीनीकरण नियम एवं शर्तें',
      stepByStepApply: 'आवेदन प्रक्रिया (चरणबद्ध मार्गदर्शिका)',
      officialPortal: 'आधिकारिक पोर्टल पर आवेदन करें',
      verifiedOn: 'सत्यापन तिथि',
      safeNotice: 'अस्वीकरण: यह जानकारी आधिकारिक सरकारी दिशानिर्देशों पर आधारित है। अंतिम चयन व छात्रवृत्ति स्वीकृति का अधिकार संबंधित विभाग का है। कभी भी किसी के साथ आधार ओटीपी या बैंक पासवर्ड साझा न करें।',
      share: 'साझा करें',
      saved: 'सहेजा गया',
      save: 'सहेजें',
      close: 'बंद करें',
      copied: 'लिंक कॉपी हुआ!'
    },
    en: {
      type: 'Type',
      status: 'Current Status',
      open: 'Open for Application',
      upcoming: 'Opening Soon',
      closed: 'Closed',
      notAnnounced: 'Date Not Announced',
      organization: 'Issuing Authority / Dept',
      financialBenefit: 'Financial Benefits & Support',
      eligibilityRules: 'Eligibility Criteria & Rules',
      academicReq: 'Academic Qualification & Min Marks',
      incomeLimit: 'Family Annual Income Limit',
      category: 'Eligible Social Categories',
      domicile: 'State Domicile',
      requiredDocs: 'Mandatory Documents Checklist',
      renewalRules: 'Renewal Terms & Continuity Rules',
      stepByStepApply: 'How to Apply (Step-by-Step Roadmap)',
      officialPortal: 'Apply on Official Government Portal',
      verifiedOn: 'Last Verified on',
      safeNotice: 'Disclaimer: Scheme details are compiled from verified government notifications. Final eligibility approval is solely determined by the awarding authority. Never disclose Aadhaar OTP or bank passwords.',
      share: 'Share',
      saved: 'Saved in Dashboard',
      save: 'Save Scholarship',
      close: 'Close',
      copied: 'Link copied to clipboard!'
    }
  }[language];

  const getStatusBadge = () => {
    switch (scholarship.status) {
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {labels.open}
          </span>
        );
      case 'Upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3.5 h-3.5" />
            {labels.upcoming}
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            {labels.closed}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            {labels.notAnnounced}
          </span>
        );
    }
  };

  const handleShare = () => {
    const text = `${scholarship.name[language]}\nPortal: ${scholarship.officialUrl}`;
    if (navigator.share) {
      navigator.share({
        title: scholarship.name[language],
        text,
        url: scholarship.officialUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const docs = scholarship.requiredDocuments[language] || scholarship.requiredDocuments.en;
  const steps = scholarship.applicationSteps[language] || scholarship.applicationSteps.en;
  const benefitsList = scholarship.benefits[language] || scholarship.benefits.en;
  const rules = scholarship.rules;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog" 
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge()}
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {(scholarship.type || scholarship.category || 'MahaDBT').toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-semibold bg-white/10 text-slate-200">
                  {scholarship.level.toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                {(scholarship.name || scholarship.title)?.[language]}
              </h3>
              {language !== 'en' && (
                <p className="text-xs text-slate-300 font-medium italic">
                  {(scholarship.name || scholarship.title)?.en}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span>{scholarship.issuingOrganization}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              aria-label={labels.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700">
          
          {/* Quick Highlight Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Financial Benefit Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                <IndianRupee className="w-4 h-4 text-amber-600" />
                <span>{labels.financialBenefit}</span>
              </div>
              <div className="text-xs font-extrabold text-amber-950 leading-relaxed space-y-1">
                {benefitsList.slice(0, 2).map((b, i) => (
                  <p key={i}>• {b}</p>
                ))}
              </div>
            </div>

            {/* Academic Eligibility Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>{labels.academicReq}</span>
              </div>
              <p className="text-xs font-bold text-blue-950 leading-snug">
                {rules.minPercentage !== undefined && (
                  <span className="block text-blue-900 font-black mb-1">
                    Min {rules.minPercentage}% marks
                  </span>
                )}
                {rules.allowedCourses ? rules.allowedCourses.slice(0, 3).join(', ') : 'All general courses'}
              </p>
            </div>

            {/* Deadline & Verification Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Application Deadline</span>
              </div>
              <div>
                <p className="text-sm font-black text-emerald-950">
                  {scholarship.applicationDeadline || labels.notAnnounced}
                </p>
                <p className="text-2xs text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  {labels.verifiedOn}: {scholarship.lastVerifiedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <p className="text-sm leading-relaxed text-slate-700">
              {(scholarship.shortDescription || scholarship.description)?.[language] || ''}
            </p>
          </div>

          {/* Eligibility Criteria Breakdown */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {labels.eligibilityRules}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-slate-400 font-medium block mb-1">{labels.category}:</span>
                <span className="font-bold text-slate-800">
                  {rules.allowedCategories ? rules.allowedCategories.join(', ') : 'All Categories'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-slate-400 font-medium block mb-1">{labels.incomeLimit}:</span>
                <span className="font-bold text-slate-800">
                  {rules.maxFamilyIncome !== undefined
                    ? `₹${rules.maxFamilyIncome.toLocaleString('en-IN')} / year`
                    : 'No specific family income cap'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-slate-400 font-medium block mb-1">{labels.domicile}:</span>
                <span className="font-bold text-slate-800">
                  {rules.domicileRequired || 'Any State / Pan-India'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                <span className="text-slate-400 font-medium block mb-1">Target Gender:</span>
                <span className="font-bold text-slate-800 capitalize">
                  {rules.genderRestriction || 'All (Boys & Girls)'}
                </span>
              </div>
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {labels.requiredDocs}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {docs.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
                  <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></div>
                  <span className="font-semibold">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Renewal Rules */}
          {scholarship.renewalRules && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
                {labels.renewalRules}
              </h5>
              <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
                {scholarship.renewalRules[language]}
              </p>
            </div>
          )}

          {/* Application Roadmap */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-indigo-600" />
              {labels.stepByStepApply}
            </h4>
            <div className="space-y-2">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 text-xs">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-slate-800 leading-relaxed mt-0.5">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Legal Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">
              {labels.safeNotice}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Bookmark Button */}
            <button
              onClick={() => onToggleSave(scholarship.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
              <span>{isSaved ? labels.saved : labels.save}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? labels.copied : labels.share}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {labels.close}
            </button>
            <a
              href={scholarship.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>{labels.officialPortal}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
