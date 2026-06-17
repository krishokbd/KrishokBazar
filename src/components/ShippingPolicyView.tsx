import React from 'react';
import { Truck, RotateCcw, AlertTriangle, ShieldCheck, CheckCircle2, ArrowLeft, Heart, Layers, CreditCard } from 'lucide-react';

interface ShippingPolicyViewProps {
  onBack: () => void;
}

export const ShippingPolicyView: React.FC<ShippingPolicyViewProps> = ({ onBack }) => {
  return (
    <div className="bg-slate-50 min-h-screen py-10 font-sans">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header Board */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-150-soft shadow-xs">
          <div>
            <span className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 px-3.5 py-1.5 rounded-full font-black uppercase tracking-wider">
              Service Guidelines • বিশ্বস্ত গ্রাহক সেবা আমাদের শপথ
            </span>
            <h1 className="text-xl sm:text-2.5xl font-black text-gray-950 mt-2.5 leading-tight">
              শিপিং ও সহজ ফেরত নীতি (Return & Shipping Policy)
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
              সরাসরি কৃষকের মাঠের ফসল অক্ষত ও সতেজ অবস্থায় দ্রুততম সময়ে আপনার রান্নাঘরে পৌঁছে দেওয়ার শতভাগ গ্যারান্টি।
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
          
          {/* Golden Rule banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex gap-4">
            <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-2xl shrink-0 h-11 w-11 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-emerald-950 text-sm sm:text-base">কৃষক বাজার "গোল্ডেন গ্যারান্টি" (Golden Quality Guarantee)</h4>
              <p className="text-[11.5px] sm:text-[12.5px] text-emerald-800 mt-1 leading-relaxed font-medium">
                যেহেতু আমাদের পণ্যসমূহ একদম পচনশীল অর্গানিক কৃষিজাত খাদ্য সামগ্রী, তাই ডেলিভারির সময় যেকোনো পণ্যের গুণগত মান দেখে সন্তুষ্ট না হলে আপনি ডেলিভারি ম্যানের কাছে তৎক্ষণাৎ তা সম্পূর্ণ ফ্রিতে ফেরত পাঠাতে পারবেন। কোনো মূল্য নেওয়া হবে না।
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg shrink-0">
                <Truck className="h-4 w-4" />
              </span>
              <h2 className="font-black text-stone-900 text-sm sm:text-base">১. ডেলিভারি এলাকাসমূহ, চার্জ ও সময়সীমা (Shipping Timelines)</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-[12.5px] sm:text-[13.5px]">
              শাকসবজি, দেশী ফল, ফ্রেশ মাছ, দুধ এবং হাঁসের ফ্রেশ ডিমের পুষ্টি অক্ষুণ্ণ রাখতে আমাদের রয়েছে নিজস্ব ডেডিকেটেড লজিস্টিকস ও কোল্ড-চেইন সাপ্লাই টিম।
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="bg-slate-50 p-4 rounded-2.5xl border border-slate-100 space-y-1">
                <h5 className="font-extrabold text-stone-900 text-xs text-emerald-800">🛒 ঢাকা মেট্রোপলিটন এলাকা</h5>
                <p className="text-[11px] text-slate-500 leading-snug">ঢাকার সব প্রধান এলাকায় আমাদের রেগুলার ডেলিভারি টিম কাজ করে। সর্বোচ্চ ১২ থেকে ২৪ ঘণ্টার মধ্যে ডেলিভারি সুনিশ্চিত!</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2.5xl border border-slate-100 space-y-1">
                <h5 className="font-extrabold text-stone-900 text-xs text-emerald-800">🚚 এক্সপ্রেস সুপার ফাস্ট সার্ভিস</h5>
                <p className="text-[11px] text-slate-500 leading-snug">সকাল ৭টার মধ্যে অর্ডার প্লেস করলে ঢাকার অভ্যন্তরে একই দিনে সন্ধ্যা ৬টার মধ্যে সরাসরি বাগান থেকে তোলা সতেজ শস্য পেয়ে যাবেন।</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2.5xl border border-slate-100 space-y-1">
                <h5 className="font-extrabold text-stone-900 text-xs text-emerald-800">⚡ শিফটিং ডেলিভারি চার্জ</h5>
                <p className="text-[11px] text-slate-500 leading-snug">ঢাকা সিটিতে ফ্ল্যাট রেট মাত্র ৬০ টাকা। সপ্তাহের বাজেট কম্বো বা বাস্কেট অর্ডার করলে ক্যাশ অন ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!</p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg shrink-0">
                <RotateCcw className="h-4 w-4" />
              </span>
              <h2 className="font-black text-stone-900 text-sm sm:text-base">২. পণ্য কিভাবে ফেরত দিবেন? (Easy Return steps)</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-[12.5px] sm:text-[13.5px]">
              আমাদের অর্গানিক তাজা ফল, শাকসবজি অথবা হাঁসের ডিম যদি আপনার প্রত্যাশা পূরণ করতে ব্যর্থ হয় তবে সহজ ৩টি উপায়ে সাথে সাথে ফেরত দিতে পারেন:
            </p>
            <div className="space-y-4">
              <div className="flex gap-3 text-[12px] sm:text-[13px] items-start">
                <span className="bg-emerald-100 text-emerald-800 font-black h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px] mt-0.5">১</span>
                <div>
                  <strong className="text-stone-900">ডেলিভারির সময় তাৎক্ষণিক লাইভ চেক:</strong> আমাদের ডেলিভারি ম্যান কাস্টমারের দরজায় দাঁড়িয়ে থাকাকালীন সময়ে অনুগ্রহ করে আপনার অর্ডারের সবগুলো শাকসবজি, ফল বা ফ্রেশ গরুর দুধ ও হাঁসের ডিম যাচাই করে নিন। কোনো ত্রুটি পেলে বা নষ্ট আইটেম চোখে পড়লে তা সরাসরি ডেলিভারি প্রতিনিধির কাছে রিটার্ন দিয়ে দিন।
                </div>
              </div>
              <div className="flex gap-3 text-[12px] sm:text-[13px] items-start">
                <span className="bg-emerald-100 text-emerald-800 font-black h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px] mt-0.5">২</span>
                <div>
                  <strong className="text-stone-900">ডেলিভারি চলে যাওয়ার পর অভিযোগ দাখিল:</strong> সাময়িক ব্যস্ততায় তাৎক্ষণিক চেক করা দূরহ হলে ডেলিভারির পরবর্তী ২ ঘণ্টার মধ্যে ক্ষতিগ্রস্ত পণ্যের পরিষ্কার ছবি তুলে আমাদের হটলাইন নম্বরে বা কাস্টমার চ্যাটের মাধ্যমে রিপোর্ট করুন। আমরা আন্তরিক দুঃখপ্রকাশ করে কোনো অতিরিক্ত ডেলিভারি ফিস ছাড়াই রিপ্লেসমেন্ট পাঠাবো।
                </div>
              </div>
              <div className="flex gap-3 text-[12px] sm:text-[13px] items-start">
                <span className="bg-emerald-100 text-emerald-800 font-black h-5 w-5 rounded-full flex items-center justify-center shrink-0 text-[10px] mt-0.5">৩</span>
                <div>
                  <strong className="text-stone-900">ডিম বা দুধ টক বা নষ্ট হওয়া সম্পর্কিত নীতি:</strong> যেহেতু প্রাকৃতিক উপায়ে সংগৃহীত হাঁসের ডিম বা গরুর কাঁচা দুধ কোনো প্রিজারভেটিভ ছাড়াই প্যাকেট করা হয়, তাই পরিবহনের তাপে বা ডেলিভারির পর ফেটে যাওয়া বা নষ্ট পাওয়া গেলে, আমরা পরের অর্ডার বা বাস্কেটের সাথে দ্বিগুণ পরিমাণ সমন্বয় করার গ্যারান্টি প্রদান করি।
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <span className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg shrink-0">
                <CreditCard className="h-4 w-4" />
              </span>
              <h2 className="font-black text-stone-900 text-sm sm:text-base">৩. রিফান্ড পাওয়ার নিয়মাবলী ও পেমেন্ট ফেরত (Refund Timelines)</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-[12.5px] sm:text-[13.5px]">
              আপনার জমাকৃত পেমেন্ট রিফান্ড পেতে আপনাকে কোনো হয়রানির শিকার হতে হবে না। আমরা দ্রুততম উপায়ে অর্থ ফেরত দেই:
            </p>
            <ul className="list-disc pl-5 space-y-2.5 text-slate-600 text-[12px] sm:text-[13px]">
              <li><strong className="text-stone-900">ক্যাশ অন ডেলিভারি:</strong> আপনি যদি ডেলিভারির সময় নগদ টাকা দিয়ে পেমেন্ট করে থাকেন, তবে নষ্ট হওয়া কিংবা বাতিল করা পণ্যের সমপরিমাণ টাকা ডেলিভারি ম্যান সাথে সাথেই তৎক্ষণাৎ কাস্টমারকে ফেরত দিবেন।</li>
              <li><strong className="text-stone-900">মোবাইল ব্যাংকিং (বিকাশ, রকেট, নগদ):</strong> ডিজিটাল উপায়ে অগ্রিম অর্থ পরিশোধ করা পণ্য ফেরত দিলে সর্বোচ্চ <span className="text-emerald-700 font-extrabold">২৪ ঘণ্টার মধ্যে</span> আপনার কাঙ্ক্ষিত মোবাইল ওয়ালেটে পেমেন্ট রিফান্ড করে রিফান্ড স্ক্রিনশট পাঠিয়ে দেওয়া হয়।</li>
              <li><strong className="text-stone-900">ডেবিট/ক্রেডিট কার্ড ও আন্তর্জাতিক কাস্টমার:</strong> ভিসা, মাস্টারকার্ড বা ব্যাংক একাউন্টে পেমেন্ট রিফান্ড করতে ব্যাংকিং প্রসেস অনুযায়ী ৩ থেকে ৭ কার্যদিবস সময় লাগতে পারে।</li>
            </ul>
          </div>

          {/* Quality pillar warning */}
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-2.5xl p-5 flex gap-3 text-xs text-stone-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <strong className="font-black">বিশেষ দ্রষ্টব্য সকর্ততা:</strong> রান্না করা শুরু করার পর কিংবা অযথা কোনো কারণ ছাড়া ২ দিনের বেশি ফ্রিজে কোনো সতেজ ফসল যেমন সবুজ শাক বা টমেটো রেখে পচিয়ে ফেলার পর কোনো ফেরত বা রিফান্ড গ্রহণযোগ্য বলে বিবেচিত হবে না।
            </div>
          </div>

          {/* Contact help line */}
          <div className="border-t border-slate-100 pt-8 mt-4 flex flex-col md:flex-row items-center justify-between gap-5 bg-emerald-50/10 p-6 rounded-3xl">
            <div className="space-y-1.5 font-sans text-center md:text-left">
              <div className="flex items-center gap-1.5 justify-center md:justify-start">
                <Heart className="h-4 w-4 text-red-500 fill-current shrink-0" />
                <h4 className="font-black text-stone-900 text-sm">গ্রাহক সেবা টিম সর্বদা আপনার পাশে</h4>
              </div>
              <p className="text-[11.5px] text-slate-550">সকাল ৮:০০টা থেকে রাত ৯:০০টা পর্যন্ত আমাদের নিবেদিত কাস্টমার কেয়ার টিম যেকোনো সমস্যায় সাহায্য করতে প্রস্তুত।</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-black text-emerald-800 font-sans tracking-wide">📞 হটলাইন: +880 18 1000 2000</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
