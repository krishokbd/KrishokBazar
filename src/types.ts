/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Farmer {
  id: string;
  name: string;
  gender: 'male' | 'female';
  district: string;
  address: string;
  rating: number;
  verified: boolean;
  productCount: number;
  salesCount: number;
  avatar: string; // "male" or "female" preset, or string URL
  phone: string;
  bio?: string;
  nid?: string;
  nidImage?: string;
  status: 'Pending' | 'Approved' | 'Blocked';
  balance: number; // Earnings balance
  farmLogo?: string;
  farmType?: string;
  story?: string;
  gallery?: string[];
  videoPlaceholder?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  farmerId: string;
  farmerName: string;
  rating: number;
  stock: number;
  images: string[]; // 3 to 5 images
  isVerified: boolean;
  isReadyToCook: boolean;
  isFeatured?: boolean;
  harvestDate?: string;
  farmName?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  farmerId: string;
}

export interface Order {
  id: string;
  trackingNumber: string; // Real courier-ready tracking number
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  products: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Out for delivery' | 'Delivered';
  paymentMethod: 'COD' | 'bKash' | 'Nagad';
  paymentTxId?: string;
  createdAt: string;
}

export interface User {
  id: string;
  phone: string;
  password?: string; // local simulation of password auth
  role: 'Admin' | 'Farmer' | 'Customer';
  name: string;
  address: string;
  farmerId?: string; // Linked farmer ID if role is 'Farmer'
  district?: string;
  status?: 'Pending' | 'Approved' | 'Blocked';
  nid?: string;
  nidImage?: string;
  email?: string; // kept for backwards compatibility
}

export interface Review {
  id: string;
  customerName: string;
  avatar: string; // URL or preset initials
  rating: number;
  comment: string;
  productName: string;
  location: string;
  isVerifiedPurchase: boolean;
}

export interface WithdrawalRequest {
  id: string;
  farmerId: string;
  farmerName: string;
  amount: number;
  method: 'bKash' | 'Nagad' | 'Bank Transfer';
  details: string; // e.g. bKash number or bank account detail
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
  createdAt: string;
}

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  icon: string;
}

export interface Banner {
  image: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown supported
  image: string;
  author: string;
  publishedAt: string;
  category: string;
  tags?: string[];
}

export interface SiteSettings {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  googleAnalyticsId: string;
  socialFacebook: string;
  socialYoutube: string;
  socialTwitter: string;
  socialInstagram: string;
  paymentBkashNumber: string;
  paymentNagadNumber: string;
  paymentCodActive: boolean;
  deliveryChargeDhaka: number;
  deliveryChargeOutside: number;
  deliveryFreeThreshold: number;
  storyTitleBn: string;
  storyTitleEn: string;
  storySubtitleBn: string;
  storySubtitleEn: string;
  storyChallengeTitleBn: string;
  storyChallengeTextBn: string;
  storyModelTitleBn: string;
  storyModelTextBn: string;
  storyPillar1Title: string;
  storyPillar1Text: string;
  storyPillar2Title: string;
  storyPillar2Text: string;
  storyPillar3Title: string;
  storyPillar3Text: string;
  storyPillar4Title: string;
  storyPillar4Text: string;
  headerWelcomeBn: string;
  headerWelcomeEn: string;
  footerCopyrightBn: string;
  footerCopyrightEn: string;
  footerPhone: string;
  footerEmail: string;
  footerAddressBn: string;
}
