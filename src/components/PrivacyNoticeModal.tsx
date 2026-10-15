import React from 'react';
import { ShieldCheck, X, Lock } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../data/translations';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const t = translations[language].privacyNotice;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Tricolour Accent */}
        <div className="h-1.5 w-full flex">
          <div className="flex-1 bg-amber-500"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-emerald-600"></div>
        </div>

        <div className="p-5 sm:p-6 pb-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-900">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                {t.title}
              </h3>
              <p className="text-2xs text-slate-500 font-semibold">
                {t.updatedOn}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-[70vh] overflow-y-auto">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-semibold flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {language === 'mr' 
                ? 'महत्त्वाची हमी: जनसहायक AI कधीही तुमचा १२-अंकी आधार क्रमांक, बँक पासवर्ड किंवा OTP विचारत नाही.' 
                : language === 'hi' 
                ? 'प्रमुख सुरक्षा नियम: जनसहायक AI कभी भी आपका 12 अंकों का आधार नंबर, बैंक पासवर्ड या OTP नहीं मांगता है।' 
                : 'Zero-Credential Guarantee: JanSahayak AI will NEVER ask for your 12-digit Aadhaar, passwords, or OTP.'}
            </span>
          </div>

          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <p>{t.p3}</p>
          <p>{t.p4}</p>

          <div className="pt-2 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              {t.closeBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
