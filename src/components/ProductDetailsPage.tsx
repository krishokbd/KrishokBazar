/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Product, Farmer, Review, getFormattedUnit } from '../types';
import { 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  ShoppingCart, 
  Coins, 
  Truck, 
  Clock, 
  MapPin, 
  Store, 
  Heart, 
  Share2, 
  Check, 
  ThumbsUp, 
  BadgePercent,
  CircleCheck,
  PackageOpen,
  ChevronLeft,
  ChevronRight,
  Info,
  ShieldAlert,
  ThumbsDown,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Gift,
  HelpCircle
} from 'lucide-react';
import { FEMALE_AVATAR, MALE_AVATAR } from '../assets';

interface ProductDetailsPageProps {
  productId: string;
  onBack: () => void;
  onSelectFarmer: (farmerId: string) => void;
  onSelectProduct: (productId: string) => void;
  onEditProduct?: (product: Product) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ 
  productId, 
  onBack, 
  onSelectFarmer, 
  onSelectProduct,
  onEditProduct
}) => {
  const { products, farmers, reviews, addToCart, addReview, currentUser, language } = useApp();
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'delivery'>('details');

  // Interactive review submission states
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);

  // Helpfulness toggle mock state
  const [helpfulLikes, setHelpfulLikes] = useState<Record<string, boolean>>({});

  const product = products.find(p => p.id === productId);

  useEffect(() => {
    setSelectedImgIdx(0);
    setQty(1);
    setReviewSuccessMsg(null);
    setCommentInput('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center font-sans">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-850">দুঃখিত, অনুসন্ধানকৃত কৃষিপণ্যটি পাওয়া যায়নি!</h3>
        <p className="text-gray-400 text-xs mt-1 max-w-md mx-auto">পণ্যটির হয়তো স্টক শেষ হয়ে গিয়েছে অথবা চাষী সাময়িকভাবে তালিকাটি সরিয়ে নিয়েছেন। কাইন্ডলি মূল বাজারে পুনরায় সার্চ করুন।</p>
        <button 
          onClick={onBack} 
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> বাজারে ফিরে যান
        </button>
      </div>
    );
  }

  const farmer = farmers.find(f => f.id === product.farmerId);
  const displayPrice = product.discountPrice || product.price;
  const originalPrice = product.price;
  const hasDiscount = !!product.discountPrice;
  const discountAmt = originalPrice - displayPrice;
  const discountPercent = Math.round(((originalPrice - displayPrice) / originalPrice) * 100);

  const handleIncrement = () => {
    if (qty < product.stock) setQty(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (qty > 1) setQty(prev => prev - 1);
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
    // Flash a little text/effect indicating success if wanted, but standard feedback is already in header
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    // Programmatically open the shopping cart sidebar drawer by simulating click
    const cartBtn = document.getElementById('header-cart-btn');
    if (cartBtn) {
      cartBtn.click();
    }
  };

  const handleShare = () => {
    setCopied(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNextImage = () => {
    setSelectedImgIdx(prev => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setSelectedImgIdx(prev => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleReviewSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    addReview({
      customerName: currentUser?.name || 'পরিচিত ক্রেতা',
      avatar: currentUser?.name ? currentUser.name[0] : 'C',
      rating: ratingInput,
      comment: commentInput,
      productName: product.title,
      location: currentUser?.address || 'ঢাকা, বাংলাদেশ'
    });

    setReviewSuccessMsg('ধন্যবাদ! আপনার মূল্যবান রিভিউটি সফলভাবে সিস্টেমে যুক্ত করা হয়েছে এবং সরাসরি মাঠ পর্যায়ে কৃষকের উৎসাহিতকরণ ড্যাশবোর্ডে পাঠানো হয়েছে।');
    setCommentInput('');
  };

  const toggleReviewHelpfulness = (reviewId: string) => {
    setHelpfulLikes(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Filter reviews specifically matching this product
  const productReviews = reviews.filter(
    r => r.productName === product.title || product.title.includes(r.productName) || r.productName.includes(product.title)
  );

  // Dynamically calculate Star Rating Distribution Progress logic
  const starDistribution = [0, 0, 0, 0, 0]; // Index 0: 1-Star, ..., Index 4: 5-Star
  productReviews.forEach(r => {
    const starVal = Math.max(1, Math.min(5, Math.round(r.rating)));
    starDistribution[starVal - 1]++;
  });

  const totalReviewsCount = productReviews.length;

  // Same category related items (excluding current)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // More from same agriculturist/farmer
  const propsWithSameFarmer = products
    .filter(p => p.farmerId === product.farmerId && p.id !== product.id)
    .slice(0, 4);

  return (
    <section className="py-8 bg-gray-50/70 min-h-screen text-gray-800 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* TOP COMPACT NAVIGATION BREADCRUMBS */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-550 select-none">
            <span className="cursor-pointer hover:text-emerald-700 transition" onClick={onBack}>কৃষক বাজার হোম</span>
            <span>/</span>
            <span className="text-gray-400 font-medium">{product.category}</span>
            <span>/</span>
            <span className="text-emerald-700 font-black truncate max-w-[200px]">{product.title}</span>
          </div>

          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-150 px-4 py-2 text-xs font-bold text-gray-700 shadow-xs hover:bg-gray-50 active:scale-98 transition duration-200 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-emerald-600" />
            পেছনে যান (Back)
          </button>
        </div>

        {copied && (
          <div className="mb-4 rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-700 font-black text-center flex items-center justify-center gap-2 animate-bounce">
            <Check className="h-4 w-4 text-blue-600 shrink-0" />
            ✓ ফসলের সুনির্দিষ্ট বিবরণ লিংক আপনার ক্লিপবোর্ডে কপি করা হয়েছে! বন্ধুদের সাথে শেয়ার করুন।
          </div>
        )}

        {/* --- MAIN HERO PRODUCT WRAPPER CARD --- */}
        <div className="rounded-3xl border border-gray-100 bg-white p-4 sm:p-8 shadow-sm lg:grid lg:grid-cols-12 lg:gap-10">
          
          {/* COLUMN 1: INTERACTIVE IMAGE GALLERY SLIDER (LG CLS: 6/12) */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* LARGE VIEWPORT BOX WITH NAVIGATION CHEVRONS */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-150-soft bg-gray-50 aspect-[4/3] w-full flex items-center justify-center shadow-inner group">
              <img
                src={product.images[selectedImgIdx]}
                alt={`${product.title} - Main Preview image`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                referrerPolicy="no-referrer"
                id="gallery-slider-photo"
              />

              {/* SAVINGS CHIP */}
              {hasDiscount && (
                <span className="absolute left-4 top-4 rounded-xl bg-red-500 border border-red-400 px-3 py-1.5 text-xs font-black text-white shadow-md uppercase tracking-wider flex items-center gap-1">
                  <BadgePercent className="h-4.5 w-4.5 shrink-0" />
                  ৳{discountAmt} ছাড়!
                </span>
              )}

              {/* READY TO COOK CHIP */}
              {product.isReadyToCook && (
                <span className="absolute left-4 bottom-4 rounded-lg bg-orange-600/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-black text-white shadow-sm flex items-center gap-1 border border-orange-400">
                  <Sparkles className="h-3 w-3" />
                  রেডি-টু-কুক
                </span>
              )}

              {/* VERIFIED FARMER CHIP */}
              {product.isVerified && (
                <span className="absolute right-4 top-4 rounded-xl bg-blue-600 px-3 py-1 text-[10px] font-black text-white shadow border border-blue-400 uppercase tracking-wide flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 fill-blue-500 text-white shrink-0" />
                  নিরাপদ ফসল
                </span>
              )}

              {/* SLIDER NAVIGATION CHEVRONS */}
              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-700 flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-all outline-none border border-gray-100 shrink-0 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-emerald-700 flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-all outline-none border border-gray-100 shrink-0 cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                  </button>
                </>
              )}

              {/* DOTS PAGINATION WRAPPER */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/35 px-2.5 py-1 rounded-full text-white text-[9px] font-bold">
                {product.images.map((_, i) => (
                  <span 
                    key={i} 
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      selectedImgIdx === i ? 'w-3.5 bg-white' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* THUMBNAIL SELECTOR GALLERY WITH EXTREME CONTRAST & ACCESSIBLE TARGETS */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <span className="text-[10px] text-gray-400 font-bold uppercase font-sans tracking-wide">ফটো গ্যালারি ({product.images.length}টি বাস্তব ছবি)</span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <Info className="h-3 w-3 shrink-0" /> ছবি বড় করে দেখতে পরিবর্তন করুন
              </span>
            </div>

            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 scrollbar-none select-none">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`relative aspect-[4/3] w-16 sm:w-20 shrink-0 rounded-xl overflow-hidden border-2 bg-white transition-all shadow-xs cursor-pointer ${
                    selectedImgIdx === idx 
                      ? 'border-emerald-600 scale-[1.05] ring-4 ring-emerald-50' 
                      : 'border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.title} gallery thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {selectedImgIdx === idx && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <div className="bg-emerald-600 text-white rounded-full p-0.5 shadow-sm">
                        <Check className="h-2 w-2 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* TRIST TRUST SEALS BANNER */}
            <div className="mt-6 grid grid-cols-3 gap-2.5 text-center text-[10px] text-gray-500 font-sans border-t border-gray-100 pt-5">
              <div className="flex flex-col items-center p-2 rounded-xl bg-emerald-50/40 border border-emerald-100/50">
                <CircleCheck className="h-5 w-5 text-emerald-650 mb-1" />
                <span className="font-extrabold text-gray-800">১০০% অর্গানিক</span>
                <span className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">রাসায়নিক তরল মুক্ত</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-blue-50/40 border border-blue-100/50">
                <RefreshCw className="h-5 w-5 text-blue-650 mb-1" />
                <span className="font-extrabold text-gray-800">তাৎক্ষণিক রিটার্ন</span>
                <span className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">অসন্তোষে রিফান্ড</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded-xl bg-orange-50/40 border border-orange-100/50">
                <Gift className="h-5 w-5 text-orange-650 mb-1" />
                <span className="font-extrabold text-gray-800">তাজা সংগ্রহ</span>
                <span className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">মৌসুমের সেরা উপহার</span>
              </div>
            </div>

          </div>

          {/* COLUMN 2: BUYING INTERACTION PANEL (LG CLS: 6/12) */}
          <div className="lg:col-span-6 mt-8 lg:mt-0 flex flex-col justify-between">
            
            <div>
              {/* ADMIN EDIT SPEED BOARD */}
              {currentUser?.role === 'Admin' && onEditProduct && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 mb-4 flex items-center justify-between shadow-xs select-none">
                  <div>
                    <h5 className="text-[10px] sm:text-xs font-black text-amber-900 uppercase">🛡️ এডমিন প্রোডাক্ট ককপিট</h5>
                    <p className="text-[10px] text-amber-700/95 font-medium mt-0.5">নাম, মূল্য, বিবরণ বা ক্যাটাগরি সম্পাদন এবং পণ্য অপসারণ করুন</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEditProduct(product)}
                    className="rounded-xl bg-amber-550 hover:bg-amber-600 text-white px-4 py-2 text-xs font-black shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    ✏️ এডিট করুন (Edit)
                  </button>
                </div>
              )}

              {/* CATEGORY METADATA */}
              <div className="flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-100 text-[10px] font-black uppercase tracking-widest text-emerald-800 font-mono w-fit px-2.5 py-1">
                <span>বিভাগ: {product.category}</span>
              </div>

              {/* PRIMARY PRODUCT DISPLAY TITLE */}
              <h1 className="mt-3 text-2xl sm:text-3xl font-black text-gray-950 leading-snug font-sans tracking-tight">
                {product.title}
              </h1>

              {/* RATING SCORE & STOCK SUMMARY COMPACT ROW */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs border-b border-gray-100 pb-4">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`h-4.5 w-4.5 shrink-0 ${
                          s <= Math.floor(product.rating) 
                            ? 'fill-amber-550 text-amber-500' 
                            : 'text-gray-200'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-800 font-extrabold font-mono ml-0.5">{product.rating} / ৫.০</span>
                  <span className="text-gray-400 font-bold font-sans">({productReviews.length} রিভিউ সমূহ)</span>
                </div>

                <span className="text-gray-200">|</span>

                {/* COLOR-CODED ACCESSIBLE STOCK INDICATOR */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-500 font-medium">পণ্য স্থিতি:</span>
                  {product.stock > 0 ? (
                    product.stock < 10 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-[11px] font-black text-orange-850">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                        সীমিত স্টক (কয়েকটি {getFormattedUnit(product, language)} অবশিষ্ট!)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-250 px-2.5 py-0.5 text-[11px] font-black text-emerald-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        স্টক রয়েছে: {product.stock} {getFormattedUnit(product, language)}
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-[11px] font-black text-red-750">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      স্টক আউট
                    </span>
                  )}

                  {product.harvestDate && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-250 px-2.5 py-0.5 text-[11px] font-black text-amber-800">
                      📅 ফসল সংগ্রহ: {product.harvestDate}
                    </span>
                  )}
                </div>
              </div>

              {/* CORE PRICE MATRIX - EXTREMELY VISIBLE & BOLDER */}
              <div className="mt-5 rounded-2xl border border-gray-150-soft bg-gray-50/60 p-5 shadow-xs relative">
                <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
                  <span className="text-3xl sm:text-4.5xl font-black text-emerald-800 font-mono tracking-tight leading-none">
                    ৳{displayPrice}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-base sm:text-lg text-gray-400 line-through font-mono font-medium">
                        ৳{originalPrice}
                      </span>
                      <span className="inline-flex items-center gap-0.5 rounded-lg bg-red-50 border border-red-150 px-2 py-0.5 text-[10px] font-black text-red-700 tracking-wide font-sans">
                        {discountPercent}% ডিসকাউন্ট ছাড়!
                      </span>
                    </>
                  )}
                  <span className="text-xs text-gray-405 font-bold ml-1">
                    / প্রতি {getFormattedUnit(product, language)}
                  </span>
                </div>

                <div className="mt-3.5 flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase">প্রাইস রুলস:</span>
                    <span className="text-[10px] text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded">শুণ্য শতাংশ কমিশন</span>
                  </div>
                  <span className="text-[10.5px] text-gray-450 leading-relaxed max-w-[220px] text-right font-sans">
                    মাঠ থেকে সরাসরি সরবরাহ করা হয় বিধায় দাম কমানো সম্ভব হয়েছে।
                  </span>
                </div>
              </div>

              {/* COMPREHENSIVE DETAILED DESCRIPTION BOX */}
              <div className="mt-5">
                <h4 className="text-xs font-black text-gray-700 uppercase tracking-widest font-sans">ফসলের বিবরণ ও স্বাদ পরিচিতি:</h4>
                <div className="mt-2 bg-white rounded-xl border border-gray-100 p-3.5 text-xs text-gray-600 leading-relaxed font-sans shadow-inner">
                  {product.description || "এই খামারজাত ফসলটি সম্পূর্ণ বিশুদ্ধ ও কোনো কৃত্তিম কোল্ড স্টোরেজ রসায়ন ছাড়াই সংগ্রহ করা হয়েছে। স্বাদ অতুলনীয় এবং তাজা থাকার গ্যারান্টি।"}
                </div>
              </div>

              {/* ACCESS MANAGEMENT: QUANTITY CHANGER */}
              {product.stock > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-4 bg-gray-50/50 rounded-2xl border border-gray-100 p-3">
                  <span className="text-xs font-black text-gray-700 font-sans">প্রয়োজনীয় পরিমাণ নির্ধারণ করুন:</span>
                  
                  <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-xs max-w-fit">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDecrement(); }}
                      disabled={qty <= 1}
                      className="h-9 w-9 text-base font-black text-gray-450 hover:text-emerald-700 hover:bg-gray-50 flex items-center justify-center select-none cursor-pointer duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-black text-emerald-800 font-mono">
                      {qty}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleIncrement(); }}
                      disabled={qty >= product.stock}
                      className="h-9 w-9 text-base font-black text-gray-450 hover:text-emerald-700 hover:bg-gray-50 flex items-center justify-center select-none cursor-pointer duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-450 font-sans font-bold">
                    ({getFormattedUnit(product, language)} রিকুয়েস্ট করা হচ্ছে)
                  </span>
                </div>
              )}

              {/* CONVERT ACTION BUTTONS: ADD TO CART / BUY NOW */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  disabled={product.stock <= 0}
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-sans font-black shadow hover:shadow-md cursor-pointer transition-all active:scale-[0.97] duration-150 border uppercase tracking-wider ${
                    product.stock > 0
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-250 hover:bg-emerald-100'
                      : 'bg-gray-100 text-gray-400 border-gray-150 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-4.5 w-4.5 text-emerald-700" />
                  কার্টে যোগ করুন
                </button>
                <button
                  disabled={product.stock <= 0}
                  onClick={handleBuyNow}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-sans font-black shadow-lg hover:shadow-xl cursor-pointer transition-all active:scale-[0.97] duration-150 text-white uppercase tracking-wider ${
                    product.stock > 0
                      ? 'bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Coins className="h-4.5 w-4.5 text-white/90" />
                  সরাসরি কিনুন (Buy Now)
                </button>
              </div>

              {/* DYNAMIC COMPACT TRANSPORT INFORMATION CARDS */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-gray-100 pt-5 text-xs text-gray-750">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-gray-100 shadow-3xs">
                  <div className="rounded-xl bg-amber-50 p-2 text-amber-600 shrink-0">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-gray-800 leading-tight">১২-২৪ ঘণ্টার মধ্যে সরবরাহ</h5>
                    <p className="text-[10px] text-gray-450 mt-1 leading-normal font-sans">নিশ্চিত তাজা থাকার জন্য রাজশাহী ও যশোর খামার থেকে প্রতিদিন রাতে ট্রাকে করে ঢাকার হাবে আসে।</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-gray-100 shadow-3xs">
                  <div className="rounded-xl bg-blue-50 p-2 text-blue-600 shrink-0">
                    <Truck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-gray-800 leading-tight">মাত্র ৳৬০ হোম ডেলিভারি</h5>
                    <p className="text-[10px] text-gray-450 mt-1 leading-normal font-sans">সম্পূর্ণ ঢাকা সিটিতে কুরিয়ার চার্জ ফ্ল্যাট ৬০ টাকা। সরাসরি ক্যাশ-অন-ডেলিভারি গ্রহণের চমৎকার সুযোগ।</p>
                  </div>
                </div>
              </div>

            </div>

            {/* INTEGRATED FARMER INFORMATION BIO CARD */}
            {farmer && (
              <div 
                onClick={(e) => { e.stopPropagation(); onSelectFarmer(farmer.id); }}
                className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/20 p-4 transition-all hover:bg-emerald-50/45 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-3xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-emerald-300 bg-white shadow-sm shrink-0">
                    <img
                      src={farmer.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR}
                      alt={`${farmer.name} photo`}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-black text-gray-800 font-sans">{farmer.name}</h4>
                      {farmer.verified && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-blue-550 border border-blue-200 px-1.5 py-0.5 text-[8px] font-bold text-white uppercase font-mono tracking-wider">
                          ✔ Verified
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-gray-500">
                      <span className="flex items-center gap-0.5 font-bold font-sans">
                        <MapPin className="h-3.5 w-3.5 text-emerald-650 shrink-0" />
                        উৎপাদক এলাকা: {farmer.district}
                      </span>
                      <span>•</span>
                      <span className="font-extrabold text-gray-650">{farmer.salesCount}+ সফল বিক্রয়</span>
                      <span>•</span>
                      <span className="text-amber-600 font-extrabold">★ {farmer.rating}</span>
                    </div>
                  </div>
                </div>
                
                <span className="text-[10px] sm:text-[11px] font-sans font-black text-emerald-800 bg-white border border-emerald-200 hover:border-emerald-350 px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-xs transition duration-200 self-end sm:self-auto shrink-0">
                  <Store className="h-4 w-4 text-emerald-600" />
                  স্টোর ভিজিট
                </span>
              </div>
            )}

          </div>

        </div>

        {/* --- DETAILED TECHNICAL SPECIFICATIONS & MULTI-TAB CONTROLLER SECTION --- */}
        <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-4 sm:p-8 shadow-sm">
          
          {/* SECURED SEALS TAB BUTTONS */}
          <div className="flex border-b border-gray-100 pb-3 gap-6 overflow-x-auto select-none scrollbar-none">
            <button
              onClick={() => setActiveTab('details')}
              className={`text-xs font-black pb-2 transition-all cursor-pointer border-b-2 whitespace-nowrap uppercase tracking-wider ${
                activeTab === 'details' ? 'border-emerald-650 text-emerald-850 font-black' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              🌱 ফসলের বিস্তারিত ও চাষী তথ্য
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-xs font-black pb-2 transition-all cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-1.5 uppercase tracking-wider ${
                activeTab === 'reviews' ? 'border-emerald-650 text-emerald-850 font-black' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              💬 গ্রাহকদের মূল্যায়ন ও রেটিং ({productReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`text-xs font-black pb-2 transition-all cursor-pointer border-b-2 whitespace-nowrap uppercase tracking-wider ${
                activeTab === 'delivery' ? 'border-emerald-650 text-emerald-850 font-black' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              📦 ডেলিভারি ও শতভাগ মান পলিসি
            </button>
          </div>

          {/* ACTIVE CONTENT BLOCK AREA */}
          <div className="mt-6">
            
            {/* TAB CONTENT: PRODUCT SPECIFICATIONS INFORMATION MATRIX */}
            {activeTab === 'details' && (
              <div className="space-y-4 font-sans text-xs sm:text-sm text-gray-650 leading-relaxed">
                <p>
                  আমাদের এই নিখাদ <strong>{product.title}</strong> সরাসরি রাজশাহী ও যশোর অঞ্চলের নিবন্ধিত খামার থেকে সংগ্রহ করা হয়। ফসল কাটা থেকে শুরু করে আমাদের হাব-এ পৌঁছানো এবং পরবর্তীতে হোম ডেলিভারি নিশ্চিত করার পুরো স্তর শতভাগ কঠোরভাবে তদারকি করা হয়ে থাকে যেন আপনি প্রাকৃতিক গুণ সমৃদ্ধ আসল স্বাদের নিশ্চয়তা পান।
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 shadow-inner">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-450 font-bold">উৎপাদক চাষী:</span>
                    <span className="text-gray-800 font-extrabold">{product.farmerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-455 font-bold">ফসল সংগ্রহের এলাকা:</span>
                    <span className="text-gray-800 font-extrabold">{farmer?.district || 'বাংলাদেশ অঞ্চল'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-455 font-bold">সার ও কীটনাশক মানদণ্ড:</span>
                    <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                      <CircleCheck className="h-4 w-4 shrink-0" /> শতভাগ কৃত্তিম প্রিজারভেটিভ বিহীন
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-455 font-bold">সংগ্রহ তারিখ ও সতেজতা স্থিতি:</span>
                    <span className="text-emerald-700 font-extrabold">সরাসরি ক্ষেত থেকে তাজা হোম ডেলিভারি</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-455 font-bold">সার্টিফাইড খামার রেটিং:</span>
                    <span className="text-amber-600 font-extrabold">★ {farmer?.rating || 4.9} / ৫.০ গোল্ড স্ট্যাটাস</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-455 font-bold">প্যাকিং স্টাইল বিবরণ:</span>
                    <span className="text-gray-700 font-extrabold">বায়ুচলাচল সুবিধাযুক্ত অর্গানিক চটের ব্যাগ</span>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl border border-yellow-100 bg-yellow-50/20 text-xs text-yellow-800 font-sans leading-relaxed flex items-start gap-2">
                  <Info className="h-4.5 w-4.5 text-yellow-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>মহামূল্যবান তথ্য নোট:</strong> কৃত্তিমভাবে পাকানো ফল বা কন্দ জাতীয় ফসলে কৃত্তিম রাসায়নিক তরলের ছিটানো দূর করতে আমরা সম্পূর্ণ কঠোর প্রতিরোধ ব্যবস্থা বজায় রাখি। তাই আমাদের আম, কলা বা অন্যান্য তাজা ফল দেখতে কিছুটা অমসৃণ হতে পারে কিন্তু স্বাদে পাবেন প্রাচীন খাঁটি সতেজতা।
                  </span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: DELIVERY INFORMATION & RETURN ASSURANCES */}
            {activeTab === 'delivery' && (
              <div className="space-y-4 text-xs sm:text-sm text-gray-650 leading-relaxed font-sans">
                <div className="border-l-4 border-emerald-500 pl-3">
                  <h4 className="font-extrabold text-gray-800 uppercase text-xs sm:text-sm tracking-wider">ডেলিভারি প্রক্রিয়াকরণ নোটিশ</h4>
                  <p className="mt-1">
                    ক্রেতা অর্ডার সম্পূর্ণ সম্পন্ন করার পর খামারি তার বাগান বা ফসলি জমি থেকে তাজা ফসল সরাসরি সংগ্রহ শুরু করেন। সাধারণত রাত ৮টার মধ্যে কনফার্ম অর্ডার সমূহ পরবর্তী ১২ ঘণ্টার মধ্যে ঢাকার গ্রাহকদের ঠিকানায় পৌঁছে দেওয়া নিশ্চিত করা হয়। ঢাকার বাইরের অর্ডার ৩ কার্যদিবসের মধ্যে ট্র্যাকিং লিংকের মাধ্যমে ডেলিভারি দিয়ে থাকি।
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-3 mt-4">
                  <h4 className="font-extrabold text-gray-800 uppercase text-xs sm:text-sm tracking-wider">তাত্ক্ষণিক ক্যাশব্যাক বা ড্যামেজ রিটার্ন গ্যারান্টি</h4>
                  <p className="mt-1">
                    ঢাকায় ডেলিভারি পাওয়ার সময়ে যদি কোনো একটি ফল বা ফসলের গুণ মানে ঘাটতি বা পচে যাওয়ার নজির পান, দয়া করে ডেলিভারি কুরিয়ার প্রতিনিধির উপস্থিতিতে আমাদের সাপোর্ট টিমে ছবি সহ পাঠান। আমরা কোনো বাড়তি প্রশ্ন ছাড়াই সম্পূর্ণ ফ্রিতে বিকল্প ফসল সরবরাহ করব অথবা সম্পূর্ণ নগদ টাকা রিটার্ন সম্পন্ন করব।
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-3 mt-4">
                  <h4 className="font-extrabold text-gray-800 uppercase text-xs sm:text-sm tracking-wider">অফিসিয়াল যোগাযোগ বা কল সেন্টার</h4>
                  <p className="mt-1">
                    যেকোনো বিশেষ প্রশ্ন, কাস্টম বড় সাইজের বাগান অর্ডার কিংবা ডেলিভারি রিলেটেড স্পিডি ফিডব্যাকের তথ্যের জন্য অফিশিয়াল নম্বরে যোগাযোগ করুন: <strong className="text-emerald-700 select-all font-mono ml-0.5">০১৯৩৯-০৫২২৫৭</strong>।
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: HISTORIC USER REVIEWS & INTERACTIVE SUBMISSION PANEL */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                
                {/* ADVANCED RATINGS DISTRIBUTION DASHBOARD METRICS SUMMARY */}
                <div className="p-5 bg-gradient-to-br from-gray-50 to-emerald-50/20 rounded-3xl border border-gray-150-soft flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <div className="text-center shrink-0 w-full md:w-fit border-b md:border-b-0 md:border-r border-gray-250-soft pb-4 md:pb-0 md:pr-10">
                    <span className="text-xs uppercase font-extrabold text-gray-450 block tracking-wider">গড় রেটিং মার্ক</span>
                    <strong className="text-4xl sm:text-5xl font-black text-gray-950 font-mono mt-1 block">
                      {product.rating}
                    </strong>
                    <div className="flex justify-center text-amber-500 mt-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`h-4.5 w-4.5 ${s <= Math.round(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10.5px] text-gray-400 font-bold block mt-1">সর্বমোট {totalReviewsCount} জন ক্রেতার ভোট</span>
                  </div>

                  {/* STARS SATISFACTION PROGRESS BAR CHART */}
                  <div className="flex-1 w-full space-y-2">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2.5">ক্রেতা সন্তুষ্টির বিশ্লেষণ গ্রাফ</span>
                    
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = starDistribution[stars - 1];
                      const percent = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                      return (
                        <div key={stars} className="flex items-center gap-3 text-xs">
                          <span className="w-14 text-gray-500 font-bold text-right font-mono flex items-center justify-end gap-1 select-none">
                            {stars} Star 
                          </span>
                          <div className="flex-1 h-2 bg-gray-200/70 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-450 rounded-full transition-all duration-500" 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="w-12 text-gray-450 font-bold font-mono text-left select-none">
                            {percent}% ({count})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* FORM FOR SUBMITTING FRESH CLIENT OPINION */}
                <form 
                  onSubmit={handleReviewSubmission} 
                  className="p-5 sm:p-6 bg-white rounded-2xl border-2 border-emerald-50/80 shadow-3xs"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <MessageSquare className="h-5 w-5 text-emerald-650" />
                    <h4 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wider">এই ফসলের আপনার ব্যক্তিগত অভিজ্ঞতা শেয়ার করুন</h4>
                  </div>
                  <p className="text-[11px] text-gray-450 mb-4 leading-relaxed">আপনার পাঠানো রিভিউ সরাসরি এই খামারীর ড্যাশবোর্ডে তালিকাভুক্ত হবে এবং তাকে ভালো মান তৈরিতে অনুপ্রাণিত করবে।</p>
                  
                  {reviewSuccessMsg && (
                    <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-bold">
                      {reviewSuccessMsg}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-701 font-sans">আপনার রেটিং মার্ক নির্বাচন করুন:</span>
                      <div className="flex gap-1.5 select-none shrink-0">
                        {[1, 2, 3, 4, 5].map((stars) => (
                          <button
                            key={stars}
                            type="button"
                            onClick={() => setRatingInput(stars)}
                            className="text-amber-500 hover:scale-115 transition-all outline-none cursor-pointer"
                          >
                            <Star className={`h-5.5 w-5.5 ${stars <= ratingInput ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-bold text-gray-700 mb-1">মন্তব্য ও স্বাদ বিবরণী:</label>
                    <textarea
                      rows={3}
                      placeholder="ফসলের প্যাকিং কেমন ছিল? তাজা ছিল কিনা এবং স্বাদ সম্পর্কে বিস্তারিত তথ্য দিন যেন অন্যরা সাহায্য পায়..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs font-sans text-gray-750 outline-none focus:bg-white focus:border-emerald-500 transition-all leading-normal"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="mt-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-650 hover:from-emerald-700 hover:to-green-700 px-5 py-2.5 text-xs font-black text-white shadow-md hover:shadow-lg transition-all active:scale-[0.96] cursor-pointer"
                  >
                    রিভিউ পর্যালোচনা সাবমিট করুন ✔
                  </button>
                </form>

                {/* REVIEW ACCORDION CARDS LIST WITH HELPFULNESS CLICK MOCK */}
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-widest block mb-4 border-b border-gray-100 pb-2">আমাদের ক্রেতা মতামত ল্যাব ({productReviews.length}টি পোস্ট)</h4>
                  
                  {productReviews.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <PackageOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs text-gray-450 font-bold">এই পন্যটির জন্য এখন পর্যন্ত কোনো সুনির্দিষ্ট রিভিউ দেওয়া হয়নি।</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">প্রথম চমৎকার রিভিউটি প্রদান করে খামারিকে আনন্দিত করুন!</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {productReviews.slice().reverse().map((rev, index) => {
                        const isHelpfulActive = helpfulLikes[rev.id || `${index}`];
                        const mockHelpfulCount = (rev.id ? parseInt(rev.id.replace(/\D/g, '')) % 12 || 2 : 3) + (isHelpfulActive ? 1 : 0);

                        return (
                          <div key={rev.id || index} className="border-b border-gray-100 pb-5 last:border-b-0 animate-fadeIn">
                            <div className="flex items-start justify-between gap-4">
                              
                              <div className="flex items-start gap-3">
                                {/* CUSTOMER INITIAL AVATAR CONTAINER */}
                                <div className="h-10 w-10 shrink-0 bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-800 rounded-full flex items-center justify-center font-black border border-emerald-250 shadow-inner text-xs">
                                  {rev.avatar || rev.customerName[0] || 'C'}
                                </div>
                                
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-black text-gray-800">{rev.customerName}</span>
                                    {rev.isVerifiedPurchase && (
                                      <span className="inline-flex items-center rounded-sm bg-emerald-50 border border-emerald-150 px-1 py-0.5 text-[8px] font-black text-emerald-700 uppercase">
                                        ✓ Verified Customer
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* RATING SCORE SUBMETRICS */}
                                  <div className="mt-1 flex items-center gap-2 flex-wrap text-[10px] text-gray-450 font-sans">
                                    <span className="flex items-center gap-0.5 font-semibold">
                                      <MapPin className="h-3 w-3 text-gray-400" /> {rev.location}
                                    </span>
                                    <span>•</span>
                                    <div className="flex text-amber-500">
                                      {[1, 2, 3, 4, 5].map((s) => (
                                        <Star 
                                          key={s} 
                                          className={`h-3 w-3 ${s <= Math.round(rev.rating) ? 'fill-amber-550 text-amber-505' : 'text-gray-200'}`} 
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* HELPFUL INTERACTIVE VOTE BUTTON */}
                              <button
                                onClick={() => toggleReviewHelpfulness(rev.id || `${index}`)}
                                className={`inline-flex items-center gap-1 text-[10px] sm:text-xs px-2.5 py-1 rounded-xl border transition-all cursor-pointer select-none active:scale-95 ${
                                  isHelpfulActive 
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-750 font-black' 
                                    : 'bg-white border-gray-200 text-gray-450 hover:text-gray-700 hover:border-gray-300'
                                }`}
                              >
                                <ThumbsUp className={`h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 ${isHelpfulActive ? 'fill-emerald-750 text-emerald-750' : 'text-gray-400'}`} />
                                <span>সাহায্যকারী ({mockHelpfulCount})</span>
                              </button>

                            </div>

                            <p className="mt-2 text-xs text-gray-650 font-sans pl-13 pr-4 leading-relaxed font-medium">
                              {rev.comment}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>

        </div>

        {/* --- SECTION 1: RELATED CROPS SUGGESTIONS GRID --- */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-3 flex-wrap gap-2">
              <h3 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-emerald-650" />
                একই বিভাগের অন্যান্য সতেজ কৃষিপণ্য (Related Crops)
              </h3>
              <span className="text-[10px] text-gray-400 font-bold">নিরাপদ উৎস ও তাজা নিশ্চয়তা</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => {
                const pPrice = p.discountPrice || p.price;
                return (
                  <div 
                    key={p.id}
                    onClick={() => onSelectProduct(p.id)}
                    className="group rounded-2xl border border-gray-150-soft p-2.5 bg-white hover:shadow-lg hover:border-emerald-250 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 shrink-0 shadow-inner">
                      <img 
                        src={p.images[0]} 
                        alt={p.title} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        referrerPolicy="no-referrer" 
                      />
                      {p.discountPrice && (
                        <span className="absolute left-2 top-2 rounded bg-red-500 border border-red-400 px-1.5 py-0.5 text-[8px] font-black text-white">
                          ৳{p.price - p.discountPrice} ছাড়!
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[11px] sm:text-[12px] font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-emerald-700 transition duration-150">
                          {p.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 block mt-0.5 font-bold">{p.farmerName}</span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[12px] sm:text-[13px] font-black text-emerald-800 font-mono">
                          ৳{pPrice} <span className="text-[10px] font-sans font-bold text-gray-400">/{getFormattedUnit(p, language)}</span>
                        </span>
                        
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-150 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 px-2 py-1 rounded transition duration-200">
                          বিস্তারিত
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- SECTION 2: MORE FROM SAME FARMER GRID --- */}
        {propsWithSameFarmer.length > 0 && (
          <div className="mt-8 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-12">
            <div className="flex items-center justify-between mb-5 border-b border-gray-50 pb-3 flex-wrap gap-2">
              <h3 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-1.5">
                <Store className="h-4.5 w-4.5 text-emerald-650" />
                একই কৃষকের বাগান থেকে আরো সংগ্রহ (More from this Farmer)
              </h3>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">একই শিপিং চার্জে অর্ডার করুন</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {propsWithSameFarmer.map((p) => {
                const pPrice = p.discountPrice || p.price;
                return (
                  <div 
                    key={p.id}
                    onClick={() => onSelectProduct(p.id)}
                    className="group rounded-2xl border border-gray-150-soft p-2.5 bg-white hover:shadow-lg hover:border-emerald-250 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 shrink-0 shadow-inner">
                      <img 
                        src={p.images[0]} 
                        alt={p.title} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>

                    <div className="mt-2.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[11px] sm:text-[12px] font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-emerald-700 transition duration-150">
                          {p.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 block mt-0.5 font-bold">শুপার ট্রাস্ট ফসল</span>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[12px] sm:text-[13px] font-black text-emerald-800 font-mono">
                          ৳{pPrice} <span className="text-[10px] font-sans font-bold text-gray-400">/{getFormattedUnit(p, language)}</span>
                        </span>
                        
                        <span className="text-[9px] font-bold text-emerald-850 bg-emerald-50 border border-emerald-150 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 px-2.5 py-1 rounded transition duration-200">
                          অর্ডার দেখুন
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
