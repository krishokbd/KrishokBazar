/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useApp } from '../AppContext';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ArrowLeft, Gift, ShoppingBag, Percent, Sparkles, Filter } from 'lucide-react';

interface WeeklyDiscountViewProps {
  onBackToHome: () => void;
  onOpenQuickView: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  selectedCompareIds: string[];
  onToggleCompare: (id: string) => void;
}

export const WeeklyDiscountView: React.FC<WeeklyDiscountViewProps> = ({
  onBackToHome,
  onOpenQuickView,
  onEditProduct,
  selectedCompareIds,
  onToggleCompare
}) => {
  const { products, language } = useApp();

  // Filter active shop products that have a real discount price
  const discountProducts = useMemo(() => {
    return products.filter(p => !p.id.startsWith('cb') && p.isActive !== false && p.discountPrice && p.discountPrice < p.price);
  }, [products]);

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* PROMO HERO ACCENT */}
        <div className="bg-gradient-to-r from-red-600 via-rose-550 to-orange-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden border border-red-500">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/5 h-[300px] w-[300px] rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 relative z-10 text-center md:text-left">
            <span className="bg-white/15 text-white/95 border border-white/20 px-3.5 py-1 rounded-full text-[10px] uppercase font-black tracking-widest inline-flex items-center gap-1 select-none">
              <Sparkles className="h-3 w-3 text-yellow-300 animate-pulse" />
              সরাসরি কৃষকের বিশেষ মূল্য ছাড় অফার
            </span>
            <h1 className="text-2xl sm:text-4xl font-black font-sans leading-tight">
              সাপ্তাহিক ধামাকা অফার ও ফ্ল্যাট ডিসকাউন্ট!
            </h1>
            <p className="text-xs sm:text-sm text-red-50 max-w-xl font-medium leading-relaxed leading-normal">
              দেশের প্রান্তিক কৃষকদের সরাসরি উৎপাদিত তাজা ফসল, ফলমূল ও কম্বো রেশনের মূল্যে ছাড়! কোনো মধ্যস্বত্বভোগী নেই, তাই সরাসরি আপনার হাতের নাগালে শতভাগ অর্গানিক খাদ্যের মেলা।
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-5 rounded-2xl border border-white/15 text-center shrink-0 min-w-[200px] relative z-10 shadow-inner">
            <div className="bg-white rounded-full p-2.5 text-red-600 shadow-md">
              <Percent className="h-6 w-6 stroke-[3]" />
            </div>
            <strong className="text-xl font-black block mt-1 tracking-tight">১০% থেকে ৫০% পর্যন্ত ছাড়</strong>
            <span className="text-[10px] text-red-100 font-extrabold uppercase">অফার পরিধি: সীমিত সময়ের জন্য</span>
          </div>
        </div>

        {/* HEADER CONTROLS */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-gray-500 hover:text-emerald-700 transition cursor-pointer shadow-3xs"
              title="হোমে ফিরে যান"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-850 font-sans leading-none">ছাড়কৃত ফসলের তালিকা ({discountProducts.length}টি অফার)</h2>
              <span className="text-[10px] text-gray-400 font-bold tracking-wide block mt-1 uppercase font-mono">Weekly Flash Organic Discount Center</span>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black cursor-pointer shadow-sm hover:shadow active:scale-98 transition flex items-center gap-1.5"
          >
            প্রচ্ছদে ফিরুন (Home)
          </button>
        </div>

        {/* PRODUCTS GRID */}
        {discountProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {discountProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onOpenQuickView={onOpenQuickView}
                onEditProduct={onEditProduct}
                onToggleCompare={onToggleCompare}
                isCompared={selectedCompareIds.includes(p.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-3xl text-center border border-gray-100 shadow-xs space-y-3">
            <div className="h-14 w-14 bg-amber-50 text-amber-500 flex items-center justify-center rounded-full mx-auto">
              <Gift className="h-7 w-7" />
            </div>
            <strong className="text-sm font-black text-gray-850 block">এই মুহূর্তে কোনো সরাসরি মূল্য ছাড় অফার চালু নেই!</strong>
            <p className="text-gray-400 text-xs max-w-sm mx-auto leading-normal">
              আমাদের খামারিরা সাধারণত নতুন ফসল বাজারে তোলার সাথে সাথেই ছাড় অফার প্রদান করে থাকেন। কাইন্ডলি কিছুক্ষণ পর চেক করুন অথবা কম্বো বাস্কেটগুলো ভিজিট করুন।
            </p>
            <button
              onClick={onBackToHome}
              className="px-5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-xl text-xs font-black hover:bg-emerald-100 transition cursor-pointer"
            >
              হোমপেজে ফিরে যান
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
