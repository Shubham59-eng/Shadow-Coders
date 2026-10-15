import React from 'react';
import { 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  FolderLock
} from 'lucide-react';
import type { Language, DigiLockerDocument, SchemeRecord } from '../types';
import { DOCUMENT_CATALOG } from '../services/smartEligibilityEngine';

interface DocumentReadinessCheckerProps {
  language: Language;
  scheme: SchemeRecord;
  availableDocs: DigiLockerDocument[];
  onOpenDigiLocker: () => void;
}

export const DocumentReadinessChecker: React.FC<DocumentReadinessCheckerProps> = ({
  language,
  scheme,
  availableDocs,
  onOpenDigiLocker,
}) => {
  const requiredCodes = scheme.requiredDocCodes || [];

  const matchedDocs = requiredCodes.map(code => {
    const meta = DOCUMENT_CATALOG[code] || {
      name: { en: code, mr: code, hi: code },
      howToObtain: 'Procure from designated government center.',
    };
    const userDoc = availableDocs.find(d => d.docCode === code);

    return {
      code,
      name: meta.name[language] || meta.name.en,
      isAvailable: Boolean(userDoc),
      docRecord: userDoc,
      howToObtain: meta.howToObtain,
      portalUrl: meta.portalUrl,
    };
  });

  const availableCount = matchedDocs.filter(d => d.isAvailable).length;
  const missingCount = matchedDocs.length - availableCount;
  const readinessPercentage = matchedDocs.length > 0 ? Math.round((availableCount / matchedDocs.length) * 100) : 100;
  const schemeTitle = scheme.title?.[language] || scheme.title?.en || scheme.name?.[language] || scheme.name?.en || scheme.id;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
      {/* Title & Readiness Progress Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-900" />
            <span>Document Readiness for: {schemeTitle}</span>
          </h4>
          <p className="text-2xs text-slate-500">
            Compared against your connected DigiLocker vault &amp; verified document records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-blue-950">{readinessPercentage}% Ready</span>
          <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className={`h-full transition-all duration-500 ${readinessPercentage === 100 ? 'bg-emerald-500' : readinessPercentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
              style={{ width: `${readinessPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="flex items-center gap-2 text-2xs">
        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>{availableCount} Available</span>
        </span>
        <span className={`px-2.5 py-1 rounded-lg font-bold border flex items-center gap-1 ${
          missingCount > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'
        }`}>
          <AlertCircle className="w-3 h-3 text-amber-600" />
          <span>{missingCount} Missing or Needs User Confirmation</span>
        </span>
        <button
          onClick={onOpenDigiLocker}
          className="ml-auto text-blue-900 hover:underline font-bold flex items-center gap-1 cursor-pointer"
        >
          <FolderLock className="w-3.5 h-3.5" />
          <span>Manage Document Locker</span>
        </button>
      </div>

      {/* Document List */}
      <div className="space-y-2.5 divide-y divide-slate-100">
        {matchedDocs.map((item, idx) => (
          <div key={idx} className="pt-2.5 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="font-bold text-slate-900">{item.name}</span>
                <span className={`px-2 py-0.2 rounded text-3xs font-extrabold uppercase ${
                  item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.isAvailable ? (item.docRecord?.source === 'digilocker' ? 'DigiLocker Synced' : 'User Confirmed') : 'Missing'}
                </span>
              </div>
              <p className="text-2xs text-slate-500 leading-relaxed pl-4">
                {item.isAvailable 
                  ? `${item.docRecord?.metadataSummary || 'Verified reference document'}` 
                  : `Procurement Guide: ${item.howToObtain}`}
              </p>
            </div>

            <div className="pl-4 sm:pl-0 shrink-0">
              {!item.isAvailable && item.portalUrl && (
                <a
                  href={item.portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-2xs font-semibold flex items-center gap-1"
                >
                  <span>Apply on Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Note */}
      <div className="pt-2 border-t border-slate-100 text-3xs text-slate-400 flex items-center gap-1.5 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
        <span>Data Minimization Policy: Sahayakon 2.0 does not hoard full document files; only verified validity status and minimal metadata are processed.</span>
      </div>
    </div>
  );
};
