/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Search, ShoppingCart, User, LogOut, Menu, X, Landmark, CheckCircle, ChevronDown, UserCheck, WifiOff, Download, Bell, MapPin } from 'lucide-react';
import { FEMALE_AVATAR, MALE_AVATAR } from '../assets';

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
  const { currentUser, logout, cart, language, toggleLanguage } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install: ${outcome}`);
    setDeferredPrompt(null);
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
          
          {/* LOGO SECTION */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
            {/* National emblem themed circular logo */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 border border-emerald-500 overflow-hidden">
              <img 
                src={FEMALE_AVATAR} 
                alt="Krishok Bazar female logo avatar" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-emerald-700 flex items-center gap-1 font-sans">
                কৃষক বাজার
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-gray-400 font-mono leading-none">
                Krishok Bazar
              </span>
            </div>
          </div>

          {/* LOCATION BADGE REQUISITE */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 shrink-0 select-none">
            <MapPin className="h-4 w-4 text-emerald-600 shrink-0 animate-pulse" />
            <span className="font-sans leading-none mt-0.5">ঢাকা জেলা (Dhaka Zone)</span>
          </div>

          {/* SEARCH COMPONENT */}
          <div className="hidden md:flex flex-1 max-w-sm relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="সতেজ আলু, আম বা পদ্মার ইলিশ খুঁজুন..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/50 py-2 pl-10 pr-4 text-xs transition-all outline-none focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
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
              onClick={() => {
                setView('home');
                setTimeout(() => {
                  document.getElementById('combo-basket')?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }}
              className="hover:text-emerald-700 transition-colors cursor-pointer select-none text-sans"
            >
              {language === 'en' ? 'Combo Basket' : 'কম্বো বাস্কেট'}
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
            <button 
              onClick={() => handleNavClick('social-feed')}
              className={`hover:text-emerald-700 transition-colors cursor-pointer select-none ${currentView === 'social-feed' ? 'text-emerald-750 border-b-2 border-emerald-600 pb-0.5' : ''}`}
            >
              {language === 'en' ? "Farmers' Yard" : "কৃষকের উঠান ফিড"}
            </button>
            <button 
              onClick={() => handleNavClick('our-story')}
              className={`hover:text-emerald-700 transition-colors cursor-pointer select-none ${currentView === 'our-story' ? 'text-emerald-750 border-b-2 border-emerald-600 pb-0.5' : ''}`}
            >
              {language === 'en' ? 'Our Story' : 'আমাদের গল্প'}
            </button>
            <button 
              onClick={() => {
                document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-emerald-700 transition-colors cursor-pointer select-none text-sans"
            >
              {language === 'en' ? 'Contact' : 'যোগাযোগ'}
            </button>
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* OFFLINE MODE INDICATOR */}
            {isOffline && (
              <span className="inline-flex items-center gap-1 bg-red-50 border border-red-150 text-red-600 text-[10px] font-bold px-2 py-1.5 rounded-xl animate-pulse">
                <WifiOff className="h-3.5 w-3.5" /> অফলাইন
              </span>
            )}

            {/* PWA INSTALL BUTTON */}
            {deferredPrompt && (
              <button
                onClick={handleInstallApp}
                className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer select-none"
                title="কৃষক বাজার আমাদের অ্যাপ হিসেবে ইনস্টল করুন"
              >
                <Download className="h-3.5 w-3.5" /> অ্যাপ ইনস্টল
              </button>
            )}

            {/* NOTIFICATION TEST TRIGGER */}
            <button
              onClick={handleTriggerPushNotification}
              className="rounded-2xl border border-gray-100 p-2 text-gray-650 bg-gray-50/50 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all cursor-pointer"
              title="পুশ নোটিফিকেশন চালু / টেস্ট করুন"
            >
              <Bell className="h-5 w-5" />
            </button>
            {/* SEARCH ICON FOR SCANNABLE MOBILE LAYOUT */}
            <button 
              onClick={() => handleNavClick('shop')}
              className="p-2 text-gray-500 hover:text-emerald-600 md:hidden"
            >
              <Search className="h-5.5 w-5.5" />
            </button>

            {/* BILINGUAL LANGUAGE SWITCH */}
            <button
              onClick={toggleLanguage}
              className="rounded-2xl border border-gray-100 px-3.5 py-2.5 text-xs font-black text-emerald-800 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-250 transition-all cursor-pointer flex items-center gap-1 shrink-0 select-none shadow-sm"
              title="เปลี่ยนภาษา / Change Language / ভাষা পরিবর্তন করুন"
            >
              🌐 <span className="font-sans font-bold">{language === 'en' ? 'বাংলা' : 'ENGLISH'}</span>
            </button>

            {/* CART BUTTON WITH LIVE COUNT */}
            <button 
              onClick={onOpenCart}
              className="relative rounded-2xl border border-gray-100 p-2.5 text-gray-600 bg-gray-50/50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all cursor-pointer"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* PROFILE SECTION */}
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
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
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
                className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-green-700 hover:shadow-lg transition-all cursor-pointer text-sans"
              >
                <User className="h-4 w-4" />
                লগইন (Login)
              </button>
            )}

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border border-gray-100 p-2 text-gray-600 hover:bg-gray-50 flex lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-3 shadow-inner">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="সবজি, চাল বা মধু খুঁজুন..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full rounded-xl border border-gray-150 py-2 pl-9 pr-4 text-xs outline-none focus:border-emerald-500 bg-gray-50"
            />
          </div>

          <nav className="flex flex-col gap-1 font-bold text-xs text-gray-650">
            <button 
              onClick={() => handleNavClick('home')}
              className={`text-left py-2 px-3 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all ${currentView === 'home' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}`}
            >
              হোম (Home)
            </button>
            <button 
              onClick={() => handleNavClick('shop')}
              className={`text-left py-2 px-3 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all ${currentView === 'shop' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}`}
            >
              সব পণ্য (Shop)
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                setView('home');
                setTimeout(() => {
                  document.getElementById('combo-basket')?.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }}
              className="text-left py-2 px-3 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all"
            >
              কম্বো বাস্কেট (Combo Basket)
            </button>
            <button 
              onClick={() => handleNavClick('ready-to-cook')}
              className={`text-left py-2 px-3 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all ${currentView === 'ready-to-cook' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}`}
            >
              রেডি-টু-কুক (Ready To Cook)
            </button>
            <button 
              onClick={() => handleNavClick('farmers')}
              className={`text-left py-2 px-3 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all ${currentView === 'farmers' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}`}
            >
              ভেরিফাইড কৃষক (Verified Farmers)
            </button>
            <button 
              onClick={() => handleNavClick('blog')}
              className={`text-left py-2 px-3 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all ${currentView === 'blog' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}`}
            >
              {language === 'en' ? 'Blog' : 'ব্লগ (Blog)'}
            </button>
            <button 
              onClick={() => handleNavClick('social-feed')}
              className={`text-left py-2 px-3 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all ${currentView === 'social-feed' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}`}
            >
              {language === 'en' ? "Farmers' Social Yard" : "কৃষকের সামাজিক উঠান (Social Yard)"}
            </button>
            <button 
              onClick={() => handleNavClick('our-story')}
              className={`text-left py-2 px-3 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all ${currentView === 'our-story' ? 'bg-emerald-50 text-emerald-700 font-bold' : ''}`}
            >
              আমাদের গল্প (About Our Story)
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('footer-contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left py-2 px-3 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all"
            >
              যোগাযোগ (Contact)
            </button>
            <div className="border-t border-gray-100 my-1 pt-2 px-3 flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0 animate-pulse" />
              <span>ডেলিভারি জোন: ঢাকা জেলা (Dhaka)</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
