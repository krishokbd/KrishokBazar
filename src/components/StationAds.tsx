import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ShoppingBag, Award, Gift } from 'lucide-react';
import { useApp } from '../AppContext';

interface AdItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  desc: string;
  image: string;
  ctaText: string;
  action: {
    type: 'view' | 'product';
    payload: string;
  };
}

const ADS_DATA: AdItem[] = [
  {
    id: 'ad-mango',
    tag: 'আজকের সেরা ডিল 🥭',
    title: 'রাজশাহীর শতভাগ তাজা গোপালভোগ আম',
    subtitle: 'রাসায়নিক ও ফরমালিন মুক্ত গ্যারান্টি',
    desc: 'সরাসরি খামারি আব্দুর রহমানের বাগান থেকে পেড়ে ঢাকা শহরে ২৪ ঘন্টার মধ্যে হোম ডেলিভারি! আজ অর্ডার করলে ১৫% বিশেষ ছাড়।',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80',
    ctaText: 'আম অর্ডার করুন',
    action: { type: 'view', payload: 'shop' }
  },
  {
    id: 'ad-combo',
    tag: 'সাপ্তাহিক ধামাকা অফার 🥦',
    title: 'ফ্যামিলি পুষ্টি কম্বো বাস্কেট অফার',
    subtitle: 'ফ্রি হোম ডেলিভারি + ১২% নিশ্চিত ক্যাশব্যাক',
    desc: '১০ কেজি তাজা শীতকালীন সবজি, খাঁটি সরিষার তেল ও সুন্দরবনের অর্গানিক মধুর স্পেশাল প্যাকেজ। আপনার রান্নাঘরের সাপ্তাহিক বাজার এক ক্লিকেই!',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&auto=format&fit=crop&q=80',
    ctaText: 'কম্বো বাস্কেট দেখুন',
    action: { type: 'view', payload: 'home' } // combo is on home section
  },
  {
    id: 'ad-premium',
    tag: 'কৃষক পার্টনারশিপ লঞ্চ 👑',
    title: 'ভেরিফাইড ডায়মন্ড খামারি মেম্বারশিপ',
    subtitle: '১০০% নিশ্চিত সেলস বৃদ্ধি ও স্পন্সরশিপ সুবিধা',
    desc: 'কৃষক বাজার স্টেশনে আপনার খামার ভেরিফাই করে সরাসরি ডিরেক্ট বায়ার কানেক্ট সুবিধা পান। ইনস্ট্যান্ট ৩-ঘন্টার পেমেন্ট ও প্রিমিয়াম ব্যাজ আর্ন করুন।',
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=500&auto=format&fit=crop&q=80',
    ctaText: 'পার্টনারশিপে যোগ দিন',
    action: { type: 'view', payload: 'farmers' }
  },
  {
    id: 'ad-honey',
    tag: 'অর্গানিক কালেকশন 🍯',
    title: 'সুন্দরবনের ১০০% খাঁটি প্রাকৃতিক চাকের মধু',
    subtitle: 'সরাসরি মহুয়াবনের সংগৃহীত প্রিমিয়াম মধু',
    desc: 'কোনো কৃত্রিম সুগার বা রঙ মেলানো হয়নি। ল্যাব ভেরিফাইড এবং সরাসরি মৌয়ালদের মাধ্যমে কালেকটেড এই মধু রোগপ্রতিরোধ ক্ষমতা বাড়াতে অনন্য।',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=500&auto=format&fit=crop&q=80',
    ctaText: 'মধু কিনুন',
    action: { type: 'view', payload: 'shop' }
  }
];

interface StationAdsProps {
  setView: (view: any) => void;
  setSelectedProductId?: (id: string | null) => void;
}

export const StationAds: React.FC<StationAdsProps> = ({ setView, setSelectedProductId }) => {
  const [activeAd, setActiveAd] = useState<AdItem | null>(null);
  const [adCount, setAdCount] = useState(0);

  const triggerAd = (index: number) => {
    // Round robin selection if index exceeds length
    const selectedAd = ADS_DATA[index % ADS_DATA.length];
    setActiveAd(selectedAd);
    setAdCount(prev => prev + 1);
    console.log(`[STATION AD TRIGGERED] Dispalyed ad "${selectedAd.title}" (${index + 1}th interval)`);
  };

  useEffect(() => {
    // Prompt states that user requests ads:
    // 1 minute (60,000 ms)
    // 5 minutes (300,000 ms)
    // 10 minutes (600,000 ms)
    // and then every 15 minutes (900,000 ms) thereafter.

    const adTriggers = [
      60000,   // 1 minute (1 min after client comes)
      300000,  // 5 minutes (5 min after)
      600000,  // 10 minutes (10 min after)
    ];

    const timeouts: NodeJS.Timeout[] = [];
    let recurringInterval: NodeJS.Timeout | null = null;

    // Schedule 1m, 5m, 10m ads
    adTriggers.forEach((durationMs, idx) => {
      const parentTimeout = setTimeout(() => {
        triggerAd(idx);
      }, durationMs);
      timeouts.push(parentTimeout);
    });

    // Schedule subsequent ads every 15 minutes starting from 10-minutes point onwards
    // i.e. 25 minutes, 40 minutes, 55 minutes etc.
    const startRecurringTimeout = setTimeout(() => {
      let runCount = 3; // We already ran 3 ads
      recurringInterval = setInterval(() => {
        triggerAd(runCount);
        runCount++;
      }, 900000); // 15 minutes
    }, 600000); // starts after 10m
    timeouts.push(startRecurringTimeout);

    return () => {
      timeouts.forEach(clearTimeout);
      if (recurringInterval) clearInterval(recurringInterval);
    };
  }, []);

  const handleCtaClick = () => {
    if (!activeAd) return;
    
    if (activeAd.action.type === 'view') {
      setView(activeAd.action.payload);
      if (activeAd.action.payload === 'home') {
        setTimeout(() => {
          document.getElementById('combo-basket')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
    setActiveAd(null);
  };

  return (
    <AnimatePresence>
      {activeAd && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="fixed bottom-22 md:bottom-6 right-4 z-50 w-full max-w-sm overflow-hidden rounded-3xl bg-white border border-rose-100 shadow-2xl p-4 font-sans select-none flex flex-col gap-3"
          style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-rose-100">
              <Sparkles className="h-3 w-3 text-rose-500 animate-pulse" />
              <span>{activeAd.tag}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">স্টেশন বিজ্ঞাপন</span>
              <button
                onClick={() => setActiveAd(null)}
                className="rounded-full bg-slate-50 hover:bg-rose-50 hover:text-red-500 p-1 cursor-pointer transition border border-gray-100 flex items-center justify-center text-gray-400"
                title="বিজ্ঞাপন বন্ধ করুন"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Ad details and image card */}
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border border-gray-150 shrink-0 shadow-3xs bg-gray-50">
              <img 
                src={activeAd.image} 
                alt={activeAd.title} 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[12px] font-black text-gray-850 leading-snug tracking-tight font-sans">
                {activeAd.title}
              </h4>
              <p className="text-[10px] text-emerald-650 font-extrabold mt-0.5 font-sans leading-none">
                {activeAd.subtitle}
              </p>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 leading-normal font-medium mt-0.5">
            {activeAd.desc}
          </p>

          {/* Bottom Action Section */}
          <div className="flex gap-2 items-center justify-between border-t border-gray-100 pt-2.5">
            <span className="text-[9px] text-gray-400 font-bold font-sans">কৃষক বাজার স্পেশাল</span>
            <div className="flex gap-1">
              <button
                onClick={() => setActiveAd(null)}
                className="px-3 py-1.5 rounded-lg border bg-white hover:bg-slate-50 text-gray-500 font-bold transition text-[10px] cursor-pointer"
              >
                পরে দেখব
              </button>
              <button
                onClick={handleCtaClick}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black hover:shadow-md transition text-[10px] cursor-pointer flex items-center gap-1 shadow-3xs"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>{activeAd.ctaText}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
