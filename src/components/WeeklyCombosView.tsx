import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { WeeklyComboOffer, WeeklyComboProduct, toBanglaDigits, Product } from '../types';
import { ShoppingBag, ChevronRight, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface WeeklyCombosViewProps {
  onBackToHome: () => void;
}

export const WeeklyCombosView: React.FC<WeeklyCombosViewProps> = ({ onBackToHome }) => {
  const { weeklyCombos, language, addToCart } = useApp();
  
  // Track selected pricing indices for each combo product
  // Key format: `${comboId}-${productId}`
  const [selectedPriceIndices, setSelectedPriceIndices] = useState<Record<string, number>>({});

  const handlePriceSelect = (comboId: string, productId: string, index: number) => {
    setSelectedPriceIndices(prev => ({
      ...prev,
      [`${comboId}-${productId}`]: index
    }));
  };

  const handleBuyProduct = (combo: WeeklyComboOffer, product: WeeklyComboProduct) => {
    const key = `${combo.id}-${product.id}`;
    const selectedIdx = selectedPriceIndices[key] !== undefined ? selectedPriceIndices[key] : 1; // default to 2nd price (index 1) usually or index 0
    const selectedPrice = product.prices[selectedIdx];
    const selectedLabel = product.priceLabels[selectedIdx];

    // Create virtual Product structure for cart compatibility
    const virtualProduct: Product = {
      id: product.id,
      title: language === 'bn' ? product.nameBn : product.nameEn,
      description: language === 'bn' ? "স্পেশাল অর্গানিক ফ্যামিলি বাস্কেট" : "Special Organic Family Basket",
      price: product.prices[0], // fallback default price
      images: [product.image],
      farmerId: "f1", // Associate with a default approved partner farmer (e.g. Abdur Rahman)
      farmerName: language === 'bn' ? "কৃষক বাজার কম্বো টিম" : "KrishokBazar Combo Team",
      category: "combo",
      unit: product.weight,
      stock: 100,
      isVerified: true,
      googleDriveFolderUrl: "",
      harvestDate: product.date || "June 2026",
      isReadyToCook: false,
      rating: 5
    };

    // Add to global cart
    addToCart(virtualProduct, 1, selectedPrice, selectedLabel);

    // Open cart drawer with checkout overlay
    window.dispatchEvent(new CustomEvent('open-cart-drawer', { detail: { openCheckout: true } }));
  };

  const getPriceLabelBn = (label: string) => {
    return label
      .replace(/500g|500 গ্রাম/gi, '৫০০ গ্রাম')
      .replace(/1kg|১ কেজি/gi, '১ কেজি')
      .replace(/2kg|২ কেজি/gi, '২ কেজি')
      .replace(/5kg|৫ কেজি/gi, '৫ কেজি')
      .replace(/piece|pc|১ পিস/gi, '১ পিস')
      .replace(/২ পিস/gi, '২ পিস')
      .replace(/৪ পিস/gi, '৪ পিস')
      .replace(/৮ পিস/gi, '৮ পিস')
      .replace(/১ ডজন/gi, '১২ পিস (১ ডজন)')
      .replace(/২ ডজন/gi, '২৪ পিস (২ ডজন)')
      .replace(/৩ ডজন/gi, '৩৬ পিস (৩ ডজন)');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans select-none animate-fadeIn space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-2xl -mr-10"></div>
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-emerald-700/20 rounded-full blur-3xl -ml-10"></div>
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] sm:text-xs px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest inline-block">
            {language === 'bn' ? 'সাপ্তাহিক ধামাকা ডেল' : 'Weekly Mega Combo Offers'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {language === 'bn' 
              ? 'কৃষকের বাজার সাপ্তাহিক ফ্যামিলি কম্বো বাস্কেট' 
              : 'Weekly Fresh Family Combo Baskets'
            }
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
            {language === 'bn'
              ? 'সরাসরি আমাদের মাঠ এবং বিশ্বস্ত খামারি অংশীদারদের থেকে সংগ্রহকৃত তাজা ও নির্ভেজাল পুষ্টি বাস্কেট। প্রতিটি বাস্কেটে পাবেন ১০০% কেমিক্যালমুক্ত খাবারের নিশ্চয়তা এবং সাশ্রয়ী মূল্য।'
              : 'Fresh and organic nutrition baskets harvested directly from our trusted verified farmer partners. Guaranteed 100% pesticide-free premium daily grocery at special bulk rates.'
            }
          </p>
          
          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-black transition cursor-pointer shadow-sm"
            >
              {language === 'bn' ? 'হোম পেজ-এ ফিরুন' : 'Back to Home'}
            </button>
            <span className="text-[10px] sm:text-xs text-emerald-200 font-mono">
              ★ {language === 'bn' ? 'মোট ৪টি স্পেশাল জাদুকরী অফার' : 'Total 4 Dynamic Mega Baskets'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Baskets List */}
      <div className="space-y-16">
        {weeklyCombos.map((combo, comboIdx) => (
          <div key={combo.id} id={`combo-card-${combo.id}`} className="space-y-6">
            {/* Offer Title & Headings */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-emerald-500/10 pb-3 gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-850 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold shadow-md">
                    {toBanglaDigits(comboIdx + 1)}
                  </span>
                  <span>{language === 'bn' ? combo.titleBn : combo.titleEn}</span>
                </h2>
                <p className="text-[10px] text-gray-400 mt-0.5 ml-9 font-medium">
                  {language === 'bn' 
                    ? 'সর্বাধুনিক অর্গানিক ফার্ম থেকে সরাসরি সংগৃহীত তাজা ফল, সবজি ও শস্যের প্রিমিয়াম প্যাক।'
                    : 'A handpicked mix of premium pesticide-free farm-fresh crops from agricultural cooperatives.'
                  }
                </p>
              </div>

              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-lg border border-emerald-200 shrink-0 self-start sm:self-auto uppercase tracking-wide">
                🛒 {language === 'bn' ? '৪টি পণ্যের ইউনিক অফার বাস্কেট' : '4 Products Special'}
              </span>
            </div>

            {/* Products Row Grid (4 cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {combo.products.map((product) => {
                const key = `${combo.id}-${product.id}`;
                const selectedPriceIdx = selectedPriceIndices[key] !== undefined ? selectedPriceIndices[key] : 1; 
                const activePrice = product.prices[selectedPriceIdx];
                const activeLabel = product.priceLabels[selectedPriceIdx];
                const activeLabelBn = getPriceLabelBn(activeLabel);

                return (
                  <div 
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-150 bg-white hover:shadow-xl hover:border-emerald-500 hover:scale-[1.015] active:scale-[0.995] transition-all duration-300"
                  >
                    {/* Badge */}
                    <span className="absolute left-2.5 top-2.5 z-10 rounded-lg bg-emerald-600 px-2.5 py-1 text-[8px] font-black tracking-wider text-white uppercase shadow border border-emerald-500">
                      {language === 'bn' ? 'অর্গানিক ১০০%' : '100% Organic'}
                    </span>

                    {/* Image Box */}
                    <div className="aspect-square w-full overflow-hidden bg-gray-50 border-b border-gray-100">
                      <img 
                        src={product.image || "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500"} 
                        alt={product.nameBn} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500';
                        }}
                      />
                    </div>

                    {/* Content Box */}
                    <div className="flex flex-col flex-1 p-3.5 space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-gray-850 truncate leading-snug">
                          {language === 'bn' ? product.nameBn : product.nameEn}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1 font-mono font-medium">
                          <span>📅 {product.date || "June 12, 2026"}</span>
                          <span>⚖️ {language === 'bn' ? getPriceLabelBn(product.weight) : product.weight}</span>
                        </div>
                      </div>

                      {/* 4 Prices Select Row */}
                      <div className="bg-slate-50 border border-gray-150 rounded-xl p-2 space-y-1.5 shrink-0">
                        <div className="text-[9px] font-black text-emerald-800 uppercase tracking-wider mb-1 text-center border-b border-gray-100 pb-1">
                          {language === 'bn' ? 'পরিমাণ ও মূল্য পছন্দ করুন' : 'Select pack & price'}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {product.prices.map((price, idx) => {
                            const lbl = product.priceLabels[idx];
                            const isSelected = selectedPriceIdx === idx;
                            return (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => handlePriceSelect(combo.id, product.id, idx)}
                                className={`rounded-lg py-1 px-1.5 text-[10px] font-semibold text-center transition-all cursor-pointer border flex flex-col items-center justify-center leading-tight ${
                                  isSelected
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow font-bold'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-800'
                                }`}
                              >
                                <span className="font-mono text-[9px]">{isSelected ? '✓' : ''} ৳{toBanglaDigits(price)}</span>
                                <span className="text-[8px] font-bold block scale-90 mt-0.5 opacity-90 truncate max-w-full">
                                  {language === 'bn' ? getPriceLabelBn(lbl) : lbl}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Buy Action Box */}
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-auto gap-2">
                        <div className="text-left font-sans">
                          <span className="text-[8px] text-gray-400 font-bold block uppercase leading-none">
                            {language === 'bn' ? 'চলতি মূল্য' : 'Active Price'}
                          </span>
                          <span className="text-sm font-black text-gray-900 block mt-0.5 font-mono">
                            ৳{toBanglaDigits(activePrice)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleBuyProduct(combo, product)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black hover:scale-102 transition cursor-pointer flex items-center justify-center gap-1 shadow-sm shrink-0"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>{language === 'bn' ? 'কম্বো কিনুন' : 'Buy Combo'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Info footer */}
      <div className="bg-emerald-50 border border-emerald-150 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-center md:text-left">
        <div className="flex items-center gap-2 text-emerald-850">
          <AlertCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold">
            {language === 'bn'
              ? 'সরাসরি খামার থেকে ঢাকার যেকোনো জায়গায় ২৪ ঘণ্টার মধ্যে প্রিমিয়াম বাস্কেট ডেলিভারি গ্যারান্টি!'
              : 'Express 24-hours direct delivery for all combo baskets to any location within Dhaka central!'
            }
          </p>
        </div>
        
        <button
          onClick={onBackToHome}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow transition cursor-pointer"
        >
          {language === 'bn' ? 'নতুন তাজা পণ্য দেখুন' : 'Explore fresh items'}
        </button>
      </div>
    </div>
  );
};
