/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { Order, OrderItem } from '../types';
import { useApp } from '../AppContext';
import { 
  FileText, 
  Eye, 
  RotateCw, 
  Calendar, 
  Tag, 
  CreditCard, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  ShoppingBag, 
  X,
  Phone,
  User,
  ShieldCheck,
  ChevronRight,
  Heart,
  ShoppingCart
} from 'lucide-react';

const getStatusRank = (status: Order['status']): number => {
  switch (status) {
    case 'Pending': return 0;
    case 'Confirmed':
    case 'Processing': return 1;
    case 'Packed': return 2;
    case 'Shipped':
    case 'Out for delivery': return 3;
    case 'Delivered': return 4;
    default: return 0;
  }
};

const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
  switch (currentStatus) {
    case 'Pending': return 'Confirmed';
    case 'Confirmed': return 'Processing';
    case 'Processing': return 'Packed';
    case 'Packed': return 'Shipped';
    case 'Shipped': return 'Out for delivery';
    case 'Out for delivery': return 'Delivered';
    case 'Delivered': return null;
    default: return 'Confirmed';
  }
};

interface Step {
  rank: number;
  title: string;
  subtitle: string;
  desc: string;
}

const OrderTrackerStepper: React.FC<{ order: Order }> = ({ order }) => {
  const currentRank = getStatusRank(order.status);

  // Define steps
  const steps: Step[] = [
    { rank: 1, title: 'অর্ডার নিশ্চিত', subtitle: 'Confirmed', desc: 'আপনার অর্ডারটি আমরা পেয়েছি এবং প্রস্তুতি শুরু করেছি।' },
    { rank: 2, title: 'প্যাকিং সম্পন্ন', subtitle: 'Packed', desc: 'খামার থেকে তাজা ফসল সংগ্রহ করে নিরাপদ প্যাকেজিং করা হচ্ছে।' },
    { rank: 3, title: 'শিপিং ও ট্রানজিট', subtitle: 'Shipped', desc: 'আমাদের নিবেদিত ডেলিভারি রাইডার আপনার ঠিকানার উদ্দেশ্যে রওনা দিয়েছেন।' },
    { rank: 4, title: 'ডেলিভারি সম্পন্ন', subtitle: 'Delivered', desc: 'শতভাগ সতেজ ও রাসায়নিক মুক্ত ফসল আপনার ঠিকানায় পৌঁছে দেওয়া হয়েছে।' },
  ];

  // Helper code inside to determine step state
  const getStepState = (stepRank: number) => {
    if (currentRank > stepRank) return 'completed';
    if (currentRank === stepRank) return 'active';
    if (stepRank === 1 && currentRank === 0) return 'active'; // Pending covers step 1 active
    return 'upcoming';
  };

  const getProgressPercentage = () => {
    if (currentRank <= 1) return 0;
    if (currentRank === 2) return 33.33;
    if (currentRank === 3) return 66.66;
    if (currentRank === 4) return 100;
    return 0;
  };

  return (
    <div className="w-full py-4 px-1 select-none">
      {/* Horizontal Progress Track */}
      <div className="relative flex items-center justify-between w-full">
        {/* Background Grey Path */}
        <div className="absolute left-[8%] right-[8%] top-[18px] h-1 bg-gray-150 rounded-full -z-0" />
        {/* Active Colored Path */}
        <div 
          className="absolute left-[8%] top-[18px] h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-700 ease-out -z-0"
          style={{ width: `calc(${getProgressPercentage()}% - (${getProgressPercentage()}% * 0.16))` }}
        />

        {/* Individual Step Nodes */}
        {steps.map((step) => {
          const state = getStepState(step.rank);
          const isCompleted = state === 'completed';
          const isActive = state === 'active';

          return (
            <div key={step.rank} className="flex flex-col items-center flex-1 relative z-10 select-none">
              {/* Stepper Dot Indicator */}
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ring-4 ${
                  isCompleted 
                    ? 'bg-emerald-600 text-white ring-emerald-100/50 border-2 border-emerald-500' 
                    : isActive 
                      ? 'bg-amber-555 text-white bg-amber-500 ring-amber-100/50 border-2 border-amber-400 animate-pulse' 
                      : 'bg-white text-gray-400 ring-gray-100/30 border-2 border-gray-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                ) : (
                  <span className="text-xs font-black font-sans">{step.rank}</span>
                )}
              </div>

              {/* Step Labels */}
              <div className="text-center mt-3 max-w-[120px] font-sans">
                <p className={`text-[11px] font-black leading-tight ${
                  isActive 
                    ? 'text-amber-800' 
                    : isCompleted 
                      ? 'text-emerald-805 text-emerald-800' 
                      : 'text-gray-400 font-semibold'
                }`}>
                  {step.title}
                </p>
                <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block mt-0.5">
                  {step.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Active Step Banner details */}
      <div className="mt-8 bg-emerald-50/45 border border-emerald-100/40 rounded-2xl p-4 sm:p-5 flex gap-4 items-start font-sans">
        <div className={`p-2.5 rounded-xl shrink-0 ${currentRank === 4 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {currentRank === 4 ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : currentRank === 3 ? (
            <Truck className="h-6 w-6" />
          ) : currentRank === 2 ? (
            <Package className="h-6 w-6" />
          ) : (
            <Clock className="h-6 w-6 opacity-85" />
          )}
        </div>
        <div className="space-y-1">
          <h4 className="font-extrabold text-xs sm:text-sm text-gray-800 block text-left">
            {currentRank === 4 ? '🌱 ডেলিভারি সম্পন্ন হয়েছে' : currentRank === 3 ? '🚴 রোড ট্রানজিটে চলমান' : currentRank === 2 ? '📦 ইকো-প্যাকিং চলছে' : '🌱 অর্ডার বুকিং নিশ্চিত'}
          </h4>
          <p className="text-[11.5px] text-gray-500 leading-relaxed text-left font-sans font-medium">
            {steps[currentRank <= 1 ? 0 : currentRank - 1]?.desc}
          </p>
        </div>
      </div>
    </div>
  );
};

interface OrderHistoryProps {
  setView?: (view: string) => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ setView }) => {
  const { 
    currentUser, 
    orders: contextOrders, 
    updateOrderStatus,
    products,
    wishlist,
    toggleWishlist,
    language,
    addToCart
  } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'orders' | 'wishlist'>('orders');

  const fetchOrders = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      if (isFirebaseConfigured && db) {
        const q = query(
          collection(db, 'orders'),
          where('customerId', '==', currentUser.id)
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((docSnap) => {
          fetchedOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
        });
        // Sort descending by date
        fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(fetchedOrders);
      } else {
        // Fallback to local storage / context synced orders if Firebase is not fully configured
        const filtered = contextOrders.filter(o => o.customerId === currentUser.id);
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(filtered);
      }
    } catch (err) {
      console.error("Error fetching orders from Firestore:", err);
      setError("অর্ডার রেকর্ডসমূহ লোড করা সম্ভব হয়নি। দয়া করে আবার চেষ্টা করুন।");
      // safe fallback
      const filtered = contextOrders.filter(o => o.customerId === currentUser.id);
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser, contextOrders]);

  // Handle auto simulation sync effect
  useEffect(() => {
    let timer: any;
    if (isSimulating && trackingOrderId) {
      timer = setInterval(() => {
        const orderToUpdate = orders.find(o => o.id === trackingOrderId);
        if (orderToUpdate) {
          const next = getNextStatus(orderToUpdate.status);
          if (next) {
            updateOrderStatus(trackingOrderId, next);
          } else {
            setIsSimulating(false);
          }
        } else {
          setIsSimulating(false);
        }
      }, 7000); // Trigger leap sync every 7 seconds
    }
    return () => clearInterval(timer);
  }, [isSimulating, trackingOrderId, orders, updateOrderStatus]);

  // Set default tracker order ID once orders list finishes loading
  useEffect(() => {
    if (orders.length > 0 && !trackingOrderId) {
      setTrackingOrderId(orders[0].id);
    }
  }, [orders, trackingOrderId]);

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-xs">
        <p className="text-sm text-gray-500 font-medium">অর্ডারের ইতিহাস দেখতে প্রথমে দয়া করে লগইন করুন।</p>
      </div>
    );
  }

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-700 border border-amber-100">
            <Clock className="w-3.5 h-3.5" /> পেন্ডিং ⏱
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-50 text-blue-700 border border-blue-100">
            <CheckCircle2 className="w-3.5 h-3.5" /> নিশ্চিত 🌱
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100">
            <RotateCw className="w-3.5 h-3.5 animate-spin-slow" /> প্রসেসিং 🌿
          </span>
        );
      case 'Packed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Package className="w-3.5 h-3.5" /> প্যাকড 📦
          </span>
        );
      case 'Shipped':
      case 'Out for delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-purple-50 text-purple-700 border border-purple-100">
            <Truck className="w-3.5 h-3.5" /> ডেলিভারিতে 🚴
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-600 text-white shadow-sm font-sans">
            <CheckCircle2 className="w-3.5 h-3.5" /> সম্পন্ন ✔
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-gray-100 text-gray-700 border border-gray-200 font-sans">
            {status}
          </span>
        );
    }
  };

  const getPaymentMethodLabel = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'COD':
        return 'ক্যাশ অন ডেলিভারি (COD)';
      case 'bKash':
        return 'বিকাশ (bKash)';
      case 'Nagad':
        return 'নগদ (Nagad)';
      default:
        return method;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-100 gap-4 mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-black text-gray-800 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-emerald-600" />
            {language === 'bn' ? 'বিস্তারিত তথ্য ও বিবরণী' : 'Account details & records'}
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-sans">
            {language === 'bn' ? 'আপনার অ্যাকাউন্টের মাধ্যমে সম্পন্ন হওয়া সকল অর্ডার ও উইশলিস্ট তালিকা।' : 'History of all your placed orders and saved items.'}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-150 transition-colors cursor-pointer select-none self-start sm:self-center"
        >
          <RotateCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          {language === 'bn' ? 'রিফ্রেশ করুন' : 'Refresh'}
        </button>
      </div>

      {/* DASHBOARD TABS SWITCHER */}
      <div className="flex gap-2.5 pb-2 mb-6 border-b border-gray-100 font-sans">
        <button
          onClick={() => setDashboardTab('orders')}
          className={`px-4 py-2.5 text-xs font-black rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
            dashboardTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-650 font-bold border border-gray-150'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {language === 'bn' ? `আমার অর্ডারসমূহ (${orders.length})` : `My Orders (${orders.length})`}
        </button>

        <button
          onClick={() => setDashboardTab('wishlist')}
          className={`px-4 py-2.5 text-xs font-black rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
            dashboardTab === 'wishlist'
              ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-650 font-bold border border-gray-150'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          {language === 'bn' ? `আমার উইশলিস্ট (${wishlist?.length || 0})` : `My Wishlist (${wishlist?.length || 0})`}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2 mb-6">
          <span>{error}</span>
        </div>
      )}

      {dashboardTab === 'orders' ? (
        loading ? (
          <div className="py-16 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent align-[-0.125em]" />
            <p className="text-xs text-gray-400 font-semibold mt-3">অর্ডার রেকর্ডসমূহ লোড হচ্ছে...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 stroke-1" />
            <h3 className="mt-4 text-xs font-bold text-gray-700 font-sans">কোনো অর্ডার পাওয়া যায়নি!</h3>
            <p className="mt-1 text-xs text-gray-400 max-w-sm mx-auto leading-relaxed font-sans">
              আপনি আমাদের ওয়েবসাইট থেকে এখনও কোনো অর্ডার প্লেস করেননি। আপনার পছন্দের তাজা ও পুষ্টিকর ফসল এখনই অর্ডার করুন।
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* REAL-TIME DYNAMIC VISUAL ORDER TRACKER BAR AREA */}
            <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-50/30 via-white to-gray-50/40 rounded-3xl border border-emerald-100/60 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -z-10" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1 font-sans">
                      রিয়েল-টাইম অর্ডার ট্র্যাকিং সিস্টেম
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-gray-400 font-semibold font-sans mt-0.5">আপনার সতেজ ফসলের নিরাপত্তা ও প্যাকেজিং স্ট্যাটাস লাইভ দেখুন</p>
                  </div>
                </div>

                {/* Order selector dropdown */}
                <div className="flex items-center gap-2 shrink-0 font-sans">
                  <span className="text-[10px] sm:text-xs font-bold text-gray-400">অর্ডার নির্বাচন করুন:</span>
                  <select
                    value={trackingOrderId || ''}
                    onChange={(e) => {
                      setTrackingOrderId(e.target.value);
                      setIsSimulating(false);
                    }}
                    className="rounded-xl border border-emerald-100 bg-white py-1.5 px-3 text-[11px] sm:text-xs font-black text-emerald-800 outline-none focus:border-emerald-600 shadow-xs cursor-pointer select-none"
                  >
                    {orders.map(o => (
                      <option key={o.id} value={o.id}>
                        অর্ডার: {o.id} ({o.status === 'Delivered' ? 'সম্পন্ন' : 'চলমান'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(() => {
                const activeOrder = orders.find(o => o.id === trackingOrderId) || orders[0];
                if (!activeOrder) return null;

                return (
                  <div className="space-y-4">
                    <OrderTrackerStepper order={activeOrder} />

                    {/* Real-time sync tracker simulation panel */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-mono font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl border border-emerald-200">
                          কুরিয়ার ট্র্যাকিং নং: {activeOrder.trackingNumber || 'TRK-981242-DH'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <button
                          onClick={() => {
                            const next = getNextStatus(activeOrder.status);
                            if (next) {
                              updateOrderStatus(activeOrder.id, next);
                            } else {
                              updateOrderStatus(activeOrder.id, 'Confirmed');
                            }
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-[11px] font-black px-4.5 py-2.5 rounded-2xl transition-all shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                          title="পরবর্তী ধাপে নিয়ে টেস্ট করতে ক্লিক করুন"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          ধাপ পরিবর্তন করুন (Simulate Status)
                        </button>

                        <button
                          onClick={() => setIsSimulating(!isSimulating)}
                          className={`font-sans text-[11px] font-black px-4.5 py-2.5 rounded-2xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                            isSimulating 
                              ? 'bg-amber-500 text-white hover:bg-amber-600 border border-amber-400' 
                              : 'bg-gray-100 hover:bg-gray-150 text-gray-700 border border-gray-200'
                          }`}
                        >
                          <span className={`block w-2.5 h-2.5 rounded-full ${isSimulating ? 'bg-white animate-ping' : 'bg-gray-400'}`} />
                          {isSimulating ? 'লাইভ সিমুলেশন চলছে...' : 'অটো-সিমুলেশন ট্রায়াল (Auto Sync)'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-150">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150">
                    <th className="px-5 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-center">অর্ডার আইডি</th>
                    <th className="px-4 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">তারিখ ও সময়</th>
                    <th className="px-4 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">টাকার পরিমাণ</th>
                    <th className="px-4 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">পেমেন্ট পদ্ধতি</th>
                    <th className="px-4 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-center">বর্তমান অবস্থা</th>
                    <th className="px-5 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">বিস্তারিত</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors text-xs text-gray-700">
                      <td className="px-5 py-4 text-center font-mono font-bold text-emerald-800">
                        {order.id}
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-650">
                        {new Date(order.createdAt).toLocaleString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-800 font-sans">
                        ৳{order.totalPrice} BDT
                      </td>
                      <td className="px-4 py-4 font-semibold">
                        <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg font-sans">
                          <CreditCard className="h-3 w-3 text-emerald-600" />
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-black px-3 py-1.5 rounded-xl border border-emerald-100 transition-colors cursor-pointer font-sans"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {language === 'bn' ? 'দেখুন' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* MY WISHLIST TAB CONTAINER VIEW */
        <div className="space-y-6">
          {(() => {
            const wishlistedProducts = products.filter(p => wishlist?.includes(p.id));
            if (wishlistedProducts.length === 0) {
              return (
                <div className="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6">
                  <Heart className="mx-auto h-12 w-12 text-rose-300 stroke-1 animate-pulse" />
                  <h3 className="mt-4 text-sm font-black text-gray-700 font-sans">
                    {language === 'bn' ? 'আপনার উইশলিস্ট খালি!' : 'Your Wishlist is Empty!'}
                  </h3>
                  <p className="mt-2 text-xs text-gray-400 max-w-sm mx-auto leading-relaxed font-sans">
                    {language === 'bn' 
                      ? 'আপনার পছন্দের তাজা ও প্রিমিয়াম ফসল সংরক্ষণ করতে পণ্যের কার্ডে থাকা হার্ট (Heart) আইকনে ক্লিক করুন।'
                      : 'Click the Heart icon on any product card to save your favorite fresh and premium farm items here.'}
                  </p>
                  {setView && (
                    <button 
                      onClick={() => { setView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="mt-6 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer select-none active:scale-95"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {language === 'bn' ? 'পণ্য বাজারে যান' : 'Go to Fresh Market'}
                    </button>
                  )}
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-1">
                {wishlistedProducts.map(prod => {
                  const isDiscounted = !!prod.discountPrice;
                  const finalPrice = prod.discountPrice || prod.price;

                  return (
                    <div 
                      key={prod.id} 
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-150 bg-white hover:shadow-lg hover:border-emerald-250 transition-all text-gray-800"
                    >
                      {/* Top-right heart button to remove directly */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(prod.id);
                        }}
                        className="absolute right-2.5 top-2.5 z-10 p-1.5 rounded-full bg-white/90 shadow-xs hover:bg-white text-rose-500 hover:text-rose-600 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-gray-100/40"
                        title={language === 'bn' ? 'উইশলিস্ট থেকে বাদ দিন' : 'Remove from wishlist'}
                      >
                        <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                      </button>

                      {/* Product Image */}
                      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                        <img 
                          src={(prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500'} 
                          alt={prod.title} 
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        {isDiscounted && (
                          <span className="absolute left-2 top-2 z-10 rounded bg-red-500 px-1.5 py-0.5 text-[8px] font-bold text-white uppercase shadow-xs">
                            {language === 'bn' ? 'ছাড়' : 'Offer'}
                          </span>
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="flex flex-1 flex-col p-3 text-left">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 font-sans mb-1">{prod.category}</span>
                        <h4 className="text-xs sm:text-sm font-black text-gray-800 line-clamp-1 mb-1" title={prod.title}>{prod.title}</h4>
                        <p className="text-[10px] text-gray-500 font-semibold mb-2 font-sans">চাষী: {prod.farmerName}</p>

                        <div className="flex items-baseline gap-1.5 mb-4 font-sans">
                          <span className="text-sm font-bold text-emerald-800 font-sans">৳{finalPrice} / {prod.unit}</span>
                          {isDiscounted && (
                            <span className="text-[10px] text-gray-400 line-through">৳{prod.price}</span>
                          )}
                        </div>

                        {/* Quick Actions (Add to Cart) */}
                        <div className="mt-auto pt-2">
                          <button
                            onClick={() => {
                              addToCart(prod, 1, finalPrice);
                              const msg = language === 'bn' ? `"${prod.title}" সফলভাবে আপনার কার্টে যোগ করা হয়েছে!` : `"${prod.title}" has been successfully added to your cart!`;
                              alert(msg);
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-black py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* DETAILED ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-gray-100 overflow-hidden text-gray-800 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-gray-50 border-b border-gray-100">
              <div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  বিস্তারিত অর্ডার ভিউয়ার
                </span>
                <h3 className="text-base font-black text-gray-800 mt-1 flex items-center gap-1.5">
                  অর্ডার নং: <span className="font-mono text-emerald-800 font-bold">{selectedOrder.id}</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Tracker Badge and Meta / Embedded visual Stepper inside modal */}
              <div className="p-5 bg-emerald-50/45 rounded-3xl border border-emerald-150/60 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100/50 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-gray-400 block uppercase font-sans">Courier Tracking Number</span>
                    <span className="text-xs font-black text-emerald-900 font-mono tracking-wider flex items-center gap-1">
                      <Truck className="h-4 w-4 text-emerald-600" />
                      {selectedOrder.trackingNumber || 'TRK-981242-DH'}
                    </span>
                  </div>
                  <div className="space-y-0.5 sm:text-right">
                    <span className="text-[9px] font-bold text-gray-400 block uppercase font-sans">সর্বশেষ ট্র্যাকিং স্ট্যাটাস</span>
                    <div className="mt-0.5">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                </div>

                {/* Progressive Visual Stepper inside detail viewer! */}
                <OrderTrackerStepper order={selectedOrder} />
              </div>

              {/* Grid block info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Customer / Delivery Details */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col justify-between">
                  <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-emerald-600" />
                    গ্রাহক ও গন্তব্য বিবরণী
                  </h4>
                  <div className="text-xs space-y-1.5 text-gray-700">
                    <p className="font-black text-gray-800">{selectedOrder.customerName}</p>
                    <p className="font-mono font-medium flex items-center gap-1 text-gray-500">
                      <Phone className="h-3 w-3" />
                      {selectedOrder.customerPhone}
                    </p>
                    <p className="leading-relaxed font-medium flex items-start gap-1.5 text-gray-600 break-words">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400 mt-0.5" />
                      <span>{selectedOrder.customerAddress}</span>
                    </p>
                  </div>
                </div>

                {/* Billing Details */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col justify-between">
                  <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                    বিলিং ও পেমেন্ট বিবরণী
                  </h4>
                  <div className="text-xs space-y-1.5 text-gray-700">
                    <p className="font-bold">পদ্ধতি: <span className="font-semibold text-gray-650">{getPaymentMethodLabel(selectedOrder.paymentMethod)}</span></p>
                    {selectedOrder.paymentTxId && (
                      <p className="font-mono text-[11px] bg-white border border-gray-150 px-2 py-1 rounded-lg block overflow-x-auto">
                        <span className="font-bold text-emerald-800 block mb-0.5">TxID:</span>
                        {selectedOrder.paymentTxId}
                      </p>
                    )}
                    <p className="font-semibold text-gray-650">অর্ডার সাবমিট সময়: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                </div>

              </div>

              {/* Order products list */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-emerald-600" />
                  কেনা প্রোডাক্টসমূহের তালিকা ({selectedOrder.products.length})
                </h4>

                <div className="divide-y divide-gray-100 border border-gray-150 rounded-2xl overflow-hidden bg-white">
                  {selectedOrder.products.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3 hover:bg-gray-50/50 transition-colors items-center text-xs">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="h-10 w-10 object-cover rounded-lg border border-gray-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-black text-gray-800 truncate" title={item.title}>{item.title}</h5>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">চাষী আইডি: {item.farmerId}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <strong className="block text-gray-800 font-mono font-bold">৳{item.price}</strong>
                        <span className="text-[10px] text-gray-400 font-mono">পরিমাণ: {item.quantity} কেজি</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sticky bottom total summary */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs font-sans">
                <span className="font-bold text-gray-500 uppercase tracking-wider">ডেলিভারি ফিসহ সর্বমোট পরিশোধিত মূল্য:</span>
                <span className="text-base sm:text-lg font-black text-emerald-800 block font-mono">
                  ৳{selectedOrder.totalPrice} BDT
                </span>
              </div>

            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
