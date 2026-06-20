import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Play, ArrowLeft, Facebook, Youtube, Share2, Video, MessageCircle, ExternalLink, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface VideoGalleryViewProps {
  onBack: () => void;
}

function getYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export const VideoGalleryView: React.FC<VideoGalleryViewProps> = ({ onBack }) => {
  const { language, siteSettings, farmers } = useApp();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Dynamic social link construction
  const fbUsername = siteSettings?.socialFacebook 
    ? siteSettings.socialFacebook.replace(/\/$/, '').split('/').pop() || 'krishokbazar' 
    : 'krishokbazar';

  const links = {
    facebook: siteSettings?.socialFacebook || 'https://www.facebook.com/people/%E0%A6%95%E0%A7%83%E0%A6%B7%E0%A6%95-%E0%A6%AC%E0%A6%BE%E0%A6%9C%E0%A6%BE%E0%A6%B0-Krishok-Bazar/61578459151972/',
    youtube: siteSettings?.socialYoutube || 'https://www.youtube.com/@KrishokBazarBD',
    tiktok: siteSettings?.socialInstagram || 'https://www.tiktok.com/@krishokbazarbd', // Stored in Instagram field as described by user
    messenger: 'https://m.me/61578459151972',
    whatsapp: `https://wa.me/88${siteSettings?.footerPhone?.replace(/\D/g, '') || '01931355398'}`
  };

  // Pre-compiled list of YouTube videos & farmer videos
  const officialDocumentaries = [
    {
      id: 's-CMeMovJyY',
      titleBn: 'কেন আমরা রাসায়নিক মুক্ত খাবারের লড়াইয়ে?',
      titleEn: 'Why We Stand for Chemical-Free Food?',
      descBn: 'কৃষক বাজার প্ল্যাটফর্মের চমৎকার উদ্দেশ্য এবং সিন্ডিকেট হঠানোর চিত্র',
      descEn: 'The core mission of Krishok Bazar and the middleman-free ecosystem',
      type: 'official'
    },
    {
      id: 'ybCj8e-L9_w',
      titleBn: 'সরাসরি জমি থেকে ফসল তোলার জীবন্ত প্রামাণ্যচিত্র',
      titleEn: 'Real Harvesting Live Video from Ground',
      descBn: 'আমাদের মাঠকর্মীরা কাকডাকা ভোরে সরাসরি কৃষকের ক্ষেত থেকে কিভাবে ফসল সংগ্রহ করে তা দেখুন',
      descEn: 'See how our field partners harvest fresh crops straight from farms in dawn',
      type: 'official'
    }
  ];

  // Farmer updates and shorts gathered from our system
  const defaultShortsUrls = [
    'https://youtube.com/shorts/iRHqWnxj-jU?feature=share',
    'https://youtube.com/shorts/oLgAz7tiS-Y?feature=share',
    'https://youtube.com/shorts/4iph-cQWg3g?feature=share',
    'https://youtube.com/shorts/ivdux5l52TY?feature=share',
    'https://youtube.com/shorts/n6TW95vbqxo?feature=share',
    'https://youtube.com/shorts/lXgJgxP9frU?feature=share'
  ];

  const gatheredVideos: { id: string; titleBn: string; titleEn: string; descBn: string; descEn: string; type: string }[] = [];

  // Extract from farmers or use defaults
  farmers?.forEach((farmer, idx) => {
    if (farmer.youtubeVideos && farmer.youtubeVideos.length > 0) {
      farmer.youtubeVideos.forEach((vUrl, vIdx) => {
        const vid = getYoutubeId(vUrl);
        if (vid && !gatheredVideos.some(g => g.id === vid)) {
          gatheredVideos.push({
            id: vid,
            titleBn: `${farmer.name}-এর খামারের লাইভ ভিডিও #${vIdx + 1}`,
            titleEn: `Live Video from ${farmer.name}'s Farm #${vIdx + 1}`,
            descBn: `${farmer.farmName} থেকে সরাসরি বাস্তব দৃশ্য`,
            descEn: `Direct farm reporting from ${farmer.farmName}`,
            type: 'farmer'
          });
        }
      });
    }
  });

  // Fallback defaults if none gathered
  if (gatheredVideos.length === 0) {
    defaultShortsUrls.forEach((url, idx) => {
      const vid = getYoutubeId(url);
      if (vid) {
        gatheredVideos.push({
          id: vid,
          titleBn: `খামারি কার্যক্রম ও সোনালী ফসল সংগ্রহ ভিডিও #${idx + 1}`,
          titleEn: `Farmer Crop Harvesting Video #${idx + 1}`,
          descBn: 'তৃণমূল মাঠের চাষীদের দৈনিক কাজের চিত্র',
          descEn: 'Daily routines of marginal farmers producing pesticide-free foods',
          type: 'farmer'
        });
      }
    });
  }

  const allVideos = [...officialDocumentaries, ...gatheredVideos];

  return (
    <div className="bg-gray-50 min-h-screen py-8 leading-relaxed font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* TOP BAR / NAVIGATION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-800 border border-emerald-100 font-extrabold tracking-wide uppercase px-3 py-1 rounded-full">
                {language === 'bn' ? 'অফিসিয়াল ভিডিও গ্যালারি ও সোশ্যাল হাব' : 'Official Videos & Social Hub'}
              </span>
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
              {language === 'bn' ? 'সরাসরি খামারের জীবন্ত ভিডিও দেখুন' : 'Watch Farm Videos Directly'}
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-semibold">
              {language === 'bn' 
                ? 'রাসায়নিক ও ফরমালিন মুক্ত বিশুদ্ধ ফসল সংগ্রহ এবং মাঠের সচিত্র প্রতিবেদন দেখতে আমাদের অফিশিয়াল ভিডিওগুলো উপভোগ করুন।' 
                : 'Watch our real crop harvesting documentaries and video blogs taken directly from marginal farms.'}
            </p>
          </div>
          
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-650 hover:bg-gray-50 font-black rounded-xl text-xs shrink-0 self-start sm:self-auto cursor-pointer transition shadow-2xs hover:scale-102"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === 'bn' ? 'প্রচ্ছদে ফিরে যান' : 'Back to Home'}
          </button>
        </div>

        {/* INTEGRATED DIRECT CONNECT CONNECTIVITY BLOCK */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700/20 rounded-full filter blur-3xl transform translate-x-20 -translate-y-20 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl space-y-5">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
              {language === 'bn' ? 'সরাসরি আমাদের সাথে যুক্ত হোন ও লাইভ ভিডিও দেখুন 📹' : 'Connect and Watch Live Videos 📹'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed max-w-2xl">
              {language === 'bn' 
                ? 'ফেসবুক পেইজ, ইউটিউব চ্যানেল ও টিকটকে আমাদের নিয়মিত নতুন নতুন পণ্য সংগ্রহ ও খামারিদের কাজের ভিডিও পাবলিশ করা হয়। যেকোনো দরকারে মেসেঞ্জারে কল বা টেক্সট করে চ্যাট করুন।'
                : 'Stay closer to our green struggle. Watch new crop processing reels, shorts and documentaries on YouTube, TikTok, and Facebook. Request support via Messenger!'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
              
              {/* FACEBOOK */}
              <a
                href={links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl font-black text-xs hover:scale-102 transition-all group"
              >
                <Facebook className="h-4.5 w-4.5 text-[#1877F2]" />
                <span>{language === 'bn' ? 'ফেসবুক পেজ' : 'Facebook Page'}</span>
              </a>

              {/* YOUTUBE */}
              <a
                href={links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl font-black text-xs hover:scale-102 transition-all"
              >
                <Youtube className="h-4.5 w-4.5 text-[#FF0000]" />
                <span>{language === 'bn' ? 'ইউটিউব চ্যানেল' : 'YouTube Channel'}</span>
              </a>

              {/* TIKTOK */}
              <a
                href={links.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl font-black text-xs hover:scale-102 transition-all"
              >
                <Video className="h-4.5 w-4.5 text-pink-400" />
                <span>{language === 'bn' ? 'টিকটক ভিডিও' : 'TikTok Videos'}</span>
              </a>

              {/* MESSENGER */}
              <a
                href={links.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl font-black text-xs hover:scale-102 transition-all"
              >
                <MessageCircle className="h-4.5 w-4.5 text-[#006AFF]" />
                <span>{language === 'bn' ? 'মেসেঞ্জার চ্যাট' : 'Messenger Chat'}</span>
              </a>

            </div>
          </div>
        </div>

        {/* MAIN VIDEO SCREEN PLAYER CONTAINER */}
        {activeVideo && (
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 animate-[fadeIn_0.3s_ease-out]">
            <div className="relative aspect-video w-full max-h-[520px]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                title="Active Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                  {language === 'bn' ? 'চলমান প্লেয়ার (Now Playing)' : 'Now Playing:'}
                </p>
                <h3 className="text-sm font-black mt-0.5">
                  {allVideos.find(v => v.id === activeVideo)?.titleBn || 'ভিডিও লোড হচ্ছে...'}
                </h3>
              </div>
              <button 
                onClick={() => setActiveVideo(null)}
                className="px-3.5 py-1.5 text-xs font-black bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition cursor-pointer"
              >
                {language === 'bn' ? 'প্লেয়ার বন্ধ করুন' : 'Close Player'}
              </button>
            </div>
          </div>
        )}

        {/* VIDEOS LIST GRID */}
        <div className="space-y-6">
          <h3 className="text-base font-black text-gray-800 border-l-4 border-emerald-600 pl-2.5">
            {language === 'bn' ? 'সকল ভিডিও ক্লিপস ও খামার প্রামাণ্যচিত্র' : 'All Videos & Farm Shorts'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allVideos.map((vid) => {
              const isActive = activeVideo === vid.id;
              return (
                <motion.div
                  key={vid.id}
                  onClick={() => {
                    setActiveVideo(vid.id);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden cursor-pointer flex flex-col justify-between h-full group ${
                    isActive 
                      ? 'border-emerald-500 ring-2 ring-emerald-50' 
                      : 'border-gray-150/75 hover:border-emerald-250 shadow-2xs hover:shadow-md'
                  }`}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative aspect-video w-full bg-gray-900 group overflow-hidden">
                    {/* YouTube thumbnail mock/real link */}
                    <img
                      src={`https://img.youtube.com/vi/${vid.id}/0.jpg`}
                      alt={vid.titleBn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center group-hover:bg-black/35 transition-all">
                      <div className="h-12 w-12 rounded-full bg-emerald-600 group-hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all">
                        <Play className="h-5 w-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    {vid.type === 'official' && (
                      <span className="absolute top-3 left-3 text-[9px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                        {language === 'bn' ? 'অফিসিয়াল ভিডিও' : 'Official Document'}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-black text-gray-800 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
                        {language === 'bn' ? vid.titleBn : vid.titleEn}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-gray-400 font-semibold leading-normal line-clamp-2">
                        {language === 'bn' ? vid.descBn : vid.descEn}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-50 text-[10px] sm:text-xs font-black text-emerald-750">
                      <span>{language === 'bn' ? 'এখনই দেখুন 🎬' : 'Watch Now 🎬'}</span>
                      <div className="flex items-center gap-1.5 text-gray-400 font-normal">
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Share</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
