/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { ChevronLeft, ChevronRight, ShoppingBag, Users, PhoneCall, Video } from 'lucide-react';

interface HeroCarouselProps {
  onShopNow: () => void;
  onViewFarmers: () => void;
  onCallHelp: () => void;
  setView?: (view: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onShopNow, onViewFarmers, onCallHelp, setView }) => {
  const { banners, dynamicPages } = useApp();
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
    <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] overflow-hidden bg-gray-900 group">
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
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColorTint || 'from-black/80'} via-black/40 to-transparent z-10`} />
              
              <img
                src={banner.image}
                alt={banner.titleBn}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />

              {/* Dynamic Content Overlay - Centered on Mobile, Left-bound on Desktop */}
              <div className="absolute inset-x-0 bottom-0 top-0 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-24 text-white max-w-4xl">
                <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-emerald-50 mb-3 border border-emerald-500 animate-pulse">
                  🌱 {banner.badgeBn || 'শতভাগ গ্যারান্টিড সতেজ'}
                </span>
                
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans leading-tight">
                  {banner.titleBn}
                </h1>
                
                <h2 className="mt-1 text-sm sm:text-lg md:text-xl text-emerald-300 font-semibold font-mono tracking-wide">
                  {banner.titleEn}
                </h2>

                <p className="mt-3 text-xs sm:text-sm text-gray-200 leading-relaxed max-w-2xl hidden sm:block">
                  {banner.subtitleBn}
                </p>

                {/* CALL TO ACTION BUTTONS */}
                <div className="mt-6 flex flex-wrap gap-2 sm:gap-4">
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
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 px-5 py-3 text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sans"
                  >
                    <ShoppingBag className="h-4 w-4" />
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
                    className="flex items-center gap-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 px-4 py-3 text-xs sm:text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Users className="h-4 w-4" />
                    {banner.btn2TextBn || 'সাপ্তাহিক বাস্কেট'}
                  </button>
                  <a
                    href={banner.btn3Link || "https://wa.me/8801931355398"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 px-4 py-3 text-xs sm:text-sm font-bold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center text-white font-sans"
                    title="Place order via video call"
                  >
                    <Video className="h-4 w-4 text-white animate-pulse" />
                    Customer order
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
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm text-white border border-white/10 hover:bg-emerald-600 hover:border-emerald-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm text-white border border-white/10 hover:bg-emerald-600 hover:border-emerald-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8 bg-emerald-500' : 'w-2.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
