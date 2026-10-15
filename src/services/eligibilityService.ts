import type { 
  StudentProfile, 
  Scholarship, 
  EligibilityMatchResult 
} from '../types';

export function evaluateScholarshipEligibility(
  student: Partial<StudentProfile>,
  scholarship: Scholarship
): EligibilityMatchResult {
  const matchedEn: string[] = [];
  const matchedMr: string[] = [];
  const matchedHi: string[] = [];

  const unmetEn: string[] = [];
  const unmetMr: string[] = [];
  const unmetHi: string[] = [];

  const missingEn: string[] = [];
  const missingMr: string[] = [];
  const missingHi: string[] = [];

  let totalCheckpoints = 0;
  let passedCheckpoints = 0;

  const rules = scholarship.rules;

  // 1. Domicile / State Check
  if (rules.domicileRequired) {
    totalCheckpoints++;
    if (!student.domicileState && !student.state) {
      missingEn.push('State of residence or Domicile proof not specified.');
      missingMr.push('अधिवास (Domicile) किंवा वास्तव्याचे राज्य नमूद केलेले नाही.');
      missingHi.push('मूल निवास या अधिवास राज्य स्पष्ट नहीं किया गया है।');
    } else if (
      (rules.domicileRequired as unknown) === 'Maharashtra' &&
      student.domicileState !== 'Maharashtra' &&
      student.state !== 'Maharashtra'
    ) {
      unmetEn.push(`Requires Maharashtra Domicile. You selected: ${student.state || 'Other'}.`);
      unmetMr.push(`महाराष्ट्र अधिवास (Domicile) आवश्यक आहे. आपण निवडलेले राज्य: ${student.state || 'इतर'}.`);
      unmetHi.push(`महाराष्ट्र का मूल निवास आवश्यक है। आपने चुना है: ${student.state || 'अन्य'}।`);
    } else {
      passedCheckpoints++;
      matchedEn.push('State Domicile criteria satisfied.');
      matchedMr.push('राज्यातील अधिवास (Domicile) निकष पूर्ण.');
      matchedHi.push('राज्य का मूल निवास मानदंड पूर्ण।');
    }
  }

  // 2. Family Income Check
  if (rules.maxFamilyIncome) {
    totalCheckpoints++;
    if (student.familyIncome === undefined || student.familyIncome === null) {
      missingEn.push('Annual family income not specified.');
      missingMr.push('वार्षिक कौटुंबिक उत्पन्न नमूद केलेले नाही.');
      missingHi.push('वार्षिक पारिवारिक आय दर्ज नहीं की गई है।');
    } else if (student.familyIncome > rules.maxFamilyIncome) {
      const limitStr = `₹${(rules.maxFamilyIncome / 100000).toFixed(1)} Lakhs`;
      unmetEn.push(`Family income exceeds ceiling limit of ${limitStr} (Entered: ₹${student.familyIncome.toLocaleString('en-IN')}).`);
      unmetMr.push(`कौटुंबिक उत्पन्न ${limitStr} च्या मर्यादेपेक्षा जास्त आहे (प्रविष्ट: ₹${student.familyIncome.toLocaleString('en-IN')}).`);
      unmetHi.push(`पारिवारिक आय सीमा ${limitStr} से अधिक है (दर्ज: ₹${student.familyIncome.toLocaleString('en-IN')})।`);
    } else {
      passedCheckpoints++;
      matchedEn.push(`Annual family income is within allowable ceiling limit (<= ₹${rules.maxFamilyIncome.toLocaleString('en-IN')}).`);
      matchedMr.push(`कौटुंबिक उत्पन्न विहित मर्यादेच्या आत आहे (<= ₹${rules.maxFamilyIncome.toLocaleString('en-IN')}).`);
      matchedHi.push(`पारिवारिक आय निर्धारित सीमा के भीतर है।`);
    }
  }

  // 3. Social Category Check
  if (rules.allowedCategories && rules.allowedCategories.length > 0) {
    totalCheckpoints++;
    if (!student.socialCategory) {
      missingEn.push('Social category not specified in profile.');
      missingMr.push('सामाजिक प्रवर्ग (Caste Category) नमूद केलेला नाही.');
      missingHi.push('सामाजिक श्रेणी (वर्ग) दर्ज नहीं की गई है।');
    } else if (!rules.allowedCategories.includes(student.socialCategory)) {
      unmetEn.push(`Scheme is meant for categories [${rules.allowedCategories.join(', ')}]. You indicated: ${student.socialCategory}.`);
      unmetMr.push(`योजना [${rules.allowedCategories.join(', ')}] या प्रवर्गांसाठी आहे. आपला प्रवर्ग: ${student.socialCategory}.`);
      unmetHi.push(`योजना [${rules.allowedCategories.join(', ')}] श्रेणियों के लिए है। आपका वर्ग: ${student.socialCategory}।`);
    } else {
      passedCheckpoints++;
      matchedEn.push(`Category (${student.socialCategory}) is eligible for this scheme.`);
      matchedMr.push(`सामाजिक प्रवर्ग (${student.socialCategory}) या योजनेसाठी पात्र आहे.`);
      matchedHi.push(`आपकी सामाजिक श्रेणी (${student.socialCategory}) पात्र है।`);
    }
  }

  // 4. Minority Community Check
  if (rules.allowedMinorities && rules.allowedMinorities.length > 0) {
    totalCheckpoints++;
    if (!student.minorityStatus || student.minorityStatus === 'None') {
      unmetEn.push(`Reserved exclusively for notified religious minorities [${rules.allowedMinorities.join(', ')}].`);
      unmetMr.push(`केवळ अधिसुचित अल्पसंख्याक समाजातील विद्यार्थ्यांसाठी [${rules.allowedMinorities.join(', ')}] आरक्षित.`);
      unmetHi.push(`यह योजना केवल अल्पसंख्यक समुदायों [${rules.allowedMinorities.join(', ')}] के लिए है।`);
    } else if (!rules.allowedMinorities.includes(student.minorityStatus)) {
      unmetEn.push(`Your indicated minority status (${student.minorityStatus}) is not listed under this specific scheme.`);
      unmetMr.push(`आपला अल्पसंख्याक प्रवर्ग (${student.minorityStatus}) या योजनेच्या यादीत नाही.`);
      unmetHi.push(`आपका अल्पसंख्यक समुदाय (${student.minorityStatus}) इस योजना के अंतर्गत सूचीबद्ध नहीं है।`);
    } else {
      passedCheckpoints++;
      matchedEn.push(`Minority community criteria (${student.minorityStatus}) satisfied.`);
      matchedMr.push(`अल्पसंख्याक समुदाय निकष (${student.minorityStatus}) पूर्ण.`);
      matchedHi.push(`अल्पसंख्यक समुदाय मानदंड (${student.minorityStatus}) पूर्ण।`);
    }
  }

  // 5. Gender Restriction Check (e.g. AICTE Pragati)
  if (rules.genderRestriction && rules.genderRestriction !== 'All') {
    totalCheckpoints++;
    if (!student.gender) {
      missingEn.push('Gender not specified.');
      missingMr.push('लिंग (Gender) नमूद केलेले नाही.');
      missingHi.push('लिंग का विवरण नहीं दिया गया है।');
    } else if (rules.genderRestriction === 'Female' && student.gender !== 'Female') {
      unmetEn.push('This scheme is earmarked exclusively for female students.');
      unmetMr.push('ही योजना केवळ विद्यार्थिनींसाठी (मुलींसाठी) आरक्षित आहे.');
      unmetHi.push('यह योजना केवल बालिकाओं (छात्राओं) के लिए आरक्षित है।');
    } else {
      passedCheckpoints++;
      matchedEn.push('Gender requirement fulfilled.');
      matchedMr.push('विद्यार्थिनी आरक्षण निकष पूर्ण.');
      matchedHi.push('छात्रा आरक्षण मानदंड पूर्ण।');
    }
  }

  // 6. Academic Percentage / Marks Check
  if (rules.minPercentage) {
    totalCheckpoints++;
    if (student.previousMarksPercentage === undefined || student.previousMarksPercentage === null) {
      missingEn.push(`Previous exam percentage required (Min: ${rules.minPercentage}%).`);
      missingMr.push(`मागील परीक्षेतील गुण टक्केवारी आवश्यक आहे (किमान: ${rules.minPercentage}%).`);
      missingHi.push(`पिछली परीक्षा के अंक प्रतिशत की आवश्यकता है (न्यूनतम: ${rules.minPercentage}%)।`);
    } else if (student.previousMarksPercentage < rules.minPercentage) {
      unmetEn.push(`Requires minimum ${rules.minPercentage}% in previous exam. You scored: ${student.previousMarksPercentage}%.`);
      unmetMr.push(`मागील परीक्षेत किमान ${rules.minPercentage}% गुण आवश्यक. आपले गुण: ${student.previousMarksPercentage}%.`);
      unmetHi.push(`पिछली परीक्षा में न्यूनतम ${rules.minPercentage}% आवश्यक हैं। आपके अंक: ${student.previousMarksPercentage}%।`);
    } else {
      passedCheckpoints++;
      matchedEn.push(`Academic score (${student.previousMarksPercentage}%) meets or exceeds the required threshold of ${rules.minPercentage}%.`);
      matchedMr.push(`शैक्षणिक गुण (${student.previousMarksPercentage}%) किमान पात्रता गुणांपेक्षा (${rules.minPercentage}%) जास्त आहेत.`);
      matchedHi.push(`शैक्षणिक अंक (${student.previousMarksPercentage}%) न्यूनतम आवश्यकता (${rules.minPercentage}%) से अधिक हैं।`);
    }
  }

  // 7. Disability Criteria Check
  if (rules.disabilityRequired) {
    totalCheckpoints++;
    if (!student.disabilityStatus) {
      unmetEn.push('This scheme is designated solely for specially abled students (40%+ disability).');
      unmetMr.push('ही योजना केवळ दिव्यांग विद्यार्थ्यांसाठी (किमान ४०% अपंगत्व) आहे.');
      unmetHi.push('यह योजना केवल 40% या अधिक दिव्यांग विद्यार्थियों के लिए है।');
    } else {
      passedCheckpoints++;
      matchedEn.push('Special ability / disability criteria matched.');
      matchedMr.push('दिव्यांग आरक्षण निकष पूर्ण.');
      matchedHi.push('दिव्यांग मानदंड पूर्ण।');
    }
  }

  // 8. Education Level / Course Check
  if (rules.allowedEducationLevels && rules.allowedEducationLevels.length > 0) {
    totalCheckpoints++;
    if (!student.educationLevel) {
      missingEn.push('Current education level or course stream not specified.');
      missingMr.push('सध्याचा शिक्षण स्तर किंवा अभ्यासक्रम निवडलेला नाही.');
      missingHi.push('वर्तमान शिक्षा स्तर या पाठ्यक्रम का चयन नहीं किया गया है।');
    } else if (
      !rules.allowedEducationLevels.includes(student.educationLevel) &&
      !rules.allowedEducationLevels.includes('Undergraduate') // Generic fallback
    ) {
      unmetEn.push(`Course stream [${student.educationLevel}] is not eligible. Eligible streams: [${rules.allowedEducationLevels.join(', ')}].`);
      unmetMr.push(`आपला अभ्यासक्रम [${student.educationLevel}] या योजनेस पात्र नाही. पात्र अभ्यासक्रम: [${rules.allowedEducationLevels.join(', ')}].`);
      unmetHi.push(`आपका पाठ्यक्रम [${student.educationLevel}] पात्र नहीं है। पात्र स्तर: [${rules.allowedEducationLevels.join(', ')}]।`);
    } else {
      passedCheckpoints++;
      matchedEn.push(`Education level (${student.educationLevel}) is covered by this scheme.`);
      matchedMr.push(`शिक्षण स्तर (${student.educationLevel}) या योजनेसाठी पात्र आहे.`);
      matchedHi.push(`शिक्षा स्तर (${student.educationLevel}) इस योजना में शामिल है।`);
    }
  }

  // Calculate Match Score
  const score = totalCheckpoints > 0 
    ? Math.round((passedCheckpoints / totalCheckpoints) * 100) 
    : 100;

  let status: 'Eligible' | 'Possibly Eligible' | 'Not Eligible' = 'Not Eligible';

  if (unmetEn.length === 0 && missingEn.length === 0) {
    status = 'Eligible';
  } else if (unmetEn.length === 0 && missingEn.length > 0) {
    status = 'Possibly Eligible';
  } else if (unmetEn.length === 1 && missingEn.length === 0 && score >= 70) {
    status = 'Possibly Eligible';
  } else {
    status = 'Not Eligible';
  }

  return {
    scholarship,
    status,
    matchScore: score,
    matchedCriteria: { en: matchedEn, mr: matchedMr, hi: matchedHi },
    unmetCriteria: { en: unmetEn, mr: unmetMr, hi: unmetHi },
    missingInformation: { en: missingEn, mr: missingMr, hi: missingHi },
  };
}

export function rankMatchingScholarships(
  student: Partial<StudentProfile>,
  scholarships: Scholarship[]
): EligibilityMatchResult[] {
  const results = scholarships.map((s) => evaluateScholarshipEligibility(student, s));

  // Sort by Status Priority: Eligible > Possibly Eligible > Not Eligible, then by Match Score descending
  return results.sort((a, b) => {
    const priority = { 'Eligible': 3, 'Possibly Eligible': 2, 'Not Eligible': 1 };
    if (priority[a.status] !== priority[b.status]) {
      return priority[b.status] - priority[a.status];
    }
    return b.matchScore - a.matchScore;
  });
}
