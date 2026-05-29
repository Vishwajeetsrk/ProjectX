# 🌙 DreamSync — Warm Career Intelligence & Empathetic Support Platform

> **Empowering career journeys for students and care-experienced youth. Find your path, build your professional identity, and grow with empathetic AI guidance.**

### 🌐 [Live Deployment Portal](https://dreamssync.vercel.app/) | 🏠 [Production Home Portal](https://dreamssync.vercel.app/)

---

## 🏗️ Human-Centric Design System
DreamSync features an **NGO-Inspired, Supportive, and Highly Accessible** architecture. This design prioritizes:
- **Trust & Clarity**: Calming `Stone-50` and `Emerald` color palettes, mixed with soft organic shapes (`rounded-[3rem]`) to reduce digital anxiety.
- **High Readability**: High-legibility modern typography (`Inter`, `Outfit`) and highly contrastive buttons suitable for users of all digital literacy levels.
- **Empathetic UX**: Interactive micro-animations (via `Framer Motion`) providing premium visual feedback that feels organic and supportive.

---

## ✨ 9 Core Support Modules

1. **🧠 Ikigai Architect**: Discover your professional alignment at the intersection of Passion, Skills, Market, and Income with automated Venn diagram rendering.
2. **📄 AI Resume Forge**: Guidance-driven resume editor featuring live layout previewing, custom color themes, and direct printer-ready PDF export.
3. **🛡️ ATS Resume Score Checker**: Drag-and-drop resume scanner that checks keywords and structural alignment against target job descriptions, providing instant rewrite indicators.
4. **🤖 AI Career Guide & Coach**: Empathetic AI coach delivering real-time salary insights, localized Indian job postings, and structured 90-day progress roadmaps.
5. **💼 LinkedIn Pro Profile Optimizer**: Instantly tune profile headlines, "About" bios, and personalized outreach networking templates.
6. **🗺️ Skills & Document Roadmap**: Milestone progress timelines paired with a dedicated guide on obtaining essential Indian documents (Aadhaar, PAN, E-Shram, etc.).
7. **🌱 Peer Community Hub**: A safe ecosystem for connecting with peer circles, digital mentors, and local NGO career events.
8. **🖼️ Dynamic Stand-alone Portfolio Engine**: Instantly generate responsive web portfolios in 4 distinct themes: *Minimal Dev*, *Neo-Brutalism*, *Glass Dark*, and *Data Pro (Vishwa)*.
9. **🌸 Serenity AI Mental Health Companion**: Empathetic voice & text buddy for burnout and stress, with local helplines and interactive vocal speech output (TTS/STT).

---

## 🛠️ Modern Technical Stack

- **Frontend Framework**: [Next.js 16.2.2 (Turbopack Enabled)](https://nextjs.org/)
- **Core Library**: [React 19.2.4](https://react.dev/)
- **Styling Core**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Motion & Transition**: [Framer Motion 12+](https://www.framer.com/motion/)
- **Database Engine**: [Firebase Cloud Firestore](https://firebase.google.com/)
- **Authentication**: **Firebase Secure Auth** (Google, GitHub, and Custom Credentials)
- **High Availability Cache**: [Upstash Redis & Ratelimit](https://upstash.com/)
- **AI Inference Pipeline**: [OpenRouter API (Llama-3-70B)](https://openrouter.ai/) & [Google Gemini]
- **API Form Handler**: [Web3Forms API](https://web3forms.com/)

---

## 🔑 Infrastructure & API Requirements

To operate this platform locally or in production, acquire API credentials for the following services:

| Service Provider | Config Details | Purpose | Link |
| :--- | :--- | :--- | :--- |
| **Firebase Console** | Web App API Keys, Project IDs, Auth Domain | Authentication & User Firestore DB | [Firebase](https://console.firebase.google.com/) |
| **Upstash Redis** | Rest URL & Rest Token | Rate limiting & feature usage caching | [Upstash Console](https://console.upstash.com/) |
| **OpenRouter** | `OPENROUTER_API_KEY` | Model endpoints for resume advice & coaching | [OpenRouter](https://openrouter.ai/) |
| **Web3Forms** | Contact Form Token Key | Delivers contact/support messages | [Web3Forms](https://web3forms.com/) |
| **Serper API** | `SERPER_API_KEY` (Optional) | Powers live Indian job search indexing | [Serper.dev](https://serper.dev/) |

---

## 🏁 Local Development & Setup Guide

### 1. Software Prerequisites
- **Node.js**: Install version `20.x` or `22.x` (Recommended) from [Node.js Official Website](https://nodejs.org/).
- **Git**: Command line tool for version control.
- **VS Code**: Recommended Editor.

### 2. Synchronization & Dependency Installation
Clone the repository and install all required modules using clean legacy peer dependencies:
```bash
# Clone the repository
git clone https://github.com/Vishwajeetsrk/DreamSync.git
cd DreamSync

# Install dependency modules securely
npm install --legacy-peer-deps
```

### 3. Environment Variables Setup
Create a `.env.local` file in the project root directory and insert your secure API keys:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Upstash Cache & Rate Limit Configurations
UPSTASH_REDIS_REST_URL=https://your-database-id.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# AI, Search & Forms Integrations
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_token
SERPER_API_KEY=your_serper_api_key
```

### 4. Run the Dev Protocol
Launch the blazing-fast local developer server powered by Next.js Turbopack:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser to access the portal.

---

## 🚀 Live Deployment Protocol (Vercel)

1. **GitHub Push**: Commit and push your verified code changes to your GitHub branch.
2. **Deploy to Vercel**:
   - Sign in to the [Vercel Dashboard](https://vercel.com/).
   - Click **"Add New"** > **"Project"** and import the `DreamSync` repository.
3. **Configure Settings**:
   - Framework preset: **Next.js**.
   - Build command: `next build`.
   - Node version: `20.x` or `22.x`.
4. **Setup Environment Variables**:
   - Copy all variables from your local `.env.local` file and add them directly in the Vercel project environment settings.
5. **Launch**: Click **"Deploy"**. Vercel will build and host your platform on global edge networks.
6. **Whitelist Domains**:
   - Navigate to **Firebase Console** > **Authentication** > **Settings** > **Authorized Domains**.
   - Add your newly deployed Vercel URL (e.g., `dreamssync.vercel.app`) to authorize users to sign in.

---

## 🧩 Recommended VS Code Extensions

Install the following extensions in Visual Studio Code for an optimized developer workflow:
- **Tailwind CSS IntelliSense**: For real-time utility autocomplete.
- **ESLint**: Real-time code quality and typescript constraint validation.
- **Prettier - Code Formatter**: Auto-formats code on save.
- **GitLens**: Supercharges Git tracking right inside your files.
- **Lucide Icon Searcher**: Easily discover supportive icons to match custom modules.

---

© 2026 DREAMSYNC. EMPOWERING FUTURES. HUMAN_CENTRIC. IDENTITY_SECURED.
