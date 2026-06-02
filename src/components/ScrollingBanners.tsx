import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Sparkles, Cookie, Percent, Tractor, X, ChevronRight } from 'lucide-react';

interface ScrollingBannersProps {
  onOpenSubscription: () => void;
}

export const ScrollingBanners: React.FC<ScrollingBannersProps> = ({ onOpenSubscription }) => {
  const { language } = useApp();
  const [activeBannerIdx, setActiveBannerIdx] = useState<number>(-1);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let scrollTriggered = false;

    // Trigger banner display
    const triggerBanner = () => {
      if (isDismissed) return;
      // Pick a random banner or cycle starting with the first one
      setActiveBannerIdx(0);
    };

    // 1. Scroll Detector Trigger
    const handleScroll = () => {
      if (!scrollTriggered) {
        scrollTriggered = true;
        // Wait 1.5 seconds after first scroll to show premium banner
        setTimeout(triggerBanner, 1500);
      }
    };

    // 2. 20-25 Second Idle Timer Configuration
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        triggerBanner();
      }, 22000); // 22 seconds idle time
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keypress', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);

    // Initial timer setup
    resetIdleTimer();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keypress', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      clearTimeout(idleTimer);
    };
  }, [isDismissed]);

  if (activeBannerIdx === -1 || isDismissed) return null;

  // Banner details & content definitions for localizations
  const banners = [
    {
      icon: <Cookie className="h-6 w-6 text-green-600 animate-bounce" />,
      titleBn: '🍳 রেডি-টু-কুক (Ready-to-Cook) প্রিমিয়াম সুবিধা!',
      titleEn: '🍳 Premium Ready-to-Cook Benefits!',
      descBn: 'কর্মব্যস্ত জীবনের জন্য প্রাক-ধৌত ও হাইজেনিক উপায়ে কাটা সবজি এবং প্রস্তুত মশলা ডিরেক্ট হোম ডেলিভারি পেতে আমাদের প্রিমিয়াম মেম্বারশিপে যোগ দিন।',
      descEn: 'Join our premium membership for home-delivery of pre-washed, pre-cut hygienic vegetables and meat items matching your recipe size!',
      ctaBn: 'সদস্য হতে সাবস্ক্রাইব করুন 👑',
      ctaEn: 'Subscribe to become a member 👑',
      tagBn: 'মেডিকেল গ্রেড বিশুদ্ধতা',
      tagEn: 'Hygienic standard'
    },
    {
      icon: <Percent className="h-6 w-6 text-yellow-600 animate-pulse" />,
      titleBn: '🏷️ 🥇 স্পেশাল মেম্বারশিপ ও ফ্যামিলি বাস্কেট অফার!',
      titleEn: '🏷️ Weekly Premium Discounts & Family Basket Offers!',
      descBn: 'শুধুমাত্র একটি সাবস্ক্রিপশনেই পেয়ে যান ৭০% পর্যন্ত ডেলিভারি ছাড় এবং ফ্যামিলি কম্বো বাস্কেটে আকর্ষণীয় ক্যাশব্যাক! সাশ্রয় করুন প্রতি মাসে ৫০০০+ টাকা।',
      descEn: 'Get up to 70% delivery discounts and awesome cashbacks on all family combo baskets! Save over 5000+ BDT cash money every month.',
      ctaBn: 'সাশ্রয়ী প্ল্যান দেখুন 🛒',
      ctaEn: 'Explore Budget Plans 🛒',
      tagBn: 'সীমিত সময়ের অফার',
      tagEn: 'Limited Offer'
    },
    {
      icon: <Tractor className="h-6 w-6 text-emerald-600 animate-spin-slow" />,
      titleBn: '🚜 কৃষক ও সরাসরি খামারের সেরা সুবিধাসমূহ!',
      titleEn: '🚜 Farmer Direct Connect & Fair Trading Benefits!',
      descBn: 'দালাল ও সিন্ডিকেট মাফিয়া হটিয়ে সরাসরি তৃণমূল ভেরিফাইড কৃষকদের সাথে যোগাযোগ করুণ। কৃষক বাঁচাতে ও বিষমুক্ত খাদ্য পেতে সহায়ক হোন।',
      descEn: 'Establish immediate direct connection with local growers. Take a stand to break down commission brokers & middlemen syndicates!',
      ctaBn: 'আজই প্রিমিয়াম মেম্বার হোন 🤝',
      ctaEn: 'Become a Premium Member 🤝',
      tagBn: 'সামাজিক আন্দোলন',
      tagEn: 'Social Movement'
    }
  ];

  const currentBanner = banners[activeBannerIdx];

  const handleNextBanner = () => {
    setActiveBannerIdx((prev) => (prev + 1) % banners.length);
  };

  const handleClose = () => {
    setIsDismissed(true);
    setActiveBannerIdx(-1);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm sm:max-w-md w-[360px] sm:w-[420px] rounded-2xl bg-white border-2 border-emerald-500 shadow-2xl p-5 md:p-6 transition-all duration-500 animate-fade-in font-sans">
      
      {/* Banner indicator badge */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-3">
        <span className="flex items-center gap-1.5 text-[9px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
          <Sparkles className="h-3 w-3 text-green-600" />
          {language === 'bn' ? currentBanner.tagBn : currentBanner.tagEn}
        </span>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleNextBanner}
            className="text-[10px] text-gray-400 hover:text-emerald-600 font-bold px-2 py-0.5 bg-gray-50 rounded-md shrink-0 flex items-center gap-0.5"
            title="পরের অফার"
          >
            {language === 'bn' ? 'পরবর্তী' : 'Next Ad'} <ChevronRight className="h-3 w-3" />
          </button>
          <button 
            onClick={handleClose}
            className="rounded-full hover:bg-gray-100 p-1 text-gray-400 hover:text-gray-600 shrink-0 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Ads Main layout */}
      <div className="flex gap-3">
        <div className="bg-gray-50 p-2.5 rounded-xl h-max shrink-0 border border-gray-100">
          {currentBanner.icon}
        </div>
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-black text-slate-800 leading-snug">
            {language === 'bn' ? currentBanner.titleBn : currentBanner.titleEn}
          </h4>
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
            {language === 'bn' ? currentBanner.descBn : currentBanner.descEn}
          </p>
        </div>
      </div>

      {/* CTA Trigger and Close */}
      <div className="mt-4 flex gap-2 pt-2 border-t border-gray-50">
        <button
          onClick={() => {
            handleClose();
            onOpenSubscription();
          }}
          className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold text-[11px] py-2 px-3 text-center shadow-md hover:scale-[1.01] hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          {language === 'bn' ? currentBanner.ctaBn : currentBanner.ctaEn}
        </button>
        <button 
          onClick={handleClose}
          className="rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 font-bold text-[10px] px-3 py-2 cursor-pointer transition-all"
        >
          {language === 'bn' ? 'বাদ দিন' : 'Skip'}
        </button>
      </div>

    </div>
  );
};
