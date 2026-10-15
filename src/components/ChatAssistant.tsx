import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  RotateCcw, 
  Settings, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ShieldAlert, 
  ChevronRight,
  KeyRound,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Mic,
  MicOff
} from 'lucide-react';
import type { ChatMessage, Language, Scheme } from '../types';
import { translations } from '../data/translations';
import { sendChatMessage, getStoredApiKey, setStoredApiKey, createSpeechRecognizer } from '../services/aiService';
import { schemesData } from '../data/schemesData';

interface ChatAssistantProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onOpenSchemeDetail: (scheme: Scheme) => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  language,
  isOpen,
  onClose,
  onOpenSchemeDetail,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [activeApiKey, setActiveApiKey] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [safetyAlert, setSafetyAlert] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognizerRef = useRef<ReturnType<typeof createSpeechRecognizer> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[language].chat;

  useEffect(() => {
    const key = getStoredApiKey();
    setActiveApiKey(key);
    setApiKeyInput(key);
  }, [isApiKeyModalOpen]);

  // Load chat history from localStorage or set initial message
  useEffect(() => {
    const savedChat = localStorage.getItem('jansahayak_chat_history');
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch {
        initializeWelcomeMessage();
      }
    } else {
      initializeWelcomeMessage();
    }
  }, [language]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('jansahayak_chat_history', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeWelcomeMessage = () => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome-1',
      sender: 'assistant',
      text: language === 'mr'
        ? `🙏 **नमस्कार! मी आपला जनसहायक AI आहे.**\n\nमी आपल्याला केंद्र व महाराष्ट्र शासनाच्या सर्व कल्याणकारी योजनांची माहिती समजून घेण्यास मदत करतो. आपण खालील विषयांवर मला प्रश्न विचारू शकता:\n• शेतकऱ्यांसाठी योजना (PM-KISAN, नमो शेतकरी, पीक विमा)\n• विद्यार्थ्यांसाठी शिष्यवृत्ती (अभियांत्रिकी, PM YASASVI, राजर्षी शाहू)\n• महिलांसाठी योजना (माझी लाडकी बहीण, मातृ वंदना)\n• मोफत आरोग्य उपचार व आयुष्मान भारत कार्ड`
        : language === 'hi'
        ? `🙏 **नमस्ते! मैं आपका जनसहायक AI हूँ।**\n\nमैं आपको केंद्र एवं राज्य सरकारों की सभी कल्याणकारी योजनाओं की सटीक जानकारी प्रदान करने में सहायता करता हूँ। आप मुझसे पूछ सकते हैं:\n• किसानों के लिए योजनाएं (पीएम-किसान, फसल बीमा)\n• छात्रवृत्तियां (इंजीनियरिंग, यशस्वी योजना, एआईसीटीई प्रगति)\n• महिलाओं के लिए योजनाएं (लाडली बहना, मातृ वंदना)\n• ₹5 लाख तक का कैशलेस इलाज (आयुष्मान भारत)`
        : `🙏 **Welcome! I am JanSahayak AI.**\n\nI am your multilingual government welfare scheme assistant. You can ask me questions about:\n• Agricultural & Farmer subsidies (PM-KISAN, Namo Shetkari, Crop Insurance)\n• Merit scholarships for students (Engineering, AICTE Pragati, PM YASASVI)\n• Women welfare (Majhi Ladki Bahin ₹1,500/mo, PMMVY)\n• Cashless Healthcare (Ayushman Bharat ₹5 Lakh coverage)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
      followUps: [
        language === 'mr' ? 'महाराष्ट्रातील शेतकऱ्यांसाठी कोणत्या योजना आहेत?' : language === 'hi' ? 'किसानों के लिए प्रमुख योजनाएं कौन सी हैं?' : 'Which scholarships are available for engineering students?',
        language === 'mr' ? 'माझी लाडकी बहीण योजनेची माहिती द्या.' : language === 'hi' ? 'महिलाओं के लिए वित्तीय सहायता योजना बताएं।' : 'What are the benefits of PM-KISAN scheme?',
        language === 'mr' ? 'अभियांत्रिकी विद्यार्थ्यांसाठी कोणती शिष्यवृत्ती आहे?' : language === 'hi' ? 'इंजीनियरिंग छात्रों के लिए कौन सी छात्रवृत्ति है?' : 'What documents are required to apply for a scholarship?'
      ],
      isDemoResponse: true,
    };
    setMessages([welcomeMsg]);
  };

  const validateUserInput = (query: string): boolean => {
    // Check for 12-digit Aadhaar number
    const aadhaarPattern = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
    if (aadhaarPattern.test(query)) {
      setSafetyAlert(
        language === 'mr'
          ? 'सुरक्षा सूचना: कृपया तुमचा १२ अंकी आधार क्रमांक किंवा बँक तपशील येथे टाकू नका. जनसहायक AI कधीही संवेदनशील माहिती मागत नाही.'
          : language === 'hi'
          ? 'सुरक्षा चेतावनी: कृपया अपना 12 अंकों का आधार नंबर या बैंक विवरण यहां दर्ज न करें। जनसहायक AI कभी भी गोपनीय जानकारी नहीं मांगता है।'
          : 'Security Advisory: Please do not enter 12-digit Aadhaar numbers or personal banking information. JanSahayak AI never asks for sensitive credentials.'
      );
      return false;
    }
    setSafetyAlert(null);
    return true;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText.trim();
    if (!query) return;

    if (!validateUserInput(query)) {
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responsePayload = await sendChatMessage(query, language, messages);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: responsePayload.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
        relatedSchemeIds: responsePayload.relatedSchemeIds,
        followUps: responsePayload.followUps,
        isDemoResponse: responsePayload.isDemoResponse,
        sourceUrl: responsePayload.sourceUrl,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text: language === 'mr'
          ? 'माफ करा, उत्तर शोधण्यात अडचण आली. कृपया पुन्हा प्रयत्न करा.'
          : language === 'hi'
          ? 'क्षमा करें, उत्तर प्राप्त करने में समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Sorry, I encountered an issue retrieving that answer. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    localStorage.removeItem('jansahayak_chat_history');
    initializeWelcomeMessage();
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeech = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean text for speech
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (language === 'mr') utterance.lang = 'mr-IN';
    else if (language === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
    setSpeakingId(msgId);
  };

  const handleSaveApiKey = () => {
    setStoredApiKey(apiKeyInput);
    setActiveApiKey(apiKeyInput.trim());
    setIsApiKeyModalOpen(false);
  };

  const handleClearApiKey = () => {
    setStoredApiKey('');
    setActiveApiKey('');
    setApiKeyInput('');
    setIsApiKeyModalOpen(false);
  };

  const handleToggleVoiceInput = () => {
    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      language,
      (transcript) => {
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      },
      (error) => {
        console.warn('Voice error:', error);
        setSafetyAlert(error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    recognizerRef.current = recognizer;
    if (recognizer.isSupported) {
      setIsListening(true);
      recognizer.start();
    } else {
      setSafetyAlert(
        language === 'mr'
          ? 'तुमच्या ब्राऊझरमध्ये व्हॉइस इनपुट उपलब्ध नाही. कृपया गुगल क्रोम वापरा.'
          : language === 'hi'
          ? 'आपके ब्राउज़र में वॉयस इनपुट समर्थित नहीं है। कृपया गूगल क्रोम का उपयोग करें।'
          : 'Voice input is not supported in this browser. Please use Google Chrome or Edge.'
      );
    }
  };

  // Cleanup speech recognizer on unmount
  useEffect(() => {
    return () => {
      recognizerRef.current?.stop();
    };
  }, []);

  const promptPills = [
    language === 'mr' ? 'महाराष्ट्रातील शेतकऱ्यांसाठी कोणत्या योजना आहेत?' : language === 'hi' ? 'किसानों के लिए प्रमुख योजनाएं बताएं' : 'Which scholarships are available for engineering students?',
    language === 'mr' ? 'माझी लाडकी बहीण योजनेची पात्रता काय?' : language === 'hi' ? 'लाडली बहना योजना के लिए कौन पात्र है?' : 'What are the benefits of PM-KISAN?',
    language === 'mr' ? 'अभियांत्रिकी विद्यार्थ्यांसाठी शिष्यवृत्ती' : language === 'hi' ? 'इंजीनियरिंग छात्रों के लिए छात्रवृत्ति' : 'How to apply for Majhi Ladki Bahin Yojana?',
    language === 'mr' ? 'आरोग्य उपचारांसाठी कोणती योजना आहे?' : language === 'hi' ? 'आयुष्मान भारत कार्ड कैसे बनवाएं?' : 'What documents are required to apply for a scholarship?'
  ];

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200`}>
      <div 
        className={`bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ${
          isFullScreen ? 'w-full h-full max-w-none rounded-none' : 'w-full max-w-3xl h-[88vh]'
        }`}
      >
        {/* Chat Tricolour Header Accent */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-amber-500"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-emerald-600"></div>
        </div>

        {/* Chat Navigation Bar */}
        <div className="p-4 sm:p-5 pb-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5 text-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                  {t.title}
                </h3>
                <span className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${
                  activeApiKey 
                    ? 'bg-purple-50 text-purple-800 border-purple-200' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  {activeApiKey ? t.geminiLiveBadge : t.knowledgeModeBadge}
                </span>
              </div>
              <p className="text-2xs text-slate-500 font-medium hidden sm:block">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              title={t.settingsBtn}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearChat}
              title={t.clearChat}
              className="p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              title={isFullScreen ? 'Minimize' : 'Full Screen'}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer hidden sm:block"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              title="Close chat"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Safety Alert Banner */}
        {safetyAlert && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2.5 flex items-start gap-2.5 text-xs text-red-900 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{safetyAlert}</div>
            <button onClick={() => setSafetyAlert(null)} className="text-red-700 hover:text-red-900 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const matchedSchemes = (msg.relatedSchemeIds || [])
              .map(id => schemesData.find(s => s.id === id))
              .filter((s): s is Scheme => Boolean(s));

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4 text-amber-400" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-900 text-white font-medium rounded-br-xs shadow-md shadow-blue-900/10'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>

                    {/* Timestamp & Actions */}
                    <div className={`mt-2 pt-2 border-t flex items-center justify-between text-2xs ${
                      isUser ? 'border-blue-800 text-blue-200' : 'border-slate-100 text-slate-400'
                    }`}>
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleSpeech(msg.id, msg.text)}
                            title="Listen"
                            className="p-1 hover:text-amber-600 transition-colors cursor-pointer"
                          >
                            {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            title="Copy response"
                            className="p-1 hover:text-blue-900 transition-colors cursor-pointer"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Embedded Related Scheme Cards */}
                  {!isUser && matchedSchemes.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="text-2xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{t.relatedSchemesHeading}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {matchedSchemes.map((scheme) => (
                          <div
                            key={scheme.id}
                            onClick={() => onOpenSchemeDetail(scheme)}
                            className="p-3 rounded-xl bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs group"
                          >
                            <div className="truncate">
                              <div className="font-bold text-xs text-slate-900 group-hover:text-blue-900 truncate">
                                {scheme.title[language]}
                              </div>
                              {scheme.keyHighlight && (
                                <div className="text-2xs text-emerald-700 font-medium truncate mt-0.5">
                                  {scheme.keyHighlight[language]}
                                </div>
                              )}
                            </div>
                            <button className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 group-hover:bg-blue-900 group-hover:text-white text-2xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer">
                              <span>{t.viewSchemeBtn}</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up question chips */}
                  {!isUser && msg.followUps && msg.followUps.length > 0 && (
                    <div className="pt-2">
                      <div className="text-2xs font-semibold text-slate-400 mb-1.5">
                        {t.followUpHeading}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUps.map((question, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(question)}
                            className="text-xs text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs"
                          >
                            💬 {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Thinking / Loading Animation */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-amber-400" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs border border-slate-200 shadow-xs flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                <span>{t.statusThinking}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips (above input) */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5 shrink-0">
          <span className="text-2xs font-bold text-slate-400 uppercase tracking-wide mr-1 shrink-0">
            {t.suggestedQuestionsLabel}
          </span>
          {promptPills.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-2xs font-medium px-2.5 py-1 rounded-full bg-white hover:bg-amber-100 hover:text-amber-900 border border-slate-200 hover:border-amber-300 transition-colors shrink-0 cursor-pointer text-slate-600"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0"
        >
          {isListening && (
            <div className="mb-2 p-2 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs text-amber-900 animate-pulse">
              <span className="flex items-center gap-2 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                {language === 'mr' ? 'ऐकत आहे... कृपया बोला' : language === 'hi' ? 'सुन रहा हूँ... कृपया बोलें' : 'Listening... Please speak now'}
              </span>
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className="text-2xs font-bold text-amber-800 underline hover:text-amber-950"
              >
                Stop
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-300 focus-within:border-blue-900 focus-within:bg-white transition-all shadow-2xs">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? (language === 'mr' ? 'ऐकत आहे...' : language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...') : t.inputPlaceholder}
              disabled={isLoading}
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden disabled:opacity-50"
            />
            {/* Voice Input Microphone Button */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              disabled={isLoading}
              title={isListening ? 'Stop Listening' : 'Voice Input (Web Speech API)'}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-bounce shadow-md shadow-rose-600/30 ring-2 ring-rose-400'
                  : 'bg-slate-200 hover:bg-amber-100 text-slate-700 hover:text-amber-800'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 text-center">
            <span className="text-2xs text-slate-400 font-medium">
              🔒 {t.safetyWarning}
            </span>
          </div>
        </form>

        {/* Gemini API Key Configuration Modal */}
        {isApiKeyModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-purple-600" />
                  <h4 className="font-extrabold text-base text-slate-900">
                    {t.apiKeyModalTitle}
                  </h4>
                </div>
                <button
                  onClick={() => setIsApiKeyModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {t.apiKeyModalDesc}
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.apiKeyInputLabel}
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder={t.apiKeyInputPlaceholder}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-purple-600 focus:outline-hidden"
                />
              </div>

              {activeApiKey && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t.apiKeyActiveMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                {activeApiKey ? (
                  <button
                    type="button"
                    onClick={handleClearApiKey}
                    className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    {t.clearKeyBtn}
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsApiKeyModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    {t.closeBtn}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveApiKey}
                    className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg cursor-pointer shadow-xs"
                  >
                    {t.saveKeyBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
