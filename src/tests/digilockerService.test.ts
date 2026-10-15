import './setup';
import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getDigiLockerAuthUrl, 
  exchangeDigiLockerToken, 
  fetchDigiLockerDocuments, 
  addManualDocumentRecord, 
  disconnectDigiLocker,
  isDocumentTypeAvailable,
  getStoredDigiLockerSession,
  saveStoredDigiLockerSession,
  saveStoredDigiLockerDocs,
  DEFAULT_DEMO_DOCUMENTS
} from '../services/digilockerService';
import type { DigiLockerDocument } from '../types';

describe('DigiLocker Service & Sandbox Simulation Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('generates an OAuth 2.0 authorization URL adhering to API Setu DigiLocker specification', () => {
    const authUrl = getDigiLockerAuthUrl();
    expect(authUrl).toContain('client_id=');
    expect(authUrl).toContain('response_type=code');
    expect(authUrl).toContain('state=');
    expect(authUrl).toContain('redirect_uri=');
    const savedState = sessionStorage.getItem('digilocker_oauth_state');
    expect(savedState).toBeTruthy();
  });

  it('exchanges authorization code and initiates a demo session with verified sample documents', async () => {
    const state = 'test_state_123';
    sessionStorage.setItem('digilocker_oauth_state', state);

    const session = await exchangeDigiLockerToken('demo_auth_code_xyz', state);
    expect(session.isConnected).toBe(true);
    expect(session.isDemoMode).toBe(true);
    expect(session.totalDocumentsCount).toBeGreaterThanOrEqual(4);

    const docs = await fetchDigiLockerDocuments();
    expect(docs.length).toBeGreaterThanOrEqual(4);

    // Verify sample documents contain essential Maharashtra certificates
    const docCodes = docs.map((d) => d.docCode);
    expect(docCodes).toContain('income_cert');
    expect(docCodes).toContain('domicile_cert');
  });

  it('does NOT expose raw Aadhaar numbers or OTP credentials in documents', () => {
    DEFAULT_DEMO_DOCUMENTS.forEach((doc) => {
      const jsonStr = JSON.stringify(doc);
      const aadhaarPattern = /\b\d{12}\b/;
      expect(aadhaarPattern.test(jsonStr)).toBe(false);
      expect(doc.verificationStatus).toBe('verified_digilocker');
      expect(doc.isDemoRecord).toBe(true);
    });
  });

  it('allows manual addition of verified documents without requiring official OAuth', () => {
    const customDoc: Omit<DigiLockerDocument, 'docId' | 'isDemoRecord' | 'source'> = {
      docCode: 'satbara_7_12',
      name: {
        en: 'Farmer 7/12 Extract (Satbara)',
        mr: 'शेतकरी ७/१२ उतारा',
        hi: 'किसान 7/12 खतौनी'
      },
      category: 'agriculture',
      issuer: 'Revenue Department, Government of Maharashtra',
      issueDate: '2026-01-15',
      verificationStatus: 'uploaded_manual',
      metadataSummary: 'Survey No: 42/1 | Area: 1.2 Hectares',
    };

    const added = addManualDocumentRecord(customDoc);
    expect(added.docId).toBeDefined();
    expect(added.verificationStatus).toBe('uploaded_manual');
    expect(added.source).toBe('manual');

    const session = getStoredDigiLockerSession();
    expect(session.totalDocumentsCount).toBeGreaterThan(0);
  });

  it('checks document availability accurately by docCode', () => {
    saveStoredDigiLockerDocs(DEFAULT_DEMO_DOCUMENTS);
    expect(isDocumentTypeAvailable('income_cert')).toBe(true);
    expect(isDocumentTypeAvailable('domicile_cert')).toBe(true);
    expect(isDocumentTypeAvailable('passport_cert')).toBe(false);
  });

  it('disconnects and completely revokes DigiLocker session & clears storage', () => {
    saveStoredDigiLockerSession({
      isConnected: true,
      isDemoMode: true,
      totalDocumentsCount: DEFAULT_DEMO_DOCUMENTS.length,
    });
    saveStoredDigiLockerDocs(DEFAULT_DEMO_DOCUMENTS);

    expect(getStoredDigiLockerSession().isConnected).toBe(true);

    disconnectDigiLocker();

    const sessionAfter = getStoredDigiLockerSession();
    expect(sessionAfter.isConnected).toBe(false);
    expect(sessionAfter.totalDocumentsCount).toBe(0);
  });
});
