/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product, getFormattedUnit } from '../types';
import { useApp } from '../AppContext';
import { Star, ShoppingCart, Eye, Landmark, ShoppingBag, PhoneCall } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenQuickView, onEditProduct }) => {
  const { addToCart, currentUser, language } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    window.dispatchEvent(new CustomEvent('open-cart-drawer', { detail: { openCheckout: true } }));
  };

  const hasDiscount = !!product.discountPrice;
  const originalPrice = product.price;
  const displayPrice = product.discountPrice || product.price;

  const whatsappMessage = encodeURIComponent(`আসসালামু আলাইকুম, আমি কৃষক বাজার থেকে "${product.title}" পণ্যটি অর্ডার করতে চাই।\nকৃষক: ${product.farmerName}\nমূল্য: ৳${displayPrice}`);
  const whatsappUrl = `https://wa.me/8801931355398?text=${whatsappMessage}`;

  return (
    <div 
      onClick={() => onOpenQuickView(product)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:border-emerald-250 hover:scale-[1.015] active:scale-[0.995] transition-all cursor-pointer h-full"
    >
      {/* ADMIN CONTROL PANEL HEADER */}
      {((currentUser?.role === 'Admin' || (typeof window !== 'undefined' && window.location.hash === '#admin')) && onEditProduct) && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 py-2 flex items-center justify-between text-[9px] font-black text-amber-900 uppercase shrink-0">
          <span className="flex items-center gap-1">🛡️ Inline Edit Active</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditProduct(product);
            }}
            className="rounded bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-0.5 font-bold flex items-center gap-1 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow"
          >
            ✏️ সংশোধন করুন
          </button>
        </div>
      )}

      {/* BADGES & COVERS CONTAINER */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-108"
          referrerPolicy="no-referrer"
        />

        {/* VERIFIED BADGE */}
        {product.isVerified && (
          <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[8px] font-bold tracking-wide text-white uppercase shadow-md border border-emerald-500">
            ✔ Verified
          </span>
        )}

        {/* READY TO COOK BADGE */}
        {product.isReadyToCook && (
          <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded bg-indigo-600 px-1.5 py-0.5 text-[8px] font-bold text-white uppercase shadow">
            🍳 R2C
          </span>
        )}

        {/* DISCOUNT BADGE */}
        {hasDiscount && (
          <span className="absolute left-2 bottom-2 z-10 inline-flex items-center rounded bg-red-500 px-1.5 py-0.5 text-[8px] font-bold text-white shadow">
            -{Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}% ছাড়
          </span>
        )}

        {/* HOVER QUICK VIEW BUTTON */}
        <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            type="button"
            className="rounded-full bg-white/95 p-2 text-emerald-700 shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* TEXT CONTENT CONTAINER */}
      <div className="flex flex-1 flex-col p-2 sm:p-3">
        {/* Category + Star Rating Row */}
        <div className="flex items-center justify-between gap-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-gray-400">
          <span>{product.category}</span>
          <div className="flex items-center gap-0.5 text-amber-500">
            <Star className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-amber-500 shrink-0" />
            <span className="text-gray-600 font-mono mt-0.5 text-[8px] sm:text-[9px]">{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-0.5 text-[10px] sm:text-xs font-bold text-gray-800 tracking-tight leading-snug line-clamp-1 font-sans group-hover:text-emerald-700 transition-colors">
          {product.title}
        </h3>

        {/* Farmer credit reference */}
        <div className="mt-0.5 flex items-center gap-1 flex-wrap text-[8px] sm:text-[10px] text-gray-500 font-medium">
          <Landmark className="h-2.5 w-2.5 text-emerald-600 shrink-0" />
          <span className="truncate max-w-[80px] sm:max-w-[120px]" title={product.farmerName}>
            <strong className="text-gray-650 font-bold">{product.farmerName}</strong>
          </span>
        </div>

        {/* Price + Single Buy Now Button Bottom Section */}
        <div className="mt-auto pt-1.5 border-t border-gray-100 flex items-center justify-between gap-1.5">
          {/* Pricing display */}
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[8px] sm:text-[9px] text-gray-450 line-through font-mono leading-none">
                ৳{originalPrice}
              </span>
            )}
            <span className="text-[10px] sm:text-xs font-black text-emerald-700 font-sans flex items-baseline leading-none">
              ৳{displayPrice}
              <span className="text-[8px] sm:text-[9px] text-gray-400 font-medium ml-0.5 font-mono">
                /{getFormattedUnit(product, language)}
              </span>
            </span>
          </div>

          {/* Single Buy Now button */}
          {product.stock > 0 ? (
            <button
              onClick={handleBuyNow}
              className="rounded bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 px-2.5 sm:px-3 py-1 text-[8px] sm:text-[9px] font-black text-white shadow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              কিনুন
            </button>
          ) : (
            <span className="text-[7px] sm:text-[8px] font-black text-gray-400 bg-gray-50 px-1 sm:px-1.5 py-0.5 rounded">
              স্টক শেষ
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
