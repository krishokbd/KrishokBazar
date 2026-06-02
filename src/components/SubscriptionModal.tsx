/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { logAnalyticsEvent } from '../lib/analytics';
import { X, CheckCircle, Shield, Gift, Zap, Video, MapPin, Truck, Sparkles, CreditCard } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'customer' | 'farmer';
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, defaultRole = 'customer' }) => {
  const { currentUser, language } = useApp();
  const [activeTab, setActiveTab] = useState<'customer' | 'farmer'>(defaultRole);
  
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
    console.log("Simulating simultaneous WhatsApp alert context:", whatsappMsgText);
    const whatsappLink = `https://wa.me/8801931355398?text=${encodeURIComponent(whatsappMsgText)}`;
    console.log("Generated Admin WhatsApp notification hyperlink:", whatsappLink);

    setTimeout(() => {
      setIsProcessing(false);
      setShowInvoice(true);
      
      // Upgrade local user programmatically but mark subscription as Pending for validation (will activate in 12-24 hrs)
      if (currentUser) {
        currentUser.subscriptionStatus = 'Pending' as any;
        currentUser.uniqueCode = tempCode;
        localStorage.setItem('kb_current_user', JSON.stringify(currentUser));
        
        // Sync back to registered collections
        const saved = localStorage.getItem('kb_registered_customers');
        if (saved) {
          const list = JSON.parse(saved);
          const updatedList = list.map((c: any) => c.id === currentUser.id ? { 
            ...c, 
            subscriptionStatus: 'Pending', 
            subscriptionTxId: transactionId,
            uniqueCode: tempCode 
          } : c);
          localStorage.setItem('kb_registered_customers', JSON.stringify(updatedList));
        }

        // Add to active notifications store
        const existingNotifications = localStorage.getItem('kb_user_notifications') || '[]';
        const parsedNotifs = JSON.parse(existingNotifications);
        parsedNotifs.unshift({
          id: `notif-${Date.now()}`,
          title: language === 'bn' ? 'সাবস্ক্রিপশন আবেদন গৃহিত' : 'Subscription Request Received',
          message: language === 'bn' 
            ? `আপনার ${selectedPlan?.name} পেমেন্ট আবেদনের তথ্য রিভিউ করা হচ্ছে। ট্রানজেকশন আইডি ${transactionId} রিভিউ করতে ১২-২৪ ঘণ্টা সময় লাগবে।`
            : `Your registration for ${selectedPlan?.name} with TxID ${transactionId} is currently being verified. Processing takes 12-24 hours.`,
          date: new Date().toLocaleDateString('bn-BD'),
          unread: true
        });
        localStorage.setItem('kb_user_notifications', JSON.stringify(parsedNotifs));
      }

      logAnalyticsEvent('user_subscription_upgrade', {
        plan_id: selectedPlan?.id,
        plan_name: selectedPlan?.name,
        price: selectedPlan?.price,
        phone: phoneNumber,
        transactionId: transactionId,
        uniqueCode: tempCode
      });
    }, 1200);
  };

  const handleCompleteFullFlow = () => {
    setShowInvoice(false);
    setSelectedPlan(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-y-auto max-h-[92vh] rounded-3xl bg-white shadow-2xl transition-all border border-emerald-50 text-left select-none font-sans">
        
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-500 px-6 py-6 sm:py-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-black/10 p-2 text-white/90 hover:bg-black/25 cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black tracking-widest uppercase bg-emerald-800 text-emerald-100 px-2.5 py-1 rounded-lg">
              PREMIUM ACCESS
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-2">
            {language === 'bn' ? 'কৃষক বাজার প্রিমিয়াম সাবস্ক্রিপশন প্লাটফর্ম' : 'Krishok Bazar Premium Platform'}
          </h3>
          <p className="mt-1.5 text-xs text-emerald-100/90 max-w-2xl leading-relaxed">
            {language === 'bn'
              ? 'সিন্ডিকেট মুক্ত সরাসরি বাণিজ্যে ক্রেতার সর্বোচ্চ সাশ্রয়ী প্রিমিয়াম সেবার সমাহার এবং প্রান্তিক খামারিদের সেলস দ্বিগুণ করার জন্য বিশেষ স্পনসর প্রোগ্রাম।'
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
                      ? 'আমাদের সাবস্ক্রাইবড প্রিমিয়াম মেম্বারগণ কোনো ঝামেলা ছাড়াই সম্পূর্ণ ফ্রিতে বা স্বল্প ডেলিভারি ব্যয়ে রান্নাঘরের প্রস্তুতকৃত রেডি-টু-কুক সতেজ সবজি, ম্যারিনেট করা ও কাটা মাংস, এবং বাড়িতে হাতধোয়া খাঁটি মসলা পেয়ে থাকেন। নিচে দেওয়া ৩টি সহজ বাজেটের প্ল্যানসমূহ ও তাদের সুযোগ-সুবিধা দেখে নিন।'
                      : 'Premium subscribers unlock free next-day shipping, ready-to-cook fresh cut vegetables, pre-marinated organic local meats, and verified field access. View our 3 budget-friendly plans.'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
                  {/* PLAN 1: SILVER (500) */}
                  <div className="rounded-2xl border border-gray-150 p-5 bg-white space-y-4 hover:border-emerald-500 transition-all shadow-sm relative flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-gray-100 rounded-xl text-gray-650 border border-gray-200">
                          {language === 'bn' ? 'সবজি স্পেশাল' : 'Veg Special'}
                        </span>
                        <span className="text-sm font-black text-emerald-700">৳৫০০ / মাস</span>
                      </div>
                      <h4 className="text-base font-black text-gray-800">
                        {language === 'bn' ? 'সিলভার প্ল্যান (Silver)' : 'Silver Plan'}
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {language === 'bn' 
                          ? 'শুধুমাত্র রান্না উপযোগী কাটা-ধোয়া রেডি-টু-কুক সবজি ও পাতার আইটেমগুলো সতেজ ডেলিভারি। কর্মব্যস্ত গৃহিণীদের জন্য যুতসই।'
                          : 'Pre-washed, chopped, ready-to-cook fresh vegetables and greens delivered cold. Best for busy households.'}
                      </p>
                      <ul className="text-[11px] text-gray-600 space-y-2 pt-2 border-t border-gray-100">
                        <li className="flex items-center gap-1.5 font-sans font-medium"><CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> {language === 'bn' ? '৩-৪ ক্যাটাগরির রেডি-টু-কুক সবজি' : '3-4 Veggies Pre-Chopped'}</li>
                        <li className="flex items-center gap-1.5 font-sans font-medium"><CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> {language === 'bn' ? 'প্রাক-ধৌত ও হাইজেনিক প্যাকিং' : 'Hygienic Packing Ready'}</li>
                        <li className="flex items-center gap-1.5 font-sans font-medium"><CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> {language === 'bn' ? '৫০% ডেলিভারি চার্জ ছাড়' : '50% Off Delivery Fee'}</li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSubscribeClick({ id: 'silver', name: 'সিলভার প্ল্যান (Silver)', price: 500 })}
                      className="w-full mt-4 rounded-xl py-2 px-4 bg-emerald-50 hover:bg-emerald-650 hover:text-white text-emerald-800 text-xs font-black transition-all cursor-pointer text-center"
                    >
                      {language === 'bn' ? 'সাবস্ক্রাইব করুন' : 'Subscribe Silver'}
                    </button>
                  </div>

                  {/* PLAN 2: GOLD (700) */}
                  <div className="rounded-2xl border-2 border-emerald-500 p-5 bg-white space-y-4 hover:shadow-md transition-all relative flex flex-col justify-between">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow">
                      {language === 'bn' ? '★ সেরা ভ্যালু (Gold Value)' : '★ Best Value'}
                    </div>
                    <div className="space-y-3 mt-1.5">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-orange-50 rounded-xl text-orange-700 border border-orange-100">
                          {language === 'bn' ? 'মসলা ও সবজি মিট' : 'Meat & Spice Combo'}
                        </span>
                        <span className="text-sm font-black text-emerald-700">৳৭০০ / মাস</span>
                      </div>
                      <h4 className="text-base font-black text-gray-800 font-sans">
                        {language === 'bn' ? 'গোল্ড প্ল্যান (Gold)' : 'Gold Plan'}
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {language === 'bn' 
                          ? 'প্রাক-কাটা সতেজ সবজি, বিশেষ ম্যারিনেট করা মুরগী/গরুর মাংসের মশলা এবং ১০০% বিশুদ্ধ হাতভাঙা হলুদ ও মরিচ গুড়া।'
                          : 'Includes pre-chopped vegetables, marinated local meat cuts, and stone-ground pure spices.'}
                      </p>
                      <ul className="text-[11px] text-gray-650 space-y-2 pt-2 border-t border-gray-100">
                        <li className="flex items-center gap-1.5 font-sans font-semibold"><CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> {language === 'bn' ? 'সিলভার প্ল্যানের সকল সুবিধা' : 'All Silver Perks'}</li>
                        <li className="flex items-center gap-1.5 font-sans font-semibold"><CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> {language === 'bn' ? 'ম্যারিনেট করা মাংসের রেডি প্যাকেট' : 'Marinated Fresh Meats'}</li>
                        <li className="flex items-center gap-1.5 font-sans font-semibold"><CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> {language === 'bn' ? 'হাতভাঙা সতেজ হলুদ/মরিচ গুড়া' : 'Stone-ground Pure Spices'}</li>
                        <li className="flex items-center gap-1.5 font-sans font-semibold"><CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> {language === 'bn' ? 'ফ্লাট ৭০% ডেলিভারি ডিসকাউন্ট' : 'Flat 70% Shipping Subsidy'}</li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSubscribeClick({ id: 'gold', name: 'গোল্ড প্ল্যান (Gold)', price: 700 })}
                      className="w-full mt-4 rounded-xl py-2 px-4 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-black transition-all cursor-pointer text-center"
                    >
                      {language === 'bn' ? 'সাবস্ক্রাইব করুন' : 'Subscribe Gold'}
                    </button>
                  </div>

                  {/* PLAN 3: PLATINUM (1000) */}
                  <div className="rounded-2xl border border-gray-150 p-5 bg-white space-y-4 hover:border-emerald-500 transition-all shadow-sm relative flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-purple-50 rounded-xl text-purple-700 border border-purple-100">
                          {language === 'bn' ? 'ভিআইপি আনলিমিটেড' : 'VIP Unlimited'}
                        </span>
                        <span className="text-sm font-black text-emerald-700">৳১০০০ / মাস</span>
                      </div>
                      <h4 className="text-base font-black text-gray-800">
                        {language === 'bn' ? 'প্লাটিনাম সুপার (Platinum)' : 'Platinum Super'}
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {language === 'bn' 
                          ? 'কোন ডেলিভারি চার্জ নেই। কাস্টম সাইজে কাটা সবজি ও মাংস এবং সরাসরি খামার বা পাইকারি বাজারের সাথে লাইভ ভিডিও কল কেনাকাটা।'
                          : 'Zero shipping charges forever. Fully customizable vegetable cuts, meats, and live video picker from primary growers.'}
                      </p>
                      <ul className="text-[11px] text-gray-600 space-y-2 pt-2 border-t border-gray-100">
                        <li className="flex items-center gap-1.5 font-sans font-medium"><CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> {language === 'bn' ? 'গোল্ড প্ল্যানের সকল সুবিধা অন্তর্ভুক্ত' : 'Includes Gold Bundle'}</li>
                        <li className="flex items-center gap-1.5 font-sans font-medium"><CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> {language === 'bn' ? 'সম্পুর্ণ কাস্টম কাটা সবজি ও মাংস' : 'Fully Custom Chop Cuts'}</li>
                        <li className="flex items-center gap-1.5 font-sans font-medium"><CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> {language === 'bn' ? 'আনলিমিটেড ডেলিভারি চার্জ ফ্রি!' : 'Free Zero-delivery charges'}</li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSubscribeClick({ id: 'platinum', name: 'প্লাটিনাম সুপার (Platinum)', price: 1000 })}
                      className="w-full mt-4 rounded-xl py-2 px-4 bg-slate-900 text-white hover:bg-black text-xs font-black transition-all cursor-pointer text-center"
                    >
                      {language === 'bn' ? 'সাবস্ক্রাইব করুন' : 'Subscribe Platinum'}
                    </button>
                  </div>
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
                    <p className="font-extrabold text-sm mt-1 text-emerald-950 font-mono">
                      bKash / Nagad: 01931355398
                    </p>
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
