import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { ShieldCheck, Lock, Phone, ArrowLeft, KeyRound } from 'lucide-react';

interface AdminLoginViewProps {
  onBackToHome: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onBackToHome }) => {
  const { login } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!phone || !password) {
      setErrorMsg('মোবাইল নম্বর এবং পাসওয়ার্ড দুটিই আবশ্যক!');
      return;
    }

    setIsLoading(true);

    // Call standard login context with 'Admin' role
    setTimeout(() => {
      const res = login(phone, 'Admin', password);
      setIsLoading(false);
      if (res.success) {
        setSuccessMsg('প্রধান এডমিন সফলভাবে প্রবেশ করেছেন! রিডিরেক্ট করা হচ্ছে...');
      } else {
        setErrorMsg('অননুমোদিত এডমিন নম্বর অথবা ভুল পাসওয়ার্ড!');
      }
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-500/5 px-4 py-16 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-blue-100 shadow-xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-emerald-600 to-green-500" />
        
        <div className="text-center font-sans">
          <div className="mx-auto h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm mb-4">
            <Lock className="h-8 w-8 animate-pulse" />
          </div>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
            কৃষক বাজার • এডমিন কন্ট্রোল ইউনিট
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 mt-2">
            প্রধান এডমিন পোর্টাল লগইন
          </h2>
          <p className="text-xs text-gray-450 mt-1">
            শুধুমাত্র অনুমোদিত পরিচালনা পরিষদের জন্য সুরক্ষিত ড্যাশবোর্ড
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-2xl bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-100 flex items-start gap-2.5">
            <span className="shrink-0 mt-0.5 text-base">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="rounded-2xl bg-emerald-50 p-4 text-xs font-black text-emerald-800 border border-emerald-150 flex items-start gap-2.5">
            <span className="shrink-0 mt-0.5 text-base text-emerald-600 animate-bounce">✔</span>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">
              অনুমোদিত এডমিন ফোন / ইউজারনেম:
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                placeholder="যেমন: 01931355398"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 text-xs font-mono font-bold text-gray-750 outline-none focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">
              সিকিউরিটি এক্সেস পাসওয়ার্ড:
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                placeholder="নিরাপত্তা পিনকোড দিন"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 text-xs font-semibold outline-none focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-4 text-xs font-bold text-white shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isLoading ? 'প্রবেশ চেক করা হচ্ছে...' : 'সুরক্ষিত ড্যাশবোর্ডে প্রবেশ করুন ✔'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={onBackToHome}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-600 hover:text-blue-750 hover:underline cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            সাধারণ ব্যবহারকারী হোমপজে ফিরে যান
          </button>
        </div>

      </div>
    </div>
  );
};
