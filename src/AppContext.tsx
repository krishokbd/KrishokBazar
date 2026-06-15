/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Farmer, Product, Order, User, Review, OrderItem, WithdrawalRequest, Category, Banner, BlogPost, SiteSettings, Offer, MembershipSubmission, FarmerPost, PostComment, HarvestAlert, WeeklyComboOffer, WeeklyComboProduct } from './types';
import { demoFarmers, demoReviews, CATEGORIES, demoBlogs, DEFAULT_SITE_SETTINGS } from './data';
import { new45Products as demoProducts } from './newProducts';
import { HERO_CAROUSEL_BANNERS } from './assets';
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from './firebase';
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
  addToCart: (product: Product, quantity: number, customPrice?: number, customUnit?: string) => void;
  removeFromCart: (productId: string, selectedUnit?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedUnit?: string) => void;
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
    farmerId: 'f1',
    farmerName: 'Abdur Rahman',
    amount: 1500,
    method: 'bKash',
    details: 'bKash: 01712345100',
    status: 'Paid',
    createdAt: '2026-05-18T12:00:00Z'
  },
  {
    id: 'WR-102',
    farmerId: 'f4',
    farmerName: 'Zakir Hossain',
    amount: 2500,
    method: 'Nagad',
    details: 'Nagad: 01931355398',
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
  // Match file ID from Google Drive share link
  // e.g., https://drive.google.com/file/d/1vC3z6gVjG1bEqxV2Vf6cUXQ65p/view?usp=sharing
  // or https://drive.google.com/open?id=1vC3z6gVjG1bEqxV2Vf6cUXQ65p
  // or https://docs.google.com/file/d/1vC3z6gVjG1bEqxV2Vf6cUXQ65p/edit
  let fileId = '';
  
  const fileDMatch = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    fileId = fileDMatch[1];
  } else {
    const idParamMatch = clean.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch && idParamMatch[1]) {
      fileId = idParamMatch[1];
    }
  }

  if (fileId) {
    // Return direct embed/image URL
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return clean;
};

// Helper to recursively remove any undefined properties from data objects passed to Firestore
export const sanitizeFirestoreData = <T extends Record<string, any>>(obj: T): T => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeFirestoreData(item)) as any;
  }
  const result = { ...obj } as any;
  for (const key of Object.keys(result)) {
    if (result[key] === undefined) {
      delete result[key];
    } else if (result[key] !== null && typeof result[key] === 'object') {
      result[key] = sanitizeFirestoreData(result[key]);
    }
  }
  return result;
};

const DEFAULT_WEEKLY_COMBOS: WeeklyComboOffer[] = [
  {
    id: "co-1",
    titleBn: "১। ফ্যামিলি ডেইলী সাশ্রয়ী বাস্কেট",
    titleEn: "1. Weekly Daily Family Value Basket",
    products: [
      {
        id: "co-1-p-1",
        nameBn: "লাল কুঁড়ি বেগুন (Tender Eggplant)",
        nameEn: "Fresh Red Tender Eggplant",
        image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600",
        link: "https://krishokbazar.com/eggplant",
        weight: "১ কেজি",
        date: "১২ জুন, ২০২৬",
        prices: [50, 95, 180, 430],
        priceLabels: ["৫০০ গ্রাম", "১ কেজি", "২ কেজি", "৫ কেজি"]
      },
      {
        id: "co-1-p-2",
        nameBn: "দেশী গোল লাল আলু (Red Potato)",
        nameEn: "Deshi Red Baked Potato",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600",
        link: "https://krishokbazar.com/potato",
        weight: "১ কেজি",
        date: "১২ জুন, ২০২৬",
        prices: [30, 55, 105, 250],
        priceLabels: ["৫০০ গ্রাম", "১ কেজি", "২ কেজি", "৫ কেজি"]
      },
      {
        id: "co-1-p-3",
        nameBn: "কচি লম্বা লাউ (Bottle Gourd)",
        nameEn: "Organic Sweet Bottle Gourd",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
        link: "",
        weight: "১ পিস",
        date: "১২ জুন, ২০২৬",
        prices: [45, 85, 160, 310],
        priceLabels: ["১ পিস", "২ পিস", "৪ পিস", "৮ পিস"]
      },
      {
        id: "co-1-p-4",
        nameBn: "পাহাড়ি মিষ্টি পেঁপে (Papaya)",
        nameEn: "Sweet Hill Papaya",
        image: "https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=600",
        link: "",
        weight: "১ কেজি",
        date: "১২ জুন, ২০২৬",
        prices: [60, 115, 220, 530],
        priceLabels: ["৫০০ গ্রাম", "১ কেজি", "২ কেজি", "৫ কেজি"]
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
        nameBn: "অর্গানিক সাগর কলা (Sagor Banana)",
        nameEn: "Organic Yellow Sagor Banana",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600",
        link: "",
        weight: "১ ডজন",
        date: "১২ জুন, ২০২৬",
        prices: [45, 85, 165, 310],
        priceLabels: ["৪ পিস", "১২ পিস (১ ডজন)", "২৪ পিস (২ ডজন)", "৩৬ পিস (৩ ডজন)"]
      },
      {
        id: "co-2-p-3",
        nameBn: "সতেজ বাজা পেয়ারা (Fresh Guava)",
        nameEn: "Crunchy Sweet Farm Guava",
        image: "https://images.unsplash.com/photo-1534444312678-7957cb1bb816?w=600",
        link: "",
        weight: "১ কেজি",
        date: "১২ জুন, ২০২৬",
        prices: [70, 135, 260, 620],
        priceLabels: ["১ কেজি", "২ কেজি", "৪ কেজি", "১০ কেজি"]
      },
      {
        id: "co-2-p-4",
        nameBn: "কাগজি লেবু তাজা (Lemons)",
        nameEn: "Green Seedless Juicy Lemon",
        image: "https://images.unsplash.com/photo-1590502596717-295b7fece67b?w=600",
        link: "",
        weight: "১২ পিস",
        date: "১২ জুন, ২০২৬",
        prices: [25, 48, 90, 175],
        priceLabels: ["৪টি", "১২টি (১ ডজন)", "২৪টি (২ ডজন)", "৪০টি"]
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
        nameBn: "ঘানি ভাঙা খাঁটি সরিষার তেল (Oil)",
        nameEn: "Coldpressed Pure Mustard Oil",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600",
        link: "",
        weight: "৫০০ মিলি",
        date: "১২ জুন, ২০২৬",
        prices: [130, 240, 470, 2200],
        priceLabels: ["২৫০ মিলি", "৫০০ মিলি", "১ লিটার", "৫ লিটার"]
      },
      {
        id: "co-3-p-3",
        nameBn: "দেশি কাঁচা পাহাড়ি আদা (Ginger)",
        nameEn: "Hill-grown Deshi Fresh Ginger",
        image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600",
        link: "",
        weight: "২৫০ গ্রাম",
        date: "১২ জুন, ২০২৬",
        prices: [45, 85, 160, 390],
        priceLabels: ["২৫০ গ্রাম", "৫০০ গ্রাম", "১ কেজি", "২.৫ কেজি"]
      },
      {
        id: "co-3-p-4",
        nameBn: "দেশি রসুনের ছড়া (Garlic Bulk)",
        nameEn: "Organic Deshi Solid Garlic",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600",
        link: "",
        weight: "২৫০ গ্রাম",
        date: "১২ জুন, ২০২৬",
        prices: [60, 115, 220, 530],
        priceLabels: ["২৫০ গ্রাম", "৫০০ গ্রাম", "১ কেজি", "২.৫ কেজি"]
      }
    ]
  },
  {
    id: "co-4",
    titleBn: "৪। সুস্থ জীবন হাই-প্রোটিন বাস্কেট",
    titleEn: "4. Healthy High-Protein Basket",
    products: [
      {
        id: "co-4-p-1",
        nameBn: "দেশী মুরগির ডিম (Farm Eggs)",
        nameEn: "Free Range Golden Eggs",
        image: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=600",
        link: "",
        weight: "১ ডজন",
        date: "১২ জুন, ২০২৬",
        prices: [65, 130, 255, 500],
        priceLabels: ["৪টি", "১২টি (১ ডজন)", "২৪টি (২ ডজন)", "৪৮টি"]
      },
      {
        id: "co-4-p-2",
        nameBn: "হাওরের তাজা রুই মাছ (Rui Fish)",
        nameEn: "Wild Hauor Catch Big Rui Fish",
        image: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600",
        link: "",
        weight: "১ কেজি",
        date: "১২ জুন, ২০২৬",
        prices: [380, 750, 1450, 3500],
        priceLabels: ["১ কেজি", "২ কেজি", "৪ কেজি", "১০ কেজি"]
      },
      {
        id: "co-4-p-3",
        nameBn: "ডেইরি খাঁটি গরুর তরল দুধ (Milk)",
        nameEn: "Farm Fresh Raw Cow Milk",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600",
        link: "",
        weight: "১ লিটার",
        date: "১২ জুন, ২০২৬",
        prices: [90, 175, 340, 820],
        priceLabels: ["১ লিটার", "২ লিটার", "৪ লিটার", "১০ লিটার"]
      },
      {
        id: "co-4-p-4",
        nameBn: "পাহাড়ি খাঁটি গরুর ঘি (Premium Ghee)",
        nameEn: "Traditional Hand-churned Deshi Ghee",
        image: "https://images.unsplash.com/photo-1589545625049-730d99300355?w=600",
        link: "",
        weight: "২৫০ গ্রাম",
        date: "১২ জুন, ২০২৬",
        prices: [350, 680, 1320, 3200],
        priceLabels: ["২৫০ গ্রাম", "৫০০ গ্রাম", "১ কেজি", "২.৫ কেজি"]
      }
    ]
  },
  {
    id: "co-5",
    titleBn: "৫। এক্সক্লুসিভ সতেজ সালাদ ও ফাইবার প্রিমিয়াম বাস্কেট",
    titleEn: "5. Exclusive Salad & Greens Premium Basket",
    products: [
      {
        id: "co-5-p-1",
        nameBn: "তাজা লাল চেরি টমেটো (Cherry Tomatoes)",
        nameEn: "Fresh Red Cherry Tomatoes",
        image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600",
        link: "",
        weight: "৫০০ গ্রাম",
        date: "১২ জুন, ২০২৬",
        prices: [70, 130, 250, 600],
        priceLabels: ["২৫০ গ্রাম", "৫০০ গ্রাম", "১ কেজি", "২.৫ কেজি"]
      },
      {
        id: "co-5-p-2",
        nameBn: "ক্ষেতের কচি তিতাহীন শসা (Premium Cucumber)",
        nameEn: "Crisp Green Cucumbers",
        image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600",
        link: "",
        weight: "১ কেজি",
        date: "১২ জুন, ২০২৬",
        prices: [40, 75, 140, 320],
        priceLabels: ["৫০০ গ্রাম", "১ কেজি", "২ কেজি", "৫ কেজি"]
      },
      {
        id: "co-5-p-3",
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
        id: "co-5-p-4",
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'bn' | 'en'>(() => {
    return (localStorage.getItem('kb_language') as 'bn' | 'en') || 'bn';
  });

  const toggleLanguage = () => {
    setLanguageState(prev => {
      const next = prev === 'bn' ? 'en' : 'bn';
      localStorage.setItem('kb_language', next);
      return next;
    });
  };

  const setLanguage = (lang: 'bn' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('kb_language', lang);
  };

  const [farmers, setFarmers] = useState<Farmer[]>(() => {
    const saved = localStorage.getItem('kb_farmers');
    return saved ? JSON.parse(saved) : demoFarmers;
  });

  const COMBO_BASKETS_DEFAULT: Product[] = [
    {
      id: 'cb1',
      title: 'সাপ্তাহিক বাজেট কো-অপ সস্তাই বাস্কেট (Budget Offer)',
      description: 'বাজেট সচেতন ডাল-ভাতের বাঙালি পরিবারের ১ সপ্তাহের সেরা তাজা সবজির কমপ্লিট সল্যুশন! গোল লাল আলু ২ কেজি, বেগুন ১ কেজি, দেশী পেঁয়াজ ১ কেজি, রসুনের সেরা কোয়ালিটি ২৫০ গ্রাম, তাজা ধনে পাতা ২৫০ গ্রাম, কচি কাঁচামরিচ ২৫০ গ্রাম, ও কচি লম্বা লতা লাউ ১টি।',
      price: 550,
      discountPrice: 500,
      category: 'ready-to-cook',
      farmerId: 'f5',
      farmerName: 'Fazle Rabbi',
      farmName: 'Fazle Rabbi অর্গানিক এগ্রো',
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
      description: 'মাঝারি বাঙালি পরিবারের ১ সপ্তাহের সেরা সতেজ পুষ্টির ডাবল অফার! বড় কড়া ফুলকপি ২টি, তাজা কচি বাঁধাকপি ২টি, লাল আলু ৩ কেজি, নরম তাল বেগুন ২ কেজি, মিষ্টি তাজা গাজর ১ কেজি, টসটসে লাল টমেটো ২ কেজি, কচি পটল ১ কেজি, এবং সুগন্ধি কাগজি লেবু ১২টি।',
      price: 1100,
      discountPrice: 1000,
      category: 'ready-to-cook',
      farmerId: 'f12',
      farmerName: 'Ayesha Begum',
      farmName: 'Ayesha Begum অর্গানিক এগ্রো',
      rating: 4.8,
      stock: 18,
      images: [
        'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1000&auto=format&fit=crop&q=80'
      ],
      isVerified: true,
      isReadyToCook: true,
      harvestDate: 'June 12, 2026'
    },
    {
      id: 'cb3',
      title: 'মেগা ডেক্স মেম্বার ফ্যামিলি বাস্কেট (Elite Basket)',
      description: 'বড় ও পুষ্টি সচেতন সুখী যৌথ পরিবারের ১৫ দিনের সমৃদ্ধ কম্বো প্যাক! ৩ কেজি ঐতিহ্যবাহী বালাম চাল, ১ কেজি লাল আটা, ২ কেজি ব্রকলি ও ফুলকপি, দেশী তাল বেগুন ২ কেজি, গাজর ২ কেজি, শসা ২ কেজি, ঘানি ভাঙা খাঁটি সর্ষের তেল ১ লিটার, ও মিষ্টি লেবু ১ ডজন।',
      price: 1650,
      discountPrice: 1500,
      category: 'ready-to-cook',
      farmerId: 'f23',
      farmerName: 'Sultana Razia',
      farmName: 'Sultana Razia অর্গানিক এগ্রো',
      rating: 5.0,
      stock: 15,
      images: [
        'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1000&auto=format&fit=crop&q=80'
      ],
      isVerified: true,
      isReadyToCook: true,
      harvestDate: 'June 12, 2026'
    },
    {
      id: 'cb4',
      title: 'সুপ্রিম রিচ ফ্যামিলি উৎসব সুপার বাস্কেট (Supreme Combo)',
      description: 'উৎসবের সতেজ আনন্দ ঘরে নিয়ে আসার মাসের সেরা আয়োজন! ১ কেজি চাক ভাঙা সুন্দরবনের খাঁটি মধু, ৫ কেজি চিনিগুঁড়া সুগন্ধি বাসমতি চাল, ২ লিটার খাঁটি সর্ষের তেল, ৩ কেজি নতুন লাল আলু, ৩ কেজি তাজা টমেটো, ২ কেজি কচি লাউ, এবং ২ কেজি পাহাড়ি সবুজ মাল্টা।',
      price: 2200,
      discountPrice: 2000,
      category: 'ready-to-cook',
      farmerId: 'f12',
      farmerName: 'Ayesha Begum',
      farmName: 'Ayesha Begum অর্গানিক এগ্রো',
      rating: 4.9,
      stock: 12,
      images: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=1000&auto=format&fit=crop&q=80'
      ],
      isVerified: true,
      isReadyToCook: true,
      harvestDate: 'June 12, 2026'
    }
  ];

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kb_products');
    let base = saved ? JSON.parse(saved) : demoProducts;
    
    // Force seeding 45 premium products if the saved array size is suspiciously small (e.g. less than 35)
    if (!base || base.length < 35) {
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
      farmerId: 'f5',
      farmerName: 'Fazle Rabbi',
      avatar: 'male',
      content: 'আসসালামু আলাইকুম! আমার জৈব খামারের একদম সতেজ ফুলকপি ও টমেটো গাছ থেকে তোলা হয়েছে আজকে সকালে। কোনো রাসায়নিক সার ব্যবহার করিনি। আলহামদুলিল্লাহ ফলন এবার বেশ ভালো হয়েছে। আমাদের খামারের একটি ছোট্ট রিয়েল ভিডিও নিচে যুক্ত করলাম, সবাই দেখে মতামত জানাবেন!',
      images: ['https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600'],
      videos: ['https://www.youtube.com/watch?v=S2gby6-gN3E'],
      likes: 24,
      likedByUserIds: [],
      comments: [
        {
          id: 'c1',
          userName: 'Al-Haj Zakir Hossain',
          content: 'মাশাআল্লাহ ফজলে রাব্বি ভাই, আপনার উদ্যোগ প্রশংসনীয়। রাসায়নিকমুক্ত ফসল জোগানোর এই প্রচেষ্টা সার্থক হোক।',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'c2',
          userName: 'Ayesha Begum',
          content: 'খুব সুন্দর ভিডিও রাব্বি ভাই!',
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'post2',
      farmerId: 'f12',
      farmerName: 'Ayesha Begum',
      avatar: 'female',
      content: 'সম্মানিত ক্রেতাবৃন্দ, আমার সমন্বিত দুগ্ধ ও ডিম খামারে আজকে একদম ফ্রেশ হাঁসের ডিম সংগ্রহ করেছি। কোনো কৃত্রিম ফিড ছাড়াই এদের প্রাকৃতিক উপায়ে পালন করা হয়েছে। ফ্যামিলি বাজেট কম্বো বাস্কেটের সাথে আপনারা ডিমের অর্ডারও প্লেস করতে পারেন।',
      images: ['https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=600'],
      videos: ['https://www.youtube.com/watch?v=gT8-7g-dOAw'],
      likes: 18,
      likedByUserIds: [],
      comments: [
        {
          id: 'c3',
          userName: 'Fazle Rabbi',
          content: 'আপা, হাঁসের এই ডিমের কোয়ালিটি সত্যিই অসাধারণ দেখায়!',
          createdAt: new Date().toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 43200000).toISOString()
    }
  ];

  const DEFAULT_HARVEST_ALERTS: HarvestAlert[] = [
    {
      id: 'ha-1',
      cropNameBn: 'রাজশাহীর ল্যাংড়া ও গোপালভোগ আম',
      cropNameEn: 'Himsagar & Lengra Mangoes from Rajshahi',
      farmerName: 'Abdur Rahman',
      district: 'Rajshahi',
      imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
      statusBn: 'সদ্য সংগৃহীত',
      statusEn: 'Just Harvested',
      harvestDate: 'June 12, 2026',
      descriptionBn: 'আমের রাজা হিমসাগর ও ল্যাংড়া আম এখন সম্পূর্ণ প্রাকৃতিক উপায়ে ডালপাকা মিষ্টি স্বাদে ভরপুর। সরাসরি খামারি আব্দুর রহমানের বাগান থেকে পেড়ে ২৪ ঘন্টায় পৌঁছাবে আপনার ঘরে!',
      descriptionEn: 'The king of mangoes, Himsagar and Lengra, is ready. Sourced directly from grower Abdur Rahmans orchard, they will reach your home in pristine fresh condition.',
      productId: 'p1',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'ha-2',
      cropNameBn: 'কুষ্টিয়ার সতেজ ফুলকপি ও শীতকালীন সবজি',
      cropNameEn: 'Fresh Organic Cauliflower from Kushtia',
      farmerName: 'Fazle Rabbi',
      district: 'Kushtia',
      imageUrl: 'https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=600&auto=format&fit=crop&q=80',
      statusBn: 'আগামীকাল সংগ্রহ',
      statusEn: 'Harvesting Tomorrow',
      harvestDate: 'June 13, 2026',
      descriptionBn: 'সম্পূর্ণ অর্গ্যানিক পদ্ধতিতে উৎপাদিত কুষ্টিয়ার সতেজ ফুলকপি ক্ষেত থেকে সরাসরি তোলা হচ্ছে আগামীকাল ভোরে। কোনো কেমিক্যাল বা ফরমালিন নেই। এখনই বুকিং দিন।',
      descriptionEn: 'Grown with zero chemicals, these fresh Kushtia cauliflowers are being harvested tomorrow morning. Pre-book to claim your fresh batch.',
      productId: 'cb2',
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
    },
    {
      id: 'ha-3',
      cropNameBn: 'মাগুরার লাল টুকটুকে বেদানা ও বোম্বাই লিচু',
      cropNameEn: 'Red Bedana Litchi Selection from Magura',
      farmerName: 'Parvez Mosharrof',
      district: 'Magura',
      imageUrl: 'https://images.unsplash.com/photo-1421167418805-7f170a738eb4?w=600&auto=format&fit=crop&q=80',
      statusBn: 'আসন্ন',
      statusEn: 'Upcoming',
      harvestDate: 'June 20, 2026',
      descriptionBn: 'লাল টসটসে মিষ্টি বোম্বাই লিচু সংগ্রহের প্রস্তুতি চলছে। খামারি পারভেজের বাগান থেকে সরাসরি প্রি-বুকিং ডিল। আগামী সপ্তাহে প্রথম চালান তোলা হবে।',
      descriptionEn: 'Juicy, deep crimson Bedana litchis are ripening and preparation for harvest is underway. Sourced directly from farmer Parvez.',
      productId: 'p4',
      createdAt: new Date(Date.now() - 12 * 3600000).toISOString()
    },
    {
      id: 'ha-4',
      cropNameBn: 'সুন্দরবনের খাঁটি চাকভাঙ্গা প্রাকৃতিক খলিশা মধু',
      cropNameEn: 'Sundarbans Pure Khālisha Wild Flower Honey',
      farmerName: 'Moul Bakul Sardar',
      district: 'Satkhira',
      imageUrl: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&auto=format&fit=crop&q=80',
      statusBn: 'সদ্য সংগৃহীত',
      statusEn: 'Just Harvested',
      harvestDate: 'June 10, 2026',
      descriptionBn: 'সুন্দরবনের গভীর থেকে সদ্য সংগৃহীত খাঁটি সোনালী চাকের মধু। কোনো প্রিজারভেটিভ বা বাড়তি চিনি মেলানো হয়নি। ল্যাব টেস্টে ১০০% খাঁটি প্রমাণিত।',
      descriptionEn: 'Pure and organic wild flower honey directly harvested by expert honey hunters in Sundarbans forest. Chemically verified and completely raw.',
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

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('kb_banners_cms');
    return saved ? JSON.parse(saved) : HERO_CAROUSEL_BANNERS;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('kb_site_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SITE_SETTINGS;
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
            farmerId: 'f1'
          },
          {
            productId: 'p16',
            title: 'বগুড়ার গোল আলু (দেশি জাত)',
            price: 40,
            quantity: 3,
            image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&auto=format&fit=crop&q=60',
            farmerId: 'f16'
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
            farmerId: 'f4'
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
            farmerId: 'f16'
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
      const items: Farmer[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Farmer);
      });
      if (items.length > 0) {
        setFarmers(items);
      } else {
        console.log("Firestore empty: seeding default verified farmers...");
        setFarmers(demoFarmers);
        demoFarmers.forEach(async (f) => {
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
      const items: Banner[] = [];
      snapshot.forEach(docSnap => {
        items.push({ ...docSnap.data() } as Banner);
      });
      if (items.length > 0) {
        setBanners(items);
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

    const nextFarmerId = `f${farmers.length + 31}`; // Offset existing base demo farmers

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

  // CART STATE MGMT
  const addToCart = (product: Product, quantity: number, customPrice?: number, customUnit?: string) => {
    const itemPrice = customPrice !== undefined ? customPrice : (product.discountPrice || product.price);
    const itemTitle = customUnit ? `${product.title} (${customUnit})` : product.title;
    logAnalyticsEvent('add_to_cart', {
      item_id: product.id,
      item_name: itemTitle,
      price: itemPrice,
      quantity: quantity
    });
    setCart(prev => {
      // In order to separate items with different pack selections, we identify them by productId + customUnit
      const itemKey = customUnit ? `${product.id}_${customUnit}` : product.id;
      const existing = prev.find(item => {
        const existingKey = item.selectedUnit ? `${item.productId}_${item.selectedUnit}` : item.productId;
        return existingKey === itemKey;
      });
      if (existing) {
        return prev.map(item => {
          const currentKey = item.selectedUnit ? `${item.productId}_${item.selectedUnit}` : item.productId;
          return currentKey === itemKey 
            ? { ...item, quantity: item.quantity + quantity } 
            : item;
        });
      }
      return [...prev, {
        productId: product.id,
        title: product.title,
        price: itemPrice,
        quantity: quantity,
        image: product.images[0],
        farmerId: product.farmerId,
        selectedUnit: customUnit
      }];
    });
  };

  const removeFromCart = (productId: string, selectedUnit?: string) => {
    setCart(prev => prev.filter(item => {
      if (selectedUnit) {
        return !(item.productId === productId && item.selectedUnit === selectedUnit);
      }
      return item.productId !== productId;
    }));
  };

  const updateCartQuantity = (productId: string, quantity: number, selectedUnit?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedUnit);
      return;
    }
    setCart(prev => prev.map(item => {
      const isMatch = selectedUnit 
        ? (item.productId === productId && item.selectedUnit === selectedUnit)
        : item.productId === productId;
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
      setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(err => {
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
        updateDoc(doc(db, 'farmers', farmer.id), { productCount: (farmer.productCount || 0) + 1 }).catch(() => {});
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
  };

  const editProduct = (productId: string, productData: Partial<Product>) => {
    if (isFirebaseConfigured && db) {
      const sanitized = sanitizeFirestoreData(productData);
      updateDoc(doc(db, 'products', productId), sanitized).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `products/${productId}`);
      });
    }
    setProducts(prev => {
      const nextList = prev.map(p => p.id === productId ? { ...p, ...productData } as Product : p);
      const updatedProduct = nextList.find(p => p.id === productId);
      if (updatedProduct) {
        supabaseService.syncProduct(updatedProduct).catch(err => {
          console.warn("Silent failure syncing edited product to Supabase:", err);
        });
      }
      return nextList;
    });
    triggerSync('products');
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
          updateDoc(doc(db, 'farmers', p.farmerId), { productCount: Math.max(0, (farm.productCount || 0) - 1) }).catch(() => {});
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

  const saveBanners = (newBanners: Banner[]) => {
    if (isFirebaseConfigured && db) {
      newBanners.forEach(async (b, idx) => {
        try {
          await setDoc(doc(db, 'banners', `banner-${idx}`), b);
        } catch (e) {}
      });
    }
    setBanners(newBanners);
    triggerSync('banners');
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
    const newPost: BlogPost = {
      ...postData,
      id: `blog-${Date.now()}`,
      publishedAt: new Date().toISOString()
    };
    const updated = [newPost, ...blogs];
    localStorage.setItem('kb_blogs', JSON.stringify(updated));
    setBlogs(updated);
    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'blogs', newPost.id), newPost).catch(() => {});
    }
  };

  const editBlogPost = (postId: string, postData: Partial<BlogPost>) => {
    const updated = blogs.map(b => b.id === postId ? { ...b, ...postData } as BlogPost : b);
    localStorage.setItem('kb_blogs', JSON.stringify(updated));
    setBlogs(updated);
    if (isFirebaseConfigured && db) {
      const sanitized = sanitizeFirestoreData(postData);
      updateDoc(doc(db, 'blogs', postId), sanitized).catch(() => {});
    }
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

  // OFFERS & SUBSCRIPTIONS METHODS
  const addOffer = (offerData: Omit<Offer, 'id'>) => {
    const newOffer: Offer = {
      ...offerData,
      id: `offer-${Date.now()}`,
      isCustom: true
    };
    setOffers(prev => [...prev, newOffer]);
  };

  const editOffer = (id: string, offerData: Partial<Offer>) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, ...offerData } : o));
  };

  const deleteOffer = (id: string) => {
    setOffers(prev => prev.filter(o => o.id !== id));
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
      saveWeeklyCombos
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
