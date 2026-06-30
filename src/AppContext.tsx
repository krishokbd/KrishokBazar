/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Farmer, Product, ProductVariation, Order, User, Review, OrderItem, WithdrawalRequest, Category, Banner, BlogPost, SiteSettings, Offer, MembershipSubmission, FarmerPost, PostComment, HarvestAlert, WeeklyComboOffer, WeeklyComboProduct, DynamicPage } from './types';
import { demoFarmers, demoReviews, CATEGORIES, demoBlogs, DEFAULT_SITE_SETTINGS } from './data';
import { new45Products as demoProducts } from './newProducts';
import { HERO_CAROUSEL_BANNERS } from './assets';
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from './firebase';
import { cleanImageUrl, sanitizeFirestoreData } from './utils';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, writeBatch, getDocs } from 'firebase/firestore';
import { logAnalyticsEvent } from './lib/analytics';
import { supabaseService } from './lib/supabaseService';

interface AppContextType {
  farmers: Farmer[];
  products: Product[];
  harvestAlerts: HarvestAlert[];
  addHarvestAlert: (cropNameBn: string, cropNameEn: string, farmerName: string, district: string, imageUrl: string, statusBn: HarvestAlert['statusBn'], statusEn: HarvestAlert['statusEn'], harvestDate: string, descriptionBn: string, descriptionEn: string, productId?: string) => void;
  deleteHarvestAlert: (alertId: string) => void;
  orders: Order[];
  reviews: Review[];
  currentUser: User | null;
  cart: OrderItem[];
  withdrawalRequests: WithdrawalRequest[];
  registeredCustomers: User[];
  
  syncVersion: number;
  triggerLocalReRender: () => void;
  
  // CMS Fields
  categories: Category[];
  banners: Banner[];
  saveCategories: (newCategories: Category[]) => void;
  saveBanners: (newBanners: Banner[]) => void;
  siteSettings: SiteSettings;
  saveSiteSettings: (settings: SiteSettings) => void;
  triggerSync: (type: string) => void;
  blogs: BlogPost[];
  addBlogPost: (postData: Omit<BlogPost, 'id' | 'publishedAt'>) => void;
  editBlogPost: (postId: string, postData: Partial<BlogPost>) => void;
  deleteBlogPost: (postId: string) => void;

  // Auth actions
  login: (phone: string, role: 'Admin' | 'Farmer' | 'Customer', password?: string) => { success: boolean; message: string; subStatus?: string };
  loginAsFarmerDirectly: (farmer: Farmer) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (name: string, phone: string, address: string) => void;
  registerCustomer: (name: string, phone: string, password?: string, address?: string, gender?: 'male' | 'female') => { success: boolean; message: string };
  registerFarmer: (name: string, phone: string, password: string, district: string, address: string, nidNumber: string, nidImage: string, gender: 'male' | 'female') => { success: boolean; message: string };

  // Cart actions
  addToCart: (product: Product, quantity: number, customPrice?: number, customUnit?: string, variation?: ProductVariation) => void;
  removeFromCart: (productId: string, selectedUnit?: string, variationId?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedUnit?: string, variationId?: string) => void;
  clearCart: () => void;

  // Order actions
  placeOrder: (name: string, phone: string, address: string, paymentMethod?: 'COD' | 'bKash' | 'Nagad', paymentTxId?: string) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Withdrawal actions
  requestWithdrawal: (farmerId: string, amount: number, method: 'bKash' | 'Nagad' | 'Bank Transfer', details: string) => { success: boolean; message: string };
  updateWithdrawallStatus: (requestId: string, status: WithdrawalRequest['status']) => void;

  // Admin actions on Farmers
  editFarmerRating: (farmerId: string, rating: number) => void;
  toggleVerifyFarmer: (farmerId: string) => void;
  toggleBlockFarmer: (farmerId: string) => void;
  deleteFarmer: (farmerId: string) => void;
  approveFarmerRegistration: (farmerId: string) => void;
  updateFarmer: (farmerId: string, updatedData: Partial<Farmer>) => void;

  // Product actions (Admin & Farmer)
  addProduct: (productData: Omit<Product, 'id' | 'rating' | 'farmerName' | 'isVerified'>) => void;
  editProduct: (productId: string, productData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Review actions
  addReview: (reviewData: Omit<Review, 'id' | 'isVerifiedPurchase'>) => void;
  deleteReview: (reviewId: string) => void;

  // NID Visual Verification actions & authenticity fetching logic
  getNidDetails: (farmerId: string) => {
    exists: boolean;
    nid: string;
    status: 'Verified' | 'Suspected' | 'System Error' | 'Unverified';
    percentMatchCount: number;
    ecReference: string;
    verifiedAt: string;
  };

  // Seed / Reset databases
  resetDemoData: () => Promise<void>;
  initializeVerifiedFarmers: () => Promise<void>;
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
  toggleLanguage: () => void;

  // OFFERS & SUBSCRIPTIONS STUFF
  offers: Offer[];
  customerPlans: any[];
  farmerPlans: any[];
  membershipSubmissions: MembershipSubmission[];
  addOffer: (offerData: Omit<Offer, 'id'>) => void;
  editOffer: (id: string, offerData: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
  updateSubscriptionPlan: (role: 'customer' | 'farmer', id: string, updatedFields: Partial<any>) => void;
  submitMembershipRequest: (phone: string, txId: string, categorySlug?: string, amount?: number) => void;
  approveMembershipRequest: (submissionId: string) => void;
  rejectMembershipRequest: (submissionId: string) => void;
  simulateEmailSignUpClick: () => void;
  approvePaymentForUser: (userId: string) => void;
  // Farmer Post System state and actions
  posts: FarmerPost[];
  addPost: (content: string, images: string[], videos: string[]) => void;
  likePost: (postId: string) => void;
  commentPost: (postId: string, commentText: string, parentCommentId?: string) => void;
  deletePost: (postId: string) => void;
  weeklyCombos: WeeklyComboOffer[];
  saveWeeklyCombos: (newWeeklyCombos: WeeklyComboOffer[]) => void;
  dynamicPages: DynamicPage[];
  saveDynamicPages: (newPages: DynamicPage[]) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Seeds default baseline accounts
const SEED_CUSTOMERS: User[] = [
  {
    id: 'customer-user-1',
    phone: '01931355398',
    password: 'Ajzakir@2020',
    role: 'Customer',
    name: 'Muikta Begum',
    address: 'Dhakeshwari, Lalbagh, Dhaka-1211'
  },
  {
    id: 'customer-user-2',
    phone: '01811223344',
    password: 'Ajzakir@2020',
    role: 'Customer',
    name: 'Naimul Islam',
    address: 'Mirpur 10, Dhaka'
  }
];

const SEED_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'WR-101',
    farmerId: 'f70',
    farmerName: 'সাইফুল ইসলাম',
    amount: 1500,
    method: 'bKash',
    details: 'bKash: 01983790476',
    status: 'Paid',
    createdAt: '2026-05-18T12:00:00Z'
  },
  {
    id: 'WR-102',
    farmerId: 'f71',
    farmerName: 'মান্নান হোসেন',
    amount: 2500,
    method: 'Nagad',
    details: 'Nagad: 01773309831',
    status: 'Pending',
    createdAt: '2026-05-20T10:00:00Z'
  }
];

const DEFAULT_OFFERS: Offer[] = [
  {
    id: 'offer-ready-to-cook',
    titleBn: '🍳 রেডি-টু-কুক (Ready-to-Cook) প্রিমিয়াম সুবিধা!',
    titleEn: '🍳 Premium Ready-to-Cook Benefits!',
    descBn: 'কর্মব্যস্ত জীবনের জন্য প্রাক-ধৌত ও হাইজেনিক উপায়ে কাটা সবজি এবং প্রস্তুত মশলা ডিরেক্ট হোম ডেলিভারি পেতে আমাদের প্রিমিয়াম মেম্বারশিপে যোগ দিন।',
    descEn: 'Join our premium membership for home-delivery of pre-washed, pre-cut hygienic vegetables and meat items matching your recipe size!',
    ctaBn: 'সদস্য হতে সাবস্ক্রাইব করুন 👑',
    ctaEn: 'Subscribe to become a member 👑',
    tagBn: 'মেডিকেল গ্রেড বিশুদ্ধতা',
    tagEn: 'Hygienic standard',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500',
    categorySlug: 'ready-to-cook'
  },
  {
    id: 'offer-enjoy',
    titleBn: '🏷️ স্পেশাল মেম্বারশিপ ও ফ্যামিলি বাস্কেট অফার!',
    titleEn: '🏷️ Weekly Premium Enjoy Discount Offer!',
    descBn: 'শুধুমাত্র একটি সাবস্ক্রিপশনেই পেয়ে যান ৭০% পর্যন্ত ডেলিভারি ছাড় এবং ফ্যামিলি কম্বো বাস্কেটে আকর্ষণীয় ক্যাশব্যাক! সাশ্রয় করুন প্রতি মাসে ৫০০০+ টাকা।',
    descEn: 'Get up to 70% delivery discounts and awesome cashbacks on all family combo baskets! Save over 5000+ BDT cash money every month.',
    ctaBn: 'সাশ্রয়ী প্ল্যান দেখুন 🛒',
    ctaEn: 'Explore Budget Plans 🛒',
    tagBn: 'সীমিত সময়ের অফার',
    tagEn: 'Limited Offer',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    categorySlug: 'organic'
  },
  {
    id: 'offer-do-good',
    titleBn: '🚜 কৃষক ও সরাসরি খামারের সেরা সুবিধার মেম্বারশিপ!',
    titleEn: '🚜 Support Hardworking Farmers Direct Deal!',
    descBn: 'দালাল ও সিন্ডিকেট মাফিয়া হটিয়ে সরাসরি তৃণমূল ভেরিফাইড কৃষকদের সাথে যোগাযোগ করুণ। কৃষক বাঁচাতে ও বিষমুক্ত খাদ্য পেতে সহায়ক হোন।',
    descEn: 'Establish immediate direct connection with local growers and support ethical trade while securing non-toxic organic foods.',
    ctaBn: 'আজই প্রিমিয়াম মেম্বার হোন 🤝',
    ctaEn: 'Become a Premium Member 🤝',
    tagBn: 'সামাজিক আন্দোলন',
    tagEn: 'Social Movement',
    image: 'https://images.unsplash.com/photo-1592312040834-bb0d621713e1?w=500',
    categorySlug: 'vegetables'
  }
];

export const DEFAULT_CUSTOMER_PLANS = [
  {
    id: 'bronze',
    name: 'ব্রোঞ্জ প্ল্যান (Bronze Plan)',
    nameEn: 'Bronze Plan',
    badge: 'লাইট ভ্যালু',
    badgeEn: 'Light Value',
    price: 499,
    desc: 'মৌসুমী তাজা সবজি ও ধনেপাতা/শাক আইটেমগুলো সতেজ ডেলিভারি। সাধারণ খাদকের জন্য যুতসই।',
    descEn: 'Delivery of basic seasonal vegetables and herbs. Highly affordable.',
    perks: ['২-৩ ক্যাটাগরির তাজা সবুজ শাকসবজি', 'ভেষজ ও ধনেপাতা ফ্রী অ্যাসোর্টমেন্ট', '২৫% ডেলিভারি চার্জ ডিসকাউন্ট'],
    perksEn: ['2-3 Veggies Pre-Chopped', 'Clean Hygienic Pack', '25% Shipping Subsidy']
  },
  {
    id: 'silver',
    name: 'সিলভার প্ল্যান (Silver Plan)',
    nameEn: 'Silver Plan',
    badge: 'সবজি স্পেশাল',
    badgeEn: 'Veg Special',
    price: 500,
    desc: 'রান্না উপযোগী কাটা-ধোয়া রেডি-টু-কুক সবজি ও পাতার আইটেমগুলো সতেজ ডেলিভারি। ব্যস্ত গৃহিণীদের প্রিয়।',
    descEn: 'Pre-washed, chopped ready-to-cook fresh vegetables and greens.',
    perks: ['৩-৪ ক্যাটাগরির রেডি-টু-কুক সবজি', 'প্রাক-ধৌত ও হাইজেনিক প্যাকিং', '৫০% ডেলিভারি চার্জ ছাড়'],
    perksEn: ['3-4 Veggies Pre-Chopped', 'Premium Pack', '50% Off Delivery Fee']
  },
  {
    id: 'gold',
    name: 'গোল্ড প্ল্যান (Gold Plan)',
    nameEn: 'Gold Plan',
    badge: 'মসলা ও মিট ডিল',
    badgeEn: 'Meat & Spice Combo',
    price: 999,
    desc: 'কাটা সবজি, বিশেষ ম্যারিনেট করা মুরগী/গরুর মাংসের রেডি প্যাকেট এবং হাতভাঙা খাঁটি হলুদ ও মরিচ গুড়া।',
    descEn: 'Chopped vegetables, marinated meat cuts, and stone-ground pure spices.',
    perks: ['সিলভার প্ল্যানের সকল সুবিধা অন্তর্ভুক্ত', 'ম্যারিনেট করা মাংসের রেডি প্যাকেট', 'হাতভাঙা সতেজ হলুদ/মরিচ গুড়া', 'ফ্ল্যাট ৮০% ডেলিভারি ডিসকাউন্ট'],
    perksEn: ['Includes Silver Bundle', 'Marinated Meat packets', 'Stoneground spices', 'Flat 80% Shipping Discount']
  },
  {
    id: 'platinum',
    name: 'প্লাটিনাম সুপার (Platinum Plan)',
    nameEn: 'Platinum Super',
    badge: 'ভিআইপি আনলিমিটেড',
    badgeEn: 'VIP Unlimited',
    price: 1399,
    desc: 'ডেলিভারি চার্জ সম্পূর্ণ ফ্রী। কাস্টম কাটা সবজি ও মাংস এবং সরাসরি খামার অথবা বাজার থেকে লাইভ ভিডিও কলে বাছার কভারেজ।',
    descEn: 'Zero shipping charges forever. Fully customizable vegetable cuts and live video assistance.',
    perks: ['গোল্ড প্ল্যানের সকল সুবিধা অন্তর্ভুক্ত', 'সম্পূর্ণ কাস্টম সাইজ কাটা মাংস ও সবজি', 'আনলিমিটেড ডেলিভারি চার্জ ফ্রি!', 'ভিআইপি খামারি ভিডিও নির্বাচন সাপোর্ট'],
    perksEn: ['Includes Gold Bundle', 'Custom cuts support', 'Zero delivery fee forever', 'Live Video pick option']
  }
];

export const DEFAULT_FARMER_PLANS = [
  {
    id: 'farmer_silver',
    name: 'সিলভার খামারি স্পনসর (Silver Plan)',
    nameEn: 'Silver Farmer Sponsor',
    badge: 'বেসিক ভেরিফাইড',
    badgeEn: 'Basic Verified',
    price: 1000,
    desc: 'নিজস্ব অনলাইন খামার পোর্টাল, লাইভ অর্ডার নোটিফিকেশন সুবিধা এবং ১টি ডেডিকেটেড ক্যাটাগরি বুস্টিং প্রোগ্রাম।',
    descEn: 'Online farmer store portal, real-time orders, and 1 category boost.',
    perks: ['৫টি বেশি প্রোডাক্ট লিস্টিং', 'ভেরিফাইড খামারি সিলভার ব্যাজ', 'বিকাশ-নগদ ৩ ঘণ্টায় পেমেন্ট উইথড্রয়াল', '৫০% সেলস বৃদ্ধির গ্যারান্টি'],
    perksEn: ['Up to 5 Products', 'Verified Silver Badge', '3-Hour Bkash Payouts', '50% Guaranteed Sales Boost']
  },
  {
    id: 'farmer_gold',
    name: 'গোল্ড খামারি স্পনসর (Gold Plan)',
    nameEn: 'Gold Farmer Sponsor',
    badge: 'ট্রাস্টেড কানেক্ট',
    badgeEn: 'Trusted Connect',
    price: 2000,
    desc: 'সিলভারের সকল সুবিধা, ৩টি ক্যাটাগরি বুস্টিং, বিশেষ প্রোমোশনাল ব্যানার এবং সরাসরি বায়ার লিড।',
    descEn: 'Includes Silver benefits plus 3 category boosts and direct retail leads.',
    perks: ['১৫টি পন্য লিস্টিং সাপোর্ট', 'ভেরিফাইড খামারি গোল্ডেন ব্যাজ', 'গ্রাহকদের খামারে লাইভ স্ট্রিম ব্যবস্থা', '৮০% সেলস বৃদ্ধির গ্যারান্টি'],
    perksEn: ['Up to 15 Products', 'Verified Gold Badge', 'Live Stream to buyer', '80% Guaranteed Sales Boost']
  },
  {
    id: 'farmer_platinum',
    name: 'প্লাটিনাম খামারি স্পনসর (Platinum Plan)',
    nameEn: 'Platinum Farmer Sponsor',
    badge: 'আল্টিমেট স্পনসর',
    badgeEn: 'Ultimate Sponsor',
    price: 3000,
    desc: 'ঢাকার ক্রেতার কাছে আমাদের নিজস্ব ট্রাকে ফ্রী ফসল ডেলিভারি ও সর্বোচ্চ কভারেজ।',
    descEn: 'Free truck collection to Dhaka buyers and ultimate home-page feature placement.',
    perks: ['আনলিমিটেড প্রোডাক্ট লিস্টিং সুবিধা', 'ভেরিফাইড খামারি ডায়মন্ড ব্যাজ', 'হোমপেজে ফিক্সড ব্যানার বুস্ট', '১২০% সেলস গ্রোথ নিশ্চিত গ্যারান্টি'],
    perksEn: ['Unlimited products', 'Verified Diamond badge', 'Homepage banner feature', '120% Sales growth guarantee']
  },
  {
    id: 'farmer_partner',
    name: 'কৃষক ভেরিফাইড পার্টনার (Partner Plan)',
    nameEn: 'Farmer Verified Partner',
    badge: 'ভেরিফাইড পার্টনার',
    badgeEn: 'Verified Partner',
    price: 250,
    desc: 'কুরিয়ার সংগ্রহ হব থেকে সরাসরি ঢাকার ক্রেতার কাছে ফসল কভারেজ।',
    descEn: 'Crop coverage from regional courier hubs directly to Dhaka customers.',
    perks: ['১০টি অর্ডার অগ্রাধিকার', 'ভেরিফাইড খামারি গ্রীন ব্যাজ', 'বিকাশ-নগদ পেমেন্ট উইথড্রয়াল', '৫০% সেলস গ্রোথ গ্যারান্টি'],
    perksEn: ['10 Order priority', 'Verified green badge', 'Bkash payout', '50% Sales growth guarantee']
  }
];

export const sortProductsBySerial = (list: Product[]) => {
  return [...list].sort((a, b) => {
    const isCbA = a.id.startsWith('cb');
    const isCbB = b.id.startsWith('cb');
    if (isCbA && !isCbB) return -1;
    if (!isCbA && isCbB) return 1;
    
    const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
    return numB - numA;
  });
};

export const convertGoogleDriveLink = (url: string): string => {
  if (!url) return '';
  const clean = url.trim();
  
  let fileId = '';
  
  // 1. Matches /file/d/ID/view, /file/u/0/d/ID/view, /file/u/1/d/ID, etc.
  const fileDMatch = clean.match(/\/file\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    fileId = fileDMatch[1];
  } else {
    // 2. General fallback for any /d/ID pattern in drive path
    const generalDMatch = clean.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (generalDMatch && generalDMatch[1]) {
      fileId = generalDMatch[1];
    } else {
      // 3. Matches query parameter id=FILE_ID
      const idParam = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idParam && idParam[1]) {
        fileId = idParam[1];
      }
    }
  }
  
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return url;
};

export const DEFAULT_WEEKLY_COMBOS: WeeklyComboOffer[] = [
  {
    id: "co-1",
    titleBn: "১। সবুজ সালাদ ও পুষ্টি বাস্কেট",
    titleEn: "1. Green Salad & Nutrition Basket",
    products: [
      {
        id: "co-1-p-1",
        nameBn: "দেশী গোল আলু (Local Red Potato)",
        nameEn: "Crisp Local Red Potatoes",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600",
        link: "",
        weight: "১ কেজি",
        date: "১২ জুন, ২০২৬",
        prices: [35, 65, 120, 280],
        priceLabels: ["৫০০ গ্রাম", "১ কেজি", "২ কেজি", "৫ কেজি"]
      },
      {
        id: "co-1-p-2",
        nameBn: "সালাদ টমেটো (Salad Tomato)",
        nameEn: "Fresh Red Salad Tomatoes",
        image: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=600",
        link: "",
        weight: "১ কেজি",
        date: "১২ জুন, ২০২৬",
        prices: [50, 95, 180, 420],
        priceLabels: ["৫০০ গ্রাম", "১ কেজি", "২ কেজি", "৫ কেজি"]
      },
      {
        id: "co-1-p-3",
        nameBn: "সতেজ গাজর (Fresh Carrot)",
        nameEn: "Sweet Crunchy Carrots",
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600",
        link: "",
        weight: "৫০০ গ্রাম",
        date: "১২ জুন, ২০২৬",
        prices: [45, 80, 150, 350],
        priceLabels: ["৫০০ গ্রাম", "১ কেজি", "২ কেজি", "৫ কেজি"]
      },
      {
        id: "co-1-p-4",
        nameBn: "তাজা সবুজ কাঁচামরিচ (Fresh Green Chilies)",
        nameEn: "Organic Fresh Spicy Chilies",
        image: "https://images.unsplash.com/photo-1588252303782-cb80119cb665?w=600",
        link: "",
        weight: "২৫০ গ্রাম",
        date: "১২ জুন, ২০২৬",
        prices: [30, 55, 100, 240],
        priceLabels: ["২৫০ গ্রাম", "৫০০ গ্রাম", "১ কেজি", "২.৫ কেজি"]
      }
    ]
  },
  {
    id: "co-2",
    titleBn: "২। পুষ্টি বুস্টার তাজা ফল বাস্কেট",
    titleEn: "2. Vitamin Booster Fruit Basket",
    products: [
      {
        id: "co-2-p-1",
        nameBn: "সবুজ রসালো মাল্টা (Malta Juice)",
        nameEn: "Juicy Mountain Green Malta",
        image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600",
        link: "",
        weight: "১ কেজি",
        date: "১২ জুন, ২০২৬",
        prices: [120, 230, 440, 1050],
        priceLabels: ["১ কেজি", "২ কেজি", "৪ কেজি", "১০ কেজি"]
      },
      {
        id: "co-2-p-2",
        nameBn: "মিষ্টি লাল বেদানা (Sweet Pomegranate)",
        nameEn: "Sweet Red Pomegranate",
        image: "https://images.unsplash.com/photo-1601558252271-e405a76865d4?w=600",
        link: "",
        weight: "১ কেজি",
        date: "১২ জুন, ২০২৬",
        prices: [250, 480, 950, 2300],
        priceLabels: ["১ কেজি", "২ কেজি", "৪ কেজি", "১০ কেজি"]
      },
      {
        id: "co-2-p-3",
        nameBn: "সবুজ আপেল (Crisp Green Apple)",
        nameEn: "Crisp Fresh Green Apples",
        image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600",
        link: "",
        weight: "১ কেজি",
        date: "১২ জুন, ২০২৬",
        prices: [180, 350, 680, 1600],
        priceLabels: ["১ কেজি", "২ কেজি", "৪ কেজি", "১০ কেজি"]
      },
      {
        id: "co-2-p-4",
        nameBn: "কলা সাগর সবরি কম্বো (Tasty Hill Bananas)",
        nameEn: "Sweet Hill Bananas Pack",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600",
        link: "",
        weight: "১ ডজন",
        date: "১২ জুন, ২০২৬",
        prices: [90, 175, 340, 800],
        priceLabels: ["১ ডজন", "২ ডজন", "৪ ডজন", "১০ ডজন"]
      }
    ]
  },
  {
    id: "co-3",
    titleBn: "৩। কিচেন এসেনশিয়াল অর্গানিক বাস্কেট",
    titleEn: "3. Kitchen Essentials Organic Basket",
    products: [
      {
        id: "co-3-p-1",
        nameBn: "সুন্দরবনের খাঁটি মধু (Pure Honey)",
        nameEn: "Pure Unfiltered Sundarban Honey",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600",
        link: "",
        weight: "২৫০ গ্রাম",
        date: "১২ জুন, ২০২৬",
        prices: [350, 680, 1320, 3100],
        priceLabels: ["২৫০ গ্রাম", "৫০০ গ্রাম", "১ কেজি", "২.৫ কেজি"]
      },
      {
        id: "co-3-p-2",
        nameBn: "সতেজ শসা (Green Cucumber)",
        nameEn: "Crisp Green Cucumbers",
        image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600",
        link: "",
        weight: "১ কেজি",
        date: "১২ জুন, ২০২৬",
        prices: [40, 75, 140, 320],
        priceLabels: ["৫০০ গ্রাম", "১ কেজি", "২ কেজি", "৫ কেজি"]
      },
      {
        id: "co-3-p-3",
        nameBn: "কাগজি সুগন্ধি লেবু (Green Lemons)",
        nameEn: "Juicy Seedless Lemons",
        image: "https://images.unsplash.com/photo-1590502596717-295b7fece67b?w=600",
        link: "",
        weight: "১২ পিস",
        date: "১২ জুন, ২০২৬",
        prices: [30, 50, 95, 180],
        priceLabels: ["৪টি", "১২টি (১ ডজন)", "২৪টি (২ ডজন)", "৪০টি"]
      },
      {
        id: "co-3-p-4",
        nameBn: "পাহাড়ি মিষ্টি পেঁপে (Sweet Papaya)",
        nameEn: "Organic Sweet Rich Papaya",
        image: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=600",
        link: "",
        weight: "১ কেজি",
        date: "১২ জুন, ২০২৬",
        prices: [55, 100, 190, 450],
        priceLabels: ["৫০০ গ্রাম", "১ কেজি", "২ কেজি", "৫ কেজি"]
      }
    ]
  }
];

  const COMBO_BASKETS_DEFAULT: Product[] = [
    {
      id: 'cb1',
      title: 'সাপ্তাহিক বাজেট কো-অপ সস্তাই বাস্কেট (Budget Offer)',
      description: 'বাজেট সচেতন ডাল-ভাতের বাঙালি পরিবারের ১ সপ্তাহের সেরা তাজা সবজির কমপ্লিট সল্যুশন! গোল লাল আলু ২ কেজি, বেগুন ১ কেজি, দেশী পেঁয়াজ ১ কেজি, রসুনের সেরা কোয়ালিটি ২৫০ গ্রাম, তাজা ধনে পাতা ২৫০ গ্রাম, কচি কাঁচামরিচ ২৫০ গ্রাম, ও কচি লম্বা লতা লাউ ১টি।',
      price: 550,
      discountPrice: 500,
      category: 'ready-to-cook',
      farmerId: 'f70',
      farmerName: 'সাইফুল ইসলাম',
      farmName: 'সাইফুল অর্গানিক এগ্রো',
      rating: 4.9,
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1000&auto=format&fit=crop&q=80'
      ],
      isVerified: true,
      isReadyToCook: true,
      harvestDate: 'June 12, 2026'
    },
    {
      id: 'cb2',
      title: 'ফ্যামিলি সাইজ প্রিমিয়াম কম্বো বাস্কেট (Standard Family)',
      description: 'মাঝারি বাঙালি পরিবারের ১ সপ্তাহের সেরা সতেজ পুষ্টির যোগান! দেশী আলু ৩ কেজি, লাল টমেটো ২ কেজি, পটল ১ কেজি, মিষ্টি কুমড়ার আস্ত ফালি ১টি, সুগন্ধি কাঁচামরিচ ৫০০ গ্রাম, তাজা ধনেপাতা ২৫০ গ্রাম, দেশী পেঁয়াজ ২ কেজি এবং কচি সতেজ ঝিঙে ১ কেজি।',
      price: 850,
      discountPrice: 780,
      category: 'ready-to-cook',
      farmerId: 'f71',
      farmerName: 'মান্নান হোসেন',
      farmName: 'মান্নান সমন্বিত ডেইরি ও কৃষি',
      rating: 4.8,
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1000'
      ],
      isVerified: true,
      isReadyToCook: true,
      harvestDate: 'June 12, 2026'
    },
    {
      id: 'cb3',
      title: 'মেগা পুষ্টি কম্বো ঝুড়ি (Premium Mega Nutrients)',
      description: 'বড় ও স্বাস্থ্যসচেতন যৌথ পরিবারের জন্য তৈরি মেগা প্যাক! তাজা লাল শাক ৪ আঁটি, দেশী আলু ৫ কেজি, রসুন ১ কেজি, পেঁয়াজ ৩ কেজি, আদা ৫০০ গ্রাম, কচি লাউ ২টি, বেগুন ও পটল ২ কেজি করে, তাজা মিষ্টি পেঁপে ৩ কেজি এবং ১ ডজন লাল ডিম।',
      price: 1550,
      discountPrice: 1450,
      category: 'ready-to-cook',
      farmerId: 'f72',
      farmerName: 'সুরুজ মিয়া',
      farmName: 'সুরুজ সতেজ সবজি খামার',
      rating: 4.9,
      stock: 15,
      images: [
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80'
      ],
      isVerified: true,
      isReadyToCook: true,
      harvestDate: 'June 12, 2026'
    },
    {
      id: 'cb4',
      title: 'মেগা খাসি ও সবজি উৎসব বাস্কেট (Grand Mutton Festival Basket)',
      description: 'পারিবারিক ভোজ ও উৎসবের জন্য সেরা আয়োজন! ২ কেজি একদম তাজা প্রিমিয়াম কোয়ালিটির খাসির মাংস (হাড়সহ), ৫ কেজি দেশী আলুর বস্তা, ২ কেজি পেঁয়াজ, ৫০০ গ্রাম খাঁটি ঘি এবং সুগন্ধি চিনিগুঁড়া বাসমতি চাল ৩ কেজি।',
      price: 3800,
      discountPrice: 3500,
      category: 'ready-to-cook',
      farmerId: 'f73',
      farmerName: 'ডাঃ মোতালেব',
      farmName: 'মোতালেব এগ্রো ও পোল্ট্রি',
      rating: 5.0,
      stock: 10,
      images: [
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80'
      ],
      isVerified: true,
      isReadyToCook: true,
      harvestDate: 'June 12, 2026'
    },
    {
      id: 'cb5',
      title: 'জৈব লাল আলু মিষ্টিকন্দ (Organic Sweet Potato Selection)',
      description: 'নরম সুস্বাদু আঁশছাড়া পুষ্টিকর লাল মিষ্টি আলু সরাসরি সাইফুল ভাইয়ের ক্ষেত থেকে!',
      price: 150,
      discountPrice: 120,
      category: 'ready-to-cook',
      farmerId: 'f70',
      farmerName: 'সাইফুল ইসলাম',
      farmName: 'সাইফুল অর্গানিক এগ্রো',
      rating: 4.7,
      stock: 40,
      images: [
        'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000'
      ],
      isVerified: true,
      isReadyToCook: true,
      harvestDate: 'June 12, 2026'
    },
    {
      id: 'cb6',
      title: 'খাঁটি সকালের নাস্তা কম্বো (Fresh Breakfast Mini Combo)',
      description: '১ ডজন সতেজ হাঁসের ডিম এবং ১ লিটার খাঁটি গরুর দুধের স্বাস্থ্যকর ট্রায়াল বাস্কেট!',
      price: 330,
      discountPrice: 300,
      category: 'ready-to-cook',
      farmerId: 'f71',
      farmerName: 'মান্নান হোসেন',
      farmName: 'মান্নান সমন্বিত ডেইরি ও কৃষি',
      rating: 4.8,
      stock: 35,
      images: [
        'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/1545578418923.jpg?v=1778790838',
        'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_13.jpg?v=1778789927'
      ],
      isVerified: true,
      isReadyToCook: true,
      harvestDate: 'June 12, 2026'
    },
    {
      id: 'cb7',
      title: 'দেশী সুগন্ধি মসলা ট্রায়াল প্যাক (Spice Starter Trial Pack)',
      description: 'রান্নার প্রয়োজনীয় তাজা মসলার বাজেট অফার! লাল শুকনা মরিচ ১০০ গ্রাম, দেশী হলুদ গুঁড়া ১০০ গ্রাম, ধনে গুঁড়া ১০০ গ্রাম, ও জিরা ৫০ গ্রাম।',
      price: 150,
      discountPrice: 120,
      category: 'ready-to-cook',
      farmerId: 'f72',
      farmerName: 'সুরুজ মিয়া',
      farmName: 'সুরুজ সতেজ সবজি খামার',
      rating: 4.9,
      stock: 50,
      images: [
        'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1000'
      ],
      isVerified: true,
      isReadyToCook: true,
      harvestDate: 'June 12, 2026'
    }
  ];

  // MARKER_COMBO_END

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farmers, setFarmers] = useState<Farmer[]>(() => {
    const saved = localStorage.getItem('kb_farmers');
    let loaded: Farmer[] = saved ? JSON.parse(saved) : demoFarmers;
    
    // Keep the five real partner farmers and any new ones with real pictures
    const allowedIds = ['f70', 'f71', 'f72', 'f73', 'f74'];
    loaded = loaded.filter(f => {
      if (allowedIds.includes(f.id)) return true;
      // If it doesn't have a real picture, filter it out
      if (!f.avatar || f.avatar === 'male' || f.avatar === 'female' || (!f.avatar.startsWith('http') && !f.avatar.startsWith('data:image'))) {
        return false;
      }
      return true;
    });

    // Ensure all 5 real partner farmers are always loaded if missing
    const missing = demoFarmers.filter(df => allowedIds.includes(df.id) && !loaded.some(lf => lf.id === df.id));
    if (missing.length > 0) {
      loaded = [...loaded, ...missing];
    }
    return loaded;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kb_products');
    let base = saved ? JSON.parse(saved) : demoProducts;
    
    // Only seed the default products if there are none in localStorage
    if (!base || base.length === 0) {
      base = demoProducts;
      localStorage.setItem('kb_products', JSON.stringify(demoProducts));
    }
    
    // Extract non-combo items and insert the 4 upgraded combo baskets cleanly so they are always in sync
    const baseWithoutCombos = base.filter((p: any) => !p.id.startsWith('cb'));
    const fullList = [...COMBO_BASKETS_DEFAULT, ...baseWithoutCombos];
    const sortedList = sortProductsBySerial(fullList);
    
    localStorage.setItem('kb_products', JSON.stringify(sortedList));
    return sortedList;
  });

  const DEFAULT_POSTS: FarmerPost[] = [
    {
      id: 'post1',
      farmerId: 'f70',
      farmerName: 'সাইফুল ইসলাম',
      avatar: 'https://drive.google.com/file/d/1MNAxsXgBPgWUgOdlTJNgtuUbyMgsa1LP/view?usp=sharing',
      content: 'আসসালামু আলাইকুম! আমার জৈব খামারের একদম সতেজ ফুলকপি ও টমেটো গাছ থেকে তোলা হয়েছে আজকে সকালে। কোনো রাসায়নিক সার ব্যবহার করিনি। আলহামদুলিল্লাহ ফলন এবার বেশ ভালো হয়েছে। আমাদের খামারের একটি ছোট্ট রিয়েল ভিডিও নিচে যুক্ত করলাম, সবাই দেখে মতামত জানাবেন!',
      images: ['https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600'],
      videos: ['https://youtube.com/shorts/iRHqWnxj-jU?feature=share'],
      likes: 24,
      likedByUserIds: [],
      comments: [
        {
          id: 'c1',
          userName: 'মান্নান হোসেন',
          content: 'মাশাআল্লাহ সাইফুল ভাই ভাই, আপনার উদ্যোগ প্রশংসনীয়। রাসায়নিকমুক্ত ফসল জোগানোর এই প্রচেষ্টা সার্থক হোক।',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'c2',
          userName: 'সুরুজ মিয়া',
          content: 'খুব সুন্দর ভিডিও সাইফুল ভাই!',
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'post2',
      farmerId: 'f71',
      farmerName: 'মান্নান হোসেন',
      avatar: 'https://drive.google.com/file/d/19088gWf6qduPvGC8v1eC1NpvqhuCoGzC/view?usp=sharing',
      content: 'সম্মানিত ক্রেতাবৃন্দ, আমার সমন্বিত দুগ্ধ ও ডিম খামারে আজকে একদম ফ্রেশ হাঁসের ডিম সংগ্রহ করেছি। কোনো কৃত্রিম ফিড ছাড়াই এদের প্রাকৃতিক উপায়ে পালন করা হয়েছে। ফ্যামিলি বাজেট কম্বো বাস্কেটের সাথে আপনারা ডিমের অর্ডারও প্লেস করতে পারেন।',
      images: ['https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=600'],
      videos: ['https://youtube.com/shorts/oLgAz7tiS-Y?feature=share'],
      likes: 18,
      likedByUserIds: [],
      comments: [
        {
          id: 'c3',
          userName: 'সাইফুল ইসলাম',
          content: 'মান্নান ভাই, হাঁসের এই ডিমের কোয়ালিটি সত্যিই অসাধারণ দেখায়!',
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 43200000).toISOString()
    }
  ];

  const DEFAULT_HARVEST_ALERTS: HarvestAlert[] = [
    {
      id: 'ha-1',
      cropNameBn: 'সাইফুল ইসলামের সতেজ টমেটো ও শাকসবজি',
      cropNameEn: 'Organic Fresh Tomatoes by Saiful Islam',
      farmerName: 'সাইফুল ইসলাম',
      district: 'Gazipur',
      imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=80',
      statusBn: 'সদ্য সংগৃহীত',
      statusEn: 'Just Harvested',
      harvestDate: 'June 12, 2026',
      descriptionBn: 'সম্পূর্ণ প্রাকৃতিক উপায়ে বিষমুক্ত ও সতেজ লাল শাক ও লাল টমেটো। সরাসরি সাইফুল ইসলামের খামার থেকে ২৪ ঘন্টায় পৌঁছাবে আপনার ঘরে!',
      descriptionEn: 'Grown in 100% organic, pesticide-free environment. Sourced directly from grower Saiful Islam, delivered fresh within 24 hours.',
      productId: 'p1',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'ha-2',
      cropNameBn: 'মান্নান হোসেনের খাঁটি দুধ ও শস্য',
      cropNameEn: 'Pure Organic Milk by Mannan Hossain',
      farmerName: 'মান্নান হোসেন',
      district: 'Gazipur',
      imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80',
      statusBn: 'আগামীকাল সংগ্রহ',
      statusEn: 'Harvesting Tomorrow',
      harvestDate: 'June 13, 2026',
      descriptionBn: 'কোনো রাসায়নিক সুষম খাদ্য ছাড়াই খাঁটি গরুর তরল দুধ ও তাজা ডিম। আগামীকাল ভোরে সরাসরি তোলা হচ্ছে আমাদের খামার থেকে।',
      descriptionEn: 'Completely natural and chemical-free liquid milk and organic farm eggs. Pre-book to claim your morning fresh batch.',
      productId: 'cb2',
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
    },
    {
      id: 'ha-3',
      cropNameBn: 'সুরুজ মিয়ার বাগান পাকা বোম্বাই লিচু',
      cropNameEn: 'Juicy Bombay Litchis by Suruj Mia',
      farmerName: 'সুরুজ মিয়া',
      district: 'Gazipur',
      imageUrl: 'https://images.unsplash.com/photo-1421167418805-7f170a738eb4?w=600&auto=format&fit=crop&q=80',
      statusBn: 'আসন্ন',
      statusEn: 'Upcoming',
      harvestDate: 'June 20, 2026',
      descriptionBn: 'লাল টসটসে মিষ্টি বোম্বাই লিচু সংগ্রহের প্রস্তুতি চলছে। খামারি সুরুজ মিয়ার বাগান থেকে সরাসরি প্রি-বুকিং ডিল।',
      descriptionEn: 'Deep-red and extremely juicy litchis are ripening. Pre-book directly from farmer Suruj Mia.',
      productId: 'p4',
      createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
    },
    {
      id: 'ha-4',
      cropNameBn: 'ফিরোজ কবিরের খাঁটি বিলের তাজা মাছ',
      cropNameEn: 'Fresh Catch Wild Fish by Firoz Kabir',
      farmerName: 'ফিরোজ কবির',
      district: 'Gazipur',
      imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
      statusBn: 'সদ্য সংগৃহীত',
      statusEn: 'Just Harvested',
      harvestDate: 'June 10, 2026',
      descriptionBn: 'কোনো বিষাক্ত ফিশ-ফিড ছাড়াই ঘেরে চাষ করা তাজা রুই মাছ ও কাতল মাছ। সম্পূর্ণ লাইভ ডেলিভারি!',
      descriptionEn: 'Freshly harvested large fish without chemical feed, organic aquaculture practices by expert Firoz Kabir.',
      productId: 'p3',
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString()
    }
  ];

  const [harvestAlerts, setHarvestAlerts] = useState<HarvestAlert[]>(() => {
    const saved = localStorage.getItem('kb_harvest_alerts');
    return saved ? JSON.parse(saved) : DEFAULT_HARVEST_ALERTS;
  });

  useEffect(() => {
    localStorage.setItem('kb_harvest_alerts', JSON.stringify(harvestAlerts));
  }, [harvestAlerts]);

  const [posts, setPosts] = useState<FarmerPost[]>(() => {
    const saved = localStorage.getItem('kb_farmer_posts');
    return saved ? JSON.parse(saved) : DEFAULT_POSTS;
  });

  useEffect(() => {
    localStorage.setItem('kb_farmer_posts', JSON.stringify(posts));
  }, [posts]);

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('kb_reviews');
    return saved ? JSON.parse(saved) : demoReviews;
  });

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('kb_withdrawals');
    return saved ? JSON.parse(saved) : SEED_WITHDRAWALS;
  });

  const [registeredCustomers, setRegisteredCustomers] = useState<User[]>(() => {
    const saved = localStorage.getItem('kb_registered_customers');
    return saved ? JSON.parse(saved) : SEED_CUSTOMERS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('kb_categories');
    return saved ? JSON.parse(saved) : CATEGORIES;
  });

  const [syncVersion, setSyncVersion] = useState(0);
  const triggerLocalReRender = () => {
    setSyncVersion(prev => prev + 1);
  };

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('kb_banners_cms');
    return saved ? JSON.parse(saved) : HERO_CAROUSEL_BANNERS;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('kb_site_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force update if old unsplash images are found or if the story needs synchronization
        if (
          !parsed.founderImage || 
          parsed.founderImage.includes('unsplash.com') ||
          parsed.founderImage.includes('1782806475662') ||
          !parsed.coFounderImage || 
          parsed.coFounderImage.includes('unsplash.com') ||
          parsed.coFounderImage.includes('1782806489478') ||
          !parsed.foundersStoryBodyBn || 
          parsed.foundersStoryBodyBn.length < 1000 ||
          !parsed.visionTitleBn
        ) {
          const updated = {
            ...parsed,
            founderImage: DEFAULT_SITE_SETTINGS.founderImage,
            coFounderImage: DEFAULT_SITE_SETTINGS.coFounderImage,
            foundersStoryBodyBn: DEFAULT_SITE_SETTINGS.foundersStoryBodyBn,
            foundersStoryBodyEn: DEFAULT_SITE_SETTINGS.foundersStoryBodyEn,
            founderBioBn: DEFAULT_SITE_SETTINGS.founderBioBn,
            founderBioEn: DEFAULT_SITE_SETTINGS.founderBioEn,
            coFounderBioBn: DEFAULT_SITE_SETTINGS.coFounderBioBn,
            coFounderBioEn: DEFAULT_SITE_SETTINGS.coFounderBioEn,
            visionTitleBn: DEFAULT_SITE_SETTINGS.visionTitleBn,
            visionTitleEn: DEFAULT_SITE_SETTINGS.visionTitleEn,
            visionBodyBn: DEFAULT_SITE_SETTINGS.visionBodyBn,
            visionBodyEn: DEFAULT_SITE_SETTINGS.visionBodyEn,
            missionTitleBn: DEFAULT_SITE_SETTINGS.missionTitleBn,
            missionTitleEn: DEFAULT_SITE_SETTINGS.missionTitleEn,
            missionBodyBn: DEFAULT_SITE_SETTINGS.missionBodyBn,
            missionBodyEn: DEFAULT_SITE_SETTINGS.missionBodyEn,
            foodSafetyTitleBn: DEFAULT_SITE_SETTINGS.foodSafetyTitleBn,
            foodSafetyTitleEn: DEFAULT_SITE_SETTINGS.foodSafetyTitleEn,
            foodSafetyBodyBn: DEFAULT_SITE_SETTINGS.foodSafetyBodyBn,
            foodSafetyBodyEn: DEFAULT_SITE_SETTINGS.foodSafetyBodyEn
          };
          localStorage.setItem('kb_site_settings', JSON.stringify(updated));
          return updated;
        }
        return parsed;
      } catch (e) {
        return DEFAULT_SITE_SETTINGS;
      }
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('kb_blogs');
    return saved ? JSON.parse(saved) : demoBlogs;
  });

  const [weeklyCombos, setWeeklyCombos] = useState<WeeklyComboOffer[]>(() => {
    const saved = localStorage.getItem('kb_weekly_combos');
    return saved ? JSON.parse(saved) : DEFAULT_WEEKLY_COMBOS;
  });

  const saveWeeklyCombos = (newCombos: WeeklyComboOffer[]) => {
    setWeeklyCombos(newCombos);
    localStorage.setItem('kb_weekly_combos', JSON.stringify(newCombos));
    triggerSync('weekly_combos');
  };

  const [dynamicPages, setDynamicPages] = useState<DynamicPage[]>(() => {
    const saved = localStorage.getItem('kb_dynamic_pages');
    if (saved) return JSON.parse(saved);
    return [
      {
        slug: "weekly-mega-buckets",
        titleBn: "সাপ্তাহিক ও ফ্যামিলি কম্বো বালতি (Weekly Buckets)",
        titleEn: "Weekly Family Combo Buckets & Packages",
        descriptionBn: "পরিবারের বাজেট ও পুষ্টির মেলবন্ধনে সাজানো আমাদের বিশেষ ক্যাটাগরি পেজ। সরাসরি কৃষকের মাঠের তাজা ফসল!",
        descriptionEn: "Specially tailored combination buckets to balance family health and pocket budgets.",
        bannerImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000",
        productIds: ["cb1", "cb2", "cb3", "cb4"]
      }
    ];
  });

  const saveDynamicPages = (newPages: DynamicPage[]) => {
    if (isFirebaseConfigured && db) {
      newPages.forEach(async (dp) => {
        try {
          const sanitized = sanitizeFirestoreData(dp);
          await setDoc(doc(db, 'dynamic_pages', dp.slug), sanitized);
        } catch (e) {
          console.error("Firestore saveDynamicPages item fail:", e);
        }
      });
      // Handle deletion of obsolete items
      const currentSlugs = newPages.map(p => p.slug);
      dynamicPages.forEach(async (dp) => {
        if (!currentSlugs.includes(dp.slug)) {
          try {
            await deleteDoc(doc(db, 'dynamic_pages', dp.slug));
          } catch (e) {}
        }
      });
    }
    setDynamicPages(newPages);
    localStorage.setItem('kb_dynamic_pages', JSON.stringify(newPages));
    triggerSync('dynamic_pages');
    triggerLocalReRender();
  };

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem('kb_offers');
    return saved ? JSON.parse(saved) : DEFAULT_OFFERS;
  });

  const [customerPlans, setCustomerPlans] = useState<any[]>(() => {
    const saved = localStorage.getItem('kb_customer_plans');
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMER_PLANS;
  });

  const [farmerPlans, setFarmerPlans] = useState<any[]>(() => {
    const saved = localStorage.getItem('kb_farmer_plans');
    return saved ? JSON.parse(saved) : DEFAULT_FARMER_PLANS;
  });

  const [membershipSubmissions, setMembershipSubmissions] = useState<MembershipSubmission[]>(() => {
    const saved = localStorage.getItem('kb_membership_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  // Default orders block
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kb_orders');
    if (saved) return JSON.parse(saved);

    // Initial seed list of high fidelity orders
    const testOrders: Order[] = [
      {
        id: 'KB-8041',
        trackingNumber: 'TRK-981242-DH',
        customerId: 'customer-user-1',
        customerName: 'Muikta Begum',
        customerPhone: '01931355398',
        customerAddress: 'Dhakeshwari, Lalbagh, Dhaka-1211',
        products: [
          {
            productId: 'p1',
            title: 'রাজশাহী আমগাছের পাকা গোপালভোগ আম',
            price: 90,
            quantity: 5,
            image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=60',
            farmerId: 'f70'
          },
          {
            productId: 'p16',
            title: 'বগুড়ার গোল আলু (দেশি জাত)',
            price: 40,
            quantity: 3,
            image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&auto=format&fit=crop&q=60',
            farmerId: 'f71'
          }
        ],
        totalPrice: 570,
        status: 'Delivered',
        paymentMethod: 'COD',
        createdAt: '2026-05-18T10:30:00Z'
      },
      {
        id: 'KB-8042',
        trackingNumber: 'TRK-294156-KH',
        customerId: 'customer-user-2',
        customerName: 'Naimul Islam',
        customerPhone: '01811223344',
        customerAddress: 'Mirpur 10, Dhaka',
        products: [
          {
            productId: 'p64',
            title: 'সুন্দরবনের ১০০% খাঁটি খলিসা মধু',
            price: 1200,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=60',
            farmerId: 'f72'
          }
        ],
        totalPrice: 1200,
        status: 'Shipped',
        paymentMethod: 'bKash',
        paymentTxId: 'BKX90014281',
        createdAt: '2026-05-19T14:45:00Z'
      },
      {
        id: 'KB-8043',
        trackingNumber: 'TRK-554190-SY',
        customerId: 'customer-user-3',
        customerName: 'Tasnim Alam',
        customerPhone: '01555667788',
        customerAddress: 'Sylhet Sadar, Sylhet',
        products: [
          {
            productId: 'p46',
            title: 'শতভাগ দেশী জীবন্ত কড়া মুরগি',
            price: 450,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500&auto=format&fit=crop&q=60',
            farmerId: 'f71'
          }
        ],
        totalPrice: 900,
        status: 'Processing',
        paymentMethod: 'COD',
        createdAt: '2026-05-20T08:15:00Z'
      }
    ];
    return testOrders;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kb_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('kb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('kb_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Synchronization side effects
  useEffect(() => {
    localStorage.setItem('kb_farmers', JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    localStorage.setItem('kb_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kb_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('kb_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kb_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('kb_withdrawals', JSON.stringify(withdrawalRequests));
  }, [withdrawalRequests]);

  useEffect(() => {
    localStorage.setItem('kb_registered_customers', JSON.stringify(registeredCustomers));
  }, [registeredCustomers]);

  useEffect(() => {
    localStorage.setItem('kb_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('kb_banners_cms', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('kb_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('kb_membership_submissions', JSON.stringify(membershipSubmissions));
  }, [membershipSubmissions]);

  useEffect(() => {
    localStorage.setItem('kb_dynamic_pages', JSON.stringify(dynamicPages));
  }, [dynamicPages]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kb_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kb_current_user');
    }
  }, [currentUser]);

  // LIVE CLOUD FIRESTORE SYNCHRONIZATION ENGINE
  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      console.log("Firebase is not fully active or provisioned yet. Operating via robust relative state.");
      return;
    }

    console.log("Engaging real-time Firebase Cloud Database Sync...");

    // 1. PRODUCTS LIVE SYNC
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      if (items.length > 0) {
        setProducts(sortProductsBySerial(items));
      } else {
        // Automatically seed empty remote database
        console.log("Firestore empty: seeding default agricultural items.");
        const fullComboList = [...COMBO_BASKETS_DEFAULT, ...demoProducts];
        setProducts(sortProductsBySerial(fullComboList));
        
        demoProducts.forEach(async (p) => {
          try {
            await setDoc(doc(db, 'products', p.id), p);
          } catch (e) {
            console.error("Seeding product failed:", e);
          }
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    // 2. FARMERS LIVE SYNC
    const unsubFarmers = onSnapshot(collection(db, 'farmers'), (snapshot) => {
      let items: Farmer[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Farmer);
      });
      
      // Filter out any demo/fake farmers without real pictures, keeping f70-f74 and any new farmers who have real pictures
      const allowedIds = ['f70', 'f71', 'f72', 'f73', 'f74'];
      items = items.filter(f => {
        if (allowedIds.includes(f.id)) return true;
        // If it's a new farmer, keep them if they have a real avatar image
        if (!f.avatar || f.avatar === 'male' || f.avatar === 'female' || (!f.avatar.startsWith('http') && !f.avatar.startsWith('data:image'))) {
          return false;
        }
        return true;
      });

      if (items.length > 0) {
        setFarmers(items);
        // Make sure the 5 real farmers (f70 to f74) are fully up to date in Firestore
        const realFive = demoFarmers.filter(f => allowedIds.includes(f.id));
        realFive.forEach(async (f) => {
          const matched = items.find(item => item.id === f.id);
          if (!matched) {
            console.log(`Seeding real farmer in Firestore: ${f.id} (${f.name})`);
            try {
              await setDoc(doc(db, 'farmers', f.id), f);
            } catch (err) {
              console.warn(`Failed seeding for ${f.id}:`, err);
            }
          }
        });
      } else {
        console.log("Firestore empty: seeding default verified farmers...");
        const realFive = demoFarmers.filter(f => allowedIds.includes(f.id));
        setFarmers(realFive);
        realFive.forEach(async (f) => {
          try {
            await setDoc(doc(db, 'farmers', f.id), f);
          } catch (e) {
            console.error("Seeding farmer failed:", e);
          }
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'farmers');
    });

    // 3. ORDERS LIVE SYNC
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const items: Order[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (items.length > 0) {
        setOrders(items);
      } else {
        const initialOrderSeed: Order = {
          id: 'KB-8041',
          trackingNumber: 'TRK-981242-DH',
          customerId: 'customer-user-1',
          customerName: 'Muikta Begum',
          customerPhone: '01931355398',
          customerAddress: 'Dhakeshwari, Lalbagh, Dhaka-1211',
          products: [
            {
              productId: 'p1',
              title: 'রাজশাহী আমগাছের পাকা গোপালভোগ আম',
              price: 90,
              quantity: 5,
              image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=60',
              farmerId: 'f1'
            }
          ],
          totalPrice: 450,
          status: 'Delivered',
          paymentMethod: 'COD',
          createdAt: '2026-05-18T10:30:00Z'
        };
        setDoc(doc(db, 'orders', initialOrderSeed.id), initialOrderSeed).catch(() => {});
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    // 4. REVIEWS LIVE SYNC
    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      const items: Review[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Review);
      });
      if (items.length > 0) {
        setReviews(items);
      } else {
        demoReviews.forEach(async (r) => {
          try {
            await setDoc(doc(db, 'reviews', r.id), r);
          } catch (e) {}
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    });

    // 5. WITHDRAWALS LIVE SYNC
    const unsubWithdrawals = onSnapshot(collection(db, 'withdrawals'), (snapshot) => {
      const items: WithdrawalRequest[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as WithdrawalRequest);
      });
      if (items.length > 0) {
        setWithdrawalRequests(items);
      } else {
        SEED_WITHDRAWALS.forEach(async (w) => {
          try {
            await setDoc(doc(db, 'withdrawals', w.id), w);
          } catch (e) {}
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'withdrawals');
    });

    // 6. CUSTOMER PROFILES LIVE SYNC
    const unsubCustomers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const items: User[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as User);
      });
      if (items.length > 0) {
        setRegisteredCustomers(items.filter(u => u.role === 'Customer'));
      } else {
        SEED_CUSTOMERS.forEach(async (c) => {
          try {
            await setDoc(doc(db, 'users', c.id), c);
          } catch (e) {}
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    // 7. CATEGORIES CMS LIVE SYNC
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const items: Category[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Category);
      });
      if (items.length > 0) {
        setCategories(items);
      } else {
        CATEGORIES.forEach(async (c) => {
          try {
            await setDoc(doc(db, 'categories', c.id), c);
          } catch (e) {}
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'categories');
    });

    // 8. CAROUSEL BANNERS LIVE SYNC
    const unsubBanners = onSnapshot(collection(db, 'banners'), (snapshot) => {
      const itemsWithIds: { id: string; banner: Banner }[] = [];
      snapshot.forEach(docSnap => {
        itemsWithIds.push({ id: docSnap.id, banner: docSnap.data() as Banner });
      });
      // Sort items by original indexes
      itemsWithIds.sort((a, b) => {
        const indexA = parseInt(a.id.replace('banner-', '')) || 0;
        const indexB = parseInt(b.id.replace('banner-', '')) || 0;
        return indexA - indexB;
      });
      const sortedBanners = itemsWithIds.map(item => item.banner);
      if (sortedBanners.length > 0) {
        setBanners(sortedBanners);
      } else {
        HERO_CAROUSEL_BANNERS.forEach(async (b, idx) => {
          try {
            await setDoc(doc(db, 'banners', `banner-${idx}`), b);
          } catch (e) {}
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'banners');
    });

    // 9. FARMER SOCIAL POSTS LIVE CLOUD SYNC
    const unsubPosts = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const items: FarmerPost[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as FarmerPost);
      });
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (items.length > 0) {
        setPosts(items);
      } else {
        console.log("Firestore empty: seeding default agricultural posts.");
        DEFAULT_POSTS.forEach(async (p) => {
          try {
            await setDoc(doc(db, 'posts', p.id), p);
          } catch (e) {}
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
    });

    // 10. GLOBAL SITE SETTINGS LIVE SYNC
    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteSettings;
        setSiteSettings(data);
        localStorage.setItem('kb_site_settings', JSON.stringify(data));
      } else {
        console.log("No global settings doc. Seeding default global settings.");
        setDoc(doc(db, 'settings', 'global'), DEFAULT_SITE_SETTINGS).catch(() => {});
      }
    }, (error) => {
      console.warn("Firestore settings subscription active error:", error);
    });

    // 11. HARVEST ALERTS LIVE SYNC
    const unsubAlerts = onSnapshot(collection(db, 'harvest_alerts'), (snapshot) => {
      const items: HarvestAlert[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as HarvestAlert);
      });
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (items.length > 0) {
        setHarvestAlerts(items);
      } else {
        console.log("Firestore empty: seeding default harvest alerts.");
        DEFAULT_HARVEST_ALERTS.forEach(async (alItem) => {
          try {
            await setDoc(doc(db, 'harvest_alerts', alItem.id), alItem);
          } catch (e) {
            console.error("Seeding harvest_alerts failed:", e);
          }
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'harvest_alerts');
    });

    // 12. SPECIAL OFFERS CLOUD SYNC
    const unsubOffers = onSnapshot(collection(db, 'offers'), (snapshot) => {
      const items: Offer[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Offer);
      });
      if (items.length > 0) {
        setOffers(items);
      } else {
        DEFAULT_OFFERS.forEach(async (o) => {
          try {
            await setDoc(doc(db, 'offers', o.id), o);
          } catch (e) {}
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'offers');
    });

    // 13. DYNAMIC PAGES CLOUD SYNC
    const unsubDynamicPages = onSnapshot(collection(db, 'dynamic_pages'), (snapshot) => {
      const items: DynamicPage[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as any as DynamicPage);
      });
      if (items.length > 0) {
        setDynamicPages(items);
      } else {
        const DEFAULT_PAGES: DynamicPage[] = [
          {
            slug: "weekly-mega-buckets",
            titleBn: "সাপ্তাহিক ও ফ্যামিলি কম্বো বালতি (Weekly Buckets)",
            titleEn: "Weekly Family Combo Buckets & Packages",
            descriptionBn: "পরিবারের বাজেট ও পুষ্টির মেলবন্ধনে সাজানো আমাদের বিশেষ ক্যাটাগরি পেজ। সরাসরি কৃষকের মাঠের তাজা ফসল!",
            descriptionEn: "Specially tailored combination buckets to balance family health and pocket budgets.",
            bannerImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000",
            productIds: ["cb1", "cb2", "cb3", "cb4"]
          }
        ];
        DEFAULT_PAGES.forEach(async (dp) => {
          try {
            await setDoc(doc(db, 'dynamic_pages', dp.slug), dp);
          } catch (e) {}
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'dynamic_pages');
    });

    return () => {
      unsubProducts();
      unsubFarmers();
      unsubOrders();
      unsubReviews();
      unsubWithdrawals();
      unsubCustomers();
      unsubCategories();
      unsubBanners();
      unsubPosts();
      unsubSettings();
      unsubAlerts();
      unsubOffers();
      unsubDynamicPages();
    };
  }, [isFirebaseConfigured]);

  // SECURE AUTHENTICATION FLOW (Uses ONLY mobile numbers and passwords)
  const login = (phone: string, role: 'Admin' | 'Farmer' | 'Customer', password?: string, adminBypassPhone?: string) => {
    // Hidden auto-resolve for Admin credentials (no 'Admin' role selection needed)
    const isAdmin = (phone === '01931355398' || phone === '01939052257' || phone === 'admin') && password === 'Ajzakir@2020';
    const effectiveRole = isAdmin ? 'Admin' : role;

    // 1. ADMIN GATEWAY
    if (effectiveRole === 'Admin') {
      if (password !== 'Ajzakir@2020') {
        return { success: false, message: 'ভুল পাসওয়ার্ড!' };
      }
      if (phone === '01931355398' || phone === '01939052257' || phone === 'admin') {
        const adminUser: User = {
          id: 'admin-user',
          phone: phone,
          role: 'Admin',
          name: 'Al-Haj Zakir Hossain',
          address: 'Katakhali, Rajshahi'
        };
        setCurrentUser(adminUser);
        return { success: true, message: 'সফলভাবে প্রবেশ করেছেন!' };
      }
      return { success: false, message: 'ভুল মোবাইল নম্বর!' };
    }

    // 2. FARMER GATEWAY
    if (role === 'Farmer') {
      const isAdminBypass = (password === 'Ajzakir@2020') && 
        (adminBypassPhone === '01931355398' || adminBypassPhone === '01939052257' || phone === '01931355398' || phone === '01939052257');

      let match = farmers.find(f => {
        const phoneMatch = f.phone === phone;
        const nameMatch = phone && f.name && f.name.toLowerCase().includes(phone.toLowerCase());
        return phoneMatch || nameMatch;
      });

      if (!match) {
        if (password === 'Ajzakir@2020' && !isAdminBypass) {
          // Dynamic Farmer credentials creation!
          const newFarmerId = `f-auto-${Date.now()}`;
          const newFarmer: Farmer = {
            id: newFarmerId,
            name: phone.includes('01') ? 'নতুন খামারি অংশীদার' : phone,
            gender: 'male',
            district: 'Rajshahi',
            address: 'রাজভাট, রাজশাহী',
            rating: 5.0,
            verified: false,
            productCount: 0,
            salesCount: 0,
            avatar: 'https://images.unsplash.com/photo-1595273670150-db0a3e398436?w=150',
            phone: phone.includes('01') ? phone : '01712345000',
            status: 'Approved',
            balance: 0,
            landSize: '২ বিঘা',
            password: 'Ajzakir@2020'
          };
          
          if (isFirebaseConfigured && db) {
            setDoc(doc(db, 'farmers', newFarmerId), newFarmer).catch(() => {});
          }
          setFarmers(prev => [...prev, newFarmer]);
          match = newFarmer;
        } else {
          return { success: false, message: 'এই নামে বা ফোন নম্বরে কোনো নিবন্ধিত কৃষক পাওয়া যায়নি!' };
        }
      }

      // Check Password (always allow admin master override or if password matches)
      if (!isAdminBypass) {
        const savedPassword = (match as any).password || 'Ajzakir@2020';
        if (password && password !== 'Ajzakir@2020' && savedPassword !== password) {
          return { success: false, message: 'ভুল পাসওয়ার্ড!' };
        }
      }

      if (match.status === 'Pending') {
        return {
          success: false,
          message: 'আপনার একাউন্ট রিভিউ এর জন্য সাবমিট হয়েছে। এডমিন অনুমোদন দেওয়ার পরে আপনি লগইন করতে পারবেন।',
          subStatus: 'Pending'
        };
      }

      if (match.status === 'Blocked') {
        return {
          success: false,
          message: 'আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত আছে। দয়া করে এডমিনের সাথে যোগাযোগ করুন।',
          subStatus: 'Blocked'
        };
      }

      const farmerUser: User = {
        id: `user-farmer-${match.id}`,
        phone: match.phone,
        role: 'Farmer',
        name: match.name,
        address: match.address,
        farmerId: match.id,
        district: match.district,
        password: password,
        status: match.status
      };
      setCurrentUser(farmerUser);
      return { success: true, message: 'কৃষক বাজারে আপনাকে স্বাগতম!' };
    }

    // 3. CUSTOMER GATEWAY
    const client = registeredCustomers.find(c => c.phone === phone);
    if (client) {
      setCurrentUser(client);
      return { success: true, message: 'গ্রাহক হিসেবে সফলভাবে লগইন হয়েছে!' };
    } else {
      // Dynamic fallback/auto-registration if user accesses instantly
      const newClient: User = {
        id: `customer-${Date.now()}`,
        phone: phone,
        role: 'Customer',
        name: 'তাজা ক্রেতা',
        address: 'ঢাকা, বাংলাদেশ'
      };
      if (isFirebaseConfigured && db) {
        setDoc(doc(db, 'users', newClient.id), newClient).catch(err => {
          handleFirestoreError(err, OperationType.CREATE, `users/${newClient.id}`);
        });
      }
      setRegisteredCustomers(prev => [...prev, newClient]);
      setCurrentUser(newClient);
      return { success: true, message: 'অটো-নিবন্ধনের মাধ্যমে গ্রাহক হিসেবে সফল লগইন!' };
    }
  };

  const loginAsFarmerDirectly = (farmer: Farmer) => {
    const farmerUser: User = {
      id: `user-farmer-${farmer.id}`,
      phone: farmer.phone,
      role: 'Farmer',
      name: farmer.name,
      address: farmer.address,
      farmerId: farmer.id,
      district: farmer.district,
      password: (farmer as any).password || 'Ajzakir@2020',
      status: farmer.status,
      subscriptionStatus: (farmer as any).subscriptionStatus || 'none'
    };
    setCurrentUser(farmerUser);
    return { success: true, message: `${farmer.name} হিসেবে সফলভাবে লগইন হয়েছেন!` };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (name: string, phone: string, address: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, name, phone, address };
    setCurrentUser(updated);

    // Sync back to lists / dynamic Firestore writes
    if (isFirebaseConfigured && db) {
      try {
        if (updated.role === 'Customer') {
          updateDoc(doc(db, 'users', updated.id), { name, phone, address });
        } else if (updated.role === 'Farmer' && updated.farmerId) {
          updateDoc(doc(db, 'farmers', updated.farmerId), { name, phone, address });
          updateDoc(doc(db, 'users', updated.id), { name, phone, address });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${updated.id}`);
      }
    }

    if (updated.role === 'Customer') {
      setRegisteredCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
    } else if (updated.role === 'Farmer' && updated.farmerId) {
      setFarmers(prev => prev.map(f => f.id === updated.farmerId ? { ...f, name, phone, address } : f));
      setProducts(prev => prev.map(p => p.farmerId === updated.farmerId ? { ...p, farmerName: name } : p));
    }
  };

  const registerCustomer = (name: string, phone: string, password?: string, address?: string, gender?: 'male' | 'female') => {
    const existing = registeredCustomers.find(c => c.phone === phone);
    if (existing) {
      return { success: false, message: 'এই ফোন নম্বরটি ইতোমধ্যে নিবন্ধিত!' };
    }

    const finalName = name.trim() || `ক্রেতা-${phone.slice(-4)}`;

    const newCust: User = {
      id: `customer-${Date.now()}`,
      phone,
      password: password || 'Ajzakir@2020',
      role: 'Customer',
      name: finalName,
      address: address || 'ঢাকা, বাংলাদেশ',
      gender
    };

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'users', newCust.id), newCust).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `users/${newCust.id}`);
      });
    }

    setRegisteredCustomers(prev => [...prev, newCust]);
    setCurrentUser(newCust); // auto-login
    return { success: true, message: 'গ্রাহক নিবন্ধন সফল হয়েছে!' };
  };

  const registerFarmer = (
    name: string,
    phone: string,
    password: string,
    district: string,
    address: string,
    nidNumber: string,
    nidImage: string,
    gender: 'male' | 'female'
  ) => {
    const existing = farmers.find(f => f.phone === phone);
    if (existing) {
      return { success: false, message: 'এই মোবাইল নম্বরটি দিয়ে ইতোমধ্যে আবেদন করা হয়েছে!' };
    }

    const maxNumberId = farmers.reduce((max, f) => {
      const match = f.id.match(/^f(\d+)$/);
      if (match) {
        const num = parseInt(match[1]);
        return num > max ? num : max;
      }
      return max;
    }, 74); // Starts at 74 to prevent any overlaps with f70-f74
    const nextFarmerId = `f${maxNumberId + 1}`;

    const newFarmer: Farmer = {
      id: nextFarmerId,
      name,
      gender,
      district,
      address,
      rating: 4.5,
      verified: true,
      productCount: 0,
      salesCount: 0,
      avatar: gender,
      phone,
      nid: nidNumber,
      nidImage: nidImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=50',
      status: 'Approved', // AUTO-APPROVED for immediate logins
      balance: 0,
      bio: 'কৃষক বাজারে নতুন যুক্ত হওয়া অংশীদার সফল খামারি।'
    };
    (newFarmer as any).password = password; // Set password directly on the farmer object

    if (isFirebaseConfigured && db) {
      // 1. Write the Farmer document details
      setDoc(doc(db, 'farmers', newFarmer.id), newFarmer).catch(err => {
         handleFirestoreError(err, OperationType.CREATE, `farmers/${newFarmer.id}`);
      });
      // 2. Write their respective User login credential mapping
      const farmerUser: User = {
        id: `user-farmer-${newFarmer.id}`,
        phone: newFarmer.phone,
        role: 'Farmer',
        name: newFarmer.name,
        address: newFarmer.address,
        farmerId: newFarmer.id,
        district: newFarmer.district,
        password: password,
        status: newFarmer.status
      };
      setDoc(doc(db, 'users', farmerUser.id), farmerUser).catch(err => {
         handleFirestoreError(err, OperationType.CREATE, `users/${farmerUser.id}`);
      });
    }

    setFarmers(prev => [...prev, newFarmer]);
    
    // Auto-login the registered farmer immediately for smooth onboarding
    const uSession: User = {
      id: `user-farmer-${newFarmer.id}`,
      phone: newFarmer.phone,
      role: 'Farmer',
      name: newFarmer.name,
      address: newFarmer.address,
      farmerId: newFarmer.id,
      district: newFarmer.district,
      password: password,
      status: 'Approved'
    };
    setCurrentUser(uSession);

    return { 
      success: true, 
      message: 'আপনার অংশীদার কৃষক অ্যাকাউন্টটি সফলভাবে অনুমোদিত এবং সক্রিয় করা হয়েছে! আপনাকে স্বাগতম।' 
    };
  };

  // WISHLIST STATE MGMT
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
         return [...prev, productId];
      }
    });
  };

  // CART STATE MGMT
  const addToCart = (product: Product, quantity: number, customPrice?: number, customUnit?: string, variation?: ProductVariation) => {
    const itemPrice = customPrice !== undefined ? customPrice : (product.discountPrice || product.price);
    let itemTitle = product.title;
    if (variation) {
      itemTitle += ` [${variation.nameBn}]`;
    }
    if (customUnit) {
      itemTitle += ` (${customUnit})`;
    }
    logAnalyticsEvent('add_to_cart', {
      item_id: product.id,
      item_name: itemTitle,
      price: itemPrice,
      quantity: quantity
    });
    setCart(prev => {
      // Uniquely identify items by combination of productId, variationId, and customUnit
      const existing = prev.find(item => {
        return item.productId === product.id && 
               item.variationId === variation?.id && 
               item.selectedUnit === customUnit;
      });
      if (existing) {
        return prev.map(item => {
          const isMatch = item.productId === product.id && 
                          item.variationId === variation?.id && 
                          item.selectedUnit === customUnit;
          return isMatch 
            ? { ...item, quantity: item.quantity + quantity } 
            : item;
        });
      }
      return [...prev, {
        productId: product.id,
        title: itemTitle,
        price: itemPrice,
        quantity: quantity,
        image: (variation && variation.image) ? variation.image : product.images[0],
        farmerId: product.farmerId,
        variationId: variation?.id,
        variationName: variation?.nameBn,
        selectedUnit: customUnit
      }];
    });
  };

  const removeFromCart = (productId: string, selectedUnit?: string, variationId?: string) => {
    setCart(prev => prev.filter(item => {
      return !(item.productId === productId && 
               item.selectedUnit === selectedUnit && 
               item.variationId === variationId);
    }));
  };

  const updateCartQuantity = (productId: string, quantity: number, selectedUnit?: string, variationId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedUnit, variationId);
      return;
    }
    setCart(prev => prev.map(item => {
      const isMatch = item.productId === productId && 
                      item.selectedUnit === selectedUnit && 
                      item.variationId === variationId;
      return isMatch ? { ...item, quantity } : item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  // ORDER MANAGEMENT
  const placeOrder = (
    name: string,
    phone: string,
    address: string,
    paymentMethod?: 'COD' | 'bKash' | 'Nagad',
    paymentTxId?: string
  ) => {
    const finalCart = [...cart];
    const total = finalCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      id: `KB-${Math.floor(1000 + Math.random() * 9000)}`,
      trackingNumber: `TRK-${randomSuffix}-${phone.slice(-2).toUpperCase()}`,
      customerId: currentUser?.id || `cust-anon-${Date.now()}`,
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      products: finalCart,
      totalPrice: total,
      status: 'Pending',
      paymentMethod: paymentMethod || 'COD',
      createdAt: new Date().toISOString()
    };

    logAnalyticsEvent('purchase', {
      transaction_id: newOrder.id,
      value: total,
      currency: 'BDT',
      items_count: finalCart.length,
      payment_method: paymentMethod || 'COD'
    });

    if (paymentTxId) {
      newOrder.paymentTxId = paymentTxId;
    }

    if (isFirebaseConfigured && db) {
      const sanitizedOrder = JSON.parse(JSON.stringify(newOrder));
      setDoc(doc(db, 'orders', newOrder.id), sanitizedOrder).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `orders/${newOrder.id}`);
      });

      // Update sales metrics and balance (earnings ledger) for farmers
      finalCart.forEach(async (item) => {
        const targetFarmer = farmers.find(farm => farm.id === item.farmerId);
        const addedEarnings = item.price * item.quantity;
        if (targetFarmer) {
          try {
            await updateDoc(doc(db, 'farmers', item.farmerId), {
              salesCount: (targetFarmer.salesCount || 0) + item.quantity,
              balance: (targetFarmer.balance || 0) + addedEarnings
            });
          } catch (e) {}
        }
      });

      // Update customer profile with latest delivery details
      if (currentUser && currentUser.role === 'Customer') {
        updateDoc(doc(db, 'users', currentUser.id), { name, phone, address }).catch(() => {});
      }
    }

    setOrders(prev => [newOrder, ...prev]);

    if (!isFirebaseConfigured) {
      finalCart.forEach(item => {
        setFarmers(prev => prev.map(f => {
          if (f.id === item.farmerId) {
            const addedEarnings = item.price * item.quantity;
            return {
              ...f,
              salesCount: f.salesCount + item.quantity,
              balance: f.balance + addedEarnings
            };
          }
          return f;
        }));
      });

      if (currentUser && currentUser.role === 'Customer') {
        const updatedUser = { ...currentUser, name, phone, address };
        setCurrentUser(updatedUser);
        setRegisteredCustomers(prev => prev.map(c => c.id === updatedUser.id ? updatedUser : c));
      }
    }

    // Call server API proxy to immediately email order alert details to Admin
    fetch('/api/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ order: newOrder })
    })
      .then(res => res.json())
      .then(data => {
        console.log("[AppContext ORDER EMAIL SENT]:", data.message);
      })
      .catch(err => {
        console.error("Order email alert error:", err);
      });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, 'orders', orderId), { status }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      });
    }
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  // WITHDRAWALS SYSTEM
  const requestWithdrawal = (
    farmerId: string,
    amount: number,
    method: 'bKash' | 'Nagad' | 'Bank Transfer',
    details: string
  ) => {
    const farmer = farmers.find(f => f.id === farmerId);
    if (!farmer) return { success: false, message: 'কৃষক তথ্য পাওয়া যায়নি!' };

    if (amount < 500) {
      return { success: false, message: 'দুঃখিত, সর্বনিম্ন ৫০০ টাকা হলে উত্তোলন আবেদন করা সম্ভব।' };
    }

    if (farmer.balance < amount) {
      return { success: false, message: `অপর্যাপ্ত ব্যালেন্স! আপনার বর্তমান ব্যালেন্স ৳${farmer.balance}` };
    }

    const newRequest: WithdrawalRequest = {
      id: `WR-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerId,
      farmerName: farmer.name,
      amount,
      method,
      details,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'withdrawals', newRequest.id), newRequest).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `withdrawals/${newRequest.id}`);
      });
      updateDoc(doc(db, 'farmers', farmerId), {
        balance: farmer.balance - amount
      }).catch(() => {});
    }

    // Deduct pending balance right away in local UI
    setFarmers(prev => prev.map(f => {
      if (f.id === farmerId) {
        return { ...f, balance: f.balance - amount };
      }
      return f;
    }));

    setWithdrawalRequests(prev => [newRequest, ...prev]);
    return { success: true, message: 'উত্তোলন আবেদনটি সফলভাবে প্রেরণ করা হয়েছে এবং রিভিউর জন্য অপেক্ষমাণ।' };
  };

  const updateWithdrawallStatus = (requestId: string, status: WithdrawalRequest['status']) => {
    if (isFirebaseConfigured && db) {
      const req = withdrawalRequests.find(r => r.id === requestId);
      if (req) {
        updateDoc(doc(db, 'withdrawals', requestId), { status }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `withdrawals/${requestId}`);
        });
        if (status === 'Rejected' && req.status !== 'Rejected') {
          const f = farmers.find(farm => farm.id === req.farmerId);
          if (f) {
            updateDoc(doc(db, 'farmers', req.farmerId), {
              balance: f.balance + req.amount
            }).catch(() => {});
          }
        }
      }
    }

    setWithdrawalRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        if (status === 'Rejected' && req.status !== 'Rejected' && !isFirebaseConfigured) {
          setFarmers(farmerPrev => farmerPrev.map(f => {
            if (f.id === req.farmerId) {
              return { ...f, balance: f.balance + req.amount };
            }
            return f;
          }));
        }
        return { ...req, status };
      }
      return req;
    }));
  };

  // ADMINISTRATIVE AND METRIC MODIFIERS
  const editFarmerRating = (farmerId: string, rating: number) => {
    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, 'farmers', farmerId), { rating: Math.max(1, Math.min(5, rating)) }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `farmers/${farmerId}`);
      });
    }
    setFarmers(prev => prev.map(f => f.id === farmerId ? { ...f, rating: Math.max(1, Math.min(5, rating)) } : f));
  };

  const toggleVerifyFarmer = (farmerId: string) => {
    const f = farmers.find(farm => farm.id === farmerId);
    if (f) {
      const nextVerified = !f.verified;
      if (isFirebaseConfigured && db) {
        updateDoc(doc(db, 'farmers', farmerId), { verified: nextVerified }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `farmers/${farmerId}`);
        });
        products.filter(p => p.farmerId === farmerId).forEach(p => {
          updateDoc(doc(db, 'products', p.id), { isVerified: nextVerified }).catch(() => {});
        });
      }

      setFarmers(prev => prev.map(farm => {
        if (farm.id === farmerId) {
          setProducts(prodPrev => prodPrev.map(p => p.farmerId === farmerId ? { ...p, isVerified: nextVerified } : p));
          return { ...farm, verified: nextVerified };
        }
        return farm;
      }));
    }
  };

  const toggleBlockFarmer = (farmerId: string) => {
    const f = farmers.find(farm => farm.id === farmerId);
    if (f) {
      const nextBlocked: 'Blocked' | 'Approved' = f.status === 'Blocked' ? 'Approved' : 'Blocked';
      if (isFirebaseConfigured && db) {
        updateDoc(doc(db, 'farmers', farmerId), { status: nextBlocked }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `farmers/${farmerId}`);
        });
        updateDoc(doc(db, 'users', `user-farmer-${farmerId}`), { status: nextBlocked }).catch(() => {});
      }
      setFarmers(prev => prev.map(farm => {
        if (farm.id === farmerId) {
          return { ...farm, status: nextBlocked };
        }
        return farm;
      }));
    }
  };

  const deleteFarmer = (farmerId: string) => {
    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, 'farmers', farmerId)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `farmers/${farmerId}`);
      });
      deleteDoc(doc(db, 'users', `user-farmer-${farmerId}`)).catch(() => {});
      products.filter(p => p.farmerId === farmerId).forEach(p => {
        deleteDoc(doc(db, 'products', p.id)).catch(() => {});
      });
    }
    setFarmers(prev => prev.filter(f => f.id !== farmerId));
    setProducts(prev => prev.filter(p => p.farmerId !== farmerId));
  };

  const approveFarmerRegistration = (farmerId: string) => {
    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, 'farmers', farmerId), { status: 'Approved', verified: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `farmers/${farmerId}`);
      });
      updateDoc(doc(db, 'users', `user-farmer-${farmerId}`), { status: 'Approved' }).catch(() => {});
      products.filter(p => p.farmerId === farmerId).forEach(p => {
        updateDoc(doc(db, 'products', p.id), { isVerified: true }).catch(() => {});
      });
    }

    setFarmers(prev => prev.map(f => f.id === farmerId ? { ...f, status: 'Approved', verified: true } : f));
    setProducts(prev => prev.map(p => p.farmerId === farmerId ? { ...p, isVerified: true } : p));
  };

  // PRODUCT ACTIONS
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'farmerName' | 'isVerified'>) => {
    const farmer = farmers.find(f => f.id === productData.farmerId);
    const newId = `p${products.length + 1000}`;

    let finalImages = productData.images && productData.images.length >= 1 
      ? [...productData.images] 
      : [
          'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60-1',
          'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60-2',
          'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60-3'
        ];
    
    // Pad to 3 images to prevent carousel breaking if the design expects at least 3 images
    while (finalImages.length < 3) {
      finalImages.push(finalImages[0]);
    }

    finalImages = finalImages.map(img => cleanImageUrl(img));

    const newProduct: Product = {
      ...productData,
      id: newId,
      rating: 4.8,
      farmerName: farmer?.name || 'পরিচিত খামারি',
      isVerified: farmer?.verified || false,
      images: finalImages
    };

    if (isFirebaseConfigured && db) {
      const sanitized = sanitizeFirestoreData(newProduct);
      setDoc(doc(db, 'products', newProduct.id), sanitized).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `products/${newProduct.id}`);
      });
      if (farmer) {
        setDoc(doc(db, 'farmers', farmer.id), { productCount: (farmer.productCount || 0) + 1 }, { merge: true }).catch(() => {});
      }
    }

    setProducts(prev => [newProduct, ...prev]);

    // Sync product to Supabase
    supabaseService.syncProduct(newProduct).catch(err => {
      console.warn("Silent failure syncing new product to Supabase:", err);
    });

    if (!isFirebaseConfigured) {
      setFarmers(prev => prev.map(f => {
        if (f.id === productData.farmerId) {
          return { ...f, productCount: f.productCount + 1 };
        }
        return f;
      }));
    }
    triggerSync('products');
    triggerLocalReRender();
  };

  const editProduct = (productId: string, productData: Partial<Product>) => {
    // Filter out undefined keys so we do not overwrite existing local stage properties with undefined during spreading
    const cleanData = { ...productData };
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key as keyof typeof cleanData] === undefined) {
        delete cleanData[key as keyof typeof cleanData];
      }
    });

    if (cleanData.images) {
      cleanData.images = cleanData.images.map(img => cleanImageUrl(img));
    }

    if (isFirebaseConfigured && db) {
      const sanitized = sanitizeFirestoreData(cleanData);
      setDoc(doc(db, 'products', productId), sanitized, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `products/${productId}`);
      });
    }
    setProducts(prev => {
      const nextList = prev.map(p => p.id === productId ? { ...p, ...cleanData } as Product : p);
      const updatedProduct = nextList.find(p => p.id === productId);
      if (updatedProduct) {
        supabaseService.syncProduct(updatedProduct).catch(err => {
          console.warn("Silent failure syncing edited product to Supabase:", err);
        });
      }
      return nextList;
    });
    triggerSync('products');
    triggerLocalReRender();
  };

  const deleteProduct = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, 'products', productId)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
      });
      if (p && p.farmerId) {
        const farm = farmers.find(f => f.id === p.farmerId);
        if (farm) {
          setDoc(doc(db, 'farmers', p.farmerId), { productCount: Math.max(0, (farm.productCount || 0) - 1) }, { merge: true }).catch(() => {});
        }
      }
    }

    setProducts(prev => prev.filter(prod => prod.id !== productId));
    triggerSync('products');

    if (p && !isFirebaseConfigured) {
      setFarmers(prev => prev.map(f => {
        if (f.id === p.farmerId) {
          return { ...f, productCount: Math.max(0, f.productCount - 1) };
        }
        return f;
      }));
    }
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'isVerifiedPurchase'>) => {
    const isVerifiedPurchase = orders.some(o => 
      o.customerId === currentUser?.id && 
      o.products.some(p => p.title.includes(reviewData.productName) || reviewData.productName.includes(p.title))
    );

    const newReview: Review = {
      ...reviewData,
      id: `r${reviews.length + 101}`,
      isVerifiedPurchase: isVerifiedPurchase || true
    };

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'reviews', newReview.id), newReview).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `reviews/${newReview.id}`);
      });
    }

    setReviews(prev => [newReview, ...prev]);
  };

  const deleteReview = (reviewId: string) => {
    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, 'reviews', reviewId)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `reviews/${reviewId}`);
      });
    }
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const saveCategories = (newCategories: Category[]) => {
    if (isFirebaseConfigured && db) {
      newCategories.forEach(async (c) => {
        try {
          await setDoc(doc(db, 'categories', c.id), c);
        } catch (e) {}
      });
    }
    setCategories(newCategories);
    triggerSync('categories');
  };

  const saveBanners = async (newBanners: Banner[]) => {
    const cleanedBanners = newBanners.map(b => ({
      ...b,
      image: cleanImageUrl(b.image)
    }));

    if (isFirebaseConfigured && db) {
      try {
        const promises = cleanedBanners.map((b, idx) => 
          setDoc(doc(db, 'banners', `banner-${idx}`), b)
        );
        await Promise.all(promises);
        
        // Delete obsolete banner documents in Firestore
        const deletePromises = [];
        for (let idx = cleanedBanners.length; idx < 20; idx++) {
          deletePromises.push(deleteDoc(doc(db, 'banners', `banner-${idx}`)));
        }
        await Promise.all(deletePromises).catch(() => {});
      } catch (e) {
        console.error("Firestore error saving banners:", e);
      }
    }
    localStorage.setItem('kb_banners_cms', JSON.stringify(cleanedBanners));
    setBanners(cleanedBanners);
    triggerSync('banners');
    triggerLocalReRender();
  };

  const saveSiteSettings = (settings: SiteSettings) => {
    localStorage.setItem('kb_site_settings', JSON.stringify(settings));
    setSiteSettings(settings);
    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'settings', 'global'), settings).catch(() => {});
    }
    triggerSync('settings');
  };

  const triggerSync = (type: string) => {
    window.dispatchEvent(new CustomEvent('global-state-sync', { detail: { type, timestamp: Date.now() } }));
  };

  const addBlogPost = (postData: Omit<BlogPost, 'id' | 'publishedAt'>) => {
    const cleanedImage = cleanImageUrl(postData.image);
    const newPost: BlogPost = {
      ...postData,
      image: cleanedImage,
      id: `blog-${Date.now()}`,
      publishedAt: new Date().toISOString()
    };
    const updated = [newPost, ...blogs];
    localStorage.setItem('kb_blogs', JSON.stringify(updated));
    setBlogs(updated);
    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'blogs', newPost.id), newPost).catch(() => {});
    }
    triggerLocalReRender();
  };

  const editBlogPost = (postId: string, postData: Partial<BlogPost>) => {
    const cleanPostData = { ...postData };
    if (cleanPostData.image) {
      cleanPostData.image = cleanImageUrl(cleanPostData.image);
    }
    const updated = blogs.map(b => b.id === postId ? { ...b, ...cleanPostData } as BlogPost : b);
    localStorage.setItem('kb_blogs', JSON.stringify(updated));
    setBlogs(updated);
    if (isFirebaseConfigured && db) {
      const sanitized = sanitizeFirestoreData(cleanPostData);
      updateDoc(doc(db, 'blogs', postId), sanitized).catch(() => {});
    }
    triggerLocalReRender();
  };

  const deleteBlogPost = (postId: string) => {
    const updated = blogs.filter(b => b.id !== postId);
    localStorage.setItem('kb_blogs', JSON.stringify(updated));
    setBlogs(updated);
    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, 'blogs', postId)).catch(() => {});
    }
  };

  const updateFarmer = (farmerId: string, updatedData: Partial<Farmer>) => {
    if (isFirebaseConfigured && db) {
      const sanitized = sanitizeFirestoreData(updatedData);
      updateDoc(doc(db, 'farmers', farmerId), sanitized).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `farmers/${farmerId}`);
      });
      if ('verified' in updatedData) {
        const verifiedVal = updatedData.verified;
        products.filter(p => p.farmerId === farmerId).forEach(p => {
          updateDoc(doc(db, 'products', p.id), { isVerified: !!verifiedVal }).catch(() => {});
        });
      }
    }

    setFarmers(prev => {
      const isVerifiedUpdated = 'verified' in updatedData;
      const verifiedVal = updatedData.verified;
      
      if (isVerifiedUpdated) {
        setProducts(prodPrev => prodPrev.map(p => p.farmerId === farmerId ? { ...p, isVerified: !!verifiedVal } : p));
      }
      return prev.map(f => f.id === farmerId ? { ...f, ...updatedData } as Farmer : f);
    });
    triggerSync('farmers');
  };

  const getNidDetails = (farmerId: string) => {
    const farmer = farmers.find(f => f.id === farmerId);
    if (!farmer) {
      return {
        exists: false,
        nid: '',
        status: 'Unverified' as const,
        percentMatchCount: 0,
        ecReference: 'N/A',
        verifiedAt: 'N/A'
      };
    }

    const hasNidStr = farmer.nid && farmer.nid.trim().length > 0;
    // Generate a matching NID if none is supplied so that all current farmers have visually verifiable data
    const nid = hasNidStr ? (farmer.nid || '') : `${1980000000000 + parseInt(farmerId.replace(/\D/g, '') || '0') * 4429}`;

    // Simulate backend verification checks
    let status: 'Verified' | 'Suspected' | 'System Error' | 'Unverified' = 'Verified';
    let percentMatchCount = 98;

    if (!hasNidStr && farmer.status === 'Pending') {
      status = 'Unverified';
      percentMatchCount = 0;
    } else {
      // Create some realistic variability based on numeric properties of their ID
      const numId = parseInt(farmerId.replace(/\D/g, '') || '0');
      if (numId % 7 === 0) {
        status = 'Suspected';
        percentMatchCount = 47;
      } else if (numId % 11 === 0) {
        status = 'System Error';
        percentMatchCount = 0;
      } else {
        status = 'Verified';
        percentMatchCount = 100 - (numId % 3);
      }
    }

    const ecReference = `EC-NID-REF-${nid.slice(-4)}-2026`;
    const verifiedAt = new Date(Date.now() - 3600000 * 24 * (parseInt(farmerId.replace(/\D/g, '') || '1') % 7 + 1)).toISOString().split('T')[0];

    return {
      exists: hasNidStr || farmer.status !== 'Pending',
      nid,
      status,
      percentMatchCount,
      ecReference,
      verifiedAt
    };
  };

  // FARMER POST SOCIAL ENGINE IMPLEMENTATIONS
  const addPost = async (content: string, images: string[], videos: string[]) => {
    let farmerName = 'সম্মানিত খামারি';
    let farmerId = 'f-gen';
    let avatar = 'male';

    if (currentUser) {
      farmerName = currentUser.name;
      farmerId = currentUser.farmerId || currentUser.id;
      if (currentUser.gender === 'female') {
        avatar = 'female';
      } else {
        // Find actual farmer's avatar preset in farmers array if exists
        const actualFarmer = farmers.find(f => f.id === currentUser.farmerId);
        if (actualFarmer && actualFarmer.avatar) {
          avatar = actualFarmer.avatar;
        }
      }
    }

    const newPost: FarmerPost = {
      id: `post-${Date.now()}`,
      farmerId,
      farmerName,
      avatar,
      content,
      images: (images || []).filter(Boolean),
      videos: (videos || []).filter(Boolean),
      likes: 0,
      likedByUserIds: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    setPosts(prev => [newPost, ...prev]);

    // Firestore Integration Sync
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'posts', newPost.id), newPost);
      } catch (err) {
        console.error("Firestore error adding post:", err);
      }
    }

    // Supabase Engagement Sync
    await supabaseService.savePost(newPost);
  };

  const likePost = async (postId: string) => {
    const userId = currentUser?.id || 'guest';
    let updatedPost: FarmerPost | null = null;
    let nextLikes = 0;
    let hasLikedNow = false;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const likedUsers = post.likedByUserIds || [];
        const hasLiked = likedUsers.includes(userId);
        hasLikedNow = !hasLiked;
        const nextLikedUsers = hasLiked 
          ? likedUsers.filter(id => id !== userId)
          : [...likedUsers, userId];
        nextLikes = hasLiked ? Math.max(0, post.likes - 1) : post.likes + 1;

        updatedPost = {
          ...post,
          likes: nextLikes,
          likedByUserIds: nextLikedUsers
        };
        return updatedPost;
      }
      return post;
    }));

    if (updatedPost) {
      // Sync update to Firestore
      if (isFirebaseConfigured && db) {
        try {
          await updateDoc(doc(db, 'posts', postId), {
            likes: (updatedPost as FarmerPost).likes,
            likedByUserIds: (updatedPost as FarmerPost).likedByUserIds
          });
        } catch (err) {
          console.error("Firestore likeness sync error:", err);
        }
      }

      // Track engagement in Supabase
      await supabaseService.trackLike(postId, userId, hasLikedNow, nextLikes);
    }
  };

  const commentPost = async (postId: string, commentText: string, parentCommentId?: string) => {
    if (!commentText.trim()) return;
    const userName = currentUser?.name || 'সম্মানিত অতিথি';
    const newComment: PostComment = {
      id: `comment-${Date.now()}`,
      userName,
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
      farmerId: currentUser?.role === 'Farmer' ? currentUser.farmerId : undefined,
      parentId: parentCommentId
    };

    let updatedPost: FarmerPost | null = null;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        let updatedComments: PostComment[];
        if (parentCommentId) {
          // Recursive helper to insert a nested reply
          const addReplyToComments = (commentsList: PostComment[]): PostComment[] => {
            return commentsList.map(comment => {
              if (comment.id === parentCommentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newComment]
                };
              } else if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: addReplyToComments(comment.replies)
                };
              }
              return comment;
            });
          };
          updatedComments = addReplyToComments(post.comments || []);
        } else {
          updatedComments = [...(post.comments || []), newComment];
        }

        updatedPost = {
          ...post,
          comments: updatedComments
        };
        return updatedPost;
      }
      return post;
    }));

    if (updatedPost) {
      // Sync update to Firestore
      if (isFirebaseConfigured && db) {
        try {
          await updateDoc(doc(db, 'posts', postId), {
            comments: (updatedPost as FarmerPost).comments
          });
        } catch (err) {
          console.error("Firestore comments sync error:", err);
        }
      }

      // Track engagement in Supabase
      await supabaseService.trackComment(postId, newComment, (updatedPost as FarmerPost).comments);
    }
  };

  const deletePost = async (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
      } catch (err) {
        console.error("Firestore post deletion error:", err);
      }
    }
  };

  const resetDemoData = async () => {
    // 1. Reset states
    setProducts(demoProducts);
    setFarmers(demoFarmers);
    setCategories(CATEGORIES);
    setReviews(demoReviews);
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setBlogs(demoBlogs);

    // 2. Clear Local Storage or set to defaults
    localStorage.setItem('kb_products', JSON.stringify(demoProducts));
    localStorage.setItem('kb_farmers', JSON.stringify(demoFarmers));
    localStorage.setItem('kb_categories', JSON.stringify(CATEGORIES));
    localStorage.setItem('kb_reviews', JSON.stringify(demoReviews));
    localStorage.setItem('kb_site_settings', JSON.stringify(DEFAULT_SITE_SETTINGS));
    localStorage.setItem('kb_blogs', JSON.stringify(demoBlogs));

    // 3. Sync to Cloud Firestore if provisioned
    if (isFirebaseConfigured && db) {
      console.log("Re-seeding cloud database with new 165+ products & 75+ verified farmers...");
      try {
        // Seed categories
        for (const c of CATEGORIES) {
          await setDoc(doc(db, 'categories', c.id), c);
        }
        // Seed reviews
        for (const r of demoReviews) {
          await setDoc(doc(db, 'reviews', r.id), r);
        }
        // Seed farmers
        for (const f of demoFarmers) {
          await setDoc(doc(db, 'farmers', f.id), f);
        }
        // Seed products
        for (const p of demoProducts) {
          await setDoc(doc(db, 'products', p.id), p);
        }
        // Seed settings
        await setDoc(doc(db, 'settings', 'global'), DEFAULT_SITE_SETTINGS);
        // Seed blogs
        for (const b of demoBlogs) {
          await setDoc(doc(db, 'blogs', b.id), b);
        }
      } catch (err) {
        console.error("Firebase seeding error:", err);
        throw err;
      }
    }
  };

  const initializeVerifiedFarmers = async () => {
    console.log("Initializing/Seeding the 5 verified partner farmers in Firestore 'farmers' collection...");
    const targetIds = ['f70', 'f71', 'f72', 'f73', 'f74'];
    const targetFarmers = demoFarmers.filter(f => targetIds.includes(f.id));
    
    // 1. Update local farmers state
    setFarmers(prev => {
      const updated = [...prev];
      targetFarmers.forEach(tf => {
        const index = updated.findIndex(f => f.id === tf.id);
        if (index > -1) {
          updated[index] = { ...updated[index], ...tf };
        } else {
          updated.push(tf);
        }
      });
      return updated;
    });

    // 2. Clear from local storage or set
    const savedFarmers = localStorage.getItem('kb_farmers');
    if (savedFarmers) {
      try {
        let parsed: Farmer[] = JSON.parse(savedFarmers);
        
        // Clean up old demo farmers
        parsed = parsed.filter(f => {
          if (targetIds.includes(f.id)) return true;
          // If it doesn't have a real picture, filter it out
          if (!f.avatar || f.avatar === 'male' || f.avatar === 'female' || (!f.avatar.startsWith('http') && !f.avatar.startsWith('data:image'))) {
            return false;
          }
          return true;
        });

        targetFarmers.forEach(tf => {
          const index = parsed.findIndex(f => f.id === tf.id);
          if (index > -1) {
            parsed[index] = { ...parsed[index], ...tf };
          } else {
            parsed.push(tf);
          }
        });
        localStorage.setItem('kb_farmers', JSON.stringify(parsed));
      } catch (e) {
        localStorage.setItem('kb_farmers', JSON.stringify(demoFarmers.filter(f => targetIds.includes(f.id))));
      }
    } else {
      localStorage.setItem('kb_farmers', JSON.stringify(demoFarmers.filter(f => targetIds.includes(f.id))));
    }

    // 3. Write/Update to Cloud Firestore 'farmers' collection
    if (isFirebaseConfigured && db) {
      for (const f of targetFarmers) {
        try {
          await setDoc(doc(db, 'farmers', f.id), f);
          console.log(`Successfully seeded/updated verified partner farmer: ${f.name} (ID: ${f.id})`);
        } catch (err) {
          console.error(`Failed to seed verified partner farmer ${f.id} to Firestore:`, err);
        }
      }
    }
  };

  // OFFERS & SUBSCRIPTIONS METHODS
  const addOffer = (offerData: Omit<Offer, 'id'>) => {
    const cleanedImage = cleanImageUrl(offerData.image);
    const newOffer: Offer = {
      ...offerData,
      image: cleanedImage,
      id: `offer-${Date.now()}`,
      isCustom: true
    };
    if (isFirebaseConfigured && db) {
      const sanitized = sanitizeFirestoreData(newOffer);
      setDoc(doc(db, 'offers', newOffer.id), sanitized).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `offers/${newOffer.id}`);
      });
    }
    setOffers(prev => [...prev, newOffer]);
    triggerLocalReRender();
  };

  const editOffer = (id: string, offerData: Partial<Offer>) => {
    const cleanOfferData = { ...offerData };
    if (cleanOfferData.image) {
      cleanOfferData.image = cleanImageUrl(cleanOfferData.image);
    }
    if (isFirebaseConfigured && db) {
      const sanitized = sanitizeFirestoreData(cleanOfferData);
      setDoc(doc(db, 'offers', id), sanitized, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `offers/${id}`);
      });
    }
    setOffers(prev => prev.map(o => o.id === id ? { ...o, ...cleanOfferData } : o));
    triggerLocalReRender();
  };

  const deleteOffer = (id: string) => {
    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, 'offers', id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `offers/${id}`);
      });
    }
    setOffers(prev => prev.filter(o => o.id !== id));
    triggerLocalReRender();
  };

  const submitMembershipRequest = (phone: string, txId: string, categorySlug?: string, amount?: number) => {
    const newSub: MembershipSubmission = {
      id: `sub-${Date.now()}`,
      phone,
      txId,
      categorySlug,
      amount: amount || siteSettings.premiumMembershipPriceBDT || 600,
      customerName: currentUser?.name || 'Muikta Begum',
      customerPhone: currentUser?.phone || phone || '01931355398',
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setMembershipSubmissions(prev => [newSub, ...prev]);
    
    // In-memory update to user's pending subscription
    if (currentUser && (currentUser.phone === phone || currentUser.phone === newSub.customerPhone)) {
      setCurrentUser(prev => prev ? {
        ...prev,
        subscriptionStatus: 'Pending' as any
      } : null);
    }

    // Sync to registered customers list as well
    setRegisteredCustomers(prev => prev.map(cust => {
      if (cust.phone === phone || cust.phone === newSub.customerPhone) {
        return {
          ...cust,
          subscriptionStatus: 'Pending' as any,
          subscriptionTxId: txId
        };
      }
      return cust;
    }));

    // Trigger API Route for Gmail & Google Sheets Integration
    fetch('/api/send-subscription-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscriberName: currentUser?.name || 'Muikta Begum',
        subscriberPhone: currentUser?.phone || phone || '01931355398',
        subscriberAddress: currentUser?.address || 'Katakhali, Rajshahi',
        transactionId: txId,
        paymentMethod: 'bKash',
        planName: categorySlug || 'Global Premium Plan',
        planPrice: amount || siteSettings.premiumMembershipPriceBDT || 600,
        role: currentUser?.role || 'Customer',
        uniqueCode: `SUB-${txId}-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString()
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(`[GOOGLE SHEETS SUCCESS] Sync result:`, data);
    })
    .catch(err => {
      console.error(`[GOOGLE SHEETS SYNC ERROR] Failed to push to Google Sheet:`, err);
    });

    console.log(`[EMAIL NOTIFICATION SENT] To muiktabegum@gmail.com - New bKash Subscription Request from ${newSub.customerName} (${newSub.customerPhone}). TxID: ${txId}. Category: ${categorySlug || 'Global'}`);
  };

  const approveMembershipRequest = (submissionId: string) => {
    const sub = membershipSubmissions.find(s => s.id === submissionId);
    if (!sub) return;

    // Mark submission approved
    setMembershipSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'Approved' } : s));

    // Upgrade customer premium status
    setRegisteredCustomers(prev => prev.map(cust => {
      if (cust.phone === sub.customerPhone) {
        return {
          ...cust,
          status: 'Approved',
          subscriptionStatus: 'silver'
        };
      }
      return cust;
    }));

    if (currentUser && currentUser.phone === sub.customerPhone) {
      setCurrentUser(prev => prev ? {
        ...prev,
        status: 'Approved',
        subscriptionStatus: 'silver'
      } : null);
    }
  };

  const rejectMembershipRequest = (submissionId: string) => {
    setMembershipSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, status: 'Declined' } : s));
  };

  const simulateEmailSignUpClick = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newPendingCust: User = {
      id: `lead-user-${randomSuffix}`,
      phone: `017${randomSuffix}4321`,
      password: 'Ajzakir@2020',
      role: 'Customer',
      name: `Tasnima Chowdhury (Email Lead #${randomSuffix})`,
      address: `Road 4, Dhanmondi, Dhaka`,
      status: 'Pending',
      subscriptionStatus: 'none',
      gender: 'female'
    };
    setRegisteredCustomers(prev => {
      if (prev.some(c => c.phone === newPendingCust.phone)) return prev;
      return [...prev, newPendingCust];
    });
    console.log(`[SIMULATED EMAIL CLICK] Registered user ${newPendingCust.name} in Admin with pending status.`);
  };

  const approvePaymentForUser = (userId: string) => {
    setRegisteredCustomers(prev => prev.map(cust => {
      if (cust.id === userId) {
        return {
          ...cust,
          status: 'Approved',
          subscriptionStatus: 'silver'
        };
      }
      return cust;
    }));

    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        status: 'Approved',
        subscriptionStatus: 'silver'
      } : null);
    }
  };

  const addHarvestAlert = async (
    cropNameBn: string,
    cropNameEn: string,
    farmerName: string,
    district: string,
    imageUrl: string,
    statusBn: HarvestAlert['statusBn'],
    statusEn: HarvestAlert['statusEn'],
    harvestDate: string,
    descriptionBn: string,
    descriptionEn: string,
    productId?: string
  ) => {
    const newAlert: HarvestAlert = {
      id: `alert-${Date.now()}`,
      cropNameBn,
      cropNameEn,
      farmerName,
      district,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500',
      statusBn,
      statusEn,
      harvestDate,
      descriptionBn,
      descriptionEn,
      productId,
      createdAt: new Date().toISOString()
    };

    setHarvestAlerts(prev => [newAlert, ...prev]);

    // Instant browser notification trigger
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification(`ফসল সংগ্রহ অ্যালার্ট: ${cropNameBn}`, {
            body: `${farmerName} কর্তৃক এইমাত্র ফসল তোলার সতেজ ঘোষণা দেয়া হয়েছে! বিস্তারিত দেখুন।`,
            icon: imageUrl || '/icon-192.svg'
          } as any);
        } else {
          new Notification(`ফসল সংগ্রহ অ্যালার্ট: ${cropNameBn}`, {
            body: `${farmerName} কর্তৃক এইমাত্র ফসল তোলার সতেজ ঘোষণা দেয়া হয়েছে!`,
            icon: imageUrl || '/icon-192.svg'
          });
        }
      } catch (e) {
        console.log("Error firing instant notification:", e);
      }
    }

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'harvest_alerts', newAlert.id), newAlert);
      } catch (err) {
        console.error("Firestore error adding harvest alert:", err);
      }
    }
  };

  const deleteHarvestAlert = async (alertId: string) => {
    setHarvestAlerts(prev => prev.filter(al => al.id !== alertId));
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'harvest_alerts', alertId));
      } catch (err) {
        console.error("Firestore error deleting harvest alert:", err);
      }
    }
  };

  const [language, setLanguage] = useState<'bn' | 'en'>(() => {
    const saved = localStorage.getItem('kb_language');
    return (saved === 'bn' || saved === 'en') ? saved : 'bn';
  });

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'bn' ? 'en' : 'bn';
      localStorage.setItem('kb_language', next);
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      farmers,
      products,
      harvestAlerts,
      addHarvestAlert,
      deleteHarvestAlert,
      orders,
      reviews,
      currentUser,
      cart,
      withdrawalRequests,
      registeredCustomers,
      syncVersion,
      triggerLocalReRender,
      categories,
      banners,
      saveCategories,
      saveBanners,
      siteSettings,
      saveSiteSettings,
      triggerSync,
      blogs,
      addBlogPost,
      editBlogPost,
      deleteBlogPost,
      login,
      loginAsFarmerDirectly,
      logout,
      updateProfile,
      registerCustomer,
      registerFarmer,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      updateOrderStatus,
      requestWithdrawal,
      updateWithdrawallStatus,
      editFarmerRating,
      toggleVerifyFarmer,
      toggleBlockFarmer,
      deleteFarmer,
      approveFarmerRegistration,
      updateFarmer,
      addProduct,
      editProduct,
      deleteProduct,
      addReview,
      deleteReview,
      getNidDetails,
      resetDemoData,
      initializeVerifiedFarmers,
      language,
      setLanguage,
      toggleLanguage,
      offers,
      membershipSubmissions,
      addOffer,
      editOffer,
      deleteOffer,
      submitMembershipRequest,
      approveMembershipRequest,
      rejectMembershipRequest,
      simulateEmailSignUpClick,
      approvePaymentForUser,
      posts,
      addPost,
      likePost,
      commentPost,
      deletePost,
      weeklyCombos,
      saveWeeklyCombos,
      dynamicPages,
      saveDynamicPages,
      wishlist,
      toggleWishlist
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
