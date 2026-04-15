'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      let friendlyMessage = "Failed to send reset email. Please verify if the email is correct.";
      if (err.code === 'auth/user-not-found') {
        friendlyMessage = "No account found with this email address.";
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = "Please enter a valid email address.";
      } else if (err.code === 'auth/too-many-requests') {
        friendlyMessage = "Too many requests. Please try again in 5 minutes.";
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md bg-white border-4 border-black p-8 neo-box">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-green-400 flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
              <CheckCircle2 className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Check Your Email!</h1>
            <p className="text-muted-foreground font-black mt-4 uppercase text-sm">
              Sent recovery link to <span className="text-black">{email}</span>.
            </p>
            <p className="text-xs mt-4 font-bold text-gray-400 uppercase tracking-widest"> (Verify your spam folder) </p>
          </div>
          
          <Link 
            href="/login" 
            className="w-full py-4 bg-[#2563EB] text-white font-black text-lg border-4 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> BACK TO LOGIN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 neo-box">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#2563EB] flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-center uppercase tracking-tight">Reset Password</h1>
          <p className="text-muted-foreground font-bold text-center text-sm uppercase tracking-tight mt-2">Enter your email to reset your password</p>
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-black p-4 mb-6 text-red-900 font-bold text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-black text-xs uppercase tracking-widest text-gray-500">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-gray-50 border-4 border-black p-4 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#2563EB]/20 transition-all font-black"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-black text-white font-black text-lg border-4 border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'SENDING...' : 'SEND RESET LINK'} 
          </button>
        </form>

        <div className="mt-8 text-center border-t-4 border-black border-dashed pt-6">
          <Link href="/login" className="text-[#2563EB] font-black hover:underline flex items-center justify-center gap-2 uppercase text-sm">
            <ArrowLeft className="w-4 h-4" /> BACK TO LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
}
