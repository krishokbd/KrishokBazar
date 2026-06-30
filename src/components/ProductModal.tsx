/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, Farmer, getFormattedUnit, getProductPackOptions, PackOption } from '../types';
import { useApp, convertGoogleDriveLink } from '../AppContext';
import { X, Star, ShoppingCart, ShieldCheck, Phone, MapPin, Store, HelpCircle } from 'lucide-react';
import { FEMALE_AVATAR, MALE_AVATAR } from '../assets';
import { LazyImage } from './LazyImage';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onEditProduct }) => {
  const { addToCart, farmers, currentUser, language } = useApp();
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [qty, setQty] = useState(1);

  const packOptions = React.useMemo(() => {
    return product ? getProductPackOptions(product) : [];
  }, [product]);

  const [selectedPackId, setSelectedPackId] = useState<string>('');
  const [selectedVariationId, setSelectedVariationId] = useState<string>('base');

  const selectedVariation = React.useMemo(() => {
    if (!product || !product.variations) return null;
    return product.variations.find(v => v.id === selectedVariationId) || null;
  }, [product, selectedVariationId]);

  // Reset image view index when selecting a variation with a custom image
  useEffect(() => {
    if (selectedVariation && selectedVariation.image) {
      setSelectedImgIdx(0);
    }
  }, [selectedVariationId, selectedVariation]);

  // Reset indices and pack state on product shift
  useEffect(() => {
    setSelectedImgIdx(0);
    setQty(1);
    if (product && packOptions.length > 0) {
      setSelectedPackId(packOptions[1]?.id || packOptions[0]?.id || '1');
    }
    if (product && product.variations && product.variations.length > 0) {
      setSelectedVariationId(product.variations[0].id);
    } else {
      setSelectedVariationId('base');
    }
  }, [product, packOptions]);

  if (!isOpen || !product) return null;

  // Retrieve associated farmer details
  const farmer: Farmer | undefined = farmers.find(f => f.id === product.farmerId);

  const activeOption = packOptions.find(o => o.id === selectedPackId) || packOptions[0];

  const packMultiplier = activeOption?.multiplier || 1;
  const packLabelBn = activeOption?.labelBn || product.unit || 'পিস';
  const packLabelEn = activeOption?.labelEn || product.unit || 'piece';

  const baseDisplayPrice = (selectedVariation && selectedVariation.price !== undefined)
    ? selectedVariation.price
    : (product.discountPrice || product.price);

  const baseOriginalPrice = (selectedVariation && selectedVariation.price !== undefined)
    ? selectedVariation.price
    : product.price;

  const displayPrice = Math.round(baseDisplayPrice * packMultiplier);
  const originalPrice = Math.round(baseOriginalPrice * packMultiplier);
  const hasDiscount = !!product.discountPrice && !selectedVariation?.price;
  const discountPercent = hasDiscount && originalPrice > displayPrice
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : 0;

  const handleIncrement = () => {
    if (qty < product.stock) {
      setQty(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (qty > 1) {
      setQty(prev => prev - 1);
    }
  };

  const handleAdd = () => {
    addToCart(product, qty, displayPrice, language === 'bn' ? packLabelBn : packLabelEn, selectedVariation || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all md:flex max-h-[90vh] overflow-y-auto">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-black/40 p-1.5 text-white/95 hover:bg-black/60 shadow-lg cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* LEFT COLUMN: MULTI-IMAGE GALLERY (aspect 4:3 or similar) */}
        <div className="md:w-1/2 p-6 flex flex-col bg-gray-50/50 justify-center">
          {(() => {
            const productImages = (product.images || []).map(url => url ? url.trim() : '').filter(Boolean);
            if (productImages.length === 0) {
              productImages.push('https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500');
            }
            const safeImgIdx = selectedImgIdx < productImages.length ? selectedImgIdx : 0;
            
            return (
              <>
                <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white aspect-[4/3] w-full shadow-inner flex items-center justify-center">
                  <LazyImage
                    src={
                      safeImgIdx === 0 && selectedVariation?.image
                        ? convertGoogleDriveLink(selectedVariation.image)
                        : safeImgIdx === 0 && product.googleDriveFolderUrl
                        ? convertGoogleDriveLink(product.googleDriveFolderUrl)
                        : convertGoogleDriveLink(productImages[safeImgIdx])
                    }
                    alt={`${product.title} - view`}
                    className="h-full w-full object-cover transition-all"
                    referrerPolicy="no-referrer"
                    onError={() => {}}
                  />
                  {hasDiscount && (
                    <span className="absolute left-3 top-3 rounded-lg bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow">
                      ছাড় আইটেম
                    </span>
                  )}
                </div>

                {/* Thumbnail switcher bar */}
                <div className="mt-4 flex gap-2 overflow-x-auto py-1">
                  {productImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImgIdx(idx)}
                      className={`relative aspect-[4/3] w-16 shrink-0 rounded-lg overflow-hidden border-2 bg-white shadow-sm transition-all cursor-pointer ${
                        safeImgIdx === idx ? 'border-emerald-600 scale-102 shadow-md' : 'border-gray-100'
                      }`}
                    >
                      <LazyImage
                        src={
                          idx === 0 && selectedVariation?.image
                            ? convertGoogleDriveLink(selectedVariation.image)
                            : idx === 0 && product.googleDriveFolderUrl
                            ? convertGoogleDriveLink(product.googleDriveFolderUrl)
                            : convertGoogleDriveLink(imgUrl)
                        }
                        alt="micro th"
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => {}}
                      />
                    </button>
                  ))}
                </div>
              </>
            );
          })()}
        </div>

        {/* RIGHT COLUMN: CORE INFORMATION */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
          {/* ADMIN SPEED CONTROL PANEL */}
          {currentUser?.role === 'Admin' && onEditProduct && (
            <div className="rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/50 p-3.5 mb-4 flex items-center justify-between shadow-sm shrink-0">
              <span className="text-xs text-amber-900 font-extrabold">🛡️ এডমিন পণ্য এডিট প্যানেল</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditProduct(product);
                }}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1.5 text-xs font-black shadow-md transition-all cursor-pointer hover:scale-102 active:scale-98"
              >
                ✏️ এডিট করুন (Edit Product)
              </button>
            </div>
          )}

          {/* Header titles */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 font-mono">
            CATEGORIES: {product.category.toUpperCase()}
          </span>
          <h2 className="mt-1 text-lg sm:text-2xl font-black text-gray-800 leading-tight">
            {product.title}
          </h2>

          {/* Star rating + Stock */}
          <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-amber-500 font-semibold font-sans">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 shrink-0 ${
                      i < Math.floor(product.rating) 
                        ? 'fill-amber-500 text-amber-500' 
                        : 'text-gray-200'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-gray-600 mt-0.5 ml-1 font-mono">{product.rating}</span>
            </div>

            <span className="text-gray-200">|</span>

            <span className={`font-semibold ${
              product.stock > 10 ? 'text-emerald-600' : 'text-orange-600 animate-pulse'
            }`}>
              {product.stock > 0 ? `${language === 'bn' ? 'স্টক আছে' : 'In Stock'}: ${product.stock} ${getFormattedUnit(product, language)}` : (language === 'bn' ? 'স্টক শেষ' : 'Out of stock')}
            </span>

            {product.harvestDate && (
              <>
                <span className="text-gray-200">|</span>
                <span className="text-amber-850 font-extrabold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-[11px] font-sans">
                  📅 সংগ্রহ: {product.harvestDate}
                </span>
              </>
            )}
          </div>
          <div className="mt-4 rounded-2xl bg-gray-50/60 p-4 border border-gray-200/60 shadow-xs">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-850 font-mono tracking-tight leading-none animate-fade-in">
                    ৳{displayPrice}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-gray-400 line-through font-mono">
                        ৳{originalPrice}
                      </span>
                      <span className="inline-flex items-center rounded bg-red-50 border border-red-150 px-1.5 py-0.5 text-[9px] font-black text-red-700 tracking-wide">
                        {discountPercent}% ডিসকাউন্ট!
                      </span>
                    </>
                  )}
                  <span className="text-xs text-gray-450 font-bold ml-1 font-sans">
                    / প্রতি {language === 'bn' ? packLabelBn : packLabelEn}
                  </span>
                </div>
                <p className="mt-1 text-[10.5px] text-gray-400 leading-none">
                  *কোনো কমিশন বা ফড়িয়া খরচ নেই, সরাসরি মাঠের তাজা মূল্য
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase font-mono block leading-none">মোট মূল্য ({qty} {language === 'bn' ? packLabelBn : packLabelEn})</span>
                <span className="text-xl font-black text-emerald-800 font-sans block mt-0.5">
                  ৳{displayPrice * qty}
                </span>
              </div>
            </div>

            {/* Product Variations selector */}
            {product.variations && product.variations.length > 0 && (
              <div className="mt-3.5 pt-3.5 border-t border-dashed border-gray-200">
                <span className="block text-[11px] font-bold text-gray-650 mb-2 flex items-center gap-1 font-sans">
                  🥦 প্রোডাক্ট ভেরিয়েশন সিলেক্ট করুন (Select Variation):
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variations.map((v) => {
                    const diff = (v.price !== undefined) ? v.price - (product.discountPrice || product.price) : 0;
                    let diffText = '';
                    if (diff > 0) {
                      diffText = ` (+৳${diff})`;
                    } else if (diff < 0) {
                      diffText = ` (-৳${Math.abs(diff)})`;
                    }
                    const isSelected = selectedVariationId === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariationId(v.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-black shadow-3xs'
                            : 'border-gray-200 bg-white text-gray-600 hover:bg-slate-50'
                        }`}
                      >
                        {language === 'bn' ? v.nameBn : v.nameEn}{diffText}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Packaging card selector */}
            {packOptions.length > 0 && (
              <div className="mt-3.5 pt-3.5 border-t border-dashed border-gray-200">
                <span className="block text-[11px] font-bold text-gray-650 mb-2 flex items-center gap-1 font-sans">
                  📦 প্যাকেজিং অপশন সিলেক্ট করুন (Select Pack Option):
                </span>
                
                <div className="grid grid-cols-3 gap-2 font-sans">
                  {packOptions.map((opt, oIdx) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedPackId(opt.id)}
                      className={`p-2 sm:p-2.5 rounded-xl border transition-all flex flex-col justify-center items-center text-center cursor-pointer ${
                        selectedPackId === opt.id
                          ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 shadow-sm font-black'
                          : 'border-gray-200 bg-white hover:bg-slate-50 text-gray-650 font-semibold text-xs'
                      }`}
                    >
                      <span className="text-[8px] uppercase tracking-wide text-gray-410 font-bold">
                        {oIdx === 0 ? (language === 'bn' ? 'স্মল প্যাক' : 'Small Pack') : oIdx === 1 ? (language === 'bn' ? 'পপুলার প্যাক' : 'Popular Pack') : (language === 'bn' ? 'ফ্যামিলি প্যাক' : 'Family Pack')}
                      </span>
                      <span className="text-xs mt-0.5 font-bold">
                        {language === 'bn' ? opt.labelBn : opt.labelEn}
                      </span>
                      <span className="text-[10px] mt-0.5 text-emerald-700 font-mono font-bold">
                        ৳{Math.round(baseDisplayPrice * opt.multiplier)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Crop Description */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-gray-700 leading-relaxed uppercase">পণ্যের বর্ণনা ও মান যাচাই:</h4>
            <p className="mt-1.5 text-xs text-gray-600 leading-relaxed font-sans">
              {product.description} বাগান থেকে তোলার কয়েক ঘণ্টার মধ্যেই সংগ্রহ করে আপনার অর্ডারের ওপর ভিত্তি করে তাজা অবস্থায় ডেলিভারি দেওয়া হবে।
            </p>
          </div>

          {/* FARMER INFORMATION CARD */}
          {farmer && (
            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 h-16 w-16 text-emerald-600/5 rotate-12">
                <Store className="h-full w-full" />
              </div>

              <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">উত্পাদক বা অংশীদার কৃষক</h4>
              <div className="mt-2.5 flex items-center gap-3">
                {/* Farmer Photo */}
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-emerald-300 bg-white">
                  <img
                    src={farmer.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR}
                    alt={farmer.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-gray-800">{farmer.name}</span>
                    {farmer.verified && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-blue-50 px-1 py-0.5 text-[8px] font-black text-blue-600 border border-blue-100 shrink-0" title="Verified Farmer">
                        ✔ ভেরিফাইড
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-gray-500">
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {farmer.district}
                    </span>
                    <span>•</span>
                    <span className="text-amber-600 font-semibold">{farmer.rating} ★ রেটিং</span>
                    <span>•</span>
                    <span>{farmer.salesCount}+ সফল বিক্রয়</span>
                  </div>
                </div>
              </div>

              {/* Direct Support Information */}
              <div className="mt-3 pt-2.5 border-t border-emerald-100/50 flex items-center justify-between text-[11px] text-gray-600 font-medium">
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  কৃষকের সাথে সরাসরি আলাপ:
                </span>
                <a 
                  href={`tel:${farmer.phone}`}
                  className="font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-lg hover:bg-emerald-150 transition-colors"
                >
                  {farmer.phone}
                </a>
              </div>
            </div>
          )}

          {/* ADD-TO-CART CONTROLROW */}
          <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-4">
            {/* Quantity counters */}
            <div className="flex items-center rounded-xl border border-gray-200 p-1 bg-white">
              <button
                type="button"
                onClick={handleDecrement}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 font-bold"
              >
                -
              </button>
              <span className="w-10 text-center text-xs font-bold text-gray-800 font-mono">
                {qty}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 font-bold"
              >
                +
              </button>
            </div>

            {/* Total calculation indicator */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] text-gray-400 uppercase font-mono leading-none">মোট মূল্য</span>
              <span className="text-md font-bold text-gray-700 font-sans">
                ৳{displayPrice * qty}
              </span>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 py-3 text-center text-sm font-bold text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              কার্টে যোগ করুন (৳{displayPrice * qty})
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
