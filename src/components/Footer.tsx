import React from 'react';
import { ExternalLink, PhoneCall, ShieldCheck, Heart } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../data/translations';

interface FooterProps {
  language: Language;
  onOpenPrivacy: () => void;
  onOpenFeedback: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenPrivacy,
  onOpenFeedback,
}) => {
  const t = translations[language].footer;

  const officialPortals = [
    { name: 'National Portal of India', url: 'https://india.gov.in' },
    { name: 'myScheme Portal (Govt of India)', url: 'https://myscheme.gov.in' },
    { name: 'National Scholarship Portal', url: 'https://scholarships.gov.in' },
    { name: 'MahaDBT (Govt of Maharashtra)', url: 'https://mahadbt.maharashtra.gov.in' },
    { name: 'PM-KISAN Samman Nidhi', url: 'https://pmkisan.gov.in' },
    { name: 'Ayushman Bharat Beneficiary Portal', url: 'https://beneficiary.nha.gov.in' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About JanSahayak Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-800 text-white flex items-center justify-center font-bold text-lg border border-amber-500/40">
                <span className="text-amber-400">ज</span>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                JanSahayak AI
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.aboutText}
            </p>
            <div className="pt-2 flex items-center gap-2 text-2xs text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Dedicated to Citizen Welfare & Transparency</span>
            </div>
          </div>

          {/* Official Government Portals */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3">
              {t.officialPortalsTitle}
            </h4>
            <ul className="space-y-2 text-xs">
              {officialPortals.map((portal, idx) => (
                <li key={idx}>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{portal.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* National Citizen Helplines */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3">
              {t.emergencyHelplinesTitle}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{t.helplines.nationalConsumer}</span>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.helplines.kisanCallCenter}</span>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                <span>{t.helplines.womenHelpline}</span>
              </li>
              <li className="flex items-start gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{t.helplines.elderLine}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links & Safety */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-3">
              Citizen Security & Links
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={onOpenPrivacy}
                className="block text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Privacy & Aadhaar Safety Policy
              </button>
              <button
                onClick={onOpenFeedback}
                className="block text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Send Citizen Feedback & Suggestions
              </button>
              <a
                href="#faqs"
                className="block text-slate-400 hover:text-white transition-colors"
              >
                Frequently Asked Questions (FAQ)
              </a>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-2xs text-slate-400 leading-relaxed">
              Never pay cash or bribe for government welfare schemes. All official registrations are online.
            </div>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="pt-6 border-t border-slate-800 text-center space-y-3">
          <p className="text-2xs text-slate-400 leading-relaxed max-w-4xl mx-auto">
            {t.disclaimer}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-2xs text-slate-400 pt-2">
            <div>
              © {new Date().getFullYear()} JanSahayak AI. {t.rights}
            </div>
            <div className="flex items-center gap-1">
              <span>Made with pride in India</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
              <span>for every Indian Citizen</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
