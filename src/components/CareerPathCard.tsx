'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  ExternalLink, ChevronRight, Briefcase, Lightbulb,
  TrendingUp, Wrench, Globe, IndianRupee, Star, Zap,
  Palette, Laptop, Layers, CheckCircle2, type LucideIcon
} from 'lucide-react';
import type { CareerPath } from '@/data/careerPaths';

// --- Icon resolver ---
const ICON_MAP: Record<string, LucideIcon> = {
  Palette, Laptop, Layers, Briefcase, TrendingUp, Wrench, Globe, Lightbulb, Zap,
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? CheckCircle2;
  return <Icon className={className} />;
}

// --- Demand Badge ---
function DemandBadge({ demand }: { demand: 'High' | 'Medium' | 'Low' }) {
  const styles = {
    High: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Medium: 'bg-amber-50 text-amber-600 border-amber-100',
    Low: 'bg-stone-50 text-stone-600 border-stone-200',
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-full ${styles[demand]}`}>
      {demand} Demand
    </span>
  );
}

// --- Role Card ---
function RoleCard({ role }: { role: CareerPath['roleGroups'][0]['roles'][0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border border-stone-100 p-6 rounded-[1.5rem] shadow-sm space-y-4 hover:border-blue-100 hover:shadow-md transition-all group`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-lg font-extrabold text-stone-800 leading-tight group-hover:text-blue-600 transition-colors">{role.title}</h4>
        <DemandBadge demand={role.demand} />
      </div>

      <div className="flex items-center gap-1 text-sm font-bold text-emerald-600">
        <IndianRupee className="w-4 h-4 shrink-0" />
        {role.salary}
      </div>

      <div className="flex flex-wrap gap-2">
        {role.skills.map((s) => (
          <span key={s} className="px-2 py-1 bg-stone-50 border border-stone-100 rounded-lg text-[9px] font-bold text-stone-500 uppercase tracking-tight">
            {s}
          </span>
        ))}
      </div>

      <div className="text-xs text-stone-400 font-medium flex items-center gap-2 flex-wrap border-t border-stone-50 pt-4">
        <Briefcase className="w-3.5 h-3.5 shrink-0 opacity-40" />
        {role.companies.slice(0, 3).join(' · ')}
      </div>
    </motion.div>
  );
}

// --- Roadmap Flowchart ---
function Roadmap({ nodes }: { nodes: CareerPath['roadmap'] }) {
  const colors = [
    'bg-blue-600', 'bg-emerald-500', 'bg-violet-500',
    'bg-amber-500', 'bg-rose-500',
  ];

  return (
    <div className="overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex items-start min-w-max gap-4 px-2">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center w-[160px]"
            >
              <div className={`w-12 h-12 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white font-extrabold text-sm shadow-lg z-10 border-4 border-white`}>
                {i + 1}
              </div>
              <div className={`mt-4 bg-white border border-stone-100 p-4 text-center w-full rounded-2xl shadow-sm relative`}>
                <p className="text-xs font-extrabold text-stone-800 leading-tight">{node.title}</p>
                <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-widest">{node.timeline}</p>
                <p className="text-[10px] text-stone-400 mt-2 leading-relaxed font-medium">{node.desc}</p>
              </div>
            </motion.div>
            {i < nodes.length - 1 && (
              <div className="flex items-start pt-6 mx-2 shrink-0">
                <div className="w-8 h-0.5 bg-stone-100" />
                <ChevronRight className="w-4 h-4 -ml-1 -mt-[7px] text-stone-200" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Tools Grid ---
function ToolsGrid({ tools }: { tools: CareerPath['tools'] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((t) => (
        <div key={t.name} className="bg-white border border-stone-100 px-4 py-2 rounded-xl shadow-sm hover:border-blue-100 transition-colors">
          <p className="text-xs font-bold text-stone-800">{t.name}</p>
          <p className="text-[10px] text-stone-400 font-medium">{t.category}</p>
        </div>
      ))}
    </div>
  );
}

// --- Section Header ---
function SectionHeader({ icon: Icon, title, desc }: { icon: any; title: string, desc?: string }) {
  return (
    <div className="space-y-1 mb-6">
       <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-extrabold text-stone-400 uppercase tracking-[0.2em]">{title}</h4>
       </div>
       {desc && <p className="text-sm font-medium text-stone-500 italic ml-6">{desc}</p>}
    </div>
  );
}

// --- Main component ---
export default function CareerPathCard({ path }: { path: CareerPath }) {
  const [activeSection, setActiveSection] = useState<'roles' | 'roadmap' | 'tools' | 'jobs'>('roles');

  const sections: { id: typeof activeSection; label: string; icon: any }[] = [
    { id: 'roles', label: 'Roles', icon: TrendingUp },
    { id: 'roadmap', label: 'Guide', icon: ChevronRight },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'jobs', label: 'Jobs', icon: Globe },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-stone-100 rounded-[2.5rem] shadow-sm overflow-hidden"
    >
      <div 
        className={`p-8 md:p-10 text-white relative overflow-hidden ${path.headerColor && path.headerColor.startsWith('bg-') ? path.headerColor : ''}`} 
        style={path.headerColor && !path.headerColor.startsWith('bg-') ? { background: path.headerColor } : (!path.headerColor ? { background: '#2563EB' } : {})}
      >
        <div className="absolute top-0 right-0 p-10 opacity-10"><Star className="w-24 h-24" /></div>
        <div className="relative z-10 space-y-4 max-w-2xl">
           <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20">Featured Path</span>
           </div>
           <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">{path.title}</h3>
           <p className="text-blue-50/80 font-medium leading-relaxed">{path.overview}</p>
           <div className="flex flex-wrap gap-2 pt-2">
              {path.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-black/10 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                  {tag}
                </span>
              ))}
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-stone-50/50 border-b border-stone-100 p-2 gap-2 overflow-x-auto scrollbar-hide">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2 px-6 py-3 text-xs font-bold rounded-2xl transition-all whitespace-nowrap ${
              activeSection === s.id ? 'bg-white text-blue-600 shadow-sm border border-stone-100' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            <s.icon className="w-4 h-4" /> {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-8 md:p-10">
        <AnimatePresence mode="wait">
          {activeSection === 'roles' && (
            <motion.div key="roles" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
              {path.roleGroups.map((group) => (
                <div key={group.category}>
                  <SectionHeader icon={ICON_MAP[group.icon] || CheckCircle2} title={group.category} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {group.roles.map((role) => <RoleCard key={role.title} role={role} />)}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeSection === 'roadmap' && (
            <motion.div key="roadmap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
              <div>
                <SectionHeader icon={Lightbulb} title="Step-by-step path" desc="Your journey from beginner to professional" />
                <Roadmap nodes={path.roadmap} />
              </div>
              <div>
                 <SectionHeader icon={Globe} title="Where to show your work" />
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {path.portfolioPlatforms.map((p) => (
                       <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="p-6 bg-blue-50 border border-blue-100 rounded-[1.5rem] group hover:bg-blue-600 transition-all">
                          <div className="flex items-center justify-between mb-2">
                             <p className="font-extrabold text-blue-700 group-hover:text-white transition-colors">{p.name}</p>
                             <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
                          </div>
                          <p className="text-xs font-medium text-blue-600 group-hover:text-blue-100 transition-colors leading-relaxed">{p.desc}</p>
                       </a>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'tools' && (
            <motion.div key="tools" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
              <div>
                <SectionHeader icon={Wrench} title="Recommended Skills & Tools" />
                <ToolsGrid tools={path.tools} />
              </div>
              <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 space-y-6">
                <SectionHeader icon={Zap} title="Pro Growth Tips" />
                <div className="grid md:grid-cols-2 gap-4">
                  {path.tips.map((tip, i) => (
                    <motion.div key={i} className="text-sm font-bold text-emerald-800 flex gap-3">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'jobs' && (
            <motion.div key="jobs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <SectionHeader icon={Globe} title="Live Search Portals" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {path.jobs.map((j) => (
                  <a key={j.platform} href={j.url} target="_blank" rel="noopener noreferrer" className="p-6 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 border border-stone-100 shadow-sm hover:border-blue-200 transition-all group" style={{ color: j.color }}>
                    <p className="font-extrabold text-xs uppercase tracking-widest">{j.platform}</p>
                    <p className="text-[10px] text-stone-400 font-bold uppercase">{j.label}</p>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </div>
              <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm"><Lightbulb className="w-5 h-5 text-amber-500" /></div>
                <div>
                   <p className="font-extrabold text-amber-900 mb-1 leading-tight">Pro Tip: Stay Active</p>
                   <p className="text-sm font-medium text-amber-700 leading-relaxed">Set alerts for jobs like &quot;Junior Designer&quot; to get new roles sent straight to your email every morning.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
