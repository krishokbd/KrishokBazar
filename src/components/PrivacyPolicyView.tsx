import React from 'react';
import { ShieldCheck, Eye, Lock, FileText, ArrowLeft, RefreshCw, Smartphone, Mail, MapPin } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Board */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-150-soft shadow-xs">
          <div>
            <span className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 px-3.5 py-1.5 rounded-full font-black uppercase tracking-wider">
              Legal Documents • আইনি নীতিমালার শতভাগ স্বচ্ছতা
            </span>
            <h1 className="text-xl sm:text-2.5xl font-black text-gray-950 mt-2.5 leading-tight">
              গোপনীয়তা নীতি (Privacy Policy)
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
              কৃষক বাজার প্ল্যাটফর্মে আপনার ব্যক্তিগত তথ্য সম্পূর্ণ নিরাপদ ও সুরক্ষিত রাখা আমাদের সর্বোচ্চ অগ্রাধিকার।
            </p>
          </div>
          <button 
            onClick={onBack} 
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-black text-slate-700 flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer transition shadow-2xs hover:scale-102"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            ফিরে যান (Back)
          </button>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl border border-gray-150-soft p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 leading-relaxed text-xs sm:text-sm">
          
          {/* Top Intro Alert */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-5 flex gap-4">
            <div className="bg-amber-100 text-amber-800 p-2 rounded-2xl shrink-0 h-10 w-10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-stone-900 text-xs sm:text-sm">সর্বশেষ আপডেট: ১৬ জুন, ২০২৬</h4>
              <p className="text-[11.5px] text-stone-600 mt-1 leading-snug">
                কৃষক বাজার একটি প্রফেশনাল সামাজিক এগ্রো-উদ্যোগ। এই অ্যাপলিকেশনে আপনার দেয়া প্রতিটি তথ্য বাংলাদেশ ডিজিটাল নিরাপত্তা আইন ও আন্তর্জাতিক ডেটা প্রাইভেসি স্ট্যান্ডার্ড (GDPR) মেনে পরিচালিত হয়।
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg shrink-0">
                <FileText className="h-4 w-4" />
              </span>
              <h2 className="font-black text-stone-900 text-sm sm:text-base">১. আমরা কি কি তথ্য সংগ্রহ করি?</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-[12.5px] sm:text-[13.5px]">
              কৃষক বাজার অ্যাপ ব্যবহারে আপনার জন্য সর্বোত্তম সেবা ও দ্রুততম উপায়ে তাজা শাকসবজি ডেলিভারি পৌছে দেওয়ার সুবিধার্থে আমরা নিম্নলিখিত প্রয়োজনীয় তথ্যাদি সংগ্রহ করে থাকি:
            </p>
            <ul className="list-disc pl-5 space-y-2.5 text-slate-600 text-[12px] sm:text-[13px]">
              <li><strong className="text-stone-900">ব্যক্তিগত পরিচিতিমূলক তথ্য:</strong> আপনার নাম, মোবাইল নম্বর, ইমেইল ঠিকানা এবং বিস্তারিত অর্ডারিং ডেলিভারি ঠিকানা।</li>
              <li><strong className="text-stone-900">অবস্থান সম্পর্কিত তথ্য (Geolocation):</strong> আপনার বাসা বা ডেলিভারি লোকেশন সরাসরি ম্যাপের মাধ্যমে সহজে খুঁজে পেতে আইফ্রেমের মাধ্যমে লোকেশন পারমিশন চাওয়া হতে পারে।</li>
              <li><strong className="text-stone-900">ডিভাইস ও ব্রাউজার ডেটা:</strong> আইপি অ্যাড্রেস, ব্রাউজারের ধরন এবং কুকিজ (Cookies) যা আপনার শপিং বাস্কেট দীর্ঘক্ষণ সচল রাখতে অবদান রাখে।</li>
              <li><strong className="text-stone-900">কৃষকদের তথ্য:</strong> কোনো কৃষক আমাদের প্ল্যাটফর্মে যুক্ত হতে চাইলে তার জাতীয় পরিচয়পত্র (NID) নম্বর ও মোবাইল ব্যাংকিং (বিকাশ, রকেট, নগদ) অ্যাকাউন্ট নম্বর যা তার কঠোর মেহনতের সঠিক লভ্যাংশ নিশ্চিত করার উদ্দেশ্যে ব্যবহৃত হয়।</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg shrink-0">
                <Eye className="h-4 w-4" />
              </span>
              <h2 className="font-black text-stone-900 text-sm sm:text-base">২. তথ্য ব্যবহারের উদ্দেশ্য সমূহ</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-[12.5px] sm:text-[13.5px]">
              সংগৃহীত সকল তথ্য শুধুমাত্র চমৎকার এবং জিরো-হ্যাসেল সেবাদানের লক্ষ্যেই সাজানো। প্রধানত নিচের কাজগুলোতে আপনার তথ্য ব্যবহৃত হয়:
            </p>
            <ul className="list-disc pl-5 space-y-2.5 text-slate-600 text-[12px] sm:text-[13px]">
              <li>ডেলিভারি চালক ও প্রতিনিধি দল যাতে অল্প সময়ে ও সরাসরি যোগাযোগ করে আপনার ঠিকানায় ফ্রেশ ফুড ব্যাগ পৌঁছে দিতে পারে।</li>
              <li>বুটস্ট্র্যাপ মেম্বারশিপ, ডিসকাউন্ট অফার, উইকলি কম্বো বাস্কেটের কাস্টমাইজড নোটিফিকেশন প্রদান করা।</li>
              <li>আমাদের ইন্টিগ্রেটেড <span className="text-emerald-700 font-extrabold">রিকতাজ এআই (Riktaz AI)</span> চ্যাটের মাধ্যমে কাস্টমারদের নিখুঁত কেনাকাটার রেকমেন্ডেশন প্রদান ও প্রশ্নোত্তরের সঠিক সমাধান বের করা।</li>
              <li>যেকোনো ধরণের অনাকাঙ্ক্ষিত প্রতারণামূলক কর্মকাণ্ড প্রতিরোধ ও নিরাপদ অনলাইন পেমেন্ট ভেরিফিকেশন করা।</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg shrink-0">
                <Lock className="h-4 w-4" />
              </span>
              <h2 className="font-black text-stone-900 text-sm sm:text-base">৩. ডেটা নিরাপত্তা ও সেশন প্রটেকশন</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-[12.5px] sm:text-[13.5px]">
              আপনার প্রদান করা ডেটা যাতে কোনোভাবেই অপব্যবহার না হয় বা চুরি না হয় সেজন্য আমরা সর্বোচ্চ স্তরের নিরাপত্তা প্রোটোকল ব্যবহার করি।
            </p>
            <ul className="list-disc pl-5 space-y-2.5 text-slate-600 text-[12px] sm:text-[13px]">
              <li><strong className="text-stone-900">এসএসএল এনক্রিপশন (SSL Secure Server Side Proxy):</strong> আমাদের পেমেন্ট গেটওয়ে এবং এআই প্রক্সি সব সম্পূর্ণ সুরক্ষিত ও ইনক্রিপ্টেড। আপনার পাসওয়ার্ড ও ওয়ান-টাইম ডেটা সুরক্ষিত থাকে।</li>
              <li><strong className="text-stone-900">জিরো থার্ড-পার্টি শেয়ারিং:</strong> কোনো বাণিজ্যিক উদ্দেশ্যে কোনো বিজ্ঞাপন কোম্পানির কাছে আমরা আমাদের সম্মানিত কাস্টমার বা পরিশ্রমী কৃষকদের কোনো গোপন ডেটা বিক্রি কিংবা হস্তান্তর করি না।</li>
              <li><strong className="text-stone-900">নিরাপদ বিকাশ ও পেমেন্ট এপিআই:</strong> আপনার ব্যাংক অ্যাকাউন্ট, ভিসা কার্ড, মাস্টারকার্ড কিংবা বিকাশ/নগদ/রকেট পেমেন্ট সরাসরি গেটওয়ের মাধ্যমে পরিশোধিত হয় যা কৃষক বাজার কখনো সঞ্চয় করে রাখে না।</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg shrink-0">
                <RefreshCw className="h-4 w-4" />
              </span>
              <h2 className="font-black text-stone-900 text-sm sm:text-base">৪. নীতিমালা পরিবর্তন ও আপনার অধিকার</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-[12.5px] sm:text-[13.5px]">
              ভবিষ্যৎ প্রযুক্তি ও রেগুলেটরি পরিবর্তনের সাথে তাল মেলাতে আমরা যেকোনো সময় এই গোপনীয়তা নীতি কিছুটা পরিমার্জন বা সংশোধন করতে পারি। সংশোধিত সংস্করণটি সিস্টেমে আপলোড হওয়া মাত্রই তা কার্যকর ঘোষণা করা হবে।
            </p>
            <p className="text-slate-600 leading-relaxed text-[12.5px] sm:text-[13.5px]">
              একজন সম্মানিত ব্যবহাকারি হিসেবে আপনার ডেটা আমাদের সিস্টেম থেকে চিরতরে মুছে ফেলতে (Account Delete Resolution Request) অনুরোধ করার ও ডেটা দেখার পূর্ণ অধিকার আপনার রয়েছে।
            </p>
          </div>

          {/* Footer of card details */}
          <div className="border-t border-slate-100 pt-8 mt-4.5 flex flex-col md:flex-row items-center justify-between gap-5 bg-slate-50/50 p-6 rounded-3xl">
            <div className="space-y-2 font-sans text-center md:text-left">
              <h4 className="font-extrabold text-stone-900 text-sm">আইনি সহায়তা ও সাপোর্ট সেন্টার:</h4>
              <p className="text-[11.5px] text-slate-500">আপনার তথ্যের নিরাপত্তা নিয়ে যেকোনো জিজ্ঞাসা থাকলে সরাসরি কথা বলুন আমাদের লিগ্যাল উইং টিমের সাথে।</p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-[11px] font-bold w-full md:w-auto">
              <div className="bg-white p-3 rounded-2xl border border-slate-150-soft flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-[11.5px] text-stone-800 font-sans">+880 17 0000 0000</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-150-soft flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-[11.5px] text-stone-800 font-sans">legal@krishokbazar.org</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
