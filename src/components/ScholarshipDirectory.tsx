import React, { useState, useMemo } from 'react';
import { 
  Search, 
  GraduationCap, 
  Bookmark, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import type { 
  Language, 
  Scholarship
} from '../types';
import { scholarshipsData } from '../data/scholarshipsData';

interface ScholarshipDirectoryProps {
  language: Language;
  savedIds: string[];
  onToggleBookmark: (id: string) => void;
  onViewDetails: (scholarship: Scholarship) => void;
  onOpenChecker: () => void;
}

export const ScholarshipDirectory: React.FC<ScholarshipDirectoryProps> = ({
  language,
  savedIds,
  onToggleBookmark,
  onViewDetails,
  onOpenChecker,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategoryTag, setSelectedCategoryTag] = useState<string>('all');

  const filteredScholarships = useMemo(() => {
    return scholarshipsData.filter((s) => {
      // Type filter
      if (selectedType !== 'all' && s.type !== selectedType) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && s.status !== selectedStatus) {
        return false;
      }

      // Category tag filter (e.g. engineering, girls, ebc, sc, obc, minority)
      if (selectedCategoryTag !== 'all' && !s.tags.includes(selectedCategoryTag)) {
        return false;
      }

      // Search keyword
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const sName = s.name || s.title || { en: '', mr: '', hi: '' };
        const matchesName = 
          sName.en.toLowerCase().includes(query) ||
          sName.mr.toLowerCase().includes(query) ||
          sName.hi.toLowerCase().includes(query);
        const matchesOrg = (s.issuingOrganization || s.authority || '').toLowerCase().includes(query);
        const matchesTags = (s.tags || []).some(t => t.toLowerCase().includes(query));
        const matchesDesc = ((s.shortDescription?.en || s.description?.en) || '').toLowerCase().includes(query);

        if (!matchesName && !matchesOrg && !matchesTags && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [searchTerm, selectedType, selectedStatus, selectedCategoryTag]);

  const quickFilterPills = [
    { label: 'All Schemes', value: 'all' },
    { label: '🎓 Engineering & Technical', value: 'engineering' },
    { label: '👩 Girls / Women', value: 'girls' },
    { label: '💰 EBC / Fee Waiver', value: 'ebc' },
    { label: '🏛️ MahaDBT (Maharashtra)', value: 'mahadbt' },
    { label: '🌟 Central NSP (Govt of India)', value: 'nsp' },
    { label: '🤝 SC / Social Justice', value: 'sc' },
    { label: '👥 OBC / EBC (YASASVI)', value: 'obc' },
    { label: '🌙 Minorities (MoMA)', value: 'minority' },
    { label: '🏢 Private / Tata / Reliance', value: 'private' },
  ];

  return (
    <section id="scholarships-directory" className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-2">
              <GraduationCap className="w-4 h-4 text-blue-900" />
              <span>Verified Indian Scholarships Directory</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {language === 'mr' ? 'अधिकृत शिष्यवृत्ती डिरेक्टरी' : language === 'hi' ? 'आधिकारिक छात्रवृत्ति निर्देशिका' : 'Official Scholarships Directory'}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Central Government (NSP), Maharashtra (MahaDBT), Technical (AICTE), and Verified Foundation Schemes.
            </p>
          </div>

          <button
            onClick={onOpenChecker}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Check My Personalized Eligibility</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 mb-8 space-y-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search Box */}
            <div className="lg:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search scholarship by name, course, category (e.g. Pragati, Shahu, Engineering)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-blue-900"
              />
            </div>

            {/* Type Filter */}
            <div className="lg:col-span-3">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-blue-900"
              >
                <option value="all">All Portals / Levels</option>
                <option value="Central">Central Govt (NSP / AICTE)</option>
                <option value="MahaDBT">Maharashtra (MahaDBT)</option>
                <option value="Private/Foundation">Verified Private Foundations</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="lg:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-hidden focus:border-blue-900"
              >
                <option value="all">All Application Statuses</option>
                <option value="Open">🟢 Currently Open</option>
                <option value="Upcoming">🟡 Upcoming / Announced</option>
                <option value="Closed">🔴 Closed</option>
                <option value="Date Not Announced">⚪ Date Not Announced</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Tag Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-2xs font-bold text-slate-400 uppercase tracking-wide shrink-0 mr-1">
              Quick Tags:
            </span>
            {quickFilterPills.map((pill) => (
              <button
                key={pill.value}
                onClick={() => setSelectedCategoryTag(pill.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
                  selectedCategoryTag === pill.value
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-900'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scholarships Cards Grid */}
        {filteredScholarships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship) => {
              const isSaved = savedIds.includes(scholarship.id);

              return (
                <div
                  key={scholarship.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5 pb-4">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-2xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                          {scholarship.type}
                        </span>
                        
                        <span className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${
                          scholarship.status === 'Open' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : scholarship.status === 'Upcoming'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          ● {scholarship.status}
                        </span>
                      </div>

                      <button
                        onClick={() => onToggleBookmark(scholarship.id)}
                        title={isSaved ? 'Saved to Dashboard' : 'Save to Dashboard'}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSaved 
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' 
                            : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>

                    {/* Scheme Name */}
                    <h3
                      onClick={() => onViewDetails(scholarship)}
                      className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors cursor-pointer leading-snug line-clamp-2 mb-1.5"
                    >
                      {scholarship.name[language]}
                    </h3>

                    {/* Organization */}
                    <div className="flex items-center gap-1.5 text-2xs text-slate-500 mb-3">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{scholarship.issuingOrganization}</span>
                    </div>

                    {/* Highlight Benefit Box */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 mb-3">
                      <span className="text-2xs font-bold text-emerald-950 uppercase tracking-wide block">
                        Verified Benefit:
                      </span>
                      <span className="text-xs font-bold text-emerald-900">
                        {scholarship.benefits[language][0]}
                      </span>
                    </div>

                    {/* Timeline & Last Verified */}
                    <div className="space-y-1 text-2xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Deadline: <strong>{scholarship.applicationDeadline || 'Date not announced yet'}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Source: {scholarship.officialSource}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onViewDetails(scholarship)}
                      className="text-xs font-bold text-blue-900 hover:text-amber-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Details & Steps</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={scholarship.officialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-slate-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Portal Link</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300 max-w-xl mx-auto">
            <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="font-bold text-base text-slate-900">No matching scholarships found</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try clearing your filters or searching with a different term.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedStatus('all');
                setSelectedCategoryTag('all');
              }}
              className="px-4 py-2 rounded-xl bg-blue-900 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
