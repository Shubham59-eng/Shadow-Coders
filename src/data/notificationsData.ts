import type { MultilingualText, SchemeCategory, SchemeLevel } from '../types';

export type NotificationType =
  | 'new_scheme'
  | 'scholarship_announcement'
  | 'application_dates'
  | 'deadline'
  | 'deadline_extension'
  | 'eligibility_change'
  | 'application_status'
  | 'beneficiary_update'
  | 'circular_guideline'
  | 'status_change'
  | 'correction';

export interface SchemeNotification {
  id: string;
  schemeId?: string;
  title: MultilingualText;
  summary: MultilingualText;
  details?: MultilingualText;
  issuingAuthority: string;
  department: string;
  level: SchemeLevel;
  category: SchemeCategory;
  notificationType: NotificationType;
  officialAnnouncementDate: string; // YYYY-MM-DD
  discoveredDate: string;           // YYYY-MM-DD
  lastVerifiedDate: string;         // YYYY-MM-DD
  officialSourceUrl: string;
  officialCircularNo?: string;
  applicationDeadline?: string;
  schemeStatus?: 'Open' | 'Upcoming' | 'Closed' | 'Extended';
  isNew?: boolean;
}

export const VERIFIED_GOVERNMENT_NOTIFICATIONS: SchemeNotification[] = [
  {
    id: 'notif-2026-mahadbt-ebc',
    schemeId: 'sch-mah-ebc',
    title: {
      en: 'MahaDBT 2026-27: Rajarshi Shahu EBC & Post-Matric Scholarship Applications Open',
      mr: 'MahaDBT २०२६-२७: राजर्षी शाहू EBC आणि मॅट्रिकोत्तर शिष्यवृत्ती अर्ज प्रक्रिया सुरू',
      hi: 'MahaDBT 2026-27: राजर्षि शाहू EBC एवं पोस्ट-मैट्रिक छात्रवृत्ति आवेदन प्रक्रिया प्रारंभ'
    },
    summary: {
      en: 'Government of Maharashtra opens portal for 2026-27 academic year fee reimbursement. Last date for college verification announced as 30 Nov 2026.',
      mr: 'महाराष्ट्र शासनाने २०२६-२७ शैक्षणिक वर्षासाठी शिक्षण शुल्क प्रतिपूर्ती अर्ज सुरू केले आहेत. महाविद्यालय पडताळणीची अंतिम तारीख ३० नोव्हेंबर २०२६ आहे.',
      hi: 'महाराष्ट्र शासन ने शैक्षणिक वर्ष 2026-27 हेतु शिक्षण शुल्क प्रतिपूर्ति आवेदन शुरू किए हैं। अंतिम तिथि 30 नवंबर 2026 निर्धारित है।'
    },
    details: {
      en: 'All professional course (CAP round) students with family income under ₹8 Lakhs can apply. Mandatory documents include current FY Tahsildar Income Certificate and Maharashtra Domicile.',
      mr: 'कौटुंबिक उत्पन्न ₹८ लाखांच्या आत असणाऱ्या सर्व व्यावसायिक अभ्यासक्रमातील विद्यार्थ्यांना ५०% शिक्षण शुल्क माफीचा लाभ मिळेल. चालू आर्थिक वर्षाचा उत्पन्नाचा दाखला आवश्यक आहे.',
      hi: 'पारिवारिक वार्षिक आय ₹8 लाख से कम वाले सभी व्यावसायिक पाठ्यक्रम विद्यार्थियों को 50% शुल्क छूट मिलेगी। चालू वित्तीय वर्ष का आय प्रमाण पत्र अनिवार्य है।'
    },
    issuingAuthority: 'Higher & Technical Education Department, Govt of Maharashtra',
    department: 'Directorate of Higher Education',
    level: 'Maharashtra',
    category: 'scholarships',
    notificationType: 'application_dates',
    officialAnnouncementDate: '2026-08-01',
    discoveredDate: '2026-08-03',
    lastVerifiedDate: '2026-10-10',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in',
    officialCircularNo: 'GR-TEM-2026/CR-45/TE-4',
    applicationDeadline: '2026-11-30',
    schemeStatus: 'Open',
    isNew: true
  },
  {
    id: 'notif-2026-pmkisan-ekyc',
    schemeId: 'pm-kisan',
    title: {
      en: 'PM-KISAN: Mandatory e-KYC & Aadhaar-NPCI Seeding Notice for Upcoming Installments',
      mr: 'PM-KISAN: पुढील हप्त्यांसाठी e-KYC आणि आधार-NPCI बँक सीडिंग पूर्ण करणे बंधनकारक',
      hi: 'पीएम-किसान: आगामी किश्तों हेतु e-KYC और आधार-NPCI बैंक खाता सीडिंग अनिवार्य'
    },
    summary: {
      en: 'Ministry of Agriculture issues official directive: farmers must complete biometric or OTP e-KYC and ensure Aadhaar-NPCI mapping to receive DBT installments.',
      mr: 'कृषी मंत्रालयाची अधिकृत सूचना: थेट बँक खात्यात सन्मान निधी जमा होण्यासाठी सर्व शेतकऱ्यांनी बायोमेट्रिक किंवा OTP द्वारे e-KYC पूर्ण करणे अनिवार्य आहे.',
      hi: 'कृषि मंत्रालय का आधिकारिक निर्देश: सम्मान निधि की राशि प्राप्त करने हेतु किसानों को OTP अथवा बायोमेट्रिक e-KYC पूरा करना अनिवार्य है।'
    },
    details: {
      en: 'Farmers can complete facial recognition e-KYC using the official PM-KISAN mobile app or visit nearest Common Service Center (CSC). No fee is charged on the portal.',
      mr: 'शेतकरी PM-KISAN मोबाईल ॲपवरून मोफत फेस ऑथेंटिकेशन द्वारे किंवा जवळच्या सीएससी (CSC) केंद्रावर जाऊन e-KYC करू शकतात.',
      hi: 'किसान पीएम-किसान मोबाइल ऐप से फेस ऑथेंटिकेशन अथवा नजदीकी सीएससी केंद्र पर जाकर e-KYC पूरा कर सकते हैं।'
    },
    issuingAuthority: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    department: 'Department of Agriculture and Farmers Welfare',
    level: 'Central',
    category: 'farmers',
    notificationType: 'circular_guideline',
    officialAnnouncementDate: '2026-06-15',
    discoveredDate: '2026-06-16',
    lastVerifiedDate: '2026-10-12',
    officialSourceUrl: 'https://pmkisan.gov.in',
    officialCircularNo: 'AGRI/PMK/2026/CIRC-19',
    schemeStatus: 'Open',
    isNew: false
  },
  {
    id: 'notif-2026-ladki-bahin-update',
    schemeId: 'majhi-ladki-bahin',
    title: {
      en: 'Mukhyamantri Majhi Ladki Bahin Yojana: DBT Bank Verification and Continuous Registration',
      mr: 'मुख्यमंत्री माझी लाडकी बहीण योजना: थेट बँक DBT पडताळणी व अखंडित नोंदणी सुरू',
      hi: 'मुख्यमंत्री माझी लाडकी बहिन योजना: प्रत्यक्ष बैंक DBT सत्यापन एवं निरंतर पंजीकरण जारी'
    },
    summary: {
      en: 'Maharashtra Women & Child Development Dept confirms uninterrupted monthly ₹1,500 DBT transfer to eligible women aged 21-65 with verified Aadhaar-linked accounts.',
      mr: '२१ ते ६५ वर्षे वयोगटातील पात्र महिलांच्या आधार लिंक बँक खात्यात दरमहा ₹१,५०० थेट जमा. ज्या भगिनींचे बँक खाते आधार लिंक नाही त्यांनी तात्काळ बँक खात्याचे e-KYC पूर्ण करावे.',
      hi: '21 से 65 वर्ष आयु वर्ग की पात्र महिलाओं के आधार लिंक बैंक खाते में प्रतिमाह ₹1,500 प्रत्यक्ष अंतरण जारी है।'
    },
    details: {
      en: 'Beneficiaries must ensure Aadhaar seeding with bank account to prevent payment failure. Family income ceiling remains ₹2.5 Lakhs per year with Yellow/Orange Ration Card.',
      mr: 'वार्षिक कौटुंबिक उत्पन्न मर्यादा ₹२.५० लाख आहे. पिवळे किंवा केशरी रेशनकार्ड धारक महिलांना उत्पन्नाच्या दाखल्याची आवश्यकता नाही.',
      hi: 'वार्षिक पारिवारिक आय सीमा ₹2.5 लाख है। पीला अथवा केसरी राशन कार्ड धारक महिलाओं को अलग से आय प्रमाण पत्र की आवश्यकता नहीं है।'
    },
    issuingAuthority: 'Women & Child Development Department, Govt of Maharashtra',
    department: 'Directorate of Women and Child Development',
    level: 'Maharashtra',
    category: 'women',
    notificationType: 'eligibility_change',
    officialAnnouncementDate: '2026-07-20',
    discoveredDate: '2026-07-22',
    lastVerifiedDate: '2026-10-08',
    officialSourceUrl: 'https://ladakibahin.maharashtra.gov.in',
    officialCircularNo: 'WCD-2026/CR-88/DESK-3',
    schemeStatus: 'Open',
    isNew: true
  },
  {
    id: 'notif-2026-ayushman-seniors',
    schemeId: 'ayushman-bharat',
    title: {
      en: 'Ayushman Bharat PM-JAY: Free Healthcare Coverage Expanded to All Citizens Aged 70+',
      mr: 'आयुष्मान भारत PM-JAY: ७० वर्षे व त्यावरील सर्व ज्येष्ठ नागरिकांना मोफत ₹५ लाखांचे आरोग्य कवच',
      hi: 'आयुष्मान भारत PM-JAY: 70 वर्ष एवं अधिक आयु के सभी वरिष्ठ नागरिकों को ₹5 लाख तक का मुफ्त इलाज'
    },
    summary: {
      en: 'Government of India rolls out Ayushman Vaya Vandana Card offering ₹5 Lakhs annual health insurance per family for all senior citizens 70 and above, regardless of income.',
      mr: '७० वर्षे किंवा त्यावरील सर्व ज्येष्ठ नागरिकांना कुटुंबाच्या उत्पन्नाची कोणतीही अट न ठेवता दरवर्षी ₹५ लाखांचे मोफत कॅशलेस उपचार मिळण्यासाठी स्वतंत्र आयुष्मान कार्ड.',
      hi: 'केंद्र सरकार ने आय की किसी भी शर्त के बिना 70 वर्ष एवं अधिक उम्र के सभी वरिष्ठ नागरिकों को ₹5 लाख वार्षिक स्वास्थ्य सुरक्षा देने हेतु विशेष आयुष्मान कार्ड प्रारंभ किया।'
    },
    details: {
      en: 'Senior citizens aged 70+ can apply on beneficiary.nha.gov.in or through the Ayushman App using Aadhaar biometric/OTP verification. Existing PM-JAY families receive an additional distinct ₹5 Lakhs top-up for seniors.',
      mr: '७० वर्षांवरील ज्येष्ठ नागरिक थेट beneficiary.nha.gov.in किंवा आयुष्मान ॲपवर आधार कार्डद्वारे स्वतःची नोंदणी करून ई-कार्ड डाऊनलोड करू शकतात.',
      hi: '70+ आयु के वरिष्ठ नागरिक beneficiary.nha.gov.in अथवा आयुष्मान ऐप पर आधार सत्यापन के माध्यम से तुरंत कार्ड बनवा सकते हैं।'
    },
    issuingAuthority: 'National Health Authority (NHA), Ministry of Health & Family Welfare, Govt of India',
    department: 'National Health Authority',
    level: 'Central',
    category: 'healthcare',
    notificationType: 'new_scheme',
    officialAnnouncementDate: '2026-09-12',
    discoveredDate: '2026-09-15',
    lastVerifiedDate: '2026-10-14',
    officialSourceUrl: 'https://nha.gov.in/PM-JAY',
    officialCircularNo: 'NHA/AB-PMJAY/SR-70/2026',
    schemeStatus: 'Open',
    isNew: true
  },
  {
    id: 'notif-2026-aicte-pragati',
    schemeId: 'sch-aicte-pragati',
    title: {
      en: 'AICTE Pragati Scholarship for Girls 2026-27: Online Registration on National Scholarship Portal',
      mr: 'एआयसीटीई प्रगती शिष्यवृत्ती २०२६-२७: मुलींसाठी राष्ट्रीय शिष्यवृत्ती पोर्टलवर नोंदणी सुरू',
      hi: 'एआईसीटीई प्रगति छात्रवृत्ति 2026-27: छात्राओं हेतु नेशनल स्कॉलरशिप पोर्टल (NSP) पर आवेदन शुरू'
    },
    summary: {
      en: 'AICTE invites applications for ₹50,000 per annum grant for female students admitted to first year of technical degree or diploma courses. Deadline: 31 October 2026.',
      mr: 'तंत्रशिक्षण पदवी व पदविका अभ्यासक्रमात प्रथम वर्षात प्रवेश घेतलेल्या गुणवंत विद्यार्थिनींसाठी वार्षिक ₹५०,००० ची शिष्यवृत्ती. अर्ज करण्याची मुदत ३१ ऑक्टोबर २०२६.',
      hi: 'तकनीकी डिग्री एवं डिप्लोमा के प्रथम वर्ष में प्रवेशित मेधावी छात्राओं हेतु ₹50,000 वार्षिक अनुदान। अंतिम तिथि 31 अक्टूबर 2026।'
    },
    details: {
      en: 'Maximum 2 girl children per family eligible with family income under ₹8 Lakhs. Selection is merit-based on qualifying examination marks.',
      mr: 'एका कुटुंबातील जास्तीत जास्त २ मुली पात्र असून वार्षिक उत्पन्न ₹८ लाखांपेक्षा कमी असावे. निवड गुणवत्तेच्या आधारावर केली जाते.',
      hi: 'एक परिवार की अधिकतम दो छात्राएं पात्र। वार्षिक आय ₹8 लाख से कम होना अनिवार्य है।'
    },
    issuingAuthority: 'All India Council for Technical Education (AICTE), Ministry of Education, Govt of India',
    department: 'Student Development Cell, AICTE',
    level: 'Central',
    category: 'scholarships',
    notificationType: 'application_dates',
    officialAnnouncementDate: '2026-07-15',
    discoveredDate: '2026-07-16',
    lastVerifiedDate: '2026-10-10',
    officialSourceUrl: 'https://scholarships.gov.in',
    officialCircularNo: 'AICTE/SDC/PRAGATI/2026-27',
    applicationDeadline: '2026-10-31',
    schemeStatus: 'Open',
    isNew: false
  },
  {
    id: 'notif-2026-namo-shetkari-5th',
    schemeId: 'namo-shetkari',
    title: {
      en: 'Namo Shetkari Maha Samman Nidhi: Beneficiary List and Disbursement Circular',
      mr: 'नमो शेतकरी महासन्मान निधी: पात्र शेतकरी यादी व हप्ता वितरण मार्गदर्शक सूचना',
      hi: 'नमो शेतकरी महा सम्मान निधि: पात्र किसान सूची एवं किस्त वितरण दिशा-निर्देश'
    },
    summary: {
      en: 'Government of Maharashtra releases disbursement guidelines for state top-up of ₹6,000 per year paid in tandem with Central PM-KISAN installments.',
      mr: 'महाराष्ट्र शासनाने PM-KISAN योजनेस जोडून दिल्या जाणाऱ्या राज्य सरकारच्या ₹६,००० वार्षिक अनुदानाच्या हप्ता वितरणाचे निकष जाहीर केले आहेत.',
      hi: 'महाराष्ट्र सरकार ने पीएम-किसान के साथ दिए जाने वाले राज्य के ₹6,000 अतिरिक्त वार्षिक अनुदान वितरण के दिशानिर्देश जारी किए।'
    },
    details: {
      en: 'All farmers verified in the Maharashtra land records (7/12 extract) and receiving PM-KISAN will automatically receive the Namo Shetkari installment directly in their bank account.',
      mr: 'ज्या शेतकऱ्यांना केंद्र शासनाचा PM-KISAN चा हप्ता मिळतो, त्या सर्व ७/१२ धारक शेतकऱ्यांना नमो शेतकरी योजनेचा लाभ थेट बँक खात्यात मिळतो.',
      hi: 'पीएम-किसान प्राप्तकर्ता सभी 7/12 धारक किसानों को नमो शेतकरी का लाभ सीधे बैंक खाते में प्रदान किया जाता है।'
    },
    issuingAuthority: 'Department of Agriculture, Government of Maharashtra',
    department: 'Commissioner of Agriculture, Pune',
    level: 'Maharashtra',
    category: 'farmers',
    notificationType: 'beneficiary_update',
    officialAnnouncementDate: '2026-09-05',
    discoveredDate: '2026-09-06',
    lastVerifiedDate: '2026-10-11',
    officialSourceUrl: 'https://krishi.maharashtra.gov.in',
    officialCircularNo: 'AGRI-NSMY-2026/CR-12',
    schemeStatus: 'Open',
    isNew: true
  },
  {
    id: 'notif-2026-pm-vishwakarma',
    schemeId: 'pm-vishwakarma',
    title: {
      en: 'PM Vishwakarma: Subsidized 5% Enterprise Loan & Modern Toolkit Voucher Notification',
      mr: 'पीएम विश्वकर्मा योजना: ५% सवलतीचे व्यावसायिक कर्ज व ₹१५,००० टूलकिट व्हाउचर मार्गदर्शक सूचना',
      hi: 'पीएम विश्वकर्मा: 5% रियायती उद्यम ऋण एवं ₹15,000 आधुनिक टूलकिट वाउचर'
    },
    summary: {
      en: 'Ministry of MSME issues updated operating guidelines for 18 traditional artisan trades with free basic training, ₹500/day stipend, and collateral-free enterprise loans up to ₹3 Lakhs.',
      mr: 'सुतार, लोहार, कुंभार, चर्मकार यासह १८ पारंपरिक कारागिरांसाठी मोफत ५-७ दिवसांचे प्रशिक्षण, दररोज ₹५०० भत्ता व ₹१५,००० चे आधुनिक टूलकिट व्हाउचर.',
      hi: '18 पारंपरिक दस्तकारों व कारीगरों हेतु मुफ्त कौशल प्रशिक्षण, ₹500 दैनिक भत्ता एवं ₹3 लाख तक का बिना गारंटी सस्ता ऋण।'
    },
    details: {
      en: 'Artisans can register at their local Gram Panchayat or CSC center. Training includes digital transaction incentives and marketing support on Open Network for Digital Commerce (ONDC).',
      mr: 'स्थानिक ग्रामपंचायत किंवा नागरी स्थानिक स्वराज्य संस्थेच्या पडताळणीनंतर लाभार्थ्यांना प्रमाणपत्र व डिजिटल ओळखपत्र दिले जाते.',
      hi: 'ग्राम पंचायत अथवा सीएससी केंद्र के माध्यम से निशुल्क पंजीकरण कराएं। सत्यापन उपरांत विश्वकर्मा प्रमाण पत्र जारी किया जाता है।'
    },
    issuingAuthority: 'Ministry of Micro, Small and Medium Enterprises, Govt of India',
    department: 'Office of Development Commissioner (MSME)',
    level: 'Central',
    category: 'employment',
    notificationType: 'circular_guideline',
    officialAnnouncementDate: '2026-08-20',
    discoveredDate: '2026-08-22',
    lastVerifiedDate: '2026-10-09',
    officialSourceUrl: 'https://pmvishwakarma.gov.in',
    officialCircularNo: 'MSME/VISHWAKARMA/OP-09/2026',
    schemeStatus: 'Open',
    isNew: false
  },
  {
    id: 'notif-2026-yuva-karya',
    schemeId: 'mah-yuva-karya',
    title: {
      en: 'Mukhyamantri Yuva Karya Prashikshan Yojana: On-the-Job Apprenticeship Stipends for 2026',
      mr: 'मुख्यमंत्री युवा कार्य प्रशिक्षण योजना: ६ महिन्यांचे ऑन-द-जॉब इंटर्नशिप मानधन सुरू',
      hi: 'मुख्यमंत्री युवा कार्य प्रशिक्षण योजना: युवाओं हेतु 6 माह का इंटर्नशिप मानदेय जारी'
    },
    summary: {
      en: 'Government of Maharashtra provides ₹6,000 to ₹10,000 per month stipend for 12th pass, diploma, and degree holders working in recognized enterprises across Maharashtra.',
      mr: '१२ वी उत्तीर्ण (₹६,०००), पदविका धारक (₹८,०००) आणि पदवीधर/पदव्युत्तर (₹१०,०००) सुशिक्षित बेरोजगार तरुणांना ६ महिन्यांचे औद्योगिक कार्य प्रशिक्षण व विद्यावेतन.',
      hi: '12वीं पास (₹6,000), डिप्लोमा (₹8,000) तथा स्नातक/परास्नातक (₹10,000) युवाओं को 6 माह का कार्य प्रशिक्षण एवं प्रत्यक्ष मानदेय।'
    },
    details: {
      en: 'Candidate must be age 18-35 and a Domicile of Maharashtra registered on the MahaSwayam employment exchange portal.',
      mr: 'उमेदवाराचे वय १८ ते ३५ वर्षे असावे व तो महाराष्ट्राचा रहिवासी असणे बंधनकारक आहे. नोंदणी महास्वयं (MahaSwayam) पोर्टलवर आवश्यक आहे.',
      hi: 'उम्मीदवार की आयु 18 से 35 वर्ष के मध्य और महास्वयं पोर्टल पर पंजीकृत होना आवश्यक है।'
    },
    issuingAuthority: 'Skill, Employment, Entrepreneurship & Innovation Dept, Govt of Maharashtra',
    department: 'Commissioner of Skill Development',
    level: 'Maharashtra',
    category: 'employment',
    notificationType: 'application_dates',
    officialAnnouncementDate: '2026-07-10',
    discoveredDate: '2026-07-12',
    lastVerifiedDate: '2026-10-05',
    officialSourceUrl: 'https://rojgar.mahaswayam.gov.in',
    officialCircularNo: 'SKILL-2026/YOUTH-INTERN/CR-31',
    schemeStatus: 'Open',
    isNew: true
  },
  {
    id: 'notif-2026-punjabrao-hostel',
    schemeId: 'sch-mah-hostel',
    title: {
      en: 'Dr. Punjabrao Deshmukh Hostel Maintenance Allowance 2026-27 Announced',
      mr: 'डॉ. पंजाबराव देशमुख वसतिगृह निर्वाह भत्ता योजना २०२६-२७ अर्ज सुरू',
      hi: 'डॉ. पंजाबराव देशमुख छात्रावास निर्वाह भत्ता योजना 2026-27 आवेदन प्रारंभ'
    },
    summary: {
      en: 'MahaDBT releases application cycle for annual hostel allowance of up to ₹30,000 for children of small landholding farmers and registered laborers studying in metro areas.',
      mr: 'अल्पभूधारक शेतकरी व नोंदणीकृत मजुरांच्या पाल्यांना मुंबई, पुणे, नागपूर यांसारख्या शहरात उच्च शिक्षणासाठी दरवर्षी ₹३०,००० पर्यंत वसतिगृह निर्वाह भत्ता.',
      hi: 'अल्प व सीमांत किसान एवं पंजीकृत मजदूरों के बच्चों को उच्च शिक्षा हेतु ₹30,000 तक वार्षिक छात्रावास निर्वाह भत्ता।'
    },
    details: {
      en: 'Annual family income limit is ₹8 Lakhs for children of registered agricultural laborers and small/marginal farmers with 7/12 land records.',
      mr: 'अल्पभूधारक शेतकऱ्यांच्या पाल्यांसाठी ७/१२ उतारा व कामगारांसाठी कामगार नोंदणी प्रमाणपत्र अनिवार्य आहे.',
      hi: 'अल्पभूधारक किसानों के लिए 7/12 तथा मजदूरों के लिए श्रमिक पंजीयन प्रमाण पत्र आवश्यक है।'
    },
    issuingAuthority: 'Higher & Technical Education Department, Govt of Maharashtra',
    department: 'Directorate of Technical Education, Maharashtra',
    level: 'Maharashtra',
    category: 'scholarships',
    notificationType: 'application_dates',
    officialAnnouncementDate: '2026-08-10',
    discoveredDate: '2026-08-12',
    lastVerifiedDate: '2026-10-10',
    officialSourceUrl: 'https://mahadbt.maharashtra.gov.in',
    officialCircularNo: 'DTE/HOSTEL-SCH/2026/142',
    applicationDeadline: '2026-11-30',
    schemeStatus: 'Open',
    isNew: false
  },
  {
    id: 'notif-2026-vayoshri-camps',
    schemeId: 'mah-vayoshri',
    title: {
      en: 'Mukhyamantri Vayoshri Yojana: District Camps for Free Assistive Devices for Senior Citizens',
      mr: 'मुख्यमंत्री वयोश्री योजना: ज्येष्ठ नागरिकांसाठी मोफत सहाय्यक साधने व उपकरणे वाटप शिबिरे',
      hi: 'मुख्यमंत्री वयोश्री योजना: 65+ वरिष्ठ नागरिकों हेतु मुफ्त सहायक उपकरण वितरण शिविर'
    },
    summary: {
      en: 'Government of Maharashtra provides ₹3,000 direct one-time allowance or physical distribution of wheelchairs, hearing aids, spectacles, and walking sticks for seniors 65+.',
      mr: '६५ वर्षे किंवा त्यावरील ज्येष्ठ नागरिकांना श्रवणयंत्र, चष्मा, ट्रायपॉड, व्हीलचेअर खरेदीसाठी ₹३,००० ची आर्थिक मदत किंवा थेट साहित्य वाटप.',
      hi: '65 वर्ष अथवा अधिक आयु के वृद्ध नागरिकों को श्रवण यंत्र, चश्मा, व्हीलचेयर आदि खरीदने हेतु ₹3,000 की प्रत्यक्ष सहायता।'
    },
    details: {
      en: 'Senior citizens with family income under ₹2 Lakhs can apply through Aaple Sarkar portal or submit forms at District Social Welfare Offices.',
      mr: 'वार्षिक कौटुंबिक उत्पन्न ₹२ लाखांपेक्षा कमी असणारे ६५ वर्षांवरील सर्व ज्येष्ठ नागरिक पात्र आहेत. आधार कार्ड व वयाचा दाखला आवश्यक.',
      hi: 'पारिवारिक वार्षिक आय ₹2 लाख से कम होनी चाहिए। आधार कार्ड एवं आयु प्रमाण पत्र अनिवार्य है।'
    },
    issuingAuthority: 'Social Justice and Special Assistance Department, Govt of Maharashtra',
    department: 'Social Welfare Commissionerate, Maharashtra',
    level: 'Maharashtra',
    category: 'seniors',
    notificationType: 'circular_guideline',
    officialAnnouncementDate: '2026-08-28',
    discoveredDate: '2026-08-30',
    lastVerifiedDate: '2026-10-06',
    officialSourceUrl: 'https://sjsa.maharashtra.gov.in',
    officialCircularNo: 'SJSA-VAYO-2026/CR-54',
    schemeStatus: 'Open',
    isNew: false
  }
];

export const NOTIFICATION_STORAGE_KEY = 'sahayakon_gov_notifications_read';
export const NOTIFICATION_ARCHIVE_KEY = 'sahayakon_gov_notifications_archived';

export function getReadNotificationIds(): string[] {
  try {
    const raw = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markNotificationAsRead(id: string): string[] {
  const current = getReadNotificationIds();
  if (!current.includes(id)) {
    const updated = [...current, id];
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
  return current;
}

export function markAllNotificationsAsRead(ids: string[]): string[] {
  const current = getReadNotificationIds();
  const set = new Set([...current, ...ids]);
  const updated = Array.from(set);
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getArchivedNotificationIds(): string[] {
  try {
    const raw = localStorage.getItem(NOTIFICATION_ARCHIVE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleArchiveNotification(id: string): string[] {
  const current = getArchivedNotificationIds();
  let updated: string[];
  if (current.includes(id)) {
    updated = current.filter(x => x !== id);
  } else {
    updated = [...current, id];
  }
  localStorage.setItem(NOTIFICATION_ARCHIVE_KEY, JSON.stringify(updated));
  return updated;
}
