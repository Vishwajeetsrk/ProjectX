'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Briefcase, CheckCircle, FileText, HeartHandshake, Link2, Sparkles, LayoutDashboard, User, Zap, Globe, ShieldCheck, HelpCircle, Map, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const tools = [
  { name: 'Best Career Finder', href: '/ikigai', icon: Brain, color: 'bg-rose-50 text-rose-600', border: 'border-rose-100', desc: 'Find the heart of your career. Discover what you love and what pays well with AI coaching.', premium: true },
  { name: 'AI Job Guide', href: '/career-agent', icon: Briefcase, color: 'bg-violet-50 text-violet-600', border: 'border-violet-100', desc: 'Get step-by-step career path, local salary info, and real job links from India.' },
  { name: 'Easy Resume Builder', href: '/resume-builder', icon: FileText, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100', desc: 'Create professional resumes that help you get noticed by big companies and hiring managers.' },
  { name: 'Resume Score Check', href: '/ats-check', icon: CheckCircle, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', desc: 'Upload your resume and get an instant score. See exactly how to fix it for jobs.' },
  { name: 'LinkedIn Helper', href: '/linkedin', icon: Link2, color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100', desc: 'Get ready-to-use headlines and profile summaries to make your LinkedIn look professional.' },
  { name: 'Auto Portfolio', href: '/portfolio', icon: Sparkles, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100', desc: 'Create your own beautiful website showing your work in just a few clicks.' },
  { name: 'AI Roadmap', href: '/roadmap', icon: Map, color: 'bg-stone-50 text-stone-600', border: 'border-stone-100', desc: 'Get a personalized 90-day plan to reach your dream job, step by step.' },
  { name: 'Govt Docs & Free Resources', href: '/documents', icon: BookOpen, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', desc: 'Access free learning guides, videos, and important government forms for your career.' },
  { name: 'Mental Health AI', href: '/mental-health', icon: HeartHandshake, color: 'bg-rose-50 text-rose-600', border: 'border-rose-100', desc: 'Talk to Serenity—your friendly AI for stress, confidence, and feeling good.' },
];

export default function Dashboard() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-stone-50/50 flex items-center justify-center p-12">
         <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-stone-100 flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-[6px] border-stone-100 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="font-bold text-stone-400 uppercase tracking-widest text-[10px]">Preparing your dashboard...</span>
         </div>
      </div>
    );
  }

  const userName = userData?.name?.split(' ')[0] || user.email?.split('@')[0] || "Dreamer";

  const profileScore = (() => {
    let score = 20; // Base score for registration
    if (userData?.name || user?.displayName) score += 25;
    if (userData?.avatar_url || user?.photoURL) score += 20;
    if (userData?.email || user?.email) score += 20;
    if (userData?.provider || user?.uid) score += 15;
    return score;
  })();

  return (
    <div className="min-h-screen bg-stone-50/50 pt-40 pb-24 px-6 md:px-12 selection:bg-blue-100">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Main Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold uppercase tracking-widest">
               <LayoutDashboard className="w-4 h-4" /> Your Sanctuary
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Welcome back, <br /> <span className="text-blue-600">{userName}!</span>
            </h1>
            <p className="text-lg text-stone-500 font-medium max-w-xl">
               Every small step you take today is a giant leap for your future self. Which tool do you need today?
            </p>
          </div>
          
          <div className="flex bg-white p-2 rounded-[2rem] border border-stone-100 shadow-sm no-print">
             <div className="px-6 py-3 bg-stone-50 rounded-[1.5rem] border border-stone-100 text-center">
                <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Profile Score</p>
                <p className="text-xl font-extrabold text-stone-800">{profileScore}%</p>
             </div>
             <div className="px-8 py-3 flex flex-col justify-center">
                {profileScore < 85 ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
                    <AlertCircle className="w-4 h-4" /> Complete Profile
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                    <CheckCircle className="w-4 h-4" /> Ready for hire
                  </div>
                )}
                <p className="text-[10px] font-medium text-stone-400 mt-1 uppercase tracking-tight italic">Last updated: Today</p>
             </div>
          </div>
        </div>

        {/* Tools Section */}
        <section className="space-y-10">
          <div className="flex items-center justify-between gap-6">
             <h2 className="text-xs font-extrabold uppercase tracking-[0.3em] text-stone-400 whitespace-nowrap">Your Toolbox</h2>
             <div className="h-px w-full bg-stone-100" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-[3rem] border border-stone-100 p-10 flex flex-col h-full hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-8">
                   <div className={`p-4 ${tool.color} rounded-[1.5rem] ${tool.border} border shadow-sm group-hover:scale-110 transition-transform`}>
                      <tool.icon className="w-8 h-8" />
                   </div>
                   {tool.premium && (
                     <div className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-amber-100">
                        Pro Only
                     </div>
                   )}
                </div>
                
                <div className="flex-grow space-y-3 mb-10">
                   <h3 className="text-2xl font-extrabold text-stone-800 tracking-tight group-hover:text-blue-600 transition-colors">
                      {tool.name}
                   </h3>
                   <p className="text-sm font-medium text-stone-400 leading-relaxed">
                      {tool.desc}
                   </p>
                </div>
                
                <Link href={tool.href} className="w-full py-4 bg-stone-50 text-stone-600 font-extrabold rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-sm group/btn text-sm">
                   Get Started <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}

            {/* Support Card */}
            <div className="bg-stone-900 rounded-[3rem] p-10 text-white flex flex-col justify-center items-center text-center gap-6 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-10"><HelpCircle className="w-24 h-24" /></div>
               <div className="space-y-3 relative z-10">
                  <h3 className="text-2xl font-extrabold tracking-tight">Need help?</h3>
                  <p className="text-sm text-stone-400 font-medium">Watch tutorials or join our community of 5000+ Dreamers.</p>
               </div>
               <Link href="/community" className="w-full py-4 bg-white/10 text-white font-extrabold rounded-2xl hover:bg-white hover:text-stone-900 transition-all text-sm border border-white/20 relative z-10">
                  Visit Community
               </Link>
            </div>
          </div>
        </section>

        {/* Support Banner */}
        <div className="bg-blue-600 rounded-[3rem] p-10 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 p-12 opacity-10"><Zap className="w-32 h-32" /></div>
           <div className="space-y-4 relative z-10">
              <h2 className="text-3xl font-extrabold tracking-tighter">Your career agent is active.</h2>
              <p className="text-blue-100 font-medium">We found 3 new roles that match your profile today. Check your inbox!</p>
           </div>
           <Link href="/career-agent" className="px-10 py-5 bg-white text-blue-600 font-extrabold rounded-2xl shadow-xl hover:bg-blue-50 transition-all text-sm whitespace-nowrap relative z-10">
              Check Opportunities
           </Link>
        </div>
      </div>
    </div>
  );
}
