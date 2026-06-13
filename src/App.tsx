/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, RefreshCw, X as CloseIcon } from 'lucide-react';
import { AppProvider, useApp } from './AppContext';
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
import { useSubscriptionTimer } from './hooks/useSubscriptionTimer';
import { VerifiedFarmersView } from './components/VerifiedFarmersView';
import { BlogView } from './components/BlogView';
import { ScrollingBanners } from './components/ScrollingBanners';
import { WeeklyCombosView } from './components/WeeklyCombosView';
import { BottomNavigation } from './components/BottomNavigation';
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

const COMBO_BASKETS: Product[] = [
  {
    id: 'cb1',
    title: 'সাপ্তাহিক রেশনের বাজেট কম্বো বাস্কেট',
    description: 'গোল লাল আলু ২ কেজি, তাল বেগুন ১ কেজি, দেশী পেঁয়াজ ১ কেজি, রসুনের সেরা কোয়ালিটি ২৫০ গ্রাম, তাজা ধনে পাতা ২৫০ গ্রাম, কাঁচামরিচ ২৫০ গ্রাম, নরম কচি লম্বা লাউ ১টি।',
    price: 550,
    discountPrice: 490,
    category: 'ready-to-cook',
    farmerId: 'f5',
    farmerName: 'Fazle Rabbi',
    farmName: 'Fazle Rabbi অর্গানিক এগ্রো',
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
    farmerId: 'f12',
    farmerName: 'Ayesha Begum',
    farmName: 'Ayesha Begum অর্গানিক এগ্রো',
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
    farmerId: 'f23',
    farmerName: 'Sultana Razia',
    farmName: 'Sultana Razia অর্গানিক এগ্রো',
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
    toggleLanguage
  } = useApp();

  // Route state
  const [currentView, setView] = useState<'home' | 'shop' | 'ready-to-cook' | 'farmers' | 'customer-dashboard' | 'farmer-dashboard' | 'admin' | 'product-details' | 'farmer-store' | 'our-story' | 'blog' | 'admin-login' | 'weekly-combos'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedFarmerStoreId, setSelectedFarmerStoreId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [entryCompleted, setEntryCompleted] = useState(true);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [subscriptionDefaultRole, setSubscriptionDefaultRole] = useState<'customer' | 'farmer'>('customer');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeFarmerProfile, setActiveFarmerProfile] = useState<Farmer | null>(null);

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
  const isEligibleForSubscriptionTrigger = 
    (!currentUser || 
      (currentUser.role !== 'Admin' && (!currentUser.subscriptionStatus || currentUser.subscriptionStatus === 'none'))
    );

  useSubscriptionTimer((intervalName) => {
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
    setIsSubscriptionOpen(true);
    console.log(`Auto-triggering subscription modal for interval ${intervalName} targeting role: ${targetTabRole}`);
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

    return list;
  };

  // Save new crop/product submit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pick current farm-owner ID
    const fId = currentUser?.role === 'Farmer' ? (currentUser.farmerId || 'f6') : 'f1';

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
    else if (currentView === 'product-details') path = `/product/${selectedProductId || 'item'}`;
    else if (currentView === 'farmer-store') path = `/farmer/${selectedFarmerStoreId || 'profile'}`;

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }

    logAnalyticsEvent('screen_view', {
      firebase_screen: currentView,
      page_path: path,
      user_role: currentUser?.role || 'Guest'
    });
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
      description = `যশোর, রাজশাহী ও বগুড়ার তৃণমূলের ভেরিফাইড সাধারণ কৃষকদের সাথে সরাসরি সম্পর্কের নির্ভরযোগ্য প্ল্যাটফর্ম।`;
    } else if (currentView === 'our-story') {
      title = `আমাদের বৈপ্লবিক গল্প ও লক্ষ্য | ${siteSettings.seoTitle || 'কৃষক বাজার'}`;
      description = `সিন্ডিকেট ও কমিশন সংস্কৃতি ভেঙে অংশীদার চাষীদের সমৃদ্ধ করা এবং বিশুদ্ধ নিরাপদ খাবার পৌঁছে দেওয়াই আমাদের লক্ষ্য।`;
    } else if (currentView === 'customer-dashboard') {
      title = `আমার প্রোফাইল ও ট্র্যাকার | ${siteSettings.seoTitle || 'কৃষক বাজার'}`;
    } else if (currentView === 'admin') {
      title = `পরিচালনা প্যানেল (Global CRM CMS) | ${siteSettings.seoTitle || 'কৃষক বাজার'}`;
    } else if (currentView === 'product-details' && selectedProductId) {
      const prod = products.find(p => p.id === selectedProductId);
      if (prod) {
        title = `${prod.title} - কৃষক বাজার`;
        description = prod.description;
      }
    } else if (currentView === 'farmer-store' && selectedFarmerStoreId) {
      const farm = farmers.find(f => f.id === selectedFarmerStoreId);
      if (farm) {
        title = `কৃষক ${farm.name} এর দোকান | কৃষক বাজার`;
        description = farm.bio || `${farm.name} একজন ভেরিফাইড অংশীদার কৃষক।`;
      }
    }

    document.title = title;
    
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

    const oldSchema = document.getElementById('kb-structured-schema');
    if (oldSchema) oldSchema.remove();

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
              setSubscriptionDefaultRole(role);
              setIsSubscriptionOpen(true);
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
        {currentView === 'home' && (
          <div className="space-y-0 text-gray-800">
            {/* Carousel */}
            <HeroCarousel 
              onShopNow={() => setView('shop')}
              onViewFarmers={() => setView('farmers')}
              onCallHelp={() => handleOpenAuthModal()}
            />

            {/* Seasonal Harvest Bulletin Alerts Banner */}
            <SeasonalHarvestBanner
              onViewCrop={(alert) => {
                setView('shop');
                const searchPhrase = (language === 'en' ? alert.cropNameEn : alert.cropNameBn).split(' ')[0];
                setSearchQuery(searchPhrase);
              }}
              onOpenAuthModal={() => handleOpenAuthModal()}
            />

            {/* Featured category system */}
            <CategoriesGrid 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleSelectCategory} 
            />

            {/* SPOTLIGHTS & DISCOUNT OFFERS CARDS */}
            <section className="py-12 bg-gray-50">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-xs font-bold text-blue-600 tracking-wider uppercase block">
                      {siteSettings?.sectionMarketSubtitleBn || 'বিশেষ ছাড় ও সতেজ অফার'}
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black text-gray-800 font-sans mt-0.5">
                      {siteSettings?.sectionMarketTitleBn || 'সেরা অফার ও তাজা ফসল'}
                    </h2>
                  </div>
                  <button onClick={() => setView('shop')} className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1">
                    সব পণ্য দেখুন <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Grid limit of 12 freshest active standard products (excluding combo baskets) */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {products
                    .filter((p) => !p.id.startsWith('cb') && p.isActive !== false)
                    .slice(0, 12)
                    .map((p) => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        onOpenQuickView={(prod) => {
                          setSelectedProductId(prod.id);
                          setView('product-details');
                        }} 
                        onEditProduct={setEditingProduct}
                      />
                    ))}
                </div>
              </div>
            </section>

            {/* COMBO BASKET SECTION */}
            <section id="combo-basket" className="py-12 bg-white border-t border-gray-100 scroll-mt-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">পারিবারিক সাশ্রয়ী প্যাকেজ</span>
                  <h2 className="text-xl sm:text-3xl font-black text-gray-850 font-sans mt-1.5 leading-snug">
                    {siteSettings?.sectionComboTitleBn || 'সাপ্তাহিক ও ফ্যামিলি কম্বো বাস্কেট'}
                  </h2>
                  <p className="text-xs text-gray-400 mt-2 font-medium">
                    {siteSettings?.sectionComboSubtitleBn || 'সরাসরি কৃষকের মাঠের বাছাই করা তাজা কম্বো বাস্কেট অফারসমূহ। বিস্তারিত বিবরণ ও উপাদান তালিকা ওজনের সাথে বিস্তারিত পাতায় দেখে নিন।'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.filter(p => p.id.startsWith('cb')).map((basket) => {
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
                        className="group flex flex-col overflow-hidden rounded-2xl border border-gray-150/60 bg-white hover:border-emerald-250 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative"
                      >
                        {/* Edit Button directly on top of card on homepage! */}
                        {isAuthorizedToEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProduct(basket);
                            }}
                            className="absolute top-3 left-3 z-30 rounded-xl bg-amber-500 hover:bg-amber-605 text-white px-3 py-1.5 text-xs font-black shadow-md border border-amber-400 flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
                            title="এই কম্বো অফারটি এডিট করুন"
                          >
                            ✏️ এডিট (Edit)
                          </button>
                        )}

                        {/* Img portion */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 cursor-pointer" onClick={() => {
                          setSelectedProductId(basket.id);
                          setView('product-details');
                        }}>
                          <img
                            src={basket.images[0]}
                            alt={basket.title}
                            className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute right-3 top-3 z-10 rounded-lg bg-emerald-600 px-2.5 py-1 text-[9px] font-black tracking-wide text-white uppercase shadow-md">
                            🎯 সেরা ডিল
                          </span>
                          {hasDiscount && (
                            <span className="absolute right-3 top-10 z-10 rounded-lg bg-red-500 px-2.5 py-1 text-[9px] font-black text-white shadow-md animate-pulse">
                              {Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}% ছাড়
                            </span>
                          )}
                        </div>

                        {/* Text portion - Only shows Offer Name, Price, FarmerName and Buttons as requested! */}
                        <div className="flex flex-1 flex-col p-5">
                          <h3 
                            onClick={() => {
                              setSelectedProductId(basket.id);
                              setView('product-details');
                            }}
                            className="text-sm sm:text-base font-black text-gray-800 font-sans hover:text-emerald-700 transition-colors cursor-pointer"
                          >
                            {basket.title}
                          </h3>

                          {/* Offer's Farmer */}
                          <div className="mt-2.5 flex items-center gap-1 text-[11px] text-gray-400 font-bold border-t border-gray-50 pt-2.5">
                            📍 খামারি: <span className="text-gray-600 underline font-black cursor-pointer" onClick={() => {
                              if (basket.farmerId) {
                                setSelectedFarmerStoreId(basket.farmerId);
                                setView('farmer-store');
                              }
                            }}>{basket.farmerName}</span> (ভেরিফাইড)
                          </div>

                          {/* Pricing row */}
                          <div className="mt-4 flex items-center justify-between gap-1.5 border-t border-gray-50 pt-3">
                            <div className="flex flex-col">
                              {hasDiscount && (
                                <span className="text-[10px] text-gray-400 line-through font-mono">
                                  ৳{originalPrice}
                                </span>
                              )}
                              <span className="text-base font-black text-emerald-700 font-sans">
                                ৳{displayPrice} <span className="text-[10px] font-medium text-gray-400">/বাস্কেট</span>
                              </span>
                            </div>

                            {/* Cart keeping button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(basket, 1);
                              }}
                              className="rounded-xl px-3 py-2 text-[11px] font-extrabold shadow-sm bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-1"
                            >
                              <ShoppingCart className="h-3.5 w-3.5" />
                              কার্টে রাখুন
                            </button>
                          </div>

                          {/* Action Grid */}
                          <div className="grid grid-cols-3 gap-1.5 pt-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProductId(basket.id);
                                setView('product-details');
                              }}
                              className="flex items-center justify-center gap-1 rounded-xl bg-gray-100 hover:bg-gray-200 px-2 py-2 text-[10px] font-black text-gray-700 shadow-xs hover:scale-[1.02] transition-all cursor-pointer text-center font-sans font-bold"
                            >
                              📄 বিস্তারিত দেখুন
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(basket, 1);
                                window.dispatchEvent(new CustomEvent('open-cart-drawer', { detail: { openCheckout: true } }));
                              }}
                              className="flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 px-2 py-2 text-[10px] font-black text-white shadow-xs hover:scale-[1.02] transition-all cursor-pointer text-center font-sans font-bold"
                            >
                              🛒 এখনই কিনুন
                            </button>
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-center gap-1 rounded-xl bg-green-500 hover:bg-green-600 px-2 py-2 text-[10px] font-black text-white shadow-xs hover:scale-[1.02] transition-all cursor-pointer text-center text-sans font-bold"
                            >
                              📞 হোয়াটসঅ্যাপ
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* FARMERS SOCIAL YARD FEED SECTION */}
            <section id="farmers-yard" className="py-16 bg-gradient-to-b from-white via-emerald-50/20 to-gray-50 border-t border-gray-100">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">কৃষকের উঠান ও সামাজিক ফিড</span>
                  <h2 className="text-xl sm:text-3xl font-black text-gray-850 font-sans mt-1.5 leading-snug">
                    কৃষকের মাঠের চিত্র ও সরাসরি ভিডিও গ্যালারি
                  </h2>
                  <p className="text-xs text-gray-400 mt-2 font-medium">
                    কৃষকদের তোলা খামারের আসল ছবি, ইউটিউব ভিডিও এবং দৈনন্দিন কাজের পোস্ট। মন্তব্য করুন ও সরাসরি খামারিদের লাইক দিয়ে উৎসাহিত করুন!
                  </p>
                </div>

                <FarmerSocialFeed />
              </div>
            </section>

            {/* VERIFIED FARMERS SECTION */}
            <section className="py-12 bg-gray-50 border-t border-gray-100">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">শতভাগ বিশ্বস্ত উৎপাদক</span>
                    <h2 className="text-lg sm:text-2xl font-black text-gray-800 font-sans mt-0.5">ভেরিফাইড কৃষক ও উদ্যোক্তা</h2>
                  </div>
                  <button onClick={() => setView('farmers')} className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1">
                    সব কৃষক দেখুন <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {farmers.filter(f => f.verified).slice(0, 4).map((farmer) => (
                    <div 
                      key={farmer.id}
                      onClick={() => {
                        setSelectedFarmerStoreId(farmer.id);
                        setView('farmer-store');
                      }}
                      className="group p-5 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all text-center cursor-pointer relative"
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 rounded-full overflow-hidden border-2 border-emerald-100">
                        <img 
                          src={farmer.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR} 
                          alt={farmer.name} 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 right-1 bg-emerald-600 text-white p-0.5 rounded-full scale-90 border border-white">✔</span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-black text-gray-800 group-hover:text-emerald-700 leading-tight">
                        {farmer.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-medium font-sans mt-0.5">
                        📍 {farmer.district} জেলা
                      </p>
                      
                      <div className="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-center gap-1 text-[11px] font-bold text-gray-650">
                        <span>সফল বিক্রি: <strong className="text-emerald-600">{farmer.salesCount || 0}টি</strong></span>
                      </div>
                    </div>
                  ))}
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
                  getFilteredProducts().map((p) => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onOpenQuickView={(prod) => {
                        setSelectedProductId(prod.id);
                        setView('product-details');
                      }} 
                      onEditProduct={setEditingProduct} 
                    />
                  ))
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
                  <h2 className="text-2xl sm:text-3.5xl font-black text-gray-900 mt-4 leading-tight block">কৃষক বাজারモデル</h2>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-700 mt-1 uppercase tracking-wide block">দালাল ছাড়া সরাসরি মাঠ থেকে সতেজ পণ্য</p>
                  <p className="text-xs text-gray-500 leading-relaxed mt-4 max-w-2xl mx-auto block">
                    আমরা প্রচলিত মধ্যস্বত্বভোগী, ফড়িয়া ও আড়তদারদের কমিশন কালচার ভেঙেছি। আমাদের প্লাটফর্মে কৃষক সরাসরি তার ফসলের মূল্য ঠিক করেন ও বিক্রি করেন। ক্রেতা সরাসরি মাঠের মূল্য দিয়ে সতেজ অর্গানিক খাবার পান।
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
          </div>
        )}
        </main>

      {/* FOOTER */}
      <footer className="bg-emerald-900 text-emerald-50 border-t border-emerald-950 py-12 text-xs select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Bottom Copyright and Navigation Bar */}
          <div className="sm:flex sm:items-center sm:justify-between text-emerald-100 font-medium">
            <div className="space-y-4 text-left">
              <p className="text-[11px] text-emerald-300 font-sans">© 2026 কৃষক বাজার (Krishok Bazar). সামাজিক এগ্রো-উদ্যোগ। যথাযথ কপিরাইট সংরক্ষিত।</p>
              {/* social media links as requested by user */}
              <div className="flex items-center gap-3">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-emerald-800/80 text-emerald-100 hover:bg-amber-500 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-xs" title="ফেসবুক">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13c-3 0-4 1.5-4 4v3z"/></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-emerald-800/80 text-emerald-100 hover:bg-amber-500 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-xs" title="ইউটিউব">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.5 6.4c-.3-1.2-1.3-2.1-2.5-2.4C18.8 3.5 12 3.5 12 3.5s-6.8 0-9 .5c-1.2.3-2.2 1.2-2.5 2.4C0 8.6 0 12 0 12s0 3.4.5 5.6c.3 1.2 1.3 2.1 2.5 2.4 2.2.5 9 .5 9 .5s6.8 0 9-.5c1.2-.3 2.2-1.2 2.5-2.4.5-2.2.5-5.6.5-5.6s0-3.4-.5-5.6zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-emerald-800/80 text-emerald-100 hover:bg-amber-500 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-xs" title="টুইটার / এক্স">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.2 2.4h3.3l-7.2 8.2 8.5 11h-6.6l-5.2-6.8-5.9 6.8H1.8l7.7-8.8L1.3 2.4h6.8l4.7 6.2 5.4-6.2zm-1.2 17.6h1.8L7.1 4.3H5.1l11.9 15.7z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-emerald-800/80 text-emerald-100 hover:bg-amber-500 hover:text-white hover:scale-110 active:scale-95 transition-all shadow-xs" title="ইনস্টাগ্রাম">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.1c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.5.6.2 1 .5 1.4 1s.7.8 1 1.4c.2.4.4 1 .5 2.2.1 1.3.1 1.6.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.5 2.2-.2.6-.5 1-1 1.4s-.8.7-1.4 1c-.4.2-1 .4-2.2.5-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.5-.6-.2-1-.5-1.4-1s-.7-.8-1-1.4c-.2-.4-.4-1-.5-2.2-.1-1.3-.1-1.6-.1-4.9s0-3.6.1-4.9c.1-1.2.3-1.8.5-2.2.2-.6.5-1 1-1.4s.8-.7 1.4-1c.4-.2 1-.4 2.2-.5 1.3-.1 1.6-.1 4.9-.1M12 0C8.7 0 8.3 0 7 .1 5.7.2 4.8.4 4 .7c-.8.3-1.5.7-2.1 1.4C1.2 2.7.8 3.4.5 4.2.2 5 .1 5.9.1 7.2 0 8.5 0 8.9 0 12.2s0 3.6.1 4.9c.1 1.3.3 2.1.6 2.9.3.8.7 1.5 1.4 2.1.7.7 1.4 1.1 2.1 1.4.8.3 1.6.4 2.9.5 1.3.1 1.7.1 4.9.1s3.6 0 4.9-.1c1.3-.1 2.1-.3 2.9-.6.8-.3 1.5-.7 2.1-1.4.7-.7 1.1-1.4 1.4-2.1.3-.8.4-1.6.5-2.9.1-1.3.1-1.7.1-4.9s0-3.6-.1-4.9c-.1-1.3-.3-2.1-.6-2.9-.3-.8-.7-1.5-1.4-2.1-.7-.7-1.4-1.1-2.1-1.4-.8-.3-1.6-.4-2.9-.5C15.6 0 15.2 0 12 0zm0 5.8c-3.4 0-6.1 2.7-6.1 6.1s2.7 6.1 6.1 6.1 6.1-2.7 6.1-6.1-2.7-6.1-6.1-6.1zm0 10.2c-2.3 0-4.1-1.8-4.1-4.1s1.8-4.1 4.1-4.1 4.1 1.8 4.1 4.1-1.8 4.1-4.1 4.1zm6.4-11.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5z"/></svg>
                </a>
              </div>
            </div>
            <div className="mt-6 sm:mt-0 flex flex-wrap items-center justify-center gap-5 text-[11px] font-black tracking-wide text-emerald-200">
              <button onClick={() => { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer select-none">হোম (Home)</button>
              <button onClick={() => { setView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer select-none">তাজা পণ্য (Fresh Products)</button>
              <button onClick={() => { setView('weekly-combos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer select-none">কম্বো বাজেট (Weekly Budget)</button>
              <button onClick={() => { setView('ready-to-cook'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer select-none">রেডি-টু-কুক (Ready to Cook)</button>
              <button onClick={() => { setView('our-story'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer select-none">আমাদের গল্প (Our Story)</button>
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
      </footer>

      {/* OVERLAY ELEMENTS */}
      <SubscriptionModal 
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        defaultRole={subscriptionDefaultRole}
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

      <ScrollingBanners onOpenSubscription={() => setIsSubscriptionOpen(true)} setView={setView} />
      <FloatingSocials />
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
      <AppContent />
    </AppProvider>
  );
}
