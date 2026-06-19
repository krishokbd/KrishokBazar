import React from 'react';
import { useApp } from '../AppContext';
import { ShieldCheck, Star, ArrowRight, Play, ExternalLink } from 'lucide-react';

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
              <div
                key={farmer.id}
                onClick={() => handleFarmerClick(farmer.id)}
                className="bg-white rounded-3xl border border-emerald-100/60 p-4.5 space-y-4 hover:shadow-lg transition-all duration-300 relative cursor-pointer group flex flex-col justify-between"
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
