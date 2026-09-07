'use client';

import React from 'react';
import { Award } from 'lucide-react';
import { Booking } from '../../types';

export interface PortalImpactTabProps {
  bookings: Booking[];
  totalTreesPlanted: number;
}

export default function PortalImpactTab({
  bookings,
  totalTreesPlanted,
}: PortalImpactTabProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#15803D] flex items-center justify-center">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Eden Reforestation & Eco-Badges</h3>
          <p className="text-xs text-slate-500">Your personal environmental conservation footprint with Kibali Africa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-emerald-50/80 p-6 rounded-2xl border border-emerald-200 text-center space-y-2">
          <span className="text-3xl font-serif font-bold text-[#15803D] block">{totalTreesPlanted}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 block">Trees Planted Under Your Name</span>
          <p className="text-[11px] text-emerald-700">Planted in the Mau Forest Basin & Aberdare range with Eden Reforestation.</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-2">
          <span className="text-3xl font-serif font-bold text-[#0F1D36] block">{bookings.length}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">Expeditions Completed</span>
          <p className="text-[11px] text-slate-500">Safaris, crater climbs, and wilderness camping completed.</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-2">
          <span className="text-3xl font-serif font-bold text-[#0F1D36] block">Level 1</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">Wilderness Steward Badge</span>
          <p className="text-[11px] text-slate-500">Unlock VIP perks & gear discounts on future departures.</p>
        </div>
      </div>
    </div>
  );
}
