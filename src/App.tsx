/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, RefreshCw, X as CloseIcon } from 'lucide-react';
import { AppProvider, useApp, convertGoogleDriveLink } from './AppContext';
import { NotificationProvider } from './components/NotificationProvider';
import { logAnalyticsEvent } from './lib/analytics';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { SeasonalHarvestBanner } from './components/SeasonalHarvestBanner';
import { CategoriesGrid } from './components/CategoriesGrid';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { EditProductModal } from './components/EditProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { FarmerStoreProfilePage } from './components/FarmerStoreProfilePage';
import { AdminCMSDashboard } from './components/AdminCMSDashboard';
import { AdminLoginView } from './components/AdminLoginView';
import { OrderHistory } from './components/OrderHistory';
import { FarmerDashboard } from './components/FarmerDashboard';
import { RiktazAI } from './components/RiktazAI';
import { FloatingSocials } from './components/FloatingSocials';
import { FarmerSocialFeed } from './components/FarmerSocialFeed';
import { AppEntryFlow } from './components/AppEntryFlow';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SubscriptionPage } from './components/SubscriptionPage';
import { BottomVideoSection, BottomFarmersSection } from './components/BottomHomeSections';
import { useSubscriptionTimer } from './hooks/useSubscriptionTimer';
import { VerifiedFarmersView } from './components/VerifiedFarmersView';
import { BlogView } from './components/BlogView';
import { ScrollingBanners } from './components/ScrollingBanners';
import { WeeklyCombosView } from './components/WeeklyCombosView';
import { WeeklyDiscountView } from './components/WeeklyDiscountView';
import { DynamicPageView } from './components/DynamicPageView';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { BottomNavigation } from './components/BottomNavigation';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { ShippingPolicyView } from './components/ShippingPolicyView';
import { VideoGalleryView } from './components/VideoGalleryView';
import { Product, Farmer, Order, Review, Category, Banner } from './types';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  TrendingUp, 
  Coins, 
  User, 
  Award, 
  UserCheck, 
  Store, 
  Plus, 
  Edit, 
  Trash, 
  Ban, 
  CheckCircle, 
  Star, 
  FileText, 
  Clock, 
  Package, 
  Truck, 
  ChevronRight, 
  ChevronLeft,
  Building,
  Sparkles,
  ArrowRight,
  Heart,
  MessageSquare,
  BadgeAlert,
  Users,
  Facebook,
  Youtube,
  Twitter,
  Instagram,
  ShoppingCart,
  PhoneCall,
  ShoppingBag
} from 'lucide-react';
import { FEMALE_AVATAR, MALE_AVATAR } from './assets';
import { CATEGORIES } from './data';

const COMBO_BASKETS: Product[] = [
  {
    id: 'cb1',
    title: 'সাপ্তাহিক রেশনের বাজেট কম্বো বাস্কেট',
    description: 'গোল লাল আলু ২ কেজি, তাল বেগুন ১ কেজি, দেশী পেঁয়াজ ১ কেজি, রসুনের সেরা কোয়ালিটি ২৫০ গ্রাম, তাজা ধনে পাতা ২৫০ গ্রাম, কাঁচামরিচ ২৫০ গ্রাম, নরম কচি লম্বা লাউ ১টি।',
    price: 550,
    discountPrice: 490,
    category: 'ready-to-cook',
    farmerId: 'f70',
    farmerName: 'সাইফুল ইসলাম',
    farmName: 'সাইফুল অর্গানিক এগ্রো',
    rating: 4.9,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80'],
    isVerified: true,
    isReadyToCook: true,
    harvestDate: 'May 30, 2026'
  },
  {
    id: 'cb2',
    title: 'ফ্যামিলি সাইজ প্রিমিয়াম সবজি কম্বো বাস্কেট',
    description: 'গোল কড়া সাদা ফুলকপি ২টি, তাজা কচি বাঁধাকপি ২টি, লাল আলু ৩ কেজি, নরম তাল বেগুন ২ কেজি, মিষ্টি তাজা গাজর ১ কেজি, লাল টমেটো ২ কেজি, কচি পটল ১ কেজি, কড়া সুগন্ধি লেবু ১ ডজন।',
    price: 980,
    discountPrice: 850,
    category: 'ready-to-cook',
    farmerId: 'f71',
    farmerName: 'মান্নান হোসেন',
    farmName: 'মান্নান সমন্বিত ডেইরি ও কৃষি',
    rating: 4.8,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1000&auto=format&fit=crop&q=80'],
    isVerified: true,
    isReadyToCook: true,
    harvestDate: 'May 29, 2026'
  },
  {
    id: 'cb3',
    title: 'ফিটনেস ও ওয়েট লস গ্রিন কম্বো বাস্কেট',
    description: 'মিষ্টি কচি পেঁপে ২ কেজি, রসালো টাটকা শসা ২ কেজি, বড় তেতো করলা ১ কেজি, কচি মিষ্টি পানি লাউ ১টি, ডাঁটা শাক ৩ আঁটি, লাল শাক ৩ আঁটি, টক সুগন্ধি লেবু ১ ডজন।',
    price: 780,
    discountPrice: 690,
    category: 'ready-to-cook',
    farmerId: 'f72',
    farmerName: 'সুরুজ মিয়া',
    farmName: 'সুরুজ সতেজ সবজি খামার',
    rating: 5.0,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1000&auto=format&fit=crop&q=80'],
    isVerified: true,
    isReadyToCook: true,
    harvestDate: 'May 30, 2026'
  }
];

const AppContent: React.FC = () => {
  const { 
    currentUser, 
    products, 
    farmers, 
    orders,
    reviews,
    addProduct, 
    editProduct, 
    deleteProduct,
    updateOrderStatus,
    toggleVerifyFarmer,
    toggleBlockFarmer,
    approveFarmerRegistration,
    editFarmerRating,
    addReview,
    updateProfile,
    requestWithdrawal,
    withdrawalRequests,
    deleteFarmer,
    updateWithdrawallStatus,
    getNidDetails,
    siteSettings,
    addToCart,
    categories,
    language,
    toggleLanguage,
    dynamicPages
  } = useApp();

  // Route state
  const [currentView, setView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedFarmerStoreId, setSelectedFarmerStoreId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [entryCompleted, setEntryCompleted] = useState(true);
  const [activeComboSection, setActiveComboSection] = useState<'500' | '1000' | '1500' | 'small'>('500');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isSubscriptionAutoTriggered, setIsSubscriptionAutoTriggered] = useState(false);
  const [autoTriggerSubscriptionPlanId, setAutoTriggerSubscriptionPlanId] = useState<string | null>(null);
  const [subscriptionDefaultRole, setSubscriptionDefaultRole] = useState<'customer' | 'farmer'>('customer');

  const openSubscriptionModal = (role: 'customer' | 'farmer' = 'customer') => {
    setIsSubscriptionAutoTriggered(false);
    setAutoTriggerSubscriptionPlanId(null);
    setSubscriptionDefaultRole(role);
    setView('subscriptions');
  };
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeFarmerProfile, setActiveFarmerProfile] = useState<Farmer | null>(null);

  // Side-by-side product comparison states
  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    const handleCompareOpen = () => {
      setIsCompareOpen(true);
    };
    window.addEventListener('open-compare-modal', handleCompareOpen);
    return () => window.removeEventListener('open-compare-modal', handleCompareOpen);
  }, []);

  const handleToggleCompare = (productId: string) => {
    setComparedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        alert('আপনি সর্বোচ্চ ৪টি পণ্য একসাথে তুলনা করতে পারবেন!');
        return prev;
      }
      return [...prev, productId];
    });
  };

  // Redirect on user role change
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'Farmer') {
        setView('farmer-dashboard');
      } else if (currentUser.role === 'Admin') {
        setView('admin');
      }
    } else {
      // If user logs out and was in admin or farmer dashboard, send them home
      if (currentView === 'admin' || currentView === 'farmer-dashboard') {
        setView('home');
      }
    }
  }, [currentUser]);

  // Conditional subscription auto-trigger timing logic helper
  const isEligibleForSubscriptionTrigger = false;

  useSubscriptionTimer((planId) => {
    let targetTabRole: 'customer' | 'farmer' = 'customer';
    if (currentUser) {
      if (currentUser.role === 'Farmer') {
        targetTabRole = 'farmer';
      } else {
        targetTabRole = 'customer';
      }
    } else {
      targetTabRole = 'customer';
    }

    setSubscriptionDefaultRole(targetTabRole);
    setAutoTriggerSubscriptionPlanId(planId);
    setIsSubscriptionAutoTriggered(true);
    setView('subscriptions');
    console.log(`Auto-triggering compact subscription notification for plan ${planId} targeting role: ${targetTabRole}`);
  }, isEligibleForSubscriptionTrigger);

  // Notifications or order success alert
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  // New product addition state (farmer/admin dashboard)
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(0);
  const [newProdDiscountPrice, setNewProdDiscountPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('fruits');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdReadyToCook, setNewProdReadyToCook] = useState(false);
  const [newProdImages, setNewProdImages] = useState<string[]>([]);
  const [activeImageField, setActiveImageField] = useState('');

  // Customer wallet withdrawal requests state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [withdrawMethod, setWithdrawMethod] = useState<'bKash' | 'Nagad' | 'Bank Transfer'>('bKash');
  const [withdrawDetails, setWithdrawDetails] = useState<string>('');
  const [withdrawMsg, setWithdrawMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Address edit state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState('');
  const [customerDashboardTab, setCustomerDashboardTab] = useState<'tracking' | 'history'>('tracking');

  // Customer feedback state
  const [feedbackProdName, setFeedbackProdName] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackLocation, setFeedbackLocation] = useState('');

  // Profile fields state
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Admin CMS panel active tabs & modals
  const [adminActiveTab, setAdminActiveTab] = useState<'farmers' | 'products' | 'categories' | 'banners' | 'reviews' | 'orders'>('farmers');

  // Categories editing state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormId, setCategoryFormId] = useState('');
  const [categoryFormNameBn, setCategoryFormNameBn] = useState('');
  const [categoryFormNameEn, setCategoryFormNameEn] = useState('');
  const [categoryFormIcon, setCategoryFormIcon] = useState('Leaf');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Banners / Slides editing state
  const [editingBannerIndex, setEditingBannerIndex] = useState<number | null>(null);
  const [bannerFormImage, setBannerFormImage] = useState('');
  const [bannerFormTitleBn, setBannerFormTitleBn] = useState('');
  const [bannerFormTitleEn, setBannerFormTitleEn] = useState('');
  const [bannerFormSubtitleBn, setBannerFormSubtitleBn] = useState('');
  const [bannerFormSubtitleEn, setBannerFormSubtitleEn] = useState('');
  const [isAddingBanner, setIsAddingBanner] = useState(false);

  // Admin Custom Product Editor state
  const [adminEditingProduct, setAdminEditingProduct] = useState<Product | null>(null);
  const [adminIsAddingProduct, setAdminIsAddingProduct] = useState(false);
  const [adminProdTitle, setAdminProdTitle] = useState('');
  const [adminProdPrice, setAdminProdPrice] = useState(0);
  const [adminProdDiscountPrice, setAdminProdDiscountPrice] = useState('');
  const [adminProdCategory, setAdminProdCategory] = useState('fruits');
  const [adminProdDesc, setAdminProdDesc] = useState('');
  const [adminProdStock, setAdminProdStock] = useState(10);
  const [adminProdReadyToCook, setAdminProdReadyToCook] = useState(false);
  const [adminProdImages, setAdminProdImages] = useState<string[]>([]);
  const [adminProdFarmerId, setAdminProdFarmerId] = useState('');
  const [adminProdIsFeatured, setAdminProdIsFeatured] = useState(false);
  const [adminProdIsVerified, setAdminProdIsVerified] = useState(true);

  // Admin Farmer Profile Editing state
  const [adminEditingFarmer, setAdminEditingFarmer] = useState<Farmer | null>(null);
  const [adminFarmerFormName, setAdminFarmerFormName] = useState('');
  const [adminFarmerFormPhone, setAdminFarmerFormPhone] = useState('');
  const [adminFarmerFormDistrict, setAdminFarmerFormDistrict] = useState('');
  const [adminFarmerFormAddress, setAdminFarmerFormAddress] = useState('');
  const [adminFarmerFormNid, setAdminFarmerFormNid] = useState('');
  const [adminFarmerFormStatus, setAdminFarmerFormStatus] = useState<'Pending' | 'Approved' | 'Blocked'>('Approved');
  const [adminFarmerFormVerified, setAdminFarmerFormVerified] = useState(false);
  const [adminFarmerFormRating, setAdminFarmerFormRating] = useState(4.5);
  const [adminFarmerFormBalance, setAdminFarmerFormBalance] = useState(0);
  const [adminFarmerFormBio, setAdminFarmerFormBio] = useState('');

  // Reset category filters when going back home
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setView('shop');
  };

  const handleOpenAuthModal = () => setIsAuthOpen(true);
  const handleOpenCartDrawer = () => setIsCartOpen(true);
  const handleOrderSuccess = (orderId: string) => {
    setSuccessOrderId(orderId);
  };

  // Farmer's profile products query
  const getProductsByFarmer = (farmerId: string) => {
    return products.filter((p) => p.farmerId === farmerId);
  };

  // Filtered products query for shop/ready-to-cook
  const getFilteredProducts = () => {
    let list = [...products];

    // Filter out unapproved and inactive products/categories/farmers (except for admin, or the farmer owner)
    list = list.filter(p => {
      const isAdminOrOwner = currentUser?.role === 'Admin' || (currentUser?.role === 'Farmer' && currentUser.farmerId === p.farmerId);
      
      if (p.approved === false) {
        if (isAdminOrOwner) return true;
        return false;
      }

      if (!isAdminOrOwner) {
        // If the product is deactivated
        if (p.isActive === false) return false;

        // If the farmer itself is deactivated or blocked
        const farmer = farmers.find(f => f.id === p.farmerId);
        if (farmer) {
          if (farmer.isActive === false || farmer.status === 'Blocked') return false;
        }

        // If the category itself is deactivated
        const categoryOfProd = categories.find(c => c.id === p.category);
        if (categoryOfProd && categoryOfProd.isActive === false) return false;
      }

      return true;
    });

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) => 
          p.title.toLowerCase().includes(q) || 
          p.farmerName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // View specific filter
    if (currentView === 'ready-to-cook') {
      list = list.filter((p) => p.isReadyToCook);
    } else if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // District filter
    if (selectedDistrict !== 'all') {
      // Find farmers in this district
      const districtFarmers = farmers.filter(f => f.district === selectedDistrict).map(f => f.id);
      list = list.filter(p => districtFarmers.includes(p.farmerId));
    }

    // Sort products
    if (sortBy === 'price-asc') {
      list.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceB - priceA;
      });
    } else if (sortBy === 'rating-desc') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  };

  // Save new crop/product submit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pick current farm-owner ID
    const fId = currentUser?.role === 'Farmer' ? (currentUser.farmerId || 'f70') : 'f70';

    const pData = {
      title: newProdTitle,
      price: Number(newProdPrice),
      discountPrice: newProdDiscountPrice ? Number(newProdDiscountPrice) : undefined,
      category: newProdCategory,
      description: newProdDesc,
      stock: Number(newProdStock),
      isReadyToCook: newProdReadyToCook,
      farmerId: fId,
      images: newProdImages.length > 0 ? newProdImages : [
        'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60-1',
        'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60-2',
        'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60-3'
      ]
    };

    if (editingProdId) {
      editProduct(editingProdId, pData);
    } else {
      addProduct(pData);
    }

    // Reset fields
    setIsAddingProduct(false);
    setEditingProdId(null);
    setNewProdTitle('');
    setNewProdPrice(0);
    setNewProdDiscountPrice('');
    setNewProdCategory('fruits');
    setNewProdDesc('');
    setNewProdStock(10);
    setNewProdReadyToCook(false);
    setNewProdImages([]);
  };

  // Set product editor values
  const startEditProduct = (p: Product) => {
    setEditingProdId(p.id);
    setNewProdTitle(p.title);
    setNewProdPrice(p.price);
    setNewProdDiscountPrice(p.discountPrice ? String(p.discountPrice) : '');
    setNewProdCategory(p.category);
    setNewProdDesc(p.description);
    setNewProdStock(p.stock);
    setNewProdReadyToCook(p.isReadyToCook);
    setNewProdImages(p.images);
    setIsAddingProduct(true);
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackProdName || !feedbackComment) return;

    addReview({
      customerName: currentUser?.name || 'পরিচিত ক্রেতা',
      avatar: currentUser?.name?.charAt(0) || '🛍️',
      rating: feedbackRating,
      comment: feedbackComment,
      productName: feedbackProdName,
      location: feedbackLocation || currentUser?.address || 'Dhaka, Bangladesh'
    });

    // Reset
    setFeedbackProdName('');
    setFeedbackComment('');
    setFeedbackRating(5);
  };

  const [isOfflineState, setIsOfflineState] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [offlineDismissed, setOfflineDismissed] = useState(false);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOfflineState(false);
      setOfflineDismissed(false);
    };
    const handleOffline = () => {
      setIsOfflineState(true);
      setOfflineDismissed(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 1. Initial load path parser and popstate/hashchange listener for SEO & client hash routing
  React.useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      let matchedView: any = 'home';
      
      if (path === '/shop' || hash === '#shop') matchedView = 'shop';
      else if (path === '/ready-to-cook' || hash === '#ready-to-cook') matchedView = 'ready-to-cook';
      else if (path === '/farmers' || hash === '#farmers' || hash === '#farmer-directory') matchedView = 'farmers';
      else if (path === '/dashboard' || hash === '#dashboard') matchedView = 'customer-dashboard';
      else if (path === '/farmer-portal' || hash === '#farmer-portal') matchedView = 'farmer-dashboard';
      else if (path === '/admin' || hash === '#admin' || path === '/admin-login' || hash === '#admin-login' || path.startsWith('/admin')) {
        if (currentUser && currentUser.role === 'Admin') {
          matchedView = 'admin';
        } else {
          matchedView = 'admin-login';
        }
      }
      else if (path === '/blog' || hash === '#blog') matchedView = 'blog';
      else if (path === '/social-feed' || hash === '#social-feed') matchedView = 'social-feed';
      else if (path === '/our-story' || hash === '#our-story') matchedView = 'our-story';
      else if (path === '/privacy-policy' || hash === '#privacy-policy') matchedView = 'privacy-policy';
      else if (path === '/shipping-policy' || hash === '#shipping-policy' || hash === '#return-policy') matchedView = 'shipping-policy';
      
      setView(matchedView);
    };

    handleLocationChange();

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [currentUser]);

  // 2. Sync active view back to URL path and log Firebase Analytics screen_view on changes
  React.useEffect(() => {
    let path = '/';
    if (currentView === 'shop') path = '/shop';
    else if (currentView === 'ready-to-cook') path = '/ready-to-cook';
    else if (currentView === 'farmers') path = '/farmers';
    else if (currentView === 'customer-dashboard') path = '/dashboard';
    else if (currentView === 'farmer-dashboard') path = '/farmer-portal';
    else if (currentView === 'admin') path = '/admin';
    else if (currentView === 'admin-login') path = '/admin-login';
    else if (currentView === 'blog') path = '/blog';
    else if (currentView === 'social-feed') path = '/social-feed';
    else if (currentView === 'our-story') path = '/our-story';
    else if (currentView === 'privacy-policy') path = '/privacy-policy';
    else if (currentView === 'shipping-policy') path = '/shipping-policy';
    else if (currentView === 'product-details') path = `/product/${selectedProductId || 'item'}`;
    else if (currentView === 'farmer-store') path = `/farmer/${selectedFarmerStoreId || 'profile'}`;

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  }, [currentView, selectedProductId, selectedFarmerStoreId, currentUser]);

  // 3. Dynamic Page titles, Metadata tag updates, and JSON-LD schema generation for absolute SEO compliance
  React.useEffect(() => {
    if (!siteSettings) return;

    let title = siteSettings.seoTitle || 'কৃষক বাজার';
    let description = siteSettings.seoDescription || 'সরাসরি তৃণমূলের ভেরিফাইড কৃষকদের সাথে ক্রেতার সেতুবন্ধন।';
    const keywords = siteSettings.seoKeywords || 'কৃষক বাজার, krishok bazar';

    if (currentView === 'shop') {
      title = `সব পণ্য | ${siteSettings.seoTitle || 'কৃষক বাজার'}`;
      description = `তৃণমূল কৃষকদের সতেজ অর্গানিক শাকসবজি ও ফলমূল সরাসরি ঢাকায় হোম ডেলিভারি।`;
    } else if (currentView === 'ready-to-cook') {
      title = `রেডি-টু-কুক সবজি ও মাছ | ${siteSettings.seoTitle || 'কৃষক বাজার'}`;
      description = `কর্মব্যস্ত জীবনের জন্য প্রাক-কাটা তাজা ধুয়ে নেওয়া পুষ্টিকর শাকসবজি ও মাছ।`;
    } else if (currentView === 'farmers') {
      title = `ভেরিফাইড কৃষক সমাজ | ${siteSettings.seoTitle || 'কৃষক বাজার'}`;
      description = `যশোর, রাজশাহী ও বগুড়ার তৃণমূলের ভেরিফাইড সাধারণ কৃষকদের সাথে সরাসরি যোগাযোগ ও ক্রয়।`;
    }

    document.title = title;

    // Update meta tags
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    let metaKey = document.querySelector('meta[name="keywords"]');
    if (!metaKey) {
      metaKey = document.createElement('meta');
      metaKey.setAttribute('name', 'keywords');
      document.head.appendChild(metaKey);
    }
    metaKey.setAttribute('content', keywords);

    // Remove old schema if exists
    const oldScript = document.getElementById('kb-structured-schema');
    if (oldScript) oldScript.remove();

    const schemaData: any = {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "কৃষক বাজার (Krishok Bazar)",
      "description": description,
      "url": window.location.origin,
      "logo": "https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_ce5s9yce5s9yce5s.png?v=1779307577",
      "telephone": siteSettings.footerPhone || "01931355398",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": siteSettings.footerAddressBn || "মিরপুর ১০, ঢাকা",
        "addressLocality": "Dhaka",
        "addressRegion": "Dhaka",
        "postalCode": "1216",
        "addressCountry": "BD"
      }
    };

    if (currentView === 'product-details' && selectedProductId) {
      const prod = products.find(p => p.id === selectedProductId);
      if (prod) {
        schemaData["@type"] = "Product";
        schemaData["name"] = prod.title;
        schemaData["image"] = prod.images?.[0] || prod.image;
        schemaData["description"] = prod.description;
        schemaData["offers"] = {
          "@type": "Offer",
          "priceCurrency": "BDT",
          "price": prod.discountPrice || prod.price,
          "itemCondition": "https://schema.org/NewCondition",
          "availability": prod.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        };
      }
    }

    const script = document.createElement('script');
    script.id = 'kb-structured-schema';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schemaData, null, 2);
    document.head.appendChild(script);

  }, [currentView, siteSettings, selectedProductId, selectedFarmerStoreId, products, farmers]);

  React.useEffect(() => {
    const handleOpenCart = () => {
      setIsCartOpen(true);
    };
    window.addEventListener('open-cart-drawer', handleOpenCart);
    return () => window.removeEventListener('open-cart-drawer', handleOpenCart);
  }, []);

  if (!entryCompleted) {
    return (
      <AppEntryFlow 
        onComplete={(loc, lang) => {
          if (loc.district) {
            // Preset geographic filter based on user selection!
            const matchedName = loc.district.split(' ')[0] || 'all';
            setSelectedDistrict(matchedName);
          }
          setEntryCompleted(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50 flex flex-col font-sans relative">
      <Header 
        onOpenAuth={handleOpenAuthModal}
        onOpenCart={handleOpenCartDrawer}
        currentView={currentView}
        setView={setView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* CHANNELS ALERT */}
      {successOrderId && (
        <div className="bg-emerald-600 text-white py-3.5 px-4 shadow-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-2">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>অর্ডার সফলভাবে সম্পন্ন হয়েছে! আপনার ট্র্যাকিং আইডি: <strong className="underline text-emerald-100">{successOrderId}</strong>  (ক্যাশ অন ডেলিভারি)।</span>
          <button 
            onClick={() => setSuccessOrderId(null)}
            className="ml-4 bg-emerald-800 hover:bg-emerald-900 px-2.5 py-1 rounded text-[10px]"
          >
            বন্ধ করুন
          </button>
        </div>
      )}

      {/* MAIN LAYOUTS WRAPPER */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden min-w-0 pb-16 md:pb-0">

        {/* DEDICATED SUBSCRIPTIONS PORTAL */}
        {currentView === 'subscriptions' && (
          <SubscriptionPage onBack={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        )}

        {/* PRIVACY POLICY VIEW */}
        {currentView === 'privacy-policy' && (
          <PrivacyPolicyView onBack={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        )}

        {/* SHIPPING & RETURN POLICY VIEW */}
        {currentView === 'shipping-policy' && (
          <ShippingPolicyView onBack={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        )}

        {/* DEDICATED PRODUCT DETAILS PAGE */}
        {currentView === 'product-details' && selectedProductId && (
          <ProductDetailsPage 
            productId={selectedProductId}
            onBack={() => setView('shop')}
            onSelectFarmer={(farmerId) => {
              setSelectedFarmerStoreId(farmerId);
              setView('farmer-store');
            }}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEditProduct={setEditingProduct}
            onToggleCompare={handleToggleCompare}
            isCompared={comparedProductIds.includes(selectedProductId)}
          />
        )}

        {/* ADMIN LOGIN VIEW */}
        {currentView === 'admin-login' && (
          <AdminLoginView onBackToHome={() => setView('home')} />
        )}

        {/* CHIEF ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminCMSDashboard />
          </div>
        )}

        {/* CUSTOMER DASHBOARD */}
        {currentView === 'customer-dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <OrderHistory />
          </div>
        )}

        {/* FARMER DASHBOARD */}
        {currentView === 'farmer-dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <FarmerDashboard />
          </div>
        )}

        {/* STANDALONE PUBLIC FARMER STORE PROFILE */}
        {currentView === 'farmer-store' && selectedFarmerStoreId && (
          <FarmerStoreProfilePage 
            farmerId={selectedFarmerStoreId}
            onBack={() => setView('farmers')}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setView('product-details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* STANDALONE VERIFIED FARMERS LIST PAGE */}
        {currentView === 'farmers' && (
          <VerifiedFarmersView 
            onBack={() => setView('home')}
            onSelectFarmer={(farmerId) => {
              setSelectedFarmerStoreId(farmerId);
              setView('farmer-store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSubscription={(role) => {
              openSubscriptionModal(role);
            }}
          />
        )}

        {/* STANDALONE PUBLIC BLOG DIRECTORY */}
        {currentView === 'blog' && (
          <BlogView 
            onBack={() => setView('home')}
          />
        )}

        {/* STANDALONE WEEKLY COMBOS PAGE */}
        {currentView === 'weekly-combos' && (
          <WeeklyCombosView 
            onBackToHome={() => {
              setView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* STANDALONE WEEKLY DISCOUNTED PRODUCTS PAGE */}
        {currentView === 'weekly-discount' && (
          <WeeklyDiscountView 
            onBackToHome={() => {
              setView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              setView('product-details');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onToggleCompare={handleToggleCompare}
            comparedProductIds={comparedProductIds}
          />
        )}

        {/* DEDICATED OFFICIAL VIDEO GALLERY AND SOCIAL HUB PAGE */}
        {currentView === 'videos' && (
          <VideoGalleryView 
            onBack={() => {
              setView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* STANDALONE USER DYNAMIC PAGES */}
        {currentView.startsWith('dynamic-') && (
          (() => {
            const slug = currentView.replace('dynamic-', '');
            const matchedPage = dynamicPages.find(dp => dp.slug === slug);
            if (!matchedPage) return (
              <div className="text-center py-24 select-none">
                <p className="text-sm font-semibold text-gray-500">স্পেস বা কালেকশনটি খুঁজে পাওয়া যায়নি।</p>
                <button onClick={() => setView('home')} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black">হোমে ফিরুন</button>
              </div>
            );
            return (
              <DynamicPageView 
                page={matchedPage}
                onBackToHome={() => {
                  setView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onSelectProduct={(id) => {
                  setSelectedProductId(id);
                  setView('product-details');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onToggleCompare={handleToggleCompare}
                comparedProductIds={comparedProductIds}
              />
            );
          })()
        )}

        {/* STANDALONE PUBLIC SOCIAL MEDIA FEED (FARMERS' SOCIAL YARD) */}
        {currentView === 'social-feed' && (
          <div className="bg-slate-50 min-h-screen py-6 font-sans">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <div>
                  <span className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-805 border border-emerald-150 px-3 py-1 rounded-full font-black uppercase tracking-wider">সোশ্যাল মিডিয়া হাব (Social Media Feed)</span>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-1.5 leading-tight animate-fadeIn">কৃষকের সামাজিক উঠান ও সোশ্যাল ফিড</h1>
                  <p className="text-xs text-gray-500 mt-1 font-semibold">খামারি এবং অ্যাডমিনদের দৈনিক আপডেট, মাঠের চিত্র ও ভিডিও ব্লগিং গ্যালারি। লাইক-কমেন্ট দিয়ে নিরাপদ খাদ্যের লড়াইয়ে যুক্ত থাকুন!</p>
                </div>
                <button 
                  onClick={() => setView('home')} 
                  className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-xs font-black text-gray-650 flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer transition shadow-2xs hover:scale-102"
                >
                  ← প্রচ্ছদে ফিরে যান (Home)
                </button>
              </div>

              <FarmerSocialFeed />
            </div>
          </div>
        )}
        
        {/* HOMEPAGE VIEW */}
        {/* HOMEPAGE VIEW */}
        {currentView === 'home' && (
          <div className="space-y-0 text-gray-850 selection:bg-emerald-100 select-none">
            
            {/* PROMOTIONS SECTION */}
            <section id="promotions" className="bg-white">
              <HeroCarousel 
                onShopNow={() => setView('shop')}
                onViewFarmers={() => setView('farmers')}
                onCallHelp={() => handleOpenAuthModal()}
                setView={setView}
              />
            </section>

            {/* BEST SELLING PRODUCTS CAROUSEL SECTION */}
            <section id="best-sellers-carousel" className="py-10 bg-slate-50 border-b border-gray-100">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-left">
                    <span className="text-xs font-black text-amber-600 tracking-wider uppercase block">
                      🔥 Top Rated Best Sellers • আমাদের সেরা পণ্যসমূহ
                    </span>
                    <h2 className="text-xl sm:text-2.5xl font-black text-gray-900 font-sans mt-0.5">
                      {language === 'bn' ? 'সেরা বিক্রিত জনপ্রিয় পণ্য' : 'Best Selling Products'}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">৮ থেকে ১০টি সর্বোচ্চ গ্রাহক রেটিং প্রাপ্ত তাজা অর্গানিক পণ্য</p>
                  </div>
                  
                  {/* Slider Control Arrows */}
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => {
                        const el = document.getElementById('best-sellers-scroll-container');
                        if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
                      }}
                      className="h-8 w-8 rounded-xl bg-white border border-gray-150 text-gray-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all flex items-center justify-center shadow-3xs cursor-pointer"
                      title="Slide Left"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => {
                        const el = document.getElementById('best-sellers-scroll-container');
                        if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
                      }}
                      className="h-8 w-8 rounded-xl bg-white border border-gray-150 text-gray-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all flex items-center justify-center shadow-3xs cursor-pointer"
                      title="Slide Right"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Best Sellers Horizontal Grid list (8 to 10 products max) */}
                <div 
                  id="best-sellers-scroll-container"
                  className="flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-emerald-150 scrollbar-track-transparent"
                >
                  {products
                    .filter((p) => !p.id.startsWith('cb') && p.isActive !== false && p.approved !== false)
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .slice(0, 10)
                    .map((p) => {
                      console.log("[App.tsx (BestSellers)] Mapping product:", p.title, "ID:", p.id, "images:", p.images);
                      return (
                        <div 
                          key={`bs-${p.id}`} 
                          className="w-[180px] xs:w-[210px] sm:w-[240px] shrink-0 snap-start"
                        >
                          <ProductCard 
                            product={p} 
                            onOpenQuickView={(prod) => {
                              setSelectedProductId(prod.id);
                              setView('product-details');
                            }} 
                            onEditProduct={setEditingProduct}
                            onToggleCompare={handleToggleCompare}
                            isCompared={comparedProductIds.includes(p.id)}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </section>

            {/* PRODUCT CATEGORIES CAROUSEL SECTION - COMPACT & HIGHLY TIGHT AS REQUESTED */}
            <section id="categories-carousel" className="py-1 bg-slate-50/50 border-b border-gray-100">
              <div className="mx-auto max-w-7xl px-3 sm:px-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-left">
                    <span className="text-[9px] font-black text-emerald-600 tracking-wider uppercase block">
                      📁 {language === 'bn' ? 'সহজ শ্রেণীবিভাগ' : 'Quick Categories'}
                    </span>
                  </div>
                </div>

                {/* Categories Horizontal Scroll list - Micro Sized icons */}
                <div 
                  id="categories-scroll-container"
                  className="flex overflow-x-auto gap-1.5 pb-1 snap-x snap-mandatory scroll-smooth scrollbar-none"
                >
                  {/* "ALL" Button Card */}
                  <div
                    onClick={() => {
                      setSelectedCategory('all');
                      const element = document.getElementById('all-products');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`flex flex-col items-center justify-center p-1 min-w-[54px] sm:min-w-[62px] rounded-lg border transition-all cursor-pointer select-none text-center snap-start ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-tr from-emerald-600 to-green-500 text-white border-emerald-600 shadow-3xs scale-102 font-bold'
                        : 'bg-white border-gray-150 text-gray-600 hover:border-emerald-300'
                    }`}
                  >
                    <div className={`flex h-5.5 w-5.5 items-center justify-center rounded-md mb-0.5 transition-colors text-[10px] ${
                      selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      📦
                    </div>
                    <span className="text-[9px] font-black block max-w-full truncate leading-none">সব পণ্য</span>
                  </div>

                  {/* Individual Categories List with dynamically matched icons */}
                  {categories
                    .filter((cat) => cat.isActive !== false)
                    .map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      
                      // Match dynamic icons cleanly based on category name/ID
                      const getCategoryEmoji = (id: string, nameBn: string): string => {
                        const norm = (id + ' ' + nameBn).toLowerCase();
                        if (norm.includes('egg') || norm.includes('ডিম')) return '🥚';
                        if (norm.includes('milk') || norm.includes('dairy') || norm.includes('দুধ') || norm.includes('ডেইরি')) return '🥛';
                        if (norm.includes('veg') || norm.includes('green') || norm.includes('সবজি') || norm.includes('শাক')) return '🥦';
                        if (norm.includes('fruit') || norm.includes('ফল')) return '🍎';
                        if (norm.includes('rice') || norm.includes('grain') || norm.includes('চাল') || norm.includes('শস্য')) return '🌾';
                        if (norm.includes('fish') || norm.includes('মাছ')) return '🐟';
                        if (norm.includes('meat') || norm.includes('beef') || norm.includes('chicken') || norm.includes('মাংস')) return '🍗';
                        if (norm.includes('honey') || norm.includes('মধু')) return '🍯';
                        if (norm.includes('spice') || norm.includes('মসলা')) return '🌶️';
                        if (norm.includes('tea') || norm.includes('চা')) return '🍵';
                        if (norm.includes('ready') || norm.includes('cook') || norm.includes('রান্না')) return '🍳';
                        if (norm.includes('organic') || norm.includes('জৈব')) return '🛡️';
                        return '🌿'; 
                      };

                      const emoji = getCategoryEmoji(cat.id, cat.nameBn);

                      return (
                        <div
                          key={`cat-carousel-${cat.id}`}
                          onClick={() => {
                            // Direct router action for Milk, Eggs, Fish as requested by customer
                            const norm = cat.id.toLowerCase();
                            if (norm === 'dairy' || norm.includes('milk')) {
                              const milkProd = products.find(p => p.title.toLowerCase().includes('milk') || p.title.includes('দুধ'));
                              if (milkProd) {
                                setSelectedProductId(milkProd.id);
                                setView('product-details');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                return;
                              }
                            } else if (norm === 'eggs' || norm.includes('egg')) {
                              const eggProd = products.find(p => p.title.toLowerCase().includes('egg') || p.title.includes('ডিম'));
                              if (eggProd) {
                                setSelectedProductId(eggProd.id);
                                setView('product-details');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                return;
                              }
                            } else if (norm === 'fish' || norm.includes('fish')) {
                              const fishProd = products.find(p => p.title.toLowerCase().includes('fish') || p.title.includes('মাছ'));
                              if (fishProd) { // note: safety fallback in case fishProd is matched
                                setSelectedProductId(fishProd.id);
                                setView('product-details');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                return;
                              }
                            }

                            // Fallback to scrolling list filter if product is missing
                            setSelectedCategory(cat.id);
                            const element = document.getElementById('all-products');
                            if (element) element.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`flex flex-col items-center justify-center p-1 min-w-[54px] sm:min-w-[62px] rounded-lg border transition-all cursor-pointer select-none text-center snap-start ${
                            isSelected
                              ? 'bg-gradient-to-tr from-emerald-600 to-green-500 text-white border-emerald-600 shadow-3xs scale-102 font-bold'
                              : 'bg-white border-gray-150 text-gray-700 hover:border-emerald-300'
                          }`}
                        >
                          <div className={`flex h-5.5 w-5.5 items-center justify-center rounded-md mb-0.5 transition-colors text-[10px] ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-50 border border-gray-100 shadow-3xs'
                          }`}>
                            {emoji}
                          </div>
                          <span className="text-[9px] font-black block max-w-full truncate font-sans leading-none">
                            {cat.nameBn}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </section>

            {/* ALL PRODUCTS SECTION */}
            <section id="all-products" className="py-12 bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                  <div className="text-left">
                    <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase block">
                      Direct from Farmers • সরাসরি কৃষকের মাঠ থেকে
                    </span>
                    <h2 className="text-xl sm:text-3.5xl font-black text-gray-900 font-sans mt-1 leading-none">
                      {selectedCategory === 'all' 
                        ? (language === 'bn' ? 'আমাদের সকল সতেজ পণ্যসমূহ' : 'Our All Fresh Products')
                        : (language === 'bn' ? `তাজা পণ্য ক্যাটাগরি: ${categories.find(c=>c.id===selectedCategory)?.nameBn || selectedCategory}` : `Fresh Category: ${selectedCategory}`)
                      }
                    </h2>
                    <p className="text-xs text-gray-400 font-medium mt-1">
                      {products.filter(p => !p.id.startsWith('cb') && p.isActive !== false && p.approved !== false && (selectedCategory === 'all' || p.category === selectedCategory)).length}টি পণ্য সরাসরি মাঠ থেকে আপনার টেবিলে
                    </p>
                  </div>
                  
                  {/* Dynamic page / Offers navigators */}
                  <div className="flex items-center gap-2">
                    {selectedCategory !== 'all' && (
                      <button 
                        onClick={() => setSelectedCategory('all')}
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition cursor-pointer"
                      >
                        {language === 'bn' ? 'সব পণ্য দেখান 🛍️' : 'Show All Products 🛍️'}
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setView('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black rounded-xl transition cursor-pointer"
                    >
                      {language === 'bn' ? 'ক্যাটাগরি ফিল্টার করুন 🔍' : 'Filter by Category 🔍'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {products
                    .filter((p) => !p.id.startsWith('cb') && p.isActive !== false && p.approved !== false && (selectedCategory === 'all' || p.category === selectedCategory))
                    .map((p) => {
                      console.log("[App.tsx (CategoryGrid)] Mapping product:", p.title, "ID:", p.id, "images:", p.images);
                      return (
                        <ProductCard 
                          key={p.id} 
                          product={p} 
                          onOpenQuickView={(prod) => {
                            setSelectedProductId(prod.id);
                            setView('product-details');
                          }} 
                          onEditProduct={setEditingProduct}
                          onToggleCompare={handleToggleCompare}
                          isCompared={comparedProductIds.includes(p.id)}
                        />
                      );
                    })}
                </div>
              </div>
            </section>

            {/* WEEKLY COMBO PACKAGES SECTION */}
            <section id="weekly-combos" className="py-12 bg-slate-50 border-t border-gray-100 scroll-mt-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-150 px-3.5 py-1 rounded-full font-black uppercase tracking-wider">
                    {language === 'bn' ? 'পারিবারিক সাশ্রয়ী প্যাকেজ' : 'Weekly & Family Combo Buckets'}
                  </span>
                  <h2 className="text-xl sm:text-3.5xl font-black text-gray-850 font-sans mt-3 leading-snug">
                    {language === 'bn' ? 'সাপ্তাহিক ও ফ্যামিলি কম্বো বাস্কেট' : 'Weekly Combo Packages'}
                  </h2>
                  <p className="text-xs text-gray-400 mt-2 font-medium">
                    {language === 'bn' 
                      ? 'বাছাই করা স্বাস্থ্যকর প্রিমিয়াম অর্গানিক খাবারের বাজেট সাশ্রয়ী কম্বো বাস্কেট সরাসরি আপনার দরজায়।' 
                      : 'Handpicked premium organic vegetable & grocery combinations direct from farmers.'}
                  </p>
                </div>

                {/* Grid listing of all weekly combo baskets (No tabs/No empty sections) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products
                    .filter(p => (p.id.startsWith('cb') || p.isWeeklyCombo === true) && p.isActive !== false && p.approved !== false)
                    .map((basket) => {
                      const originalPrice = basket.price;
                      const displayPrice = basket.discountPrice || basket.price;
                      const hasDiscount = !!basket.discountPrice;
                      const whatsappMessage = encodeURIComponent(`আসসালামু আলাইকুম, আমি কৃষক বাজার থেকে "${basket.title}" কম্বো বাস্কেটটি কিনতে চাই।\nমূল্য: ৳${displayPrice}`);
                      const whatsappUrl = `https://wa.me/8801931355398?text=${whatsappMessage}`;

                      const isAuthorizedToEdit = (currentUser?.role === 'Admin') || 
                        (currentUser?.role === 'Farmer' && currentUser.farmerId === basket.farmerId);

                      return (
                        <div 
                          key={basket.id}
                          className="group flex flex-col overflow-hidden rounded-2xl border border-gray-150 bg-white hover:border-emerald-250 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative"
                        >
                          {/* Edit Button */}
                          {isAuthorizedToEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProduct(basket);
                              }}
                              className="absolute top-3 left-3 z-30 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 text-xs font-black shadow-md border border-amber-400 flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                            >
                              ✏️ এডিট (Edit)
                            </button>
                          )}

                          {/* Image */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 cursor-pointer" onClick={() => {
                            setSelectedProductId(basket.id);
                            setView('product-details');
                          }}>
                            <img
                              src={convertGoogleDriveLink(basket.images[0])}
                              alt={basket.title}
                              className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            <span className="absolute right-3 top-3 z-10 rounded-lg bg-emerald-600 px-2.5 py-1 text-[9px] font-black tracking-wide text-white uppercase shadow-md">
                              🎯 {language === 'bn' ? 'সেরা ডিল' : 'Special Deal'}
                            </span>
                            {hasDiscount && (
                              <span className="absolute right-3 top-10 z-10 rounded-lg bg-red-500 px-2.5 py-1 text-[9px] font-black text-white shadow-md animate-pulse">
                                {Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}% ছাড়
                              </span>
                            )}
                          </div>

                          {/* Text Detail Info */}
                          <div className="p-5 flex-1 flex flex-col justify-between font-sans space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                                <span>👨‍🌾 {basket.farmerName || 'কৃষক বাজার'}</span>
                                <span>•</span>
                                <span>📍 {basket.farmName || 'সরাসরি হাব'}</span>
                              </div>
                              <h3 
                                onClick={() => {
                                  setSelectedProductId(basket.id);
                                  setView('product-details');
                                }}
                                className="font-extrabold text-sm text-gray-800 hover:text-emerald-700 cursor-pointer line-clamp-1 text-left"
                              >
                                {basket.title}
                              </h3>
                              <p className="text-[11px] leading-relaxed text-gray-500 line-clamp-2 text-left">
                                {basket.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-sm font-black text-emerald-700">৳{displayPrice}</span>
                                {hasDiscount && (
                                  <span className="text-[10px] text-gray-400 line-through">৳{originalPrice}</span>
                                )}
                              </div>
                              
                              <div className="flex gap-1.5 shrink-0">
                                <button
                                  onClick={() => addToCart(basket)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black transition cursor-pointer"
                                >
                                  🛒 বাস্কেটে নিন
                                </button>
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-[10px] font-black flex items-center gap-1 shadow-2xs transition-all active:scale-[0.98] duration-150 cursor-pointer"
                                >
                                  📞 চ্যাট
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* SHOP OR READY TO COOK VIEW */}
        {(currentView === 'shop' || currentView === 'ready-to-cook') && (
          <section className="py-8 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-5 mb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-black text-gray-800 font-sans flex items-center gap-2">
                    {currentView === 'ready-to-cook' ? '🍳 রেডি-টু-কুক কর্নার' : '🛍️ সতেজ পণ্যের বাজার'}
                  </h1>
                  <p className="text-xs text-gray-400 mt-1 leading-none font-medium">
                    {getFilteredProducts().length}টি পণ্য পাওয়া গিয়েছে সরাসরি কৃষকদের মাঠ থেকে
                  </p>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-2.5">
                  
                  {/* District filter */}
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="rounded-xl border border-gray-200/80 bg-white py-2 px-3.5 text-xs font-semibold text-gray-600 outline-none focus:border-emerald-500 shadow-sm"
                  >
                    <option value="all">উৎপাদন এলাকা (সব জেলা)</option>
                    <option value="Rajshahi">রাজশাহী (Rajshahi)</option>
                    <option value="Jessore">যশোর (Jessore)</option>
                    <option value="Rangpur">রংপুর (Rangpur)</option>
                    <option value="Bogra">বগুড়া (Bogra)</option>
                    <option value="Sylhet">সিলেট (Sylhet)</option>
                    <option value="Comilla">কুমিল্লা (Comilla)</option>
                    <option value="Dinajpur">দিনাজপুর (Dinajpur)</option>
                    <option value="Barisal">বরিশাল (Barisal)</option>
                    <option value="Mymensingh">ময়মনসিংহ (Mymensingh)</option>
                    <option value="Kushtia">কুষ্টিয়া (Kushtia)</option>
                  </select>

                  {/* Category switcher */}
                  {currentView === 'shop' && (
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="rounded-xl border border-gray-200/80 bg-white py-2 px-3.5 text-xs font-semibold text-gray-600 outline-none focus:border-emerald-500 shadow-sm"
                    >
                      <option value="all">সব ক্যাটাগরি (All categories)</option>
                      <option value="fruits">ফলমূল (Fruits)</option>
                      <option value="vegetables">শাকসবজি (Vegetables)</option>
                      <option value="fish">মাছ (Fish)</option>
                      <option value="meat">মাংস (Meat)</option>
                      <option value="honey">খাঁটি মধু (Honey)</option>
                      <option value="spices">মসলাপাতি (Spices)</option>
                      <option value="organic">জৈব খাবার (Organic)</option>
                      <option value="ready-to-cook">রেডি-টু-কুক (Ready-to-Cook)</option>
                    </select>
                  )}

                  {/* Sorting products */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-xl border border-gray-200/80 bg-white py-2 px-3.5 text-xs font-semibold text-gray-600 outline-none focus:border-emerald-500 shadow-sm"
                  >
                    <option value="default">সাজানো: সাধারণ (Default Sort)</option>
                    <option value="price-asc">দাম: কম থেকে বেশি (Price: Low to High)</option>
                    <option value="price-desc">দাম: বেশি থেকে কম (Price: High to Low)</option>
                    <option value="rating-desc">গ্রাহক রেটিং: সর্বোচ্চ (Customer Rating)</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {getFilteredProducts().length === 0 ? (
                  <div className="col-span-full py-16 text-center text-gray-500 font-semibold bg-white rounded-3xl border border-gray-100 shadow-sm font-sans flex flex-col items-center justify-center p-8 gap-3">
                    <span className="text-4xl text-emerald-600 select-none">🌱</span>
                    <p className="text-sm">দুঃখিত, এই ক্যাটাগরিতে বা অঞ্চলে বর্তমানে কোনো ফসল পাওয়া যায়নি।</p>
                    <p className="text-[11px] text-gray-400">অনুগ্রহ করে অন্য ক্যাটাগরি বা জেলা নির্বাচন করে চেষ্টা করুন।</p>
                  </div>
                ) : (
                  getFilteredProducts().map((p) => {
                    console.log("[App.tsx (ShopGrid)] Mapping product:", p.title, "ID:", p.id, "images:", p.images);
                    return (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        onOpenQuickView={(prod) => {
                          setSelectedProductId(prod.id);
                          setView('product-details');
                        }} 
                        onEditProduct={setEditingProduct} 
                        onToggleCompare={handleToggleCompare}
                        isCompared={comparedProductIds.includes(p.id)}
                      />
                    );
                  })
                )}
              </div>

            </div>
          </section>
        )}

        {/* OUR STORY / BLOG DEDICATED VIEW */}
        {currentView === 'our-story' && (
          <div className="bg-white min-h-screen text-gray-800">
            {/* Elegant Header Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 to-emerald-950 text-white py-20 px-4 sm:px-6 lg:px-8 select-none">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"></div>
              <div className="relative max-w-4xl mx-auto text-center space-y-4 font-sans">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                  🌿 Our Story & Mission • আমাদের পথচলা
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  {siteSettings?.storyTitleBn || 'দালাল মুক্ত ও রাসায়নিক মুক্ত সুখী বাংলার স্বপ্নযাত্রায় কৃষক বাজার'}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mx-auto leading-relaxed">
                  {siteSettings?.storySubtitleBn || 'আমরা প্রচলিত মধ্যস্বত্বভোগী, ফড়িয়া ও আড়তদারদের কমিশন কালচার ভেঙেছি। আমাদের প্ল্যাটফর্মে কৃষক সরাসরি তার ফসলের মূল্য ঠিক করেন ও বিক্রি করেন।'}
                </p>
              </div>
            </div>

            {/* Core Story & Philosophy Grid */}
            <section className="py-16 bg-gray-50/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <span className="text-xs uppercase tracking-widest text-emerald-700 font-extrabold bg-emerald-100/50 px-3.5 py-1.5 rounded-full font-sans">
                      The Challenge & Vision • আমাদের মিশন ও ভিশন
                    </span>
                    <h2 className="text-2xl sm:text-3.5xl font-black text-gray-900 leading-tight block font-sans">
                      {siteSettings?.storyChallengeTitleBn || 'কেন আমরা এই সামাজিক বিপ্লব শুরু করেছি?'}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal block font-sans">
                      {siteSettings?.storyChallengeTextBn || 'আমরা বিশ্বাস করি, আমাদের মাটির উর্বরতা ও কৃষকদের অক্লান্ত পরিশ্রম এদেশের সবচেয়ে বড় সম্পদ। অথচ বাজার ব্যবস্থার অসঙ্গতি ও দালালের কারসাজিতে কৃষক ও সাধারণ কাস্টমার দুপক্ষই শোষিত হচ্ছেন প্রতিদিন। কৃষক বাজার এই বৈষম্যের অবসান ঘটাতে সরাসরি চাষীর ওয়ালেট ক্ষমতায়ন ও সতেজ খাবারের একটি সামাজিক বিপ্লব।'}
                    </p>
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/50 flex gap-4 items-start font-sans">
                      <span className="text-3xl text-emerald-700 select-none">🎯</span>
                      <div>
                        <h4 className="font-extrabold text-sm text-emerald-900 justify-start">{siteSettings?.storyModelTitleBn || 'কৃষক বাজার মডেল ও আমাদের লক্ষ্য'}</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-normal text-left">
                          {siteSettings?.storyModelTextBn || 'আমাদের কোনো নিজস্ব দোকানপাট বা কোল্ডস্টোরেজ সিন্ডিকেট নেই। অর্ডার প্লেস করার পর আমাদের কৃষকরা দ্রুত পণ্য সরাসরি হাব হয়ে ক্রেতার নিকট পাঠান।'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-150 aspect-[4/3] bg-emerald-800 select-none">
                    <img 
                      src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800" 
                      alt="Bangladesh beautiful agriculture farm"
                      className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent p-6 flex flex-col justify-end text-left font-sans">
                      <span className="text-white text-xs font-mono font-bold block">মৌসুমী সতেজ খেত</span>
                      <p className="text-emerald-250 text-xs font-semibold leading-relaxed block mt-1">সোনার বাংলায় তাজা ফলন তুলছেন আমাদের একজন অংশীদার কৃষক।</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Story Pillars Grid */}
            <section className="py-16 bg-white border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16 font-sans">
                  <span className="text-xs font-black text-emerald-600 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 block w-max mx-auto">Our Pillars • লক্ষ্য ও নীতি</span>
                  <h2 className="text-2xl sm:text-3.5xl font-extrabold text-gray-900 tracking-tight mt-3 block">আমাদের ৪টি মূল স্তম্ভ</h2>
                  <p className="text-xs text-gray-500 mt-2 block">আমাদের প্রতিটি পদক্ষেপ এই চারটি দর্শনের উপর ভিত্তি করে পরিচালিত হয় যা আমাদের কৃষক ও ক্রেতাদের সমৃদ্ধ করে।</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  {/* Pillar 1: Bangladesh agriculture */}
                  <div className="bg-gray-50/50 hover:bg-emerald-50/10 border border-gray-105 rounded-3xl p-6 sm:p-8 hover:shadow-md transition-all space-y-3 font-sans">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl select-none">🌾</span>
                      <h4 className="font-extrabold text-base text-gray-900 block">{siteSettings?.storyPillar1Title || 'সোনার বাংলা ও উর্বর মৃত্তিকা'}</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed block">
                      {siteSettings?.storyPillar1Text || 'বাংলাদেশ সুজলা-সুফলা উর্বর পলল মাটির দেশ। আমাদের চাষীরা রোদে পুড়ে বৃষ্টিতে ভিজে পবিত্র ঘামের বিনিময়ে আমাদের জন্য মৌসুমী তাজা রসালো ফসল ফলান। সেই ফসল সরাসরি সংগ্রহ করাই আমাদের গর্ব।'}
                    </p>
                  </div>

                  {/* Pillar 2: Middlemen problem */}
                  <div className="bg-gray-50/50 hover:bg-emerald-50/10 border border-gray-105 rounded-3xl p-6 sm:p-8 hover:shadow-md transition-all space-y-3 font-sans">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl text-red-500 select-none">⚠️</span>
                      <h4 className="font-extrabold text-base text-gray-900 block">{siteSettings?.storyPillar2Title || 'সিন্ডিকেট ও মধ্যস্বত্ব ভোগী অবসান'}</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed block">
                      {siteSettings?.storyPillar2Text || 'মাঠের উৎপাদক ফসল ৮ টাকায় বিক্রি করলেও আড়তদার ও ঘাটে ঘাটে মধ্যস্বত্বভোগীদের কৃত্রিম সংকটে ঢাকায় সাধারণ কাস্টমার তা ৮০ টাকায় ক্ষতিকর কেমিক্যালসহ কিনতে বাধ্য হন। আমরা এই কৃত্রিম সংকট ভেঙে দিয়েছি।'}
                    </p>
                  </div>

                  {/* Pillar 3: Safe food mission */}
                  <div className="bg-gray-50/50 hover:bg-emerald-50/10 border border-gray-105 rounded-3xl p-6 sm:p-8 hover:shadow-md transition-all space-y-3 font-sans">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl text-blue-500 select-none">🛡️</span>
                      <h4 className="font-extrabold text-base text-gray-900 block">{siteSettings?.storyPillar3Title || 'রাসায়নিক ও ভেজাল মুক্ত বিশুদ্ধতা'}</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed block">
                      {siteSettings?.storyPillar3Text || 'ক্ষতিকর কার্বাইড, ফরমালিন বা নোংরা প্রিজারভেティブ বর্জন করে সরাসরি মাঠ থেকে তাজা ও নির্ভেজাল পুষ্টিকর খাবার আপনার পরিবারের কাছে দ্রুততম সময়ে ডেলিভারি করাই আমাদের লক্ষ্য। এজন্য রয়েছে আমাদের নিজস্ব কোয়ালিটি কন্ট্রোল টিম।'}
                    </p>
                  </div>

                  {/* Pillar 4: Farmer empowerment */}
                  <div className="bg-gray-50/50 hover:bg-emerald-50/10 border border-gray-105 rounded-3xl p-6 sm:p-8 hover:shadow-md transition-all space-y-3 font-sans">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl text-amber-500 select-none">🤝</span>
                      <h4 className="font-extrabold text-base text-gray-900 block">{siteSettings?.storyPillar4Title || 'স্বাধীন ও ক্ষমতাবান আধুনিক চাষী'}</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed block">
                      {siteSettings?.storyPillar4Text || 'কোনো মধ্যস্বত্বভোগী ছাড়াই চাষীরা যাতে নিজেই তার কঠোর মেহনতের মূল নির্ধারণ করতে পারেন আমরা তার ব্যবস্থা করেছি। সম্পূর্ণ লভ্যাংশ সরাসরি নিজস্ব ডিজিটাল ওয়ালেটে চাষীদের কাছে পৌঁছে দিয়ে তাদের স্বাবলম্বী করা আমাদের উদ্দেশ্য।'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* KRISHOK BAZAR MODEL */}
            <section className="bg-emerald-50/30 py-20 border-t border-emerald-100 select-none">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center font-sans">
                <div className="max-w-3xl mx-auto">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-emerald-200">Our Working Model • কিভাবে কাজ করে</span>
                  <h2 className="text-2xl sm:text-3.5xl font-black text-gray-900 mt-4 leading-tight block">কৃষক বাজার মডেল</h2>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-700 mt-1 uppercase tracking-wide block">দালাল ছাড়া সরাসরি মাঠ থেকে সতেজ পণ্য</p>
                  <p className="text-xs text-gray-500 leading-relaxed mt-4 max-w-2xl mx-auto block">
                    আমরা প্রচলিত মধ্যস্বত্বভোগী, ফড়িয়া ও আড়তদারদের কমিশন কালচার ভেঙেছি। আমাদের প্ল্যাটফর্মে কৃষক সরাসরি তার ফসলের মূল্য ঠিক করেন ও বিক্রি করেন। ক্রেতা সরাসরি মাঠের মূল্য দিয়ে সতেজ অর্গানিক খাবার পান।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
                  {/* Step 1 */}
                  <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 hover:shadow-md transition-all">
                    <span className="text-3xl block mb-4 select-none">🌱 01</span>
                    <h3 className="font-black text-gray-905 text-sm uppercase tracking-wide mb-2 block">সরাসরি কৃষক সংগ্রহ</h3>
                    <p className="text-xs text-gray-500 leading-relaxed block">
                      অর্ডার করার সঙ্গে সঙ্গেই আমাদের তালিকাভুক্ত কৃষকরা সরাসরি তাদের খেত, বাগান বা দিঘি থেকে সতেজ ফল, শাকসবজি ও মাছ উত্তোলন করেন।
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 hover:shadow-md transition-all border-emerald-200/60 shadow-xs">
                    <span className="text-3xl block mb-4 select-none">✔ 02</span>
                    <h3 className="font-black text-gray-905 text-sm uppercase tracking-wide mb-2 block">ভেরিফাইড ও কোয়ালিটি ল্যাব</h3>
                    <p className="text-xs text-gray-600 leading-relaxed block">
                      অংশীদার কৃষকরা প্রত্যেকেই ভেরিফাইড (Verified Farmer)। প্রতিটি আইটেমে কেমিক্যাল বা ক্ষতিকর ফরমালিন টেস্ট নিশ্চিত করার পর আমরা প্যাকেটজাত করি।
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 hover:shadow-md transition-all">
                    <span className="text-3xl block mb-4 select-none">⚡ 03</span>
                    <h3 className="font-black text-gray-905 text-sm uppercase tracking-wide mb-2 block">দ্রুতগতিতে হোম ডেলিভারি</h3>
                    <p className="text-xs text-gray-500 leading-relaxed block">
                      কোনো হিমঘর বা স্টোরেজ কালচার নেই। সংগ্রহ করার কয়েক ঘণ্টার মধ্যেই আমাদের নিবেদিত দল সরাসরি ঢাকার আপনার ডোরস্টেপে ডেলিভারি দেয়।
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* WHY USE THIS APP VIDEO SECTION & MEET OUR 5 REAL FARMERS AT THE BOTTOM */}
            <BottomVideoSection />
            <BottomFarmersSection />
          </div>
        )}
        </main>

          {/* FOOTER */}
      <footer className="bg-emerald-900 text-emerald-50 border-t border-emerald-950 pt-10 pb-28 md:pb-12 text-xs select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* SECURE PAYMENT METHODS SECTION */}
          <div className="border-b border-emerald-800/30 pb-5 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-800 border border-emerald-700 text-[8px] font-black text-amber-400 uppercase tracking-wider font-sans">
                    100% Secured Payment
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-100">আমরা যেসব নিরাপদ পেমেন্ট মাধ্যম সমর্থন করি:</span>
                </div>
              </div>
            </div>

            {/* VISUALLY GROUPED COMPACT PAYMENT ICONS - CSS GRID LAYOUT */}
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 bg-emerald-950/25 p-2 rounded-xl border border-emerald-800/20">
              
              {/* bKash */}
              <div className="flex items-center justify-center gap-1 w-full h-8 px-2 bg-white rounded-md border border-pink-100 shadow-2xs select-none">
                <span className="h-3.5 w-3.5 bg-[#e2136e] rounded-full flex items-center justify-center text-[8px] font-black text-white font-sans shrink-0">b</span>
                <span className="text-[9px] font-black text-[#e2136e] font-sans">bKash</span>
                <span className="text-[8px] font-bold text-zinc-400 px-1 border-l border-zinc-200">বিকাশ</span>
              </div>

              {/* Nagad */}
              <div className="flex items-center justify-center gap-1 w-full h-8 px-2 bg-white rounded-md border border-orange-100 shadow-2xs select-none">
                <span className="h-3.5 w-3.5 bg-[#f85c24] rounded-full flex items-center justify-center text-[8px] font-black text-white font-sans shrink-0">n</span>
                <span className="text-[9px] font-black text-[#f85c24] font-sans">Nagad</span>
                <span className="text-[8px] font-bold text-zinc-400 px-1 border-l border-zinc-200">নগদ</span>
              </div>

              {/* Rocket */}
              <div className="flex items-center justify-center gap-1 w-full h-8 px-2 bg-white rounded-md border border-purple-100 shadow-2xs select-none">
                <span className="h-3.5 w-3.5 bg-[#8c3494] rounded-full flex items-center justify-center text-[7px] font-black text-white font-sans shrink-0">R</span>
                <span className="text-[9px] font-black text-[#8c3494] font-sans">Rocket</span>
                <span className="text-[8px] font-bold text-zinc-400 px-1 border-l border-zinc-200">রকেট</span>
              </div>

              {/* Visa */}
              <div className="flex items-center justify-center gap-1 w-full h-8 px-2 bg-[#1a1f71] rounded-md border border-blue-900 shadow-2xs select-none">
                <span className="text-[8.5px] font-black italic text-white font-sans tracking-tight">VISA</span>
                <span className="text-[8px] font-bold text-blue-300 px-1 border-l border-blue-800">ভিসা</span>
              </div>

              {/* Mastercard */}
              <div className="flex items-center justify-center gap-1 w-full h-8 px-2 bg-[#212121] rounded-md border border-zinc-800 shadow-2xs select-none">
                <div className="flex -space-x-0.5 items-center shrink-0">
                  <span className="h-2.5 w-2.5 bg-[#eb001b] rounded-full opacity-90 block"></span>
                  <span className="h-2.5 w-2.5 bg-[#ff5f00] rounded-full opacity-90 block"></span>
                </div>
                <span className="text-[8.5px] font-black text-white font-sans">MC</span>
                <span className="text-[8px] font-bold text-zinc-400 px-1 border-l border-zinc-700">কার্ড</span>
              </div>

              {/* Bank Transfer */}
              <div className="flex items-center justify-center gap-1 w-full h-8 px-2 bg-white rounded-md border border-emerald-100 shadow-2xs select-none">
                <span className="text-[8px] font-black text-emerald-800 font-sans">🏛 BANK</span>
                <span className="text-[8px] font-bold text-emerald-950 px-1 border-l border-zinc-200 font-sans">ব্যাংক</span>
              </div>

              {/* Cash on Delivery */}
              <div className="flex items-center justify-center gap-1 w-full h-8 px-2 bg-white rounded-md border border-emerald-100 shadow-2xs select-none col-span-2 xs:col-span-1 sm:col-span-1 md:col-span-1">
                <span className="text-[8px] font-black text-emerald-800 font-sans">📦 COD</span>
                <span className="text-[8px] font-bold text-emerald-950 px-1 border-l border-zinc-200 font-sans font-medium">ক্যাশ</span>
              </div>

            </div>
          </div>

          {/* Bottom Copyright and Navigation Bar */}
          <div className="relative w-full border-t border-emerald-800/20 pt-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start justify-between text-emerald-100 font-medium">
              
              {/* Left Column: Copyright & Socials */}
              <div className="relative space-y-4 text-left w-full">
                <p className="text-[11px] text-emerald-300 font-sans leading-relaxed">© 2026 কৃষক বাজার (Krishok Bazar). সামাজিক এগ্রো-উদ্যোগ। যথাযথ কপিরাইট সংরক্ষিত।</p>
                {/* social media links with high fidelity brand matching and direct support */}
                <div className="flex flex-wrap items-center gap-2.5 mt-2">
                  {/* Facebook Brand Icon */}
                  <a 
                    href="https://www.facebook.com/people/%E0%A6%95%E0%A7%83%E0%A6%B7%E0%A6%95-%E0%A6%AC%E0%A6%BE%E0%A6%9C%E0%A6%BE%E0%A6%B0-Krishok-Bazar/61578459151972/"
                    target="_blank" 
                    rel="noreferrer" 
                    className="h-8 w-8 rounded-xl bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-sm cursor-pointer" 
                    title="ফেসবুক পেজ"
                  >
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>

                  {/* YouTube Brand Icon */}
                  <a 
                    href="https://youtube.com/@krishokbazarbd?si=SvzrYv3A3M0fXDbO"
                    target="_blank" 
                    rel="noreferrer" 
                    className="h-8 w-8 rounded-xl bg-[#FF0000] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-sm cursor-pointer" 
                    title="ইউটিউব চ্যানেল"
                  >
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.4.5 5.6c.3 1.2 1.3 2.1 2.5 2.4 2.2.5 9 .5 9 .5s6.8 0 9-.5c1.2-.3 2.2-1.2 2.5-2.4.5-2.2.5-5.6.5-5.6s0-3.4-.5-5.6zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"/></svg>
                  </a>

                  {/* TikTok Brand Icon */}
                  <a 
                    href="https://www.tiktok.com/@krishokbazarbd"
                    target="_blank" 
                    rel="noreferrer" 
                    className="h-8 w-8 rounded-xl bg-black flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-sm cursor-pointer" 
                    title="টিকটক আইডি"
                  >
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.43-.4-.63-.62v7.33c0 1.94-.48 3.91-1.63 5.46-1.51 2.08-4.14 3.09-6.66 2.65-2.5-.4-4.63-2.26-5.28-4.72-.8-2.93.43-6.23 2.97-7.66 1.05-.6 2.27-.85 3.48-.75v4.14c-.69-.13-1.42-.04-2.03.32-1.07.61-1.53 1.94-1.12 3.12.36 1.08 1.48 1.79 2.62 1.67 1.25-.09 2.22-1.19 2.22-2.45V0c-.26.01-.52.01-.78.02z" /></svg>
                  </a>

                  {/* WhatsApp Support Brand Icon */}
                  <a 
                    href="https://wa.me/8801931355398"
                    target="_blank" 
                    rel="noreferrer" 
                    className="h-8 w-8 rounded-xl bg-[#25D366] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-sm cursor-pointer" 
                    title="হোয়াটসঅ্যাপ চ্যাট"
                  >
                    <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.634-1.02-5.111-2.879-6.972-1.858-1.861-4.336-2.883-6.971-2.884-5.441 0-9.868 4.425-9.872 9.863-.001 1.761.47 3.483 1.364 5.018l-.946 3.456 3.539-.928zM17.351 14.24c-.291-.146-1.727-.853-1.993-.95-.266-.097-.46-.146-.653.146-.193.291-.749.95-.918 1.143-.169.193-.338.218-.629.072-1.396-.697-2.31-1.2-3.153-2.645-.224-.385.224-.357.641-1.196.069-.141.034-.263-.017-.364-.051-.101-.46-1.107-.63-1.513-.166-.399-.333-.344-.46-.35-.121-.006-.259-.007-.396-.007-.137 0-.361.051-.55.259-.189.208-.724.708-.724 1.728 0 1.02.742 2.007.845 2.149.103.143 1.461 2.23 3.539 3.129 1.134.49 1.832.612 2.485.513.664-.1 1.727-.706 1.97-.1.242-.294.242-.544.17-.597-.072-.051-.266-.148-.557-.294z"/></svg>
                  </a>

                  {/* Call Hotline Icon */}
                  <a 
                    href="tel:01931355398"
                    className="h-8 w-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-sm cursor-pointer" 
                    title="হটলাইন কল"
                  >
                    <span className="text-[14px]">📞</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Navigation Links and Language Switcher */}
              <div className="relative w-full text-left lg:text-right">
                <div className="flex flex-wrap items-center justify-start lg:justify-end gap-x-4 gap-y-3 text-[11px] font-black tracking-wide text-emerald-200">
                  <button onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer select-none">হোম (Home)</button>
                  <button onClick={() => { setView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer select-none">তাজা পণ্য (Products)</button>
                  <button onClick={() => { setView('weekly-combos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer select-none">কম্বো বাজেট (Weekly Budget)</button>
                  <button onClick={() => { setView('ready-to-cook'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer select-none">রেডি-টু-কুক (Ready to Cook)</button>
                  <button onClick={() => { setView('our-story'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer select-none">আমাদের গল্প (Our Story)</button>
                  <button onClick={() => { setView('privacy-policy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors text-amber-300 cursor-pointer select-none font-extrabold pb-0.5 border-b border-amber-300">গোপনীয়তা নীতি</button>
                  <button onClick={() => { setView('shipping-policy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors text-amber-300 cursor-pointer select-none font-extrabold pb-0.5 border-b border-amber-300">ফেরত ও শিপিং নীতি</button>
                  <button 
                    onClick={() => {
                      setView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setTimeout(() => {
                        const searchInput = document.querySelector('input[type="text"]');
                        if (searchInput) (searchInput as HTMLInputElement).focus();
                      }, 250);
                    }} 
                    className="hover:text-amber-400 transition-colors cursor-pointer select-none"
                  >
                    খুঁজুন (Search)
                  </button>
                  
                  {/* LANGUAGE SWITCHER PLACED SOLELY IN THE FOOTER */}
                  <button 
                    onClick={toggleLanguage}
                    className="rounded-xl bg-emerald-800 border border-emerald-700 px-3 py-1.5 text-[10px] font-black text-emerald-100 hover:bg-emerald-700 hover:border-emerald-600 flex items-center gap-1 cursor-pointer transition active:scale-95 select-none shrink-0"
                    title=" ভাষা পরিবর্তন করুন / Switch Language"
                  >
                    🌐 <span className="font-sans font-extrabold">{language === 'en' ? 'বাংলা' : 'ENGLISH'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </footer>

      {/* OVERLAY ELEMENTS */}
      <SubscriptionModal 
        isOpen={isSubscriptionOpen}
        onClose={() => {
          setIsSubscriptionOpen(false);
          setIsSubscriptionAutoTriggered(false);
          setAutoTriggerSubscriptionPlanId(null);
        }}
        defaultRole={subscriptionDefaultRole}
        isAutoTriggered={isSubscriptionAutoTriggered}
        autoTriggerPlanId={autoTriggerSubscriptionPlanId}
        onDismissAutoTrigger={() => {
          setIsSubscriptionOpen(false);
          setIsSubscriptionAutoTriggered(false);
          setAutoTriggerSubscriptionPlanId(null);
        }}
      />

      <ProductModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        onEditProduct={setEditingProduct}
      />

      <EditProductModal 
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
      />

      <ProductComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedIds={comparedProductIds}
        onRemoveId={(id) => setComparedProductIds((prev) => prev.filter((x) => x !== id))}
        onClearAll={() => setComparedProductIds([])}
        onSelectProduct={(productId) => {
          setSelectedProductId(productId);
          setView('product-details');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderSuccessModal 
        orderId={successOrderId}
        onClose={() => setSuccessOrderId(null)}
      />

      <RiktazAI setView={setView} setSelectedProductId={setSelectedProductId} />
      <BottomNavigation
        currentView={currentView}
        setView={setView}
        onOpenCart={handleOpenCartDrawer}
        onOpenAuth={handleOpenAuthModal}
      />

      {/* BILINGUAL OFFLINE MODE TOAST NOTIFICATION */}
      <AnimatePresence>
        {isOfflineState && !offlineDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 70, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 xs:bottom-6 max-w-sm w-[calc(100%-2rem)] bg-slate-900/95 border border-amber-500/40 text-white p-3.5 rounded-2xl shadow-2xl backdrop-blur-md z-[10000] flex flex-col gap-2.5 font-sans"
          >
            <div className="flex items-start gap-2.5">
              <div className="bg-amber-500/10 p-1.5 rounded-lg text-amber-500 shrink-0 mt-0.5 animate-pulse">
                <WifiOff className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-amber-400">
                  {language === 'bn' ? 'ইন্টারনেট সংযোগ বিচ্ছিন্ন!' : 'You are Offline!'}
                </p>
                <p className="text-[10.5px] text-gray-300 leading-snug mt-0.5">
                  {language === 'bn' 
                    ? 'আপনি অফলাইন মোডে আছেন। সতেজ পণ্যের লাইভ ডেটা পেতে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।' 
                    : 'Viewing in offline mode. Live updates for safe food require a stable connection.'}
                </p>
              </div>
              <button 
                onClick={() => setOfflineDismissed(true)} 
                className="text-gray-400 hover:text-white transition p-1 hover:bg-white/10 rounded-lg cursor-pointer"
                aria-label="Dismiss"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </div>
            
            <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-2 text-[10px]">
              <span className="flex items-center gap-1.5 text-gray-400 mr-auto text-[9.5px]">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                {language === 'bn' ? 'অফলাইন সেশন' : 'Offline Session'}
              </span>
              <button
                onClick={() => window.location.reload()}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-md"
              >
                <RefreshCw className="h-3 w-3" />
                {language === 'bn' ? 'পুনরায় চেষ্টা' : 'Retry'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AppProvider>
  );
}
