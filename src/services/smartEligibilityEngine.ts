import type { 
  CitizenProfile, 
  SchemeRecord, 
  SchemeRule,
  UnifiedEligibilityResult, 
  EligibilityOutcomeStatus,
  EligibilityConditionCheck,
  DocumentReadinessCheck,
  MultilingualText
} from '../types';

/**
 * Standard Document Catalog with procurement instructions
 */
export const DOCUMENT_CATALOG: Record<string, { name: MultilingualText; howToObtain: string; portalUrl?: string }> = {
  income_cert: {
    name: {
      en: 'Tahsildar Income Certificate',
      mr: 'तहसीलदार उत्पन्नाचा दाखला',
      hi: 'तहसीलदार आय प्रमाण पत्र'
    },
    howToObtain: 'Issued by Tahsildar / Sub-Divisional Officer. Apply online at Aaple Sarkar portal or visit nearest Setu Suvidha Kendra.',
    portalUrl: 'https://aaplesarkar.mahaonline.gov.in'
  },
  domicile_cert: {
    name: {
      en: 'Maharashtra State Domicile Certificate',
      mr: 'महाराष्ट्र राज्य अधिवास प्रमाणपत्र (डोमिसाइल)',
      hi: 'महाराष्ट्र राज्य मूल निवास प्रमाण पत्र'
    },
    howToObtain: 'Requires 15-year residence proof, ration card, and school leaving certificate from Executive Magistrate.',
    portalUrl: 'https://aaplesarkar.mahaonline.gov.in'
  },
  caste_cert: {
    name: {
      en: 'Caste Certificate & Validity / Non-Creamy Layer',
      mr: 'जात प्रमाणपत्र व जात पडताळणी / नॉन-क्रिमिलेअर',
      hi: 'जाति प्रमाण पत्र एवं वैधता / नॉन-क्रीमी लेयर'
    },
    howToObtain: 'Issued by Sub-Divisional Officer and verified by District Caste Scrutiny Committee (CCVIS).',
    portalUrl: 'https://barti.maharashtra.gov.in'
  },
  marksheet_12: {
    name: {
      en: 'Class 12th (HSC) Marksheet',
      mr: 'इयत्ता १२ वी गुणपत्रिका',
      hi: 'कक्षा 12वीं अंकतालिका'
    },
    howToObtain: 'Download verified digital copy instantly into DigiLocker from Maharashtra State Board (MSBSHSE Pune).',
    portalUrl: 'https://mahahsscboard.in'
  },
  marksheet_10: {
    name: {
      en: 'Class 10th (SSC) Passing Certificate',
      mr: 'इयत्ता १० वी उत्तीर्ण प्रमाणपत्र',
      hi: 'कक्षा 10वीं उत्तीर्ण प्रमाण पत्र'
    },
    howToObtain: 'Available digitally on DigiLocker using Roll Number and Exam Year.',
    portalUrl: 'https://mahahsscboard.in'
  },
  ration_card: {
    name: {
      en: 'Ration Card (Yellow / Saffron Kesari)',
      mr: 'शिधापत्रिका (पिवळे किंवा केशरी रेशन कार्ड)',
      hi: 'राशन कार्ड (पीला या केसरी)'
    },
    howToObtain: 'Issued by Food & Civil Supplies Dept. Check RCMS MahaFood portal for family member seeding.',
    portalUrl: 'https://rcms.mahafood.gov.in'
  },
  disability_cert: {
    name: {
      en: 'Unique Disability ID (UDID) Card / Civil Surgeon Cert',
      mr: 'युडीआयडी (UDID) कार्ड / जिल्हा शल्यचिकित्सक दिव्यांग दाखला',
      hi: 'यूडीआईडी (UDID) कार्ड / दिव्यांगता प्रमाण पत्र'
    },
    howToObtain: 'Apply on Swavlamban Card portal (swavlambancard.gov.in) and attend assessment at District Civil Hospital.',
    portalUrl: 'https://www.swavlambancard.gov.in'
  }
};

/**
 * Smart Eligibility Matching Engine
 * Evaluates profile against verified rules without inventing criteria.
 */
export function evaluateSchemeEligibility(
  profile: CitizenProfile,
  scheme: SchemeRecord
): UnifiedEligibilityResult {
  const conditionsChecked: EligibilityConditionCheck[] = [];
  const missingInfoList: MultilingualText[] = [];
  const whyMatchedList: MultilingualText[] = [];
  const rules: SchemeRule = scheme.rules || {};

  let hasFailedCondition = false;
  let hasMissingInformation = false;

  // 1. Domicile / State Check
  if (rules.allowedStates && rules.allowedStates.length > 0 && !rules.allowedStates.includes('All')) {
    const isStateMatch = rules.allowedStates.includes(profile.state);
    conditionsChecked.push({
      conditionName: 'State Domicile Requirement',
      ruleCategory: 'domicile',
      passed: isStateMatch,
      details: isStateMatch
        ? `Resident of ${profile.state} (Eligible for ${rules.allowedStates.join(', ')})`
        : `Applicant resides in ${profile.state}, but scheme is restricted to ${rules.allowedStates.join(', ')}`,
    });
    if (!isStateMatch) hasFailedCondition = true;
    else {
      whyMatchedList.push({
        en: `Satisfies state domicile for ${rules.allowedStates.join(', ')}`,
        mr: `${rules.allowedStates.join(', ')} राज्याचा अधिवास पुरावा लागू होतो`,
        hi: `${rules.allowedStates.join(', ')} राज्य का मूल निवास मान्य है`,
      });
    }
  }

  // 2. Gender Restriction Check
  if (rules.allowedGenders && rules.allowedGenders.length > 0) {
    const isGenderMatch = rules.allowedGenders.includes(profile.gender);
    conditionsChecked.push({
      conditionName: 'Gender Criteria',
      ruleCategory: 'gender',
      passed: isGenderMatch,
      details: isGenderMatch
        ? `Gender matches requirement (${rules.allowedGenders.join(', ')})`
        : `Scheme is exclusively for ${rules.allowedGenders.join(', ')}, but applicant is ${profile.gender}`,
    });
    if (!isGenderMatch) hasFailedCondition = true;
    else if (rules.allowedGenders.length === 1 && rules.allowedGenders[0] === 'Female') {
      whyMatchedList.push({
        en: 'Qualifies under female-beneficiary quota',
        mr: 'महिला लाभार्थी प्रवर्गांतर्गत पात्र ठरते',
        hi: 'महिला लाभार्थी कोटे के अंतर्गत पात्र',
      });
    }
  }

  // 3. Age Range Check
  if (rules.minAge !== undefined || rules.maxAge !== undefined) {
    if (profile.age === undefined || profile.age === null) {
      hasMissingInformation = true;
      conditionsChecked.push({
        conditionName: 'Age Limit Check',
        ruleCategory: 'age',
        passed: false,
        missingData: true,
        details: `Age limit is ${rules.minAge || 0} to ${rules.maxAge || 100} years, but age was not provided in profile.`,
      });
      missingInfoList.push({
        en: `Age details required (${rules.minAge || 0} - ${rules.maxAge || 100} years)`,
        mr: `वयाचा तपशील आवश्यक (${rules.minAge || 0} ते ${rules.maxAge || 100} वर्षे)`,
        hi: `आयु विवरण आवश्यक (${rules.minAge || 0} से ${rules.maxAge || 100} वर्ष)`,
      });
    } else {
      const isAgeValid = 
        (rules.minAge === undefined || profile.age >= rules.minAge) &&
        (rules.maxAge === undefined || profile.age <= rules.maxAge);
      conditionsChecked.push({
        conditionName: 'Age Limit Check',
        ruleCategory: 'age',
        passed: isAgeValid,
        details: isAgeValid
          ? `Age (${profile.age} years) is within permissible range (${rules.minAge || 0} - ${rules.maxAge || 100})`
          : `Age (${profile.age} years) is outside required range (${rules.minAge || 0} - ${rules.maxAge || 100})`,
      });
      if (!isAgeValid) hasFailedCondition = true;
    }
  }

  // 4. Annual Family Income Check
  if (rules.maxFamilyIncome !== undefined) {
    if (profile.familyIncome === undefined || profile.familyIncome === null) {
      hasMissingInformation = true;
      conditionsChecked.push({
        conditionName: 'Family Income Limit',
        ruleCategory: 'income',
        passed: false,
        missingData: true,
        details: `Maximum income cap is ₹${rules.maxFamilyIncome.toLocaleString('en-IN')}, but income was not specified.`,
      });
      missingInfoList.push({
        en: `Family annual income range required (Cap: ₹${rules.maxFamilyIncome.toLocaleString('en-IN')})`,
        mr: `कौटुंबिक उत्पन्न तपशील आवश्यक (मर्यादा: ₹${rules.maxFamilyIncome.toLocaleString('en-IN')})`,
        hi: `पारिवारिक वार्षिक आय विवरण आवश्यक (सीमा: ₹${rules.maxFamilyIncome.toLocaleString('en-IN')})`,
      });
    } else {
      const isIncomeMatch = profile.familyIncome <= rules.maxFamilyIncome;
      conditionsChecked.push({
        conditionName: 'Family Income Limit',
        ruleCategory: 'income',
        passed: isIncomeMatch,
        details: isIncomeMatch
          ? `Family income ₹${profile.familyIncome.toLocaleString('en-IN')} is within ₹${rules.maxFamilyIncome.toLocaleString('en-IN')} limit`
          : `Family income ₹${profile.familyIncome.toLocaleString('en-IN')} exceeds the ceiling limit of ₹${rules.maxFamilyIncome.toLocaleString('en-IN')}`,
      });
      if (!isIncomeMatch) hasFailedCondition = true;
      else {
        whyMatchedList.push({
          en: `Annual income is within eligible limit (₹${profile.familyIncome.toLocaleString('en-IN')} <= ₹${rules.maxFamilyIncome.toLocaleString('en-IN')})`,
          mr: `कौटुंबिक उत्पन्न विहित मर्यादेत आहे (₹${profile.familyIncome.toLocaleString('en-IN')} <= ₹${rules.maxFamilyIncome.toLocaleString('en-IN')})`,
          hi: `पारिवारिक आय सीमा के भीतर है (₹${profile.familyIncome.toLocaleString('en-IN')} <= ₹${rules.maxFamilyIncome.toLocaleString('en-IN')})`,
        });
      }
    }
  }

  // 5. Academic Marks Percentage Check
  if (rules.minMarksPercentage !== undefined) {
    if (profile.previousMarksPercentage === undefined || profile.previousMarksPercentage === null) {
      hasMissingInformation = true;
      conditionsChecked.push({
        conditionName: 'Minimum Academic Marks Percentage',
        ruleCategory: 'academic',
        passed: false,
        missingData: true,
        details: `Requires minimum ${rules.minMarksPercentage}% marks, but previous percentage was skipped.`,
      });
      missingInfoList.push({
        en: `Previous examination marks percentage (Min: ${rules.minMarksPercentage}%)`,
        mr: `मागील परीक्षेतील गुण टक्केवारी आवश्यक (किमान: ${rules.minMarksPercentage}%)`,
        hi: `पिछली परीक्षा के अंक प्रतिशत (न्यूनतम: ${rules.minMarksPercentage}%)`,
      });
    } else {
      const isMarksMatch = profile.previousMarksPercentage >= rules.minMarksPercentage;
      conditionsChecked.push({
        conditionName: 'Minimum Academic Marks Percentage',
        ruleCategory: 'academic',
        passed: isMarksMatch,
        details: isMarksMatch
          ? `Score of ${profile.previousMarksPercentage}% meets or exceeds required ${rules.minMarksPercentage}%`
          : `Score of ${profile.previousMarksPercentage}% is below the mandatory cutoff of ${rules.minMarksPercentage}%`,
      });
      if (!isMarksMatch) hasFailedCondition = true;
      else {
        whyMatchedList.push({
          en: `Academic score of ${profile.previousMarksPercentage}% satisfies cutoff (>=${rules.minMarksPercentage}%)`,
          mr: `मागील परीक्षेत ${profile.previousMarksPercentage}% गुण असल्यामुळे कटऑफ पूर्ण`,
          hi: `अंक प्रतिशत ${profile.previousMarksPercentage}% कटऑफ को पूरा करता है`,
        });
      }
    }
  }

  // 6. Social Category Check
  if (rules.allowedCategories && rules.allowedCategories.length > 0) {
    const isCategoryMatch = rules.allowedCategories.includes(profile.socialCategory);
    conditionsChecked.push({
      conditionName: 'Social Category Criteria',
      ruleCategory: 'category',
      passed: isCategoryMatch,
      details: isCategoryMatch
        ? `Category (${profile.socialCategory}) is eligible under ${rules.allowedCategories.join(', ')}`
        : `Category (${profile.socialCategory}) does not match scheme quota (${rules.allowedCategories.join(', ')})`,
    });
    if (!isCategoryMatch) hasFailedCondition = true;
    else {
      whyMatchedList.push({
        en: `Belongs to eligible category: ${profile.socialCategory}`,
        mr: `पात्र सामाजिक प्रवर्ग: ${profile.socialCategory}`,
        hi: `पात्र सामाजिक वर्ग: ${profile.socialCategory}`,
      });
    }
  }

  // 7. Farmer Status Check
  if (rules.farmerOnly) {
    const isFarmerMatch = Boolean(profile.occupation === 'Farmer' || (profile.farmerStatus && profile.farmerStatus !== 'None'));
    conditionsChecked.push({
      conditionName: 'Farmer / Agricultural Landholder Status',
      ruleCategory: 'occupation',
      passed: isFarmerMatch,
      details: isFarmerMatch
        ? `Registered under Farmer category (${profile.farmerStatus || profile.occupation})`
        : 'Applicant is not classified as an agricultural landholder/farmer',
    });
    if (!isFarmerMatch) hasFailedCondition = true;
    else {
      whyMatchedList.push({
        en: 'Qualifies as an active agricultural farmer/landholder',
        mr: 'शेतजमीनधारक शेतकरी म्हणून पात्रता पूर्ण',
        hi: 'कृषक/भूमिधारक के रूप में पात्र',
      });
    }
  }

  // 8. Disability (Divyangjan) Status Check
  if (rules.disabilityOnly) {
    const hasDisability = Boolean(profile.disabilityStatus);
    const minPct = rules.minDisabilityPercentage || 40;
    const isPctSatisfied = !profile.disabilityPercentage || profile.disabilityPercentage >= minPct;
    const passed = hasDisability && isPctSatisfied;

    conditionsChecked.push({
      conditionName: 'Disability (Divyangjan) Certification',
      ruleCategory: 'disability',
      passed,
      details: passed
        ? `Valid Divyangjan status (${profile.disabilityPercentage || minPct}% >= required ${minPct}%)`
        : `Requires registered Divyangjan certificate with minimum ${minPct}% disability`,
    });
    if (!passed) hasFailedCondition = true;
    else {
      whyMatchedList.push({
        en: `Meets Divyangjan criteria (Min ${minPct}% disability)`,
        mr: `किमान ${minPct}% दिव्यांगत्व प्रमाण अट पूर्ण`,
        hi: `न्यूनतम ${minPct}% दिव्यांगता प्रमाण पूर्ण`,
      });
    }
  }

  // 9. Hostel Requirement Check
  if (rules.hostelRequired) {
    const isHostelMatch = Boolean(profile.isHostelite);
    conditionsChecked.push({
      conditionName: 'Hostel Resident Requirement',
      ruleCategory: 'hostel',
      passed: isHostelMatch,
      details: isHostelMatch
        ? 'Residing in institutional or verified private hostel'
        : 'Hostel resident proof required (Applicant is currently Day-Scholar)',
    });
    if (!isHostelMatch) hasFailedCondition = true;
  }

  // 10. Document Readiness Comparison
  const documentReadiness: DocumentReadinessCheck[] = (scheme.requiredDocCodes || []).map((code) => {
    const docMeta = DOCUMENT_CATALOG[code] || {
      name: { en: code, mr: code, hi: code },
      howToObtain: 'Procure from the relevant district or government department.',
    };
    const isAvailable = (profile.availableDocCodes || []).includes(code);

    return {
      docCode: code,
      docName: docMeta.name,
      isAvailable,
      status: isAvailable ? 'verified_digilocker' : 'missing',
      howToObtain: docMeta.howToObtain,
      portalUrl: docMeta.portalUrl,
    };
  });

  // Determine Final Outcome Status
  let status: EligibilityOutcomeStatus;

  if (scheme.status === 'Closed' || scheme.lastVerifiedDate < '2025-01-01') {
    status = 'Scheme information needs verification';
  } else if (hasFailedCondition) {
    status = 'One or more eligibility conditions not met';
  } else if (hasMissingInformation) {
    status = 'More information required';
  } else {
    status = 'Potentially eligible';
  }

  // Calculate Match Score Percentage
  const totalConditions = conditionsChecked.length || 1;
  const passedConditions = conditionsChecked.filter(c => c.passed).length;
  let matchScore = Math.round((passedConditions / totalConditions) * 100);

  if (status === 'One or more eligibility conditions not met') {
    matchScore = Math.min(matchScore, 40);
  } else if (status === 'More information required') {
    matchScore = Math.max(Math.min(matchScore, 75), 50);
  } else if (status === 'Potentially eligible') {
    matchScore = Math.max(matchScore, 85);
  }

  const verifiedBenefit: MultilingualText = {
    en: scheme.benefits.en[0] || 'Government welfare support',
    mr: scheme.benefits.mr[0] || 'शासकीय कल्याणकारी साहाय्य',
    hi: scheme.benefits.hi[0] || 'सरकारी कल्याणकारी सहायता',
  };

  return {
    schemeId: scheme.id,
    schemeTitle: scheme.title || scheme.name || { en: scheme.id, mr: scheme.id, hi: scheme.id },
    category: scheme.category || 'students',
    status,
    matchScore,
    whyMatched: whyMatchedList.length > 0 ? whyMatchedList : [{
      en: 'Matches published welfare scope',
      mr: 'कल्याणकारी निकष जुळतात',
      hi: 'कल्याणकारी मानदंड मेल खाते हैं',
    }],
    conditionsChecked,
    missingInformation: missingInfoList,
    requiredDocuments: scheme.requiredDocuments.en,
    documentReadiness,
    verifiedBenefit,
    verifiedDeadline: scheme.applicationDeadline,
    officialSourceUrl: scheme.officialUrl,
    lastVerifiedDate: scheme.lastVerifiedDate,
  };
}

/**
 * Filter and Rank schemes for a Citizen Profile
 */
export function rankCitizenSchemes(
  profile: CitizenProfile,
  allSchemes: SchemeRecord[]
): {
  potentiallyEligible: UnifiedEligibilityResult[];
  moreInfoRequired: UnifiedEligibilityResult[];
  conditionsNotMet: UnifiedEligibilityResult[];
  needsVerification: UnifiedEligibilityResult[];
} {
  const potentiallyEligible: UnifiedEligibilityResult[] = [];
  const moreInfoRequired: UnifiedEligibilityResult[] = [];
  const conditionsNotMet: UnifiedEligibilityResult[] = [];
  const needsVerification: UnifiedEligibilityResult[] = [];

  allSchemes.forEach((scheme) => {
    const result = evaluateSchemeEligibility(profile, scheme);

    switch (result.status) {
      case 'Potentially eligible':
        potentiallyEligible.push(result);
        break;
      case 'More information required':
        moreInfoRequired.push(result);
        break;
      case 'One or more eligibility conditions not met':
        conditionsNotMet.push(result);
        break;
      case 'Scheme information needs verification':
        needsVerification.push(result);
        break;
    }
  });

  // Sort by highest match score
  potentiallyEligible.sort((a, b) => b.matchScore - a.matchScore);
  moreInfoRequired.sort((a, b) => b.matchScore - a.matchScore);

  return {
    potentiallyEligible,
    moreInfoRequired,
    conditionsNotMet,
    needsVerification,
  };
}

export function calculateProfileReadinessScore(profile: CitizenProfile, availableDocs: string[] = []): number {
  let score = 20;
  if (profile.district) score += 10;
  if (profile.gender) score += 10;
  if (profile.familyIncome > 0) score += 15;
  if (profile.educationLevel) score += 15;
  if (profile.consentGiven) score += 10;
  const docsCount = availableDocs.length || profile.availableDocCodes?.length || 0;
  score += Math.min(docsCount * 10, 20);
  return Math.min(score, 100);
}

export const evaluateScheme = evaluateSchemeEligibility;
export const batchEvaluateSchemes = rankCitizenSchemes;
export const evaluateAllSchemes = rankCitizenSchemes;
export const calculateReadinessScore = calculateProfileReadinessScore;
export const DOCUMENT_GUIDES = DOCUMENT_CATALOG;
