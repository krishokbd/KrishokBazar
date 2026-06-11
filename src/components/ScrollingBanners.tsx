import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Sparkles, X, ChevronRight } from 'lucide-react';

interface ScrollingBannersProps {
  onOpenSubscription: () => void;
}

export const ScrollingBanners: React.FC<ScrollingBannersProps> = ({ onOpenSubscription }) => {
  const { language, offers } = useApp();
  const [activeBannerIdx, setActiveBannerIdx] = useState<number>(-1);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (!offers || offers.length === 0) return;

    const timers: NodeJS.Timeout[] = [];
    let recurringInterval: NodeJS.Timeout;

    // Trigger banner display and reset dismissal state so it shows up
    const triggerBanner = (indexToTrigger?: number) => {
      setIsDismissed(false);
      setActiveBannerIdx((prev) => {
        if (indexToTrigger !== undefined) return indexToTrigger % offers.length;
        if (prev === -1) return 0;
        return (prev + 1) % offers.length;
      });
    };

    // 1. Ad after 1 minute (60,000 ms)
    const t1 = setTimeout(() => {
      triggerBanner(0);
    }, 60 * 1000);
    timers.push(t1);

    // 2. Ad after 5 minutes (300,000 ms)
    const t2 = setTimeout(() => {
      triggerBanner(1);
    }, 5 * 60 * 1000);
    timers.push(t2);

    // 3. Ad after 10 minutes (600,000 ms)
    const t3 = setTimeout(() => {
      triggerBanner(2);

      // 4. Thereafter, set up an ad every 15 minutes (900,000 ms)
      recurringInterval = setInterval(() => {
        triggerBanner();
      }, 15 * 60 * 1000);
    }, 10 * 60 * 1000);
    timers.push(t3);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      if (recurringInterval) {
        clearInterval(recurringInterval);
      }
    };
  }, [offers]);

  if (activeBannerIdx === -1 || isDismissed || !offers || offers.length === 0) return null;

  const currentBanner = offers[activeBannerIdx] || offers[0];

  const handleNextBanner = () => {
    setActiveBannerIdx((prev) => (prev + 1) % offers.length);
  };

  const handleClose = () => {
    setIsDismissed(true);
    setActiveBannerIdx(-1);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm sm:max-w-md w-[360px] sm:w-[420px] rounded-2xl bg-white border-2 border-emerald-500 shadow-2xl p-5 md:p-6 transition-all duration-500 animate-fade-in font-sans">
      
      {/* Banner indicator badge */}
      <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-3">
        <span className="flex items-center gap-1.5 text-[9px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-black uppercase tracking-wider font-sans font-bold">
          <Sparkles className="h-3 w-3 text-green-600 animate-pulse" />
          {language === 'bn' ? currentBanner.tagBn : currentBanner.tagEn}
        </span>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleNextBanner}
            className="text-[10px] text-gray-400 hover:text-emerald-600 font-bold px-2 py-0.5 bg-gray-50 rounded-md shrink-0 flex items-center gap-0.5 cursor-pointer"
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
        {currentBanner.image ? (
          <img 
            src={currentBanner.image} 
            alt={currentBanner.titleBn} 
            className="w-16 h-12 object-cover rounded-xl border border-gray-100 shrink-0 bg-slate-50" 
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="bg-gray-50 w-16 h-12 flex items-center justify-center rounded-xl border border-gray-100 shrink-0 text-xl">
            🌱
          </div>
        )}
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
          className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold text-[11px] py-2 px-3 text-center shadow-md hover:scale-[1.01] hover:brightness-105 active:scale-95 transition-all cursor-pointer font-bold"
        >
          {language === 'bn' ? currentBanner.ctaBn : currentBanner.ctaEn}
        </button>
        <button 
          onClick={handleClose}
          className="rounded-xl border border-gray-200 text-gray-450 hover:text-gray-600 hover:bg-gray-50 font-bold text-[10px] px-3 py-2 cursor-pointer transition-all"
        >
          {language === 'bn' ? 'বাদ দিন' : 'Skip'}
        </button>
      </div>

    </div>
  );
};
