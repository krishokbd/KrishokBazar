import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Product, Order } from '../types';
import { FEMALE_AVATAR, MALE_AVATAR } from '../assets';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

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
  Bell
} from 'lucide-react';

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
    setView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'profile' | 'verification'>('overview');

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
      farmerId: currentUser.farmerId || 'f1',
      farmerName: currentUser.name || 'খামারি অংশীদার',
      rating: 5.0,
      isVerified: isVerified,
      approved: false, // MANDATORY: Starts as unapproved, goes to Admin first!
      uploaderRole: 'Farmer' as const,
      unit: prodUnit,
      harvestDate: prodHarvestDate || undefined
    };

    if (editingProduct) {
      editProduct(editingProduct.id, pPayload);
      alert("পণ্যটি হালনাগাদ করা হয়েছে! পরিবর্তনের জন্য এটি এডমিন পুর্নরিভিউতে থাকবে।");
    } else {
      addProduct({ id: `p-farm-${Date.now()}`, ...pPayload } as any);
      alert("বাছাইকৃত তাজা ফসলটি সফলভাবে আপলোড করা হয়েছে! এটি এডমিন অনুমোদন করার সাথে সাথেই লাইভ চালু হয়ে যাবে।");
    }

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
            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm text-left">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">চলতি সপ্তাহের প্রতিবেদন</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">সবজি ও ফসলের দৈনিক চাহিদা ও অগ্রগতি ট্র্যাক করুন</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 gap-2 text-xs">
                <div className="border border-emerald-100/50 rounded-2xl p-3 bg-emerald-50/20 text-emerald-905 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-850">অর্ডার কনভার্সন রেট:</span>
                    <span className="block text-[10px] text-gray-400 font-medium">ভেরিফিকেশনের পর অর্ডারের পরিমাণ বাড়ে গড়ে ৫০x গুণ</span>
                  </div>
                  <strong className="text-amber-600 font-mono">৯৮.২%</strong>
                </div>
                <div className="border border-gray-150 rounded-2xl p-3 bg-gray-50/50 flex items-center justify-between text-gray-700">
                  <div>
                    <span className="font-bold">মাঠ থেকে সরাসরি সরবরাহ:</span>
                    <span className="block text-[10px] text-gray-400 font-medium">আপনার এলাকার মোট নিবন্ধিত ক্রেতা সংখ্যা</span>
                  </div>
                  <strong className="text-gray-800 font-mono">১,২৪০ জন</strong>
                </div>
              </div>
            </div>

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
                        <img 
                          src={p.images[0]} 
                          className="h-16 w-16 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100" 
                          referrerPolicy="no-referrer" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60-1';
                          }}
                        />
                        <div className="text-left py-1 text-xs justify-between flex flex-col h-full overflow-hidden">
                          <div>
                            <strong className="text-gray-800 text-[11px] block truncate max-w-[130px] sm:max-w-xs">{p.title}</strong>
                            <span className="text-[9.5px] text-gray-400 block font-mono capitalize">{p.category}</span>
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

      </div>
    </div>
  );
};
