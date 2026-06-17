/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Search, ShoppingCart, User, LogOut, Menu, X, Landmark, CheckCircle, ChevronDown, UserCheck, WifiOff, Download, Bell, MapPin } from 'lucide-react';
import { FEMALE_AVATAR, MALE_AVATAR, KRISHOK_BAZAR_LOGO } from '../assets';

interface HeaderProps {
  onOpenAuth: () => void;
  onOpenCart: () => void;
  currentView: string;
  setView: (view: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenCart,
  currentView,
  setView,
  searchQuery,
  setSearchQuery
}) => {
  const { currentUser, logout, cart, language, toggleLanguage, harvestAlerts, dynamicPages } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(true);
  const [isPushEnabled, setIsPushEnabled] = useState(
    typeof window !== 'undefined' ? ('Notification' in window && Notification.permission === 'granted') : false
  );

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // PWA states and listeners
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleOpenMenu = () => setIsMainMenuOpen(true);
    window.addEventListener('open-main-menu', handleOpenMenu);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('open-main-menu', handleOpenMenu);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install: ${outcome}`);
      setDeferredPrompt(null);
    } else {
      // Direct APK download link as fallback when PWA prompt is not loaded/supported yet
      const link = document.createElement('a');
      link.href = 'https://cdn.shopify.com/s/files/1/0991/0717/6761/files/krishok_bazar_v1.apk?v=1779307577';
      link.setAttribute('download', 'krishok_bazar.apk');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleTriggerPushNotification = async () => {
    if (!('Notification' in window)) {
      alert('আপনার ব্রাউজারটি পুশ নোটিফিকেশন সমর্থন করে না।');
      return;
    }

    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission === 'granted') {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification('কৃষক বাজার (Krishok Bazar)', {
          body: 'সফলভাবে পুশ নোটিফিকেশন সক্রিয় করা হয়েছে! সতেজ অর্গানিক ফসলের নতুন অফার পান সাথে সাথেই।',
          icon: '/icon-192.svg',
          badge: '/icon-192.svg',
          vibrate: [200, 100, 200],
          data: { url: '/' }
        } as any);
      } else {
        new Notification('কৃষক বাজার (Krishok Bazar)', {
          body: 'সফলভাবে পুশ নোটিফিকেশন সক্রিয় করা হয়েছে!',
          icon: '/icon-192.svg'
        });
      }
    } else {
      alert('নোটিফিকেশন অনুমতি প্রত্যাখ্যান করা হয়েছে। দয়া করে ব্রাউজার সেটিংসে এটি সক্রিয় করুন।');
    }
  };

  const handleNavClick = (view: string) => {
    setView(view);
    setMobileMenuOpen(false);
    // Clear search when changing views to reset list
    if (view !== 'shop') setSearchQuery('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (currentView !== 'shop' && currentView !== 'ready-to-cook') {
      setView('shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-gray-100 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* LOGO & MARKETS SUBTITLE SECTION */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            {/* Circular brand logo */}
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-emerald-50 border border-emerald-500 overflow-hidden shrink-0">
              <img 
                src={KRISHOK_BAZAR_LOGO} 
                alt="Krishok Bazar premium avatar logo" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col select-none">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-sm sm:text-base font-black tracking-tight text-emerald-800 font-sans">
                  কৃষক বাজার
                </span>
                <span className="text-[10px] bg-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded-full shadow-xs shrink-0 font-sans">
                  ক্রেতা বাজার
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-emerald-600 font-black flex items-center gap-1 mt-1 leading-none font-sans">
                <span>দালাল মুক্ত</span>
                <span className="text-gray-300">•</span>
                <span>ঢাকা সিটিতে ডেলিভারি</span>
              </div>
            </div>
          </div>

          {/* LOCATION BADGE REQUISITE */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 shrink-0 select-none">
            <MapPin className="h-4 w-4 text-emerald-600 shrink-0 animate-pulse" />
            <span className="font-sans leading-none mt-0.5">ঢাকা জেলা (Dhaka Zone)</span>
          </div>

          {/* SEARCH COMPONENT */}
          <div className="flex flex-1 max-w-[110px] xs:max-w-[180px] sm:max-w-xs md:max-w-sm relative">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="খুঁজুন..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full rounded-xl border border-gray-200/80 bg-gray-50/50 py-2 pl-8 pr-3 text-[10px] sm:text-xs transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2.5 text-xs text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* NAVIGATION LINKS - DESKTOP */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-[12px] font-extrabold text-gray-600 shrink-0">
            <button 
              onClick={() => handleNavClick('home')}
              className={`hover:text-emerald-700 transition-colors cursor-pointer select-none ${currentView === 'home' ? 'text-emerald-750 border-b-2 border-emerald-600 pb-0.5' : ''}`}
            >
              {language === 'en' ? 'Home' : 'হোম'}
            </button>
            <button 
              onClick={() => handleNavClick('shop')}
              className={`hover:text-emerald-700 transition-colors cursor-pointer select-none ${currentView === 'shop' ? 'text-emerald-750 border-b-2 border-emerald-600 pb-0.5' : ''}`}
            >
              {language === 'en' ? 'All Products' : 'সব পণ্য'}
            </button>
            <button 
              onClick={() => handleNavClick('weekly-combos')}
              className={`hover:text-emerald-700 transition-colors cursor-pointer select-none ${currentView === 'weekly-combos' ? 'text-emerald-750 border-b-2 border-emerald-600 pb-0.5' : ''}`}
            >
              {language === 'en' ? 'Weekly Combos' : 'কম্বো বাস্কেট'}
            </button>
            <button 
              onClick={() => handleNavClick('weekly-discount')}
              className={`hover:text-emerald-700 transition-colors cursor-pointer select-none ${currentView === 'weekly-discount' ? 'text-emerald-750 border-b-2 border-emerald-600 pb-0.5' : ''}`}
            >
              {language === 'en' ? 'Weekly Discounts' : 'সাপ্তাহিক ছাড়'}
            </button>
            <button 
              onClick={() => handleNavClick('ready-to-cook')}
              className={`hover:text-emerald-700 transition-colors cursor-pointer select-none ${currentView === 'ready-to-cook' ? 'text-emerald-750 border-b-2 border-emerald-600 pb-0.5' : ''}`}
            >
              {language === 'en' ? 'Ready-to-Cook' : 'রেডি-টু-কুক'}
            </button>
            <button 
              onClick={() => handleNavClick('farmers')}
              className={`hover:text-emerald-700 transition-colors cursor-pointer select-none ${currentView === 'farmers' ? 'text-emerald-750 border-b-2 border-emerald-600 pb-0.5' : ''}`}
            >
              {language === 'en' ? 'Verified Farmers' : 'ভেরিফাইড কৃষক'}
            </button>
            <button 
              onClick={() => handleNavClick('blog')}
              className={`hover:text-emerald-700 transition-colors cursor-pointer select-none ${currentView === 'blog' ? 'text-emerald-750 border-b-2 border-emerald-600 pb-0.5' : ''}`}
            >
              {language === 'en' ? 'Blog' : 'ব্লগ'}
            </button>
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* OFFLINE MODE INDICATOR */}
            {isOffline && (
              <span className="inline-flex items-center gap-1 bg-red-50 border border-red-150 text-red-600 text-[10px] font-bold px-2 py-1 py-[3px] rounded-xl animate-pulse">
                <WifiOff className="h-3.5 w-3.5" /> অফলাইন
              </span>
            )}

            {/* NOTIFICATION INTERACTIVE BELL & DROPDOWN */}
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setHasUnreadAlerts(false);
                }}
                className={`relative rounded-2xl border p-2 transition-all cursor-pointer flex items-center justify-center ${notificationsOpen ? 'bg-amber-50 border-amber-300 text-amber-700 ring-2 ring-amber-100' : 'border-gray-100 text-gray-650 bg-gray-50/50 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'}`}
                title="সোনালী ফসলসংগ্রহ এলার্ট ও নোটিফিকেশন"
              >
                <Bell className={`h-4.5 w-4.5 ${hasUnreadAlerts && harvestAlerts?.length > 0 ? 'animate-bounce-subtle' : ''}`} />
                {hasUnreadAlerts && harvestAlerts?.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </button>
              
              {/* FLOATING DROPDOWN LIST */}
              {notificationsOpen && (
                <div 
                  className="absolute right-0 mt-3 w-80 sm:w-[420px] rounded-3xl bg-white border border-gray-150 shadow-2xl p-4 z-50 text-gray-800 animate-fadeIn"
                  style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)' }}
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs sm:text-[13px] text-gray-850">
                        {language === 'en' ? 'Seasonal Crop Alerts 🌾' : 'সোনালী ফসলসংগ্রহ এলার্ট 🌾'}
                      </span>
                      <span className="text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-full">
                        {harvestAlerts?.length || 0} Live
                      </span>
                    </div>
                    <button 
                      onClick={() => setNotificationsOpen(false)}
                      className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 p-1 transition cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Push Notification Toggle Button */}
                  <div className="bg-amber-50/50 rounded-2xl border border-amber-100/70 p-3 mb-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-amber-950 leading-snug">
                          {language === 'en' ? 'Live Harvest Push Alerts' : 'লাইভ ফসলসংগ্রহ পুশ বিজ্ঞপ্তি'}
                        </p>
                        <p className="text-[9px] text-amber-800/85 leading-normal mt-[2px]">
                          {language === 'en' ? 'Receive instant browser alerts when crops are harvested.' : 'কৃষক মাঠে ফসল কাটার সাথে সাথে তাৎক্ষণিক আপডেট পান।'}
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          await handleTriggerPushNotification();
                          setIsPushEnabled(typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer transition-all shrink-0 ${isPushEnabled ? 'bg-emerald-600 hover:bg-emerald-750 text-white shadow-3xs' : 'bg-amber-600 text-white hover:bg-amber-700 hover:scale-102 flex items-center gap-1'}`}
                      >
                        {isPushEnabled 
                          ? (language === 'en' ? '✓ Active' : '✓ সচল রয়েছে') 
                          : (language === 'en' ? 'Enable Now' : 'চালু করুন 🔔')
                        }
                      </button>
                    </div>
                  </div>

                  {/* List of Alerts */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-2.5">
                    {(!harvestAlerts || harvestAlerts.length === 0) ? (
                      <div className="text-center py-8 text-gray-400">
                        <Bell className="h-8 w-8 mx-auto stroke-1 mb-2 text-gray-300" />
                        <p className="text-xs font-bold">
                          {language === 'en' ? 'No active seasonal alerts.' : 'বর্তমানে কোনো সক্রিয় বিজ্ঞপ্তি নেই।'}
                        </p>
                      </div>
                    ) : (
                      harvestAlerts.map((alert) => {
                        const isJustHarvested = alert.statusEn === 'Just Harvested';
                        const isTomorrow = alert.statusEn === 'Harvesting Tomorrow';
                        
                        return (
                          <div key={alert.id} className="pt-2.5 first:pt-0 flex gap-3 items-start">
                            <div className="h-11 w-11 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-3xs">
                              <img 
                                src={alert.imageUrl} 
                                alt={alert.cropNameBn} 
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-full uppercase leading-none ${
                                  isJustHarvested 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : isTomorrow 
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' 
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}>
                                  {language === 'en' ? alert.statusEn : alert.statusBn}
                                </span>
                                <span className="text-[8.5px] text-gray-400 font-bold font-sans">
                                  {alert.harvestDate}
                                </span>
                              </div>
                              <h5 className="text-[11px] font-black text-gray-800 leading-tight mt-1 font-sans">
                                {language === 'en' ? alert.cropNameEn : alert.cropNameBn}
                              </h5>
                              <p className="text-[9.5px] text-gray-500 leading-normal mt-[2px] line-clamp-2">
                                {language === 'en' ? alert.descriptionEn : alert.descriptionBn}
                              </p>
                              
                              {/* Direct Crop link details and navigation */}
                              <div className="mt-1 bg-gray-50 p-1.5 rounded-xl flex items-center justify-between gap-2 border border-gray-100">
                                <span className="text-[8.5px] text-emerald-750 font-extrabold truncate">
                                  🚜 {alert.farmerName} ({language === 'en' ? alert.district : `${alert.district}`})
                                </span>
                                <button
                                  onClick={() => {
                                    setNotificationsOpen(false);
                                    setView('shop');
                                    // Extract first word of crop name to match in product search query
                                    const searchPhrase = (language === 'en' ? alert.cropNameEn : alert.cropNameBn).split(' ')[0];
                                    setSearchQuery(searchPhrase);
                                  }}
                                  className="text-[8.5px] font-black text-white hover:bg-emerald-750 bg-emerald-650 px-2 py-0.5 rounded-md transition cursor-pointer"
                                >
                                  {language === 'en' ? 'Buy Now' : 'কিনুন 🛍️'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-2.5 mt-2.5 text-center">
                    <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide">
                      {language === 'en' 
                        ? 'DAALAL-MUKT DIRECT AGRI ANNOUNCEMENTS' 
                        : 'দালাল-মুক্ত সরাসরি কৃষক বাজার নোটিফিকেশন সিস্টেম'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* SEARCH ICON FOR SCANNABLE MOBILE LAYOUT */}
            <button 
              onClick={() => handleNavClick('shop')}
              className="p-1.5 text-gray-500 hover:text-emerald-600 hidden"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* CART BUTTON WITH LIVE COUNT */}
            <button 
              onClick={onOpenCart}
              className="relative hidden md:flex rounded-2xl border border-gray-100 p-2 text-gray-650 bg-gray-50/50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all cursor-pointer"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-lg animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* PROFILE/LOGIN SECTION (HIDDEN ON MOBILE, HANDLED BY THE BOTTOM NAV BAR) */}
            <div className="hidden md:flex items-center gap-2">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 rounded-2xl border border-gray-150 p-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shrink-0 overflow-hidden text-xs">
                      {currentUser.role === 'Admin' ? (
                        'AD'
                      ) : currentUser.role === 'Farmer' ? (
                        <img src={currentUser.phone && currentUser.phone.includes('019') ? FEMALE_AVATAR : MALE_AVATAR} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        currentUser.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="hidden sm:inline max-w-[90px] truncate text-xs text-gray-800 font-sans">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                  </button>

                  {/* DROPDOWN MENU */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl bg-white p-2 shadow-2xl border border-gray-100 ring-1 ring-black/5 divide-y divide-gray-50 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
                      <div className="px-3 py-2.5 space-y-1">
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-gray-800 max-w-[140px] truncate">{currentUser.name}</p>
                          {currentUser.subscriptionStatus === 'silver' && (
                            <span className="text-yellow-500 text-[10px]" title="প্রিমিয়াম গ্রাহক">👑</span>
                          )}
                        </div>
                        <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-100">
                          {currentUser.role === 'Admin' ? '👤 পরিচালক' : currentUser.role === 'Farmer' ? '🌱 অংশীদার কৃষক' : '🛍️ সম্মানিত ক্রেতা'}
                        </span>
                        {currentUser.subscriptionStatus === 'silver' && (
                          <span className="block text-[9px] font-extrabold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 text-center uppercase">
                            ✔ ভেরিফাইড প্রিমিয়াম
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        {currentUser.role === 'Admin' && (
                          <button
                            onClick={() => { setProfileDropdownOpen(false); handleNavClick('admin'); }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                          >
                            <Landmark className="h-4 w-4" />
                            পরিচালনা প্যানেল
                          </button>
                        )}
                        
                        {currentUser.role === 'Farmer' && (
                          <button
                            onClick={() => { setProfileDropdownOpen(false); handleNavClick('farmer-dashboard'); }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            কৃষক ড্যাশবোর্ড
                          </button>
                        )}

                        {currentUser.role === 'Customer' && (
                          <button
                            onClick={() => { setProfileDropdownOpen(false); handleNavClick('customer-dashboard'); }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                          >
                            <UserCheck className="h-4 w-4" />
                            আমার ড্যাশবোর্ড
                          </button>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => { setProfileDropdownOpen(false); logout(); handleNavClick('home'); }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-650 hover:bg-red-50 rounded-lg transition-colors font-semibold"
                        >
                          <LogOut className="h-4 w-4" />
                          লগআউট (Logout)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-green-700 hover:shadow-lg transition-all cursor-pointer text-sans"
                >
                  <User className="h-3.5 w-3.5" />
                  লগইন (Login)
                </button>
              )}
            </div>

            {/* MAIN PERSISTENT CATEGORY DRAWER MENU BUTTON */}
            <button
              onClick={() => setIsMainMenuOpen(!isMainMenuOpen)}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black shadow-md cursor-pointer select-none transition-all active:scale-95 shrink-0 border border-amber-400"
              title="সবগুলো আলাদা সেকশনের ক্যাটাগরি মেনু"
            >
              🍔 <span className="font-sans font-black">{language === 'en' ? 'MENU' : 'মেনু'}</span>
            </button>

          </div>
        </div>
      </div>

      {/* 3. DIRECT ALL-IN-ONE GRID PAGES DIRECTORY (NO OVERLAY dropdown) */}
      {isMainMenuOpen && (
        <div className="bg-gradient-to-b from-emerald-50 to-green-50 border-b border-emerald-150 py-5 shadow-lg animate-fadeIn select-none font-sans">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
            
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
              <h4 className="text-xs font-black text-emerald-850 uppercase tracking-widest flex items-center gap-1.5">
                🍔 {language === 'en' ? 'ALL SHOPPING SECTIONS' : 'সবগুলো ডিরেক্টরি সেকশন ও পৃষ্ঠা'}
              </h4>
              <button 
                onClick={() => setIsMainMenuOpen(false)}
                className="rounded-full bg-emerald-200/50 hover:bg-emerald-200 text-emerald-800 p-1.5 cursor-pointer transition flex items-center justify-center"
                title="বন্ধ করুন"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              <button
                onClick={() => { handleNavClick('home'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'home' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' : 'bg-white text-emerald-850 border-emerald-100/70 hover:bg-emerald-100/40 hover:text-emerald-705'}`}
              >
                <span>🏠</span> <span>{language === 'en' ? 'Home' : 'হোম'}</span>
              </button>
              
              <button
                onClick={() => { handleNavClick('shop'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'shop' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' : 'bg-white text-emerald-850 border-emerald-100/70 hover:bg-emerald-100/40 hover:text-emerald-705'}`}
              >
                <span>🛍️</span> <span>{language === 'en' ? 'Store' : 'সব পণ্য (Store)'}</span>
              </button>

              <button
                onClick={() => { handleNavClick('weekly-combos'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'weekly-combos' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' : 'bg-white text-emerald-850 border-emerald-100/70 hover:bg-emerald-100/40 hover:text-emerald-705'}`}
              >
                <span>🧺</span> <span>{language === 'en' ? 'Budget Combos' : 'কম্বো বাস্কেট (Budget Combo)'}</span>
              </button>

              <button
                onClick={() => { handleNavClick('weekly-discount'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'weekly-discount' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' : 'bg-white text-emerald-850 border-emerald-100/70 hover:bg-emerald-100/40 hover:text-emerald-705'}`}
              >
                <span>🏷️</span> <span>{language === 'en' ? 'Weekly Discounts' : 'সাপ্তাহিক ছাড় (Discounts)'}</span>
              </button>

              <button
                onClick={() => { handleNavClick('ready-to-cook'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'ready-to-cook' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' : 'bg-white text-emerald-850 border-emerald-100/70 hover:bg-emerald-100/40 hover:text-emerald-705'}`}
              >
                <span>🍳</span> <span>{language === 'en' ? 'Ready to Cook' : 'রেডি-টু-কুক (Cook Prep)'}</span>
              </button>

              <button
                onClick={() => { handleNavClick('farmers'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'farmers' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' : 'bg-white text-emerald-850 border-emerald-100/70 hover:bg-emerald-100/40 hover:text-emerald-705'}`}
              >
                <span>👨‍🌾</span> <span>{language === 'en' ? 'Farmers' : 'ভেরিফাইড কৃষক (Farmers)'}</span>
              </button>

              <button
                onClick={() => { handleNavClick('blog'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'blog' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' : 'bg-white text-emerald-850 border-emerald-100/70 hover:bg-emerald-100/40 hover:text-emerald-705'}`}
              >
                <span>📝</span> <span>{language === 'en' ? 'Farmer Blogs' : 'ব্লগ সেকশন (Blog)'}</span>
              </button>

              <button
                onClick={() => { handleNavClick('our-story'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'our-story' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' : 'bg-white text-emerald-850 border-emerald-100/70 hover:bg-emerald-100/40 hover:text-emerald-705'}`}
              >
                <span>🌿</span> <span>{language === 'en' ? 'Our Story' : 'আমাদের গল্প (Our Story)'}</span>
              </button>

              <button
                onClick={() => { handleNavClick('privacy-policy'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'privacy-policy' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' : 'bg-white text-emerald-850 border-emerald-100/70 hover:bg-emerald-100/40 hover:text-emerald-705'}`}
              >
                <span>🛡️</span> <span>{language === 'en' ? 'Privacy' : 'গোপনীয়তা নীতি (Privacy)'}</span>
              </button>

              <button
                onClick={() => { handleNavClick('shipping-policy'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'shipping-policy' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' : 'bg-white text-emerald-850 border-emerald-100/70 hover:bg-emerald-100/40 hover:text-emerald-705'}`}
              >
                <span>📦</span> <span>{language === 'en' ? 'Shipping' : 'ফেরত ও শিপিং নীতি'}</span>
              </button>
            </div>

            {/* DYNAMIC AND USER CUSTOM PAGES BLOCK */}
            {dynamicPages && dynamicPages.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-[10px] sm:text-xs font-black text-amber-800 tracking-widest uppercase flex items-center gap-1.5">
                  📁 {language === 'en' ? 'YOUR CREATED COMBOS / CUSTOM PAGES' : 'আপনার তৈরি করা কম্বো / কাস্টম সেকশন সমূহ'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {dynamicPages.map((dp) => {
                    const isCurrent = currentView === `dynamic-${dp.slug}`;
                    return (
                      <button
                        key={dp.slug}
                        onClick={() => { handleNavClick(`dynamic-${dp.slug}` as any); setIsMainMenuOpen(false); }}
                        className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${isCurrent ? 'bg-amber-500 text-white border-amber-550 font-extrabold' : 'bg-amber-50/50 text-amber-950 border-amber-100 hover:bg-amber-100'}`}
                      >
                        <span>🍲</span> <span className="truncate">{language === 'en' ? dp.titleEn : dp.titleBn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-emerald-100/50 pt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] text-emerald-800 font-semibold">
              <span>💡 {language === 'en' ? 'Click any item above to navigate instantly.' : 'যেকোনো আইটেমে ক্লিক করার দ্বারা সাথে সাথে সংশ্লিষ্ট বিভাগে প্রবেশ করুন।'}</span>
              <button
                onClick={() => {
                  setIsMainMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('open-compare-modal'));
                }}
                className="px-3.5 py-1.5 rounded-xl font-black bg-amber-500 text-white border border-amber-400 hover:bg-amber-600 flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
              >
                ⚖️ {language === 'en' ? 'Open Compare' : 'তুলনা হাব খুলুন (Compare)'}
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
