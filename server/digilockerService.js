/**
 * Sahayakon 2.0 DigiLocker Integration Service
 * Follows official API Setu & DigiLocker Partner OAuth 2.0 Specifications:
 * https://api.apisetu.gov.in/ & https://apisetu.gov.in/digilocker
 */

import crypto from 'crypto';

// Server-side Environment Variables (never exposed to frontend)
const DIGILOCKER_CLIENT_ID = process.env.DIGILOCKER_CLIENT_ID || '';
const DIGILOCKER_CLIENT_SECRET = process.env.DIGILOCKER_CLIENT_SECRET || '';
const DIGILOCKER_REDIRECT_URI = process.env.DIGILOCKER_REDIRECT_URI || 'http://localhost:5173/digilocker/callback';
const DIGILOCKER_AUTH_ENDPOINT = process.env.DIGILOCKER_AUTH_ENDPOINT || 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize';
const DIGILOCKER_TOKEN_ENDPOINT = process.env.DIGILOCKER_TOKEN_ENDPOINT || 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/token';

// In-memory session and state validation store
const activeOAuthStates = new Map();
const activeUserSessions = new Map();

/**
 * Standard Verified Demo Documents for Testing / Sandbox
 * Clearly tagged with isDemoRecord: true
 */
const SAMPLE_DEMO_DOCUMENTS = [
  {
    docId: 'demo-doc-inc-01',
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
    metadataSummary: 'Income: ₹1,80,000/yr | Cert No: RE/2026/XXXX-8912 | Sub-Division: Haveli, Pune',
    officialProcurementPortal: 'https://aaplesarkar.mahaonline.gov.in',
    instructionsForProcurement: {
      en: 'Apply on Aaple Sarkar portal or visit your nearest Setu Suvidha Kendra with Ration Card and Salary Slip/Talathi report.',
      mr: 'आपले सरकार पोर्टलवर अर्ज करा किंवा शिधापत्रिका व तलाठी अहवालासह जवळच्या सेतू सुविधा केंद्रास भेट द्या.',
      hi: 'आपले सरकार पोर्टल पर आवेदन करें या राशन कार्ड और पटवारी रिपोर्ट के साथ निकटतम सेतु केंद्र पर जाएं।'
    }
  },
  {
    docId: 'demo-doc-dom-02',
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
      en: 'Issued by SDM / Tehsildar office. Requires Proof of 15-year residence, School Leaving Certificate, and Electricity Bill.',
      mr: 'एसडीएम / तहसीलदार कार्यालयामार्फत जारी. १५ वर्षांचा रहिवासी पुरावा व शाळा सोडल्याचा दाखला आवश्यक.',
      hi: 'एसडीएम / तहसीलदार कार्यालय द्वारा जारी। 15 वर्षों के निवास का प्रमाण आवश्यक।'
    }
  },
  {
    docId: 'demo-doc-cst-03',
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
    docId: 'demo-doc-m12-04',
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
    docId: 'demo-doc-m10-05',
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
    docId: 'demo-doc-rc-06',
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

export const digiLockerService = {
  /**
   * Check if production API Setu credentials are configured
   */
  isConfigured() {
    return Boolean(DIGILOCKER_CLIENT_ID && DIGILOCKER_CLIENT_SECRET);
  },

  /**
   * Generate official OAuth 2.0 authorization URL
   */
  generateAuthUrl(userId = 'citizen-guest') {
    const isDemo = !this.isConfigured();
    const state = crypto.randomBytes(16).toString('hex');
    activeOAuthStates.set(state, { userId, createdAt: Date.now(), isDemo });

    if (isDemo) {
      // In Demo Mode, return a local simulation endpoint
      return {
        url: `/api/digilocker/demo-authorize?state=${state}`,
        state,
        isDemoMode: true,
        message: 'DEMO MODE: Official API Setu credentials not set in environment. Running safe sandbox simulation with sample verified records.',
      };
    }

    // Official DigiLocker Authorization URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: DIGILOCKER_CLIENT_ID,
      redirect_uri: DIGILOCKER_REDIRECT_URI,
      state: state,
      scope: 'openid profile',
    });

    return {
      url: `${DIGILOCKER_AUTH_ENDPOINT}?${params.toString()}`,
      state,
      isDemoMode: false,
    };
  },

  /**
   * Handle OAuth Token Exchange
   */
  async handleCallback(code, state) {
    const stateRecord = activeOAuthStates.get(state);
    if (!stateRecord) {
      throw new Error('Invalid or expired OAuth state parameter. Request rejected for security.');
    }
    activeOAuthStates.delete(state);

    if (stateRecord.isDemo) {
      const session = {
        userId: stateRecord.userId,
        isConnected: true,
        isDemoMode: true,
        connectedAt: new Date().toISOString(),
        documents: SAMPLE_DEMO_DOCUMENTS,
      };
      activeUserSessions.set(stateRecord.userId, session);
      return session;
    }

    // Exchange code for token with DigiLocker server
    const tokenResponse = await fetch(DIGILOCKER_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: DIGILOCKER_CLIENT_ID,
        client_secret: DIGILOCKER_CLIENT_SECRET,
        redirect_uri: DIGILOCKER_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      throw new Error(`DigiLocker token exchange failed: ${err}`);
    }

    const tokens = await tokenResponse.json();
    const session = {
      userId: stateRecord.userId,
      isConnected: true,
      isDemoMode: false,
      accessToken: tokens.access_token,
      expiresAt: Date.now() + (tokens.expires_in || 3600) * 1000,
      connectedAt: new Date().toISOString(),
      documents: [],
    };
    activeUserSessions.set(stateRecord.userId, session);
    return session;
  },

  /**
   * Get User Connected Session & Document Metadata
   */
  getUserDocuments(userId = 'citizen-guest') {
    const session = activeUserSessions.get(userId);
    if (!session || !session.isConnected) {
      return {
        isConnected: false,
        isDemoMode: !this.isConfigured(),
        documents: [],
      };
    }

    return {
      isConnected: true,
      isDemoMode: session.isDemoMode,
      connectedAt: session.connectedAt,
      documents: session.documents || SAMPLE_DEMO_DOCUMENTS,
    };
  },

  /**
   * Disconnect and Revoke Access
   */
  disconnectSession(userId = 'citizen-guest') {
    activeUserSessions.delete(userId);
    return {
      success: true,
      message: 'DigiLocker connection disconnected. Stored tokens and document cache wiped successfully.',
    };
  },

  /**
   * Add Manual Document Verification
   */
  addManualDocument(userId = 'citizen-guest', docMetadata) {
    let session = activeUserSessions.get(userId);
    if (!session) {
      session = {
        userId,
        isConnected: false,
        isDemoMode: false,
        documents: [],
      };
      activeUserSessions.set(userId, session);
    }

    const newDoc = {
      docId: `man-${Date.now()}`,
      docCode: docMetadata.docCode,
      name: {
        en: docMetadata.name || 'Manual Document',
        mr: docMetadata.nameMr || docMetadata.name || 'दस्तऐवज',
        hi: docMetadata.nameHi || docMetadata.name || 'दस्तावेज',
      },
      category: docMetadata.category || 'identity_residence',
      issuer: docMetadata.issuer || 'Self-Declared / Local Authority',
      issueDate: docMetadata.issueDate || new Date().toISOString().split('T')[0],
      verificationStatus: 'uploaded_manual',
      source: 'manual',
      isDemoRecord: false,
      metadataSummary: docMetadata.metadataSummary || 'User-confirmed document record',
      officialProcurementPortal: docMetadata.officialProcurementPortal,
    };

    session.documents = [newDoc, ...(session.documents || [])];
    return newDoc;
  }
};
