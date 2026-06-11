/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product, getFormattedUnit } from '../types';
import { useApp, convertGoogleDriveLink } from '../AppContext';
import { Star, ShoppingCart, Eye, Landmark, ShoppingBag, PhoneCall, Camera } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenQuickView, onEditProduct }) => {
  const { addToCart, currentUser, language, editProduct } = useApp();

  const isWeightBased = !['piece', 'pcs', 'pc', 'টি', 'piece/পিস', 'পিস'].includes(product.unit?.toLowerCase().trim() || '');
  const [selectedPack, setSelectedPack] = React.useState<string>(isWeightBased ? '1kg' : '1pc');

  let packMultiplier = 1;
  let packLabelBn = '';
  let packLabelEn = '';

  if (isWeightBased) {
    if (selectedPack === '500g') {
      packMultiplier = 0.5;
      packLabelBn = '৫০০ গ্রাম';
      packLabelEn = '500g';
    } else if (selectedPack === '1kg') {
      packMultiplier = 1;
      packLabelBn = '১ কেজি';
      packLabelEn = '1kg';
    } else if (selectedPack === '2kg') {
      packMultiplier = 2;
      packLabelBn = '২ কেজি';
      packLabelEn = '2kg';
    } else {
      packMultiplier = 1;
      packLabelBn = '১ কেজি';
      packLabelEn = '1kg';
    }
  } else {
    packMultiplier = 1;
    packLabelBn = '১ টি';
    packLabelEn = '1 Pc';
  }

  const displayPrice = Math.round((product.discountPrice || product.price) * packMultiplier);
  const originalPrice = Math.round(product.price * packMultiplier);
  const hasDiscount = !!product.discountPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, displayPrice, language === 'bn' ? packLabelBn : packLabelEn);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, displayPrice, language === 'bn' ? packLabelBn : packLabelEn);
    window.dispatchEvent(new CustomEvent('open-cart-drawer', { detail: { openCheckout: true } }));
  };

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
          <span className="flex items-center gap-1">🛡️ Admin Mode</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById(`quick-upload-${product.id}`)?.click();
              }}
              className="rounded bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 font-bold flex items-center gap-0.5 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow font-sans"
              title="এই পণ্যটিতে সরাসরি ১টি ছবি আপলোড করুন"
            >
              <Camera className="h-2.5 w-2.5" />
              <span>📷 আপলোড</span>
            </button>
            <input 
              id={`quick-upload-${product.id}`}
              type="file"
              accept="image/*"
              className="hidden"
              onClick={(e) => e.stopPropagation()}
              onChange={async (e) => {
                e.stopPropagation();
                const files = e.target.files;
                if (!files || files.length === 0) return;
                const file = files[0];
                if (file.size > 5 * 1024 * 1024) {
                  alert("ছবি ৫ মেগাবাইটের বেশি বড় হলে আপলোড করা যাবে না!");
                  return;
                }
                const confirmUpload = window.confirm(`আপনি কি এই পণ্যটিতে "${file.name}" ছবিটি প্রথম ছবি হিসেবে আপলোড করতে চান?`);
                if (!confirmUpload) return;
                
                try {
                  let downloadUrl = '';
                  if (storage) {
                    const fileRef = ref(storage, `products/${Date.now()}_card_${Math.random().toString(36).substring(2, 7)}_${file.name}`);
                    await uploadBytes(fileRef, file);
                    downloadUrl = await getDownloadURL(fileRef);
                  } else {
                    downloadUrl = await new Promise<string>((res) => {
                      const r = new FileReader();
                      r.onload = () => res(r.result as string);
                      r.readAsDataURL(file);
                    });
                  }
                  
                  const currentImages = product.images || [];
                  const newImages = [downloadUrl, ...currentImages].slice(0, 5); // Max 5
                  editProduct(product.id, { images: newImages });
                  alert("ফটো সফলভাবে আপলোড ও পণ্যের সাথে যুক্ত করা হয়েছে!");
                } catch (err) {
                  console.error("Card quick upload failed:", err);
                  alert("দুঃখিত, আপলোড ব্যর্থ হয়েছে।");
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditProduct(product);
              }}
              className="rounded bg-indigo-650 hover:bg-indigo-700 text-white px-2 py-0.5 font-bold flex items-center gap-0.5 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow font-sans"
            >
              ✏️ সংশোধন
            </button>
          </div>
        </div>
      )}

      {/* BADGES & COVERS CONTAINER */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={
            product.googleDriveFolderUrl 
              ? convertGoogleDriveLink(product.googleDriveFolderUrl) 
              : (product.images && product.images.length > 0 && product.images[0] 
                  ? convertGoogleDriveLink(product.images[0]) 
                  : 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500')
          }
          alt={product.title}
          className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-108"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500';
          }}
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

        {/* Stateful Weight Mini Cards Selection */}
        {isWeightBased && (
          <div className="mt-2.5 mb-1.5 flex items-center gap-1 font-sans text-[8px] sm:text-[9.5px]" onClick={(e) => e.stopPropagation()}>
            <span className="text-gray-400 font-bold shrink-0">ওজন:</span>
            <div className="flex gap-1 items-center flex-1">
              {[
                { id: '500g', label: '৫০০ গ্রাম', labelEn: '500g' },
                { id: '1kg', label: '১ কেজি', labelEn: '1kg' },
                { id: '2kg', label: '২ কেজি', labelEn: '2kg' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedPack(opt.id)}
                  className={`flex-1 rounded py-0.5 border text-center transition-all cursor-pointer font-extrabold text-[8px] sm:text-[9px] leading-tight ${
                    selectedPack === opt.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-black'
                      : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {language === 'bn' ? opt.label : opt.labelEn}
                </button>
              ))}
            </div>
          </div>
        )}

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
                /{language === 'bn' ? packLabelBn : packLabelEn}
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
