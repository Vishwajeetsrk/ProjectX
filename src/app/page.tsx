'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Brain, Briefcase, CheckCircle, FileText, HeartHandshake, Sparkles, Coffee, Map, TrendingUp, Building2, User, Users, Globe, ShieldCheck, Zap, MapPin, ClipboardCheck, MonitorPlay, Network, Star, ArrowDown, Link2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

const StatCounter = ({ value }: { value: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      const num = parseInt(value);
      const suffix = value.replace(/[0-9]/g, '');
      const controls = animate(0, num, {
        duration: 2,
        onUpdate: (latest) => setDisplay(Math.floor(latest) + suffix)
      });
      return () => controls.stop();
    }
  }, [value, isInView]);

  return <span ref={ref}>{display}</span>;
};

const Step = ({ number, title, desc, icon: Icon }: { number: string, title: string, desc: string, icon: any }) => (
  <div className="flex flex-col items-center text-center p-6 space-y-4 relative">
    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-sm">
      <Icon className="w-8 h-8" />
      <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
        {number}
      </span>
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-bold text-stone-900">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed max-w-xs">{desc}</p>
    </div>
  </div>
);

export default function Home() {
  const { user, userData } = useAuth();
  const [stats, setStats] = useState({
    happyStudents: '1+',
    resumesCreated: '0+',
    supportLocations: '1+'
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats({
          happyStudents: `${data.happyStudents}+`,
          resumesCreated: `${data.resumesCreated}+`,
          supportLocations: `${data.supportLocations || 1}+`
        });
      })
      .catch(err => console.error('Error loading dynamic metrics:', err));
  }, []);

  const features = [
    { title: 'Best Career Finder', desc: 'Find the heart of your career. Discover what you love and what pays well with AI coaching.', icon: Brain, href: "/ikigai" },
    { title: 'AI Job Guide', desc: 'Get step-by-step career path, local salary info, and real job links from India.', icon: Briefcase, href: "/career-agent" },
    { title: 'Easy Resume Builder', desc: 'Create professional resumes that help you get noticed by big companies and hiring managers.', icon: FileText, href: "/resume-builder" },
    { title: 'Resume Score Check', desc: 'Upload your resume and get an instant score. See exactly how to fix it for jobs.', icon: CheckCircle, href: "/ats-check" },
    { title: 'LinkedIn Helper', desc: 'Get ready-to-use headlines and profile summaries to make your LinkedIn look professional.', icon: Link2, href: "/linkedin" },
    { title: 'Auto Portfolio', desc: 'Create your own beautiful website showing your work in just a few clicks.', icon: Sparkles, href: "/portfolio" },
    { title: 'AI Roadmap', desc: 'Get a personalized 90-day plan to reach your dream job, step by step.', icon: Map, href: "/roadmap" },
    { title: 'Govt Docs & Free Resources', desc: 'Access free learning guides, videos, and important government forms for your career.', icon: BookOpen, href: "/documents" },
    { title: 'Mental Health AI', desc: 'Talk to Serenity—your friendly AI for stress, confidence, and feeling good.', icon: HeartHandshake, href: "/mental-health" },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* 🔮 HERO SECTION */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-3xl opacity-50 z-0" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-bold"
          >
            <Star className="w-4 h-4 fill-current" />
            <span>Helping youth build bright careers</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
              We help you build your career <br />
              <span className="text-blue-600">step by step</span>
            </h1>

            <p className="text-lg md:text-xl text-stone-500 font-medium max-w-2xl mx-auto leading-relaxed">
              DreamSync is your friendly companion for career guidance, resume building, and life support. Simple, safe, and made for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link href="/signup" className="btn-primary w-full sm:w-auto text-lg !px-12">
              Start Here
            </Link>
            <Link href="#how-it-works" className="btn-secondary w-full sm:w-auto text-lg !px-12 flex items-center justify-center gap-2">
              How it works <ArrowDown className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 🌊 HOW IT WORKS SECTION */}
      <section id="how-it-works" className="section-padding bg-stone-50/50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">It's as easy as 1-2-3</h2>
            <p className="text-stone-500 font-medium">Simple steps to kickstart your journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Lines (Desktop) */}
            <div className="hidden md:block absolute top-14 left-1/3 right-1/4 h-0.5 bg-blue-100 -z-0" />
            
            <Step 
              number="1" 
              title="Tell us about you" 
              desc="Answer a few simple questions about your interests and what you'd like to do." 
              icon={User} 
            />
            <Step 
              number="2" 
              title="Get guidance" 
              desc="Our friendly AI finds the best career paths and training for you." 
              icon={Brain} 
            />
            <Step 
              number="3" 
              title="Build your career" 
              desc="Create your resume, find local jobs, and start your dream career." 
              icon={Briefcase} 
            />
          </div>
        </div>
      </section>

      {/* 📊 IMPACT STATS SECTION */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {[
            { val: stats.supportLocations, label: 'Support Locations', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-50' },
            { val: stats.happyStudents, label: 'Happy Students', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { val: stats.resumesCreated, label: 'Resumes Created', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
            { val: '24/7', label: 'AI Support', icon: HeartHandshake, color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card p-8 flex flex-col items-center text-center gap-4 hover-lift"
            >
              <div className={`p-4 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                  <StatCounter value={stat.val} />
                </h2>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🧪 FEATURE CARDS SECTION */}
      <section className="section-padding bg-stone-50/50">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">Tools to help you grow</h2>
            <p className="text-stone-500 font-medium">Everything you need to succeed in one place</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((tool, i) => (
              <Link href={tool.href} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-8 h-full flex flex-col items-start gap-5 hover-lift group"
                >
                  <div className="p-3 bg-stone-50 text-stone-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{tool.desc}</p>
                  </div>
                  <div className="mt-auto pt-4 flex items-center gap-2 text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-[32px] p-8 md:p-16 text-center text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">Ready to start your journey?</h2>
            <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              Join hundreds of students who are building their future with DreamSync. 100% free and easy to use.
            </p>
            <div className="pt-4">
              <Link href="/signup" className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-blue-50 transition-all inline-block">
                Start My Journey Now
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
