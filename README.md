# 🌙 DreamSync — Warm Career Intelligence & Support Platform

> **Empowering career journeys for students and care-experienced youth. Find your path, build your professional identity, and grow with empathetic AI guidance.**

### 🌐 [Live Deployment](https://dreamssync.vercel.app/) | 🏠 [Home Portal](https://dreamssync.vercel.app/)

---

## 🏗️ Human-Centric Design System
DreamSync has transitioned from aggressive technical aesthetics to a **Warm, Accessible, and NGO-Inspired** architecture. This design prioritizes:
- **Trust & Clarity**: Soft rounded geometry (`rounded-[3rem]`) and a calming `Stone-50` color palette.
- **Accessibility**: High-readability typography (`Inter`) and simplified navigation for users of all digital literacy levels.
- **Supportive UX**: Empathetic micro-interactions and high-fidelity visual feedback that feels human, not robotic.

---

## ✨ Core Support Modules
1.  **🧠 Ikigai Architect**: Discovery tools for the intersection of Passion, Skills, Market, and Income.
2.  **📄 AI Resume Forge**: Guided resume building with professional clarity.
3.  **🤖 AI Career Guide**: Empathetic AI partner for job advice and roadmaps.
4.  **🗺️ Skills & Document Roadmap**: Localized pathways for skills and identity nodes (Aadhaar, PAN, etc.).
5.  **💼 LinkedIn Pro Optimizer**: Profile tuning with high-performance professional summaries.
6.  **🌱 Community Hub**: Safe ecosystem forpeer connection and local activities.
7.  **🖼️ Portfolio Engine**: Instant responsive web portfolios from professional data.

---

## 🛠 Modern Technical Stack
- **Framework**: [Next.js 15+](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion 12+](https://www.framer.com/motion/)
- **Database**: [Firebase Cloud Firestore](https://firebase.google.com/)
- **Authentication**: **Firebase Secure Auth** (Google & GitHub)
- **AI Inference**: [Groq](https://groq.com/) & [Llama 3]

---

## 🔑 Infrastructure Requirements
To run this platform, you need to configure the following services:

| Service | Requirement | Link |
| :--- | :--- | :--- |
| **Firebase** | API Key, Auth Domain, Project ID | [Console](https://console.firebase.google.com/) |
| **OpenRouter** | AI Model Access (Llama 3) | [OpenRouter](https://openrouter.ai/) |
| **Web3Forms** | Contact Form Logic | [Access Key](https://web3forms.com/) |
| **GitHub/Google** | OAuth App Credentials | [GitHub Developer](https://github.com/settings/developers) |

---

## 🏁 Local Development Setup

### 1. Prerequisite Checks
- **Node.js**: Install version 20.x or higher from [nodejs.org](https://nodejs.org/).
- **Git**: Ensure Git is installed for repository synchronization.

### 2. Synchronization & Dependencies
```bash
# Clone the repository
git clone https://github.com/Vishwajeetsrk/ProjectX.git
cd ProjectX

# Install required packages
npm install --legacy-peer-deps
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and populate it with the following:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI & Forms
OPENROUTER_API_KEY=your_openrouter_key
NEXT_PUBLIC_WEB3FORMS_KEY=your_form_key
```

### 4. Execute Protocol
```bash
# Start the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 🚀 Live Deployment Protocol (Vercel)

1.  **Push to GitHub**: Ensure your code is synchronized with your GitHub repository.
2.  **Import to Vercel**:
    - Sign in to [Vercel](https://vercel.com/).
    - Click **"New Project"** and select the `ProjectX` repository.
3.  **Configure Environment Variables**:
    - During the build settings, add all keys from your `.env.local` to the "Environment Variables" section.
4.  **Deploy**: Click **"Deploy"**. Vercel will launch your platform on a global edge network.
5.  **Whitelist Domains**:
    - Go to **Firebase Console > Authentication > Settings > Authorized Domains**.
    - Add your Vercel URL (e.g., `project-x.vercel.app`) to the list.

---

## 🧩 Recommended VS Code Extensions
For the best development experience, we recommend installing these extensions:
- **Tailwind CSS IntelliSense**: For real-time design token suggestions.
- **ESLint & Prettier**: To maintain high-fidelity code integrity.
- **GitLens**: For advanced version control visualization.
- **Lucide Icon Searcher**: To easily find support module icons.

---

## 📄 Security & Privacy
- **Identity Integrity**: OAuth 2.0 protocols for zero-password friction.
- **Protocol Safety**: `aiGuard` filtering ensures all career advice is ethical and supportive.

© 2026 DREAMSYNC. EMPOWERING FUTURES. HUMAN_CENTRIC. IDENTITY_SECURED.
