'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageCircle, Send, MapPin, Globe, CheckCircle2, Loader2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
    <div className="space-y-12 max-w-6xl mx-auto py-8">
      <header className="border-b-4 border-black pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center justify-center gap-4">
          <MessageCircle className="w-12 h-12" /> Get in Touch
        </h1>
        <p className="text-xl text-muted-foreground font-medium">Have questions? We're here to help you sync your dreams to reality.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white border-4 border-black p-8 neo-box">
          <h2 className="text-3xl font-black mb-6">Send a Message</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-bold">Your Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-primary/20 neo-box" 
                placeholder="John Doe" 
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-primary/20 neo-box" 
                placeholder="john@example.com" 
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold">Message</label>
              <textarea 
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5} 
                className="w-full p-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-primary/20 neo-box" 
                placeholder="How can we help?" 
              />
            </div>
            
            {status === 'success' && (
              <div className="p-3 bg-green-100 border-2 border-green-500 text-green-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Message sent successfully! We'll get back to you soon.
              </div>
            )}
            
            {status === 'error' && (
              <div className="p-3 bg-red-100 border-2 border-red-500 text-red-800 font-bold">
                Failed to send message. Please try again or use direct email.
              </div>
            )}

            <button 
              type="submit" 
              disabled={status === 'loading' || status === 'success'}
              className="w-full py-4 bg-black text-white font-black text-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex justify-center items-center gap-3 disabled:opacity-70 uppercase tracking-tighter"
            >
              {status === 'loading' ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> SYNCHRONIZING...</>
              ) : status === 'success' ? (
                <><CheckCircle2 className="w-5 h-5" /> SENT!</>
              ) : (
                <><Send className="w-5 h-5" /> Send Message</>
              )}
            </button>
          </form>
        </div>

        {/* Contact Info Card */}
        <div className="space-y-8">
          <div className="bg-accent text-black border-4 border-black p-8 neo-box transform md:rotate-2">
            <h2 className="text-3xl font-black mb-6 border-b-2 border-black pb-2">Direct Contact</h2>
            <div className="space-y-6 text-lg font-medium">
              <a href="mailto:dreamsyncbangalore@gmail.com" className="flex items-center gap-4 hover:underline">
                <div className="p-3 bg-white border-2 border-black hidden sm:block"><Mail className="w-6 h-6" /></div>
                <div>
                  <p className="font-bold">Email Us</p>
                  dreamsyncbangalore@gmail.com
                </div>
              </a>
              
              <a href="https://whatsapp.com/channel/0029VaFRiHbKrWR0L22onC0f" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:underline">
                <div className="p-3 bg-[#25D366] text-white border-2 border-black hidden sm:block"><Phone className="w-6 h-6" /></div>
                <div>
                  <p className="font-bold">WhatsApp Channel</p>
                  Join Official Channel
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white border-4 border-black p-8 neo-box transform md:-rotate-1">
            <h2 className="text-2xl font-black mb-6 border-b-2 border-black pb-2 flex items-center gap-2"><Globe /> Social Media</h2>
            <div className="flex flex-col gap-4 font-bold">
              <a href="https://www.linkedin.com/company/dreamsync-community/" target="_blank" rel="noopener noreferrer" className="p-3 border-2 border-black hover:bg-[#0A66C2] hover:text-white transition-colors text-center">LinkedIn</a>
              <a href="https://instagram.com/dream_sync_hub" target="_blank" rel="noopener noreferrer" className="p-3 border-2 border-black hover:bg-[#E1306C] hover:text-white transition-colors text-center">Instagram</a>
              <a href="https://www.facebook.com/groups/605404708473694/" target="_blank" rel="noopener noreferrer" className="p-3 border-2 border-black hover:bg-[#1877F2] hover:text-white transition-colors text-center">Facebook Group</a>
              <a href="https://twitter.com/ADreamsync" target="_blank" rel="noopener noreferrer" className="p-3 border-2 border-black hover:bg-black hover:text-white transition-colors text-center">X (Twitter)</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
