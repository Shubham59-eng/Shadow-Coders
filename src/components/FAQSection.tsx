import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../data/translations';

interface FAQSectionProps {
  language: Language;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ language }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = translations[language].faqs;

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="relative py-14 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] orb-purple rounded-full blur-3xl opacity-25" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold mb-3 border border-indigo-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Citizen Guidance</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            {t.title}
          </h2>
          <p className="text-indigo-200/50 text-sm sm:text-base">{t.subtitle}</p>
        </div>

        <div className="space-y-3">
          {t.items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'border-indigo-500/30 bg-indigo-500/8 shadow-lg shadow-indigo-900/20'
                    : 'border-white/8 bg-white/4 hover:border-white/15'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-indigo-200 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      Q{index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-indigo-300' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-indigo-200/70 font-medium leading-relaxed border-t border-white/6">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
