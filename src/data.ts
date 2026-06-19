/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Farmer, Product, Review, BlogPost, SiteSettings } from './types';

export const CATEGORIES = [
  { id: 'vegetables', nameBn: 'তাজা শাকসবজি', nameEn: 'Vegetables', icon: 'Leaf' },
  { id: 'fruits', nameBn: 'তাজা ফলমূল', nameEn: 'Fruits', icon: 'Apple' },
  { id: 'fish', nameBn: 'নদী-বিলের মাছ', nameEn: 'Fish', icon: 'Fish' },
  { id: 'meat', nameBn: 'মিট ও পোল্ট্রি', nameEn: 'Meat & Poultry', icon: 'Beef' },
  { id: 'eggs', nameBn: 'ডেইরি ও ডিম', nameEn: 'Dairy & Eggs', icon: 'Egg' },
  { id: 'ready-to-cook', nameBn: 'রেডি-টু-কুক', nameEn: 'Ready To Cook', icon: 'ChefHat' }
];

export const DISTRICTS = [
  'Rajshahi', 'Jessore', 'Rangpur', 'Bogra', 'Sylhet', 
  'Comilla', 'Dinajpur', 'Barisal', 'Mymensingh', 'Kushtia',
  'Natore', 'Sherpur', 'Netrokona', 'Tangail', 'Faridpur'
];

// 70+ Demo Verified Farmers (50 male, 25 female = 75 total)
const maleNames = [
  'Abdur Rahman', 'Fazle Rabbi', 'Mofizur Rahman', 'Zakir Hossain', 'Jamal Uddin',
  'Mizanur Rahman', 'Korim Sheikh', 'Hasan Ali', 'Anisur Rahman', 'Kazi Shamim',
  'Babul Mia', 'Selim Chowdhury', 'Rafiqul Islam', 'Sujon Ahmed', 'Monirul Islam',
  'Shafiqul Alom', 'Kamrul Hasan', 'Yusuf Ali', 'Amanullah Sheikh', 'Tariqul Islam',
  'Elias Kazi', 'Saiful Bari', 'Aslam Patwary', 'Habibur Rahman', 'Faruk Ahmed',
  'Biplob Hossain', 'Nasir Uddin', 'Altaf Ali', 'Liton Bepari', 'Milon Sheikh',
  'Zillur Rahman', 'Aynal Haque', 'Rashedul Islam', 'Sohan Ahmed', 'Al-Amin Khan',
  'Jahangir Alom', 'Mamun Bepari', 'Asaduzzaman', 'Sadequr Rahman', 'Golam Mostofa',
  'Obaidul Islam', 'Mostafizur', 'Naimur Rahman', 'Riyaj Uddin', 'Siddiqur Rahman',
  'Tofazzal Hossain', 'Baharul Islam', 'Khorshed Alom', 'Manik Mia', 'Mofizul Islam'
];

const femaleNames = [
  'Ayesha Begum', 'Fatema Khatun', 'Sultana Razia', 'Rokeya Khanom', 'Nasrin Akter',
  'Rabeya Bosri', 'Tahmina Parvin', 'Shahnaz Begum', 'Moriom Nesa', 'Jesmin Ara',
  'Laili Arjumand', 'Kohinoor Begum', 'Rehana Sultana', 'Parvin Akter', 'Sajeda Begum',
  'Zahanara Alam', 'Sabiha Yesmin', 'Nurun Nahar', 'Farhana Begum', 'Monowara Nesa',
  'Begum Rokeya', 'Amena Khatun', 'Bilkis Ara', 'Shila Chowdhury', 'Morjina Begum'
];

// Royalty free farm-themed image assets for gallery and logo
const farmLogos = [
  'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=150&auto=format&fit=crop&q=40',
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=150&auto=format&fit=crop&q=40',
  'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=150&auto=format&fit=crop&q=40',
  'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=150&auto=format&fit=crop&q=40'
];

const generalFarmerGalleries = [
  [
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&auto=format&fit=crop&q=50',
    'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&auto=format&fit=crop&q=50',
    'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=500&auto=format&fit=crop&q=50',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&auto=format&fit=crop&q=50'
  ],
  [
    'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=500&auto=format&fit=crop&q=50',
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=50',
    'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop&q=50',
    'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500&auto=format&fit=crop&q=50'
  ],
  [
    'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&auto=format&fit=crop&q=50',
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=500&auto=format&fit=crop&q=50',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=50',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500&auto=format&fit=crop&q=50'
  ]
];

export const demoFarmers: Farmer[] = [
  {
    id: 'f70',
    name: 'সাইফুল ইসলাম',
    gender: 'male',
    district: 'Gazipur',
    address: 'গ্রাম: দক্ষিণ খড়া চর, কাপাসিয়া, গাজীপুর, বাংলাদেশ',
    rating: 4.8,
    verified: true,
    productCount: 4,
    salesCount: 120,
    avatar: 'https://drive.google.com/file/d/1MNAxsXgBPgWUgOdlTJNgtuUbyMgsa1LP/view?usp=sharing',
    phone: '01983790476',
    status: 'Approved',
    balance: 5000,
    farmLogo: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=150&auto=format&fit=crop&q=40',
    farmType: 'অর্গানিক সবজি ও শস্য খামার',
    videoPlaceholder: 'https://youtube.com/shorts/iRHqWnxj-jU?feature=share',
    youtubeVideos: [
      'https://youtube.com/shorts/iRHqWnxj-jU?feature=share',
      'https://youtube.com/shorts/oLgAz7tiS-Y?feature=share'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&auto=format&fit=crop&q=50'
    ],
    story: 'আমি সাইফুল ইসলাম, দক্ষিণ খড়া চরের একজন গর্বিত কৃষক। সম্পূর্ণ বিষমুক্ত ও প্রাকৃতিক উপায়ে আমি আমার ফসলের চাষাবাদ করে থাকি। সরাসরি কৃষক বাজার প্ল্যাটফর্মে আমার তাজা ফসল আপনাদের হাতে তুলে দিতে পেরে আমি অত্যন্ত আনন্দিত।'
  },
  {
    id: 'f71',
    name: 'মান্নান হোসেন',
    gender: 'male',
    district: 'Gazipur',
    address: 'গ্রাম: দক্ষিণ খড়া চর, কাপাসিয়া, গাজীপুর, বাংলাদেশ',
    rating: 4.9,
    verified: true,
    productCount: 5,
    salesCount: 154,
    avatar: 'https://drive.google.com/file/d/19088gWf6qduPvGC8v1eC1NpvqhuCoGzC/view?usp=sharing',
    phone: '01773309831',
    status: 'Approved',
    balance: 6200,
    farmLogo: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=150&auto=format&fit=crop&q=40',
    farmType: 'খাঁটি বীজ ও শাকসবজি দুগ্ধ খামার',
    videoPlaceholder: 'https://youtube.com/shorts/oLgAz7tiS-Y?feature=share',
    youtubeVideos: [
      'https://youtube.com/shorts/4iph-cQWg3g?feature=share',
      'https://youtube.com/shorts/ivdux5l52TY?feature=share'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500&auto=format&fit=crop&q=50'
    ],
    story: 'আমার নাম মান্নান হোসেন। দক্ষিণ খড়া চর এলাকায় আমি সুদীর্ঘ ১৭ বছর যাবত দুগ্ধ ও জৈব কৃষি চাষাবাদের সাথে জড়িত। আধুনিক কৃষি প্রযুক্তির চমৎকার সমন্বয়ে সম্পূর্ণ স্বাস্থ্যকর পদ্ধতিতে উৎপাদিত ফসল আমাদের খামার থেকে আপনাদের নিকট পৌঁছে দিই।'
  },
  {
    id: 'f72',
    name: 'সুরুজ মিয়া',
    gender: 'male',
    district: 'Gazipur',
    address: 'গ্রাম: দক্ষিণ খড়া চর, কাপাসিয়া, গাজীপুর, বাংলাদেশ',
    rating: 4.7,
    verified: true,
    productCount: 3,
    salesCount: 98,
    avatar: 'https://drive.google.com/file/d/1j_Rh0oDaxrMsrkSgig9BGe1ufm2Z2jK5/view?usp=sharing',
    phone: '01898455623',
    status: 'Approved',
    balance: 4100,
    farmLogo: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=150&auto=format&fit=crop&q=40',
    farmType: 'উন্নত ফল ও সবজি খামার',
    videoPlaceholder: 'https://youtube.com/shorts/4iph-cQWg3g?feature=share',
    youtubeVideos: [
      'https://youtube.com/shorts/n6TW95vbqxo?feature=share',
      'https://youtube.com/shorts/lXgJgxP9frU?feature=share'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500&auto=format&fit=crop&q=50'
    ],
    story: 'আসসালামু আলাইকুম, আমি সুরুজ মিয়া। দক্ষিণ খড়া চরের উর্ভর মাটিতে আমি ফল ও বিষমুক্ত শাকসবজি চাষ করে আসছি। কৃষক বাজার প্ল্যাটফর্মের মাধ্যমে আপনাদেরকে আমাদের খামারের তরতাজা ফসল দিতে পেরে আমি অত্যন্ত ধন্য।'
  },
  {
    id: 'f73',
    name: 'ফিরোজ কবির',
    gender: 'male',
    district: 'Gazipur',
    address: 'গ্রাম: দক্ষিণ খড়া চর, কাপাসিয়া, গাজীপুর, বাংলাদেশ',
    rating: 4.9,
    verified: true,
    productCount: 6,
    salesCount: 210,
    avatar: 'https://drive.google.com/file/d/1MHmWiLIh1nYbKjWXjWdiTNPhQ9hNobNy/view?usp=sharing',
    phone: '01383109858',
    status: 'Approved',
    balance: 8900,
    farmLogo: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=150&auto=format&fit=crop&q=40',
    farmType: 'সমন্বিত মৎস্য ও তরকারি খামার',
    videoPlaceholder: 'https://youtube.com/shorts/ivdux5l52TY?feature=share',
    youtubeVideos: [
      'https://youtube.com/shorts/iRHqWnxj-jU?feature=share',
      'https://youtube.com/shorts/oLgAz7tiS-Y?feature=share'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&auto=format&fit=crop&q=50'
    ],
    story: 'আমি ফিরোজ কবির। দক্ষিণ খড়া চরের মাটিতে সম্পূর্ণ অরগানিক ও বিশুদ্ধ উপায়ে সবজি ও মাছের চাষ করে আসছি। মধ্যস্বত্বভোগীদের অবসান ঘটিয়ে ন্যায্যমূল্যে সেরা সামগ্রী আপনাদের দোরগোড়ায় পৌঁছে দেওয়াই আমার অঙ্গীকার।'
  },
  {
    id: 'f74',
    name: 'ডাঃ মোতালেব',
    gender: 'male',
    district: 'Gazipur',
    address: 'গ্রাম: দক্ষিণ খড়া চর, কাপাসিয়া, গাজীপুর, বাংলাদেশ',
    rating: 5.0,
    verified: true,
    productCount: 7,
    salesCount: 305,
    avatar: 'https://drive.google.com/file/d/1AzCoUHkxFKYTjVJXJm3cvELpIBUPdsMb/view?usp=sharing',
    phone: '01822821838',
    status: 'Approved',
    balance: 12500,
    farmLogo: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=150&auto=format&fit=crop&q=40',
    farmType: 'সমন্বিত হর্টিকালচার ও ডেইরি ফার্ম',
    videoPlaceholder: 'https://youtube.com/shorts/n6TW95vbqxo?feature=share',
    youtubeVideos: [
      'https://youtube.com/shorts/4iph-cQWg3g?feature=share',
      'https://youtube.com/shorts/ivdux5l52TY?feature=share'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500&auto=format&fit=crop&q=50',
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=500&auto=format&fit=crop&q=50'
    ],
    story: 'আমি ডাঃ মোতালেব। দক্ষিণ খড়া চর অঞ্চলে কৃষি ও পশুপালনের এক আদর্শ খামার গড়ে তুলেছি। বৈজ্ঞানিক পদ্ধতিতে রাসায়নিকমুক্ত খাদ্য উৎপাদন নিশ্চিত করাই আমার প্রধান ও একমাত্র উদ্দেশ্য।'
  }
];

// 4 high-quality categories images
const categoryImages: Record<string, string[]> = {
  vegetables: [
    'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=500&auto=format&fit=crop&q=60'
  ],
  fruits: [
    'https://images.unsplash.com/photo-1519098901909-b1553a1190af?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&auto=format&fit=crop&q=60'
  ],
  rice: [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=500&auto=format&fit=crop&q=60'
  ],
  fish: [
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&auto=format&fit=crop&q=60'
  ],
  meat: [
    'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1532407191490-e4066c1500d4?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1529692236671-f1f6e9481b2?w=500&auto=format&fit=crop&q=60'
  ],
  organic: [
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60'
  ],
  greens: [
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1628773822503-930a840000a9?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1551893086-c297eedfa830?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1584306380122-6b94e3e3b7b6?w=500&auto=format&fit=crop&q=60'
  ],
  'ready-to-cook': [
    'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1515003844-1098154e7f68?w=500&auto=format&fit=crop&q=60'
  ]
};

const itemsCategorized: Record<string, Array<{title: string, descBn: string, price: number, unit: string, isDiscount?: boolean, image?: string, images?: string[]}>> = {
  vegetables: [
    { title: 'বালু মাটির গোল লাল আলু (Red Potato)', descBn: 'বগুড়ার বিখ্যাত সুস্বাদু বালু মাটির গোল লাল আলু। তরকারিতে স্বাদ বৃদ্ধি করে।', price: 42, unit: 'kg' },
    { title: 'যশোরের তাজা তাল বেগুন (Big Tall Brinjal)', descBn: 'যশোরের বিখ্যাত নরম ও বীজহীন চমৎকার বেগুন, পোড়ানোর জন্য অত্যন্ত পুষ্টিকর ও সেরা।', price: 68, unit: 'kg' },
    { title: 'ফরিদপুরের পেঁয়াজ (Local Red Onion)', descBn: 'দেশি ঝাঁঝালো নতুন ফরিদপুরের লাল পেঁয়াজ। রান্নার মূল সুস্বাদু মসলাদার উপাদান।', price: 85, unit: 'kg' },
    { title: 'দেশী বড় কোয়ার শুষ্ক রসুন (Garlic)', descBn: 'অর্গানিক উপায়ে বুনো জমিতে উৎপাদিত বড় কোয়ার দেশী কড়া ঝাঁঝ রসুনের সেরা কোয়ালিটি।', price: 140, unit: 'kg' },
    { title: 'কুষ্টিয়ার কচি আঁশহীন আদা (Local Ginger)', descBn: 'ঝাঁঝালো চমৎকার দেশি সোনালী আদা, সরাসরি ক্ষেত থেকে সংগৃহীত।', price: 175, unit: 'kg' },
    { title: 'তিস্তা চরের সবুজ কচি পটল (Pointed Gourd)', descBn: 'নরম কচি ও পাতলা খোসাযুক্ত তরতাজা সবুজ কচি পটল, প্রতিদিনের সুস্বাদু ভাজিতে অসাধারণ।', price: 48, unit: 'kg' },
    { title: 'কুমিল্লার বড় তেতো করলা (Bitter Gourd)', descBn: 'তিক্ত স্বাদের কিন্তু অত্যন্ত পুষ্টিকর ও ঔষধি গুণসম্পন্ন তরতাজা করলা বা উচ্ছে।', price: 62, unit: 'kg' },
    { title: 'নরম কচি লম্বা লাউ (Fresh Bottle Gourd)', descBn: 'কচি ডগাসমেত কচি মিষ্টি লাউ, সম্পূর্ণ কেমিক্যাল মুক্ত সুস্বাদু পানি লাউ।', price: 55, unit: 'piece' },
    { title: 'হলুদ মিষ্টি কুমড়া আস্ত (Sweet Pumpkin)', descBn: 'পাকা কড়া মিষ্টি কুমড়া আস্ত, চমৎকার স্বাদ ও তরকারির রাজকীয় পুষ্টি বাড়াবে।', price: 45, unit: 'kg' },
    { title: 'মেহেরপুরের কচি নরম ঢেঁড়শ (Fresh Okra)', descBn: 'কচি নরম সবুজ ভেন্ডি বা ঢেঁড়শ, সকালের পুষ্টিকর ভাজিতে এক অমলিন স্বাদ।', price: 50, unit: 'kg' },
    { title: 'সাদা বড় তাজা ফুলকপি (White Cauliflower)', descBn: 'তাজা ও পরিষ্কার পোকা মুক্ত গোল কড়া সাদা পাতাযুক্ত ফুলকপি।', price: 45, unit: 'piece' },
    { title: 'নরসিংদীর কচি বাঁধাকপি (Fresh Cabbage)', descBn: 'মিষ্টি ও সুস্বাদু কচি পাতাযুক্ত তরতাজা নরসিংদীর বাঁধাকপি।', price: 35, unit: 'piece' },
    { title: 'লাল চেরি টমেটো প্রিমিয়াম (Premium Red Cherry Tomatoes)', descBn: 'অর্গানিক ও টসটসে মিষ্টি কচি চেরি টমেটো লাল প্যাক।', price: 180, unit: 'kg', image: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_cherry_tomatoes.png' },
    { title: 'তাজা ক্যাপসিকাম সবুজ (Fresh Green Capsicum)', descBn: 'ভিটামিন সি সমৃদ্ধ কচি তাজা ও কুড়মুড়ে শাহি ক্যাপসিকাম।', price: 260, unit: 'kg', image: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_green_capsicum.png' },
    { title: 'জৈব লাল আলু মিষ্টিকন্দ (Sweet Sweet Potato)', descBn: 'নরম সুস্বাদু আঁশছাড়া পুষ্টিকর লাল মিষ্টি আলু।', price: 75, unit: 'kg', image: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_sweet_potato.png' },
    { title: 'নরসিংদীর কচি কাঁচা পেঁপে (Green Papaya)', descBn: 'তরকারির জন্য অতি উত্তম ও পুষ্টিকর কচি নরম পানি পেঁপে।', price: 40, unit: 'kg', image: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_green_papaya.png' },
    { title: 'বিলাতি ধনেপাতা তাজা আঁটি (Eryngium Foetidum)', descBn: 'কড়া সুগন্ধযুক্ত বড় পাতার বিলাতি তাজা সুস্বাদু ধনেপাতা।', price: 30, unit: 'bundle', image: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_coriander.png' }
  ],
  fruits: [
    { title: 'রাজশাহীর মিষ্টি ফজলি আম (Fazli Mango)', descBn: 'রাজশাহীর বাঘা থেকে সংগৃহীত অত্যন্ত মিষ্টি ও রসালো তাজা ফজলি আম।', price: 150, unit: 'kg' },
    { title: 'নরসিংদীর সুস্বাদু সাগর কলা (Sagor Banana)', descBn: 'নরসিংদীর বিখ্যাত মিষ্টি ও পুষ্টিকর কচি তাজা সাগর কলার ডজন প্যাক।', price: 90, unit: 'dozen' },
    { title: 'রসালো মিষ্টি মাল্টা ফল গ্রেড-এ (Malta Fruit)', descBn: 'ভিটামিন সি সমৃদ্ধ অত্যন্ত পুষ্টিকর রসালো ও মিষ্টি কচি মাল্টা ফল।', price: 220, unit: 'kg' },
    { title: 'ক্ষেতের কচি মিষ্টি পেয়ারা (Sweet Guava)', descBn: 'ক্ষেত থেকে সদ্য সংগৃহীত অর্গানিক ও কুড়মুড়ে তাজা সবুজ পেয়ারা।', price: 70, unit: 'kg' },
    { title: 'রংপুরের মিষ্টি রসালো তরমুজ আস্ত (Watermelon)', descBn: 'গ্রীষ্মের গরমে শরীর জুড়ানো অত্যন্ত মিষ্টি ও লাল টসটসে কচি তরমুজ।', price: 180, unit: 'piece' },
    { title: 'পাহাড়ি তাজা ড্রাগন ফল লাল (Red Dragon Fruit)', descBn: 'রসালো ও আকর্ষণীয় লাল কুসুমের পুষ্টিকর ও মিষ্টি ড্রাগন ফল।', price: 280, unit: 'kg', image: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_dragon_fruit.png' },
    { title: 'কক্সবাজারের মিষ্টি আনারস আস্ত (Sweet Honey Pineapple)', descBn: 'কক্সবাজার পাহাড়ের বিখ্যাত মধুর মতো মিষ্টি তাজা বড় আনারস।', price: 65, unit: 'piece', image: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_pineapple.png' },
    { title: 'রসালো লাল ফুজি আপেল গ্রেড-এ (Red Fuji Apple)', descBn: 'অত্যন্ত কুড়মুড়ে মিষ্টি ও সুস্বাদু তাজা লাল আমদানি করা ফুজি আপেল।', price: 290, unit: 'kg', image: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_red_apple.png' },
    { title: 'টাটকা সবুজ বরই বা কুল (Sweet Green Jujube)', descBn: 'মিষ্টি ও টক মিক্সড তাজা বাও কুল চাটনি বানানোর উপযোগী।', price: 110, unit: 'kg', image: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_green_jujube.png' },
    { title: 'মিষ্টি রসালো কমলা লেবু (Juicy Sweet Orange)', descBn: 'ভিটামিন ও রসে ভরপুর কচি তাজা সুমিষ্টি কমলা লেবুর সেট।', price: 240, unit: 'kg', image: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/Gemini_Generated_Image_oranges.png' }
  ],
  rice: [
    { title: 'প্রিমিয়াম সুগন্ধি চিনিগুঁড়া চাল (Chinigura Rice)', descBn: 'খাঁটি চিনিগুঁড়া সুগন্ধি পোলাও চাল, যা দিয়ে রান্না হবে দারুণ ও জাদুকরী সুঘ্রাণযুক্ত পোলাও-পায়েস।', price: 150, unit: 'kg' },
    { title: 'যশোরের সুপার বালাম চাল (Balam Rice)', descBn: 'যশোরের ঐতিহ্যবাহী ঝরঝরে ও পুষ্টিকর বালাম চাল, দৈনন্দিন রান্নার জন্য সেরা পছন্দ।', price: 85, unit: 'kg' },
    { title: 'প্রিমিয়াম নাজিরশাইল চাল (Nazirshail Rice)', descBn: 'অত্যন্ত ঝরঝরে ও পুষ্টিকর লম্বা দানার নাজিরশাইল চাল যা সহজেই হজমযোগ্য।', price: 92, unit: 'kg' },
    { title: 'আত্রাইয়ের মিনিকেট চাল (Miniket Rice)', descBn: 'তাজা ও পরিষ্কার চাল, কোনো রকম চকচকে কেমিক্যাল পোলিশ ছাড়াই প্রাকৃতিকভাবে প্রস্তুত।', price: 68, unit: 'kg' },
    { title: 'কুষ্টিয়ার ক্যাটসআই বাবাসমতি চাল (Basmati Rice)', descBn: 'অতি লম্বা দানার ও দীর্ঘ সুবাসিত বাসমতি চাল, বিরিয়ানি ও রাজকীয় রান্নার জন্য অনন্য।', price: 220, unit: 'kg' },
    { title: 'খাঁটি কুষ্টিয়ার লাল চাল (Organic Brown Rice)', descBn: 'কোনো কৃত্রিম ছাঁটাই ছাড়া তৈরি ভিটামিন ও ফাইবার সমৃদ্ধ খাঁটি পুষ্টিকর লাল চাল।', price: 110, unit: 'kg' },
    { title: 'দিনাজপুরের প্রিমিয়াম কাটারিভোগ চাল (Kataribhog)', descBn: 'দিনাজপুরের বিখ্যাত কাটারিভোগ চাল যা চমৎকার সুঘ্রাণ ও আঠালোহীন স্বাদের জন্য পরিচিত।', price: 125, unit: 'kg' },
    { title: 'বান্দরবানের পাহাড়ি জুম চাল (Traditional Jum Rice)', descBn: 'পার্বত্য অঞ্চলের উপজাতিদের চাষ করা সম্পূর্ণ প্রাকৃতিক ও রাসায়নিক সার ছাড়া জুম চাল।', price: 140, unit: 'kg' },
    { title: 'কালীজিরা পোলাও চাল খাঁটি সুগন্ধি (Kalijira Rice)', descBn: 'ক্ষুদ্র দানা বিশিষ্ট অত্যন্ত সুবাসিত কালীজিরা পোলাও চাল, সরাসরি উত্তরবঙ্গ থেকে সংগৃহীত।', price: 165, unit: 'kg' },
    { title: 'পাইজাম সিদ্ধ চাল সুপার ফ্রেশ (Paijam Rice)', descBn: 'সুলভ মূল্যে দৈনন্দিন পরিবারের পুষ্টি চাহিদার জন্য চমৎকার পরিষ্কার পাইজাম চাল।', price: 62, unit: 'kg' },
    { title: 'সোনার আঠালো বিন্নি চাল (Sweet Binni Rice)', descBn: 'ঐতিহ্যবাহী কড়া আঠালো সুস্বাদু বিন্নি চাল যা পিঠা-পুলি বানানোর জন্য অত্যন্ত চমৎকার।', price: 130, unit: 'kg' },
    { title: 'খাপড়া লাল ব্রি-২৯ আস্ত চাল (BR-29 Rice)', descBn: 'দৈনন্দিন ভাতের জন্য সাশ্রয়ী মূল্যে অত্যন্ত পুষ্টিকর ও চমৎকার আস্ত ব্রি চাল।', price: 58, unit: 'kg' },
    { title: 'সিদ্ধ চিনিशাইল ভাত চাল (Chanishail Rice)', descBn: 'ঝরঝরে ও মাঝারি ওজনের পুষ্টিকর চিনিশাইল সিদ্ধ চাল, সরাসরি আড়ত থেকে সংগৃহীত।', price: 78, unit: 'kg' },
    { title: 'জৈব আতপ আমন চাল (Amon Atop Rice)', descBn: 'নতুন আমন ধানের সুগন্ধি ছড়ানো আতপ চাল যা পিঠে-পুলি ও পায়েসের স্বাদ ১০ গুণ বাড়ায়।', price: 82, unit: 'kg' },
    { title: 'মৌসুমী হাস্কিং চাল স্পেশাল (Natural Husked Rice)', descBn: 'খাঁটি হাস্কিং মিলের ভাঙানো কুঁড়োযুক্ত সুপার পুষ্টিকর সোনালী চাল।', price: 72, unit: 'kg' }
  ],
  fish: [
    { title: 'দিঘির তাজা জ্যান্ত বড় রুই (Giant Rui Fish)', descBn: 'নিজেদের বড় দিঘি থেকে জ্যান্ত ধরা রুই মাছ। আঁশ ছাড়ানো কড়া ফ্রেশ।', price: 390, unit: 'kg' },
    { title: 'হাওরের বিলের চকচকে বড় কাতলা (Katla Fish)', descBn: 'বিলের প্রাকৃতিক শ্যাওলা খেয়ে বড় হওয়া ও অত্যন্ত সুস্বাদু কচি কাতলা মাছ।', price: 420, unit: 'kg' },
    { title: 'খুলনার মিষ্টি জলের তাজা বাগদা চিংড়ি (Bagda Prawn)', descBn: 'খুলনার লোনা জলের ঘের থেকে সংগৃহীত বড় মাথাওয়ালা চকচকে বাগদা চিংড়ি।', price: 880, unit: 'kg' },
    { title: 'নদীর বড় পুরুষ গলদা চিংড়ি (Golda Prawn)', descBn: 'বড় আকারের নীল দাড়া যুক্ত সুস্বাদু পুরুষ গলদা চিংড়ি। অত্যন্ত রসালো মাংস।', price: 1150, unit: 'kg' },
    { title: 'Haoorer কালো কুচকুচে জ্যান্ত শিং মাছ (Singi Fish)', descBn: 'সম্পূর্ণ প্রাকৃতিক জলাশয়ের পুষ্টিকর ও লৌহ সমৃদ্ধ বিলের শিং মাছ।', price: 660, unit: 'kg' },
    { title: 'দেশী জ্যান্ত মাগুর মাছ লোকাল (Magur Fish)', descBn: 'শারীরিক দুর্বলতা কাটাতে সেরা নদী ও জলাশয়ের হৃষ্টপুষ্ট দেশী মাগুর মাছ।', price: 720, unit: 'kg' },
    { title: 'নদী থেকে সদ্য ধৃত সুস্বাদু পাবদা মাছ (Pabda)', descBn: 'পরিষ্কার নদীর জলের অত্যন্ত নরম মাছ যা ধনেপাতা ভাঁজিতে অসাধারণ লাগে।', price: 490, unit: 'kg' },
    { title: 'মেঘনা নদীর গভীরের তাজা বড় আইড় মাছ (Ayre Fish)', descBn: 'আইড় মাছ নদীর গভীর জলের খাঁটি স্বাদ চর্বিসমৃদ্ধ ও সম্পূর্ণ আশহীন।', price: 980, unit: 'kg' },
    { title: 'চলনবিলের বড় তাজা বোয়াল মাছ (Boal Fish)', descBn: 'বিল থেকে আস্ত ধৃত চর্বিযুক্ত কড়া তাজা বোয়াল মাছের কারি কাট পিস।', price: 830, unit: 'kg' },
    { title: 'মিষ্টি জলের পুকুরের তাজা তেলাপিয়া (Tilapia)', descBn: 'সবচেয়ে সুলভ অথচ পুষ্টিকর তাজা ভেষজ ফিড খাওয়ানো সুস্বাদু তেলাপিয়া।', price: 215, unit: 'kg' },
    { title: 'হাওরের কচি টেংরা মাছ কারি (Tengra Fish)', descBn: 'ছোট দেশী টেংরা মাছ, পেঁয়াজ ও টমেটো দিয়ে চচ্চড়ি রান্নার রাজকীয় সুবাস।', price: 560, unit: 'kg' },
    { title: 'সমুদ্রের তাজা রুপালী রূপচাঁদা মাছ (Rupchanda)', descBn: 'কক্সবাজার সমুদ্র থেকে ধৃত ফ্রেশ হিমায়িত রূপচাঁদা ফ্রাই করার জন্য চমৎকার।', price: 1250, unit: 'kg' },
    { title: 'বিলের জ্যান্ত কালো বড় শোল মাছ (Shol Fish)', descBn: 'লাফানো তাজা কালো কুচকুচে বিলের বড় শোল মাছ। কষা ভুনার জন্য সেরা।', price: 590, unit: 'kg' },
    { title: 'নদীর নরম সুস্বাদু কাচকি মাছ (Kachki Fish)', descBn: 'ছোট চকচকে রূপালী কাচকি মাছ আলু পেঁয়াজ মিক্স চচ্চড়ির জন্য অতুলনীয়।', price: 380, unit: 'kg' },
    { title: 'নদীর তাজা বেলে মাছ কারি (Bele Fish)', descBn: 'নদীর বেলে মাছ অত্যন্ত নরম ও সুস্বাদু, টমেটো চচ্চড়ির জন্য একদম উপযুক্ত।', price: 540, unit: 'kg' }
  ],
  meat: [
    { title: 'বাড়ির উঠোনে চরা দেশী মুরগি আস্ত (Local Chicken)', descBn: 'ইনজেকশন বা সাদা ফিড ছাড়া বাড়ির উঠানে চড়ে বেড়ানো আসল সুস্বাদু মিষ্টি দেশী মুরগি।', price: 460, unit: 'kg' },
    { title: 'কচি ছাগলের নরম খাসির মাংস (Fresh Mutton)', descBn: 'তরুণ কচি খাসির গন্ধহীন নরম সুস্বাদু ও পুষ্টিকর তাজা খাসির মাংস ১০০% গ্যারান্টি।', price: 1080, unit: 'kg', isDiscount: true },
    { title: 'হাড় চর্বিমুক্ত গরুর সলিড লাল মাংস (Solid Beef)', descBn: 'অতিরিক্ত হাড় ও পর্দা ছাড়া ১০০% সলিড গরুর তাজা লাল তাজা মাংস।', price: 865, unit: 'kg' },
    { title: 'ক্যালসিয়াম সমৃদ্ধ গরুর নেহারী পায়া (Nehari Bon)', descBn: 'সুপ বা নেহারী রান্নার জন্য উপযুক্ত আস্ত পায়ের হাড় ও নরম জয়েন্ট।', price: 410, unit: 'kg' },
    { title: 'ড্রেসড কোয়েল পাখির পুষ্টিকর মাংস (Quail Meat)', descBn: 'অত্যಂತ পুষ্টিকর ও সুস্বাদু বাচ্চাদের প্রিয় কচি কোয়েল পাখির ড্রেসড মাংস।', price: 85, unit: 'piece' },
    { title: 'শীতকালীন তাজা বড় বিলে চরা পাতিহাঁস (Duck)', descBn: 'শীতকালে বিলে ধান খেয়ে চর্বিসমৃদ্ধ হওয়া বড় আকারের নরম পাতিহাঁস আস্ত।', price: 560, unit: 'piece' },
    { title: 'বড় মাংসল সুস্বাদু চিনা হাঁস আস্ত (Chena Duck)', descBn: 'কালো ও সাদা পালকের বড় ওজনের নরম মিষ্টি মাংসল সুস্বাদু চিনা হাঁস।', price: 760, unit: 'piece' },
    { title: 'রক্তবর্ধক গরুর লাল তাজা কলিজা (Beef Liver)', descBn: 'সকালে রুটি ও পরোটার সাথে রান্নার জন্য নরম লোহা সমৃদ্ধ গরুর লাল কলিজা।', price: 820, unit: 'kg' },
    { title: 'রোস্টের জন্য উপযুক্ত সোনালী মুরগি (Sonali)', descBn: '৮০০ গ্রাম ওজনের সোনালী মুরগি, বিয়ে বাড়ির মনকাড়া রোস্ট তৈরির জন্য সেরা।', price: 285, unit: 'piece' },
    { title: 'বড় সুস্বাদু চর্বিযুক্ত রাজহাঁস আস্ত (Giant Goose)', descBn: 'বড় আকারের অত্যন্ত তেলসমৃদ্ধ ঐতিহ্যবাহী রাজকীয় স্বাদের দেশী রাজহাঁস।', price: 1650, unit: 'piece' },
    { title: 'চর্বিহীন পাহাড়ি মহিষের লাল মাংস (Buffalo)', descBn: 'প্রাকৃতিক ও জৈব উপায়ে বড় হওয়া গাড়ো লাল মহিষের তাজা সুস্বাদু মাংস।', price: 730, unit: 'kg' },
    { title: 'খাসির নরম মাথা ও মগজ সেট (Mutton Brain)', descBn: 'রান্নার জন্য জুতসই ফ্রেশ কড়কড়ে খাসির নরম সুস্বাদু আস্ত মগজ ও মাথা।', price: 360, unit: 'piece' },
    { title: 'কচি কবুতরের রানিং বাচ্চার জোড়া (Baby Pigeon)', descBn: 'শারীরিক জোর ও বার্ধক্যজনিত ক্লান্তি সারাতে উপযোগী নরম কচি কবুতরের বাচ্চা।', price: 360, unit: 'pair' },
    { title: 'খাসির আস্ত ভুঁড়ি পরিচ্ছন্ন (Mutton Tripe)', descBn: 'ছুলে সম্পূর্ণ সাদা ও নিখুঁত জিপলক প্যাকে ভরা খাসির কাঁচা আস্ত ভুঁড়ি।', price: 450, unit: 'kg' },
    { title: 'গরুর মগজ সুপার ফ্রেশ কলার (Beef Brain)', descBn: 'অত্যಂತ তাজা ও ওমেগা সমৃদ্ধ নরম কড়া ও সুন্দর সলিড গরুর মগজ।', price: 320, unit: 'piece' }
  ],
  eggs: [
    { title: 'লাল কুসুমযুক্ত স্পেশাল বাতির ডিম (Double Yolk)', descBn: 'প্রতিটি ডিমে জোড়া লাল কুসুম সমৃদ্ধ অত্যন্ত বিরল ও চমৎকার কড়া ডিম।', price: 210, unit: '10 pcs' },
    { title: 'পাহাড়ি চারণ কড়া লাল বুনো ডিম (Mountain Eggs)', descBn: 'পাহাড়ের খাঁচার বাইরে ছেড়ে দেওয়া মুরগির অর্গানিক পুষ্টিকর সেরা ডিম।', price: 165, unit: 'dozen' },
    { title: 'সোনালী মুরগির কচি লাল ডিম (Sonali Eggs)', descBn: 'তাজা সোনালী জাতের মুরগির কড়া কুসুমযুক্ত মাঝারী আকৃতির ডিম।', price: 140, unit: 'dozen' },
    { title: 'দেশী রাজহাঁসের বিশাল সাদা ডিম (Goose Eggs)', descBn: 'বিশাল আকারের ক্যালসিয়ামের খনি দেশী রাজহাঁসের ধবধবে সাদা ডিম।', price: 80, unit: '2 pcs' },
    { title: 'কৃষি খামারের ফার্টিলাইজড ডিম (Fertilized Eggs)', descBn: 'রানির জাতের প্রাকৃতিক ব্রিডিং থেকে সংগৃহীত অত্যন্ত পুষ্টিকর ডিম।', price: 175, unit: 'dozen' },
    { title: 'অর্গানিক মুরগির ওমেগা ফ্যাট ডিম (Premium Eggs)', descBn: 'ডায়েট ও বডি বিল্ডিংয়ের জন্য সুপারচার্জড ভিটামিন এ সমৃদ্ধ উন্নত ডিম।', price: 190, unit: 'dozen' },
    { title: 'কচি কোয়েল ডিম ডাবল ট্রিপল প্যাক (Quail Eggs)', descBn: 'পরিবারের তিন স্তরের বাচ্চাদের নাশতার জন্য পুষ্টিকর ও সুস্বাদু কচি কোয়েল ডিম।', price: 120, unit: '30 pcs' },
    { title: 'ক্যালসিয়াম সমৃদ্ধ সাদা বড় ডিম (White Eggs)', descBn: 'হাড় মজবুত করার উপাদান বুস্টেড বড় আকারের সাদা সেল ডেকোরেটিভ ডিম।', price: 130, unit: 'dozen' },
    { title: 'দেশী অর্গানিক হাঁস-মুরগি মিক্সড ডিম (Mixed Seed)', descBn: 'অর্ধেক হাঁসের এবং অর্ধেক খাঁটি দেশী মুরগির মিক্সড পুষ্টির প্যাকেজিং।', price: 160, unit: 'dozen' },
    { title: 'সাভারের তাজা দেশী হাঁসের ডিম (Local Duck Eggs)', descBn: 'সাভারের বড় বিলের হাঁসের তাজা লাল কুসুমের পুষ্টিকর ও বড় ডিমের সেরা সেট।', price: 170, unit: 'dozen' },
    { title: 'দেশী কচি কবুতরের পুষ্টিকর ডিম (Pigeon Eggs)', descBn: 'বাচ্চাদের হাঁপানি ও শারীরিক বিকাশের জন্য অত্যন্ত প্রয়োজনীয় ওষুধি কবুতর ডিম।', price: 110, unit: 'pair' },
    { title: 'হাঁসের ডিম ও ডিমের সাদা কুসুম (White Duck Eggs)', descBn: 'তাজা চারণযোগ্য হাঁসের ওষুধি কুসুমহীন খাঁটি অর্গানিক চকচকে ডিম।', price: 155, unit: 'dozen' },
    { title: 'কচি কোয়েল ডিম মাঝারি প্যাক (Quail Eggs Med)', descBn: 'বাচ্চাদের নিয়মিত সুষম সকালের নাশতার জন্য ২৫টি পুষ্টিকর কচি ডিমের প্যাক।', price: 95, unit: 'piece' },
    { title: 'খামারের তাজা সোনালী ডিম সেট (Farmed Eggs)', descBn: 'শতভাগ ফিট্রাইড মুরগির সোনালী খোলসের প্রোটিন বুস্টেড সুস্থ ডিম।', price: 135, unit: 'dozen' },
    { title: 'বাতি ও সাধারণ মুরগির মিক্সড লাল ডিম', descBn: 'সুপার শপের চেয়ে ফ্রেশ সাধারণ খাঁটি খামারের পুষ্টিকর লাল ডিম।', price: 145, unit: 'dozen' }
  ],
  honey: [
    { title: 'সুন্দরবনের খাঁটি খলিসা মধু (Kholisa Honey)', descBn: 'সুন্দরবনের বিখ্যাত খলিসা ফুলের চাক কাটা বসন্তের তরল খাঁটি সাদাটে সোনালী মধু।', price: 1220, unit: 'kg', isDiscount: true },
    { title: 'দিনাজপুরের কচি লিচু ফুলের মধু (Litchi Honey)', descBn: 'লিচু বাগান থেকে মৌমাছি দ্বারা সংগৃহীত সুঘ্রাণযুক্ত ও পাতলা মিষ্টি মধু।', price: 650, unit: 'kg' },
    { title: 'যশোরের সরিষা ফুলের জমে যাওয়া মধু (Mustard Honey)', descBn: 'সরিষা ক্ষেতের মৌচাক থেকে সংগৃহীত গ্লুকোজ সমৃদ্ধ মাখনের মতো জমে যাওয়া মধু।', price: 560, unit: 'kg' },
    { title: 'কালোজিরা ফুলের ওষুধি ঘন কালচে মধু (Blackseed Honey)', descBn: 'সকল রোগের মহৌষধ কালোজিরা ক্ষেত থেকে চাক কাটা অত্যন্ত ঘন সুস্বাদু মধু।', price: 960, unit: 'kg' },
    { title: 'বিলের বুনো বড় চাক কাটা মধু (Wild Jaggery)', descBn: 'গ্রামবাংলার বুনো নিম ও কড়ই গাছ থেকে বড় চাকে নিজে দাঁড়িয়ে কাটা তরল মধু।', price: 1150, unit: 'kg' },
    { title: 'বান্দরবানের পাহাড়ি বুনো ডার্ক মধু (Mountain Honey)', descBn: 'বান্দরবান পাহাড়ের গভীর বনের চাকে জমানো কড়া ঝাঁঝালো ও ঔষধি পাহাড়ি মধু।', price: 1420, unit: 'kg' },
    { title: 'পদ্ম ফুলের গন্ধের বিরল খাঁটি মধু (Lotus Honey)', descBn: 'মধুমতি ও বিলের লাল পদ্ম ফুলের ছোঁয়াযুক্ত দুর্লভ ও ওষুধি অত্যন্ত লাইট মধু।', price: 1650, unit: 'kg' },
    { title: 'বরই ফুলের কড়া ক্ষীর সোনালী মধু (Plum Honey)', descBn: 'রাজশাহীর বরই বাগান থেকে সংগৃহীত লালচে সোনালী রঙের অত্যন্ত মিষ্টি মধু।', price: 620, unit: 'kg' },
    { title: 'মিশ্র পাহাড়ি গাছগাছালির বুনো মধু', descBn: 'বহুমুখী ওষুধি গুণের মিশ্র বুনো গাছের ফুলের নিংড়ানো মধু যা শতভাগ ন্যাচারাল।', price: 760, unit: 'kg' },
    { title: 'ইউক্যালিপটাস কড়া ওষুধি ঝাঁঝ মধু', descBn: 'উত্তরবঙ্গের ইউক্যালিপটাস ফুল থেকে সংগৃহীত কাশি ও ঠান্ডার জন্য সেরা ওষুধি মধু।', price: 690, unit: 'kg' },
    { title: 'রাণী মৌমাছির রয়েল জেলি প্রিমিয়াম মধু', descBn: 'অ্যান্টি-এজিং ও বুস্ট সমৃদ্ধ রাণী মৌমাছির জেলি মিশ্রিত প্রিমিয়াম ডার্ক মধু।', price: 2600, unit: '500g' },
    { title: 'খাঁটি সুন্দরবনের গেওয়া মিষ্টি মধু (Gewa Honey)', descBn: 'গেওয়া ফুলের কড়া আঠা গন্ধযুক্ত নোনতা ও লাইট হালকা সোনালী রঙের মধু।', price: 970, unit: 'kg' },
    { title: 'হিমালয়ের গভীর বনের ট্রাইবাল ওয়াইল্ড মধু', descBn: 'পাহাড়ী উপজাতিদের দ্বারা ঝুঁকিপূর্ণ উঁচু পাহাড়ের চাক থেকে সংগৃহীত কড়া বুনো মধু।', price: 1550, unit: 'kg' },
    { title: 'সুন্দরবনের গরান ফুলের কড়া মিষ্টি মধু (Goran)', descBn: 'অত্যন্ত আঠালো ও গাঢ় লাল রঙের সুন্দরবনের ঐতিহ্যবাহী খাঁটি গরান মধু।', price: 1350, unit: 'kg' },
    { title: 'বুনো বাবলা ফুলের মিষ্টি সোনালী মধু (Raw Honey)', descBn: 'হালকা মিষ্টি সুবাস যুক্ত প্রিমিয়াম চাক কাটা অপরিশোধিত র সুস্বাদু মধু।', price: 860, unit: 'kg' }
  ],
  spices: [
    { title: 'কাঠের ঘানিতে গুঁড়ো তাজা হলুদ (Turmeric Powder)', descBn: 'কোনো কৃত্রিম রঙ ছাড়াই দেশি হলুদের কড়া সুন্দর সোনালী রঙ ও সুঘ্রাণ গুঁড়ো।', price: 290, unit: 'kg' },
    { title: 'বগুড়ার কড়া ঝাল লাল মরিচ গুঁড়ো (Chili Powder)', descBn: 'ঝাঁঝ ও কড়া লাল রঙে সেরা বগুড়ার শুকনো মরিচ ধুয়ে ভাঙানো লাল গুঁড়ো।', price: 330, unit: 'kg' },
    { title: 'ভেজে গুঁড়ো করা সুগন্ধি জিরে গুঁড়ো (Cumin Powder)', descBn: 'হালকা আঁচে নিখুঁত ভেজে গুঁড়ো করা দেশী জিরে যা তরকারিতে দেবে রাজকীয় ঘ্রাণ।', price: 660, unit: 'kg' },
    { title: 'দেশী সুঘ্রাণযুক্ত গোল ধনে গুঁড়ো (Coriander)', descBn: 'আস্ত ধনে পরিষ্কার করে শুকিয়ে মিল থেকে ভাঙানো তাজা সোনালী ধনে গুঁড়ো।', price: 230, unit: 'kg' },
    { title: 'ঐতিহ্যবাহী কড়া সুবাসের পাঁচফোড়ন আস্ত (Five Spices)', descBn: 'মেথি, মৌরি, কালোজিরা, রাঁধুনি এবং জিরার চমৎকার ঐতিহ্যবাহী মশলা।', price: 250, unit: 'kg' },
    { title: 'চট্টগ্রামের ঐতিহ্যবাহী মেজবানি মাংসের মশলা গুঁড়ো', descBn: '১৫টিরও বেশি প্রিমিয়াম আস্ত মশলার নিখুঁত চড়া ব্লেন্ড যা মেজবানির স্বাদ বাড়ায়।', price: 990, unit: 'kg', isDiscount: true },
    { title: 'দারুচিনি স্টিকস সিংগাপুর গ্রেড (Cinnamon)', descBn: 'মিষ্টি সুবাসিত ও মসৃণ কড়া মিষ্টি গন্ধের সেরা কোয়ালিটির আসল দারুচিনি ছাল।', price: 490, unit: 'kg' },
    { title: 'সবুজ কচি কড়া এলাচ গোল দানা (Cardamom)', descBn: 'কড়া সুগন্ধযুক্ত এবং দানাভরা মিষ্টি সবুজ এলাচের খাঁটি আস্ত পড।', price: 3450, unit: 'kg' },
    { title: 'দেশী কড়া ঝাঁঝালো কালো গোলমরিচ আস্ত (Pepper)', descBn: 'ঝাঁঝ ও স্যুপে কড়া ঝাল দেওয়ার জন্য মাটির চরের কালো গোলমরিচ দানা।', price: 920, unit: 'kg' },
    { title: 'শুকনো সুগন্ধি পাহাড়ি তেজপাতা (Bay Leaves)', descBn: 'ক্ষেতের বড় আকারের ওষুধি তেজপাতা, তরকারিতে দেবে মন জুড়ানো মিষ্টি গন্ধ।', price: 160, unit: 'kg' },
    { title: 'কক্সবাজারের তাজা ধুলাবালি মুক্ত কালোজিরা দানা', descBn: 'কালোজিরার ওষুধি নির্যাস জমানো খাঁটি চকচকে ধুলাবালি মুক্ত কালো দানা।', price: 330, unit: 'kg' },
    { title: 'শাহী জয়ফল আস্ত বড় সাইজ (Nutmeg)', descBn: 'মাংস ও পোলাও রান্নায় মিষ্টি রাজকীয় সুবাস আনার জন্য বড় সাইজ জয়ফল আস্ত।', price: 860, unit: 'kg' },
    { title: 'সুঘ্রাণযুক্ত শুষ্ক জয়ত্রী ছাল উর্বর (Mace Spice)', descBn: 'পোলাও ও কোরমাতে শাহী উজ্জ্বল ঘ্রাণ ও সোনালী রঙ আনতে ব্যবহৃত আসল জয়ত্রী।', price: 2850, unit: 'kg' },
    { title: 'দাঁতের ব্যথা উপশমকারী কড়া লবঙ্গ (Cloves)', descBn: 'কড়া সুবাস ও ঔষধি গুণে সেরা চকচকে বড় ফুলওয়ালা আসল লবঙ্গ।', price: 1420, unit: 'kg' },
    { title: 'জৈব ও অর্গানিক মেথি শুকনো দানা (Fenugreek)', descBn: 'ডায়াবেটিক নিয়ন্ত্রণে ও তরকারির ফোড়নে ব্যবহৃত তেতো মিষ্টি মেথি দানা।', price: 260, unit: 'kg' }
  ],
  organic: [
    { title: 'কাঠের ঘানিতে ফার্স্ট প্রেসড সরিষার তেল (Mustard Oil)', descBn: 'প্রথম চাপের কড়া ঝাঁঝালো কাঠের ঘানি ভাঙা শতভাগ খাঁটি সোনালী সরিষার তেল।', price: 245, unit: 'litre' },
    { title: 'পাবনার স্পেশাল গাওয়া ঘি শতভাগ খাঁটি (pure Desi Ghee)', descBn: 'খাঁটি মাখনের মনকাড়া ঘ্রাণযুক্ত ঐতিহ্যবাহী গাওয়া ঘি যা সব খাবারের স্বাদ বাড়াবে।', price: 1420, unit: 'kg', isDiscount: true },
    { title: 'হালকা মিষ্টি আখের লাল দানা চিনি (Red Cane Sugar)', descBn: 'রাসায়নিক ব্লিচ ছাড়া দেশী আখের প্রাকৃতিক লালচে পুষ্টিকর নন-রিফাইন্ড চিনি।', price: 148, unit: 'kg' },
    { title: 'রাসায়নিক মুক্ত আখের আস্ত লাল গুড় (Organic Gur)', descBn: 'কোনো কেমিক্যাল বা সোডা ছাড়া জ্বাল দেওয়া আখ ক্ষীরের সুস্বাদু লাল শক্ত গুড়।', price: 165, unit: 'kg' },
    { title: 'ওমেগা ফাইবার সমৃদ্ধ চিয়া সিড সুপারফুড (Chia)', descBn: 'ওমেগা-৩ ও প্রচুর ডায়েটারি ফাইবার সমৃদ্ধ প্রিমিয়াম গ্রেড খাঁটি চিয়া বীজ।', price: 490, unit: 'kg' },
    { title: 'খনিজ উপাদান সমৃদ্ধ হিমালয়ের গোলাপী লবণ (Pink Salt)', descBn: 'সাধারণ লবণের বদলে ব্যবহারযোগ্য খনিজ উপাদান সমৃদ্ধ আসল গোলাপী পিঙ্ক সল্ট।', price: 185, unit: 'kg' },
    { title: 'ঘানির প্রথম চাপ সাদা তিল তেল (Sesame Oil)', descBn: 'ত্বকের সুরক্ষায় ও রান্নায় ব্যবহার উপযোগী কোল্ডপ্রেসড সাদা তিল তেল।', price: 390, unit: 'litre' },
    { title: 'কাঠের ঘানিতে কোল্ডপ্রেসড নারিকেল তেল (Pure Coconut Oil)', descBn: 'অর্গানিক কোপরা রোদে শুকিয়ে কাঠের ঘানিতে ভাঙানো প্রথম চাপ ভোজ্য তেল।', price: 460, unit: 'litre' },
    { title: 'সজনে পাতার গুঁড়ো মোরিঙ্গা সুপারপাউডার (Moringa)', descBn: 'সুপারফুড সজনে পাতার শক্তিশালী ওষুধি অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ সবুজ চূর্ণ।', price: 360, unit: 'kg' },
    { title: 'শুকনো ওষুধি অয়েস্টার মাশরুম গুঁড়ো (Mushroom Powder)', descBn: 'অর্গানিক মাশরুমের পাউডার যা স্যুপ ও ডালের স্বাদ ১০ গুণ বৃদ্ধি করবে।', price: 495, unit: '250g' },
    { title: 'যশোরের নলেন খেজুরের তরল ঝোলা গুড় (Date Palm Gur)', descBn: 'গাছীদের ভোরের খেজুর রস জ্বাল দিয়ে তৈরি অতুলনীয় সুঘ্রাণের লালচে তরল গুড়।', price: 230, unit: 'kg' },
    { title: 'হার্ট সুস্থ রাখার জন্য অর্গানিক ওটস ফ্ল্যাক্স (Oats)', descBn: 'শরীরের ওজন কমাতে এবং কোলেস্টেরল নিয়ন্ত্রণে উপকারী ফাইবার সুদ্ধ ওটস।', price: 345, unit: 'kg' },
    { title: 'পেটের জন্য মহৌষধ ত্রিফলা কড়া চূর্ণ (Triphala Powder)', descBn: 'আমলকী, হরিতকী ও বহেরা ছাঁকা কড়া গ্যাস্ট্রিক হরন ওষুধি ঘরোয়া গুঁড়ো।', price: 290, unit: '300g' },
    { title: 'ঐতিহ্যবাহী তালের রসা তালমিছরি পাথর বড় দানা', descBn: 'বাচ্চাদের কফ ও গলা খুসখুস সারাতে অতুলনীয় তালের রস থেকে জমানো মিছরি।', price: 330, unit: 'kg' },
    { title: 'কাঠের ঘানির মিষ্টি কাঠবাদাম কোল্ডপ্রেসড তেল (Almond Oil)', descBn: 'চুল ও শিশুদের ত্বকের যত্নে ঘানিতে ভাঙানো ১০০% খাঁটি কাঠবাদাম তেল।', price: 850, unit: '250ml' }
  ],
  greens: [
    { title: 'ক্ষেতের কচি লাল শাক তাজা আঁটি (Red Spinach)', descBn: 'রক্ত তৈরিতে উপকারী আয়রন ও ক্যালসিয়ামে ভরপুর ক্ষেতের লাল কচি টসটসে শাক।', price: 18, unit: 'bundle' },
    { title: 'সবুজ নরম কচি পালং শাক আঁটি (Spinach Bundle)', descBn: 'ভিটামিন এ সমৃদ্ধ সতেজ কচি পাতার পালং শাক, চিংড়ি ও আলুর তরকারিতে সেরা।', price: 22, unit: 'bundle' },
    { title: 'কচি পুই শাক মোটা ডগা আঁটি (Basella Greens)', descBn: 'চর্বিহীন পুষ্টির আঁটি ভরা মিষ্টি কচি পুই শাক যা ইলিশের মাথা দিয়ে অসাধারণ রাঁধা যায়।', price: 25, unit: 'bundle' },
    { title: 'সুঘ্রাণযুক্ত ছাঁকা কচি ধনেপাতা আঁটি (Coriander Greens)', descBn: 'সালাদ ও তরকারির ডেকোরেশনে চমৎকার মন জুড়ানো সুবাসের কচি ধনেপাতা।', price: 15, unit: 'bundle' },
    { title: 'সহজপাচ্য কচি ডাটা শাক আঁটি (Stem Greens)', descBn: 'নরম ডগা ও মিষ্টি পাতা বিশিষ্ট অত্যন্ত সুস্বাদু ডাটা শাকের বড় আঁটি।', price: 20, unit: 'bundle' },
    { title: 'জলাশয়ের সতেজ নরম কলমি শাক (Water Spinach)', descBn: 'ভিটামিন ও আয়রনের সস্তা উৎস নদী বিলের ধার থেকে তোলা তাজা কলমি শাক।', price: 16, unit: 'bundle' },
    { title: 'মুখরোচক তেতো কচি পাট শাক আঁটি (Jute Leaves)', descBn: 'গরমের দিনে দুপুরের ভাতে রুচি ফেরাতে সেরা হালকা তেতো নরম পাট শাক।', price: 18, unit: 'bundle' },
    { title: 'সুঘ্রাণযুক্ত ও সতেজ কচি পুদিনা পাতা (Mint Leaves)', descBn: 'বোরহানি ও লেবুর শরবতে সতেজ সুঘ্রাণ ছড়াতে উপযোগী তাজা পুদিনা পাতা।', price: 12, unit: 'bundle' },
    { title: 'তাজা সর্ষে শাক কচি মিষ্টি ডগা (Mustard Greens)', descBn: 'শীতকালীন ঝাঁঝালো স্বাদের কচি সর্ষে শাক যা খাঁটি সরিষার তেলে ভাজিতে দারুণ।', price: 24, unit: 'bundle' },
    { title: 'কচি লাউ শাক এবং পাতা ডগা আঁটি (Gourd Leaves)', descBn: 'কচি লাউ গাছের সতেজ ডগা ও মিষ্টি পাতাসমেত লাউ শাকের রাজকীয় আঁটি।', price: 30, unit: 'bundle' },
    { title: 'মিষ্টি কুমড়ো শাক ও কচি নরম ডগা (Pumpkin Leaves)', descBn: 'হলুদ ফুল ও কচি লতাযুক্ত কুমড়োর পাতা ও ডগার স্বাস্থ্যকর মিক্স আঁটি।', price: 28, unit: 'bundle' },
    { title: 'ওষুধি গুণসম্পন্ন হেলেঞ্চা শাক তাজা (Helencha Shak)', descBn: 'হজম শক্তি বাড়াতে সাহায্যকারী হালকা তেতো ওষুধি জলাভূমির হেলেঞ্চা শাক।', price: 20, unit: 'bundle' },
    { title: 'পেটের রোগ নিরাময়ক থানকুনি পাতা (Thankuni)', descBn: 'গ্রামবাংলার প্রাচীন ওষুধি থানকুনি পাতা আলু দিয়ে নরম বাটা খাওয়ার উপযোগী।', price: 15, unit: 'bundle' },
    { title: 'পুষ্টির খনি সজনে কচি পাতা ডগা (Moringa Leaves)', descBn: 'হাজারো গুণের সজনে গাছের তাজা সবুজ কচি কচি ডগাপাতা ডায়েট সালাদ।', price: 25, unit: 'bundle' },
    { title: 'তেতো মিষ্টি বা বাটা মেথি শাক আঁটি (Fenugreek Shak)', descBn: 'ডায়াবেটিক ও কোলেস্টেরল বান্ধব কড়া সুঘ্রাণ ও তেতো স্বাদের মেথি পাতা।', price: 22, unit: 'bundle' }
  ],
  'ready-to-cook': [
    { title: 'খোসা ফেলে কাটা গোল সাইজ লাউ প্যাক (Cut Gourd)', descBn: 'রান্নার জন্য রেডি, খোসা ও বিচি ফেলে গোল সাইজ কুচানো তাজা লাউ প্যাক।', price: 46, unit: '500g' },
    { title: 'কুচানো আলুর ভাজি চমৎকার সাইজ (Cut Potato)', descBn: 'পরিষ্কার পানিতে ধোয়া ও সমান সাইজে কুচানো আলু, সরাসরি মচমচে ভাজির জন্য প্রস্তুত।', price: 36, unit: '500g' },
    { title: 'দুই মাথা ছাঁটা ও মাঝখানে কাটা কচি পটল (Cut Potato)', descBn: 'দুই মাথা কাটা ও হালকা খোসা ছাড়ানো তাজা কচি পটলের আস্ত ফালি প্যাক।', price: 42, unit: '500g' },
    { title: 'ধোয়া ও কাটা দেশী মুরগির হাড় মাংস রান্নার সেট', descBn: 'সম্পূর্ণ ড্রেসড ও কারি সাইজ টুকরো করে ধুয়ে জিপলক প্যাকে ভরা দেশী মুরগি।', price: 265, unit: '500g', isDiscount: true },
    { title: 'আঁশ ছাড়ানো ও কাটা রুই মাছের পিস (Precut Fish)', descBn: 'ভালো পিস করা ও লবণ দিয়ে ধুয়ে পরিচ্ছন্ন করা তাজা রুই মাছের কারি মিক্স পিস।', price: 225, unit: '500g' },
    { title: 'মিক্স চাইনিজ ভেজিটেবল পাঁচমিশালী প্যাক (Mix Veg)', descBn: 'গাজর, পেঁপে, বরবটি ও কপির কাটা স্লাইস যা চাইনিজ রান্নায় সরাসরি কড়াইয়ে দেয়া যায়।', price: 58, unit: '500g' },
    { title: 'ছুলে পরিষ্কার করে কুচি করা লাল পেঁয়াজ (Cut Onion)', descBn: 'ছুলে পরিষ্কার করে কুচি করা পেঁয়াজ যা রান্নার কাজকে অর্ধেক সহজ করে দেয়।', price: 62, unit: '500g' },
    { title: 'হাত বাটায় পেষা জাঁতি রসুনের কড়া পেস্ট (Garlic Paste)', descBn: 'হাত বাটায় পেষা সুগন্ধি তাজা রসুনের পেস্ট, কোনো কড়া কেমিক্যাল প্রিজারভেটিভ নেই।', price: 92, unit: '250g' },
    { title: 'দেশী কড়া আদা পেস্ট জিপ্লক প্যাক (Ginger Paste)', descBn: 'তাজা আদা ও মসলা ব্লেন্ড করা খাঁটি ঘরোয়া আদার কড়া ঝাঁঝালো পেস্ট।', price: 98, unit: '250g' },
    { title: 'পেঁয়াজু মিক্স ডাল বাটা মন্ড (Peyaju Flour Mix)', descBn: 'খেসারী ও মসুর ডাল পেঁয়াজ মরিচ দিয়ে বেটে রাখা ফ্রোজেন মন্ড, তেলে ছাড়লেই মচমচে পেঁয়াজু।', price: 62, unit: '400g' },
    { title: 'চিনিগুঁড়া চাল ও পোড়ানো মুগ ডাল খিচুড়ি মিক্স প্যাক', descBn: 'চিনিগুঁড়া চাল ও ভাজা মুগ ডাল সঠিক অনুপাতে মেশানো ready খিচুড়ি প্যাক।', price: 78, unit: '500g' },
    { title: 'বেগুনী ভাজার পারফেক্ট বেগুন স্লাইস কাটা (Sliced)', descBn: 'পারফেক্ট পাতলা ডিম্বাকৃতির স্লাইসে কাটা বেগুন, বেসন গোলার সাথে মেলাবার জন্য তৈরি।', price: 36, unit: '250g' },
    { title: 'রান্নার কচি ফুলকপি মাঝারি সাইজ টুকরো প্যাক', descBn: 'পোকামুক্ত ফ্রেশ মাঝারি সাইজে টুকরো করা কড়া সাদা ফুলকপি প্যাক।', price: 42, unit: '350g' },
    { title: 'ভেজিটেবল স্যুপ প্রিমিয়াম মিক্স বক্স (Soup Veg)', descBn: 'মাশরুম কড়া কর্ন ও কুচানো কচি পাতা মিক্স যা স্যুপ বানানোর জন্য স্পেশাল।', price: 72, unit: '300g' },
    { title: 'সালাদ কারি মিক্সড প্রিমিয়াম প্রস্তুত বক্স (Salad)', descBn: 'সব সালাদ ধুয়ে নিখুঁত পাতলা কুচি করে লেবুর টুকরোসহ প্যাকিং করা ইনস্ট্যান্ট সালাদ।', price: 48, unit: 'box' }
  ]
};

export const demoProducts: Product[] = [];

let globIdx = 1;
CATEGORIES.forEach((cat) => {
  const items = itemsCategorized[cat.id] || [];
  items.forEach((item, itemIdx) => {
    // Round-robin assigning farmers (f1 to f75) to provide realistic spread
    const farmerIdx = (globIdx - 1) % demoFarmers.length;
    const farmer = demoFarmers[farmerIdx];
    
    // Set 4 images per product from relevant categories array with subtle variations
    const catImgs = categoryImages[cat.id] || categoryImages['vegetables'];
    const pImages: string[] = [];
    for (let s = 0; s < 4; s++) {
      const imgBase = catImgs[s % catImgs.length];
      pImages.push(`${imgBase}&sig=${globIdx}-${s}`);
    }

    const price = item.price;
    const discountPrice = item.isDiscount ? Math.round(price * 0.85) : undefined;
    const rating = parseFloat((4.1 + (globIdx % 9) * 0.1).toFixed(1));
    
    // Simulate realistic harvest date (1 to 4 days ago from today's current date of May 31, 2026)
    const daysAgo = 1 + (globIdx % 4);
    const harvestDate = `May ${31 - daysAgo}, 2026`;

    demoProducts.push({
      id: `p${globIdx}`,
      title: item.title,
      description: item.descBn,
      price: price,
      discountPrice: discountPrice,
      category: cat.id,
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmName: `${farmer.name} অর্গানিক এগ্রো`,
      rating: rating > 5.0 ? 5.0 : rating,
      stock: 40 + ((globIdx * 9) % 110),
      images: pImages,
      isVerified: farmer.verified,
      isReadyToCook: cat.id === 'ready-to-cook',
      isFeatured: globIdx % 3 === 0,
      harvestDate: harvestDate
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
    productName: 'রাজশাহী বাঘা থেকে তাজা গোপালভোগ আম (Gopalbhog)',
    location: 'Rajshahi',
    isVerifiedPurchase: true
  },
  {
    id: 'r2',
    customerName: 'Ayesha Sultana',
    avatar: 'A',
    rating: 5,
    comment: 'রেডি-টু-কুক আইটেম খুব ভালো ছিল, quality অসাধারণ। পেঁয়াজ আর আলু কুচানো এতটাই ফ্রেশ লেগেছে যে রান্নার সময় অর্ধেক বেঁচে যায়।',
    productName: 'ধোয়া ও কাটা দেশী মুরগির হাড় মাংস রান্নার সেট',
    location: 'Dhaka',
    isVerifiedPurchase: true
  },
  {
    id: 'r3',
    customerName: 'Karim Mia',
    avatar: 'K',
    rating: 5,
    comment: 'পুকুরের তাজা রুই মাছ ও দেশী মুরগি অনেক ভালো লেগেছে। প্যাকেজিংটা খুব দারুণ ছিল, একদম বরফে ঢাকা!',
    productName: 'দিঘির তাজা জ্যান্ত বড় রুই (Giant Rui Fish)',
    location: 'Chittagong',
    isVerifiedPurchase: true
  },
  {
    id: 'r4',
    customerName: 'Fatema Begum',
    avatar: 'F',
    rating: 5,
    comment: 'আখের লাল গুড় একদম কড়া খাঁটি ছিল। চা বানিয়ে খেয়েছি স্বাদ এবং ঘ্রাণ সত্যিই অসাধারণ। কোনো কেমিক্যাল গন্ধ নেই।',
    productName: 'রাসায়নিক মুক্ত আখের আস্ত লাল গুড় (Organic Gur)',
    location: 'Bogra',
    isVerifiedPurchase: true
  },
  {
    id: 'r5',
    customerName: 'Abul Kalam',
    avatar: 'A',
    rating: 5,
    comment: 'সুন্দরবনের খলিসা মধু অর্ডার দিয়েছিলাম, গুণগত মান সত্যিই প্রশংসনীয়। সর্দি-কাশির ওষুধ হিসেবে খুব কাজে দিচ্ছে।',
    productName: 'সুন্দরবনের খাঁটি খলিসা মধু (Kholisa Honey)',
    location: 'Sylhet',
    isVerifiedPurchase: true
  },
  {
    id: 'r6',
    customerName: 'Rokeya Yasmin',
    avatar: 'R',
    rating: 4,
    comment: 'রেডি-টু-কুক কাটা লাউ ও পটল খুব পরিষ্কার পরিচ্ছন্ন ছিল। ঢাকার ব্যস্ত জীবনে এটা অত্যন্ত বড় একটা সাহায্য।',
    productName: 'সালাদ কারি মিক্সড প্রিমিয়াম প্রস্তুত বক্স (Salad)',
    location: 'Khulna',
    isVerifiedPurchase: true
  }
];

export const demoBlogs: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'কীভাবে সতেজ ও রাসায়নিক মুক্ত শাকসবজি চিনবেন? (How to identify fresh vegetables?)',
    summary: 'দৈনন্দিন জীবনে আমাদের বাজার থেকে কেনা শাকসবজি কতটা নিরাপদ এবং সতেজ তা চেনার কিছু সহজ ও বৈজ্ঞানিক উপায় নিয়ে বিস্তারিত আলোচনা।',
    content: `আমাদের সুস্থতার জন্য নিরাপদ খাদ্যের কোনো বিকল্প নেই। কিন্তু বাজারে গিয়ে আমরা অনেক সময় বিভ্রান্ত হই। কৃত্রিম উপায়ে পাকানো বা কেমিক্যাল মেশানো পণ্য আমাদের স্বাস্থ্যের জন্য মারাত্মক হুমকিস্বরূপ। এখানে কিছু সহজ টিপস দেওয়া হলো যার মাধ্যমে আপনি খাঁটি সতেজ শাকসবজি চিনতে পারবেন:

### ১. পাতার রঙ ও সতেজতা
তাজা শাকসবজি সবসময় প্রাকৃতিকভাবে গাঢ় বা হালকা সবুজ হবে। মাত্রাতিরিক্ত উজ্জ্বল বা চকচকে সবুজ রঙ অনেক সময় কেমিক্যাল স্প্রে করার ইঙ্গিত দেয়। প্রাকৃতিকভাবে সতেজ শাকের কচি কান্ডটি সামান্য বাঁকা করলে সহজে ভেঙে যাবে।

### ২. গন্ধ ও প্রাকৃতিক সুবাস
খাঁটি দেশীয় ফলমূল ও শাকসবজি যেমন ধনেপাতা, দেশি টমেটো বা লেবুর একটি তীব্র সুন্দর প্রাকৃতিক সুবাস থাকে। কেমিক্যাল ব্যবহৃত সবজিতে এই প্রাকৃতিক সুগন্ধ পাওয়া যায় না, বরং হালকা ওষুধের বা গন্ধহীন মনে হয়।

### ৩. ওজন ও আর্দ্রতা
হাতে ধরলে সবজিটি যদি তুলনামূলক ভারী এবং রসালো মনে হয়, তবে বুঝবেন এটি সদ্য সংগ্রহ করা সতেজ ফসল। শুকনো এবং চামড়া কুঁচকে যাওয়া সবজি কেনা থেকে বিরত থাকুন।

কৃষক বাজার সরাসরি আপনাদের জন্য মাঠ থেকে ফসল তোলার ২৪ ঘণ্টার মধ্যে ঢাকায় পৌঁছে দেয়। তাই আমাদের কোনো ফসলে কৃত্রিম প্রিজারভেটিভ বা সতেজকারক কেমিক্যাল ব্যবহারের প্রয়োজন হয় না।`,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    author: 'কৃষিবিদ ড. এন এম আমিনুল',
    publishedAt: '2026-05-25T11:00:00Z',
    category: 'নিরাপদ খাদ্য (Safe Food)',
    tags: ['জৈব খাদ্য', 'স্বাস্থ্য সচেতনতা', 'satej-veg']
  },
  {
    id: 'blog-2',
    title: 'দালাল মুক্ত বাজার ব্যবস্থা ও কৃষকের মুখে হাসি (Middlemen-free fair trading)',
    summary: 'প্রচলিত বাজার সিন্ডিকেট এবং দালালি কালচার আমাদের প্রান্তিক কৃষকদের কীভাবে বছরের পর বছর ঠকিয়ে আসছে এবং কৃষক বাজারের ডিজিটাল বিপ্লব কীভাবে এটি প্রতিরোধ করছে।',
    content: `বাংলাদেশে একজন কৃষক রোদে পুড়ে বৃষ্টিতে ভিজে তার রক্ত পানি করে ফসল ফলান। কিন্তু দুঃখজনক হলো, ফসলের উপযুক্ত দাম তিনি পান না। আড়ত ও ফড়িয়ারা সমস্ত লভ্যাংশ লুটে নেয়। 

### আড়তদারি সিন্ডিকেটের প্রভাব
যশোরে যে পেঁয়াজ চাষী ২৫ টাকায় বিক্রি করেন, ঢাকার কাওরান বাজার হয়ে কাস্টমারের হাতে পৌঁছাতে তার দাম হয়ে যায় ৭০ থেকে ৮০ টাকা। মাঝখানে এই বিশাল ৫০-৫৫ টাকা ব্যবধান যায় মধ্যস্বত্বভোগীদের পকেটে। এর ফলে:
- কৃষক দিন দিন দেনার দায়ে ঋণী হচ্ছেন।
- সাধারণ ক্রেতারা উচ্চমূল্যে ফরমালিনযুক্ত বাসি সবজি খাচ্ছেন।

### কৃষক বাজারের সমাধান
আমরা এই কালো সিন্ডিকেট ভাঙতে তৈরি করেছি সম্পূর্ণ স্বচ্ছ ডিজিটাল প্ল্যাটফর্ম। 
- **কৃষক তার ফসলের দাম নিজে ঠিক করেন**: আমাদের কোনো কমিশন চার্জ বা ফড়িয়া সিন্ডিকেট নেই।
- **সরাসরি পেমেন্ট সিস্টেম**: গ্রাহকের পেমেন্ট সরাসরি মোবাইল ব্যাংকিং (bKash/Nagad) এর মাধ্যমে কৃষকের ডিজিটাল ওয়ালেটে পৌঁছে যায়।
- **তাজা খাবার সরাসরি কাস্টমারের টেবিলে**: মাঠ থেকে সংগ্রহের পরপরই তা সরাসরি ডেলিভারি হয়, কোনো সংরক্ষকের প্রয়োজন হয় না।

এর ফলে একজন কৃষক তার মেহনতের প্রকৃত মূল্য পাচ্ছেন এবং তাদের মুখে হাসি ফিরছে।`,
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80',
    author: 'জাকির হোসেন (উদ্যোক্তা)',
    publishedAt: '2026-05-28T09:30:00Z',
    category: 'কৃষকের কথা (Farmer Stories)',
    tags: ['dalal-free', 'কৃষক অধিকার', 'সামাজিক বিপ্লব']
  },
  {
    id: 'blog-3',
    title: 'জৈব সার ও পরিবেশবান্ধব চাষের উপকারিতা (Benefits of Organic Farming)',
    summary: 'রাসায়নিক ও অতিরিক্ত কীটনাশকের কবল থেকে আমাদের প্রাণপ্রিয় উর্বর মাটিকে রক্ষা করতে জৈব সারের অবদান এবং টেকসই চাষাবাদের ভবিষ্যৎ।',
    content: `অতিরিক্ত রাসায়নিক সার ও বিষাক্ত কীটনাশক ব্যবহারের ফলে দিন দিন আমাদের উর্বর পলল মাটির স্বাস্থ্য নষ্ট হচ্ছে। পানির ভারসাম্য বিঘ্নিত হচ্ছে এবং উপকারী পোকামাকড় বিলুপ্ত হচ্ছে। এই পরিস্থিতি থেকে উত্তরণের একমাত্র পথ সামষ্টিক জৈব চাষাবাদ।

### জৈব চাষাবাদের সুফল:
১. **মাটির দীর্ঘমেয়াদী উর্বরতা**: কম্পোস্ট সার, গোবর সার এবং শুকনো লতাগুল্ম পচিয়ে তৈরি সার মাটির হিউমাস ও পুষ্টি উপাদান ধরে রাখতে সাহায্য করে।
২. **মানবদেহে ক্ষতিকর প্রভাব নেই**: রাসায়নিক কীটনাশকের অবশিষ্টাংশ খাবারের মাধ্যমে আমাদের শরীরে প্রবেশ করে ক্যান্সার, কিডনি ড্যামেজসহ নানা জটিল রোগ সৃষ্টি করে। জৈব সবজি ব্যবহারে এই ঝুঁকি থাকে না।
৩. **টেকসই জীববৈচিত্র্য**: পরিবেশ এবং মাটির উপকারী ক্ষুদ্র প্রাণীদের ক্ষতি না করে সফলভাবে ফসল ঘরে তোলা সম্ভব।

আমাদের কৃষক বাজার প্ল্যাটফর্মের ৭৫ জনেরও বেশি অভিজ্ঞ কৃষক সম্পূর্ণ নিজস্ব উদ্যোগে তৈরি কম্পোস্ট ও কেঁছো সার (Vermicompost) ব্যবহার করে পরিবেশবান্ধব উপায়ে ফসল উৎপাদন করছেন।` ,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=800&auto=format&fit=crop&q=80',
    author: 'আমিনা খাতুন (নারী উদ্যোক্তা ও খামারি)',
    publishedAt: '2026-05-30T10:15:00Z',
    category: 'জৈব চাষাবাদ (Organic Farming)',
    tags: ['organic-shat', 'পরিবেশ বান্ধব', 'টেকসই কৃষি']
  }
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  seoTitle: 'কৃষক বাজার | সরাসরি মাঠ থেকে বিশুদ্ধ ও নিরাপদ খাদ্য সরাসরি আপনার ঘরে',
  seoDescription: 'কৃষক বাজার সরাসরি তৃণমূলের ভেরিফাইড কৃষকদের সাথে ক্রেতার সেতুবন্ধন। মধ্যস্বত্বভোগী ছাড়া রাসায়নিক মুক্ত তাজা ফলমূল, শাকসবজি ও খাঁটি পণ্য সরাসরি ঢাকায় নিয়ে আসা হচ্ছে।',
  seoKeywords: 'কৃষক বাজার, krishok bazar, নিরাপদ খাদ্য, তাজা সবজি, সরাসরি মাঠের ফসল, অর্গানিক গুড়, খাঁটি মধু, রেডি টু কুক মাছ মাংস, রাজশাহী আম বুকিং',
  googleAnalyticsId: 'G-KB12345678',
  socialFacebook: 'https://facebook.com/krishokbazar',
  socialYoutube: 'https://youtube.com/c/krishokbazar',
  socialTwitter: 'https://twitter.com/krishokbazar',
  socialInstagram: 'https://instagram.com/krishokbazar_bd',
  paymentBkashNumber: '01939052257',
  paymentNagadNumber: '01987012893',
  paymentBankAccount: '102.120.45672901',
  paymentBankName: 'Islami Bank Bangladesh PLC',
  paymentCodActive: true,
  deliveryChargeDhaka: 80,
  deliveryChargeOutside: 150,
  deliveryFreeThreshold: 1500,
  storyTitleBn: 'দালাল মুক্ত ও রাসায়নিক মুক্ত সুখী বাংলার স্বপ্নযাত্রায় কৃষক বাজার',
  storyTitleEn: 'Krishok Bazar - Direct connection to local farmers, chemical-free and middleman-free food system.',
  storySubtitleBn: 'আমরা প্রচলিত মধ্যস্বত্বভোগী, ফড়িয়া ও আড়তদারদের কমিশন কালচার ভেঙেছি। আমাদের প্ল্যাটফর্মে কৃষক সরাসরি তার ফসলের মূল্য ঠিক করেন ও বিক্রি করেন।',
  storySubtitleEn: 'We broke down the multi-layered brokers culture to establish a transparent, farmer-controlled digital agricultural open-marketplace.',
  storyChallengeTitleBn: 'কেন আমরা এই সামাজিক বিপ্লব শুরু করেছি?',
  storyChallengeTextBn: 'আমরা বিশ্বাস করি, আমাদের মাটির উর্বরতা ও কৃষকদের অক্লান্ত পরিশ্রম এদেশের সবচেয়ে বড় সম্পদ। অথচ বাজার ব্যবস্থার অসঙ্গতি ও দালালের কারসাজিতে কৃষক ও সাধারণ কাস্টমার দুপক্ষই শোষিত হচ্ছেন প্রতিদিন। কৃষক বাজার এই বৈষম্যের অবসান ঘটাতে সরাসরি চাষীর ওয়ালেট ক্ষমতায়ন ও সতেজ খাবারের একটি সামাজিক বিপ্লব।',
  storyModelTitleBn: 'কৃষক বাজার মডেল ও আমাদের লক্ষ্য',
  storyModelTextBn: 'আমাদের কোনো নিজস্ব দোকানপাট বা কোল্ডস্টোরেজ সিন্ডিকেট নেই। আপনি যখন আমাদের ওয়েবসাইট বা অ্যাপে একটি প্রি-অর্ডার প্লেস করেন, আমাদের নেটওয়ার্কের কৃষকেরা কাকডাকা ভোরে সরাসরি তাদের নিজস্ব জমি থেকে ফসল সংগ্রহ করে প্যাকিং হাউজে সাবমিট করেন। সেখান থেকে দ্রুত পরিবহনে করে ঢাকার কেন্দ্রীয় হাব হয়ে বিকেলের মধ্যে সরাসরি কাস্টমারের বাসায় পৌঁছে দেওয়া হয়। ফলে পণ্য থাকে শতভাগ সতেজ এবং দামে থাকে সাশ্রয়ী।',
  storyPillar1Title: 'সোনার বাংলা ও উর্বর মৃত্তিকা',
  storyPillar1Text: 'বাংলাদেশ সুজলা-সুফলা উর্বর পলল মাটির দেশ। আমাদের চাষীরা পবিত্র ঘামের বিনিময়ে আমাদের জন্য মৌসুমী তাজা রাসায়নিক মুক্ত ফসল ফলান। সেই ফসল সরাসরি সংগ্রহ করাই আমাদের বড় গর্ব।',
  storyPillar2Title: 'সিন্ডিকেট ও মধ্যস্বত্ব ভোগী অবসান',
  storyPillar2Text: 'মাঠের উৎপাদক ফসল ৮ টাকায় বিক্রি করলেও আড়তদার ও ঘাটে ঘাটে মধ্যস্বত্বভোগীদের কৃত্রিম সংকটে ঢাকায় সাধারণ কাস্টমার তা ৮০ টাকায় ক্ষতিকর কেমিক্যালসহ কিনতে বাধ্য হন। আমরা এই কৃত্রিম সংকট সমূলে ভেঙে দিয়েছি।',
  storyPillar3Title: 'রাসায়নিক ও ভেজাল মুক্ত বিশুদ্ধতা',
  storyPillar3Text: 'ক্ষতিকর কার্বাইড, ফরমালিন বা নোংরা প্রিজারভেটিভ সম্পূর্ণ বর্জন করে সরাসরি মাঠ থেকে তাজা ও নির্ভেজাল পুষ্টিকর খাবার আপনার পরিবারের কাছে দ্রুততম সময়ে ডেলিভারি করাই আমাদের টেকসই লক্ষ্য।',
  storyPillar4Title: 'স্বাধীন ও ক্ষমতাবান আধুনিক চাষী',
  storyPillar4Text: 'কোনো মধ্যস্বত্বভোগী ছাড়াই চাষীরা যাতে নিজেই তার কঠোর মেহনতের মূল্য নির্ধারণ করতে পারেন আমরা তার ব্যবস্থা করেছি। সম্পূর্ণ লভ্যাংশ সরাসরি নিজস্ব ডিজিটাল ওয়ালেটে চাষীদের কাছে পৌঁছে দিয়ে তাদের স্বাবলম্বী করা আমাদের উদ্দেশ্য।',
  headerWelcomeBn: '🌾 কৃষক বাজার: তৃণমূলের ভেরিফাইড কৃষকদের সাথে সরাসরি সম্পর্কের আধুনিক ডিজিটাল প্লাটফর্ম',
  headerWelcomeEn: '🌾 Krishok Bazar: Transparent farm-to-table digital marketplace powered directly by root farmers.',
  footerCopyrightBn: '© ২০২৬ কৃষক বাজার বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত। এটি একটি নিরাপদ খাদ্য ও কৃষকদের সামাজিক আন্দোলন।',
  footerCopyrightEn: '© 2026 Krishok Bazar Bangladesh. All Rights Reserved. Empowering farmers, eating natural.',
  footerPhone: '01931355398',
  footerEmail: 'support@krishokbazar.org',
  footerAddressBn: 'সোনারীতলা কৃষি টাওয়ার, লেভেল ৪, মিরপুর ১০ গোলচত্বর, ঢাকা-১২১৬',
  premiumMembershipPriceUSD: 5,
  premiumMembershipPriceBDT: 600,
  premiumFreeDeliveryActive: true,
  premiumReadyToCookOptionActive: true,
  sectionComboTitleBn: 'সাপ্তাহিক ও ফ্যামিলি কম্বো বাস্কেট',
  sectionComboSubtitleBn: 'সরাসরি কৃষকের মাঠের বাছাই করা তাজা কম্বো বাস্কেট অফারসমূহ। বিস্তারিত বিবরণ ও উপাদান তালিকা ওজনের সাথে বিস্তারিত পাতায় দেখে নিন।',
  sectionMarketTitleBn: 'আজকের সতেজ কৃষিপণ্য বাজার (Daily Fresh Market)',
  sectionMarketSubtitleBn: 'ভোরাই সরাসরি খামার থেকে কুরিয়ার করে ঢাকায় আনা শতভাগ সতেজ ও রাসায়নিক মুক্ত কৃষিপণ্য। সঠিক ওজন ও নিরাপদ খাদ্যের নিশ্চয়তা।',
  sectionCategoriesTitleBn: 'পণ্য ক্যাটাগরি অনুযায়ী শপিং করুন',
  sectionCategoriesSubtitleBn: 'তাজা শাকসবজি থেকে শুরু করে খাঁটি মধু, দেশী চাল ও ডালের ক্যাটাগরি সমূহ নির্বিঘ্নে অন্বেষণ করুন।',
  whatsappContactNumber: '01931355398',
  primaryBrandColor: 'emerald-600'
};

