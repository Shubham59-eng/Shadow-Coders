import './setup';
import { describe, it, expect } from 'vitest';
import { 
  evaluateSchemeEligibility, 
  batchEvaluateSchemes, 
  calculateProfileReadinessScore,
  DOCUMENT_GUIDES 
} from '../services/smartEligibilityEngine';
import { UNIFIED_SCHEMES_SEED } from '../data/unifiedSchemesData';
import type { CitizenProfile } from '../types';

describe('Smart Eligibility Engine Tests', () => {
  const ebcScheme = UNIFIED_SCHEMES_SEED.find((s) => s.id === 'sch-mah-ebc')!;
  const pragatiScheme = UNIFIED_SCHEMES_SEED.find((s) => s.id === 'sch-aicte-pragati')!;
  const pmKisanScheme = UNIFIED_SCHEMES_SEED.find((s) => s.id === 'sch-pm-kisan')!;
  const shravanbalScheme = UNIFIED_SCHEMES_SEED.find((s) => s.id === 'sch-shravanbal-pension')!;

  const baseProfile: CitizenProfile = {
    id: 'cit-test-01',
    name: 'Rohan Deshmukh',
    mobile: '9876543210',
    state: 'Maharashtra',
    district: 'Pune',
    gender: 'Male',
    socialCategory: 'Open',
    minorityStatus: 'None',
    familyIncome: 350000,
    occupation: 'Student',
    farmerStatus: 'None',
    isStudent: true,
    educationLevel: 'Undergraduate',
    currentCourse: 'Engineering',
    previousMarksPercentage: 78,
    disabilityStatus: false,
    existingBenefitsReceived: [],
    availableDocCodes: ['income_cert', 'domicile_cert', 'marksheet_12'],
    consentGiven: true,
    dataSharingPreferences: {
      allowDigiLockerSync: true,
      allowNotificationDispatch: true,
      allowAnonymousAnalytics: false,
    },
    savedSchemeIds: [],
    appliedSchemeIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('correctly marks a low-income Maharashtra student as "Potentially eligible" for EBC Scholarship', () => {
    const result = evaluateSchemeEligibility(baseProfile, ebcScheme);
    expect(result.status).toBe('Potentially eligible');
    expect(result.matchScore).toBeGreaterThanOrEqual(70);
    expect(result.whyMatched.length).toBeGreaterThan(0);
  });

  it('correctly marks a student with income > 8 Lakhs as "One or more eligibility conditions not met"', () => {
    const highIncomeProfile: CitizenProfile = {
      ...baseProfile,
      familyIncome: 950000, // EBC limit is 8,00,000
    };

    const result = evaluateSchemeEligibility(highIncomeProfile, ebcScheme);
    expect(result.status).toBe('One or more eligibility conditions not met');
    const unmet = result.conditionsChecked.filter((c) => !c.passed && !c.missingData);
    expect(unmet.length).toBeGreaterThan(0);
    expect(unmet.some((c) => c.ruleCategory === 'income')).toBe(true);
  });

  it('correctly detects missing mandatory profile info and returns "More information required"', () => {
    // Incomplete profile: familyIncome is undefined
    const incompleteProfile: CitizenProfile = {
      ...baseProfile,
      familyIncome: undefined as any,
    };

    const result = evaluateSchemeEligibility(incompleteProfile, ebcScheme);
    expect(result.status).toBe('More information required');
    expect(result.missingInformation.length).toBeGreaterThan(0);
  });

  it('rejects male applicants for AICTE Pragati Girls Scholarship', () => {
    const maleStudent: CitizenProfile = {
      ...baseProfile,
      gender: 'Male',
      familyIncome: 400000,
    };

    const result = evaluateSchemeEligibility(maleStudent, pragatiScheme);
    expect(result.status).toBe('One or more eligibility conditions not met');
    const unmet = result.conditionsChecked.filter((c) => !c.passed);
    expect(unmet.some((c) => c.ruleCategory === 'gender')).toBe(true);
  });

  it('correctly qualifies small landholder farmers for PM-KISAN', () => {
    const farmerProfile: CitizenProfile = {
      ...baseProfile,
      occupation: 'Farmer',
      farmerStatus: 'Small & Marginal (<2 Hectares)',
      familyIncome: 180000,
      availableDocCodes: ['ration_card', 'domicile_cert'],
    };

    const result = evaluateSchemeEligibility(farmerProfile, pmKisanScheme);
    expect(result.status).toBe('Potentially eligible');
  });

  it('flags senior citizen schemes as not eligible if age is under 65', () => {
    const youngCitizen: CitizenProfile = {
      ...baseProfile,
      age: 42, // Shravanbal requires age >= 65
      familyIncome: 15000,
    };

    const result = evaluateSchemeEligibility(youngCitizen, shravanbalScheme);
    expect(result.status).toBe('One or more eligibility conditions not met');
    const unmet = result.conditionsChecked.filter((c) => !c.passed);
    expect(unmet.some((c) => c.ruleCategory === 'age')).toBe(true);
  });

  it('correctly computes citizen profile readiness score (0-100%)', () => {
    const emptyProfile: CitizenProfile = {
      ...baseProfile,
      district: '',
      familyIncome: 0,
      educationLevel: undefined,
      availableDocCodes: [],
      consentGiven: false,
    };
    const lowScore = calculateProfileReadinessScore(emptyProfile, []);
    expect(lowScore).toBeLessThan(50);

    const fullProfile: CitizenProfile = {
      ...baseProfile,
      district: 'Nashik',
      familyIncome: 250000,
      age: 21,
      gender: 'Female',
      educationLevel: 'Undergraduate',
      currentCourse: 'Computer Engineering',
      occupation: 'Student',
      disabilityStatus: false,
      consentGiven: true,
      availableDocCodes: ['income_cert', 'domicile_cert', 'marksheet_12'],
    };
    const highScore = calculateProfileReadinessScore(fullProfile, ['income_cert', 'domicile_cert']);
    expect(highScore).toBeGreaterThanOrEqual(70);
  });

  it('categorizes all seed schemes into 4 distinct outcome buckets', () => {
    const citizen: CitizenProfile = {
      ...baseProfile,
      district: 'Nagpur',
      familyIncome: 200000,
      gender: 'Female',
      educationLevel: 'Undergraduate',
      currentCourse: 'Diploma Engineering',
    };

    const results = batchEvaluateSchemes(citizen, UNIFIED_SCHEMES_SEED);
    expect(results).toHaveProperty('potentiallyEligible');
    expect(results).toHaveProperty('moreInfoRequired');
    expect(results).toHaveProperty('conditionsNotMet');
    expect(results).toHaveProperty('needsVerification');
    
    // Total evaluated must equal total schemes count
    const totalGrouped = 
      results.potentiallyEligible.length + 
      results.moreInfoRequired.length + 
      results.conditionsNotMet.length + 
      results.needsVerification.length;
    expect(totalGrouped).toBe(UNIFIED_SCHEMES_SEED.length);
  });

  it('provides verified procurement guides in DOCUMENT_GUIDES for required certificates', () => {
    expect(DOCUMENT_GUIDES['income_cert']).toBeDefined();
    expect(DOCUMENT_GUIDES['income_cert'].portalUrl).toContain('aaplesarkar');
    expect(DOCUMENT_GUIDES['caste_cert']).toBeDefined();
    expect(DOCUMENT_GUIDES['caste_cert'].name.en).toContain('Caste');
  });
});
