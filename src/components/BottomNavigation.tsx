/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../AppContext';
import { Home, ShoppingBag, ShoppingCart, User, Menu } from 'lucide-react';

interface BottomNavigationProps {
  currentView: string;
  setView: (view: any) => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentView,
  setView,
  onOpenCart,
  onOpenAuth,
}) => {
  const { currentUser, cart, language } = useApp();
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (view: string) => {
    setView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMenuClick = () => {
    window.dispatchEvent(new CustomEvent('open-main-menu'));
  };

  const handleProfileClick = () => {
    if (currentUser) {
      if (currentUser.role === 'Admin') {
        handleNavClick('admin');
      } else if (currentUser.role === 'Farmer') {
        handleNavClick('farmer-dashboard');
      } else {
        handleNavClick('customer-dashboard');
      }
    } else {
      onOpenAuth();
    }
  };

  return (
    <div id="bottom-navigation-bar" className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 border-t border-emerald-100 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur-md pb-safe">
      <div className="grid grid-cols-5 h-16 text-center">
        {/* Home Option */}
        <button
          onClick={() => handleNavClick('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            currentView === 'home' ? 'text-emerald-700 font-extrabold' : 'text-gray-500 hover:text-emerald-600'
          }`}
        >
          <Home className={`h-5 w-5 ${currentView === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] font-sans">
            {language === 'en' ? 'Home' : 'হোম'}
          </span>
        </button>

        {/* Shop Option */}
        <button
          onClick={() => handleNavClick('shop')}
          className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            currentView === 'shop' ? 'text-emerald-700 font-extrabold' : 'text-gray-500 hover:text-emerald-600'
          }`}
        >
          <ShoppingBag className={`h-5 w-5 ${currentView === 'shop' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] font-sans">
            {language === 'en' ? 'Shop' : 'সব পণ্য'}
          </span>
        </button>

        {/* Cart Option */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-emerald-600 transition-all cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5 stroke-2" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow-sm ring-1 ring-white">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-sans">
            {language === 'en' ? 'Cart' : 'কার্ট'}
          </span>
        </button>

        {/* Profile/Login Option */}
        <button
          onClick={handleProfileClick}
          className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            ['admin', 'farmer-dashboard', 'customer-dashboard'].includes(currentView)
              ? 'text-emerald-700 font-extrabold'
              : 'text-gray-500 hover:text-emerald-600'
          }`}
        >
          <User className={`h-5 w-5 ${['admin', 'farmer-dashboard', 'customer-dashboard'].includes(currentView) ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[10px] font-sans truncate max-w-[60px]">
            {currentUser 
              ? (language === 'en' ? 'Profile' : 'প্রোফাইল') 
              : (language === 'en' ? 'Login' : 'লগইন')
            }
          </span>
        </button>

        {/* Categories Drawer Menu Option */}
        <button
          onClick={handleMenuClick}
          className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-emerald-600 transition-all cursor-pointer"
        >
          <Menu className="h-5 w-5 stroke-2" />
          <span className="text-[10px] font-sans text-amber-500 font-black">
            {language === 'en' ? 'Menu' : 'মেনু'}
          </span>
        </button>
      </div>
    </div>
  );
};
