'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, Send, MapPin, Globe, CheckCircle2, Loader2, Star, ShieldCheck } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const applyRole = params.get('apply');
      if (applyRole) {
        setFormData(prev => ({
          ...prev,
          message: `Dear DreamSync Team,\n\nI would like to apply for the position of "${applyRole}" featured on the Community page.\n\nPlease find my contact details above. I look forward to hearing from you!`
        }));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setStatus('loading');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || 'YOUR_ACCESS_KEY_HERE',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Contact Form Submission from ${formData.name}`,
          from_name: 'DreamSync AI Platform',
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <header className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-[10px] font-bold"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>We're here for you</span>
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-stone-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Have questions? We're here to help you sync your dreams to reality. Reach out to us anytime.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 md:p-12 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/50 space-y-10"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">Send a Message</h2>
              <p className="text-stone-400 font-medium">Leave a message and we'll reply as soon as possible.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
               <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 ml-1">Your full name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field" 
                  placeholder="Arjun Sharma" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 ml-1">Email address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field" 
                  placeholder="Arjun@example.com" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 ml-1">Message</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5} 
                  className="input-field min-h-[160px] py-4" 
                  placeholder="How can we help you today?" 
                />
              </div>
              
              {status === 'success' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 font-bold flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" /> <p>Message sent! We'll get back to you soon.</p>
                </motion.div>
              )}
              
              {status === 'error' && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 font-bold">
                  Failed to send message. Please try again or use direct email.
                </motion.div>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading' || status === 'success'}
                className="btn-primary w-full !py-4 text-lg flex justify-center items-center gap-3 mt-4"
              >
                {status === 'loading' ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                ) : status === 'success' ? (
                  <><CheckCircle2 className="w-5 h-5" /> Message Sent</>
                ) : (
                  <><Send className="w-5 h-5" /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info & Socials */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Direct Contact */}
            <div className="bg-stone-900 text-white p-8 md:p-12 rounded-[3rem] shadow-xl space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10"><ShieldCheck className="w-24 h-24" /></div>
              <div className="space-y-4 relative z-10">
                <h2 className="text-3xl font-extrabold tracking-tight">Direct Support</h2>
                <p className="text-stone-400 font-medium">Reach out via our official channels.</p>
              </div>

              <div className="space-y-6 relative z-10">
                <a href="mailto:dreamsyncbangalore@gmail.com" className="group flex items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all">
                  <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Email Us</p>
                    <p className="text-lg font-bold text-white break-all">dreamsyncbangalore@gmail.com</p>
                  </div>
                </a>
                
                <a href="https://whatsapp.com/channel/0029VaFRiHbKrWR0L22onC0f" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-6 p-6 bg-emerald-600 rounded-[2rem] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                  <div className="p-4 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/60 mb-1">WhatsApp channel</p>
                    <p className="text-lg font-bold text-white">Join official channel</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/50 space-y-8">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-stone-900 tracking-tight">Community Links</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'LinkedIn', color: 'hover:bg-blue-600 hover:text-white', url: 'https://www.linkedin.com/company/dreamsync-community/' },
                  { name: 'Instagram', color: 'hover:bg-rose-600 hover:text-white', url: 'https://instagram.com/dream_sync_hub' },
                  { name: 'Facebook', color: 'hover:bg-blue-700 hover:text-white', url: 'https://www.facebook.com/groups/605404708473694/' },
                  { name: 'X / Twitter', color: 'hover:bg-stone-900 hover:text-white', url: 'https://twitter.com/ADreamsync' }
                ].map((s) => (
                  <a 
                    key={s.name} 
                    href={s.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`p-4 border border-stone-100 rounded-2xl text-center text-sm font-bold text-stone-600 transition-all shadow-sm ${s.color}`}
                  >
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
