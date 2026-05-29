'use client';

import { useState, useEffect, Suspense } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updatePassword, deleteUser, signOut as firebaseSignOut } from 'firebase/auth';
import { signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  User as UserIcon, 
  Settings, 
  Shield, 
  Camera, 
  Loader2, 
  Save, 
  LogOut,
  Trash2,
  Lock,
  ShieldAlert,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Fingerprint,
  Zap,
  Coffee,
  ShieldCheck,
  Star,
  Globe,
  Bell
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

function ProfileContent() {
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || '');
        setAvatarUrl(data.avatar_url || '');
      }
      setLoading(false);

      if (searchParams.get('action') === 'fix') {
         await handleHeadlessSync(currentUser);
      }
    });

    return () => unsubscribe();
  }, [router, searchParams]);

  const handleHeadlessSync = async (currentUser: any) => {
    setUploading(true);
    try {
      const currentPhoto = currentUser.photoURL || '';
      if (currentPhoto) {
        await setDoc(doc(db, 'users', currentUser.uid), {
          avatar_url: currentPhoto,
          last_sync: new Date().toISOString()
        }, { merge: true });
        setAvatarUrl(currentPhoto);
        setMessage({ type: 'success', text: 'Identity synced successfully' });
      } else {
        setMessage({ type: 'error', text: 'No photo source detected' });
      }
    } catch (err) {
      console.error('Headless sync failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await setDoc(doc(db, 'users', user.uid), {
        name,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      }, { merge: true });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setAvatarUrl(url);
      await setDoc(doc(db, 'users', user.uid), { avatar_url: url }, { merge: true });
      setMessage({ type: 'success', text: 'Photo updated' });
    } catch (err: any) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          setAvatarUrl(base64data);
          await setDoc(doc(db, 'users', user.uid), { avatar_url: base64data }, { merge: true });
          setMessage({ type: 'success', text: 'Photo updated locally' });
        } catch (dbErr: any) {
          setMessage({ type: 'error', text: 'File too large to sync' });
        } finally {
          setUploading(false);
        }
      };
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setLoading(true);
    try {
      await updatePassword(auth.currentUser!, newPassword);
      setMessage({ type: 'success', text: 'Security settings updated' });
      setNewPassword('');
      setCurrentPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setLoading(true);
    try {
      const uid = user.uid;
      await deleteDoc(doc(db, 'users', uid));
      await deleteUser(auth.currentUser!);
      router.push('/signup');
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Please log in again to delete account' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await firebaseSignOut(auth);
    await nextAuthSignOut({ redirect: false });
    router.push('/');
  };

  if (loading && !user) return (
     <div className="min-h-screen bg-stone-50/50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
     </div>
  );

  return (
    <div className="min-h-screen bg-stone-50/50 pt-32 pb-24 px-6 selection:bg-blue-100">
      
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Profile Header */}
        <header className="flex flex-col lg:flex-row justify-between items-end gap-10 pb-12 border-b border-stone-200">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-stone-900 text-white rounded-2xl shadow-lg">
                <Fingerprint className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Personal Identity</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 tracking-tight leading-none">
              My <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-8">Profile</span>
            </h1>
          </div>
          
          <div className="bg-white p-2 rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-200/50 flex gap-1 overflow-x-auto scrollbar-hide max-w-full">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 md:px-8 md:py-4 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-stone-400 hover:bg-stone-50'}`}
            >
              Identity
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`px-6 py-3 md:px-8 md:py-4 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-stone-400 hover:bg-stone-50'}`}
            >
              Security
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 md:px-8 md:py-4 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-stone-400 hover:bg-stone-50'}`}
            >
              Settings
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div 
              key="profile" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12"
            >
              {/* Profile Card */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col items-center text-center space-y-8 group">
                  <div className="relative w-48 h-48 rounded-[3rem] p-1.5 bg-stone-50 shadow-inner overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover rounded-[2.7rem]" />
                    ) : (
                      <div className="w-full h-full bg-stone-100 flex items-center justify-center rounded-[2.7rem]">
                         <UserIcon className="w-20 h-20 text-stone-300" />
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                      </div>
                    )}
                    <input type="file" id="avatar-upload-profile" hidden accept="image/*" onChange={handleAvatarUpload} />
                    <label htmlFor="avatar-upload-profile" className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer rounded-[3rem]">
                      <Camera className="w-12 h-12 text-white" />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-3xl font-extrabold text-stone-900 tracking-tight">{name || 'Your Name'}</h3>
                    <div className="flex flex-col items-center gap-2">
                       <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-widest rounded-full inline-flex items-center gap-1.5">
                         <ShieldCheck className="w-3 h-3" /> Verified Member
                       </div>
                       <p className="text-xs font-bold text-stone-400 uppercase tracking-tight pt-2">{user?.email}</p>
                    </div>
                  </div>

                  <div className="w-full pt-8 border-t border-stone-50 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-[9px] font-bold uppercase text-stone-300 mb-1 tracking-widest">Growth plan</p>
                      <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Free Explorer</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-bold uppercase text-stone-300 mb-1 tracking-widest">Connectivity</p>
                      <div className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest flex items-center justify-center gap-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                      </div>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/donate" 
                  className="w-full bg-amber-50 group hover:bg-amber-100 border border-amber-100 p-6 rounded-[2.5rem] flex items-center justify-between gap-4 transition-all shadow-sm"
                >
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm text-amber-500 group-hover:scale-110 transition-transform">
                        <Coffee className="w-6 h-6 fill-current" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-extrabold text-amber-900 uppercase tracking-widest leading-none">Support Us</p>
                        <p className="text-[10px] font-bold text-amber-700/60 uppercase mt-1">Help more students</p>
                      </div>
                   </div>
                   <ArrowRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Form Area */}
              <div className="lg:col-span-8 space-y-8">
                <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/50 space-y-12">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-stone-300 flex items-center gap-3">
                      <Settings className="w-5 h-5" /> Information Management
                    </h3>
                  </div>
                  
                  <form onSubmit={handleUpdateProfile} className="space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Your Full Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="input-field text-xl font-bold" 
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="pt-6 border-t border-stone-50">
                       <button type="submit" className="btn-primary px-12 !py-4 flex items-center justify-center gap-4 group">
                         <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> <span>Update Profile Identity</span>
                       </button>
                    </div>
                  </form>
                </div>

                {/* Notifications Hint */}
                <div className="bg-blue-600 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10 shadow-xl shadow-blue-500/20">
                   <div className="p-5 bg-white/10 rounded-[2rem] shrink-0"><Bell className="w-10 h-10" /></div>
                   <div className="space-y-3 text-center md:text-left">
                      <h4 className="text-2xl font-extrabold tracking-tight">Stay synchronized.</h4>
                      <p className="text-blue-100 font-medium opacity-80 leading-relaxed">We'll alert you to new roadmap steps, ATS updates, and career opportunities directly in your dashboard.</p>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div 
              key="security" 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }} 
              className="space-y-12"
            >
              <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/50 space-y-12">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-stone-300 flex items-center gap-3">
                    <Shield className="w-5 h-5" /> Security Protocol
                  </h3>
                  <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Credential Management</h2>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-10 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Current Password</label>
                      <input 
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                        placeholder="••••••••"
                        className="input-field" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        placeholder="••••••••"
                        className="input-field" 
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary px-12 !py-4 flex items-center gap-4 group">
                    <Lock className="w-5 h-5 group-hover:-translate-y-1 transition-transform" /> <span>Update Credentials</span>
                  </button>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-rose-50 border border-rose-100 p-12 rounded-[3rem] flex flex-col xl:flex-row xl:items-center justify-between gap-12">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-[9px] font-bold uppercase tracking-widest">
                    <ShieldAlert className="w-3.5 h-3.5" /> High Sensitivity Area
                  </div>
                  <h3 className="text-3xl font-extrabold text-rose-900 tracking-tight leading-none">Terminate Session</h3>
                  <p className="text-rose-700/60 font-medium max-w-xl">
                    Full de-authorization of account and permanent erasure of all career synchronization data within our system. This action cannot be reversed.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleSignOut}
                    className="px-10 py-4 bg-white text-stone-600 border border-stone-100 font-bold uppercase text-[10px] tracking-widest rounded-2xl hover:bg-stone-50 transition-all flex items-center justify-center gap-3 shadow-sm"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    className={`px-10 py-4 font-bold uppercase text-[10px] tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all shadow-sm ${confirmDelete ? 'bg-rose-600 text-white animate-pulse' : 'bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white'}`}
                  >
                    <Trash2 className="w-4 h-4" /> {confirmDelete ? 'De-authorizing...' : 'Revoke Account'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings" 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.98 }} 
              className="space-y-12"
            >
              <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/50 space-y-12">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-stone-300 flex items-center gap-3">
                    <Settings className="w-5 h-5" /> System Settings
                  </h3>
                  <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Preferences & Locale</h2>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    setMessage({ type: 'success', text: 'System settings updated successfully' });
                  }, 600);
                }} className="space-y-10 max-w-2xl">
                  
                  {/* Language Option */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" /> Language Preference
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                       <button
                         type="button"
                         onClick={() => setLanguage('en')}
                         className={`p-6 rounded-[1.5rem] border font-bold text-left transition-all ${language === 'en' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-stone-100 bg-white text-stone-600 hover:border-stone-200'}`}
                       >
                         <p className="text-sm">English</p>
                         <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Default</p>
                       </button>
                       <button
                         type="button"
                         onClick={() => setLanguage('hi')}
                         className={`p-6 rounded-[1.5rem] border font-bold text-left transition-all ${language === 'hi' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-stone-100 bg-white text-stone-600 hover:border-stone-200'}`}
                       >
                         <p className="text-sm">हिन्दी</p>
                         <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Hindi</p>
                       </button>
                    </div>
                  </div>

                  {/* Timezone Option */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest ml-1">Timezone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="input-field text-sm font-bold bg-white"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+05:30)</option>
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="America/New_York">America/New_York (EST/EDT)</option>
                      <option value="Europe/London">Europe/London (GMT/BST)</option>
                      <option value="Asia/Singapore">Asia/Singapore (SGT - UTC+08:00)</option>
                    </select>
                  </div>

                  <div className="pt-6 border-t border-stone-50">
                     <button type="submit" className="btn-primary px-12 !py-4 flex items-center justify-center gap-4 group">
                       <Save className="w-5 h-5 group-hover:scale-110 transition-transform" /> <span>Save Preferences</span>
                     </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )        }
        </AnimatePresence>

        {/* Floating Feedback */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`fixed bottom-10 right-6 md:right-10 p-6 rounded-[2rem] shadow-2xl z-[100] flex gap-4 items-center border ${message.type === 'success' ? 'bg-stone-900 text-white border-stone-800' : 'bg-rose-600 text-white border-rose-500'}`}
            >
              <div className={`p-3 rounded-2xl ${message.type === 'success' ? 'bg-blue-600' : 'bg-rose-500'}`}>
                {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">{message.type === 'success' ? 'Sync Complete' : 'Alert'}</p>
                <p className="text-lg font-extrabold tracking-tight leading-none">{message.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-stone-50/50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
       </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
