/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { cleanImageUrl } from '../utils';
import { Farmer, Product, Review } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Phone, 
  Store, 
  Apple, 
  Leaf, 
  Award, 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  Users,
  Grid,
  Camera,
  Video
} from 'lucide-react';
import { FEMALE_AVATAR, MALE_AVATAR } from '../assets';
import { ProductCard } from './ProductCard';

function parseYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

interface FarmerStoreProfilePageProps {
  farmerId: string;
  onBack: () => void;
  onSelectProduct: (productId: string) => void;
}

export const FarmerStoreProfilePage: React.FC<FarmerStoreProfilePageProps> = ({ 
  farmerId, 
  onBack, 
  onSelectProduct 
}) => {
  const { farmers, products, reviews, updateFarmer, currentUser } = useApp();
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  
  // Inline edit state
  const [isEditingFarmer, setIsEditingFarmer] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editStory, setEditStory] = useState('');
  const [editRating, setEditRating] = useState(4.5);
  const [editFarmType, setEditFarmType] = useState('');
  const [editSalesCount, setEditSalesCount] = useState(10);

  const farmer = farmers.find(f => f.id === farmerId);

  // Sync state with farmer values
  useEffect(() => {
    if (farmer) {
      setEditName(farmer.name);
      setEditDistrict(farmer.district || 'ঢাকা');
      setEditPhone(farmer.phone);
      setEditStory(farmer.story || farmer.bio || '');
      setEditRating(farmer.rating || 4.5);
      setEditFarmType(farmer.farmType || 'জৈব কৃষি উদ্যোক্তা');
      setEditSalesCount(farmer.salesCount || 10);
    }
  }, [farmer, isEditingFarmer]);

  // Auto Scroll to Top on entry
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [farmerId]);

  if (!farmer) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h3 className="text-xl font-bold text-gray-700">দুঃখিত, কৃষকের স্টোর পাওয়া যায়নি!</h3>
        <button onClick={onBack} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700">
          <ArrowLeft className="h-4 w-4" /> তালিকায় ফিরে যান
        </button>
      </div>
    );
  }

  // Filter crops produced by this specific farmer
  const farmerProducts = products.filter(p => p.farmerId === farmerId);
  const farmerProductsFiltered = farmerProducts.filter(
    p => selectedSubCategory === 'all' || p.category === selectedSubCategory
  );

  // Dynamic grown categories list based on actual items
  const grownCategories = Array.from(new Set(farmerProducts.map(p => p.category)));

  // Reviews associated with this farmer's products
  const farmerCropsTitles = farmerProducts.map(p => p.title);
  const farmerReviews = reviews.filter(
    r => farmerCropsTitles.some(title => r.productName === title || title.includes(r.productName))
  );

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* UPPER NAVIGATION BAR */}
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <button 
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-100 px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 active:scale-98 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-emerald-600" />
            কৃষকদের তালিকায় ফিরে যান
          </button>

          {/* ADMIN TOGGLE BUTTON */}
          {(currentUser?.role === 'Admin' || (typeof window !== 'undefined' && window.location.hash === '#admin')) && (
            <button
              type="button"
              onClick={() => setIsEditingFarmer(!isEditingFarmer)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-4.5 py-2 text-xs transition-all shadow-md active:scale-98 cursor-pointer"
            >
              🛡️ {isEditingFarmer ? 'সংশোধন প্যানেল বন্ধ করুন' : 'প্রোফাইল সংশোধন করুন (Inline Edit)'}
            </button>
          )}
        </div>

        {/* INLINE ADMIN EDIT FORM PANEL */}
        {isEditingFarmer && (
          <div className="mb-8 p-6 rounded-3xl border border-amber-200 bg-amber-500/5 backdrop-blur-sm shadow-md animate-fade-in">
            <h3 className="text-sm font-black text-amber-900 uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-amber-200 pb-2">
              <span>🛡️ খামারি প্রোফাইল লাইভ সংশোধন (Immediate Firebase Update)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[11px] font-extrabold text-amber-950/80 mb-1">খামারির নাম (Farmer Name)</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-xs text-gray-850 font-bold focus:outline-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-amber-950/80 mb-1">অঞ্চল / জেলা (District)</label>
                <input
                  type="text"
                  value={editDistrict}
                  onChange={(e) => setEditDistrict(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-xs text-gray-850 font-bold focus:outline-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-amber-950/80 mb-1">ফোন নম্বর (Phone Link)</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-xs text-gray-850 font-bold focus:outline-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-amber-950/80 mb-1">খামারের ধরণ (Farm Tag)</label>
                <input
                  type="text"
                  value={editFarmType}
                  onChange={(e) => setEditFarmType(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-xs text-gray-850 font-bold focus:outline-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-amber-950/80 mb-1">রেটিং (Rating: 1 - 5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={editRating}
                  onChange={(e) => setEditRating(Number(e.target.value))}
                  className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-xs text-gray-850 font-bold focus:outline-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-amber-950/80 mb-1">ফসল সরবরাহ সংখ্যা (Sales Count)</label>
                <input
                  type="number"
                  value={editSalesCount}
                  onChange={(e) => setEditSalesCount(Number(e.target.value))}
                  className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-xs text-gray-850 font-bold focus:outline-amber-400 font-mono"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-[11px] font-extrabold text-amber-950/80 mb-1">খামারির উৎপত্তির গল্প (Story/Bio)</label>
                <textarea
                  value={editStory}
                  onChange={(e) => setEditStory(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-xs text-gray-850 font-bold focus:outline-amber-400 leading-relaxed"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditingFarmer(false)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="button"
                onClick={() => {
                  updateFarmer(farmer.id, {
                    name: editName,
                    district: editDistrict,
                    phone: editPhone,
                    story: editStory,
                    bio: editStory,
                    rating: Number(editRating),
                    farmType: editFarmType,
                    salesCount: Number(editSalesCount),
                  });
                  setIsEditingFarmer(false);
                }}
                className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-750 hover:from-amber-750 hover:to-amber-800 px-5.5 py-2 text-xs font-black text-white hover:scale-102 active:scale-98 transition-all shadow-md cursor-pointer"
              >
                💾 পরিবর্তনগুলি সংরক্ষণ করুন (Save Updates)
              </button>
            </div>
          </div>
        )}

        {/* HERO BANNER & AVATAR BLOCK */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm mb-8">
          
          {/* Cover Graphic Decoration */}
          <div className="h-32 sm:h-48 w-full bg-gradient-to-r from-emerald-800 via-emerald-600 to-green-500 relative flex items-end p-6">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-300 via-emerald-900 to-black"></div>
            
            {/* Corner Badge */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider hidden sm:block">
              🌾 Direct Partner Store
            </div>
          </div>

          <div className="p-6 sm:p-8 relative pt-0">
            {/* Avatar positioning overlay */}
            <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-12 sm:-mt-16 mb-6">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white bg-white shadow overflow-hidden shrink-0 mx-auto md:mx-0 relative group">
                <img 
                  src={cleanImageUrl((farmer.avatar && (farmer.avatar.startsWith('http') || farmer.avatar.startsWith('/'))) ? farmer.avatar : (farmer.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR))} 
                  alt={farmer.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {farmer.farmLogo && (
                  <img 
                    src={farmer.farmLogo}
                    alt="Farm Logo"
                    className="absolute bottom-0 right-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-white object-cover shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              <div className="text-center md:text-left flex-1">
                <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center md:justify-start">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-800 leading-none font-sans">
                    {farmer.name}
                  </h1>
                  
                  {farmer.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-550/10 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 shadow-sm shrink-0">
                      <ShieldCheck className="h-3.5 w-3.5 fill-blue-600 text-white shrink-0" />
                      ভেরিফাইড (Verified)
                    </span>
                  )}

                  {/* Gender badge support */}
                  <span className={`inline-flex items-center gap-0.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border shrink-0 ${
                    farmer.gender === 'female'
                      ? 'bg-pink-50 border-pink-200 text-pink-700'
                      : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  }`}>
                    {farmer.gender === 'female' ? '👩‍🌾 নারী উদ্যোক্তা (Woman Entrepreneur)' : '👨‍🌾 ভেরিফাইড কৃষক'}
                  </span>
                </div>

                {farmer.farmType && (
                  <p className="text-xs font-extrabold text-emerald-800 mt-1 font-sans">
                    🌾 {farmer.farmType}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-1.5 text-xs text-gray-500 font-medium font-sans">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    {farmer.district}, বাংলাদেশ
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500 shrink-0" /> {farmer.rating} রেটিং
                  </div>
                  <span>•</span>
                  <span>{farmerProducts.length}টি ফসল</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">{farmer.salesCount}টি ফসল সরবরাহ</span>
                  {farmer.landSize && (
                    <>
                      <span>•</span>
                      <span className="text-indigo-750">জমির আকার: <strong className="font-bold">{farmer.landSize}</strong></span>
                    </>
                  )}
                  {farmer.salesAmount && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700">মোট বিক্রয়: <strong className="font-bold">৳{farmer.salesAmount}</strong></span>
                    </>
                  )}
                </div>
              </div>

              {/* Contact / Connection box */}
              <div className="shrink-0 flex justify-center mt-2.5 md:mt-0">
                <a 
                  href={`tel:${farmer.phone}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 px-5 py-3 text-xs font-bold text-white shadow-md active:scale-98 transition-all"
                >
                  <Phone className="h-4 w-4" />
                  সরাসরি যোগাযোগ: {farmer.phone}
                </a>
              </div>
            </div>

            {/* Farm Story Narrative */}
            <div className="border-t border-gray-150 pt-6">
              <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest flex items-center gap-1">
                <Award className="h-4.5 w-4.5 text-emerald-600" /> খামারির উৎপত্তির গল্প ও নীতি
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-gray-650 leading-relaxed font-sans max-w-4xl italic bg-emerald-50/20 p-4 rounded-2xl border border-emerald-100/50">
                "{farmer.story || farmer.bio || "আমি একজন গর্বিত স্থানীয় কৃষক। কৃষক বাজার প্লাটফর্মের মাধ্যমে আমি আমার জমিতে অর্গানিক উপায়ে উৎপাদিত সম্পূর্ণ সুস্থ উপাদানে ভরা তাজা ফসল আপনাদের কাছে সরাসরি পৌঁছে দিচ্ছি।"}"
              </p>
            </div>

            {/* Certificates or Credentials Highlights */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-150 pt-6">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-gray-800">শতভাগ তাজা সংগ্রহ</h4>
                  <p className="text-[9px] text-gray-400 font-sans mt-0.5 leading-none">১২ ঘন্টার ফাস্ট ও নিরাপদ ডেলিভারি</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <Calendar className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-gray-800">নিবন্ধিত অংশীদারিত্ব</h4>
                  <p className="text-[9px] text-gray-400 font-sans mt-0.5 leading-none">দীর্ঘ ১ বছরের ওপর বিশ্বস্ত সম্পর্ক</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <Users className="h-5 w-5 text-indigo-600 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-gray-800">প্রান্তিক কৃষক ক্ষমতায়ন</h4>
                  <p className="text-[9px] text-gray-400 font-sans mt-0.5 leading-none">১০০% শেয়ার সরাসরি কৃষকের হাতে</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PRIMARY BENTO LAYOUT GRID */}
        <div className="lg:flex lg:gap-8 items-start">
          
          {/* CROP PRODUCTS GRID - 70% WIDTH */}
          <div className="lg:w-3/4">
            
            {/* Products Filter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm gap-3">
              <h2 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                <Grid className="h-4.5 w-4.5 text-emerald-600" />
                কৃষকের উৎপাদিত সতেজ পণ্যসমূহ ({farmerProductsFiltered.length})
              </h2>

              {/* Micro grown category filter */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSubCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                    selectedSubCategory === 'all' 
                      ? 'bg-emerald-600 text-white shadow' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  সব ফসল
                </button>
                {grownCategories.map((catId) => (
                  <button
                    key={catId}
                    onClick={() => setSelectedSubCategory(catId)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer uppercase ${
                      selectedSubCategory === catId 
                        ? 'bg-emerald-600 text-white shadow' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {catId}
                  </button>
                ))}
              </div>
            </div>

            {/* Actual catalog array */}
            {farmerProductsFiltered.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl shadow-sm text-gray-400">
                কোনো পণ্য খুঁজে পাওয়া যায়নি।
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {farmerProductsFiltered.map((p) => (
                  <ProductCard 
                    key={p.id}
                    product={p}
                    onOpenQuickView={() => onSelectProduct(p.id)}
                  />
                ))}
              </div>
            )}

          </div>

          {/* HISTORIC REVIEWS / RATINGS SUMMARY CARD - 30% WIDTH */}
          <div className="lg:w-1/4 mt-8 lg:mt-0 space-y-6">
            
            {/* Store Rating summary block */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm text-center">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-wide">স্টোরের রেটিং ও রিভিউ</h3>
              
              <div className="mt-4 flex flex-col items-center">
                <span className="text-4xl sm:text-5xl font-black text-emerald-800 font-mono">
                  {farmer.rating}
                </span>
                
                <div className="mt-2 flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4.5 w-4.5 ${
                        i < Math.floor(farmer.rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-150'
                      }`} 
                    />
                  ))}
                </div>

                <p className="text-[10px] text-gray-400 font-sans mt-2 font-medium">
                  (১০০% আসল সরাসরি ক্রেতাদের মতামত)
                </p>
              </div>
            </div>

            {/* Farmer Farm Gallery */}
            {farmer.gallery && farmer.gallery.length > 0 && (
              <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-wide flex items-center gap-1.5 mb-3">
                  <Camera className="h-4.5 w-4.5 text-emerald-600" />
                  খামারের দৃশ্য ও গ্যালারি
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {farmer.gallery.map((imgUrl, gIdx) => (
                    <div key={gIdx} className="h-16 sm:h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 relative group cursor-pointer">
                      <img 
                        src={imgUrl} 
                        alt={`Gallery ${gIdx}`} 
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

             {/* Multiple Farmer YouTube Videos */}
            {((farmer.youtubeVideos && farmer.youtubeVideos.length > 0) || farmer.videoPlaceholder) && (
              <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-wide flex items-center gap-1.5 border-b border-gray-50 pb-2">
                  <Video className="h-4.5 w-4.5 text-emerald-600" />
                  খামারের বাস্তব চিত্র ও ভিডিও ({ (farmer.youtubeVideos?.length || 0) + (farmer.videoPlaceholder ? 1 : 0) })
                </h3>

                {/* Legacy Video Placeholder */}
                {farmer.videoPlaceholder && (
                  <div className="space-y-1">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-150 shadow-sm relative group">
                      <iframe 
                        className="w-full h-full"
                        src={farmer.videoPlaceholder} 
                        title="Farm Tour Video" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium block text-center mt-1">
                      🎬 সোনালীতলা খামারের সুন্দর পরিচিতি ভিডিও
                    </span>
                  </div>
                )}

                {/* Real interactive custom uploaded videos */}
                {farmer.youtubeVideos && farmer.youtubeVideos.map((url, vIdx) => {
                  const embedUrl = parseYoutubeEmbedUrl(url);
                  return (
                    <div key={vIdx} className="space-y-1">
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-105 border border-gray-150 shadow-sm relative group bg-black">
                        {embedUrl ? (
                          <iframe 
                            className="w-full h-full"
                            src={embedUrl} 
                            title={`Farmer Real Video ${vIdx + 1}`} 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white p-4 text-center">
                            <span className="text-[10px] font-bold break-all mb-2">{url}</span>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 px-3 py-1.5 rounded-lg text-[9px] font-bold">ভিডিও প্লে করুন ↗</a>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-gray-400 font-bold block text-center mt-1">
                        🎬 খামারির বাস্তব ভিডিও লিংক #{vIdx + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Live review comments list snippet */}
            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-wide flex items-center gap-1.5 mb-4">
                <MessageSquare className="h-4.5 w-4.5 text-emerald-600" />
                ক্রেতাদের প্রতিক্রিয়া ({farmerReviews.length})
              </h3>

              {farmerReviews.length === 0 ? (
                <p className="text-[11px] text-gray-400 text-center py-6">
                  এই খামারি বা উদ্যোক্তার পণ্যের ওপরে এখনো কোনো রিভিউ জমা পড়েনি।
                </p>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {farmerReviews.map((rev) => (
                    <div key={rev.id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-450 font-sans">
                        <span className="text-gray-700 font-black">{rev.customerName}</span>
                        <span>•</span>
                        <span>{rev.location}</span>
                      </div>
                      <div className="flex text-amber-500 mt-1">
                        {[...Array(rev.rating)].map((_, s) => (
                          <Star key={s} className="h-2.5 w-2.5 fill-amber-500 text-amber-500 shrink-0" />
                        ))}
                      </div>
                      <p className="mt-1 text-[11px] text-gray-550 leading-relaxed font-sans italic">
                        "{rev.comment}"
                      </p>
                      <span className="text-[9px] text-emerald-700 font-bold block mt-1">
                        আইটেম: {rev.productName}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
