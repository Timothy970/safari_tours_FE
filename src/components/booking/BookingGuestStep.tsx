'use client';

import React from 'react';
import { Phone, Tent, ArrowRight, Clock, Calendar, MapPin } from 'lucide-react';
import { Trip } from '../../types';

export interface LeadGuestData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dietary: string;
  emergencyContact: string;
  specialRequirements: string;
}

export interface AddOnsData {
  tentUpgrade: boolean;
  droneVideo: boolean;
}

export interface BookingGuestStepProps {
  trip: Trip;
  guestCount: number;
  setGuestCount: (count: number | ((prev: number) => number)) => void;
  leadGuest: LeadGuestData;
  setLeadGuest: React.Dispatch<React.SetStateAction<LeadGuestData>>;
  addOns: AddOnsData;
  setAddOns: React.Dispatch<React.SetStateAction<AddOnsData>>;
  pricePerGuestKES: number;
  totalBeforePromoKES: number;
  onContinue: () => void;
}

export default function BookingGuestStep({
  trip,
  guestCount,
  setGuestCount,
  leadGuest,
  setLeadGuest,
  addOns,
  setAddOns,
  pricePerGuestKES,
  totalBeforePromoKES,
  onContinue,
}: BookingGuestStepProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onContinue();
      }}
      className="space-y-6"
    >
      {/* Event Fixed Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Calendar className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Fixed Event Schedule</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Set by Admin</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Departure Date & Time</span>
            <span className="font-bold text-[#0F1D36] block text-sm">
              {trip.departure_date ? new Date(trip.departure_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Scheduled Weekend'}
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#15803D]" />
              <span>{(trip as any).departure_time || '05:30 AM Meeting Time'}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Meeting & Pick-Up Location</span>
            <span className="font-bold text-[#0F1D36] block text-sm">{(trip as any).pickup_location || 'Nairobi CBD / Kencom / City Hall'}</span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#15803D]" />
              <span>{trip.destination || 'Kenya'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Guest Count Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0F1D36]">How Many Travelers?</h3>
            <p className="text-xs text-slate-500">Select total spots you want to reserve on this departure.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={guestCount <= 1}
              onClick={() => setGuestCount((prev) => Math.max(1, prev - 1))}
              className="w-10 h-10 rounded-2xl border border-slate-200 hover:border-[#15803D] disabled:opacity-30 text-[#0F1D36] font-bold text-lg flex items-center justify-center transition-all"
            >
              -
            </button>
            <span className="w-8 text-center font-serif text-xl font-bold text-[#0F1D36]">{guestCount}</span>
            <button
              type="button"
              disabled={guestCount >= (trip.total_seats || 25)}
              onClick={() => setGuestCount((prev) => prev + 1)}
              className="w-10 h-10 rounded-2xl border border-slate-200 hover:border-[#15803D] disabled:opacity-30 text-[#0F1D36] font-bold text-lg flex items-center justify-center transition-all"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Lead Traveler Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Lead Adventurer Details</h3>
          <p className="text-xs text-slate-500">This contact receives digital boarding passes, booking vouchers, and ranger updates.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Timothy Mwangi"
              value={leadGuest.fullName}
              onChange={(e) => setLeadGuest({ ...leadGuest, fullName: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] text-xs font-semibold text-[#0F1D36] focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Email Address *</label>
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={leadGuest.email}
              onChange={(e) => setLeadGuest({ ...leadGuest, email: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] text-xs font-semibold text-[#0F1D36] focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Safaricom / M-Pesa Phone *</label>
            <input
              type="tel"
              required
              placeholder="0712345678 or 254712345678"
              value={leadGuest.phoneNumber}
              onChange={(e) => setLeadGuest({ ...leadGuest, phoneNumber: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] text-xs font-semibold text-[#0F1D36] focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Dietary Preference</label>
            <select
              value={leadGuest.dietary}
              onChange={(e) => setLeadGuest({ ...leadGuest, dietary: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] text-xs font-semibold text-[#0F1D36] focus:outline-none transition-all bg-white"
            >
              <option value="Standard Meal">Standard Expedition Cuisine</option>
              <option value="Vegetarian">Strict Vegetarian</option>
              <option value="Vegan">Vegan (Plant-Based)</option>
              <option value="Halal">Halal Certified</option>
              <option value="Gluten-Free">Gluten-Free / Celiac</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Emergency Contact (Name & Phone)</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe - 0722000000"
              value={leadGuest.emergencyContact}
              onChange={(e) => setLeadGuest({ ...leadGuest, emergencyContact: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] text-xs font-semibold text-[#0F1D36] focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">Special Notes or Medical Conditions</label>
            <input
              type="text"
              placeholder="e.g. Mild asthma, first-time mountain climb"
              value={leadGuest.specialRequirements}
              onChange={(e) => setLeadGuest({ ...leadGuest, specialRequirements: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D] text-xs font-semibold text-[#0F1D36] focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Add-ons and Gear Upgrades */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Optional Gear & Upgrades</h3>
          <p className="text-xs text-slate-500">Enhance your wilderness comfort and capture cinematic summit memories.</p>
        </div>

        <div className="space-y-3">
          <label
            className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
              addOns.tentUpgrade ? 'border-[#15803D] bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={addOns.tentUpgrade}
                onChange={(e) => setAddOns({ ...addOns, tentUpgrade: e.target.checked })}
                className="mt-1 accent-[#15803D] w-4 h-4 rounded"
              />
              <div>
                <span className="font-bold text-xs text-[#0F1D36] block">Private Luxury Tent & Sub-Zero Sleeping Bag</span>
                <span className="text-[11px] text-slate-500">Dedicated private 2-man dome tent and sub-zero sleeping bag upgrade.</span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#15803D] shrink-0">+KES {(2000 * guestCount).toLocaleString()}</span>
          </label>

          <label
            className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
              addOns.droneVideo ? 'border-[#15803D] bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={addOns.droneVideo}
                onChange={(e) => setAddOns({ ...addOns, droneVideo: e.target.checked })}
                className="mt-1 accent-[#15803D] w-4 h-4 rounded"
              />
              <div>
                <span className="font-bold text-xs text-[#0F1D36] block">Pro 4K Summit Drone & Highlight Reel</span>
                <span className="text-[11px] text-slate-500">Edited 60-second cinematic 4K reel + raw high-res summit aerial photos.</span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#15803D] shrink-0">+KES 3,500</span>
          </label>
        </div>
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        className="w-full py-4 bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 shadow-lg glow-green"
      >
        <span>Proceed to Step 2: Payment & Gateways</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
