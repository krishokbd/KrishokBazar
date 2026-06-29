import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Product, ProductVariation, Order } from '../types';
import { FEMALE_AVATAR, MALE_AVATAR } from '../assets';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { FarmerSalesChart } from './FarmerSalesChart';
import { LazyImage } from './LazyImage';

// Client-side image compression downscaling utility to enforce strict size bounds
const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error("শুধুমাত্র ছবি আপলোড করা যাবে!"));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
import { 
  User, 
  Phone, 
  ShieldCheck, 
  TrendingUp, 
  Lock, 
  Package, 
  MapPin, 
  AlertCircle, 
  Eye, 
  Settings, 
  LogOut, 
  Plus, 
  CheckCircle2, 
  DollarSign, 
  ShoppingCart,
  Layers,
  ArrowRight,
  Camera,
  Upload,
  Image as ImageIcon,
  Bell,
  BookOpen,
  Play,
  Award,
  Video,
  GraduationCap,
  Search
} from 'lucide-react';

export interface EducationGuide {
  id: string;
  category: 'soil' | 'pest' | 'irrigation' | 'grading';
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  durationBn: string;
  durationEn: string;
  difficultyBn: 'সহজ' | 'মধ্যম' | 'উন্নত';
  difficultyEn: 'Easy' | 'Medium' | 'Advanced';
  embedUrl: string;
  thumbnail: string;
  tipsBn: string[];
  tipsEn: string[];
  quiz: {
    questionBn: string;
    questionEn: string;
    optionsBn: string[];
    optionsEn: string[];
    answerIndex: number;
    explanationBn: string;
    explanationEn: string;
  };
}

export const SUSTAINABLE_GUIDES: EducationGuide[] = [
  {
    id: 'guide-soil-1',
    category: 'soil',
    titleBn: 'জৈব সার ও উন্নত কেঁচো সার (ভার্মিকম্পোস্ট) উৎপাদন',
    titleEn: 'Vermi-composting & Organic Fertilizer Production',
    descBn: 'কীভাবে খামারের গোবর ও উচ্ছিষ্ট সামগ্রী দিয়ে সাশ্রয়ী কেঁচো সার তৈরি করবেন এবং রাসায়নিক সারের খরচ ৫০% সাশ্রয় করবেন।',
    descEn: 'Learn how to produce rich vermicompost from farm byproducts, cutting down synthetic fertilizer reliance by half.',
    durationBn: '৫ মিনিট',
    durationEn: '5 Mins',
    difficultyBn: 'সহজ',
    difficultyEn: 'Easy',
    embedUrl: 'https://www.youtube.com/embed/zH87eHscG_c',
    thumbnail: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=400',
    tipsBn: [
      'রান্নাঘরের বা সবজির অবশিষ্টাংশ, গোবর ও কলার খোসা কেঁচো সার তৈরিতে আদর্শ উপাদান।',
      'আর্দ্রতা সর্বদা ৫০-৬০% রাখতে হবে এবং সরাসরি কড়া রোদ থেকে দূরে ছায়াযুক্ত স্থানে রাখুন।',
      '৪৫ থেকে ৬০ দিনের মধ্যে উৎকৃষ্ট মানের দানাদার কেঁচো সার সম্পূর্ণরূপে প্রস্তুত হয়ে যায়।'
    ],
    tipsEn: [
      'Vegetable peels, standard farmyard manure, and banana skins make premium vermicompost ingredients.',
      'Maintain dampness at 50-60% moisture, and place the compost bin under physical shade away from harsh sunlight.',
      'Perfect dark, crumbly, granular organic vermicompost cures completely in 45 to 60 days.'
    ],
    quiz: {
      questionBn: 'ভার্মিকম্পোস্ট বা কেঁচো সার তৈরিতে আর্দ্রতা বা ভেজা ভাব কতভাগ রাখা উত্তম?',
      questionEn: 'What is the optimal moisture level required for compiling vermicompost?',
      optionsBn: ['১০% (একেবারে শুকনো)', '৫০-৬০% (হালকা ভেজা ও আর্দ্র)', '১০০% (জলমগ্ন কাদাকাদা)', 'কোনোটিই নয়'],
      optionsEn: ['10% (Very Dry)', '50-60% (Slightly Damp)', '100% (Submerged Muddy)', 'None of the above'],
      answerIndex: 1,
      explanationBn: 'কেঁচো সারের আর্দ্রতা ৫০-৬০% রাখা বাঞ্ছনীয়। অতিরিক্ত শুকনো হলে কেঁচো মারা যায় এবং অতিরিক্ত ভেজা হলে অক্সিজেন যাতায়াত ব্যাহত হয়ে দুর্গন্ধ ছড়ায়।',
      explanationEn: 'Moisture between 50-60% keeps the earthworms active. Too dry kills them, while 100% water blocks oxygen Flow causing rot.'
    }
  },
  {
    id: 'guide-pest-2',
    category: 'pest',
    titleBn: 'আইপিএম পদ্ধতি ও জৈব ফেরোমন ফাঁদের ম্যাজিক',
    titleEn: 'IPM Tactics & Pheromone Insect Traps Magic',
    descBn: 'ক্ষতিকর রাসায়নিক কীটনাশক ছাড়াই সমন্বিত ফেরোমন ফাঁদ ও হলুদ স্টিকি বোর্ড দিয়ে ফসলকে বালাইমুক্ত রাখার আধুনিক উপায়।',
    descEn: 'Protect vegetables without poison sprays using organic pheromone lures and sticky yellow cards.',
    durationBn: '৮ মিনিট',
    durationEn: '8 Mins',
    difficultyBn: 'মধ্যম',
    difficultyEn: 'Medium',
    embedUrl: 'https://www.youtube.com/embed/N-R48cPhIhk',
    thumbnail: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400',
    tipsBn: [
      'সেক্স ফেরোমন ফাঁদ মূলত পুরুষ মাছি বা পোকার নজর কেড়ে প্রজনন চক্র ভঙ্গ করে বালাই প্রতিরোধ করে।',
      'হলুদ আঠালো ট্র্যাপ বা কার্ড ছোট সাদা মাছি, থ্রিপস ও সাধারণ জাব পোকা দমনের জন্য দারুণ কার্যকরী।',
      'প্রতি শতক জমিতে সাধারণত ১-২টি উপযুক্ত ফাঁদ বসালে খুব চমৎকার ফল পাওয়া যায়।'
    ],
    tipsEn: [
      'Sex pheromone trap lures male insect pests using specific hormones, breaking the breeding cycle naturally.',
      'Bright yellow sticky cards automatically trap aphid flyers, whiteflies, and small thrips.',
      'Placing 1-2 standard pheromone traps per decimal is plenty to safeguard high-density crops.'
    ],
    quiz: {
      questionBn: 'ফেরোমন ফাঁদ মূলত ফসলের কোন ধরণের বালাই বা পোকা প্রতিরোধে অনন্য ভুমিকা রাখ ট্র্যাপ?',
      questionEn: 'Pheromone lures mainly work against which pest type to safeguard vegetables?',
      optionsBn: ['মাটি সংলগ্ন উইপোকা', 'উড়ন্ত পোকা ও ফল ছিদ্রকারী মাছি পোকা', 'ফসলের ইঁদুর বা কাঠবিড়ালি', 'ক্ষতিকর ছত্রাক'],
      optionsEn: ['Underground soil termites', 'Flying insects & fruit-boring flies', 'Feld rats & rodents', 'Mildew and fungus pathogens'],
      answerIndex: 1,
      explanationBn: 'ফেরোমন ফাঁদ উড়ন্ত স্ত্রী পোকার হরমোন উদ্দীপক ব্যবহার করে ক্ষতিকর বালাই উড়ানো পুরুষ পোকাকে বোতলে আটকে ফসল রক্ষা করে।',
      explanationEn: 'They leverage synthetic female scents to trap target flying male flies, preventing mass reproduction.'
    }
  },
  {
    id: 'guide-irrigation-3',
    category: 'irrigation',
    titleBn: 'স্মার্ট সেচ প্রযুক্তি: AWD পদ্ধতিতে ২৫% পানির সাশ্রয়',
    titleEn: 'Smart Irrigation: 25% Water Saving with AWD Method',
    descBn: 'মাটির নিচে ছিদ্রযুক্ত নল ব্যবহার করে আর্দ্রতা বুজে পরিমিত সেচ দেয়া যা বোরো চাষে জ্বালানি ও খরচ অনেকাংশে কমায়।',
    descEn: 'Learn Alternate Wetting & Drying (AWD) using standard soil tubes to save water, fuel pumping costs and effort.',
    durationBn: '৬ মিনিট',
    durationEn: '6 Mins',
    difficultyBn: 'উন্নত',
    difficultyEn: 'Advanced',
    embedUrl: 'https://www.youtube.com/embed/E-9pZz19Jb0',
    thumbnail: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=400',
    tipsBn: [
      'AWD প্লাস্টিক পাইপটি জমিতে মাটির নিচে অন্তত ১৫ থেকে ২০ সেমি গভীরতায় স্থাপন করতে হবে।',
      'পাইপের ভেতরের পানির স্তর মাটির নিচে ১৫ সেমি নামলে তবেই পুনরায় নতুন করে জমিতে সেচ প্রদান করুন।',
      'শস্যের কুশি বা ফ্লাওয়ারিং বা ফুল আসার সময়ে জমিতে ৩-৪ সেমি স্থির পানি বজায় রাখা অতি জরুরি।'
    ],
    tipsEn: [
      'Install the perforated AWD irrigation tube at least 15 to 20 cm deep inside the rice soil.',
      'Irrigate only when the internal standing water drops 15 cm below the outer soil surface.',
      'Keep 3-4 cm of continuous standing water specifically during the crop tillering and flowering phase.'
    ],
    quiz: {
      questionBn: 'AWD পাইপের নিচের পানির স্তর পৃষ্ঠ মাটি থেকে কতটুকু গভীর নামলে পুনরায় সেচ নির্ধারণ করতে হয়?',
      questionEn: 'At what soil depth threshold inside the AWD tube should you trigger re-irrigation?',
      optionsBn: ['মাটি বরাবর (০ সেমি)', 'মাটির নিচে ১৫ সেমি', 'মাটির নিচে ১০০ সেমি', 'সবসময় পানি উপচে থাকা জরুরি'],
      optionsEn: ['Soil level (0 cm)', '15 cm below soil surface', '100 cm below soil surface', 'Continuous overflow required'],
      answerIndex: 1,
      explanationBn: 'পানির স্তর মাটির নিচে ১৫ সেমি পর্যন্ত নামা পর্যন্ত ধান ক্ষেত ভেজা থাকে। পুন-সেচ দিলে মাটির অক্সিজেন চলাচল ঠিক থাকে ও ২৫% পানি সাশ্রয় হয়।',
      explanationEn: '15 cm ensures the soil remains humid while restoring deep soil oxygenation and saving immense fuel pump usage.'
    }
  },
  {
    id: 'guide-grading-4',
    category: 'grading',
    titleBn: 'ফসল কাটার পর গ্রেডিং ও বৈজ্ঞানিক ওয়াশিং পদ্ধতি',
    titleEn: 'Post-Harvest Sorting, Grading & Cleaning Best Practices',
    descBn: 'মাঠ থেকে তোলার পর শস্যকে পচনমুক্ত উপায়ে বাছাই ও প্যাকিং করার সঠিক প্রক্রিয়া যা ফসলের গুণাগুণ রক্ষা করবে।',
    descEn: 'Master post-harvest grading, cleaning with safe sanitizers, and aerated packing to prevent cargo wastage.',
    durationBn: '৭ মিনিট',
    durationEn: '7 Mins',
    difficultyBn: 'সহজ',
    difficultyEn: 'Easy',
    embedUrl: 'https://www.youtube.com/embed/vWb6_G2y4k4',
    thumbnail: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=400',
    tipsBn: [
      'ক্ষেতের ফসল কাটার সাথে সাথে কড়া রোদ থেকে বাঁচিয়ে ছায়াযুক্ত ঠান্ডা জায়গায় স্তূপ করুন।',
      'পানির সাথে হালকা ফিটকিরি বা অনুমোদিত মাত্রার ফুড-গ্রেড ক্লোরিন দিয়ে ফসল ধুলে জীবাণুমুক্ত থাকে।',
      'প্যাক করার পূর্বে কখনোই সবজি ভেজা রাখতে নেই; ঠান্ডা বাতাসে শুকিয়ে বায়ুপূর্ণ প্লাস্টিক ক্র্যেটে ভরুন।'
    ],
    tipsEn: [
      'Gather harvested organic crops promptly inside well-shaded, cool structures out of direct sun rays.',
      'Rinse produce in clean water mixed with minimal certified alum or organic sanitizers to kill pathogens.',
      'Never pack crops while moist. Chill-dry with ambient air, then stash in bio-ventilated crates only.'
    ],
    quiz: {
      questionBn: 'ধৌত করা ফসল প্যাকেজিং করার ক্ষেত্রে কোন কাজটি করা অত্যন্ত ক্ষতিকর এবং পচন বেগবান করে?',
      questionEn: 'What action is extremely hazardous and speeds up spoilage when packaging wet washed crops?',
      optionsBn: ['বাতাসে পানি শুকিয়ে নেয়া', 'ভেজা অবস্থায় বাতাস নিরোধক বস্তায় ভরে ফেলা', 'ছিদ্রযুক্ত খাঁচা ব্যবহার', 'প্লাস্টিক ক্র্যেটস ব্যবহার'],
      optionsEn: ['Drying thoroughly in a cool draft', 'Packing crops while fully wet into insulated bags', 'Using ventilated cages', 'Using plastic crates'],
      answerIndex: 1,
      explanationBn: 'ভেজা অবস্থায় ফসলে দ্রুত ছত্রাক ও ব্যাকটেরিয়া জন্মায়। তাই প্যাক করার পূর্বে অবশ্যই ঠান্ডা বাতাসে ফসল ভালো করে শুকিয়ে নিতে হয়।',
      explanationEn: 'Moisture inside closed storage rapidly triggers fungus and rot. Cool-drying is non-negotiable before transport.'
    }
  }
];

export const FarmerDashboard: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser,
    products, 
    orders, 
    farmers,
    updateFarmer, 
    addProduct,
    editProduct,
    deleteProduct,
    categories,
    logout,
    setView,
    language
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'profile' | 'verification' | 'education'>('overview');

  // Farmer Education custom states
  const [eduCategory, setEduCategory] = useState<'all' | 'soil' | 'pest' | 'irrigation' | 'grading'>('all');
  const [eduSearch, setEduSearch] = useState('');
  const [completedGuides, setCompletedGuides] = useState<string[]>(['guide-soil-1']);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeGuide, setActiveGuide] = useState<EducationGuide | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [confettiActive, setConfettiActive] = useState<boolean>(false);
  const [selectedGuideDetail, setSelectedGuideDetail] = useState<EducationGuide | null>(null);

  // Product Add/Edit Form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [prodTitle, setProdTitle] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodDiscountPrice, setProdDiscountPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('vegetables');
  const [prodDesc, setProdDesc] = useState('');
  const [prodStock, setProdStock] = useState(10);
  const [prodReadyToCook, setProdReadyToCook] = useState(false);
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodUnit, setProdUnit] = useState('Kg');
  const [prodHarvestDate, setProdHarvestDate] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [prodVariations, setProdVariations] = useState<ProductVariation[]>([]);
  const [newVarNameBn, setNewVarNameBn] = useState('');
  const [newVarNameEn, setNewVarNameEn] = useState('');
  const [newVarPrice, setNewVarPrice] = useState('');

  const handleImageFileChange = async (files: FileList | null) => {
    if (!files) return;
    setUploadError('');
    setIsUploading(true);

    const uploadedUrls: string[] = [...prodImages].filter(Boolean);
    const filesArray = Array.from(files);

    if (uploadedUrls.length + filesArray.length > 5) {
      alert("সর্বোচ্চ ৫টি ছবি আপলোড করা যাবে!");
      setIsUploading(false);
      return;
    }

    try {
      for (const file of filesArray) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`ছবি "${file.name}" ৫ মেগাবাইটের বেশি বড়। দয়া করে ছোট ছবি নির্বাচন করুন!`);
          continue;
        }

        let blobToUpload: Blob;
        try {
          blobToUpload = await compressImage(file);
        } catch (compErr) {
          console.warn("Compression failed, uploading original:", compErr);
          blobToUpload = file;
        }

        if (storage) {
          const fileRef = ref(storage, `products/${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${file.name}`);
          await uploadBytes(fileRef, blobToUpload);
          const downloadUrl = await getDownloadURL(fileRef);
          uploadedUrls.push(downloadUrl);
        } else {
          const dataUrl = await new Promise<string>((res) => {
            const r = new FileReader();
            r.onload = () => res(r.result as string);
            r.readAsDataURL(blobToUpload);
          });
          uploadedUrls.push(dataUrl);
        }
      }
      setProdImages(uploadedUrls);
    } catch (err: any) {
      console.error("Image upload failed:", err);
      setUploadError("ছবি আপলোডে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsUploading(false);
    }
  };

  // Profile Edit fields
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profilePassword, setProfilePassword] = useState(currentUser?.password || 'Ajzakir@2020');
  const [profileDistrict, setProfileDistrict] = useState(currentUser?.district || 'Rajshahi');
  const [profileAddress, setProfileAddress] = useState(currentUser?.address || 'রাজভাট, রাজশাহী');
  const [profileLandSize, setProfileLandSize] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState<string[]>([]);
  
  const currentFarmer = farmers.find(f => f.id === currentUser?.farmerId);
  const isVerified = currentFarmer?.verified || false;

  // Initialize land info
  React.useEffect(() => {
    if (currentFarmer) {
      setProfileLandSize(currentFarmer.landSize || '২ বিঘা');
      setProfileName(currentFarmer.name);
      setProfilePhone(currentFarmer.phone);
      setProfileAvatar(currentFarmer.avatar || '');
      setYoutubeVideos(currentFarmer.youtubeVideos || []);
      if ((currentFarmer as any).password) {
        setProfilePassword((currentFarmer as any).password);
      }
    }
  }, [currentFarmer]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) { 
        alert("বাছাইকৃত ছবিটির আকার অনেক বড়! অনুগ্রহ করে ৮০০ KB-র কম আকারের ছবি আপলোড করুন।");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfileAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh] bg-white rounded-3xl border border-gray-100 shadow-sm max-w-sm mx-auto my-10">
        <AlertCircle className="h-12 w-12 text-rose-500 mb-3 animate-pulse" />
        <h2 className="text-sm font-black text-gray-800">অ্যাক্সেস অস্বীকার করা হয়েছে!</h2>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          কৃষক ড্যাশবোর্ড ব্যবহার করতে অনুগ্রহ করে আপনার অংশীদার অ্যাকাউন্ট ও পাসওয়ার্ড দিয়ে লগইন করুন।
        </p>
      </div>
    );
  }

  // Filter products matching this farmer
  const farmerProducts = products.filter(p => p.farmerId === currentUser.farmerId);

  // Filter orders containing products from this farmer
  const farmerOrders = orders.filter(o => 
    o.products.some(p => p.farmerId === currentUser.farmerId)
  );

  // Stats calculation
  const totalBalance = currentFarmer?.balance || 0;
  const totalSalesCount = farmerOrders.filter(o => o.status === 'Delivered').length;
  const pendingOrdersCount = farmerOrders.filter(o => o.status === 'Pending').length;

  const handleProfileUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName || !profilePhone) {
      alert("নাম এবং মোবাইল নম্বর আবশ্যিক!");
      return;
    }

    if (currentUser.farmerId) {
      const updatedData = {
        name: profileName,
        phone: profilePhone,
        district: profileDistrict,
        address: profileAddress,
        landSize: profileLandSize,
        password: profilePassword,
        avatar: profileAvatar,
        youtubeVideos: youtubeVideos
      };

      updateFarmer(currentUser.farmerId, updatedData);

      // Update current logged-in context user as well
      setCurrentUser(prev => prev ? {
        ...prev,
        name: profileName,
        phone: profilePhone,
        address: profileAddress,
        district: profileDistrict,
        password: profilePassword,
        avatar: profileAvatar,
        youtubeVideos: youtubeVideos
      } : null);

      alert("আপনার প্রোফাইল তথ্য ও ছবি সফলভাবে হালনাগাদ করা হয়েছে!");
    }
  };

  const handleFarmerProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || prodPrice <= 0) {
      alert("পণ্যের নাম ও সঠিক মূল্য প্রদান করুন!");
      return;
    }

    const finalImages = prodImages.filter(Boolean);
    if (finalImages.length === 0) {
      finalImages.push('https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60-1');
    }

    const pPayload = {
      title: prodTitle,
      price: Number(prodPrice),
      discountPrice: prodDiscountPrice ? Number(prodDiscountPrice) : undefined,
      category: prodCategory,
      description: prodDesc || 'কৃষকের সতেজ মাঠ থেকে সরাসরি সংগৃহীত অর্গানিক ও বিষমুক্ত ফসল।',
      stock: Number(prodStock),
      isReadyToCook: prodReadyToCook,
      images: finalImages,
      variations: prodVariations,
      farmerId: currentUser.farmerId || 'f70',
      farmerName: currentUser.name || 'খামারি অংশীদার',
      rating: 5.0,
      isVerified: isVerified,
      approved: true, // Auto-approved as requested by user to directly link to homepage
      uploaderRole: 'Farmer' as const,
      unit: prodUnit,
      harvestDate: prodHarvestDate || undefined
    };

    if (editingProduct) {
      editProduct(editingProduct.id, pPayload);
      alert("পণ্যটি সফলভাবে হালনাগাদ করা হয়েছে এবং সরাসরি হোমে যুক্ত হয়েছে!");
    } else {
      addProduct({ id: `p-farm-${Date.now()}`, ...pPayload } as any);
      alert("বাছাইকৃত তাজা ফসলটি সফলভাবে আপলোড করা হয়েছে এবং সরাসরি হোমে যুক্ত হয়েছে!");
    }

    // Redirect to homepage to show the uploaded product instantly
    setView('home');

    // Reset Form
    setIsAddingProduct(false);
    setEditingProduct(null);
    setProdTitle('');
    setProdPrice(0);
    setProdDiscountPrice('');
    setProdCategory('vegetables');
    setProdDesc('');
    setProdStock(10);
    setProdReadyToCook(false);
    setProdImages([]);
    setProdUnit('Kg');
    setProdHarvestDate('');
    setProdVariations([]);
    setNewVarNameBn('');
    setNewVarNameEn('');
    setNewVarPrice('');
  };

  const handleStartEdit = (p: Product) => {
    setEditingProduct(p);
    setProdTitle(p.title);
    setProdPrice(p.price);
    setProdDiscountPrice(p.discountPrice ? String(p.discountPrice) : '');
    setProdCategory(p.category);
    setProdDesc(p.description);
    setProdStock(p.stock);
    setProdReadyToCook(p.isReadyToCook);
    setProdImages(p.images && p.images.length > 0 ? p.images : ['']);
    setProdUnit(p.unit || 'Kg');
    setProdHarvestDate(p.harvestDate || '');
    setProdVariations(p.variations || []);
    setNewVarNameBn('');
    setNewVarNameEn('');
    setNewVarPrice('');
    setIsAddingProduct(true);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-sans mb-16 select-none max-w-full overflow-x-hidden">
      {/* MOBILE COMPACT HEADER */}
      <div className="bg-emerald-800 text-white p-4 pb-6 rounded-b-[2rem] shadow-md border-b border-emerald-700/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden shrink-0">
              <span className="text-lg">🚜</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-emerald-250 tracking-widest bg-emerald-950/40 px-2 py-0.5 rounded-md">কৃষক ড্যাশবোর্ড</span>
                {isVerified ? (
                  <span className="text-[8px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded-full">🛡️ ভেরিফাইড অংশীদার</span>
                ) : (
                  <span className="text-[8px] font-bold text-amber-900 bg-amber-400 px-1.5 py-0.5 rounded-full">⏳ আনভেরিফাইড</span>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-black text-white mt-1 leading-none">{currentUser.name}</h1>
              <p className="text-[10px] text-emerald-100 mt-1 font-mono">{currentUser.phone}</p>
            </div>
          </div>
          
          <button 
            onClick={() => { logout(); setView('home'); }}
            className="flex items-center gap-1 bg-emerald-900/60 hover:bg-emerald-950 px-3 py-2 rounded-xl text-[10px] font-extrabold text-amber-200 transition-all border border-emerald-700"
          >
            <LogOut className="h-3 w-3" /> লগআউট
          </button>
        </div>
      </div>

      {/* QUICK STATS HORIZONTAL TILES */}
      <div className="max-w-7xl mx-auto px-4 -mt-4 w-full">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col justify-between">
            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">চলতি আয়</span>
            <span className="text-xs sm:text-sm font-black text-emerald-700 mt-1 block font-mono">৳{totalBalance}</span>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col justify-between">
            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">মোট অর্ডার</span>
            <span className="text-xs sm:text-sm font-black text-gray-800 mt-1 block font-mono">{farmerOrders.length} টি</span>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col justify-between">
            <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block">লাইভ পণ্য</span>
            <span className="text-xs sm:text-sm font-black text-blue-700 mt-1 block font-mono">
              {farmerProducts.filter(p => p.approved !== false).length} / {farmerProducts.length}
            </span>
          </div>
        </div>
      </div>

      {/* NON-VERIFIED RESTRICTION NOTIFICATION BANNER */}
      {!isVerified && (
        <div className="max-w-7xl mx-auto px-4 mt-4 w-full">
          <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-2xl p-3 sm:p-4 shadow-sm border border-amber-600 relative overflow-hidden">
            <div className="relative z-10 flex flex-col gap-2">
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-50 tracking-wider bg-black/20 p-1 px-2 rounded-md self-start">
                👑 সেল ৫০ গুণ বৃদ্ধি করুন ও ক্রেতার ডাটা অ্যাক্সেস করুন
              </span>
              <p className="text-[11px] leading-relaxed font-bold text-amber-50">
                গ্রাহকের নাম, মোবাইল নম্বর এবং সম্পূর্ণ ডেলিভারি ঠিকানা দেখতে আপনার খামারি ভেরীফিকেশন সম্পন্ন করুন।
              </p>
              <button 
                onClick={() => setActiveTab('verification')}
                className="mt-1 px-3 py-1.5 bg-white text-amber-950 font-black rounded-xl text-[10px] w-full max-w-[200px] text-center shadow hover:bg-amber-50 transition-colors"
              >
                ভেরিফিকেশন সার্ভিস জানুন 🚀
              </button>
            </div>
            <div className="absolute right-[-10px] bottom-[-20px] text-6xl opacity-15">👑</div>
          </div>
        </div>
      )}

      {/* FARMER PANEL SMALL OFFERS & INCENTIVES SECTION */}
      <div className="max-w-7xl mx-auto px-4 mt-5 w-full select-none text-left">
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-150 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-1.5 text-blue-900 font-extrabold text-xs sm:text-sm">
            <span>📢</span>
            <span>{language === 'bn' ? 'খামারিদের জন্য চলমান বিশেষ অফার ও ইনসেন্টিভ' : 'Ongoing Special Offers & Incentives for Farmers'}</span>
          </div>
          <p className="text-[11px] text-blue-700/80 mt-1 font-semibold">
            {language === 'bn' ? 'সরাসরি সোনালী ফসল প্ল্যাটফর্ম থেকে আপনার আয় বাড়াতে আমাদের ইনসেন্টিভ প্রোগ্রামসমূহ:' : 'Incentives designed to maximize your farming earnings on our platform:'}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
            <div className="bg-white border border-blue-100 rounded-xl p-3 shadow-3xs flex items-start gap-2.5">
              <span className="text-xl">⚡</span>
              <div>
                <h4 className="text-xs font-black text-gray-800">{language === 'bn' ? 'কৃষক স্পেশাল: ০% কমিশন সপ্তাহ!' : 'Farmer Special: 0% Commission Week!'}</h4>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">{language === 'bn' ? 'চলতি সপ্তাহে সবজি ও তাজা ফল বিক্রির অর্ডারে কোনো সার্ভিস ফি বা কমিশন কাটা হবে না।' : 'No platform fee or commission on vegetable and fruit sales during this week!'}</p>
                <div className="mt-2 inline-block text-[9px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">ACTIVE_0_PERCENT</div>
              </div>
            </div>

            <div className="bg-white border border-blue-100 rounded-xl p-3 shadow-3xs flex items-start gap-2.5">
              <span className="text-xl">🏆</span>
              <div>
                <h4 className="text-xs font-black text-gray-800">{language === 'bn' ? '১০০ কেজি ডেলিভারি সাকসেস বোনাস!' : '100kg Delivery Milestone Bonus!'}</h4>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5">{language === 'bn' ? '১০০ কেজির বেশি ফসল সফলভাবে ক্রেতার নিকট সরবরাহ করলেই পাবেন অতিরিক্ত ১,০০০ টাকা ক্যাশ বোনাস!' : 'Deliver over 100kg of crop yields successfully to claim a flat 1,000 BDT cash bonus!'}</p>
                <div className="mt-2 inline-block text-[9px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">FARMER_BOOST_100</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS RAIL */}
      <div className="max-w-7xl mx-auto px-4 mt-6 w-full">
        <div className="flex bg-gray-150 p-1 rounded-xl overflow-x-auto gap-1 no-scrollbar text-xs scroll-smooth">
          <button
            onClick={() => { setActiveTab('overview'); setIsAddingProduct(false); }}
            className={`px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:bg-white/45'}`}
          >
            সারসংক্ষেপ
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setIsAddingProduct(false); }}
            className={`px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1 ${activeTab === 'orders' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:bg-white/45'}`}
          >
            অর্ডার ({farmerOrders.length})
          </button>
          <button
            onClick={() => { setActiveTab('products'); }}
            className={`px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:bg-white/45'}`}
          >
            আমার ফসল ({farmerProducts.length})
          </button>
          <button
            onClick={() => { setActiveTab('profile'); setIsAddingProduct(false); }}
            className={`px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'profile' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:bg-white/45'}`}
          >
            প্রোফাইল সেটিংস
          </button>
          <button
            onClick={() => { setActiveTab('education'); setIsAddingProduct(false); }}
            className={`px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'education' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:bg-white/45'}`}
          >
            🎓 খামারি শিক্ষা (Education)
          </button>
          <button
            onClick={() => { setActiveTab('verification'); setIsAddingProduct(false); }}
            className={`px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap text-amber-700 font-black ${activeTab === 'verification' ? 'bg-amber-100 text-amber-900 shadow-sm' : 'text-amber-600 hover:bg-amber-50'}`}
          >
            👑 ভেরিফিকেশন (BDT)
          </button>
        </div>
      </div>

      {/* CORE SCREENS PANEL */}
      <div className="max-w-7xl mx-auto px-4 mt-5 w-full flex-1">
        
        {/* TAB 1: OVERVIEW SCREEN */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            
            {/* Active order alert notification banner */}
            {farmerOrders.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-4 flex items-center justify-between gap-3 text-left animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-600 text-white rounded-2xl p-2.5 shrink-0 stroke-2 animate-bounce">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-805 text-xs">আপনার নতুন খামারি অর্ডার এসেছে! 📦</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">সবজি বাজার থেকে কাস্টমাররা আপনার ফসলে {farmerOrders.length} টি নতুন অর্ডার প্লেস করেছেন।</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] rounded-xl shadow-xs shrink-0 cursor-pointer transition"
                >
                  ইনবক্স দেখুন ➔
                </button>
              </div>
            )}
            
            {/* Sales Performance Graph info */}
            <FarmerSalesChart />

            {/* Quick Actions Router List */}
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-3.5 text-left">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">দ্রুত অ্যাকশন হাব</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => { setActiveTab('products'); setIsAddingProduct(true); setEditingProduct(null); }}
                  className="p-3 bg-emerald-600 text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-2 hover:bg-emerald-700 transition"
                >
                  <Plus className="h-5 w-5" />
                  নতুন ফসল যোগ করুন
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-3 bg-gray-50 border border-gray-150 text-gray-700 rounded-2xl font-bold flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition"
                >
                  <Package className="h-5 w-5 text-emerald-600" />
                  নতুন অর্ডার চেক করুন
                </button>
              </div>
            </div>

            {/* Micro List of Recents */}
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm text-left">
              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">সাম্প্রতিক অর্ডার সমূহ</h3>
                <button onClick={() => setActiveTab('orders')} className="text-[10px] text-emerald-600 font-bold hover:underline">সকল অর্ডার দেখুন</button>
              </div>
              
              <div className="mt-3.5 space-y-2.5">
                {farmerOrders.length === 0 ? (
                  <p className="text-[11px] text-gray-400 text-center py-6">এখনো কোনো অর্ডার আসেনি।</p>
                ) : (
                  farmerOrders.slice(0, 3).map(o => {
                    const farmerItems = o.products.filter(p => p.farmerId === currentUser.farmerId);
                    const qty = farmerItems.reduce((acc, curr) => acc + curr.quantity, 0);
                    return (
                      <div key={o.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl text-xs bg-gray-50/20">
                        <div>
                          <strong className="text-gray-800 block">অর্ডার আইডি: {o.id.substring(0, 10)}...</strong>
                          <span className="text-[10.5px] text-gray-400 block font-medium">আইটেম পরিমাণ: {qty} টি</span>
                        </div>
                        <span className="text-[9px] font-black bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100">{o.status}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DETAILED ORDERS PANEL */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-10s p-5 shadow-sm text-left">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-1">
                💌 খামারি নতুন অর্ডার ইনবক্স
              </h3>
              <p className="text-[10px] text-gray-405 mt-0.5">সব অর্ডার সরাসরি হোয়াটসঅ্যাপ, জিমেইল এবং এডমিন প্যানেলে প্রেরিত হয়।</p>
            </div>

            <div className="space-y-3.5">
              {farmerOrders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-400 shadow-sm">
                  <Package className="h-10 w-10 mx-auto text-gray-300 stroke-1 mb-2.5" />
                  <p className="text-xs font-bold text-gray-600">কোনো অর্ডার পাওয়া যায়নি!</p>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-xs mx-auto">সম্মানিত গ্রাহকগণ ক্যাটালগ থেকে পণ্য কেনার সাথে সাথেই আপনি অর্ডার আপডেট পাবেন।</p>
                </div>
              ) : (
                farmerOrders.map((o) => {
                  const farmerItems = o.products.filter(p => p.farmerId === currentUser.farmerId);
                  const totalPrice = farmerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  
                  return (
                    <div 
                      key={o.id} 
                      className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm text-left space-y-3"
                    >
                      {/* Alert notification header */}
                      <div className="flex items-center justify-between border-b pb-2 bg-emerald-50/20 p-2 rounded-xl border-emerald-100/50">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span className="text-[11px] font-black text-emerald-900">অর্ডার এসেছে!</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-gray-400">
                          {new Date(o.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>

                      {/* Filter products details section */}
                      <div className="space-y-2 text-xs">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">অর্ডারকৃত ফসল বিস্তারিত</span>
                        {farmerItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                            <span className="font-bold text-gray-800">{item.title}</span>
                            <span className="font-mono bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                              {item.quantity} x ৳{item.price}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Price row */}
                      <div className="flex justify-between items-center text-xs pt-1.5 border-t border-dashed">
                        <span className="font-bold text-gray-500">মোট মূল্য:</span>
                        <strong className="text-emerald-700 font-mono text-sm">৳{totalPrice}</strong>
                      </div>

                      {/* Customer identity details block (Subject to verification status) */}
                      <div className="bg-slate-50 rounded-xl p-3 text-xs border relative overflow-hidden">
                        
                        {isVerified ? (
                          // Premium version: Full customer details
                          <div className="space-y-1.5">
                            <h4 className="font-black text-emerald-805 text-[10px] uppercase tracking-wider flex items-center gap-1">
                              🛡️ গ্রাহকের তথ্য (ভেরিফাইড খামারি অ্যাক্সেস)
                            </h4>
                            <p className="text-gray-700 font-medium">👤 নাম: <strong className="font-bold">{o.customerName}</strong></p>
                            <p className="text-gray-700 font-mono">📞 ফোন: {o.customerPhone}</p>
                            <p className="text-gray-700 font-medium">📍 ঠিকানা: {o.customerAddress}</p>
                          </div>
                        ) : (
                          // Free version: Blurred data
                          <div>
                            <div className="space-y-1.5 filter blur-[3px] select-none pointer-events-none">
                              <h4 className="font-black text-gray-400 text-[10px] uppercase">👤 গ্রাহকের তথ্য (নন-ভেরিফাইড লকড)</h4>
                              <p className="text-gray-500">👤 নাম: Muikta Begum</p>
                              <p className="text-gray-500">📞 ফোন: 01931355398</p>
                              <p className="text-gray-500">📍 ঠিকানা: Katakhali, Rajshahi, Bangladesh</p>
                            </div>
                            
                            {/* Centered lock CTA */}
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-3">
                              <Lock className="h-4 w-4 text-amber-600 mb-1" />
                              <strong className="text-[10.5px] font-black text-amber-900 block leading-tight">গ্রাহকের ঠিকানা ও মোবাইল লকড আছে!</strong>
                              <button 
                                onClick={() => setActiveTab('verification')}
                                className="mt-1.5 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-black text-[9px] rounded-lg shadow-sm"
                              >
                                তথ্য অ্যাক্সেস করুন 🔓
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS SECTOR */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* Action Bar Toggle */}
            <div className="flex justify-between items-center gap-2 bg-white rounded-2xl border border-gray-105 p-4.5 shadow-sm">
              <h3 className="text-xs font-black text-gray-800 uppercase">আমার খামারের তালিকাভুক্ত ফসল</h3>
              
              {!isAddingProduct && (
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProdTitle('');
                    setProdPrice(120);
                    setProdDiscountPrice('');
                    setProdCategory('vegetables');
                    setProdDesc('রাসায়নিক সার ছাড়া সম্পূর্ণ প্রাকৃতিক উপায়ে চাষাবাদকৃত টাটকা ফসল।');
                    setProdStock(25);
                    setProdReadyToCook(false);
                    setProdImages(['https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60-1']);
                    setProdUnit('Kg');
                    setIsAddingProduct(true);
                  }}
                  className="px-3 py-2 bg-emerald-600 text-white font-black rounded-xl text-[10px] flex items-center gap-1 hover:bg-emerald-700 transition"
                >
                  <Plus className="h-3.5 w-3.5" /> পণ্য আপলোড
                </button>
              )}
            </div>

            {/* In-Line Product Creator / Editor form */}
            {isAddingProduct && (
              <div className="bg-white rounded-3xl border border-gray-150 p-5 shadow-sm text-left">
                <div className="flex items-center justify-between pb-3 border-b mb-4">
                  <h3 className="text-xs font-black text-emerald-800 uppercase font-mono tracking-wider">
                    {editingProduct ? '✏️ ফসল সংশোধন ফরম' : '🌱 নতুন ফসল ক্যাটালগে যুক্ত করুন'}
                  </h3>
                  <button 
                    onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
                    className="text-xs font-bold text-gray-400 hover:text-red-500"
                  >
                    বন্ধ করুন [X]
                  </button>
                </div>

                <form onSubmit={handleFarmerProductSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-gray-600 mb-1">পণ্যের নাম/শিরোনাম:</label>
                    <input 
                      type="text"
                      required
                      value={prodTitle}
                      onChange={(e) => setProdTitle(e.target.value)}
                      className="w-full bg-white rounded-xl border border-gray-200 p-2.5 focus:border-emerald-600 outline-none"
                      placeholder="যেমন: সতেজ ও মিষ্টি শিম ৫ কেজি ব্যাগ"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">মূল্য (৳ BDT):</label>
                      <input 
                        type="number"
                        required
                        value={prodPrice}
                        onChange={(e) => setProdPrice(Number(e.target.value))}
                        className="w-full bg-white rounded-xl border border-gray-200 p-2.5 focus:border-emerald-600 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">ইউনিট পরিমাপ (Unit):</label>
                      <select
                        value={prodUnit}
                        onChange={(e) => setProdUnit(e.target.value)}
                        className="w-full bg-white rounded-xl border border-gray-200 p-2.5 font-bold outline-none cursor-pointer"
                      >
                        <option value="Kg">কেজি (Kg)</option>
                        <option value="Piece">পিস (Piece)</option>
                        <option value="Bundle">আঁটি (Bundle)</option>
                        <option value="Dozen">ডজন (Dozen)</option>
                        <option value="500g">৫০০ গ্রাম (500g)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">ডিস্কাউন্ট মূল্য (৳ - ঐচ্ছিক):</label>
                      <input 
                        type="text"
                        value={prodDiscountPrice}
                        onChange={(e) => setProdDiscountPrice(e.target.value)}
                        className="w-full bg-white rounded-xl border border-gray-200 p-2.5 focus:border-emerald-600 outline-none font-mono"
                        placeholder="ফাঁকা রাখুন"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">স্টক পরিমাণ (Kg/Unit):</label>
                      <input 
                        type="number"
                        required
                        value={prodStock}
                        onChange={(e) => setProdStock(Number(e.target.value))}
                        className="w-full bg-white rounded-xl border border-gray-200 p-2.5 focus:border-emerald-600 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-600 mb-1">শ্রেণীবিভাগ (Category):</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full bg-white rounded-xl border border-gray-200 p-2.5 font-bold outline-none cursor-pointer"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.nameBn} ({c.nameEn})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-600 mb-1">ফসল কাটার তারিখ (Harvest Date):</label>
                    <input 
                      type="text"
                      value={prodHarvestDate}
                      onChange={(e) => setProdHarvestDate(e.target.value)}
                      className="w-full bg-white rounded-xl border border-gray-200 p-2.5 focus:border-emerald-650 outline-none text-xs font-sans text-gray-700 font-bold"
                      placeholder="যেমন: ১ জুন, ২০২৬ বা June 1, 2026"
                    />
                  </div>

                  {/* Product Variations section for farmers */}
                  <div className="border border-emerald-150 rounded-2xl p-4 bg-emerald-50/20 space-y-4">
                    <div>
                      <span className="block text-xs font-black text-emerald-800 uppercase tracking-wider font-sans">
                        🥦 প্রোডাক্ট ভেরিয়েশন বা প্রকারভেদ (Product Variations)
                      </span>
                      <p className="text-[10.5px] text-gray-500 mt-0.5">
                        যেমন: সাইজ, রঙ, প্রকার বা রেডি-টু-কুক ধরণ যোগ করুন (কমপক্ষে একটি যোগ করার পরামর্শ দেওয়া হলো)
                      </p>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="bg-white p-3 rounded-xl border border-emerald-100 space-y-2">
                      <span className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider font-sans">⚡ দ্রুত ভেরিয়েশন টেমপ্লেট (Click to add):</span>
                      <div className="flex flex-wrap gap-1.5">
                        {/* Ready to Cook presets */}
                        <button
                          type="button"
                          onClick={() => {
                            const newVar: ProductVariation = { id: `var-rtc-${Date.now()}-1`, nameBn: 'কুচি কাটা সবজি', nameEn: 'Finely Chopped', price: Math.round(Number(prodPrice) * 1.15) };
                            setProdVariations(prev => [...prev, newVar]);
                          }}
                          className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold border border-indigo-150 cursor-pointer"
                        >
                          + রেডি-টু-কুক (কুচি কাটা)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newVar: ProductVariation = { id: `var-rtc-${Date.now()}-2`, nameBn: 'ধুয়ে কাটা স্লাইস', nameEn: 'Washed & Sliced', price: Math.round(Number(prodPrice) * 1.1) };
                            setProdVariations(prev => [...prev, newVar]);
                          }}
                          className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold border border-indigo-150 cursor-pointer"
                        >
                          + রেডি-টু-কুক (ধুয়ে স্লাইস করা)
                        </button>

                        {/* Sizes presets */}
                        <button
                          type="button"
                          onClick={() => {
                            const newVar: ProductVariation = { id: `var-size-${Date.now()}-1`, nameBn: 'মাঝারি সাইজ', nameEn: 'Medium Size' };
                            setProdVariations(prev => [...prev, newVar]);
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-150 cursor-pointer"
                        >
                          + মাঝারি সাইজ (Medium)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newVar: ProductVariation = { id: `var-size-${Date.now()}-2`, nameBn: 'বড় সাইজ', nameEn: 'Large Size', price: Math.round(Number(prodPrice) * 1.25) };
                            setProdVariations(prev => [...prev, newVar]);
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-150 cursor-pointer"
                        >
                          + বড় সাইজ (Large)
                        </button>

                        {/* Colors presets */}
                        <button
                          type="button"
                          onClick={() => {
                            const newVar: ProductVariation = { id: `var-color-${Date.now()}-1`, nameBn: 'লাল প্রকার', nameEn: 'Red Variant' };
                            setProdVariations(prev => [...prev, newVar]);
                          }}
                          className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-150 cursor-pointer"
                        >
                          + লাল প্রকার (Red)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newVar: ProductVariation = { id: `var-color-${Date.now()}-2`, nameBn: 'সবুজ প্রকার', nameEn: 'Green Variant' };
                            setProdVariations(prev => [...prev, newVar]);
                          }}
                          className="px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-[10px] font-bold border border-teal-150 cursor-pointer"
                        >
                          + সবুজ প্রকার (Green)
                        </button>
                      </div>
                    </div>

                    {/* Add Custom Variation Form */}
                    <div className="bg-white p-3 rounded-xl border border-emerald-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-end">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-655 mb-1">প্রকার নাম (বাংলা)</label>
                        <input
                          type="text"
                          value={newVarNameBn}
                          onChange={(e) => setNewVarNameBn(e.target.value)}
                          placeholder="যেমন: গোল বেগুন"
                          className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500 text-gray-700 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-655 mb-1">প্রকার নাম (English)</label>
                        <input
                          type="text"
                          value={newVarNameEn}
                          onChange={(e) => setNewVarNameEn(e.target.value)}
                          placeholder="e.g. Round Eggplant"
                          className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500 text-gray-700 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-655 mb-1">আলাদা দাম (ঐচ্ছিক ৳)</label>
                        <input
                          type="number"
                          value={newVarPrice}
                          onChange={(e) => setNewVarPrice(e.target.value)}
                          placeholder="যেমন: ৬০"
                          className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-emerald-500 text-gray-700 font-mono"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nameBn = newVarNameBn.trim();
                          const nameEn = newVarNameEn.trim();
                          const priceVal = newVarPrice ? Number(newVarPrice) : undefined;
                          
                          if (!nameBn || !nameEn) {
                            alert("দয়া করে প্রকার নাম বাংলা এবং ইংরেজি দুই ভাষাতেই লিখুন!");
                            return;
                          }
                          
                          const newVar: ProductVariation = {
                            id: `var-${Date.now()}`,
                            nameBn,
                            nameEn,
                            price: priceVal
                          };
                          
                          setProdVariations(prev => [...prev, newVar]);
                          setNewVarNameBn('');
                          setNewVarNameEn('');
                          setNewVarPrice('');
                        }}
                        className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1 font-sans"
                      >
                        প্রকার যোগ করুন
                      </button>
                    </div>

                    {/* Custom Variation List */}
                    {prodVariations.length > 0 ? (
                      <div className="space-y-2 font-sans">
                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">চলতি ভেরিয়েশনসমূহ (Current Variations):</span>
                        <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                          {prodVariations.map((v, index) => (
                            <div key={v.id} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-gray-150 shadow-3xs text-xs font-sans">
                              <div className="flex flex-col">
                                <span className="font-bold text-gray-800">{v.nameBn} <span className="text-gray-400 font-normal">({v.nameEn})</span></span>
                                <span className="text-[10px] text-emerald-700 font-bold font-mono">
                                  {v.price ? `৳${v.price}` : 'বেস প্রাইস (Base Price)'}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setProdVariations(prev => prev.filter((_, i) => i !== index));
                                }}
                                className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:underline transition-colors cursor-pointer font-bold text-[10px]"
                              >
                                মুছুন
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-white rounded-xl border border-dashed border-gray-200 text-gray-400 text-[11px] font-sans">
                        কোনো প্রকার বা সাইজ ভেরিয়েশন যোগ করা নেই। পণ্যটি একটি একক সাধারণ অপশনে বিক্রি হবে।
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-gray-600 mb-1">পণ্যের সচিত্র বিবরণ:</label>
                    <textarea 
                      rows={2}
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      className="w-full bg-white rounded-xl border border-gray-200 p-2.5 focus:border-emerald-600 outline-none font-mono text-[10.5px]"
                      placeholder="যেমন: বিষমুক্ত ও সতেজ অর্গানিক শিম খামারের নিজস্ব ক্ষেত থেকে বাছাই করা..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-750 mb-1.5 flex items-center gap-1 font-sans">
                      📸 পণ্যের তাজা ছবিসমূহ (সর্বোচ্চ ৫টি ছবি আপলোড করুন):
                    </label>

                    {/* Drag and Drop Zone */}
                    <div 
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          handleImageFileChange(e.dataTransfer.files);
                        }
                      }}
                      onClick={() => document.getElementById('farmer-image-upload-input')?.click()}
                      className="w-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/25 active:bg-emerald-50/40 rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group shadow-inner"
                    >
                      <input 
                        id="farmer-image-upload-input"
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageFileChange(e.target.files)}
                      />
                      <Upload className="h-6 w-6 text-emerald-600 group-hover:scale-110 transition duration-200" />
                      <div className="space-y-1">
                        <p className="font-bold text-emerald-800 text-[11px] font-sans">আপনার ফসল বা পণ্যের ছবি এখানে ড্র্যাগ করুন অথবা ক্লিক করে আপলোড করুন</p>
                        <p className="text-[9.5px] text-gray-500 font-medium font-sans">মোবাইল বা ক্যামেরা থেকে সরাসরি ছবি তুলুন (সর্বোচ্চ ৫টি, প্রতি ছবি সংকুচিত করা হবে)</p>
                      </div>
                    </div>

                    {/* Error Indicator */}
                    {uploadError && (
                      <p className="mt-1.5 text-[10px] text-red-650 font-bold leading-none animate-pulse font-sans">❌ {uploadError}</p>
                    )}

                    {/* Progress Slider Indicator */}
                    {isUploading && (
                      <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] font-black text-emerald-700 animate-pulse bg-emerald-50 border border-emerald-100 rounded-xl p-2 font-sans">
                        <div className="h-3.5 w-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>ছবি আপলোড ও কমপ্রেস করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</span>
                      </div>
                    )}

                    {/* Live Uploaded Images Strip */}
                    {prodImages.filter(Boolean).length > 0 && (
                      <div className="mt-3 bg-slate-50 border border-gray-200/50 rounded-2xl p-3 font-sans">
                        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-gray-200">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">সংযুক্ত ফটো গ্যালারি ({prodImages.filter(Boolean).length} / ৫)</span>
                          <button 
                            type="button" 
                            onClick={() => setProdImages([])}
                            className="text-[9.5px] text-red-500 hover:underline font-bold"
                          >
                            সবগুলো মুছে ফেলুন
                          </button>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {prodImages.filter(Boolean).map((url, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-xs group bg-white">
                              <img 
                                src={url} 
                                alt={`uploaded-product-${idx}`} 
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setProdImages(prev => prev.filter((_, i) => i !== idx));
                                }}
                                className="absolute top-1 right-1 bg-red-650/95 hover:bg-red-700 text-white rounded-full p-0.5 shadow transition cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-bold text-center py-0.5 leading-none">
                                ছবি {idx + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ready to Cook switcher option */}
                  <label className="flex items-center gap-2 border p-2.5 bg-gray-50 rounded-xl cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={prodReadyToCook}
                      onChange={(e) => setProdReadyToCook(e.target.checked)}
                      className="h-4 w-4 accent-emerald-600"
                    />
                    <span className="font-bold text-gray-700">এটি কাটা-ধোয়া রেডি-টু-কুক (R2C) পণ্য</span>
                  </label>

                  {/* APPROVAL NOTICE ALERT BOX */}
                  <div className="bg-amber-50 text-amber-805 border border-amber-100 rounded-xl p-3 flex gap-2 text-[10.5px]">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      <strong>অনুমোদন তথ্য:</strong> কৃষক কর্তৃক আপলোডকৃত পণ্য সরাসরি লাইভ হয়ে যাবে না। এটি শুরুতে এডমিন রিভিউ মডারেটর এর কাছে সংরক্ষিত যাবে। এডমিন সম্মতি দেওয়ার পর এটি সম্পূর্ণ লাইভ বিপণী ক্যাটালগে দৃশ্যমান হবে।
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-black rounded-xl hover:scale-101 border-none shadow transition cursor-pointer text-center"
                    >
                      {editingProduct ? 'সংশোধন সল্ভ করুন ✔' : 'লাইভ রিভিউতে পাঠান 🚀'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-150 text-gray-600 rounded-xl font-bold transition"
                    >
                      বাতিল
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* List Table Grid of Uploaded products */}
            <div className="space-y-3">
              {farmerProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-400 shadow-sm">
                  <Package className="h-10 w-10 mx-auto text-gray-300 stroke-1 mb-2.5" />
                  <p className="text-xs font-bold text-gray-650">কোনো ফসল আপলোড করা নাই।</p>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-xs mx-auto">নতুন সতেজ ফসল সরাসরি মাঠ থেকে যোগ করতে উপরের বাটনে ট্যাপ করুন।</p>
                </div>
              ) : (
                farmerProducts.map((p) => {
                  const isApproved = p.approved !== false;
                  return (
                    <div 
                      key={p.id} 
                      className={`bg-white rounded-2xl border p-3 flex items-center justify-between gap-3 shadow-xs h-24 ${
                        !isApproved ? 'border-amber-200 bg-amber-55/10' : 'border-gray-150'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden h-full">
                        <LazyImage 
                          src={p.images[0]} 
                          alt={p.title}
                          className="h-16 w-16 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100" 
                          referrerPolicy="no-referrer" 
                          onError={() => {}}
                        />
                        <div className="text-left py-1 text-xs justify-between flex flex-col h-full overflow-hidden">
                          <div>
                            <strong className="text-gray-800 text-[11px] block truncate max-w-[130px] sm:max-w-xs">{p.title}</strong>
                            <span className="text-[9.5px] text-gray-400 block font-mono capitalize">{p.category}</span>
                            {p.variations && p.variations.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {p.variations.map((v) => (
                                  <span key={v.id} className="text-[8.5px] font-bold bg-emerald-50/60 text-emerald-700 px-1 py-0.5 rounded border border-emerald-100 font-sans">
                                    {v.nameBn} {v.price ? `(৳${v.price})` : ''}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-black text-emerald-700">৳{p.discountPrice || p.price}</span>
                            
                            {isApproved ? (
                              <span className="text-[8px] font-black tracking-wide text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-100 uppercase">
                                চালু আছে ✔
                              </span>
                            ) : (
                              <span className="text-[8px] font-black tracking-wide text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded-full border border-amber-200 animate-pulse">
                                রিভিউ হচ্ছে ⏱
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Control edits */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="px-2.5 py-1 text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100 rounded-lg hover:bg-blue-100 cursor-pointer transition text-center"
                        >
                          এডিট
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`আপনি কি নিশ্চিতভাবে "${p.title}" পণ্যটি ডিলিট করতে চান?`)) {
                              deleteProduct(p.id);
                              alert("পণ্যটি ডিলিট করা হয়েছে।");
                            }
                          }}
                          className="px-2.5 py-1 text-[9px] font-extrabold bg-red-50 text-red-500 border border-red-100 rounded-lg hover:bg-red-100 cursor-pointer transition text-center"
                        >
                          ডিলিট
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* TAB 4: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm text-left">
              <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                <Settings className="h-4 w-4 text-emerald-600" /> PRO খামারি প্রোফাইল তথ্য সেটিংস
              </h3>
              <p className="text-[10px] text-gray-400 mt-1">আপনার নাম, মোবাইল নম্বর এবং পাসওয়ার্ড সামঞ্জস্য করতে পারবেন এখানে।</p>
              
              <form onSubmit={handleProfileUpdateSubmit} className="mt-5 space-y-4 text-xs">
                {/* PROFILE PICTURE DESIGN SECTION */}
                <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
                  {/* Photo Circular Preview */}
                  <div className="relative group shrink-0">
                    <img 
                      src={profileAvatar || (currentFarmer?.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR)} 
                      alt="Farmer Profile Preview" 
                      className="h-24 w-24 rounded-full object-cover border-4 border-emerald-105 shadow-sm bg-gray-50"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = currentFarmer?.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR;
                      }}
                    />
                    <label className="absolute bottom-0 right-0 h-8 w-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md transition-transform hover:scale-105 border border-white">
                      <Camera className="h-4.5 w-4.5" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <h4 className="font-black text-gray-800 text-[11px] uppercase tracking-wider">
                      📸 খামারি প্রোফাইল ছবি আপলোড ও পরিবর্তন
                    </h4>
                    <p className="text-[10px] text-gray-400">
                      আপনার নিজস্ব ছবি (অনধিক ৮০০ KB) ডাইরেক্ট ডিভাইস থেকে আপলোড করুন, অথবা নিচের আকর্ষণীয় খামারি ইলাস্ট্রেশন ডেমো ইমেজগুলো থেকে ট্যাপ করে নির্বাচন করুন।
                    </p>
                    
                    {/* Native File Selector & Text Input */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-[10px] shadow-xs select-none">
                        <Upload className="h-3.5 w-3.5" /> ছবি আপলোড করুন
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload} 
                          className="hidden" 
                        />
                      </label>
                      
                      <input 
                        type="text"
                        placeholder="অথবা সরাসরি অনলাইন ছবির লিংক (URL) লিখুন..."
                        value={profileAvatar && !profileAvatar.startsWith('data:') ? profileAvatar : ''}
                        onChange={(e) => setProfileAvatar(e.target.value)}
                        className="flex-1 bg-white border border-gray-200 rounded-xl p-2 outline-none text-[10px] font-mono focus:border-emerald-500"
                      />
                    </div>

                    {/* Predefined Quick Presets Grid */}
                    <div className="pt-2 border-t border-dashed border-gray-200">
                      <span className="text-[9px] font-black text-emerald-800 block mb-1.5 uppercase tracking-wider">
                        কৃষক ক্যারেক্টার ও খামার লোগো ডেমো প্রিসেট:
                      </span>
                      <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                        <button
                          type="button"
                          onClick={() => setProfileAvatar(MALE_AVATAR)}
                          className={`p-0.5 rounded-full border-2 transition ${profileAvatar === MALE_AVATAR ? 'border-emerald-600 scale-105' : 'border-transparent hover:scale-105'}`}
                          title="পুরুষ খামারি (Default)"
                        >
                          <img src={MALE_AVATAR} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProfileAvatar(FEMALE_AVATAR)}
                          className={`p-0.5 rounded-full border-2 transition ${profileAvatar === FEMALE_AVATAR ? 'border-emerald-600 scale-105' : 'border-transparent hover:scale-105'}`}
                          title="মহিলা খামারি (Default)"
                        >
                          <img src={FEMALE_AVATAR} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProfileAvatar('https://images.unsplash.com/photo-1595273670150-db0a3e398436?w=150')}
                          className={`p-0.5 rounded-full border-2 transition ${profileAvatar === 'https://images.unsplash.com/photo-1595273670150-db0a3e398436?w=150' ? 'border-emerald-600 scale-105' : 'border-transparent hover:scale-105'}`}
                          title="তরুণ খামারি"
                        >
                          <img src="https://images.unsplash.com/photo-1595273670150-db0a3e398436?w=150" className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProfileAvatar('https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=150')}
                          className={`p-0.5 rounded-full border-2 transition ${profileAvatar === 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=150' ? 'border-emerald-600 scale-105' : 'border-transparent hover:scale-105'}`}
                          title="সবুজ ফসল খামার"
                        >
                          <img src="https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=150" className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProfileAvatar('https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=150')}
                          className={`p-0.5 rounded-full border-2 transition ${profileAvatar === 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=150' ? 'border-emerald-600 scale-105' : 'border-transparent hover:scale-105'}`}
                          title="জৈব সার খামার"
                        >
                          <img src="https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=150" className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-650 mb-1">খামারি বা উদ্যোক্তার নাম:</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 font-bold focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-650 mb-1">যোগাযোগ মোবাইল নম্বর:</label>
                    <input
                      type="text"
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 font-mono focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-655 mb-1">লগইন পাসওয়ার্ড (Password):</label>
                    <input
                      type="text"
                      required
                      value={profilePassword}
                      onChange={(e) => setProfilePassword(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 font-mono focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-655 mb-1">কন্ট্রোল জেলা অঞ্চল:</label>
                    <input
                      type="text"
                      required
                      value={profileDistrict}
                      onChange={(e) => setProfileDistrict(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-655 mb-1">কৃষি জমির পরিমাণ (Land Info):</label>
                    <input
                      type="text"
                      value={profileLandSize}
                      onChange={(e) => setProfileLandSize(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-655 mb-1">সম্পূর্ণ কৃষি খামার ঠিকানা:</label>
                  <input
                    type="text"
                    required
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 text-gray-800 focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Farmer Real YouTube Videos Management */}
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-black uppercase text-gray-500 mb-2 mt-2 tracking-wider flex items-center gap-1">🌾 খামারের বাস্তব ভিডিও গ্যালারি (YouTube Videos)</h4>
                  <p className="text-[10px] text-gray-400 font-medium mb-3">আপনার চাষাবাদ, ফসল তোলা বা খামারের কাজের ইউটিউব ভিডিও লিংক দিন। এগুলো আপনার স্টোর প্রফাইলে সরাসরি ক্রেতারা দেখতে পাবেন!</p>
                  
                  {youtubeVideos.length > 0 && (
                    <div className="space-y-2 mb-3 bg-emerald-50/20 p-3 rounded-2xl border border-dashed border-emerald-150">
                      {youtubeVideos.map((url, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 bg-white rounded-xl p-2 border border-gray-150/60 shadow-xs">
                          <span className="text-[10.5px] font-mono font-medium truncate text-gray-655 flex-1">{url}</span>
                          <button
                            type="button"
                            onClick={() => setYoutubeVideos(prev => prev.filter((_, i) => i !== idx))}
                            className="bg-red-50 hover:bg-red-100 text-red-650 h-6 w-6 rounded-lg flex items-center justify-center shrink-0 cursor-pointer text-[10px]"
                          >
                            ✖
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="url"
                      id="youtube-url-adder-input"
                      placeholder="যেমন: https://www.youtube.com/watch?v=..."
                      className="flex-1 bg-slate-50 border border-gray-200 rounded-xl p-2 px-3 text-xs text-gray-850 focus:bg-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('youtube-url-adder-input') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          setYoutubeVideos(prev => [...prev, input.value.trim()]);
                          input.value = '';
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-4 text-xs cursor-pointer active:scale-95 shrink-0"
                    >
                      যুক্ত করুন
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md transition duration-150 cursor-pointer text-center"
                >
                  প্রোফাইল সেটিংস সেভ করুন
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 5: BDT VERIFICATION CONTROL */}
        {activeTab === 'verification' && (
          <div className="space-y-4 font-sans max-w-xl mx-auto">
            
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm text-center space-y-2">
              <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">KRISHOK SPONSOR PARTNERSHIP</span>
              <h3 className="text-sm sm:text-base font-black text-gray-800">অংশীদার কৃষক ভেরিফিকেশন সার্ভিস</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                আমাদের তিনটি অফারড সার্ভিস ব্যবহার করে যেকোনো খামারি তাদের সেল শতভাগ বৃদ্ধি করতে পারবেন।
              </p>
            </div>

            {/* Verification Packages */}
            <div className="grid grid-cols-1 gap-4">
              
              <div className="border border-gray-150 rounded-3xl bg-white p-5 shadow-sm hover:border-emerald-500 transition relative overflow-hidden text-left">
                <span className="absolute top-4 right-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Basic</span>
                <span className="text-xs text-gray-400 block font-semibold leading-none">রুপালী মেম্বারশিপ</span>
                <h4 className="font-sans font-black text-base text-gray-800 mt-1">সিলভার ভেরিফিকেশন 🌱</h4>
                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                  ১,০০০ টাকা ফি সাপ্তাহিক পরিশোধ করে সবুজ ব্যাজ, ৫ গুণ সেলস বৃদ্ধি পাবেন।
                </p>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-base font-black text-emerald-700 font-mono">৳১,০০০ <span className="text-[10px] text-gray-400">/সপ্তাহ</span></span>
                  <button 
                    onClick={() => alert("অর্ডার পেতে অনুগ্রহ করে হোয়াটসঅ্যাপ 01931355398 এ যোগাযোগ করে সিলভার সার্ভিস পেমেন্ট করুন।")} 
                    className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10.5px] font-extrabold rounded-xl shadow-xs transition"
                  >
                    চালু করুন
                  </button>
                </div>
              </div>

              <div className="border-2 border-emerald-500 rounded-3xl bg-emerald-50/10 p-5 shadow-sm hover:shadow-md transition relative overflow-hidden text-left">
                <span className="absolute top-4 right-4 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Popular</span>
                <span className="text-xs text-gray-400 block font-semibold leading-none">সোনালী মেম্বারশিপ</span>
                <h4 className="font-sans font-black text-base text-gray-800 mt-1">গোল্ড মেম্বারশিপ ভেরিফিকেশন 👑</h4>
                <p className="text-[11px] text-emerald-800 font-medium mt-2 leading-relaxed">
                  ২,০০০ টাকা ফি সাপ্তাহিক পেমেন্ট করে গোল্ডেন ভেরিফায়েড ক্রেস্ট স্পন্সর। সেলস বৃদ্ধি ১০ গুণ।
                </p>
                <div className="mt-4 pt-3 border-t border-emerald-100/50 flex items-center justify-between">
                  <span className="text-base font-black text-emerald-700 font-mono">৳২,০০০ <span className="text-[10px] text-emerald-400">/সপ্তাহ</span></span>
                  <button 
                    onClick={() => alert("২,০০০ BDT গোল্ডেন কভারেজ চালু করতে হোয়াটসঅ্যাপ 01931355398 এ 'GOLD' লিখে মেসেজ পাঠান।")} 
                    className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-xl shadow hover:bg-emerald-700 transition"
                  >
                    গোল্ডেন কভার 🚀
                  </button>
                </div>
              </div>

              <div className="border border-gray-150 rounded-3xl bg-white p-5 shadow-sm hover:border-emerald-500 transition relative overflow-hidden text-left">
                <span className="absolute top-4 right-4 bg-indigo-50 border border-indigo-200 text-indigo-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Sponsor</span>
                <span className="text-xs text-gray-400 block font-semibold leading-none">প্লাটিনাম মেম্বারশিপ</span>
                <h4 className="font-sans font-black text-base text-gray-800 mt-1">আল্টিমেট প্লাটিনাম স্পন্সর ভেরিফিকেশন</h4>
                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                  ৩,০০০ টাকা প্রতি সপ্তাহে পরিশোধ করে শতভাগ ক্রেতার বিস্তারিত ঠিকানা এক্সেস, এবং সর্বোচ্চ অগ্রাধিকার সেলস বৃদ্ধি ৫০ গুণ!
                </p>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-base font-black text-emerald-700 font-mono">৳৩,০০০ <span className="text-[10px] text-gray-400">/সপ্তাহ</span></span>
                  <button 
                    onClick={() => alert("আল্টিমেট প্লাটিনাম স্পন্সরশিপ কভার করতে হোয়াটসঅ্যাপ 01931355398 এ পেমেন্ট রেফারেন্স পাঠান।")} 
                    className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[10.5px] font-extrabold rounded-xl shadow-xs transition"
                  >
                    প্লাটিনাম কভার 🔓
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 6: FARMER SUSTAINABLE EDUCATION & BEST PRACTICES */}
        {activeTab === 'education' && (
          <div className="space-y-6 font-sans animate-fade-in pb-12 text-left">
            
            {/* Header section with green eco accent badge */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden select-none">
              <div className="relative z-10 max-w-xl space-y-2">
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-100 tracking-wider bg-white/10 p-1 px-2.5 rounded-full border border-white/5">
                  <GraduationCap className="h-3 w-3 text-emerald-350" />
                  সহজ টেকসই কৃষি বিজ্ঞান স্কুল
                </span>
                <h3 className="text-base sm:text-xl font-black font-sans leading-tight">খামারি শিক্ষা ও প্রশিক্ষণ সেন্টার 🎓</h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed font-semibold">
                  আপনার ফসলের উৎপাদন খরচ ৫০% কমিয়ে লাভ দ্বিগুণ করুন! এখানে সংক্ষিপ্ত ভিডিও টিউটোরিয়ালগুলোর মাধ্যমে পরিবেশ-বান্ধব ও সবচেয়ে লাভজনক টেকসই চাষাবাদ পদ্ধতি শিখুন।
                </p>
              </div>
              <div className="absolute right-[-15px] bottom-[-20px] text-8xl opacity-10 select-none pointer-events-none">🎓</div>
            </div>

            {/* Micro-Progress Dashboard Tracker */}
            <div className="bg-white border border-gray-150-soft rounded-3xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Tracker 1: Progress percentage bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-sans font-black text-gray-500">গাইড কোর্স সম্পন্নকরণ:</span>
                  <span className="font-mono font-black text-emerald-700">
                    {completedGuides.length} / {SUSTAINABLE_GUIDES.length} ({Math.round((completedGuides.length / SUSTAINABLE_GUIDES.length) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3.5 p-0.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(completedGuides.length / SUSTAINABLE_GUIDES.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Tracker 2: Earned Medals Badge status */}
              <div className="flex items-center gap-3 bg-emerald-50/40 p-3 rounded-2xl border border-emerald-150/40">
                <div className="bg-amber-100 p-2.5 rounded-xl shrink-0">
                  <Award className="h-6 w-6 text-amber-600 animate-pulse-subtle" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Eco-Green Badge Certificate</span>
                  <h4 className="text-xs font-black text-gray-800 font-sans mt-0.5">
                    {completedGuides.length === SUSTAINABLE_GUIDES.length 
                      ? '👑 স্বর্ণপদক জলবায়ু-বান্ধব মাস্টার খামারি' 
                      : completedGuides.length >= 2 
                      ? '🌱 উদ্যোগী সবুজ খামারি (Silver Pro)' 
                      : '🌾 শিক্ষানবিস পরিবেশ-বান্ধব খামারি (Beginner)'}
                  </h4>
                </div>
              </div>

              {/* Tracker 3: Interactive Call to action */}
              <div className="text-right flex flex-col items-start md:items-end justify-center">
                <div className="text-xs font-black text-gray-700 font-sans">
                  সঠিক কুইজ উত্তর: <span className="text-amber-600 font-mono text-sm">★ {Object.keys(quizSubmitted).filter(id => quizAnswers[id] === SUSTAINABLE_GUIDES.find(g => g.id === id)?.quiz.answerIndex).length} টি</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 font-semibold">
                  সকল প্রশ্নের সঠিক উত্তর দিয়ে সোনার মেডেল আনলক করুন!
                </p>
              </div>

            </div>

            {/* Filter Buttons & Live Search Engine */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              
              {/* Category buttons rail */}
              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-0.5 whitespace-nowrap">
                <button
                  onClick={() => setEduCategory('all')}
                  className={`px-3.5 py-2 rounded-xl text-[11px] font-sans font-black transition-all cursor-pointer ${
                    eduCategory === 'all' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-white border border-gray-150 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  সবগুলো কোর্স
                </button>
                <button
                  onClick={() => setEduCategory('soil')}
                  className={`px-3.5 py-2 rounded-xl text-[11px] font-sans font-black transition-all cursor-pointer ${
                    eduCategory === 'soil' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-white border border-gray-150 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🌱 মাটি ও জৈব সার
                </button>
                <button
                  onClick={() => setEduCategory('pest')}
                  className={`px-3.5 py-2 rounded-xl text-[11px] font-sans font-black transition-all cursor-pointer ${
                    eduCategory === 'pest' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-white border border-gray-150 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🐛 বালাই দমন
                </button>
                <button
                  onClick={() => setEduCategory('irrigation')}
                  className={`px-3.5 py-2 rounded-xl text-[11px] font-sans font-black transition-all cursor-pointer ${
                    eduCategory === 'irrigation' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-white border border-gray-150 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  💧 সাশ্রয়ী সেচ
                </button>
                <button
                  onClick={() => setEduCategory('grading')}
                  className={`px-3.5 py-2 rounded-xl text-[11px] font-sans font-black transition-all cursor-pointer ${
                    eduCategory === 'grading' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-white border border-gray-150 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📦 প্রসেসিং ও প্যাকিং
                </button>
              </div>

              {/* Dynamic Search box */}
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="শিক্ষা গাইড বা টিপস খুঁজুন..."
                  value={eduSearch}
                  onChange={(e) => setEduSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-150 rounded-xl text-xs text-gray-800 outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

            </div>

            {/* Success confetti banner alert */}
            {confettiActive && (
              <div className="bg-amber-500 text-white p-3.5 rounded-2xl text-center text-xs font-black shadow-lg animate-bounce flex items-center justify-center gap-2 select-none">
                🌟 অসামান্য! কুইজের উত্তর একেবারে সঠিক হয়েছে! আপনার সবুজ মেডেল স্কোর আপডেট হয়েছে। 🌟
              </div>
            )}

            {/* Core training guides grid system */}
            {SUSTAINABLE_GUIDES.filter(guide => {
              const matchesCategory = eduCategory === 'all' || guide.category === eduCategory;
              const matchesSearch = guide.titleBn.toLowerCase().includes(eduSearch.toLowerCase()) || 
                                    guide.titleEn.toLowerCase().includes(eduSearch.toLowerCase()) || 
                                    guide.descBn.toLowerCase().includes(eduSearch.toLowerCase()) ||
                                    guide.descEn.toLowerCase().includes(eduSearch.toLowerCase());
              return matchesCategory && matchesSearch;
            }).length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-10 text-center space-y-2">
                <BookOpen className="h-10 w-10 text-gray-350 mx-auto" />
                <h4 className="text-xs font-black text-gray-700">কোনো শিক্ষা গাইড খুঁজে পাওয়া যায়নি</h4>
                <p className="text-[11px] text-gray-400">অনুগ্রহ করে অন্য কোনো কী-ওয়ার্ড দিয়ে পুনরায় সার্চ ট্রাই করুন।</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {SUSTAINABLE_GUIDES.filter(guide => {
                  const matchesCategory = eduCategory === 'all' || guide.category === eduCategory;
                  const matchesSearch = guide.titleBn.toLowerCase().includes(eduSearch.toLowerCase()) || 
                                        guide.titleEn.toLowerCase().includes(eduSearch.toLowerCase()) || 
                                        guide.descBn.toLowerCase().includes(eduSearch.toLowerCase()) ||
                                        guide.descEn.toLowerCase().includes(eduSearch.toLowerCase());
                  return matchesCategory && matchesSearch;
                }).map(guide => {
                  const isCompleted = completedGuides.includes(guide.id);
                  const isQuizDone = quizSubmitted[guide.id];
                  const userAnsIdx = quizAnswers[guide.id];
                  
                  return (
                    <div 
                      key={guide.id}
                      className="bg-white border border-gray-150-soft rounded-3xl overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-250 transition-all duration-200 flex flex-col text-left"
                    >
                      {/* Image Thumbnail Container with Play Overlay */}
                      <div className="relative h-44 bg-gray-100 overflow-hidden shrink-0 group">
                        <img 
                          src={guide.thumbnail} 
                          alt={guide.titleBn} 
                          className="h-full w-full object-cover group-hover:scale-105 transition duration-300 pointer-events-none"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/35 hover:bg-black/25 transition duration-200 flex items-center justify-center">
                          <button
                            onClick={() => {
                              setActiveVideoUrl(guide.embedUrl);
                              setActiveGuide(guide);
                            }}
                            className="bg-white/95 hover:bg-emerald-600 hover:scale-110 text-emerald-800 hover:text-white h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 cursor-pointer"
                            title="প্লে করুন / Watch Video"
                          >
                            <Play className="h-5 w-5 fill-current ml-0.5" />
                          </button>
                        </div>
                        
                        {/* Tags floating inside card cover image */}
                        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider">
                          {guide.category === 'soil' ? '🌱 মাটি ও সার' : guide.category === 'pest' ? '🐛 বালাই দমন' : guide.category === 'irrigation' ? '💧 সাশ্রয়ী সেচ' : '📦 প্রসেসিং'}
                        </span>
                        
                        <span className="absolute bottom-3 right-3 bg-emerald-800/90 text-white text-[9px] font-mono font-black px-2 py-0.5 rounded-md">
                          {guide.durationBn}
                        </span>
                      </div>

                      {/* Info & core metadata section */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] bg-gray-100 text-gray-500 font-extrabold px-1.5 py-0.5 rounded-md">
                              অধ্যয়ন লেভেল: {guide.difficultyBn} ({guide.difficultyEn})
                            </span>
                            {isCompleted && (
                              <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-250 font-black px-2 py-0.5 rounded-md flex items-center gap-0.5 select-none animate-pulse-subtle">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" /> সম্পন্ন
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs sm:text-[13px] font-black text-gray-700 font-sans leading-snug">
                            {guide.titleBn}
                          </h4>
                          <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                            {guide.descBn}
                          </p>
                        </div>

                        {/* Interactive Actions Tray */}
                        <div className="pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedGuideDetail(guide)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10.5px] font-black px-3.5 py-2 rounded-xl transition cursor-pointer flex items-center gap-1"
                          >
                            <BookOpen className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            গাইড টিপস ও কুইজ ({guide.tipsBn.length} টি)
                          </button>

                          <button
                            onClick={() => {
                              if (isCompleted) {
                                setCompletedGuides(prev => prev.filter(id => id !== guide.id));
                              } else {
                                setCompletedGuides(prev => [...prev, guide.id]);
                              }
                            }}
                            className={`text-[10px] font-sans font-black px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                              isCompleted 
                                ? 'bg-amber-50 text-amber-800 border-amber-250 hover:bg-amber-100' 
                                : 'bg-white text-gray-600 border-gray-250 hover:bg-gray-50'
                            }`}
                          >
                            {isCompleted ? '✘ অসমাপ্ত করুন' : '✔ সম্পন্ন চিহ্নিত করুন'}
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Useful External Agro Resources links banner card */}
            <div className="border border-emerald-150 bg-emerald-50/15 rounded-3xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="col-span-2 space-y-1 text-left">
                <span className="text-[9px] font-black uppercase text-emerald-700 tracking-wider font-mono">BANGLADESH AGRI ADVISORY SERVICE</span>
                <h4 className="text-xs font-black text-gray-700">বাংলাদেশ উপজেলা কৃষি তথ্য কক এবং সরাসরি ১৮২ কল সাপোর্ট</h4>
                <p className="text-[10.5px] text-gray-400 font-medium leading-relaxed">
                  যেকোনো জটিল পোকা-মাকড় রোগ নির্ণয় করতে প্রতিদিন সকাল ৯টা হতে রাত ৮টা পর্যন্ত সম্পূর্ণ ফ্রিতে কৃষি তথ্য সার্ভিস কল সেন্টার টোল-ফ্রি নম্বর <strong className="text-gray-600 font-sans">১৬১২৩</strong> এ যোগাযোগ করুন।
                </p>
              </div>
              <div className="text-right shrink-0">
                <a 
                  href="tel:16123" 
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-black px-5 py-3 rounded-2xl text-xs shadow-md transition cursor-pointer active:scale-95"
                >
                  <Phone className="h-4 w-4 text-white shrink-0" />
                  ১৬১২৩ কল দিন 📞
                </a>
              </div>
            </div>

          </div>
        )}

        {/* FULL SCREEN VIDEO PLAYBACK THEATRICAL MODAL COMPONENT */}
        {activeVideoUrl && activeGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-2xl overflow-hidden bg-gray-900 rounded-3xl shadow-2xl flex flex-col text-left">
              
              {/* Header inside theater panel */}
              <div className="p-4 bg-gray-950/80 text-white flex items-center justify-between border-b border-gray-800">
                <div className="min-w-0 pr-4">
                  <span className="text-[8.5px] bg-emerald-800 text-emerald-100 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">
                    {activeGuide.category.toUpperCase()} VIDEO INTERACTIVE
                  </span>
                  <h4 className="text-xs sm:text-sm font-black truncate text-gray-100 font-sans mt-0.5">
                    {activeGuide.titleBn}
                  </h4>
                </div>
                <button
                  onClick={() => {
                    setActiveVideoUrl(null);
                    setActiveGuide(null);
                  }}
                  className="bg-white/10 hover:bg-red-650 hover:text-white text-gray-400 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition text-xs shrink-0 font-bold"
                  title="Close Video Pane"
                >
                  ✕
                </button>
              </div>

              {/* Video container element inside modal */}
              <div className="relative aspect-video bg-black scroll-smooth">
                <iframe 
                  src={activeVideoUrl}
                  title={activeGuide.titleBn}
                  className="absolute inset-0 w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>

              {/* Bottom detail actions info block inside theater */}
              <div className="p-4 bg-gray-950/95 text-white/90 border-t border-gray-800 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs select-none">
                  <p className="text-[10.5px] text-gray-400">
                    ভিডিওটি সম্পন্ন করা হলে "কমপ্লিট কোর্স" বোতাম টিপে আপনার ড্যাশবোর্ড আপডেট করুন।
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!completedGuides.includes(activeGuide.id)) {
                          setCompletedGuides(prev => [...prev, activeGuide.id]);
                        }
                        setActiveVideoUrl(null);
                        setActiveGuide(null);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10.5px] px-4 py-2 rounded-xl shadow-md transition cursor-pointer active:scale-95 text-center"
                    >
                      ✔ এই কোর্স সম্পন্ন করুন
                    </button>
                    <button
                      onClick={() => {
                        setActiveVideoUrl(null);
                        setActiveGuide(null);
                        setSelectedGuideDetail(activeGuide);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold text-[10.5px] px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      কুইজে অংশ নিন ⚡
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* COMPREHENSIVE TIPS & KNOWLEDGE QUIZ TRAY MODAL COMPONENT */}
        {selectedGuideDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="relative w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-left font-sans">
              
              {/* Header Box */}
              <div className="p-5 border-b border-gray-100 flex items-start justify-between bg-emerald-50/15">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 font-mono">Practice Tips & Topic Assessment</span>
                  <h3 className="text-sm sm:text-base font-black text-gray-850 font-sans">
                    {selectedGuideDetail.titleBn}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedGuideDetail(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-500 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer transition text-[11px]"
                  title="Close Dialog"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Container Content */}
              <div className="p-5 overflow-y-auto space-y-6 no-scrollbar">
                
                {/* Section A: Important agricultural guidance steps */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                    🌾 এই কোর্সের গুরুত্বপূর্ণ খামার টিপসসমূহ (Agronomy Best-practices):
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedGuideDetail.tipsBn.map((tip, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-xs text-gray-655 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-700 text-xs">{tip}</p>
                          <p className="text-[10px] text-gray-400 italic mt-0.5 font-semibold">{selectedGuideDetail.tipsEn[idx]}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section B: Topic Quiz Block */}
                <div className="border-t border-gray-100 pt-5 space-y-4">
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-905 border border-amber-200/50 p-2 px-3 rounded-xl">
                    <span className="text-[10px] font-black uppercase leading-none font-mono">assessment quiz</span>
                    <span className="h-1.5 w-1.5 bg-amber-500 rounded-full animate-ping"></span>
                    <span className="text-[9.5px] text-amber-700 font-bold ml-auto">{language === 'bn' ? '১টি বহুনির্বাচনী প্রশ্ন' : '1 Multiple Choice Question'}</span>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[12.5px] font-black text-gray-800 font-sans leading-snug">
                      প্রশ্ন: {selectedGuideDetail.quiz.questionBn}
                    </h5>
                    <p className="text-[10.5px] text-gray-400 italic font-semibold">
                      En: {selectedGuideDetail.quiz.questionEn}
                    </p>

                    {/* Radio Options List Container */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {selectedGuideDetail.quiz.optionsBn.map((opt, optIdx) => {
                        const isSelected = quizAnswers[selectedGuideDetail.id] === optIdx;
                        const hasSubmitted = quizSubmitted[selectedGuideDetail.id];
                        const isOptCorrect = selectedGuideDetail.quiz.answerIndex === optIdx;
                        
                        let optionStyle = "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700";
                        if (isSelected) {
                          optionStyle = "border-2 border-emerald-600 bg-emerald-50/20 text-emerald-950 font-black";
                        }
                        if (hasSubmitted) {
                          if (isOptCorrect) {
                            optionStyle = "border-2 border-green-500 bg-green-50/45 text-green-950 font-black";
                          } else if (isSelected) {
                            optionStyle = "border-2 border-red-500 bg-red-50/45 text-red-950 line-through";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => {
                              if (!hasSubmitted) {
                                setQuizAnswers(prev => ({ ...prev, [selectedGuideDetail.id]: optIdx }));
                              }
                            }}
                            disabled={hasSubmitted}
                            className={`p-3 rounded-xl flex flex-col text-left transition text-xs cursor-pointer ${optionStyle}`}
                          >
                            <span className="font-sans font-black">{optIdx + 1}. {opt}</span>
                            <span className="text-[10px] text-gray-400 mt-0.5 font-medium italic">{selectedGuideDetail.quiz.optionsEn[optIdx]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Quiz Feedback Container */}
                    {quizSubmitted[selectedGuideDetail.id] ? (
                      <div className={`p-4 rounded-2xl border text-left ${
                        quizAnswers[selectedGuideDetail.id] === selectedGuideDetail.quiz.answerIndex
                          ? 'bg-green-50 border-green-200 text-green-950 text-xs'
                          : 'bg-red-50 border-red-200 text-red-950 text-xs'
                      } space-y-1`}>
                        <h4 className="font-sans font-black text-xs flex items-center gap-1">
                          {quizAnswers[selectedGuideDetail.id] === selectedGuideDetail.quiz.answerIndex 
                            ? '🎉 উত্তর সঠিক হয়েছে (Correct Answer)!' 
                            : '❌ দুঃখিত, ভুল উত্তর হয়েছে (Incorrect Answer)!'}
                        </h4>
                        <p className="text-[10.5px] leading-relaxed text-gray-655 font-sans font-medium mt-1 text-left">
                          {selectedGuideDetail.quiz.explanationBn}
                        </p>
                        <p className="text-[10px] leading-relaxed text-gray-400 font-medium italic text-left">
                          Eng: {selectedGuideDetail.quiz.explanationEn}
                        </p>
                      </div>
                    ) : (
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (quizAnswers[selectedGuideDetail.id] !== undefined) {
                              setQuizSubmitted(prev => ({ ...prev, [selectedGuideDetail.id]: true }));
                              const isCorrect = quizAnswers[selectedGuideDetail.id] === selectedGuideDetail.quiz.answerIndex;
                              if (isCorrect) {
                                setConfettiActive(true);
                                setTimeout(() => setConfettiActive(false), 5000);
                                // Automatically add and append to completed if correct
                                if (!completedGuides.includes(selectedGuideDetail.id)) {
                                  setCompletedGuides(prev => [...prev, selectedGuideDetail.id]);
                                }
                              }
                            } else {
                              alert("অনুগ্রহ করে একটি সঠিক উত্তর নির্বাচন করুন!");
                            }
                          }}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition"
                        >
                          প্রশ্নোত্তর লক করুন (Lock Selected Answer)
                        </button>
                      </div>
                    )}

                  </div>
                </div>

              </div>
              
              {/* Dismiss footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedGuideDetail(null)}
                  className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-xl text-xs font-black cursor-pointer shadow-xs"
                >
                  ফিরে যান (Return)
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
