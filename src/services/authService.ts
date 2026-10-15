import type { StudentProfile } from '../types';

const STORAGE_KEY_PROFILE = 'sahayak_student_profile';
const STORAGE_KEY_AUTH_TOKEN = 'sahayak_auth_token';

// In-memory demo OTP storage for testing
let lastGeneratedOtp: { mobile: string; otp: string; expiresAt: number } | null = null;

export function getStoredProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredProfile(profile: StudentProfile): void {
  localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  // Sync with backend if available
  fetch('/api/auth/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  }).catch(() => {
    // Local fallback if offline
  });
}

export function deleteStoredProfile(): void {
  const profile = getStoredProfile();
  if (profile?.id) {
    fetch(`/api/auth/profile/${profile.id}`, { method: 'DELETE' }).catch(() => {});
  }
  localStorage.removeItem(STORAGE_KEY_PROFILE);
  localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
}

/**
 * Send OTP to mobile number:
 * Calls server endpoint or generates a demo 6-digit OTP for testing.
 */
export async function sendMobileOtp(mobile: string): Promise<{ success: boolean; message: string; demoOtp?: string }> {
  const cleanedMobile = mobile.replace(/\D/g, '');
  if (cleanedMobile.length !== 10) {
    throw new Error('Please enter a valid 10-digit Indian mobile number.');
  }

  try {
    const res = await fetch('/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: cleanedMobile }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Backend offline; use local secure demo OTP simulation
  }

  // Local demo fallback: 6-digit code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  lastGeneratedOtp = {
    mobile: cleanedMobile,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes validity
  };

  return {
    success: true,
    message: `OTP sent successfully to +91 ${cleanedMobile}. (Demo Mode: Enter OTP shown below)`,
    demoOtp: otp,
  };
}

/**
 * Verify OTP entered by student
 */
export async function verifyMobileOtp(
  mobile: string,
  enteredOtp: string
): Promise<{ success: boolean; token: string; profile?: StudentProfile }> {
  const cleanedMobile = mobile.replace(/\D/g, '');

  try {
    const res = await fetch('/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: cleanedMobile, otp: enteredOtp.trim() }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, data.token);
      }
      if (data.profile) {
        saveStoredProfile(data.profile);
      }
      return data;
    }
  } catch {
    // Backend offline; verify with local state
  }

  // Local verification
  if (
    lastGeneratedOtp &&
    lastGeneratedOtp.mobile === cleanedMobile &&
    lastGeneratedOtp.otp === enteredOtp.trim() &&
    Date.now() <= lastGeneratedOtp.expiresAt
  ) {
    const token = `demo_token_${Date.now()}`;
    localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, token);

    // Look up or initialize default profile
    let existingProfile = getStoredProfile();
    if (!existingProfile || existingProfile.mobile !== cleanedMobile) {
      existingProfile = createDefaultProfile(cleanedMobile);
      saveStoredProfile(existingProfile);
    }

    return {
      success: true,
      token,
      profile: existingProfile,
    };
  }

  throw new Error('Invalid or expired OTP. Please check the code and try again.');
}

/**
 * Creates a template profile with informed consent
 */
export function createDefaultProfile(mobile = ''): StudentProfile {
  return {
    id: `student_${Date.now()}`,
    name: '',
    mobile,
    email: '',
    state: 'Maharashtra',
    domicileState: 'Maharashtra',
    educationLevel: 'Engineering',
    currentCourse: 'B.Tech / B.E.',
    academicYear: '1st Year',
    institutionName: '',
    institutionCity: '',
    socialCategory: 'Open',
    minorityStatus: 'None',
    familyIncome: 300000,
    previousMarksPercentage: 75,
    disabilityStatus: false,
    gender: 'Male',
    consentGiven: true,
    savedScholarshipIds: [],
    appliedScholarshipIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Calculate profile completion percentage (0% to 100%)
 */
export function calculateProfileCompletion(profile: Partial<StudentProfile> | null): number {
  if (!profile) return 0;
  const fieldsToCheck: (keyof StudentProfile)[] = [
    'name',
    'state',
    'domicileState',
    'educationLevel',
    'currentCourse',
    'institutionName',
    'socialCategory',
    'familyIncome',
    'previousMarksPercentage',
    'gender',
  ];

  let filled = 0;
  fieldsToCheck.forEach((field) => {
    const val = profile[field];
    if (val !== undefined && val !== null && val !== '') {
      filled++;
    }
  });

  return Math.round((filled / fieldsToCheck.length) * 100);
}
