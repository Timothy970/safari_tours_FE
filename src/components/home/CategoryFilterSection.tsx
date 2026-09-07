'use client';

import React from 'react';
import { Footprints, Tent, Waves, Flame, Search } from 'lucide-react';

export interface CategoryFilterSectionProps {
  selectedCategory: 'All' | 'Hikes' | 'Campings' | 'Fun Activities';
  setSelectedCategory: (cat: 'All' | 'Hikes' | 'Campings' | 'Fun Activities') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function CategoryFilterSection({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}: CategoryFilterSectionProps) {
  const categories = [
    { label: 'All', icon: Flame, desc: 'All Escapes' },
    { label: 'Hikes', icon: Footprints, desc: 'Day & Multi-Day Trails' },
    { label: 'Campings', icon: Tent, desc: 'Bonfires & Starry Nights' },
    { label: 'Fun Activities', icon: Waves, desc: 'Rafting, Cycling & Safaris' },
  ] as const;

  return (
    <section className="bg-[#0F1D36] text-white py-6 border-y border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#15803D] text-white shadow-lg glow-green'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#15803D]'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mountains, lakes, parks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/10 border border-white/15 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#15803D] focus:bg-white/15 transition-all"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
