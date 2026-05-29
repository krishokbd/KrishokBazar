/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { X, Trash2, ShoppingBag, MapPin, Phone, User, CheckCircle, CreditCard, Gift } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const { cart, removeFromCart, updateCartQuantity, placeOrder, currentUser } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
      setAddress(currentUser.address);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = totalAmount > 500 ? 0 : 60; // Free delivery for orders > 500 TK
  const grandTotal = totalAmount + deliveryFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) return setErrorMsg('দয়া করে আপনার নাম লিখুন।');
    if (!phone.trim()) return setErrorMsg('দয়া করে আপনার সচল মোবাইল নম্বর দিন।');
    if (!address.trim()) return setErrorMsg('দয়া করে বিস্তারিত ডেলিভারি ঠিকানা দিন।');
    
    // Validate phone: BD style
    if (!/^01[3-9]\d{8}$/.test(phone.trim())) {
      return setErrorMsg('১১ ডিজিটের সঠিক মোবাইল নম্বর দিন (যেমন: 01712345678)।');
    }

    setIsSubmitting(true);
    
    try {
      const order = placeOrder(name.trim(), phone.trim(), address.trim());
      setIsCheckingOut(false);
      onOrderSuccess(order.id);
      onClose();
    } catch (err: any) {
      setErrorMsg('অর্ডার সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0 overflow-hidden" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-white transition-all shadow-2xl flex flex-col h-full">
          
          {/* HEADER SECTION */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-5 sm:px-6 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
              <h2 className="text-sm sm:text-lg font-black text-gray-800">শপিং ব্যাগ ({cart.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-gray-100 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* CART BODY COMPONENT */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="font-bold text-gray-700 font-sans">কার্ট সম্পূর্ণ খালি</h3>
                <p className="text-xs text-gray-400 max-w-xs mt-1 leading-relaxed">
                  আমাদের তাজা শাকসবজি, ফল বা সরাসরি পুকুরের জ্যান্ত মাছ আপনার কার্টে যোগ করতে শপে ব্রাউজ করুন।
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-green-700 transition-all cursor-pointer"
                >
                  কেনাকাটা শুরু করুন
                </button>
              </div>
            ) : !isCheckingOut ? (
              /* PRODUCT LIST SECTION */
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-4 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50/50 transition-all">
                    <div className="h-16 w-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">{item.title}</h4>
                      <p className="mt-1 text-xs font-semibold text-emerald-700">৳{item.price} <span className="text-[10px] text-gray-400 font-normal">/ইউনিট</span></p>
                      
                      {/* Controls rows */}
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-gray-150 p-0.5 bg-white">
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="h-6 w-6 flex items-center justify-center text-gray-500 font-extrabold hover:bg-gray-100 rounded"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-700 font-mono">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            className="h-6 w-6 flex items-center justify-center text-gray-500 font-extrabold hover:bg-gray-100 rounded"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Free Delivery promo banner */}
                {totalAmount < 500 ? (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-800 flex items-center gap-2">
                    <Gift className="h-4 w-4 shrink-0" />
                    <span>আর মাত্র <strong>৳{500 - totalAmount}</strong> টাকার পণ্য কিনলেই পাচ্ছেন <strong>ফ্রি হোম ডেলিভারি!</strong></span>
                  </div>
                ) : (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-250 p-3 text-[11px] text-emerald-800 flex items-center gap-2">
                    <Gift className="h-4 w-4 shrink-0" />
                    <span>অভিনন্দন! আপনি <strong>ফ্রি হোম ডেলিভারি</strong> পাওয়ার যোগ্যতা অর্জন করেছেন।</span>
                  </div>
                )}
              </div>
            ) : (
              /* CHECKOUT INSTRUCTION & FORM */
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 text-xs text-gray-600">
                  <span className="font-bold text-emerald-800 block mb-1">🚴 সরাসরি হোম ডেলিভারি</span>
                  আমরা কৃষকের কাছ থেকে পণ্য তুলে সরাসরি আপনার ঠিকানায় ২৪ থেকে ৪৮ ঘণ্টার মধ্যে পৌঁছে দিবো। মূল্য পরিশোধের সুযোগ পাবেন <strong>ক্যাশ অন ডেলিভারি (Cash on Delivery)</strong> মাধ্যমে।
                </div>

                {errorMsg && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-650 font-bold">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      আপনার নাম *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মুইক্তা বেগম"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200/80 bg-gray-50/50 py-2.5 px-3.5 text-xs outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      মোবাইল নম্বর *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="১১ ডিজিটের সচল নম্বর (যেমন: 01931355398)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-gray-200/80 bg-gray-50/50 py-2.5 px-3.5 text-xs outline-none focus:border-emerald-500 focus:bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      ডেলিভারি ঠিকানা *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="বাসা নম্বর, সড়ক, এলাকা এবং জেলা যেমন: ৪৭ ধাকেশ্বরী রোড, লালবাগ, ঢাকা-১২১১"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl border border-gray-200/80 bg-gray-50/50 py-2 px-3.5 text-xs outline-none focus:border-emerald-500 focus:bg-white leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-105">
                  <div className="flex items-center text-xs text-gray-500 font-medium justify-between mb-2">
                    <span>পরি পরিশোধের পদ্ধতি</span>
                    <span className="flex items-center gap-1 font-bold text-emerald-700">
                      <CreditCard className="h-3.5 w-3.5" />
                      ক্যাশ অন ডেলিভারি
                    </span>
                  </div>
                </div>
              </form>
            )
            }
          </div>

          {/* FOOTER TOTALS SECTION */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50 p-4 sm:p-6 space-y-4">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>মোট সাবটোটাল:</span>
                  <span className="font-bold text-gray-800">৳{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-600 font-bold">ফ্রি</strong> : `৳${deliveryFee}`}</span>
                </div>
                <div className="border-t border-gray-200 my-1 pt-1.5 flex justify-between text-sm font-black text-gray-800">
                  <span>সর্বমোট প্রদেয়:</span>
                  <span className="text-emerald-700 text-lg">৳{grandTotal}</span>
                </div>
              </div>

              {!isCheckingOut ? (
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 py-3 text-center text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  অর্ডার করুন (৳{grandTotal})
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => { setIsCheckingOut(false); setErrorMsg(''); }}
                    className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-center text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    ব্যাকে যান
                  </button>
                  <button
                    onClick={handleCheckoutSubmit}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-650 to-green-600 hover:from-emerald-710 hover:to-green-700 py-3 text-center text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {isSubmitting ? 'প্রসেসিং...' : 'কনফার্ম করুন'}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
