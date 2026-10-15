import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  ChevronRight, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import type { 
  Language, 
  CitizenProfile, 
  SchemeRecord, 
  UnifiedEligibilityResult, 
  EligibilityOutcomeStatus,
  SocialCategory,
  OccupationType,
  FarmerStatus,
  EducationLevel
} from '../types';
import { rankCitizenSchemes } from '../services/smartEligibilityEngine';
import { getStoredDigiLockerDocs } from '../services/digilockerService';

interface SmartEligibilityModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  schemes: SchemeRecord[];
  currentProfile: CitizenProfile | null;
  onSaveProfile: (profile: CitizenProfile) => void;
  onViewSchemeDetails: (scheme: SchemeRecord) => void;
}

export const SmartEligibilityModal: React.FC<SmartEligibilityModalProps> = ({
  language,
  isOpen,
  onClose,
  schemes,
  currentProfile,
  onSaveProfile,
  onViewSchemeDetails,
}) => {
  // Step indicator: 1 = Demographics & Domicile, 2 = Occupation & Education, 3 = Income & Special Status, 4 = Results
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Questionnaire form states
  const [state, setState] = useState(currentProfile?.state || 'Maharashtra');
  const [district, setDistrict] = useState(currentProfile?.district || 'Pune');
  const [age, setAge] = useState<number | undefined>(currentProfile?.age || 20);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(currentProfile?.gender || 'Female');
  const [socialCategory, setSocialCategory] = useState<SocialCategory>(currentProfile?.socialCategory || 'Open');

  // Education / Student
  const [isStudent, setIsStudent] = useState<boolean>(currentProfile?.isStudent ?? true);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(currentProfile?.educationLevel || 'Engineering');
  const [currentCourse, setCurrentCourse] = useState(currentProfile?.currentCourse || 'B.Tech Computer Engineering');
  const [marksPercentage, setMarksPercentage] = useState<number | undefined>(currentProfile?.previousMarksPercentage || 76);
  const [isHostelite, setIsHostelite] = useState<boolean>(currentProfile?.isHostelite || false);

  // Occupation / Farmer
  const [occupation, setOccupation] = useState<OccupationType>(currentProfile?.occupation || 'Student');
  const [farmerStatus, setFarmerStatus] = useState<FarmerStatus>(currentProfile?.farmerStatus || 'None');

  // Income & Disability
  const [familyIncome, setFamilyIncome] = useState<number>(currentProfile?.familyIncome || 220000);
  const [disabilityStatus, setDisabilityStatus] = useState<boolean>(currentProfile?.disabilityStatus || false);
  const [disabilityPercentage, setDisabilityPercentage] = useState<number | undefined>(currentProfile?.disabilityPercentage || 40);

  // Results state
  const [results, setResults] = useState<{
    potentiallyEligible: UnifiedEligibilityResult[];
    moreInfoRequired: UnifiedEligibilityResult[];
    conditionsNotMet: UnifiedEligibilityResult[];
    needsVerification: UnifiedEligibilityResult[];
  } | null>(null);

  const [activeResultTab, setActiveResultTab] = useState<'potentially' | 'moreInfo' | 'notMet' | 'unverified'>('potentially');

  if (!isOpen) return null;

  const t = {
    mr: {
      title: 'स्मार्ट पात्रता तपासणी यंत्रणा (Smart Eligibility Engine)',
      subtitle: 'तुमच्या माहितीनुसार लागू होणाऱ्या सर्व शासकीय योजना व शिष्यवृत्तींची अचूक पडताळणी',
      step1: '१. अधिवास व वैयक्तिक तपशील',
      step2: '२. शिक्षण व व्यवसाय',
      step3: '३. उत्पन्न व विशेष प्रवर्ग',
      step4: '४. पात्र योजना निकाल',
      potentiallyEligible: 'पात्र असण्याची दाट शक्यता (Potentially Eligible)',
      moreInfoRequired: 'अधिक माहिती आवश्यक (More Info Needed)',
      conditionsNotMet: 'पात्रता अटी पूर्ण नाहीत (Conditions Not Met)',
      needsVerification: 'योजनेची पडताळणी आवश्यक (Needs Verification)',
      next: 'पुढील टप्पा',
      prev: 'मागील',
      evaluate: 'पात्रता तपासा (Evaluate Schemes)',
      disclaimer: 'अस्वीकरण: ही शिफारस केवळ मार्गदर्शनासाठी आहे. अंतिम निवड व लाभ संबंधित शासकीय विभाग अथवा सक्षम प्राधिकरणाद्वारेच निश्चित केला जातो.',
      skipQuestion: 'लागू नसल्यास वगळा (Skip)',
      close: 'बंद करा',
      applyNow: 'अधिकृत पोर्टलवर अर्ज करा',
      viewDetails: 'तपशील पहा'
    },
    hi: {
      title: 'स्मार्ट पात्रता जांच प्रणाली (Smart Eligibility Engine)',
      subtitle: 'आपकी जानकारी के अनुसार लागू होने वाली सभी योजनाओं एवं छात्रवृत्तियों का सत्यापन',
      step1: '1. निवास एवं व्यक्तिगत विवरण',
      step2: '2. शिक्षा एवं व्यवसाय',
      step3: '3. आय एवं विशेष वर्ग',
      step4: '4. पात्रता परिणाम',
      potentiallyEligible: 'पात्र होने की पूरी संभावना (Potentially Eligible)',
      moreInfoRequired: 'अतिरिक्त जानकारी आवश्यक (More Info Needed)',
      conditionsNotMet: 'शर्तें पूरी नहीं (Conditions Not Met)',
      needsVerification: 'सत्यापन आवश्यक (Needs Verification)',
      next: 'अगला चरण',
      prev: 'पिछला',
      evaluate: 'पात्रता जांचें (Evaluate Schemes)',
      disclaimer: 'अस्वीकरण: यह परिणाम केवल मार्गदर्शिका है। अंतिम चयन संबंधित विभाग के अधीन है।',
      skipQuestion: 'लागू न होने पर छोड़ें (Skip)',
      close: 'बंद करें',
      applyNow: 'आधिकारिक पोर्टल पर आवेदन करें',
      viewDetails: 'विवरण देखें'
    },
    en: {
      title: 'Smart Eligibility Engine (Multi-Sector Matching)',
      subtitle: 'Database-driven evaluation for Scholarships, Farmers, Women Welfare, Pensions, and Healthcare',
      step1: '1. Domicile & Demographics',
      step2: '2. Education & Occupation',
      step3: '3. Income & Special Status',
      step4: '4. Matched Schemes Results',
      potentiallyEligible: 'Potentially Eligible',
      moreInfoRequired: 'More Information Required',
      conditionsNotMet: 'Conditions Not Met',
      needsVerification: 'Needs Verification',
      next: 'Next Step',
      prev: 'Back',
      evaluate: 'Evaluate My Eligibility',
      disclaimer: 'Legal Notice: Recommendation does not guarantee official approval. The relevant government authority determines final eligibility based on scrutiny of original documents.',
      skipQuestion: 'Skip question if not applicable',
      close: 'Close',
      applyNow: 'Apply on Official Portal',
      viewDetails: 'View Scheme Details'
    }
  }[language];

  const handleRunEvaluation = () => {
    // Get currently available document codes from DigiLocker / manual checklist
    const docs = getStoredDigiLockerDocs();
    const docCodes = docs.map((d) => d.docCode);

    const updatedProfile: CitizenProfile = {
      id: currentProfile?.id || `cit-${Date.now()}`,
      name: currentProfile?.name || 'Citizen User',
      mobile: currentProfile?.mobile || '9876543210',
      state,
      district,
      age,
      gender,
      socialCategory,
      minorityStatus: currentProfile?.minorityStatus || 'None',
      familyIncome,
      occupation,
      farmerStatus,
      isStudent,
      educationLevel: isStudent ? educationLevel : undefined,
      currentCourse: isStudent ? currentCourse : undefined,
      previousMarksPercentage: isStudent ? marksPercentage : undefined,
      isHostelite: isStudent ? isHostelite : undefined,
      disabilityStatus,
      disabilityPercentage: disabilityStatus ? disabilityPercentage : undefined,
      existingBenefitsReceived: currentProfile?.existingBenefitsReceived || [],
      availableDocCodes: docCodes,
      consentGiven: true,
      consentTimestamp: new Date().toISOString(),
      dataSharingPreferences: currentProfile?.dataSharingPreferences || {
        allowDigiLockerSync: true,
        allowNotificationDispatch: true,
        allowAnonymousAnalytics: false,
      },
      savedSchemeIds: currentProfile?.savedSchemeIds || [],
      appliedSchemeIds: currentProfile?.appliedSchemeIds || [],
      createdAt: currentProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveProfile(updatedProfile);

    // Run rules engine across all active schemes
    const evaluated = rankCitizenSchemes(updatedProfile, schemes);
    setResults(evaluated);
    setCurrentStep(4);
  };

  const handleResetForm = () => {
    setCurrentStep(1);
    setResults(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-5 h-5" />
              </span>
              <h3 className="font-extrabold text-lg sm:text-xl text-white">
                {t.title}
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        {currentStep < 4 && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-2xs font-bold text-slate-500">
            <span className={currentStep === 1 ? 'text-blue-900 font-extrabold' : ''}>{t.step1}</span>
            <span>&rarr;</span>
            <span className={currentStep === 2 ? 'text-blue-900 font-extrabold' : ''}>{t.step2}</span>
            <span>&rarr;</span>
            <span className={currentStep === 3 ? 'text-blue-900 font-extrabold' : ''}>{t.step3}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* STEP 1: Domicile, Age, Gender, Category */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-slate-900">
                  Step 1: Domicile &amp; Demographics
                </h4>
                <p className="text-xs text-slate-500">
                  State and district determine eligibility for Maharashtra state schemes (MahaDBT, Ladki Bahin, Namo Shetkari).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State of Residence*</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    <option value="Maharashtra">Maharashtra (Default)</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Other">Other State / Pan-India</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Pune, Nagpur, Nashik"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Applicant Age (Years)</label>
                  <input
                    type="number"
                    value={age || ''}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 20 (or leave empty if unknown)"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  />
                  <span className="text-2xs text-slate-400 mt-0.5 block">{t.skipQuestion}</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender*</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    <option value="Female">Female (Eligible for Pragati &amp; Ladki Bahin)</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Social Category (For Quota Matching)</label>
                  <select
                    value={socialCategory}
                    onChange={(e) => setSocialCategory(e.target.value as SocialCategory)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    <option value="Open">Open / General (Eligible for EBC 50% tuition waiver)</option>
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste - 100% Post-Matric Waiver)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="VJNT">VJNT / NT</option>
                    <option value="SBC">SBC</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Occupation, Farmer, Student Details */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-slate-900">
                  Step 2: Occupation, Farmer &amp; Academic Status
                </h4>
                <p className="text-xs text-slate-500">
                  Select your primary role. You can enter both student and farmer details if applicable to your family.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Occupation*</label>
                  <select
                    value={occupation}
                    onChange={(e) => {
                      const occ = e.target.value as OccupationType;
                      setOccupation(occ);
                      setIsStudent(occ === 'Student');
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    <option value="Student">Student (Scholarship &amp; Education assistance)</option>
                    <option value="Farmer">Farmer (PM-KISAN, Namo Shetkari, Crop Insurance)</option>
                    <option value="Homemaker">Homemaker / Housewife (Ladki Bahin Yojana)</option>
                    <option value="Retired/Senior">Retired / Senior Citizen (Shravanbal &amp; Old Age Pension)</option>
                    <option value="Self-Employed">Self-Employed / Artisan (PMEGP, MUDRA)</option>
                    <option value="Unemployed">Unemployed / Destitute</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Agricultural / Farmer Status</label>
                  <select
                    value={farmerStatus}
                    onChange={(e) => setFarmerStatus(e.target.value as FarmerStatus)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white font-medium"
                  >
                    <option value="None">Non-Farmer / No agricultural land</option>
                    <option value="Small & Marginal (<2 Hectares)">Small &amp; Marginal Farmer (&lt;2 Hectares land)</option>
                    <option value="Medium/Large Farmer">Medium or Large Landholder</option>
                    <option value="Landless Agricultural Worker">Landless Agricultural Laborer</option>
                  </select>
                </div>

                {/* Student specific fields */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900">Student &amp; Higher Education Details</span>
                    <label className="flex items-center gap-2 cursor-pointer text-2xs font-semibold text-blue-800">
                      <input
                        type="checkbox"
                        checked={isStudent}
                        onChange={(e) => setIsStudent(e.target.checked)}
                        className="rounded text-blue-900"
                      />
                      <span>Enrolled as active student</span>
                    </label>
                  </div>

                  {isStudent && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Education Level</label>
                        <select
                          value={educationLevel}
                          onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="Engineering">Engineering / B.Tech / B.E.</option>
                          <option value="Diploma">Polytechnic Diploma</option>
                          <option value="Undergraduate">Degree (B.Sc / B.Com / B.A)</option>
                          <option value="Medical">Medical / Pharmacy / Nursing</option>
                          <option value="Postgraduate">Postgraduate (M.Tech / M.Sc / MBA)</option>
                          <option value="Pre-Matric">Pre-Matric (Class 9-10)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Previous Exam Marks (%)</label>
                        <input
                          type="number"
                          value={marksPercentage || ''}
                          onChange={(e) => setMarksPercentage(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="e.g. 76"
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Current Course</label>
                        <input
                          type="text"
                          value={currentCourse}
                          onChange={(e) => setCurrentCourse(e.target.value)}
                          placeholder="e.g. B.Tech Computer"
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Residence Type</label>
                        <select
                          value={isHostelite ? 'hostel' : 'day'}
                          onChange={(e) => setIsHostelite(e.target.value === 'hostel')}
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="day">Day Scholar (Home resident)</option>
                          <option value="hostel">Hostel Resident (Eligible for Hostel allowance)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Family Income & Disability */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <h4 className="font-extrabold text-base text-slate-900">
                  Step 3: Income, Disability &amp; Special Categories
                </h4>
                <p className="text-xs text-slate-500">
                  Income limits are verified against Tahsildar certificates or Ration card colors.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Annual Family Income (All sources combined): <span className="text-blue-900 font-extrabold text-sm">₹{familyIncome.toLocaleString('en-IN')} / year</span>
                  </label>
                  <input
                    type="range"
                    min={20000}
                    max={1500000}
                    step={10000}
                    value={familyIncome}
                    onChange={(e) => setFamilyIncome(Number(e.target.value))}
                    className="w-full accent-blue-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-2xs text-slate-400 mt-1">
                    <span>₹20,000 (BPL/Destitute)</span>
                    <span className="font-bold text-amber-700">₹2.5 Lakhs (Ladki Bahin Cap)</span>
                    <span className="font-bold text-blue-900">₹8 Lakhs (EBC &amp; AICTE Cap)</span>
                    <span>₹15 Lakhs+</span>
                  </div>
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900">Divyangjan / Disability Status (Optional)</span>
                    <label className="flex items-center gap-2 cursor-pointer text-2xs font-semibold text-purple-800">
                      <input
                        type="checkbox"
                        checked={disabilityStatus}
                        onChange={(e) => setDisabilityStatus(e.target.checked)}
                        className="rounded text-purple-900"
                      />
                      <span>Person with Disability (Divyangjan)</span>
                    </label>
                  </div>

                  {disabilityStatus && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Certified Disability Percentage (%)</label>
                        <input
                          type="number"
                          value={disabilityPercentage || 40}
                          onChange={(e) => setDisabilityPercentage(Number(e.target.value))}
                          placeholder="e.g. 40"
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <span className="text-2xs text-purple-800 block mt-5">
                          *40% or higher qualifies for Sanjay Gandhi Niradhar and AICTE Saksham schemes.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: 4-Outcome Results View */}
          {currentStep === 4 && results && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Outcome Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setActiveResultTab('potentially')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    activeResultTab === 'potentially'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs ring-2 ring-emerald-400/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg font-black text-emerald-600 block">{results.potentiallyEligible.length}</span>
                  <span className="text-2xs font-bold">{t.potentiallyEligible}</span>
                </button>

                <button
                  onClick={() => setActiveResultTab('moreInfo')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    activeResultTab === 'moreInfo'
                      ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs ring-2 ring-amber-400/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg font-black text-amber-600 block">{results.moreInfoRequired.length}</span>
                  <span className="text-2xs font-bold">{t.moreInfoRequired}</span>
                </button>

                <button
                  onClick={() => setActiveResultTab('notMet')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    activeResultTab === 'notMet'
                      ? 'bg-rose-50 border-rose-500 text-rose-950 shadow-xs ring-2 ring-rose-400/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg font-black text-rose-600 block">{results.conditionsNotMet.length}</span>
                  <span className="text-2xs font-bold">{t.conditionsNotMet}</span>
                </button>

                <button
                  onClick={() => setActiveResultTab('unverified')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    activeResultTab === 'unverified'
                      ? 'bg-slate-100 border-slate-400 text-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-lg font-black text-slate-600 block">{results.needsVerification.length}</span>
                  <span className="text-2xs font-bold">{t.needsVerification}</span>
                </button>
              </div>

              {/* List for Active Outcome Tab */}
              <div className="space-y-4">
                {activeResultTab === 'potentially' && (
                  results.potentiallyEligible.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
                      No schemes matched 100% of criteria. Review "More Info Needed" or adjust your profile filters.
                    </div>
                  ) : (
                    results.potentiallyEligible.map((item) => (
                      <SchemeResultCard
                        key={item.schemeId}
                        result={item}
                        language={language}
                        t={t}
                        schemes={schemes}
                        onViewDetails={onViewSchemeDetails}
                      />
                    ))
                  )
                )}

                {activeResultTab === 'moreInfo' && (
                  results.moreInfoRequired.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl text-xs text-slate-500">
                      All criteria are complete. No missing information detected.
                    </div>
                  ) : (
                    results.moreInfoRequired.map((item) => (
                      <SchemeResultCard
                        key={item.schemeId}
                        result={item}
                        language={language}
                        t={t}
                        schemes={schemes}
                        onViewDetails={onViewSchemeDetails}
                      />
                    ))
                  )
                )}

                {activeResultTab === 'notMet' && (
                  results.conditionsNotMet.map((item) => (
                    <SchemeResultCard
                      key={item.schemeId}
                      result={item}
                      language={language}
                      t={t}
                      schemes={schemes}
                      onViewDetails={onViewSchemeDetails}
                    />
                  ))
                )}

                {activeResultTab === 'unverified' && (
                  results.needsVerification.map((item) => (
                    <SchemeResultCard
                      key={item.schemeId}
                      result={item}
                      language={language}
                      t={t}
                      schemes={schemes}
                      onViewDetails={onViewSchemeDetails}
                    />
                  ))
                )}
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{t.disclaimer}</p>
              </div>

            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {currentStep > 1 && currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
            >
              &larr; {t.prev}
            </button>
          ) : currentStep === 4 ? (
            <button
              onClick={handleResetForm}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Modify Answers</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-5 py-2.5 rounded-xl bg-blue-900 text-white font-bold text-xs hover:bg-blue-800 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : currentStep === 3 ? (
            <button
              onClick={handleRunEvaluation}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.evaluate}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 cursor-pointer"
            >
              {t.close}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

interface SchemeResultCardProps {
  result: UnifiedEligibilityResult;
  language: Language;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  schemes: SchemeRecord[];
  onViewDetails: (scheme: SchemeRecord) => void;
}

const SchemeResultCard: React.FC<SchemeResultCardProps> = ({
  result,
  language,
  t,
  schemes,
  onViewDetails,
}) => {
  const [expanded, setExpanded] = useState(false);
  const fullScheme = schemes.find(s => s.id === result.schemeId);

  const getBadgeStyle = (status: EligibilityOutcomeStatus) => {
    switch (status) {
      case 'Potentially eligible':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'More information required':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'One or more eligibility conditions not met':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-2xs font-extrabold border ${getBadgeStyle(result.status)}`}>
              {result.status}
            </span>
            <span className="text-2xs font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              {result.category}
            </span>
            <span className="text-2xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md">
              Match Score: {result.matchScore}%
            </span>
          </div>

          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
            {result.schemeTitle[language] || result.schemeTitle.en}
          </h4>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-0.5"
          >
            <span>{expanded ? 'Less Info' : 'Why it matched'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Verified Benefit & Deadline Highlight */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div>
          <span className="text-slate-400 text-2xs font-bold uppercase block">Verified Benefit</span>
          <span className="font-extrabold text-slate-900">{result.verifiedBenefit[language] || result.verifiedBenefit.en}</span>
        </div>
        <div className="sm:text-right shrink-0">
          <span className="text-slate-400 text-2xs font-bold uppercase block">Deadline</span>
          <span className="font-bold text-slate-800">{result.verifiedDeadline || 'Announced Soon'}</span>
        </div>
      </div>

      {/* Expandable Explanation Breakdown */}
      {expanded && (
        <div className="pt-3 border-t border-slate-100 space-y-3 text-xs animate-in fade-in">
          
          {/* Why Matched Bullets */}
          {result.whyMatched.length > 0 && (
            <div className="space-y-1">
              <span className="font-bold text-emerald-900 block text-2xs uppercase tracking-wider">Matching Criteria:</span>
              {result.whyMatched.map((w, idx) => (
                <p key={idx} className="text-emerald-800 flex items-start gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{w[language] || w.en}</span>
                </p>
              ))}
            </div>
          )}

          {/* Missing Information if any */}
          {result.missingInformation.length > 0 && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="font-bold text-amber-900 block text-2xs uppercase">Missing Information Required:</span>
              {result.missingInformation.map((m, idx) => (
                <p key={idx} className="text-amber-800 text-2xs flex items-center gap-1.5 font-medium">
                  <span>•</span>
                  <span>{m[language] || m.en}</span>
                </p>
              ))}
            </div>
          )}

          {/* Document Readiness Checklist for this Scheme */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-800 block text-2xs uppercase tracking-wider">Document Readiness Status:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.documentReadiness.map((doc, idx) => (
                <div key={idx} className={`p-2.5 rounded-xl border text-2xs flex items-start justify-between gap-2 ${
                  doc.isAvailable ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div>
                    <span className="font-bold block">{doc.docName[language] || doc.docName.en}</span>
                    <span className="text-3xs text-slate-500 mt-0.5 block">{doc.howToObtain}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-3xs font-extrabold shrink-0 ${
                    doc.isAvailable ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {doc.isAvailable ? 'Ready' : 'Missing'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-2xs text-slate-400">
            <span>Last Verified on: {result.lastVerifiedDate}</span>
            <a
              href={result.officialSourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-900 font-bold hover:underline flex items-center gap-1"
            >
              <span>{t.applyNow}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 flex items-center justify-end gap-2">
        {fullScheme && (
          <button
            onClick={() => onViewDetails(fullScheme)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
          >
            {t.viewDetails}
          </button>
        )}
        <a
          href={result.officialSourceUrl}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5"
        >
          <span>Apply on Official Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
