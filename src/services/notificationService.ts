import type { 
  StudentNotification, 
  Scholarship, 
  StudentProfile, 
  DeadlineReminderConfig 
} from '../types';

const STORAGE_KEY_NOTIFICATIONS = 'sahayak_student_notifications';
const STORAGE_KEY_REMINDER_CONFIG = 'sahayak_reminder_config';

export function getStoredReminderConfig(): DeadlineReminderConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REMINDER_CONFIG);
    if (raw) return JSON.parse(raw);
  } catch {
    // default
  }
  return {
    inAppEnabled: true,
    emailEnabled: false,
    smsEnabled: false,
    remind30Days: true,
    remind7Days: true,
    remind1Day: true,
  };
}

export function saveStoredReminderConfig(config: DeadlineReminderConfig): void {
  localStorage.setItem(STORAGE_KEY_REMINDER_CONFIG, JSON.stringify(config));
}

export function getStoredNotifications(): StudentNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // default
  }
  return [];
}

export function saveStoredNotifications(notifications: StudentNotification[]): void {
  localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
}

export function markNotificationAsRead(id: string): void {
  const notifs = getStoredNotifications();
  const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
  saveStoredNotifications(updated);
}

export function clearAllNotifications(): void {
  localStorage.removeItem(STORAGE_KEY_NOTIFICATIONS);
}

/**
 * Scan scholarships against student's saved list and generate upcoming deadline notifications
 */
export function generateDeadlineNotifications(
  savedScholarships: Scholarship[],
  student: StudentProfile | null
): StudentNotification[] {
  const config = getStoredReminderConfig();
  if (!config.inAppEnabled) return getStoredNotifications();

  const existing = getStoredNotifications();
  const newNotifs: StudentNotification[] = [...existing];
  const now = new Date();

  savedScholarships.forEach((scheme) => {
    if (!scheme.applicationDeadline) return;

    const deadline = new Date(scheme.applicationDeadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= 30) {
      const shouldRemind = 
        (diffDays <= 1 && config.remind1Day) ||
        (diffDays <= 7 && config.remind7Days) ||
        (diffDays <= 30 && config.remind30Days);

      if (shouldRemind) {
        const notifId = `deadline-${scheme.id}-${diffDays}`;
        const alreadyExists = newNotifs.some(n => n.id === notifId);

        if (!alreadyExists) {
          const sTitle = scheme.name || scheme.title || { en: scheme.id, mr: scheme.id, hi: scheme.id };
          newNotifs.unshift({
            id: notifId,
            channel: 'in-app',
            status: 'delivered',
            scholarshipId: scheme.id,
            daysRemaining: diffDays,
            type: 'deadline',
            timestamp: new Date().toISOString(),
            read: false,
            title: {
              en: `Deadline Approaching: ${sTitle.en}`,
              mr: `अर्ज अंतिम मुदत जवळ येत आहे: ${sTitle.mr}`,
              hi: `आवेदन की अंतिम तिथि निकट है: ${sTitle.hi}`,
            },
            message: {
              en: diffDays === 0 
                ? `Today is the final day to submit your application for ${sTitle.en}. Apply on official portal before portal closes.`
                : `Only ${diffDays} day(s) left until the application deadline (${scheme.applicationDeadline}) for ${sTitle.en}. Gather your documents now.`,
              mr: diffDays === 0
                ? `${sTitle.mr} साठी अर्ज करण्याचा आज अंतिम दिवस आहे. अधिकृत पोर्टलवर त्वरित अर्ज करा.`
                : `${sTitle.mr} साठी अर्ज भरण्यास केवळ ${diffDays} दिवस शिल्लक आहेत (अंतिम मुदत: ${scheme.applicationDeadline}).`,
              hi: diffDays === 0
                ? `${sTitle.hi} के लिए आवेदन करने का आज अंतिम दिन है।`
                : `${sTitle.hi} के लिए आवेदन की अंतिम तिथि (${scheme.applicationDeadline}) में केवल ${diffDays} दिन शेष हैं।`,
            },
          });
        }
      }
    }
  });

  // Check document readiness notification if student has profile
  if (student && student.institutionName === '') {
    const docReminderId = `profile-incomplete-${student.id}`;
    if (!newNotifs.some(n => n.id === docReminderId)) {
      newNotifs.unshift({
        id: docReminderId,
        channel: 'in-app',
        status: 'delivered',
        type: 'document_reminder',
        timestamp: new Date().toISOString(),
        read: false,
        title: {
          en: 'Complete Your Student Profile for Accurate Scholarship Matches',
          mr: 'अचूक शिष्यवृत्ती शिफारसींसाठी आपली विद्यार्थी प्रोफाइल पूर्ण करा',
          hi: 'सटीक छात्रवृत्ति मिलान के लिए अपनी प्रोफाइल पूरी करें',
        },
        message: {
          en: 'Add your college, category, and past exam marks to get 100% matched government scholarships.',
          mr: 'आपले महाविद्यालय, प्रवर्ग व गुण प्रविष्ट करा जेणेकरून आपणास योग्य शिष्यवृत्ती शोधता येईल.',
          hi: 'सटीक परिणाम पाने के लिए अपने कॉलेज, श्रेणी और अंक दर्ज करें।',
        },
      });
    }
  }

  saveStoredNotifications(newNotifs);
  return newNotifs;
}
