'use client';

import React, { useState, useRef } from 'react';
import { 
  Plus, Trash2, Download, Printer, User, Briefcase, 
  GraduationCap, Palette, Layout, Save, Sparkles, Send, FileText, Award,
  Fingerprint, Zap, Coffee, ArrowRight, CheckCircle2, AlertCircle, BarChart3, Info, Upload, ShieldCheck,
  Search, Loader2, Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ExternalHyperlink, BorderStyle } from 'docx';
import ResumePreview, { ResumeData } from '@/components/ResumePreview';
import { calculateATSScore, ATSAnalysis } from '@/lib/atsScore';

const DEFAULT_RESUME: ResumeData = {
  personalInfo: {
    fullName: "VASHNAVI CHAUHAN",
    role: "Frontend Developer",
    email: "vashnavichauhan1@gmail.com",
    phone: "+91 9174403667",
    location: "Bengaluru, India",
    linkedin: "vashnavichauhan18",
    github: "vashnavichauhan18",
    portfolio: "vashnavi.dev"
  },
  summary: "Self-taught Frontend Engineer with hands-on production experience in modern JavaScript frameworks. Proven track record in developing scalable frontend features and optimizing web performance for high-growth startups.",
  skills: [
    { category: "Languages & Frameworks", items: "Javascript, Typescript, Python, HTML, CSS" },
    { category: "Frontend Technologies", items: "Vue, React, React Native, Nuxt, Tailwind CSS, MUI" },
    { category: "State Management", items: "Redux Toolkit, Pinia, Vuex, Zustand" },
    { category: "Backend & Tools", items: "Node.js, Express.js, MongoDB, Flask, Docker, D3.js" }
  ],
  experience: [
    {
      company: "Rapid Rocket",
      role: "Frontend Developer (Freelance)",
      location: "Remote",
      date: "Sep 2025 – Present",
      bullets: [
        "Built scalable frontend features using React.js and Next.js, driving significant UX improvements across the platform.",
        "Improved web performance through advanced frontend optimization and efficient rendering strategies, resulting in faster load times.",
        "Collaborated with cross-functional teams to integrate new features and maintain high code quality standards."
      ]
    },
    {
      company: "Aiseberg - AiseDiscovery",
      role: "Senior Frontend Engineer",
      location: "Bengaluru, India",
      date: "Jan 2025 – Jul 2025",
      bullets: [
        "Developed a real-time chat interface in React TSX, significantly enhancing user engagement metrics.",
        "Optimized list virtualization with TanStack Virtual and Redux Toolkit, contributing to a 40–50% activation rate among demo users.",
        "Integrated D3 tree chart with custom SCSS styling, reducing UI development time by 30% for data visualization components."
      ]
    },
    {
      company: "PropVR 3D Squareyards",
      role: "Frontend Developer (SDE-1)",
      location: "Bengaluru, India",
      date: "Nov 2022 – Dec 2024",
      bullets: [
        "Collaborated with a 12-member team on the PropVR metaverse project, boosting project delivery efficiency by 20%.",
        "Led full-stack development of propvr.ai, achieving significant improvements in SEO rankings and user retention.",
        "Implemented robust security measures, enhancing overall application security posture by 50% through strict policy enforcement."
      ]
    }
  ],
  education: [
    {
      school: "Delhi University",
      degree: "B.A Hons Political Science",
      location: "New Delhi",
      date: "2019 – 2022"
    }
  ],
  projects: [
    {
      name: "Metaverse Real Estate",
      link: "propvr.ai",
      description: "Implemented high-performance 3D visualization for real estate properties using proprietary rendering engines."
    }
  ],
  achievements: [
    "RNR Certificate in Software Development",
    "Blog: Securing Web: A Deep Dive into Content Security Policy (CSP)",
    "Blog: Understanding Cookie Security: Best Practices for Developers"
  ],
  languages: ["English", "Hindi"],
  certifications: [],
  extra: "Passionate about web security and technical blogging."
};

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(DEFAULT_RESUME);
  const [template, setTemplate] = useState<'elite' | 'strategic' | 'modern'>('modern');
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [isParsing, setIsParsing] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const startAnalysis = () => {
    setScanStatus('scanning');
    setTimeout(() => {
      const result = calculateATSScore(data);
      setAtsAnalysis(result);
      setScanStatus('complete');
    }, 2000);
  };

  // Debounced ATS Calculation
  React.useEffect(() => {
    if (scanStatus === 'complete') {
        const result = calculateATSScore(data);
        setAtsAnalysis(result);
    }
  }, [data]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.personalInfo.fullName.replace(/\s/g, '_')}_Resume`,
    onAfterPrint: () => {
      fetch('/api/stats', { method: 'POST' }).catch(err => console.error(err));
    }
  });

  const handleImportPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/resume-parse', {
        method: 'POST',
        body: formData,
      });
      const parsedData = await res.json();
      if (!res.ok) throw new Error(parsedData.error);
      
      const formattedData: ResumeData = {
        ...parsedData,
        projects: parsedData.projects || [],
        achievements: parsedData.achievements || [],
        languages: parsedData.languages || [],
        certifications: parsedData.certifications || [],
        extra: parsedData.extra || ""
      };
      
      setData(formattedData);
    } catch (err: any) {
      console.error(err);
      alert("Failed to parse resume: " + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const generateWordDoc = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: data.personalInfo.fullName.toUpperCase(), heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: data.personalInfo.role, alignment: AlignmentType.CENTER }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(`${data.personalInfo.phone} | ${data.personalInfo.email} | ${data.personalInfo.location}`)] }),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({ text: "PROFESSIONAL SUMMARY", heading: HeadingLevel.HEADING_2, border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } } }),
          new Paragraph({ text: data.summary }),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({ text: "WORK EXPERIENCE", heading: HeadingLevel.HEADING_2, border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } } }),
          ...data.experience.flatMap(exp => [
            new Paragraph({ children: [new TextRun({ text: exp.role, bold: true }), new TextRun({ text: ` | ${exp.company}`, bold: true }), new TextRun({ text: `\t${exp.date}`, bold: false })] }),
            ...exp.bullets.map(bullet => new Paragraph({ text: bullet, bullet: { level: 0 } }))
          ]),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({ text: "TECHNICAL SKILLS", heading: HeadingLevel.HEADING_2, border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } } }),
          ...data.skills.map(skill => new Paragraph({ children: [new TextRun({ text: `${skill.category}: `, bold: true }), new TextRun(skill.items)] })),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({ text: "TECHNICAL PROJECTS", heading: HeadingLevel.HEADING_2, border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } } }),
          ...(data.projects || []).flatMap(proj => [new Paragraph({ children: [new TextRun({ text: proj.name, bold: true }), new TextRun({ text: proj.link ? ` (${proj.link})` : "", color: "2563EB" })] }), new Paragraph({ text: proj.description })]),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2, border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } } }),
          ...data.education.map(edu => new Paragraph({ children: [new TextRun({ text: edu.school, bold: true }), new TextRun(` | ${edu.degree}\t${edu.date}`)] })),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${data.personalInfo.fullName.replace(/\s/g, '_')}_Resume.docx`);
    fetch('/api/stats', { method: 'POST' }).catch(err => console.error(err));
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  };

  const updateSummary = (value: string) => {
    setData(prev => ({ ...prev, summary: value }));
  };

  const updateSkill = (index: number, field: 'category' | 'items', value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setData(prev => ({ ...prev, skills: [...prev.skills, { category: "", items: "" }] }));
  };

  const removeSkill = (index: number) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const newExperience = [...data.experience];
    (newExperience[index] as any)[field] = value;
    setData(prev => ({ ...prev, experience: newExperience }));
  };

  const addExperience = () => {
    setData(prev => ({ ...prev, experience: [...prev.experience, { company: "", role: "", location: "", date: "", bullets: [""] }] }));
  };

  const removeExperience = (index: number) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== index) }));
  };

  const updateEdu = (index: number, field: string, value: string) => {
    const newEdu = [...data.education];
    (newEdu[index] as any)[field] = value;
    setData(prev => ({ ...prev, education: newEdu }));
  };

  const updateArrayField = (field: 'achievements' | 'languages', index: number, value: string) => {
    const newArr = [...(data[field] || [])];
    newArr[index] = value;
    setData(prev => ({ ...prev, [field]: newArr }));
  };

  const addArrayItem = (field: 'achievements' | 'languages') => {
    setData(prev => ({ ...prev, [field]: [...(prev[field] || []), ""] }));
  };

  const updateProjects = (index: number, field: string, value: string) => {
    const newProjects = [...(data.projects || [])];
    (newProjects[index] as any)[field] = value;
    setData(prev => ({ ...prev, projects: newProjects }));
  };

  const updateCert = (index: number, field: string, value: string) => {
    const newCerts = [...(data.certifications || [])];
    (newCerts[index] as any)[field] = value;
    setData(prev => ({ ...prev, certifications: newCerts }));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-stone-50/50 pb-20 lg:pb-0">
      
      {/* Sidebar - Friendly Editor */}
      <aside className="w-full lg:w-[480px] bg-white border-r border-stone-100 p-6 md:p-8 space-y-10 lg:h-screen lg:overflow-y-auto shadow-sm">
        
        <header className="space-y-3 pt-32 lg:pt-8 border-b border-stone-50 pb-8">
           <div className="flex items-center gap-3 text-blue-600">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Easy Resume Builder</h1>
           </div>
           <p className="text-sm font-medium text-stone-400">Follow the steps below to build a professional resume.</p>
        </header>

        {/* 🚀 TEMPLATE SELECTOR */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <Layout className="w-4 h-4" /> Pick a Design
            </h2>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1">
               <Sparkles className="w-3 h-3" /> Auto-Formatting
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'elite', name: 'Professional Tier', desc: 'Focus on achievements and impact.', color: 'border-blue-100' },
              { id: 'strategic', name: 'Standard Layout', desc: 'Clear and easy to read for any job.', color: 'border-stone-100' },
              { id: 'modern', name: 'Creative Profile', desc: 'Modern look for modern roles.', color: 'border-emerald-100' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id as any)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                  template === t.id 
                  ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-50/50' 
                  : 'border-stone-100 bg-white hover:border-stone-200'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                   <h3 className={`text-sm font-bold ${template === t.id ? 'text-blue-700' : 'text-stone-800'}`}>{t.name}</h3>
                   {template === t.id && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-xs text-stone-400 font-medium">{t.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Action Panel */}
        <div className="p-6 bg-stone-50 rounded-3xl space-y-4">
           <div className="flex items-center gap-3 text-stone-800">
              <Download className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-bold">Save your resume</p>
           </div>
           <div className="grid grid-cols-2 gap-3">
              <button onClick={handlePrint} className="btn-primary !py-3 !text-sm flex items-center justify-center gap-2">
                 <Printer className="w-4 h-4" /> PDF
              </button>
              <button onClick={generateWordDoc} className="btn-secondary !py-3 !text-sm flex items-center justify-center gap-2">
                 <FileText className="w-4 h-4" /> Word
              </button>
           </div>
           <div className="pt-2">
              <label className="w-full flex items-center justify-center gap-3 py-3 border border-stone-200 rounded-full text-stone-500 text-sm font-bold cursor-pointer hover:bg-white hover:border-blue-400 transition-all active:scale-95">
                 <Upload className="w-4 h-4" /> {isParsing ? 'Importing...' : 'Upload existing PDF'}
                 <input type="file" hidden accept=".pdf" onChange={handleImportPdf} />
              </label>
           </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-10">
          
          {/* Section: Personal Info */}
          <section className="space-y-6">
            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-3">
              <User className="w-4 h-4" /> Tell us who you are
            </h2>
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-400 ml-1">Full Name</label>
                  <input value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} className="input-field" placeholder="Vashnavi Chauhan" />
               </div>
               <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-400 ml-1">Current Role / Student</label>
                  <input value={data.personalInfo.role} onChange={(e) => updatePersonalInfo('role', e.target.value)} className="input-field" placeholder="Frontend Developer" />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-stone-400 ml-1">Email</label>
                     <input type="email" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className="input-field" placeholder="vashnavi@example.com" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-stone-400 ml-1">Phone</label>
                     <input value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} className="input-field" placeholder="+91 9174..." />
                  </div>
               </div>
            </div>
          </section>

          {/* Section: Summary */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-3">
              <FileText className="w-4 h-4" /> Short Bio
            </h2>
            <textarea 
              value={data.summary}
              onChange={(e) => updateSummary(e.target.value)}
              className="input-field min-h-[140px] text-sm leading-relaxed"
              placeholder="Tell companies about your skills and goals..."
            />
          </section>

          {/* Section: Skills */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-3">
                 <Zap className="w-4 h-4" /> Your Skills
               </h2>
               <button onClick={addSkill} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
               {data.skills.map((skill, idx) => (
                 <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-stone-50 rounded-2xl space-y-3 relative group border border-transparent hover:border-blue-100 transition-all">
                    <input value={skill.category} onChange={(e) => updateSkill(idx, 'category', e.target.value)} placeholder="Category (e.g. Languages)" className="input-field !py-2 !text-xs !rounded-lg" />
                    <textarea value={skill.items} onChange={(e) => updateSkill(idx, 'items', e.target.value)} placeholder="List your skills (comma separated)" className="input-field !py-2 !text-xs !rounded-lg min-h-[60px]" />
                    <button onClick={() => removeSkill(idx)} className="absolute -top-2 -right-2 bg-white text-rose-500 rounded-full p-1.5 shadow-sm border border-stone-100 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                 </motion.div>
               ))}
            </div>
          </section>

          {/* Experience Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest flex items-center gap-3">
                <Briefcase className="w-4 h-4" /> Work Experience
              </h2>
              <button onClick={addExperience} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            {data.experience.map((exp, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-stone-50 rounded-2xl space-y-4 relative group border border-transparent hover:border-emerald-100 transition-all">
                <div className="grid grid-cols-2 gap-2">
                   <input value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} placeholder="Job Title" className="input-field !py-2 !text-xs !rounded-lg" />
                   <input value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} placeholder="Company" className="input-field !py-2 !text-xs !rounded-lg" />
                </div>
                <div className="space-y-3">
                   {exp.bullets.map((bullet, bIdx) => (
                     <textarea key={bIdx} value={bullet} onChange={(e) => {
                       const newBullets = [...exp.bullets];
                       newBullets[bIdx] = e.target.value;
                       updateExperience(idx, 'bullets', newBullets);
                     }} className="input-field !py-2 !text-xs !rounded-lg min-h-[60px]" placeholder="What did you do there?" />
                   ))}
                   <button onClick={() => updateExperience(idx, 'bullets', [...exp.bullets, ""])} className="text-[11px] font-extrabold text-blue-600 ml-1 hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Add Point</button>
                </div>
                <button onClick={() => removeExperience(idx)} className="absolute -top-2 -right-2 bg-white text-rose-500 rounded-full p-1.5 shadow-sm border border-stone-100 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </motion.div>
            ))}
          </section>
        </div>
      </aside>

      {/* Main Preview Region */}
      <main className="flex-1 bg-stone-200/50 p-6 md:p-12 lg:p-16 flex justify-center relative overflow-y-auto lg:h-screen">
         <div className="w-full max-w-[850px] bg-white rounded-3xl shadow-2xl p-0 h-fit mb-20 md:mb-0 overflow-hidden">
            <ResumePreview data={data} template={template} ref={componentRef} />
         </div>
         
         {/* Preview Help Badge */}
         <div className="fixed bottom-6 right-6 z-40">
           <div className="bg-stone-900 text-white px-6 py-4 rounded-3xl shadow-xl flex items-center gap-4 animate-fade-in">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                 <Sparkle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400">Preview Mode</p>
                <p className="text-sm font-bold">Your resume looks great!</p>
              </div>
           </div>
         </div>
      </main>
    </div>
  );
}
