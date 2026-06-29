/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp, convertGoogleDriveLink } from '../AppContext';
import { Product, Farmer, Review, getFormattedUnit, getProductPackOptions, PackOption } from '../types';
import { LazyImage } from './LazyImage';
import { isDefaultPresettedImage } from '../utils';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
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
  MessageCircle,
  Sparkles,
  RefreshCw,
  Gift,
  HelpCircle
} from 'lucide-react';
import { FEMALE_AVATAR, MALE_AVATAR } from '../assets';

export function getProductImages(product?: Product | null): string[] {
  if (!product) return [];
  const list: string[] = [];
  
  if (product.images && product.images.length > 0) {
    product.images.forEach(img => {
      if (img && img.trim()) {
        list.push(img.trim());
      }
    });
  }
  
  if (product.googleDriveFolderUrl && product.googleDriveFolderUrl.trim()) {
    list.push(product.googleDriveFolderUrl.trim());
  }

  const uniqueList = Array.from(new Set(list));
  
  // Separate custom VS preset/seeded images. If there are custom images,
  // we do NOT pad with default fallbacks, we ONLY show the actual pasted/uploaded ones.
  const customList = uniqueList.filter(img => !isDefaultPresettedImage(img));
  if (customList.length > 0) {
    return customList.slice(0, 5);
  }

  const cat = (product.category || 'organic').toLowerCase();
  
  const categoryFallbacks: Record<string, string[]> = {
    vegetables: [
      'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800',
      'https://images.unsplash.com/photo-1566385101042-1a010c159f81?w=800',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
      'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=800'
    ],
    fruits: [
      'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=800',
      'https://images.unsplash.com/photo-1519996521430-02b798c1d881?w=800',
      'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800',
      'https://images.unsplash.com/photo-1610832958506-ee5633619144?w=800',
      'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800'
    ],
    rice: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
      'https://images.unsplash.com/photo-1574325131876-ae2b0805c52b?w=800',
      'https://images.unsplash.com/photo-1536304997881-a372c179924b?w=800',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800'
    ],
    fish: [
      'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
      'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=800',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      'https://images.unsplash.com/photo-1604313251413-4fd779a1fec9?w=800'
    ],
    meat: [
      'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800',
      'https://images.unsplash.com/photo-1587593810167-a8597a8e2a8a?w=800',
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      'https://images.unsplash.com/photo-1602489228247-320af6411f9d?w=800',
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800'
    ],
    organic: [
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800',
      'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=800',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
      'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=805'
    ]
  };

  let fallbacks = categoryFallbacks.organic;
  const normalizedCat = cat.replace(/\s+/g, '');
  if (normalizedCat.includes('vege') || normalizedCat.includes('সবজি') || normalizedCat.includes('শাক')) {
    fallbacks = categoryFallbacks.vegetables;
  } else if (normalizedCat.includes('fruit') || normalizedCat.includes('ফল')) {
    fallbacks = categoryFallbacks.fruits;
  } else if (normalizedCat.includes('rice') || normalizedCat.includes('চাল') || normalizedCat.includes('ডাল') || normalizedCat.includes('শস্য') || normalizedCat.includes('grain')) {
    fallbacks = categoryFallbacks.rice;
  } else if (normalizedCat.includes('fish') || normalizedCat.includes('মাছ')) {
    fallbacks = categoryFallbacks.fish;
  } else if (normalizedCat.includes('meat') || normalizedCat.includes('মাংস') || normalizedCat.includes('চিকেন') || normalizedCat.includes('গরু') || normalizedCat.includes('খাসি')) {
    fallbacks = categoryFallbacks.meat;
  } else if (normalizedCat.includes('dairy') || normalizedCat.includes('দুধ') || normalizedCat.includes('ঘি') || normalizedCat.includes('ডিম') || normalizedCat.includes('মধু') || normalizedCat.includes('honey')) {
    fallbacks = [
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800',
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800',
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800',
      'https://images.unsplash.com/photo-1486887396153-fa416525c108?w=800',
      'https://images.unsplash.com/photo-1528750901443-e986c702604e?w=800'
    ];
  }

  let iIdx = 0;
  while (uniqueList.length < 5) {
    const fallbackImg = fallbacks[iIdx % fallbacks.length];
    if (!uniqueList.includes(fallbackImg)) {
      uniqueList.push(fallbackImg);
    }
    iIdx++;
  }

  return uniqueList.slice(0, 5);
}

interface ProductDetailsPageProps {
  productId: string;
  onBack: () => void;
  onSelectFarmer: (farmerId: string) => void;
  onSelectProduct: (productId: string) => void;
  onEditProduct?: (product: Product) => void;
  onToggleCompare?: (productId: string) => void;
  isCompared?: boolean;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ 
  productId, 
  onBack, 
  onSelectFarmer, 
  onSelectProduct,
  onEditProduct,
  onToggleCompare,
  isCompared
}) => {
  const { products, farmers, reviews, addToCart, addReview, currentUser, language, editProduct } = useApp();
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab ] = useState<'details' | 'reviews' | 'delivery'>('details');

  // Touchgestures state for swipeable carousel
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNextImage();
    } else if (distance < -minSwipeDistance) {
      handlePrevImage();
    }
  };

  // Interactive review submission states
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);

  // Helpfulness toggle mock state
  const [helpfulLikes, setHelpfulLikes] = useState<Record<string, boolean>>({});
  const [chatModalOpen, setChatModalOpen] = useState(false);

  const product = products.find(p => p.id === productId);

  // Listen to window-wide pasting events for Admins to easily paste new pictures/links directly on the product detail page
  useEffect(() => {
    if (currentUser?.role !== 'Admin') return;
    if (!product) return;

    const handleGlobalPaste = async (e: ClipboardEvent) => {
      // Avoid intercepting if user is actively writing a comment
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true')) {
        return;
      }

      const text = e.clipboardData?.getData('text');
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.includes('drive.google.com'))) {
        e.preventDefault();
        const cleanedUrl = convertGoogleDriveLink(text.trim());
        
        // Remove old pre-seeded unsplash URLs and keep only the custom ones
        const currentImages = (product.images || []).filter(img => img && !isDefaultPresettedImage(img));
        
        if (!currentImages.includes(cleanedUrl)) {
          const updatedImages = [...currentImages, cleanedUrl].slice(0, 5);
          editProduct(product.id, { images: updatedImages });
          alert(`নতুন লিঙ্ক সফলভাবে পণ্য ফটো গ্যালারিতে সরাসরি পেস্ট করা হয়েছে! (${updatedImages.length}/5)`);
          setSelectedImgIdx(updatedImages.length - 1);
        }
        return;
      }

      // Check for file pastes (e.g. copied screenshots)
      const files = e.clipboardData?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          e.preventDefault();
          try {
            let downloadUrl = '';
            if (storage) {
              const fileRef = ref(storage, `products/${Date.now()}_paste_${Math.random().toString(36).substring(2, 7)}_${file.name}`);
              await uploadBytes(fileRef, file);
              downloadUrl = await getDownloadURL(fileRef);
            } else {
              downloadUrl = await new Promise<string>((res) => {
                const r = new FileReader();
                r.onload = () => res(r.result as string);
                r.readAsDataURL(file);
              });
            }
            const currentImages = (product.images || []).filter(img => img && !isDefaultPresettedImage(img));
            const updatedImages = [...currentImages, downloadUrl].slice(0, 5);
            editProduct(product.id, { images: updatedImages });
            alert(`ডিভাইস ফটো কপি-পেস্ট সফলভাবে সম্পন্ন হয়েছে! (${updatedImages.length}/5)`);
            setSelectedImgIdx(updatedImages.length - 1);
          } catch (err) {
            console.error("Direct paste file upload failed:", err);
            alert("ডিভাইস ফটো সরাসরি পেস্টে সমস্যা হয়েছে।");
          }
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => {
      window.removeEventListener('paste', handleGlobalPaste);
    };
  }, [product, currentUser, editProduct]);

  // Packaging selection states
  const packOptions = React.useMemo(() => {
    return product ? getProductPackOptions(product) : [];
  }, [product]);

  const [selectedPackId, setSelectedPackId] = useState<string>('');
  const [selectedVariationId, setSelectedVariationId] = useState<string>('');

  const selectedVariation = React.useMemo(() => {
    if (!product || !product.variations || product.variations.length === 0) return null;
    return product.variations.find(v => v.id === selectedVariationId) || product.variations[0];
  }, [product, selectedVariationId]);

  const activeOption = React.useMemo(() => {
    return packOptions.find(o => o.id === selectedPackId) || packOptions[0];
  }, [packOptions, selectedPackId]);

  const productImages = React.useMemo(() => {
    return getProductImages(product);
  }, [product]);

  // Synchronize dynamic packaging selection on startup or item change
  useEffect(() => {
    if (product && packOptions.length > 0) {
      setSelectedPackId(packOptions[1]?.id || packOptions[0]?.id || '1');
    }
    if (product && product.variations && product.variations.length > 0) {
      setSelectedVariationId(product.variations[0].id);
    } else {
      setSelectedVariationId('');
    }
  }, [productId, packOptions, product]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center font-sans">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4 font-sans">
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
  const baseDisplayPrice = selectedVariation && selectedVariation.price !== undefined
    ? selectedVariation.price
    : (product.discountPrice || product.price);
  const baseOriginalPrice = selectedVariation && selectedVariation.price !== undefined
    ? (product.discountPrice ? Math.round(selectedVariation.price * (product.price / product.discountPrice)) : selectedVariation.price)
    : product.price;
  const hasDiscount = !!product.discountPrice;

  const packMultiplier = activeOption?.multiplier || 1;
  const packLabelBn = activeOption?.labelBn || product?.unit || 'পিস';
  const packLabelEn = activeOption?.labelEn || product?.unit || 'piece';

  const displayPrice = Math.round(baseDisplayPrice * packMultiplier);
  const originalPrice = Math.round(baseOriginalPrice * packMultiplier);
  const discountAmt = originalPrice - displayPrice;
  const discountPercent = Math.round(((baseOriginalPrice - baseDisplayPrice) / baseOriginalPrice) * 100);

  const getFarmerPhone = () => {
    const rawPhone = farmer?.phone || '01931355398';
    const clean = rawPhone.replace(/\D/g, '');
    if (clean.startsWith('88')) {
      return clean;
    }
    if (clean.startsWith('0')) {
      return '88' + clean;
    }
    return '880' + clean;
  };

  const getWhatsappLink = () => {
    const phoneNum = getFarmerPhone();
    const text = language === 'bn'
      ? `আসসালামু আলাইকুম ${farmer?.name || 'খামারি ভাই'}, আমি কৃষক বাজার প্ল্যাটফর্ম থেকে আপনার উৎপাদিত "${product.title}" ফসলটি সম্পর্কে বিস্তারিত জানতে আগ্রহী।\nআইডি: ${product.id}\nমূল্য: ৳${displayPrice}`
      : `Assalamu Alaikum ${farmer?.name || 'Farmer'}, I am interested in your organic crop "${product.title}" listed on Krishok Bazar.\nProduct ID: ${product.id}\nPrice: ৳${displayPrice}`;
    return `https://wa.me/${phoneNum}?text=${encodeURIComponent(text)}`;
  };

  const getMessengerLink = () => {
    const text = language === 'bn'
      ? `আসসালামু আলাইকুম, আমি খামারি ${farmer?.name || ''}-এর উৎপাদিত "${product.title}" ফসলটি সম্পর্কে বিস্তারিত কথা বলতে চাই।`
      : `Hello, I would like to chat about "${product.title}" from farmer ${farmer?.name || ''}.`;
    return `https://m.me/krishokbazar?text=${encodeURIComponent(text)}`;
  };

  const handleIncrement = () => {
    if (qty < product.stock) setQty(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (qty > 1) setQty(prev => prev - 1);
  };

  const handleAddToCart = () => {
    addToCart(product, qty, displayPrice, language === 'bn' ? packLabelBn : packLabelEn, selectedVariation || undefined);
  };

  const handleBuyNow = () => {
    addToCart(product, qty, displayPrice, language === 'bn' ? packLabelBn : packLabelEn, selectedVariation || undefined);
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
    setSelectedImgIdx(prev => (prev + 1) % productImages.length);
  };

  const handlePrevImage = () => {
    setSelectedImgIdx(prev => (prev - 1 + productImages.length) % productImages.length);
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
            
            {/* LARGE VIEWPORT BOX WITH NAVIGATION CHEVRONS & TOUCH SWIPE */}
            <div 
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className="relative overflow-hidden rounded-2xl border border-gray-150 bg-gray-50 aspect-square w-full flex items-center justify-center shadow-inner group cursor-grab active:cursor-grabbing select-none touch-pan-y"
              title="Swipe left or right to change images"
            >
              <LazyImage
                src={
                  selectedImgIdx === 0 && product.googleDriveFolderUrl
                    ? convertGoogleDriveLink(product.googleDriveFolderUrl)
                    : convertGoogleDriveLink(productImages[selectedImgIdx])
                }
                alt={`${product.title} - Main Preview image`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                referrerPolicy="no-referrer"
                onError={() => {}}
              />

              {/* MOBILE SWIPE GESTURE HIGHLIGHT BADGE */}
              {productImages.length > 1 && (
                <span className="absolute right-3.5 bottom-3.5 rounded-lg bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[8.5px] font-black text-white shadow-xs flex items-center gap-1 border border-white/10 sm:hidden select-none animate-pulse">
                  ↔ সোয়াইপ করুন
                </span>
              )}

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
              {productImages.length > 1 && (
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
                {productImages.map((_, i) => (
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
              <span className="text-[10px] text-gray-400 font-bold uppercase font-sans tracking-wide">ফটো গ্যালারি ({productImages.length}টি বাস্তব ছবি)</span>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <Info className="h-3 w-3 shrink-0" /> ছবি বড় করে দেখতে পরিবর্তন করুন
              </span>
            </div>

            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 scrollbar-none select-none">
              {productImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`relative aspect-square w-16 sm:w-20 shrink-0 rounded-xl overflow-hidden border-2 bg-white transition-all shadow-xs cursor-pointer ${
                    selectedImgIdx === idx 
                      ? 'border-emerald-600 scale-[1.05] ring-4 ring-emerald-50' 
                      : 'border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  <LazyImage
                    src={
                      idx === 0 && product.googleDriveFolderUrl
                        ? convertGoogleDriveLink(product.googleDriveFolderUrl)
                        : convertGoogleDriveLink(imgUrl)
                    }
                    alt={`${product.title} gallery thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => {}}
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
              {/* DYNAMIC PARTNER EDIT Cockpit */}
              {((currentUser?.role === 'Admin') || (currentUser?.role === 'Farmer' && currentUser.farmerId === product.farmerId)) && onEditProduct && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 mb-4 flex items-center justify-between shadow-xs select-none">
                  <div>
                    <h5 className="text-[10px] sm:text-xs font-black text-amber-900 uppercase">
                      {currentUser?.role === 'Admin' ? '🛡️ এডমিন প্রোডাক্ট ককপিট' : '🌾 খামারি এডিট প্যানেল'}
                    </h5>
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

                  {/* 📊 SMART INVENTORY & HARVEST CERTIFICATE BAR */}
                <div className="flex-1 w-full mt-2 pt-2 border-t border-gray-150">
                  <div className="flex items-center justify-between gap-2 flex-wrap text-[10.5px]">
                    <div>
                      {product.stock <= 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-red-600">
                          🔴 স্টক শেষ (Out of Stock)
                        </span>
                      ) : product.stock < 10 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-red-500 animate-pulse">
                          ⚠ আশঙ্কাজনক স্বল্পতা! এখনই নিন
                        </span>
                      ) : product.stock <= 30 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-700 font-sans">
                          🟡 মধ্যম স্টক (আজই সরবরাহপ্রাপ্ত)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 font-sans">
                          🟢 পর্যাপ্ত স্টক (Instant Shipping)
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-250 px-2 py-0.5 font-bold text-amber-800 font-sans">
                        📅 ফসল সংগ্রহকাল: <strong className="font-extrabold">{product.harvestDate || 'May 30, 2026'}</strong>
                      </span>
                    </div>
                  </div>
                </div>

              {/* CORE PRICE MATRIX - EXTREMELY VISIBLE & BOLDER */}
              <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5 shadow-xs overflow-hidden w-full max-w-full">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 w-full">
                  <div className="flex items-baseline flex-wrap gap-x-2.5 gap-y-1 min-w-0">
                    <span className="text-2xl sm:text-4xl font-black text-emerald-850 font-sans tracking-tight">
                      ৳{displayPrice}
                    </span>
                    {hasDiscount && (
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <span className="text-sm sm:text-base text-gray-400 line-through font-mono font-medium">
                          ৳{originalPrice}
                        </span>
                        <span className="inline-flex items-center rounded-lg bg-red-50 border border-red-150 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black text-red-700 tracking-wide font-sans">
                          {discountPercent}% ডিসকাউন্ট ছাড়!
                        </span>
                      </div>
                    )}
                    <span className="text-xs text-gray-500 font-bold font-sans">
                      / {product.isReadyToCook ? (language === 'bn' ? 'প্যাকেট' : 'Packet') : (language === 'bn' ? `প্রতি ${packLabelBn}` : `per ${packLabelEn}`)}
                    </span>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] text-gray-400 uppercase font-mono block leading-none">
                      মোট মূল্য ({qty} {product.isReadyToCook ? (language === 'bn' ? 'প্যাকেট' : 'Packet') : (language === 'bn' ? packLabelBn : packLabelEn)})
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-800 block mt-1 font-mono">
                      ৳{displayPrice * qty}
                    </span>
                  </div>
                </div>

                {/* Product Variations selection */}
                {product.variations && product.variations.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t border-dashed border-gray-200">
                    <span className="block text-xs font-black text-gray-700 mb-2.5 flex items-center gap-1.5 font-sans">
                      ✨ {language === 'bn' ? 'পছন্দের প্রকার বা সাইজ নির্বাচন করুন:' : 'Select Variation / Size:'}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-sans">
                      {product.variations.map((v) => {
                        const isSelected = selectedVariationId === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVariationId(v.id)}
                            className={`flex flex-col justify-center items-center text-center cursor-pointer p-2.5 rounded-xl border transition-all duration-150 ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 shadow-xs font-black'
                                : 'border-gray-200 bg-white hover:bg-slate-50 text-gray-650'
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-bold">{language === 'bn' ? v.nameBn : v.nameEn}</span>
                            <span className="text-[10.5px] mt-0.5 text-emerald-700 font-mono font-bold">
                              {v.price ? `৳${v.price}` : (language === 'bn' ? 'বেস প্রাইস' : 'Base Price')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Clickable Packaging card selector */}
                {packOptions.length > 0 && (
                  <div className="mt-4 pt-3.5 border-t border-dashed border-gray-200">
                    <span className="block text-xs font-black text-gray-700 mb-2.5 flex items-center gap-1 font-sans">
                      📦 {product.isReadyToCook ? 'প্যাকেট সাইজ ও সংখ্যা সিলেক্ট করুন (Select Packet Option):' : 'প্যাকেজিং ওজন ও পরিমাণ সিলেক্ট করুন (Select Packaging Option):'}
                    </span>
                    
                    <div className="grid grid-cols-3 gap-2 sm:gap-2.5 font-sans">
                      {packOptions.map((opt, oIdx) => {
                        // For Ready to Cook, change label display to packet quantities
                        let customOptionLabelBn = language === 'bn' ? opt.labelBn : opt.labelEn;
                        if (product.isReadyToCook) {
                          if (oIdx === 0) customOptionLabelBn = language === 'bn' ? '১ প্যাকেট' : '1 Packet';
                          else if (oIdx === 1) customOptionLabelBn = language === 'bn' ? '২ প্যাকেট (পপুলার)' : '2 Packets (Popular)';
                          else customOptionLabelBn = language === 'bn' ? '৫ প্যাকেট (ফ্যামিলি)' : '5 Packets (Family)';
                        }
                        const isSelected = selectedPackId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedPackId(opt.id)}
                            className={`flex flex-col justify-center items-center text-center cursor-pointer p-2.5 rounded-xl border transition-all duration-150 ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50/40 text-emerald-900 shadow-xs font-black'
                                : 'border-gray-200 bg-white hover:bg-slate-50 text-gray-650'
                            }`}
                          >
                            <span className="text-[9px] uppercase font-mono tracking-wide text-gray-400 font-bold">
                              {oIdx === 0 ? 'মিনিমাম প্যাক' : oIdx === 1 ? 'স্ট্যান্ডার্ড প্যাক' : 'ফ্যামিলি প্যাক'}
                            </span>
                            <span className="text-xs sm:text-sm mt-1">{customOptionLabelBn}</span>
                            <span className="text-[10.5px] mt-1 text-emerald-700 font-mono font-bold">
                              ৳{Math.round(baseDisplayPrice * opt.multiplier)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-3.5 flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
                  <div className="flex items-center gap-1 font-sans">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase animate-pulse">প্রাইস রুলস:</span>
                    <span className="text-[10px] text-emerald-700 font-black bg-emerald-50 px-2 py-0.5 rounded">শতভাগ দালাল মুক্ত</span>
                  </div>
                  <span className="text-[10.5px] text-gray-450 leading-relaxed max-w-[220px] text-right font-sans">
                    মাঠ থেকে সরাসরি রাজশাহী ও যশোর হাব হয়ে ১২ ঘণ্টায় গ্রাহকের দোরগোড়ায়।
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

              {/* Chat with Farmer (কৃষকের সাথে চ্যাট) Button */}
              {farmer && (
                <div className="mt-3">
                  <button
                    id="chat-with-farmer-btn"
                    onClick={() => setChatModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 py-3.5 text-xs font-sans font-black text-white shadow-md hover:shadow-lg transition-all active:scale-[0.97] duration-150 text-center cursor-pointer"
                  >
                    <MessageCircle className="h-4.5 w-4.5 text-white animate-bounce-subtle" />
                    {language === 'bn' ? `খামারি ${farmer.name}-এর সাথে সরাসরি চ্যাট` : `Chat with Farmer ${farmer.name}`}
                  </button>
                </div>
              )}

              {/* WhatsApp Ordering button */}
              {product.stock > 0 && (
                <div className="mt-3">
                  <a
                    href={`https://wa.me/8801931355398?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি কৃষক বাজার থেকে "${product.title}" পণ্যটি অর্ডার করতে চাই।\nকৃষক: ${product.farmerName}\nমূল্য: ৳${displayPrice} (পরিমাণ: ${qty} ${getFormattedUnit(product, language)})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] py-3.5 text-xs font-sans font-black text-white shadow-md hover:shadow-lg transition-all active:scale-[0.97] duration-150 text-center cursor-pointer"
                  >
                    <svg className="h-4.5 w-4.5 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008 0c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.714-1.458L0 24zm6.49-5.385c1.654.982 3.511 1.5 5.414 1.501 5.474 0 9.93-4.45 9.934-9.92.001-2.648-1.03-5.138-2.902-7.015C17.12 1.306 14.636.275 12.001.275 6.529.275 2.073 4.73 2.069 10.2c-.001 1.958.513 3.869 1.492 5.568l-.979 3.579 3.665-.961zm11.233-7.531c-.301-.15-.178-.225-.375-.525-.097-.15-.525-.75-.525-.75s-.19-.24-.45-.24c-.112 0-.256.04-.37.15-.36.35-.95.95-.95 2.31s.99 2.67 1.13 2.85c.14.18 1.96 2.99 4.75 4.19.67.29 1.19.46 1.59.59.67.21 1.28.18 1.76.11.54-.08 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.33-.07-.12-.27-.19-.57-.34z" />
                    </svg>
                    WhatsApp-এ সরাসরি অর্ডার করুন
                  </a>
                </div>
              )}

              {/* DIRECT SIDE-BY-SIDE COMPARE BUTTON */}
              {onToggleCompare && (
                <div className="mt-3">
                  <button
                    onClick={() => onToggleCompare(product.id)}
                    className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-sans font-black shadow-sm transition-all active:scale-[0.97] duration-150 text-center cursor-pointer border ${
                      isCompared
                        ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-400 font-extrabold'
                        : 'bg-white hover:bg-slate-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    <span>⚖️</span>
                    {isCompared ? 'তুলনা তালিকা থেকে বাদ দিন (Remove from Comparison)' : 'তুলনা তালিকায় যোগ করুন (Add to Comparison)'}
                  </button>
                </div>
              )}

              {/* 📱 PRODUCT TRACKER SCANNABLE QR CODE CHIP */}
              <div id="product-qr-scanner-box" className="mt-4 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/20 p-4 shadow-3xs flex items-center gap-4">
                <div className="bg-white p-1.5 border border-emerald-100 rounded-xl shrink-0 shadow-sm">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(window.location.origin + '/?productId=' + product.id)}`}
                    alt="Product QR Scan Code"
                    className="h-20 w-20 object-contain rounded"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500';
                    }}
                  />
                </div>
                <div className="flex-1 space-y-1.5 min-w-0 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-0.5 rounded bg-emerald-700 text-white px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-wider leading-none">
                      QR TAG VERIFIED
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold font-mono">ID: {product.id}</span>
                  </div>
                  <h5 className="text-[11.5px] font-black text-gray-900 leading-tight">ফসলের উৎস, মান ও সত্যতা নিশ্চিত করুন</h5>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 leading-normal font-sans">
                    যেকোনো স্মার্টফোন দিয়ে এই কিউআর স্ক্যান করে ফসলটির তাজা সংগ্রহের লাইভ ট্র্যাক সহ উৎপাদক চাষী ও খামারের সম্পূর্ণ পরিচিতি দেখে নিতে পারবেন।
                  </p>
                  <button 
                    type="button"
                    onClick={() => {
                      const win = window.open();
                      if (win) {
                        win.document.write(`
                          <html>
                            <head>
                              <title>Krishok Bazar Crop QR Tag - ${product.title}</title>
                              <style>
                                body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fff; }
                                .card { border: 3px double #059669; padding: 30px; border-radius: 20px; text-align: center; max-width: 320px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
                                h2 { color: #064e3b; font-size: 20px; margin: 10px 0; }
                                p { font-size: 11.5px; color: #374151; margin: 6px 0; }
                                .qr { margin: 20px 0; border: 1px solid #e5e7eb; padding: 15px; border-radius: 12px; background: #f9fafb; display: inline-block; }
                                .badge { background: #059669; color: white; display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.05em; }
                              </style>
                            </head>
                            <body>
                              <div class="card">
                                <div class="badge">KRISHOK BAZAR RFID TAG</div>
                                <h2>${product.title}</h2>
                                <div class="qr">
                                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(window.location.origin + '/?productId=' + product.id)}" width="180" height="180"/>
                                </div>
                                <p><strong>নিবন্ধিত খামারি:</strong> ${product.farmerName}</p>
                                <p><strong>ফসলের সংগ্রহকাল:</strong> ${product.harvestDate || 'May 30, 2026'}</p>
                                <p><strong>পণ্যের আইডি:</strong> ${product.id}</p>
                                <p style="margin-top: 20px; font-weight: bold; color: #059669; font-size: 13px;">শতভাগ নিরাপদ গ্যারান্টি</p>
                                <button onclick="window.print()" style="margin-top:20px; background: #064e3b; color:#fff; border:none; padding: 10px 20px; border-radius: 10px; cursor:pointer; font-weight:bold; font-size:12px; box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);">প্রিন্ট লেবেল (Print Label)</button>
                              </div>
                            </body>
                          </html>
                        `);
                        win.document.close();
                      }
                    }}
                    className="text-[10px] text-emerald-800 hover:text-emerald-950 font-extrabold hover:underline flex items-center gap-0.5 mt-1 cursor-pointer"
                  >
                    🖨️ ফিজিক্যাল কিউআর কোড ট্যাগ প্রিন্ট করুন (Print QR Tag)
                  </button>
                </div>
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
                
                <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); setChatModalOpen(true); }}
                    className="text-[10px] sm:text-[11px] font-sans font-black text-white bg-emerald-650 hover:bg-emerald-750 px-3.5 py-2.5 rounded-xl flex items-center gap-1 shadow-xs hover:shadow-sm hover:scale-[1.01] transition-all duration-200 shrink-0 cursor-pointer"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-white" />
                    {language === 'bn' ? 'সরাসরি চ্যাট (Chat)' : 'Live Chat'}
                  </button>
                  <span className="text-[10px] sm:text-[11px] font-sans font-black text-emerald-800 bg-white border border-emerald-200 hover:border-emerald-350 px-3.5 py-2.5 rounded-xl flex items-center gap-1 shadow-xs transition duration-200 shrink-0">
                    <Store className="h-4 w-4 text-emerald-600" />
                    {language === 'bn' ? 'স্টোর ভিজিট' : 'Visit Store'}
                  </span>
                </div>
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
                      <LazyImage 
                        src={convertGoogleDriveLink(p.images[0])} 
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
                      <LazyImage 
                        src={convertGoogleDriveLink(p.images[0])} 
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

        {/* AGRICULTURAL LIVE CHAT MODAL SELECTION */}
        {chatModalOpen && farmer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="relative w-full max-w-md overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-2xl animate-scaleUp">
              
              {/* Header Cover / Hero Block */}
              <div className="bg-gradient-to-br from-emerald-700 to-teal-850 p-6 text-white pb-10 relative">
                <button
                  onClick={() => setChatModalOpen(false)}
                  className="absolute top-4 right-4 bg-black/20 hover:bg-black/35 text-white/90 hover:text-white h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition-all"
                  title="Close Dialog"
                >
                  ✕
                </button>
                
                <div className="flex items-center gap-3 select-none">
                  <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white/50 bg-white shadow-md shrink-0">
                    <img
                      src={farmer.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR}
                      alt={farmer.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] bg-white/20 text-white font-extrabold px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest leading-none">
                      {language === 'bn' ? 'সরাসরি খামারি যোগাযোগ' : 'Direct Farmer Live'}
                    </span>
                    <h3 className="text-sm font-black mt-1 font-sans flex items-center gap-1.5 leading-tight">
                      {farmer.name} {farmer.verified && <span className="text-[9px] text-white bg-blue-500 rounded-full py-0.5 px-1 font-sans">✔ verified</span>}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Box Info Container */}
              <div className="p-6 -mt-6 bg-white rounded-t-3xl relative">
                <div className="space-y-4">
                  
                  {/* Explanatory prompt detail */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest font-sans">
                      {language === 'bn' ? 'প্রশ্নকৃত শস্য বা ফসল:' : 'Inquiring Product:'}
                    </p>
                    <div className="flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="h-10 w-10 bg-white rounded-lg overflow-hidden border border-gray-150-soft shrink-0">
                        <img 
                          src={convertGoogleDriveLink(product?.images[0] || '')} 
                          alt={product?.title} 
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[11.5px] font-black text-gray-800 truncate leading-tight font-sans">
                          {product?.title}
                        </h4>
                        <p className="text-[10px] text-emerald-700 font-extrabold font-mono mt-0.5">
                          ৳{displayPrice} <span className="text-gray-400 font-sans">({qty} {getFormattedUnit(product, language)})</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pre-filled Message Preview Container */}
                  <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-3.5 space-y-1">
                    <span className="text-[9px] font-black uppercase text-amber-800 tracking-wider font-sans block leading-none">
                      {language === 'bn' ? 'প্রি-ফিল্ড বার্তা প্রিভিউ (Pre-filled Message text):' : 'Pre-filled Message Preview:'}
                    </span>
                    <p className="text-[10.5px] text-gray-650 italic leading-relaxed font-sans">
                      "{language === 'bn' 
                        ? `আসসালামু আলাইকুম ${farmer.name} ভাই, আমি কৃষক বাজার প্ল্যাটফর্ম থেকে আপনার উৎপাদিত "${product?.title}" ফসলটি সম্পর্কে বিস্তারিত জানতে আগ্রহী...` 
                        : `Assalamu Alaikum ${farmer.name}, I am interested in your organic crop "${product?.title}" listed on Krishok Bazar...`
                      }"
                    </p>
                  </div>

                  {/* Information notification tag */}
                  <p className="text-[10px] text-gray-400 leading-normal text-center font-sans">
                    {language === 'bn' 
                      ? 'যেকোনো একটি বাটন নির্বাচন করুন। এটি আপনার মোবাইলে বা ব্রাউজারে স্বয়ংক্রিয়ভাবে সরাসরি মেসেজিং উইন্ডো চালু করবে।' 
                      : 'Choose your preferred platform below. The selected portal will launch instantly with the pre-filled message ready.'}
                  </p>

                  {/* Active dual channels buttons */}
                  <div className="grid grid-cols-1 gap-2.5 pt-1.5 pb-1">
                    {/* Channel 1: WhatsApp */}
                    <a
                      href={getWhatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] hover:scale-[1.01] py-4 text-xs font-sans font-black text-white shadow-md hover:shadow-lg transition-all duration-150 text-center cursor-pointer"
                    >
                      <svg className="h-4.5 w-4.5 text-white fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008 0c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.503-5.714-1.458L0 24zm6.49-5.385c1.654.982 3.511 1.5 5.414 1.501 5.474 0 9.93-4.45 9.934-9.92.001-2.648-1.03-5.138-2.902-7.015C17.12 1.306 14.636.275 12.001.275 6.529.275 2.073 4.73 2.069 10.2c-.001 1.958.513 3.869 1.492 5.568l-.979 3.579 3.665-.961zm11.233-7.531c-.301-.15-.178-.225-.375-.525-.097-.15-.525-.75-.525-.75s-.19-.24-.45-.24c-.112 0-.256.04-.37.15-.36.35-.95.95-.95 2.31s.99 2.67 1.13 2.85c.14.18 1.96 2.99 4.75 4.19.67.29 1.19.46 1.59.59.67.21 1.28.18 1.76.11.54-.08 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.33-.07-.12-.27-.19-.57-.34z" />
                      </svg>
                      <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ চ্যাট (WhatsApp Live)' : 'Chat on WhatsApp'}</span>
                    </a>

                    {/* Channel 2: Messenger */}
                    <a
                      href={getMessengerLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#0084FF] hover:bg-[#0072DD] hover:scale-[1.01] py-4 text-xs font-sans font-black text-white shadow-md hover:shadow-lg transition-all duration-150 text-center cursor-pointer"
                    >
                      <svg className="h-4.5 w-4.5 text-white fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.745 6.614 4.475 8.61V24l4.086-2.242c1.09.303 2.247.464 3.439.464 6.627 0 12-4.975 12-11.11C24 4.974 18.627 0 12 0zm1.261 14.939l-3.056-3.262-5.962 3.262 6.556-6.962 3.123 3.262 5.894-3.262-6.555 6.962z" />
                      </svg>
                      <span>{language === 'bn' ? 'মেসেঞ্জার চ্যাট (Messenger Live)' : 'Chat on Messenger'}</span>
                    </a>
                  </div>

                  {/* Dismiss option */}
                  <button
                    onClick={() => setChatModalOpen(false)}
                    className="w-full text-center py-2 text-[11px] font-black text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  >
                    {language === 'bn' ? 'বন্ধ করুন' : 'Cancel Dialogue'}
                  </button>

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
