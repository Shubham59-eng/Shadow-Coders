import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  ShieldAlert,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import type { 
  Language, 
  StudentProfile, 
  Scholarship, 
  SocialCategory, 
  EducationLevel 
} from '../types';
import { scholarshipsData } from '../data/scholarshipsData';
import { rankMatchingScholarships } from '../services/eligibilityService';

interface EligibilityCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentProfile: StudentProfile | null;
  onSaveProfile?: (profile: StudentProfile) => void;
  onViewScholarship: (scholarship: Scholarship) => void;
}

export const EligibilityCheckerModal: React.FC<EligibilityCheckerModalProps> = ({
  isOpen,
  onClose,
  language,
  currentProfile,
  onViewScholarship,
}) => {
  const [step, setStep] = useState<'questionnaire' | 'results'>('questionnaire');

  // Questionnaire form state
  const [formData, setFormData] = useState<Partial<StudentProfile>>(() => {
    if (currentProfile) return { ...currentProfile };
    return {
      state: 'Maharashtra',
      domicileState: 'Maharashtra',
      educationLevel: 'Engineering',
      currentCourse: 'B.Tech / B.E.',
      academicYear: '1st Year',
      socialCategory: 'OBC',
      minorityStatus: 'None',
      familyIncome: 200000,
      previousMarksPercentage: 75,
      disabilityStatus: false,
      gender: 'Male',
    };
  });

  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'eligible' | 'possible' | 'unmet'>('all');

  if (!isOpen) return null;

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('results');
  };

  const results = rankMatchingScholarships(formData, scholarshipsData);

  const eligibleCount = results.filter(r => r.status === 'Eligible').length;
  const possibleCount = results.filter(r => r.status === 'Possibly Eligible').length;
  const unmetCount = results.filter(r => r.status === 'Not Eligible').length;

  const filteredResults = results.filter(r => {
    if (activeFilterTab === 'eligible') return r.status === 'Eligible';
    if (activeFilterTab === 'possible') return r.status === 'Possibly Eligible';
    if (activeFilterTab === 'unmet') return r.status === 'Not Eligible';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Tricolour Accent */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-amber-500"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-emerald-600"></div>
        </div>

        {/* Modal Header */}
        <div className="p-5 pb-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                {language === 'mr' ? 'वैयक्तिक शिष्यवृत्ती पात्रता तपासणी' : language === 'hi' ? 'व्यक्तिगत छात्रवृत्ति पात्रता जांच' : 'Personalized Scholarship Eligibility Checker'}
              </h3>
              <p className="text-2xs sm:text-xs text-slate-500 font-medium">
                {step === 'questionnaire' 
                  ? 'Step-by-step questionnaire matching published government & foundation criteria'
                  : 'Verified Eligibility Evaluation Report based on your submitted inputs'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: QUESTIONNAIRE FORM */}
          {step === 'questionnaire' && (
            <form onSubmit={handleEvaluate} className="space-y-5 animate-in fade-in">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 font-medium leading-relaxed">
                ℹ️ <strong>No Aadhaar or login required:</strong> Fill this quick questionnaire to evaluate your matching schemes. All computations occur transparently against verified government criteria.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. State of Residence */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    1. State of Residence / Domicile:
                  </label>
                  <select
                    value={formData.state || 'Maharashtra'}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value, domicileState: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value="Maharashtra">Maharashtra (MahaDBT + Central)</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Other">Other States (Central NSP Schemes)</option>
                  </select>
                </div>

                {/* 2. Education Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    2. Current Education Stream:
                  </label>
                  <select
                    value={formData.educationLevel || 'Engineering'}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value="Engineering">Engineering / Technology (Degree/Diploma)</option>
                    <option value="Medical">Medical / Healthcare / Pharmacy</option>
                    <option value="Undergraduate">General Undergraduate (B.Sc, B.Com, B.A.)</option>
                    <option value="Diploma">Polytechnic Diploma</option>
                    <option value="Postgraduate">Postgraduate (M.Tech, MBA, M.Sc)</option>
                    <option value="Post-Matric">Class 11 / Class 12</option>
                    <option value="Pre-Matric">Class 9 / Class 10</option>
                  </select>
                </div>

                {/* 3. Social Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    3. Social Category (Caste Group):
                  </label>
                  <select
                    value={formData.socialCategory || 'Open'}
                    onChange={(e) => setFormData({ ...formData, socialCategory: e.target.value as SocialCategory })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value="Open">General / Open Category</option>
                    <option value="OBC">Other Backward Class (OBC)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                    <option value="VJNT">Vimukta Jati / Nomadic Tribes (VJNT)</option>
                    <option value="SBC">Special Backward Class (SBC)</option>
                    <option value="EWS">Economically Weaker Section (EWS)</option>
                  </select>
                </div>

                {/* 4. Family Income Range */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    4. Annual Family Income Range:
                  </label>
                  <select
                    value={formData.familyIncome || 200000}
                    onChange={(e) => setFormData({ ...formData, familyIncome: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value={90000}>Below ₹1,00,000 / year</option>
                    <option value={200000}>₹1,00,000 to ₹2,50,000 / year</option>
                    <option value={400000}>₹2,50,000 to ₹4,50,000 / year</option>
                    <option value={700000}>₹4,50,000 to ₹8,00,000 / year</option>
                    <option value={1000000}>Above ₹8,00,000 / year</option>
                  </select>
                </div>

                {/* 5. Previous Exam Percentage */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    5. Previous Exam Marks / Percentage:
                  </label>
                  <input
                    type="number"
                    min="35"
                    max="100"
                    step="0.1"
                    value={formData.previousMarksPercentage || 75}
                    onChange={(e) => setFormData({ ...formData, previousMarksPercentage: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-900"
                  />
                </div>

                {/* 6. Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    6. Gender:
                  </label>
                  <select
                    value={formData.gender || 'Male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female (Unlocks Pragati, Begum Hazrat, etc.)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* 7. Disability Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    7. Specially Abled / Disability (Voluntary):
                  </label>
                  <select
                    value={formData.disabilityStatus ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, disabilityStatus: e.target.value === 'true' })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value="false">No (General candidate)</option>
                    <option value="true">Yes (40%+ Certified Disability)</option>
                  </select>
                </div>

                {/* 8. Religious Minority */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    8. Religious Minority Community:
                  </label>
                  <select
                    value={formData.minorityStatus || 'None'}
                    onChange={(e) => setFormData({ ...formData, minorityStatus: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value="None">None / General</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Christian">Christian</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Jain">Jain</option>
                    <option value="Parsi">Parsi</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Evaluate My Eligibility</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: ELIGIBILITY REPORT RESULTS */}
          {step === 'results' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Summary Score Bar */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-base">Your Eligibility Matching Summary</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Evaluated against {scholarshipsData.length} verified government and foundation scholarships.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-center px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
                    <span className="text-lg font-black text-emerald-400 block">{eligibleCount}</span>
                    <span className="text-2xs text-emerald-200 font-bold uppercase">Appears Eligible</span>
                  </div>
                  <div className="text-center px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40">
                    <span className="text-lg font-black text-amber-400 block">{possibleCount}</span>
                    <span className="text-2xs text-amber-200 font-bold uppercase">Possibly Eligible</span>
                  </div>
                  <div className="text-center px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-400/40">
                    <span className="text-lg font-black text-red-400 block">{unmetCount}</span>
                    <span className="text-2xs text-red-200 font-bold uppercase">Not Matching</span>
                  </div>
                </div>
              </div>

              {/* Filter Tabs & Back Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <button
                    onClick={() => setActiveFilterTab('all')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeFilterTab === 'all' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    All ({results.length})
                  </button>
                  <button
                    onClick={() => setActiveFilterTab('eligible')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeFilterTab === 'eligible' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    Appears Eligible ({eligibleCount})
                  </button>
                  <button
                    onClick={() => setActiveFilterTab('possible')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeFilterTab === 'possible' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    Possibly Eligible ({possibleCount})
                  </button>
                  <button
                    onClick={() => setActiveFilterTab('unmet')}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      activeFilterTab === 'unmet' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Unmet ({unmetCount})
                  </button>
                </div>

                <button
                  onClick={() => setStep('questionnaire')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Modify Answers</span>
                </button>
              </div>

              {/* Results Cards List */}
              <div className="space-y-4">
                {filteredResults.map((result) => {
                  const s = result.scholarship;
                  const isEligible = result.status === 'Eligible';
                  const isPossible = result.status === 'Possibly Eligible';

                  return (
                    <div
                      key={s.id}
                      className={`p-5 rounded-2xl border-2 transition-all bg-white shadow-2xs ${
                        isEligible 
                          ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                          : isPossible 
                          ? 'border-amber-300 ring-2 ring-amber-500/10'
                          : 'border-slate-200 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-2xs font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              isEligible 
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : isPossible 
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {isEligible && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                              {isPossible && <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />}
                              {!isEligible && !isPossible && <XCircle className="w-3.5 h-3.5 text-slate-500" />}
                              <span>{result.status} ({result.matchScore}% Match)</span>
                            </span>

                            <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {s.type}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                            {s.name[language]}
                          </h4>
                          <p className="text-2xs text-slate-500 font-medium">
                            {s.issuingOrganization}
                          </p>
                        </div>

                        <div className="text-right sm:shrink-0">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 block sm:inline-block">
                            {s.benefits[language][0]}
                          </span>
                          <span className="text-2xs text-slate-400 block mt-1">
                            Deadline: {s.applicationDeadline || 'Date Not Announced'}
                          </span>
                        </div>
                      </div>

                      {/* Matched Criteria Bullets */}
                      {result.matchedCriteria[language].length > 0 && (
                        <div className="mb-3">
                          <span className="text-2xs font-bold text-emerald-900 uppercase tracking-wide block mb-1">
                            ✓ Matching Criteria:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {result.matchedCriteria[language].map((m, idx) => (
                              <div key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>{m}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Unmet Criteria Bullets */}
                      {result.unmetCriteria[language].length > 0 && (
                        <div className="mb-3 p-3 rounded-xl bg-red-50/70 border border-red-200">
                          <span className="text-2xs font-bold text-red-900 uppercase tracking-wide block mb-1">
                            ✗ Unmet Criteria:
                          </span>
                          <div className="space-y-1">
                            {result.unmetCriteria[language].map((u, idx) => (
                              <div key={idx} className="text-xs text-red-800 font-medium flex items-start gap-1.5">
                                <span className="text-red-600 font-bold">✗</span>
                                <span>{u}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Links */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                        <button
                          onClick={() => {
                            onClose();
                            onViewScholarship(s);
                          }}
                          className="font-bold text-blue-900 hover:text-amber-600 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Full Scheme Details & Checklist</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={s.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Apply on Official Portal</span>
                          <ExternalLink className="w-3 h-3 text-amber-400" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legal Disclaimer */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-2xs sm:text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Important Disclaimer:</strong> This eligibility calculation is an informational evaluation based solely on the published eligibility rules. Final eligibility, merit ranking, document verification, and scholarship approval are strictly determined by the relevant government ministry or foundation.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
