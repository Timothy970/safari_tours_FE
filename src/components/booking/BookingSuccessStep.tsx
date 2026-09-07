'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Lock } from 'lucide-react';
import { Trip, Booking } from '../../types';
import BoardingPassCard from '../ui/BoardingPassCard';

export interface BookingSuccessStepProps {
  confirmedBooking: Booking;
  trip: Trip | null;
}

export default function BookingSuccessStep({
  confirmedBooking,
  trip,
}: BookingSuccessStepProps) {
  const tripTitle = trip?.title || confirmedBooking.trip_title || 'Expedition';
  const isFullyPaid = confirmedBooking.booking_status === 'fully_paid';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-emerald-100 text-[#15803D] rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F1D36]">
          {isFullyPaid ? 'Expedition Fully Paid & Confirmed!' : 'Expedition Spot Reserved!'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          {isFullyPaid
            ? `Your spot is locked for ${tripTitle}. Your official digital boarding pass and QR verification code have been generated below.`
            : `Your reservation is active for ${tripTitle}. Complete your remaining balance anytime in your portal to unlock your official QR Boarding Pass.`}
        </p>
      </div>

      {/* Boarding Pass Card (Only if fully paid) */}
      {isFullyPaid ? (
        <BoardingPassCard booking={confirmedBooking} />
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                Deposit / Partial Paid
              </span>
              <h3 className="font-serif text-lg font-bold text-[#0F1D36] mt-2">
                Booking Ref: {confirmedBooking.booking_reference}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Paid So Far</span>
              <span className="font-bold text-[#15803D] text-lg font-serif">
                KES {(confirmedBooking.amount_paid || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Trip</span>
              <span className="font-semibold text-[#0F1D36]">{tripTitle}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Departure Date</span>
              <span className="font-semibold text-[#0F1D36]">{trip?.departure_date || confirmedBooking.created_at}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Trip Cost</span>
              <span className="font-semibold text-[#0F1D36]">KES {confirmedBooking.total_amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-amber-800 font-bold bg-amber-50 p-3 rounded-2xl border border-amber-200">
              <span>Outstanding Balance</span>
              <span className="font-serif text-sm">
                KES {(confirmedBooking.outstanding_balance ?? (confirmedBooking.total_amount - (confirmedBooking.amount_paid || 0))).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-xs flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#0F1D36]">Pass Card Locked:</strong> Your digital QR boarding pass will unlock automatically once your remaining balance is paid in full before departure.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href="/portal"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg glow-green text-center"
        >
          Go to Traveler Portal & Group Chat
        </Link>
        <Link
          href="/events"
          className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-[#0F1D36] border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider text-center"
        >
          Browse More Events
        </Link>
      </div>
    </div>
  );
}
