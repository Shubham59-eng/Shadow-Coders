import type { ChatMessage, Language, Scholarship, StudentProfile } from '../types';
import { scholarshipsData } from '../data/scholarshipsData';
import { evaluateScholarshipEligibility } from './eligibilityService';

export interface AIResponsePayload {
  text: string;
  relatedSchemeIds: string[];
  relatedScholarshipIds?: string[];
  followUps: string[];
  isDemoResponse: boolean;
  sourceUrl?: string;
}

// Storage key for user-provided Gemini API key
const GEMINI_KEY_STORAGE = 'jansahayak_gemini_api_key';

export function getStoredApiKey(): string {
  return localStorage.getItem(GEMINI_KEY_STORAGE) || import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function setStoredApiKey(key: string): void {
  if (key) {
    localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
  }
}

/**
 * Speech Recognition Helper using Web Speech API
 */
export function createSpeechRecognizer(
  lang: Language,
  onTranscript: (transcript: string) => void,
  onError: (error: string) => void,
  onEnd: () => void
): { start: () => void; stop: () => void; isSupported: boolean } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return {
      start: () => onError('Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or text input.'),
      stop: () => {},
      isSupported: false,
    };
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  // Language code mapping
  if (lang === 'mr') recognition.lang = 'mr-IN';
  else if (lang === 'hi') recognition.lang = 'hi-IN';
  else recognition.lang = 'en-IN';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onTranscript(transcript);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    if (event.error === 'not-allowed') {
      onError('Microphone permission was denied. Please allow microphone access in your browser settings.');
    } else if (event.error === 'no-speech') {
      onError('No speech was detected. Please try speaking again.');
    } else {
      onError(`Voice error: ${event.error || 'Unable to capture audio'}.`);
    }
  };

  recognition.onend = () => {
    onEnd();
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (e) {
        console.warn('SpeechRecognition start error:', e);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {
        console.warn('SpeechRecognition stop error:', e);
      }
    },
    isSupported: true,
  };
}

/**
 * Text to speech helper
 */
export function playTextToSpeech(text: string, lang: Language): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  // Strip markdown formatting before speaking
  const clean = text.replace(/[*#_`]/g, '').slice(0, 300);
  const utterance = new SpeechSynthesisUtterance(clean);

  if (lang === 'mr') utterance.lang = 'mr-IN';
  else if (lang === 'hi') utterance.lang = 'hi-IN';
  else utterance.lang = 'en-IN';

  window.speechSynthesis.speak(utterance);
}

/**
 * Intelligent Scholarship Knowledge Engine:
 * Analyzes questions in Marathi, Hindi, and English and matches verified scholarships and schemes.
 */
function generateLocalKnowledgeResponse(
  query: string, 
  lang: Language, 
  profile?: StudentProfile | null
): AIResponsePayload {
  const q = query.toLowerCase().trim();

  // Keyword flags
  const isQualificationQuery = /qualify|eligible|पात्र|माझ्यासाठी|मेरे लिए|कोणत्या मिळू शकतात|कौन सी मिल सकती|eligible for/i.test(q);
  const isDeadlineQuery = /deadline|date|कधीपर्यंत|मुदत|तारिख|अंतिम तारीख|when is/i.test(q);
  const isDocQuery = /कागदपत्र|दस्तावेज|document|proof|दाखला|certificate|कागद/i.test(q);
  const isStepQuery = /अर्ज कसा|आवेदन कैसे|how to apply|स्टेप्स|steps|पायऱ्या|प्रक्रिया/i.test(q);
  
  // Specific scholarship lookups
  const isPragati = /pragati|प्रगती|girls engineering/i.test(q);
  const isShahu = /shahu|शाहू|ebc|fee waiver/i.test(q);
  const isHostel = /hostel|panjabrao|वसतिगृह|पंजाबराव/i.test(q);
  const isSC = /sc scholarship|अनुसूचित जाती|social justice/i.test(q);
  const isMinority = /minority|अल्पसंख्याक|muslim|buddhist|moma/i.test(q);
  const isReliance = /reliance|रिलायन्स/i.test(q);
  const isTata = /tata|टाटा/i.test(q);
  const isSaksham = /saksham|disability|दिव्यांग|सक्षम/i.test(q);

  let matchedScholarships: Scholarship[] = [];

  if (isPragati) {
    matchedScholarships = scholarshipsData.filter(s => s.id === 'aicte-pragati-scholarship');
  } else if (isShahu) {
    matchedScholarships = scholarshipsData.filter(s => s.id === 'rajarshi-shahu-ebc');
  } else if (isHostel) {
    matchedScholarships = scholarshipsData.filter(s => s.id === 'panjabrao-deshmukh-hostel-maharashtra');
  } else if (isSC) {
    matchedScholarships = scholarshipsData.filter(s => s.id === 'post-matric-sc-scholarship-maharashtra');
  } else if (isMinority) {
    matchedScholarships = scholarshipsData.filter(s => s.id === 'post-matric-minority-scholarship');
  } else if (isReliance) {
    matchedScholarships = scholarshipsData.filter(s => s.id === 'reliance-foundation-ug-scholarship');
  } else if (isTata) {
    matchedScholarships = scholarshipsData.filter(s => s.id === 'tata-trusts-higher-education-grant');
  } else if (isSaksham) {
    matchedScholarships = scholarshipsData.filter(s => s.id === 'aicte-saksham-scholarship');
  } else if (profile && isQualificationQuery) {
    // Rank based on student profile!
    const evaluated = scholarshipsData.map(s => ({
      scholarship: s,
      match: evaluateScholarshipEligibility(profile, s),
    }));
    const eligible = evaluated
      .filter(e => e.match.status === 'Eligible' || e.match.status === 'Possibly Eligible')
      .map(e => e.scholarship);

    matchedScholarships = eligible.length > 0 ? eligible : scholarshipsData.slice(0, 3);
  } else {
    // Search tags and title
    matchedScholarships = scholarshipsData.filter(s => {
      const sName = s.name || s.title || { en: s.id, mr: s.id, hi: s.id };
      return (
        (s.tags || []).some(t => q.includes(t.toLowerCase())) ||
        sName.en.toLowerCase().includes(q) ||
        sName.mr.includes(query) ||
        sName.hi.includes(query)
      );
    });
  }

  if (matchedScholarships.length === 0) {
    matchedScholarships = scholarshipsData.slice(0, 3);
  }

  // Generate localized response
  if (lang === 'mr') {
    return buildMarathiResponse(matchedScholarships, isDocQuery, isStepQuery, isDeadlineQuery, isQualificationQuery, profile);
  } else if (lang === 'hi') {
    return buildHindiResponse(matchedScholarships, isDocQuery, isStepQuery, isDeadlineQuery, isQualificationQuery, profile);
  } else {
    return buildEnglishResponse(matchedScholarships, isDocQuery, isStepQuery, isDeadlineQuery, isQualificationQuery, profile);
  }
}

function buildMarathiResponse(
  scholarships: Scholarship[],
  isDoc: boolean,
  isStep: boolean,
  isDeadline: boolean,
  isQualify: boolean,
  profile?: StudentProfile | null
): AIResponsePayload {
  const primary = scholarships[0];
  let text = '';

  if (isDeadline && primary) {
    text = `📅 **${primary.name.mr}** साठी अर्ज मुदतीचा तपशील:\n\n` +
      `• **अर्ज सुरू दिनांक:** ${primary.applicationOpeningDate || 'अधिकृत घोषणा लवकरच'}\n` +
      `• **अंतिम मुदत (Deadline):** ${primary.applicationDeadline || 'दिनांक अद्याप जाहीर झालेली नाही'}\n` +
      `• **सद्यस्थिती:** ${primary.status === 'Open' ? '🟢 सध्या अर्ज सुरू आहेत' : '🟡 लवकरच सुरू होणार'}\n\n` +
      `🌐 **अधिकृत संकेतस्थळ:** ${primary.officialUrl}\n*कृपया मुदतीपूर्वी आवश्यक कागदपत्रांसह अर्ज सादर करा.*`;
  } else if (isDoc && primary) {
    text = `📋 **${primary.name.mr}** साठी लागणारी आवश्यक कागदपत्रे:\n\n` +
      primary.requiredDocuments.mr.map(d => `• ${d}`).join('\n') +
      `\n\n💡 **टीप:** जात प्रमाणपत्र व उत्पन्न दाखला चालू आर्थिक वर्षाचा असावा.`;
  } else if (isStep && primary) {
    text = `📝 **${primary.name.mr}** साठी अर्ज करण्याची सोपी पद्धत:\n\n` +
      primary.applicationSteps.mr.join('\n') +
      `\n\n🌐 **अधिकृत अर्ज लिंक:** ${primary.officialUrl}`;
  } else if (isQualify && profile) {
    text = `🎯 **आपल्या प्रोफाइलनुसार (${profile.educationLevel}, प्रवर्ग: ${profile.socialCategory}, उत्पन्न: ₹${profile.familyIncome.toLocaleString('en-IN')}) खालील शिष्यवृत्ती उपलब्ध दिसतात:**\n\n`;
    scholarships.slice(0, 3).forEach((s, idx) => {
      text += `### ${idx + 1}. ${s.name.mr}\n`;
      text += `• **विभाग:** ${s.issuingOrganization}\n`;
      text += `• **मिळणारे साहाय्य:** ${s.benefits.mr[0]}\n`;
      text += `• **मुदत:** ${s.applicationDeadline || 'अंतिम मुदत लवकरच जाहीर होईल'}\n\n`;
    });
    text += `*टीप: अंतिम पात्रता पडताळणी संबंधित शासकीय विभागाद्वारे केली जाते.*`;
  } else {
    text = `नमस्कार! आपल्या प्रश्नानुसार खालील अधिकृत शासकीय व संस्थात्मक शिष्यवृत्ती आपल्यासाठी उपयुक्त ठरतील:\n\n`;
    scholarships.slice(0, 2).forEach((s, idx) => {
      text += `### ${idx + 1}. ${s.name.mr}\n`;
      text += `• **प्रकार:** ${s.type} (${s.level === 'Maharashtra' ? 'महाराष्ट्र शासन' : 'केंद्र सरकार'})\n`;
      text += `• **प्रमुख लाभ:** ${s.benefits.mr[0]}\n`;
      text += `• **पात्रता:** ${s.eligibilityCriteria.mr[0]}\n`;
      text += `• **अधिकृत पोर्टल:** ${s.officialUrl}\n\n`;
    });
    text += `📌 *सर्व माहिती National Scholarship Portal व MahaDBT वरून सत्यापित आहे.*`;
  }

  const followUps = [
    `या शिष्यवृत्तीसाठी आवश्यक कागदपत्रे कोणती आहेत?`,
    `अर्ज करण्याची अंतिम तारीख (Deadline) काय आहे?`,
    `माझ्या शैक्षणिक प्रवर्गासाठी इतर कोणती शिष्यवृत्ती आहे?`,
  ];

  return {
    text,
    relatedSchemeIds: [],
    relatedScholarshipIds: scholarships.slice(0, 3).map(s => s.id),
    followUps,
    isDemoResponse: true,
    sourceUrl: primary?.officialUrl || 'https://scholarships.gov.in',
  };
}

function buildHindiResponse(
  scholarships: Scholarship[],
  isDoc: boolean,
  isStep: boolean,
  isDeadline: boolean,
  isQualify: boolean,
  profile?: StudentProfile | null
): AIResponsePayload {
  const primary = scholarships[0];
  let text = '';

  if (isDeadline && primary) {
    text = `📅 **${primary.name.hi}** की समय-सीमा विवरण:\n\n` +
      `• **आवेदन प्रारंभ:** ${primary.applicationOpeningDate || 'शीघ्र घोषित'}\n` +
      `• **अंतिम तिथि (Deadline):** ${primary.applicationDeadline || 'तिथि घोषित नहीं'}\n` +
      `• **स्थिति:** ${primary.status === 'Open' ? '🟢 आवेदन खुले हैं' : '🟡 आगामी'}\n\n` +
      `🌐 **आधिकारिक पोर्टल:** ${primary.officialUrl}`;
  } else if (isDoc && primary) {
    text = `📋 **${primary.name.hi}** के लिए आवश्यक दस्तावेज:\n\n` +
      primary.requiredDocuments.hi.map(d => `• ${d}`).join('\n') +
      `\n\n💡 **सलाह:** समय पर आवेदन करने के लिए सभी प्रमाण पत्र पूर्व में तैयार रखें।`;
  } else if (isStep && primary) {
    text = `📝 **${primary.name.hi}** में आवेदन करने की चरणबद्ध प्रक्रिया:\n\n` +
      primary.applicationSteps.hi.join('\n') +
      `\n\n🌐 **आधिकारिक लिंक:** ${primary.officialUrl}`;
  } else if (isQualify && profile) {
    text = `🎯 **आपकी प्रोफाइल (${profile.educationLevel}, श्रेणी: ${profile.socialCategory}) के आधार पर प्रमुख छात्रवृत्तियां:**\n\n`;
    scholarships.slice(0, 3).forEach((s, idx) => {
      text += `### ${idx + 1}. ${s.name.hi}\n`;
      text += `• **संस्था:** ${s.issuingOrganization}\n`;
      text += `• **मुख्य लाभ:** ${s.benefits.hi[0]}\n`;
      text += `• **अंतिम तिथि:** ${s.applicationDeadline || 'घोषित नहीं'}\n\n`;
    });
  } else {
    text = `नमस्ते! आपके प्रश्न के अनुसार निम्नलिखित छात्रवृत्तियां उपयुक्त हैं:\n\n`;
    scholarships.slice(0, 2).forEach((s, idx) => {
      text += `### ${idx + 1}. ${s.name.hi}\n`;
      text += `• **प्रकार:** ${s.type}\n`;
      text += `• **लाभ:** ${s.benefits.hi[0]}\n`;
      text += `• **आधिकारिक पोर्टल:** ${s.officialUrl}\n\n`;
    });
  }

  const followUps = [
    `इस छात्रवृत्ति के लिए कौन से दस्तावेज लगेंगे?`,
    `ऑनलाइन आवेदन की अंतिम तिथि क्या है?`,
    `क्या मैं इस योजना के लिए पूर्णतः पात्र हूँ?`,
  ];

  return {
    text,
    relatedSchemeIds: [],
    relatedScholarshipIds: scholarships.slice(0, 3).map(s => s.id),
    followUps,
    isDemoResponse: true,
    sourceUrl: primary?.officialUrl || 'https://scholarships.gov.in',
  };
}

function buildEnglishResponse(
  scholarships: Scholarship[],
  isDoc: boolean,
  isStep: boolean,
  isDeadline: boolean,
  isQualify: boolean,
  profile?: StudentProfile | null
): AIResponsePayload {
  const primary = scholarships[0];
  let text = '';

  if (isDeadline && primary) {
    text = `📅 **Application Timeline for ${primary.name.en}:**\n\n` +
      `• **Opening Date:** ${primary.applicationOpeningDate || 'Official announcement pending'}\n` +
      `• **Submission Deadline:** ${primary.applicationDeadline || 'Date not announced yet'}\n` +
      `• **Current Status:** ${primary.status === 'Open' ? '🟢 Applications Currently Open' : '🟡 Upcoming'}\n\n` +
      `🌐 **Official Application Portal:** [${primary.officialUrl}](${primary.officialUrl})\n*Please ensure all documents are uploaded before the deadline.*`;
  } else if (isDoc && primary) {
    text = `📋 **Mandatory Documents Checklist for ${primary.name.en}:**\n\n` +
      primary.requiredDocuments.en.map(d => `• ${d}`).join('\n') +
      `\n\n💡 **Student Tip:** Income certificates and Caste Validity certificates must be issued by the competent Sub-Divisional Officer / Tehsildar.`;
  } else if (isStep && primary) {
    text = `📝 **Step-by-Step Application Roadmap for ${primary.name.en}:**\n\n` +
      primary.applicationSteps.en.join('\n') +
      `\n\n🌐 **Apply directly at:** [${primary.officialUrl}](${primary.officialUrl})\n*Always apply only on government domains (.gov.in / .nic.in).*`;
  } else if (isQualify && profile) {
    text = `🎯 **Based on your student profile (${profile.educationLevel}, Category: ${profile.socialCategory}, Income: ₹${profile.familyIncome.toLocaleString('en-IN')}), here are matching scholarship opportunities:**\n\n`;
    scholarships.slice(0, 3).forEach((s, idx) => {
      text += `### ${idx + 1}. ${s.name.en}\n`;
      text += `• **Issuing Authority:** ${s.issuingOrganization}\n`;
      text += `• **Key Benefit:** ${s.benefits.en[0]}\n`;
      text += `• **Official Deadline:** ${s.applicationDeadline || 'Date Not Announced'}\n\n`;
    });
    text += `*Note: Final eligibility and fund disbursal are strictly governed by the official scholarship authority.*`;
  } else {
    text = `Here are the verified scholarship programs matching your inquiry:\n\n`;
    scholarships.slice(0, 2).forEach((s, idx) => {
      text += `### ${idx + 1}. ${s.name.en}\n`;
      text += `• **Type:** ${s.type} (${s.level === 'Maharashtra' ? 'Govt of Maharashtra' : 'Govt of India'})\n`;
      text += `• **Financial Grant:** ${s.benefits.en[0]}\n`;
      text += `• **Eligibility Summary:** ${s.eligibilityCriteria.en[0]}\n`;
      text += `• **Official Portal:** ${s.officialUrl}\n\n`;
    });
    text += `📌 *Verified against official records from National Scholarship Portal (scholarships.gov.in) and MahaDBT.*`;
  }

  const followUps = [
    `What are the mandatory documents required to apply?`,
    `What is the deadline for this scholarship?`,
    `How do I check if my college is approved on the portal?`,
  ];

  return {
    text,
    relatedSchemeIds: [],
    relatedScholarshipIds: scholarships.slice(0, 3).map(s => s.id),
    followUps,
    isDemoResponse: true,
    sourceUrl: primary?.officialUrl || 'https://scholarships.gov.in',
  };
}

/**
 * Main AI Query Dispatcher:
 * Supports student voice or text queries.
 */
export async function sendChatMessage(
  query: string,
  lang: Language,
  conversationHistory: ChatMessage[] = [],
  profile?: StudentProfile | null
): Promise<AIResponsePayload> {
  const apiKey = getStoredApiKey();

  if (apiKey) {
    try {
      const response = await callGeminiApi(query, lang, apiKey, conversationHistory, profile);
      return response;
    } catch (err) {
      console.warn('Gemini API call failed, falling back to verified scholarship knowledge engine:', err);
      const fallback = generateLocalKnowledgeResponse(query, lang, profile);
      return {
        ...fallback,
        text: `${fallback.text}\n\n*(Served via verified scholarship database.)*`,
      };
    }
  }

  // Attempt backend server /api/chat if running
  try {
    const serverRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language: lang, profile }),
    });

    if (serverRes.ok) {
      const serverData = await serverRes.json();
      if (serverData.mode === 'live-gemini' && serverData.text) {
        const matched = scholarshipsData.filter(s => 
          serverData.text.toLowerCase().includes(s.id) ||
          (s.tags || []).some(t => serverData.text.toLowerCase().includes(t.toLowerCase()))
        ).slice(0, 3);

        return {
          text: serverData.text,
          relatedSchemeIds: [],
          relatedScholarshipIds: matched.map(s => s.id),
          followUps: serverData.followUps || [],
          isDemoResponse: false,
          sourceUrl: 'https://scholarships.gov.in',
        };
      }
    }
  } catch {
    // Backend offline; use local knowledge engine
  }

  return generateLocalKnowledgeResponse(query, lang, profile);
}

/**
 * Call Gemini 1.5 Flash API with student scholarship guidelines
 */
async function callGeminiApi(
  query: string,
  lang: Language,
  apiKey: string,
  _conversationHistory: ChatMessage[],
  profile?: StudentProfile | null
): Promise<AIResponsePayload> {
  const langName = lang === 'mr' ? 'Marathi (मराठी)' : lang === 'hi' ? 'Hindi (हिन्दी)' : 'English';

  const profileContext = profile && profile.consentGiven
    ? `STUDENT CONTEXT (With user consent): Course: ${profile.educationLevel} ${profile.currentCourse}, State: ${profile.state}, Category: ${profile.socialCategory}, Family Income: ₹${profile.familyIncome}.`
    : '';

  const systemInstruction = `You are "Sahayak AI", a compassionate and reliable scholarship assistant for Indian students.
CRITICAL SAFETY & OPERATIONAL RULES:
1. Always respond in the requested language: ${langName}.
2. Use simple, student-friendly terms.
3. NEVER ask the student for Aadhaar numbers, passwords, OTPs, or bank account credentials.
4. When asked about scholarships, explain:
   - Official name and issuing ministry/foundation
   - Benefits and financial amount
   - Eligibility criteria
   - Required documents
   - How to apply on official portals (NSP, MahaDBT, etc.)
   - Application deadline
5. State clearly that final approval is determined by the relevant government department or university authority.
6. Provide 2 short follow-up questions prefixed with "FOLLOWUP: ".
${profileContext}`;

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `[System Instruction: ${systemInstruction}]\n\nStudent Inquiry: ${query}`,
        },
      ],
    },
  ];

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 1000,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API Error HTTP ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  const lines = rawText.split('\n');
  const followUps: string[] = [];
  const cleanedLines: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith('FOLLOWUP:')) {
      followUps.push(line.replace('FOLLOWUP:', '').trim());
    } else {
      cleanedLines.push(line);
    }
  }

  const matchedScholarships = scholarshipsData.filter(s => 
    rawText.toLowerCase().includes(s.id) ||
    (s.tags || []).some(t => rawText.toLowerCase().includes(t.toLowerCase()))
  ).slice(0, 3);

  return {
    text: cleanedLines.join('\n').trim(),
    relatedSchemeIds: [],
    relatedScholarshipIds: matchedScholarships.map(s => s.id),
    followUps: followUps.length > 0 ? followUps : [
      lang === 'mr' ? 'कोणती कागदपत्रे लागतील?' : lang === 'hi' ? 'कौन से दस्तावेज लगेंगे?' : 'What documents are required to apply?',
      lang === 'mr' ? 'अंतिम मुदत (Deadline) काय आहे?' : lang === 'hi' ? 'आवेदन की अंतिम तारीख क्या है?' : 'What is the application deadline?'
    ],
    isDemoResponse: false,
    sourceUrl: 'https://scholarships.gov.in',
  };
}
