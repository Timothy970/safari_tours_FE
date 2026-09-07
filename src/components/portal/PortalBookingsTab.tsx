'use client';

import React from 'react';
import Link from 'next/link';
import { Luggage, Phone, Lock } from 'lucide-react';
import { Booking } from '../../types';
import BoardingPassCard from '../ui/BoardingPassCard';

export interface PortalBookingsTabProps {
  bookings: Booking[];
  selectedBookingForPass: Booking | null;
  setSelectedBookingForPass: (booking: Booking | null) => void;
  openPayBalanceModal: (booking: Booking) => void;
  openReviewModal: (booking: Booking) => void;
}

export default function PortalBookingsTab({
  bookings,
  selectedBookingForPass,
  setSelectedBookingForPass,
  openPayBalanceModal,
  openReviewModal,
}: PortalBookingsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <Luggage className="w-12 h-12 text-[#15803D] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-xl text-[#0F1D36] font-bold">No active event tickets found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            You don’t have any upcoming event bookings yet. Join an upcoming hike, camping, or rafting trip!
          </p>
          <Link
            href="/events"
            className="mt-4 inline-block bg-[#15803D] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full shadow"
          >
            Explore Upcoming Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {(() => {
              const activeBooking = selectedBookingForPass || bookings[0];
              if (!activeBooking) return null;

              if (activeBooking.booking_status === 'fully_paid') {
                return <BoardingPassCard booking={activeBooking} />;
              }

              const paidPercent = Math.min(
                100,
                Math.round(((activeBooking.amount_paid || 0) / (activeBooking.total_amount || 1)) * 100)
              );

              const balanceDue =
                activeBooking.outstanding_balance ??
                (activeBooking.total_amount - (activeBooking.amount_paid || 0));

              return (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                          {activeBooking.booking_status === 'deposit_paid' ? 'Deposit Paid' : 'Pending Payment'}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {activeBooking.booking_reference}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#0F1D36]">{activeBooking.trip_title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Departure: {activeBooking.trip_departure || 'Upcoming Adventure'}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Outstanding Balance
                      </span>
                      <span className="text-2xl font-serif font-bold text-amber-700">
                        KES {balanceDue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>
                        Paid: <strong>KES {(activeBooking.amount_paid || 0).toLocaleString()}</strong>
                      </span>
                      <span>
                        Total: <strong>KES {activeBooking.total_amount.toLocaleString()}</strong>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${paidPercent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 text-right font-medium">{paidPercent}% completed</p>
                  </div>

                  {/* Lock Status Box */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-[#0F1D36]">Digital Boarding Pass Locked</p>
                      <p>
                        Your tamper-proof QR boarding pass and trail check-in credentials are generated automatically once your outstanding balance of <strong>KES {balanceDue.toLocaleString()}</strong> is fully settled.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => openPayBalanceModal(activeBooking)}
                      className="flex-1 sm:flex-none px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg glow-green flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Pay Balance via M-Pesa</span>
                    </button>

                    <button
                      onClick={() => openReviewModal(activeBooking)}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-[#0F1D36] rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Add Note / Review
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Select Boarding Pass</h3>
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setSelectedBookingForPass(b)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedBookingForPass?.id === b.id
                      ? 'border-[#15803D] bg-emerald-50/80 shadow-md ring-1 ring-[#15803D]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-[#15803D]">{b.booking_reference}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.booking_status === 'fully_paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.booking_status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#0F1D36]">{b.trip_title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{b.trip_departure}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
