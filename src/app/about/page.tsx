'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import { 
  TrendingUp, Briefcase, FileText, HeartHandshake, 
  Target, Globe, Zap, Heart, ArrowRight, ChevronDown, CheckCircle,
  Building2, ShieldCheck, User,
  MapPin, ClipboardCheck, MonitorPlay, Network, Sparkles
} from 'lucide-react';
import Link from 'next/link';

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

// --- COMPONENTS ---

const FeatureCard = ({ title, desc, icon: Icon, color }: { title: string, desc: string, icon: any, color: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-8 bg-white rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-all group"
    >
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-stone-800 mb-4">{title}</h3>
      <p className="text-sm font-medium text-stone-500 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-3xl border border-stone-100 bg-white overflow-hidden shadow-sm transition-all hover:border-stone-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="text-lg font-bold text-stone-800">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={`p-2 rounded-full ${isOpen ? 'bg-blue-50 text-blue-600' : 'bg-stone-50 text-stone-400'}`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-stone-50"
          >
            <div className="p-6 text-sm font-medium leading-relaxed text-stone-500">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN PAGE ---

export default function About() {
  const featureCards = [
    { 
      title: "Document Support", 
      desc: "Get simple, step-by-step help preparing important ID cards, government forms, and professional papers correctly.",
      icon: FileText,
      color: "bg-blue-50 text-blue-600"
    },
    { 
      title: "Learning Library", 
      desc: "Access easy-to-follow guides and free learning tools built especially for students starting their career journey.",
      icon: Zap,
      color: "bg-amber-50 text-amber-600"
    },
    { 
      title: "A Safe Community", 
      desc: "Join a friendly group of peers to chat, share advice, and grow together in a non-judgmental environment.",
      icon: Heart,
      color: "bg-rose-50 text-rose-600"
    },
    { 
      title: "Career Mentorship", 
      desc: "Participate in live sessions that build your confidence and help you navigate the world of work.",
      icon: HeartHandshake,
      color: "bg-emerald-50 text-emerald-600"
    }
  ];

  const faqs = [
    {
      q: "What is DreamSync?",
      a: "DreamSync is a supportive community created for students and young people to connect, learn career skills, and grow together."
    },
    {
      q: "Who is this for?",
      a: "We specially support care-experienced and underprivileged youth (16-30) who are looking for career guidance and a helpful community."
    },
    {
      q: "Is it free to use?",
      a: "Yes! Our platform and community are entirely free for students. We want to ensure everyone has access to professional tools."
    },
    {
      q: "How can I get started?",
      a: "Simply create a free account to join the community, build your first resume, or check out our learning resources."
    }
  ];

  return (
    <div className="flex flex-col bg-stone-50/50 min-h-screen">
      
      {/* Soft Marquee Ticker */}
      <div className="bg-white border-y border-stone-100 py-3 mt-[88px] overflow-hidden">
        <motion.div 
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 font-bold text-xs uppercase tracking-widest text-stone-400 items-center"
        >
          <div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-blue-600" /> Empowering Care-Experienced Youth</div>
          <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-emerald-500" /> Impacting Bangalore</div>
          <div className="flex items-center gap-3"><HeartHandshake className="w-5 h-5 text-rose-500" /> A Positive Community Culture</div>
          <div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-blue-600" /> Empowering Care-Experienced Youth</div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 space-y-32">
        
        {/* SECTION 1 — HERO ABOUT TITLE */}
        <section className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest"
          >
             <Sparkles className="w-4 h-4" /> About Our Story
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-center max-w-5xl mx-auto text-stone-900">
            A safe space to <br />
            <span className="text-blue-600">connect, grow & empower</span> <br />
            your future.
          </h1>

          <div className="max-w-3xl mx-auto space-y-6 pt-10 border-t border-stone-100">
            <p className="text-xl md:text-2xl text-stone-800 font-bold leading-relaxed">
              DreamSync is more than just a platform — it&apos;s a hub built for individuals who have grown up independently.
            </p>
            <p className="text-lg md:text-xl text-stone-400 font-medium leading-relaxed">
               Join our family-like destination where you can meet mentors, greet friends, and find the tools you need to succeed in your career journey.
            </p>
          </div>
        </section>

        {/* SECTION 2 — FEATURES */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900">
              How we support you
            </h2>
            <p className="text-lg font-bold text-blue-600 uppercase tracking-widest">
              Resources for Your Journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureCards.map((card, i) => (
              <FeatureCard 
                key={i}
                title={card.title}
                desc={card.desc}
                icon={card.icon}
                color={card.color}
              />
            ))}
          </div>
        </section>


        {/* SECTION 3 — IMPACT STATS */}
        <section className="bg-stone-900 rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-20 opacity-5">
              <Building2 className="w-64 h-64 text-white" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center relative z-10">
             {[
               { value: "5+", label: "Cities Reached", icon: MapPin, color: 'text-blue-400' },
               { value: "100+", label: "Resumes Built", icon: ClipboardCheck, color: 'text-emerald-400' },
               { value: "10+", label: "Support Sessions", icon: MonitorPlay, color: 'text-rose-400' },
               { value: "50+", label: "Active Members", icon: Network, color: 'text-amber-400' }
             ].map((stat, i) => (
               <div key={i} className="space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                     <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-5xl md:text-6xl font-black text-white">
                    <StatCounter value={stat.value} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                    {stat.label}
                  </p>
               </div>
             ))}
           </div>
        </section>

        {/* SECTION 4 — FAQ */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="space-y-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-stone-900">Common questions</h2>
                <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">Always here to help</p>
             </div>
             <div className="h-px flex-grow hidden md:block bg-stone-100" />
             <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center text-rose-500">
                <Heart className="w-6 h-6 fill-rose-50" />
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <FAQItem 
                key={i}
                question={faq.q}
                answer={faq.a}
              />
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="pb-40">
          <div className="bg-white rounded-[3rem] p-12 md:p-20 text-center space-y-10 border border-stone-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
             
             <h2 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
                Ready to start your <br /> journey with us?
             </h2>
             <p className="text-lg md:text-xl text-stone-400 font-medium max-w-2xl mx-auto">
                Join our supportive community and build a future alongside people who truly understand your path.
             </p>
             
             <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link href="/signup" className="btn-primary flex items-center gap-3 !px-10 !py-4 shadow-xl">
                  Join Community <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/contact" className="btn-secondary !px-10 !py-4">
                   Talk to Us
                </Link>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
