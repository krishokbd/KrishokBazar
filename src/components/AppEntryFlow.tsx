import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Globe, ChevronRight, Check } from 'lucide-react';

const LOGO_URL = "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_ce5s9yce5s9yce5s.png?v=1779307577";

interface AppEntryFlowProps {
  onComplete: (location: { division: string; district: string; upazila: string }, language: 'bn' | 'en') => void;
}

// 8 Divisions, and their Districts
const DIVISION_DATA: Record<string, string[]> = {
  'Dhaka (ঢাকা)': ['Dhaka (ঢাকা)', 'Gazipur (গাজীপুর)', 'Narayanganj (নারায়ণগঞ্জ)', 'Tangail (টাঙ্গাইল)', 'Faridpur (ফরিদপুর)', 'Manikganj (মানিকগঞ্জ)'],
  'Chattogram (চট্টগ্রাম)': ['Chattogram (চট্টগ্রাম)', 'Cox\'s Bazar (কক্সবাজার)', 'Comilla (কুমিল্লা)', 'Feni (ফেনী)', 'Noakhali (নোয়াখালী)'],
  'Rajshahi (রাজশাহী)': ['Rajshahi (রাজশাহী)', 'Bogra (বগুড়া)', 'Pabna (পাবনা)', 'Naogaon (নওগাঁ)', 'Natore (নাটোর)'],
  'Khulna (খুলনা)': ['Khulna (খুলনা)', 'Jessore (যশোর)', 'Satkhira (সাতক্ষীরা)', 'Bagerhat (বাগেরহাট)', 'Kushtia (কুষ্টিয়া)'],
  'Barisal (বরিশাল)': ['Barisal (বরিশাল)', 'Patuakhali (পটুয়াখালী)', 'Bhola (ভোলা)', 'Pirojpur (পিরোজপুর)'],
  'Sylhet (সিলেট)': ['Sylhet (সিলেট)', 'Moulvibazar (মৌলভীবাজার)', 'Habiganj (হবিগঞ্জ)', 'Sunamganj (সুনামগঞ্জ)'],
  'Rangpur (রংপুর)': ['Rangpur (রংপুর)', 'Dinajpur (দিনাজপুর)', 'Gaibandha (গাইবান্ধা)', 'Kurigram (কুড়িগ্রাম)'],
  'Mymensingh (ময়মনসিংহ)': ['Mymensingh (ময়মনসিংহ)', 'Jamalpur (জামালপুর)', 'Netrokona (নেত্রকোনা)', 'Sherpur (শেরপুর)']
};

const UPAZILA_DATA: Record<string, string[]> = {
  'Dhaka (ঢাকা)': ['Mirpur (মিরপুর)', 'Lalbagh (লালবাগ)', 'Dhanmondi (ধানমন্ডি)', 'Savar (সাভার)', 'Keraniganj (কেরানীগঞ্জ)', 'Gulshan (গুলশান)'],
  'Gazipur (গাজীপুর)': ['Gazipur Sadar (গাজীপুর সদর)', 'Kaliakair (কালিয়াকৈর)', 'Sreepur (শ্রীপুর)', 'Kapasia (কাপাসিয়া)'],
  'Narayanganj (নারায়ণগঞ্জ)': ['Narayanganj Sadar (নারায়ণগঞ্জ সদর)', 'Araihazar (আড়াইহাজার)', 'Rupganj (রূপগঞ্জ)'],
  'Chattogram (চট্টগ্রাম)': ['Kotwali (কোতোয়ালী)', 'Hathazari (হাটহাজারী)', 'Halishahar (হালিশহর)', 'Sandwip (সন্দ্বীপ)', 'Patiya (পটিয়া)'],
  'Cox\'s Bazar (কক্সবাজার)': ['Cox\'s Bazar Sadar (সদর)', 'Ukhiya (উখিয়া)', 'Teknaf (টেকনাফ)', 'Ramu (রামু)'],
  'Bogra (বগুড়া)': ['Bogra Sadar (বগুড়া সদর)', 'Shajahanpur (শাজাহানপুর)', 'Sherpur (শেরপুর)', 'Kahaloo (কাহালু)'],
  'Rajshahi (রাজশাহী)': ['Boalia (বোয়ালিয়া)', 'Paba (পবা)', 'Godagari (গোদাগাড়ী)', 'Bagha (বাঘা)'],
  'Sylhet (সিলেট)': ['Sylhet Sadar (সিলেট সদর)', 'Beanibazar (বিয়ানীবাজার)', 'Golapganj (গোলাপগঞ্জ)', 'Zakiganj (জকিগঞ্জ)'],
  'Khulna (খুলনা)': ['Khulna Sadar (খুলনা সদর)', 'Rupsha (রূপসা)', 'Dumuria (ডুমুরিয়া)'],
  'Jessore (যশোর)': ['Jessore Sadar (যশোর সদর)', 'Jhikargachha (ঝিকরগাছা)', 'Keshabpur (কেশবপুর)', 'Manirampur (মণিরামপুর)']
};

const DEFAULT_UPAZILAS = ['Sadar Upazila (সদর উপজেলা)', 'Upazila 1 (উপজেলা ১)', 'Upazila 2 (উপজেলা ২)'];

export const AppEntryFlow: React.FC<AppEntryFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'splash' | 'onboarding' | 'location' | 'language'>('splash');
  const [splashProgress, setSplashProgress] = useState(0);
  const [onboardingIndex, setOnboardingIndex] = useState(0);
  
  // Location form states
  const [division, setDivision] = useState('');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  
  // Language selection state
  const [lang, setLang] = useState<'bn' | 'en'>('bn');

  // Splash timeout (3 seconds, incremental progress)
  useEffect(() => {
    if (step !== 'splash') return;
    
    const interval = setInterval(() => {
      setSplashProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1; // 1% every 30ms -> 3000ms total
      });
    }, 30);

    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (splashProgress === 100) {
      // Check if user has already completed onboarding / location
      const onboardingCompleted = localStorage.getItem('kb_entry_onboarding_completed') === 'true';
      const hasLoc = localStorage.getItem('kb_entry_location_division');
      const hasLang = localStorage.getItem('kb_entry_user_lang');

      if (onboardingCompleted && hasLoc && hasLang) {
        onComplete(
          {
            division: localStorage.getItem('kb_entry_location_division') || '',
            district: localStorage.getItem('kb_entry_location_district') || '',
            upazila: localStorage.getItem('kb_entry_location_upazila') || ''
          },
          (localStorage.getItem('kb_entry_user_lang') as 'bn' | 'en') || 'bn'
        );
      } else {
        setStep('onboarding');
      }
    }
  }, [splashProgress, onComplete]);

  // Handle skip/next onboarding
  const handleOnboardingNext = () => {
    if (onboardingIndex < 2) {
      setOnboardingIndex(prev => prev + 1);
    } else {
      localStorage.setItem('kb_entry_onboarding_completed', 'true');
      setStep('location');
    }
  };

  const handleSkipOnboarding = () => {
    localStorage.setItem('kb_entry_onboarding_completed', 'true');
    setStep('location');
  };

  // Handle location verification
  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!division || !district || !upazila) return;
    
    localStorage.setItem('kb_entry_location_division', division);
    localStorage.setItem('kb_entry_location_district', district);
    localStorage.setItem('kb_entry_location_upazila', upazila);
    setStep('language');
  };

  // Handle language completion
  const handleLanguageSubmit = () => {
    localStorage.setItem('kb_entry_user_lang', lang);
    onComplete({ division, district, upazila }, lang);
  };

  // Render Splash Screen
  if (step === 'splash') {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between py-16 px-6 font-sans">
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="relative h-28 w-28 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-500 overflow-hidden shadow-md animate-pulse">
            <img 
              src={LOGO_URL} 
              alt="Krishok Bazar Logo" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-emerald-800 tracking-tight">কৃষক বাজার</h1>
            <p className="text-sm font-semibold tracking-wide text-gray-500">দালাল মুক্ত কৃষি বাজার</p>
          </div>
        </div>

        {/* LOADING ANIMATION */}
        <div className="w-full max-w-xs space-y-2.5 text-center">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-30" 
              style={{ width: `${splashProgress}%` }}
            />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-emerald-700/80 uppercase font-medium">
            লোড হচ্ছে... {splashProgress}%
          </span>
        </div>
      </div>
    );
  }

  // Render Onboarding (3 slides)
  if (step === 'onboarding') {
    const onboardingSlides = [
      {
        image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=600",
        title: "সরাসরি কৃষকের কাছ থেকে",
        desc: "দেশের বিভিন্ন প্রান্তের ভেরিফাইড কৃষকদের কাছ থেকে সরাসরি পণ্য কিনুন।"
      },
      {
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600",
        title: "রাসায়নিক মুক্ত নিরাপদ খাদ্য",
        desc: "আমাদের প্রতিটি পণ্য ক্ষতিকর কেমিক্যাল ও ফরমালিন মুক্ত এবং প্যাক করা সতেজ ও স্বাস্থ্যকর।"
      },
      {
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
        title: "দ্রুত ডেলিভারি ও সহজ পেমেন্ট",
        desc: "খুব সহজেই ক্যাশ অন ডেলিভারি অথবা বিকাশ ও নগদের মাধ্যমে সুরক্ষিত উপায়ে পেমেন্ট করুন।"
      }
    ];

    const currentSlide = onboardingSlides[onboardingIndex];

    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between py-8 px-6 font-sans">
        {/* Header toolbar */}
        <div className="flex justify-between items-center h-8">
          <div className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-full overflow-hidden border border-emerald-500 flex items-center justify-center">
              <img src={LOGO_URL} alt="kb logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-xs font-black text-emerald-800">কৃষক বাজার</span>
          </div>
          <button 
            onClick={handleSkipOnboarding}
            className="text-xs font-bold text-gray-400 hover:text-emerald-700 transition-colors"
          >
            এড়িয়ে যান (Skip)
          </button>
        </div>

        {/* Dynamic slide visual layout */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto space-y-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={onboardingIndex}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-6 text-center"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-md border border-gray-100 bg-emerald-50">
                <img 
                  src={currentSlide.image} 
                  alt={currentSlide.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-gray-800 leading-tight">
                  {currentSlide.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-550 leading-relaxed max-w-xs mx-auto font-medium">
                  {currentSlide.desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicator pagination dots */}
          <div className="flex justify-center gap-2 pt-2">
            {[0, 1, 2].map((idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${onboardingIndex === idx ? 'w-5 bg-emerald-600' : 'w-1.5 bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        {/* Next and back button controls */}
        <div className="max-w-xs w-full mx-auto flex items-center gap-3">
          {onboardingIndex > 0 && (
            <button 
              onClick={() => setOnboardingIndex(p => p - 1)}
              className="flex-1 py-3 text-xs font-bold text-gray-500 bg-gray-100 font-sans hover:bg-gray-150 active:scale-98 rounded-xl transition-all"
            >
              পিছনে
            </button>
          )}
          <button 
            onClick={handleOnboardingNext}
            className="flex-3 py-3 text-xs font-bold text-white bg-emerald-600 font-sans hover:bg-emerald-700 active:scale-98 rounded-xl transition-all shadow-md flex items-center justify-center gap-1"
          >
            {onboardingIndex === 2 ? 'শুরু করুন' : 'পরবর্তী'} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Render Location Selection
  if (step === 'location') {
    const districts = division ? DIVISION_DATA[division] : [];
    const upazilas = district ? (UPAZILA_DATA[district] || DEFAULT_UPAZILAS) : [];

    return (
      <div className="fixed inset-0 z-50 bg-[#FAFAF8] flex flex-col justify-between py-8 px-6 font-sans">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
                <MapPin className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">আপনার ঠিকানা নির্বাচন করুন</h2>
              <p className="text-[11px] text-gray-450 leading-relaxed font-semibold">
                সরাসরি আপনার সন্নিকটের চাষীদের মৌসুমী ফলন দ্রুততম সময়ে পৌঁছে দেওয়ার জন্য ভৌগলিক অবস্থান প্রয়োজন।
              </p>
            </div>

            <form onSubmit={handleLocationSubmit} className="space-y-4">
              {/* Division Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500">বিভাগ নির্বাচন করুন:</label>
                <select
                  required
                  value={division}
                  onChange={(e) => {
                    setDivision(e.target.value);
                    setDistrict('');
                    setUpazila('');
                  }}
                  className="w-full rounded-xl border border-gray-150 py-2.5 px-3 bg-gray-50 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white text-gray-700"
                >
                  <option value="">বিভাগ পছন্দ করুন (Select Division)</option>
                  {Object.keys(DIVISION_DATA).map((div) => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
              </div>

              {/* District Dropdown */}
              <div className="space-y-1.5 animate-fadeIn">
                <label className="block text-xs font-bold text-gray-500">জেলা নির্বাচন করুন:</label>
                <select
                  required
                  disabled={!division}
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    setUpazila('');
                  }}
                  className="w-full rounded-xl border border-gray-150 py-2.5 px-3 bg-gray-50 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white disabled:opacity-50 text-gray-700"
                >
                  <option value="">জেলা পছন্দ করুন (Select District)</option>
                  {districts.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              {/* Upazila Dropdown */}
              <div className="space-y-1.5 animate-fadeIn">
                <label className="block text-xs font-bold text-gray-500">উপজেলা / এরিয়া নির্বাচন করুন:</label>
                <select
                  required
                  disabled={!district}
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full rounded-xl border border-gray-155 py-2.5 px-3 bg-gray-50 text-xs font-semibold outline-none focus:border-emerald-500 focus:bg-white disabled:opacity-50 text-gray-700"
                >
                  <option value="">এরিয়া বা থানা পছন্দ করুন (Select Area)</option>
                  {upazilas.map((upz) => (
                    <option key={upz} value={upz}>{upz}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={!division || !district || !upazila}
                className="w-full mt-2 py-3 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:scale-98 font-sans transition-all shadow-md disabled:bg-gray-300 disabled:opacity-50 shadow-emerald-600/10"
              >
                নিশ্চিত করুন এবং এগিয়ে যান ✔
              </button>
            </form>
          </div>
        </div>
        
        {/* Footprint credit indicator (anti-tech Indicators, clean simple) */}
        <p className="text-[10px] text-center text-gray-400 font-medium">নিরাপদ কৃষিপণ্যের উন্মুক্ত ঠিকানা</p>
      </div>
    );
  }

  // Render Language Selection Step
  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAF8] flex flex-col justify-between py-8 px-6 font-sans animate-fadeIn">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-700">
              <Globe className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">ভাষা পছন্দ করুন / Choose Language</h2>
            <p className="text-[11px] text-gray-450 leading-relaxed font-semibold">
              কৃষক বাজার প্ল্যাটফর্ম ব্যবহারের জন্য আপনার পছন্দের ভাষা নির্বাচন করুন।
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Bangla Option card */}
            <div 
              onClick={() => setLang('bn')}
              className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center gap-2.5 transition-all active:scale-95 ${lang === 'bn' ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 shadow-sm' : 'border-gray-100 hover:border-gray-200 text-gray-500'}`}
            >
              <span className="text-3xl select-none">🇧🇩</span>
              <span className="text-xs font-bold font-sans">বাংলা</span>
              {lang === 'bn' && (
                <span className="p-0.5 bg-emerald-600 text-white rounded-full">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </div>

            {/* English Option card */}
            <div 
              onClick={() => setLang('en')}
              className={`p-5 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center gap-2.5 transition-all active:scale-95 ${lang === 'en' ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 shadow-sm' : 'border-gray-100 hover:border-gray-200 text-gray-500'}`}
            >
              <span className="text-3xl select-none">🇬🇧</span>
              <span className="text-xs font-bold font-sans">English</span>
              {lang === 'en' && (
                <span className="p-0.5 bg-emerald-600 text-white rounded-full">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleLanguageSubmit}
            className="w-full py-3 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:scale-98 font-sans transition-all shadow-md shadow-emerald-600/10"
          >
            {lang === 'bn' ? 'শুরু করুন ✔' : 'Proceed ✔'}
          </button>
        </div>
      </div>

      <p className="text-[10px] text-center text-gray-400 font-medium">কৃষক বাজার • Krishok Bazar</p>
    </div>
  );
};
