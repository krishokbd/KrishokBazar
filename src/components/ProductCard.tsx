/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product, ProductVariation, getFormattedUnit, getProductPackOptions, PackOption } from '../types';
import { useApp, convertGoogleDriveLink } from '../AppContext';
import { Star, ShoppingCart, Eye, Landmark, ShoppingBag, PhoneCall, Camera, Heart } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { motion } from 'motion/react';

interface LazyProductImageProps {
  src: string;
  alt: string;
  onError?: () => void;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  className?: string;
}

const LazyProductImage: React.FC<LazyProductImageProps> = ({
  src,
  alt,
  onError,
  referrerPolicy,
  className
}) => {
  const [isInView, setIsInView] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '120px', // start loading early for perfect smooth scroll
        threshold: 0.01,
      }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [src]);

  React.useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  React.useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, [isInView, src]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-slate-50 flex items-center justify-center">
      {/* High-performance Skeleton shimmer loader */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 bg-slate-100 overflow-hidden">
          <div className="absolute inset-0 bg-slate-200 animate-pulse" />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" 
            style={{
              animation: 'kb-card-shimmer 1.5s infinite ease-in-out',
              transform: 'translateX(-100%)'
            }}
          />
          <style>{`
            @keyframes kb-card-shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-4 select-none border border-dashed border-slate-200">
          {/* Beautiful SVG placeholder for failed/missing image */}
          <svg className="w-10 h-10 mb-1.5 stroke-current text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <span className="text-[10px] font-medium tracking-wide text-slate-400 text-center">ছবি লোড করা যায়নি (Unreachable)</span>
        </div>
      ) : (
        isInView && (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            referrerPolicy={referrerPolicy}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              console.warn(`[LazyProductImage] Failed to load image URL: ${src}`);
              setHasError(true);
              if (onError) onError();
            }}
            className={`${className} transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
            }`}
          />
        )
      )}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onToggleCompare?: (productId: string) => void;
  isCompared?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenQuickView,
  onEditProduct,
  onToggleCompare,
  isCompared
}) => {
  const { addToCart, currentUser, language, editProduct, wishlist, toggleWishlist } = useApp();
  const isWishlisted = wishlist?.includes(product.id) || false;

  const packOptions = React.useMemo(() => getProductPackOptions(product), [product]);
  const [selectedPackId, setSelectedPackId] = React.useState<string>(() => {
    return packOptions[1]?.id || packOptions[0]?.id || '1';
  });

  // Keep state synchronized if product unit changes
  React.useEffect(() => {
    setSelectedPackId(packOptions[1]?.id || packOptions[0]?.id || '1');
  }, [packOptions]);

  const activeOption = React.useMemo(() => {
    return packOptions.find(o => o.id === selectedPackId) || packOptions[0];
  }, [packOptions, selectedPackId]);

  const packMultiplier = activeOption?.multiplier || 1;
  const packLabelBn = activeOption?.labelBn || '';
  const packLabelEn = activeOption?.labelEn || '';

  const [selectedVariationId, setSelectedVariationId] = React.useState<string>(() => {
    if (product.variations && product.variations.length > 0) {
      return product.variations[0].id;
    }
    return 'base';
  });

  // Keep state synchronized if product variations change
  React.useEffect(() => {
    if (product.variations && product.variations.length > 0) {
      setSelectedVariationId(product.variations[0].id);
    } else {
      setSelectedVariationId('base');
    }
  }, [product.variations]);

  const selectedVariation = React.useMemo(() => {
    if (!product.variations || product.variations.length === 0) return null;
    return product.variations.find(v => v.id === selectedVariationId) || null;
  }, [product.variations, selectedVariationId]);

  const currentStock = (selectedVariation && selectedVariation.stock !== undefined && selectedVariation.stock !== null)
    ? selectedVariation.stock
    : product.stock;

  const basePrice = (selectedVariation && selectedVariation.price !== undefined) 
    ? selectedVariation.price 
    : (product.discountPrice || product.price);

  const baseOriginalPrice = (selectedVariation && selectedVariation.price !== undefined)
    ? selectedVariation.price
    : product.price;

  const displayPrice = Math.round(basePrice * packMultiplier);
  const originalPrice = Math.round(baseOriginalPrice * packMultiplier);
  const hasDiscount = !!product.discountPrice && !selectedVariation?.price;

  const hasVariations = product.variations && product.variations.length > 0;
  const minPrice = React.useMemo(() => {
    if (!hasVariations) return displayPrice;
    const prices = product.variations!.map(v => {
      const varBasePrice = (v.price !== undefined) ? v.price : (product.discountPrice || product.price);
      return Math.round(varBasePrice * packMultiplier);
    });
    return Math.min(...prices);
  }, [product, packMultiplier, hasVariations, displayPrice]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, displayPrice, language === 'bn' ? packLabelBn : packLabelEn, selectedVariation || undefined);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, displayPrice, language === 'bn' ? packLabelBn : packLabelEn, selectedVariation || undefined);
    window.dispatchEvent(new CustomEvent('open-cart-drawer', { detail: { openCheckout: true } }));
  };

  const whatsappMessage = encodeURIComponent(`আসসালামু আলাইকুম, আমি কৃষক বাজার থেকে "${product.title}" পণ্যটি অর্ডার করতে চাই।\nকৃষক: ${product.farmerName}\nমূল্য: ৳${displayPrice}`);
  const whatsappUrl = `https://wa.me/8801931355398?text=${whatsappMessage}`;

  // Resilient image loading with fallbacks for broken/webpage links
  const getInitialSrc = () => {
    // Only prioritize googleDriveFolderUrl as an image source if it is actually a direct, downloadable Google Drive file/image link.
    const isRealDriveImage = product.googleDriveFolderUrl && (
      product.googleDriveFolderUrl.includes('drive.google.com/file/') ||
      product.googleDriveFolderUrl.includes('id=') ||
      product.googleDriveFolderUrl.includes('drive.google.com/open') ||
      product.googleDriveFolderUrl.includes('lh3.googleusercontent.com')
    );

    console.log(`[ProductCard/getInitialSrc] ID: ${product.id} "${product.title}" - images:`, product.images, "googleDriveFolderUrl:", product.googleDriveFolderUrl);

    if (isRealDriveImage && product.googleDriveFolderUrl) {
      const parsedUrl = convertGoogleDriveLink(product.googleDriveFolderUrl);
      console.log(`[ProductCard/getInitialSrc] Product ID: ${product.id}. Parsed googleDriveFolderUrl:`, {
        input: product.googleDriveFolderUrl,
        output: parsedUrl
      });
      return parsedUrl;
    }
    const validUrls = (product.images || []).map(url => url ? url.trim() : '').filter(Boolean);
    if (validUrls[0]) {
      const parsedUrl = convertGoogleDriveLink(validUrls[0]);
      console.log(`[ProductCard/getInitialSrc] Product ID: ${product.id}. Parsed validUrls[0]:`, {
        input: validUrls[0],
        output: parsedUrl
      });
      return parsedUrl;
    }
    console.log(`[ProductCard/getInitialSrc] Product ID: ${product.id}. No valid images or Drive URL, using default fallback.`);
    return 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500';
  };

  const [currentSrc, setCurrentSrc] = React.useState(getInitialSrc());
  const [attemptIndex, setAttemptIndex] = React.useState(-1); // Start at -1 to indicate we are trying initial source

  React.useEffect(() => {
    console.log(`[ProductCard/Effect] Product updated: "${product.title}" (ID: ${product.id}) images:`, product.images);
    setCurrentSrc(getInitialSrc());
    setAttemptIndex(-1);
  }, [product]);

  const handleImageError = () => {
    const validUrls = (product.images || []).map(url => url ? url.trim() : '').filter(Boolean);
    
    // Determine next index to attempt
    const nextIdx = attemptIndex + 1;
    console.warn(`[ProductCard/handleImageError] Failed to load image source: ${currentSrc} for Product "${product.title}" (ID: ${product.id}). Attempting fallback index ${nextIdx}`);
    if (nextIdx < validUrls.length) {
      setAttemptIndex(nextIdx);
      const parsedUrl = convertGoogleDriveLink(validUrls[nextIdx]);
      console.log(`[ProductCard/handleImageError] Product ID: ${product.id}. Parsed fallback index ${nextIdx}:`, {
        input: validUrls[nextIdx],
        output: parsedUrl
      });
      setCurrentSrc(parsedUrl);
    } else {
      console.warn(`[ProductCard/handleImageError] All images failed for Product ID: ${product.id}. Falling back to default Unsplash placeholder.`);
      setCurrentSrc('https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500');
    }
  };

  return (
    <motion.div 
      onClick={() => onOpenQuickView(product)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:border-emerald-250 transition-all cursor-pointer h-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.015, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
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
        <LazyProductImage
          src={currentSrc}
          alt={product.title}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center group-hover:scale-108"
        />

        {/* Subtle dark gradient overlay at the bottom to ensure layered text/badges are readable over vibrant photos */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none z-5" />

        {/* BLUE VERIFICATION TICK ONLY (NO TEXT OVERLAY) */}
        {product.isVerified && (
          <div className="absolute left-2 top-2 z-10 flex items-center justify-center p-0.5 rounded-full bg-white/90 backdrop-blur-xs shadow-sm border border-sky-100" title={language === 'bn' ? 'ভেরিফাইড কৃষক' : 'Verified Farmer'}>
            <svg className="h-3.5 w-3.5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.7l-3.61.81.34 3.68L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2L12 21.04l3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
            </svg>
          </div>
        )}

        {/* WISHLIST HEART TOGGLE BUTTON */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute right-2 top-2 z-20 p-1.5 rounded-full bg-white/80 backdrop-blur-xs hover:bg-white text-gray-400 hover:text-rose-500 transition shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center select-none"
          title={isWishlisted ? (language === 'bn' ? 'উইশলিস্ট থেকে বাদ দিন' : 'Remove from wishlist') : (language === 'bn' ? 'উইশলিস্টে যোগ করুন' : 'Add to wishlist')}
        >
          <motion.div
            key={isWishlisted ? "wishlisted" : "not-wishlisted"}
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.35, 1.0] }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <Heart 
              className={`h-3.5 w-3.5 transition-colors ${
                isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-400'
              }`} 
            />
          </motion.div>
        </button>

        {/* DISCOUNT BADGE (ONLY THIS WRITING ALLOWED ON THE IMAGE) */}
        {hasDiscount && (
          <span className="absolute left-2 bottom-2 z-10 inline-flex items-center rounded-md bg-rose-600 px-1.5 py-0.5 text-[8px] sm:text-[9.5px] font-black text-white shadow-sm font-sans">
            {Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}% {language === 'bn' ? 'ছাড়' : 'OFF'}
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
      <div className="flex flex-1 flex-col p-2">
        {/* Category + Star Rating Row */}
        <div className="flex items-center justify-between gap-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-gray-400">
          <div className="flex items-center gap-1 flex-wrap">
            <span>{product.category}</span>
            {product.isReadyToCook && (
              <span className="text-[7px] text-indigo-600 font-black px-1 py-0.25 bg-indigo-50 rounded select-none shrink-0" title="Ready to Cook">
                🍳 R2C
              </span>
            )}
            {currentStock > 0 && currentStock < 5 && (
              <span className="text-[7px] font-black text-rose-600 px-1 py-0.25 bg-rose-50 rounded select-none shrink-0 animate-pulse">
                ⚠️ {language === 'bn' ? 'সীমিত স্টক' : 'Low Stock'}
              </span>
            )}
          </div>
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
          <span className="inline-flex items-center gap-1 truncate max-w-[100px] sm:max-w-[140px]" title={product.farmerName}>
            <strong className="text-gray-650 font-bold">{product.farmerName}</strong>
            {product.isVerified && (
              <svg className="h-3.5 w-3.5 text-[#1877F2] shrink-0 inline-block align-middle" viewBox="0 0 24 24" fill="currentColor" title={language === 'bn' ? 'ভেরিফাইড কৃষক' : 'Verified Farmer'}>
                <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.7l-3.61.81.34 3.68L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2L12 21.04l3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
              </svg>
            )}
          </span>
        </div>

        {/* Stateful Variation Selection */}
        {product.variations && product.variations.length > 0 && (
          <div className="mt-1.5 mb-0.5 flex flex-col gap-1 font-sans text-[8px] sm:text-[9.5px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-1">
              <span className="text-gray-400 font-bold shrink-0">
                {language === 'bn' ? 'প্রকার:' : 'Variant:'}
              </span>
              <select
                value={selectedVariationId}
                onChange={(e) => setSelectedVariationId(e.target.value)}
                className="flex-1 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[8.5px] font-bold text-gray-700 outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
              >
                {product.variations.map((v) => {
                  const vPrice = v.price !== undefined ? v.price : (product.discountPrice || product.price);
                  const priceText = ` (৳${Math.round(vPrice * packMultiplier)})`;
                  return (
                    <option key={v.id} value={v.id}>
                      {language === 'bn' ? v.nameBn : v.nameEn}{priceText}
                    </option>
                  );
                })}
              </select>
            </div>
            {/* Dynamic Stock Indicator for Selected Variation */}
            <div className="flex items-center justify-between text-[8px] sm:text-[9px] px-1 text-gray-500 font-mono">
              <span>
                {language === 'bn' ? 'স্টক:' : 'Stock:'}{' '}
                {currentStock > 0 ? (
                  <span className="text-emerald-600 font-bold">
                    {language === 'bn' ? `${currentStock}টি উপলব্ধ` : `${currentStock} available`}
                  </span>
                ) : (
                  <span className="text-rose-500 font-bold">
                    {language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}
                  </span>
                )}
              </span>
              {currentStock > 0 && currentStock < 5 && (
                <span className="text-rose-600 font-black animate-pulse bg-rose-50 px-1 rounded">
                  {language === 'bn' ? 'সীমিত স্টক' : 'Low Stock'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stateful Pack Option Selection */}
        {packOptions.length > 0 && (
          <div className="mt-1.5 mb-1 flex items-center gap-1 font-sans text-[8px] sm:text-[9.5px]" onClick={(e) => e.stopPropagation()}>
            <span className="text-gray-400 font-bold shrink-0">
              {language === 'bn' ? 'পরিমাণ:' : 'Size:'}
            </span>
            <div className="flex gap-1 items-center flex-1">
              {packOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedPackId(opt.id)}
                  className={`flex-1 rounded py-0.5 border text-center transition-all cursor-pointer font-extrabold text-[8px] sm:text-[9px] leading-tight ${
                    selectedPackId === opt.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-black'
                      : 'border-gray-200 bg-white text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {language === 'bn' ? opt.labelBn : opt.labelEn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price + Single Buy Now Button Bottom Section */}
        <div className="mt-auto pt-1 border-t border-gray-100 flex items-center justify-between gap-1.5">
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
          {currentStock > 0 ? (
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
    </motion.div>
  );
};
