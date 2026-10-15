# JanSahayak AI – Multilingual Government Schemes Assistant
### जनसहायक AI – बहुभाषिक शासकीय योजना सहाय्यक | जनसहायक AI – बहुभाषी सरकारी योजना सहायक

> An AI-powered, modern, responsive web application designed to empower Indian citizens to discover, understand, and apply for Central and State government welfare schemes in **मराठी (Marathi)**, **हिन्दी (Hindi)**, and **English**.

---

## 🇮🇳 Project Highlights

- **Multilingual Support (3 Languages):** Instant on-the-fly language switching between **मराठी (Marathi)**, **हिन्दी (Hindi)**, and **English**. All navigation, buttons, scheme descriptions, eligibility requirements, and AI responses adapt automatically.
- **Tricolour-Inspired Design:** Clean, modern, accessible UI with saffron, green, and navy-blue accents reflecting the Indian National Tricolour and the Ashoka Chakra.
- **16+ Real, Verified Schemes:** Comprehensive profiles of major welfare schemes from the Government of India and the Government of Maharashtra (PM-KISAN, Namo Shetkari, Mukhyamantri Majhi Ladki Bahin, Ayushman Bharat PM-JAY, Rajarshi Shahu Scholarship, PM Vishwakarma, MUDRA loans, and more).
- **AI Chat Assistant (JanSahayak AI):** 
  - Answers queries in simple citizen terms (e.g., *"Which scholarships are available for engineering students?"*, *"महाराष्ट्रातील शेतकऱ्यांसाठी कोणत्या योजना आहेत?"*, *"महिलांसाठी सरकारी योजनांची माहिती द्या"*).
  - Dual Mode: Works out-of-the-box using the built-in **Verified Knowledge Engine** (no API key needed), or seamlessly connects to live **Google Gemini API** for extended generative answers.
  - Interactive scheme card recommendations & follow-up questions within the chat.
- **Citizen Privacy & Safety Protections:**
  - Automated regex filter blocks inputs containing 12-digit Aadhaar numbers or financial credentials.
  - Clear zero-credential guarantee: JanSahayak AI **never** asks for Aadhaar, OTP, or passwords.
  - Explicit disclaimers highlighting that final approvals rest with the issuing government authority.
- **Interactive Document Readiness Checklist:** Check off required documents on your phone or computer to prepare before applying.
- **Text-to-Speech (Audio Assistance):** Native browser speech synthesis reads scheme overviews and AI responses aloud in Marathi, Hindi, or English for enhanced accessibility.
- **Local Persistence & Offline Bookmarks:** Save favorite schemes to device local storage; tracks recently viewed schemes.
- **Official Links & National Citizen Helplines:** Direct access to `india.gov.in`, `myscheme.gov.in`, `scholarships.gov.in`, `mahadbt.maharashtra.gov.in`, plus helpline numbers (Kisan Call Center: 1800-180-1551, Consumer: 1915, Women: 181, Elderline: 14567).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher recommended; verified on Node v24.13.0)
- **npm** (v9 or higher)

### Installation
Clone or navigate to the project directory:
```bash
cd "C:\Users\DELL\.gemini\antigravity\scratch\jansahayak-ai"
npm install
```

### Running the Application

You can run the frontend alone, or run both frontend and backend concurrently:

#### Option 1: Frontend Only (Instant Dev Server)
The frontend features a fully functional client-side Knowledge Engine that requires **no backend or API key**:
```bash
npm run dev
```
Open your browser at: `http://localhost:5173`

#### Option 2: Full-Stack Mode (Frontend + Express Backend)
Runs the Vite frontend on port `5173` and the Express backend proxy on port `3001`:
```bash
npm run dev:all
```

#### Option 3: Production Build & Preview
```bash
npm run build
npm run preview
```

---

## ⚙️ Configuring Google Gemini AI API (Optional)

The application operates 100% reliably out of the box using its **Verified Smart Knowledge Engine**. If you wish to enable live Gemini AI:

### Method A: Directly in the UI (Client-Side)
1. Open the app in your browser (`http://localhost:5173`).
2. Click the **AI Assistant** button (bottom right or top navigation).
3. Click the **AI Settings (⚙️)** gear icon in the chat header.
4. Paste your free Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/)) and click **Save**.
5. The chat badge will turn purple: `⚡ Live Gemini AI Connected`.

### Method B: Environment Variable (Server-Side)
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and add your key:
   ```env
   PORT=3001
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Restart the server (`npm run server` or `npm run dev:all`).

---

## 📂 Project Architecture

```
jansahayak-ai/
├── public/
│   └── favicon.svg             # Tricolour Ashoka Chakra SVG favicon
├── server/
│   └── index.js                # Express backend with input sanitization & Gemini proxy
├── src/
│   ├── components/
│   │   ├── CategorySection.tsx # 7 category cards with scheme counts
│   │   ├── ChatAssistant.tsx   # Interactive multilingual AI chat assistant modal
│   │   ├── FAQSection.tsx      # Accordion with frequently asked citizen questions
│   │   ├── FeedbackModal.tsx   # 5-star rating and suggestion form
│   │   ├── Footer.tsx          # Official portals & national emergency helpline numbers
│   │   ├── Hero.tsx            # Tricolour hero section with search and quick tags
│   │   ├── Navbar.tsx          # Sticky header, language picker, saved schemes badge
│   │   ├── PrivacyNoticeModal.tsx # Citizen privacy & data protection policy
│   │   ├── RecentlyViewed.tsx  # Quick carousel of recently explored schemes
│   │   ├── SafetyBanner.tsx    # Saffron security advisory banner
│   │   ├── SavedSchemesModal.tsx # Drawer/modal to view and manage bookmarks
│   │   ├── SchemeCard.tsx      # Card with verified badge, highlight, and bookmarking
│   │   ├── SchemeDetailModal.tsx # Full modal with interactive document checklist & TTS
│   │   └── SchemeList.tsx      # Filterable grid of schemes with instant search
│   ├── data/
│   │   ├── schemesData.ts      # 16+ verified real schemes across Central & Maharashtra
│   │   └── translations.ts     # Complete dictionary for Marathi, Hindi, and English
│   ├── services/
│   │   └── aiService.ts        # Intent parser, local knowledge engine & Gemini connector
│   ├── types/
│   │   └── index.ts            # Strict TypeScript types and interfaces
│   ├── App.tsx                 # Main application state and layout orchestrator
│   ├── index.css               # Tailwind CSS v4 setup and typography rules
│   └── main.tsx                # React DOM entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🛡️ Reliability, Accuracy & Safety Guarantees

1. **Official Sources Only:** All schemes are mapped to official government domains (`india.gov.in`, `myscheme.gov.in`, `scholarships.gov.in`, `mahadbt.maharashtra.gov.in`, `pmkisan.gov.in`, `nha.gov.in`).
2. **Zero Inventions:** No invented eligibility rules, subsidies, or unverified claims.
3. **Citizen Data Protection:** Regex filters reject any input containing 12-digit Aadhaar numbers or payment tokens with a clear alert.
4. **Offline Resilience:** All saved schemes and history remain securely in the user's browser `localStorage` and are never transmitted to third-party tracking services.

---

## 📜 License & Dedication
Built for the citizens of India to foster digital inclusion and access to public welfare.
Dedicated to Digital India and citizen empowerment.
