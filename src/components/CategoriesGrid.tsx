/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../AppContext';
import * as LucideIcons from 'lucide-react';

interface CategoriesGridProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

// Map dynamic categories to beautiful, high-contrast Tailwind colors
const categoryThemeMap: Record<string, { bg: string; text: string; icon: string; border: string }> = {
  fruits: { bg: 'bg-red-50', text: 'text-red-700', icon: 'Apple', border: 'border-red-100' },
  vegetables: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'Leaf', border: 'border-emerald-100' },
  fish: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'Fish', border: 'border-blue-100' },
  meat: { bg: 'bg-rose-50', text: 'text-rose-700', icon: 'Beef', border: 'border-rose-100' },
  honey: { bg: 'bg-amber-50', text: 'text-amber-850', icon: 'Sparkles', border: 'border-amber-100' },
  spices: { bg: 'bg-orange-50', text: 'text-orange-750', icon: 'Flame', border: 'border-orange-100' },
  organic: { bg: 'bg-teal-50', text: 'text-teal-700', icon: 'ShieldCheck', border: 'border-teal-100' },
  'ready-to-cook': { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'ChefHat', border: 'border-indigo-100' },
  dairy: { bg: 'bg-sky-50', text: 'text-sky-700', icon: 'Milk', border: 'border-sky-100' },
  grains: { bg: 'bg-yellow-50', text: 'text-yellow-800', icon: 'Wheat', border: 'border-yellow-105' },
  rice: { bg: 'bg-lime-50', text: 'text-lime-700', icon: 'Wheat', border: 'border-lime-100' },
  eggs: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'Egg', border: 'border-amber-100' },
  greens: { bg: 'bg-green-50', text: 'text-green-700', icon: 'Sparkles', border: 'border-green-100' }
};

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({ selectedCategory, onSelectCategory }) => {
  const { categories, siteSettings } = useApp();

  return (
    <section className="py-4 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-3">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase block">
              {siteSettings?.sectionCategoriesSubtitleBn || 'পণ্য ও শ্রেণীবিভাগ'}
            </span>
            <h2 className="text-lg font-black text-gray-800 tracking-tight font-sans mt-0">
              {siteSettings?.sectionCategoriesTitleBn || 'ক্যাটাগরি অনুযায়ী শপিং করুন'}
            </h2>
          </div>
          <p className="text-[10px] text-gray-400 font-mono tracking-wide max-w-xs self-start sm:self-center">
            {categories.length} Categories • Directly Harvested • Verified Farmers
          </p>
        </div>

        {/* Categories Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="flex sm:grid overflow-x-auto pb-2 sm:pb-0 gap-2.5 scrollbar-thin scrollbar-thumb-emerald-150 scrollbar-track-transparent sm:grid-cols-5 md:grid-cols-10">
          
          {/* "ALL" Button Card */}
          <div
            onClick={() => onSelectCategory('all')}
            className={`flex flex-col items-center justify-center p-2 min-w-[80px] rounded-xl border transition-all cursor-pointer select-none text-center ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white border-emerald-600 shadow-sm scale-102 font-bold'
                : 'bg-white border-gray-100 text-gray-600 hover:border-emerald-200 hover:shadow-xs'
            }`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg mb-1.5 transition-colors ${
              selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <LucideIcons.LayoutGrid className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold block max-w-full truncate">সব ক্যাটাগরি</span>
            <span className="text-[8px] uppercase opacity-75 hidden sm:block font-mono tracking-wider mt-0.5">All Items</span>
          </div>

          {/* Individual Category Cards */}
          {categories.filter(cat => cat.isActive !== false).map((cat) => {
            const theme = categoryThemeMap[cat.id] || { bg: 'bg-gray-50', text: 'text-gray-600', icon: 'Leaf', border: 'border-gray-100' };
            const isSelected = selectedCategory === cat.id;

            // Resolve Lucide Icon dynamically
            const IconComponent = (LucideIcons as any)[theme.icon] || LucideIcons.Leaf;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-2 min-w-[82px] rounded-xl border transition-all cursor-pointer select-none text-center ${
                  isSelected
                    ? 'bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white border-emerald-600 shadow-sm scale-102 font-bold'
                    : `bg-white border-gray-100 text-gray-700 hover:border-emerald-300 hover:shadow-xs hover:scale-101`
                }`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg mb-1.5 transition-colors ${
                  isSelected ? 'bg-white/20 text-white' : `${theme.bg} ${theme.text}`
                }`}>
                  <IconComponent className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-semibold block max-w-full truncate font-sans">
                  {cat.nameBn}
                </span>
                <span className={`text-[7.5px] uppercase tracking-wider block font-mono mt-0.5 ${
                  isSelected ? 'text-emerald-100' : 'text-gray-400'
                }`}>
                  {cat.nameEn}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
