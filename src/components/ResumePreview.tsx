'use client';

import React from 'react';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';

export interface ResumeData {
  personalInfo: {
    fullName: string;
    role: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website?: string;
    portfolio?: string;
  };
  summary: string;
  skills: {
    category: string;
    items: string;
  }[];
  experience: {
    company: string;
    role: string;
    location: string;
    date: string;
    bullets: string[];
  }[];
  education: {
    school: string;
    degree: string;
    location: string;
    date: string;
  }[];
  projects?: {
    name: string;
    link?: string;
    description: string;
  }[];
  achievements?: string[];
  languages?: string[];
  certifications?: {
    name: string;
    issuer: string;
    date: string;
    link?: string;
  }[];
  extra?: string;
}

interface ResumePreviewProps {
  data: ResumeData;
  template?: 'google_swe' | 'microsoft_sde' | 'faang_standard';
}

const ResumePreview = React.forwardRef<HTMLDivElement, ResumePreviewProps>(({ data, template = 'faang_standard' }, ref) => {
  const { personalInfo, summary, skills, experience, education, projects, achievements, languages, certifications, extra } = data;

  // Template Specific Styles
  const isGoogle = template === 'google_swe';
  const isMicrosoft = template === 'microsoft_sde';
  
  const sectionTitleClass = isGoogle 
    ? "text-[15px] font-semibold text-blue-800 uppercase tracking-wide border-b-2 border-blue-800 pb-1 mb-2 mt-4" 
    : isMicrosoft 
      ? "text-[14px] font-bold text-gray-800 uppercase tracking-widest border-b border-gray-400 pb-1 mb-3 mt-5"
      : "text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 mt-6";

  const bulletClass = "text-[13px] text-gray-800 leading-snug mb-1 list-disc ml-5 pl-1";
  const subTitleClass = "text-[14px] font-bold text-gray-900";
  const dateClass = isGoogle ? "text-[13px] font-semibold text-blue-700" : "text-[13px] font-medium text-gray-600";
  const textClass = "text-[13px] text-gray-800 leading-relaxed";
  const containerClass = `bg-white text-black px-10 py-12 shadow-lg mx-auto w-full max-w-[800px] min-h-[1123px] ${isGoogle ? 'font-sans' : isMicrosoft ? 'font-serif' : 'font-sans'}`;

  return (
    <div 
      ref={ref}
      className={containerClass}
      id="resume-content"
    >
      {/* Header */}
      <header className={`text-center ${isGoogle ? 'mb-4' : 'mb-6'}`}>
        <h1 className={`text-3xl uppercase tracking-tight mb-1 ${isGoogle ? 'font-bold text-blue-900' : 'font-extrabold text-gray-900'}`}>{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className={`text-sm mb-2 ${isGoogle ? 'font-medium text-gray-700' : 'font-semibold text-gray-700 tracking-wide'}`}>{personalInfo.role || 'Professional Role'}</p>
        
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[12px] font-medium text-gray-700">
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> LinkedIn: {personalInfo.linkedin.replace('linkedin.com/in/', '')}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> GitHub: {personalInfo.github.replace('github.com/', '')}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {personalInfo.location}
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Portfolio: {personalInfo.portfolio.replace(/https?:\/\//, '')}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section>
          <h2 className={sectionTitleClass}>Professional Summary</h2>
          <p className={textClass}>{summary}</p>
        </section>
      )}

      {/* Skills */}
      <section>
        <h2 className={sectionTitleClass}>Technical Skills</h2>
        <div className="space-y-2">
          {skills.map((skill, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-sm font-bold w-32 shrink-0">{skill.category}:</span>
              <span className={textClass}>{skill.items}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section>
        <h2 className={sectionTitleClass}>Work Experience</h2>
        <div className="space-y-6">
          {experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className={subTitleClass}>{exp.role}</h3>
                <span className={dateClass}>{exp.date}</span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-semibold text-gray-800">{exp.company}</span>
                <span className="text-xs text-gray-500 uppercase">{exp.location}</span>
              </div>
              <ul className="mt-2">
                {exp.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className={bulletClass}>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section>
          <h2 className={sectionTitleClass}>Technical Projects</h2>
          <div className="space-y-5">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={subTitleClass}>{proj.name}</h3>
                  {proj.link && <span className="text-xs text-blue-600 font-medium underline">{proj.link}</span>}
                </div>
                <p className={textClass}>{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      <section>
        <h2 className={sectionTitleClass}>Education</h2>
        <div className="space-y-4">
          {education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline">
              <div>
                <h3 className={subTitleClass}>{edu.school}</h3>
                <p className="text-sm text-gray-700">{edu.degree}</p>
              </div>
              <div className="text-right">
                <span className={dateClass}>{edu.date}</span>
                <p className="text-xs text-gray-500 uppercase">{edu.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section>
          <h2 className={sectionTitleClass}>Certifications</h2>
          <div className="space-y-2">
            {certifications.map((cert, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold">{cert.name}</span>
                  <span className="text-xs text-gray-600 ml-2">— {cert.issuer}</span>
                  {cert.link && (
                    <span className="text-xs text-blue-600 ml-2 underline hidden print:hidden">
                      (Link)
                    </span>
                  )}
                </div>
                <span className={dateClass}>{cert.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages & Achievements Grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <section>
            <h2 className={sectionTitleClass}>Achievements</h2>
            <ul className="space-y-1">
              {achievements.map((ach, idx) => (
                <li key={idx} className={bulletClass}>{ach}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <section>
            <h2 className={sectionTitleClass}>Languages</h2>
            <p className={textClass}>{languages.join(", ")}</p>
          </section>
        )}
      </div>

      {/* Extra */}
      {extra && (
        <section>
          <h2 className={sectionTitleClass}>Additional Information</h2>
          <p className={textClass}>{extra}</p>
        </section>
      )}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;
