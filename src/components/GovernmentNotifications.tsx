import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Search, 
  ExternalLink, 
  Building2, 
  Sparkles, 
  Clock, 
  Archive, 
  Check, 
  ArrowRight, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import type { Language } from '../types';
import { 
  VERIFIED_GOVERNMENT_NOTIFICATIONS, 
  getReadNotificationIds,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getArchivedNotificationIds,
  toggleArchiveNotification
} from '../data/notificationsData';

interface GovernmentNotificationsProps {
  language: Language;
  onViewSchemeDetails?: (schemeId: string) => void;
  isEmbeddedSection?: boolean;
  onViewAllNotifications?: () => void;
}

const NOTIFICATION_TYPE_LABELS: Record<Language, Record<string, string>> = {
  mr: {
    all: 'सर्व प्रकार',
    new_scheme: 'नवीन योजना',
    scholarship_announcement: 'शिष्यवृत्ती घोषणा',
    application_dates: 'अर्ज तारखा व मुदत',
    deadline: 'अंतिम मुदत',
    deadline_extension: 'मुदतवाढ',
    eligibility_change: 'पात्रता व लाभ बदल',
    beneficiary_update: 'लाभार्थी यादी / निकाल',
    circular_guideline: 'शासन निर्णय व परिपत्रके',
  },
  hi: {
    all: 'सभी प्रकार',
    new_scheme: 'नई योजना',
    scholarship_announcement: 'छात्रवृत्ति घोषणा',
    application_dates: 'आवेदन तिथि एवं समय सीमा',
    deadline: 'अंतिम तिथि',
    deadline_extension: 'समय विस्तार',
    eligibility_change: 'पात्रता एवं लाभ संशोधन',
    beneficiary_update: 'लाभार्थी सूची / परिणाम',
    circular_guideline: 'शासकीय अधिसूचना एवं दिशानिर्देश',
  },
  en: {
    all: 'All Types',
    new_scheme: 'New Scheme Announcement',
    scholarship_announcement: 'Scholarship Announcement',
    application_dates: 'Application Dates & Deadlines',
    deadline: 'Application Deadline',
    deadline_extension: 'Deadline Extension',
    eligibility_change: 'Eligibility & Benefit Changes',
    beneficiary_update: 'Beneficiary List / Result',
    circular_guideline: 'Official Circulars & Guidelines',
  }
};

export const GovernmentNotifications: React.FC<GovernmentNotificationsProps> = ({
  language,
  onViewSchemeDetails,
  isEmbeddedSection = false,
  onViewAllNotifications,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isEmbeddedSection ? 3 : 6;

  // Read and archive states synced with local persistence
  const [readIds, setReadIds] = useState<string[]>(() => getReadNotificationIds());
  const [archivedIds, setArchivedIds] = useState<string[]>(() => getArchivedNotificationIds());

  const handleToggleRead = (id: string) => {
    if (readIds.includes(id)) {
      const updated = readIds.filter(x => x !== id);
      setReadIds(updated);
      localStorage.setItem('sahayakon_gov_notifications_read', JSON.stringify(updated));
    } else {
      const updated = markNotificationAsRead(id);
      setReadIds(updated);
    }
  };

  const handleMarkAllRead = () => {
    const allIds = VERIFIED_GOVERNMENT_NOTIFICATIONS.map(n => n.id);
    const updated = markAllNotificationsAsRead(allIds);
    setReadIds(updated);
  };

  const handleToggleArchive = (id: string) => {
    const updated = toggleArchiveNotification(id);
    setArchivedIds(updated);
  };

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return VERIFIED_GOVERNMENT_NOTIFICATIONS.filter((notif) => {
      const isArchived = archivedIds.includes(notif.id);
      const isRead = readIds.includes(notif.id);

      // Status tab
      if (activeTab === 'archived') {
        if (!isArchived) return false;
      } else {
        if (isArchived) return false; // Hide archived in 'all' and 'unread'
        if (activeTab === 'unread' && isRead) return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && notif.level !== selectedLevel) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && notif.category !== selectedCategory) {
        return false;
      }

      // Notification type filter
      if (selectedType !== 'all' && notif.notificationType !== selectedType) {
        return false;
      }

      // Keyword search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const titleMatch = 
          (notif.title.en || '').toLowerCase().includes(q) ||
          (notif.title.mr || '').toLowerCase().includes(q) ||
          (notif.title.hi || '').toLowerCase().includes(q);
        const summaryMatch = 
          (notif.summary.en || '').toLowerCase().includes(q) ||
          (notif.summary.mr || '').toLowerCase().includes(q) ||
          (notif.summary.hi || '').toLowerCase().includes(q);
        const authMatch = (notif.issuingAuthority || '').toLowerCase().includes(q);
        const deptMatch = (notif.department || '').toLowerCase().includes(q);

        if (!titleMatch && !summaryMatch && !authMatch && !deptMatch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => new Date(b.officialAnnouncementDate).getTime() - new Date(a.officialAnnouncementDate).getTime());
  }, [searchTerm, selectedLevel, selectedCategory, selectedType, activeTab, readIds, archivedIds]);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage) || 1;
  const paginatedNotifications = isEmbeddedSection 
    ? filteredNotifications.slice(0, 3)
    : filteredNotifications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const unreadCount = VERIFIED_GOVERNMENT_NOTIFICATIONS.filter(
    n => !readIds.includes(n.id) && !archivedIds.includes(n.id)
  ).length;

  const typeLabels = NOTIFICATION_TYPE_LABELS[language];

  return (
    <section 
      id="notifications" 
      className={`relative ${isEmbeddedSection ? 'py-12 bg-white border-t border-slate-200' : 'py-10 bg-slate-50 min-h-screen'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>
                {language === 'mr'
                  ? 'अधिकृत शासकीय अधिसूचना केंद्र'
                  : language === 'hi'
                  ? 'आधिकारिक सरकारी अधिसूचना केंद्र'
                  : 'Official Government Circulars & Notifications'}
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-2xs">
                  {unreadCount} {language === 'mr' ? 'नवीन' : language === 'hi' ? 'नए' : 'NEW'}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {language === 'mr'
                ? 'शासकीय योजना व शिष्यवृत्ती सूचना'
                : language === 'hi'
                ? 'सरकारी योजना एवं छात्रवृत्ति अधिसूचनाएं'
                : 'Government Scheme & Scholarship Notifications'}
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
              {language === 'mr'
                ? 'नवीन योजनांची घोषणा, अर्ज भरण्याची अंतिम मुदत, पात्रता बदल व शासन निर्णयांचे केंद्रीय संकलन.'
                : language === 'hi'
                ? 'नवीन योजना घोषणा, आवेदन की अंतिम तिथि, पात्रता में परिवर्तन एवं सरकारी आदेशों का एकीकृत संग्रह।'
                : 'All verified official announcements, application deadlines, eligibility updates, and government circulars in one centralized hub.'}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 flex-wrap">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Mark all notifications as read"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {language === 'mr' ? 'सर्व वाचल्याचे चिन्हांकित करा' : language === 'hi' ? 'सभी को पढ़ा हुआ मानें' : 'Mark all read'}
                </span>
              </button>
            )}

            {isEmbeddedSection && onViewAllNotifications && (
              <button
                onClick={onViewAllNotifications}
                className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>{language === 'mr' ? 'सर्व सूचना पहा' : language === 'hi' ? 'सभी अधिसूचनाएं देखें' : 'View All Notifications'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Filter Controls (Only in Full View) ── */}
        {!isEmbeddedSection && (
          <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs mb-8 space-y-4">
            
            {/* Status Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto scrollbar-none">
              <button
                onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'all'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{language === 'mr' ? 'सर्व चालू सूचना' : language === 'hi' ? 'सभी सक्रिय' : 'All Active'}</span>
                <span className="px-1.5 py-0.5 rounded-full text-2xs bg-white/20 text-white font-mono">
                  {VERIFIED_GOVERNMENT_NOTIFICATIONS.filter(n => !archivedIds.includes(n.id)).length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('unread'); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'unread'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'नवीन / न वाचलेल्या' : language === 'hi' ? 'नई / अपठित' : 'New / Unread'}</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-2xs bg-slate-950 text-white font-mono">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveTab('archived'); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'archived'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'जतन / संग्रहित' : language === 'hi' ? 'सहेजी गई' : 'Archived'}</span>
                <span className="px-1.5 py-0.5 rounded-full text-2xs bg-white/20 text-white font-mono">
                  {archivedIds.length}
                </span>
              </button>
            </div>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
              {/* Search Bar */}
              <div className="lg:col-span-5 relative">
                <Search className="w-4 h-4 text-blue-900 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder={
                    language === 'mr'
                      ? 'अधिसूचना, विभाग किंवा योजनेचे नाव शोधा...'
                      : language === 'hi'
                      ? 'अधिसूचना, विभाग या योजना खोजें...'
                      : 'Search notices by title, department, or keyword...'
                  }
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/15"
                />
              </div>

              {/* Level Filter */}
              <div className="lg:col-span-2 relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => { setSelectedLevel(e.target.value); setCurrentPage(1); }}
                  aria-label="Filter by Government Level"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-900 cursor-pointer"
                >
                  <option value="all">{language === 'mr' ? 'सर्व शासन स्तर' : language === 'hi' ? 'सभी शासन स्तर' : 'All Levels'}</option>
                  <option value="Central">{language === 'mr' ? 'भारत सरकार (Central)' : language === 'hi' ? 'केंद्र सरकार (Central)' : 'Central Government'}</option>
                  <option value="Maharashtra">{language === 'mr' ? 'महाराष्ट्र शासन' : language === 'hi' ? 'महाराष्ट्र शासन' : 'Maharashtra State'}</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="lg:col-span-3 relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  aria-label="Filter by Category"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-900 cursor-pointer"
                >
                  <option value="all">{language === 'mr' ? 'सर्व योजना वर्ग' : language === 'hi' ? 'सभी श्रेणियां' : 'All Categories'}</option>
                  <option value="scholarships">🎓 {language === 'mr' ? 'शिष्यवृत्ती' : language === 'hi' ? 'छात्रवृत्ति' : 'Scholarships'}</option>
                  <option value="farmers">🌾 {language === 'mr' ? 'शेतकरी' : language === 'hi' ? 'किसान' : 'Farmers'}</option>
                  <option value="women">👩 {language === 'mr' ? 'महिला' : language === 'hi' ? 'महिला' : 'Women'}</option>
                  <option value="healthcare">🏥 {language === 'mr' ? 'आरोग्य' : language === 'hi' ? 'स्वास्थ्य' : 'Healthcare'}</option>
                  <option value="employment">💼 {language === 'mr' ? 'रोजगार व कौशल्य' : language === 'hi' ? 'रोजगार' : 'Employment'}</option>
                  <option value="seniors">👴 {language === 'mr' ? 'ज्येष्ठ नागरिक' : language === 'hi' ? 'वरिष्ठ नागरिक' : 'Senior Citizens'}</option>
                </select>
              </div>

              {/* Notification Type Filter */}
              <div className="lg:col-span-2 relative">
                <select
                  value={selectedType}
                  onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
                  aria-label="Filter by Notification Type"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-900 cursor-pointer"
                >
                  <option value="all">{typeLabels.all}</option>
                  <option value="application_dates">{typeLabels.application_dates}</option>
                  <option value="new_scheme">{typeLabels.new_scheme}</option>
                  <option value="circular_guideline">{typeLabels.circular_guideline}</option>
                  <option value="eligibility_change">{typeLabels.eligibility_change}</option>
                  <option value="beneficiary_update">{typeLabels.beneficiary_update}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Notification Cards Grid ── */}
        {paginatedNotifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedNotifications.map((notif) => {
              const isRead = readIds.includes(notif.id);
              const isArchived = archivedIds.includes(notif.id);
              const notifTitle = notif.title[language] || notif.title.en;
              const notifSummary = notif.summary[language] || notif.summary.en;

              return (
                <div
                  key={notif.id}
                  className={`rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden bg-white ${
                    !isRead
                      ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20'
                      : 'border-slate-200 hover:border-blue-900/30 hover:shadow-lg'
                  }`}
                >
                  {/* Top Header Badge Row */}
                  <div className="p-4 pb-3 flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {!isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>NEW</span>
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        notif.level === 'Maharashtra'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-blue-50 text-blue-900 border-blue-200'
                      }`}>
                        {notif.level === 'Maharashtra' ? 'महाराष्ट्र शासन' : 'भारत सरकार'}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                        {notif.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleRead(notif.id)}
                        title={isRead ? 'Mark as unread' : 'Mark as read'}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isRead
                            ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                            : 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleArchive(notif.id)}
                        title={isArchived ? 'Unarchive' : 'Archive'}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isArchived
                            ? 'text-blue-900 bg-blue-50'
                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 pb-4 flex-1 flex flex-col space-y-3">
                    {/* Notification Type & Circular Badge */}
                    <div className="flex items-center justify-between text-2xs text-slate-500 font-semibold">
                      <span className="text-blue-900 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                        {typeLabels[notif.notificationType] || notif.notificationType}
                      </span>
                      {notif.officialCircularNo && (
                        <span className="font-mono text-slate-400">
                          {notif.officialCircularNo}
                        </span>
                      )}
                    </div>

                    {/* Notification Title */}
                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug line-clamp-2">
                      {notifTitle}
                    </h3>

                    {/* Summary */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {notifSummary}
                    </p>

                    {/* Application Deadline Highlight (if announced) */}
                    {notif.applicationDeadline && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-rose-600" />
                          <span>{language === 'mr' ? 'अंतिम मुदत:' : language === 'hi' ? 'अंतिम तिथि:' : 'Deadline:'}</span>
                        </span>
                        <span className="font-black font-mono">{notif.applicationDeadline}</span>
                      </div>
                    )}

                    {/* Authority */}
                    <div className="flex items-center gap-1.5 text-2xs text-slate-500 font-medium mt-auto pt-2">
                      <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{notif.issuingAuthority}</span>
                    </div>

                    {/* Date Transparency Grid (Requirement 5) */}
                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-medium">
                      <div>
                        <span className="text-slate-400 block font-semibold">
                          {language === 'mr' ? 'शासकीय घोषणा:' : language === 'hi' ? 'घोषणा तिथि:' : 'Govt Date:'}
                        </span>
                        <span className="font-bold text-slate-700">{notif.officialAnnouncementDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block font-semibold">
                          {language === 'mr' ? 'सत्यापित दिनांक:' : language === 'hi' ? 'सत्यापित तिथि:' : 'Verified On:'}
                        </span>
                        <span className="font-bold text-emerald-700">{notif.lastVerifiedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-3.5 px-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Related Scheme Link */}
                    {notif.schemeId && onViewSchemeDetails ? (
                      <button
                        onClick={() => onViewSchemeDetails(notif.schemeId!)}
                        className="text-xs font-bold text-blue-900 hover:text-amber-600 cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{language === 'mr' ? 'योजनेचा तपशील' : language === 'hi' ? 'योजना विवरण' : 'Scheme Details'}</span>
                      </button>
                    ) : (
                      <span />
                    )}

                    {/* Official Portal Notice Link */}
                    <a
                      href={notif.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <span>
                        {language === 'mr' ? 'अधिकृत सूचना' : language === 'hi' ? 'सरकारी नोटिस' : 'Official Notice'}
                      </span>
                      <ExternalLink className="w-3 h-3 text-amber-300" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-6 bg-white rounded-3xl border-2 border-dashed border-slate-200 max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {language === 'mr' ? 'कोणतीही अधिसूचना आढळली नाही' : language === 'hi' ? 'कोई अधिसूचना नहीं मिली' : 'No notifications found'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'mr'
                ? 'निवडलेले फिल्टर्स रीसेट करून सर्व चालू सूचना तपासा.'
                : language === 'hi'
                ? 'फ़िल्टर रीसेट करके सभी सक्रिय सूचनाएं देखें।'
                : 'Try clearing your filters or search keywords.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedLevel('all');
                setSelectedCategory('all');
                setSelectedType('all');
                setActiveTab('all');
              }}
              className="px-4 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'फिल्टर्स रीसेट करा' : language === 'hi' ? 'रीसेट करें' : 'Reset Filters'}</span>
            </button>
          </div>
        )}

        {/* Pagination (Only in Full View) */}
        {!isEmbeddedSection && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-slate-700 px-3">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-300 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 text-slate-700 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
