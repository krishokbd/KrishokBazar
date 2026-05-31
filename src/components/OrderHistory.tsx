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
  ChevronRight
} from 'lucide-react';

export const OrderHistory: React.FC = () => {
  const { currentUser, orders: contextOrders } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
        setOrders(filtered);
      }
    } catch (err) {
      console.error("Error fetching orders from Firestore:", err);
      setError("অর্ডার রেকর্ডসমূহ লোড করা সম্ভব হয়নি। দয়া করে আবার চেষ্টা করুন।");
      // safe fallback
      const filtered = contextOrders.filter(o => o.customerId === currentUser.id);
      setOrders(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser, contextOrders]);

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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-600 text-white shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" /> সম্পন্ন ✔
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-gray-100 text-gray-700 border border-gray-200">
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
            <FileText className="h-5 w-5 text-emerald-600" />
            বিস্তারিত অর্ডার ইতিহাস ও বিবরণী
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-sans">
            আপনার অ্যাকাউন্টের মাধ্যমে সম্পন্ন হওয়া সকল অর্ডারের তালিকা ও বিবরণ।
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-gray-150 transition-colors cursor-pointer select-none self-start sm:self-center"
        >
          <RotateCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          রিফ্রেশ করুন
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2 mb-6">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="text-xs text-gray-400 font-semibold mt-3">অর্ডার রেকর্ডসমূহ লোড হচ্ছে...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 stroke-1" />
          <h3 className="mt-4 text-xs font-bold text-gray-700">কোনো অর্ডার পাওয়া যায়নি!</h3>
          <p className="mt-1 text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            আপনি আমাদের ওয়েবসাইট থেকে এখনও কোনো অর্ডার প্লেস করেননি। আপনার পছন্দের তাজা ও পুষ্টিকর ফসল এখনই অর্ডার করুন।
          </p>
        </div>
      ) : (
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
                  <td className="px-4 py-4 font-semibold text-gray-600">
                    {new Date(order.createdAt).toLocaleString('bn-BD', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-800">
                    ৳{order.totalPrice} BDT
                  </td>
                  <td className="px-4 py-4 font-semibold">
                    <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
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
                      className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-black px-3 py-1.5 rounded-xl border border-emerald-100 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      দেখুন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              
              {/* Tracker Badge and Meta */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-emerald-50/55 rounded-2xl border border-emerald-100">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase font-mono">Courier Tracking Number</span>
                  <span className="text-xs font-black text-gray-800 font-mono tracking-wider flex items-center gap-1">
                    <Truck className="h-4 w-4 text-emerald-600" />
                    {selectedOrder.trackingNumber || 'TRK-PENDING'}
                  </span>
                </div>
                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">অর্ডারের বর্তমান অবস্থা</span>
                  <div className="mt-0.5">{getStatusBadge(selectedOrder.status)}</div>
                </div>
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
