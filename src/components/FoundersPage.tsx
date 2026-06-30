import React from 'react';
import { useApp } from '../AppContext';
import { ArrowLeft, Award, ShieldCheck, Heart, Users, Sparkles, BookOpen, Eye, Target, Microscope } from 'lucide-react';
import { LazyImage } from './LazyImage';

interface FoundersPageProps {
  onBackToHome: () => void;
}

export const FoundersPage: React.FC<FoundersPageProps> = ({ onBackToHome }) => {
  const { siteSettings, language } = useApp();

  // Safeguards to avoid crashing if settings are undefined
  const founderName = language === 'bn' 
    ? (siteSettings?.founderNameBn || 'জাকির হোসেন') 
    : (siteSettings?.founderNameEn || 'Zakir Hossain');

  const founderRole = language === 'bn'
    ? (siteSettings?.founderRoleBn || 'প্রতিষ্ঠাতা')
    : (siteSettings?.founderRoleEn || 'Founder');

  const founderBio = language === 'bn'
    ? (siteSettings?.founderBioBn || '')
    : (siteSettings?.founderBioEn || '');

  const coFounderName = language === 'bn'
    ? (siteSettings?.coFounderNameBn || 'আহসামুল হক রতন')
    : (siteSettings?.coFounderNameEn || 'Ahsamul Haque Ratan');

  const coFounderRole = language === 'bn'
    ? (siteSettings?.coFounderRoleBn || 'সহ-প্রতিষ্ঠাতা')
    : (siteSettings?.coFounderRoleEn || 'Co-Founder');

  const coFounderBio = language === 'bn'
    ? (siteSettings?.coFounderBioBn || '')
    : (siteSettings?.coFounderBioEn || '');

  const storyTitle = language === 'bn'
    ? (siteSettings?.foundersStoryTitleBn || 'আমাদের সংগ্রাম, আমাদের কল্পনা, এবং একটি বিষমুক্ত সোনার বাংলার জন্মকথা')
    : (siteSettings?.foundersStoryTitleEn || 'Our Struggle, Our Imagination, and the Birth of a Poison-Free Golden Bengal');

  const storyBody = language === 'bn'
    ? (siteSettings?.foundersStoryBodyBn || '')
    : (siteSettings?.foundersStoryBodyEn || '');

  const visionTitle = language === 'bn'
    ? (siteSettings?.visionTitleBn || 'আমাদের দূরদর্শী ভিশন')
    : (siteSettings?.visionTitleEn || 'Our Strategic Vision');

  const visionBody = language === 'bn'
    ? (siteSettings?.visionBodyBn || '')
    : (siteSettings?.visionBodyEn || '');

  const missionTitle = language === 'bn'
    ? (siteSettings?.missionTitleBn || 'আমাদের মিশন')
    : (siteSettings?.missionTitleEn || 'Our Core Mission');

  const missionBody = language === 'bn'
    ? (siteSettings?.missionBodyBn || '')
    : (siteSettings?.missionBodyEn || '');

  const foodSafetyTitle = language === 'bn'
    ? (siteSettings?.foodSafetyTitleBn || 'খাদ্য নিরাপত্তা ও ল্যাব স্ট্যান্ডার্ড')
    : (siteSettings?.foodSafetyTitleEn || 'Food Safety & Lab Standards');

  const foodSafetyBody = language === 'bn'
    ? (siteSettings?.foodSafetyBodyBn || '')
    : (siteSettings?.foodSafetyBodyEn || '');

  // Split story paragraphs for beautiful editorial layout
  const paragraphs = storyBody.split('\n\n').filter(p => p.trim() !== '');

  return (
    <div className="bg-white min-h-screen text-gray-800 font-sans selection:bg-emerald-100 animate-fadeIn select-none">
      
      {/* 1. Hero Cover Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"></div>
        <div className="absolute -bottom-16 -left-16 h-64 w-64 bg-emerald-500/25 rounded-full blur-3xl"></div>
        <div className="absolute top-12 right-12 h-48 w-48 bg-amber-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
            ✨ {language === 'bn' ? 'প্রতিষ্ঠাতা পরিচিতি ও ভিশন' : 'Founders & Core Vision'}
          </div>
          
          <h1 className="text-3xl sm:text-5.5xl font-black tracking-tight leading-tight">
            {language === 'bn' 
              ? 'কৃষক বাজার-এর পেছনের স্বপ্নদ্রষ্টা' 
              : 'The Visionaries Behind Krishok Bazar'}
          </h1>
          
          <p className="text-xs sm:text-base text-emerald-100 max-w-2xl mx-auto leading-relaxed font-medium">
            {language === 'bn' 
              ? 'কৃষকদের ন্যায্য অধিকার আদায় এবং আগামী প্রজন্মের জন্য বিষমুক্ত ও সতেজ খাদ্যের নিশ্চয়তা দিতে যারা জীবন উৎসর্গ করেছেন।' 
              : 'Dedicated individuals working tirelessly to establish fair trade for organic growers and secure safe, non-toxic food for families.'}
          </p>

          <div className="pt-4">
            <button
              onClick={onBackToHome}
              className="px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-black transition cursor-pointer shadow-md inline-flex items-center gap-1.5 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              {language === 'bn' ? 'হোম পেইজে ফিরুন' : 'Back to Home'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Founders Profile Grid Section */}
      <section className="py-20 bg-gray-50/60 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black text-emerald-700 tracking-wider uppercase bg-emerald-100/50 px-3 py-1 rounded-full border border-emerald-200 block w-max mx-auto">
              {language === 'bn' ? 'প্রতিষ্ঠাতাদ্বয়' : 'Our Leaders'}
            </span>
            <h2 className="text-2xl sm:text-3.5xl font-extrabold text-gray-900 tracking-tight">
              {language === 'bn' ? 'আমাদের উদ্যোক্তা ও প্রতিষ্ঠাতা পরিচিতি' : 'Meet Our Founders'}
            </h2>
            <p className="text-xs text-gray-500">
              {language === 'bn' 
                ? 'একপাশে তারুণ্যের অমিত সম্ভাবনা ও স্বপ্ন, অন্যপাশে অভিজ্ঞ সমাজের প্রতি গভীর দায়বদ্ধতার মেলবন্ধন।' 
                : 'A perfect combination of youth-driven energy and deep social commitment for a better nation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            
            {/* Founder Card: Zakir Hossain */}
            <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition duration-300">
              <div className="relative aspect-[4/3] bg-emerald-900 overflow-hidden">
                <LazyImage 
                  src={siteSettings?.founderImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'} 
                  alt={founderName} 
                  className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 right-4 bg-emerald-600/90 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-500">
                  <Award className="h-3 w-3" /> {founderRole}
                </div>
              </div>
              
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800">{founderName}</h3>
                    <p className="text-xs font-bold text-emerald-700 font-mono">
                      {language === 'bn' ? 'স্বপ্নদ্রষ্টা ও প্রতিষ্ঠাতা, কৃষক বাজার' : 'Founder & Visionary, Krishok Bazar'}
                    </p>
                  </div>
                  
                  {/* Distinct Philosophy Quote */}
                  <div className="bg-emerald-50/50 border-l-4 border-emerald-600 p-3 rounded-r-xl">
                    <p className="text-xs sm:text-sm font-extrabold text-emerald-900 leading-relaxed italic">
                      "{language === 'bn' ? 'কৃষক দেশের সম্পদ।' : 'Farmers are the wealth of our country.'}"
                    </p>
                  </div>

                  <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                    {founderBio}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center gap-2 text-[11px] font-bold text-emerald-800">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>
                    {language === 'bn' ? 'কৃষকের মেহনত ও ঘামের সঠিক মূল্যায়নের যুদ্ধ' : 'Struggling for the dignity of our farmers'}
                  </span>
                </div>
              </div>
            </div>

            {/* Co-Founder Card: Ahsamul Haque Ratan */}
            <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition duration-300">
              <div className="relative aspect-[4/3] bg-emerald-900 overflow-hidden">
                <LazyImage 
                  src={siteSettings?.coFounderImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'} 
                  alt={coFounderName} 
                  className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 right-4 bg-amber-500/90 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 border border-amber-400">
                  <ShieldCheck className="h-3 w-3" /> {coFounderRole}
                </div>
              </div>
              
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800">{coFounderName}</h3>
                    <p className="text-xs font-bold text-amber-600 font-mono">
                      {language === 'bn' ? 'সহ-প্রতিষ্ঠাতা, কৃষক বাজার' : 'Co-Founder, Krishok Bazar'}
                    </p>
                  </div>
                  
                  {/* Distinct Philosophy Quote */}
                  <div className="bg-amber-50/50 border-l-4 border-amber-500 p-3 rounded-r-xl">
                    <p className="text-xs sm:text-sm font-extrabold text-amber-900 leading-relaxed italic">
                      "{language === 'bn' ? 'দেশের প্রতিটি মানুষের কাছে বিষমুক্ত খাদ্য পৌঁছে দেওয়াই লক্ষ্য।' : 'Our mission is to bring toxic-free food to every citizen.'}"
                    </p>
                  </div>

                  <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal">
                    {coFounderBio}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 flex items-center gap-2 text-[11px] font-bold text-emerald-800">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>
                    {language === 'bn' ? 'ভেজালমুক্ত সতেজ খাবার ও সুস্থ আগামী প্রজন্মের অঙ্গীকার' : 'Committed to a healthy, safe future generation'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2.5. Vision, Mission & Food Safety Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50/60 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black text-emerald-700 tracking-wider uppercase bg-emerald-100/50 px-3 py-1 rounded-full border border-emerald-200 block w-max mx-auto">
              {language === 'bn' ? 'আমাদের ভিত্তিপ্রস্তর' : 'Our Foundations'}
            </span>
            <h2 className="text-2xl sm:text-3.5xl font-extrabold text-gray-900 tracking-tight">
              {language === 'bn' ? 'ভিশন, মিশন এবং কঠোর ল্যাব স্ট্যান্ডার্ড' : 'Vision, Mission & Rigorous Standards'}
            </h2>
            <p className="text-xs text-gray-500 max-w-lg mx-auto">
              {language === 'bn'
                ? 'একটি সুস্থ ও বিষমুক্ত সমাজ বিনির্মাণে আমাদের মূল কর্মপদ্ধতি ও প্রতিজ্ঞা।'
                : 'Our core operations and promises to foster a healthy, poison-free community.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Vision Card */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 rounded-bl-full group-hover:bg-emerald-500/10 transition duration-300"></div>
              <div className="space-y-6">
                <div className="h-12 w-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center shadow-inner">
                  <Eye className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-extrabold text-slate-800">{visionTitle}</h3>
                  <p className="text-xs sm:text-[13.5px] text-gray-600 leading-relaxed font-normal text-justify">
                    {visionBody}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-6 flex items-center gap-2 text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                <span>🎯 {language === 'bn' ? 'আমাদের দীর্ঘমেয়াদী লক্ষ্য' : 'Our Long-term Goal'}</span>
              </div>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-bl-full group-hover:bg-amber-500/10 transition duration-300"></div>
              <div className="space-y-6">
                <div className="h-12 w-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center shadow-inner">
                  <Target className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-extrabold text-slate-800">{missionTitle}</h3>
                  <div className="space-y-3">
                    {missionBody.split('\n').filter(line => line.trim() !== '').map((line, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-500 shrink-0"></span>
                        <p className="text-xs sm:text-[13.5px] text-gray-600 leading-relaxed font-normal text-justify">
                          {line.trim().replace(/^([0-9\u09E6-\u09EF]+\.\s*)/, '')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-6 flex items-center gap-2 text-[10px] font-black text-amber-700 uppercase tracking-wider">
                <span>🚀 {language === 'bn' ? 'উদ্যোগ ও বাস্তবায়ন' : 'Action & Implementation'}</span>
              </div>
            </div>

            {/* Food Safety Card */}
            <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-24 w-24 bg-teal-500/5 rounded-bl-full group-hover:bg-teal-500/10 transition duration-300"></div>
              <div className="space-y-6">
                <div className="h-12 w-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center shadow-inner">
                  <Microscope className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-extrabold text-slate-800">{foodSafetyTitle}</h3>
                  <p className="text-xs sm:text-[13.5px] text-gray-600 leading-relaxed font-normal text-justify">
                    {foodSafetyBody}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-6 flex items-center gap-2 text-[10px] font-black text-teal-700 uppercase tracking-wider">
                <span>🧪 {language === 'bn' ? 'শতভাগ ল্যাব ভেরিফাইড' : '100% Lab Verified'}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The True Story Narrative Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="space-y-8">
            
            {/* Header section with book decoration */}
            <div className="text-center space-y-4 border-b border-gray-100 pb-10">
              <div className="h-12 w-12 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <BookOpen className="h-6 w-6" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight max-w-2xl mx-auto">
                {storyTitle}
              </h2>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-mono font-bold">
                <span>📖 {language === 'bn' ? 'এক সত্য কাহিনী' : 'A True Story'}</span>
                <span>•</span>
                <span>{language === 'bn' ? 'সংগ্রাম, কল্পনা ও ভবিষ্যৎ' : 'Struggle, Imagination & Future'}</span>
              </div>
            </div>

            {/* Detailed Story Paragraphs */}
            <div className="prose prose-emerald max-w-none space-y-6 text-gray-650 leading-relaxed text-[14px] sm:text-[15px] font-normal text-justify">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="indent-4 sm:indent-6">
                  {p}
                </p>
              ))}
            </div>

            {/* Sincere Signature Card */}
            <div className="mt-16 bg-gradient-to-br from-emerald-50 to-emerald-100/40 rounded-3xl p-8 border border-emerald-150 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h4 className="text-emerald-950 font-black text-base">
                  {language === 'bn' ? 'আমাদের এই আন্দোলনে যোগ দিন' : 'Join Our Social Movement'}
                </h4>
                <p className="text-xs text-gray-500 max-w-md">
                  {language === 'bn' 
                    ? 'কৃষক বাঁচলে বাঁচবে দেশ, খাঁটি খাবারে সুস্থ থাকবে ভবিষ্যৎ প্রজন্ম। সোনার বাংলা গঠনে আপনার এক পা-ই যথেষ্ট।' 
                    : 'When farmers thrive, the nation thrives. Secure a poison-free, healthy future for our children by buying direct.'}
                </p>
              </div>
              <button
                onClick={onBackToHome}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl transition cursor-pointer shadow-md select-none active:scale-95 whitespace-nowrap"
              >
                {language === 'bn' ? 'অর্গানিক ফসল কেনাকাটা করুন 🛒' : 'Shop Organic Harvest 🛒'}
              </button>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
