/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Farmer, Product, Review } from './types';

export const CATEGORIES = [
  { id: 'fruits', nameBn: 'ফলমূল', nameEn: 'Fruits', icon: 'Apple' },
  { id: 'vegetables', nameBn: 'শাকসবজি', nameEn: 'Vegetables', icon: 'Leaf' },
  { id: 'fish', nameBn: 'মাছ', nameEn: 'Fish', icon: 'Fish' },
  { id: 'meat', nameBn: 'মাংস', nameEn: 'Meat', icon: 'Beef' },
  { id: 'honey', nameBn: 'খাঁটি মধু', nameEn: 'Honey', icon: 'Honey' },
  { id: 'spices', nameBn: 'মসলাপাতি', nameEn: 'Spices', icon: 'Flame' },
  { id: 'organic', nameBn: 'জৈব খাবার', nameEn: 'Organic Products', icon: 'CheckSquare' },
  { id: 'ready-to-cook', nameBn: 'রেডি-টু-কুক', nameEn: 'Ready-to-Cook', icon: 'ChefHat' },
  { id: 'dairy', nameBn: 'দুগ্ধজাত', nameEn: 'Dairy', icon: 'Milky' },
  { id: 'grains', nameBn: 'শস্য ও ডাল', nameEn: 'Grains', icon: 'Wheat' }
];

export const DISTRICTS = [
  'Rajshahi', 'Jessore', 'Rangpur', 'Bogra', 'Sylhet', 
  'Comilla', 'Dinajpur', 'Barisal', 'Mymensingh', 'Kushtia'
];

// Generate 30 farmers (20 male, 10 female)
const maleNames = [
  'Abdur Rahman', 'Fazle Rabbi', 'Mofizur Rahman', 'Zakir Hossain', 'Jamal Uddin',
  'Mizanur Rahman', 'Korim Sheikh', 'Hasan Ali', 'Anisur Rahman', 'Kazi Shamim',
  'Babul Mia', 'Selim Chowdhury', 'Rafiqul Islam', 'Sujon Ahmed', 'Monirul Islam',
  'Shafiqul Alom', 'Kamrul Hasan', 'Yusuf Ali', 'Amanullah Sheikh', 'Tariqul Islam'
];

const femaleNames = [
  'Ayesha Begum', 'Fatema Khatun', 'Sultana Razia', 'Rokeya Khanom', 'Nasrin Akter',
  'Rabeya Bosri', 'Tahmina Parvin', 'Shahnaz Begum', 'Moriom Nesa', 'Jesmin Ara'
];

export const demoFarmers: Farmer[] = [];

// Seed male farmers (IDs f1 to f20)
for (let i = 0; i < 20; i++) {
  const isVerified = i < 14; // ~70% verified
  const rating = parseFloat((4.0 + (i % 11) * 0.1).toFixed(1)); // 4.0 - 5.0
  const dist = DISTRICTS[i % DISTRICTS.length];
  demoFarmers.push({
    id: `f${i + 1}`,
    name: maleNames[i],
    gender: 'male',
    district: dist,
    address: `${dist} Sadar, ${dist}, Bangladesh`,
    rating: rating > 5.0 ? 5.0 : rating,
    verified: isVerified,
    productCount: 4 + (i % 5),
    salesCount: 45 + (i * 12),
    avatar: 'male',
    phone: `01712345${String(100 + i).slice(1)}`,
    status: 'Approved',
    balance: 2400 + (i * 620),
    bio: `আমদের পারিবারিক খামার থেকে প্রাকৃতিক উপায়ে চাষ করা ফসল সরাসরি গ্রাহকের দোরগোড়ায় পৌঁছে দেওয়াই আমার লক্ষ্য। আমি দীর্ঘ ${5 + (i % 8)} বছর ধরে মাঠ পর্যায়ে কাজ করছি এবং নিরাপদ কৃষির জন্য নিয়োজিত আছি।`
  });
}

// Seed female farmers (IDs f21 to f30)
for (let i = 0; i < 10; i++) {
  const isVerified = i < 7; // ~70% verified
  const rating = parseFloat((3.9 + (i % 11) * 0.1).toFixed(1)); // 3.9 - 4.9
  const dist = DISTRICTS[(i + 5) % DISTRICTS.length];
  demoFarmers.push({
    id: `f${21 + i}`,
    name: femaleNames[i],
    gender: 'female',
    district: dist,
    address: `Bazar Road, ${dist}, Bangladesh`,
    rating: rating > 5.0 ? 5.0 : rating,
    verified: isVerified,
    productCount: 5 + (i % 4),
    salesCount: 30 + (i * 15),
    avatar: 'female',
    phone: `0193135${String(300 + i).slice(1)}`,
    status: 'Approved',
    balance: 3800 + (i * 750),
    bio: `নারী উদ্যোক্তা হিসেবে নিরাপদ শস্য এবং প্রস্তুতকৃত হোমমেড পণ্য নিয়ে আমি কাজ করছি। আমার খামারের প্রতিটি আইটেম সম্পূর্ণ প্রাকৃতিক জৈব সার ব্যবহার করে উৎপাদিত যা শতভাগ সুস্বাদু ও নিরাপদ।`
  });
}

// Fixed High Quality Pixels/Unsplash image lists for the categories to support 3-5 images beautifully
const categoryImages: Record<string, string[]> = {
  fruits: [
    'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1519996521430-02b798c1d881?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=500&auto=format&fit=crop&q=60',
  ],
  vegetables: [
    'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=500&auto=format&fit=crop&q=60',
  ],
  fish: [
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60',
  ],
  meat: [
    'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1532407191490-e4066c1500d4?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1529692236671-f1f6e9481b28?w=500&auto=format&fit=crop&q=60',
  ],
  honey: [
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1587049352851-8d4e89134292?w=500&auto=format&fit=crop&q=60',
  ],
  spices: [
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1532336414038-cf1907de1fd0?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60',
  ],
  organic: [
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
  ],
  'ready-to-cook': [
    'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1515003844-1098154e7f68?w=500&auto=format&fit=crop&q=60',
  ],
  dairy: [
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1528750951163-f2c8a63e3575?w=500&auto=format&fit=crop&q=60',
  ],
  grains: [
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=500&auto=format&fit=crop&q=60',
  ]
};

// Precise items per category (15 items each x 10 categories = 150)
const itemsCategorized: Record<string, Array<{title: string, descBn: string, price: number, unit: string, isDiscount?: boolean}>> = {
  fruits: [
    { title: 'রাজশাহী আমগাছের পাকা গোপালভোগ আম', descBn: 'ফরমালিন বিহীন সরাসরি রাজশাহী বাঘা থেকে সংগৃহীত সুস্বাদু গোপালভোগ আম।', price: 90, unit: 'kg' },
    { title: 'হাঁড়িভাঙ্গা মিষ্টি আম (তাজা)', descBn: 'রংপুরের বিখ্যাত হাঁড়িভাঙ্গা আম, আঁশহীন ও মিষ্টি সুবাস যুক্ত সেরা কোয়ালিটি।', price: 120, unit: 'kg' },
    { title: 'দিনাজপুরের লিচু ( বেদানা সাইজ)', descBn: 'দিনাজপুর সদর থেকে সংগৃহীত রসালো বেদানা ও বোম্বাই লিচু শতভাগ ফ্রেশ।', price: 380, unit: '100 pcs', isDiscount: true },
    { title: 'জাতীয় ফল পাকা মিষ্টি কাঁঠাল', descBn: 'গাজীপুরের মিষ্টি আঠাহীন পাকা বড় কাঁঠাল। চমৎকার স্বাদ ও আকর্ষক মিষ্টি।', price: 250, unit: 'piece' },
    { title: 'পাহাড়ী সবুজ মিষ্টি পেয়ারা', descBn: 'বরিশালের স্বরূপকাঠী ও পার্বত্য অঞ্চলের তাজা পেয়ারা, সুমিষ্ট ও মচমচে।', price: 70, unit: 'kg' },
    { title: 'অর্গানিক মিষ্টি পাকা পেঁপে', descBn: 'গাছপাকা ফরমালিন মুক্ত সুন্দর মিষ্টি দেশী পাকা পেঁপে। ভিটামিন সমৃদ্ধ।', price: 80, unit: 'kg' },
    { title: 'শেরপুরের লাল পাহাড়ি কলা (সবরি)', descBn: 'সম্পূর্ণ প্রাকৃতিক উপায়ে পাকানো সবরি কলার বড় এক কাঁদি। পুষ্টিগুণে ঠাসা।', price: 90, unit: 'dozen' },
    { title: 'রসালো লাল তরমুজ (সুপার জাস্ট)', descBn: 'পটুয়াখালীর মাঠ থেকে সরাসরি সংগৃহীত রসালো মিষ্টি ও জমকালো লাল তরমুজ।', price: 220, unit: 'piece', isDiscount: true },
    { title: 'খাগড়াছড়ির তাজা আনারস (জলডুগি)', descBn: 'পাহাড় থেকে তোলা অত্যন্ত মিষ্টি ক্ষদ্র আকারের তাজা জলডুগি আনারস।', price: 45, unit: 'piece' },
    { title: 'লাল লাল বড় ডালিম (বেদানা)', descBn: 'স্বাদ ও রসালো কোয়ালিটিতে সেরা বড় গোল লাল দানাযুক্ত ডালিম ফল।', price: 280, unit: 'kg' },
    { title: 'মিষ্টি মাল্টা (সবুজ দেশি)', descBn: 'পার্বত্য অঞ্চলের নিজস্ব বাগানের অত্যন্ত মিষ্টি রসালো দেশি মাল্টা।', price: 140, unit: 'kg' },
    { title: 'সিলেটের জারা লেবু ও কমলা', descBn: 'শ্রীমঙ্গলের পাহাড়ি এলাকা থেকে সংগৃহীত টক-মিষ্টি অত্যন্ত রসালো কমলা লেবু।', price: 190, unit: 'kg' },
    { title: 'সবুজ দেশী কচি ডাব (পানি সমৃদ্ধ)', descBn: 'মিষ্টি পানি ও কচি ডাব যা সরাসরি নারিকেল বাগান থেকে সংগৃহীত।', price: 80, unit: 'piece' },
    { title: 'পার্বত্য ড্রাগন ফল (রোজ পিংক)', descBn: 'তাজা ও সম্পূর্ণ রাসায়নিক মুক্ত পিঙ্ক ও লাল শাঁসের ড্রাগন ফ্রুট।', price: 320, unit: 'kg' },
    { title: 'বাগেরহাটের মিষ্টি জাম্বুরা (লাল দানা)', descBn: 'রসালো টুকটুকে লাল দানার খোসা পাতলা বড় জাম্বুরা। অসাধারণ স্বাদ ও সুগন্ধ।', price: 50, unit: 'piece' }
  ],
  vegetables: [
    { title: 'বগুড়ার গোল আলু (দেশি জাত)', descBn: 'বগুড়ার বালু মাটির গোল লাল আলু। তরকারিতে দেয় ভিন্ন মাত্রা।', price: 40, unit: 'kg' },
    { title: 'যশোরের তাল বেগুন (চকচকে তাজা)', descBn: 'যশোরের বিখ্যাত বীজহীন নরম গোল বেগুন, পোড়ানোর জন্য সেরা।', price: 65, unit: 'kg' },
    { title: 'ফরিদপুরের পেঁয়াজ ( লাল কিং)', descBn: 'দেশি মসলাদার সুবাসযুক্ত ফরিদপুরের নতুন লাল পেঁয়াজ। রান্নার মূল উপাদান।', price: 85, unit: 'kg' },
    { title: 'রংপুরের তাজা রসুন (এক কোয়া)', descBn: 'দেশী কড়া ঝাঁঝালো এক কোয়া ও বড় কোয়ার তাজা রসুন। শুকানো ফ্রেশ।', price: 130, unit: 'kg' },
    { title: 'কুষ্টিয়ার কচি আদা (দেশি জাত)', descBn: 'ঝাঁঝালো সুগন্ধযুক্ত দেশি মাটির আর্দ্র আদা, সরাসরি ক্ষেত থেকে উত্তোলিত।', price: 180, unit: 'kg' },
    { title: 'দিনাজপুরের সরু পটল (সবুজ কড়া)', descBn: 'নরম বীজ ও পাতলা চামড়ার অত্যন্ত কচি ও ফ্রেশ সবুজ পটল।', price: 50, unit: 'kg' },
    { title: 'কুমিল্লার বড় করলা বা উচ্ছে', descBn: 'তিক্ত স্বাদের কিন্তু অত্যন্ত পুষ্টিকর ও অর্গানিক কচি তরতাজা করলা।', price: 60, unit: 'kg' },
    { title: 'মুন্সীগঞ্জের মাটির নিচে মিষ্টি লাউ', descBn: 'কচি ডগাসমেত কচি মিষ্টি লাউ, সম্পূর্ণ কেমিক্যাল মুক্ত পানি লাউ।', price: 50, unit: 'piece' },
    { title: 'রাজশাহীর পাকা মিষ্টি কুমড়া (বড় সাইজ)', descBn: 'হলুদ রঙের মিষ্টি কুমড়ার বড় টুকরো বা আস্ত গোল মিষ্টি কুমড়া।', price: 45, unit: 'kg' },
    { title: 'মেহেরপুরের কচি ঢ্যাঁড়শ (নরম জাত)', descBn: 'নরম কচি সবুজ ভেন্ডি বা ঢ্যাঁড়শ, সকালের ভাজিতে দারুণ স্বাদ।', price: 48, unit: 'kg' },
    { title: 'যশোরের বড় সাদা ফুলকপি', descBn: 'তাজা পোকা মুক্ত কড়া সাদা পাতামোড়া কপি ফুল। মচমচে স্বাদ।', price: 40, unit: 'piece' },
    { title: 'দিনাজপুরের কড়া বাঁধাকপি', descBn: 'তাজা রসালো সবুজ গোল শক্ত পাতা কপি। সম্পূর্ণ প্রাকৃতিক উপায়ে উর্বর।', price: 35, unit: 'piece' },
    { title: 'লাল ও পাকা তরতাজা টমেটো', descBn: 'গাছপাকা কুচকুচে লাল মিষ্টি টমেটো, সালাদ ও রান্নার জন্য উপযোগী।', price: 75, unit: 'kg' },
    { title: 'বগুড়ার মিষ্টি গাজর', descBn: 'মিষ্টি ও মচমচে লালচে কমলা গাজর। জুস বা হালুয়া তৈরির আসল উপাদান।', price: 90, unit: 'kg', isDiscount: true },
    { title: 'ক্ষেতের দেশি হাইব্রিড কচি শসা', descBn: 'সালাদের জন্য উপযুক্ত রসালো কচি ও তিতাহীন চকচকে সবুজ শসা।', price: 55, unit: 'kg' }
  ],
  fish: [
    { title: 'চাঁদপুরের পদ্মার ইলিশ মাছ (১ কেজি)', descBn: 'বাঙালিদের প্রিয় চাঁদপুরের আসল পদ্মার রূপালী ইলিশ মাছ, চমৎকার স্বাদ।', price: 1450, unit: 'kg', isDiscount: true },
    { title: 'পুকুরের তাজা বড় রুই মাছ (৩ কেজি+)', descBn: 'নিজেদের বড় দিঘি থেকে তাজা ধরা রুই মাছ। আঁশ ছাড়ানো নয়, ফ্রেশ।', price: 380, unit: 'kg' },
    { title: 'ক্ষেতের বিলে ধরা দেশি কাতলা মাছ', descBn: 'বিলের প্রাকৃতিক খাবারে বড় হওয়া ও সুস্বাদু কচি কাতলা মাছ।', price: 400, unit: 'kg' },
    { title: 'খুলনার বাগদা চিংড়ি (বড় সাইজ)', descBn: 'খুলনার ঘেরের মিষ্টি জলের তাজা মাথাওয়ালা বাগদা চিংড়ি মাছ।', price: 850, unit: 'kg' },
    { title: 'নদীর তাজা গলদা চিংড়ি (প্রিমিয়াম)', descBn: 'বড় আকারের পুরুষ গলদা চিংড়ি দাড়া যুক্ত। দারুণ জুসি স্বাদ।', price: 1100, unit: 'kg' },
    { title: 'হাওরের বিলের দেশী শিং মাছ (তাজা ধরা)', descBn: 'জ্যান্ত তাজা কালো কুচকুচে পুষ্টিকর ও সুস্বাদু বিলের শিং মাছ।', price: 650, unit: 'kg' },
    { title: 'দেশী মাগুর মাছ (লোকাল হাওর)', descBn: 'রোগীর পুষ্টি ও আয়রনের ঘাটতি মেটাতে সেরা জ্যান্ত দেশী মাগুর মাছ।', price: 700, unit: 'kg' },
    { title: 'নরম কাঁটার সুস্বাদু তাজা পাবদা মাছ', descBn: 'পরিষ্কার মিষ্টি জলের নরম মাছ যা অল্প মসলাতেই চমৎকার রাঁধা যায়।', price: 480, unit: 'kg' },
    { title: 'বড় আইড় মাছ আস্ত (নদীর তাজা)', descBn: 'পদ্মা ও মেঘনা নদীর গভীরের সুস্বাদু চর্বিযুক্ত আশহীন বড় আইড় মাছ।', price: 950, unit: 'kg' },
    { title: 'চাটমোহরের বিলের বড় বোয়াল মাছ', descBn: 'বিল থেকে সরাসরি সংগৃহীত চর্বিযুক্ত তাজা বোয়াল মাছের টুকরো।', price: 800, unit: 'kg' },
    { title: 'পুকুরে চাষ করা তাজা তেলাপিয়া', descBn: 'সবচেয়ে সুলভ ও ফ্রেশ ফিড খাওয়ানো সুস্বাদু তেলাপিয়া মাছ।', price: 210, unit: 'kg' },
    { title: 'হাওরের তাজা টেংরা মাছ (ছোট সাইজ)', descBn: 'ছোট দেশী টেংরা মাছ, পেঁয়াজ ও টমেটো দিয়ে চচ্চড়ি রান্নার রাজকীয় স্বাদ।', price: 550, unit: 'kg' },
    { title: 'কক্সবাজারের তাজা রূপচাঁদা মাছ (আস্ত)', descBn: 'সমুদ্র থেকে ধৃত ফ্রেশ হিমায়িত রূপচাঁদা ফ্রাই করার জন্য অসাধারণ।', price: 1200, unit: 'kg' },
    { title: 'ক্ষেতের বিলের শোল মাছ (জ্যান্ত)', descBn: 'কালো কুচকুচে জ্যান্ত বিলের বড় সাইজ শোল মাছ। চমৎকার কষা ভুনা।', price: 580, unit: 'kg' },
    { title: 'দেশি জ্যান্ত কই মাছ (ছোট জাতের)', descBn: 'কড়া তাজা ও লাফাতে থাকা দেশী কই মাছ যা পুষ্টিতে ভরপুর।', price: 420, unit: 'kg' }
  ],
  meat: [
    { title: 'শতভাগ দেশী জীবন্ত কড়া মুরগি', descBn: 'ওষুধ ও ফিড ছাড়া বাড়ির উঠানে চড়ে বেড়ানো আসল সুস্বাদু মিষ্টি দেশী মুরগি।', price: 450, unit: 'kg' },
    { title: 'দেশী মুরগি ড্রেসড ও পরিষ্কার করা', descBn: 'চামড়া ছাড়ানো ব্যতীত সম্পূর্ণ ভালো করে ড্রেসড ও পরিচ্ছন্ন করা দেশী মুরগি।', price: 490, unit: 'kg' },
    { title: 'টাটকা গরুর সলিড মাংস (হাড় ছাড়া)', descBn: 'হাড়, চর্বি ও পর্দা ছাড়া ১০০% সলিড গরুর তাজা লাল মাংস।', price: 850, unit: 'kg' },
    { title: 'তাজা গরুর নেহারী পায়া বা আস্ত হাড়', descBn: 'সুপ বা পায়া রান্নার জন্য দারুণ ক্যালসিয়াম সমৃদ্ধ গরুর পায়ের হাড়।', price: 400, unit: 'kg' },
    { title: 'তরতাজা খাসির মাংস (১০০% গ্যারান্টি)', descBn: 'তরুণ কচি খাসির দুর্গন্ধহীন নরম সুস্বাদু ও পুষ্টিকর তাজা মাংস।', price: 1050, unit: 'kg', isDiscount: true },
    { title: 'দেশী বিলের বড় জ্যান্ত পাতিহাঁস', descBn: 'শীতকালে বিলে ধান খেয়ে চর্বিযুক্ত হওয়া বড় আকারের নরম পাতিহাঁস।', price: 550, unit: 'piece' },
    { title: 'খাসির পায়া ও ভুঁড়ি পরিষ্কার তাজা', descBn: 'ভালোভাবে ধুয়ে পরিষ্কার করা চর্বিমুক্ত খাসির বটাবাট বা ভুঁড়ি।', price: 450, unit: 'kg' },
    { title: 'ড্রেসড কোয়েল পাখির নরম মাংস', descBn: 'অত্যন্ত পুষ্টিকর ও বাচ্চাদের প্রিয় কচি কোয়েল পাখির ড্রেসড মাংস।', price: 80, unit: 'piece' },
    { title: 'কবুতরের কচি রানিং বাচ্চা (১ জোড়া)', descBn: 'অসুস্থ রোগীদের শারীরিক শক্তি ফিরিয়ে দিতে উপযোগী নরম কচি কবুতরের বাচ্চা।', price: 350, unit: 'pair' },
    { title: 'দেশী চিনা হাঁস (আস্ত বড় সাইজ)', descBn: 'কালো ও সাদা পালকের বড় ওজনের মাংসল সুস্বাদু চিনা হাঁস।', price: 750, unit: 'piece' },
    { title: 'প্রিমিয়াম গরুর কলিজা ও ফুসফুস মিক্স', descBn: 'সকালে রুটির সাথে খাওয়ার জন্য তাজা নরম পুষ্টিকর গরুর লাল কলিজা।', price: 800, unit: 'kg' },
    { title: 'সোনালী মুরগি (কড়া রোস্ট সাইজ)', descBn: '৭০০-৮০০ গ্রাম ওজনের সোনালী মুরগির বাচ্চা, বিয়ে বাড়ীর রোস্ট তৈরির জন্য সেরা।', price: 280, unit: 'piece' },
    { title: 'দেশী রাজহাঁস (আস্ত চর্বিযুক্ত)', descBn: 'বড় আকারের অত্যন্ত তেল ও চর্বিসমৃদ্ধ রাজকীয় স্বাদের দেশী রাজহাঁস।', price: 1600, unit: 'piece' },
    { title: 'প্রিমিয়াম মহিষের মাংস (পাহাড়ি জাত)', descBn: 'মিউচুয়াল ও অর্গানিক সুস্বাদু চর্বিহীন গাড়ো লাল মহিষের তাজা মাংস।', price: 720, unit: 'kg' },
    { title: 'খাসির সুস্বাদু কচি মাথা ও মগজ', descBn: 'রান্নার জন্য জুতসই ফ্রেশ কড়কড়ে খাসির নরম সুস্বাদু মাথা ও মগজ।', price: 350, unit: 'piece' }
  ],
  honey: [
    { title: 'সুন্দরবনের ১০০% খাঁটি খলিসা মধু', descBn: 'সুন্দরবনের বিখ্যাত খলিসা ফুলের প্রাকৃতিক মধুর চাক কাটা খাঁটি নির্যাস।', price: 1200, unit: 'kg', isDiscount: true },
    { title: 'দিনাজপুরের লিচু ফুলের হালকা মিষ্টি মধু', descBn: 'লিচু বাগান থেকে মৌমাছি দ্বারা কৃত্রিম ফিডিং ছাড়া উৎপাদিত পাতলা সুগন্ধি মধু।', price: 650, unit: 'kg' },
    { title: 'যশোরের সরিষা ফুলের জমে যাওয়া সাদা মধু', descBn: 'সরিষা ক্ষেত থেকে সংগৃহীত গ্লুকোজ সমৃদ্ধ অত্যন্ত পুষ্টিকর জমে যাওয়া মধু।', price: 550, unit: 'kg' },
    { title: 'কালোজিরা ফুলের প্রিমিয়াম কড়া মধু', descBn: 'সকল রোগের মহৌষধ কালোজিরা ক্ষেতের চাক কাটা ঘন কালো কালার মধু।', price: 950, unit: 'kg' },
    { title: 'বিলের বুনো প্রাকৃতিক বড় চাকের মধু', descBn: 'গ্রামবাংলা থেকে নিজে দাঁড়িয়ে কেটে আনা বুনো চাকের তরল ও খাঁটি মধু।', price: 1100, unit: 'kg' },
    { title: 'পার্বত্য অঞ্চলের বুনো ডার্ক ফরেস্ট মধু', descBn: 'বান্দরবানের গভীর বনের চাকে জমানো কড়া ঝাঁঝালো বুনো পাহাড়ি মধু।', price: 1400, unit: 'kg' },
    { title: 'পদ্ম ফুলের সুবাসিত বিরল ও খাঁটি মধু', descBn: 'মধুমতি ও বিলের লাল পদ্ম ফুলের ছোঁয়াযুক্ত দুর্লভ ও হালকা মিষ্টি মধু।', price: 1600, unit: 'kg' },
    { title: 'বরই ফুলের ঐতিহ্যবাহী সোনালী মধু', descBn: 'রাজশাহীর বরই চাষের মৌসুমে চাক কাটা লালচে সোনালী রঙের দারুণ মধু।', price: 600, unit: 'kg' },
    { title: 'মিশ্র বুনো ফুলের খাঁটি ঘরোয়া মধু', descBn: 'বহুমুখী পাহাড়ি ও বুনো গাছের ফুলের নিংড়ানো মধু যা শতভাগ ন্যাচারাল।', price: 750, unit: 'kg' },
    { title: 'ইউক্যালিপটাস ফুলের সুগন্ধি ঝাঁঝ মধু', descBn: 'উত্তরবঙ্গের ইউক্যালিপটাস গাছ থেকে সংগৃহীত কড়া সুবাসের ওষুধি মধু।', price: 680, unit: 'kg' },
    { title: 'রয়েল জেলি সমৃদ্ধ মৌমাছির প্রিমিয়াম মধু', descBn: 'মৌমাছির রাণীকে খাওয়ানো রাজকীয় পুষ্টি মিশ্রিত সুপারচার্জড রয়েল মধু।', price: 2500, unit: '500g' },
    { title: 'প্রাকৃতিক চাক কাটা মধু সরাসরি মৌয়াল থেকে', descBn: 'মৌয়াল ভাইদের জীবনের ঝুঁকি নিয়ে সুন্দরবন থেকে আনা একদম খাঁটি তরল সোনা।', price: 1300, unit: 'kg' },
    { title: 'খাস পাহাড়ের বুনো ডার্ক ওয়াইল্ড মধু', descBn: 'পাহাড় ও ঝর্ণার কিনারের খাঁটি বুনো চাকের অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ মধু।', price: 1500, unit: 'kg' },
    { title: 'প্রিমিয়াম সুন্দরবনের গেওয়া ফুলের মধু', descBn: 'গেওয়া ফুলের কড়া স্বাদযুক্ত তরল সোনালী রঙের লাইট ও হালকা নোনতা মধু।', price: 950, unit: 'kg' },
    { title: 'বাবল বা চেরী ফুলের মিষ্টি সোনালী মধু', descBn: 'মিষ্টি ফুলের গন্ধ সমৃদ্ধ লাইট টেক্সচারের কড়া পুষ্টিকর ও সুস্বাদু চাক মধু।', price: 850, unit: 'kg' }
  ],
  spices: [
    { title: 'কাঠের ঘানিতে ভাঙানো তাজা হলুদ গুড়া', descBn: 'কোনো কৃত্রিম রঙ ছাড়াই দেশি কড়া রঙ ও সুঘ্রাণযুক্ত শুকনো হলুদের কড়া গুড়া।', price: 280, unit: 'kg' },
    { title: 'বগুড়ার তাজা লাল শুকনো মরিচ গুড়া', descBn: 'ঝাঁঝ ও কড়া লাল রঙে সেরা বগুড়ার শুকনো মরিচ ভেঙে তৈরি ঝাঁঝালো লাল গুড়া।', price: 320, unit: 'kg' },
    { title: 'ঘরোয়া মশলার কড়া জিরা গুড়া (ভাজা)', descBn: 'হালকা আঁচে ভেজে গুঁড়ো করা সুগন্ধি জিরা গুঁড়ো যা রান্নায় দেয় এক্সট্রা ফ্লেভার।', price: 650, unit: 'kg' },
    { title: 'সুঘ্রাণযুক্ত ধনে বা ধনিয়া গুড়া', descBn: 'দেশী গোল আস্ত ধনে পরিষ্কার করে শুকিয়ে মিল থেকে ভাঙানো তাজা ধনে গুড়া।', price: 220, unit: 'kg' },
    { title: 'দেশী কড়া গন্ধের পাঁচফোড়ন আস্ত', descBn: 'মেথি, মৌরি, কালোজিরা, রাঁধুনি এবং জিরা সম্বলিত খাঁটি ও ঐতিহ্যবাহী মশলা।', price: 240, unit: 'kg' },
    { title: 'ঐতিহ্যবাহী মেজবানি গরম মসলা গুড়া', descBn: '১৫টিরও বেশি প্রিমিয়াম আস্ত মশলার নিখুঁত ব্লেন্ড যা মেজবানি ও মাংসের স্বাদ বাড়ায়।', price: 980, unit: 'kg', isDiscount: true },
    { title: 'দারুচিনি স্টিকস (সিংগাপুর গ্রেড)', descBn: 'মিষ্টি সুবাসিত ও কড়া মিষ্টি গন্ধের সেরা কোয়ালিটির আসল দারুচিনি ছাল।', price: 480, unit: 'kg' },
    { title: 'সবুজ কচি সুগন্ধি ছোট এলাচ', descBn: 'কড়া সুগন্ধযুক্ত এবং ঘন দানাভরা মিষ্টি সবুজ বড় এলাচের খাঁটি পোড।', price: 3400, unit: 'kg' },
    { title: 'দেশী কড়া ঝাঁঝালো কালো গোলমরিচ', descBn: 'গরম কালার ও চড়া স্যুপ বা তরকারিতে ঝাল দেওয়ার জন্য সেরা কালো গোলমরিচ।', price: 900, unit: 'kg' },
    { title: 'শুকনো তেজপাতা (সুগন্ধি জাত)', descBn: 'ক্ষেত থেকে তোলা শুষ্ক বড় আকারের পাতা যা তরকারিতে দেবে মন মাতানো গন্ধ।', price: 150, unit: 'kg' },
    { title: 'কক্সবাজারের খাঁটি জৈব কালোজিরা', descBn: 'কালজিরার তেল ও দানা সমৃদ্ধ ওষুধি গুণের তাজা ও ধুলোবালি মুক্ত দানা।', price: 320, unit: 'kg' },
    { title: 'সুগন্ধি জয়ফল আস্ত (খাস ডার্ক)', descBn: 'মাংস ও পোলাও রান্নার সমৃদ্ধ শাহী সুবাস আনার জন্য বড় সাইজ জয়ফল আস্ত।', price: 850, unit: 'kg' },
    { title: 'ঐতিহ্যবাহী জয়ত্রী ছাল সুগন্ধি', descBn: 'যেকোনো বিরিয়ানি বা তরকারির কোরমাতে রাজকীয় ঘ্রাণ আনতে ব্যবহৃত আসল জয়ত্রী।', price: 2800, unit: 'kg' },
    { title: 'ঝাঁঝালো তাজা লং বা লবঙ্গ', descBn: 'দাঁতের ব্যথা উপশম করতে এবং তরকারির কড়া সুবাসে সেরা আকর্ষক লবঙ্গ।', price: 1400, unit: 'kg' },
    { title: 'মেথি দানা অর্গানিক গ্রেড', descBn: 'ডায়াবেটিক রোগীদের সকালে ভেজানো পানি পানের সর্বোত্তম কড়া পুষ্টিকর মেথি।', price: 250, unit: 'kg' }
  ],
  organic: [
    { title: 'সিরাজগঞ্জের কাঠের ঘানি সরিষার তেল', descBn: 'প্রথম চাপের ঝাঁঝালো কাঠের ঘানি ভাঙ্গা খাঁটি সরিষার তেল। নো মিক্সিং।', price: 240, unit: 'litre' },
    { title: 'পাবনার গাওয়া খাঁটি খাশ ঘি', descBn: 'খাঁটি মাখনের ঘ্রাণযুক্ত ঐতিহ্যবাহী শতভাগ গাওয়া ঘি যা সব খাবারেই অতুলনীয়।', price: 1400, unit: 'kg', isDiscount: true },
    { title: 'সুন্দরবনের লাল চাল (ঢেঁকি ছাঁটা)', descBn: 'ফাইবারে ভরপুর ডায়াবেটিক বান্ধব ঢেউ তোলা লাল ঢেঁকি ছাঁটা সুস্বাদু চাল।', price: 95, unit: 'kg' },
    { title: 'জৈব চিয়া সিড (সুপারফুড)', descBn: 'ওমেগা-৩ এবং ডায়েট বান্ধব ফাইবার সমৃদ্ধ প্রিমিয়াম কোয়ালিটি চিয়া বীজ।', price: 480, unit: 'kg' },
    { title: 'হিমালয়ের গোলাপী পিংক সল্ট', descBn: 'সাধারণ লবণের বদলে ব্যবহারযোগ্য খনিজ উপাদান সমৃদ্ধ আসল গোলাপী পিঙ্ক সল্ট।', price: 180, unit: 'kg' },
    { title: 'কুষ্টিয়ার আখের লাল গুড় (প্রাকৃতিক)', descBn: 'কোনো হাইড্রোস বা কেমিক্যাল ছাড়া জ্বাল দেওয়া আখ ক্ষীরের লাল সুস্বাদু গুড়।', price: 160, unit: 'kg' },
    { title: 'জৈব উপায়ে চাষ করা তিল তেল', descBn: 'চুল ও ত্বকের যত্নে এবং রান্নায় দুর্দান্ত ব্যবহার উপযোগী তাজা সাদা তিল তেল।', price: 380, unit: 'litre' },
    { title: 'খাঁটি কোল্ডপ্রেসড কুচানো নারিকেল তেল', descBn: 'অর্গানিক তাজা শুকনো নারিকেলের কাঠের ঘানিতে ভাঙা ফার্স্ট প্রেসড কোল্ড তেল।', price: 450, unit: 'litre' },
    { title: 'শুকনো মোরিঙ্গা পাতার গুড়া (সুপার পাউডার)', descBn: 'সজনে পাতার ওষুধি অ্যান্টিঅক্সিডেন্ট গুড়ামিশ্রিত পুষ্টির পাওয়ার হাউজ মোরিঙ্গা।', price: 350, unit: 'kg' },
    { title: 'খাঁটি মাশরুম পাউডার পুষ্টিকর', descBn: 'অর্গানিক উপায়ে বড় করা শুকনো অয়েস্টার মাশরুম গুঁড়া, তরকারি ও সুপের স্বাদ বাড়াতে সেরা।', price: 490, unit: '250g' },
    { title: 'খেজুরের ঝোলা গুড় (শীতকালীন ঐতিহ্য)', descBn: 'যশোরের গাছীদের ভোরে নামানো খেজুর রস জ্বাল দিয়ে তৈরি অতুলনীয় সুঘ্রাণের পাতলা গুড়।', price: 220, unit: 'kg' },
    { title: 'জৈব পদ্ধতিতে তৈরি ওটস', descBn: 'শরীরের ওজন কমাতে এবং হার্ট সতেজ রাখতে উপযোগী ফাইবার সম্বলিত ওটস ফ্ল্যাক্স।', price: 340, unit: 'kg' },
    { title: 'আমলকী ও হরিতকী ওষুধি মিক্স গুড়া', descBn: 'কোষ্ঠকাঠিন্য ও গ্যাস্ট্রিক নিয়ন্ত্রণে ঐতিহ্যবাহী ত্রিফলা ওষুধি প্রাকৃতিক গুড়া।', price: 280, unit: '300g' },
    { title: 'আসল আখের দানা লাল চিনি (অর্ধ-পরিশোধিত)', descBn: 'রাসায়নিক ব্লিচ ছাড়া দেশী আখের প্রাকৃতিক লালচে পুষ্টিকর নন-রিফাইন্ড চিনি।', price: 145, unit: 'kg' },
    { title: 'তালমিছরি কড়া দানাদার ওষুধি', descBn: 'বাচ্চাদের কাশি ও ঠান্ডা সারাতে ব্যবহৃত আসল তালের রস থেকে জমানো মিছরি।', price: 320, unit: 'kg' }
  ],
  'ready-to-cook': [
    { title: 'কাটা লাউ ধোয়া ও পরিষ্কার করা', descBn: 'রান্নার জন্য রেডি, খোসা ও বিচি ফেলে গোল সাইজ কুচানো তাজা লাউ প্যাক।', price: 45, unit: '500g' },
    { title: 'ভাজির জন্য রেডি কুচানো গোল লাল আলু', descBn: 'পরিষ্কার পানিতে ধোয়া ও সমান সাইজে কুচানো আলু, তরল মচমচে ভাজির জন্য প্রস্তুত।', price: 35, unit: '500g' },
    { title: 'ছিলা ও কাটা পটলের তরকারি মিক্স', descBn: 'দুই মাথা কাটা ও হালকা খোসা ছাড়ানো তাজা কচি পটলের আস্ত ফালি প্যাক।', price: 40, unit: '500g' },
    { title: 'ধোয়া ও কাটা দেশী মুরগির হাড়-মাংস টুকরো', descBn: 'সম্পূর্ণ ড্রেসড ও কারি সাইজ টুকরো করে ধুয়ে জিপলক প্যাকে ভরা দেশী মুরগি।', price: 260, unit: '500g', isDiscount: true },
    { title: 'আঁশ ছাড়ানো ও কাটা রুই মাছের পিস', descBn: 'ভালো পিস করা ও লবণ দিয়ে ধুয়ে পরিচ্ছন্ন করা তাজা রুই মাছের কারি মিক্স পিস।', price: 220, unit: '500g' },
    { title: 'মিক্স সবজির চমৎকার চাইনিজ সবজি প্যাক', descBn: 'গাজর, পেঁপে, বরবটি ও কপির কাটা স্লাইস যা চাইনিজ রান্নায় সরাসরি কড়াইয়ে দেয়া যায়।', price: 55, unit: '500g' },
    { title: 'রান্নার জন্য কুচানো লাল পেঁয়াজ', descBn: 'ছুলে পরিষ্কার করে কুচি করা পেঁয়াজ যা রান্নার কাজকে অর্ধেক সহজ করে দেয়।', price: 60, unit: '500g' },
    { title: 'তাজা রসুন বাটা পেস্ট (ঘরোয়া ফিল)', descBn: 'হাত বাটায় পেষা সুগন্ধি তাজা রসুনের পেস্ট, কোনো কড়া কেমিক্যাল প্রিজারভেটিভ নেই।', price: 90, unit: '250g' },
    { title: 'মিক্স আদা বাটা ও পেস্ট জিপ্লক', descBn: 'তাজা আদা ও মসলা ব্লেন্ড করা খাঁটি ঘরোয়া আদার কড়া ঝাঁঝালো পেস্ট।', price: 95, unit: '250g' },
    { title: 'পেঁয়াজু মিক্স ডাল বাটা (রেডি টেম্পার)', descBn: 'খেসারী ও মসুর ডাল পেঁয়াজ মরিচ দিয়ে বেটে রাখা ফ্রোজেন মন্ড, তেলে ছাড়লেই মচমচে পেঁয়াজু।', price: 60, unit: '400g' },
    { title: 'ভুনা খিচুড়ি চাল-ডাল মিক্স প্যাক', descBn: 'চিনিগুঁড়া চাল ও ভাজা মুগ ডাল সঠিক অনুপাতে মেশানো ready খিচুড়ি প্যাক।', price: 75, unit: '500g' },
    { title: 'বেগুনী স্লাইস কাটা তাজা বেগুন স্লাইস', descBn: 'পারফেক্ট পাতলা ডিম্বাকৃতির স্লাইসে কাটা বেগুন, বেসন গোলার সাথে মেলাবার জন্য তৈরি।', price: 35, unit: '250g' },
    { title: 'কাটা ও ধোয়া কচি ফুলকপির ফুল স্লাইস', descBn: 'পোকামুক্ত ফ্রেশ মাঝারি সাইজে টুকরো করা কড়া সাদা ফুলকপি প্যাক।', price: 40, unit: '350g' },
    { title: 'ভেজিটেবল স্যুপ প্রিমিয়াম মিক্স বক্স', descBn: 'মাশরুম কড়া কর্ন ও কুচানো কচি পাতা মিক্স যা স্যুপ বানানোর জন্য স্পেশাল।', price: 70, unit: '300g' },
    { title: 'সালাদ বক্স (শসা, টমেটো, গাজর, ধনেপাতা স্লাইস)', descBn: 'সব সালাদ ধুয়ে নিখুঁত পাতলা কুচি করে লেবুর টুকরোসহ প্যাকিং করা ইনস্ট্যান্ট সালাদ।', price: 45, unit: 'box' }
  ],
  dairy: [
    { title: 'পদ্মার চরের গরুর খাঁটি ঘন তরল দুধ', descBn: 'অন্য কোনো রাসায়নিক বা পানিহীন সরাসরি ওলান চিপে নেওয়া টাটকা ঘন গরুর কাঁচা দুধ।', price: 85, unit: 'litre' },
    { title: 'মহিষের ঘন পুষ্টিকর দুধ (ফ্যাট সমৃদ্ধ)', descBn: 'চর্বিযুক্ত দই পাতার জন্য অনন্য কড়া ঘন মহিষের কাঁচা খাঁটি দুধ।', price: 110, unit: 'litre' },
    { title: 'ঐতিহ্যবাহী বগুড়ার টক দই সাদা', descBn: 'বগুড়ার চিলমারীর কড়া ঐতিহ্যবাহী টক দই যা বিরিয়ানির মসলা তৈরিতে সেরা।', price: 160, unit: 'kg' },
    { title: 'বগুড়ার মিষ্টি দই ( ঐতিহ্যবাহী সরা)', descBn: 'মাটির সরায় পাতা কড়া ক্ষীর ও ক্ষীরসা সমৃদ্ধ লালচে ঐতিহ্যবাহী বগুড়ার মিষ্টি দই।', price: 230, unit: 'piece', isDiscount: true },
    { title: 'অর্গানিক আনসল্টেড মাখন ডার্ক', descBn: 'কাঁচা দুধের নরম ছানা থেকে মাখানো সুস্বাদু আনসল্টেড খাঁটি হলুদ মাখন।', price: 350, unit: '250g' },
    { title: 'সরাসরি ঘরোয়া দুধের নরম ছানা', descBn: 'লেবুর রস দিয়ে কাটানো নরম সুমিষ্ট ও তুলতুলে কাঁচা ছানা, বাচ্চাদের জন্য পুষ্টিকর।', price: 250, unit: '250g' },
    { title: 'অষ্টগ্রামের খাঁটি পনির বা চিজ', descBn: 'কিশোরগঞ্জের অষ্টগ্রামের বিখ্যাত লবণাক্ত হস্তনির্মিত শক্ত ঐতিহ্যবাহী পনির।', price: 850, unit: 'kg' },
    { title: 'তাজা ছাঁচ তোলা মাঠা বা ঘোল', descBn: 'পাবনার সুস্বাদু স্পেশাল লাইট ঘরোয়া তক টক-মিষ্টি মাঠা পানীয়।', price: 90, unit: 'litre' },
    { title: 'লাবাং পুষ্টিকর শাহী পানীয়', descBn: 'ইউগার্ট ও শাহী গন্ধরাজ লেবুর রস সহযোগে ব্লেন্ড করা রিফ্রেশিং পুষ্টিকর লাবাং।', price: 130, unit: 'litre' },
    { title: 'নেত্রকোনার মালাই পেড়া মিষ্টি', descBn: 'ঘন খাঁটি দুধের ক্ষীর জ্বাল দিয়ে তৈরি নরম অতুলনীয় স্বাদের শুকনো মালাই পেড়া।', price: 360, unit: '500g' },
    { title: 'কুমিল্লার আসল স্পেশাল রসমালাই', descBn: 'ছোট ছোট নরম ছানার ডিলির ঘন এলাচী ক্ষীরের সেরা মায়াবী রসমলাই।', price: 480, unit: 'kg' },
    { title: 'ছানার শুকনো চমচম রাজকীয়', descBn: 'পোড়াবাড়ির বিখ্যাত কড়া মিষ্টির ও রসে ভেজা কড়কড়ে চমৎকার লাল চমচম।', price: 380, unit: 'kg' },
    { title: 'অর্গানিক প্রিমিয়াম ক্ষীরসা ঘন', descBn: 'দুধ জ্বাল দিয়ে আঠা আঠা রাবড়ি টেক্সচার করা মিষ্টি ঘন ক্ষীরসা।', price: 240, unit: '350g' },
    { title: 'সরিষা ফ্রেন্ডলি গাওয়া ঘির ক্ষীর', descBn: 'খাঁটি ঘিয়ে ভাজা ক্ষীর যা মুখে দিলেই গলে গিয়ে রাজকীয় স্বাদ দেয়।', price: 180, unit: 'box' },
    { title: 'বগুড়ার বড় সরা মিষ্টি দই (১.৫ কেজি স্পেশাল)', descBn: 'বড় পারিবারিক উৎসব বা মেহমানদারির রাজকীয় লাল দই মাটির সরায় পাতা।', price: 350, unit: 'piece' }
  ],
  grains: [
    { title: 'ক্ষেতের তাজা সরু মিনিকেট চাল', descBn: 'তাজা কুঁড়ো মুক্ত চাল যা রান্নার পর অত্যন্ত ঝরঝরে ও লম্বা ভাতে রূপ নেয়।', price: 72, unit: 'kg' },
    { title: 'নাজিরশাইল প্রিমিয়াম চাল (১ম গ্রেড)', descBn: 'চিকন ঝরঝরে নাজিরশাইল চাল, সম্পূর্ণ পাথর কণা ও কুড়ো মুক্ত পালিশ ছাড়া।', price: 78, unit: 'kg' },
    { title: 'পাহাড়ী চিনিগুড়া সুগন্ধি পোলাও চাল', descBn: 'পুরাতন আমনের সুবাস ছড়ানো কড়া দানাদার সুগন্ধি কালোজিরা ও চিনিগুড়া চাল।', price: 140, unit: 'kg', isDiscount: true },
    { title: 'দেশি আমন বালাম চাল (লালচে সাদা)', descBn: 'অর্গানিক কোয়ালিটির মোটা বালাম চাল যা অত্যন্ত সহজপাচ্য ও পুষ্টি সমৃদ্ধ।', price: 68, unit: 'kg' },
    { title: 'পোলাও চাল চিনিগুঁড়া বাসমতি মিক্স', descBn: 'বিরিয়ানি রান্নার দীর্ঘ ঝরঝরে সুবাসিত চিকন পোলাও বাসমতী চাল।', price: 190, unit: 'kg' },
    { title: 'দেশী কড়া লাল মসুর ডাল (ছোট দানা)', descBn: 'ঝাঁঝালো ও কড়া স্বাদযুক্ত ছোট দানার দেশী মসুর ডাল, সরাসরি চরের ক্ষেত থেকে।', price: 135, unit: 'kg' },
    { title: 'আঁশ ভাজা সোনালী মুগ ডাল আস্ত', descBn: 'হালকা আঁচে কড়া সোনালী করে ভেজে নেয়া সুস্বাদু ও সুঘ্্রাণ সমৃদ্ধ মুগ ডাল।', price: 160, unit: 'kg' },
    { title: 'তাজা ছোলার ডাল বা বুটের ডাল', descBn: 'হালকা সিদ্ধ করলেই গলে যাওয়া দেশী কড়া পুষ্টিকর বুটের বা ছোলার ডাল।', price: 110, unit: 'kg' },
    { title: 'ক্ষেতের দেশী লাল গম (পুষ্ট দানা)', descBn: 'আটা তৈরির জন্য অত্যন্ত পুষ্ট ও খড়খড়ে লাল গম যা সুষম পুষ্টি দেয়।', price: 52, unit: 'kg' },
    { title: 'সবুজ পুষ্ট কচি সুইট কর্ন ভুট্টা', descBn: 'সেদ্ধ করে মাখন দিয়ে খাওয়ার জন্য তাজা মিষ্টি হলুদ দানার সুইট কর্ন ভুট্টা।', price: 60, unit: 'piece' },
    { title: 'দেশী খেসারির ডাল শুষ্ক কড়া', descBn: 'রমজান মাসে পেঁয়াজু তৈরির আসল খেসারী ডালের পরিষ্কার দানা।', price: 95, unit: 'kg' },
    { title: 'মাসকলাই ডাল শুষ্ক আস্ত (দেশি জাত)', descBn: 'দেশি ঐতিহ্যবাহী মাসকলাই ডাল যা রান্নার পর দারুণ ঘন ও পিচ্ছিল সুস্বাদু ঝোল দেয়।', price: 150, unit: 'kg' },
    { title: 'লাল গমের আটা আস্ত লাল (ঢেঁকি ভাঙা)', descBn: 'খোসা সহ লাল গমের ভাঙা তাজা আটা, নরম লাল ডায়াবেটিক রুটি তৈরির উপযোগী।', price: 65, unit: 'kg' },
    { title: 'হালকা ও নরম তাজা বার্লি দানা', descBn: 'হজম শক্তি বাড়াতে এবং তরল ডায়েটে থাকা রোগীদের সেরা মচমচে বার্লি বা যব।', price: 120, unit: 'kg' },
    { title: 'দেশি কাউন চাল পুষ্টিকর দানা', descBn: 'কাউনের চাল যা দিয়ে পায়েস বা খিচুড়ি রান্না অনেক সুস্বাদু ও দারুণ উপাদেয়।', price: 130, unit: 'kg' }
  ]
};

// Programmatic compilation of exactly 150 products (15 items x 10 categories)
export const demoProducts: Product[] = [];

let globIdx = 1;
CATEGORIES.forEach((cat) => {
  const items = itemsCategorized[cat.id] || [];
  items.forEach((item, itemIdx) => {
    // Round-robin assigning farmers (f1 to f30)
    const farmerIdx = (globIdx - 1) % demoFarmers.length;
    const farmer = demoFarmers[farmerIdx];
    
    // Set 3-5 images for multi-image requirement using Unsplash category images with variations
    const catImgs = categoryImages[cat.id] || categoryImages['vegetables'];
    const pImages: string[] = [];
    // Distribute 4 unique seeds
    for (let s = 0; s < 4; s++) {
      const imgBase = catImgs[s % catImgs.length];
      // Append subtle query variation so they register as separate distinct images
      pImages.push(`${imgBase}&sig=${globIdx}-${s}`);
    }

    const price = item.price;
    const discountPrice = item.isDiscount ? Math.round(price * 0.85) : undefined; // 15% discount if flagged
    const rating = parseFloat((4.0 + (globIdx % 11) * 0.1).toFixed(1));

    demoProducts.push({
      id: `p${globIdx}`,
      title: item.title,
      description: item.descBn,
      price: price,
      discountPrice: discountPrice,
      category: cat.id,
      farmerId: farmer.id,
      farmerName: farmer.name,
      rating: rating > 5.0 ? 5.0 : rating,
      stock: 30 + ((globIdx * 7) % 150), // Realistic inventory stock
      images: pImages,
      isVerified: farmer.verified,
      isReadyToCook: cat.id === 'ready-to-cook'
    });

    globIdx++;
  });
});

export const demoReviews: Review[] = [
  {
    id: 'r1',
    customerName: 'Rahim Uddin',
    avatar: 'R',
    rating: 5,
    comment: 'খুব টাটকা সবজি পেয়েছি, সময়মতো ডেলিভারি হয়েছে। সরাসরি কৃষকের পণ্য, কোনো ভেজাল বা মেডিসিন নেই!',
    productName: 'রাজশাহী আমগাছের পাকা গোপালভোগ আম',
    location: 'Rajshahi',
    isVerifiedPurchase: true
  },
  {
    id: 'r2',
    customerName: 'Ayesha Sultana',
    avatar: 'A',
    rating: 5,
    comment: 'রেডি-টু-কুক আইটেম খুব ভালো ছিল, quality অসাধারণ। পেঁয়াজ আর আলু কুচানো এতটাই ফ্রেশ লেগেছে যে রান্নার সময় অর্ধেক বেঁচে যায়।',
    productName: 'ধোয়া ও কাটা দেশী মুরগির হাড়-মাংস টুকরো',
    location: 'Dhaka',
    isVerifiedPurchase: true
  },
  {
    id: 'r3',
    customerName: 'Karim Mia',
    avatar: 'K',
    rating: 5,
    comment: 'পুকুরের তাজা রুই মাছ ও দেশী মুরগি অনেক ভালো লেগেছে। প্যাকেজিংটা খুব দারুণ ছিল, একদম বরফে ঢাকা!',
    productName: 'পুকুরের তাজা বড় রুই মাছ (৩ কেজি+)',
    location: 'Chittagong',
    isVerifiedPurchase: true
  },
  {
    id: 'r4',
    customerName: 'Fatema Begum',
    avatar: 'F',
    rating: 5,
    comment: 'আখের লাল গুড় একদম কড়া খাঁটি ছিল। চা বানিয়ে খেয়েছি স্বাদ এবং ঘ্রাণ সত্যিই অসাধারণ। কোনো কেমিক্যাল গন্ধ নেই।',
    productName: 'কুষ্টিয়ার আখের লাল গুড় (প্রাকৃতিক)',
    location: 'Bogra',
    isVerifiedPurchase: true
  },
  {
    id: 'r5',
    customerName: 'Abul Kalam',
    avatar: 'A',
    rating: 5,
    comment: 'সুন্দরবনের খলিসা মধু অর্ডার দিয়েছিলাম, গুণগত মান সত্যিই প্রশংসনীয়। সর্দি-কাশির ওষুধ হিসেবে খুব কাজে দিচ্ছে।',
    productName: 'সুন্দরবনের ১০০% খাঁটি খলিসা মধু',
    location: 'Sylhet',
    isVerifiedPurchase: true
  },
  {
    id: 'r6',
    customerName: 'Rokeya Yasmin',
    avatar: 'R',
    rating: 4,
    comment: 'রেডি-টু-কুক কাটা লাউ ও পটল খুব পরিষ্কার পরিচ্ছন্ন ছিল। ঢাকার ব্যস্ত জীবনে এটা অত্যন্ত বড় একটা সাহায্য।',
    productName: 'সালাদ বক্স (শসা, টমেটো, গাজর, ধনেপাতা স্লাইস)',
    location: 'Khulna',
    isVerifiedPurchase: true
  },
  {
    id: 'r7',
    customerName: 'Nurul Islam',
    avatar: 'N',
    rating: 5,
    comment: 'সরাসরি কৃষকের কাছ থেকে খাঁটি ঘন গরুর দুধ কিনলাম। কোনো ভেজাল বা জল মিশ্রিত নেই, একদম ঘন খাঁটি স্বাদ!',
    productName: 'পদ্মার চরের গরুর খাঁটি ঘন তরল দুধ',
    location: 'Jessore',
    isVerifiedPurchase: true
  },
  {
    id: 'r8',
    customerName: 'Shahnaz Parvin',
    avatar: 'S',
    rating: 5,
    comment: 'ঐতিহ্যবাহী বগুড়ার মিষ্টি দই অসম্ভব সুস্বাদু ছিল। পরিবারের সবাই পছন্দ করেছে। একদম নিখুঁত ক্ষীরসা স্বাদ!',
    productName: 'বগুড়ার মিষ্টি দই ( ঐতিহ্যবাহী সরা)',
    location: 'Mymensingh',
    isVerifiedPurchase: true
  },
  {
    id: 'r9',
    customerName: 'Jashim Uddin',
    avatar: 'J',
    rating: 5,
    comment: 'চিনিগুড়া পোলাও চালের সুবাস চমৎকার। বিরিয়ানি রান্না করে খেয়েছি, ঘ্রাণ পুরো ঘর মোহিত করে ফেলেছিল।',
    productName: 'পাহাড়ী চিনিগুড়া সুগন্ধি পোলাও চাল',
    location: 'Rangpur',
    isVerifiedPurchase: true
  }
];
