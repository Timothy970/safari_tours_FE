'use client';

import React from 'react';

import { Trip } from '../../types';
import { AddOnsData } from './BookingGuestStep';

export interface BookingSummaryCardProps {
  trip: Trip;
  guestCount: number;
  pricePerGuestKES: number;
  addOns: AddOnsData;
  promoApplied: boolean;
  promoCode: string;
  promoDiscount: number;
  paymentPlan: 'deposit' | 'custom' | 'full';
  currentStep: number;
  dueTodayKES: number;
  totalPayableKES: number;
}

export default function BookingSummaryCard({
  trip,
  guestCount,
  pricePerGuestKES,
  addOns,
  promoApplied,
  promoCode,
  promoDiscount,
  paymentPlan,
  currentStep,
  dueTodayKES,
  totalPayableKES,
}: BookingSummaryCardProps) {
  const baseRate = trip.base_price_kes * guestCount;
  let addOnTotal = 0;
  if (addOns.tentUpgrade) addOnTotal += 2000 * guestCount;
  if (addOns.droneVideo) addOnTotal += 3500;

  const remainingBalance = Math.max(0, totalPayableKES - dueTodayKES);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm sticky top-24 space-y-5">
      <h3 className="font-serif text-base font-bold text-[#0F1D36] border-b border-slate-100 pb-3">
        {currentStep === 1 ? 'Expedition Summary' : 'Final Order Summary'}
      </h3>

      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900">
          <img src={trip.featured_image_url} alt={trip.title} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-serif font-bold text-xs text-[#0F1D36] leading-tight">{trip.title}</h4>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            {trip.departure_date ? new Date(trip.departure_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Upcoming Departure'} &bull; {guestCount} Adventurer{guestCount > 1 ? 's' : ''}
          </span>
          <span className="text-[10px] font-bold text-[#15803D] block mt-0.5">
            {trip.destination}
          </span>
        </div>
      </div>

      <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Base Rates ({guestCount} spot{guestCount > 1 ? 's' : ''})</span>
          <span className="font-semibold text-[#0F1D36]">KES {baseRate.toLocaleString()}</span>
        </div>

        {addOnTotal > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Add-On Gear / Upgrades</span>
            <span className="font-semibold text-[#0F1D36]">KES {addOnTotal.toLocaleString()}</span>
          </div>
        )}

        {promoApplied && (
          <div className="flex justify-between text-[#15803D]">
            <span>Promo Discount ({promoCode})</span>
            <span className="font-bold">-KES {promoDiscount.toLocaleString()}</span>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-bold text-slate-700">
          <span>Total Event Cost</span>
          <span>KES {totalPayableKES.toLocaleString()}</span>
        </div>

        <div className="pt-2 border-t border-slate-200 flex justify-between items-center bg-emerald-50 p-3 rounded-2xl">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-900 block">Amount Due Today</span>
            <span className="text-[10px] text-slate-500 font-medium capitalize">
              Plan: {paymentPlan === 'deposit' ? 'Minimum Deposit' : paymentPlan === 'custom' ? 'Custom Installment' : 'Full Payment'}
            </span>
          </div>
          <span className="font-serif text-xl font-bold text-[#15803D]">
            KES {dueTodayKES.toLocaleString()}
          </span>
        </div>

        {remainingBalance > 0 && (
          <div className="flex justify-between text-[11px] text-slate-500 px-1">
            <span>Remaining Balance (Due before trail):</span>
            <span className="font-bold text-[#D97706]">KES {remainingBalance.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}
