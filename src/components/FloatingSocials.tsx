import React, { useState } from 'react';
import { Phone, MessageCircle, Facebook, Video, Youtube, HelpCircle } from 'lucide-react';

export const FloatingSocials: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Social Links mapping
  const links = {
    whatsapp: 'https://wa.me/8801931355398',
    facebook: 'https://www.facebook.com/people/%E0%A6%95%E0%A7%83%E0%A6%B7%E0%A6%95-%E0%A6%AC%E0%A6%BE%E0%A6%9C%E0%A6%BE%E0%A6%B0-Krishok-Bazar/61578459151972/',
    youtube: 'https://www.youtube.com/@KrishokBazarBD',
    tiktok: 'https://www.tiktok.com/@krishokbazarbd',
    messenger: 'https://m.me/61578459151972/',
    tel: 'tel:01931355398'
  };

  return (
    <div className="fixed bottom-6 left-5 sm:left-6 z-45 select-none text-xs">
      
      {/* EXPANDABLE HORIZONTAL or VERTICAL TOOLBAR */}
      {isOpen && (
        <div className="flex flex-col gap-2.5 mb-3 animate-[fadeIn_0.2s_ease-out]">
          
          {/* CALL TARGET */}
          <a
            href={links.tel}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-emerald-650 hover:bg-emerald-700 text-white p-2.5 shadow-lg hover:scale-110 active:scale-95 transition-all text-[11px] font-bold"
            title="সরাসরি ফোন করুন: 01931355398"
          >
            <Phone className="h-4.5 w-4.5" />
            <span className="hidden sm:inline pr-1">সরাসরি কল করুন</span>
          </a>

          {/* WHATSAPP TARGET */}
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#25D366] hover:brightness-105 text-white p-2.5 shadow-lg hover:scale-110 active:scale-95 transition-all text-[11px] font-bold"
            title="WhatsApp চ্যাট"
          >
            <MessageCircle className="h-4.5 w-4.5 shrink-0" />
            <span className="hidden sm:inline pr-1">হোয়াটসঅ্যাপ</span>
          </a>

          {/* MESSENGER TARGET */}
          <a
            href={links.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-gradient-to-tr from-[#006AFF] to-[#A100FF] hover:brightness-105 text-white p-2.5 shadow-lg hover:scale-110 active:scale-95 transition-all text-[11px] font-bold"
            title="Messenger চ্যাট"
          >
            <MessageCircle className="h-4.5 w-4.5 shrink-0" />
            <span className="hidden sm:inline pr-1">মেসেঞ্জার</span>
          </a>

          {/* FACEBOOK PAGE */}
          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#1877F2] hover:brightness-105 text-white p-2.5 shadow-lg hover:scale-110 active:scale-95 transition-all text-[11px] font-bold"
            title="Facebook লিংক"
          >
            <Facebook className="h-4.5 w-4.5 shrink-0" />
            <span className="hidden sm:inline pr-1">ফেইসবুক পেজ</span>
          </a>

          {/* TIKTOK PAGE */}
          <a
            href={links.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#010101] border border-gray-800 text-white p-2.5 shadow-lg hover:scale-110 active:scale-95 transition-all text-[11px] font-bold"
            title="TikTok লিংক"
          >
            <Video className="h-4.5 w-4.5 shrink-0" />
            <span className="hidden sm:inline pr-1">টিকটক</span>
          </a>

          {/* YOUTUBE CHANNEL */}
          <a
            href={links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[#FF0000] hover:brightness-105 text-white p-2.5 shadow-lg hover:scale-110 active:scale-95 transition-all text-[11px] font-bold"
            title="YouTube চ্যানেল"
          >
            <Youtube className="h-4.5 w-4.5 shrink-0" />
            <span className="hidden sm:inline pr-1">ইউটিউব</span>
          </a>

        </div>
      )}

      {/* FLOATING ACTION BAR CONTROLLER TOGGLER */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-3.5 sm:px-5 sm:py-3.5 shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-white border border-teal-50 relative animate-pulse"
        style={{ boxShadow: '0 12px 28px -6px rgba(13, 148, 136, 0.4)' }}
      >
        <span className="absolute top-0 left-0 h-3 w-3 rounded-full bg-blue-500 border-2 border-white"></span>
        <Phone className="h-4.5 w-4.5 animate-bounce" />
        <span className="hidden sm:inline font-black text-xs uppercase tracking-wide">আমাদের হটলাইন (Contact)</span>
      </button>

    </div>
  );
};
