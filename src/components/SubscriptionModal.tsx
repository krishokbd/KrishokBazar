/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { logAnalyticsEvent } from '../lib/analytics';
import { X, CheckCircle, Shield, Gift, Zap, Video, MapPin, Truck, Sparkles, CreditCard } from 'lucide-react';

export const CUSTOMER_PLANS = [
  {
    id: 'bronze',
    name: 'ব্রোঞ্জ প্ল্যান (Bronze)',
    nameEn: 'Bronze Plan',
    badge: 'লাইট ভ্যালু',
    badgeEn: 'Light Value',
    price: 499,
    desc: 'মৌসুমী তাজা সবজি ও ধনেপাতা/শাক আইটেমগুলো সতেজ ডেলিভারি। সাধারণ খাদকের জন্য যুতসই।',
    descEn: 'Delivery of basic seasonal vegetables and herbs. Highly affordable.',
    perks: ['২-৩ ক্যাটাগরির তাজা সবুজ শাকসবজি', 'ভেষজ ও ধনেপাতা ফ্রী অ্যাসোর্টমেন্ট', '২৫% ডেলিভারি চার্জ ডিসকাউন্ট'],
    perksEn: ['2-3 Veggies Pre-Chopped', 'Clean Hygienic Pack', '25% Shipping Subsidy']
  },
  {
    id: 'silver',
    name: 'সিলভার প্ল্যান (Silver)',
    nameEn: 'Silver Plan',
    badge: 'সবজি স্পেশাল',
    badgeEn: 'Veg Special',
    price: 500,
    desc: 'রান্না উপযোগী কাটা-ধোয়া রেডি-টু-কুক সবজি ও পাতার আইটেমগুলো সতেজ ডেলিভারি। ব্যস্ত গৃহিণীদের প্রিয়।',
    descEn: 'Pre-washed, chopped ready-to-cook fresh vegetables and greens.',
    perks: ['৩-৪ ক্যাটাগরির রেডি-টু-কুক সবজি', 'প্রাক-ধৌত ও হাইজেনিক প্যাকিং', '৫০% ডেলিভারি চার্জ ছাড়'],
    perksEn: ['3-4 Veggies Pre-Chopped', 'Premium Pack', '50% Off Delivery Fee']
  },
  {
    id: 'gold',
    name: 'গোল্ড প্ল্যান (Gold)',
    nameEn: 'Gold Plan',
    badge: 'মসলা ও মিট ডিল',
    badgeEn: 'Meat & Spice Combo',
    price: 999,
    desc: 'কাটা সবজি, বিশেষ ম্যারিনেট করা মুরগী/গরুর মাংসের রেডি প্যাকেট এবং হাতভাঙা খাঁটি হলুদ ও মরিচ গুড়া।',
    descEn: 'Chopped vegetables, marinated meat cuts, and stone-ground pure spices.',
    perks: ['সিলভার প্ল্যানের সকল সুবিধা অন্তর্ভুক্ত', 'ম্যারিনেট করা মাংসের রেডি প্যাকেট', 'হাতভাঙা সতেজ হলুদ/মরিচ গুড়া', 'ফ্ল্যাট ৮০% ডেলিভারি ডিসকাউন্ট'],
    perksEn: ['Includes Silver Bundle', 'Marinated Meat packets', 'Stoneground spices', 'Flat 80% Shipping Discount']
  },
  {
    id: 'platinum',
    name: 'প্লাটিনাম সুপার (Platinum)',
    nameEn: 'Platinum Super',
    badge: 'ভিআইপি আনলিমিটেড',
    badgeEn: 'VIP Unlimited',
    price: 1399,
    desc: 'ডেলিভারি চার্জ সম্পূর্ণ ফ্রী। কাস্টম কাটা সবজি ও মাংস এবং সরাসরি খামার অথবা বাজার থেকে লাইভ ভিডিও কলে বাছার কভারেজ।',
    descEn: 'Zero shipping charges forever. Fully customizable vegetable cuts and live video assistance.',
    perks: ['গোল্ড প্ল্যানের সকল সুবিধা অন্তর্ভুক্ত', 'সম্পূর্ণ কাস্টম সাইজ কাটা মাংস ও সবজি', 'আনলিমিটেড ডেলিভারি চার্জ ফ্রি!', 'ভিআইপি খামারি ভিডিও নির্বাচন সাপোর্ট'],
    perksEn: ['Includes Gold Bundle', 'Custom cuts support', 'Zero delivery fee forever', 'Live Video pick option']
  }
];

export const FARMER_PLANS = [
  {
    id: 'farmer_silver',
    name: 'সিলভার খামারি স্পনসর (Silver)',
    nameEn: 'Silver Farmer Sponsor',
    badge: 'বেসিক ভেরিফাইড',
    badgeEn: 'Basic Verified',
    price: 1000,
    desc: 'নিজস্ব অনলাইন খামার পোর্টাল, লাইভ অর্ডার নোটিফিকেশন সুবিধা এবং ১টি ডেডিকেটেড ক্যাটাগরি বুস্টিং প্রোগ্রাম।',
    descEn: 'Online farmer store portal, real-time orders, and 1 category boost.',
    perks: ['৫টি বেশি প্রোডাক্ট লিস্টিং', 'ভেরিফাইড খামারি সিলভার ব্যাজ', 'বিকাশ-নগদ ৩ ঘণ্টায় পেমেন্ট উইথড্রয়াল', '৫০% সেলস বৃদ্ধির গ্যারান্টি'],
    perksEn: ['Up to 5 Products', 'Verified Silver Badge', '3-Hour Bkash Payouts', '50% Guaranteed Sales Boost']
  },
  {
    id: 'farmer_gold',
    name: 'গোল্ড খামারি স্পনসর (Gold)',
    nameEn: 'Gold Farmer Sponsor',
    badge: 'ট্রাস্টেড কানেক্ট',
    badgeEn: 'Trusted Connect',
    price: 2000,
    desc: 'সিলভারের সকল সুবিধা, ৩টি ক্যাটাগরি বুস্টিং, বিশেষ প্রোমোশনাল ব্যানার এবং হাহাকার বাদে আড়তদার বিহীন সরাসরি বায়ার লিড।',
    descEn: 'Includes Silver benefits plus 3 category boosts and direct retail leads.',
    perks: ['১৫টি পন্য লিস্টিং সাপোর্ট', 'ভেরিফাইড খামারি গোল্ডেন ব্যাজ', 'গ্রাহকদের খামারে লাইভ স্ট্রিম ব্যবস্থা', '৮০% সেলস বৃদ্ধির গ্যারান্টি'],
    perksEn: ['Up to 15 Products', 'Verified Gold Badge', 'Live Stream to buyer', '80% Guaranteed Sales Boost']
  },
  {
    id: 'farmer_platinum',
    name: 'প্লাটিনাম খামারি স্পনসর (Platinum)',
    nameEn: 'Platinum Farmer Sponsor',
    badge: 'আল্টিমেট স্পনসর',
    badgeEn: 'Ultimate Sponsor',
    price: 3000,
    desc: 'যশোর-রাজশাহী-বগুড়া কুরিয়ার সংগ্রহ হব থেকে সরাসরি ঢাকার ক্রেতার কাছে আমাদের নিজস্ব ট্রাকে ফ্রী ফসল ডেলিভারি ও সর্বোচ্চ কভারেজ।',
    descEn: 'Free truck collection from regional hubs to Dhaka buyers and ultimate home-page feature placement.',
    perks: ['আনলিমিটেড প্রোডাক্ট লিস্টিং সুবিধা', 'ভেরিফাইড খামারি ডায়মন্ড ব্যাজ', 'হোমপেজে ফিক্সড ব্যানার বুস্ট', '১২০% সেলস গ্রোথ নিশ্চিত গ্যারান্টি'],
    perksEn: ['Unlimited products', 'Verified Diamond badge', 'Homepage banner feature', '120% Sales growth guarantee']
  }
];

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'customer' | 'farmer';
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, defaultRole = 'customer' }) => {
  const { currentUser, language, submitMembershipRequest } = useApp();
  const [activeTab, setActiveTab ] = useState<'customer' | 'farmer'>(defaultRole);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultRole);
    }
  }, [isOpen, defaultRole]);
  
  // Payment Offline Transaction States
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
  const [transactionId, setTransactionId] = useState('');
  const [subscriberName, setSubscriberName] = useState(currentUser?.name || '');
  const [subscriberAddress, setSubscriberAddress] = useState(currentUser?.address || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  if (!isOpen) return null;

  const handleSubscribeClick = (plan: { id: string; name: string; price: number }) => {
    setSelectedPlan(plan);
    setPhoneNumber(currentUser?.phone || '');
    setTransactionId('');
    setSubscriberName(currentUser?.name || '');
    setSubscriberAddress(currentUser?.address || '');
    setShowInvoice(false);
  };

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      alert(language === 'bn' ? 'সঠিক মোবাইল নম্বর প্রদান করুন।' : 'Please provide a valid account phone number.');
      return;
    }
    if (!transactionId) {
      alert(language === 'bn' ? 'অনুগ্রহ করে ট্রানজেকশন আইডি প্রদান করুন।' : 'Please provide the transaction ID.');
      return;
    }
    if (!subscriberName || !subscriberAddress) {
      alert(language === 'bn' ? 'দয়া করে নাম ও ঠিকানা প্রদান করুন।' : 'Please provide your name and delivery address.');
      return;
    }

    setIsProcessing(true);

    const tempCode = `KB-SUB-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedCode(tempCode);

    try {
      // Send real offline transaction to direct admin email panel
      const response = await fetch('/api/send-subscription-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriberName,
          subscriberPhone: phoneNumber,
          subscriberAddress,
          transactionId,
          paymentMethod,
          planName: selectedPlan?.name,
          planPrice: selectedPlan?.price,
          role: activeTab,
          uniqueCode: tempCode,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        console.warn("Backend email dispatch response failure. Logging offline transaction locally.");
      }
    } catch (err) {
      console.warn("Could not dispatch real-time subscription email to admin context:", err);
    }

    // Programmatically trigger WhatsApp mockup dispatch block
    const whatsappMsgText = `নতুন সাবস্ক্রিপশন অনুরোধ: কোড: ${tempCode}, নাম: ${subscriberName}, ফোন: ${phoneNumber}, প্ল্যান: ${selectedPlan?.name}, ট্রানজেকশন আইডি: ${transactionId} (${paymentMethod}), ঠিকানা: ${subscriberAddress}`;
    console.log("Simulating simultaneous WhatsApp alert context:",          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black tracking-widest uppercase bg-emerald-800 text-emerald-100 px-2.5 py-1 rounded-lg">
              PREMIUM ACCESS
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-2">
            {language === 'bn' ? 'কৃষক বাজার প্রিমিয়াম সাবস্ক্রিপশন প্লাটফর্ম' : 'Krishok Bazar Premium Platform'}
          </h3>
          <p className="mt-1.5 text-xs text-emerald-100/90 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'সিন্দিকেট মুক্ত সরাসরি বাণিজ্যে ক্রেতার সর্বোচ্চ সাশ্রয়ী প্রিমিয়াম সেবার সমাহার এবং প্রান্তিক খামারিদের সেলস দ্বিগুণ করার জন্য বিশেষ স্পনসর প্রোগ্রাম।'
              : 'Direct broker-free premium offers for consumer savings and dedicated local farmer support packages to expand sales output.'}
          </p>
        </div>

        {/* Dynamic Action Roles Trigger */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-1">
          <button
            type="button"
            onClick={() => { setActiveTab('customer'); setSelectedPlan(null); }}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-black rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'customer' 
                ? 'bg-white text-emerald-850 shadow-sm border-b border-emerald-100' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🛒 {language === 'bn' ? 'আমি ক্রেতা (Customer Benefits)' : 'I am Customer'}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('farmer'); setSelectedPlan(null); }}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-black rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'farmer' 
                ? 'bg-white text-emerald-850 shadow-sm border-b border-emerald-100' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🚜 {language === 'bn' ? 'আমি ভেরিফাইড কৃষক (Farmer Sponsor Plans)' : 'I am Verified Farmer'}
          </button>
        </div>

        {/* Multi-view Grid Section */}
        <div className="p-6">
          
          {!selectedPlan ? (
            activeTab === 'customer' ? (
              // CUSTOMER PLANS GRID
              <div className="space-y-6">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900 leading-relaxed font-sans">
                    <strong className="text-emerald-950 block text-sm mb-1">
                      🎁 {language === 'bn' ? 'কেন আপনি গ্রাহক সাবস্ক্রিপশন নিবেন?' : 'Why buy Customer Subscription?'}
                    </strong>
                    {language === 'bn' 
                      ? 'আমাদের সাবস্ক্রাইবড প্রিমিয়াম মেম্বারগণ কোনো ঝামেলা ছাড়াই সম্পূর্ণ ফ্রিতে বা স্বল্প ডেলিভারি ব্যয়ে রান্নাঘরের প্রস্তুতকৃত রেডি-টু-কুক সতেজ সবজি, ম্যারিনেট করা ও কাটা মাংস, এবং বাড়িতে হাতধোয়া খাঁটি মসলা পেয়ে থাকেন। নিচে দেওয়া ৪টি সহজ বাজেটের প্ল্যানসমূহ ও তাদের সুযোগ-সুবিধা দেখে নিন।'
                      : 'Premium subscribers unlock free next-day shipping, ready-to-cook fresh cut vegetables, pre-marinated organic local meats, and verified field access. View our 4 budget-friendly plans.'}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
                  {CUSTOMER_PLANS.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`rounded-2xl border p-4.5 bg-white space-y-3 hover:shadow-md transition-all relative flex flex-col justify-between ${
                        plan.id === 'gold' ? 'border-2 border-emerald-500 ring-2 ring-emerald-50' : 'border-gray-150'
                      }`}
                    >
                      {plan.id === 'gold' && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider shadow">
                          {language === 'bn' ? '★ সেরা অফার' : '★ BEST VALUE'}
                        </div>
                      )}
                      
                      <div className="space-y-2 mt-1">
                        <div className="flex justify-between items-start gap-1">
                          <span className={`px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider rounded-xl border ${
                            plan.id === 'bronze' ? 'bg-orange-55/70 text-orange-700 border-orange-100' :
                            plan.id === 'silver' ? 'bg-blue-55/70 text-blue-700 border-blue-100' :
                            plan.id === 'gold' ? 'bg-emerald-55/70 text-emerald-800 border-emerald-100' :
                            'bg-purple-55/70 text-purple-700 border-purple-100'
                          }`}>
                            {language === 'bn' ? plan.badge : plan.badgeEn}
                          </span>
                          <span className="text-xs font-black text-emerald-700 shrink-0">৳{plan.price} / মাস</span>
                        </div>
                        
                        <h4 className="text-sm font-black text-gray-800 font-sans">
                          {language === 'bn' ? plan.name : plan.nameEn}
                        </h4>
                        
                        <p className="text-[10px] text-gray-500 leading-normal">
                          {language === 'bn' ? plan.desc : plan.descEn}
                        </p>
                        
                        <ul className="text-[10.5px] text-gray-650 space-y-1.5 pt-2 border-t border-gray-100">
                          {(language === 'bn' ? plan.perks : plan.perksEn).map((perk, pIdx) => (
                            <li key={pIdx} className="flex items-center gap-1 font-sans font-medium">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> 
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleSubscribeClick({ id: plan.id, name: language === 'bn' ? plan.name : plan.nameEn, price: plan.price })}
                        className={`w-full mt-3 rounded-xl py-2 px-3 text-[11px] font-black transition-all cursor-pointer text-center ${
                          plan.id === 'gold' 
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-650 hover:text-white'
                        }`}
                      >
                        {language === 'bn' ? 'সাবস্ক্রাইব করুন' : 'Subscribe Now'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // FARMER PLANS GRID
              <div className="space-y-6">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950 leading-relaxed font-sans">
                    <strong className="text-emerald-900 block text-sm mb-1">🌾 {language === 'bn' ? 'কৃষক স্পনসর ও পার্টনার ভেরিফিকেশন স্কিম' : 'Farmer Sponsor & Verified Scheme'}</strong>
                    {language === 'bn'
                      ? 'আপনি কি একজন ভেরিফাইড কৃষক হিসেবে বাজারে পণ্য বিক্রি করে ডাবল লাভবান হতে চান? আমাদের প্রিমিয়াম খামারি পার্টনারশিপ গ্রহণের মাধ্যমে আপনার লাভ নিশ্চিত হবে ৫০% থেকে ৯০% পর্যন্ত! নিচ থেকে লাভজনক সুবিধা ও আবেদন ফর্মের বিবরণসমূহ জেনে নিন।'
                      : 'Do you want to sell products as a verified grower and double your sales? Try our Premium Farmer partnership to boost your yield profit by 50% to 90%! Learn the rewards and application steps below.'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
                  {FARMER_PLANS.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`rounded-2xl border p-5 bg-white space-y-3.5 hover:shadow-md transition-all relative flex flex-col justify-between ${
                        plan.id === 'farmer_gold' ? 'border-2 border-emerald-500 ring-2 ring-emerald-50' : 'border-gray-150'
                      }`}
                    >
                      {plan.id === 'farmer_gold' && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-3 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider shadow">
                          {language === 'bn' ? '★ সর্বাধিক ভিউ' : '★ MOST POPULAR'}
                        </div>
                      )}
                      
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-start gap-1">
                          <span className={`px-2.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider rounded-xl border ${
                            plan.id === 'farmer_silver' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            plan.id === 'farmer_gold' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            'bg-purple-50 text-purple-700 border-purple-100'
                          }`}>
                            {language === 'bn' ? plan.badge : plan.badgeEn}
                          </span>
                          <span className="text-xs font-black text-emerald-700 shrink-0">৳{plan.price} / মাস</span>
                        </div>
                        
                        <h4 className="text-sm font-black text-gray-800 font-sans">
                          {language === 'bn' ? plan.name : plan.nameEn}
                        </h4>
                        
                        <p className="text-[10.5px] text-gray-500 leading-normal font-sans">
                          {language === 'bn' ? plan.desc : plan.descEn}
                        </p>
                        
                        <ul className="text-xs text-gray-650 space-y-2 pt-2 border-t border-gray-100">
                          {(language === 'bn' ? plan.perks : plan.perksEn).map((perk, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-1.5 leading-normal">
                              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="font-medium">{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleSubscribeClick({ id: plan.id, name: language === 'bn' ? plan.name : plan.nameEn, price: plan.price })}
                        className={`w-full mt-3 rounded-xl py-2 px-3 text-xs font-black transition-all cursor-pointer text-center ${
                          plan.id === 'farmer_gold'
                            ? 'bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-650 hover:text-white'
                        }`}
                      >
                        {language === 'bn' ? 'কৃষক স্পনসর এক্টিভেট করুন' : 'Activate Farmer Sponsor'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )�� গ্রহণের মাধ্যমে আপনার লাভ নিশ্চিত হবে ৫০% থেকে ৯০% পর্যন্ত! নিচ থেকে লাভজনক সুবিধা ও আবেদন ফর্মের বিবরণসমূহ জেনে নিন।'
                      : 'Do you want to sell products as a verified grower and double your sales? Try our Premium Farmer partnership to boost your yield profit by 50% to 90%! Learn the rewards and application steps below.'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white p-6 rounded-2xl space-y-4">
                    <h4 className="text-lg font-black flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-400" />
                      {language === 'bn' ? 'প্রিমিয়াম পার্টনার প্যাকেজ (Verified Partner)' : 'Premium Partner Package'}
                    </h4>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">
                      {language === 'bn'
                        ? 'কৃষক বাজারে ভেরিফাইড পার্টনার হবার সাথে সাথেই আপনি পাচ্ছেন নিজস্ব অনলাইন খামার পোর্টাল, লাইভ অর্ডার নোটিফিকেশন সুবিধা, এবং ফ্রিতে আপনার বাড়ির উঠান বা গ্রাম থেকে পণ্য সংগ্রহের জন্য কৃষক বাজারের ডেডিকেটেড ট্রাক ব্যবস্থা।'
                        : 'Become a Verified Farmer Partner to get your own digital store page, real-time audio/sms notifications, and free doorstep logistics pickup by Krishok Bazar dedicated trucks.'}
                    </p>
                    <div className="border-t border-emerald-800 pt-3 space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span>🏷️ {language === 'bn' ? 'সাবস্ক্রিপশন ফি (কৃষক ডিসকাউন্ট):' : 'Subscription Fee (Farmer Offer):'}</span>
                        <span className="text-yellow-400">৳২৫০ / মাস</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>🔥 {language === 'bn' ? 'সেলস বৃদ্ধির গ্যারান্টি:' : 'Guaranteed Sales Growth:'}</span>
                        <span className="text-yellow-400">৫০% থেকে ৯০% বেশি!</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-150 p-5 rounded-2xl bg-white space-y-3">
                    <h5 className="text-sm font-black text-gray-800">
                      {language === 'bn' ? 'কেন কৃষক সাবস্ক্রিপশন আবশ্যক?' : 'Why buy Farmer Premium?'}
                    </h5>
                    <ul className="text-xs text-gray-650 space-y-2.5">
                      <li className="flex items-start gap-1.5 leading-normal">
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>{language === 'bn' ? 'ভেরিফাইড সবুজ ক্রেস্ট:' : 'Verified Green Seal:'}</strong> {language === 'bn' ? 'আপনার প্রতিটি ফসলে "পাপুলার ভেরিফাইড" লোগো দেখাবে যা দেখে ক্রেতারা ৪ গুণ বেশি অর্ডার করবে।' : 'Gives a trusted Popular Verified seal to your items to triple orders.'}</span>
                      </li>
                      <li className="flex items-start gap-1.5 leading-normal">
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>{language === 'bn' ? 'ফ্রি সংগ্রহ হাব কভারেজ:' : 'Free Courier Pickup:'}</strong> {language === 'bn' ? 'যশোর, রাজশাহী, বগুড়া কুরিয়ার হাব থেকে আপনার ফসল আমাদের ট্রাক নিজ দায়িত্বে ঢাকায় নিয়ে যাবে।' : 'Free shipping from Jessore, Bogura, Rajshahi depots to Dhaka markets.'}</span>
                      </li>
                      <li className="flex items-start gap-1.5 leading-normal">
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>{language === 'bn' ? 'উইথড্রয়াল অগ্রাধিকার:' : 'Instant Withdrawals:'}</strong> {language === 'bn' ? 'বিকাশ-নগদে আবেদনের মাত্র ৩ ঘণ্টার মধ্যে আপনার খামারের আয়ের সম্পূর্ন ব্যালেন্স পেয়ে যাবেন।' : 'Withdraw farm sales directly to Bkash/Nagad within 3 hours.'}</span>
                      </li>
                    </ul>
                    <button
                      type="button"
                      onClick={() => handleSubscribeClick({ id: 'farmer_partner', name: 'কৃষক ভেরিফাইড পার্টনার', price: 250 })}
                      className="w-full mt-2 rounded-xl py-2.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white text-xs font-black transition-all cursor-pointer text-center"
                    >
                      {language === 'bn' ? 'কৃষক স্পনসর এক্টিভেট করুন' : 'Activate Farmer Sponsor'}
                    </button>
                  </div>
                </div>
              </div>
            )
          ) : (
            // SIMULATED BKASH/NAGAD CHECKOUT PORTAL WITH OFFLINE ADVANCE PAYMENT INFO
            <div className="max-w-md mx-auto bg-slate-50 border border-gray-200 rounded-3xl p-6 shadow-md font-sans">
              
              {!showInvoice ? (
                // PAYMENT FORM
                <form onSubmit={handleSimulatePayment} className="space-y-4">
                  <div className="text-center pb-3 border-b border-gray-250">
                    <h4 className="text-sm font-extrabold text-gray-700">
                      {language === 'bn' ? 'অфলাইন পেমেন্ট গেটওয়ে ভেরিফিকেশন' : 'Offline Payment Gateway'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-normal font-sans">
                      {language === 'bn' ? 'সাবস্ক্রিপশন:' : 'Subscription:'} <strong className="text-emerald-700">{selectedPlan.name}</strong><br />
                      {language === 'bn' ? 'নির্ধারিত ফি:' : 'Required Fee:'} <strong className="text-slate-900">৳{selectedPlan.price} BDT</strong>
                    </p>
                  </div>

                  {/* Payment warning banner */}
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 leading-relaxed font-semibold">
                    ⚠️ {language === 'bn' 
                      ? 'সাবস্ক্রিপশন চালু করতে অগ্রিম পেমেন্ট প্রদান করা বাধ্যতামূলক। নিচের নাম্বারে পার্সোনাল ক্যাশ আউট / সেন্ড মানি করুন। আপনাদের পেমেন্ট ভেরিফাই করে ১২ থেকে ২৪ ঘণ্টার মধ্যে মূল সাবস্ক্রিপশন সফলভাবে সক্রিয় করা হবে।' 
                      : 'Advance payment is strictly required to activate packages. Please cash-out/send-money to the official number below. Subscriptions will be activated within 12 to 24 hours upon admin verification.'}
                  </div>

                  {/* Payment instructions */}
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 text-center">
                    <p className="font-bold">
                      {language === 'bn' ? '👉 নিচের যেকোনো একটি নম্বরে সেন্ড মানি বা ক্যাশ আউট করুন:' : '👉 Send Money or Cash-out to our official merchants:'}
                    </p>
                    <div className="mt-2.5 flex flex-col gap-1.5 items-center justify-center font-mono">
                      <p className="font-extrabold text-sm text-emerald-950">📱 bKash (বিকাশ পার্সোনাল): 01939052257</p>
                      <p className="font-extrabold text-sm text-emerald-950">📱 Nagad (নগদ পার্সোনাল): 01987012893</p>
                    </div>
                  </div>

                  {/* Payment Logo Switches */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                      {language === 'bn' ? '১. পেমেন্ট মাধ্যম নির্বাচন করুন:' : '1. Choose Payment Method:'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bKash')}
                        className={`rounded-xl py-2 px-4 border transition-all cursor-pointer flex items-center justify-center gap-1.5 font-bold text-xs ${
                          paymentMethod === 'bKash' 
                            ? 'bg-pink-100 border-pink-500 text-pink-700 ring-2 ring-pink-300' 
                            : 'bg-white border-gray-200 text-gray-650 hover:bg-gray-50'
                        }`}
                      >
                        bKash পেমেন্ট
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Nagad')}
                        className={`rounded-xl py-2 px-4 border transition-all cursor-pointer flex items-center justify-center gap-1.5 font-bold text-xs ${
                          paymentMethod === 'Nagad' 
                            ? 'bg-orange-100 border-orange-500 text-orange-750' 
                            : 'bg-white border-gray-200 text-gray-650 hover:bg-gray-50'
                        }`}
                      >
                        Nagad পেমেন্ট
                      </button>
                    </div>
                  </div>

                  {/* Direct Input Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-650 mb-1">
                        {language === 'bn' ? '২. আপনার পূর্ণ নাম (Full Name):' : '2. Your Full Name:'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={language === 'bn' ? 'যেমন: মুইক্তা বেগম' : 'e.g. Muikta Begum'}
                        value={subscriberName}
                        onChange={(e) => setSubscriberName(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-650 mb-1">
                        {language === 'bn' ? '৩. আপনার পূর্ণ ঠিকানা (Delivery Address):' : '3. Your Living Address:'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={language === 'bn' ? 'যেমন: বাড়ি-৪৫, লালবাগ, ঢাকা' : 'e.g. House-45, Lalbagh, Dhaka'}
                        value={subscriberAddress}
                        onChange={(e) => setSubscriberAddress(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-650 mb-1">
                          {language === 'bn' ? '৪. টাকা পাঠানোর মোবাইল নম্বর:' : '4. Sent-From Bkash/Nagad Number:'}
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 01931355398"
                          maxLength={11}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-650 mb-1">
                          {language === 'bn' ? '৫. ট্রানজেকশন আইডি (TxID):' : '5. Transaction ID (SMS Reciept):'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. BKX90142"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white bg-white font-mono uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPlan(null)}
                      className="flex-1 rounded-xl border border-gray-250 py-2.5 text-xs font-bold hover:bg-gray-150 cursor-pointer text-center text-gray-650 font-sans"
                    >
                      {language === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-655 text-white py-2.5 text-xs font-black shadow transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      {isProcessing ? (language === 'bn' ? 'পেমেন্ট প্রসেস হচ্ছে...' : 'Processing Payment...') : `${language === 'bn' ? 'সাবমিট করুন' : 'Submit Details'}`}
                    </button>
                  </div>
                </form>
              ) : (
                // SUCCESS CERTIFICATE INVOICE Showing 12-24 Hours Alert
                <div className="text-center space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                    <span className="text-2xl animate-spin">⏱</span>
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-800">
                      {language === 'bn' ? 'সাবস্ক্রিপশন পেন্ডিং ভেরিফিকেশন' : 'Subscription Activation Pending'}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-normal font-sans">
                      {language === 'bn' 
                        ? 'আপনার আবেদনপত্রটি সফলভাবে অ্যাডমিন প্যানেলে প্রেরণ করা হয়েছে। পরবর্তী ১২ থেকে ২৪ ঘণ্টার মধ্যে তথ্য পরীক্ষা করে সুবিধাটি সক্রিয় করা হবে।' 
                        : 'Your subscription application was dispatched successfully! It is currently awaiting verification. Please allow 12-24 hours for complete system activation.'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-150 bg-white p-3.5 text-[11px] text-slate-650 leading-relaxed font-mono text-left divide-y divide-gray-100">
                    <div className="py-1 flex justify-between"><span>{language === 'bn' ? 'গ্রাহক কোড:' : 'Your Unique Code:'}</span> <strong className="text-emerald-700">KB-SUB-{Math.floor(1000 + Math.random() * 9000).toString()}</strong></div>
                    <div className="py-1 flex justify-between"><span>{language === 'bn' ? 'ট্যাক্স আইডি:' : 'TxID ID:'}</span> <strong className="text-yellow-600 font-mono uppercase">{transactionId}</strong></div>
                    <div className="py-1 flex justify-between"><span>{language === 'bn' ? 'পেমেন্ট মাধ্যম:' : 'Method:'}</span> <strong>{paymentMethod} Offline</strong></div>
                    <div className="py-1 flex justify-between"><span>{language === 'bn' ? 'মোবাইল অ্যাকাউন্ট:' : 'Account phone:'}</span> <strong>{phoneNumber}</strong></div>
                    <div className="py-1 flex justify-between"><span>{language === 'bn' ? 'স্ট্যাটাস:' : 'Verification Status:'}</span> <strong className="text-yellow-600">PENDING (12-24 HOURS)</strong></div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCompleteFullFlow}
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 text-xs transition-all cursor-pointer font-sans"
                  >
                    {language === 'bn' ? 'ঠিক আছে' : 'Proceed'}
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
