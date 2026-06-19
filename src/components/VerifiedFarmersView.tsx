import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { cleanImageUrl } from '../utils';
import { Farmer, User } from '../types';
import { MapPin, Phone, UserCheck, ShieldAlert, Award, Search, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface VerifiedFarmersViewProps {
  onBack: () => void;
  onSelectFarmer: (farmerId: string) => void;
  onOpenSubscription: (role: 'customer' | 'farmer') => void;
}

export const VerifiedFarmersView: React.FC<VerifiedFarmersViewProps> = ({
  onBack,
  onSelectFarmer,
  onOpenSubscription,
}) => {
  const { farmers, currentUser, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  const isPremiumUser = currentUser && 
    currentUser.subscriptionStatus && 
    currentUser.subscriptionStatus !== 'none';

  // Available districts
  const districts = ['all', 'Rajshahi', 'Jessore', 'Rangpur', 'Bogra', 'Sylhet', 'Comilla', 'Dinajpur', 'Barisal', 'Gazipur'];

  const getDistrictNameBn = (d: string) => {
    switch(d) {
      case 'all': return 'সব জেলা';
      case 'Rajshahi': return 'রাজশাহী';
      case 'Jessore': return 'যশোর';
      case 'Rangpur': return 'রংপুর';
      case 'Bogra': return 'বগুড়া';
      case 'Sylhet': return 'সিলেট';
      case 'Comilla': return 'কুমিল্লা';
      case 'Dinajpur': return 'দিনাজপুর';
      case 'Barisal': return 'বরিশাল';
      case 'Gazipur': return 'গাজীপুর';
      default: return d;
    }
  };

  const toBanglaDigits = (num: number | string): string => {
    const banglaNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (digit) => banglaNumbers[parseInt(digit)]);
  };

  const filteredFarmers = farmers.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (f.bio && f.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (f.address && f.address.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDistrict = selectedDistrict === 'all' || f.district === selectedDistrict;
    return matchesSearch && matchesDistrict && f.verified && f.isActive !== false && f.status !== 'Blocked';
  });

  const sortedFarmers = [...filteredFarmers].sort((a, b) => {
    const realIds = ['f70', 'f71', 'f72', 'f73', 'f74'];
    const idxA = realIds.indexOf(a.id);
    const idxB = realIds.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-8 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-6">
          <button onClick={onBack} className="hover:text-emerald-600 transition-colors cursor-pointer flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> {language === 'en' ? 'Back to Home' : 'হোমপেজে ফিরুন'}
          </button>
          <span>/</span>
          <span className="text-gray-800 font-bold">{language === 'en' ? 'Verified Farmers' : 'আমাদের বিশ্বস্ত কৃষকসমাজ'}</span>
        </div>

        {/* Dynamic Premium Subscription Banner */}
        {!isPremiumUser ? (
          <div className="mb-8 rounded-3xl relative overflow-hidden bg-gradient-to-r from-emerald-800 via-emerald-950 to-green-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/50">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none">
              <Award className="h-48 w-48" />
            </div>
            <div className="relative max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-400 text-emerald-950 shadow-md">
                👑 {language === 'en' ? 'Krishok Bazar Premium' : 'প্রিমিয়াম মেম্বারশিপ অ্যাক্সেস'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
                {language === 'en' 
                  ? 'Unlock Direct Phone Calls and Addresses of Our Partner Farmers!' 
                  : 'কৃষকদের মোবাইল নাম্বার এবং সরাসরি যোগাযোগের ঠিকানা দেখতে চান?'}
              </h2>
              <p className="text-xs text-emerald-100 leading-relaxed font-sans">
                {language === 'en'
                  ? 'To stop middleman corruption, direct communication details (phone calls, maps location, picture profiles) are available exclusively to our Premium members. Subscribe today to contact farmers directly!'
                  : 'মধ্যস্বত্বভোগীদের আড়াল করে সরাসরি কৃষকদের ফোন করতে এবং তাদের বাড়িতে গিয়ে ফ্রেশ ফলন আনতে আমাদের প্রিমিয়াম সাবস্ক্রিপশন গ্রহণ করুন। আজই যুক্ত হোন আমাদের সম্মানিত পরিবারের সাথে!'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onOpenSubscription('customer')}
                  className="rounded-xl px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-emerald-950 font-black text-xs active:scale-98 transition-all cursor-pointer shadow-lg inline-flex items-center gap-1.5"
                >
                  {language === 'en' ? 'Unlock Full Profiles Now' : 'সম্পূর্ণ প্রোফাইল আনলক করুন 🔑'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex gap-3 items-center">
            <span className="text-xl">🏆</span>
            <div>
              <p className="text-xs font-black">
                {language === 'en' ? 'Premium Subscriber Active' : 'অভিনন্দন! আপনার গোল্ডেন প্রিমিয়াম প্যাকেজটি সচল রয়েছে।'}
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {language === 'en' ? 'You have full broker-free access to all partner phone numbers!' : 'আপনি সরাসরি কৃষকের ফোন নম্বর ও সঠিক ডেলিভারি ঠিকানা দেখতে পাচ্ছেন। দালাল ছাড়া নিরাপদ কেনাকাটা করুন!'}
              </p>
            </div>
          </div>
        )}

        {/* Directory Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 font-sans tracking-tight">
            {language === 'en' ? 'Agricultural Market Broker-Free' : 'আমাদের ভেরিফাইড কৃষক তালিকা'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {language === 'en'
              ? 'Browse certified organic farmers of Bangladesh and shop with zero margins.'
              : 'যশোর, রাজশাহী ও বগুড়ার তৃণমূলের পরিশ্রমী ভেরিফাইড সাধারণ ও নারী খামারি যারা সরাসরি তাদের সেরা ফলন বাজারজাত করছেন।'}
          </p>
        </div>

        {/* Search and District Filter Controls */}
        <div className="bg-white rounded-2xl border border-gray-150 p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
          {/* Search bar */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'en' ? 'Search by name or crops...' : 'কৃষকের নাম অথবা ফসলের নাম লিখে খুঁজুন...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-gray-750 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* District selector */}
          <div className="w-full md:w-64 flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 shrink-0 select-none">📍 {language === 'en' ? 'District:' : 'জেলা:'}</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3.5 text-xs font-semibold text-gray-750 outline-none focus:border-emerald-500 focus:bg-white transition-all"
            >
              {districts.map(d => (
                <option key={d} value={d}>
                  {language === 'en' ? (d === 'all' ? 'All Districts' : d) : getDistrictNameBn(d)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Farmer Grid List */}
        {sortedFarmers.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-150 shadow-sm flex flex-col items-center justify-center p-8 gap-3">
            <ShieldAlert className="h-12 w-12 text-emerald-600 animate-bounce" />
            <p className="text-sm font-black text-gray-800">
              {language === 'en' ? 'No Verified Farmers Found' : 'এই অঞ্চল বা ফিল্টারে নির্ভরযোগ্য কোনো কৃষক পাওয়া যায়নি।'}
            </p>
            <p className="text-xs text-gray-400 max-w-sm">
              {language === 'en' ? 'Try changing your search terms or choosing a different district.' : 'অনুগ্রহ করে সার্চ বানান পরিবর্তন করুন অথবা অন্য কোনো জেলা নির্বাচন করে চেষ্টা করুন।'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFarmers.map((farmer) => {
              const MALE_AVATAR = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=60';
              const FEMALE_AVATAR = 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=150&auto=format&fit=crop&q=60';
              const rawAvatar = farmer.avatar && farmer.avatar.startsWith('http') 
                ? farmer.avatar 
                : (farmer.gender === 'female' ? FEMALE_AVATAR : MALE_AVATAR);
              const avatarUrl = cleanImageUrl(rawAvatar);

              const realIds = ['f70', 'f71', 'f72', 'f73', 'f74'];
              const realIdx = realIds.indexOf(farmer.id);
              const displayName = realIdx !== -1 
                ? `${language === 'en' ? realIdx + 1 : toBanglaDigits(realIdx + 1)}. ${farmer.name}` 
                : farmer.name;
              const isRealFive = realIdx !== -1;

              return (
                <div 
                  key={farmer.id}
                  className={`rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col pt-5 ${
                    isRealFive 
                      ? 'border-emerald-300 ring-2 ring-emerald-50 bg-gradient-to-b from-emerald-50/10 to-white' 
                      : 'border-gray-150/60 hover:border-emerald-200'
                  }`}
                >
                  <div className="flex px-5 gap-4 items-start pb-4">
                    {/* Picture Profile */}
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full overflow-hidden border-2 ${
                      isRealFive ? 'border-emerald-300 shadow-md ring-4 ring-emerald-100' : 'border-emerald-100'
                    }`}>
                      <img 
                        src={avatarUrl} 
                        alt={farmer.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 bg-emerald-600 text-white p-0.5 rounded-full scale-75 border border-white font-sans text-[10px]">✔</span>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm sm:text-base font-black text-gray-900 hover:text-emerald-700 transition-colors cursor-pointer leading-tight">
                          {displayName}
                        </h3>
                        {isRealFive && (
                          <span className="inline-flex gap-0.5 px-2 py-0.5 text-[9px] font-black rounded-full bg-yellow-400 text-emerald-950 border border-yellow-300 uppercase shadow-xs">
                            {language === 'en' ? 'Direct Partner' : 'প্রধান অংশীদার'}
                          </span>
                        )}
                        {!isRealFive && (
                          <span className="inline-flex gap-0.5 px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                            {farmer.verified ? (language === 'en' ? 'Verified' : 'ভেরিফাইড') : (language === 'en' ? 'Pending' : 'অপেক্ষমান')}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 font-extrabold font-sans flex items-center gap-1">
                        📍 {language === 'en' ? `${farmer.district} District` : `${getDistrictNameBn(farmer.district)} জেলা`}
                        {isRealFive && (
                          <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                            {language === 'en' ? 'Dakshin Khara Char' : 'দক্ষিণ খড়া চর'}
                          </span>
                        )}
                      </p>
                      
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 pt-1 font-bold flex-wrap">
                        <span>{language === 'en' ? `Sales: ${farmer.salesCount || 0}` : `সফল বিক্রি: ${farmer.salesCount || 0}টি`}</span>
                        <span className="text-gray-300">•</span>
                        <span>{language === 'en' ? `Crops: ${farmer.productCount || 0}` : `পণ্য সংখ্যা: ${farmer.productCount || 0}টি`}</span>
                        {farmer.landSize && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-indigo-600">জমির আকার: {farmer.landSize}</span>
                          </>
                        )}
                        {farmer.salesAmount && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-emerald-700">মোট বিক্রয়: ৳{farmer.salesAmount}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio statement */}
                  <div className="px-5 pb-4 flex-1">
                    <p className="text-[11px] leading-relaxed text-gray-500 font-sans italic line-clamp-3">
                      "{farmer.story || farmer.bio || (language === 'en' ? 'Vetted bio under premium quality supervision of Agricultural center.' : 'কৃষক বাজার গুণমান যাচাই টিম দ্বারা অনুমোদিত ও সতেজ ফসল বাজারজাতকারী বিশ্বস্ত সবুজ খামারি।')}"
                    </p>
                  </div>

                  {/* Direct Contact Drawer Security Guards */}
                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 space-y-3">
                    <div className="space-y-2">
                      {/* PHONE Call security */}
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                          {language === 'en' ? 'Mobile Number:' : 'মোবাইল নাম্বার:'}
                        </span>
                        {isPremiumUser ? (
                          <a href={`tel:${farmer.phone}`} className="font-extrabold text-emerald-700 hover:underline">
                            {farmer.phone}
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-red-50 text-red-700 font-black px-2 py-0.5 rounded border border-red-100">
                            <EyeOff className="h-3 w-3" />
                            {language === 'en' ? 'LOCKED' : 'সুরক্ষিত/লক'}
                          </span>
                        )}
                      </div>

                      {/* ADDRESS security */}
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-gray-400 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          {language === 'en' ? 'Farm Address:' : 'খামারের ঠিকানা:'}
                        </span>
                        {isPremiumUser ? (
                          <span className="font-semibold text-gray-700 text-right max-w-[160px] truncate">
                            {farmer.address}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-red-50 text-red-700 font-black px-2 py-0.5 rounded border border-red-100">
                            <EyeOff className="h-3 w-3" />
                            {language === 'en' ? 'LOCKED' : 'সুরক্ষিত/লক'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/50">
                      <button
                        onClick={() => onSelectFarmer(farmer.id)}
                        className="rounded-xl py-2 px-3 bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50 text-xs font-black cursor-pointer shadow-xs text-center flex items-center justify-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {language === 'en' ? 'Shop Store' : 'স্টোর দেখুন'}
                      </button>

                      {isPremiumUser ? (
                        <a
                          href={`tel:${farmer.phone}`}
                          className="rounded-xl py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer shadow-sm text-center flex items-center justify-center gap-1"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {language === 'en' ? 'Call Direct' : 'সরাসরি কল'}
                        </a>
                      ) : (
                        <button
                          onClick={() => onOpenSubscription('customer')}
                          className="rounded-xl py-2 px-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-emerald-950 text-xs font-bold cursor-pointer shadow-sm text-center flex items-center justify-center gap-0.5"
                        >
                          🔑 {language === 'en' ? 'Unlock No' : 'আনলক করুন'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
