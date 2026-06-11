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
  youtubeVideos?: string[]; // Multiple farm physical video links
  landSize?: string;
  salesAmount?: number;
  isActive?: boolean;
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
  approved?: boolean; // When farmer uploads, starts as false, requires Admin approval
  uploaderRole?: 'Admin' | 'Farmer';
  harvestDate?: string;
  farmName?: string;
  unit?: string; // unit of measure e.g. kg, piece, 500g
  isActive?: boolean;
  googleDriveFolderUrl?: string;
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
  subscriptionStatus?: 'none' | 'silver' | 'gold' | 'platinum' | 'farmer_partner';
  subscriptionExpiry?: string;
  gender?: 'male' | 'female';
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
  isActive?: boolean;
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
  paymentBankAccount: string;
  paymentBankName: string;
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
  premiumMembershipPriceUSD: number;
  premiumMembershipPriceBDT: number;
  premiumFreeDeliveryActive: boolean;
  premiumReadyToCookOptionActive: boolean;
}

export interface Offer {
  id: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  ctaBn: string;
  ctaEn: string;
  tagBn: string;
  tagEn: string;
  image: string;
  categorySlug?: string;
  isCustom?: boolean;
}

export interface MembershipSubmission {
  id: string;
  phone: string;
  txId: string;
  categorySlug?: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  status: 'Pending' | 'Approved' | 'Declined';
  createdAt: string;
}

export const getFormattedUnit = (product: { unit?: string; title: string }, lang: 'bn' | 'en' = 'bn'): string => {
  const u = product.unit ? product.unit.toLowerCase().trim() : '';
  
  if (lang === 'bn') {
    if (u === 'kg') return 'কেজি';
    if (u === 'piece' || u === 'pcs' || u === 'pc') return 'পিস';
    if (u === 'bundle') return 'আঁটি';
    if (u === 'dozen') return 'ডজন';
    if (u === 'pair') return 'জোড়া';
    if (u === 'box') return 'বক্স';
    if (u.includes('pcs') || u.includes('pc') || u.includes('টি')) {
      return u.replace('pcs', 'টি').replace('pc', 'টি').replace(' pcs', 'টি').replace(' pc', 'টি');
    }
    
    // Convert numbers to Bangla
    let bnUnit = u
      .replace(/0/g, '০')
      .replace(/1/g, '১')
      .replace(/2/g, '২')
      .replace(/3/g, '৩')
      .replace(/4/g, '৪')
      .replace(/5/g, '৫')
      .replace(/6/g, '৬')
      .replace(/7/g, '৭')
      .replace(/8/g, '৮')
      .replace(/9/g, '৯')
      .replace('g', 'গ্রাম');
    if (bnUnit) return bnUnit;

    const t = product.title;
    if (t.includes('পিস') || t.includes('টি') || t.includes('জোড়া') || t.includes('box')) {
      return 'পিস';
    }
    return 'কেজি';
  } else {
    // English
    if (u === 'kg') return 'kg';
    if (u === 'piece' || u === 'pcs' || u === 'pc') return 'pc';
    if (u === 'bundle') return 'bundle';
    if (u === 'dozen') return 'dozen';
    if (u === 'pair') return 'pair';
    if (u === 'box') return 'box';
    if (u) return u;
    
    const t = product.title;
    if (t.includes('পিস') || t.includes('টি') || t.includes('জোড়া') || t.includes('box')) {
      return 'pc';
    }
    return 'kg';
  }
};

export interface PostComment {
  id: string;
  userName: string;
  content: string;
  createdAt: string;
  farmerId?: string; // If commented by a farmer
  replies?: PostComment[]; // Supported nested replies
  parentId?: string; // Track parent comment ID
}

export interface FarmerPost {
  id: string;
  farmerId: string;
  farmerName: string;
  avatar: string;
  content: string;
  images: string[]; // Multiple photos/links
  videos: string[]; // Multiple YouTube links
  likes: number;
  likedByUserIds?: string[];
  comments: PostComment[];
  createdAt: string;
}



