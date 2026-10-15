import type { 
  NotificationDeliveryLog, 
  NotificationPreference, 
  SchemeRecord, 
  CitizenProfile,
  NotificationChannel
} from '../types';

const STORAGE_PREFS_KEY = 'sahayakon_notification_preferences';
const STORAGE_LOGS_KEY = 'sahayakon_notification_delivery_logs';

export const DEFAULT_PREFERENCES: NotificationPreference = {
  inApp: true,
  email: false,
  sms: false,
  whatsapp: false,
  remind30Days: true,
  remind7Days: true,
  remind1Day: true,
  consentGiven: false,
};

export function getStoredPreferences(): NotificationPreference {
  try {
    const raw = localStorage.getItem(STORAGE_PREFS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return { ...DEFAULT_PREFERENCES };
}

export function saveStoredPreferences(prefs: NotificationPreference): void {
  localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(prefs));
  // Sync to backend asynchronously
  fetch('/api/notifications/preferences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'citizen-guest', preferences: prefs }),
  }).catch(() => {});
}

export function withdrawNotificationConsent(): NotificationPreference {
  const updated: NotificationPreference = {
    ...getStoredPreferences(),
    consentGiven: false,
    sms: false,
    email: false,
    whatsapp: false,
  };
  localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(updated));

  fetch('/api/notifications/withdraw-consent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'citizen-guest' }),
  }).catch(() => {});

  return updated;
}

export function getStoredDeliveryLogs(): NotificationDeliveryLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
}

export function saveStoredDeliveryLogs(logs: NotificationDeliveryLog[]): void {
  localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(logs));
}

export function markLogAsRead(logId: string): void {
  const logs = getStoredDeliveryLogs();
  const updated = logs.map(l => l.id === logId ? { ...l, read: true } : l);
  saveStoredDeliveryLogs(updated);

  fetch(`/api/notifications/${logId}/read`, { method: 'PUT' }).catch(() => {});
}

export function clearAllDeliveryLogs(): void {
  localStorage.removeItem(STORAGE_LOGS_KEY);
  fetch('/api/notifications', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'citizen-guest' }),
  }).catch(() => {});
}

/**
 * Scan saved schemes for deadline notifications with deduplication
 */
export function checkAndGenerateDeadlineAlerts(
  savedSchemes: SchemeRecord[],
  _profile?: CitizenProfile | null
): NotificationDeliveryLog[] {
  const prefs = getStoredPreferences();
  if (!prefs.inApp) return getStoredDeliveryLogs();

  const existingLogs = getStoredDeliveryLogs();
  const newLogs: NotificationDeliveryLog[] = [...existingLogs];
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  savedSchemes.forEach((scheme) => {
    if (!scheme.applicationDeadline) return;

    const deadline = new Date(scheme.applicationDeadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= 30) {
      let shouldTrigger = false;
      if (diffDays <= 1 && prefs.remind1Day) shouldTrigger = true;
      else if (diffDays <= 7 && prefs.remind7Days) shouldTrigger = true;
      else if (diffDays <= 30 && prefs.remind30Days) shouldTrigger = true;

      if (shouldTrigger) {
        const dedupKey = `user:${scheme.id}:in-app:${diffDays}:${todayStr}`;
        const alreadyDispatched = newLogs.some(l => l.dedupKey === dedupKey);

        if (!alreadyDispatched) {
          const sTitle = scheme.title || scheme.name || { en: scheme.id, mr: scheme.id, hi: scheme.id };
          const logEntry: NotificationDeliveryLog = {
            id: `alert-${scheme.id}-${diffDays}-${Date.now()}`,
            schemeId: scheme.id,
            channel: 'in-app',
            status: 'delivered',
            title: {
              en: `⏰ Deadline Alert: ${diffDays} Days Remaining for ${sTitle.en}`,
              mr: `⏰ मुदत सूचना: ${sTitle.mr} साठी ${diffDays} दिवस शिल्लक`,
              hi: `⏰ अंतिम तिथि सूचना: ${sTitle.hi} के लिए ${diffDays} दिन शेष`,
            },
            message: {
              en: `SAHAYAKON: "${sTitle.en}" application closing date is approaching (${scheme.applicationDeadline}). Ensure mandatory documents are verified before final submission.`,
              mr: `सहायक: "${sTitle.mr}" ची अंतिम तारीख (${scheme.applicationDeadline}) जवळ येत आहे. अधिकृत पोर्टलवर मुदतीपूर्वी अर्ज सादर करा.`,
              hi: `सहायक: "${sTitle.hi}" की अंतिम तिथि (${scheme.applicationDeadline}) निकट है। समय से पूर्व आधिकारिक पोर्टल पर आवेदन पूर्ण करें।`,
            },
            timestamp: new Date().toISOString(),
            dedupKey,
            read: false,
            daysRemaining: diffDays,
          };

          newLogs.unshift(logEntry);
        }
      }
    }
  });

  saveStoredDeliveryLogs(newLogs);
  return newLogs;
}

export function hasConsent(): boolean {
  return Boolean(getStoredPreferences().consentGiven);
}

export function recordDelivery(notificationId: string, channel: NotificationChannel, recipient: string): NotificationDeliveryLog {
  const masked = recipient.length > 4 ? recipient.substring(0, 2) + '******' + recipient.substring(recipient.length - 2) : '***';
  const log: NotificationDeliveryLog = {
    id: `log-${Date.now()}`,
    notificationId,
    recipient: masked,
    channel,
    status: 'delivered',
    title: { en: 'Delivered Notification', mr: 'वितरित सूचना', hi: 'वितरित सूचना' },
    message: { en: 'Notification delivered successfully', mr: 'सूचना यशस्वीरीत्या पाठवली', hi: 'सूचना सफलतापूर्वक भेजी गई' },
    timestamp: new Date().toISOString(),
    read: false,
  };
  const logs = getStoredDeliveryLogs();
  saveStoredDeliveryLogs([log, ...logs]);
  return log;
}

export function getDeliveryLogs(): NotificationDeliveryLog[] {
  return getStoredDeliveryLogs();
}

export function getStoredNotifications(): any[] {
  const logs = getStoredDeliveryLogs();
  return logs.map((l) => ({
    id: l.id,
    title: l.title.en,
    message: l.message.en,
    timestamp: l.timestamp,
    read: l.read,
    priority: 'medium',
    notificationType: 'general',
  }));
}

export function saveStoredNotifications(notifs: any[]): void {
  const mappedLogs: NotificationDeliveryLog[] = notifs.map((n) => ({
    id: n.id,
    schemeId: n.schemeId || 'general',
    dedupKey: `manual:${n.id}`,
    channel: 'in-app',
    status: 'delivered',
    title: { en: n.title, mr: n.title, hi: n.title },
    message: { en: n.message, mr: n.message, hi: n.message },
    timestamp: n.timestamp,
    read: n.read,
    notificationType: n.notificationType,
  }));
  saveStoredDeliveryLogs(mappedLogs);
}

export function syncCitizenNotifications(profile: CitizenProfile, schemes: SchemeRecord[]): any[] {
  const prefs = getStoredPreferences();
  if (!prefs.consentGiven && !prefs.inApp) return [];

  return checkAndGenerateDeadlineAlerts(schemes, profile).map((l) => ({
    id: l.id,
    schemeId: l.schemeId,
    title: l.title.en,
    message: l.message.en,
    notificationType: l.daysRemaining !== undefined ? 'deadline_reminder' : 'general',
    read: l.read,
    timestamp: l.timestamp,
  }));
}
