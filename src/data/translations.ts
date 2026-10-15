import type { Language, SchemeCategory } from '../types';

export interface TranslationSchema {
  appTitle: string;
  appSubtitle: string;
  tagline: string;
  nav: {
    home: string;
    schemes: string;
    categories: string;
    chat: string;
    saved: string;
    faqs: string;
    feedback: string;
    about: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titleHighlight: string;
    titlePart2: string;
    description: string;
    searchPlaceholder: string;
    searchBtn: string;
    quickTagsLabel: string;
    stats: {
      schemesCount: string;
      schemesLabel: string;
      languagesCount: string;
      languagesLabel: string;
      freeAccess: string;
      freeAccessLabel: string;
      officialVerified: string;
      officialVerifiedLabel: string;
    };
  };
  safetyBanner: {
    title: string;
    description: string;
    learnMore: string;
  };
  categories: {
    sectionTitle: string;
    sectionSubtitle: string;
    all: string;
    items: Record<SchemeCategory, { name: string; description: string }>;
  };
  schemesList: {
    sectionTitle: string;
    sectionSubtitle: string;
    filterCategory: string;
    filterLevel: string;
    filterAllLevels: string;
    filterCentral: string;
    filterMaharashtra: string;
    searchResultCount: (count: number) => string;
    noResultsTitle: string;
    noResultsDesc: string;
    resetFilters: string;
    viewDetails: string;
    bookmark: string;
    bookmarked: string;
    share: string;
    keyHighlightLabel: string;
    targetLabel: string;
    verifiedOn: string;
  };
  schemeDetail: {
    modalTitle: string;
    authorityLabel: string;
    levelLabel: string;
    verifiedBadge: string;
    verifiedOn: string;
    sourceLabel: string;
    overviewTab: string;
    benefitsTab: string;
    eligibilityTab: string;
    documentsTab: string;
    stepsTab: string;
    officialPortalBtn: string;
    officialDisclaimer: string;
    listenAudio: string;
    stopAudio: string;
    copied: string;
    copyDetails: string;
    shareScheme: string;
    documentChecklistNote: string;
  };
  chat: {
    title: string;
    subtitle: string;
    statusReady: string;
    statusThinking: string;
    inputPlaceholder: string;
    sendBtn: string;
    suggestedQuestionsLabel: string;
    clearChat: string;
    disclaimer: string;
    settingsBtn: string;
    knowledgeModeBadge: string;
    geminiLiveBadge: string;
    emptyChatHeading: string;
    emptyChatText: string;
    followUpHeading: string;
    relatedSchemesHeading: string;
    viewSchemeBtn: string;
    safetyWarning: string;
    apiKeyModalTitle: string;
    apiKeyModalDesc: string;
    apiKeyInputLabel: string;
    apiKeyInputPlaceholder: string;
    saveKeyBtn: string;
    clearKeyBtn: string;
    closeBtn: string;
    apiKeyActiveMsg: string;
  };
  savedSection: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDesc: string;
    exploreBtn: string;
    clearAll: string;
  };
  recentSection: {
    title: string;
    viewAll: string;
  };
  faqs: {
    title: string;
    subtitle: string;
    items: Array<{ question: string; answer: string }>;
  };
  feedback: {
    title: string;
    subtitle: string;
    ratingLabel: string;
    categoryLabel: string;
    categoryOptions: {
      general: string;
      schemeData: string;
      aiAccuracy: string;
      translation: string;
      suggestion: string;
    };
    commentLabel: string;
    commentPlaceholder: string;
    submitBtn: string;
    submitting: string;
    successMessage: string;
  };
  privacyNotice: {
    title: string;
    updatedOn: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    closeBtn: string;
  };
  footer: {
    aboutTitle: string;
    aboutText: string;
    officialPortalsTitle: string;
    emergencyHelplinesTitle: string;
    helplines: {
      nationalConsumer: string;
      kisanCallCenter: string;
      womenHelpline: string;
      elderLine: string;
    };
    disclaimer: string;
    rights: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  mr: {
    appTitle: "जनसहायक AI",
    appSubtitle: "बहुभाषिक शासकीय योजना सहाय्यक",
    tagline: "सर्व शासकीय योजनांची अचूक माहिती तुमच्या स्वतःच्या भाषेत",
    nav: {
      home: "मुख्यपृष्ठ",
      schemes: "सर्व योजना",
      categories: "विभाग",
      chat: "AI सहाय्यक",
      saved: "जतन केलेल्या योजना",
      faqs: "प्रश्नोत्तरे",
      feedback: "प्रतिक्रिया",
      about: "माहिती व सुरक्षा",
    },
    hero: {
      badge: "🇮🇳 भारत सरकार व महाराष्ट्र शासन योजनांसाठी अधिकृत मार्गदर्शक",
      titlePart1: "तुमच्या हक्काच्या",
      titleHighlight: "शासकीय योजना",
      titlePart2: "आता समजून घ्या सोप्या मराठीत",
      description: "शेतकरी, विद्यार्थी, महिला, ज्येष्ठ नागरिक आणि उद्योजकांसाठी केंद्र व राज्य शासनाच्या सर्व कल्याणकारी योजनांची पात्रता, कागदपत्रे व अर्ज प्रक्रिया AI च्या मदतीने सहज समजून घ्या.",
      searchPlaceholder: "योजनेचे नाव किंवा विषय शोधा (उदा. शिष्यवृत्ती, शेतकरी, लाडकी बहीण)...",
      searchBtn: "शोधा",
      quickTagsLabel: "लोकप्रिय शोध:",
      stats: {
        schemesCount: "१६+",
        schemesLabel: "सत्यापित मुख्य योजना",
        languagesCount: "३",
        languagesLabel: "भाषा पर्याय (मराठी, हिन्दी, Eng)",
        freeAccess: "१००%",
        freeAccessLabel: "विनामूल्य नागरिक सेवा",
        officialVerified: "अधिकृत",
        officialVerifiedLabel: "शासकीय संकेतस्थळांवरून प्रमाणित",
      },
    },
    safetyBanner: {
      title: "सुरक्षा आणि गोपनीयतेची हमी:",
      description: "जनसहायक AI कधीही तुमचा आधार क्रमांक, बँक खाते, पासवर्ड किंवा OTP विचारत नाही. अधिकृत सरकारी संकेतस्थळांवरच अर्ज करा.",
      learnMore: "सुरक्षा सूचना वाचा",
    },
    categories: {
      sectionTitle: "योजनांचे विभाग निवडा",
      sectionSubtitle: "तुमच्या गरजेनुसार योजनेचा वर्ग निवडून सविस्तर माहिती मिळवा",
      all: "सर्व विभाग",
      items: {
        students: {
          name: "विद्यार्थी आणि शिक्षण",
          description: "शाळा, महाविद्यालय व उच्च शिक्षणासाठी शिष्यवृत्ती आणि शुल्कमाफी",
        },
        farmers: {
          name: "शेतकरी आणि कृषी",
          description: "सन्मान निधी, पीक विमा, अवजारे अनुदान व हवामान साहाय्य",
        },
        women: {
          name: "महिला व बालकल्याण",
          description: "आर्थिक स्वावलंबन, लाडकी बहीण, मातृत्व पोषण व सुरक्षा योजना",
        },
        seniors: {
          name: "ज्येष्ठ नागरिक",
          description: "मासिक पेन्शन, आरोग्य सुरक्षा आणि ज्येष्ठ नागरिकांसाठी बचत योजना",
        },
        employment: {
          name: "रोजगार व कौशल्य विकास",
          description: "मुद्रा कर्ज, विश्वकर्मा योजना, उद्योग उभारणी व स्वयंरोजगार",
        },
        healthcare: {
          name: "आरोग्य आणि औषधोपचार",
          description: "आयुष्मान भारत, मोफत ५ लाखांपर्यंत उपचार व महात्मा जोतिराव फुले योजना",
        },
        financial: {
          name: "आर्थिक साहाय्य व गृहनिर्माण",
          description: "पंतप्रधान आवास योजना, थेट अनुदान व मासिक आधार",
        },
        scholarships: {
          name: "शिष्यवृत्ती पोर्टल",
          description: "उच्च व तंत्रशिक्षण, MahaDBT आणि केंद्र शासनाच्या शिष्यवृत्ती",
        },
        disability: {
          name: "दिव्यांग कल्याण",
          description: "दिव्यांग नागरिक, विशेष साहाय्य व स्वावलंबन योजना",
        },
      },
    },
    schemesList: {
      sectionTitle: "उपलब्ध शासकीय योजना",
      sectionSubtitle: "पात्रता निकष, आवश्यक कागदपत्रे आणि थेट अधिकृत अर्ज लिंक",
      filterCategory: "विभागानुसार वर्गवारी",
      filterLevel: "प्रशासन स्तर",
      filterAllLevels: "सर्व स्तर (केंद्र व राज्य)",
      filterCentral: "केंद्र शासन (भारत सरकार)",
      filterMaharashtra: "महाराष्ट्र शासन",
      searchResultCount: (count) => `${count} योजना सापडल्या`,
      noResultsTitle: "कोणतीही योजना सापडली नाही",
      noResultsDesc: "कृपया वेगळे शोध शब्द वापरा किंवा सर्व विभाग फिल्टर निवडा.",
      resetFilters: "फिल्टर रीसेट करा",
      viewDetails: "सविस्तर माहिती व कागदपत्रे",
      bookmark: "जतन करा",
      bookmarked: "जतन केले आहे",
      share: "माहिती शेअर करा",
      keyHighlightLabel: "प्रमुख लाभ:",
      targetLabel: "लाभार्थी वर्ग:",
      verifiedOn: "प्रमाणित दिनांक:",
    },
    schemeDetail: {
      modalTitle: "योजनेची सविस्तर माहिती",
      authorityLabel: "प्रशासकीय विभाग:",
      levelLabel: "शासन स्तर:",
      verifiedBadge: "शासकीय संकेतस्थळावरून सत्यापित",
      verifiedOn: "अंतिम पडताळणी दिनांक:",
      sourceLabel: "अधिकृत संदर्भ:",
      overviewTab: "योजना परिचय",
      benefitsTab: "मिळणारे लाभ",
      eligibilityTab: "पात्रता निकष",
      documentsTab: "आवश्यक कागदपत्रे",
      stepsTab: "अर्ज करण्याची पद्धत",
      officialPortalBtn: "अधिकृत संकेतस्थळावर अर्ज करा",
      officialDisclaimer: "टीप: अंतिम मंजुरी आणि पात्रता निकष संबंधित शासकीय विभागाच्या नियमांवर अवलंबून असतात. अर्जासाठी कधीही कोणाला लाच देऊ नका.",
      listenAudio: "मराठीत ऐका",
      stopAudio: "थांबवा",
      copied: "माहिती कॉपी झाली!",
      copyDetails: "योजना तपशील कॉपी करा",
      shareScheme: "शेअर करा",
      documentChecklistNote: "कागदपत्रांची पडताळणी करण्यासाठी खालील चौकटीवर खूण करा:",
    },
    chat: {
      title: "जनसहायक AI सहाय्यक",
      subtitle: "मराठी, हिंदी किंवा इंग्रजीत प्रश्न विचारा. आम्ही सोप्या शब्दांत उत्तर देऊ.",
      statusReady: "ऑनलाइन | मदतीस तयार",
      statusThinking: "माहिती शोधत आहे...",
      inputPlaceholder: "उदा. 'महाराष्ट्रात शेतकऱ्यांना कोणते अनुदान मिळते?' किंवा 'अभियांत्रिकी शिष्यवृत्ती'...",
      sendBtn: "पाठवा",
      suggestedQuestionsLabel: "काही लोकप्रिय प्रश्न विचारा:",
      clearChat: "चॅट साफ करा",
      disclaimer: "जनसहायक AI अधिकृत शासकीय पोर्टलवरील माहितीवर आधारित मार्गदर्शन करते. संवेदनशील माहिती देऊ नका.",
      settingsBtn: "AI सेटिंग्ज",
      knowledgeModeBadge: "✓ सत्यापित शासकीय नॉलेज मोड",
      geminiLiveBadge: "⚡ लाइव्ह जेमिनी AI कनेक्टेड",
      emptyChatHeading: "नमस्कार! मी आपला जनसहायक AI आहे.",
      emptyChatText: "तुम्हाला कोणत्या योजनेबद्दल माहिती हवी आहे? खालीलपैकी एका प्रश्नावर क्लिक करा किंवा स्वतःचा प्रश्न टाइप करा.",
      followUpHeading: "पुढील उपयुक्त प्रश्न:",
      relatedSchemesHeading: "संबंधित शासकीय योजना:",
      viewSchemeBtn: "योजना पहा",
      safetyWarning: "सुरक्षा सूचना: कृपया तुमचा आधार क्रमांक, फोन OTP, बँक पिन किंवा पासवर्ड येथे पाठवू नका.",
      apiKeyModalTitle: "Google Gemini AI API कॉन्फिगर करा",
      apiKeyModalDesc: "ॲप्लिकेशन बाय-डिफॉल्ट इन-बिल्ट स्मार्ट नॉलेज इंजिनवर चालते. जर तुम्हाला थेट Google Gemini API वापरायचे असेल तर तुमची API Key येथे प्रविष्ट करा.",
      apiKeyInputLabel: "Gemini API Key (पर्यायी):",
      apiKeyInputPlaceholder: "AIzaSy...",
      saveKeyBtn: "जतन करा",
      clearKeyBtn: "की हटवा (डिफॉल्ट मोड वापरा)",
      closeBtn: "बंद करा",
      apiKeyActiveMsg: "तुमची Gemini API Key सक्रिय आहे.",
    },
    savedSection: {
      title: "तुम्ही जतन केलेल्या योजना",
      subtitle: "तुमच्या पसंतीच्या योजना ऑफलाइन संदर्भासाठी येथे जतन राहतात",
      emptyTitle: "अजून कोणतीही योजना जतन केलेली नाही",
      emptyDesc: "कोणत्याही योजनेच्या कार्डवरील बुकमार्क (⭐) चिन्हावर क्लिक करून ती इथे जतन करा.",
      exploreBtn: "योजना शोधा",
      clearAll: "सर्व हटवा",
    },
    recentSection: {
      title: "अलीकडे पाहिलेल्या योजना",
      viewAll: "सर्व पहा",
    },
    faqs: {
      title: "नेहमी विचारले जाणारे प्रश्न (FAQ)",
      subtitle: "शासकीय योजना आणि अर्जांसंबंधी नागरिकांचे महत्त्वाचे प्रश्न",
      items: [
        {
          question: "जनसहायक AI वरील माहिती खरी व अधिकृत आहे का?",
          answer: "होय. जनसहायक AI मधील सर्व माहिती india.gov.in, myscheme.gov.in, mahadbt.maharashtra.gov.in, pmkisan.gov.in यांसारख्या अधिकृत शासकीय पोर्टलवरून पडताळलेली आहे. प्रत्येक योजनेसोबत अधिकृत संदर्भ व पडताळणी दिनांक दिलेला आहे.",
        },
        {
          question: "योजनेचा प्रत्यक्ष अर्ज जनसहायक ॲपवर करता येतो का?",
          answer: "नाही. जनसहायक हे केवळ मार्गदर्शन आणि सहाय्यक प्लॅटफॉर्म आहे. प्रत्यक्ष अर्ज करण्यासाठी आम्ही प्रत्येक योजनेच्या अधिकृत शासकीय संकेतस्थळाची थेट लिंक देतो, जिथे नागरिक थेट सुरक्षितपणे अर्ज करू शकतात.",
        },
        {
          question: "मला माझी लाडकी बहीण योजनेचा लाभ कसा मिळेल?",
          answer: "महाराष्ट्र शासनाच्या 'मुख्यमंत्री माझी लाडकी बहीण योजने' अंतर्गत २१ ते ६५ वयोगटातील पात्र महिलांना दरमहा ₹१,५०० मिळतात. यासाठी आधार लिंक बँक खाते, अधिवास प्रमाणपत्र (डोमिसाईल) किंवा १५ वर्षांचे रेशनकार्ड, आणि वार्षिक उत्पन्न २.५ लाखांपेक्षा कमी असणे आवश्यक आहे. अधिकृत नारीशक्ती दूत ॲप किंवा अधिकृत पोर्टलवर अर्ज करता येतो.",
        },
        {
          question: "अर्ज करण्यासाठी कोणतेही शुल्क किंवा पैसे द्यावे लागतात का?",
          answer: "नाही. जनसहायक AI ही नागरिकांसाठी पूर्णपणे विनामूल्य सेवा आहे. बहुतांश शासकीय योजनांचे ऑनलाईन अर्ज शासनाकडून विनामूल्य असतात. कोणत्याही मध्यस्थाला किंवा दलालाला पैसे देऊ नका.",
        },
        {
          question: "माझ्याकडे एखादे कागदपत्र नसेल तर मी काय करावे?",
          answer: "अनेक योजनांमध्ये पर्यायी कागदपत्रे ग्राह्य धरली जातात (उदा. डोमिसाईल ऐवजी शाळा सोडल्याचा दाखला किंवा रेशनकार्ड). तसेच आवश्यक प्रमाणपत्रे तुम्ही 'आपले सरकार' (aaplesarkar.mahaonline.gov.in) पोर्टलवरून ऑनलाईन काढू शकता.",
        },
      ],
    },
    feedback: {
      title: "नागरिक प्रतिक्रिया व सूचना",
      subtitle: "जनसहायक AI सेवा अधिक सुधारण्यासाठी आपले मत नोंदवा",
      ratingLabel: "आपला अनुभव कसा होता?",
      categoryLabel: "प्रतिक्रियेचा प्रकार:",
      categoryOptions: {
        general: "सर्वसाधारण अभिप्राय",
        schemeData: "योजनेची माहिती व अचूकता",
        aiAccuracy: "AI उत्तरांची गुणवत्ता",
        translation: "मराठी अनुवाद सुधारणा",
        suggestion: "नवीन योजनेची शिफारस",
      },
      commentLabel: "आपली प्रतिक्रिया / सूचना लिहा:",
      commentPlaceholder: "ॲप कसे वाटले किंवा काय सुधारणा हवी आहे ते येथे लिहा...",
      submitBtn: "प्रतिक्रिया पाठवा",
      submitting: "पाठवत आहे...",
      successMessage: "धन्यवाद! आपली मौल्यवान प्रतिक्रिया नोंदवली गेली आहे.",
    },
    privacyNotice: {
      title: "सुरक्षा व गोपनीयता धोरण (Privacy Policy)",
      updatedOn: "शेवटचे अपडेट: ऑक्टोबर २०२४",
      p1: "जनसहायक AI हे भारतीय नागरिकांच्या डिजिटल सक्षमीकरणासाठी आणि शासकीय योजनांची माहिती सुलभतेने पोहोचवण्यासाठी तयार केलेले एक विनामूल्य माहिती प्लॅटफॉर्म आहे.",
      p2: "आम्ही कधीही नागरिकांचे आधार क्रमांक, बँक खाते क्रमांक, डेबिट/क्रेडिट कार्ड तपशील, पासवर्ड किंवा OTP गोळा करत नाही. चॅटमध्ये अशी कोणतीही वैयक्तिक माहिती प्रविष्ट न करण्याचे आम्ही आवाहन करतो.",
      p3: "तुमच्या पसंतीच्या जतन केलेल्या योजना केवळ तुमच्या स्वतःच्या फोन किंवा संगणकाच्या लोकल स्टोरेज (Local Storage) मध्ये साठवल्या जातात. त्या कोणत्याही बाह्य सर्व्हरवर पाठवल्या जात नाहीत.",
      p4: "सर्व योजनांचे अंतिम नियम, अटी व लाभ संबंधित केंद्र किंवा राज्य शासकीय विभाग ठरवतो. अधिकृत माहितीसाठी नेहमी संबंधित सरकारी पोर्टल तपासावे.",
      closeBtn: "समजले, बंद करा",
    },
    footer: {
      aboutTitle: "जनसहायक AI बद्दल",
      aboutText: "सर्वसामान्य भारतीय नागरिकांना शासनाच्या कल्याणकारी योजनांची माहिती त्यांच्या मातृभाषेत मिळवून देणारा डिजिटल साथी. भारत सरकारच्या डिजिटल इंडिया मोहिमेस समर्पित.",
      officialPortalsTitle: "अधिकृत शासकीय संकेतस्थळे",
      emergencyHelplinesTitle: "महत्त्वाचे राष्ट्रीय हेल्पलाईन क्रमांक",
      helplines: {
        nationalConsumer: "राष्ट्रीय ग्राहक हेल्पलाईन: १९१५",
        kisanCallCenter: "किसान कॉल सेंटर (शेतकरी): १८००-१८०-१५५१",
        womenHelpline: "महिला हेल्पलाईन: १८१ / १०९१",
        elderLine: "ज्येष्ठ नागरिक हेल्पलाईन (Elderline): १४५६७",
      },
      disclaimer: "अस्वीकरण: जनसहायक AI ही एक स्वतंत्र सहाय्यक प्रणाली आहे. ती कोणत्याही शासकीय विभागाची अधिकृत प्रतिनिधी नाही. सर्व माहिती अधिकृत स्रोतांवरून संकलित केलेली आहे.",
      rights: "सर्व हक्क सुरक्षित. नागरिकांच्या हितासाठी समर्पित.",
    },
  },

  hi: {
    appTitle: "जनसहायक AI",
    appSubtitle: "बहुभाषी सरकारी योजना सहायक",
    tagline: "सभी सरकारी योजनाओं की सटीक जानकारी आपकी अपनी भाषा में",
    nav: {
      home: "मुख्य पृष्ठ",
      schemes: "सभी योजनाएं",
      categories: "श्रेणियां",
      chat: "AI सहायक",
      saved: "सहेजी गई योजनाएं",
      faqs: "प्रश्नोत्तरी",
      feedback: "प्रतिक्रिया",
      about: "सुरक्षा एवं नियम",
    },
    hero: {
      badge: "🇮🇳 भारत सरकार व राज्य योजनाओं के लिए प्रामाणिक मार्गदर्शक",
      titlePart1: "आपके अधिकार की",
      titleHighlight: "सरकारी योजनाएं",
      titlePart2: "अब समझें आसान हिन्दी में",
      description: "किसानों, छात्रों, महिलाओं, वरिष्ठ नागरिकों और उद्यमियों के लिए केंद्र व राज्य सरकारों की जनकल्याणकारी योजनाओं की पात्रता, जरूरी दस्तावेज और आवेदन प्रक्रिया AI की मदद से सरलता से समझें।",
      searchPlaceholder: "योजना का नाम या विषय खोजें (उदा. छात्रवृत्ति, किसान, लाडली बहना)...",
      searchBtn: "खोजें",
      quickTagsLabel: "लोकप्रिय खोजें:",
      stats: {
        schemesCount: "१६+",
        schemesLabel: "सत्यापित मुख्य योजनाएं",
        languagesCount: "३",
        languagesLabel: "भाषा विकल्प (मराठी, हिन्दी, Eng)",
        freeAccess: "१००%",
        freeAccessLabel: "निःशुल्क नागरिक सेवा",
        officialVerified: "प्रमाणित",
        officialVerifiedLabel: "सरकारी पोर्टलों से सत्यापित",
      },
    },
    safetyBanner: {
      title: "सुरक्षा और गोपनीयता की गारंटी:",
      description: "जनसहायक AI कभी भी आपका आधार नंबर, बैंक खाता विवरण, पासवर्ड या OTP नहीं मांगता है। आवेदन केवल आधिकारिक सरकारी पोर्टल पर ही करें।",
      learnMore: "सुरक्षा नियम पढ़ें",
    },
    categories: {
      sectionTitle: "योजनाओं की श्रेणियां चुनें",
      sectionSubtitle: "अपनी जरूरत के अनुसार वर्ग चुनकर योजनाओं का विस्तृत विवरण देखें",
      all: "सभी श्रेणियां",
      items: {
        students: {
          name: "छात्र एवं शिक्षा",
          description: "स्कूल, कॉलेज और उच्च शिक्षा के लिए छात्रवृत्ति और शुल्क प्रतिपूर्ति",
        },
        farmers: {
          name: "किसान एवं कृषि",
          description: "सम्मान निधि, फसल बीमा, कृषि उपकरण अनुदान और मौसम सहायता",
        },
        women: {
          name: "महिला एवं बाल विकास",
          description: "आर्थिक स्वावलंबन, मातृ वंदना, पोषण और लाडली बहना योजनाएं",
        },
        seniors: {
          name: "वरिष्ठ नागरिक",
          description: "मासिक पेंशन, स्वास्थ्य सुरक्षा और बुजुर्गों के लिए विशेष बचत योजनाएं",
        },
        employment: {
          name: "रोजगार व कौशल विकास",
          description: "मुद्रा ऋण, विश्वकर्मा योजना, उद्योग स्थापना और स्वरोजगार सहायता",
        },
        healthcare: {
          name: "स्वास्थ्य एवं चिकित्सा",
          description: "आयुष्मान भारत, ₹5 लाख तक कैशलेस उपचार और स्वास्थ्य सुरक्षा",
        },
        financial: {
          name: "वित्तीय सहायता एवं आवास",
          description: "प्रधानमंत्री आवास योजना, प्रत्यक्ष लाभ अंतरण और मासिक पेंशन",
        },
        scholarships: {
          name: "छात्रवृत्ति पोर्टल",
          description: "उच्च व तकनीकी शिक्षा, MahaDBT और केंद्र सरकार की छात्रवृत्तियां",
        },
        disability: {
          name: "दिव्यांग कल्याण",
          description: "दिव्यांग नागरिक, विशेष सहायता एवं स्वावलंबन योजनाएं",
        },
      },
    },
    schemesList: {
      sectionTitle: "उपलब्ध सरकारी योजनाएं",
      sectionSubtitle: "पात्रता शर्तें, आवश्यक दस्तावेज और सीधे आधिकारिक आवेदन लिंक",
      filterCategory: "श्रेणी के अनुसार",
      filterLevel: "प्रशासनिक स्तर",
      filterAllLevels: "सभी स्तर (केंद्र एवं राज्य)",
      filterCentral: "केंद्र सरकार (भारत सरकार)",
      filterMaharashtra: "महाराष्ट्र सरकार",
      searchResultCount: (count) => `${count} योजनाएं उपलब्ध`,
      noResultsTitle: "कोई योजना नहीं मिली",
      noResultsDesc: "कृपया अन्य कीवर्ड खोजें या श्रेणी फिल्टर रीसेट करें।",
      resetFilters: "फिल्टर रीसेट करें",
      viewDetails: "विस्तृत विवरण एवं दस्तावेज",
      bookmark: "सहेजें",
      bookmarked: "सहेजी गई",
      share: "साझा करें",
      keyHighlightLabel: "मुख्य लाभ:",
      targetLabel: "लाभार्थी वर्ग:",
      verifiedOn: "सत्यापित तिथि:",
    },
    schemeDetail: {
      modalTitle: "योजना का संपूर्ण विवरण",
      authorityLabel: "प्रशासनिक मंत्रालय:",
      levelLabel: "शासन स्तर:",
      verifiedBadge: "सरकारी पोर्टल से सत्यापित",
      verifiedOn: "अंतिम सत्यापन तिथि:",
      sourceLabel: "आधिकारिक स्रोत:",
      overviewTab: "योजना परिचय",
      benefitsTab: "प्राप्त लाभ",
      eligibilityTab: "पात्रता मानदंड",
      documentsTab: "जरूरी दस्तावेज",
      stepsTab: "आवेदन की प्रक्रिया",
      officialPortalBtn: "आधिकारिक पोर्टल पर आवेदन करें",
      officialDisclaimer: "नोट: अंतिम पात्रता और आवेदन की स्वीकृति संबंधित सरकारी विभाग द्वारा तय की जाती है। किसी भी बिचौलिए को पैसे न दें।",
      listenAudio: "हिन्दी में सुनें",
      stopAudio: "रोकें",
      copied: "विवरण कॉपी हो गया!",
      copyDetails: "योजना विवरण कॉपी करें",
      shareScheme: "साझा करें",
      documentChecklistNote: "दस्तावेजों की जांच करने के लिए बॉक्स पर टिक करें:",
    },
    chat: {
      title: "जनसहायक AI सहायक",
      subtitle: "हिन्दी, मराठी या अंग्रेजी में प्रश्न पूछें। हम सरल भाषा में सहायता करेंगे।",
      statusReady: "ऑनलाइन | सहायता के लिए तैयार",
      statusThinking: "जानकारी खोजी जा रही है...",
      inputPlaceholder: "उदा. 'किसानों के लिए कौन सी योजनाएं हैं?' या 'इंजीनियरिंग स्कॉलरशिप'...",
      sendBtn: "भेजें",
      suggestedQuestionsLabel: "लोकप्रिय प्रश्न पूछें:",
      clearChat: "चैट साफ करें",
      disclaimer: "जनसहायक AI आधिकारिक सरकारी पोर्टल पर आधारित जानकारी प्रदान करता है। संवेदनशील जानकारी साझा न करें।",
      settingsBtn: "AI सेटिंग्स",
      knowledgeModeBadge: "✓ सत्यापित सरकारी नॉलेज मोड",
      geminiLiveBadge: "⚡ लाइव जेमिनी AI कनेक्टेड",
      emptyChatHeading: "नमस्ते! मैं आपका जनसहायक AI हूँ।",
      emptyChatText: "आप किस सरकारी योजना के बारे में जानना चाहते हैं? नीचे दिए गए किसी प्रश्न पर क्लिक करें या अपना प्रश्न टाइप करें।",
      followUpHeading: "अगले उपयोगी प्रश्न:",
      relatedSchemesHeading: "संबंधित सरकारी योजनाएं:",
      viewSchemeBtn: "योजना देखें",
      safetyWarning: "सुरक्षा सूचना: कृपया अपना आधार नंबर, फोन OTP, बैंक पिन या पासवर्ड यहां न भेजें।",
      apiKeyModalTitle: "Google Gemini AI API कॉन्फ़िगर करें",
      apiKeyModalDesc: "यह एप्लिकेशन डिफ़ॉल्ट रूप से इन-बिल्ट स्मार्ट नॉलेज इंजन पर काम करता है। यदि आप सीधे Google Gemini API का उपयोग करना चाहते हैं तो अपनी API Key यहां दर्ज करें।",
      apiKeyInputLabel: "Gemini API Key (वैकल्पिक):",
      apiKeyInputPlaceholder: "AIzaSy...",
      saveKeyBtn: "सहेजें",
      clearKeyBtn: "की हटाएं (डिफ़ॉल्ट मोड प्रयोग करें)",
      closeBtn: "बंद करें",
      apiKeyActiveMsg: "आपकी Gemini API Key सक्रिय है।",
    },
    savedSection: {
      title: "आपकी सहेजी गई योजनाएं",
      subtitle: "आपकी पसंदीदा योजनाएं बाद में देखने के लिए यहां सुरक्षित हैं",
      emptyTitle: "अभी कोई योजना सहेजी नहीं गई है",
      emptyDesc: "किसी भी योजना के कार्ड पर स्टार (⭐) आइकन पर क्लिक करके उसे यहां सहेजें।",
      exploreBtn: "योजनाएं देखें",
      clearAll: "सभी हटाएं",
    },
    recentSection: {
      title: "हाल ही में देखी गई योजनाएं",
      viewAll: "सभी देखें",
    },
    faqs: {
      title: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
      subtitle: "सरकारी योजनाओं और आवेदन प्रक्रिया के संबंध में महत्वपूर्ण प्रश्न",
      items: [
        {
          question: "क्या जनसहायक AI पर दी गई जानकारी प्रामाणिक है?",
          answer: "हां। जनसहायक AI पर उपलब्ध सभी जानकारी india.gov.in, myscheme.gov.in, scholarships.gov.in जैसे आधिकारिक सरकारी पोर्टलों से सत्यापित की गई है। हर योजना के साथ स्रोत और सत्यापन की तिथि स्पष्ट रूप से दी गई है।",
        },
        {
          question: "क्या इस वेबसाइट से सीधे आवेदन किया जा सकता है?",
          answer: "नहीं। जनसहायक AI केवल नागरिकों के मार्गदर्शन और जानकारी के लिए है। आवेदन करने के लिए हम प्रत्येक योजना के आधिकारिक सरकारी पोर्टल का सीधा लिंक प्रदान करते हैं।",
        },
        {
          question: "इंजीनियरिंग छात्रों के लिए कौन सी छात्रवृत्तियां उपलब्ध हैं?",
          answer: "इंजीनियरिंग छात्रों के लिए एआईसीटीई प्रगति स्कॉलरशिप (छात्राओं के लिए ₹50,000/वर्ष), पीएम यशस्वी योजना, तथा महाराष्ट्र के छात्रों के लिए राजर्षि छत्रपति शाहू महाराज शिक्षण शुल्क छात्रवृत्ति योजना उपलब्ध है।",
        },
        {
          question: "क्या जनसहायक AI का उपयोग करने के लिए कोई शुल्क है?",
          answer: "नहीं। यह सेवा भारतीय नागरिकों के लिए पूर्णतः निःशुल्क है। किसी भी योजना के लिए बिचौलियों या एजेंटों को कोई शुल्क न दें।",
        },
        {
          question: "यदि मेरे पास कोई दस्तावेज नहीं है तो क्या करना चाहिए?",
          answer: "कई योजनाओं में वैकल्पिक दस्तावेज मान्य होते हैं। इसके अतिरिक्त आप आवश्यक प्रमाणपत्र सरकारी सेवा केंद्रों (सीएससी) या ई-डिस्ट्रिक्ट पोर्टल से बनवा सकते हैं।",
        },
      ],
    },
    feedback: {
      title: "नागरिक प्रतिक्रिया एवं सुझाव",
      subtitle: "जनसहायक AI को और अधिक उपयोगी बनाने के लिए अपने विचार साझा करें",
      ratingLabel: "आपका अनुभव कैसा रहा?",
      categoryLabel: "प्रतिक्रिया की श्रेणी:",
      categoryOptions: {
        general: "सामान्य प्रतिक्रिया",
        schemeData: "योजना की जानकारी एवं शुद्धता",
        aiAccuracy: "AI उत्तरों की गुणवत्ता",
        translation: "हिन्दी अनुवाद में सुधार",
        suggestion: "नई योजना का सुझाव",
      },
      commentLabel: "अपनी प्रतिक्रिया या सुझाव लिखें:",
      commentPlaceholder: "आपको ऐप कैसा लगा या हम इसमें क्या सुधार कर सकते हैं...",
      submitBtn: "प्रतिक्रिया भेजें",
      submitting: "भेजा जा रहा है...",
      successMessage: "धन्यवाद! आपका बहुमूल्य सुझाव सफलतापूर्वक दर्ज कर लिया गया है।",
    },
    privacyNotice: {
      title: "सुरक्षा एवं गोपनीयता नीति (Privacy Policy)",
      updatedOn: "अंतिम संशोधन: अक्टूबर 2024",
      p1: "जनसहायक AI भारतीय नागरिकों के डिजिटल सशक्तिकरण और सरकारी योजनाओं की सटीक जानकारी प्रदान करने के लिए बनाया गया एक निःशुल्क मंच है।",
      p2: "हम नागरिकों के आधार नंबर, बैंक खाते की जानकारी, पासवर्ड या OTP कभी एकत्रित नहीं करते हैं। कृपया चैट में कोई भी गोपनीय जानकारी साझा न करें।",
      p3: "आपकी सहेजी गई योजनाएं केवल आपके स्थानीय डिवाइस (ब्राउज़र स्टोरेज) में रहती हैं और किसी बाहरी सर्वर पर नहीं भेजी जाती हैं।",
      p4: "अंतिम पात्रता और लाभ वितरण संबंधित सरकारी मंत्रालय के नियमों के अनुसार होता है। आधिकारिक सत्यापन के लिए हमेशा संबंधित सरकारी पोर्टल देखें।",
      closeBtn: "समझ गया, बंद करें",
    },
    footer: {
      aboutTitle: "जनसहायक AI के बारे में",
      aboutText: "भारतीय नागरिकों को उनकी मातृभाषा में सरकारी योजनाओं की पारदर्शी जानकारी प्रदान करने वाला डिजिटल साथी। डिजिटल इंडिया विजन को समर्पित।",
      officialPortalsTitle: "आधिकारिक सरकारी पोर्टल",
      emergencyHelplinesTitle: "प्रमुख राष्ट्रीय हेल्पलाइन नंबर",
      helplines: {
        nationalConsumer: "राष्ट्रीय उपभोक्ता हेल्पलाइन: 1915",
        kisanCallCenter: "किसान कॉल सेंटर (कृषि): 1800-180-1551",
        womenHelpline: "महिला हेल्पलाइन: 181 / 1091",
        elderLine: "वरिष्ठ नागरिक हेल्पलाइन (Elderline): 14567",
      },
      disclaimer: "अस्वीकरण: जनसहायक AI एक स्वतंत्र सहायक प्रणाली है और किसी सरकारी निकाय की आधिकारिक प्रतिनिधि नहीं है। समस्त जानकारी आधिकारिक स्रोतों से संकलित है।",
      rights: "सर्वाधिकार सुरक्षित। नागरिक कल्याण के लिए समर्पित।",
    },
  },

  en: {
    appTitle: "JanSahayak AI",
    appSubtitle: "Multilingual Government Schemes Assistant",
    tagline: "Transparent and simple access to welfare schemes in your preferred language",
    nav: {
      home: "Home",
      schemes: "All Schemes",
      categories: "Categories",
      chat: "AI Assistant",
      saved: "Saved Schemes",
      faqs: "FAQs",
      feedback: "Feedback",
      about: "Safety & Privacy",
    },
    hero: {
      badge: "🇮🇳 Official Guide to Government of India & State Welfare Schemes",
      titlePart1: "Empowering Citizens with",
      titleHighlight: "Government Schemes",
      titlePart2: "Explained Simply in 3 Languages",
      description: "Understand eligibility, required documents, benefits, and step-by-step application procedures for farmers, students, women, seniors, and entrepreneurs in Marathi, Hindi, and English.",
      searchPlaceholder: "Search scheme by name or keyword (e.g., scholarship, farmer, PM-KISAN, health)...",
      searchBtn: "Search Schemes",
      quickTagsLabel: "Popular Searches:",
      stats: {
        schemesCount: "16+",
        schemesLabel: "Verified Core Schemes",
        languagesCount: "3",
        languagesLabel: "Languages (Marathi, Hindi, English)",
        freeAccess: "100%",
        freeAccessLabel: "Free Public Citizen Service",
        officialVerified: "Official",
        officialVerifiedLabel: "Verified from Govt Portals",
      },
    },
    safetyBanner: {
      title: "Citizen Security & Privacy Advisory:",
      description: "JanSahayak AI will NEVER ask for your Aadhaar number, OTP, bank account details, or passwords. Always submit official applications on verified government websites.",
      learnMore: "Read Privacy Policy",
    },
    categories: {
      sectionTitle: "Explore Schemes by Category",
      sectionSubtitle: "Find social welfare programs tailored for your specific life stage and family needs",
      all: "All Categories",
      items: {
        students: {
          name: "Students & Education",
          description: "Scholarships, fee waivers, laptops, and funding for school and college degrees",
        },
        farmers: {
          name: "Farmers & Agriculture",
          description: "PM-KISAN, crop insurance, fertilizer subsidy, drip irrigation, and credit cards",
        },
        women: {
          name: "Women & Child Care",
          description: "Majhi Ladki Bahin, PMMVY maternity benefits, Ujjwala, and self-help group loans",
        },
        seniors: {
          name: "Senior Citizens",
          description: "Monthly pensions, healthcare cover, and secure high-yield government savings",
        },
        employment: {
          name: "Employment & Skill Development",
          description: "MUDRA collateral-free loans, PM Vishwakarma, CMEGP, and apprentice stipends",
        },
        healthcare: {
          name: "Healthcare & Wellness",
          description: "Ayushman Bharat PM-JAY ₹5 Lakh cashless hospital cover and MJPJAY",
        },
        financial: {
          name: "Financial Assistance & Housing",
          description: "PM Awas Yojana affordable housing, direct benefit transfers, and APY pension",
        },
        scholarships: {
          name: "Scholarships Portal",
          description: "Higher education, technical, MahaDBT and central scholarships",
        },
        disability: {
          name: "Disability Welfare",
          description: "Divyangjan benefits, assistive aids, and special pensions",
        },
      },
    },
    schemesList: {
      sectionTitle: "Available Government Schemes",
      sectionSubtitle: "Clear eligibility checks, required documents checklists, and verified application portals",
      filterCategory: "Filter by Category",
      filterLevel: "Government Level",
      filterAllLevels: "All Levels (Central & State)",
      filterCentral: "Central Government",
      filterMaharashtra: "Maharashtra State",
      searchResultCount: (count) => `${count} schemes found`,
      noResultsTitle: "No Schemes Found",
      noResultsDesc: "Try adjusting your search keywords or resetting the filters.",
      resetFilters: "Reset Filters",
      viewDetails: "View Details & Checklist",
      bookmark: "Save",
      bookmarked: "Saved",
      share: "Share Scheme",
      keyHighlightLabel: "Key Benefit:",
      targetLabel: "Target Group:",
      verifiedOn: "Verified:",
    },
    schemeDetail: {
      modalTitle: "Complete Scheme Details",
      authorityLabel: "Issuing Authority:",
      levelLabel: "Jurisdiction:",
      verifiedBadge: "Verified against Official Government Portal",
      verifiedOn: "Last Verified On:",
      sourceLabel: "Official Source:",
      overviewTab: "Overview",
      benefitsTab: "Benefits",
      eligibilityTab: "Eligibility",
      documentsTab: "Documents",
      stepsTab: "How to Apply",
      officialPortalBtn: "Apply on Official Government Portal",
      officialDisclaimer: "Disclaimer: Final approval, eligibility criteria, and disbursement terms are solely determined by the respective government department. Never pay money to any middleman or unauthorized agency.",
      listenAudio: "Listen in English",
      stopAudio: "Stop Audio",
      copied: "Copied to clipboard!",
      copyDetails: "Copy Scheme Summary",
      shareScheme: "Share Scheme",
      documentChecklistNote: "Check off items as you gather them to verify your readiness:",
    },
    chat: {
      title: "JanSahayak AI Assistant",
      subtitle: "Ask in Marathi, Hindi, or English. We explain rules, benefits, and steps clearly.",
      statusReady: "Online | Ready to assist",
      statusThinking: "Searching verified databases...",
      inputPlaceholder: "E.g. 'Scholarships for engineering students' or 'Namo Shetkari Yojana in Maharashtra'...",
      sendBtn: "Send",
      suggestedQuestionsLabel: "Suggested Citizen Inquiries:",
      clearChat: "Clear Chat",
      disclaimer: "JanSahayak AI provides informational guidance based on verified government records. Never share sensitive details.",
      settingsBtn: "AI Settings",
      knowledgeModeBadge: "✓ Verified Govt Knowledge Mode",
      geminiLiveBadge: "⚡ Live Gemini AI Connected",
      emptyChatHeading: "Welcome to JanSahayak AI",
      emptyChatText: "I am your multilingual government schemes companion. Ask me any question about welfare programs or click a suggestion below.",
      followUpHeading: "Follow-up questions you might like to ask:",
      relatedSchemesHeading: "Relevant Government Schemes:",
      viewSchemeBtn: "View Scheme",
      safetyWarning: "Security Warning: Please never type your Aadhaar number, bank account, OTP, or passwords here.",
      apiKeyModalTitle: "Configure Google Gemini AI API",
      apiKeyModalDesc: "The application features a built-in multilingual knowledge engine that works completely offline/without an API key. If you wish to use live Google Gemini AI streaming, enter your API key below.",
      apiKeyInputLabel: "Gemini API Key (Optional):",
      apiKeyInputPlaceholder: "AIzaSy...",
      saveKeyBtn: "Save API Key",
      clearKeyBtn: "Clear Key (Use Default Mode)",
      closeBtn: "Close",
      apiKeyActiveMsg: "Your Gemini API Key is currently active.",
    },
    savedSection: {
      title: "Your Saved Schemes",
      subtitle: "Quickly access and compare schemes you bookmarked on your device",
      emptyTitle: "No saved schemes yet",
      emptyDesc: "Click the star (⭐) icon on any scheme card to save it here for quick reference.",
      exploreBtn: "Browse Schemes",
      clearAll: "Clear All",
    },
    recentSection: {
      title: "Recently Viewed Schemes",
      viewAll: "View All",
    },
    faqs: {
      title: "Frequently Asked Questions",
      subtitle: "Answers to common citizen questions about government portals and eligibility",
      items: [
        {
          question: "How reliable and up-to-date is the information on JanSahayak AI?",
          answer: "All scheme records are cross-referenced with official portals such as india.gov.in, myscheme.gov.in, scholarships.gov.in, and state portals. Each scheme profile visibly displays its issuing ministry, official source link, and verification date.",
        },
        {
          question: "Can I directly apply for schemes through JanSahayak AI?",
          answer: "No. JanSahayak AI is an informational assistant designed to educate and guide citizens. To ensure maximum security and prevent fraud, applications must be submitted directly through the verified official government portal links provided.",
        },
        {
          question: "Which scholarships are available for engineering students?",
          answer: "Key schemes include: 1) AICTE Pragati Scholarship for female engineering students (₹50,000/year); 2) PM YASASVI Scheme for OBC/EBC/DNT students; 3) Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna in Maharashtra (up to 50% fee reimbursement).",
        },
        {
          question: "Is there any charge to use JanSahayak AI?",
          answer: "JanSahayak AI is 100% free for all Indian citizens. We do not charge fees, nor should you pay any unauthorized agent for public welfare benefits.",
        },
        {
          question: "What should I do if I am missing a required document?",
          answer: "Many government schemes accept alternate proofs (such as Ration Card or School Leaving Certificate in place of Domicile). You can also apply for official certificates online via portals like Aaple Sarkar (Maharashtra) or state e-District portals.",
        },
      ],
    },
    feedback: {
      title: "Citizen Feedback & Suggestions",
      subtitle: "Help us improve JanSahayak AI for citizens across India",
      ratingLabel: "How satisfied are you with this assistant?",
      categoryLabel: "Feedback Category:",
      categoryOptions: {
        general: "General Feedback",
        schemeData: "Scheme Data & Accuracy",
        aiAccuracy: "AI Assistant Quality",
        translation: "Language & Translation",
        suggestion: "Suggest a New Scheme",
      },
      commentLabel: "Your Comments or Suggestions:",
      commentPlaceholder: "Tell us what you liked or how we can make this more helpful...",
      submitBtn: "Submit Feedback",
      submitting: "Submitting...",
      successMessage: "Thank you! Your feedback has been recorded.",
    },
    privacyNotice: {
      title: "Privacy Policy & Citizen Safety Notice",
      updatedOn: "Last Updated: October 2024",
      p1: "JanSahayak AI is a non-commercial, public interest technology project designed to assist Indian citizens in understanding public welfare initiatives in Marathi, Hindi, and English.",
      p2: "We maintain strict data privacy principles: We NEVER ask for, store, or process Aadhaar numbers, PAN cards, OTPs, bank account numbers, passwords, or payment credentials. Please never disclose such information.",
      p3: "Saved schemes and user preferences (such as selected language) are stored solely in your local browser storage and are never uploaded to any remote server.",
      p4: "Final eligibility, document verification, and disbursal approvals rest exclusively with the designated government authorities. Please verify all details on the respective government portals linked on this site.",
      closeBtn: "Understood & Close",
    },
    footer: {
      aboutTitle: "About JanSahayak AI",
      aboutText: "An AI-powered multilingual assistant empowering Indian citizens with clear, transparent, and accessible knowledge about government schemes. Committed to Digital India.",
      officialPortalsTitle: "Official National Portals",
      emergencyHelplinesTitle: "Important National Citizen Helplines",
      helplines: {
        nationalConsumer: "National Consumer Helpline: 1915",
        kisanCallCenter: "Kisan Call Center (Agriculture): 1800-180-1551",
        womenHelpline: "Women in Distress Helpline: 181 / 1091",
        elderLine: "National Helpline for Senior Citizens: 14567",
      },
      disclaimer: "Disclaimer: JanSahayak AI is an independent citizen assistance portal. It is not an official government entity. All scheme trademarks and portal links belong to their respective authorities.",
      rights: "Dedicated to the citizens of India. Built for public good.",
    },
  },
};
