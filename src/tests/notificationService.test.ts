import './setup';
import { describe, it, expect, beforeEach } from 'vitest';
import { 
  syncCitizenNotifications, 
  recordDelivery, 
  withdrawNotificationConsent, 
  hasConsent,
  getDeliveryLogs,
  getStoredNotifications,
  saveStoredNotifications,
  saveStoredPreferences,
  getStoredPreferences
} from '../services/notificationManager';
import { UNIFIED_SCHEMES_SEED } from '../data/unifiedSchemesData';
import type { CitizenProfile, SchemeRecord } from '../types';

describe('Notification Service & Deduplication Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const sampleCitizen: CitizenProfile = {
    id: 'cit-test-02',
    name: 'Pooja Patil',
    mobile: '9876543210',
    state: 'Maharashtra',
    district: 'Kolhapur',
    gender: 'Female',
    socialCategory: 'OBC',
    minorityStatus: 'None',
    familyIncome: 300000,
    occupation: 'Student',
    farmerStatus: 'None',
    isStudent: true,
    educationLevel: 'Undergraduate',
    previousMarksPercentage: 82,
    disabilityStatus: false,
    existingBenefitsReceived: [],
    availableDocCodes: ['income_cert', 'domicile_cert'],
    consentGiven: true,
    dataSharingPreferences: {
      allowDigiLockerSync: true,
      allowNotificationDispatch: true,
      allowAnonymousAnalytics: false,
    },
    savedSchemeIds: [],
    appliedSchemeIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('generates deadline alerts and matched notifications for eligible schemes', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const deadlineScheme: SchemeRecord = {
      ...UNIFIED_SCHEMES_SEED[0],
      id: 'test-scheme-5d',
      applicationDeadline: futureDate.toISOString().split('T')[0],
      status: 'Open',
    };

    const notifications = syncCitizenNotifications(sampleCitizen, [deadlineScheme]);
    expect(notifications.length).toBeGreaterThan(0);
    const deadlineAlert = notifications.find((n) => n.notificationType === 'deadline_reminder');
    expect(deadlineAlert).toBeDefined();
    expect(deadlineAlert?.schemeId).toBe('test-scheme-5d');
    expect(deadlineAlert?.title).toContain('Deadline');
  });

  it('suppresses duplicate notifications sent within 24 hours (Deduplication)', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const deadlineScheme: SchemeRecord = {
      ...UNIFIED_SCHEMES_SEED[0],
      id: 'test-dedup-scheme',
      applicationDeadline: futureDate.toISOString().split('T')[0],
      status: 'Open',
    };

    // First run creates notifications
    const firstRun = syncCitizenNotifications(sampleCitizen, [deadlineScheme]);
    expect(firstRun.length).toBeGreaterThan(0);

    // Second run with the same scheme should NOT create duplicate notifications
    const secondRun = syncCitizenNotifications(sampleCitizen, [deadlineScheme]);
    const duplicateIds = secondRun.filter((n) => n.schemeId === 'test-dedup-scheme');
    expect(duplicateIds.length).toBe(firstRun.length); // Count should not have doubled
  });

  it('does NOT generate notifications when citizen withdraws consent and opts out', () => {
    withdrawNotificationConsent();
    saveStoredPreferences({
      ...getStoredPreferences(),
      inApp: false,
      consentGiven: false,
    });
    expect(hasConsent()).toBe(false);

    const deadlineScheme: SchemeRecord = {
      ...UNIFIED_SCHEMES_SEED[0],
      id: 'test-no-consent-scheme',
      status: 'Open',
    };

    const notifications = syncCitizenNotifications(sampleCitizen, [deadlineScheme]);
    expect(notifications.length).toBe(0);
  });

  it('maintains auditable delivery logs with masked recipient details', () => {
    const log = recordDelivery('notif-sample-1', 'sms', '9876543210');
    expect(log.channel).toBe('sms');
    expect(log.status).toBe('delivered');
    // Ensure mobile is masked for privacy
    expect(log.recipient).toContain('***');
    expect(log.recipient).not.toBe('9876543210');

    const allLogs = getDeliveryLogs();
    expect(allLogs.some((l) => l.notificationId === 'notif-sample-1')).toBe(true);
  });

  it('persists and retrieves notifications in local storage correctly', () => {
    saveStoredNotifications([
      {
        id: 'manual-notif-1',
        title: 'Document Update Required',
        message: 'Please upload income certificate',
        timestamp: new Date().toISOString(),
        read: false,
        notificationType: 'document_expiry',
      },
    ]);

    const loaded = getStoredNotifications();
    expect(loaded.length).toBe(1);
    expect(loaded[0].id).toBe('manual-notif-1');
  });
});
