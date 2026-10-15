/**
 * Sahayakon 2.0 Notification Service & Deduplication Engine
 * Manages in-app alerts, SMS/Email/WhatsApp adapter stubs,
 * duplicate prevention, consent-based dispatch, and delivery audit logs.
 */

// Delivery logs store
const deliveryLogs = [];
// Deduplication tracker: Set of keys `userId:schemeId:channel:dayBucket`
const dispatchedDeduplicationCache = new Set();

// Default notification preferences
export const DEFAULT_NOTIFICATION_PREFERENCES = {
  inApp: true,
  email: false,
  sms: false,
  whatsapp: false,
  remind30Days: true,
  remind7Days: true,
  remind1Day: true,
  consentGiven: false,
};

const userPreferences = new Map();

export const notificationService = {
  /**
   * Get User Preferences
   */
  getPreferences(userId = 'citizen-guest') {
    return userPreferences.get(userId) || { ...DEFAULT_NOTIFICATION_PREFERENCES };
  },

  /**
   * Save User Preferences with Explicit Consent
   */
  updatePreferences(userId = 'citizen-guest', prefs) {
    const updated = {
      ...this.getPreferences(userId),
      ...prefs,
      consentTimestamp: prefs.consentGiven ? new Date().toISOString() : undefined,
    };
    userPreferences.set(userId, updated);
    return updated;
  },

  /**
   * Withdraw Consent
   */
  withdrawConsent(userId = 'citizen-guest') {
    const updated = {
      ...this.getPreferences(userId),
      consentGiven: false,
      sms: false,
      whatsapp: false,
      email: false,
    };
    userPreferences.set(userId, updated);
    return {
      success: true,
      message: 'Consent withdrawn successfully. External notifications disabled.',
      preferences: updated,
    };
  },

  /**
   * Dispatch a notification with deduplication and compliance checks
   */
  dispatchNotification({
    userId = 'citizen-guest',
    scheme,
    channel = 'in-app',
    daysRemaining,
    customMessage,
  }) {
    const prefs = this.getPreferences(userId);

    // If external channel (SMS/WhatsApp/Email), verify explicit consent
    if (channel !== 'in-app' && !prefs.consentGiven) {
      return {
        dispatched: false,
        reason: 'Consent not granted by user for external notifications.',
      };
    }

    // Deduplication check: prevent sending duplicate notification for same scheme on same day
    const today = new Date().toISOString().split('T')[0];
    const dedupKey = `${userId}:${scheme.id}:${channel}:${daysRemaining ?? 'update'}:${today}`;

    if (dispatchedDeduplicationCache.has(dedupKey)) {
      return {
        dispatched: false,
        reason: 'Duplicate notification suppressed (already dispatched in current window).',
        dedupKey,
      };
    }

    // Standardized Compliant Message Template
    const defaultEn = `SAHAYAKON: "${scheme.title.en}" may match your profile. Check the verified eligibility conditions, required documents, application deadline (${scheme.applicationDeadline || 'Announced soon'}), and official application link in your dashboard.`;
    const defaultMr = `सहायक (SAHAYAKON): "${scheme.title.mr}" ही योजना आपल्या प्रोफाईलसाठी लागू होऊ शकते. पात्रता अटी, आवश्यक कागदपत्रे व मुदत (${scheme.applicationDeadline || 'लवकरच'}) आपल्या डॅशबोर्डवर तपासा.`;
    const defaultHi = `सहायक (SAHAYAKON): "${scheme.title.hi}" आपके प्रोफाइल से मेल खा सकती है। पात्रता शर्तें, अनिवार्य दस्तावेज और अंतिम तिथि (${scheme.applicationDeadline || 'शीघ्र'}) अपने डैशबोर्ड पर जांचें।`;

    const logEntry = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      userId,
      schemeId: scheme.id,
      channel,
      status: channel === 'in-app' ? 'delivered' : 'queued',
      title: {
        en: `Deadline Alert: ${scheme.title.en}`,
        mr: `मुदत सूचना: ${scheme.title.mr}`,
        hi: `अंतिम तिथि सूचना: ${scheme.title.hi}`,
      },
      message: customMessage || {
        en: defaultEn,
        mr: defaultMr,
        hi: defaultHi,
      },
      timestamp: new Date().toISOString(),
      dedupKey,
      read: false,
      daysRemaining,
    };

    deliveryLogs.unshift(logEntry);
    dispatchedDeduplicationCache.add(dedupKey);

    return {
      dispatched: true,
      logEntry,
    };
  },

  /**
   * Scan saved schemes and generate upcoming deadline alerts (30d, 7d, 1d)
   */
  checkUpcomingDeadlines(userId = 'citizen-guest', savedSchemes = []) {
    const prefs = this.getPreferences(userId);
    const results = [];
    const now = new Date();

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
          const res = this.dispatchNotification({
            userId,
            scheme,
            channel: 'in-app',
            daysRemaining: diffDays,
          });
          results.push(res);
        }
      }
    });

    return results;
  },

  /**
   * Get user notification delivery logs / inbox
   */
  getUserNotifications(userId = 'citizen-guest') {
    return deliveryLogs.filter((l) => l.userId === userId);
  },

  /**
   * Mark notification as read
   */
  markAsRead(logId) {
    const entry = deliveryLogs.find((l) => l.id === logId);
    if (entry) entry.read = true;
    return entry;
  },

  /**
   * Clear all notification logs for user
   */
  clearNotifications(userId = 'citizen-guest') {
    for (let i = deliveryLogs.length - 1; i >= 0; i--) {
      if (deliveryLogs[i].userId === userId) {
        deliveryLogs.splice(i, 1);
      }
    }
    return { success: true };
  },
};
