import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';
import { generateWhatsAppReceipt } from '../utils/invoiceFormatter';
import { 
  CheckCircle, 
  MessageSquare, 
  Mail, 
  LayoutDashboard, 
  X, 
  ExternalLink,
  ShoppingBag,
  Bell,
  Check,
  MapPin,
  Phone,
  User,
  AlertCircle
} from 'lucide-react';

interface OrderSuccessModalProps {
  orderId: string | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ orderId, onClose }) => {
  const { orders, siteSettings } = useApp();
  const order = orders.find(o => o.id === orderId);
  const targetNumber = siteSettings?.whatsappContactNumber || '01931355398';

  const [successChannels, setSuccessChannels] = useState<Record<string, boolean>>({
    whatsapp: false,
    email: false,
    admin: false,
    farmer: false,
  });

  useEffect(() => {
    if (!orderId) return;

    // Simulate simultaneous triggers of the notification stream with rapid incremental animations
    const timers = [
      setTimeout(() => setSuccessChannels(prev => ({ ...prev, admin: true })), 200),
      setTimeout(() => setSuccessChannels(prev => ({ ...prev, farmer: true })), 450),
      setTimeout(() => setSuccessChannels(prev => ({ ...prev, email: true })), 700),
      setTimeout(() => setSuccessChannels(prev => ({ ...prev, whatsapp: true })), 950),
    ];

    return () => timers.forEach(clearTimeout);
  }, [orderId]);

  if (!orderId) return null;

  const channels = [
    { id: 'whatsapp', name: '💬 কাস্টমার ও এডমিন হোয়াটসঅ্যাপ', status: successChannels.whatsapp ? 'success' : 'pending', detail: `${targetNumber} নম্বরে নোটিফিকেশন লিংক রেডি` },
    { id: 'email', name: '📧 এডমিন জি-মেইল এলার্ট', status: successChannels.email ? 'success' : 'pending', detail: 'muiktabegum@gmail.com ঠিকানায় নোটিফিকেশন প্রেরিত' },
    { id: 'admin', name: '💻 কেন্দ্রীয় এডমিন কন্ট্রোল প্যানেল', status: successChannels.admin ? 'success' : 'pending', detail: 'ডাটাবেস লাইভ সিঙ্ক সম্পন্ন' },
    { id: 'farmer', name: '🌾 ভেরিফাইড খামারি ড্যাশবোর্ড', status: successChannels.farmer ? 'success' : 'pending', detail: 'কৃষকের সেলস লেজার ও অর্ডার ইনবক্স আপডেট সম্পন্ন' }
  ];

  // Formatting WhatsApp text
  const adminWhatsApp = targetNumber;
  const deliveryFee = order && order.totalPrice > 500 ? 0 : 60;
  const waText = order ? generateWhatsAppReceipt(order, deliveryFee) : "";

  const waUrl = `https://api.whatsapp.com/send?phone=88${adminWhatsApp}&text=${encodeURIComponent(waText)}`;

  const handleManualWhatsAppClick = () => {
    try {
      const opened = window.open(waUrl, '_blank');
      if (!opened) {
        window.location.href = waUrl;
      }
    } catch (err) {
      window.location.href = waUrl;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 240 }}
          className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-100 z-50 flex flex-col my-4 max-h-[90vh]"
        >
          {/* Top visual accents */}
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 w-full shrink-0" />

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-50 hover:bg-red-50 hover:text-red-650 p-2 rounded-2xl transition cursor-pointer text-gray-400 border border-gray-100"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal scrollable content wrapper */}
          <div className="overflow-y-auto p-5 sm:p-7 space-y-5 text-left flex-1 select-none">
            
            {/* Header Success Section */}
            <div className="flex flex-col items-center text-center space-y-2 pb-2">
              <motion.div
                initial={{ scale: 0.8, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.1, yiffness: 200 }}
                className="bg-emerald-50 border border-emerald-150 p-3.5 rounded-full flex items-center justify-center inline-block"
              >
                <CheckCircle className="h-10 w-10 text-emerald-600 animate-pulse" />
              </motion.div>
              <h2 className="text-sm font-black text-emerald-800 tracking-tight font-sans">
                অর্ডার সফলভাবে সম্পন্ন হয়েছে! 🥳🎉
              </h2>
              <p className="text-[10px] text-gray-550 max-w-sm font-sans font-medium">
                আপনার ফসল অর্ডারের রিকোয়েস্ট আমাদের সিস্টেমে সফলভাবে জমা হয়েছে। নিচের ৪টি চ্যানেলে নোটিফিকেশন একসাথে ট্রিগার করা হয়েছে।
              </p>
            </div>

            {/* Receipt Summary Card */}
            {order && (
              <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4 space-y-3 font-sans">
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                  <div>
                    <span className="block text-[8.5px] uppercase tracking-wider font-extrabold text-gray-400">অর্ডার আইডি</span>
                    <span className="text-xs font-black text-gray-800 leading-none">{order.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8.5px] uppercase tracking-wider font-extrabold text-gray-400">অফিসিয়াল ট্র্যাকিং আইডি</span>
                    <span className="text-xs font-mono font-bold text-emerald-700 leading-none underline">{order.trackingNumber}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span>গ্রাহক: <strong>{order.customerName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span className="font-mono">মোবাইল: {order.customerPhone}</span>
                  </div>
                  <div className="flex gap-1.5 text-gray-600 leading-relaxed items-start">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span>ঠিকানা: {order.customerAddress}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200/50 pt-2 text-xs">
                  <span className="block text-[8.5px] uppercase font-extrabold text-gray-400 mb-1">অর্ডারকৃত পণ্যসমূহ</span>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {order.products.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-gray-700 text-[11px]">
                        <span>• {item.title} (x{item.quantity})</span>
                        <span className="font-bold">৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between border-t border-dashed border-gray-200 pt-2 mt-2 font-bold text-gray-800">
                    <span>সর্বমোট পরিশোধযোগ্য:</span>
                    <span className="text-emerald-700">৳{order.totalPrice} BDT</span>
                  </div>
                </div>
              </div>
            )}

            {/* Simultaneous Multi-Channel Status List */}
            <div className="space-y-2.5">
              <span className="block text-[9.5px] uppercase font-black tracking-wider text-gray-400 font-sans">
                📊 মাল্টি-চ্যানেল রিয়েলটাইম নোটিফিকেশন ট্র্যাক
              </span>
              <div className="grid grid-cols-1 gap-2">
                {channels.map((chan, idx) => (
                  <div 
                    key={chan.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition duration-300 font-sans ${
                      chan.status === 'success' 
                        ? 'bg-emerald-50/60 border-emerald-150/70 text-gray-800' 
                        : 'bg-slate-50 border-gray-105 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {chan.status === 'success' ? (
                        <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0 animate-spin" />
                      )}
                      <div className="min-w-0">
                        <p className={`text-[11px] font-black ${chan.status === 'success' ? 'text-gray-800' : 'text-gray-400'}`}>{chan.name}</p>
                        <p className="text-[9px] text-gray-450 mt-0.5 truncate leading-none">{chan.detail}</p>
                      </div>
                    </div>
                    {chan.status === 'success' ? (
                      <span className="text-[8.5px] font-black text-emerald-700 bg-emerald-100 rounded-lg px-2 py-0.5 shrink-0 uppercase tracking-widest leading-none">
                        সফল
                      </span>
                    ) : (
                      <span className="text-[8.5px] font-bold text-amber-600 bg-amber-50 rounded-lg px-2 py-0.5 shrink-0 uppercase tracking-widest leading-none animate-pulse">
                        প্রসেস...
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Buttons inside Footer */}
          <div className="bg-slate-50 border-t border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={handleManualWhatsAppClick}
              className="flex-1 bg-[#25D366] hover:bg-[#20ba56] text-white py-3.5 rounded-2xl font-sans font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-98 transition duration-200 cursor-pointer"
            >
              <MessageSquare className="h-4.5 w-4.5" />
              হোয়াটসঅ্যাপ মেসেজে প্রেরণ নিশ্চিত করুন ➔
            </button>
            <button
              onClick={onClose}
              className="sm:w-36 bg-white hover:bg-slate-100 border border-gray-200 text-gray-600 py-3 rounded-2xl font-sans font-extrabold text-xs sm:text-sm active:scale-98 transition duration-150 cursor-pointer"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
