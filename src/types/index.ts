export type Language = 'mr' | 'hi' | 'en';

export type SchemeCategory = 
  | 'scholarships'
  | 'students' 
  | 'farmers' 
  | 'women' 
  | 'seniors' 
  | 'disability'
  | 'employment' 
  | 'healthcare' 
  | 'financial';

export type SchemeLevel = 'Central' | 'Maharashtra' | 'State' | 'Private/Foundation';

export type ScholarshipType = 
  | 'Central' 
  | 'MahaDBT' 
  | 'State' 
  | 'Institutional' 
  | 'Private/Foundation';

export type ScholarshipStatus = 'Open' | 'Upcoming' | 'Closed' | 'Date Not Announced';

export type SchemeStatus = 'Open' | 'Upcoming' | 'Closed' | 'Date Not Announced';

export interface MultilingualText {
  en: string;
  mr: string;
  hi: string;
}

export interface MultilingualList {
  en: string[];
  mr: string[];
  hi: string[];
}

export type SocialCategory = 'Open' | 'OBC' | 'SC' | 'ST' | 'VJNT' | 'SBC' | 'EWS';
export type MinorityCommunity = 'None' | 'Muslim' | 'Buddhist' | 'Christian' | 'Sikh' | 'Jain' | 'Parsi';
export type EducationLevel = 'Pre-Matric' | 'Post-Matric' | 'Diploma' | 'Undergraduate' | 'Postgraduate' | 'Engineering' | 'Medical' | 'PhD' | 'None';
export type OccupationType = 'Student' | 'Farmer' | 'Agricultural Laborer' | 'Self-Employed' | 'Salaried' | 'Homemaker' | 'Retired/Senior' | 'Unemployed' | 'Other';
export type FarmerStatus = 'None' | 'Small & Marginal (<2 Hectares)' | 'Medium/Large Farmer' | 'Tenant Farmer' | 'Landless Agricultural Worker';

// ==========================================
// 1. DIGITAL DOCUMENT LOCKER (DigiLocker)
// ==========================================

export type DocumentCategory = 
  | 'academic' 
  | 'income' 
  | 'identity_residence' 
  | 'caste_category' 
  | 'agriculture' 
  | 'disability' 
  | 'pension_senior';

export type DocumentVerificationStatus = 
  | 'verified_digilocker' 
  | 'uploaded_manual' 
  | 'pending_verification' 
  | 'not_verified' 
  | 'missing';

export interface DigiLockerDocument {
  docId: string;
  docCode: string; // e.g. 'income_cert', 'caste_cert', 'domicile_cert', 'marksheet_10', 'marksheet_12', 'ration_card', 'disability_cert', 'kisan_credit_card'
  name: MultilingualText;
  category: DocumentCategory;
  issuer: string; // e.g. "Govt of Maharashtra - Revenue Dept (Aaple Sarkar)"
  issueDate: string;
  validUntil?: string;
  verificationStatus: DocumentVerificationStatus;
  source: 'digilocker' | 'manual';
  isDemoRecord: boolean;
  metadataSummary: string; // Non-sensitive masked summary, e.g. "Cert No: RE/2026/XXXX-4819 | Pune District"
  officialProcurementPortal?: string; // e.g. "https://aaplesarkar.mahaonline.gov.in"
  instructionsForProcurement?: MultilingualText;
}

export interface DigiLockerSession {
  isConnected: boolean;
  isDemoMode: boolean;
  connectedAt?: string;
  lastSyncAt?: string;
  scope?: string[];
  partnerName?: string;
  totalDocumentsCount: number;
}

// ==========================================
// 2. CITIZEN PROFILE & AUTH
// ==========================================

export interface CitizenProfile {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  state: string; // Defaults to 'Maharashtra'
  district?: string;
  domicileState?: string;
  age?: number;
  gender: 'Male' | 'Female' | 'Other';
  socialCategory: SocialCategory;
  minorityStatus: MinorityCommunity;
  familyIncome: number; // In INR per annum
  annualFamilyIncome?: number;
  
  // Occupation / Farmer details
  occupation?: OccupationType;
  farmerStatus?: FarmerStatus;
  hasKisanCreditCard?: boolean;

  // Student / Academic details
  isStudent?: boolean;
  educationLevel?: EducationLevel;
  currentCourse?: string;
  course?: string;
  academicYear?: string | number;
  institutionName?: string;
  institutionCity?: string;
  previousMarksPercentage?: number;
  marksPercentage?: number;
  isHostelite?: boolean; // Hostel or Day Scholar
  isHosteller?: boolean;

  // Disability / Divyangjan details
  disabilityStatus: boolean;
  disabilityPercentage?: number;
  disabilityType?: string;
  hasUDIDCard?: boolean;
  disability?: string;

  // Existing schemes received (to verify non-duplication rules)
  existingBenefitsReceived?: string[];

  // Document metadata IDs attached
  availableDocCodes?: string[];

  // Consent & Privacy management
  consentGiven: boolean;
  consentTimestamp?: string;
  dataSharingPreferences?: {
    allowDigiLockerSync: boolean;
    allowNotificationDispatch: boolean;
    allowAnonymousAnalytics: boolean;
  };

  savedSchemeIds?: string[];
  savedScholarshipIds?: string[];
  appliedSchemeIds?: string[];
  appliedScholarshipIds?: string[];
  createdAt: string;
  updatedAt: string;
}

// Backwards-compatibility alias
export type StudentProfile = CitizenProfile;

// ==========================================
// 3. SMART ELIGIBILITY ENGINE
// ==========================================

export type EligibilityOutcomeStatus = 
  | 'Potentially eligible'
  | 'More information required'
  | 'One or more eligibility conditions not met'
  | 'Scheme information needs verification';

export interface EligibilityConditionCheck {
  conditionName: string;
  ruleCategory: 'domicile' | 'income' | 'category' | 'academic' | 'age' | 'gender' | 'occupation' | 'disability' | 'hostel';
  passed: boolean;
  details: string;
  missingData?: boolean;
}

export interface DocumentReadinessCheck {
  docCode: string;
  docName: MultilingualText;
  isAvailable: boolean;
  status: DocumentVerificationStatus;
  howToObtain: string;
  portalUrl?: string;
}

export interface UnifiedEligibilityResult {
  schemeId: string;
  schemeTitle: MultilingualText;
  category: SchemeCategory;
  status: EligibilityOutcomeStatus;
  matchScore: number; // 0 - 100%
  whyMatched: MultilingualText[];
  conditionsChecked: EligibilityConditionCheck[];
  missingInformation: MultilingualText[];
  requiredDocuments: string[];
  documentReadiness: DocumentReadinessCheck[];
  verifiedBenefit: MultilingualText;
  verifiedDeadline?: string;
  officialSourceUrl: string;
  lastVerifiedDate: string;
}

// Backwards compatibility for Scholarship evaluation
export interface EligibilityMatchResult {
  scholarship: Scholarship;
  status: 'Eligible' | 'Possibly Eligible' | 'Not Eligible';
  matchScore: number;
  matchedCriteria: MultilingualList;
  unmetCriteria: MultilingualList;
  missingInformation: MultilingualList;
}

// ==========================================
// 4. NORMALIZED SCHEME DATABASE & RULES
// ==========================================

export interface SchemeRule {
  minAge?: number;
  maxAge?: number;
  allowedGenders?: ('Male' | 'Female' | 'Other')[];
  allowedStates?: string[]; // e.g. ['Maharashtra'] or ['All']
  allowedDistricts?: string[];
  allowedCategories?: string[];
  allowedMinorities?: string[];
  minMarksPercentage?: number;
  minPercentage?: number;
  maxFamilyIncome?: number;
  farmerOnly?: boolean;
  allowedFarmerStatuses?: FarmerStatus[];
  disabilityOnly?: boolean;
  disabilityRequired?: boolean;
  minDisabilityPercentage?: number;
  allowedEducationLevels?: EducationLevel[];
  allowedCourses?: string[];
  hostelRequired?: boolean;
  existingBenefitRestrictions?: string[]; // Schemes that prevent taking this one
  requiredDocCodes?: string[];
  domicileRequired?: boolean | string;
  domicileState?: string;
  genderRestriction?: string;
}

// Backwards compatibility alias
export type ScholarshipRule = SchemeRule;

export interface SchemeRecord {
  id: string;
  slug?: string;
  title?: MultilingualText;
  name?: MultilingualText;
  shortDescription: MultilingualText;
  description?: MultilingualText;
  category?: SchemeCategory;
  type?: string;
  department?: string;
  authority?: string;
  stateName?: string;
  targetGroup?: MultilingualText;
  keyHighlight?: MultilingualText;
  issuingOrganization?: string;
  level: SchemeLevel;
  status?: SchemeStatus;
  applicationOpeningDate?: string;
  applicationDeadline?: string; // YYYY-MM-DD
  amountVerified?: boolean;
  benefits: MultilingualList;
  eligibility?: MultilingualList;
  eligibilityCriteria?: MultilingualList;
  requiredDocuments: MultilingualList;
  requiredDocCodes?: string[];
  renewalRules?: MultilingualText;
  applicationSteps: MultilingualList;
  officialUrl: string;
  officialSource?: string;
  lastVerifiedDate: string;
  lastUpdatedInSahayakon?: string;
  sourceAnnouncementDate?: string;
  createdAt?: string;
  updatedAt?: string;
  officialSourceUrl?: string;
  tags?: string[];
  rules?: SchemeRule;
  isPopular?: boolean;
  isRecentlyUpdated?: boolean;
}

// Backwards compatibility for existing components
export interface Scholarship extends SchemeRecord {
  name: MultilingualText;
  eligibilityCriteria: MultilingualList;
  tags: string[];
  rules: SchemeRule;
}

export interface Scheme extends SchemeRecord {
  title: MultilingualText;
  category: SchemeCategory;
  keyHighlight?: MultilingualText;
  eligibility?: MultilingualList;
  tags: string[];
}

// ==========================================
// 5. NOTIFICATION ENGINE & AUDIT LOGS
// ==========================================

export type NotificationChannel = 'in-app' | 'sms' | 'email' | 'whatsapp';

export interface NotificationPreference {
  inApp?: boolean;
  inAppEnabled?: boolean;
  email?: boolean;
  emailEnabled?: boolean;
  sms?: boolean;
  smsEnabled?: boolean;
  whatsapp?: boolean;
  whatsappEnabled?: boolean;
  remind30Days?: boolean;
  remind7Days?: boolean;
  remind1Day?: boolean;
  consentGiven?: boolean;
  consentTimestamp?: string;
}

export type DeadlineReminderConfig = NotificationPreference;

export interface NotificationDeliveryLog {
  id: string;
  schemeId?: string;
  scholarshipId?: string;
  notificationId?: string;
  channel: NotificationChannel;
  status: 'delivered' | 'sent' | 'queued' | 'opted-out' | 'failed';
  deliveryStatus?: string;
  type?: string;
  title: MultilingualText;
  message: MultilingualText;
  timestamp: string;
  dedupKey?: string;
  read: boolean;
  recipient?: string;
  daysRemaining?: number;
}

// Backwards compatibility alias
export type StudentNotification = NotificationDeliveryLog;

// ==========================================
// 6. CHAT ASSISTANT & FEEDBACK
// ==========================================

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  language: Language;
  relatedSchemeIds?: string[];
  relatedScholarshipIds?: string[];
  followUps?: string[];
  isDemoResponse?: boolean;
  sourceUrl?: string;
}

export interface FeedbackSubmission {
  id: string;
  rating: number;
  category: string;
  comment: string;
  timestamp: string;
  userName?: string;
}
