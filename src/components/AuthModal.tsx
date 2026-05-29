/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { X, Lock, Phone, User, MapPin, CheckCircle, ShieldAlert, Award, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register-customer' | 'register-farmer';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const { login, registerCustomer, registerFarmer } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'register-customer' | 'register-farmer'>(defaultTab);
  
  // States
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginRole, setLoginRole] = useState<'Customer' | 'Farmer' | 'Admin'>('Customer');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Customer registration state
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custAddress, setCustAddress] = useState('');

  // Farmer registration state
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerPassword, setFarmerPassword] = useState('');
  const [farmerDistrict, setFarmerDistrict] = useState('Rajshahi');
  const [farmerAddress, setFarmerAddress] = useState('');
  const [farmerNid, setFarmerNid] = useState('');
  const [farmerNidImg, setFarmerNidImg] = useState('');
  const [farmerGender, setFarmerGender] = useState<'male' | 'female'>('male');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!phone) {
      setErrorMsg('মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    const res = login(phone, loginRole, password);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        setPhone('');
        setPassword('');
        setSuccessMsg('');
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleCustomerRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!custName || !custPhone || !custPassword || !custAddress) {
      setErrorMsg('অনুগ্রহ করে সবগুলো ঘর পূরণ করুন।');
      return;
    }

    if (!/^01[3-9]\d{8}$/.test(custPhone)) {
      setErrorMsg('সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নাম্বার দিন (যেমন: 01712345678)');
      return;
    }

    const res = registerCustomer(custName, custPhone, custPassword, custAddress);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
        // Reset
        setCustName('');
        setCustPhone('');
        setCustPassword('');
        setCustAddress('');
        setSuccessMsg('');
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleFarmerRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!farmerName || !farmerPhone || !farmerPassword || !farmerAddress || !farmerNid) {
      setErrorMsg('অনুগ্রহ করে সবগুলো তথ্য নির্ভুলভাবে প্রদান করুন।');
      return;
    }

    if (!/^01[3-9]\d{8}$/.test(farmerPhone)) {
      setErrorMsg('সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন।');
      return;
    }

    const defaultNidImg = farmerNidImg || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=50';

    const res = registerFarmer(
      farmerName,
      farmerPhone,
      farmerPassword,
      farmerDistrict,
      farmerAddress,
      farmerNid,
      defaultNidImg,
      farmerGender
    );

    if (res.success) {
      setSuccessMsg(res.message);
      // Keep it open for user to read the Pending message clearly
      setTimeout(() => {
        onClose();
        setFarmerName('');
        setFarmerPhone('');
        setFarmerPassword('');
        setFarmerAddress('');
        setFarmerNid('');
        setFarmerNidImg('');
        setSuccessMsg('');
      }, 5000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-y-auto max-h-[90vh] rounded-3xl bg-white shadow-2xl transition-all border border-emerald-50 text-left select-none">
        
        {/* Banner header inside */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-600 to-green-500 px-6 py-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-black/10 p-1.5 text-white/95 hover:bg-black/20 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
          
          <span className="text-[10px] font-black tracking-widest uppercase bg-emerald-700/60 text-emerald-50 px-2.5 py-1 rounded-lg">🌱 কৃষক বাজার (Krishok Bazar)</span>
          <h3 className="text-xl sm:text-2xl font-black font-sans mt-2">নিরাপদ ডোরস্টেপ এগ্রি-মার্কেট</h3>
          <p className="mt-1 text-xs text-emerald-100/90 leading-relaxed font-sans">১০০% মধ্যসত্বভোগী মুক্ত সরাসরি কৃষক কেনাবেচা। মোবাইল নাম্বারের সাহায্যে সহজে নিবন্ধন ও লগইন সম্পন্ন করুন।</p>
        </div>

        {/* Dynamic Nav Tabs (Login / Customer Reg / Farmer Reg) */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 text-xs sm:text-sm">
          <button
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-center font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'login' 
                ? 'border-emerald-600 text-emerald-700 bg-white' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            লগইন (Login)
          </button>
          <button
            onClick={() => { setActiveTab('register-customer'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-center font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'register-customer' 
                ? 'border-emerald-600 text-emerald-700 bg-white' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            ক্রেতা নিবন্ধন (Customer)
          </button>
          <button
            onClick={() => { setActiveTab('register-farmer'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-3 text-center font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'register-farmer' 
                ? 'border-emerald-600 text-emerald-700 bg-white' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            কৃষক আবেদন (Farmer)
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6">
          
          {errorMsg && (
            <div className="mb-4 rounded-2xl bg-red-50 p-4 text-xs font-semibold text-red-700 border border-red-100 flex items-start gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 border border-emerald-150 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 animate-bounce" />
                <span>সফল আপডেট!</span>
              </div>
              <p className="font-medium text-emerald-700 leading-relaxed font-sans">{successMsg}</p>
            </div>
          )}

          {/* TAB 1: PORTAL LOGIN ACCESS */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Role switcher tags */}
              <div>
                <label className="block text-[10px] uppercase font-black text-gray-400 mb-2 tracking-wider">ড্যাশবোর্ড রোল নির্বাচন করুন:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: 'Customer', label: '🛒 সম্মানিত ক্রেতা' },
                    { role: 'Farmer', label: '🌾 অংশীদার কৃষক' },
                    { role: 'Admin', label: '👑 প্রধান এডমিন' }
                  ].map((x) => (
                    <button
                      key={x.role}
                      type="button"
                      onClick={() => { 
                        setLoginRole(x.role as any);
                        setErrorMsg('');
                        setSuccessMsg('');
                        if (x.role === 'Admin') {
                          setPhone('01931355398');
                          setPassword('password');
                        } else if (x.role === 'Farmer') {
                          setPhone('01712345100');
                        } else {
                          setPhone('01931355398');
                        }
                      }}
                      className={`rounded-xl py-2.5 text-xs font-bold text-center border transition-all cursor-pointer ${
                        loginRole === x.role
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50/50'
                      }`}
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile phone select */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 font-sans">মোবাইল নম্বর (Mobile Number)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="১১ ডিজিটের মোবাইল নম্বর দিন"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 text-xs font-medium text-gray-700 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 font-sans">পাসওয়ার্ড (Password)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="নিরাপত্তা পাসওয়ার্ড দিন"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 text-xs font-medium text-gray-750 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 py-3.5 text-xs font-bold text-white shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                লগইন নিশ্চিত করুন (Secure Login)
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-gray-400">
                  নিবন্ধিত অ্যাকাউন্ট নেই?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register-customer')}
                    className="text-emerald-700 font-extrabold hover:underline"
                  >
                    নতুন অ্যাকাউন্ট তৈরি করুন
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* TAB 2: CUSTOMER REGISTER */}
          {activeTab === 'register-customer' && (
            <form onSubmit={handleCustomerRegSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 font-sans">গ্রাহকের পূর্ণ নাম (Full Name)</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মুক্তা বেগম"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 text-xs font-medium text-gray-700 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 font-sans">মোবাইল নাম্বার (Mobile Number)</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    placeholder="১১ ডিজিটের বাংলাদেশী মোবাইল নাম্বার দিন"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 text-xs font-medium text-gray-700 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 font-sans">লগইন পাসওয়ার্ড (Password)</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="ন্যূনতম ৬ অক্ষরের সংকেত পাসওয়ার্ড"
                    value={custPassword}
                    onChange={(e) => setCustPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 text-xs font-medium text-gray-700 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 font-sans">ডেলিভারি ঠিকানা ও জেলা (Delivery Address)</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: হাউজ ২১, রোড ৫, মিরপুর-১১, ঢাকা"
                    value={custAddress}
                    onChange={(e) => setCustAddress(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-4 text-xs font-medium text-gray-700 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 py-3.5 text-xs font-bold text-white shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                গ্রাহক নিবন্ধন সম্পন্ন করুন
              </button>
            </form>
          )}

          {/* TAB 3: FARMER APPLY */}
          {activeTab === 'register-farmer' && (
            <form onSubmit={handleFarmerRegSubmit} className="space-y-4">
              
              <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                <p className="text-[10px] leading-normal text-orange-850 font-sans">
                  🌾 <strong>কৃষক নিয়োগ নীতিমালা:</strong> আমাদের প্রতিটি কৃষককে জাতীয় পরিচয়পত্র (NID) নম্বর ও ছবি প্রদান করে আবেদন রক্ষা করতে হবে। প্রধান এডমিন কর্তৃক আবেদন ভেরিফিকেশন সম্পন্ন হবার পরেই কেবল আপনি পণ্য আপলোড করতে ও ব্যালেন্স উত্তোলন করতে সক্ষম হবেন।
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">কৃষকের পূর্ণ নাম</label>
                  <input
                    type="text"
                    required
                    placeholder="আনিসুর রহমান"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3 text-xs font-medium text-gray-700 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">১১ ডিজিটের মোবাইল</label>
                  <input
                    type="tel"
                    required
                    placeholder="01712345678"
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3 text-xs font-medium text-gray-700 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">পাসওয়ার্ড</label>
                  <input
                    type="password"
                    required
                    placeholder="পাসওয়ার্ড"
                    value={farmerPassword}
                    onChange={(e) => setFarmerPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-250 py-2.5 px-3 text-xs font-medium text-gray-750 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">কৃষক জেলা</label>
                  <select
                    value={farmerDistrict}
                    onChange={(e) => setFarmerDistrict(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3 text-xs font-semibold text-gray-600 bg-white"
                  >
                    <option value="Rajshahi">রাজশাহী (Rajshahi)</option>
                    <option value="Jessore">যশোর (Jessore)</option>
                    <option value="Rangpur">রংপুর (Rangpur)</option>
                    <option value="Bogra">বগুড়া (Bogra)</option>
                    <option value="Sylhet">সিলেট (Sylhet)</option>
                    <option value="Comilla">কুমিল্লা (Comilla)</option>
                    <option value="Dinajpur">দিনাজপুর (Dinajpur)</option>
                    <option value="Barisal">বরিশাল (Barisal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">কৃষকের সম্পূর্ণ এলাকা ও গ্রাম্য ঠিকানা</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: গ্রাম: হরিণাকুণ্ডু, ডাকঘর: হরিণাকুণ্ডু, বাঘা, রাজশাহী"
                  value={farmerAddress}
                  onChange={(e) => setFarmerAddress(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3 text-xs font-medium text-gray-750 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">১০/১৭ ডিজিটের NID নাম্বার</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ১৯৯৯৭২১১..."
                    value={farmerNid}
                    onChange={(e) => setFarmerNid(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3 text-xs font-semibold outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">NID কার্ডের সামনের ছবি (NID Upload)</label>
                  <input
                    type="text"
                    placeholder="এনআইডি ছবির লিংক (ঐচ্ছিক)"
                    value={farmerNidImg}
                    onChange={(e) => setFarmerNidImg(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3 text-xs"
                  />
                </div>
              </div>

              {/* Farmer Gender Button selector */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">নারী/পুরুষ কৃষক নির্বাচন:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFarmerGender('male')}
                    className={`rounded-xl py-2 text-xs font-bold border transition-all cursor-pointer text-center ${
                      farmerGender === 'male' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    🧔 পুরুষ খামারি (Male Farmer logo)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFarmerGender('female')}
                    className={`rounded-xl py-2 text-xs font-bold border transition-all cursor-pointer text-center ${
                      farmerGender === 'female' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    👩 নারী খামারি (Female Farmer logo)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 py-3.5 text-xs font-bold text-white shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                <Award className="h-4.5 w-4.5" />
                আবেদন জমা দিন (Submit Application)
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
