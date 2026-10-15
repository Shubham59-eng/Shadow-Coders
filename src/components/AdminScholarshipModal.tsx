import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Save, 
  RotateCcw,
  Search
} from 'lucide-react';
import type { Language, Scholarship, ScholarshipType, ScholarshipStatus } from '../types';
import { scholarshipsData as defaultScholarships } from '../data/scholarshipsData';

interface AdminScholarshipModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onScholarshipsUpdated?: (updated: Scholarship[]) => void;
}

const ADMIN_STORAGE_KEY = 'jansahayak_admin_scholarships';

export function getAdminScholarships(): Scholarship[] {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse admin scholarships:', e);
  }
  return defaultScholarships;
}

export function saveAdminScholarships(data: Scholarship[]): void {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data));
}

export const AdminScholarshipModal: React.FC<AdminScholarshipModalProps> = ({
  language,
  isOpen,
  onClose,
  onScholarshipsUpdated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('jansahayak_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Scholarship records state
  const [scholarships, setScholarships] = useState<Scholarship[]>(getAdminScholarships);
  const [searchFilter, setSearchFilter] = useState('');
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [isNewMode, setIsNewMode] = useState(false);

  // Form fields for create/edit
  const [formData, setFormData] = useState<Partial<Scholarship>>({});
  const [docsInput, setDocsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [coursesInput, setCoursesInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === 'sahayak2026' || pinInput.trim() === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('jansahayak_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Invalid Admin Passcode. Use demo key: sahayak2026');
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('jansahayak_admin_auth');
  };

  const handleStartCreate = () => {
    const newEntry: Scholarship = {
      id: `sch-${Date.now()}`,
      name: { en: '', mr: '', hi: '' },
      shortDescription: { en: '', mr: '', hi: '' },
      issuingOrganization: '',
      type: 'MahaDBT',
      level: 'Maharashtra',
      status: 'Open',
      applicationOpeningDate: '2026-08-01',
      applicationDeadline: '2026-11-30',
      amountVerified: true,
      benefits: {
        en: ['50% Tuition fee reimbursement for eligible students.'],
        mr: ['पात्र विद्यार्थ्यांसाठी ५०% शिक्षण शुल्क प्रतिपूर्ती.'],
        hi: ['पात्र विद्यार्थियों के लिए 50% शिक्षण शुल्क प्रतिपूर्ति।']
      },
      eligibilityCriteria: {
        en: ['Maharashtra Domicile', 'Family income below ₹8 Lakhs'],
        mr: ['महाराष्ट्र अधिवास', 'कौटुंबिक वार्षिक उत्पन्न ₹८ लाखांपेक्षा कमी'],
        hi: ['महाराष्ट्र मूल निवासी', 'पारिवारिक वार्षिक आय ₹8 लाख से कम']
      },
      rules: {
        minPercentage: 50,
        maxFamilyIncome: 800000,
        allowedCourses: ['Degree', 'Diploma', 'Engineering'],
        allowedCategories: ['Open', 'OBC', 'SC', 'ST', 'EWS'],
        domicileRequired: 'Maharashtra',
      },
      requiredDocuments: {
        en: ['Income Certificate', 'Domicile Certificate', 'Bonafide Certificate', 'Previous Marksheets'],
        mr: ['उत्पन्नाचा दाखला', 'अधिवास प्रमाणपत्र', 'बोनाफाईड प्रमाणपत्र', 'मागील गुणपत्रिका'],
        hi: ['आय प्रमाण पत्र', 'मूल निवास प्रमाण पत्र', 'बोनाफाइड प्रमाण पत्र', 'पिछली अंकतालिका']
      },
      renewalRules: {
        en: 'Maintain passing marks without backlogs.',
        mr: 'कोणत्याही विषयात अनुत्तीर्ण न होता उत्तीर्ण होणे आवश्यक.',
        hi: 'बिना बैकलाग के उत्तीर्ण होना अनिवार्य।'
      },
      applicationSteps: {
        en: ['Register on the portal', 'Upload verified documents', 'Submit for college verification'],
        mr: ['पोर्टलवर नोंदणी करा', 'कागदपत्रे अपलोड करा', 'कॉलेज पडताळणीसाठी सादर करा'],
        hi: ['पोर्टल पर पंजीकरण करें', 'दस्तावेज अपलोड करें', 'कॉलेज सत्यापन हेतु जमा करें']
      },
      officialUrl: 'https://mahadbt.maharashtra.gov.in',
      officialSource: 'Government Gazette Notification',
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      tags: ['scholarship', 'mahadbt', 'education'],
    };

    setEditingScholarship(newEntry);
    setFormData(newEntry);
    setDocsInput(newEntry.requiredDocuments.en.join(', '));
    setTagsInput(newEntry.tags.join(', '));
    setCoursesInput(newEntry.rules.allowedCourses?.join(', ') || '');
    setBenefitInput(newEntry.benefits.en[0] || '');
    setIsNewMode(true);
  };

  const handleStartEdit = (sch: Scholarship) => {
    setEditingScholarship(sch);
    setFormData(sch);
    setDocsInput(sch.requiredDocuments.en.join(', '));
    setTagsInput(sch.tags.join(', '));
    setCoursesInput(sch.rules.allowedCourses?.join(', ') || '');
    setBenefitInput(sch.benefits.en[0] || '');
    setIsNewMode(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.en || !formData.issuingOrganization) {
      alert('Please fill at least the Scholarship Title and Organization.');
      return;
    }

    const docsList = docsInput.split(',').map(d => d.trim()).filter(Boolean);
    const updatedScholarship: Scholarship = {
      ...editingScholarship!,
      ...formData,
      requiredDocuments: {
        en: docsList,
        mr: docsList,
        hi: docsList,
      },
      benefits: {
        en: [benefitInput || 'Tuition financial assistance'],
        mr: [formData.benefits?.mr?.[0] || benefitInput || 'शिक्षण शुल्क सहाय्य'],
        hi: [formData.benefits?.hi?.[0] || benefitInput || 'शिक्षण शुल्क सहायता'],
      },
      tags: tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      rules: {
        ...editingScholarship!.rules,
        ...formData.rules,
        allowedCourses: coursesInput.split(',').map(c => c.trim()).filter(Boolean),
      },
      lastVerifiedDate: new Date().toISOString().split('T')[0],
    };

    let updatedList: Scholarship[];
    if (isNewMode) {
      updatedList = [updatedScholarship, ...scholarships];
    } else {
      updatedList = scholarships.map((s) => s.id === updatedScholarship.id ? updatedScholarship : s);
    }

    setScholarships(updatedList);
    saveAdminScholarships(updatedList);
    onScholarshipsUpdated?.(updatedList);
    setEditingScholarship(null);
    setIsNewMode(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this scholarship entry?')) {
      const updated = scholarships.filter((s) => s.id !== id);
      setScholarships(updated);
      saveAdminScholarships(updated);
      onScholarshipsUpdated?.(updated);
      if (editingScholarship?.id === id) {
        setEditingScholarship(null);
      }
    }
  };

  const handleToggleStatus = (id: string, newStatus: ScholarshipStatus) => {
    const updated = scholarships.map((s) => {
      if (s.id === id) {
        return { ...s, status: newStatus, lastVerifiedDate: new Date().toISOString().split('T')[0] };
      }
      return s;
    });
    setScholarships(updated);
    saveAdminScholarships(updated);
    onScholarshipsUpdated?.(updated);
  };

  const handleMarkVerifiedToday = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = scholarships.map((s) => {
      if (s.id === id) {
        return { ...s, lastVerifiedDate: today };
      }
      return s;
    });
    setScholarships(updated);
    saveAdminScholarships(updated);
    onScholarshipsUpdated?.(updated);
  };

  const handleResetToSeed = () => {
    if (window.confirm('Reset all scholarship records to verified default seed data?')) {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      setScholarships(defaultScholarships);
      onScholarshipsUpdated?.(defaultScholarships);
      setEditingScholarship(null);
    }
  };

  const filtered = scholarships.filter((s) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      s.name.en.toLowerCase().includes(q) ||
      s.name.mr.toLowerCase().includes(q) ||
      (s.issuingOrganization || '').toLowerCase().includes(q) ||
      (s.tags || []).some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-white">
                Admin Scholarship Management Console
              </h3>
              <p className="text-xs text-slate-400">
                Authorized repository to add, verify, update, and manage official scholarship records.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleAdminLogout}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-slate-800 cursor-pointer"
              >
                Lock Console
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Authentication Gate */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">
              Authorized Access Required
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              This console is restricted to scholarship authorities and administrators. Please enter the administrator passcode to manage records.
            </p>
            
            <form onSubmit={handleAdminLogin} className="w-full space-y-3 pt-2">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Administrator Passcode"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-hidden text-center text-sm font-mono tracking-widest"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-semibold">{pinError}</p>
              )}
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-2xs text-amber-800 font-mono">
                Evaluation Passcode: <span className="font-bold">sahayak2026</span>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Authenticate & Unlock
              </button>
            </form>
          </div>
        ) : editingScholarship ? (
          /* Create / Edit Form */
          <form onSubmit={handleSaveForm} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <span>{isNewMode ? 'Create New Scholarship Record' : 'Edit Scholarship Record'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingScholarship(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Official Scholarship Title (English)*</label>
                <input
                  type="text"
                  required
                  value={formData.name?.en || ''}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name!, en: e.target.value } })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-amber-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Type</label>
                <select
                  value={formData.type || 'MahaDBT'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ScholarshipType })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="MahaDBT">MahaDBT (Maharashtra State)</option>
                  <option value="Central">Central Govt (NSP/DoHE)</option>
                  <option value="State">Other State Government</option>
                  <option value="Institutional">Institutional / AICTE</option>
                  <option value="Private/Foundation">Private / CSR Foundation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Title in Marathi</label>
                <input
                  type="text"
                  value={formData.name?.mr || ''}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name!, mr: e.target.value } })}
                  placeholder="उदा. राजर्षी छत्रपती शाहू महाराज शिक्षण शुल्क शिष्यवृत्ती"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Title in Hindi</label>
                <input
                  type="text"
                  value={formData.name?.hi || ''}
                  onChange={(e) => setFormData({ ...formData, name: { ...formData.name!, hi: e.target.value } })}
                  placeholder="उदा. राजर्षि छत्रपति शाहू महाराज शिक्षण शुल्क छात्रवृत्ति"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Issuing Department / Org*</label>
                <input
                  type="text"
                  required
                  value={formData.issuingOrganization || ''}
                  onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                  placeholder="e.g. Higher & Technical Education Dept, MahaDBT"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Application Status</label>
                <select
                  value={formData.status || 'Open'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ScholarshipStatus })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Open">Open for Application</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Closed">Closed / Expired</option>
                  <option value="Date Not Announced">Date Not Announced</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Deadline Date (YYYY-MM-DD)</label>
                <input
                  type="text"
                  value={formData.applicationDeadline || ''}
                  onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                  placeholder="2026-11-30"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Max Family Income Cap (₹/yr)</label>
                <input
                  type="number"
                  value={formData.rules?.maxFamilyIncome || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    rules: { ...formData.rules!, maxFamilyIncome: Number(e.target.value) || undefined }
                  })}
                  placeholder="e.g. 800000"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Min Percentage Required (%)</label>
                <input
                  type="number"
                  value={formData.rules?.minPercentage || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    rules: { ...formData.rules!, minPercentage: Number(e.target.value) || undefined }
                  })}
                  placeholder="e.g. 60"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Financial Benefit Summary</label>
                <input
                  type="text"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  placeholder="e.g. 50% tuition and exam fee reimbursement"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-bold text-slate-700">Official Portal URL</label>
                <input
                  type="url"
                  value={formData.officialUrl || ''}
                  onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
                  placeholder="https://mahadbt.maharashtra.gov.in"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-bold text-slate-700">Eligible Course Streams (comma separated)</label>
                <input
                  type="text"
                  value={coursesInput}
                  onChange={(e) => setCoursesInput(e.target.value)}
                  placeholder="Engineering, Medicine, Pharmacy, Diploma, Degree"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-bold text-slate-700">Mandatory Documents Checklist (comma separated)</label>
                <textarea
                  rows={2}
                  value={docsInput}
                  onChange={(e) => setDocsInput(e.target.value)}
                  placeholder="Income Certificate, Domicile Certificate, Mark Sheets, Fee Receipt"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-bold text-slate-700">Tags (comma separated for filters)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="ebc, engineering, girls, mahadbt, nsp"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingScholarship(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Scholarship</span>
              </button>
            </div>
          </form>
        ) : (
          /* Records List View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search by name, organization, or tag..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-amber-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetToSeed}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
                  title="Reset to default seed data"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>

                <button
                  onClick={handleStartCreate}
                  className="px-4 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Add Scholarship</span>
                </button>
              </div>
            </div>

            {/* Table / List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No scholarship records found matching "{searchFilter}".
                </div>
              ) : (
                filtered.map((sch) => (
                  <div key={sch.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-2xs font-extrabold uppercase ${
                          sch.status === 'Open' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : sch.status === 'Upcoming'
                            ? 'bg-blue-100 text-blue-800'
                            : sch.status === 'Closed'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {sch.status}
                        </span>
                        <span className="text-2xs font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {sch.type}
                        </span>
                        <span className="text-2xs text-slate-400">
                          Verified: {sch.lastVerifiedDate}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-slate-900">
                        {sch.name[language] || sch.name.en}
                      </h5>
                      <p className="text-xs text-slate-500">
                        {sch.issuingOrganization} • Deadline: <span className="font-semibold text-slate-700">{sch.applicationDeadline || 'Not announced'}</span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      {/* Quick Status Toggles */}
                      {sch.status !== 'Open' ? (
                        <button
                          onClick={() => handleToggleStatus(sch.id, 'Open')}
                          className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-2xs font-bold border border-emerald-200 cursor-pointer"
                          title="Mark Open"
                        >
                          Set Open
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(sch.id, 'Closed')}
                          className="px-2 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-2xs font-bold border border-rose-200 cursor-pointer"
                          title="Mark Expired / Closed"
                        >
                          Expire
                        </button>
                      )}

                      {/* Verify Button */}
                      <button
                        onClick={() => handleMarkVerifiedToday(sch.id)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-400 text-slate-600 hover:text-emerald-700 bg-white cursor-pointer"
                        title="Mark Verified Today"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(sch)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-blue-400 text-slate-600 hover:text-blue-700 bg-white cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit3 className="w-4 h-4 text-blue-600" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(sch.id)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-400 text-slate-600 hover:text-rose-700 bg-white cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Active Records: {scholarships.length}</span>
          <span className="text-2xs text-slate-400">
            Official records must strictly cite state/central gazette notifications.
          </span>
        </div>
      </div>
    </div>
  );
};
