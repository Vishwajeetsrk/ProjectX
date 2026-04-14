'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { updatePassword } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Lock, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No active session found. Please re-authenticate.');
      
      await updatePassword(user, password);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
      >
        {success ? (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 border-4 border-black rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-10 h-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">Security Updated!</h2>
              <p className="text-gray-500 font-bold text-sm">
                Your new secret phrase has been activated. <br />
                Redirecting to your dashboard...
              </p>
            </div>
            <Link 
              href="/dashboard" 
              className="block w-full py-4 bg-black text-white font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Continue to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-black uppercase tracking-tight text-blue-600">Secure Account</h2>
              <p className="text-gray-500 font-bold text-sm uppercase tracking-tighter">Enter your new professional secret phrase.</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400">New Secret Phrase</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 border-4 border-black p-4 pl-12 font-black outline-none focus:bg-white transition-colors"
                      placeholder="••••••••"
                      minLength={8}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400">Confirm Secret Phrase</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-50 border-4 border-black p-4 pl-12 font-black outline-none focus:bg-white transition-colors"
                      placeholder="••••••••"
                      minLength={8}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-black text-red-600 text-xs font-black uppercase flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-black text-white font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                Activate New Secret Phrase
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
