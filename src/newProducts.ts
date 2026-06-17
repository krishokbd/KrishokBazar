import { Product } from './types';
import { demoFarmers } from './data';

// High quality image lists for each category to ensure 4-5 unique image variations per product
const categoryImages: Record<string, string[]> = {
  vegetables: [
    'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'
  ],
  fruits: [
    'https://images.unsplash.com/photo-1519098901909-b1553a1190af?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=600&auto=format&fit=crop&q=80'
  ],
  fish: [
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80'
  ],
  meat: [
    'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532407191490-e4066c1500d4?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529692236671-f1f6e9481b2?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551028340-419b41a3cd30?w=600&auto=format&fit=crop&q=80'
  ],
  eggs: [
    'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515003844-1098154e7f68?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80'
  ],
  'ready-to-cook': [
    'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515003844-1098154e7f68?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'
  ]
};

// 45 Premium Products defining accurate local items of Bangladesh across the 6 supported categories
// Total 45 Products
const rawItemsList = [
  // Vegetables (15 Items)
  {
    category: 'vegetables',
    title: 'মুলা শাক (Fresh Radish Greens)',
    description: 'খাঁটি দেশী কচি ও সতেজ মুলা শাক। সরাসরি কৃষকদের বাগান থেকে সংগৃহীত পুষ্টিকর ও উপাদেয় সবুজ শাক।',
    price: 15,
    unit: 'bundle',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_7.jpg?v=1778788779',
    isFeatured: true
  },
  {
    category: 'vegetables',
    title: 'পুঁই শাক (Fresh Malabar Spinach)',
    description: 'ভিটামিন এ ও সি এবং আয়রন সমৃদ্ধ কচি তাজা ও পিচ্ছিল পুঁই শাকের বড় আঁটি। সম্পূর্ণ কেমিক্যাল মুক্ত।',
    price: 25,
    unit: 'bundle',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_6.jpg?v=1778788778',
    isDiscount: true
  },
  {
    category: 'vegetables',
    title: 'লাল শাক (Premium Red Spinach)',
    description: 'খাঁটি লাল টসটসে সুস্বাদু শিমূলতলার তাজা কচি লাল শাক। কম আঁশ এবং রান্নায় চমৎকার রক্তিম রং ছড়ায়।',
    price: 15,
    unit: 'bundle',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_5.jpg?v=1778788778',
    isFeatured: true
  },
  {
    category: 'vegetables',
    title: 'কচি বেগুন (Fresh Tender Brinjal)',
    description: 'যশোরের নরম তাজা ও চকচকে বেগুন। কুচি বেগুন ভাজি অথবা তরকারির স্বাদ বাড়ানোর প্রথম পছন্দ।',
    price: 60,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download.jpg?v=1778788778'
  },
  {
    category: 'vegetables',
    title: 'দেশি লাউ (Sweet Local Bottle Gourd)',
    description: 'নরসিংদীর চর থেকে সংগৃহীত কচি ও মিষ্টি পানি লাউ। একদম কুচি ও নরম বীজহীন, দারুণ স্বাদ ও হজমে সহায়ক।',
    price: 50,
    unit: 'piece',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_2.jpg?v=1778788779',
    isFeatured: true
  },
  {
    category: 'vegetables',
    title: 'তিতা করলা (Crisp Bitter Gourd)',
    description: 'জৈব সার দিয়ে উৎপাদিত কচি ও কুড়মুড়ে তিতা করলা। রক্তের সুগার নিয়ন্ত্রণে এবং সুস্বাদু ভাজিতে অতুলনীয়।',
    price: 70,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_1.jpg?v=1778788778',
    isDiscount: true
  },
  {
    category: 'vegetables',
    title: 'মিষ্টি কুমড়া (Sweet Round Pumpkin)',
    description: 'পাকা কড়া ও রসে ভরপুর মিষ্টি এবং কুসুম কালারের আস্ত মিষ্টি কুমড়া। চমৎকার পুষ্টিকর গোল মিষ্টি কুমড়া।',
    price: 50,
    unit: 'piece',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_17.jpg?v=1778788778'
  },
  {
    category: 'vegetables',
    title: 'দেশি আদা (Fresh Local Ginger)',
    description: 'খড় দিয়ে ঢাকা উর্বর মাটিতে চাষ করা কড়া ঝাঁঝ এবং কাদার আবরণে থাকা সতেজ দেশি আদা। রান্নার সুঘ্রাণ বাড়াবে।',
    price: 240,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_3.jpg?v=1778788779'
  },
  {
    category: 'vegetables',
    title: 'বগুড়ার বালু মাটির গোল লাল আলু (Bogra Red Potato)',
    description: 'বগুড়ার বিখ্যাত বালু মাটির লালচে গোল ও কড়া মিষ্ট আলু। তরকারির জন্য দারুণ আলু।',
    price: 45,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600'
  },
  {
    category: 'vegetables',
    title: 'সতেজ দেশী কাঁচামরিচ (Fresh Green Chili)',
    description: 'কড়া ঝাঁঝ ও মনোহরী কচি গন্ধযুক্ত ছোট দস্তার কামড় দেওয়া তাজা সবুজ দেশী কাঁচামরিচ।',
    price: 120,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600'
  },
  {
    category: 'vegetables',
    title: 'তাজা মিষ্টি লাল চেরি টমেটো (Red Cherry Tomatoes)',
    description: 'রসালো লাল মিষ্টি টসটসে কচি চেরি টমেটোর প্রিমিয়াম প্যাক। সালাদে দারুণ।',
    price: 180,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600'
  },
  {
    category: 'vegetables',
    title: 'শাহি তাজা ক্যাপসিকাম সবুজ (Green Capsicum)',
    description: 'সবুজ ক্যাপসিকাম শাহি ক্রিস্পি চাইনিজ রেসিপির শ্রেষ্ঠ সংযুক্তি। অত্যন্ত কুড়মুড়ে।',
    price: 260,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600'
  },
  {
    category: 'vegetables',
    title: 'পাকা টমেটো কড়া প্রিমিয়াম (Fresh Ripe Tomatoes)',
    description: 'গাছে পাকা উজ্জ্বল লাল মিষ্টি ও নরম রসালো আসল দেশী টমেটো প্যাক।',
    price: 90,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600'
  },
  {
    category: 'vegetables',
    title: 'নরসিংদীর কচি কাঁচা পেঁপে (Local Green Papaya)',
    description: 'সবুজ নরম কচি পেঁপে। তরকারি এবং রান্নার সেরা সুস্বাদু হেলদি সবজি প্যাক।',
    price: 35,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600'
  },
  {
    category: 'vegetables',
    title: 'মেহেরপুরের নরম কচি ঢেঁড়শ (Tender Lady Finger)',
    description: 'ক্ষেত থেকে সদ্য পেড়ে আনা কচি ও আশঁহীন ঢেঁড়শ প্যাক। ভাজিতে অসাধারণ।',
    price: 55,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=600&sig=tender-lady'
  },

  // Fruits (9 Items)
  {
    category: 'fruits',
    title: 'রসালো কমলা (Juicy Sweet Orange)',
    description: 'ভিটামিন ও রসে ঠাসা কচি ও অত্যন্ত সুমিষ্টি কমলা লেবুর সেট। সর্দি- কাশি প্রতিরোধ করে।',
    price: 220,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_18.jpg?v=1778788778',
    isFeatured: true
  },
  {
    category: 'fruits',
    title: 'দেশি লিচু (Sweet Juicy Local Litchi)',
    description: 'দিনাজপুরের বিখ্যাত রসালো ও টুকটুকে লাল মিষ্টি লিচুর আস্ত বড় গোছা। মধুমাস উপভোগের সেরা রসালো কামড়।',
    price: 400,
    unit: '100 pcs',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_4.jpg?v=1778788779',
    isFeatured: true
  },
  {
    category: 'fruits',
    title: 'সবুজ পেয়ারা (Organic Crisp Guava)',
    description: 'ক্ষেতের সদ্য তোলা ডালিসহ কচি সবুজ কুড়মুড়ে সুস্বাদু পেয়ারা। ডাইবেটিস রোগীদের জন্য আদর্শ।',
    price: 80,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_10.jpg?v=1778790017',
    isDiscount: true
  },
  {
    category: 'fruits',
    title: 'রাজশাহীর হর্টিকালচার গোপালভোগ আম (Gopalbhog Mango)',
    description: 'বাঘা রাজশাহীর বিখ্যাত কেমিক্যাল মুক্ত আসল মধুর মতো মিষ্টি ও সুঘ্রাণ গোপালভোগ আম।',
    price: 160,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1519098901909-b1553a1190af?w=600'
  },
  {
    category: 'fruits',
    title: 'কক্সবাজারের তাজা বড় পাহাড়ী আনারস (Honey Pineapple)',
    description: 'কক্সবাজার পাহাড়ের বিখ্যাত অত্যন্ত মিষ্টি বড় তাজা রসালো পাহাড়ী আনারস।',
    price: 75,
    unit: 'piece',
    primaryImage: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600'
  },
  {
    category: 'fruits',
    title: 'রসালো লাল ফুজি আপেল গ্রেড-এ (Red Fuji Apples)',
    description: 'আমদানি করা কড়া কুড়মুড়ে মিষ্টি রসালো গোল লাল ফুজি আপেলের সেরা মান।',
    price: 280,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600'
  },
  {
    category: 'fruits',
    title: 'মিষ্টি তাজা সবুজ বাও কুল বরই (Green jujube)',
    description: 'অত্যন্ত কচি রসে ভরপুর টক-মিষ্টি মিক্স বাও কুল এবং গোল তাজা দেশী বরই।',
    price: 110,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600'
  },
  {
    category: 'fruits',
    title: 'পাহাড়ী লাল ড্রাগন ফল প্রিমিয়াম (Red Dragon Fruits)',
    description: 'প্রচুর অ্যান্টিঅক্সিডেন্ট ও ফাইবার সমৃদ্ধ কুসুম লাল মিষ্টি তাজা পাহাড়ি ড্রাগন ফল।',
    price: 350,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=600'
  },
  {
    category: 'fruits',
    title: 'নরসিংদীর দেশী তাজা সাগর কলা (Sagor Banana Bunch)',
    description: 'সম্পূর্ণ পুষ্টিকর প্রাকৃতিকভাবে পাকানো নরসিংদীর বিখ্যাত সাগর কলা বাগান সেট।',
    price: 90,
    unit: 'dozen',
    primaryImage: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&sig=banana'
  },

  // Fish (8 Items)
  {
    category: 'fish',
    title: 'কালো মাগুর মাছ (Live Black Magur)',
    description: 'সম্পূর্ণ প্রাকৃতিকভাবে বড় হওয়া দিঘি ও চলন বিলের জ্যান্ত পুষ্টিকর কালো মাগুর মাছ। রক্ত বৃদ্ধিতে অতুলনীয় উপযোগী।',
    price: 750,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_20.jpg?v=1778788779',
    isFeatured: true
  },
  {
    category: 'fish',
    title: 'দেশি শিং মাছ (Live Local Singi Fish)',
    description: 'দেশী খাঁটি নদী ও নালা থেকে সংগৃহীত অত্যন্ত পুষ্টিকর ও ক্যালসিয়ামে ভরা জ্যান্ত দেশি শিং মাছ। রোগীদের পথ্য।',
    price: 580,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_19.jpg?v=1778788778',
    isDiscount: true
  },
  {
    category: 'fish',
    title: 'পদ্মার ইলিশ (Royal Padma River Hilsa)',
    description: 'পদ্মা নদীর কড়া সুঘ্রাণের রূপালী ও তেল চকচকে ডিম ছাড়া ইলিশ। রান্নায় এর মিষ্টি তেল ও গন্ধ অতুলনীয়।',
    price: 1450,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_8.jpg?v=1778788778',
    isFeatured: true
  },
  {
    category: 'fish',
    title: 'দিঘির তাজা জ্যান্ত বড় রুই মাছ (Giant Rui Fish)',
    description: 'জলাশয় থেকে ধরা চকচকে তাজা বড় রুই মাছ। আঁশ ও মাংস অত্যন্ত সুস্বাদু।',
    price: 380,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600'
  },
  {
    category: 'fish',
    title: 'বিল-হাওরের বড় চকচকে কাতলা মাছ (Katla Fish)',
    description: 'হাওরের গভীর পানির কচি শ্যাওলা খেয়ে বড় হওয়া সতেজ চর্বিযুক্ত কাতলা মাছের পেট।',
    price: 420,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600'
  },
  {
    category: 'fish',
    title: 'লোনা জলের তাজা বাগদা চিংড়ি (Bagda Prawns)',
    description: 'লোনা পানির চকচকে ও মিষ্টি স্বাদের বড় বাগদা চিংড়ি সেট রান্নার জন্য রাজকীয়।',
    price: 860,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'
  },
  {
    category: 'fish',
    title: 'চলন বিলের জ্যান্ত বড় শোল মাছ (Local Shol Fish)',
    description: 'চলন বিলের আসল কালো বড় ও কড়া স্বাদের শোল মাছ। কষা ভূনায় সুস্বাদু।',
    price: 520,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600'
  },
  {
    category: 'fish',
    title: 'পদ্মা নদীর নীল দাড়া গলদা চিংড়ি (Giant Golda Prawns)',
    description: 'পদ্মা নদীর আড়ত থেকে আনা বড় কচি গলদা চিংড়ির ঝাঁক।',
    price: 1100,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600'
  },

  // Meat (6 Items)
  {
    category: 'meat',
    title: 'গরুর মাংস (Fresh Solid Beef)',
    description: '১০০% লাইভ হালাল ও তাজা গরুর হাড়যুক্ত ও সলিড মাংস। কোনো কৃত্রিম হরমোন বা সীসাবিহীন চারণ পালন।',
    price: 750,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_12.jpg?v=1778789927',
    isFeatured: true
  },
  {
    category: 'meat',
    title: 'খাসির মাংস (Fresh Local Mutton)',
    description: 'কচি ছাগলের গন্ধহীন ও চর্বিযুক্ত নরম সুস্বাদু ও পুষ্টিকর তাজা খাসির মাংসের বড় পিস।',
    price: 1050,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_22.jpg?v=1778789927',
    isFeatured: true
  },
  {
    category: 'meat',
    title: 'দেশি মুরগি (Grassfed Country Chicken)',
    description: 'উঠোনে ছেড়ে লালন-পালন করা খাঁটি পুষ্টিকর ও আঁশহীন সতেজ দেশি মুরগি। রান্নায় মনকাড়া সুঘ্রাণ।',
    price: 550,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_11.jpg?v=1778789927',
    isDiscount: true
  },
  {
    category: 'meat',
    title: 'ফার্মের মুরগি (Broiler Chicken)',
    description: 'নিয়ন্ত্রিত উন্নত খামারে পরিচ্ছন্ন উপায়ে পালিত বড় মাংসালো নরম ব্রয়লার বা ফার্মের মুরগি। সাশ্রয়ী দাম।',
    price: 190,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_16.jpg?v=1778791062'
  },
  {
    category: 'meat',
    title: 'চরা বিলের পাতিহাঁসের বড় মাংস (Dressed Duck Meat)',
    description: 'বিলের চরে ধান খাওয়া মোটা সুস্বাদু পাতিহাঁস। আস্ত পরিষ্কার ড্রেসড করা।',
    price: 450,
    unit: 'piece',
    primaryImage: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600'
  },
  {
    category: 'meat',
    title: 'পুষ্টিকর সতেজ গরুর কলিজা (Beef Liver)',
    description: 'ভিটামিন বি ও আয়রন সমৃদ্ধ অত্যন্ত নরম গরুর লাল তাজা সতেজ মেটে/কলিজা প্যাক।',
    price: 800,
    unit: 'kg',
    primaryImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600'
  },

  // Eggs & Dairy (9 Items)
  {
    category: 'eggs',
    title: 'ডেইরি ও ডিম - ফার্মের ডিম (Farm Brown Eggs)',
    description: 'পুষ্টিকর সতেজ লাল খোলসের খামারের বড় সাইজের ডিম। দৈনিক নাস্তার আদর্শ প্রোটিন বুস্টার।',
    price: 145,
    unit: 'dozen',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_23.jpg?v=1778789927',
    isFeatured: true
  },
  {
    category: 'eggs',
    title: 'দেশি ডিম (Pure Country Chicken Eggs)',
    description: 'দেশী চড়ে বেড়ানো কুসুম লাল সুন্দর প্রিমিয়াম প্রোটিনের আধার দেশী মুরগির ডিম। অত্যন্ত উপাদেয়।',
    price: 190,
    unit: 'dozen',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/1545578418923.jpg?v=1778790838',
    isFeatured: true
  },
  {
    category: 'eggs',
    title: 'হাঁসের ডিম (Nutritious Duck Eggs)',
    description: 'খাঁটি চরে খাওয়া বিলের হাঁসের বিশাল ও পুষ্টিকর লাল কুসুমের বড় ডিম। ক্যালসিয়াম ও ভিটামিনের সেরা আধার।',
    price: 210,
    unit: 'dozen',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/1545578418923.jpg?v=1778790838',
    isFeatured: true
  },
  {
    category: 'eggs',
    title: 'গরুর দুধ (Premium Pure Cow Milk)',
    description: 'খামারের গরুর ওলান থেকে সদ্য দোয়ানো ১০০% খাঁটি ঘন ও পুষ্টিকর সর পড়া হালকা ডেইরি গরুর তরল দুধ।',
    price: 90,
    unit: 'litre',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_13.jpg?v=1778789927',
    isFeatured: true
  },
  {
    category: 'eggs',
    title: 'খাঁটি মাঠের তরল দুধ (Organic Grassfed Milk)',
    description: 'প্রাকৃতিক ঘাস খাওয়া গরুর কচি সুস্বাদু বাটি ডেইরি ওলান দুধ। কোনো প্রকার পানি বা পাউডার মিক্সড নেই।',
    price: 80,
    unit: 'litre',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_13.jpg?v=1778789927'
  },
  {
    category: 'eggs',
    title: 'দেশি ঘি (Premium Hand-churned Ghee)',
    description: 'সিরাজের মাঠের দুধের মাখন থেকে জ্বাল দেওয়া কাঠের চামচ ও পাতিলা চড়ানো কড়া সুঘ্রাণ গোল্ডেন দেশি ঘি।',
    price: 1400,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_14.jpg?v=1778789927',
    isDiscount: true
  },
  {
    category: 'eggs',
    title: 'তাজা মিষ্টি ও টক দই প্যাক (Traditional Sweet Curd)',
    description: 'বগুড়ার ঐতিহ্যবাহী মাটির সরায় পাতা কড়া ঘন কষানো রসে ভরপুর সুমিষ্টি মিষ্টি ও ঠান্ডা টক দই।',
    price: 240,
    unit: 'kg',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_24.jpg?v=1778789927'
  },
  {
    category: 'eggs',
    title: 'কোয়েল পাখির পুষ্টিকর ছোট ডিম (Omega-3 Quail Eggs)',
    description: 'পরিবারের বাড়ন্ত শিশুদের শারীরিক বিকাশে ওমেগা সমৃদ্ধ কোয়েল পাখির অত্যন্ত পুষ্টিকর ছোট ডিমের ট্রিপল সেট।',
    price: 110,
    unit: '30 pcs',
    primaryImage: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600'
  },
  {
    category: 'eggs',
    title: 'খাঁটি রাজহাঁসের বিশাল কুসুমের আস্ত সাদা ডিম (Goose Eggs)',
    description: 'বিশাল আকারের দেশী রাজহাঁসের ধবধবে সাদা ও খাঁটি চারণযোগ্য পুষ্টিকর ক্যালসিয়াম ডিম।',
    price: 80,
    unit: '2 pcs',
    primaryImage: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&sig=goose-eg'
  },

  // Ready To Cook (2 Items)
  {
    category: 'ready-to-cook',
    title: 'মিক্স সবজি প্যাক (Pre-cooked Mixed Vegetables)',
    description: 'রান্নার জন্য একদম ধুয়ে কেটে সমান সাইজে রেডি করা পাঁচমিশেলি কচি টাটকা সবজির প্যাকেট। সময়ের সেরা সাশ্রয়।',
    price: 60,
    unit: '500g',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/download_9.jpg?v=1778788777',
    isFeatured: true
  },
  {
    category: 'ready-to-cook',
    title: 'কাটা পেঁয়াজ প্যাক (Clean Sliced Onion)',
    description: 'ছুলা পরিষ্কার করে যান্ত্রিকভাবে সমান কুচি করে কাটা ঝাঁঝালো পেঁয়াজের প্যাক। সরাসরি কড়াইয়ে ব্যবহারের জন্য প্রস্তুত।',
    price: 45,
    unit: '500g',
    primaryImage: 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/images_21.jpg?v=1778788778',
    isDiscount: true
  }
];

// Combine the raw items into fully formed Product typed objects with correct farmer linkages and 4-5 images each
export const new45Products: Product[] = rawItemsList.map((item, idx) => {
  const farmerIdx = idx % demoFarmers.length;
  const farmer = demoFarmers[farmerIdx];

  const primary = item.primaryImage;
  const secondaryCategory = item.category === 'ready-to-cook' ? 'ready-to-cook' : item.category;
  const catImgs = categoryImages[secondaryCategory] || categoryImages['vegetables'];

  // Construct exactly 5 images to ensure 4-5 image URLs per product
  // 1st image is ALWAYS the exact, unmodified primary Shopify or Unsplash URL
  const pImages: string[] = [primary];
  for (let s = 1; s < 5; s++) {
    const baseImg = catImgs[(idx + s) % catImgs.length];
    pImages.push(`${baseImg}&sig=${idx + 1}-${s}`);
  }

  const price = item.price;
  const discountPrice = item.isDiscount ? Math.round(price * 0.85) : undefined;
  
  // Deterministic ratings
  const rating = parseFloat((4.4 + (idx % 7) * 0.1).toFixed(1));
  const daysAgo = 1 + (idx % 3);
  const harvestDate = `June ${15 - daysAgo}, 2026`;

  return {
    id: `p${idx + 1}`,
    title: item.title,
    description: item.description,
    price: price,
    discountPrice: discountPrice,
    category: item.category,
    farmerId: farmer.id,
    farmerName: farmer.name,
    farmName: `${farmer.name} অর্গানিক এগ্রো`,
    rating: rating > 5.0 ? 5.0 : rating,
    stock: 30 + ((idx * 8) % 75),
    images: pImages,
    isVerified: farmer.verified,
    isReadyToCook: item.category === 'ready-to-cook',
    isFeatured: !!item.isFeatured,
    harvestDate: harvestDate,
    isActive: true,
    approved: true,
    uploaderRole: 'Admin',
    unit: item.unit
  };
});
