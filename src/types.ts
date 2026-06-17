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
  password?: string;
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
  isWeeklyCombo?: boolean;
  approved?: boolean; // When farmer uploads, starts as false, requires Admin approval
  uploaderRole?: 'Admin' | 'Farmer';
  harvestDate?: string;
  farmName?: string;
  unit?: string; // unit of measure e.g. kg, piece, 500g
  unitType?: string; // custom unit type e.g. packet, dozen, kg
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
  badgeBn?: string;
  badgeEn?: string;
  btn1TextBn?: string;
  btn1TextEn?: string;
  btn1Link?: string;
  btn2TextBn?: string;
  btn2TextEn?: string;
  btn2Link?: string;
  btn3TextBn?: string;
  btn3TextEn?: string;
  btn3Link?: string;
  bgColorTint?: string;
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
  sectionComboTitleBn?: string;
  sectionComboSubtitleBn?: string;
  sectionMarketTitleBn?: string;
  sectionMarketSubtitleBn?: string;
  sectionCategoriesTitleBn?: string;
  sectionCategoriesSubtitleBn?: string;
  whatsappContactNumber?: string;
  primaryBrandColor?: string;
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
  link?: string;
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

export interface HarvestAlert {
  id: string;
  cropNameBn: string;
  cropNameEn: string;
  farmerName: string;
  district: string;
  imageUrl: string;
  statusBn: 'সদ্য সংগৃহীত' | 'আগামীকাল সংগ্রহ' | 'আসন্ন';
  statusEn: 'Just Harvested' | 'Harvesting Tomorrow' | 'Upcoming';
  harvestDate: string;
  descriptionBn: string;
  descriptionEn: string;
  productId?: string; // Optional linked product
  createdAt: string;
}export interface WeeklyComboProduct {
  id: string;
  nameBn: string;
  nameEn: string;
  image: string;
  link?: string;
  weight: string;
  date: string;
  prices: number[]; // exactly 4 prices
  priceLabels: string[]; // exactly 4 labels/units
}

export interface WeeklyComboOffer {
  id: string;
  titleBn: string;
  titleEn: string;
  products: WeeklyComboProduct[];
}

export const toBanglaDigits = (num: number | string): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (w) => banglaDigits[+w]);
};

export interface PackOption {
  id: string;
  labelBn: string;
  labelEn: string;
  multiplier: number;
}

export function getProductPackOptions(product: { unit?: string }): PackOption[] {
  const unit = (product.unit || 'kg').toLowerCase().trim();
  
  // 1. Piece-based categories
  if (['piece', 'pcs', 'pc', 'টি', 'piece/পিস', 'পিস'].includes(unit)) {
    return [
      { id: '1pc', labelBn: '১ টি', labelEn: '1 Pc', multiplier: 1 },
      { id: '5pcs', labelBn: '৫ টি', labelEn: '5 Pcs', multiplier: 5 },
      { id: '10pcs', labelBn: '১০ টি', labelEn: '10 Pcs', multiplier: 10 }
    ];
  }

  // 2. Dozen or Hali based
  if (unit.includes('dozen') || unit.includes('ডজন') || unit.includes('হালি')) {
    const isHali = unit.includes('হালি');
    const labelBnSingle = isHali ? 'হালি' : 'ডজন';
    const labelEnSingle = isHali ? 'Hali' : 'Dozen';
    return [
      { id: 'half', labelBn: `হাফ ${labelBnSingle}`, labelEn: `Half ${labelEnSingle}`, multiplier: 0.5 },
      { id: '1', labelBn: `১ ${labelBnSingle}`, labelEn: `1 ${labelEnSingle}`, multiplier: 1 },
      { id: '2', labelBn: `২ ${labelBnSingle}`, labelEn: `2 ${labelEnSingle}`, multiplier: 2 }
    ];
  }

  // 3. Packet / Pack based
  if (unit.includes('packet') || unit.includes('প্যাকেট') || unit.includes('pack') || unit.includes('প্যাক') || unit.includes('pkt')) {
    return [
      { id: '1pkt', labelBn: '১ প্যাকেট', labelEn: '1 Packet', multiplier: 1 },
      { id: '2pkts', labelBn: '২ প্যাকেট', labelEn: '2 Packets', multiplier: 2 },
      { id: '5pkts', labelBn: '৫ প্যাকেট', labelEn: '5 Packets', multiplier: 5 }
    ];
  }

  // 4. Box based
  if (unit.includes('box') || unit.includes('বক্স')) {
    return [
      { id: '1box', labelBn: '১ বক্স', labelEn: '1 Box', multiplier: 1 },
      { id: '2box', labelBn: '২ বক্স', labelEn: '2 Boxes', multiplier: 2 },
      { id: '5box', labelBn: '৫ বক্স', labelEn: '5 Boxes', multiplier: 5 }
    ];
  }

  // 5. Bottle or Jar based
  if (unit.includes('bottle') || unit.includes('বোতল') || unit.includes('jar') || unit.includes('বয়াম')) {
    const isJar = unit.includes('jar') || unit.includes('বয়াম');
    const labelBnCap = isJar ? 'বয়াম' : 'বোতল';
    const labelEnCap = isJar ? 'Jar' : 'Bottle';
    return [
      { id: '1unit', labelBn: `১ ${labelBnCap}`, labelEn: `1 ${labelEnCap}`, multiplier: 1 },
      { id: '2units', labelBn: `২ ${labelBnCap}`, labelEn: `2 ${labelEnCap}`, multiplier: 2 },
      { id: '5units', labelBn: `৫ ${labelBnCap}`, labelEn: `5 ${labelEnCap}`, multiplier: 5 }
    ];
  }

  // 6. Any other custom unit (e.g., "মণ", "সের", "লিটার", etc.)
  if (unit !== 'kg' && unit !== 'gram' && unit !== 'g' && unit !== 'gm' && unit !== 'কেজি' && unit !== 'গ্রাম' && unit !== '') {
    const cleanUnit = (product.unit || '').replace(/[0-9০-৯\s]/g, '').trim();
    const actualUnit = cleanUnit || product.unit || 'প্যাক';
    return [
      { id: '1custom', labelBn: `১ ${actualUnit}`, labelEn: `1 ${actualUnit}`, multiplier: 1 },
      { id: '2custom', labelBn: `২ ${actualUnit}`, labelEn: `2 ${actualUnit}`, multiplier: 2 },
      { id: '5custom', labelBn: `৫ ${actualUnit}`, labelEn: `5 ${actualUnit}`, multiplier: 5 }
    ];
  }

  // 7. Default Weight based
  return [
    { id: '500g', labelBn: '৫০০ গ্রাম', labelEn: '500g', multiplier: 0.5 },
    { id: '1kg', labelBn: '১ কেজি', labelEn: '1kg', multiplier: 1 },
    { id: '2kg', labelBn: '২ কেজি', labelEn: '2kg', multiplier: 2 }
  ];
}

export interface DynamicPage {
  slug: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  bannerImage?: string;
  productIds: string[];
}




