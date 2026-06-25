/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { ChevronLeft, ChevronRight, ShoppingBag, Users, PhoneCall, Video, Facebook, Youtube } from 'lucide-react';

interface HeroCarouselProps {
  onShopNow: () => void;
  onViewFarmers: () => void;
  onCallHelp: () => void;
  setView?: (view: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onShopNow, onViewFarmers, onCallHelp, setView }) => {
  const { banners, dynamicPages, siteSettings } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrev = () => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    if (banners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-[200px] xs:h-[220px] sm:h-[340px] md:h-[450px] overflow-hidden bg-gray-900 group">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
            >
              {/* Overlay Gradient to protect readability */}
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColorTint || 'from-black/80'} via-black/45 to-transparent z-10`} />
              
              <img
                src={banner.image}
                alt={banner.titleBn}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />

              {/* EMBEDDED SOCIAL MEDIA CHANNELS IN UPPER-RIGHT OF HERO CAROUSEL */}
              <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 sm:gap-2">
                <a 
                  href="https://www.facebook.com/people/%E0%A6%95%E0%A7%83%E0%A6%B7%E0%A6%95-%E0%A6%AC%E0%A6%BE%E0%A6%9C%E0%A6%BE%E0%A6%B0-Krishok-Bazar/61578459151972/"
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1 sm:p-2 rounded-full bg-white/20 hover:bg-[#1877F2] text-white backdrop-blur-md transition-all hover:scale-110 shadow-md flex items-center justify-center cursor-pointer"
                  title="Facebook"
                >
                  <Facebook className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                </a>
                <a 
                  href="https://www.youtube.com/@KrishokBazarBD"
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1 sm:p-2 rounded-full bg-white/20 hover:bg-[#FF0000] text-white backdrop-blur-md transition-all hover:scale-110 shadow-md flex items-center justify-center cursor-pointer"
                  title="YouTube"
                >
                  <Youtube className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                </a>
                <a 
                  href="https://wa.me/8801931355398"
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1 sm:p-2 rounded-full bg-white/20 hover:bg-[#25D366] text-white backdrop-blur-md transition-all hover:scale-110 shadow-md flex items-center justify-center cursor-pointer text-xs font-bold leading-none"
                  title="WhatsApp"
                >
                  <span className="text-[10px] sm:text-sm font-bold">💬</span>
                </a>
              </div>
              
              {/* Dynamic Content Overlay - Centered on Mobile, Left-bound on Desktop */}
              <div className="absolute inset-x-0 bottom-0 top-0 z-20 flex flex-col justify-center px-4 sm:px-12 md:px-24 text-white max-w-4xl">
                <span className="inline-flex self-start items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-emerald-50 mb-1 sm:mb-2 md:mb-3 border border-emerald-500 animate-pulse">
                  🌱 {banner.badgeBn || 'শতভাগ গ্যারান্টিড সতেজ'}
                </span>
                
                <h1 className="text-base xs:text-lg sm:text-3xl md:text-4xl font-extrabold tracking-tight font-sans leading-tight">
                  {banner.titleBn}
                </h1>
                
                <h2 className="mt-0.5 text-[9px] xs:text-[11px] sm:text-base md:text-lg text-emerald-300 font-semibold font-mono tracking-wide">
                  {banner.titleEn}
                </h2>

                <p className="mt-1 text-[10px] sm:text-xs md:text-sm text-gray-200 leading-relaxed max-w-2xl hidden sm:block">
                  {banner.subtitleBn}
                </p>

                {/* CALL TO ACTION BUTTONS */}
                <div className="mt-2.5 sm:mt-4 md:mt-6 flex flex-wrap gap-1.5 sm:gap-3">
                  <button
                    onClick={() => {
                      if (banner.btn1Link === 'combo') {
                        document.getElementById('combo-basket')?.scrollIntoView({ behavior: 'smooth' });
                      } else if (banner.btn1Link && banner.btn1Link.startsWith('http')) {
                        window.open(banner.btn1Link, '_blank');
                      } else if (banner.btn1Link && setView) {
                        const link = banner.btn1Link;
                        if (link.startsWith('dynamic-')) {
                          setView(link);
                        } else if (dynamicPages && dynamicPages.some(dp => dp.slug === link)) {
                          setView(`dynamic-${link}`);
                        } else {
                          setView(link);
                        }
                      } else {
                        onShopNow();
                      }
                    }}
                    className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 px-2.5 py-1.5 xs:px-3.5 xs:py-2 text-[9px] xs:text-[10px] sm:text-xs font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sans"
                  >
                    <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" />
                    {banner.btn1TextBn || 'পণ্য কিনুন'}
                  </button>
                  <button
                    onClick={() => {
                      if (banner.btn2Link && banner.btn2Link.startsWith('http')) {
                        window.open(banner.btn2Link, '_blank');
                      } else if (banner.btn2Link === 'shop') {
                        onShopNow();
                      } else if (banner.btn2Link && setView) {
                        const link = banner.btn2Link;
                        if (link.startsWith('dynamic-')) {
                          setView(link);
                        } else if (dynamicPages && dynamicPages.some(dp => dp.slug === link)) {
                          setView(`dynamic-${link}`);
                        } else {
                          setView(link);
                        }
                      } else {
                        document.getElementById('combo-basket')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="flex items-center gap-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 px-2.5 py-1.5 xs:px-3.5 xs:py-2 text-[9px] xs:text-[10px] sm:text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    {banner.btn2TextBn || 'কম্বো বাস্কেট'}
                  </button>
                  <a
                    href={banner.btn3Link || "https://wa.me/8801931355398"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-xl bg-orange-600 hover:bg-orange-700 px-2.5 py-1.5 xs:px-3.5 xs:py-2 text-[9px] xs:text-[10px] sm:text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center text-white font-sans"
                    title="WhatsApp order"
                  >
                    <Video className="h-3 w-3 sm:h-4 sm:w-4 text-white animate-pulse" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm text-white border border-white/10 hover:bg-emerald-600 hover:border-emerald-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm text-white border border-white/10 hover:bg-emerald-600 hover:border-emerald-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-5 bg-emerald-500' : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
