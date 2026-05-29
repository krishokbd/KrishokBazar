import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Product, Farmer, Order, Review, Category, Banner } from '../types';
import { 
  Users, 
  Package, 
  Plus, 
  Ban, 
  Star, 
  Coins, 
  Leaf, 
  ChevronRight, 
  Edit, 
  Trash,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { FEMALE_AVATAR, MALE_AVATAR } from '../assets';

export const AdminCMSDashboard: React.FC = () => {
  const { 
    currentUser, 
    products, 
    farmers, 
    orders,
    reviews,
    addProduct, 
    editProduct, 
    deleteProduct,
    updateOrderStatus,
    toggleVerifyFarmer,
    toggleBlockFarmer,
    approveFarmerRegistration,
    addReview,
    withdrawalRequests,
    deleteFarmer,
    updateWithdrawallStatus,
    getNidDetails,
    categories,
    banners,
    saveCategories,
    saveBanners,
    updateFarmer,
    deleteReview
  } = useApp();

  // Admin CMS active tab
  const [adminActiveTab, setAdminActiveTab] = useState<'farmers' | 'products' | 'categories' | 'banners' | 'reviews' | 'orders'>('farmers');

  // Categories editing state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormId, setCategoryFormId] = useState('');
  const [categoryFormNameBn, setCategoryFormNameBn] = useState('');
  const [categoryFormNameEn, setCategoryFormNameEn] = useState('');
  const [categoryFormIcon, setCategoryFormIcon] = useState('Leaf');

  // Banners / Slides editing state
  const [editingBannerIndex, setEditingBannerIndex] = useState<number | null>(null);
  const [bannerFormImage, setBannerFormImage] = useState('');
  const [bannerFormTitleBn, setBannerFormTitleBn] = useState('');
  const [bannerFormTitleEn, setBannerFormTitleEn] = useState('');
  const [bannerFormSubtitleBn, setBannerFormSubtitleBn] = useState('');
  const [bannerFormSubtitleEn, setBannerFormSubtitleEn] = useState('');

  // Admin Custom Product Editor state
  const [adminEditingProduct, setAdminEditingProduct] = useState<Product | null>(null);
  const [adminIsAddingProduct, setAdminIsAddingProduct] = useState(false);
  const [adminProdTitle, setAdminProdTitle] = useState('');
  const [adminProdPrice, setAdminProdPrice] = useState(0);
  const [adminProdDiscountPrice, setAdminProdDiscountPrice] = useState('');
  const [adminProdCategory, setAdminProdCategory] = useState('fruits');
  const [adminProdDesc, setAdminProdDesc] = useState('');
  const [adminProdStock, setAdminProdStock] = useState(10);
  const [adminProdReadyToCook, setAdminProdReadyToCook] = useState(false);
  const [adminProdImages, setAdminProdImages] = useState<string[]>([]);
  const [adminProdFarmerId, setAdminProdFarmerId] = useState('');
  const [adminProdIsFeatured, setAdminProdIsFeatured] = useState(false);
  const [adminProdIsVerified, setAdminProdIsVerified] = useState(true);

  // Admin Farmer Profile Editing state
  const [adminEditingFarmer, setAdminEditingFarmer] = useState<Farmer | null>(null);
  const [adminFarmerFormName, setAdminFarmerFormName] = useState('');
  const [adminFarmerFormPhone, setAdminFarmerFormPhone] = useState('');
  const [adminFarmerFormDistrict, setAdminFarmerFormDistrict] = useState('');
  const [adminFarmerFormAddress, setAdminFarmerFormAddress] = useState('');
  const [adminFarmerFormNid, setAdminFarmerFormNid] = useState('');
  const [adminFarmerFormStatus, setAdminFarmerFormStatus] = useState<'Pending' | 'Approved' | 'Blocked'>('Approved');
  const [adminFarmerFormVerified, setAdminFarmerFormVerified] = useState(false);
  const [adminFarmerFormRating, setAdminFarmerFormRating] = useState(4.5);
  const [adminFarmerFormBalance, setAdminFarmerFormBalance] = useState(0);
  const [adminFarmerFormBio, setAdminFarmerFormBio] = useState('');

  // Customer feedback mock seeding state
  const [feedbackProdName, setFeedbackProdName] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackCustomerName, setFeedbackCustomerName] = useState('');
  const [feedbackLocation, setFeedbackLocation] = useState('');

  if (!currentUser) return null;

  return (
    <section className="py-8 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ADMIN HEADER */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gradient-to-tr from-emerald-600 to-green-500 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow">
              ADM
            </div>
            <div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono">প্রধান এডমিন হাব (Central Authority & CMS)</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-800 leading-tight font-sans mt-0.5">{currentUser.name}</h1>
              <p className="text-xs text-gray-500 font-medium">নিবন্ধিত মেইলার হাব: {currentUser.phone || currentUser.email} • কন্ট্রোল স্টেশন: রাজভাট, রাজশাহী</p>
            </div>
          </div>

          {/* Dashboard Metrics */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-gray-50 border border-gray-100 p-3 px-5 rounded-2xl text-center shadow-inner min-w-[90px]">
              <span className="text-[9px] uppercase text-gray-400 font-bold block leading-none">কৃষক</span>
              <strong className="text-base font-bold text-emerald-700 block mt-1">{farmers.length} জন</strong>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-3 px-5 rounded-2xl text-center shadow-inner min-w-[90px]">
              <span className="text-[9px] uppercase text-gray-400 font-bold block leading-none">মোট পণ্য</span>
              <strong className="text-base font-bold text-indigo-650 block mt-1">{products.length}টি</strong>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-3 px-5 rounded-2xl text-center shadow-inner min-w-[90px]">
              <span className="text-[9px] uppercase text-gray-400 font-bold block leading-none">ক্যাটাগরি</span>
              <strong className="text-base font-bold text-amber-700 block mt-1">{categories.length}টি</strong>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-3 px-5 rounded-2xl text-center shadow-inner min-w-[90px]">
              <span className="text-[9px] uppercase text-gray-400 font-bold block leading-none">অর্ডার</span>
              <strong className="text-base font-bold text-blue-600 block mt-1">{orders.length}টি</strong>
            </div>
          </div>
        </div>

        {/* TAB SELECTORS */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto gap-1 pb-2 scrollbar-none">
          <button
            onClick={() => setAdminActiveTab('farmers')}
            className={`px-4.5 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              adminActiveTab === 'farmers'
                ? 'bg-emerald-600 text-white shadow font-black'
                : 'text-gray-600 hover:bg-gray-250/60 hover:text-gray-900 bg-white border border-gray-100'
            }`}
          >
            🌾 কৃষক ও ভেরিফিকেশন ({farmers.length})
          </button>
          <button
            onClick={() => setAdminActiveTab('products')}
            className={`px-4.5 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              adminActiveTab === 'products'
                ? 'bg-emerald-600 text-white shadow font-black'
                : 'text-gray-600 hover:bg-gray-250/60 hover:text-gray-900 bg-white border border-gray-100'
            }`}
          >
            🍏 পণ্য ক্যাটালগ CMS ({products.length})
          </button>
          <button
            onClick={() => setAdminActiveTab('categories')}
            className={`px-4.5 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              adminActiveTab === 'categories'
                ? 'bg-emerald-600 text-white shadow font-black'
                : 'text-gray-600 hover:bg-gray-250/60 hover:text-gray-900 bg-white border border-gray-100'
            }`}
          >
            📁 শ্রেণীবিভাগ ({categories.length})
          </button>
          <button
            onClick={() => setAdminActiveTab('banners')}
            className={`px-4.5 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              adminActiveTab === 'banners'
                ? 'bg-emerald-600 text-white shadow font-black'
                : 'text-gray-600 hover:bg-gray-250/60 hover:text-gray-900 bg-white border border-gray-100'
            }`}
          >
            🖼️ হোম স্লাইডার ({banners.length})
          </button>
          <button
            onClick={() => setAdminActiveTab('reviews')}
            className={`px-4.5 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              adminActiveTab === 'reviews'
                ? 'bg-emerald-600 text-white shadow font-black'
                : 'text-gray-600 hover:bg-gray-250/60 hover:text-gray-900 bg-white border border-gray-100'
            }`}
          >
            ⭐ রিভিউ মডারেটর ({reviews.length})
          </button>
          <button
            onClick={() => setAdminActiveTab('orders')}
            className={`px-4.5 py-2.5 rounded-xl font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
              adminActiveTab === 'orders'
                ? 'bg-emerald-600 text-white shadow font-black'
                : 'text-gray-600 hover:bg-gray-250/60 hover:text-gray-900 bg-white border border-gray-100'
            }`}
          >
            🛒 অর্ডার ও উত্তোলন ({orders.length})
          </button>
        </div>

        {/* PANEL CONTENT COMPONENT VIEWS */}
        <div>

          {/* TAB 1: FARMER APPLICATIONS AND VERIFICATION STATUS */}
          {adminActiveTab === 'farmers' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                
                {/* Pending Applications list */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-xs sm:text-sm font-black text-amber-700 uppercase tracking-wider flex items-center gap-1.5 mb-4">
                    <Users className="h-4 w-4" />
                    নিবন্ধনের জন্য অপেক্ষমাণ কৃষক আবেদনপত্র ({farmers.filter(f => f.status === 'Pending').length})
                  </h2>

                  {farmers.filter(f => f.status === 'Pending').length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <p className="text-xs text-gray-400">নিবন্ধনের জন্য নতুন কোনো অপেক্ষমাণ আবেদন নেই।</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {farmers.filter(f => f.status === 'Pending').map((f) => {
                        const nidD = getNidDetails(f.id);
                        return (
                          <div key={f.id} className="border border-amber-100 rounded-2xl p-4.5 bg-amber-50/20 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-white shrink-0 border border-gray-150">
                                  <img 
                                    src={f.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR} 
                                    className="h-full w-full object-cover" 
                                    referrerPolicy="no-referrer" 
                                  />
                                </div>
                                <div>
                                  <span className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                                    {f.name} 
                                    <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">পেন্ডিং রিভিউ</span>
                                  </span>
                                  <span className="block text-[10px] text-gray-400 font-mono mt-0.5">মোবাইল: {f.phone} • জেলা: {f.district}</span>
                                </div>
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold bg-white px-2 py-0.5 rounded border border-gray-100 uppercase font-mono">ID: {f.id}</span>
                            </div>

                            <div className="bg-white rounded-xl p-3 text-[11px] text-gray-600 border border-gray-100 space-y-1 font-sans">
                              <p><strong>গ্রাম বা এলাকা:</strong> {f.address}</p>
                              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-2 mt-1">
                                <p className="font-mono text-gray-500">
                                  <strong>NID নাম্বার:</strong> <span className="text-gray-800 font-bold bg-gray-50 border border-gray-200 px-1.5 rounded">{nidD.nid}</span>
                                </p>
                                
                                <div className="flex items-center gap-1">
                                  {nidD.status === 'Verified' ? (
                                    <span className="inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-250 px-2 py-0.5 text-[9px] font-bold text-emerald-700 animate-pulse">
                                      ✔ EC ভেরিফাইড (Authentic)
                                    </span>
                                  ) : nidD.status === 'Suspected' ? (
                                    <span className="inline-flex items-center gap-1 rounded bg-red-50 border border-red-200 px-2 py-0.5 text-[9px] font-bold text-red-650 animate-pulse">
                                      ⚠️ সন্দেহভাজন NID
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 rounded bg-gray-50 border border-gray-200 px-2 py-0.5 text-[9px] font-bold text-gray-600">
                                      🔎 অপরীক্ষিত বিবরণ
                                    </span>
                                  )}
                                </div>
                              </div>

                              {nidD.exists && (
                                <div className="bg-slate-50 border rounded-lg p-2 mt-1 text-[9px] font-mono text-gray-500 space-y-1">
                                  <div className="flex justify-between">
                                    <span>নির্বাচনী ডাটাবেজ ট্র্যাকার:</span>
                                    <span className="font-bold text-gray-700">{nidD.ecReference}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>আঙুলের ছাপ সামঞ্জস্য:</span>
                                    <span className="font-bold text-emerald-700">{nidD.percentMatchCount}% মিল</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-end gap-2 pt-1 font-sans">
                              <button
                                onClick={() => deleteFarmer(f.id)}
                                className="px-3 py-1 text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg cursor-pointer"
                              >
                                আবেদন নাকচ করুন
                              </button>
                              <button
                                onClick={() => {
                                  // Auto load info to editor for approval
                                  setAdminEditingFarmer(f);
                                  setAdminFarmerFormName(f.name);
                                  setAdminFarmerFormPhone(f.phone);
                                  setAdminFarmerFormDistrict(f.district);
                                  setAdminFarmerFormAddress(f.address);
                                  setAdminFarmerFormNid(nidD.nid);
                                  setAdminFarmerFormStatus('Approved');
                                  setAdminFarmerFormVerified(true);
                                  setAdminFarmerFormRating(f.rating);
                                  setAdminFarmerFormBalance(f.balance);
                                  setAdminFarmerFormBio(f.bio || '');
                                }}
                                className="px-3.5 py-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer shadow-sm"
                              >
                                সম্পাদনা ও অনুমোদন করুন ✔
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Active Partner Farmers */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wider block mb-4">নিবন্ধিত অংশীদার কৃষক তালিকা ({farmers.filter(f => f.status !== 'Pending').length})</h3>
                  
                  <div className="space-y-3.5">
                    {farmers.filter(f => f.status !== 'Pending').map((f) => (
                      <div key={f.id} className="border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white hover:bg-gray-50/50 transition-all font-sans">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-50 shrink-0 border border-gray-150">
                            <img src={f.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-gray-900">{f.name}</span>
                              {f.verified && (
                                <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1 rounded text-[8px] font-black text-emerald-600 border border-emerald-100">
                                  ✔ ভেরিফাইড
                                </span>
                              )}
                              {f.status === 'Blocked' && (
                                <span className="inline-flex items-center gap-0.5 rounded bg-red-50 px-1 rounded text-[8px] font-black text-red-650 border border-red-100">
                                  ⛔ স্থগিত
                                </span>
                              )}
                            </div>
                            <span className="block text-[10px] text-gray-500 font-medium">
                              {f.district} • {f.phone} • ব্যালেন্স: <strong className="text-emerald-700">৳{f.balance}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                          <span className="text-xs text-amber-500 font-bold">★ {f.rating}</span>
                          
                          <button
                            onClick={() => {
                              setAdminEditingFarmer(f);
                              setAdminFarmerFormName(f.name);
                              setAdminFarmerFormPhone(f.phone);
                              setAdminFarmerFormDistrict(f.district);
                              setAdminFarmerFormAddress(f.address);
                              setAdminFarmerFormNid(f.nid || '');
                              setAdminFarmerFormStatus(f.status);
                              setAdminFarmerFormVerified(f.verified);
                              setAdminFarmerFormRating(f.rating);
                              setAdminFarmerFormBalance(f.balance);
                              setAdminFarmerFormBio(f.bio || '');
                            }}
                            className="px-2 py-1 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 rounded-lg text-[10px] font-bold border border-gray-205 cursor-pointer"
                          >
                            সম্পাদনা
                          </button>

                          <button
                            onClick={() => toggleVerifyFarmer(f.id)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              f.verified 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-gray-50 text-gray-400 border-gray-200'
                            }`}
                          >
                            {f.verified ? 'সার্টিফাইড' : 'ভেরিফাই'}
                          </button>

                          <button
                            onClick={() => toggleBlockFarmer(f.id)}
                            className={`p-1 rounded-lg border transition-all cursor-pointer ${
                              f.status === 'Blocked' 
                                ? 'bg-red-50 text-red-600 border-red-200' 
                                : 'text-gray-400 border-gray-150 hover:text-red-500'
                            }`}
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Farmer Editing Column/Drawer on Right */}
              <div className="space-y-6">
                {adminEditingFarmer ? (
                  <div className="bg-white rounded-3xl border border-blue-100 p-6 shadow-md space-y-4 font-sans">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase font-mono tracking-wider">কৃষক প্রোফাইল CMS এডিটর</span>
                      <h3 className="text-sm font-black text-gray-800">সংশোধন করুন: {adminEditingFarmer.name}</h3>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div>
                        <label className="block font-bold text-gray-600 mb-1">কৃষকের নাম:</label>
                        <input 
                          type="text"
                          value={adminFarmerFormName}
                          onChange={(e) => setAdminFarmerFormName(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 p-2 text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-gray-600 mb-1">মোবাইল:</label>
                          <input 
                            type="text"
                            value={adminFarmerFormPhone}
                            onChange={(e) => setAdminFarmerFormPhone(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 p-2 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-600 mb-1">জেলা:</label>
                          <input 
                            type="text"
                            value={adminFarmerFormDistrict}
                            onChange={(e) => setAdminFarmerFormDistrict(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 p-2 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-600 mb-1">গ্রাম ও ঠিকানা:</label>
                        <textarea 
                          rows={2}
                          value={adminFarmerFormAddress}
                          onChange={(e) => setAdminFarmerFormAddress(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 p-2 text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-gray-600 mb-1">NID নাম্বার:</label>
                          <input 
                            type="text"
                            value={adminFarmerFormNid}
                            onChange={(e) => setAdminFarmerFormNid(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 p-2 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-600 mb-1">লিঙ্ক কোড ব্যালেন্স (৳):</label>
                          <input 
                            type="number"
                            value={adminFarmerFormBalance}
                            onChange={(e) => setAdminFarmerFormBalance(Number(e.target.value))}
                            className="w-full rounded-xl border border-gray-200 p-2 text-xs text-emerald-700 font-bold font-mono"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-gray-600 mb-1">রেটিং স্কোর (১-৫):</label>
                          <input 
                            type="number"
                            step="0.1"
                            min="1"
                            max="5"
                            value={adminFarmerFormRating}
                            onChange={(e) => setAdminFarmerFormRating(Number(e.target.value))}
                            className="w-full rounded-xl border border-gray-200 p-2 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-600 mb-1">স্ট্যাটাস:</label>
                          <select 
                            value={adminFarmerFormStatus}
                            onChange={(e) => setAdminFarmerFormStatus(e.target.value as any)}
                            className="w-full rounded-xl border border-gray-200 p-2 text-xs font-bold bg-white"
                          >
                            <option value="Approved">Approved (অনুমোদিত)</option>
                            <option value="Pending">Pending (পেনন্ডিং রিভিও)</option>
                            <option value="Blocked">Blocked (স্থগিত)</option>
                          </select>
                        </div>
                      </div>

                      <div className="bg-gray-50 border p-2.5 rounded-xl flex items-center justify-between">
                        <span className="font-bold text-gray-600">ভেরিফাইড সার্টিফাইড ব্যাজ?</span>
                        <input 
                          type="checkbox"
                          checked={adminFarmerFormVerified}
                          onChange={(e) => setAdminFarmerFormVerified(e.target.checked)}
                          className="h-4.5 w-4.5 accent-emerald-600 rounded-md cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-600 mb-1">কৃষকের পরিচিতি / বর্ণনা (Bio):</label>
                        <textarea 
                          rows={2}
                          value={adminFarmerFormBio}
                          onChange={(e) => setAdminFarmerFormBio(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 p-2 text-xs"
                          placeholder="কৃষকের ব্যাপারে বিস্তারিত..."
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => setAdminEditingFarmer(null)}
                          className="w-1/3 py-2 border rounded-xl hover:bg-gray-100 text-[10px] font-bold text-gray-500 cursor-pointer"
                        >
                          বাতিল
                        </button>
                        <button
                          onClick={() => {
                            if (!adminEditingFarmer || !adminFarmerFormName) return;
                            updateFarmer(adminEditingFarmer.id, {
                              name: adminFarmerFormName,
                              phone: adminFarmerFormPhone,
                              district: adminFarmerFormDistrict,
                              address: adminFarmerFormAddress,
                              nid: adminFarmerFormNid,
                              status: adminFarmerFormStatus,
                              verified: adminFarmerFormVerified,
                              rating: adminFarmerFormRating,
                              balance: adminFarmerFormBalance,
                              bio: adminFarmerFormBio
                            });
                            setAdminEditingFarmer(null);
                          }}
                          className="w-2/3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shadow cursor-pointer text-center"
                        >
                          সংরক্ষণ করুন ✔
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-8 text-center text-gray-400">
                    <p className="text-xs">যেকোনো কৃষকের ডাটা সরাসরি পরিবর্তন করতে নামের পাশের "সম্পাদনা" বাটনে ট্যাপ করুন।</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT CRUD CMS CATALOGUE */}
          {adminActiveTab === 'products' && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm font-sans space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xs sm:text-sm font-black text-gray-800 uppercase flex items-center gap-1">
                    <Package className="h-4 w-4 text-emerald-600" />
                    পণ্য ডাটাবেজ ক্যাটালগ রিয়েল-টাইম CMS
                  </h2>
                  <p className="text-[10px] text-gray-400 mt-0.5">রিয়েল-টাইম এডিট এবং ডিলিট সেবা সম্বলিত সম্পূর্ণ পণ্য তালিকা।</p>
                </div>

                <button
                  onClick={() => {
                    setAdminEditingProduct(null);
                    setAdminIsAddingProduct(true);
                    setAdminProdTitle('');
                    setAdminProdPrice(100);
                    setAdminProdDiscountPrice('');
                    setAdminProdCategory(categories[0]?.id || 'vegetables');
                    setAdminProdDesc('কৃষকের সতেজ অর্গানিক মাঠ থেকে সংগৃহীত পুষ্টিকর ও নির্ভেজাল খাবার।');
                    setAdminProdStock(30);
                    setAdminProdReadyToCook(false);
                    setAdminProdImages(['https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60-1']);
                    setAdminProdFarmerId(farmers[0]?.id || 'f1');
                    setAdminProdIsFeatured(false);
                    setAdminProdIsVerified(true);
                  }}
                  className="rounded-xl px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold text-xs shadow hover:scale-101 cursor-pointer flex items-center gap-1 self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" /> Adding Product (পণ্য যোগ করুন)
                </button>
              </div>

              {/* Add / Edit Form Block Inline */}
              {(adminIsAddingProduct || adminEditingProduct) && (
                <div className="bg-indigo-50/40 border border-indigo-100 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-indigo-700 uppercase font-mono tracking-wider">
                      {adminEditingProduct ? `পণ্য এডিট করুন (ID: ${adminEditingProduct.id})` : 'নতুন পণ্য যুক্ত করার ফরম'}
                    </h3>
                    <button 
                      onClick={() => {
                        setAdminIsAddingProduct(false);
                        setAdminEditingProduct(null);
                      }}
                      className="text-xs font-bold text-red-500 cursor-pointer"
                    >
                      বন্ধ করুন [X]
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <label className="block font-bold text-gray-650 mb-1">পণ্যের নাম/শিরোনাম:</label>
                        <input 
                          type="text"
                          value={adminProdTitle}
                          onChange={(e) => setAdminProdTitle(e.target.value)}
                          className="w-full bg-white rounded-xl border border-gray-200 p-2"
                          placeholder="যেমন: সতেজ লাল পেঁয়াজ ৫ কেজি ব্যাগ"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block font-bold text-gray-650 mb-1">মূল্য (৳):</label>
                          <input 
                            type="number"
                            value={adminProdPrice}
                            onChange={(e) => setAdminProdPrice(Number(e.target.value))}
                            className="w-full bg-white rounded-xl border border-gray-200 p-2 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-655 mb-1">ডিস্কাউন্ট (৳):</label>
                          <input 
                            type="text"
                            value={adminProdDiscountPrice}
                            onChange={(e) => setAdminProdDiscountPrice(e.target.value)}
                            className="w-full bg-white rounded-xl border border-gray-200 p-2 font-mono"
                            placeholder="ফাঁকা রাখুন"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-655 mb-1">স্টক পরিমাণ (Kg/Unit):</label>
                          <input 
                            type="number"
                            value={adminProdStock}
                            onChange={(e) => setAdminProdStock(Number(e.target.value))}
                            className="w-full bg-white rounded-xl border border-gray-200 p-2 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-655 mb-1">উৎপাদনকারী খামারি অংশীদার:</label>
                        <select
                          value={adminProdFarmerId}
                          onChange={(e) => setAdminProdFarmerId(e.target.value)}
                          className="w-full bg-white rounded-xl border border-gray-200 p-2 font-bold"
                        >
                          {farmers.map(f => (
                            <option key={f.id} value={f.id}>{f.name} ({f.district}) [ID: {f.id}]</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-gray-655 mb-1">শ্রেণীবিভাগ:</label>
                          <select
                            value={adminProdCategory}
                            onChange={(e) => setAdminProdCategory(e.target.value)}
                            className="w-full bg-white rounded-xl border border-gray-200 p-2 capitalize font-bold"
                          >
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.nameBn} ({c.nameEn})</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block font-bold text-gray-655 mb-1">ছবি ৩-ডাইমেনশনাল লিংক (Img URLs):</label>
                          <input 
                            type="text"
                            value={adminProdImages[0] || ''}
                            onChange={(e) => setAdminProdImages([e.target.value, ...adminProdImages.slice(1)])}
                            className="w-full bg-white rounded-xl border border-gray-200 p-2 text-gray-500 text-[10px]"
                            placeholder="ইমেজ ওয়েব লিংক এড্রেস"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-gray-655 mb-1 font-sans">পণ্যের চমৎকার বিবরণ (Description):</label>
                        <textarea
                          rows={2.5}
                          value={adminProdDesc}
                          onChange={(e) => setAdminProdDesc(e.target.value)}
                          className="w-full bg-white rounded-xl border border-gray-200 p-2"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <label className="border p-1.5 bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer text-center text-[10px]">
                          <span className="font-bold text-gray-500 mb-0.5">Spotlight Featured ⭐</span>
                          <input 
                            type="checkbox"
                            checked={adminProdIsFeatured}
                            onChange={(e) => setAdminProdIsFeatured(e.target.checked)}
                            className="h-4 w-4 accent-emerald-600"
                          />
                        </label>
                        <label className="border p-1.5 bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer text-center text-[10px]">
                          <span className="font-bold text-gray-500 mb-0.5">ভেরিফাইড ব্যাজ 🛡️</span>
                          <input 
                            type="checkbox"
                            checked={adminProdIsVerified}
                            onChange={(e) => setAdminProdIsVerified(e.target.checked)}
                            className="h-4 w-4 accent-emerald-600"
                          />
                        </label>
                        <label className="border p-1.5 bg-white rounded-xl flex flex-col items-center justify-center cursor-pointer text-center text-[10px]">
                          <span className="font-bold text-gray-500 mb-0.5">রেডি টু কুক 🍳</span>
                          <input 
                            type="checkbox"
                            checked={adminProdReadyToCook}
                            onChange={(e) => setAdminProdReadyToCook(e.target.checked)}
                            className="h-4 w-4 accent-indigo-600"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 border-t border-indigo-100 pt-3">
                    <button
                      onClick={() => {
                        setAdminIsAddingProduct(false);
                        setAdminEditingProduct(null);
                      }}
                      className="px-4 py-1.5 rounded-xl border bg-white hover:bg-gray-150 font-bold text-xs text-gray-650 cursor-pointer"
                    >
                      বাতিল
                    </button>
                    <button
                      onClick={() => {
                        if (!adminProdTitle) return;
                        const targetFarmer = farmers.find(f => f.id === adminProdFarmerId) || farmers[0];
                        const prodPayload = {
                          title: adminProdTitle,
                          price: Number(adminProdPrice),
                          discountPrice: adminProdDiscountPrice ? Number(adminProdDiscountPrice) : undefined,
                          category: adminProdCategory,
                          description: adminProdDesc,
                          stock: Number(adminProdStock),
                          isReadyToCook: adminProdReadyToCook,
                          isFeatured: adminProdIsFeatured,
                          isVerified: adminProdIsVerified,
                          images: adminProdImages,
                          farmerId: adminProdFarmerId || targetFarmer.id,
                          farmerName: targetFarmer.name
                        };

                        if (adminEditingProduct) {
                          editProduct(adminEditingProduct.id, prodPayload);
                        } else {
                          addProduct({
                            ...prodPayload,
                            rating: 4.5,
                            reviewsCount: 0,
                            reviews: [],
                            deliveryText: '২-৩ দিনের মধ্যে নিশ্চিত হোম ডেলিভারি।'
                          });
                        }

                        setAdminIsAddingProduct(false);
                        setAdminEditingProduct(null);
                      }}
                      className="px-5 py-1.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs shadow cursor-pointer"
                    >
                      নিরাপদে সাবমিট করুন
                    </button>
                  </div>
                </div>
              )}

              {/* Grid or Table list of active products */}
              <div className="overflow-x-auto border border-gray-100 rounded-2xl">
                <table className="min-w-full divide-y divide-gray-100 text-xs">
                  <thead className="bg-gray-50 font-sans">
                    <tr>
                      <th className="px-4 py-3 text-left font-black text-gray-500 uppercase">পণ্য তথ্য ও খামারি</th>
                      <th className="px-4 py-3 text-left font-black text-gray-500 uppercase">ক্যাটাগরি</th>
                      <th className="px-4 py-3 text-center font-black text-gray-500 uppercase">মূল্য (৳)</th>
                      <th className="px-4 py-3 text-center font-black text-gray-500 uppercase">স্টক পরিমাণ</th>
                      <th className="px-4 py-3 text-center font-black text-gray-500 uppercase">Featured Spotlight</th>
                      <th className="px-4 py-3 text-center font-black text-gray-500 uppercase">ভেরিফাইড ব্যাজ</th>
                      <th className="px-4 py-3 text-right font-black text-gray-500">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100 font-sans">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-all">
                        <td className="px-4 py-2.5 flex items-center gap-2.5">
                          <img src={p.images[0]} className="h-9 w-9 object-cover rounded-lg bg-gray-50 border shrink-0" referrerPolicy="no-referrer" />
                          <div className="truncate max-w-[190px]">
                            <strong className="text-gray-800 font-bold text-[11px] block truncate">{p.title}</strong>
                            <span className="text-[10px] text-gray-400 block truncate font-medium">খামারি: {p.farmerName} • ID: {p.id}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 capitalize">{p.category}</td>
                        <td className="px-4 py-2.5 text-center font-mono">
                          {p.discountPrice ? (
                            <div>
                              <strong className="text-emerald-700">৳{p.discountPrice}</strong>
                              <span className="text-[9px] text-gray-400 line-through block">৳{p.price}</span>
                            </div>
                          ) : (
                            <strong className="text-gray-700">৳{p.price}</strong>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center text-gray-600 font-bold font-mono">{p.stock}</td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={() => editProduct(p.id, { isFeatured: !p.isFeatured })}
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border cursor-pointer ${
                              p.isFeatured ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-400 border-gray-150'
                            }`}
                          >
                            {p.isFeatured ? '★ Featured Spotlight' : '☆ Ordinary'}
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={() => editProduct(p.id, { isVerified: !p.isVerified })}
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border cursor-pointer ${
                              p.isVerified ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-400 border-gray-150'
                            }`}
                          >
                            {p.isVerified ? '✔ Verified' : '❌ No'}
                          </button>
                        </td>
                        <td className="px-4 py-2.5 text-right font-sans">
                          <div className="flex justify-end gap-1 font-sans">
                            <button
                              onClick={() => {
                                setAdminEditingProduct(p);
                                setAdminIsAddingProduct(false);
                                setAdminProdTitle(p.title);
                                setAdminProdPrice(p.price);
                                setAdminProdDiscountPrice(p.discountPrice ? String(p.discountPrice) : '');
                                setAdminProdCategory(p.category);
                                setAdminProdDesc(p.description);
                                setAdminProdStock(p.stock);
                                setAdminProdReadyToCook(p.isReadyToCook);
                                setAdminProdImages(p.images);
                                setAdminProdFarmerId(p.farmerId);
                                setAdminProdIsFeatured(!!p.isFeatured);
                                setAdminProdIsVerified(p.isVerified);
                                window.scrollTo({ top: 180, behavior: 'smooth' });
                              }}
                              className="px-2 py-1 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded text-[10px] font-bold cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove product catalog item "${p.title}"?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="px-2 py-1 border border-gray-200 hover:bg-red-50 text-red-500 rounded text-[10px] font-bold cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES LIST & ADD/EDIT CMS */}
          {adminActiveTab === 'categories' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm font-sans">
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-gray-800 uppercase flex items-center gap-1 font-bold">
                      📁 সক্রিয় শ্রেণীবিভাগ নিয়ন্ত্রণ অঞ্চল (Categories CMS)
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">গ্রাহক মডিউলে সরাসরি দৃশ্যমান ক্যাটাগরি ফিল্টারসমূহ।</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    {categories.map((cat) => (
                      <div key={cat.id} className="border border-gray-100 rounded-2xl p-4.5 bg-gray-50/20 flex items-center justify-between shadow-xs hover:shadow-md transition-all font-sans">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-700 border flex items-center justify-center font-black">
                            {cat.icon === 'Apple' ? '🍏' : cat.icon === 'Leaf' ? '🌿' : cat.icon === 'Wheat' ? '🌾' : '📁'}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-gray-800 leading-none">{cat.nameBn}</h4>
                            <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase block mt-1">{cat.nameEn}</span>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingCategory(cat);
                              setCategoryFormId(cat.id);
                              setCategoryFormNameBn(cat.nameBn);
                              setCategoryFormNameEn(cat.nameEn);
                              setCategoryFormIcon(cat.icon);
                            }}
                            className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-[10px] font-bold cursor-pointer hover:bg-blue-105"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (categories.length <= 1) {
                                alert('At least one catalog category must remain active!');
                                return;
                              }
                              if (confirm(`Absolutely remove category "${cat.nameBn}"?`)) {
                                saveCategories(categories.filter(c => c.id !== cat.id));
                              }
                            }}
                            className="bg-red-50 text-red-500 border border-red-100 px-2 py-1 rounded text-[10px] font-bold cursor-pointer hover:bg-red-105"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Category creator column */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-105 p-6 shadow-md space-y-4 font-sans">
                  <div>
                    <span className="text-[10px] font-bold text-orange-650 uppercase tracking-widest font-mono">Category Creator</span>
                    <h3 className="text-sm font-bold text-gray-800 mt-1">
                      {editingCategory ? `শ্রেণী সংশোধন: ${editingCategory.nameBn}` : 'নতুন ক্যাটালগ ক্যাটাগরি তৈরি'}
                    </h3>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-gray-650 mb-1">ক্যাটাগরি আইডি (Unique slug):</label>
                      <input 
                        type="text"
                        value={categoryFormId}
                        disabled={!!editingCategory}
                        onChange={(e) => setCategoryFormId(e.target.value)}
                        placeholder="যেমন: organic_honey"
                        className="w-full rounded-xl border border-gray-200 p-2 text-xs font-mono disabled:opacity-55"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-650 mb-1">বাংলা শিরোনাম (Bengali Name):</label>
                      <input 
                        type="text"
                        value={categoryFormNameBn}
                        onChange={(e) => setCategoryFormNameBn(e.target.value)}
                        placeholder="অরগানিক মধু"
                        className="w-full rounded-xl border border-gray-200 p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-655 mb-11">ইংরেজি শিরোনাম (English Name):</label>
                      <input 
                        type="text"
                        value={categoryFormNameEn}
                        onChange={(e) => setCategoryFormNameEn(e.target.value)}
                        placeholder="Organic Honey"
                        className="w-full rounded-xl border border-gray-200 p-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-655 mb-1">আইকন টাইপ নির্দেশনা (Lucene Preset):</label>
                      <select
                        value={categoryFormIcon}
                        onChange={(e) => setCategoryFormIcon(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 p-2 text-xs bg-white font-bold"
                      >
                        <option value="Leaf">Leaf (অরগানিক পাতা)</option>
                        <option value="Apple">Apple (তাজা ফলমূল)</option>
                        <option value="Beef">Beef (মাংস সামগ্রী)</option>
                        <option value="Fish">Fish (নদী ফিশারি)</option>
                        <option value="Sparkles">Sparkles (প্রিমিয়াম সিলেকশন)</option>
                        <option value="Wheat">Wheat (শস্য ও চাল)</option>
                        <option value="Milk">Milk (মিষ্টি দুগ্ধ)</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-1 font-sans">
                      {editingCategory && (
                        <button
                          onClick={() => {
                            setEditingCategory(null);
                            setCategoryFormId('');
                            setCategoryFormNameBn('');
                            setCategoryFormNameEn('');
                            setCategoryFormIcon('Leaf');
                          }}
                          className="w-1/3 py-2 border rounded-xl hover:bg-gray-50 text-[10px] font-bold text-gray-500 cursor-pointer"
                        >
                          বাতিল
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (!categoryFormId || !categoryFormNameBn || !categoryFormNameEn) return;
                          const payload: Category = {
                            id: categoryFormId.trim().toLowerCase(),
                            nameBn: categoryFormNameBn.trim(),
                            nameEn: categoryFormNameEn.trim(),
                            icon: categoryFormIcon
                          };

                          if (editingCategory) {
                            saveCategories(categories.map(c => c.id === editingCategory.id ? payload : c));
                          } else {
                            if (categories.some(c => c.id === payload.id)) {
                              alert('Category code exists already!');
                              return;
                            }
                            saveCategories([...categories, payload]);
                          }

                          setEditingCategory(null);
                          setCategoryFormId('');
                          setCategoryFormNameBn('');
                          setCategoryFormNameEn('');
                        }}
                        className="flex-1 py-11 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold shadow-sm cursor-pointer"
                      >
                        ক্যাটাগরি পরিবর্তন সংরক্ষণ ✔
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HERO SLIDER CAROUSEL COPYWRITING CMS */}
          {adminActiveTab === 'banners' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm font-sans">
                  <h3 className="text-xs sm:text-sm font-black text-gray-800 uppercase flex items-center gap-1.5 mb-4 font-bold">
                    🎠 হোমপেজ ক্যারোসল ব্যানার বিজ্ঞাপন ও স্লোগান এডিটর
                  </h3>
                  
                  <div className="space-y-4">
                    {banners.map((slide, idx) => (
                      <div key={idx} className="border border-gray-100 rounded-2xl p-4 bg-white flex flex-col md:flex-row gap-4 hover:shadow transition-all justify-between items-start md:items-center">
                        <div className="flex gap-3 items-start">
                          <img src={slide.image} className="h-14 w-24 object-cover rounded-xl border border-gray-100 flex-shrink-0 bg-slate-100" referrerPolicy="no-referrer" />
                          <div className="space-y-0.5">
                            <span className="inline-block font-mono text-[8px] bg-slate-50 border px-1.5 py-0.2 rounded text-emerald-700">স্লাইড নং: {idx + 1}</span>
                            <h4 className="text-xs font-bold text-gray-800 leading-tight">{slide.titleBn}</h4>
                            <p className="text-[10px] text-gray-400 line-clamp-1">{slide.subtitleBn}</p>
                          </div>
                        </div>

                        <div className="flex gap-1.5 self-end md:self-auto font-sans">
                          <button
                            onClick={() => {
                              setEditingBannerIndex(idx);
                              setBannerFormImage(slide.image);
                              setBannerFormTitleBn(slide.titleBn);
                              setBannerFormTitleEn(slide.titleEn);
                              setBannerFormSubtitleBn(slide.subtitleBn);
                              setBannerFormSubtitleEn(slide.subtitleEn);
                            }}
                            className="text-[10px] p-1.5 px-3 border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-150 text-indigo-700 rounded-lg shrink-0 cursor-pointer font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (banners.length <= 1) {
                                alert('Home layout requires at least one dynamic banner image!');
                                return;
                              }
                              if (confirm(`Remove dynamic sliders ${idx + 1}?`)) {
                                saveBanners(banners.filter((_, i) => i !== idx));
                              }
                            }}
                            className="text-[10px] p-1.5 px-2 bg-red-50 text-red-550 border border-red-105 rounded-lg shrink-0 cursor-pointer font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slider Editor box */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-md space-y-4 font-sans">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-mono">Banners Copy CMS</span>
                    <h3 className="text-sm font-bold text-gray-800 mt-1">
                      {editingBannerIndex !== null ? `স্লাইড নং-${editingBannerIndex + 1} পরিবর্তন করুন` : 'নতুন ব্যানার স্লাইড সংযুক্তি'}
                    </h3>
                  </div>

                  <div className="space-y-3 px-0.5 text-xs">
                    <div>
                      <label className="block font-bold text-gray-655 mb-1">পটভূমি ছবির লিঙ্ক (Web Img URL):</label>
                      <input 
                        type="text"
                        value={bannerFormImage}
                        onChange={(e) => setBannerFormImage(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full rounded-xl border border-gray-200 p-2 text-[10px] font-mono text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-655 mb-1">বাংলা স্লাইড স্লোগান (Bengali Title):</label>
                      <input 
                        type="text"
                        value={bannerFormTitleBn}
                        onChange={(e) => setBannerFormTitleBn(e.target.value)}
                        placeholder="তাজা রাসায়নিক মুক্ত শাকসবজি"
                        className="w-full rounded-xl border border-gray-200 p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-655 mb-1">ইংরেজি স্লাইড স্লোগান (English Title):</label>
                      <input 
                        type="text"
                        value={bannerFormTitleEn}
                        onChange={(e) => setBannerFormTitleEn(e.target.value)}
                        placeholder="Fresh Organic Vegetables"
                        className="w-full rounded-xl border border-gray-200 p-2 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-655 mb-1">বাংলা ছোট স্লোগান (Bengali Subtitle):</label>
                      <textarea 
                        rows={2}
                        value={bannerFormSubtitleBn}
                        onChange={(e) => setBannerFormSubtitleBn(e.target.value)}
                        placeholder="সরাসরি খামারের মাটি কেটে ডোরস্টেপে নিশ্চিত নিরাপদ খাদ্য..."
                        className="w-full rounded-xl border border-gray-200 p-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-655 mb-1">ইংরেজি ছোট স্লোগান (English Subtitle):</label>
                      <textarea 
                        rows={2}
                        value={bannerFormSubtitleEn}
                        onChange={(e) => setBannerFormSubtitleEn(e.target.value)}
                        placeholder="Farm fresh organic items delivered safely to your home..."
                        className="w-full rounded-xl border border-gray-200 p-2 font-mono"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      {editingBannerIndex !== null && (
                        <button
                          onClick={() => {
                            setEditingBannerIndex(null);
                            setBannerFormImage('');
                            setBannerFormTitleBn('');
                            setBannerFormTitleEn('');
                            setBannerFormSubtitleBn('');
                            setBannerFormSubtitleEn('');
                          }}
                          className="w-1/3 py-2 border rounded-xl hover:bg-gray-100 text-[10px] font-bold text-gray-500 cursor-pointer text-center"
                        >
                          বাতিল
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (!bannerFormTitleBn || !bannerFormImage) return;
                          const bannerPayload: Banner = {
                            image: bannerFormImage,
                            titleBn: bannerFormTitleBn,
                            titleEn: bannerFormTitleEn,
                            subtitleBn: bannerFormSubtitleBn,
                            subtitleEn: bannerFormSubtitleEn
                          };

                          if (editingBannerIndex !== null) {
                            const copyB = [...banners];
                            copyB[editingBannerIndex] = bannerPayload;
                            saveBanners(copyB);
                          } else {
                            saveBanners([...banners, bannerPayload]);
                          }

                          setEditingBannerIndex(null);
                          setBannerFormImage('');
                          setBannerFormTitleBn('');
                          setBannerFormTitleEn('');
                          setBannerFormSubtitleBn('');
                          setBannerFormSubtitleEn('');
                        }}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm cursor-pointer text-center"
                      >
                        হোমপেজ স্লাইডার সেভ করুন ✔
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACTIVE CUSTOMER REVIEWS & FEEDBACK SEEDER */}
          {adminActiveTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm font-sans space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-gray-800 uppercase font-bold">💬 মার্কেটপ্লেস অরগানিক কাস্টমার রিভিউ ও কমেন্টস</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">গ্রাহকদের দেওয়া ইতিবাচক ও নির্ভরযোগ্য রিভিউ সামগ্রীর তালিকা।</p>
                  </div>

                  <div className="space-y-4 font-sans">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="border border-gray-100 rounded-2xl p-4.5 bg-gray-50/10 space-y-2.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center shrink-0 uppercase text-xs">
                              {rev.customerName.slice(0, 2)}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5 flex-wrap">
                                {rev.customerName}
                                {rev.isVerifiedPurchase && (
                                  <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-1 py-0.2 rounded inline-block">ভেরিফাইড ক্রেতা</span>
                                )}
                              </h4>
                              <span className="text-[10px] text-gray-405 font-mono">{rev.location}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (confirm(`Remove this feedback review?`)) {
                                deleteReview(rev.id);
                              }
                            }}
                            className="px-2 py-0.5 text-[10px] text-red-500 bg-red-50 border border-red-100 rounded-lg cursor-pointer font-bold"
                          >
                            Delete
                          </button>
                        </div>

                        <div className="space-y-1 bg-white p-3 rounded-xl border border-gray-100 text-xs">
                          <span className="font-bold text-indigo-700 block">পণ্য শিরোনাম: {rev.productName}</span>
                          <div className="flex gap-0.5 text-amber-500 py-0.5">
                            {Array.from({ length: rev.rating }).map((_, s) => (
                              <Star key={s} className="h-3 w-3 fill-amber-500 text-amber-500" />
                            ))}
                          </div>
                          <p className="text-[11px] text-gray-600 italic">"{rev.comment}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seeding Synthetic Organic customer review widgets */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-indigo-150 p-6 shadow-md space-y-4 font-sans">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest font-mono">Verified Purchase Seeder</span>
                    <h3 className="text-sm font-bold text-gray-800 mt-1 font-bold">নতুন অরগানিক রিভিউ সীডার</h3>
                    <p className="text-[9px] text-gray-400">মার্কেটপ্লেসের বিভিন্ন পণ্যে গ্রাহকের আস্থা বাড়াতে দ্রুত কাস্টম রিভিউ ও ফাইভ স্টার রেটিং সেভ করুন।</p>
                  </div>

                  <div className="space-y-3 px-0.5 text-xs">
                    <div>
                      <label className="block font-bold text-gray-650 mb-1">পণ্য পছন্দ করুন (Target Product):</label>
                      <select
                        value={feedbackProdName}
                        onChange={(e) => setFeedbackProdName(e.target.value)}
                        className="w-full rounded-xl border border-gray-205 p-2 bg-white font-bold"
                      >
                        <option value="">-- পণ্য পছন্দ করুন --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.title}>{p.title.slice(0, 32)}...</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-gray-655 mb-1">ক্রেতার নাম:</label>
                        <input 
                          type="text"
                          value={feedbackCustomerName}
                          onChange={(e) => setFeedbackCustomerName(e.target.value)}
                          placeholder="ফারহানা পারভীন"
                          className="w-full rounded-xl border border-gray-200 p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-655 mb-1">জেলা / শহর:</label>
                        <input 
                          type="text"
                          value={feedbackLocation}
                          onChange={(e) => setFeedbackLocation(e.target.value)}
                          placeholder="মতিঝিল, ঢাকা"
                          className="w-full rounded-xl border border-gray-200 p-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-655 mb-1">রেটিং স্টার লেজার:</label>
                      <select
                        value={feedbackRating}
                        onChange={(e) => setFeedbackRating(Number(e.target.value))}
                        className="w-full bg-white rounded-xl border p-2 font-mono font-bold"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ ৫ স্টার (উৎকৃষ্টতম)</option>
                        <option value={4}>⭐⭐⭐⭐ ৪ স্টার (খুব ভালো)</option>
                        <option value={3}>⭐⭐⭐ ৩ স্টার (মোটামুটি)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-655 mb-1 font-sans">রিভিউ মন্তব্য (Review text):</label>
                      <textarea 
                        rows={2}
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="খুবই সুস্বাদু ও ভেজালহীন অরিজিনাল ফসল। চমৎকার ও সৎ ব্যবহারের জন্য কৃষক ভাইকে ধন্যবাদ।"
                        className="w-full rounded-xl border border-gray-200 p-2"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (!feedbackProdName || !feedbackComment) {
                          alert('Please select product and key in review feedback.');
                          return;
                        }

                        addReview({
                          customerName: feedbackCustomerName || 'তাসনিম চৌধুরী',
                          avatar: 'F',
                          rating: Number(feedbackRating),
                          comment: feedbackComment,
                          productName: feedbackProdName,
                          location: feedbackLocation || 'মতিঝিল, ঢাকা'
                        });

                        setFeedbackComment('');
                        setFeedbackCustomerName('');
                        setFeedbackLocation('');
                        alert('Synthetic organic customer feedback verified generated!');
                      }}
                      className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 rounded-xl text-white font-bold text-[10px] shadow shadow-md cursor-pointer text-center"
                    >
                      রিভিউ পোস্টিং নিশ্চিত করুন ✔
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ORDERS REAL-TIME TRACKING AND WITHDRAWAL REVIEW */}
          {adminActiveTab === 'orders' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Wallet withdrawals */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wider block mb-4 flex items-center gap-1 font-bold">
                    <Coins className="h-4 w-4 text-emerald-600" />
                    খামারি অংশীদারদের টাকা উত্তোলন আবেদন মনিটর ({withdrawalRequests.filter(r => r.status === 'Pending').length})
                  </h2>

                  {withdrawalRequests.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl text-gray-400">
                      <p className="text-xs">উত্তোলনের জন্য সিস্টেমে নতুন কোনো টাকা তোলার রিকোয়েস্ট পেন্ডিং নেই।</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {withdrawalRequests.map((req) => (
                        <div key={req.id} className="border border-gray-150 rounded-2xl p-4 bg-white space-y-3 font-sans">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 flex-wrap gap-2">
                            <div>
                              <span className="text-xs font-black text-emerald-800 font-mono block">অনুরোধ আইডি: {req.id}</span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">কৃষক: {req.farmerName} • আইডি: {req.farmerId}</span>
                            </div>

                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border ${
                              req.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                              req.status === 'Pending' ? 'bg-amber-50 text-amber-705 border-amber-250 animate-pulse' :
                              'bg-red-50 text-red-750 border-red-200'
                            }`}>
                              {req.status === 'Paid' ? 'টাকা পরিশোধিত' : req.status === 'Pending' ? 'রিভিউ প্রসেসিং' : 'আবেদন বাতিল'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-[10px] text-gray-400 block font-bold uppercase">পেমেন্ট মেথড</span>
                              <strong className="text-gray-750 mt-1 block font-sans">{req.method}</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 block font-bold uppercase">অনুরোধকৃত অর্থ</span>
                              <strong className="text-emerald-750 text-sm mt-1 block font-mono">৳{req.amount} BDT</strong>
                            </div>
                          </div>

                          <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-[10.5px] text-gray-600 font-serif leading-relaxed">
                            <strong>মাধ্যম বিবরণ বা ব্যাংক তথ্য:</strong> {req.details}
                          </div>

                          {req.status === 'Pending' && (
                            <div className="flex justify-end gap-2 pt-1 font-sans">
                              <button
                                onClick={() => updateWithdrawallStatus(req.id, 'Rejected')}
                                className="px-3.5 py-1.5 text-[10px] font-bold text-red-650 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer border border-red-200"
                              >
                                অনুরোধ বাতিল করুন
                              </button>
                              <button
                                onClick={() => updateWithdrawallStatus(req.id, 'Paid')}
                                className="px-4 py-1.5 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer shadow-sm"
                              >
                                ৳ পরিশোধ নিশ্চিত করুন ✔
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right panel orders monitoring */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h2 className="text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wider block mb-4">অর্ডার ডেলিভারি মনিটর ও স্থিতি পরিবর্তন</h2>
                  
                  <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-2xl p-4 bg-white space-y-3 shadow-xs font-sans">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-xs font-black text-emerald-800 font-mono">{order.id}</span>
                          <span className="text-[10.5px] font-black text-indigo-700 font-mono">৳{order.totalPrice} BDT</span>
                        </div>

                        <div className="space-y-1 text-[10px] sm:text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 leading-normal">
                          <span className="block font-bold text-gray-700">ক্রেতা: {order.customerName}</span>
                          <span className="block font-mono text-gray-400">মোবাইল: {order.customerPhone}</span>
                          <span className="block text-gray-500">গন্তব্য: {order.customerAddress}</span>
                          <span className="block text-[10px] text-gray-400 border-t border-gray-100 pt-1 mt-1 font-mono">আইটেম: {order.products.map(item => `${item.title} (x${item.quantity})`).join(', ')}</span>
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1 leading-none">ডেলিভারি স্থিতি:</label>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="w-full text-xs font-bold font-sans rounded-xl border border-gray-200 py-1.5 px-2 bg-gray-50 focus:bg-white cursor-pointer"
                          >
                            <option value="Pending">⏱ Pending (পেন্ডিং)</option>
                            <option value="Processing">🌿 Processing (প্রসেসিং)</option>
                            <option value="Packed">📦 Packed (প্যাকেজড)</option>
                            <option value="Shipped">🚴 Shipped (শিপড)</option>
                            <option value="Delivered">✔ Delivered (ডেলিভারড)</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
