/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp, convertGoogleDriveLink } from '../AppContext';
import { Product, getFormattedUnit } from '../types';
import { X, ShoppingCart, Trash2, ShieldCheck, Sparkles, Star, Store } from 'lucide-react';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedIds: string[];
  onRemoveId: (id: string) => void;
  onClearAll: () => void;
  onSelectProduct: (productId: string) => void;
}

export const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  isOpen,
  onClose,
  comparedIds,
  onRemoveId,
  onClearAll,
  onSelectProduct,
}) => {
  const { products, addToCart, language } = useApp();

  if (!isOpen) return null;

  const selectedProducts = products.filter((p) => comparedIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Comparison Box Panel */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] z-10 border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150 select-none">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-600 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">⚖️</span>
            <div>
              <h4 className="text-base font-black font-sans leading-none">কৃষক বাজার পণ্য তুলনা হাব</h4>
              <span className="text-[10px] text-amber-50 font-bold block mt-1">Side-by-Side Marketplace Comparison Matrix</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedProducts.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[10px] bg-white/18 hover:bg-white/28 text-white font-extrabold px-3 py-1.5 rounded-xl border border-white/20 transition cursor-pointer"
              >
                সব মুছুন (Clear All)
              </button>
            )}
            <button 
              onClick={onClose}
              className="rounded-full bg-black/10 hover:bg-black/20 p-2 text-white cursor-pointer transition flex items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {selectedProducts.length === 0 ? (
            <div className="text-center py-16 px-4 max-w-sm mx-auto space-y-4">
              <div className="h-16 w-16 bg-amber-50 text-amber-600 border border-amber-200 rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm">
                ⚖️
              </div>
              <div>
                <h5 className="text-sm font-black text-gray-800">কোনো পণ্য নির্বাচন করা হয়নি</h5>
                <p className="text-xs text-gray-400 font-bold mt-1.5 leading-normal">
                  বাজার থেকে যেকোনো ২ বা ততোধিক ফসলের কোণায় থাকা ⚖️ বাটনটি চেপে তুলনা করুন।
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 py-2.5 text-xs font-black shadow transition-all active:scale-[0.98] cursor-pointer"
              >
                পণ্য নির্বাচন করতে বাজারে যান
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-stone-500 text-[10px] sm:text-xs font-bold font-sans tracking-wide mb-1 flex items-center gap-1 bg-amber-50 border border-amber-100 p-2.5 rounded-xl">
                <span>💡</span>
                <span>সুপার ট্র্যাকিং টিপস: আপনি সারণিটি ডানে-বামে স্ক্রোল করে খুব সহজে দাম ও খামারিদের তুলনা করতে পারবেন। ({selectedProducts.length}টি পণ্য নির্বাচিত)</span>
              </div>

              {/* Scrollable table box */}
              <div className="overflow-x-auto border border-gray-200 rounded-2xl bg-white shadow-xs max-w-full">
                <table className="w-full border-collapse text-left text-xs min-w-[700px] table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[160px]">বৈশিষ্ট্যসমূহ (Features)</th>
                      {selectedProducts.map((p) => (
                        <th key={p.id} className="p-4 group relative border-l border-gray-150 align-top">
                          <button
                            onClick={() => onRemoveId(p.id)}
                            className="absolute top-2 right-2 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-transform hover:scale-105 cursor-pointer border border-red-150"
                            title="তুলনা তালিকা থেকে বাদ দিন"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          
                          <div className="space-y-2 mt-4 cursor-pointer" onClick={() => { onClose(); onSelectProduct(p.id); }}>
                            <div className="aspect-square w-20 h-20 rounded-xl overflow-hidden border border-gray-150-soft mx-auto bg-gray-50 shadow-3xs">
                              <img
                                src={convertGoogleDriveLink(p.images[0])}
                                alt={p.title}
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="text-center font-sans">
                              <strong className="font-sans font-black text-gray-800 hover:text-emerald-700 transition line-clamp-1 block leading-tight">{p.title}</strong>
                              <span className="text-[10px] text-gray-400 font-extrabold mt-0.5 block">{p.categoryBn || p.category}</span>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-100">
                    {/* FARMER NAME & RATINGS */}
                    <tr>
                      <td className="p-4 bg-gray-50/75 font-sans font-black text-gray-700">👨‍🌾 খামারি (Farmer Details)</td>
                      {selectedProducts.map((p) => (
                        <td key={p.id} className="p-4 border-l border-gray-150 align-middle">
                          <div className="space-y-1">
                            <strong className="text-gray-800 font-extrabold text-xs flex items-center gap-1">
                              <Store className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              {p.farmerName}
                            </strong>
                            <p className="text-[10px] text-gray-400 font-bold">📍 জেলা: {p.farmerDistrict || 'মেহেরপুর'}</p>
                            <div className="flex items-center gap-1 pt-0.5">
                              <span className="text-[10px] text-amber-500 font-mono font-extrabold">★ {p.rating || '4.8'}</span>
                              <span className="text-[10px] text-gray-300 font-medium">({p.reviewsCount || '15'} রিভিউ)</span>
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* PRICE COMPARISON */}
                    <tr>
                      <td className="p-4 bg-gray-50/75 font-sans font-black text-gray-700">💰 মূল্য (Price Point)</td>
                      {selectedProducts.map((p) => {
                        const original = p.price;
                        const current = p.discountPrice || p.price;
                        const savings = original - current;
                        
                        return (
                          <td key={p.id} className="p-4 border-l border-gray-150 align-middle font-sans">
                            <div className="space-y-0.5">
                              {savings > 0 && (
                                <span className="text-[10px] text-gray-400 line-through font-mono">৳{original}</span>
                              )}
                              <div className="text-sm font-black text-emerald-800">
                                ৳{current} 
                                <span className="text-[10px] text-gray-400 font-medium font-sans"> /{p.unit || 'কেজি'}</span>
                              </div>
                              {savings > 0 && (
                                <span className="inline-block bg-red-50 text-red-650 border border-red-100 rounded px-1.5 py-0.5 text-[9px] font-black">
                                  ৳{savings} অফার সেভ!
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* UNIT VALUE METRIC */}
                    <tr>
                      <td className="p-4 bg-gray-50/75 font-sans font-black text-gray-700">⚖️ ফসল ওজন ও প্যাক</td>
                      {selectedProducts.map((p) => (
                        <td key={p.id} className="p-4 border-l border-gray-150 align-middle">
                          <span className="text-[11px] font-black bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg">
                            {p.unit || 'কেজি / কেজি প্যাক'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* CONVENIENCE LEVEL (READY TO COOK) */}
                    <tr>
                      <td className="p-4 bg-gray-50/75 font-sans font-black text-gray-700">🍳 প্রস্তুতি সুবিধা</td>
                      {selectedProducts.map((p) => (
                        <td key={p.id} className="p-4 border-l border-gray-150 align-middle font-sans">
                          {p.isReadyToCook ? (
                            <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-lg px-2 py-1 text-[10px] font-black">
                              <Sparkles className="h-3 w-3 text-orange-600" />
                              রেডি-টু-কুক
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[10px] font-bold">সাধারণ আনকাট</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* PRODUCT SAFETY AND VERIFICATION */}
                    <tr>
                      <td className="p-4 bg-gray-50/75 font-sans font-black text-gray-700">🛡️ ফসল নিরাপত্তা</td>
                      {selectedProducts.map((p) => (
                        <td key={p.id} className="p-4 border-l border-gray-150 align-middle">
                          {p.isVerified ? (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg px-2 py-1 text-[10px] font-black">
                              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                              নিরাপদ ফসল ভেরিফাইড
                            </span>
                          ) : (
                            <span className="text-gray-500 font-bold text-[10px]">অর্গানিক কোয়ালিটি</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* AVAILABILITY STATUS */}
                    <tr>
                      <td className="p-4 bg-gray-50/75 font-sans font-black text-gray-700">🛒 সতেজ স্টক অবস্থা</td>
                      {selectedProducts.map((p) => (
                        <td key={p.id} className="p-4 border-l border-gray-150 align-middle font-sans">
                          {p.stock > 0 ? (
                            <span className="text-emerald-700 hover:underline font-black text-[11px]">
                              সতেজ পর্যাপ্ত স্টক ({p.stock} প্যাক উপলব্ধ)
                            </span>
                          ) : (
                            <span className="text-red-500 hover:underline font-black text-[11px]">
                              স্টক আউট (Stock out)
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* QUICK ACTION ROW */}
                    <tr>
                      <td className="p-4 bg-gray-50/75 font-sans font-black text-gray-700">⚡ কার্ট অ্যাকশন</td>
                      {selectedProducts.map((p) => (
                        <td key={p.id} className="p-4 border-l border-gray-150 align-middle">
                          <button
                            disabled={p.stock <= 0}
                            onClick={() => {
                              addToCart(p, 1);
                              window.dispatchEvent(new CustomEvent('open-cart-drawer'));
                            }}
                            className={`w-full flex items-center justify-center gap-1 px-3 py-2.5 text-[10px] font-sans font-black rounded-xl shadow-xs transition cursor-pointer ${
                              p.stock > 0
                                ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-700 hover:to-green-600'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-150'
                            }`}
                          >
                            <ShoppingCart className="h-3 w-3 shrink-0" />
                            কার্টে যোগ করুন
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="bg-gray-100 py-3.5 px-6 border-t border-gray-200 text-center shrink-0">
          <p className="text-[10px] text-gray-450 font-bold font-sans">
            কৃষক বাজার তুলনা হাব সারণিতে পণ্যের সতেজতা এবং খামারি উৎপাদনের সময়ভেদে আপডেট তথ্যের নিশ্চয়তা দেওয়া হয়।
          </p>
        </div>

      </div>
    </div>
  );
};
