'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Sparkles, HelpCircle, Search, Menu, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  links?: { platform: string; url: string; label: string }[];
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am your DreamSync AI Guide. How can I help you today? I can help you find tools, fix issues, or explore career paths.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('/api/career-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: userMsg }],
          context: 'System Support Mode: Help user find ATS Check, Roadmap, Ikigai, or Portfolio tools.'
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed');

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply,
        links: data.jobLinks || []
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting. Please try again or contact support.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-black text-white rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center z-[9998] hover:bg-blue-600 transition-colors group"
      >
        <div className="relative">
          <Sparkles className={`w-8 h-8 transition-transform duration-300 ${isOpen ? 'rotate-90 scale-0' : 'scale-100'}`} />
          <X className={`w-8 h-8 absolute top-0 left-0 transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-0 -rotate-90'}`} />
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-24 right-6 w-[400px] h-[640px] bg-[#0A0A0A] border border-white/10 shadow-2xl z-[9999] flex flex-col rounded-[24px] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#141414] p-5 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1D4D47] border border-white/20 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] tracking-tight text-white uppercase"><span className="text-[#2563EB]">Dream</span><span className="text-white">Sync</span> Strategist v2</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[11px] uppercase font-semibold text-gray-500 tracking-wider">Active Career Sync</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#0A0A0A] custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                   <div className={`text-[11px] font-bold uppercase tracking-widest mb-1.5 ${msg.role === 'user' ? 'text-[#1D4D47]' : 'text-gray-500'}`}>
                    {msg.role === 'user' ? 'You' : 'Strategist'}
                  </div>
                  <div className={`max-w-[90%] p-4 rounded-2xl text-[14px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#1D4D47] text-white rounded-tr-none shadow-lg shadow-[#1D4D47]/10' 
                      : 'bg-[#141414] text-gray-300 border border-white/5 rounded-tl-none shadow-xl'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.links.map((link, li) => (
                        <Link 
                          key={li}
                          href={link.label === 'Fix Profile Photo' ? '/profile?action=fix' : link.url}
                          target={link.url.startsWith('http') ? '_blank' : '_self'}
                          className="px-4 py-2 bg-[#1D4D47] hover:bg-[#2d7a71] text-white text-[11px] font-bold uppercase rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#1D4D47]/10 active:scale-95"
                        >
                          {link.label} <ArrowRight className="w-4 h-4" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#141414] border border-white/5 p-4 rounded-2xl shadow-xl">
                    <Loader2 className="w-5 h-5 animate-spin text-[#1D4D47]" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="px-5 py-3 flex gap-2 overflow-x-auto border-t border-white/5 bg-[#0A0A0A] no-scrollbar">
            {['Fix Profile Photo', 'Fix LinkedIn', 'ATS Score Check', '2026 Roadmap'].map((txt) => (
                <button 
                  key={txt}
                  onClick={() => setInput(txt)}
                  className="whitespace-nowrap px-4 py-2 bg-[#141414] hover:bg-[#1D4D47]/20 border border-white/10 text-white text-[11px] font-bold uppercase rounded-xl transition-all active:scale-95"
                >
                  {txt}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-5 bg-[#141414] border-t border-white/10">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your career trajectory..."
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 pr-14 text-white text-[14px] placeholder:text-gray-600 focus:border-[#1D4D47] focus:ring-1 focus:ring-[#1D4D47] transition-all outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="absolute right-3 p-2.5 bg-[#1D4D47] hover:bg-[#2d7a71] rounded-xl text-white disabled:opacity-30 transition-all shadow-lg active:scale-90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
