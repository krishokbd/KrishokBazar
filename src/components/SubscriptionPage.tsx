import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Check, CheckCircle, ShieldCheck, HelpCircle, PhoneCall, CreditCard, Award, ArrowLeft, MessageSquare } from 'lucide-react';

export const SUBSCRIPTION_PLANS = [
  {
    id: 'weekly-combo-pack',
    nameBn: 'সাপ্তাহিক কম্বো প্যাক (Weekly Combo Pack)',
    nameEn: 'Weekly Combo Packs',
    badgeBn: 'সাপ্তাহিক জোগান',
    badgeEn: 'Weekly Bundle',
    price: 500,
    descBn: '১ সপ্তাহের জন্য সতেজ শাকসবজি ও প্রয়োজনীয় ডাল-আলুর কম্বো বাস্কেট। ছোট বা ব্যাচেলর ফ্যামিলির প্রিয় পছন্দ।',
    descEn: 'Fresh seasonal vegetables and basic kitchen staples delivered weekly.',
    perksBn: ['১ সপ্তাহব্যাপী সতেজ সবজি ও ডিম', '০ শতাংশ অতিরিক্ত হিডেন চার্জ', '২৫% ডেলিভারি ডিসকাউন্ট সুবিধা'],
    perksEn: ['Weekly fresh vegetable basket', 'Zero hidden service fees', '25% off shipping cost']
  },
  {
    id: 'standard-500',
    nameBn: 'স্ট্যান্ডার্ড ৫০০ (Standard 500)',
    nameEn: 'Standard 500 Plan',
    badgeBn: 'সাশ্রয়ী চাহিদা',
    badgeEn: 'Budget Veg pack',
    price: 500,
    descBn: '১ মাসের জন্য নিয়মিত সতেজ সবজি ডেলিভারি ক্যাশ। স্বল্প বাজেটে মধ্যবিত্ত পরিবারের চমৎকার সাশ্রয় প্যাকেজ।',
    descEn: 'Budget-friendly monthly fresh crop allotment for small families.',
    perksBn: ['৪ ক্যাটাগরির তাজা সবুজ শাকসবজি', 'পরিষ্কার ও সতেজ হাইজেনিক প্যাকিং', '৫০% ডেলিভারি চার্জ ডিসকাউন্ট'],
    perksEn: ['4 Core organic veggies monthly', 'Hygienic standard package', '50% shipping fee discount']
  },
  {
    id: 'standard',
    nameBn: 'স্ট্যান্ডার্ড (Standard)',
    nameEn: 'Standard Monthly Plan',
    badgeBn: 'পপুলার চয়েস',
    badgeEn: 'Popular Choice',
    price: 1000,
    descBn: 'মাঝারি পরিবারের জন্য ১ মাসের সম্পূর্ণ তাজা সবজির সল্যুশন। সরাসরি কাপাসিয়া মাঠ থেকে সতেজ জোগান।',
    descEn: 'Comprehensive monthly fresh farm crops deal for mid-sized families.',
    perksBn: ['৮ ক্যাটাগরির তাজা সবজি ও ফলমূল', 'পরিষ্কার কাটা ও গোছানো রেডি মিক্স', '১০০% ফ্রি হোম ডেলিভারি সুবিধা'],
    perksEn: ['8 categories fresh organic produce', 'Pre-sorted clean food packets', '100% Free doorstep shipping']
  },
  {
    id: 'premium-1000',
    nameBn: 'প্রিমিয়াম ১০০০ (Premium 1000)',
    nameEn: 'Premium 1000 Plan',
    badgeBn: 'ভিআইপি ডিল',
    badgeEn: 'VIP Deals',
    price: 1000,
    descBn: '১ মাসের জন্য রেডি-টু-কুক ধোয়া-কাটা সবজি এবং বিশেষ ম্যারিনেট করা মুরগী/গরুর মাংসের প্রিমিয়াম রেডি প্যাক।',
    descEn: 'Pre-washed cut vegetables, marinated meat recipes, and premium pantry staples.',
    perksBn: ['সকল স্ট্যান্ডার্ড সার্ভিসের সুবিধা অন্তর্ভুক্ত', 'রেডি-টু-কুক কাটা সবজি ও মাছ-মাংস', '১০০% ফ্রি ডেডিকেটেড ডেলিভারি সার্ভিস'],
    perksEn: ['Includes Standard Perks', 'Ready-To-Cook pre-washed items', 'Zero delivery charge ever']
  },
  {
    id: 'super-1500',
    nameBn: 'সুপার ১৫০০ (Super 1500)',
    nameEn: 'Super 1500 Elite Plan',
    badgeBn: 'মেগা লাইফস্টাইল',
    badgeEn: 'Ultimate Elite',
    price: 1500,
    descBn: 'যৌথ পরিবারের ১৫ দিনের জন্য মেগা কম্বো বাস্কেট। ১ কেজি খাঁটি খলিশা মধু, ১ ডজন দেশী হাসের ডিম এবং খাঁটি সর্ষের তেল।',
    descEn: 'Mega-sized premium organic bundle for health-conscious joint families.',
    perksBn: ['প্রিমিয়ামের সকল সুবিধার সাথে সুন্দরবনের খলিশা মধু', '১ ডজন সতেজ চাকভাঙ্গা বা খামারের আস্ত ডিম', 'ব্যক্তিগত খামারি ভিডিও কলের অগ্রাধিকার সাপোর্ট'],
    perksEn: ['Includes Premium offerings', 'Free honey, premium mustard oil & organic eggs', 'Live video assistant support']
  }
];

interface SubscriptionPageProps {
  onBack: () => void;
}

export const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onBack }) => {
  const { currentUser, language, submitMembershipRequest, siteSettings, notificationSystem } = useApp();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'customer' | 'farmer'>('customer');
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  // Form input states
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [txId, setTxId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Cash'>('bKash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successInvoice, setSuccessInvoice] = useState<any | null>(null);

  const handleSubscribeClick = (plan: any) => {
    setSelectedPlan(plan);
    setTxId('');
    setSuccessInvoice(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address || !txId) {
      alert(language === 'bn' ? 'দয়া করে সবগুলো তথ্য সঠিকভাবে পূরণ করুন!' : 'Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    const code = `KB-SUB-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // 1. Submit record to app context database (Firestore / LocalState)
      submitMembershipRequest(phone, txId, selectedPlan.id, selectedPlan.price);

      // Trigger a success log message
      if (notificationSystem && notificationSystem.addNotification) {
        notificationSystem.addNotification(
          language === 'bn' ? 'সাবস্ক্রিপশন আবেদন পেন্ডিং অবস্থায় দাখিল করা হয়েছে!' : 'Subscription request pending approval!',
          'info'
        );
      }

      // 2. Format a WhatsApp message content
      const whatsappText = `নতুন সাবস্ক্রিপশন অনুরোধ:
• প্ল্যান: ${selectedPlan.nameBn} (৳${selectedPlan.price})
• কাস্টমার নাম: ${name}
• কাস্টমার ফোন: ${phone}
• ঠিকানা: ${address}
• পেমেন্ট মেথড: ${paymentMethod}
• ট্রানজেকশন আইডি: ${txId}
• অনুরোধ আইডি: ${code}

অনুগ্রহ করে এডমিন প্যানেল থেকে আমার এই পেমেন্ট যাচাই করে সাবস্ক্রিপশন সচল করুন। ধন্যবাদ!`;

      // 3. Keep structured invoice state
      setSuccessInvoice({
        code,
        name,
        phone,
        address,
        planTitle: selectedPlan.nameBn,
        price: selectedPlan.price,
        txId,
        paymentMethod,
        whatsappUrl: `https://wa.me/8801931355398?text=${encodeURIComponent(whatsappText)}`
      });

    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation back and header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-3xs text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 px-3 rounded-full bg-emerald-50 text-[9px] font-black text-emerald-800 uppercase tracking-wider">
                👑 PREMIUM PORTAL
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              {language === 'bn' ? 'প্রিমিয়াম সাবস্ক্রিপশন ও সার্ভিস হাব' : 'Premium Subscription Packages'}
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              {language === 'bn'
                ? 'সরাসরি জমি থেকে সতেজ ফসল, বাস্কেট সার্ভিস ও আড়তদার বিহীন খাঁটি খাবারের শতভাগ সাশ্রয়ী লাইসেন্স।'
                : 'Direct broker-free premium services for consumer savings and ultimate organic field harvests.'}
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 hover:bg-slate-50 border border-gray-200 text-gray-650 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto transition-all hover:scale-101 active:scale-95 shadow-3xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{language === 'bn' ? 'হোমে ফিরে যান' : 'Go Back'}</span>
          </button>
        </div>

        {/* Master pricing layout */}
        {!selectedPlan ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-emerald-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between border border-emerald-900 shadow-md max-w-full text-left gap-6">
              <div className="space-y-2.5">
                <span className="bg-emerald-800 text-yellow-400 font-extrabold px-3.5 py-1 text-[10px] rounded-lg border border-emerald-700/60 font-sans tracking-wide">
                  ⭐ NO BROKER FEES • DIRECT SAVINGS
                </span>
                <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                  {language === 'bn' ? 'কেন আপনি আমাদের সাবস্ক্রিপশন গ্রাহক হবেন?' : 'Why Join Our Premium Member Club?'}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed max-w-3xl">
                  {language === 'bn'
                    ? 'আমাদের সাবস্ক্রিপশন স্কিমটি সম্পূর্ণ মধ্যস্বত্বভোগী ও ফড়িয়াদল বিহীন। সতেজ রান্নার জন্য রেডি-টু-কুক ধোয়া-কাটা নিরাপদ শাকসবজি, স্পেশাল ম্যারিনেট করা ব্রয়লার বা দেশি মুরগির টুকরো এবং কাপাসিয়া থেকে সরাসরি ঢাকায় ফ্রী হোম ডেলিভারি নিশ্চিত করতে বেছে নিন আপনার উপযুক্ত মাসিক বাজেট প্ল্যান।'
                    : 'Get access to direct farm routes, pre-washed ready-to-cook crop packs, free logistics pickup from Kapasia depots, and instant 3-hour bkash payouts.'}
                </p>
              </div>
              <div className="bg-emerald-800/40 border border-emerald-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center shrink-0 w-full md:w-auto">
                <span className="text-gray-300 text-[10px] font-black uppercase">হটলাইন সাহায্য</span>
                <span className="text-white text-base font-black font-mono mt-1">📱 01931355398</span>
                <span className="text-[9px] text-amber-300 font-bold mt-1">WhatsApp Activation Support</span>
              </div>
            </div>

            {/* Subscriptions Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 text-left font-sans">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-3xl border p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-350 relative ${
                    plan.id === 'standard' ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/5' : 'border-gray-150'
                  }`}
                >
                  {plan.id === 'standard' && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-black text-[8.5px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow">
                      {language === 'bn' ? '★ সর্বাধিক জনপ্রিয়' : '★ MOST POPULAR'}
                    </div>
                  )}

                  <div className="space-y-3 mt-1">
                    <div className="flex justify-between items-start gap-1">
                      <span className={`px-2.5 py-0.5 text-[8.5px] font-black rounded-lg border uppercase tracking-wider text-center ${
                        plan.price === 500 ? 'bg-amber-50 text-amber-800 border-amber-100' : 'bg-emerald-50 text-emerald-800 border-emerald-100'
                      }`}>
                        {language === 'bn' ? plan.badgeBn : plan.badgeEn}
                      </span>
                      <span className="text-xs font-black text-emerald-700 shrink-0 font-mono">৳{plan.price} / মাস</span>
                    </div>

                    <h3 className="text-sm font-black text-gray-800 leading-tight">
                      {language === 'bn' ? plan.nameBn : plan.nameEn}
                    </h3>

                    <p className="text-[10px] text-gray-500 leading-relaxed min-h-[36px]">
                      {language === 'bn' ? plan.descBn : plan.descEn}
                    </p>

                    <div className="pt-3 border-t border-gray-100/70 space-y-2">
                      <span className="text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wide block">
                        {language === 'bn' ? 'প্যাকেজের সুযোগ-সুবিধাসমূহ:' : 'Key Included Perks:'}
                      </span>
                      <ul className="space-y-1.5 text-[10.5px] text-gray-650 font-medium">
                        {(language === 'bn' ? plan.perksBn : plan.perksEn).map((perk, i) => (
                          <li key={i} className="flex items-start gap-1.5 leading-normal">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      type="button"
                      onClick={() => handleSubscribeClick(plan)}
                      className={`w-full py-2 bg-emerald-50 font-black text-[11px] rounded-xl hover:bg-emerald-600 hover:text-white transition-all text-center cursor-pointer ${
                        plan.id === 'standard' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'text-emerald-800'
                      }`}
                    >
                      {language === 'bn' ? 'সাবস্ক্রাইব করুন' : 'Subscribe Plan'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // ONLINE TRANSFER ORDER INVOICE OR INPUT SUBMISSION DETAILS PORTAL
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-md text-left font-sans">
            
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 p-5 sm:p-6 text-white border-b border-emerald-950 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">OFFLINE SECURED TRANSFER</span>
                <h3 className="text-base sm:text-lg font-black mt-1">
                  {language === 'bn' ? 'পেমেন্ট ও ভেরিফিকেশন ফর্ম' : 'Secure Transfer Verification'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                {language === 'bn' ? 'প্ল্যান পরিবর্তন করুন' : 'Change Plan'}
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {!successInvoice ? (
                // SUBMIT REQUEST FORM
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100/70 p-4 space-y-2">
                    <div className="flex justify-between font-black text-sm">
                      <span className="text-gray-700">{language === 'bn' ? 'নির্বাচিত প্ল্যান:' : 'Plan:'}</span>
                      <span className="text-emerald-900">{language === 'bn' ? selectedPlan.nameBn : selectedPlan.nameEn}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm pt-2 border-t border-emerald-100/50">
                      <span className="text-gray-750">{language === 'bn' ? 'মোট কাপাসিয়া ক্যাশ আউট ফি:' : 'Total Payable amount:'}</span>
                      <span className="text-emerald-700">৳{selectedPlan.price} BDT</span>
                    </div>
                  </div>

                  {/* Payment numbers card */}
                  <div className="border border-red-100 bg-red-50/40 p-4 rounded-2xl space-y-2.5">
                    <h4 className="text-xs font-black text-red-950 uppercase tracking-wider flex items-center gap-1.5">
                      ⚠️ {language === 'bn' ? 'অগ্রিম পেমেন্ট নির্দেশনা:' : 'Advance Payment Instructions:'}
                    </h4>
                    <p className="text-[11px] text-red-900 leading-normal font-sans font-medium">
                      {language === 'bn' 
                        ? 'আপনার আবেদনটি সম্পন্ন করার জন্য অনুগ্রহ করে নিচের যেকোনো একটি মোবাইল ব্যাংকিং নাম্বারে পার্সোনাল ক্যাশ আউট সম্পন্ন করুন। পেমেন্ট সম্পন্ন হবার পর ট্রানজেকশন আইডি (TxID) কপি করে নিচের ঘরে লিখে ফর্মটি দাখিল করুন।' 
                        : 'Please cash-out the exact amount to the personal number below. Enter your transaction ID (TxID) to submit.'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-white border border-gray-150 p-3 rounded-xl flex flex-col">
                        <span className="text-[9px] font-black text-pink-600">bKash Personal (বিকাশ)</span>
                        <span className="text-xs font-extrabold font-mono text-gray-800 mt-1 select-all">01931355398</span>
                        <span className="text-[8.5px] text-gray-400 mt-0.5">ক্যাশ আউট ফি প্রযোজ্য</span>
                      </div>
                      <div className="bg-white border border-gray-150 p-3 rounded-xl flex flex-col">
                        <span className="text-[9px] font-black text-orange-600">Nagad Personal (নগদ)</span>
                        <span className="text-xs font-extrabold font-mono text-gray-800 mt-1 select-all">01939052257</span>
                        <span className="text-[8.5px] text-gray-400 mt-0.5">ক্যাশ আউট ফি প্রযোজ্য</span>
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-3 text-xs text-gray-700">
                    <div className="space-y-1 text-left">
                      <label className="font-bold text-gray-800">{language === 'bn' ? 'আপনার সম্পূর্ণ নাম (Name):' : 'Full Name:'}</label>
                      <input
                        type="text"
                        required
                        placeholder={language === 'bn' ? 'উদা: মো: মারুফ হোসেন' : 'e.g. Maruf Hossain'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 text-left">
                        <label className="font-bold text-gray-800">{language === 'bn' ? 'বিকাশ/নগদ একাউন্ট মোবাইল নাম্বার:' : 'Mobile Number:'}</label>
                        <input
                          type="text"
                          required
                          placeholder="017XXXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-emerald-500 font-bold"
                        />
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="font-bold text-gray-800">{language === 'bn' ? 'পেমেন্ট মাধ্যম (Method):' : 'Payment Method:'}</label>
                        <div className="flex gap-2 h-[38px]">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('bKash')}
                            className={`flex-1 rounded-xl border font-extrabold text-xs transition duration-250 cursor-pointer ${
                              paymentMethod === 'bKash' ? 'bg-pink-650 text-white border-pink-600 shadow-sm' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            bKash
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('Nagad')}
                            className={`flex-1 rounded-xl border font-extrabold text-xs transition duration-250 cursor-pointer ${
                              paymentMethod === 'Nagad' ? 'bg-orange-600 text-white border-orange-550 shadow-sm' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            Nagad
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="font-bold text-gray-800">{language === 'bn' ? 'পেমেন্ট ট্রানজেকশন আইডি (bKash/Nagad TxID):' : 'Transaction ID (TxID):'}</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AMK15N90Q8"
                        value={txId}
                        onChange={(e) => setTxId(e.target.value)}
                        className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-emerald-500 font-black uppercase"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="font-bold text-gray-800">{language === 'bn' ? 'বাড়ি ও ফসল ডেলিভারির সম্পূর্ণ ঠিকানা (Address):' : 'Delivery Address:'}</label>
                      <textarea
                        required
                        rows={2}
                        placeholder={language === 'bn' ? 'উদা: বাসা নং #৭, রোড নং #২, ব্লক সি, বনানী, ঢাকা।' : 'e.g. House 12, Road 4, Banani, Dhaka.'}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan(null)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-550 text-xs font-black text-center cursor-pointer"
                    >
                      {language === 'bn' ? '← পেছনে ফিরুন' : 'Back'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-750 text-white font-black text-xs rounded-xl text-center shadow cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? '🔄 দয়া করে অপেক্ষা করুন...' : (language === 'bn' ? 'দাখিল করুন ✔' : 'Confirm & Submit')}
                    </button>
                  </div>
                </form>
              ) : (
                // SUCCESS INVOICE BLOCK REDIRECTS TO WHATSAPP
                <div className="space-y-5 bg-emerald-50/40 p-5 rounded-2xl text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-pulse">
                    ✔️
                  </div>
                  <div>
                    <h4 className="text-base font-black text-emerald-950">{language === 'bn' ? 'দাখিল সফল হয়েছে!' : 'Submission Successful!'}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-normal font-sans">
                      {language === 'bn' 
                        ? 'আপনার অফলাইন পেমেন্ট এবং সাবস্ক্রিপশন অ্যাপ্লিকেশন এডমিন প্যানেলে জমা দেওয়া হয়েছে।' 
                        : 'Your subscription application is pending review on our system dashboard.'}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4.5 space-y-3 font-mono text-xs text-left max-w-sm mx-auto shadow-2xs">
                    <div className="flex justify-between text-gray-400">
                      <span>অ্যাপ্লিকেশন কোড:</span>
                      <span className="font-extrabold text-indigo-700">{successInvoice.code}</span>
                    </div>
                    <div className="flex justify-between text-gray-450 border-t border-gray-50 pt-2">
                      <span>প্ল্যান:</span>
                      <span className="font-bold text-gray-800 truncate max-w-[150px]">{successInvoice.planTitle}</span>
                    </div>
                    <div className="flex justify-between text-gray-450">
                      <span>বিকাশ/নগদ TxID:</span>
                      <span className="font-black text-gray-950">{successInvoice.txId}</span>
                    </div>
                    <div className="flex justify-between text-gray-450">
                      <span>ফোন নাম্বার:</span>
                      <span className="font-bold text-gray-700">{successInvoice.phone}</span>
                    </div>
                  </div>

                  {/* WhatsApp Activation Instructions */}
                  <div className="border border-green-200 bg-green-50/50 p-4 rounded-xl text-xs text-green-900 leading-normal text-left font-sans space-y-2">
                    <strong className="block text-green-950 text-center">🔥 এক্টিভেশন দ্রুত করুন (WhatsApp):</strong>
                    <p className="font-medium">
                      {language === 'bn' 
                        ? 'পেমেন্ট এডমিন প্যানেলে জমা আছে। অনুমোদন দ্রুত করার জন্য নিচে ক্লিক করে আমাদের হোয়াটসঅ্যাপ হটলাইন নাম্বারে পেমেন্ট রশিদ পাঠান।'
                        : 'To activate instantly, kindly click below to send your details and transaction code to our WhatsApp hotline.'}
                    </p>
                    <a
                      href={successInvoice.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 bg-[#25D366] hover:brightness-105 text-white font-black rounded-lg text-center shadow-sm flex items-center justify-center gap-2 cursor-pointer text-xs mt-3.5 transition-all"
                    >
                      <MessageSquare className="h-4.5 w-4.5" />
                      <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ-এ বুকিং সম্পন্ন করুন' : 'Verify on WhatsApp'}</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setSelectedPlan(null); setSuccessInvoice(null); onBack(); }}
                    className="w-full py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-650 font-black rounded-xl cursor-pointer text-xs uppercase"
                  >
                    {language === 'bn' ? 'ঠিক আছে (OK)' : 'Done'}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
