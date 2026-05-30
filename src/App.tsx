/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { CategoriesGrid } from './components/CategoriesGrid';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { EditProductModal } from './components/EditProductModal';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { FarmerStoreProfilePage } from './components/FarmerStoreProfilePage';
import { AdminCMSDashboard } from './components/AdminCMSDashboard';
import { RiktazAI } from './components/RiktazAI';
import { FloatingSocials } from './components/FloatingSocials';
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
  Instagram
} from 'lucide-react';
import { FEMALE_AVATAR, MALE_AVATAR } from './assets';

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
    getNidDetails
  } = useApp();

  // Route state
  const [currentView, setView] = useState<'home' | 'shop' | 'ready-to-cook' | 'farmers' | 'customer-dashboard' | 'farmer-dashboard' | 'admin' | 'product-details' | 'farmer-store'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedFarmerStoreId, setSelectedFarmerStoreId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeFarmerProfile, setActiveFarmerProfile] = useState<Farmer | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
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
      <main className="flex-1">

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
        
        {/* HOMEPAGE VIEW */}
        {currentView === 'home' && (
          <div className="space-y-0 text-gray-800">
            {/* Carousel */}
            <HeroCarousel 
              onShopNow={() => setView('shop')}
              onViewFarmers={() => setView('farmers')}
              onCallHelp={() => handleOpenAuthModal()}
            />

            {/* Featured category system */}
            <CategoriesGrid 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleSelectCategory} 
            />

            {/* Direct Trade Diagram Block */}
            <section className="py-12 bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center max-w-3xl mx-auto mb-10">
                  <span className="text-xs font-black text-emerald-600 tracking-wider uppercase">কৃষক বাজার মডেল</span>
                  <h2 className="text-2xl sm:text-3.5xl font-extrabold text-gray-800 tracking-tight font-sans mt-0.5">
                    দালাল ছাড়া সরাসরি মাঠ থেকে সতেজ পণ্য
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                    আমরা প্রচলিত মধ্যস্বত্বভোগী, ফড়িয়া ও আড়তদারদের কমিশন কালচার ভেঙেছি। আমাদের প্লাটফর্মে কৃষক সরাসরি তার ফসলের মূল্য ঠিক করেন ও বিক্রি করেন। ক্রেতা সরাসরি মাঠের মূল্য দিয়ে সতেজ অর্গানিক খাবার পান।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                  <div className="relative rounded-2xl bg-gray-50 p-6 border border-gray-100/80">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-700 font-black text-sm mb-4">🌱 01</div>
                    <h3 className="text-sm font-bold text-gray-800 mb-1.5">সরাসরি কৃষক সংগ্রহ</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">
                      অর্ডার করার সঙ্গে সঙ্গেই আমাদের তালিকাভুক্ত কৃষকরা সরাসরি তাদের খেত, বাগান বা দিঘি থেকে সতেজ ফল, শাকসবজি ও মাছ উত্তোলন করেন।
                    </p>
                  </div>
                  <div className="relative rounded-2xl bg-emerald-50 border border-emerald-100 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-black text-sm mb-4">✔ 02</div>
                    <h3 className="text-sm font-bold text-gray-800 mb-1.5">ভেরিফাইড ও কোয়ালিটি ল্যাব</h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-sans">
                      অংশীদার কৃষকরা প্রত্যেকেই ভেরিফাইড (Verified Farmer)। প্রতিটি আইটেমে কেমিক্যাল বা ক্ষতিকর ফরমালিন টেস্ট নিশ্চিত করার পর আমরা প্যাকেটজাত করি।
                    </p>
                  </div>
                  <div className="relative rounded-2xl bg-gray-50 p-6 border border-gray-100/80">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-black text-sm mb-4">⚡ 03</div>
                    <h3 className="text-sm font-bold text-gray-800 mb-1.5">দ্রুতগতিতে হোম ডেলিভারি</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">
                      কোনো হিমঘর বা স্টোরেজ কালচার নেই। সংগ্রহ করার কয়েক ঘণ্টার মধ্যেই আমাদের নিবেদিত দল সরাসরি ঢাকার আপনার ডোরস্টেপে ডেলিভারি দেয়।
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SPOTLIGHTS & DISCOUNT OFFERS CARDS */}
            <section className="py-12 bg-gray-50">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-xs font-bold text-blue-600 tracking-wider uppercase block">বিশেষ ছাড় ও সতেজ অফার</span>
                    <h2 className="text-lg sm:text-2xl font-black text-gray-800 font-sans mt-0.5">সেরা অফার ও তাজা ফসল</h2>
                  </div>
                  <button onClick={() => setView('shop')} className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1">
                    সব পণ্য দেখুন <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Grid limit of 8 products on home or curated featured items */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {(products.filter((p) => p.isFeatured).length > 0
                    ? products.filter((p) => p.isFeatured)
                    : products.slice(0, 8)
                  ).map((p) => (
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
                      <option value="organic">জৈব খাবার (Organic Products)</option>
                      <option value="ready-to-cook">রেডি-টু-কুক (Ready-to-Cook)</option>
                      <option value="dairy">দুগ্ধজাত (Dairy)</option>
                      <option value="grains">শস্য ও ডাল (Grains)</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Product Grid system */}
              {getFilteredProducts().length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 text-center shadow-sm">
                  <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4 animate-pulse">
                    <BadgeAlert className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-gray-700 font-sans">কোনো পণ্য খুঁজে পাওয়া যায়নি!</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm leading-relaxed">
                    অনুগ্রহ করে ক্যাটাগরি ও এরিয়া ফিল্টার পরিবর্তন করে বা সার্চ কিওয়ার্ড সঠিক করে আবার চেষ্টা করুন।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {getFilteredProducts().map((p) => (
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
              )}

            </div>
          </section>
        )}

        {/* FARMERS TAB - DIRECTORIES AND PROFILES */}
        {currentView === 'farmers' && (
          <section className="py-8 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              <div className="border-b border-gray-200 pb-5 mb-6">
                <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase block">আমাদের কৃষি অংশীদারগণ</span>
                <h1 className="text-2xl font-black text-gray-800 font-sans mt-0.5">তৃণমূলের সাহসী কৃষকের তালিকা</h1>
                <p className="text-xs text-gray-400 mt-1 font-medium select-none">
                  ৩০ জন তাজা পণ্য উৎপাদনকারীর সাথে সরাসরি যোগাযোগ করুন ও তাদের উৎপাদিত পণ্য কিনুন।
                </p>
              </div>

              {/* Farmers directory search & filter row */}
              <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="কৃষকের নাম লিখে খুঁজুন (যেমন: আব্দুর রহমান, আয়েশা বেগম)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-gray-200/80 bg-white py-2.5 pl-4 pr-10 text-xs outline-none focus:border-emerald-500 shadow-sm font-sans"
                  />
                </div>
                
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="rounded-xl border border-gray-200/80 bg-white py-2.5 px-3.5 text-xs font-bold text-gray-600 outline-none focus:border-emerald-500 shadow-sm"
                >
                  <option value="all">সব জেলা বা এলাকা (All Districts)</option>
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
              </div>

              {/* Farmer Profile Modal or Active detail section right below */}
              {activeFarmerProfile && (
                <div className="mb-8 rounded-3xl border border-emerald-100 bg-white p-6 sm:p-8 shadow-xl relative animate-in fade-in slide-in-from-top-4">
                  <button 
                    onClick={() => setActiveFarmerProfile(null)}
                    className="absolute top-4 right-4 rounded-full bg-gray-100 p-1.5 text-gray-500 hover:bg-gray-200 cursor-pointer"
                  >
                    Close Profile ✕
                  </button>

                  <div className="md:flex md:items-start md:gap-8 border-b border-gray-100 pb-6 mb-6">
                    {/* Farmer face photo */}
                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-emerald-50 overflow-hidden bg-gray-50 shrink-0 mx-auto md:mx-0 shadow">
                      <img 
                        src={activeFarmerProfile.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR} 
                        alt={activeFarmerProfile.name}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="text-center md:text-left flex-1 mt-4 md:mt-0">
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-gray-800 font-sans">{activeFarmerProfile.name}</h2>
                        
                        {/* ABSOLUTE VERIFIED FARMER BADGE ON PROFILE */}
                        {activeFarmerProfile.verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-black text-blue-700 shadow-sm">
                            <ShieldCheck className="h-4 w-4 fill-blue-600 text-white shrink-0" />
                            Verified Farmer (ভেরিফাইড কৃষক)
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-semibold text-gray-700">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                          {activeFarmerProfile.district}, বাংলাদেশ
                        </span>
                        <span>•</span>
                        <span className="font-bold text-amber-500 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg">★ {activeFarmerProfile.rating} রেটিং</span>
                        <span>•</span>
                        <span>{activeFarmerProfile.productCount}টি একক ফসল</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">{activeFarmerProfile.salesCount} সফল বিক্রয়</span>
                      </div>

                      <p className="mt-3 text-xs text-gray-600 leading-relaxed font-sans max-w-2xl">
                        {activeFarmerProfile.name} আমাদের বিশ্বস্ত জৈব ও রাসায়নিক মুক্ত চাষাবাদকারী অংশীদার। উনার উৎপাদিত ফসল শতভাগ নিখাদ ও তাজা। সরাসরি উনার খামার থেকে অর্ডারের উপর ভিত্তি করে ঢাকায় পণ্য নিয়ে আসা হবে।
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <a 
                          href={`tel:${activeFarmerProfile.phone}`}
                          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-2.5 text-xs font-bold text-white shadow hover:scale-102 active:scale-98 transition-all"
                        >
                          <Phone className="h-4 w-4" />
                          মোবাইল কল: {activeFarmerProfile.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Cultivated Crop List (Products by active farmer) */}
                  <div>
                    <h3 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-wider block">উনার উৎপাদিত ফসলের সম্ভার ({getProductsByFarmer(activeFarmerProfile.id).length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {getProductsByFarmer(activeFarmerProfile.id).map((p) => (
                        <ProductCard 
                          key={p.id} 
                          product={p} 
                          onOpenQuickView={setQuickViewProduct} 
                          onEditProduct={setEditingProduct}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of all farmers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {farmers
                  .filter((f) => 
                    (selectedDistrict === 'all' || f.district === selectedDistrict) &&
                    (!searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((farmer) => (
                    <div
                      key={farmer.id}
                      onClick={() => {
                        setSelectedFarmerStoreId(farmer.id);
                        setView('farmer-store');
                      }}
                      className={`rounded-2xl border p-5 bg-white shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between ${
                        selectedFarmerStoreId === farmer.id ? 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-lg' : 'border-gray-100 hover:border-emerald-200'
                      }`}
                    >
                      <div>
                        {/* Upper row: Avatar & badge */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="h-14 w-14 rounded-full bg-gray-50 border border-gray-150 overflow-hidden shrink-0">
                            <img 
                              src={farmer.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR} 
                              alt={farmer.name} 
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* ABSOLUTE VERIFIED FARMER BADGE ON LIST CARDS */}
                          {farmer.verified ? (
                            <span className="inline-flex items-center gap-0.5 rounded-lg bg-blue-50 border border-blue-200 px-2 py-0.5 text-[9px] font-black text-blue-700 tracking-wider">
                              <ShieldCheck className="h-3.5 w-3.5 fill-blue-600 text-white shrink-0" />
                              VERIFIED
                            </span>
                          ) : (
                            <span className="rounded bg-gray-50 px-2 py-0.5 text-[9px] font-bold text-gray-400 border border-gray-150">
                              PENDING
                            </span>
                          )}
                        </div>

                        {/* Middle row: Name & area */}
                        <h3 className="mt-4 font-bold text-gray-800 hover:text-emerald-700 transition-colors flex items-center gap-1 font-sans">
                          {farmer.name}
                        </h3>
                        
                        <span className="flex items-center gap-1 text-[11px] text-gray-400 font-bold mt-1 uppercase font-mono tracking-wider">
                          <MapPin className="h-3 w-3 text-emerald-500" />
                          {farmer.district}
                        </span>

                        {/* Brief stats bar */}
                        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-50 pt-3 text-[10px] text-gray-500 font-mono text-center">
                          <div>
                            <span className="block font-sans text-gray-400 leading-none">রেটিং</span>
                            <strong className="block text-amber-600 font-bold mt-1">★ {farmer.rating}</strong>
                          </div>
                          <div>
                            <span className="block font-sans text-gray-400 leading-none">ফসল</span>
                            <strong className="block text-gray-700 font-bold mt-1">{farmer.productCount}টি</strong>
                          </div>
                          <div>
                            <span className="block font-sans text-gray-400 leading-none">বিক্রয়</span>
                            <strong className="block text-emerald-600 font-bold mt-1">{farmer.salesCount}+</strong>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setSelectedFarmerStoreId(farmer.id);
                          setView('farmer-store');
                        }}
                        className="mt-4 w-full text-center rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 py-2.5 text-xs font-bold text-gray-600 transition-all border border-gray-100"
                      >
                        প্রোফাইল ও ফসল দেখুন
                      </button>
                    </div>
                  ))
                }
              </div>

            </div>
          </section>
        )}

        {/* CUSTOMER DASHBOARD - muiktabegum@gmail.com */}
        {currentView === 'customer-dashboard' && currentUser && (
          <section className="py-8 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gradient-to-tr from-emerald-600 to-green-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md uppercase tracking-wider font-mono">সম্মানিত ক্রেতা প্যানেল</span>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-800 leading-tight font-sans mt-1">{currentUser.name}</h1>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">নিবন্ধিত মোবাইল: {currentUser.phone}</p>
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 bg-gray-50 border border-gray-150 p-4 rounded-2xl max-w-md w-full relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-gray-700 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                      ডেলিভারি ঠিকানা ও গন্তব্য:
                    </span>
                    <button 
                      onClick={() => {
                        setIsEditingAddress(!isEditingAddress);
                        setTempAddress(currentUser.address || '');
                      }}
                      className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      {isEditingAddress ? 'বাতিল' : 'পরিবর্তন করুন'}
                    </button>
                  </div>

                  {isEditingAddress ? (
                    <div className="space-y-2 mt-2">
                      <input 
                        type="text" 
                        value={tempAddress}
                        onChange={(e) => setTempAddress(e.target.value)}
                        className="w-full text-xs p-2 border border-gray-200 rounded-xl outline-none"
                        placeholder="সম্পূর্ণ ডেলিভারি ঠিকানা দিন"
                      />
                      <button 
                        onClick={() => {
                          updateProfile(currentUser.name, currentUser.phone, tempAddress);
                          setIsEditingAddress(false);
                        }}
                        className="bg-emerald-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg hover:bg-emerald-700 cursor-pointer"
                      >
                        আপডেট করুন
                      </button>
                    </div>
                  ) : (
                    <span className="leading-relaxed block font-semibold text-gray-650">{currentUser.address || 'কোনো ঠিকানা দেওয়া নেই'}</span>
                  )}
                </div>
              </div>

              {/* Dynamic Customer Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                  <span className="text-[10px] uppercase font-black tracking-wider text-gray-400">মোট অর্ডার</span>
                  <strong className="block text-2xl font-black text-emerald-800 mt-1 font-mono">
                    {orders.filter(o => o.customerId === currentUser.id).length} বার
                  </strong>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                  <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 font-sans">সর্বমোট কেনাকাটা</span>
                  <strong className="block text-2xl font-black text-blue-700 mt-1 font-mono">
                    ৳{orders.filter(o => o.customerId === currentUser.id && (o.status === 'Delivered' || o.status === 'Shipped' || o.status === 'Processing' || o.status === 'Packed')).reduce((total, o) => total + o.totalPrice, 0)} BDT
                  </strong>
                </div>
                <div className="col-span-2 md:col-span-1 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                  <span className="text-[10px] uppercase font-black tracking-wider text-gray-400">ব্যবহৃত পেমেন্ট মেথড</span>
                  <strong className="block text-xs font-bold text-gray-700 mt-2 font-mono">
                    bKash / Nagad / COD
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Visual Tracker Stepper Container */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wider block mb-4 flex items-center justify-between">
                      <span>📦 আমার অনলাইন অর্ডারসমূহ ও লাইভ ট্র্যাকিং</span>
                      <span className="text-xs font-bold font-sans text-gray-400">অর্ডার সংখ্যা: {orders.filter(o => o.customerId === currentUser.id).length}টি</span>
                    </h2>
                    
                    {orders.filter(o => o.customerId === currentUser.id).length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-xs text-gray-400">আপনি এখনো কোনো পণ্য ক্রয় করেননি। শপ পেইজে যান!</p>
                        <button onClick={() => setView('shop')} className="mt-4 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl">সব পণ্য ব্রাউজ করুন</button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.filter(o => o.customerId === currentUser.id).map((order) => {
                          const steps = [
                            { label: 'Pending', name: 'পেন্ডিং ⏱' },
                            { label: 'Processing', name: 'প্রসেসিং 🌿' },
                            { label: 'Packed', name: 'প্যাকেট সম্পন্ন 📦' },
                            { label: 'Shipped', name: 'ডেলিভারিতে 🚴' },
                            { label: 'Delivered', name: 'সম্পন্ন ✔' }
                          ];

                          const stepIndices: Record<string, number> = { Pending: 0, Processing: 1, Packed: 2, Shipped: 3, Delivered: 4 };
                          const currentStepIndex = stepIndices[order.status] ?? 0;

                          return (
                            <div key={order.id} className="border border-gray-150 rounded-2xl p-5 bg-white space-y-4 shadow-xs">
                              
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">অর্ডার নং: {order.id}</span>
                                    <span className="text-[10px] bg-gray-100 text-gray-500 font-mono px-2 py-0.5 rounded-lg border border-gray-200">
                                      ট্র্যাকিং নং: {order.trackingNumber || 'TRK-GEN'}
                                    </span>
                                  </div>
                                  <span className="block text-[10px] text-gray-400 font-mono mt-1">তারিখ ও সময়: {new Date(order.createdAt).toLocaleString()}</span>
                                </div>
                                <span className="text-[11px] font-black text-white bg-emerald-600 px-3 py-1 rounded-xl shrink-0 self-start sm:self-center">
                                  ৳{order.totalPrice} ({order.paymentMethod === 'COD' ? 'ক্যাশ অন ডেলিভারি' : order.paymentMethod})
                                </span>
                              </div>

                              {/* VISUAL STEPPER TRACKING LINES */}
                              <div className="py-4">
                                <div className="relative">
                                  {/* Progress Line Bar Background */}
                                  <div className="absolute top-2.5 left-[10%] w-[80%] h-1 bg-gray-205 rounded-full z-0">
                                    <div 
                                      className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
                                      style={{ width: `${(currentStepIndex / 4) * 100}%` }}
                                    />
                                  </div>

                                  {/* Stepper Dots Row */}
                                  <div className="relative flex justify-between z-10 leading-none">
                                    {steps.map((st, sIdx) => {
                                      const isPassed = sIdx <= currentStepIndex;
                                      const isCurrent = sIdx === currentStepIndex;
                                      return (
                                        <div key={st.label} className="flex flex-col items-center w-[18%] text-center">
                                          <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${
                                            isPassed 
                                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
                                              : 'bg-gray-200 text-gray-400'
                                          }`}>
                                            {sIdx + 1}
                                          </div>
                                          <span className={`block text-[8px] sm:text-[9px] font-extrabold mt-2 ${
                                            isCurrent ? 'text-emerald-700 font-black' : isPassed ? 'text-gray-700' : 'text-gray-400'
                                          }`}>
                                            {st.name}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>

                                </div>
                              </div>

                              {/* Order specific products lists */}
                              <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1 text-gray-700 border border-gray-100">
                                {order.products.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center py-1">
                                    <span className="font-semibold text-gray-700 max-w-[250px] truncate">{item.title}</span>
                                    <span className="font-mono text-gray-400 shrink-0">৳{item.price} x {item.quantity}</span>
                                  </div>
                                ))}
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Helpdesk support & info sidebar block */}
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wider block mb-3 font-sans">
                      📢 কাস্টমার কেয়ার ও চাষী সাপোর্ট বাতায়ন
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      কৃষক বাজার প্ল্যাটফর্ম কোনো মধ্যস্বত্বভোগী ছাড়াই সরাসরি রাজশাহী ও যশোর অঞ্চলের প্রান্তিক চাষী থেকে ফসল আপনার দোরগোড়ায় পৌঁছে দেয়। যেকোনো কাস্টমার সাপোর্ট বা ডেলিভারির সুনির্দিষ্ট তথ্যের প্রয়োজনে আমাদের অফিশিয়াল কল সেন্টারে যোগাযোগ করুন।
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-105 text-[11px] text-gray-650 space-y-2">
                      <span className="block text-emerald-700 font-bold">📞 কাস্টমার কেয়ার: ০১৯৩৯-০৫২২৫৭</span>
                      <span className="block text-indigo-700 font-bold">✉ সাপোর্ট মেইল: contact@krishokbazar.com.bd</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* FARMER STOREFRONT DASHBOARD - mizan@farmer.com */}
        {currentView === 'farmer-dashboard' && currentUser && (
          <section className="py-8 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gradient-to-tr from-emerald-600 to-green-500 text-white rounded-2xl flex items-center justify-center">
                    <Store className="h-8 w-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-mono bg-emerald-50 px-2 py-0.5 rounded">প্যানেল: অংশীদার কৃষক ড্যাশবোর্ড</span>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <h1 className="text-xl sm:text-2xl font-black text-gray-800 leading-tight font-sans mt-0.5">{currentUser.name}</h1>
                      
                      {/* VERIFIED FARMER BADGE ON ACTIVE OWNER DASHBOARD */}
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[9px] font-bold text-blue-700">
                        <ShieldCheck className="h-3.5 w-3.5 fill-blue-600 text-white shrink-0" />
                        Verified Partner
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 font-medium mt-1">নিবন্ধিত মোবাইল: {currentUser.phone} • উৎপাদক এলাকা: {farmers.find(f => f.id === currentUser.farmerId)?.district || 'যশোর Sadar'}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setIsAddingProduct(!isAddingProduct);
                      setEditingProdId(null);
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 px-5 py-3 text-xs font-bold text-white shadow-md cursor-pointer duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    নতুন ফসল / রেডি প্যাক যোগ করুন
                  </button>
                </div>
              </div>

              {/* Farmer dynamic stats calculations */}
              {(() => {
                const farmerId = currentUser.farmerId || 'f6';
                const myCrops = products.filter(p => p.farmerId === farmerId);
                const salesSum = myCrops.reduce((sum, p) => sum + (p.salesCount || 10), 0);
                
                const myOrders = orders.filter(o => o.products.some(p => p.farmerId === farmerId));
                const uniqueClientsCount = Array.from(new Set(myOrders.map(o => o.customerId))).length;
                
                const balanceLedger = farmers.find(f => f.id === farmerId)?.balance || 0;
                const totalIncomeMonthly = myOrders.filter(o => o.status !== 'Pending').reduce((sum, o) => {
                  const share = o.products.filter(p => p.farmerId === farmerId).reduce((ps, item) => ps + (item.price * item.quantity), 0);
                  return sum + share;
                }, 0);

                return (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs text-center">
                      <span className="text-[10px] uppercase font-black text-gray-400">মোট বিক্রয় (পরিমাণ)</span>
                      <strong className="block text-xl font-mono text-emerald-800 font-black mt-1">{salesSum} কেজি/পিস</strong>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs text-center">
                      <span className="text-[10px] uppercase font-black text-gray-400">মোট ক্রেতা সংখা</span>
                      <strong className="block text-xl font-mono text-indigo-700 font-black mt-1">{uniqueClientsCount} জন</strong>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs text-center">
                      <span className="text-[10px] uppercase font-black text-gray-400">চলতি মাসের বেচাকেনা</span>
                      <strong className="block text-xl font-mono text-blue-700 font-black mt-1">৳{totalIncomeMonthly} BDT</strong>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-150 p-4 bg-emerald-50/50 shadow-xs text-center border-dashed">
                      <span className="text-[10px] uppercase font-black text-emerald-850">আমার ওয়ালেট ব্যালেন্স</span>
                      <strong className="block text-xl font-mono text-emerald-700 font-black mt-1">৳{balanceLedger} BDT</strong>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                
                {/* Balance Withdrawal Tool Panel */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wider block mb-2 flex items-center gap-1">
                      <Coins className="h-4 w-4 text-emerald-600" />
                      টাকা উত্তোলন করুন (Wallet Ledger)
                    </h3>
                    <p className="text-[10px] text-gray-400 mb-4 leading-relaxed">
                      কৃষক বাজার সরাসরি পেমেন্ট লিংকের মাধ্যমে আপনার অর্জিত অর্থ ব্যাংক, বিকাশ অথবা রকেটে ৫00 টাকার বেশি হলে ক্যাশ-আউট করুন।
                    </p>

                    {withdrawMsg && (
                      <div className={`p-3 rounded-xl mb-4 text-xs font-semibold ${
                        withdrawMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' : 'bg-red-50 text-red-650 border border-red-200'
                      }`}>
                        {withdrawMsg.text}
                      </div>
                    )}

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const farmerId = currentUser.farmerId || 'f6';
                        const res = requestWithdrawal(farmerId, withdrawAmount, withdrawMethod, withdrawDetails);
                        if (res.success) {
                          setWithdrawMsg({ type: 'success', text: res.message });
                          setWithdrawDetails('');
                        } else {
                          setWithdrawMsg({ type: 'error', text: res.message });
                        }
                        setTimeout(() => setWithdrawMsg(null), 5000);
                      }}
                      className="space-y-3.5 text-xs text-gray-700 select-none"
                    >
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">টাকার পরিমাণ (সর্বনিম্ন ৳৫00):</label>
                        <input 
                          type="number" 
                          required
                          min={500}
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(Math.max(0, Number(e.target.value)))}
                          className="w-full rounded-xl border border-gray-150 p-2.5 outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-1">উত্তোলন করার মাধ্যম:</label>
                        <select 
                          value={withdrawMethod}
                          onChange={(e) => setWithdrawMethod(e.target.value as any)}
                          className="w-full rounded-xl border border-gray-155 p-2.5 outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white font-sans text-gray-700 font-bold"
                        >
                          <option value="bKash">বিকাশ (bKash Wallet)</option>
                          <option value="Nagad">নগদ (Nagad Wallet)</option>
                          <option value="Bank Transfer">সরাসরি ব্যাংক অ্যাকাউন্ট (Bank)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-1">মেথড বিবরণ (যেমন: বিকাশ নাম্বার বা ব্যাংক তথ্য):</label>
                        <textarea 
                          required
                          rows={2}
                          value={withdrawDetails}
                          onChange={(e) => setWithdrawDetails(e.target.value)}
                          placeholder="বিকাশ পার্সোনাল নম্বর: ০১৭xxxxxxxx অথবা ডাচ বাংলা ব্যাক তথ্য"
                          className="w-full rounded-xl border border-gray-150 p-2.5 outline-none focus:border-emerald-500 bg-gray-50 focus:bg-white leading-relaxed"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full text-center rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-3 font-bold text-white shadow hover:shadow-md cursor-pointer duration-200 text-xs"
                      >
                        নতুন উত্তোলন আবেদন পাঠান
                      </button>
                    </form>
                  </div>
                </div>

                {/* Left table showing farmer withdrawal history and requests status */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wider block mb-4">
                      পেমেন্ট ও উত্তোলন ইতিহাস
                    </h3>

                    {withdrawalRequests.filter(w => w.farmerId === (currentUser.farmerId || 'f6')).length === 0 ? (
                      <p className="text-xs text-gray-400 py-8 text-center bg-gray-50 rounded-2xl">আপনার এখনো কোনো টাকা উত্তোলন বা প্রসেসিং ইতিহাস নেই।</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px] font-bold">
                              <th className="pb-3 font-bold">আবেদন আইডি</th>
                              <th className="pb-3 font-bold">টাকার পরিমাণ</th>
                              <th className="pb-3 font-bold">মাধ্যম</th>
                              <th className="pb-3 font-bold">তারিখ</th>
                              <th className="pb-3 font-bold text-right">ডেলিভারি স্থিতি</th>
                            </tr>
                          </thead>
                          <tbody>
                            {withdrawalRequests
                              .filter(w => w.farmerId === (currentUser.farmerId || 'f6'))
                              .map((req) => (
                                <tr key={req.id} className="border-b border-gray-50">
                                  <td className="py-3 font-mono font-bold text-gray-800">{req.id}</td>
                                  <td className="py-3 font-mono text-emerald-800 font-bold">৳{req.amount} BDT</td>
                                  <td className="py-3 font-sans font-semibold text-gray-600">{req.method}</td>
                                  <td className="py-3 font-mono text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</td>
                                  <td className="py-3 text-right">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                                      req.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                      req.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' :
                                      req.status === 'Approved' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-750 border-red-200'
                                    }`}>
                                      {req.status === 'Paid' ? 'পরিশোধিত' : req.status === 'Pending' ? 'রিভিউধীন' : req.status === 'Approved' ? 'অনুমোদিত' : 'বাতিলকৃত'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Add/edit crop overlay form */}
              {isAddingProduct && (
                <div className="mb-8 rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xl animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-5">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider block">{editingProdId ? 'ফসল বিবরণ সংস্কার করুন' : 'নতুন জৈব ফসলের তালিকা যোগ করুন'}</h3>
                    <button 
                      onClick={() => setIsAddingProduct(false)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      বাতিল করুন ✕
                    </button>
                  </div>

                  <form onSubmit={handleProductSubmit} className="space-y-4 text-xs select-none">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">ফসলের নাম (বাংলায় লিখুন):</label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: যশোরের সতেজ কচি টমেটো (তাজা)"
                          value={newProdTitle}
                          onChange={(e) => setNewProdTitle(e.target.value)}
                          className="w-full rounded-xl border border-gray-150 py-2.5 px-3 bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-1">উৎপাদন মূল্য (৳ কেজি/পিস):</label>
                        <input
                          type="number"
                          required
                          value={newProdPrice || ''}
                          onChange={(e) => setNewProdPrice(Number(e.target.value))}
                          className="w-full rounded-xl border border-gray-155 py-2.5 px-3 bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-1">ছাড় মূল্য (ঐচ্ছিক):</label>
                        <input
                          type="number"
                          value={newProdDiscountPrice}
                          onChange={(e) => setNewProdDiscountPrice(e.target.value)}
                          className="w-full rounded-xl border border-gray-155 py-2.5 px-3 bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">ক্যাটাগরি বা শ্রেণীবিভাগ:</label>
                        <select
                          value={newProdCategory}
                          onChange={(e) => setNewProdCategory(e.target.value)}
                          className="w-full rounded-xl border border-gray-155 py-2.5 px-3 bg-gray-50 text-gray-650"
                        >
                          <option value="fruits">ফলমূল (Fruits)</option>
                          <option value="vegetables">শাকসবজি (Vegetables)</option>
                          <option value="fish">মাছ (Fish)</option>
                          <option value="meat">মাংস (Meat)</option>
                          <option value="honey">খাঁটি মধু (Honey)</option>
                          <option value="spices">মসলাপাতি (Spices)</option>
                          <option value="organic">জৈব খাবার (Organic Products)</option>
                          <option value="ready-to-cook">রেডি-টু-কুক (Ready-to-Cook)</option>
                          <option value="dairy">দুগ্ধজাত (Dairy)</option>
                          <option value="grains">শস্য ও ডাল (Grains)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-bold mb-1">স্টক পরিমাণ (কেজি/পিস):</label>
                        <input
                          type="number"
                          required
                          value={newProdStock}
                          onChange={(e) => setNewProdStock(Number(e.target.value))}
                          className="w-full rounded-xl border border-gray-155 py-2.5 px-3 bg-gray-50"
                        />
                      </div>

                      <div className="flex items-center h-full pt-5">
                        <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newProdReadyToCook}
                            onChange={(e) => setNewProdReadyToCook(e.target.checked)}
                            className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                          />
                          এটি কি রেডি-টু-কুক (কাটা, ধোয়া সবজি)?
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">ফসলের বিস্তারিত বর্ণনা ও গুণগত মান:</label>
                      <textarea
                        required
                        rows={2}
                        placeholder="বাগান থেকে সংগৃহীত, কোনো ফরমালিন ব্যবহার করা হয়নি..."
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        className="w-full rounded-xl border border-gray-155 p-3 bg-gray-50 leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 px-6 text-xs font-bold text-white shadow"
                    >
                      {editingProdId ? 'সংশোধন সংরক্ষণ করুন' : ' ফসল বাজারজাত করুন'}
                    </button>
                  </form>
                </div>
              )}

              {/* My Crops list */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm mb-8">
                <h3 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wider block mb-4">আমার চাষকৃত ফসলাদি ({products.filter(p => p.farmerId === (currentUser.farmerId || 'f6')).length})</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {products
                    .filter(p => p.farmerId === (currentUser.farmerId || 'f6'))
                    .map(p => (
                      <div key={p.id} className="relative rounded-2xl border border-gray-150 overflow-hidden bg-white p-3 flex flex-col justify-between">
                        <div>
                          <img src={p.images[0]} className="h-28 w-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                          <h4 className="mt-2 text-xs font-bold text-gray-800 line-clamp-1">{p.title}</h4>
                          <span className="text-[11px] font-bold text-emerald-700 block mt-0.5">৳{p.discountPrice || p.price} /কেজি</span>
                          <span className="block text-[10px] text-gray-400 font-mono mt-0.5">স্টক পরিমাণ: {p.stock} কেজি</span>
                        </div>
                        
                        <div className="mt-3 pt-2.5 border-t border-gray-50 flex items-center justify-between gap-1">
                          <button
                            onClick={() => startEditProduct(p)}
                            className="p-1 px-2 hover:bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold flex items-center gap-0.5"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            সম্পাদনা
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1 px-2 hover:bg-red-50 text-red-500 rounded-lg text-[10px] font-bold flex items-center gap-0.5"
                          >
                            <Trash className="h-3.5 w-3.5" />
                            মুছুন
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Incoming Customer Orders specifically containing crops from THIS Farmer */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wider block mb-4">
                  🛒 ক্রেতা অর্ডার ও বিপণন মনিটর (Incoming Invoices)
                </h3>
                
                {orders.filter(o => o.products.some(p => p.farmerId === (currentUser.farmerId || 'f6'))).length === 0 ? (
                  <p className="text-xs text-gray-400 py-8 text-center bg-gray-50 rounded-2xl">আপনার উৎপাদিত ফসলের জন্য এখনো কোনো ক্রেতা অর্ডার আসেনি।</p>
                ) : (
                  <div className="space-y-4">
                    {orders
                      .filter(o => o.products.some(p => p.farmerId === (currentUser.farmerId || 'f6')))
                      .map((order) => {
                        const myItems = order.products.filter(p => p.farmerId === (currentUser.farmerId || 'f6'));
                        const myIncomeFromOrder = myItems.reduce((acc, current) => acc + (current.price * current.quantity), 0);

                        return (
                          <div key={order.id} className="border border-gray-150 rounded-2xl p-4.5 bg-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-emerald-800 uppercase font-sans tracking-wide">অর্ডার: {order.id}</span>
                                <span className={`px-2 py-0.5 text-[9px] rounded-full font-bold border ${
                                  order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <span className="block font-semibold text-gray-700 mt-1">ক্রেতা: {order.customerName} ({order.customerPhone})</span>
                              <span className="block text-gray-400 leading-tight">ডেলিভারি গন্তব্য: {order.customerAddress}</span>
                              <span className="block text-[10px] text-gray-400 font-mono">অর্ডারের সময়: {new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>

                            <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-5 shrink-0 text-xs text-right flex flex-col items-end">
                              <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">আপনার কৃষিপণ্য</span>
                              <div className="text-gray-700 font-bold mt-1 text-left">
                                {myItems.map((val, key) => (
                                  <div key={key} className="text-[11px] text-gray-600">
                                    • {val.title} (৳{val.price} x {val.quantity})
                                  </div>
                                ))}
                              </div>
                              <span className="text-sm font-black text-emerald-700 mt-2 block">
                                আপনার আয়: ৳{myIncomeFromOrder}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

            </div>
          </section>
        )}

        {/* CHIEF ADMIN DASHBOARD - ajzakir2020@gmail.com */}
        {currentView === 'admin' && currentUser && currentUser.role === 'Admin' && (
          <AdminCMSDashboard />
        )}
        {false && currentView === 'admin' && currentUser && (
          <section className="py-8 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gradient-to-tr from-gray-905 to-emerald-750 text-white rounded-2xl flex items-center justify-center font-black">
                    ADM
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">প্রধান এডমিন হাব (Central Authority)</span>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-800 leading-tight font-sans mt-0.5">{currentUser.name}</h1>
                    <p className="text-xs text-gray-500 font-medium">নিবন্ধিত ওলান: {currentUser.email} • কন্ট্রোল স্টেশন: রাজভাট, রাজশাহী</p>
                  </div>
                </div>

                {/* Dashboard Metrics cards */}
                <div className="flex gap-4">
                  <div className="bg-gray-50 border border-gray-100 p-3 px-5 rounded-2xl text-center shadow-inner">
                    <span className="text-[10px] uppercase text-gray-400 font-bold block leading-none">মোট কৃষক</span>
                    <strong className="text-xl font-bold text-emerald-700 block mt-1">{farmers.length} জন</strong>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 p-3 px-5 rounded-2xl text-center shadow-inner">
                    <span className="text-[10px] uppercase text-gray-400 font-bold block leading-none font-sans">মোট অর্ডার</span>
                    <strong className="text-xl font-bold text-blue-600 block mt-1">{orders.length}টি</strong>
                  </div>
                </div>
              </div>

              {/* Central Administration block split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Farmer management column left side */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* PENDING FARMER REGISTRATION REVIEWS */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xs sm:text-sm font-black text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        নিবন্ধনের জন্য অপেক্ষমাণ কৃষক আবেদনসমূহ ({farmers.filter(f => f.status === 'Pending').length})
                      </h2>
                    </div>

                    {farmers.filter(f => f.status === 'Pending').length === 0 ? (
                      <p className="text-xs text-gray-400 py-6 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">নিবন্ধনের জন্য নতুন কোনো পেন্ডিং আবেদন নেই।</p>
                    ) : (
                      <div className="space-y-4">
                        {farmers.filter(f => f.status === 'Pending').map((f) => (
                          <div key={f.id} className="border border-amber-100 rounded-2xl p-4.5 bg-amber-50/20 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full overflow-hidden bg-white shrink-0 border border-gray-150">
                                  <img 
                                    src={f.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR} 
                                    className="h-full w-full object-cover" 
                                    referrerPolicy="no-referrer" 
                                  />
                                </div>
                                <div>
                                  <span className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                                    {f.name} 
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">আবেদন পেন্ডিং</span>
                                  </span>
                                  <span className="block text-[10px] text-gray-500 font-mono mt-0.5">মোবাইল: {f.phone} • জেলা: {f.district}</span>
                                </div>
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold bg-white px-2 py-1 rounded border border-gray-100 uppercase tracking-widest font-mono">ID: {f.id}</span>
                            </div>

                            <div className="bg-white rounded-xl p-3 text-[11px] text-gray-600 border border-gray-100 space-y-1">
                              <p className="font-sans text-gray-650"><strong>ঠিকানা:</strong> {f.address}</p>
                              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-2.5 mt-1">
                                <p className="font-mono text-gray-500">
                                  <strong>জাতীয় পরিচয়পত্র (NID):</strong> <span className="text-gray-800 font-extrabold bg-gray-50 border border-gray-200 px-2 py-0.5 rounded font-mono select-all ml-1">{getNidDetails(f.id).nid}</span>
                                </p>
                                
                                {/* VISUAL VERIFICATION STATUS BADGE */}
                                <div className="flex items-center gap-1">
                                  {getNidDetails(f.id).status === 'Verified' && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-250 px-2.5 py-0.5 text-[9px] font-black text-emerald-700 animate-pulse">
                                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                      ✔ EC ভেরিফাইড (Authentic)
                                    </span>
                                  )}
                                  {getNidDetails(f.id).status === 'Suspected' && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-250 px-2.5 py-0.5 text-[9px] font-black text-red-600 animate-pulse">
                                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                      ⚠️ সন্দেহভাজন / কৃত্রিম NID
                                    </span>
                                  )}
                                  {getNidDetails(f.id).status === 'System Error' && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-250 px-2.5 py-0.5 text-[9px] font-black text-amber-700">
                                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                      ❌ EC ডাটাবেজ অফলাইন
                                    </span>
                                  )}
                                  {getNidDetails(f.id).status === 'Unverified' && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-55 border border-gray-200 px-2.5 py-0.5 text-[9px] font-black text-gray-600">
                                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                      🔎 অপরীক্ষিত NID বিবরণ
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* EXTRA META DATA DETECTED FROM BACKEND REGISTER CHECK */}
                              {getNidDetails(f.id).exists && (
                                <div className="mt-2.5 bg-gray-50/70 rounded-xl p-3 text-[10px] space-y-1.5 border border-gray-150-soft font-sans">
                                  <div className="flex justify-between">
                                    <span className="text-gray-450 font-bold">ইসি ডাটাবেজ তথ্য রেফারেন্স:</span>
                                    <span className="text-gray-700 font-mono font-black select-all">{getNidDetails(f.id).ecReference}</span>
                                  </div>
                                  <div className="flex justify-between items-center bg-transparent">
                                    <span className="text-gray-455 font-bold">এনআইডি নাম ও আঙ্গুলের ছাপ মিলের হার:</span>
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden inline-block align-middle">
                                        <div 
                                          className={`h-full rounded-full ${
                                            getNidDetails(f.id).status === 'Verified' ? 'bg-emerald-500' :
                                            getNidDetails(f.id).status === 'Suspected' ? 'bg-red-500' : 'bg-amber-450'
                                          }`}
                                          style={{ width: `${getNidDetails(f.id).percentMatchCount}%` }}
                                        />
                                      </div>
                                      <span className="font-mono font-black text-gray-700">{getNidDetails(f.id).percentMatchCount}%</span>
                                    </div>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-455 font-bold">অটোমেটিক চেক করার সময়:</span>
                                    <span className="text-gray-650 font-mono font-bold">{getNidDetails(f.id).verifiedAt}</span>
                                  </div>
                                </div>
                              )}
                              {f.nidImage && (
                                <div className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded inline-flex items-center gap-1">
                                  ✔ জাতীয় পরিচয়পত্র কপি আপলোড করা হয়েছে
                                </div>
                              )}
                            </div>

                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => deleteFarmer(f.id)}
                                className="px-3.5 py-1.5 text-[10px] font-bold text-red-650 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 cursor-pointer"
                              >
                                আবেদন নাকচ করুন
                              </button>
                              <button
                                onClick={() => approveFarmerRegistration(f.id)}
                                className="px-4 py-1.5 text-[10px] font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 cursor-pointer shadow-sm"
                              >
                                অনুমোদন ও ভেরিফাই করুন ✔
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ACTIVE PARTNER FARMERS REGISTRY CONTROL */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h2 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wider block mb-4">আমাদের অংশীদার কৃষক নিয়ন্ত্রণ ({farmers.filter(f => f.status !== 'Pending').length})</h2>
                    
                    <div className="space-y-4">
                      {farmers.filter(f => f.status !== 'Pending').map((f) => (
                        <div key={f.id} className="border border-gray-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 bg-white hover:bg-gray-50/50 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-full overflow-hidden bg-gray-50 shrink-0 border border-gray-150">
                              <img src={f.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-gray-800">{f.name}</span>
                                
                                {/* BADGE DIRECTLY AT ADMIN USER LIST CARD */}
                                {f.verified && (
                                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[8px] font-black text-emerald-600 border border-emerald-105">
                                    ✔ NID ভেরিফাইড
                                  </span>
                                )}
                              </div>
                              <span className="block text-[10px] text-gray-400 font-semibold">
                                {f.district} • {f.phone} • NID: <span className="font-mono text-gray-500 font-bold">{getNidDetails(f.id).nid}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-amber-500 font-bold font-mono">★ {f.rating}</span>
                            
                            {/* Toggle verify direct */}
                            <button
                              onClick={() => toggleVerifyFarmer(f.id)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                f.verified 
                                  ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' 
                                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              {f.verified ? 'উইথড্র ভেরিফাই' : 'ভেরিফাই করুন'}
                            </button>

                            {/* Block unblock accounts */}
                            <button
                              onClick={() => toggleBlockFarmer(f.id)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                f.status === 'Blocked' 
                                  ? 'bg-red-50 text-red-650 border-red-200' 
                                  : 'text-gray-400 border-gray-150 hover:bg-red-50 hover:text-red-500 hover:border-red-100'
                              }`}
                              title={f.status === 'Blocked' ? 'আনব্লক করুন' : 'কৃষক ব্লক করু�      </main>

      {/* KRISHOK BAZAR MODEL */}
      <section id="krishok-bazar-model" className="bg-white py-16 border-t border-gray-100 select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-[10px] bg-emerald-600/10 text-emerald-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-600/20">
              🌱 আমাদের কাজের ধারা
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-sans mt-3 tracking-tight">
              কৃষক বাজার মডেল: দালাল ছাড়া সরাসরি মাঠ থেকে সতেজ পণ্য
            </h2>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed font-normal">
              আমরা প্রচলিত মধ্যস্বত্বভোগী, ফড়িয়া ও আড়তদারদের কমিশন কালচার ভেঙেছি। আমাদের প্ল্যাটফর্মে কৃষক সরাসরি তার ফসলের মূল্য ঠিক করেন ও বিক্রি করেন। ক্রেতা সরাসরি মাঠের মূল্য দিয়ে সতেজ অর্গানিক খাবার পান।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            {/* Step 1 */}
            <div className="bg-emerald-50/40 p-8 rounded-3xl border border-emerald-100/50 hover:border-emerald-200 transition-all shadow-xs group">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🌱</span>
                <span className="text-sm font-mono font-black text-emerald-600">01</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4 font-sans group-hover:text-emerald-700 transition-colors">
                সরাসরি কৃষক সংগ্রহ
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                অর্ডার করার সঙ্গে সঙ্গেই আমাদের তালিকাভুক্ত কৃষকরা সরাসরি তাদের খেত, বাগান বা দিঘি থেকে সতেজ ফল, শাকসবজি ও মাছ উত্তোলন করেন।
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-emerald-50/40 p-8 rounded-3xl border border-emerald-100/50 hover:border-emerald-200 transition-all shadow-xs group">
              <div className="flex items-center justify-between">
                <span className="text-3xl">✔</span>
                <span className="text-sm font-mono font-black text-emerald-600">02</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4 font-sans group-hover:text-emerald-700 transition-colors">
                ভেরিফাইড ও কোয়ালিটি ল্যাব
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                অংশীদার কৃষকরা প্রত্যেকেই ভেরিফাইড (Verified Farmer)। প্রতিটি আইটেমে কেমিক্যাল বা ক্ষতিকর ফরমালিন টেস্ট নিশ্চিত করার পর আমরা প্যাকেটজাত করি।
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-emerald-50/40 p-8 rounded-3xl border border-emerald-100/50 hover:border-emerald-200 transition-all shadow-xs group">
              <div className="flex items-center justify-between">
                <span className="text-3xl">⚡</span>
                <span className="text-sm font-mono font-black text-emerald-600">03</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4 font-sans group-hover:text-emerald-700 transition-colors">
                দ্রুতগতিতে হোম ডেলিভারি
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                কোনো হিমঘর বা স্টোরেজ কালচার নেই। সংগ্রহ করার কয়েক ঘণ্টার মধ্যেই আমাদের নিবেদিত দল সরাসরি ঢাকার আপনার ডোরস্টেপে ডেলিভারি দেয়।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-emerald-50 text-emerald-950 border-t border-emerald-200/60 py-16 text-xs select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* OUR STORY: EMOTIONAL STARTUP STORY SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-b border-emerald-200 pb-12">
            
            {/* Mission Statement Hook */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] bg-emerald-600/10 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-600/20">Our Story • আমাদের পথচলা</span>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-900 font-sans tracking-tight leading-snug">
                দালাল মুক্ত ও রাসায়নিক মুক্ত সুখী বাংলার স্বপ্নযাত্রায় <span className="text-emerald-800 bg-emerald-100 px-2 rounded-lg">কৃষক বাজার</span>
              </h3>
              <p className="text-xs text-emerald-800/90 leading-relaxed font-normal">
                আমরা বিশ্বাস করি, আমাদের মাটির উর্বরতা ও কৃষকদের অক্লান্ত পরিশ্রম এদেশের সবচেয়ে বড় সম্পদ। অথচ বাজার ব্যবস্থার অসঙ্গতি ও দالاলের কারসাজিতে কৃষক ও সাধারণ ক্রেতা দুপক্ষই শোষিত হচ্ছেন প্রতিদিন। কৃষক বাজার এই বৈষম্যের অবসান ঘটাতে সরাসরি চাষীর ওয়ালেট ক্ষমতায়ন ও সতেজ খাবারের একটি সামাজিক বিপ্লব।
              </p>
            </div>

            {/* Core Story Pillars Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              
              {/* Pillar 1: Bangladesh agriculture */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 font-extrabold text-xs">🌾</span>
                  <h4 className="font-bold text-sm text-emerald-900 font-sans">সোনার বাংলা ও উর্বর মৃত্তিকা</h4>
                </div>
                <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                  বাংলাদেশ সুজলা-সুফলা উর্বর পলল মাটির দেশ। আমাদের চাষীরা রোদে পুড়ে বৃষ্টিতে ভিজে পবিত্র ঘামের বিনিময়ে আমাদের জন্য মৌসুমী তাজা রসালো ফসল ফলান।
                </p>
              </div>

              {/* Pillar 2: Middlemen problem */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 font-extrabold text-xs">⚠️</span>
                  <h4 className="font-bold text-sm text-emerald-900 font-sans">দালাল ও মধ্যস্বত্ব ভোগী ব্যবস্থা</h4>
                </div>
                <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                  মাঠের উৎপাদক ফসল ৮ টাকায় বিক্রি করলেও আড়তদার ও ঘাটে ঘাটে মধ্যস্বত্বভোগীদের কৃত্রিম সংকটে ঢাকায় সাধারণ কাস্টমার তা ৮০ টাকায় ক্ষতিকর কেমিক্যালসহ কিনতে বাধ্য হন।
                </p>
              </div>

              {/* Pillar 3: Safe food mission */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700 font-extrabold text-xs">🛡️</span>
                  <h4 className="font-bold text-sm text-emerald-900 font-sans">রাসায়নিক মুক্ত শতভাগ বিশুদ্ধতা</h4>
                </div>
                <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                  ক্ষতিকর কার্বাইড, ফরমালিন বা নোংরা আর্জেস্টমেন্ট বর্জন করে সরাসরি মাঠ থেকে তাজা ও নির্ভেজাল পুষ্টিকর খাবার আপনার পরিবারের কাছে দ্রুততম সময়ে ডেলিভারি করাই আমাদের লক্ষ্য।
                </p>
              </div>

              {/* Pillar 4: Farmer empowerment */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-900">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 font-extrabold text-xs">🤝</span>
                  <h4 className="font-bold text-sm text-emerald-900 font-sans">স্বাধীন ও ক্ষমতাবান আধুনিক চাষী</h4>
                </div>
                <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                  কোনো ফড়িয়া ছাড়াই সম্পূর্ণ লভ্যাংশ সরাসরি নিজস্ব ডিজিটাল ওয়ালেটে চাষীদের কাছে পৌঁছে দিয়ে তাদের মুখে অনাবিল হাসি ফোটানোর স্বপ্ন দেখছি ও বাস্তবায়ন করছি।
                </p>
              </div>

            </div>

          </div>

          {/* Bottom Copyright, Social Media, and Navigation Bar */}
          <div className="sm:flex sm:items-center sm:justify-between text-emerald-800/80 font-medium">
            <div className="space-y-4">
              <p className="text-[11px]">© {new Date().getFullYear()} কৃষক বাজার (Krishok Bazar). সামাজিক এগ্রো-উদ্যোগ উদ্যোগ। যথাযথ কপিরাইট সংরক্ষিত।</p>
              {/* social media links */}
              <div className="flex items-center gap-3">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 hover:scale-110 active:scale-95 transition-all shadow-xs" title="ফেসবুক">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 hover:scale-110 active:scale-95 transition-all shadow-xs" title="ইউটিউব">
                  <Youtube className="h-4 w-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 hover:scale-110 active:scale-95 transition-all shadow-xs" title="টুইটার / এক্স">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-900 hover:scale-110 active:scale-95 transition-all shadow-xs" title="ইনস্টাগ্রাম">
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="mt-6 sm:mt-0 flex justify-center gap-6 text-[11px] font-black tracking-wide text-emerald-900">
              <button onClick={() => setView('home')} className="hover:text-emerald-700 transition-colors cursor-pointer select-none">হোম</button>
              <button onClick={() => setView('shop')} className="hover:text-emerald-700 transition-colors cursor-pointer select-none">তাজা পণ্য</button>
              <button onClick={() => setView('farmers')} className="hover:text-emerald-700 transition-colors cursor-pointer select-none">আমাদের বিশ্বস্ত কৃষক</button>
            </div>
          </div>

        </div>
      </footer>space-y-4 max-h-[700px] overflow-y-auto pr-1">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-100 rounded-2xl p-4 bg-white space-y-3 shadow-xs">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-xs font-black text-emerald-800 font-mono">{order.id}</span>
                            <span className="text-[10px] font-black text-indigo-700 font-mono">৳{order.totalPrice} BDT</span>
                          </div>

                          <div className="space-y-1.5 text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 leading-normal">
                            <span className="block font-bold text-gray-700">ক্রেতা: {order.customerName}</span>
                            <span className="block font-mono text-gray-400">মোবাইল: {order.customerPhone}</span>
                            <span className="block text-gray-500">গন্তব্য: {order.customerAddress}</span>
                            <span className="block text-[10px] text-gray-400 border-t border-gray-100 pt-1 mt-1 font-mono">অর্ডার আইটেম: {order.products.map(item => `${item.title} (x${item.quantity})`).join(', ')}</span>
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1 leading-none">ডেলিভারি স্থিতি:</label>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                              className="w-full text-xs font-bold font-sans rounded-xl border border-gray-200 py-1.5 px-2 bg-gray-50 focus:bg-white"
                            >
                              <option value="Pending">⏱ Pending (পেন্ডিং)</option>
                              <option value="Processing">🌿 Processing (প্রসেসিং)</option>
                              <option value="Packed">📦 Packed (প্যাকেট সম্পন্ন)</option>
                              <option value="Shipped">🚴 Shipped (ডেলিভারিতে)</option>
                              <option value="Delivered">✔ Delivered (সম্পন্ন)</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-gray-300 border-t border-slate-800 py-16 text-xs select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* OUR STORY: EMOTIONAL STARTUP STORY SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-b border-slate-800/80 pb-12">
            
            {/* Mission Statement Hook */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] bg-emerald-600/20 text-emerald-400 font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-550/10">Our Story • আমাদের পথচলা</span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight leading-snug">
                দালাল মুক্ত ও রাসায়নিক মুক্ত সুখী বাংলার স্বপ্নযাত্রায় <span className="text-emerald-400 bg-emerald-500/10 px-2 rounded-lg">কৃষক বাজার</span>
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-normal">
                আমরা বিশ্বাস করি, আমাদের মাটির উর্বরতা ও কৃষকদের অক্লান্ত পরিশ্রম এদেশের সবচেয়ে বড় সম্পদ। অথচ বাজার ব্যবস্থার অসঙ্গতি ও দালালের কারসাজিতে কৃষক ও সাধারণ ক্রেতা দুপক্ষই শোষিত হচ্ছেন প্রতিদিন। কৃষক বাজার এই বৈষম্যের অবসান ঘটাতে সরাসরি চাষীর ওয়ালেট ক্ষমতায়ন ও সতেজ খাবারের একটি সামাজিক বিপ্লব।
              </p>
            </div>

            {/* Core Story Pillars Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              
              {/* Pillar 1: Bangladesh agriculture */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 font-extrabold text-xs">🌾</span>
                  <h4 className="font-bold text-sm text-gray-100 font-sans">সোনার বাংলা ও উর্বর মৃত্তিকা</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  বাংলাদেশ সুজলা-সুফলা উর্বর পলল মাটির দেশ। আমাদের চাষীরা রোদে পুড়ে বৃষ্টিতে ভিজে পবিত্র ঘামের বিনিময়ে আমাদের জন্য মৌসুমী তাজা রসালো ফসল ফলান।
                </p>
              </div>

              {/* Pillar 2: Middlemen problem */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10 text-red-500/90 font-extrabold text-xs">⚠️</span>
                  <h4 className="font-bold text-sm text-gray-100 font-sans">দালাল ও মধ্যস্বত্ব ভোগী ব্যবস্থা</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  মাঠের উৎপাদক ফসল ৮ টাকায় বিক্রি করলেও আড়তদার ও ঘাটে ঘাটে মধ্যস্বত্বভোগীদের কৃত্রিম সংকটে ঢাকায় সাধারণ কাস্টমার তা ৮০ টাকায় ক্ষতিকর কেমিক্যালসহ কিনতে বাধ্য হন।
                </p>
              </div>

              {/* Pillar 3: Safe food mission */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-extrabold text-xs">🛡️</span>
                  <h4 className="font-bold text-sm text-gray-100 font-sans">রাসায়নিক মুক্ত শতভাগ বিশুদ্ধতা</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  ক্ষতিকর কার্বাইড, ফরমালিন বা নোংরা আর্জেস্টমেন্ট বর্জন করে সরাসরি মাঠ থেকে তাজা ও নির্ভেজাল পুষ্টিকর খাবার আপনার পরিবারের কাছে দ্রুততম সময়ে ডেলিভারি করাই আমাদের লক্ষ্য।
                </p>
              </div>

              {/* Pillar 4: Farmer empowerment */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 font-extrabold text-xs">🤝</span>
                  <h4 className="font-bold text-sm text-gray-100 font-sans">স্বাধীন ও ক্ষমতাবান আধুনিক চাষী</h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  কোনো ফড়িয়া ছাড়াই সম্পূর্ণ লভ্যাংশ সরাসরি নিজস্ব ডিজিটাল ওয়ালেটে চাষীদের কাছে পৌঁছে দিয়ে তাদের মুখে অনাবিল হাসি ফোটানোর স্বপ্ন দেখছি ও বাস্তবায়ন করছি।
                </p>
              </div>

            </div>

          </div>

          {/* Bottom Copyright and Navigation Bar */}
          <div className="sm:flex sm:items-center sm:justify-between text-gray-500 font-medium">
            <p className="text-[11px]">© {new Date().getFullYear()} কৃষক বাজার (Krishok Bazar). সামাজিক এগ্রো-উদ্যোগ উদ্যোগ। যথাযথ কপিরাইট সংরক্ষিত।</p>
            <div className="mt-4 sm:mt-0 flex justify-center gap-6 text-[11px] font-bold">
              <button onClick={() => setView('home')} className="hover:text-emerald-400 transition-colors">হোম</button>
              <button onClick={() => setView('shop')} className="hover:text-emerald-400 transition-colors">তাজা পণ্য</button>
              <button onClick={() => setView('farmers')} className="hover:text-emerald-400 transition-colors">আমাদের বিশ্বস্ত কৃষক</button>
            </div>
          </div>

        </div>
      </footer>

      {/* OVERLAY ELEMENTS */}
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

      <FloatingSocials />
      <RiktazAI />
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
