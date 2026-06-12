import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { HarvestAlert } from '../types';
import { Bell, MapPin, Plus, Calendar, Trash2, X, Sparkles, Check, CheckCircle2, ChevronRight } from 'lucide-react';

interface SeasonalHarvestBannerProps {
  onViewCrop: (alert: HarvestAlert) => void;
  onOpenAuthModal?: () => void;
}

export const SeasonalHarvestBanner: React.FC<SeasonalHarvestBannerProps> = ({
  onViewCrop,
  onOpenAuthModal
}) => {
  const { 
    currentUser, 
    language, 
    harvestAlerts, 
    addHarvestAlert, 
    deleteHarvestAlert,
    products
  } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  // Form states
  const [cropNameBn, setCropNameBn] = useState('');
  const [cropNameEn, setCropNameEn] = useState('');
  const [statusBn, setStatusBn] = useState<HarvestAlert['statusBn']>('সদ্য সংগৃহীত');
  const [statusEn, setStatusEn] = useState<HarvestAlert['statusEn']>('Just Harvested');
  const [harvestDate, setHarvestDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
  });
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [productId, setProductId] = useState('');

  // Suffix/Preset options of clean images based on crop name selection
  const imagePresets = [
    { nameBn: 'মিষ্টি আম (Mango)', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80' },
    { nameBn: 'তাজা সবজি (Winter Veg)', url: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&auto=format&fit=crop&q=80' },
    { nameBn: 'লাল কচি লিচু (Litchi)', url: 'https://images.unsplash.com/photo-1421167418805-7f170a738eb4?w=600&auto=format&fit=crop&q=80' },
    { nameBn: 'প্রাকৃতিক শস্য ও মধু (Honey)', url: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&auto=format&fit=crop&q=80' },
    { nameBn: 'দেশী সুগন্ধি চাল (Rice)', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80' }
  ];

  // Timer logic for interval display: 1st entry show immediately.
  // Then close schedules next show in 10 minutes, then 20 minutes, then 30 minutes.
  useEffect(() => {
    if (!harvestAlerts || harvestAlerts.length === 0) return;

    const checkVisibility = () => {
      const nextTimeStr = localStorage.getItem('kb_harvest_alert_next');
      if (!nextTimeStr) {
        // First entry - show immediately!
        setIsVisible(true);
      } else {
        const nextTime = Number(nextTimeStr);
        if (Date.now() >= nextTime) {
          setIsVisible(true);
        }
      }
    };

    // Check on load
    checkVisibility();

    // Check again every 5 seconds
    const interval = setInterval(checkVisibility, 5000);
    return () => clearInterval(interval);
  }, [harvestAlerts]);

  // Rotator to cycle through alerts if multiple exist
  useEffect(() => {
    if (!harvestAlerts || harvestAlerts.length <= 1 || !isVisible) return;
    const rotate = setInterval(() => {
      setCurrentAlertIndex(prev => (prev + 1) % harvestAlerts.length);
    }, 12000); // cycle every 12 seconds
    return () => clearInterval(rotate);
  }, [harvestAlerts, isVisible]);

  const handleStatusChange = (valBn: string) => {
    if (valBn === 'সদ্য সংগৃহীত') {
      setStatusBn('সদ্য সংগৃহীত');
      setStatusEn('Just Harvested');
    } else if (valBn === 'আগামীকাল সংগ্রহ') {
      setStatusBn('আগামীকাল সংগ্রহ');
      setStatusEn('Harvesting Tomorrow');
    } else {
      setStatusBn('আসন্ন');
      setStatusEn('Upcoming');
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropNameBn || !cropNameEn || !descriptionBn || !descriptionEn) {
      alert(language === 'bn' ? 'দয়া করে সবগুলো ক্ষেত্র পূরণ করুন।' : 'Please fill out all required fields.');
      return;
    }

    const farmerName = currentUser?.name || 'মুহাম্মদ আব্দুর রশিদ';
    const district = (currentUser as any)?.district || 'রাজশাহী';
    const selectedImage = imageUrl || imagePresets[0].url;

    addHarvestAlert(
      cropNameBn,
      cropNameEn,
      farmerName,
      district,
      selectedImage,
      statusBn,
      statusEn,
      harvestDate,
      descriptionBn,
      descriptionEn,
      productId || undefined
    );

    // Reset forms and show the newly posted alert
    setCropNameBn('');
    setCropNameEn('');
    setDescriptionBn('');
    setDescriptionEn('');
    setImageUrl('');
    setProductId('');
    setIsFormOpen(false);
    setIsVisible(true);
    setCurrentAlertIndex(0);
  };

  // Close with custom scheduling logic: Once closed, scheduled to reappear after 10m, then 20m, then 30m.
  const handleCloseBanner = () => {
    setIsVisible(false);

    // Read current stage (defaults to 0)
    let currentStage = Number(localStorage.getItem('kb_harvest_alert_stage') || '0');
    
    // Determine wait time in milliseconds
    let waitMs = 10 * 60 * 1000; // default 10 minutes
    if (currentStage === 0) {
      waitMs = 10 * 60 * 1000; // Stage 0 -> Stage 1 in 10 mins
      localStorage.setItem('kb_harvest_alert_stage', '1');
    } else if (currentStage === 1) {
      waitMs = 20 * 60 * 1000; // Stage 1 -> Stage 2 in 20 mins
      localStorage.setItem('kb_harvest_alert_stage', '2');
    } else if (currentStage === 2) {
      waitMs = 30 * 60 * 1000; // Stage 2 -> Stage 3 in 30 mins
      localStorage.setItem('kb_harvest_alert_stage', '3');
    } else {
      waitMs = 30 * 60 * 1000; // Repeat every 30 minutes
      localStorage.setItem('kb_harvest_alert_stage', '3');
    }

    const nextTime = Date.now() + waitMs;
    localStorage.setItem('kb_harvest_alert_next', String(nextTime));
  };

  // Filter list of products for direct linking (if farmer, filter their own products)
  const availableProducts = products.filter(p => {
    if (currentUser?.role === 'Farmer') {
      return p.farmerId === currentUser.id;
    }
    return true;
  });

  // If no harvest alerts exist, show nothing
  if (!harvestAlerts || harvestAlerts.length === 0) return null;

  // Retrieve current active alert card
  const activeAlertIndex = Math.min(currentAlertIndex, harvestAlerts.length - 1);
  const alertItem = harvestAlerts[activeAlertIndex] || harvestAlerts[0];
  if (!alertItem) return null;

  const isJustHarvested = alertItem.statusEn === 'Just Harvested';
  const isTomorrow = alertItem.statusEn === 'Harvesting Tomorrow';

  return (
    <>
      {/* FLOATING FLOATER NOTIFICATION BOX */}
      {isVisible && (
        <div className="fixed bottom-4 right-4 z-50 max-w-[350px] sm:max-w-[400px] w-full bg-white border-2 border-amber-200 rounded-3xl shadow-xl p-3 sm:p-4 text-left font-sans select-none animate-fadeIn flex flex-col gap-2">
          
          {/* Top Row with Header and skip Action */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 shrink-0">
            <div className="flex items-center gap-1.5 text-amber-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-500 animate-spin" />
                {language === 'en' ? 'Live Crop Announcement' : 'মাঠ থেকে সরাসরি লাইভ অ্যালার্ট'}
              </span>
            </div>
            
            {/* Elegant and quick close button */}
            <button 
              onClick={handleCloseBanner}
              className="text-[10px] flex items-center gap-0.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-lg text-gray-500 hover:text-gray-700 transition cursor-pointer font-bold uppercase tracking-wider"
              title={language === 'en' ? 'Skip' : 'এড়িয়ে যান'}
            >
              <span>{language === 'en' ? 'Skip' : 'বাদ দিন'}</span>
              <X className="h-3 w-3 font-black" />
            </button>
          </div>

          {/* Core Content Body with Image and Detail */}
          <div className="flex gap-2.5 items-start">
            {/* Left Column Image */}
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-150">
              <img 
                src={alertItem.imageUrl} 
                alt={alertItem.cropNameBn} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-black text-center py-0.5 truncate flex items-center justify-center gap-0.5">
                <MapPin className="h-2 w-2 text-amber-400" />
                {alertItem.district}
              </span>
            </div>

            {/* Right Column details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-black uppercase text-white ${
                  isJustHarvested 
                    ? 'bg-emerald-600' 
                    : isTomorrow 
                      ? 'bg-amber-600 animate-pulse' 
                      : 'bg-blue-600'
                }`}>
                  {language === 'en' ? alertItem.statusEn : alertItem.statusBn}
                </span>
                
                <span className="text-[8px] text-gray-400 font-bold flex items-center gap-0.5">
                  <Calendar className="h-2.5 w-2.5" />
                  {alertItem.harvestDate}
                </span>
              </div>

              <h4 className="text-xs font-black text-gray-900 truncate leading-snug">
                {language === 'en' ? alertItem.cropNameEn : alertItem.cropNameBn}
              </h4>
              <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed mt-0.5">
                {language === 'en' ? alertItem.descriptionEn : alertItem.descriptionBn}
              </p>
            </div>
          </div>

          {/* Footer and Interactive trigger order row */}
          <div className="border-t border-gray-100 pt-2 flex items-center justify-between gap-2">
            <div className="min-w-0 text-left">
              <span className="text-[8px] text-gray-400 font-bold block leading-none">
                {language === 'en' ? 'Farmer Name' : 'উৎপাদনকারী খামারি'}
              </span>
              <span className="text-[10px] font-black text-emerald-800 truncate block mt-0.5">
                🧑‍🌾 {alertItem.farmerName} ✓
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {currentUser?.role === 'Admin' && (
                <button
                  onClick={() => {
                    if (confirm(language === 'bn' ? 'বিজ্ঞপ্তিটি ডিলিট করতে চান?' : 'Delete announcement?')) {
                      deleteHarvestAlert(alertItem.id);
                    }
                  }}
                  className="p-1 px-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}

              <button
                onClick={() => {
                  onViewCrop(alertItem);
                  handleCloseBanner();
                }}
                className="bg-emerald-600 hover:bg-emerald-700 hover:scale-102 font-black text-white text-[10px] py-1.5 px-3 rounded-xl transition flex items-center gap-0.5 shadow-sm"
              >
                <span>{language === 'en' ? 'Quick Buy' : 'কিনুন 🛍️'}</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Dashboard Action for Farmer / Admin to broadcast alerts */}
      {(currentUser?.role === 'Farmer' || currentUser?.role === 'Admin') && (
        <div className="fixed bottom-4 left-4 z-40">
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[11px] px-3.5 py-2.5 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer border border-emerald-505"
          >
            <Plus className="h-4 w-4" />
            <span>{language === 'en' ? 'Add Crop Alert' : 'ফসল অ্যালার্ট দিন'}</span>
          </button>
        </div>
      )}

      {/* Dynamic Publish Harvest Announcement Dialog Portal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-3xs animate-fadeIn">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-150 animate-scaleIn select-none">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base sm:text-lg font-black text-gray-850 flex items-center gap-2">
                🌾 {language === 'en' ? 'Publish Seasonal Harvest Alert' : 'ফসল কাটার নতুন ঘোষণা তৈরি করুন'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="rounded-full hover:bg-gray-100 p-1.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Crop Name (Bangla) *' : 'ফসল বা শস্যের নাম (বাংলায়) *'}
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="যেমন- রাজশাহীর হিমসাগর আম, কুষ্টিয়ার ফুলকপি"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-200 focus:border-emerald-650 font-medium"
                  value={cropNameBn}
                  onChange={(e) => setCropNameBn(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Crop Name (English) *' : 'ফসল বা শস্যের নাম (ইংরেজিতে) *'}
                </label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Organic Rajshahi Himsagar, Fresh Kushtia Cauliflower"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-200 focus:border-emerald-650 font-sans font-medium"
                  value={cropNameEn}
                  onChange={(e) => setCropNameEn(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Harvest Status *' : ' ফসল তোলার অবস্থা *'}
                  </label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-200 focus:border-emerald-650"
                    value={statusBn}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <option value="সদ্য সংগৃহীত">সদ্য সংগৃহীত (Just Harvested)</option>
                    <option value="আগামীকাল সংগ্রহ">আগামীকাল সংগ্রহ (Harvest Tomorrow)</option>
                    <option value="আসন্ন">আসন্ন (Upcoming)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Harvest / Est. Date *' : 'উত্তোলন বা আনুমানিক তারিখ *'}
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="যেমন: ১০ জুন ২০২৬ বা ৮ জুন"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-200 focus:border-emerald-650 font-medium"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Select Image Preset' : 'ছবির প্রিসেট বেছে নিন'}
                  </label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-200"
                    onChange={(e) => setImageUrl(e.target.value)}
                    value={imageUrl}
                  >
                    <option value="">নির্বাচন করুন (Select preset)</option>
                    {imagePresets.map((preset, idx) => (
                      <option key={idx} value={preset.url}>{preset.nameBn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                    {language === 'en' ? 'Linked Product *' : 'মার্কেটপ্লেসের পণ্য লিংক *'}
                  </label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-200"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                  >
                    <option value="">নির্বাচন করুন (Select Marketplace listing)</option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Description (Bangla) *' : 'বিস্তারিত বিবরণ (বাংলায়) *'}
                </label>
                <textarea 
                  rows={2}
                  required
                  placeholder="ফসল উঠানোর বিবরণ দিন (স্বাদ, বৈশিষ্ট্য ও ডেলিভারি সময়)"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-200 font-medium"
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
                  {language === 'en' ? 'Description (English) *' : 'বিস্তারিত বিবরণ (ইংরেজিতে) *'}
                </label>
                <textarea 
                  rows={2}
                  required
                  placeholder="Short summary of harvest condition, taste profile and shipping options"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-200 font-sans font-medium"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-650 rounded-xl text-xs font-bold transition cursor-pointer border border-gray-200"
                >
                  {language === 'en' ? 'Cancel' : 'বাতিল'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-805 text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-4.5 w-4.5" />
                  {language === 'en' ? 'Publish Bulletin' : 'বুলেটিন প্রকাশ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
