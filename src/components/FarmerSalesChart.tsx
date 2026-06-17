import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { Order, OrderItem } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { TrendingUp, BarChart3, Calendar, Package, ArrowUpRight, DollarSign, PieChart } from 'lucide-react';

export const FarmerSalesChart: React.FC = () => {
  const { orders, currentUser, products } = useApp();
  const [chartType, setChartType] = useState<'trend' | 'products'>('trend');

  // Verify there is a logged in farmer
  const farmerId = currentUser?.farmerId;

  // 1. Filter orders matching this farmer's products
  const farmerOrders = useMemo(() => {
    if (!farmerId) return [];
    return orders.filter(o => 
      o.products.some((p: OrderItem) => p.farmerId === farmerId)
    );
  }, [orders, farmerId]);

  // 2. Metrics Calculation
  const metrics = useMemo(() => {
    if (!farmerId || farmerOrders.length === 0) {
      return {
        totalRevenue: 0,
        totalItemsSold: 0,
        avgOrderValue: 0,
        topProduct: 'নেই'
      };
    }

    let revenue = 0;
    let itemsSold = 0;
    const productRevenues: Record<string, number> = {};

    farmerOrders.forEach(o => {
      // We only consider Delivered or Confirmed orders for verified revenue
      const isValidStatus = ['Delivered', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for delivery'].includes(o.status);
      if (!isValidStatus) return;

      o.products.forEach((p: OrderItem) => {
        if (p.farmerId === farmerId) {
          const itemRev = p.price * p.quantity;
          revenue += itemRev;
          itemsSold += p.quantity;

          productRevenues[p.title] = (productRevenues[p.title] || 0) + itemRev;
        }
      });
    });

    // Find top performing product
    let topProd = 'নেই';
    let maxRev = -1;
    Object.entries(productRevenues).forEach(([title, rev]) => {
      if (rev > maxRev) {
        maxRev = rev;
        topProd = title;
      }
    });

    const avg = farmerOrders.length > 0 ? Math.round(revenue / farmerOrders.length) : 0;

    return {
      totalRevenue: revenue,
      totalItemsSold: itemsSold,
      avgOrderValue: avg,
      topProduct: topProd.length > 20 ? topProd.substring(0, 20) + '...' : topProd
    };
  }, [farmerOrders, farmerId]);

  // 3. Prepare Sales Trend Data (Over Time / Dates)
  const trendData = useMemo(() => {
    if (!farmerId) return [];

    const dailyData: Record<string, { dateLabel: string, revenue: number, count: number, timestamp: number }> = {};

    // Get fallback past 7 days if no orders exist, to avoid an empty scale
    const datesList: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const isoDate = d.toISOString().split('T')[0];
      const displayLabel = d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
      
      dailyData[isoDate] = {
        dateLabel: displayLabel,
        revenue: 0,
        count: 0,
        timestamp: d.getTime()
      };
      datesList.push(isoDate);
    }

    // Aggregate real orders revenue
    farmerOrders.forEach(o => {
      if (!o.createdAt) return;
      const dateKey = o.createdAt.split('T')[0];
      
      let farmerOrderRevenue = 0;
      o.products.forEach((p: OrderItem) => {
        if (p.farmerId === farmerId) {
          farmerOrderRevenue += p.price * p.quantity;
        }
      });

      if (farmerOrderRevenue > 0) {
        const d = new Date(o.createdAt);
        const displayLabel = d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });

        if (dailyData[dateKey]) {
          dailyData[dateKey].revenue += farmerOrderRevenue;
          dailyData[dateKey].count += 1;
        } else {
          dailyData[dateKey] = {
            dateLabel: displayLabel,
            revenue: farmerOrderRevenue,
            count: 1,
            timestamp: d.getTime()
          };
        }
      }
    });

    // Sort chronologically and return
    return Object.values(dailyData)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(item => ({
        'তারিখ': item.dateLabel,
        'বিক্রি (৳)': item.revenue,
        'অর্ডার সংখ্যা': item.count
      }));
  }, [farmerOrders, farmerId]);

  // 4. Prepare Most Profitable Products Data
  const productProfitData = useMemo(() => {
    if (!farmerId) return [];

    const productStats: Record<string, { title: string, revenue: number, quantity: number }> = {};

    farmerOrders.forEach(o => {
      const isValidStatus = ['Delivered', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for delivery'].includes(o.status);
      if (!isValidStatus) return;

      o.products.forEach((p: OrderItem) => {
        if (p.farmerId === farmerId) {
          if (!productStats[p.productId]) {
            productStats[p.productId] = {
              title: p.title,
              revenue: 0,
              quantity: 0
            };
          }
          productStats[p.productId].revenue += p.price * p.quantity;
          productStats[p.productId].quantity += p.quantity;
        }
      });
    });

    // Convert to array and sort by revenue descending
    return Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5) // Top 5
      .map(item => ({
        'ফসল': item.title.length > 12 ? item.title.substring(0, 12) + '...' : item.title,
        'মোট আয় (৳)': item.revenue,
        'বিক্রির পরিমাণ': item.quantity
      }));
  }, [farmerOrders, farmerId]);

  // Render empty state if no sales yet
  const hasSales = farmerOrders.some(o => 
    ['Delivered', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for delivery'].includes(o.status)
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs text-left space-y-5">
      
      {/* Chart Header block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-50">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 block shrink-0">
              <TrendingUp className="h-4.5 w-4.5" />
            </span>
            <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">বিক্রি ও ফসল সাপেক্ষ বিশ্লেষণ (Sales Analytics)</h3>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">রিয়েল-টাইম অর্ডার হিস্ট্রি থেকে সংগৃহীত ফসল ভিত্তিক লাভ ও অগ্রগতির চিত্র</p>
        </div>
        
        {/* Toggle buttons */}
        <div className="flex bg-gray-55 p-1 rounded-xl self-start sm:self-auto border border-gray-100">
          <button
            onClick={() => setChartType('trend')}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer flex items-center gap-1 ${chartType === 'trend' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Calendar className="h-3.5 w-3.5" />
            বিক্রি ট্রেন্ড
          </button>
          <button
            onClick={() => setChartType('products')}
            className={`px-3 py-1.5 rounded-lg text-[10.5px] font-black transition-all cursor-pointer flex items-center gap-1 ${chartType === 'products' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            সেরা ৫ ফসল
          </button>
        </div>
      </div>

      {/* KPI Metrics Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 text-left relative overflow-hidden group hover:shadow-xs transition">
          <div className="absolute top-2.5 right-2.5 text-emerald-500 opacity-20">
            <DollarSign className="h-8 w-8" />
          </div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">মোট অর্জিত আয়</span>
          <strong className="text-base sm:text-lg font-black text-emerald-700 block font-sans mt-1">৳{metrics.totalRevenue}</strong>
          <span className="text-[8.5px] text-gray-400 mt-1 block font-medium">ডেলিভারি ও প্রসেসিং অর্ডার</span>
        </div>
        
        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 text-left relative overflow-hidden group hover:shadow-xs transition">
          <div className="absolute top-2.5 right-2.5 text-blue-500 opacity-20">
            <Package className="h-8 w-8" />
          </div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">বিক্রিত ফসল পরিমাণ</span>
          <strong className="text-base sm:text-lg font-black text-blue-700 block font-sans mt-1">{metrics.totalItemsSold} টি</strong>
          <span className="text-[8.5px] text-gray-400 mt-1 block font-medium">মোট খামারি ওজনের ফসল</span>
        </div>

        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 text-left relative overflow-hidden group hover:shadow-xs transition">
          <div className="absolute top-2.5 right-2.5 text-amber-500 opacity-20">
            <ArrowUpRight className="h-8 w-8" />
          </div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">গড় অর্ডার ভ্যালু</span>
          <strong className="text-base sm:text-lg font-black text-amber-600 block font-sans mt-1">৳{metrics.avgOrderValue}</strong>
          <span className="text-[8.5px] text-gray-400 mt-1 block font-medium">প্রতি গ্রাহক ঝুড়ির গড় মূল্য</span>
        </div>

        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5 text-left relative overflow-hidden group hover:shadow-xs transition">
          <div className="absolute top-2.5 right-2.5 text-purple-500 opacity-20">
            <PieChart className="h-8 w-8" />
          </div>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">সেরা লাভজনক ফসল</span>
          <strong className="text-xs sm:text-[13px] font-black text-purple-700 block mt-1.5 truncate leading-tight" title={metrics.topProduct}>
            {metrics.topProduct}
          </strong>
          <span className="text-[8.5px] text-gray-400 mt-1 block font-medium">সবচেয়ে বেশি আয়কৃত ফসল</span>
        </div>
      </div>

      {/* Actual Recharts Chart */}
      <div className="h-64 sm:h-72 w-full bg-slate-50/30 rounded-2xl border border-gray-100/60 p-3 sm:p-4 select-none">
        {!hasSales ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-2 p-6">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 animate-pulse">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h4 className="text-xs font-black text-gray-700">রিয়েল-টাইম গ্রাফ সক্রিয় হচ্ছে</h4>
            <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed">
              আপনার আপলোড করা ফসলে কাস্টমারের অর্ডার আসার সাথে সাথেই দিন ভিত্তিক ও ফসল ভিত্তিক রঙিন অগ্রগতির তালিকা এখানে তৈরি হবে।
            </p>
          </div>
        ) : chartType === 'trend' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="তারিখ" 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0', 
                  backgroundColor: '#ffffff',
                  fontSize: '11px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontWeight: 'bold',
                  textAlign: 'left'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }}
                iconType="circle"
              />
              <Area 
                type="monotone" 
                dataKey="বিক্রি (৳)" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                name="বিক্রি বা আয় (৳)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={productProfitData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="ফসল" 
                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0', 
                  backgroundColor: '#ffffff',
                  fontSize: '11px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontWeight: 'bold',
                  textAlign: 'left'
                }}
              />
              <Bar 
                dataKey="মোট আয় (৳)" 
                fill="#8b5cf6" 
                radius={[8, 8, 0, 0]}
                name="মোট আয় (৳)"
                maxBarSize={32}
              >
                {productProfitData.map((entry, index) => {
                  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];
                  return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
};
