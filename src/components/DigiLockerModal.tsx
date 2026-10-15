import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  FileText, 
  Plus, 
  Trash2, 
  RefreshCw,
  FolderLock,
  Lock,
  Info
} from 'lucide-react';
import type { Language, DigiLockerDocument, DigiLockerSession, DocumentCategory } from '../types';
import { 
  getStoredDigiLockerSession, 
  getStoredDigiLockerDocs, 
  connectDemoDigiLocker, 
  disconnectDigiLocker,
  addManualDocumentRecord 
} from '../services/digilockerService';

interface DigiLockerModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onDocumentsUpdated?: (docs: DigiLockerDocument[]) => void;
}

export const DigiLockerModal: React.FC<DigiLockerModalProps> = ({
  language,
  isOpen,
  onClose,
  onDocumentsUpdated,
}) => {
  const [session, setSession] = useState<DigiLockerSession>(getStoredDigiLockerSession);
  const [documents, setDocuments] = useState<DigiLockerDocument[]>(getStoredDigiLockerDocs);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Manual doc form states
  const [manualCode, setManualCode] = useState('income_cert');
  const [manualName, setManualName] = useState('');
  const [manualIssuer, setManualIssuer] = useState('');
  const [manualCategory, setManualCategory] = useState<DocumentCategory>('income');
  const [manualSummary, setManualSummary] = useState('');

  useEffect(() => {
    if (isOpen) {
      const s = getStoredDigiLockerSession();
      const d = getStoredDigiLockerDocs();
      setSession(s);
      setDocuments(d);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const t = {
    mr: {
      title: 'डिजिटल डॉक्युमेंट लॉकर (DigiLocker Integration)',
      subtitle: 'अधिकृत API Setu प्रणालीशी जोडणी व कागदपत्रे पडताळणी',
      demoBanner: 'डेमो मोड (सँडबॉक्स सिम्युलेशन): अधिकृत API Setu भागीदार की नसताना नमुना कागदपत्रांसह सुरक्षित चाचणी सुरू आहे. हे कागदपत्रे प्रत्यक्ष सरकारी नोंदी नाहीत.',
      consentHeading: 'संमती व उद्दिष्ट स्पष्टीकरण (Informed Consent):',
      consentText: 'सहयोजक २.० केवळ शासकीय योजनांच्या पात्रतेसाठी आवश्यक कागदपत्रांचे किमान मेटाडेटा (Metadata) वाचते. आम्ही कधीही तुमचा आधार क्रमांक, आधार OTP अथवा मूळ कागदपत्रांच्या फाइल्स साठवत नाही.',
      connectBtn: 'DigiLocker शी जोडा (Connect DigiLocker)',
      disconnectBtn: 'प्रवेश रद्द करा व डिस्कनेक्ट करा (Revoke & Disconnect)',
      connectedStatus: '🟢 जोडलेले (Connected)',
      disconnectedStatus: '⚪ डिस्कनेक्ट (Not Connected)',
      addManualBtn: 'कागदपत्र स्वतः जोडा (Manual Entry)',
      availableDocs: 'उपलब्ध कागदपत्रे व पडताळणी स्थिती',
      verifiedDigiLocker: 'DigiLocker द्वारे सत्यापित (Sandbox)',
      manualVerified: 'वापरकर्त्याने पुष्टी केलेले',
      procureGuide: 'कसे मिळवावे? (Procurement Guide)',
      close: 'बंद करा'
    },
    hi: {
      title: 'डिजिटल डॉक्यूमेंट लॉकर (DigiLocker Integration)',
      subtitle: 'आधिकारिक API Setu प्रणाली से संयोजन एवं दस्तावेज सत्यापन',
      demoBanner: 'डेमो मोड (सैंडबॉक्स सिमुलेशन): आधिकारिक API Setu क्रेडेंशियल के अभाव में काल्पनिक परीक्षण रिकॉर्ड प्रदर्शित किए जा रहे हैं। इन्हें वास्तविक सरकारी प्रमाण न मानें।',
      consentHeading: 'सहमति एवं उद्देश्य स्पष्टीकरण (Informed Consent):',
      consentText: 'सहयोजक 2.0 केवल योजनाओं की पात्रता जांचने हेतु न्यूनतम मेटाडेटा प्राप्त करता है। हम कभी भी आधार ओटीपी, पासवर्ड अथवा संवेदनशील फाइलें संग्रहीत नहीं करते हैं।',
      connectBtn: 'DigiLocker से कनेक्ट करें (Connect DigiLocker)',
      disconnectBtn: 'पहुंच निरस्त करें एवं डिस्कनेक्ट करें (Revoke & Disconnect)',
      connectedStatus: '🟢 कनेक्टेड (Connected)',
      disconnectedStatus: '⚪ डिस्कनेक्टेड (Not Connected)',
      addManualBtn: 'दस्तावेज मैनुअल जोड़ें (Manual Entry)',
      availableDocs: 'उपलब्ध दस्तावेज एवं सत्यापन स्थिति',
      verifiedDigiLocker: 'DigiLocker द्वारा सत्यापित (Sandbox)',
      manualVerified: 'उपयोगकर्ता द्वारा पुष्ट',
      procureGuide: 'कैसे प्राप्त करें? (Procurement Guide)',
      close: 'बंद करें'
    },
    en: {
      title: 'Digital Document Locker (DigiLocker Integration)',
      subtitle: 'Official API Setu Partner Document Verification & Readiness Module',
      demoBanner: 'DEMO MODE (Sandbox Simulation): Running safe demonstration with realistic sample records. Official partner credentials pending. These records are not claimed as live government certificates.',
      consentHeading: 'Purpose & Consent Notice (Data Minimization):',
      consentText: 'Sahayakon 2.0 reads only verified document metadata (Certificate type, issuer, and validity) to match eligible schemes. We NEVER ask for, collect, or store your 12-digit Aadhaar number, Aadhaar OTPs, or government passwords.',
      connectBtn: 'Connect DigiLocker (OAuth 2.0)',
      disconnectBtn: 'Revoke Access & Disconnect',
      connectedStatus: '🟢 Connected (Active Session)',
      disconnectedStatus: '⚪ Disconnected (No Active Link)',
      addManualBtn: 'Add Document Manually',
      availableDocs: 'Available Documents & Readiness Checklist',
      verifiedDigiLocker: 'DigiLocker Verified (Sandbox)',
      manualVerified: 'User-Declared Record',
      procureGuide: 'How to Obtain (Official Guide)',
      close: 'Close'
    }
  }[language];

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      const { session: newSession, docs: newDocs } = connectDemoDigiLocker();
      setSession(newSession);
      setDocuments(newDocs);
      setConnecting(false);
      onDocumentsUpdated?.(newDocs);
    }, 800);
  };

  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect DigiLocker and wipe locally cached document metadata?')) {
      disconnectDigiLocker();
      setSession(getStoredDigiLockerSession());
      setDocuments([]);
      onDocumentsUpdated?.([]);
    }
  };

  const handleAddManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualIssuer.trim()) {
      alert('Please fill document title and issuing authority.');
      return;
    }

    const created = addManualDocumentRecord({
      docCode: manualCode,
      name: { en: manualName, mr: manualName, hi: manualName },
      category: manualCategory,
      issuer: manualIssuer,
      issueDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'uploaded_manual',
      metadataSummary: manualSummary || `User-declared: ${manualName}`,
      instructionsForProcurement: {
        en: 'Self-declared document. Official verification required before final benefit disbursement.',
        mr: 'स्वयं-पुष्टी केलेले कागदपत्र.',
        hi: 'स्वयं-घोषित दस्तावेज।'
      }
    });

    const updated = [created, ...documents];
    setDocuments(updated);
    setIsManualAddOpen(false);
    setManualName('');
    setManualIssuer('');
    setManualSummary('');
    onDocumentsUpdated?.(updated);
  };

  const filteredDocs = documents.filter((d) => {
    if (selectedCategory === 'all') return true;
    return d.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <FolderLock className="w-5 h-5" />
              </span>
              <h3 className="font-extrabold text-lg sm:text-xl text-white">
                {t.title}
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              {t.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Demo Mode Advisory Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <p className="font-bold leading-relaxed">{t.demoBanner}</p>
              <p className="text-2xs text-amber-800">
                Official partner documentation: <a href="https://api.apisetu.gov.in" target="_blank" rel="noreferrer" className="underline font-bold">api.apisetu.gov.in</a> &amp; <a href="https://apisetu.gov.in/digilocker" target="_blank" rel="noreferrer" className="underline font-bold">apisetu.gov.in/digilocker</a>.
              </p>
            </div>
          </div>

          {/* Connection Status & Action Area */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-slate-500">Connection Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                  session.isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {session.isConnected ? t.connectedStatus : t.disconnectedStatus}
                </span>
                {session.isConnected && (
                  <span className="text-2xs font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-semibold">
                    Sandbox Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {session.isConnected
                  ? `Active session synced: ${session.totalDocumentsCount} documents available for instant eligibility checking.`
                  : 'Link DigiLocker to auto-fill verified document readiness for scholarships and welfare schemes.'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {session.isConnected ? (
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t.disconnectBtn}</span>
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  {connecting ? <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
                  <span>{connecting ? 'Connecting...' : t.connectBtn}</span>
                </button>
              )}

              <button
                onClick={() => setIsManualAddOpen(!isManualAddOpen)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4 text-blue-900" />
                <span className="hidden sm:inline">{t.addManualBtn}</span>
              </button>
            </div>
          </div>

          {/* Privacy & Purpose Explanation Card */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1">
            <h5 className="font-extrabold flex items-center gap-1.5 text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>{t.consentHeading}</span>
            </h5>
            <p className="leading-relaxed text-blue-900/90 font-medium">
              {t.consentText}
            </p>
          </div>

          {/* Manual Document Input Form (Toggleable) */}
          {isManualAddOpen && (
            <form onSubmit={handleAddManualSubmit} className="p-5 rounded-2xl bg-amber-50/50 border border-amber-300 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span>Manual Document Entry Checklist</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsManualAddOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Document Type Code*</label>
                  <select
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="income_cert">Tahsildar Income Certificate</option>
                    <option value="domicile_cert">Maharashtra Domicile Certificate</option>
                    <option value="caste_cert">Caste / NCL Certificate</option>
                    <option value="marksheet_12">Class 12th Marksheet</option>
                    <option value="marksheet_10">Class 10th Marksheet</option>
                    <option value="ration_card">Ration Card (Yellow/Kesari)</option>
                    <option value="disability_cert">Disability / UDID Card</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Document Title*</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g. Income Certificate 2026-27"
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issuing Authority / Office*</label>
                  <input
                    type="text"
                    required
                    value={manualIssuer}
                    onChange={(e) => setManualIssuer(e.target.value)}
                    placeholder="e.g. Sub-Divisional Officer, Haveli Pune"
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Document Category</label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as DocumentCategory)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="income">Income</option>
                    <option value="identity_residence">Identity / Residence</option>
                    <option value="caste_category">Caste / Category</option>
                    <option value="academic">Academic</option>
                    <option value="disability">Disability</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Non-Sensitive Reference Summary</label>
                  <input
                    type="text"
                    value={manualSummary}
                    onChange={(e) => setManualSummary(e.target.value)}
                    placeholder="e.g. Valid until March 2027 | SDO certified"
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-900 text-white font-bold text-xs hover:bg-blue-800 cursor-pointer"
                >
                  Save Manual Document
                </button>
              </div>
            </form>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
            <h4 className="font-extrabold text-sm text-slate-900">
              {t.availableDocs} ({filteredDocs.length})
            </h4>

            <div className="flex items-center gap-1.5 text-2xs font-bold overflow-x-auto">
              {['all', 'academic', 'income', 'identity_residence', 'caste_category'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full capitalize transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Document Cards List */}
          <div className="space-y-3">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No documents connected yet.</p>
                <p className="text-2xs text-slate-400 mt-0.5">Click "Connect DigiLocker" or "Add Document Manually" above.</p>
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div
                  key={doc.docId}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 bg-white shadow-2xs transition-all space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-2xs font-extrabold ${
                          doc.verificationStatus === 'verified_digilocker'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}>
                          {doc.verificationStatus === 'verified_digilocker' ? t.verifiedDigiLocker : t.manualVerified}
                        </span>
                        <span className="text-2xs font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          {doc.category.replace('_', ' ')}
                        </span>
                        {doc.validUntil && (
                          <span className="text-2xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                            Valid till: {doc.validUntil}
                          </span>
                        )}
                      </div>
                      <h5 className="font-extrabold text-sm text-slate-900 mt-1">
                        {doc.name[language] || doc.name.en}
                      </h5>
                      <p className="text-xs text-slate-500 font-medium">
                        Issuer: {doc.issuer} • Issued: {doc.issueDate}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-2xs text-slate-400 font-mono block">
                        {doc.metadataSummary}
                      </span>
                    </div>
                  </div>

                  {/* Procurement guidance for missing or renewal */}
                  {doc.instructionsForProcurement && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-2xs text-slate-600 flex items-start justify-between gap-2">
                      <div className="flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{doc.instructionsForProcurement[language] || doc.instructionsForProcurement.en}</span>
                      </div>
                      {doc.officialProcurementPortal && (
                        <a
                          href={doc.officialProcurementPortal}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-900 hover:underline shrink-0 flex items-center gap-0.5"
                        >
                          Portal <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-2xs text-slate-500 font-medium">
            🔒 Protected under Indian Digital Personal Data Protection standards.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer shadow-xs"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
