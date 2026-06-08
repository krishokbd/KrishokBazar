import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useApp } from '../AppContext';
import { X, Trash2, Save, Image, Check, Sparkles, ArrowRight, Upload } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

// Client-side image compression downscaling utility
const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error("শুধুমাত্র ছবি আপলোড করা যাবে!"));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ product, isOpen, onClose }) => {
  const { editProduct, deleteProduct, categories } = useApp();

  // Local Form States
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isReadyToCook, setIsReadyToCook] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [unit, setUnit] = useState('kg');
  const [harvestDate, setHarvestDate] = useState('');

  // Deletion guard
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleImageFileChange = async (files: FileList | null) => {
    if (!files) return;
    setUploadError('');
    setIsUploading(true);

    const uploadedUrls: string[] = [...uploadedImages].filter(Boolean);
    const filesArray = Array.from(files);

    if (uploadedUrls.length + filesArray.length > 5) {
      alert("সর্বোচ্চ ৫টি ছবি আপলোড করা যাবে!");
      setIsUploading(false);
      return;
    }

    try {
      for (const file of filesArray) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`ছবি "${file.name}" ৫ মেগাবাইটের বেশি বড়। দয়া করে ছোট ছবি নির্বাচন করুন!`);
          continue;
        }

        let blobToUpload: Blob;
        try {
          blobToUpload = await compressImage(file);
        } catch (compErr) {
          console.warn("Compression failed, uploading original:", compErr);
          blobToUpload = file;
        }

        if (storage) {
          const fileRef = ref(storage, `products/${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${file.name}`);
          await uploadBytes(fileRef, blobToUpload);
          const downloadUrl = await getDownloadURL(fileRef);
          uploadedUrls.push(downloadUrl);
        } else {
          const dataUrl = await new Promise<string>((res) => {
            const r = new FileReader();
            r.onload = () => res(r.result as string);
            r.readAsDataURL(blobToUpload);
          });
          uploadedUrls.push(dataUrl);
        }
      }
      setUploadedImages(uploadedUrls);
    } catch (err: any) {
      console.error("Image upload failed:", err);
      setUploadError("ছবি আপলোডে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsUploading(false);
    }
  };

  // Sync state with product when modal opens
  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setPrice(product.price);
      setHasDiscount(!!product.discountPrice);
      setDiscountPrice(product.discountPrice);
      setDescription(product.description);
      setCategory(product.category);
      setStock(product.stock);
      setUploadedImages(product.images || []);
      setIsReadyToCook(!!product.isReadyToCook);
      setIsFeatured(!!product.isFeatured);
      setUnit(product.unit || 'kg');
      setHarvestDate(product.harvestDate || '');
      setConfirmDelete(false);
      setSuccessAnimation(false);
      setUploadError('');
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handlePresetSelect = (presetType: string) => {
    // Elegant Unsplash agricultural presets for fast replacing
    if (presetType === 'vegetables') {
      setUploadedImages([
        'https://images.unsplash.com/photo-1566385101042-1a0104524c61?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=80'
      ]);
    } else if (presetType === 'fruits') {
      setUploadedImages([
        'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&auto=format&fit=crop&q=80'
      ]);
    } else if (presetType === 'fish') {
      setUploadedImages([
        'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1574786198875-49f5d09bfde3?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80'
      ]);
    } else if (presetType === 'honey') {
      setUploadedImages([
        'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&auto=format&fit=crop&q=80'
      ]);
    } else if (presetType === 'grains') {
      setUploadedImages([
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1501250936402-43163a2d93c1?w=600&auto=format&fit=crop&q=80'
      ]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImgs = uploadedImages.filter(Boolean);
    if (finalImgs.length === 0) {
      finalImgs.push('https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500');
    }

    const updatedData: Partial<Product> = {
      title,
      price: Number(price),
      discountPrice: hasDiscount ? Number(discountPrice) : undefined,
      description,
      category,
      stock: Number(stock),
      isReadyToCook,
      isFeatured,
      unit,
      images: finalImgs,
      harvestDate: harvestDate || undefined,
    };

    editProduct(product.id, updatedData);
    setSuccessAnimation(true);

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    deleteProduct(product.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-emerald-100 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-650 px-6 py-4 text-white flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-700 text-emerald-50 font-black px-2 py-0.5 rounded uppercase">ADMIN CONTROL</span>
            <h3 className="text-sm sm:text-base font-black font-sans leading-none">প্রোডাক্ট তথ্য সম্পাদনা করুন (Edit Product)</h3>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full bg-black/10 p-1.5 text-white hover:bg-black/20 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Scrolling Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50 min-h-0">
          
          {successAnimation && (
            <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-emerald-800 text-center font-bold text-xs sm:text-sm animate-pulse">
              🎉 সফলভাবে প্রোডাক্টটির নতুন তথ্য সংরক্ষণ করা হয়েছে!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Name/Title Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 font-sans">পণ্যের শিরোনাম (Product Title)</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: রাজশাহীর বাঘা রাসায়নিকমুক্ত তাজা গোপালভোগ আম"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-emerald-500 shadow-sm"
              />
            </div>

            {/* Price & Discount Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 font-sans">মূল্য (Price BDT ৳)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="৳ প্রতি কেজি বা পিস"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-emerald-500 shadow-sm font-semibold text-emerald-700"
                />
              </div>

              <div className="flex flex-col justify-end pb-1">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasDiscount}
                    onChange={(e) => {
                      setHasDiscount(e.target.checked);
                      if (e.target.checked && !discountPrice) {
                        setDiscountPrice(Math.round(price * 0.9)); // default 10% off
                      }
                    }}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 shrink-0"
                  />
                  <span>মূল ছাড় (Discount Price)?</span>
                </label>
              </div>

              {hasDiscount && (
                <div>
                  <label className="block text-xs font-bold text-red-700 mb-1.5 font-sans">ছাড়কৃত মূল্য (Discounted Price BDT ৳)</label>
                  <input
                    type="number"
                    min="1"
                    max={price - 1}
                    value={discountPrice || ''}
                    onChange={(e) => setDiscountPrice(Number(e.target.value))}
                    placeholder="ছাড়ের টাকা"
                    className="w-full rounded-xl border border-red-200 bg-red-50/20 px-4 py-2.5 text-xs outline-none focus:border-red-500 shadow-sm font-semibold text-red-600"
                  />
                </div>
              )}
            </div>

            {/* Category, Stock, Features Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 font-sans">ক্যাটাগরি নির্ধারণ (Category)</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-emerald-500 shadow-sm text-gray-700 font-bold"
                >
                  <option value="fruits">Fruits (ফলমূল)</option>
                  <option value="vegetables">Vegetables (শাকসবজি)</option>
                  <option value="fish">Fish (মাছ)</option>
                  <option value="meat">Meat (মাংস)</option>
                  <option value="honey">Honey (খাঁটি মধু)</option>
                  <option value="spices">Spices (মসলাপাতি)</option>
                  <option value="organic">Organic (জৈব খাবার)</option>
                  <option value="ready-to-cook">Ready-to-Cook (রেডি-টু-কুক)</option>
                  <option value="dairy">Dairy (দুগ্ধজাত)</option>
                  <option value="grains">Grains (শস্য ও ডাল)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 font-sans font-mono">স্টক পরিমাণ (Stock)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  placeholder="যেমন: ৫০"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-emerald-500 shadow-sm text-gray-700 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 font-sans">পরিমাপের একক (Unit)</label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="kg, piece, dozen, 500g"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-emerald-500 shadow-sm text-gray-700 font-bold font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 font-sans">ফসল কাটার তারিখ (Harvest Date)</label>
                <input
                  type="text"
                  value={harvestDate}
                  onChange={(e) => setHarvestDate(e.target.value)}
                  placeholder="যেমন: ১ জুন, ২০২৬ বা June 1, 2026"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-emerald-500 shadow-sm text-gray-700 font-bold font-sans"
                />
              </div>

              <div className="flex flex-col gap-2.5 justify-end pb-1 text-xs">
                <label className="flex items-center gap-1.5 font-bold text-gray-650 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isReadyToCook}
                    onChange={(e) => setIsReadyToCook(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>🍳 Ready-to-Cook</span>
                </label>
                <label className="flex items-center gap-1.5 font-bold text-gray-650 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>⭐ হোমপেজ ফিচার্ড</span>
                </label>
              </div>
            </div>

            {/* Description Description Box */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 font-sans">পণ্যের আকর্ষণীয় বিবরণ (Description)</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="পণ্যের গুণগত মান, পুষ্টিগুণ বা ফলনের সংক্ষিপ্ত ইতিবাচক বর্ণনা দিন..."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs outline-none focus:border-emerald-500 shadow-sm h-24 resize-none leading-relaxed font-sans"
              />
            </div>

            {/* Premium Images Controller Section */}
            <div className="border border-emerald-100 rounded-2xl p-4 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <Image className="h-4.5 w-4.5 text-emerald-650" />
                  <span className="text-xs font-black">পণ্যের গ্যালারি ছবিসমূহ (images - ৫টি পর্যন্ত)</span>
                </div>
                {/* Instant image preset inject clicker */}
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">PRESET ACCELERATORS</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-gray-400 font-semibold">পণ্য অনুযায়ী ডেমো ইমেজ বসান:</span>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('vegetables')}
                  className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold cursor-pointer hover:bg-emerald-100"
                >
                  🥬 শাকসবজি Preset
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('fruits')}
                  className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold cursor-pointer hover:bg-emerald-100"
                >
                  🍎 ফলমূল Preset
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('fish')}
                  className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold cursor-pointer hover:bg-emerald-100"
                >
                  🐟 দেশী মাছ Preset
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('honey')}
                  className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold cursor-pointer hover:bg-emerald-100"
                >
                  🍯 খাঁটি মধু Preset
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('grains')}
                  className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold cursor-pointer hover:bg-emerald-100"
                >
                  🌾 শস্য & ডাল Preset
                </button>
              </div>

              {/* Drag and Drop Zone */}
              <div 
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleImageFileChange(e.dataTransfer.files);
                  }
                }}
                onClick={() => document.getElementById('edit-image-upload-input')?.click()}
                className="w-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/25 active:bg-emerald-50/40 rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group shadow-inner"
              >
                <input 
                  id="edit-image-upload-input"
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleImageFileChange(e.target.files)}
                />
                <Upload className="h-6 w-6 text-emerald-600 group-hover:scale-110 transition duration-200" />
                <div className="space-y-1">
                  <p className="font-bold text-emerald-800 text-[11px] font-sans">নতুন ছবি ড্র্যাগ করুন অথবা ক্লিক করে আপলোড করুন (সর্বোচ্চ ৫টি ছবি)</p>
                  <p className="text-[9.5px] text-gray-500 font-medium font-sans">ছবিগুলো সংকুচিত হয়ে সরাসরি স্টোরেজে আপলোড হবে</p>
                </div>
              </div>

              {/* Error Indicator */}
              {uploadError && (
                <p className="text-[10px] text-red-650 font-bold leading-none animate-pulse font-sans">❌ {uploadError}</p>
              )}

              {/* Paste Image Links directly Field */}
              <div className="mt-2 pt-2 border-t border-dashed border-gray-100">
                <label className="block text-[11px] font-black text-gray-750 mb-1 hover:text-emerald-800">
                  🔗 직접 이미지 লিংক পেস্ট করুন (Pasted URLs - প্রতি লাইনে একটি করে লিংক দিন):
                </label>
                <textarea
                  rows={2}
                  value={uploadedImages.filter(Boolean).join('\n')}
                  onChange={(e) => {
                    const parsed = e.target.value.split('\n').map(u => u.trim()).filter(Boolean);
                    setUploadedImages(parsed);
                  }}
                  placeholder="এখানে আপনার ছবির ওয়েব লিংক (যেমন: https://images.unsplash.com/...) পেস্ট করুন। প্রতি লাইনে একটি করে লিংক দিবেন।"
                  className="w-full rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-white text-[10px] text-gray-700 font-mono p-3 outline-none focus:border-emerald-500 transition duration-150 leading-relaxed"
                />
                <p className="text-[9px] text-gray-400 font-medium">পিসির কিবোর্ড থেকে কপি করা ইমেজ ও ওয়েব আর্ট লিংকগুলো এখানে পেস্ট করলেই কার্ডে লাইভ প্রদর্শিত হবে।</p>
              </div>

              {/* Progress Slider Indicator */}
              {isUploading && (
                <div className="flex items-center justify-center gap-2 text-[11px] font-black text-emerald-700 animate-pulse bg-emerald-50 border border-emerald-100 rounded-xl p-2 font-sans">
                  <div className="h-3.5 w-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span>ছবি আপলোড ও কমпресс করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</span>
                </div>
              )}

              {/* Live Uploaded Images Strip */}
              <div className="pt-2 border-t border-gray-100 font-sans">
                <div className="flex items-center justify-between mb-2">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">তাত্ক্ষণিক ইমেজ গ্যালারি প্রিভিউ ({uploadedImages.filter(Boolean).length} / ৫)</span>
                  <button 
                    type="button" 
                    onClick={() => setUploadedImages([])}
                    className="text-[9.5px] text-red-500 hover:underline font-bold"
                  >
                    সবগুলো মুছে ফেলুন
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {uploadedImages.filter(Boolean).map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center group shadow-xs">
                      <img 
                        src={url} 
                        alt={`uploaded-product-${idx}`} 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500';
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setUploadedImages(prev => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1 right-1 bg-red-650/90 hover:bg-red-700 text-white rounded-full p-0.5 shadow transition cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-bold text-center py-0.5 leading-none">
                        ছবি {idx + 1}
                      </div>
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 5 - uploadedImages.filter(Boolean).length) }).map((_, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-150 border-dashed bg-gray-50/50 flex flex-col items-center justify-center text-[9px] text-gray-400">
                      <Image className="h-4.5 w-4.5 mb-1 text-gray-300" />
                      <span>ফাঁকা</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Action Block */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-5 py-2.5 text-xs font-bold text-gray-500 transition-all cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                তথ্য সংরক্ষণ করুন (Save Updates)
              </button>
            </div>

          </form>

          {/* DANGER DELETION ZONE */}
          <div className="border border-red-200 rounded-2xl p-4 bg-red-50/20 mt-6 space-y-2.5">
            <h4 className="text-xs font-black text-red-800 uppercase flex items-center gap-1.5 leading-none">
              ⚠️ ডেঞ্জার জোন: প্রোডাক্ট অপসারণ (Danger Zone)
            </h4>
            <p className="text-[10px] text-gray-400 font-medium leading-normal">
              এই প্রোডাক্টটি কৃষক বাজারের মার্কেটপ্লেস থেকে স্থায়ীভাবে মুছে ফেলার জন্য নিচের বোতামটি চাপুন। এটি করা হলে তা আর ফেরত আনা যাবে না।
            </p>
            <div>
              <button
                type="button"
                onClick={handleDelete}
                className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  confirmDelete 
                    ? 'bg-red-650 hover:bg-red-700 text-white animate-bounce' 
                    : 'bg-red-50 border border-red-200 hover:bg-red-100 text-red-700'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                {confirmDelete ? 'হ্যাঁ, প্রোডাক্ট ডিলিট নিশ্চিত করুন!' : 'এই প্রোডাক্টটি স্থায়ীভাবে মুছে ফেলুন (Delete Product)'}
              </button>
              {confirmDelete && (
                <button 
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="mt-2 text-[10px] text-gray-450 hover:underline font-bold block"
                >
                  মুছে ফেলার আবেদন বাতিল করুন
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
