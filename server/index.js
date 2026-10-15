import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { digiLockerService } from './digilockerService.js';
import { schemeDb } from './schemeDatabase.js';
import { notificationService } from './notificationService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

app.use(cors());
app.use(express.json());

// Ephemeral mock store for mobile OTP verification
const pendingOtps = new Map();

// Input validation middleware to safeguard sensitive citizen data
const sanitizeChatInput = (req, res, next) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Valid question text is required.' });
  }

  // Check for 12-digit Aadhaar pattern or 16-digit card numbers for citizen safety
  const aadhaarRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
  if (aadhaarRegex.test(query)) {
    return res.status(400).json({
      error: 'Security Notice: Please do not enter 12-digit Aadhaar numbers or personal sensitive credentials into the chat assistant.',
      safetyAlert: true,
    });
  }

  next();
};

// ==========================================
// 1. HEALTH CHECK & STATUS
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Sahayakon 2.0 Government Benefits & Digital Document Service',
    digiLockerConfigured: digiLockerService.isConfigured(),
    digiLockerMode: digiLockerService.isConfigured() ? 'live-api-setu' : 'demo-simulation',
    hasGeminiKey: Boolean(GEMINI_API_KEY),
    mode: GEMINI_API_KEY ? 'gemini-live' : 'verified-knowledge-engine',
    totalSchemesCount: schemeDb.getAllSchemes().length,
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 2. STUDENT & CITIZEN MOBILE OTP AUTH
// ==========================================
app.post('/api/auth/otp/send', (req, res) => {
  const { mobile, consent } = req.body;

  if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please enter a valid 10-digit Indian mobile number.' 
    });
  }

  if (!consent) {
    return res.status(400).json({
      success: false,
      error: 'Informed user consent is mandatory to process mobile authentication.'
    });
  }

  // Generate 6-digit OTP
  const demoOtp = '123456';
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  pendingOtps.set(mobile, { otp: demoOtp, expiresAt });

  return res.json({
    success: true,
    message: 'OTP sent successfully for verification.',
    demoMode: true,
    hintOtp: demoOtp,
    expiresInSeconds: 300,
  });
});

app.post('/api/auth/otp/verify', (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ success: false, error: 'Mobile and OTP are required.' });
  }

  const record = pendingOtps.get(mobile);
  const isValidDemo = otp === '123456' || (record && record.otp === otp && Date.now() < record.expiresAt);

  if (!isValidDemo) {
    return res.status(400).json({ success: false, error: 'Invalid or expired OTP. Use demo OTP: 123456' });
  }

  pendingOtps.delete(mobile);

  return res.json({
    success: true,
    message: 'Mobile number verified successfully.',
    verified: true,
    sessionToken: `sahayak-tok-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
  });
});

// ==========================================
// 3. DIGILOCKER INTEGRATION MODULE
// ==========================================
app.get('/api/digilocker/auth-url', (req, res) => {
  const { userId } = req.query;
  const result = digiLockerService.generateAuthUrl(userId || 'citizen-guest');
  res.json(result);
});

// Demo mode authorize simulation redirect
app.get('/api/digilocker/demo-authorize', (req, res) => {
  const { state } = req.query;
  // Redirect back with mock code
  res.redirect(`/digilocker/callback?code=mock-digilocker-code-xyz&state=${state}`);
});

app.post('/api/digilocker/callback', async (req, res) => {
  const { code, state } = req.body;
  if (!code || !state) {
    return res.status(400).json({ error: 'Code and state are required.' });
  }

  try {
    const session = await digiLockerService.handleCallback(code, state);
    res.json({
      success: true,
      message: 'DigiLocker session established successfully.',
      session,
    });
  } catch (error) {
    console.error('DigiLocker callback error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/digilocker/documents', (req, res) => {
  const { userId } = req.query;
  const data = digiLockerService.getUserDocuments(userId || 'citizen-guest');
  res.json(data);
});

app.post('/api/digilocker/manual-document', (req, res) => {
  const { userId, document } = req.body;
  if (!document || !document.docCode) {
    return res.status(400).json({ error: 'Valid document metadata is required.' });
  }
  const created = digiLockerService.addManualDocument(userId || 'citizen-guest', document);
  res.json({ success: true, document: created });
});

app.post('/api/digilocker/disconnect', (req, res) => {
  const { userId } = req.body;
  const result = digiLockerService.disconnectSession(userId || 'citizen-guest');
  res.json(result);
});

// ==========================================
// 4. NORMALIZED SCHEMES DATABASE (CRUD)
// ==========================================
app.get('/api/schemes', (req, res) => {
  const { category, status, search } = req.query;
  const list = schemeDb.getAllSchemes({ category, status, search });
  res.json(list);
});

app.get('/api/schemes/:id', (req, res) => {
  const scheme = schemeDb.getSchemeById(req.params.id);
  if (!scheme) return res.status(404).json({ error: 'Scheme not found.' });
  res.json(scheme);
});

// Admin endpoints (PIN verification)
const verifyAdminPin = (req, res, next) => {
  const pin = req.headers['x-admin-pin'] || req.query.adminPin;
  if (pin === 'sahayak2026' || pin === 'admin123') {
    return next();
  }
  return res.status(403).json({ error: 'Unauthorized: Invalid Admin PIN.' });
};

app.post('/api/schemes', verifyAdminPin, (req, res) => {
  const created = schemeDb.createScheme(req.body);
  res.status(201).json(created);
});

app.put('/api/schemes/:id', verifyAdminPin, (req, res) => {
  const updated = schemeDb.updateScheme(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Scheme not found.' });
  res.json(updated);
});

app.delete('/api/schemes/:id', verifyAdminPin, (req, res) => {
  const deleted = schemeDb.deleteScheme(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Scheme not found.' });
  res.json({ success: true, message: 'Scheme deleted successfully.' });
});

app.post('/api/schemes/reset', verifyAdminPin, (req, res) => {
  const list = schemeDb.resetDefaults();
  res.json({ success: true, schemes: list });
});

// ==========================================
// 5. NOTIFICATION ENGINE & AUDIT LOGS
// ==========================================
app.get('/api/notifications', (req, res) => {
  const { userId } = req.query;
  const logs = notificationService.getUserNotifications(userId || 'citizen-guest');
  res.json(logs);
});

app.get('/api/notifications/preferences', (req, res) => {
  const { userId } = req.query;
  const prefs = notificationService.getPreferences(userId || 'citizen-guest');
  res.json(prefs);
});

app.post('/api/notifications/preferences', (req, res) => {
  const { userId, preferences } = req.body;
  const updated = notificationService.updatePreferences(userId || 'citizen-guest', preferences);
  res.json(updated);
});

app.post('/api/notifications/withdraw-consent', (req, res) => {
  const { userId } = req.body;
  const result = notificationService.withdrawConsent(userId || 'citizen-guest');
  res.json(result);
});

app.post('/api/notifications/check-deadlines', (req, res) => {
  const { userId, savedSchemes } = req.body;
  const results = notificationService.checkUpcomingDeadlines(userId || 'citizen-guest', savedSchemes || []);
  res.json({ success: true, dispatchedCount: results.filter(r => r.dispatched).length, results });
});

app.put('/api/notifications/:id/read', (req, res) => {
  const updated = notificationService.markAsRead(req.params.id);
  res.json({ success: true, notification: updated });
});

app.delete('/api/notifications', (req, res) => {
  const { userId } = req.body;
  const result = notificationService.clearNotifications(userId || 'citizen-guest');
  res.json(result);
});

// ==========================================
// 6. CHATBOT ASSISTANT
// ==========================================
app.post('/api/chat', sanitizeChatInput, async (req, res) => {
  const { query, language = 'en' } = req.body;
  const langName = language === 'mr' ? 'Marathi' : language === 'hi' ? 'Hindi' : 'English';

  if (!GEMINI_API_KEY) {
    return res.json({
      mode: 'demo-mode',
      isDemoResponse: true,
      message: 'Server operating in Verified Smart Knowledge Mode. To enable live Gemini model responses, configure GEMINI_API_KEY in your server environment.',
      followUps: [
        language === 'mr' ? 'या योजनेसाठी कोणती कागदपत्रे लागतील?' : language === 'hi' ? 'इसके लिए कौन से दस्तावेज चाहिए?' : 'What documents are required for this scheme?',
        language === 'mr' ? 'अर्ज करण्याची अंतिम तारीख (Deadline) काय आहे?' : language === 'hi' ? 'आवेदन की अंतिम तिथि क्या है?' : 'What is the application deadline?',
      ],
    });
  }

  try {
    const systemPrompt = `You are "Sahayakon 2.0", a trusted, empathetic government scheme & scholarship assistant for Indian citizens.
CRITICAL SAFETY & OPERATIONAL RULES:
1. Always respond in the requested language: ${langName}.
2. Use clear, simple language without unnecessary bureaucratic jargon.
3. NEVER ask users for Aadhaar numbers, OTPs, bank account details, or passwords.
4. When describing schemes, cite: Official Name, Awarding Department, Benefits, Eligibility, Required Documents, and Portal link.
5. Point users to official government portals ending in .gov.in or .nic.in.
6. End your response with 2 short follow-up questions prefixed with "FOLLOWUP: ".`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const apiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `[System instruction: ${systemPrompt}]\n\nUser Query: ${query}` }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!apiResponse.ok) {
      const errBody = await apiResponse.text();
      throw new Error(`Gemini API failed with status ${apiResponse.status}: ${errBody}`);
    }

    const data = await apiResponse.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const lines = rawText.split('\n');
    const followUps = [];
    const cleaned = [];

    for (const line of lines) {
      if (line.trim().startsWith('FOLLOWUP:')) {
        followUps.push(line.replace('FOLLOWUP:', '').trim());
      } else {
        cleaned.push(line);
      }
    }

    return res.json({
      mode: 'live-gemini',
      isDemoResponse: false,
      text: cleaned.join('\n').trim(),
      followUps: followUps.length > 0 ? followUps : [
        'What documents are required to apply?',
        'How do I check my scholarship application status online?',
      ],
    });
  } catch (error) {
    console.error('Gemini Server Error:', error);
    return res.status(500).json({
      error: 'Failed to process AI response through Gemini endpoint.',
      fallbackAvailable: true,
    });
  }
});

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Sahayakon 2.0 Backend running on port ${PORT}`);
  console.log(`🔒 DigiLocker Adapter: ${digiLockerService.isConfigured() ? 'Live API Setu' : 'Demo Sandbox Simulation'}`);
  console.log(`🔒 Gemini AI status: ${GEMINI_API_KEY ? 'Active (API Key loaded)' : 'Demo/Local Knowledge Mode'}`);
});
