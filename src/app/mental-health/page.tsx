'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartHandshake, Send, Mic, MicOff, Volume2, VolumeX,
  RotateCcw, Phone, PlayCircle, StopCircle, MessageCircle, Globe, ChevronDown, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { validateCareerInput } from '@/lib/aiGuard';

// ── Types ─────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ── Mood Options ─────────────────────────────────────────────────
const moods = [
  { emoji: '😊', label: 'Happiness',   color: 'bg-green-100 border-green-400' },
  { emoji: '😔', label: 'Sadness',     color: 'bg-blue-100 border-blue-400' },
  { emoji: '😠', label: 'Anger',       color: 'bg-red-100 border-red-400' },
  { emoji: '😨', label: 'Fear',        color: 'bg-purple-100 border-purple-400' },
  { emoji: '😲', label: 'Surprise',    color: 'bg-yellow-100 border-yellow-400' },
  { emoji: '🤢', label: 'Disgust',     color: 'bg-gray-100 border-gray-400' },
];

const affirmations = [
  "You are doing better than you think. 🌻",
  "It's okay to not be okay. Take it one breath at a time. 💙",
  "Your struggles don't define your worth. 🌿",
  "Every difficult day is building a stronger you. ✨",
  "You are not alone in this journey. 🫂",
  "Small steps are still progress. Be kind to yourself. 🌱",
];

const resources = [
  { name: "iCall (India)",           number: "9152987821",    desc: "Tata Institute — free counseling" },
  { name: "Vandrevala Foundation",   number: "1860-2662-345", desc: "24/7 mental health helpline" },
  { name: "Snehi Helpline",          number: "044-24640050",  desc: "Emotional support & counseling" },
];

const languages = [
  { code: 'en-IN', name: 'English (India)', native: 'English' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn-IN', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr-IN', name: 'Marathi', native: 'मराठी' },
  { code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or-IN', name: 'Odia', native: 'ଓଡ଼ିଆ' },
];

// ── Voice wave animation ───────────────────────────────────────────
function VoiceWave({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-1 h-8">
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-rose-400"
          animate={active ? {
            height: ['8px', `${16 + Math.random() * 20}px`, '8px'],
          } : { height: '4px' }}
          transition={{ repeat: Infinity, duration: 0.5 + i * 0.1, delay: i * 0.08 }}
        />
      ))}
    </div>
  );
}

// ── Chat Bubble ───────────────────────────────────────────────────
function ChatBubble({ msg, onSpeak, isSpeaking }: {
  msg: Message;
  onSpeak?: (text: string) => void;
  isSpeaking?: boolean;
}) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3`}
    >
      {!isUser && (
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 border-2 flex items-center justify-center shrink-0 mt-1 shadow-md transition-all ${isSpeaking ? 'border-rose-500 scale-110 shadow-rose-300 shadow-lg' : 'border-rose-300'}`}>
          <HeartHandshake className="w-4 h-4 text-white" />
        </div>
      )}
      <div className="flex flex-col gap-1 max-w-[85%]">
        <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
          isUser
            ? 'bg-rose-500 text-white rounded-tr-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]'
            : 'bg-white border border-rose-200 text-gray-800 rounded-tl-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,0.08)]'
        }`}>
          <p className="whitespace-pre-wrap">{msg.content}</p>
        </div>
        {/* Per-message speak button — only for Serenity */}
        {!isUser && onSpeak && (
          <button
            onClick={() => onSpeak(msg.content)}
            className="flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-rose-600 transition-colors self-start ml-1"
            title="Hear Serenity speak this message"
          >
            <PlayCircle className="w-3.5 h-3.5" /> Speak this
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function MentalHealthAgent() {
  const { user, userData } = useAuth();
  const userName = userData?.name?.split(' ')[0] || user?.email?.split('@')[0] || null;

  const [mood, setMood]               = useState<string | null>(null);
  const [messages, setMessages]       = useState<Message[]>([]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [voiceMode, setVoiceMode]     = useState(false);    // full voice mode
  const [listening, setListening]     = useState(false);    // STT active
  const [speaking, setSpeaking]       = useState(false);    // TTS active
  const [affirmationIdx, setAffirmationIdx] = useState(0);
  const [selectedLang, setSelectedLang] = useState(languages[0]); // Default to English (India)
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showResources, setShowResources]   = useState(false);
  const [transcript, setTranscript]   = useState('');       // live interim transcript

  const bottomRef     = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Rotate affirmations
  useEffect(() => {
    const interval = setInterval(() => setAffirmationIdx(i => (i + 1) % affirmations.length), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── TTS — speaks text, says user's name optionally ────────────────
  const speak = useCallback((text: string, prefix?: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') { resolve(); return; }
      window.speechSynthesis.cancel();
      setSpeaking(true);

      const fullText = prefix ? `${prefix}. ${text}` : text;
      const utter = new SpeechSynthesisUtterance(fullText);
      utter.rate   = 0.87;
      utter.pitch  = 1.08;
      utter.volume = 1.0;

      utter.onend  = () => { setSpeaking(false); resolve(); };
      utter.onerror = () => { setSpeaking(false); resolve(); };

      const trySpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const langCode = selectedLang.code;
        const primaryCode = langCode.split('-')[0];
        
        // 1. Find all potential candidate voices for this specific language
        const candidates = voices.filter(v => v.lang.startsWith(primaryCode) || v.lang.includes(langCode));
        
        if (candidates.length === 0) {
          console.warn(`No native voice found for ${selectedLang.name}. Skipping audio.`);
          setSpeaking(false);
          return;
        }

        // 2. Prioritize: Native + Female + High Quality (Google/Microsoft)
        let preferred = candidates.find(v => 
          v.name.toLowerCase().includes('female') && 
          (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural'))
        );

        // 3. Fallback: Any Female for this language
        if (!preferred) preferred = candidates.find(v => v.name.toLowerCase().includes('female'));

        // 4. Fallback: Any voice for this language
        if (!preferred) preferred = candidates[0];

        // FINAL GUARD: If we somehow picked a voice that is NOT for the selected language group, ABORT.
        // This prevents English voices with thick accents from reading non-English text.
        if (preferred && !preferred.lang.startsWith(primaryCode)) {
          console.error("Voice language mismatch. Aborting audio to prevent accent issues.");
          setSpeaking(false);
          return;
        }

        if (preferred) utter.voice = preferred;
        utter.lang = langCode;
        window.speechSynthesis.speak(utter);
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        trySpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = trySpeak;
      }
    });
  }, [selectedLang]);

  // Stop speaking
  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  // ── STT — listen then auto-send in voice mode ─────────────────────
  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Voice input needs Chrome or Edge browser.');
      return;
    }
    // Stop any ongoing speech before listening
    stopSpeaking();

    const recognition: any = new SR();
    recognition.continuous     = false;
    recognition.interimResults = true;
    recognition.lang           = selectedLang.code;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (e: any) => {
      let interim = '';
      let final   = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(interim);
      if (final) {
        setTranscript('');
        setListening(false);
        recognition.stop();
        // In voice mode → auto send
        if (voiceMode) {
          sendMessage(final.trim());
        } else {
          setInput(prev => prev + final.trim());
        }
      }
    };

    recognition.onerror = () => { setListening(false); setTranscript(''); };
    recognition.onend   = () => { setListening(false); setTranscript(''); };

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceMode, selectedLang]);  // eslint-disable-line

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
    setTranscript('');
  };

  // Toggle voice mode — announce on enable
  const handleVoiceModeToggle = async () => {
    const next = !voiceMode;
    setVoiceMode(next);
    if (next) {
      const greet = userName ? `Hi ${userName}` : 'Hi there';
      await speak(`${greet}. I'm Serenity, and I'm here for you. Tap the big microphone to talk to me, and I'll listen and speak back.`);
    } else {
      stopSpeaking();
      stopListening();
    }
  };

  // ── Send message (text or from voice) ────────────────────────────
  const sendMessage = async (text?: string) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    // 1. Safety Guard
    const safety = validateCareerInput(userText);
    if (!safety.allowed) {
      setMessages(prev => [
        ...prev, 
        { role: 'user', content: userText },
        { 
          role: 'assistant', 
          content: `⚠️ Safety Warning: ${safety.message}\n\nPlease talk about professional, safe, and ethical topics. I am here to support your mental well-being in a positive way.` 
        }
      ]);
      setInput('');
      if (voiceMode) await speak(safety.message);
      return;
    }

    const userMsg: Message = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg];
      const res = await fetch('/api/mental-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, mood: mood || 'not specified' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');

      const assistantMsg: Message = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, assistantMsg]);

      // Speak reply — prepend name on first message
      const isFirst = messages.length === 0;
      const prefix  = isFirst && userName ? userName : undefined;
      await speak(data.reply, prefix);

      // In voice mode — auto start listening again after speaking
      if (voiceMode) {
        setTimeout(() => startListening(), 400);
      }

    } catch {
      const errMsg: Message = {
        role: 'assistant',
        content: "I'm so sorry, I'm having a little trouble right now. You are not alone — please try again in a moment. 💙",
      };
      setMessages(prev => [...prev, errMsg]);
      if (voiceMode) await speak(errMsg.content);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Mood Selection Screen ─────────────────────────────────────────
  if (!mood) {
    return (
      <div className="min-h-screen bg-stone-50/50 pt-32 px-6">
        <div className="max-w-2xl mx-auto space-y-12">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
            <motion.div
              animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-rose-400 to-pink-500 border-2 border-white flex items-center justify-center mx-auto shadow-xl shadow-rose-200"
            >
              <HeartHandshake className="w-12 h-12 text-white" />
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
                Hi{userName ? `, ${userName}` : ''}! I&apos;m Serenity 🌸
              </h1>
              <p className="text-lg text-stone-500 font-medium max-w-md mx-auto">
                Your safe, private space to talk. No judgment, just support for your mental well-being.
              </p>
            </div>
          </motion.div>

          {/* Affirmation Card */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white border border-stone-100 rounded-[2.5rem] p-8 text-center shadow-sm">
            <AnimatePresence mode="wait">
              <motion.p key={affirmationIdx}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                className="text-lg font-bold text-rose-500 italic leading-relaxed">
                &ldquo;{affirmations[affirmationIdx]}&rdquo;
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Mood Picker */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
            <p className="text-lg font-bold text-stone-800 text-center">How are you feeling right now?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {moods.map((m, i) => (
                <motion.button
                  key={m.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  onClick={() => setMood(m.label)}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-6 bg-white border border-stone-100 rounded-[2rem] font-bold flex flex-col items-center gap-3 transition-all shadow-sm hover:shadow-md hover:border-rose-100`}
                >
                  <span className="text-4xl">{m.emoji}</span>
                  <span className="text-sm text-stone-600">{m.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="text-xs text-center text-stone-400 font-medium pb-12">
            This is a safe space. Serenity is an AI companion and does not replace professional therapy.
          </motion.p>
        </div>
      </div>
    );
  }

  // ── Chat Screen ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50/50 pt-32 px-6">
      <div className="max-w-2xl mx-auto space-y-6 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border border-stone-100 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-4">
            <motion.div
              animate={speaking ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ repeat: speaking ? Infinity : 0, duration: 1 }}
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 border-2 border-white flex items-center justify-center shadow-lg transition-all ${speaking ? 'shadow-rose-200' : ''}`}
            >
              <HeartHandshake className="w-7 h-7 text-white" />
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Mental Health AI</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className={`w-2 h-2 rounded-full ${speaking ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-xs text-stone-400 font-bold uppercase tracking-widest">
                  {speaking ? 'Serenity Talking...' : listening ? 'Listening...' : 'Serenity Online'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-2xl border border-stone-100 text-stone-500 font-bold text-xs hover:bg-white hover:text-blue-600 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              {selectedLang.native}
            </button>
            <button
              onClick={handleVoiceModeToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-bold text-xs transition-all ${voiceMode ? 'bg-rose-500 text-white border-rose-500 shadow-md' : 'bg-stone-50 border-stone-100 text-stone-500 hover:bg-white'}`}
            >
              {voiceMode ? <Mic className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5" />}
              {voiceMode ? 'Voice' : 'Text'}
            </button>
            <button onClick={() => setShowResources(!showResources)} className="p-2.5 bg-stone-50 rounded-2xl border border-stone-100 text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Crisis Resources */}
        <AnimatePresence>
          {showResources && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-rose-50 border border-rose-100 rounded-[2rem] p-8 space-y-4">
              <p className="font-bold text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" /> Crisis Support (India)
              </p>
              <div className="grid grid-cols-1 gap-4">
                {resources.map(r => (
                  <div key={r.name} className="flex items-center justify-between p-4 bg-white rounded-xl border border-rose-100 shadow-sm">
                    <div>
                      <p className="font-bold text-sm text-stone-800">{r.name}</p>
                      <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">{r.desc}</p>
                    </div>
                    <a href={`tel:${r.number}`} className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md">
                      Call {r.number}
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div className="bg-white border border-stone-100 rounded-[2.5rem] shadow-sm min-h-[400px] max-h-[500px] overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {messages.length === 0 && (
            <div className="text-center py-10 space-y-4 opacity-50">
              <div className="text-6xl">✨</div>
              <p className="font-bold text-stone-800">
                {userName ? `I'm here for you, ${userName}.` : "I'm here for you."}
              </p>
              <p className="text-sm text-stone-400 font-medium max-w-xs mx-auto">
                Whatever is on your mind, you can share it here safely.
              </p>
              <div className="flex flex-col gap-2 pt-4">
                 <button onClick={() => sendMessage("I'm feeling a bit overwhelmed")} className="mx-auto px-6 py-2 rounded-full border border-stone-100 text-xs font-bold text-stone-500 hover:bg-stone-50 transition-all">I&apos;m feeling overwhelmed</button>
                 <button onClick={() => sendMessage("I need some motivation")} className="mx-auto px-6 py-2 rounded-full border border-stone-100 text-xs font-bold text-stone-500 hover:bg-stone-50 transition-all">I need some motivation</button>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              msg={msg}
              onSpeak={(t) => speak(t)}
              isSpeaking={i === messages.length - 1 && speaking && msg.role === 'assistant'}
            />
          ))}

          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5 text-rose-500" />
              </div>
              <div className="bg-stone-50 border border-stone-100 rounded-[2rem] rounded-tl-sm px-6 py-4">
                <div className="flex gap-2">
                  <motion.div className="w-2 h-2 bg-rose-400 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} />
                  <motion.div className="w-2 h-2 bg-rose-400 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                  <motion.div className="w-2 h-2 bg-rose-400 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* VOICE MODE BIG BUTTON area */}
        {voiceMode && (
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] border border-stone-100 p-10 flex flex-col items-center gap-8 shadow-sm">
              <VoiceWave active={listening || speaking} />
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={listening ? stopListening : (speaking ? stopSpeaking : startListening)}
                className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all shadow-2xl ${listening ? 'bg-rose-500 border-rose-200' : speaking ? 'bg-blue-600 border-blue-200' : 'bg-stone-900 border-stone-100'}`}
              >
                {listening ? <MicOff className="w-12 h-12 text-white" /> : speaking ? <StopCircle className="w-12 h-12 text-white" /> : <Mic className="w-12 h-12 text-white" />}
              </motion.button>
              
              <div className="text-center space-y-2">
                <p className="text-lg font-bold text-stone-800">
                  {speaking ? 'Serenity is talking...' : listening ? 'I am listening...' : 'Tap the mic to talk'}
                </p>
                {transcript && <p className="text-sm text-stone-400 font-medium italic">&ldquo;{transcript}&rdquo;</p>}
              </div>
           </motion.div>
        )}

        {/* Input Bar (Text mode) */}
        {!voiceMode && (
          <div className="bg-white border border-stone-100 rounded-[2.5rem] shadow-sm p-4 flex items-end gap-3">
             <textarea
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder="Share what is on your mind..."
               rows={1}
               className="flex-1 p-4 bg-transparent text-stone-800 font-medium focus:outline-none resize-none placeholder:text-stone-300"
             />
             <div className="flex items-center gap-2">
                <button onClick={listening ? stopListening : startListening} className={`p-4 rounded-2xl transition-all ${listening ? 'bg-rose-500 text-white' : 'bg-stone-50 text-stone-400 hover:text-stone-600'}`}>
                   {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="btn-primary !p-4 disabled:opacity-30">
                   <Send className="w-5 h-5" />
                </button>
             </div>
          </div>
        )}

        <div className="text-center">
           <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">
              Serenity · DreamSync AI Assistant
           </p>
        </div>
      </div>
    </div>
  );
}
