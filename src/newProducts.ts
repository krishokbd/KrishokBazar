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
const rawItemsList = [
  // Category: vegetables (8 items)
  {
    category: 'vegetables',
    title: 'বগুড়ার বালু মাটির গোল লাল আলু (Red Potato)',
    description: 'বগুড়ার বিখ্যাত সুস্বাদু বালু মাটির গোল লাল আলু। দীর্ঘ সময় সংরক্ষণযোগ্য ও তরকারির স্বাদ অতুলনীয় করে তোলে।',
    price: 45,
    unit: 'kg',
    isDiscount: true,
    isFeatured: true
  },
  {
    category: 'vegetables',
    title: 'যশোরের তাজা নরম তালের বেগুন (Tall Brinjal)',
    description: 'যশোরের বিখ্যাত কচি ও নরম বীজহীন তাল বেগুন। বেগুন পোড়া ও ভাজিতে চমৎকার রসালো স্বাদ।',
    price: 68,
    unit: 'kg'
  },
  {
    category: 'vegetables',
    title: 'ফরিদপুরের কড়া ঝাঁঝালো পেঁয়াজ (Local Onion)',
    description: 'ফরিদপুরের আসল দেশী লাল পেঁয়াজ। ঝাঁঝালো স্বাদের রান্নার অপরিহার্য সোনালী মশলাদার উপাদান।',
    price: 85,
    unit: 'kg',
    isFeatured: true
  },
  {
    category: 'vegetables',
    title: 'রাজবাড়ীর বড় কোয়ার শুকনো দেশী রসুন (Organic Garlic)',
    description: 'সম্পূর্ণ জৈব উপায়ে বুনো চরে উৎপাদিত বড় কোয়ার দেশী কড়া ঝাঁঝ রসুনের সেরা কোয়ালিটি।',
    price: 140,
    unit: 'kg'
  },
  {
    category: 'vegetables',
    title: 'নরসিংদীর কচি কাঁচা পেঁপে (Green Papaya)',
    description: 'জৈব উপায়ে চাষ করা কচি ও সতেজ সবুজ পেঁপে। তরকারি ও সালাদের জন্য অত্যন্ত উপকারী ও সুস্বাদু।',
    price: 40,
    unit: 'kg',
    isDiscount: true
  },
  {
    category: 'vegetables',
    title: 'কুমিল্লার তাজা তিতকুটে করলা (Bitter Gourd)',
    description: 'ভিটামিন ও আয়রন সমৃদ্ধ সতেজ কচি করলা। রক্ত পরিষ্কার রাখতে সাহায্য করে এবং ভাজিতে অসাধারণ স্বাদ।',
    price: 62,
    unit: 'kg'
  },
  {
    category: 'vegetables',
    title: 'মেহেরপুরের কচি নরম ঢেঁড়শ (Fresh Okra)',
    description: 'ক্ষেত থেকে সদ্য তোলা কচি পিচ্ছিল আঁশহীন কচি ঢেঁড়শ। সকালের গরম ভাতে ভাজির দারুণ স্বাদ।',
    price: 50,
    unit: 'kg'
  },
  {
    category: 'vegetables',
    title: 'সাভারের ধবধবে সাদা তাজা ফুলকপি (White Cauliflower)',
    description: 'পোকামুক্ত সতেজ ও কড়া পাতাযুক্ত বড় সাইজের সাদা ধবধবে ফুলকপি। সরাসরি কৃষকের মাঠ থেকে সংগৃহীত।',
    price: 45,
    unit: 'piece',
    isFeatured: true
  },

  // Category: fruits (7 items)
  {
    category: 'fruits',
    title: 'রাজশাহীর বাঘা থেকে তাজা গোপালভোগ আম (Gopalbhog)',
    description: 'রাজশাহীর বিখ্যাত বাঘা হর্টিকালচার বাগান থেকে সরাসরি কেমিক্যাল ছাড়া সংগৃহীত কড়া মিষ্টি ও সুঘ্রাণ গোপালভোগ আম।',
    price: 150,
    unit: 'kg',
    isDiscount: true,
    isFeatured: true
  },
  {
    category: 'fruits',
    title: 'নরসিংদীর সুস্বাদু তাজা সাগর কলা (Sagor Banana)',
    description: 'নরসিংদীর বিখ্যাত মিষ্টি ও অত্যন্ত পুষ্টিকর তাজা ছড়া সাগর কলা। বাচ্চাদের আদর্শ সকালের নাস্তা।',
    price: 90,
    unit: 'dozen'
  },
  {
    category: 'fruits',
    title: 'কক্সবাজারের তাজা জম্পেশ আনারস (Sweet Pineapple)',
    description: 'কক্সবাজার পাহাড়ের বিখ্যাত মধুর মতো মিষ্টি তাজা বড় আনারস। রসে টুইটুম্বুর আসল ফলের রাজকীয় স্বাদ।',
    price: 65,
    unit: 'piece',
    isFeatured: true
  },
  {
    category: 'fruits',
    title: 'ক্ষেতের কচি মিষ্টি পেয়ারা (Sweet Organic Guava)',
    description: 'ক্ষেত থেকে সদ্য পেড়ে আনা ডালিসহ তরতাজা সবুজ কুড়মুড়ে পেয়ারা। সম্পূর্ণ কেমিক্যাল মুক্ত।',
    price: 70,
    unit: 'kg'
  },
  {
    category: 'fruits',
    title: 'রংপুরের রসালো লাল আস্ত তরমুজ (Watermelon)',
    description: 'গ্রীষ্মের গরমে তৃষ্ণা মেটাতে সেরা কড়া মিষ্টি ও লাল টসটসে কচি তাজা বড় তরমুজ।',
    price: 180,
    unit: 'piece',
    isDiscount: true
  },
  {
    category: 'fruits',
    title: 'পাহাড়ী লাল টসটসে ড্রাগন ফল (Red Dragon Fruit)',
    description: 'পাহাড়ী লাল কুসুমের পুষ্টিকর ও মিষ্টি ড্রাগন ফল। প্রচুর ফাইবার ও ভিটামিন সি সমৃদ্ধ।',
    price: 280,
    unit: 'kg'
  },
  {
    category: 'fruits',
    title: 'মাটিরাঙ্গার মিষ্টি মাল্টা ফল গ্রেড-এ (Malta Fruit)',
    description: 'মাটিরাঙ্গার রাঙামাটি পাহাড়ের আসল মিষ্টি ও রসে ভরা রসালো কচি বড় সাইজের সবুজ মাল্টা।',
    price: 220,
    unit: 'kg',
    isFeatured: true
  },

  // Category: fish (8 items)
  {
    category: 'fish',
    title: 'দিঘির তাজা জ্যান্ত বড় রুই মাছ (Giant Rui Fish)',
    description: 'নিজেদের বড় দিঘি থেকে জ্যান্ত ধরা রুই মাছ। আঁশ ও পিঠের শক্ত চর্বিযুক্ত কড়া তাজা ও মিষ্টি স্বাদের।',
    price: 390,
    unit: 'kg',
    isDiscount: true,
    isFeatured: true
  },
  {
    category: 'fish',
    title: 'হাওরের ও বিলের চকচকে বড় কাতলা (Katla Fish)',
    description: 'হাওরের গভীর পানির শ্যাওলা খেয়ে বড় হওয়া সুস্বাদু চর্বিযুক্ত তাজা বড় কাতলা মাছের মাথা ও পেট।',
    price: 420,
    unit: 'kg'
  },
  {
    category: 'fish',
    title: 'খুলনার লোনা জলের তাজা বাগদা চিংড়ি (Bagda Prawn)',
    description: 'খুলনার লোনা জলের প্রাকৃতিকভাবে পালিত বড় মাথাওয়ালা ও শক্ত খোলসের চকচকে বাগদা চিংড়ি।',
    price: 880,
    unit: 'kg',
    isFeatured: true
  },
  {
    category: 'fish',
    title: 'পদ্মা নদীর বড় পুরুষ গলদা চিংড়ি (Golda Prawn)',
    description: 'পদ্মা নদীর বড় আকারের নীল দাড়া যুক্ত সুস্বাদু পুরুষ গলদা চিংড়ি। রসালো মাংসে ভরপুর।',
    price: 1150,
    unit: 'kg'
  },
  {
    category: 'fish',
    title: 'হাওরের নদীর কালো জ্যান্ত শিং মাছ (Singi Fish)',
    description: 'সম্পূর্ণ দেশী চলন বিল ও হাওরের গভীর কাদার পুষ্টিকর ও লৌহ সমৃদ্ধ জ্যান্ত কালো শিং মাছ।',
    price: 660,
    unit: 'kg',
    isDiscount: true
  },
  {
    category: 'fish',
    title: 'দেশী জ্যান্ত লোকাল মাগুর মাছ (Magur Fish)',
    description: 'অপারেশন পরবর্তী বা বাচ্চাদের শারীরিক বিকাশে অত্যন্ত সহযোগী আসল নদী ও নালা থেকে সংগৃহীত মাগুর।',
    price: 720,
    unit: 'kg'
  },
  {
    category: 'fish',
    title: 'চলন বিলের জ্যান্ত কালো বড় শোল মাছ (Shol Fish)',
    description: 'চলন বিলের শ্যাওলা ও ছোট মাছ খেয়ে বড় হওয়া ডাল ভুনা এবং কষা রান্নার অনন্য বড় কালো শোল।',
    price: 590,
    unit: 'kg'
  },
  {
    category: 'fish',
    title: 'মাওয়া ঘাটের তাজা রূপালী ইলিশ (Kora Padma Hilsa)',
    description: 'পদ্মা নদীর মাওয়া ঘাট থেকে আনা ডিম ছাড়া অত্যন্ত সুস্বাদু তেল চকচকে কড়া সুঘ্রাণের বড় রূপালী ইলিশ।',
    price: 1450,
    unit: 'kg',
    isFeatured: true
  },

  // Category: meat (8 items)
  {
    category: 'meat',
    title: 'বাড়ির উঠোনে চরা দেশী মুরগি আস্ত (Local Chicken)',
    description: 'ফিড ও ক্ষতিকর কেমিক্যাল ছাড়া খাঁটি অর্গানিক বাড়ির উঠানে চড়ে বেড়ানো আসল মিষ্টি স্বাদের সুস্বাদু দেশী মুরগি।',
    price: 460,
    unit: 'kg',
    isDiscount: true,
    isFeatured: true
  },
  {
    category: 'meat',
    title: 'কচি ছাগলের নরম খাসির মাংস (Fresh Mutton)',
    description: 'তরুণ কচি খাসির গন্ধহীন নরম সুস্বাদু ও পুষ্টিকর তাজা খাসির মাংস ১০০% লাইভ হালাল কাটিং গ্যারান্টি।',
    price: 1080,
    unit: 'kg',
    isFeatured: true
  },
  {
    category: 'meat',
    title: 'হাড় চর্বিমুক্ত গরুর সলিড লাল মাংস (Solid Beef)',
    description: 'অতিরিক্ত হাড়, পর্দা ও চর্বি ছাড়া ১০০% সলিড গরুর তাজা রক্তাভ লাল তাজা মাংসের বড় টুকরা।',
    price: 865,
    unit: 'kg'
  },
  {
    category: 'meat',
    title: 'ড্রেসড কোয়েল পাখির পুষ্টিকর মাংস (Quail Meat)',
    description: 'অত্যন্ত পুষ্টিকর ও ওমেগা সমৃদ্ধ বাচ্চাদের প্রিয় কচি কোয়েল পাখির চামড়াহীন ড্রেসড মাংস।',
    price: 85,
    unit: 'piece'
  },
  {
    category: 'meat',
    title: 'শীতকালী বিলের চরা মোটা পাতিহাঁস (Dressed Duck)',
    description: 'শীতকালে বিলে ধান ও প্রাকৃতিক ঝিনুক খেয়ে হৃষ্টপুষ্ট হওয়া কড়া নরম সুস্বাদু আস্ত পাতিহাঁস।',
    price: 560,
    unit: 'piece',
    isDiscount: true
  },
  {
    category: 'meat',
    title: 'রক্তবর্ধক গরুর লাল তাজা কলিজা (Beef Liver)',
    description: 'সকালে রুটি ও পরোটার সাথে রান্নার জন্য অত্যন্ত নরম লোহা ও ভিটামিন বি সমৃদ্ধ গরুর লাল কলিজা।',
    price: 820,
    unit: 'kg'
  },
  {
    category: 'meat',
    title: 'রোস্টের জন্য উপযুক্ত সোনালী মুরগি (Sonali)',
    description: '৮০০ গ্রাম থেকে ১ কেজি ওজনের সোনালী মুরগি, বিয়ে বাড়ির মনকাড়া রোস্ট তৈরির জন্য প্রথম গ্রেড।',
    price: 285,
    unit: 'piece'
  },
  {
    category: 'meat',
    title: 'ঐতিহ্যবাহী চর্বিযুক্ত বড় রাজহাঁস আস্ত (Goose)',
    description: 'বড় আকারের অত্যন্ত তেলসমৃদ্ধ শীতের ঐতিহ্যবাহী রাজকীয় স্বাদের ধীর চারণ দেশী রাজহাঁস।',
    price: 1650,
    unit: 'piece',
    isFeatured: true
  },

  // Category: eggs (7 items)
  {
    category: 'eggs',
    title: 'লাল কুসুমযুক্ত স্পেশাল বাতির ডিম (Double Yolk)',
    description: 'প্রতিটি ডিমে জোড়া লাল কুসুম সমৃদ্ধ অত্যন্ত বিরল ও পুষ্টিগুণ সম্পন্ন খাঁটি কড়া লাল ডিমের প্যাক।',
    price: 210,
    unit: '10 pcs',
    isDiscount: true,
    isFeatured: true
  },
  {
    category: 'eggs',
    title: 'পাহাড়ী চারণ কড়া লাল বুনো ডিম (Mountain Eggs)',
    description: 'পাহাড়ের খাঁচার বাইরে প্রাকৃতিক খাবার খাইয়ে চড়ানো মুরগির খাঁটি অর্গানিক লাল সুন্দর কুসুমের পুষ্টিকর সেরা ডিম।',
    price: 165,
    unit: 'dozen'
  },
  {
    category: 'eggs',
    title: 'সাভারের তাজা বিলের হাঁসের ডিম (Local Duck Eggs)',
    description: 'সাভারের বড় বিলের হাঁসের তাজা লাল ডিম। বাচ্চাদের দৈহিক শক্তি বৃদ্ধি ও হাড় মজবুতের জন্য প্রধান উৎস।',
    price: 170,
    unit: 'dozen',
    isFeatured: true
  },
  {
    category: 'eggs',
    title: 'দেশী রাজহাঁসের বিশাল কুসুমের সাদা ডিম (Goose Eggs)',
    description: 'বিশাল আকারের ক্যালসিয়ামের খনি দেশী রাজহাঁসের ধবধবে সাদা ও খাঁটি চারণযোগ্য পুষ্টিকর ডিম।',
    price: 80,
    unit: '2 pcs'
  },
  {
    category: 'eggs',
    title: 'কচি কোয়েল ডিম ডাবল ট্রিপল প্যাক (Quail Eggs)',
    description: 'পরিবারের বাড়ন্ত বাচ্চাদের নাশতার জন্য পুষ্টিকর ও ওমেগা-৩ বুস্টেড কচি কোয়েল পাখির ২৫টি সুস্বাদু ডিম।',
    price: 120,
    unit: '30 pcs',
    isDiscount: true
  },
  {
    category: 'eggs',
    title: 'খাঁটি লাল খোলসের কড়া কুসুমের ডিম (Organic Eggs)',
    description: 'খাঁটি উন্মুক্ত চারণযোগ্য মুরগির সতেজ হাই প্রোটিন লাল কুসুমের অত্যন্ত সুস্বাদু চকচকে ডিম।',
    price: 160,
    unit: 'dozen'
  },
  {
    category: 'eggs',
    title: 'ডায়েট কলার ওমেগা ফ্যাট ডিম (Premium Eggs)',
    description: 'ফিটনেস ও বডি বিল্ডিংয়ের জন্য সুপারচার্জড ভিটামিন এ ও ডি যুক্ত ডেকোরেট খাঁটি উন্নত ডিম।',
    price: 190,
    unit: 'dozen',
    isFeatured: true
  },

  // Category: ready-to-cook (7 items)
  {
    category: 'ready-to-cook',
    title: 'সরাসরি ভাজির কুচানো আলুর প্যাক (Sliced Potato)',
    description: 'পরিষ্কার পানিতে কয়েক দফ ধোয়া ও সমান মাপে কুচানো গোল আলু, সরাসরি মচমচে ভাজির জন্য প্রস্তুত।',
    price: 36,
    unit: '500g',
    isDiscount: true,
    isFeatured: true
  },
  {
    category: 'ready-to-cook',
    title: 'খোসা ও বিচি ফেলে গোল স্লাইস লাউ (Cut Gourd)',
    description: 'রান্নার জন্য একদম রেডি, খোসা ও মধ্য ভাগ ফেলে গোল বাটি কুচানো তাজা লাউ প্যাক। রান্না সহজতর করে।',
    price: 46,
    unit: '500g'
  },
  {
    category: 'ready-to-cook',
    title: 'ধোয়া ও কাটা দেশী মুরগির কারি সেট (Precut Chicken)',
    description: 'সম্পূর্ণ ড্রেসড ও মাঝারি কারি সাইজ টুকরো করে লবণ দিয়ে ধুয়ে জিপলক ফুড গ্রেড ভ্যাকুয়াম প্যাকে ভরা দেশী মুরগি।',
    price: 265,
    unit: '500g',
    isDiscount: true,
    isFeatured: true
  },
  {
    category: 'ready-to-cook',
    title: 'আঁশ ছাড়ানো ও কাটা রুই মাছের কারি স্লাইস (Clean Fish)',
    description: 'মাথাসহ পিস করা ও সম্পূর্ণ পরিষ্কার পানিতে ধুয়ে রক্তহীন পরিচ্ছন্ন করা দিঘির রুই মাছের রান্নার প্যাক।',
    price: 225,
    unit: '500g'
  },
  {
    category: 'ready-to-cook',
    title: 'মিক্স চাইনিজ ভেজিটেবল স্লাইস বক্স (Chinese Veg)',
    description: 'গাজর, পেঁপে, বরবটি ও বাঁধাকপির সমান চ্যাপ্টা কাটা স্লাইস যা নুডলস ও ফ্রাইড রাইসে সরাসরি কুকার দেওয়া যায়।',
    price: 58,
    unit: '500g',
    isFeatured: true
  },
  {
    category: 'ready-to-cook',
    title: 'ছুলে কুচি করা তাজা লাল পেঁয়াজ বক্স (Peeled Onion)',
    description: 'আঁশ ও উপরের শুকনো ছুলা পরিষ্কার করে নিখুঁত মাঝারি কুচি করা ঝাঁঝালো পেঁয়াজ যা ডাইরেক্ট তরকারিতে ছিটানো যায়।',
    price: 62,
    unit: '500g'
  },
  {
    category: 'ready-to-cook',
    title: 'হাত বাটায় সুগন্ধি রসুনের কড়া পেস্ট (Garlic Paste)',
    description: 'ঐতিহ্যবাহী শিল-পাটা বাটায় পেষা কড়া সুগন্ধি তাজা রসুনের পেস্ট, কোনো কড়া কৃত্রিম প্রিজারভেটিভ বা রঙ ছাড়া।',
    price: 92,
    unit: '250g',
    isFeatured: true
  }
];

// Combine the raw items into fully formed Product typed objects with correct farmer linkages and 4-5 images each
export const new45Products: Product[] = rawItemsList.map((item, idx) => {
  const farmerIdx = idx % demoFarmers.length;
  const farmer = demoFarmers[farmerIdx];

  // Pick appropriate image arrays and assign exactly 4-5 high-quality images per product
  const catImgs = categoryImages[item.category] || categoryImages['vegetables'];
  
  // Decide whether this product gets 4 or 5 images (let's alternate to give variation)
  const imageCount = (idx % 2 === 0) ? 5 : 4;
  const pImages: string[] = [];
  for (let s = 0; s < imageCount; s++) {
    const baseImg = catImgs[s % catImgs.length];
    // Attach a deterministic signature cache buster to generate stunning visual variations
    pImages.push(`${baseImg}&sig=${idx + 1}-${s}`);
  }

  const price = item.price;
  const discountPrice = item.isDiscount ? Math.round(price * 0.85) : undefined;
  
  // Deterministic ratings
  const rating = parseFloat((4.3 + (idx % 8) * 0.1).toFixed(1));
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
    stock: 25 + ((idx * 7) % 85),
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
