import React from 'react';
import { ExternalLink, PhoneCall, ShieldCheck, Heart, Sparkles, ArrowUpRight } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../data/translations';

interface FooterProps {
  language: Language;
  onOpenPrivacy: () => void;
  onOpenFeedback: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onOpenPrivacy, onOpenFeedback }) => {
  const t = translations[language].footer;

  const officialPortals = [
    { name: 'National Portal of India', url: 'https://india.gov.in' },
    { name: 'myScheme Portal', url: 'https://myscheme.gov.in' },
    { name: 'National Scholarship Portal', url: 'https://scholarships.gov.in' },
    { name: 'MahaDBT Maharashtra', url: 'https://mahadbt.maharashtra.gov.in' },
    { name: 'PM-KISAN Samman Nidhi', url: 'https://pmkisan.gov.in' },
    { name: 'Ayushman Bharat', url: 'https://beneficiary.nha.gov.in' },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/8">
      {/* Top tricolour accent */}
      <div className="tricolour-ribbon w-full" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] orb-purple rounded-full blur-3xl opacity-20 pointer-events-none -z-10" />

      <div className="bg-[#080618]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

            {/* Branding Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-black text-lg shadow-lg border border-indigo-400/20">
                  <span className="text-amber-300">स</span>
                </div>
                <span className="font-black text-xl text-white tracking-tight">
                  Sahayakon <span className="gradient-text">2.0</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{t.aboutText}</p>
              <div className="flex items-center gap-2 text-[11px] text-amber-300/80 pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Dedicated to Citizen Welfare & Transparency</span>
              </div>
              {/* Decorative dots */}
              <div className="flex gap-1.5 pt-2">
                {['bg-indigo-500', 'bg-violet-500', 'bg-amber-500', 'bg-emerald-500'].map((c, i) => (
                  <span key={i} className={`w-2 h-2 rounded-full ${c} opacity-70`} />
                ))}
              </div>
            </div>

            {/* Official Portals */}
            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {t.officialPortalsTitle}
              </h4>
              <ul className="space-y-2.5 text-xs">
                {officialPortals.map((portal, idx) => (
                  <li key={idx}>
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 text-slate-400 hover:text-indigo-300 transition-colors"
                    >
                      <span className="group-hover:underline underline-offset-2">{portal.name}</span>
                      <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Helplines */}
            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                {t.emergencyHelplinesTitle}
              </h4>
              <ul className="space-y-3 text-xs text-slate-400">
                {[
                  { icon: 'text-amber-400', text: t.helplines.nationalConsumer },
                  { icon: 'text-emerald-400', text: t.helplines.kisanCallCenter },
                  { icon: 'text-pink-400', text: t.helplines.womenHelpline },
                  { icon: 'text-blue-400', text: t.helplines.elderLine },
                ].map(({ icon, text }, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <PhoneCall className={`w-3.5 h-3.5 ${icon} shrink-0 mt-0.5`} />
                    <span className="leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links & Safety */}
            <div>
              <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
                Citizen Security & Links
              </h4>
              <div className="space-y-2.5 text-xs mb-5">
                {[
                  { action: onOpenPrivacy, label: 'Privacy & Aadhaar Safety Policy' },
                  { action: onOpenFeedback, label: 'Send Feedback & Suggestions' },
                ].map(({ action, label }, i) => (
                  <button
                    key={i}
                    onClick={action}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer group"
                  >
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    <span>{label}</span>
                  </button>
                ))}
                <a href="#faqs" className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-300 transition-colors group">
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Frequently Asked Questions</span>
                </a>
              </div>

              {/* Safety tip */}
              <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/15 text-[11px] text-red-300/80 leading-relaxed">
                🚫 Never pay cash for government welfare schemes. All official registrations are free & online.
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/6 text-center space-y-3">
            <p className="text-[11px] text-slate-500 leading-relaxed max-w-4xl mx-auto">
              {t.disclaimer}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
              <div>© {new Date().getFullYear()} Sahayakon 2.0 · JanSahayak AI. {t.rights}</div>
              <div className="flex items-center gap-1.5">
                <span>Made with pride in</span>
                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                <span>India for every Indian Citizen</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
