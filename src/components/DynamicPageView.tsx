import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { DynamicPage, Product } from '../types';
import { ShoppingBag, Star, Plus, Minus, Trash2, ArrowLeft, Layout, Share2, Layers } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { LazyImage } from './LazyImage';

interface DynamicPageViewProps {
  page: DynamicPage;
  onBackToHome: () => void;
  onSelectProduct: (id: string) => void;
  onToggleCompare: (id: string) => void;
  comparedProductIds: string[];
}

export const DynamicPageView: React.FC<DynamicPageViewProps> = ({
  page,
  onBackToHome,
  onSelectProduct,
  onToggleCompare,
  comparedProductIds
}) => {
  const { products, dynamicPages, saveDynamicPages, language, currentUser } = useApp();
  const [isAdminProductModalOpen, setIsAdminProductModalOpen] = useState(false);

  const pageProducts = products.filter(p => page.productIds.includes(p.id));
  const otherProducts = products.filter(p => !page.productIds.includes(p.id));

  const isAdmin = currentUser?.role === 'Admin';

  const handleAddProductToPage = (productId: string) => {
    const updatedPages = dynamicPages.map(dp => {
      if (dp.slug === page.slug) {
        if (!dp.productIds.includes(productId)) {
          return {
            ...dp,
            productIds: [...dp.productIds, productId]
          };
        }
      }
      return dp;
    });
    saveDynamicPages(updatedPages);
  };

  const handleRemoveProductFromPage = (productId: string) => {
    const updatedPages = dynamicPages.map(dp => {
      if (dp.slug === page.slug) {
        return {
          ...dp,
          productIds: dp.productIds.filter(id => id !== productId)
        };
      }
      return dp;
    });
    saveDynamicPages(updatedPages);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans select-none animate-fadeIn space-y-10">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-905 to-[#0b291d] p-8 sm:p-12 text-white shadow-xl">
        <div className="absolute top-0 right-0 h-56 w-56 bg-gradient-to-br from-amber-400 to-transparent opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-8 -left-8 h-48 w-48 bg-emerald-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-amber-950 font-black text-[9px] sm:text-[10px] px-3 py-1 rounded-full uppercase tracking-wider border border-amber-300 shadow-sm flex items-center gap-1">
              ⭐ {language === 'bn' ? 'কাস্টম কালেকশন' : 'Custom Collection Page'}
            </span>
            <span className="text-emerald-300 font-mono text-[10px] sm:text-xs">
              /dynamic/{page.slug}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4.5xl font-black tracking-tight leading-tight">
            {language === 'bn' ? page.titleBn : page.titleEn}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
            {language === 'bn' ? page.descriptionBn : page.descriptionEn}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={onBackToHome}
              className="px-4.5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-black transition cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              {language === 'bn' ? 'হোম পেইজে ফিরুন' : 'Back to Home'}
            </button>

            {isAdmin && (
              <button
                onClick={() => setIsAdminProductModalOpen(true)}
                className="px-4.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-md flex items-center gap-1.5 active:scale-95 border border-amber-400"
              >
                <Plus className="h-4 w-4" />
                {language === 'bn' ? 'পণ্য সংযুক্ত করুন (+)' : 'Upload/Add Products'}
              </button>
            )}

            <div className="text-[10px] sm:text-xs text-emerald-200 mt-1 sm:mt-0 px-3 py-1.5 bg-emerald-950/40 rounded-xl border border-emerald-800/40 font-mono">
              📦 {language === 'bn' ? `মোট ${pageProducts.length}টি লাইভ পণ্য` : `Contains ${pageProducts.length} Live Items`}
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN REALTIME Uploader Tool Drawer if open */}
      {isAdmin && isAdminProductModalOpen && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-inner space-y-6 animate-slideIn">
          <div className="flex items-center justify-between border-b border-amber-200 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-sm sm:text-base text-amber-900 flex items-center gap-1.5">
                🛠️ অরিজিনাল অ্যাডমিন ম্যানেজার: {language === 'bn' ? page.titleBn : page.titleEn}
              </h3>
              <p className="text-xs text-amber-700 font-semibold">
                আপনার স্টোরে থাকা যেকোনো পণ্য এই পেজে যুক্ত করুন বা বাদ দিন। পরিবর্তন সাথে সাথে লাইভ হবে।
              </p>
            </div>
            <button
              onClick={() => setIsAdminProductModalOpen(false)}
              className="px-3 py-1.5 bg-white hover:bg-amber-100/50 border border-amber-200 rounded-xl text-[11px] font-black text-amber-800 cursor-pointer transition active:scale-95"
            >
              বন্ধ করুন (Close)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Added products list */}
            <div className="bg-white rounded-2xl border border-gray-150 p-4 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1 border-b border-gray-50 pb-2">
                <span>🟢 এই পেইজে যুক্ত আছে ({pageProducts.length}টি)</span>
              </h4>

              {pageProducts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6 font-medium">কোনো পণ্য এখনো যুক্ত করা হয়নি।</p>
              ) : (
                <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-50">
                  {pageProducts.map(p => (
                    <div key={p.id} className="flex items-center justify-between gap-3 pt-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <LazyImage src={p.images[0]} alt={p.title} className="h-9 w-9 rounded-lg object-cover bg-gray-50 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{p.title}</p>
                          <p className="text-[10px] text-gray-400">ID: {p.id} • ৳{p.discountPrice || p.price}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveProductFromPage(p.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition shrink-0"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Other products list to add */}
            <div className="bg-white rounded-2xl border border-gray-150 p-4 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1 border-b border-gray-50 pb-2">
                <span>➕ পোর্টালে থাকা অন্যান্য পণ্য ({otherProducts.length}টি)</span>
              </h4>

              {otherProducts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6 font-medium">সব পণ্য ইতিমধ্যে যুক্ত করা হয়েছে!</p>
              ) : (
                <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-50">
                  {otherProducts.map(p => (
                    <div key={p.id} className="flex items-center justify-between gap-3 pt-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <LazyImage src={p.images[0]} alt={p.title} className="h-9 w-9 rounded-lg object-cover bg-gray-50 shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{p.title}</p>
                          <p className="text-[10px] text-gray-400">ID: {p.id} • ৳{p.discountPrice || p.price}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddProductToPage(p.id)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 rounded-lg font-black text-[10px] cursor-pointer transition shrink-0 flex items-center gap-0.5 active:scale-95"
                      >
                        <Plus className="h-3 w-3" /> যুক্ত করুন
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS DISPLAY GRID */}
      {pageProducts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border border-gray-150 rounded-3xl space-y-4">
          <div className="text-4xl">🧺</div>
          <p className="text-xs sm:text-base font-bold text-slate-700 select-none">
            {language === 'bn' ? 'এই পাতায় কোনো সতেজ পণ্য আপলোড করা হয়নি।' : 'No products uploaded to this page yet.'}
          </p>
          <p className="text-[11px] text-gray-400 font-medium">
            {language === 'bn' ? 'প্রোডাক্ট ক্রিয়েটর দিয়ে যেকোনো পণ্য যুক্ত করতে উপরের "পণ্য সংযুক্ত করুন" বাটনে ক্লিক করুন।' : 'Click the "Upload/Add Products" button to links items directly!'}
          </p>
          {isAdmin && (
            <button
              onClick={() => setIsAdminProductModalOpen(true)}
              className="px-4.5 py-2.5 bg-emerald-600 text-white font-black hover:bg-emerald-700 rounded-xl text-xs transition cursor-pointer inline-block"
            >
              পণ্য সংযুক্ত করুন
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pageProducts.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard
                product={p}
                onOpenQuickView={(prod) => onSelectProduct(prod.id)}
                onEditProduct={() => {}}
                onToggleCompare={onToggleCompare}
                isCompared={comparedProductIds.includes(p.id)}
              />
              {isAdmin && (
                <button
                  onClick={() => handleRemoveProductFromPage(p.id)}
                  className="absolute top-3.5 right-3.5 z-40 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 cursor-pointer transition"
                  title="এই পেজ থেকে পণ্যটি মুছে ফেলুন"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* BOTTOM INFO BANNER */}
      <div className="bg-emerald-50 rounded-2xl border border-emerald-150 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-center sm:text-left">
        <p className="text-xs font-semibold text-emerald-850">
          🌱 {language === 'bn' 
            ? 'এই পেজে থাকা ১০০% অর্গানিক পণ্য ঢাকার যেকোনো জায়গায় ২৪ ঘণ্টার মধ্যে এক্সপ্রেস হোম ডেলিভারি করা হয়।' 
            : 'Get express 24-hour guarantee shipping within Dhaka metropolitan for all organic foods on this page.'}
        </p>
        <button
          onClick={onBackToHome}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition cursor-pointer select-none"
        >
          {language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
        </button>
      </div>

    </div>
  );
};
