import type { DigiLockerDocument, DigiLockerSession } from '../types';

const DIGILOCKER_STORAGE_KEY = 'sahayakon_digilocker_session';
const DIGILOCKER_DOCS_KEY = 'sahayakon_digilocker_docs';

export const DEFAULT_DEMO_DOCUMENTS: DigiLockerDocument[] = [
  {
    docId: 'doc-inc-01',
    docCode: 'income_cert',
    name: {
      en: 'Tahsildar Family Income Certificate (Valid 2026-27)',
      mr: 'तहसीलदार कौटुंबिक उत्पन्न दाखला (वैध २०२६-२७)',
      hi: 'तहसीलदार पारिवारिक आय प्रमाण पत्र (वैध 2026-27)'
    },
    category: 'income',
    issuer: 'Revenue Department, Govt of Maharashtra (Aaple Sarkar)',
    issueDate: '2026-04-12',
    validUntil: '2027-03-31',
    verificationStatus: 'verified_digilocker',
    source: 'digilocker',
    isDemoRecord: true,
    metadataSummary: 'Income: ₹1,80,000/yr | Cert: RE/2026/XXXX-8912 | Sub-Division: Haveli, Pune',
    officialProcurementPortal: 'https://aaplesarkar.mahaonline.gov.in',
    instructionsForProcurement: {
      en: 'Apply on Aaple Sarkar portal or visit your nearest Setu Suvidha Kendra with Ration Card and Salary Slip/Talathi report.',
      mr: 'आपले सरकार पोर्टलवर अर्ज करा किंवा शिधापत्रिका व तलाठी अहवालासह जवळच्या सेतू सुविधा केंद्रास भेट द्या.',
      hi: 'आपले सरकार पोर्टल पर आवेदन करें या राशन कार्ड और पटवारी रिपोर्ट के साथ निकटतम सेतु केंद्र पर जाएं।'
    }
  },
  {
    docId: 'doc-dom-02',
    docCode: 'domicile_cert',
    name: {
      en: 'Maharashtra State Domicile & Age/Nationality Certificate',
      mr: 'महाराष्ट्र राज्य अधिवास (डोमिसाइल) प्रमाणपत्र',
      hi: 'महाराष्ट्र राज्य मूल निवास (डोमिसाइल) प्रमाण पत्र'
    },
    category: 'identity_residence',
    issuer: 'Sub-Divisional Magistrate, Govt of Maharashtra',
    issueDate: '2024-06-18',
    verificationStatus: 'verified_digilocker',
    source: 'digilocker',
    isDemoRecord: true,
    metadataSummary: 'Resident of Maharashtra for >15 Years | District: Pune',
    officialProcurementPortal: 'https://aaplesarkar.mahaonline.gov.in',
    instructionsForProcurement: {
      en: 'Issued by SDM / Tehsildar office. Requires Proof of 15-year residence and School Leaving Certificate.',
      mr: 'एसडीएम / तहसीलदार कार्यालयामार्फत जारी. १५ वर्षांचा रहिवासी पुरावा आवश्यक.',
      hi: 'एसडीएम / तहसीलदार कार्यालय द्वारा जारी। 15 वर्षों के निवास का प्रमाण आवश्यक।'
    }
  },
  {
    docId: 'doc-cst-03',
    docCode: 'caste_cert',
    name: {
      en: 'Central / State OBC Caste Certificate & Non-Creamy Layer',
      mr: 'इतर मागासवर्ग (OBC) जात प्रमाणपत्र व नॉन-क्रिमिलेअर',
      hi: 'अन्य पिछड़ा वर्ग (OBC) जाति प्रमाण पत्र एवं नॉन-क्रीमी लेयर'
    },
    category: 'caste_category',
    issuer: 'Competent Authority & District Caste Scrutiny Committee',
    issueDate: '2025-05-10',
    validUntil: '2028-03-31',
    verificationStatus: 'verified_digilocker',
    source: 'digilocker',
    isDemoRecord: true,
    metadataSummary: 'Caste: Kunbi (OBC) | NCL Cert No: NCL/2025/XXXX-3310',
    officialProcurementPortal: 'https://aaplesarkar.mahaonline.gov.in',
    instructionsForProcurement: {
      en: 'Requires proof of pre-1967 caste records, genealogy chart, and current 3-year income documents.',
      mr: '१९६७ पूर्वीचा जात पुरावा, वंशावळ व मागील ३ वर्षांचे उत्पन्न प्रमाणपत्र आवश्यक.',
      hi: '1967 से पूर्व का जाति प्रमाण एवं 3 वर्षों का आय प्रमाण पत्र आवश्यक।'
    }
  },
  {
    docId: 'doc-m12-04',
    docCode: 'marksheet_12',
    name: {
      en: 'Higher Secondary Certificate (Class XII) Marksheet',
      mr: 'इयत्ता १२ वी (HSC) गुणपत्रिका व उत्तीर्ण प्रमाणपत्र',
      hi: 'कक्षा 12वीं (HSC) अंकतालिका एवं उत्तीर्ण प्रमाण पत्र'
    },
    category: 'academic',
    issuer: 'Maharashtra State Board of Secondary and Higher Secondary Education, Pune',
    issueDate: '2024-05-28',
    verificationStatus: 'verified_digilocker',
    source: 'digilocker',
    isDemoRecord: true,
    metadataSummary: 'Stream: Science | Overall Percentage: 78.60% | Seat No: M028192',
    officialProcurementPortal: 'https://mahahsscboard.in',
    instructionsForProcurement: {
      en: 'Instant digital marksheet available via DigiLocker using Roll Number and Mother name.',
      mr: 'डिजिलॉकरवरून रोल नंबर व आईच्या नावाने त्वरित डिजिटल गुणपत्रिका प्राप्त करता येते.',
      hi: 'डिजिलॉकर से रोल नंबर के माध्यम से तत्काल डिजिटल अंकतालिका प्राप्त करें।'
    }
  },
  {
    docId: 'doc-m10-05',
    docCode: 'marksheet_10',
    name: {
      en: 'Secondary School Certificate (Class X) Marksheet',
      mr: 'इयत्ता १० वी (SSC) गुणपत्रिका',
      hi: 'कक्षा 10वीं (SSC) अंकतालिका'
    },
    category: 'academic',
    issuer: 'Maharashtra State Board of Secondary & Higher Secondary Education',
    issueDate: '2022-06-15',
    verificationStatus: 'verified_digilocker',
    source: 'digilocker',
    isDemoRecord: true,
    metadataSummary: 'Overall Marks: 82.40% | Seat No: B190421',
    officialProcurementPortal: 'https://mahahsscboard.in',
    instructionsForProcurement: {
      en: 'Available from DigiLocker repository under MSBSHSE Pune issuer.',
      mr: 'महाराष्ट्र राज्य परीक्षा मंडळ, पुणे या विभागांतर्गत डिजिलॉकरमध्ये उपलब्ध.',
      hi: 'डिजिलॉकर में एमएसबीएसएचएसई पुणे विभाग से उपलब्ध।'
    }
  },
  {
    docId: 'doc-rc-06',
    docCode: 'ration_card',
    name: {
      en: 'Maharashtra Food, Civil Supplies & Consumer Protection Ration Card',
      mr: 'अन्न व नागरी पुरवठा शिधापत्रिका (रेशन कार्ड)',
      hi: 'खाद्य एवं नागरिक आपूर्ति राशन कार्ड'
    },
    category: 'identity_residence',
    issuer: 'Food, Civil Supplies and Consumer Protection Dept, Maharashtra',
    issueDate: '2023-01-20',
    verificationStatus: 'verified_digilocker',
    source: 'digilocker',
    isDemoRecord: true,
    metadataSummary: 'Card Type: Saffron (Kesari) | Total Family Beneficiaries: 4',
    officialProcurementPortal: 'https://rcms.mahafood.gov.in',
    instructionsForProcurement: {
      en: 'Viewable on MahaFood RCMS portal and downloadable into DigiLocker.',
      mr: 'महाफूड आरसीएमएस पोर्टलवर उपलब्ध आणि डिजिलॉकरमध्ये जोडता येते.',
      hi: 'महाफूड पोर्टल पर उपलब्ध एवं डिजिलॉकर में जोड़ने योग्य।'
    }
  }
];

export function getStoredDigiLockerSession(): DigiLockerSession {
  try {
    const raw = localStorage.getItem(DIGILOCKER_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {
    isConnected: false,
    isDemoMode: true,
    totalDocumentsCount: 0,
  };
}

export function saveStoredDigiLockerSession(session: DigiLockerSession): void {
  localStorage.setItem(DIGILOCKER_STORAGE_KEY, JSON.stringify(session));
}

export function getStoredDigiLockerDocs(): DigiLockerDocument[] {
  try {
    const raw = localStorage.getItem(DIGILOCKER_DOCS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
}

export function saveStoredDigiLockerDocs(docs: DigiLockerDocument[]): void {
  localStorage.setItem(DIGILOCKER_DOCS_KEY, JSON.stringify(docs));
}

/**
 * Connect to DigiLocker in Demo Sandbox Mode
 */
export function connectDemoDigiLocker(): { session: DigiLockerSession; docs: DigiLockerDocument[] } {
  const session: DigiLockerSession = {
    isConnected: true,
    isDemoMode: true,
    connectedAt: new Date().toISOString(),
    lastSyncAt: new Date().toISOString(),
    partnerName: 'API Setu / DigiLocker Sandbox Partner',
    scope: ['academic_records', 'income_certificate', 'caste_certificate', 'domicile_certificate'],
    totalDocumentsCount: DEFAULT_DEMO_DOCUMENTS.length,
  };

  saveStoredDigiLockerSession(session);
  saveStoredDigiLockerDocs(DEFAULT_DEMO_DOCUMENTS);

  return { session, docs: DEFAULT_DEMO_DOCUMENTS };
}

/**
 * Disconnect and Revoke DigiLocker Access
 */
export function disconnectDigiLocker(): void {
  localStorage.removeItem(DIGILOCKER_STORAGE_KEY);
  localStorage.removeItem(DIGILOCKER_DOCS_KEY);

  // Try notifying backend as well
  fetch('/api/digilocker/disconnect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'citizen-guest' }),
  }).catch(() => {});
}

/**
 * Add a manual document record
 */
export function addManualDocumentRecord(doc: Omit<DigiLockerDocument, 'docId' | 'isDemoRecord' | 'source'>): DigiLockerDocument {
  const existingDocs = getStoredDigiLockerDocs();
  const newDoc: DigiLockerDocument = {
    ...doc,
    docId: `man-${Date.now()}`,
    isDemoRecord: false,
    source: 'manual',
    verificationStatus: 'uploaded_manual',
  };

  const updated = [newDoc, ...existingDocs];
  saveStoredDigiLockerDocs(updated);

  const session = getStoredDigiLockerSession();
  session.totalDocumentsCount = updated.length;
  saveStoredDigiLockerSession(session);

  return newDoc;
}

export const getStoredSession = getStoredDigiLockerSession;
export const saveStoredSession = saveStoredDigiLockerSession;
export const SAMPLE_DIGILOCKER_DOCUMENTS = DEFAULT_DEMO_DOCUMENTS;

export function getDigiLockerAuthUrl(): string {
  const state = 'state_' + Math.random().toString(36).substring(7);
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('digilocker_oauth_state', state);
  }
  return `https://api.apisetu.gov.in/oauth2/1/authorize?client_id=demo_apisetu_client&response_type=code&state=${state}&redirect_uri=${encodeURIComponent('http://localhost:5173/digilocker/callback')}`;
}

export async function exchangeDigiLockerToken(_code: string, _state: string): Promise<DigiLockerSession> {
  const { session } = connectDemoDigiLocker();
  return session;
}

export async function fetchDigiLockerDocuments(): Promise<DigiLockerDocument[]> {
  return getStoredDigiLockerDocs();
}

export async function addManualDocument(doc: any): Promise<DigiLockerDocument> {
  return addManualDocumentRecord(doc);
}

export function isDocumentTypeAvailable(docType: string): boolean {
  const docs = getStoredDigiLockerDocs();
  return docs.some((d) => d.docCode === docType || d.category === docType);
}
