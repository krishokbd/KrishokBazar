import React from 'react';
import { useApp } from '../AppContext';
import { ShieldCheck, Star, ArrowRight, Play, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export const BottomVideoSection: React.FC = () => {
  const { language } = useApp();

  const videos = [
    {
      id: 's-CMeMovJyY',
      titleBn: 'কেন আমরা রাসায়নিক মুক্ত খাবারের লড়াইয়ে?',
      titleEn: 'Why We Stand for Chemical-Free Food?',
      embedUrl: 'https://www.youtube.com/embed/s-CMeMovJyY',
    },
    {
      id: 'ybCj8e-L9_w',
      titleBn: 'সরাসরি জমি থেকে ফসল তোলার জীবন্ত প্রামাণ্যচিত্র',
      titleEn: 'Real Harvesting Live Video from Ground',
      embedUrl: 'https://www.youtube.com/embed/ybCj8e-L9_w',
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="px-3.5 py-1 text-[10px] sm:text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full uppercase tracking-wider">
            {language === 'bn' ? 'ভিডিও গ্যালারি ও প্রামাণ্যচিত্র' : 'Direct Video Evidence'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2 tracking-tight">
            {language === 'bn' ? 'কেন আপনি কৃষক বাজার থেকে সতেজ পণ্য নেবেন?' : 'Why Choose Fresh Farmer Direct Food?'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 font-medium">
            {language === 'bn' 
              ? 'আমাদের খামারিদের সত্যতা এবং সতেজ ফসল সংগ্রহের সরাসরি দৃশ্য দেখে নিন। মধ্যস্বত্বভোগী ছাড়া শতভাগ খাঁটি ও নিরাপদ খাবারের আয়োজন।'
              : 'Witness the harvest process with your own eyes. Completely chemical-free foods loaded straight from the field.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {videos.map((vid) => (
            <div key={vid.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300">
              {/* Responsive Iframe Container */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={vid.embedUrl}
                  title={language === 'bn' ? vid.titleBn : vid.titleEn}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              
              {/* Title info bar */}
              <div className="p-4 flex items-center justify-between gap-2.5 bg-white">
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-black text-gray-800 leading-snug">
                    {language === 'bn' ? vid.titleBn : vid.titleEn}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium">
                    YouTube Shorts • Verified Field Footage
                  </p>
                </div>
                <a
                  href={`https://youtube.com/shorts/${vid.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-red-50 hover:bg-red-500 hover:text-white rounded-full text-red-650 transition cursor-pointer shrink-0"
                  title="ইউটিউব-এ দেখুন"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const BottomFarmersSection: React.FC = () => {
  const { farmers, products, language, setView, setSelectedFarmerStoreId } = useApp();

  // Handle clicking a farmer card
  const handleFarmerClick = (farmerId: string) => {
    setSelectedFarmerStoreId(farmerId);
    setView('farmer-store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 bg-emerald-50/20 border-t border-gray-100 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-1 text-left">
            <span className="px-3 py-0.5 text-[9px] font-black tracking-widest bg-emerald-600 text-white rounded-md uppercase">
              ★ {language === 'bn' ? 'আমাদের ৫ জন আসল খামারি' : 'Meet Our 5 Real Farmers'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              {language === 'bn' ? 'দক্ষিণ খড়া চরের বিশ্বস্ত কৃষকদের প্রোফাইল' : 'Verified Farmers of South Khara Char'}
            </h2>
            <p className="text-xs text-gray-500 font-medium font-sans">
              {language === 'bn' 
                ? 'সরাসরি কাপাসিয়া, গাজীপুরের খামারিদের আসল ছবি, আসল নাম্বার ও সত্য গল্প দেখে বেছে নিন আপনার পছন্দের যোগানদাতা।'
                : 'Check authentic photos, certified phone contacts, and real farm stories of our local growers.'}
            </p>
          </div>
          <button
            onClick={() => { setView('farmers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-4 py-2 bg-emerald-605 hover:bg-emerald-700 text-white hover:scale-101 shadow-sm font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition shrink-0 self-start md:self-auto"
          >
            <span>{language === 'bn' ? 'সকল খামারি দেখুন' : 'Explore All Farmers'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 5 Farmers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 font-sans">
          {farmers.map((farmer) => {
            // Retrieve specific products for this farmer
            const farmerProducts = products.filter((p) => p.farmerId === farmer.id && !p.id.startsWith('cb')).slice(0, 3);
            
            return (
              <motion.div
                key={farmer.id}
                onClick={() => handleFarmerClick(farmer.id)}
                className="bg-white rounded-3xl border border-emerald-100/60 p-4.5 space-y-4 relative cursor-pointer group flex flex-col justify-between"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, scale: 1.015, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.1), 0 8px 10px -6px rgba(16, 185, 129, 0.1)" }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <div className="space-y-3.5">
                  {/* Avatar wrapper */}
                  <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-emerald-100 group-hover:border-emerald-500 transition-all shadow-xs">
                    <img
                      src={farmer.avatar}
                      referrerPolicy="no-referrer"
                      alt={farmer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all"
                    />
                    {farmer.verified && (
                      <span className="absolute bottom-1 right-1 bg-white p-0.5 rounded-full shadow-xs text-emerald-600 block" title="ভেরিফাইড খামারি">
                        <ShieldCheck className="h-4.5 w-4.5 fill-emerald-50 text-emerald-600" />
                      </span>
                    )}
                  </div>

                  {/* Rating / verification badge row */}
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-[11px] font-black text-gray-750 font-mono mt-0.5">{farmer.rating}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-[9.5px] font-black text-emerald-805 bg-emerald-50 border border-emerald-100 rounded-md px-1.5 py-0.2">
                      {language === 'bn' ? 'ভেরিফাইড' : 'Verified'}
                    </span>
                  </div>

                  {/* Name and address details */}
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-black text-gray-800 tracking-tight group-hover:text-emerald-700 transition">
                      {farmer.name}
                    </h3>
                    <p className="text-[9.5px] text-gray-400 font-bold leading-relaxed truncate px-1">
                      {farmer.address}
                    </p>
                    <p className="text-[10.5px] text-emerald-850 font-mono font-black select-all" title="সরাসরি খামারি যোগাযোগ">
                      📱 {farmer.phone}
                    </p>
                  </div>

                  {/* List of their typical products */}
                  <div className="space-y-1.5 pt-3 border-t border-dashed border-gray-100">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block text-left">
                      {language === 'bn' ? 'উদ্যোগের পণ্যসমূহ:' : 'Core Crop List:'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {farmerProducts.length > 0 ? (
                        farmerProducts.map((p) => (
                          <span
                            key={p.id}
                            className="text-[9.5px] bg-slate-50 text-gray-650 border border-gray-100 rounded-md px-1.5 py-0.5 max-w-full truncate block"
                          >
                            {p.title.split(' ')[0]}
                          </span>
                        ))
                      ) : (
                        <span className="text-[9px] text-gray-400 italic">
                          {language === 'bn' ? 'অর্গানিক সবজি ও শস্য' : 'Organic farm crops'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="w-full py-1.5 bg-emerald-50 group-hover:bg-emerald-600 text-emerald-800 group-hover:text-white rounded-xl text-[10.5px] font-black text-center block transition-all shadow-3xs cursor-pointer">
                    {language === 'bn' ? 'খামারি স্টোর দেখুন →' : 'Visit Farm Shop →'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const BottomFoundersSection: React.FC = () => {
  const { siteSettings, language, setView } = useApp();

  const founderName = language === 'bn' 
    ? (siteSettings?.founderNameBn || 'জাকির হোসেন') 
    : (siteSettings?.founderNameEn || 'Zakir Hossain');

  const founderRole = language === 'bn'
    ? (siteSettings?.founderRoleBn || 'প্রতিষ্ঠাতা')
    : (siteSettings?.founderRoleEn || 'Founder');

  const coFounderName = language === 'bn'
    ? (siteSettings?.coFounderNameBn || 'আহসামুল হক রতন')
    : (siteSettings?.coFounderNameEn || 'Ahsamul Haque Ratan');

  const coFounderRole = language === 'bn'
    ? (siteSettings?.coFounderRoleBn || 'সহ-প্রতিষ্ঠাতা')
    : (siteSettings?.coFounderRoleEn || 'Co-Founder');

  return (
    <section className="py-14 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white font-sans overflow-hidden relative select-none border-t border-emerald-800/40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Side: Call to Action & Story Intro */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
              👑 {language === 'bn' ? 'স্বপ্নদ্রষ্টা ও নেতৃত্ব' : 'Our Leadership'}
            </span>
            
            <h2 className="text-2xl sm:text-3.5xl font-black tracking-tight leading-tight">
              {language === 'bn' 
                ? 'কৃষক বাজার আন্দোলনের পেছনের মুখ' 
                : 'The Faces Behind Krishok Bazar'}
            </h2>
            
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
              {language === 'bn' 
                ? 'দালাল ও সিন্ডিকেটের অবসান ঘটিয়ে কৃষকের অধিকার নিশ্চিত করতে এবং বিষমুক্ত সতেজ খাবার ঘরে ঘরে পৌঁছে দিতে দিনরাত অক্লান্ত পরিশ্রম করছেন আমাদের প্রতিষ্ঠাতা ও পুরো টিম।' 
                : 'Working day and night to break syndicate networks, ensure true farmer pricing, and supply chemical-free food to families.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => { setView('founders'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md inline-flex items-center gap-1.5 active:scale-95 border border-amber-400"
              >
                <span>📖 {language === 'bn' ? 'প্রতিষ্ঠাতাদের পূর্ণ কাহিনী ও ভিশন' : 'Read Our Founders Story'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => { setView('our-story'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-5 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 rounded-xl text-xs font-black transition-all cursor-pointer border border-emerald-700/60 inline-flex items-center gap-1.5 active:scale-95"
              >
                <span>🌿 {language === 'bn' ? 'আমাদের গল্প পেজ' : 'Our Story Page'}</span>
              </button>
            </div>
          </div>

          {/* Right Side: Founders Spotlight Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Founder 1 */}
            <div className="bg-white/5 backdrop-blur-xs rounded-2xl border border-white/10 p-5 flex items-center gap-4 hover:border-white/25 transition">
              <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-emerald-500/30">
                <img 
                  src={siteSettings?.founderImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'} 
                  alt={founderName} 
                  className="h-full w-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left space-y-0.5">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">{founderRole}</span>
                <h4 className="text-sm font-black text-white">{founderName}</h4>
                <p className="text-[10px] text-emerald-200/80 leading-normal line-clamp-2">
                  {language === 'bn' 
                    ? 'স্বপ্নদ্রষ্টা ও প্রতিষ্ঠাতা, কৃষক বাজার। "কৃষক দেশের সম্পদ" এই দর্শনে বিশ্বাসী।' 
                    : 'Visionary & Founder. Believes that farmers are the wealth of our nation.'}
                </p>
              </div>
            </div>

            {/* Founder 2 */}
            <div className="bg-white/5 backdrop-blur-xs rounded-2xl border border-white/10 p-5 flex items-center gap-4 hover:border-white/25 transition">
              <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-emerald-500/30">
                <img 
                  src={siteSettings?.coFounderImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'} 
                  alt={coFounderName} 
                  className="h-full w-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left space-y-0.5">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">{coFounderRole}</span>
                <h4 className="text-sm font-black text-white">{coFounderName}</h4>
                <p className="text-[10px] text-emerald-200/80 leading-normal line-clamp-2">
                  {language === 'bn' 
                    ? 'সহ-প্রতিষ্ঠাতা, নিরাপদ ও রাসায়নিক মুক্ত খাদ্য সরবরাহের লড়াইয়ে অগ্রণী।' 
                    : 'Co-Founder, dedicated to delivering pure, chemical-free foods to every home.'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
