/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Search, ShoppingCart, User, LogOut, Menu, X, Landmark, CheckCircle, ChevronDown, UserCheck, WifiOff, Download, Bell, MapPin, Package, Tag, Percent, Truck, Sprout, Sparkles } from 'lucide-react';
import { FEMALE_AVATAR, MALE_AVATAR, KRISHOK_BAZAR_LOGO } from '../assets';
import { motion } from 'motion/react';

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
  const { currentUser, logout, cart, language, toggleLanguage, harvestAlerts, dynamicPages, siteSettings, orders } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notiTab, setNotiTab] = useState<'all' | 'orders' | 'discounts' | 'restocks' | 'harvest'>('all');
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(true);
  const [isPushEnabled, setIsPushEnabled] = useState(
    typeof window !== 'undefined' ? ('Notification' in window && Notification.permission === 'granted') : false
  );

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // PWA states and listeners
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAtTop, setIsAtTop] = useState(true);

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

    const handleScroll = () => {
      setIsAtTop(window.scrollY < 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('open-main-menu', handleOpenMenu);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleInstallApp = async () => {
    // Request notification and microphone permission immediately during installation process to ensure full capability
    try {
      if ('Notification' in window) {
        await Notification.requestPermission();
      }
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          stream.getTracks().forEach(t => t.stop());
        }).catch(() => {});
      }
    } catch (e) {}

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

  const fbUsername = siteSettings?.socialFacebook 
    ? siteSettings.socialFacebook.replace(/\/$/, '').split('/').pop() || 'krishokbazar' 
    : 'krishokbazar';

  // Helpers to get Order updates in Bangla/English
  const getOrderStatusBn = (status: string) => {
    switch (status) {
      case 'Pending': return 'অর্ডার পেন্ডিং';
      case 'Confirmed': return 'অর্ডার কনফার্মড';
      case 'Processing': return 'প্রক্রিয়াকরণ চলছে';
      case 'Packed': return 'প্যাক করা হয়েছে';
      case 'Shipped': return 'শিপড করা হয়েছে';
      case 'Out for delivery': return 'ডেলিভারির জন্য বের হয়েছে';
      case 'Delivered': return 'ডেলিভারি সম্পন্ন';
      default: return 'আপডেট করা হয়েছে';
    }
  };

  const getOrderStatusEn = (status: string) => {
    switch (status) {
      case 'Pending': return 'Pending';
      case 'Confirmed': return 'Confirmed';
      case 'Processing': return 'Processing';
      case 'Packed': return 'Packed';
      case 'Shipped': return 'Shipped';
      case 'Out for delivery': return 'Out for delivery';
      case 'Delivered': return 'Delivered';
      default: return 'Updated';
    }
  };

  const getOrderStatusDescBn = (status: string) => {
    switch (status) {
      case 'Pending': return 'আপনার অর্ডারটি আমরা পেয়েছি এবং কৃষক নিশ্চিত করার অপেক্ষায় আছে।';
      case 'Confirmed': return 'কৃষক কর্তৃক অর্ডারটি নিশ্চিত করা হয়েছে। শীঘ্রই ফসল তোলা শুরু হবে।';
      case 'Processing': return 'মাঠ পর্যায় থেকে তাজা ফসল সংগ্রহ ও গুণগত মান পরীক্ষা করা হচ্ছে।';
      case 'Packed': return 'পরিষ্কার ও স্যানিটাইজড বক্সে অর্ডারটি যত্নের সাথে প্যাক করা হয়েছে।';
      case 'Shipped': return 'কৃষক বাজারের ডেডিকেটেড মিনি ট্রাকে আমাদের ঢাকা সেন্ট্রাল হাবে রওনা দিয়েছে।';
      case 'Out for delivery': return 'আমাদের ডেলিভারি রাইডার সরাসরি আপনার ঠিকানায় নিয়ে আসছে।';
      case 'Delivered': return 'অর্ডারটি সফলভাবে আপনার কাছে ডেলিভারি করা হয়েছে। খাঁটি পণ্য উপভোগ করুন!';
      default: return 'আপনার অর্ডারের স্থিতি আপডেট করা হয়েছে।';
    }
  };

  const getOrderStatusDescEn = (status: string) => {
    switch (status) {
      case 'Pending': return 'Your order is received and waiting for farmer confirmation.';
      case 'Confirmed': return 'Order confirmed by the farmer. Preparing logistics.';
      case 'Processing': return 'Quality check and micro-sorting in progress.';
      case 'Packed': return 'Carefully packed inside sanitized transit boxes.';
      case 'Shipped': return 'Dispatched in our specialized temperature-regulated trucks.';
      case 'Out for doorstep delivery':
      case 'Out for delivery': return 'Out for doorstep delivery with our dedicated delivery rider.';
      case 'Delivered': return 'Order delivered successfully. Enjoy your authentic farmer food!';
      default: return 'Order status has been updated.';
    }
  };

  // Build reactive list of order notifications based on global context orders state
  const myOrders = (orders || []).filter(o => 
    currentUser ? (o.customerId === currentUser.id || o.customerPhone === currentUser.phone) : true
  );
  
  // If no user orders are present, show the standard demo list so any anonymous visitor can see the feature
  const displayOrders = myOrders.length > 0 ? myOrders : (orders || []).slice(0, 2);

  const orderNotis = displayOrders.map(order => ({
    id: `order-noti-${order.id}-${order.status}`,
    type: 'orders' as const,
    titleBn: `অর্ডার আপডেট: #${order.trackingNumber || order.id.slice(0, 8)}`,
    titleEn: `Order Update: #${order.trackingNumber || order.id.slice(0, 8)}`,
    descBn: getOrderStatusDescBn(order.status),
    descEn: getOrderStatusDescEn(order.status),
    badgeBn: getOrderStatusBn(order.status),
    badgeEn: getOrderStatusEn(order.status),
    status: order.status,
    date: 'আজকের আপডেট',
    actionLabelBn: 'ট্র্যাক করুন 📦',
    actionLabelEn: 'Track Order',
    action: () => {
      setView('customer-dashboard');
      setNotificationsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }));

  // Campaign Discounts notifications
  const discountNotis = [
    {
      id: 'disc-noti-eid',
      type: 'discounts' as const,
      titleBn: '🌙 পবিত্র ঈদ স্পেশাল ২৫% বড় ক্যাশব্যাক ছাড়!',
      titleEn: '🌙 Holy Eid Special 25% Off Deal!',
      descBn: 'আসন্ন ঈদ উৎসব উপলক্ষে সকল খাঁটি সরিষার তেল ও মসলাজাতীয় কম্বো প্যাকেজে ২৫% পর্যন্ত সরাসরি ক্যাশব্যাক ছাড় পেতে ব্যবহার করুন প্রোমোকোড: EIDPURE। অফারটি অফুরন্ত ও সীমিত সময়ের জন্য সক্রিয়।',
      descEn: 'Get up to 25% flat discount on all pure mustard oil and spice combos for Eid. Use code: EIDPURE.',
      badgeBn: '২৫% ছাড়',
      badgeEn: '25% OFF',
      date: 'আজকের অফার',
      code: 'EIDPURE',
      actionLabelBn: 'কোড কপি করুন ✂️',
      actionLabelEn: 'Copy Code',
      action: () => {
        navigator.clipboard.writeText('EIDPURE');
        alert(language === 'en' ? 'Code EIDPURE copied to clipboard!' : 'প্রোমো কোড EIDPURE ক্লিপবোর্ডে কপি হয়েছে! কার্টে ব্যবহার করুন।');
      }
    },
    {
      id: 'disc-noti-free-ship',
      type: 'discounts' as const,
      titleBn: '🚚 সরাসরি ঢাকা সিটিতে ফ্রি-ডেলিভারি',
      titleEn: '🚚 Free Doorstep Delivery Dhaka Zone',
      descBn: '৫০০ টাকার বেশি যেকোনো তাজা শাকসবজি ও অর্গানিক গ্রোসারি শপিং করলেই ঢাকা সিটির যেকোনো পয়েন্টে ডেলিভারি চার্জ একদম ফ্রি!',
      descEn: 'Get free delivery anywhere in Dhaka district on vegetable and grocery purchases above 500 TK.',
      badgeBn: 'ফ্রি শিপিং',
      badgeEn: 'Free Delivery',
      date: 'সীমিত অফার',
      actionLabelBn: 'কিনুন এখনই 🥦',
      actionLabelEn: 'Shop Now',
      action: () => {
        setView('shop');
        setNotificationsOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  ];

  // Restock Alerts
  const restockNotis = [
    {
      id: 'restock-noti-honey',
      type: 'restocks' as const,
      titleBn: '🍯 সুন্দরবনের বিশ্বস্ত খলিশা ফুলের মধু রিস্টক!',
      titleEn: '🍯 Premium Sundarban Kholisha Honey Restocked',
      descBn: 'বাওয়ালিদের হাত থেকে সরাসরি সংগৃহীত প্রিমিয়াম খলিশা ফুলের খাঁটি মধু এখন আবার পর্যাপ্ত পরিমাণে স্টকে এসেছে। ১০০% প্রাকৃতিক ও সুস্বাদু।',
      descEn: 'Harvested directly from Sundarbans, our pure natural kholisha honey is now fully restocked and ready for delivery.',
      badgeBn: 'স্টকে এসেছে',
      badgeEn: 'Restocked',
      date: 'সদ্য রিস্টক',
      actionLabelBn: 'মধু কিনুন 🍯',
      actionLabelEn: 'Buy Honey',
      action: () => {
        setView('shop');
        setSearchQuery('মধু');
        setNotificationsOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'restock-noti-ghee',
      type: 'restocks' as const,
      titleBn: '🧈 সিরাজগঞ্জের খাঁটি গরুর ঘি স্টকে ফিরেছে',
      titleEn: '🧈 Pure Sirajganj Cow Ghee Back in Stock',
      descBn: 'সিরাজগঞ্জের মাঠ থেকে ঐতিহ্যবাহী পদ্ধতিতে প্রস্তুতকৃত সুগন্ধি ডবল-ফিল্টারড গাওয়া ঘি এখন প্রস্তুত। শতভাগ প্রিজারভেティブমুক্ত ও খাঁটি।',
      descEn: 'Sirajganj premium hand-churned cow milk ghee is fully restocked with premium aroma and rich nutrition.',
      badgeBn: 'খাঁটি ঘি',
      badgeEn: 'Cow Ghee',
      date: 'উপলব্ধ আছে',
      actionLabelBn: 'ঘি কিনুন 🧈',
      actionLabelEn: 'Buy Ghee',
      action: () => {
        setView('shop');
        setSearchQuery('ঘি');
        setNotificationsOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      id: 'restock-noti-mango',
      type: 'restocks' as const,
      titleBn: '🥭 রাজশাহীর কেমিক্যাল-মুক্ত হিমসাগর আম আসলো!',
      titleEn: '🥭 Carbide-Free Rajshahi Himsagar Mango Restocked',
      descBn: 'রাজশাহী বাঘা থেকে সরাসরি গাছপাকা হিমসাগর আম এসেছে। কোনো কার্বাইড বা ক্ষতিকর প্রিজারভে티브 ব্যবহার করা হয়নি। একদম মিষ্টি রসাৎ আম সরাসরি ঢাকার দরজায়।',
      descEn: 'Pure carbide-free, tree-ripened Himsagar fresh mangoes are restocked from Bagha, Rajshahi orchards today.',
      badgeBn: 'আম এলার্ট',
      badgeEn: 'Mango Alerts',
      date: 'চলমান বুকিং',
      actionLabelBn: 'আম দেখুন 🥭',
      actionLabelEn: 'View Mangoes',
      action: () => {
        setView('shop');
        setSearchQuery('আম');
        setNotificationsOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  ];

  // Agricultural Live alerts
  const harvestNotis = (harvestAlerts || []).map(alert => ({
    id: `harvest-noti-${alert.id}`,
    type: 'harvest' as const,
    titleBn: `🌾 ফসল সংগ্রহ: ${alert.cropNameBn}`,
    titleEn: `🌾 Harvested Crop: ${alert.cropNameEn}`,
    descBn: `${alert.farmerName} (${alert.district}) কর্তৃক এইমাত্র সতেজ ঘোষণা দেয়া হয়েছে: "${alert.descriptionBn}"।`,
    descEn: `Reported by farmer ${alert.farmerName} from ${alert.district}: "${alert.descriptionEn}"`,
    badgeBn: alert.statusBn,
    badgeEn: alert.statusEn,
    date: alert.harvestDate,
    imageUrl: alert.imageUrl,
    actionLabelBn: 'কিনুন এখনই 🥕',
    actionLabelEn: 'Buy Fresh',
    action: () => {
      setView('shop');
      setSearchQuery(alert.cropNameBn.split(' ')[0]);
      setNotificationsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }));

  // Consolidated active list of notifications
  const allNotifications = [
    ...orderNotis,
    ...discountNotis,
    ...restockNotis,
    ...harvestNotis
  ];

  // Dynamic filter based on selected sub-tab
  const filteredNotifications = allNotifications.filter(x => {
    if (notiTab === 'all') return true;
    return x.type === notiTab;
  });

  // Calculate dynamic unread total for interactive icon pill
  const unreadCount = allNotifications.length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-gray-100 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          
          {/* LOGO & MARKETS SUBTITLE SECTION */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
          >
            {/* Circular brand logo */}
            <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-emerald-50 border border-emerald-500 overflow-hidden shrink-0">
              <img 
                src={KRISHOK_BAZAR_LOGO} 
                alt="Krishok Bazar premium avatar logo" 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col select-none">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-xs sm:text-base font-black tracking-tight text-emerald-800 font-sans">
                  কৃষক বাজার
                </span>
                <span className="hidden xs:inline-block text-[10px] bg-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded-full shadow-xs shrink-0 font-sans">
                  ক্রেতা বাজার
                </span>
              </div>
              <div className="hidden xs:flex text-[9px] sm:text-[10px] text-emerald-600 font-black items-center gap-1 mt-1 leading-none font-sans">
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

          {/* ORIGINAL APP-LIKE SOCIAL ICONS ROW - PERFECTLY CENTERED & SIZED IDENTICALLY */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Facebook App Icon */}
            <a 
              href="https://www.facebook.com/people/%E0%A6%95%E0%A7%83%E0%A6%B7%E0%A6%95-%E0%A6%AC%E0%A6%BE%E0%A6%9C%E0%A6%BE%E0%A6%B0-Krishok-Bazar/61578459151972/"
              target="_blank" 
              rel="noreferrer"
              className="h-7.5 w-7.5 rounded-lg bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-xs shrink-0 cursor-pointer"
              title="Facebook"
            >
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* YouTube App Icon */}
            <motion.a 
              href="https://youtube.com/@krishokbazarbd?si=SvzrYv3A3M0fXDbO"
              target="_blank" 
              rel="noreferrer"
              animate={isAtTop ? {
                y: [0, -4, 0]
              } : { y: 0 }}
              transition={isAtTop ? {
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              } : {}}
              className="h-7.5 w-7.5 rounded-lg bg-[#FF0000] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-xs shrink-0 cursor-pointer"
              title="YouTube"
            >
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.553a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </motion.a>

            {/* TikTok App Icon */}
            <motion.a 
              href="https://www.tiktok.com/@krishokbazarbd"
              target="_blank" 
              rel="noreferrer"
              animate={isAtTop ? {
                y: [0, -4, 0]
              } : { y: 0 }}
              transition={isAtTop ? {
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6
              } : {}}
              className="h-7.5 w-7.5 rounded-lg bg-black flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-xs shrink-0 cursor-pointer"
              title="TikTok"
            >
              <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.2-.43-.4-.63-.62v7.33c0 1.94-.48 3.91-1.63 5.46-1.51 2.08-4.14 3.09-6.66 2.65-2.5-.4-4.63-2.26-5.28-4.72-.8-2.93.43-6.23 2.97-7.66 1.05-.6 2.27-.85 3.48-.75v4.14c-.69-.13-1.42-.04-2.03.32-1.07.61-1.53 1.94-1.12 3.12.36 1.08 1.48 1.79 2.62 1.67 1.25-.09 2.22-1.19 2.22-2.45V0c-.26.01-.52.01-.78.02z" />
              </svg>
            </motion.a>
          </div>

          {/* NAVIGATION LINKS - DESKTOP REMOVED AS REQUESTED */}

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* OFFLINE MODE INDICATOR */}
            {isOffline && (
              <span className="inline-flex items-center gap-1 bg-red-50 border border-red-150 text-red-600 text-[10px] font-bold px-2 py-1 py-[3px] rounded-xl animate-pulse">
                <WifiOff className="h-3.5 w-3.5" /> অফলাইন
              </span>
            )}

            {/* NOTIFICATION INTERACTIVE BELL & DROPDOWN */}
            <div className="relative block">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setHasUnreadAlerts(false);
                }}
                className={`relative rounded-2xl border p-2 transition-all cursor-pointer flex items-center justify-center ${notificationsOpen ? 'bg-amber-50 border-amber-300 text-amber-700 ring-2 ring-amber-100' : 'border-gray-100 text-gray-650 bg-gray-50/50 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'}`}
                title="সোনালী ফসলসংগ্রহ এলার্ট ও নোটিফিকেশন"
              >
                <Bell className={`h-4.5 w-4.5 ${hasUnreadAlerts && unreadCount > 0 ? 'animate-bounce-subtle' : ''}`} />
                {hasUnreadAlerts && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white shadow-md border border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* FLOATING DROPDOWN LIST */}
              {notificationsOpen && (
                <div 
                  className="absolute right-[-45px] sm:right-0 mt-3 w-[295px] xs:w-[350px] sm:w-[420px] rounded-3xl bg-white border border-gray-150 shadow-2xl p-3.5 sm:p-4 z-50 text-gray-800 animate-fadeIn"
                  style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.15)' }}
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs sm:text-[13px] text-gray-850">
                        {language === 'en' ? 'In-App Alerts 🔔' : 'ইন-অ্যাপ এলার্ট ও নোটিফিকেশন 🔔'}
                      </span>
                      <span className="text-[10px] bg-red-500 text-white font-black px-2 py-0.5 rounded-full">
                        {unreadCount} New
                      </span>
                    </div>
                    <button 
                      onClick={() => setNotificationsOpen(false)}
                      className="text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 p-1 transition cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Horizontal Categories Tabs Selection */}
                  <div className="flex gap-1 overflow-x-auto pb-2.5 mb-2.5 no-scrollbar scroll-smooth whitespace-nowrap border-b border-gray-100">
                    {[
                      { id: 'all', labelBn: 'সব', labelEn: 'All' },
                      { id: 'orders', labelBn: 'অর্ডার', labelEn: 'Orders' },
                      { id: 'discounts', labelBn: 'ডিসকাউন্ট', labelEn: 'Discounts' },
                      { id: 'restocks', labelBn: 'রিস্টক', labelEn: 'Restocks' },
                      { id: 'harvest', labelBn: 'মাঠের খবর', labelEn: 'Harvest' }
                    ].map(tab => {
                      const isActive = notiTab === tab.id;
                      const count = tab.id === 'all' 
                        ? allNotifications.length 
                        : tab.id === 'orders' 
                          ? orderNotis.length 
                          : tab.id === 'discounts' 
                            ? discountNotis.length 
                            : tab.id === 'restocks' 
                              ? restockNotis.length 
                              : harvestNotis.length;

                      return (
                        <button
                          key={tab.id}
                          onClick={() => setNotiTab(tab.id as any)}
                          className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                            isActive 
                              ? 'bg-emerald-600 text-white shadow-xs' 
                              : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                          }`}
                        >
                          <span>{language === 'en' ? tab.labelEn : tab.labelBn}</span>
                          {count > 0 && (
                            <span className={`text-[8px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Push Notification Toggle Button */}
                  <div className="bg-emerald-50/45 rounded-2xl border border-emerald-100/50 p-3 mb-3 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-emerald-950 leading-snug">
                          {language === 'en' ? 'Live Harvest Push Alerts' : 'লাইভ ফসলসংগ্রহ পুশ বিজ্ঞপ্তি'}
                        </p>
                        <p className="text-[9px] text-emerald-800/85 leading-normal mt-[2px]">
                          {language === 'en' ? 'Receive instant browser alerts when crops are harvested.' : 'কৃষক মাঠে ফসল কাটার সাথে সাথে তাৎক্ষণিক আপডেট পান।'}
                        </p>
                      </div>
                      <button
                        onClick={async () => {
                          await handleTriggerPushNotification();
                          setIsPushEnabled(typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer transition-all shrink-0 ${isPushEnabled ? 'bg-emerald-600 hover:bg-emerald-750 text-white shadow-3xs' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-102 flex items-center gap-1'}`}
                      >
                        {isPushEnabled 
                          ? (language === 'en' ? '✓ Active' : '✓ সচল রয়েছে') 
                          : (language === 'en' ? 'Enable Now' : 'চালু করুন 🔔')
                        }
                      </button>
                    </div>
                  </div>

                  {/* List of Notifications */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-2.5">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Bell className="h-8 w-8 mx-auto stroke-1 mb-2 text-gray-300" />
                        <p className="text-xs font-bold">
                          {language === 'en' ? 'No active notifications in this category.' : 'বর্তমানে এই ক্যাটাগরিতে কোনো সক্রিয় বিজ্ঞপ্তি নেই।'}
                        </p>
                      </div>
                    ) : (
                      filteredNotifications.map((item: any) => {
                        const isOrders = item.type === 'orders';
                        const isDiscounts = item.type === 'discounts';
                        const isRestocks = item.type === 'restocks';
                        const isHarvest = item.type === 'harvest';

                        return (
                          <div key={item.id} className="pt-2.5 first:pt-0 flex gap-3 items-start">
                            {/* Visual Avatar / Icon box */}
                            <div className="shrink-0">
                              {isHarvest && item.imageUrl ? (
                                <div className="h-11 w-11 rounded-xl overflow-hidden border border-gray-100 shadow-3xs">
                                  <img 
                                    src={item.imageUrl} 
                                    alt="Crop avatar" 
                                    className="h-full w-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              ) : (
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border shrink-0 shadow-3xs ${
                                  isOrders 
                                    ? 'bg-blue-50 border-blue-100 text-blue-600' 
                                    : isDiscounts 
                                      ? 'bg-amber-50 border-amber-100 text-amber-600' 
                                      : isRestocks 
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                                        : 'bg-orange-50 border-orange-100 text-orange-600'
                                }`}>
                                  {isOrders && <Package className="h-5 w-5" />}
                                  {isDiscounts && <Tag className="h-5 w-5" />}
                                  {isRestocks && <Sparkles className="h-5 w-5" />}
                                  {isHarvest && <Sprout className="h-5 w-5" />}
                                </div>
                              )}
                            </div>

                            {/* Text content details */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-full uppercase leading-none ${
                                  isOrders 
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                                    : isDiscounts 
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                      : isRestocks 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                                }`}>
                                  {language === 'en' ? item.badgeEn || item.type : item.badgeBn || item.type}
                                </span>
                                <span className="text-[8.5px] text-gray-400 font-bold font-sans">
                                  {item.date}
                                </span>
                              </div>
                              <h5 className="text-[11px] font-black text-gray-800 leading-tight mt-1 font-sans">
                                {language === 'en' ? item.titleEn : item.titleBn}
                              </h5>
                              <p className="text-[9.5px] text-gray-500 leading-normal mt-[2px] line-clamp-3">
                                {language === 'en' ? item.descEn : item.descBn}
                              </p>
                              
                              {/* Direct action link details and navigation */}
                              <div className="mt-2 bg-gray-50 p-1.5 rounded-xl flex items-center justify-between gap-2 border border-gray-100">
                                <span className="text-[8.5px] text-emerald-750 font-extrabold truncate">
                                  {isHarvest 
                                    ? `🚜 ${language === 'en' ? 'Fresh Crop' : 'তাজা ফসল'}`
                                    : isOrders 
                                      ? `🛒 ${language === 'en' ? 'Real-Time Update' : 'রিয়েল-টাইম ট্র্যাকিং'}` 
                                      : isDiscounts 
                                        ? `🎁 ${language === 'en' ? 'Special Deal' : 'স্পেশাল ক্যাম্পেইন'}`
                                        : `📦 ${language === 'en' ? 'Fresh Batch' : 'তাজা নতুন স্টক'}`
                                  }
                                </span>
                                <button
                                  onClick={item.action}
                                  className={`text-[8.5px] font-black text-white px-2 py-0.5 rounded-md transition cursor-pointer shrink-0 ${
                                    isOrders 
                                      ? 'bg-blue-600 hover:bg-blue-700' 
                                      : isDiscounts 
                                        ? 'bg-amber-600 hover:bg-amber-700' 
                                        : 'bg-emerald-650 hover:bg-emerald-750'
                                  }`}
                                >
                                  {language === 'en' ? item.actionLabelEn || 'View' : item.actionLabelBn || 'দেখুন'}
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
                onClick={() => { handleNavClick('subscriptions'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'subscriptions' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' : 'bg-white text-emerald-850 border-emerald-100/70 hover:bg-emerald-100/40 hover:text-emerald-705'}`}
              >
                <span>👑</span> <span>{language === 'en' ? 'Subscriptions' : 'প্রিমিয়াম সাবস্ক্রিপশন (Subscriptions)'}</span>
              </button>

              <button
                onClick={() => { handleNavClick('our-story'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'our-story' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' : 'bg-white text-emerald-850 border-emerald-100/70 hover:bg-emerald-100/40 hover:text-emerald-705'}`}
              >
                <span>🌿</span> <span>{language === 'en' ? 'Our Story' : 'আমাদের গল্প (Our Story)'}</span>
              </button>

              <button
                onClick={() => { handleNavClick('founders'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'founders' ? 'bg-emerald-600 text-white border-emerald-600 font-extrabold' : 'bg-white text-emerald-850 border-emerald-100/70 hover:bg-emerald-100/40 hover:text-emerald-705'}`}
              >
                <span>👑</span> <span>{language === 'en' ? 'Our Founders' : 'প্রতিষ্ঠাতা পরিচিতি (Founders)'}</span>
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

              <button
                onClick={() => { handleNavClick('videos'); setIsMainMenuOpen(false); }}
                className={`px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border shadow-xs ${currentView === 'videos' ? 'bg-red-600 text-white border-red-600 font-extrabold' : 'bg-red-50 text-red-950 border-red-100 hover:bg-red-100/40'}`}
              >
                <span>📺</span> <span>{language === 'en' ? '📺 Farm Videos' : '📺 খামার ভিডিও গ্যালারি'}</span>
              </button>

              <button
                onClick={() => { 
                  window.dispatchEvent(new CustomEvent('open-riktaz-ai'));
                  setIsMainMenuOpen(false);
                }}
                className="px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border border-emerald-100 bg-emerald-50 text-emerald-850 hover:bg-emerald-100 shadow-xs"
              >
                <span className="text-emerald-600 animate-bounce">🤖</span> <span>{language === 'en' ? 'Riktaz AI Chatbot' : 'রিকতাজ এআই চ্যাটবট'}</span>
              </button>

              <button
                onClick={() => { 
                  window.open('tel:01931355398', '_blank');
                  setIsMainMenuOpen(false);
                }}
                className="px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border border-blue-100 bg-blue-50 text-blue-800 hover:bg-blue-100 shadow-xs"
              >
                <span className="text-blue-600 animate-pulse">📞</span> <span>{language === 'en' ? 'Call Hotline Support' : 'হটলাইন কল সাপোর্ট'}</span>
              </button>

              <button
                onClick={() => { 
                  window.open('https://wa.me/8801931355398', '_blank');
                  setIsMainMenuOpen(false);
                }}
                className="px-3 py-2.5 rounded-xl text-xs font-black text-left transition w-full flex items-center gap-2 border border-green-100 bg-green-50 text-green-800 hover:bg-green-100 shadow-xs"
              >
                <span className="text-green-600">💬</span> <span>{language === 'en' ? 'WhatsApp Support' : 'হোয়াটসঅ্যাপ সাপোর্ট'}</span>
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
