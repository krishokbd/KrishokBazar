/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order } from '../types';

/**
 * Utility to generate a beautifully formatted PDF-style receipt for WhatsApp order confirmation.
 * This satisfies the requirement to itemize products, quantities (grams/kilograms), 
 * unit price, total amount, delivery fee, and customer delivery address.
 */
export function generateWhatsAppReceipt(order: Order, deliveryFee: number): string {
  const dhr = '========================================';
  const hr = '----------------------------------------';
  
  // Format Date
  const dateStr = order.createdAt 
    ? new Date(order.createdAt).toLocaleString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : new Date().toLocaleString('bn-BD');

  // Format payment method name in Bengali
  const paymentMethodText = 
    order.paymentMethod === 'COD' ? 'ক্যাশ অন ডেলিভারি (COD)' : 
    order.paymentMethod === 'bKash' ? 'বিকাশ (bKash) পেমেন্ট' : 
    order.paymentMethod === 'Nagad' ? 'নগদ (Nagad) পেমেন্ট' : order.paymentMethod;

  // Format tracking links
  const domainUrl = typeof window !== 'undefined' ? window.location.origin : 'https://krishokbazar.app';
  const invoiceLink = `${domainUrl}/invoice/${order.id}`;

  // Formulating the product items list
  let productItemsText = '';
  order.products.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    
    // Parse unit name (ensure grams/kilograms/pieces are clearly printed)
    const unitName = item.selectedUnit || 'টি';
    const quantityStr = `${item.quantity} ${unitName}`;
    
    // Line 1: Item Name (with number index)
    productItemsText += `${index + 1}. ${item.title}\n`;
    
    // Line 2: Details: Quantity x Unit Price = Total
    productItemsText += `   পরিমাণ: ${quantityStr} | দর: ৳${item.price} | মোট: ৳${itemTotal}\n`;
    
    // If item has a selected variation, list it
    if (item.variationName) {
      productItemsText += `   [ভেরিয়েশন: ${item.variationName}]\n`;
    }
  });

  const grandTotal = order.totalPrice + deliveryFee;

  return (
    `🧾 *অফিসিয়াল অর্ডার ইনভয়েস (OFFICIAL INVOICE)*\n` +
    `${dhr}\n` +
    `🆔 *অর্ডার আইডি:* #${order.id}\n` +
    `🚚 *কুরিয়ার ট্র্যাকিং:* ${order.trackingNumber || 'প্রক্রিয়াধীন'}\n` +
    `📅 *অর্ডার সময়:* ${dateStr}\n` +
    `${hr}\n` +
    `👤 *গ্রাহকের নাম:* ${order.customerName}\n` +
    `📞 *মোবাইল নম্বর:* ${order.customerPhone}\n` +
    `📍 *ডেলিভারি ঠিকানা:* ${order.customerAddress}\n` +
    `💳 *পেমেন্ট পদ্ধতি:* ${paymentMethodText}\n` +
    (order.paymentTxId ? `🔗 *পেমেন্ট ট্রানজেকশন ID:* ${order.paymentTxId}\n` : '') +
    `${hr}\n` +
    `🛍️ *অর্ডারকৃত পণ্যসমূহ:* \n\n` +
    `${productItemsText}` +
    `${hr}\n` +
    `💵 *সাবটোটাল মূল্য:* ৳${order.totalPrice}\n` +
    `🛵 *ডেলিভারি চার্জ:* ৳${deliveryFee}\n` +
    `${dhr}\n` +
    `💰 *সর্বমোট প্রদেয়:* ৳${grandTotal} BDT\n` +
    `${dhr}\n` +
    `📄 *ডিজিটাল কপি ও প্রিন্ট ইনভয়েস লিংক:* \n` +
    `🔗 ${invoiceLink}\n\n` +
    `✨ কৃষক বাজার অ্যাপ থেকে আপনার এলাকা-ভিত্তিক নিরাপদ ডেলিভারির জন্য সফলভাবে অর্ডারটি সাবমিট করা হয়েছে। ধন্যবাদ!`
  );
}
