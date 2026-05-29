'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    features: "Features",
    about: "About",
    team: "Team",
    contact: "Contact",
    donate: "Donate",
    login: "Login",
    signup: "Sign Up",
    dashboard: "Dashboard",
    my_account: "My Account",
    sign_out: "Sign Out",
    
    // Profile
    security: "Security",
    settings: "Settings",
    account_identity: "Account Identity",
    full_name: "Full Name",
    save_identity: "Save Identity",
    system_settings: "System Settings",
    language: "Language",
    timezone: "Timezone",
    save_settings: "Save Settings",
    delete_account: "Delete Account",
    purge_account: "Purge Account",
    
    // Dashboard / Home
    welcome: "Welcome to DreamSync",
    hero_title: "Your Dream Career, Synced Perfectly.",
    hero_desc: "Guidance, resumes, ATS checks, and custom roadmaps—all powered by AI. Designed explicitly for Indian students.",
    get_started: "Get Started For Free",
    how_it_works: "See How It Works",
    everything_you_need: "Everything You Need",
    
    // Feature Titles
    ikigai_finder: "IKIGAI Finder",
    career_agent: "AI Career Agent",
    resume_builder: "Resume Builder",
    ats_check: "ATS Checker",
    linkedin_optimizer: "LinkedIn Optimizer",
    portfolio_gen: "Portfolio Generator",
    roadmap: "AI Roadmap",
    doc_skill: "Skill Roadmaps & Docs",
    serenity_ai: "Mental Health",
    
    // Feature Descriptions
    ikigai_desc: "Discover your true purpose and ideal career path using AI-powered Ikigai analysis.",
    career_desc: "Detailed roadmaps, salary insights, role suggestions & real job links tailored for India.",
    resume_desc: "Create ATS-friendly resumes that stand out to top recruiters instantly.",
    ats_desc: "Upload your PDF and get instant ATS scoring and targeted resume feedback.",
    linkedin_desc: "AI-generated headlines, summaries, and post ideas to boost your profile.",
    portfolio_desc: "Auto-generate a beautiful, deployed portfolio site with your details.",
    roadmap_desc: "Generate a personalized step-by-step career path based on your exact dream role.",
    doc_desc: "Step-by-step skill guides, free resources, and essential government docs for India.",
    serenity_desc: "Talk to Serenity — your empathetic AI companion for stress, anxiety & burnout.",
  },
  hi: {
    // Navbar
    features: "सुविधाएं",
    about: "हमारे बारे में",
    team: "टीम",
    contact: "संपर्क करें",
    donate: "दान करें",
    login: "लॉगिन",
    signup: "साइन अप",
    dashboard: "डैशबोर्ड",
    my_account: "मेरा खाता",
    sign_out: "साइन आउट",
    
    // Profile
    security: "सुरक्षा",
    settings: "सेटिंग्स",
    account_identity: "खाता पहचान",
    full_name: "पूरा नाम",
    save_identity: "पहचान सहेजें",
    system_settings: "सिस्टम सेटिंग्स",
    language: "भाषा",
    timezone: "समय क्षेत्र",
    save_settings: "सेटिंग्स सहेजें",
    delete_account: "खाता हटाएं",
    purge_account: "खाता हटा दें",
    
    // Dashboard / Home
    welcome: "DreamSync में आपका स्वागत है",
    hero_title: "आपका ड्रीम करियर, परफेक्टली सिंक।",
    hero_desc: "मार्गदर्शन, रिज्यूमे, ATS चेक, और कस्टम रोडमैप—सब कुछ AI द्वारा संचालित। विशेष रूप से भारतीय छात्रों के लिए डिज़ाइन किया गया।",
    get_started: "मुफ्त में शुरू करें",
    how_it_works: "देखें यह कैसे काम करता है",
    everything_you_need: "वह सब कुछ जो आपको चाहिए",

    // Feature Titles
    ikigai_finder: "IKIGAI खोजक",
    career_agent: "AI करियर एजेंट",
    resume_builder: "रिज्यूमे बिल्डर",
    ats_check: "ATS चेकर",
    linkedin_optimizer: "LinkedIn ऑप्टिमाइज़र",
    portfolio_gen: "पोर्टफोलियो जेनरेटर",
    roadmap: "AI रोडमैप",
    doc_skill: "स्किल रोडमैप और दस्तावेज़",
    serenity_ai: "मानसिक स्वास्थ्य",

    // Feature Descriptions
    ikigai_desc: "AI-संचालित इकिगई विश्लेषण का उपयोग करके अपने वास्तविक उद्देश्य और आदर्श करियर पथ की खोज करें।",
    career_desc: "भारत के लिए तैयार किए गए विस्तृत रोडमैप, वेतन अंतर्दृष्टि, भूमिका सुझाव और वास्तविक नौकरी लिंक।",
    resume_desc: "ATS-अनुकूल रिज्यूमे बनाएं जो शीर्ष रिक्रूटर्स की नज़र में तुरंत आ जाएं।",
    ats_desc: "अपनी PDF अपलोड करें और तत्काल ATS स्कोरिंग और लक्षित रिज्यूमे फीडबैक प्राप्त करें।",
    linkedin_desc: "अपनी प्रोफ़ाइल को बढ़ावा देने के लिए AI-जनरेटेड हेडलाइन, सारांश और पोस्ट विचार।",
    portfolio_desc: "अपने विवरण के साथ एक सुंदर, सक्रिय पोर्टफोलियो साइट स्वतः उत्पन्न करें।",
    roadmap_desc: "अपने सटीक ड्रीम रोल के आधार पर एक व्यक्तिगत चरण-दर-चरण करियर पथ तैयार करें।",
    doc_desc: "भारत के लिए चरण-दर-चरण कौशल मार्गदर्शिकाएँ, मुफ्त संसाधन और आवश्यक सरकारी दस्तावेज़।",
    serenity_desc: "सेरेनिटी से बात करें — तनाव, चिंता और बर्नआउट के लिए आपका सहानुभूतिपूर्ण AI साथी।",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dream_sync_lang') as Language;
      if (saved && (saved === 'en' || saved === 'hi')) {
        return saved;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dream_sync_lang', lang);
    }
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
