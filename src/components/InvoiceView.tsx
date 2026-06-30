/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../AppContext';
import { Printer, ArrowLeft, CheckCircle2, MapPin, Phone, User, Calendar, CreditCard, ShoppingBag, ShieldCheck } from 'lucide-react';

interface InvoiceViewProps {
  orderId: string;
  onBackToDashboard?: () => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({ orderId, onBackToDashboard }) => {
  const { orders, language } = useApp();
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    const foundOrder = orders.find(o => o.id.toUpperCase() === orderId.toUpperCase());
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, [orders, orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-150 shadow-sm max-w-md w-full text-center space-y-4">
          <div className="h-16 w-16 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto text-xl">⚠️</div>
          <h3 className="font-black text-slate-800 text-sm sm:text-base">ইনভয়েস পাওয়া যায়নি (Invoice Not Found)</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            দুঃখিত, #<span className="font-mono font-bold text-red-600">{orderId}</span> আইডি বিশিষ্ট কোনো অর্ডার খুঁজে পাওয়া যায়নি।
          </p>
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              ড্যাশবোর্ডে ফিরে যান
            </button>
          )}
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const deliveryFee = order.totalPrice > 500 ? 0 : 60;
  const subtotal = order.totalPrice;
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 no-print font-sans flex flex-col items-center">
      {/* Back & Print Controls */}
      <div className="max-w-2xl w-full flex items-center justify-between mb-4 no-print">
        {onBackToDashboard ? (
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 text-xs font-black text-gray-600 hover:text-emerald-700 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-3xs cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            ড্যাশবোর্ডে ফিরে যান
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-xs cursor-pointer"
        >
          <Printer className="h-4 w-4" />
          ইনভয়েস প্রিন্ট করুন / PDF ডাউনলোড
        </button>
      </div>

      {/* Invoice Page Container (Styled as White Paper) */}
      <div 
        id="print-invoice"
        className="max-w-2xl w-full bg-white border border-gray-250 p-6 sm:p-10 shadow-lg rounded-2xl relative text-slate-800 font-sans print:border-none print:shadow-none print:p-0 print:rounded-none"
      >
        {/* Top Header Watermark Style */}
        <div className="border-b-4 border-double border-slate-700 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-750 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-150">আরিকতাজ এআই (Riktaz AI)</span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 mt-1.5">কৃষক বাজার লিমিটেড</h1>
            <p className="text-[10.5px] text-gray-500 mt-1">সরাসরি কৃষকের খেত থেকে শতভাগ খাঁটি ও সতেজ অর্গানিক ফসলের বাজার</p>
          </div>
          <div className="sm:text-right">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">অর্ডার মেমো / ইনভয়েস</h2>
            <p className="text-[11px] font-mono font-bold text-emerald-800 mt-1"># {order.id}</p>
            <p className="text-[9.5px] font-mono text-gray-400 mt-0.5">কুরিয়ার ট্র্যাকিং: {order.trackingNumber}</p>
          </div>
        </div>

        {/* Invoice Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-150">
          {/* Customer info */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-wider">ডেলিভারি ঠিকানা ও গ্রাহক:</h3>
            <div className="text-xs space-y-1 text-slate-800">
              <p className="font-black text-sm flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-gray-400" />
                {order.customerName}
              </p>
              <p className="font-mono font-semibold text-gray-600 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                {order.customerPhone}
              </p>
              <p className="font-medium text-gray-650 flex items-start gap-1.5 leading-relaxed">
                <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>{order.customerAddress}</span>
              </p>
            </div>
          </div>

          {/* Billing metadata */}
          <div className="space-y-2 sm:text-right">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-wider sm:block">বিল ও অর্ডার বিবরণী:</h3>
            <div className="text-xs space-y-1 text-slate-800 flex flex-col sm:items-end">
              <p className="font-semibold flex items-center gap-1.5 sm:justify-end text-gray-600">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>অর্ডার তারিখ:</span>
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </p>
              <p className="font-semibold flex items-center gap-1.5 sm:justify-end text-gray-600">
                <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                <span>পেমেন্ট পদ্ধতি:</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {order.paymentMethod === 'COD' ? 'ক্যাশ অন ডেলিভারি (COD)' : order.paymentMethod}
                </span>
              </p>
              {order.paymentTxId && (
                <p className="font-mono text-[10.5px] text-gray-500 mt-1">
                  TxID: {order.paymentTxId}
                </p>
              )}
              <p className="text-[10px] font-bold text-emerald-800 mt-1 bg-emerald-50 border border-emerald-150 rounded px-2 py-0.5 inline-block">
                🚀 সরাসরি এলাকা-ভিত্তিক দ্রুত হোম ডেলিভারি
              </p>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="py-6">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-700 bg-slate-50 text-slate-700 font-sans font-bold">
                <th className="py-2.5 px-3 text-center w-12">ক্র.নং</th>
                <th className="py-2.5 px-2">পণ্য বিবরণী (Product Details)</th>
                <th className="py-2.5 px-2 text-center w-24">পরিমাণ (Quantity)</th>
                <th className="py-2.5 px-2 text-right w-24">একক মূল্য</th>
                <th className="py-2.5 px-3 text-right w-24">মোট মূল্য</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {order.products.map((item: any, idx: number) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 text-center font-mono font-medium text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-2">
                      <div className="font-black text-slate-950 text-xs">{item.title}</div>
                      {item.variationName && (
                        <div className="text-[9.5px] text-slate-500 font-bold mt-0.5">প্রকার: {item.variationName}</div>
                      )}
                      <div className="text-[9px] text-gray-400 font-semibold mt-0.5 font-mono">ফার্মার আইডি: {item.farmerId}</div>
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-slate-800">
                      {item.quantity} {item.selectedUnit || 'কেজি'}
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-gray-650">৳{item.price}</td>
                    <td className="py-3 px-3 text-right font-mono font-black text-slate-900">৳{itemTotal}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bill Calculations Card */}
        <div className="border-t-2 border-dashed border-slate-700 pt-6 flex flex-col items-end">
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600 font-semibold">
              <span>সাবটোটাল (Subtotal):</span>
              <span className="font-mono text-slate-900">৳{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600 font-semibold">
              <span>ডেলিভারি চার্জ (Delivery):</span>
              <span className="font-mono text-slate-900">
                {deliveryFee === 0 ? <strong className="text-emerald-700 font-bold">ফ্রি (Free)</strong> : `৳${deliveryFee}`}
              </span>
            </div>
            <div className="border-t border-gray-200 my-1 pt-1.5 flex justify-between text-sm font-black text-slate-950">
              <span>সর্বমোট প্রদেয় (Grand Total):</span>
              <span className="text-emerald-800 text-base font-mono">৳{grandTotal} BDT</span>
            </div>
          </div>
        </div>

        {/* Terms & Footer */}
        <div className="mt-10 pt-6 border-t border-slate-150 text-center space-y-2 select-none">
          <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-[11px]">
            <ShieldCheck className="h-4 w-4" />
            <span>শতভাগ ভেজালমুক্ত ও খাঁটি দেশীয় খামারের খাদ্যদ্রব্য নিশ্চয়তা</span>
          </div>
          <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-md mx-auto">
            এটি একটি গুগল এআই স্টুডিও অনুমোদিত আরিকতাজ ডিজিটাল মেমো। আপনার কোনো প্রশ্ন থাকলে সরাসরি আমাদের অফিসিয়াল নম্বরে যোগাযোগ করুন। ধন্যবাদ!
          </p>
        </div>
      </div>

      {/* Embedded print styles */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          #print-invoice {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
