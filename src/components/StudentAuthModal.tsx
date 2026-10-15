import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  KeyRound, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Trash2, 
  AlertCircle
} from 'lucide-react';
import type { 
  Language, 
  StudentProfile, 
  SocialCategory, 
  MinorityCommunity, 
  EducationLevel 
} from '../types';
import { 
  sendMobileOtp, 
  verifyMobileOtp, 
  saveStoredProfile, 
  deleteStoredProfile, 
  createDefaultProfile 
} from '../services/authService';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentProfile: StudentProfile | null;
  onProfileUpdated: (profile: StudentProfile | null) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  language,
  currentProfile,
  onProfileUpdated,
}) => {
  const [authMode, setAuthMode] = useState<'otp' | 'manual' | 'edit'>('otp');
  const [mobile, setMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form fields for profile editing
  const [profileData, setProfileData] = useState<Partial<StudentProfile>>(() => {
    return currentProfile || createDefaultProfile();
  });

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await sendMobileOtp(mobile);
      setOtpSent(true);
      if (res.demoOtp) {
        setDemoOtp(res.demoOtp);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await verifyMobileOtp(mobile, otpInput);
      if (res.profile) {
        onProfileUpdated(res.profile);
        setProfileData(res.profile);
        setAuthMode('edit');
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.name?.trim()) {
      setErrorMsg('Student name is required.');
      return;
    }

    const updated: StudentProfile = {
      ...(createDefaultProfile(currentProfile?.mobile || mobile)),
      ...profileData,
      id: currentProfile?.id || `student_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    } as StudentProfile;

    saveStoredProfile(updated);
    onProfileUpdated(updated);
    onClose();
  };

  const handleDeleteAccount = () => {
    deleteStoredProfile();
    onProfileUpdated(null);
    setShowDeleteConfirm(false);
    onClose();
  };

  const statesList = [
    'Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Delhi', 'Gujarat', 
    'Rajasthan', 'Madhya Pradesh', 'Bihar', 'Tamil Nadu', 'West Bengal', 'All India'
  ];

  const coursesList = [
    'B.Tech / B.E. (Engineering)', 
    'MBBS / BDS / Medical', 
    'B.Sc / B.Com / B.A. (Degree)', 
    'Polytechnic Diploma', 
    'Pharmacy (B.Pharm / D.Pharm)', 
    'Postgraduate (M.Tech / M.Sc / MBA)', 
    'Class 11 / Class 12 (Junior College)', 
    'Class 9 / Class 10 (Secondary)'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Tricolour Accent */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-amber-500"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-emerald-600"></div>
        </div>

        {/* Modal Header */}
        <div className="p-5 pb-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                {currentProfile 
                  ? (language === 'mr' ? 'विद्यार्थी प्रोफाइल व्यवस्थापन' : language === 'hi' ? 'छात्र प्रोफाइल प्रबंधन' : 'Student Profile & Settings')
                  : (language === 'mr' ? 'विद्यार्थी नोंदणी व लॉगिन' : language === 'hi' ? 'छात्र पंजीकरण एवं लॉगिन' : 'Student Registration & Login')
                }
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'mr' 
                  ? 'अचूक शिष्यवृत्ती शोधण्यासाठी सुरक्षित खाते' 
                  : language === 'hi' 
                  ? 'सटीक छात्रवृत्ति मिलान हेतु सुरक्षित खाता' 
                  : 'Zero-Aadhaar Protected Scholarship Matching Account'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Privacy Notice Pill */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">
                {language === 'mr' ? 'गोपनीयता हमी:' : language === 'hi' ? 'गोपनीयता गारंटी:' : 'Privacy Protection:'}
              </span>{' '}
              <span>
                {language === 'mr'
                  ? 'आम्ही कधीही आधार क्रमांक गोळा करत नाही. आपला डेटा केवळ शिष्यवृत्ती शोधण्यासाठी वापरला जातो.'
                  : language === 'hi'
                  ? 'हम कभी भी आधार नंबर नहीं मांगते हैं। डेटा केवल छात्रवृत्ति पात्रता मिलान हेतु प्रयुक्त होता है।'
                  : 'We never collect or store Aadhaar numbers. Your profile is strictly used to match eligible scholarships.'}
              </span>
            </div>
          </div>

          {/* Tab mode selection for unauthenticated students */}
          {!currentProfile && authMode !== 'edit' && (
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('otp')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  authMode === 'otp' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                📱 Mobile OTP Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('manual')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  authMode === 'manual' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                ✍️ Manual Profile (No Phone)
              </button>
            </div>
          )}

          {/* 1. Mobile OTP Step */}
          {!currentProfile && authMode === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      10-Digit Mobile Number:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9876543210"
                        maxLength={10}
                        required
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-900"
                      />
                    </div>
                  </div>

                  <p className="text-2xs text-slate-500">
                    A 6-digit OTP will be generated. (Instant test demo mode enabled).
                  </p>

                  <button
                    type="submit"
                    disabled={loading || mobile.length !== 10}
                    className="w-full py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{loading ? 'Sending OTP...' : 'Send Verification OTP'}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="font-bold text-emerald-900">OTP Sent to +91 {mobile}</div>
                    {demoOtp && (
                      <div className="mt-1 font-mono font-bold text-emerald-800 bg-white px-2 py-1 rounded border border-emerald-300 inline-block">
                        Demo OTP: {demoOtp}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Enter 6-Digit OTP:
                    </label>
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold font-mono tracking-widest text-slate-900 focus:outline-hidden focus:border-blue-900 text-center"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpInput.length !== 6}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{loading ? 'Verifying...' : 'Verify OTP & Continue'}</span>
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-blue-900 underline font-semibold cursor-pointer"
                    >
                      Change Mobile Number
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 2. Profile Details Form (Manual or Edit Mode) */}
          {(currentProfile || authMode === 'manual' || authMode === 'edit') && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Student Full Name:
                  </label>
                  <input
                    type="text"
                    value={profileData.name || ''}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="e.g. Rahul Ramesh Sharma"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-900"
                  />
                </div>

                {/* State of Residence */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    State of Residence / Domicile:
                  </label>
                  <select
                    value={profileData.state || 'Maharashtra'}
                    onChange={(e) => setProfileData({ ...profileData, state: e.target.value, domicileState: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Education Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Education Level:
                  </label>
                  <select
                    value={profileData.educationLevel || 'Engineering'}
                    onChange={(e) => setProfileData({ ...profileData, educationLevel: e.target.value as EducationLevel })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value="Engineering">Engineering / Technology</option>
                    <option value="Medical">Medical / Healthcare / Pharmacy</option>
                    <option value="Undergraduate">Undergraduate Degree (B.Sc, B.Com, B.A.)</option>
                    <option value="Diploma">Polytechnic Diploma</option>
                    <option value="Postgraduate">Postgraduate (M.Tech, MBA, M.Sc)</option>
                    <option value="Post-Matric">Class 11 / Class 12 (Junior College)</option>
                    <option value="Pre-Matric">Class 9 / Class 10 (School)</option>
                  </select>
                </div>

                {/* Current Course */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Current Course:
                  </label>
                  <select
                    value={profileData.currentCourse || 'B.Tech / B.E. (Engineering)'}
                    onChange={(e) => setProfileData({ ...profileData, currentCourse: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    {coursesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Current Academic Year:
                  </label>
                  <select
                    value={profileData.academicYear || '1st Year'}
                    onChange={(e) => setProfileData({ ...profileData, academicYear: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value="1st Year">1st Year (Fresh Admission)</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Final Year">Final Year</option>
                  </select>
                </div>

                {/* Institution Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    College / Institution Name & City:
                  </label>
                  <input
                    type="text"
                    value={profileData.institutionName || ''}
                    onChange={(e) => setProfileData({ ...profileData, institutionName: e.target.value })}
                    placeholder="e.g. Government College of Engineering, Pune"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-900"
                  />
                </div>

                {/* Social Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Social Category (Caste Group):
                  </label>
                  <select
                    value={profileData.socialCategory || 'Open'}
                    onChange={(e) => setProfileData({ ...profileData, socialCategory: e.target.value as SocialCategory })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
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

                {/* Minority Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Religious Minority Status:
                  </label>
                  <select
                    value={profileData.minorityStatus || 'None'}
                    onChange={(e) => setProfileData({ ...profileData, minorityStatus: e.target.value as MinorityCommunity })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value="None">None (Not applicable)</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Christian">Christian</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Jain">Jain</option>
                    <option value="Parsi">Parsi</option>
                  </select>
                </div>

                {/* Annual Family Income */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Annual Family Income (₹):
                  </label>
                  <select
                    value={profileData.familyIncome || 300000}
                    onChange={(e) => setProfileData({ ...profileData, familyIncome: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value={80000}>Below ₹1,00,000</option>
                    <option value={200000}>₹1,00,000 to ₹2,50,000</option>
                    <option value={400000}>₹2,50,000 to ₹4,50,000</option>
                    <option value={600000}>₹4,50,000 to ₹8,00,000</option>
                    <option value={1000000}>Above ₹8,00,000</option>
                  </select>
                </div>

                {/* Previous Marks Percentage */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Previous Exam Marks (%):
                  </label>
                  <input
                    type="number"
                    min="35"
                    max="100"
                    step="0.1"
                    value={profileData.previousMarksPercentage || 75}
                    onChange={(e) => setProfileData({ ...profileData, previousMarksPercentage: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-900"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Gender:
                  </label>
                  <select
                    value={profileData.gender || 'Male'}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female (Eligible for Pragati, etc.)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Disability Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Specially Abled / Disability (Voluntary):
                  </label>
                  <select
                    value={profileData.disabilityStatus ? 'true' : 'false'}
                    onChange={(e) => setProfileData({ ...profileData, disabilityStatus: e.target.value === 'true' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes (40%+ Certified Disability)</option>
                  </select>
                </div>
              </div>

              {/* Informed Consent Checkbox */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="consentCheck"
                  checked={profileData.consentGiven ?? true}
                  onChange={(e) => setProfileData({ ...profileData, consentGiven: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-900 mt-0.5 cursor-pointer"
                />
                <label htmlFor="consentCheck" className="text-2xs text-slate-600 leading-relaxed cursor-pointer">
                  I voluntarily consent to Sahayak AI processing my educational, social, and financial criteria strictly for the purpose of matching eligible scholarships and notifying me of approaching deadlines. I understand that my Aadhaar number is neither requested nor processed.
                </label>
              </div>

              {/* Submit & Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-200">
                {currentProfile ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete My Profile & Data</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Save Profile & Match Scholarships</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Account Deletion Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 space-y-3">
              <div className="font-bold text-sm text-red-950">
                Confirm Profile Deletion?
              </div>
              <p className="text-xs text-red-800 leading-relaxed">
                This will permanently delete your stored profile, saved bookmarks, and custom deadline notifications from this device and server. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-100/50 rounded-lg"
                >
                  Keep Profile
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
                >
                  Yes, Delete All My Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
