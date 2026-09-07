'use client';

import React from 'react';
import Link from 'next/link';
import { Search, CreditCard } from 'lucide-react';
import { Booking, Trip } from '../../types';
import AdminPaginationBar from './AdminPaginationBar';

export interface AdminBookingsTabProps {
  bookings: Booking[];
  trips: Trip[];
  searchBookings: string;
  setSearchBookings: (val: string) => void;
  manifestTripFilter: string;
  setManifestTripFilter: (val: string) => void;
  manifestStatusFilter: string;
  setManifestStatusFilter: (val: string) => void;
  bookingsPage: number;
  bookingsTotalPages: number;
  bookingsTotal: number;
  setBookingsPage: (page: number) => void;
  handleOpenRecordPaymentModal: (booking: Booking) => void;
}

export default function AdminBookingsTab({
  bookings,
  trips,
  searchBookings,
  setSearchBookings,
  manifestTripFilter,
  setManifestTripFilter,
  manifestStatusFilter,
  setManifestStatusFilter,
  bookingsPage,
  bookingsTotalPages,
  bookingsTotal,
  setBookingsPage,
  handleOpenRecordPaymentModal,
}: AdminBookingsTabProps) {
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      (b.booking_reference && b.booking_reference.toLowerCase().includes(searchBookings.toLowerCase())) ||
      (b.user_name && b.user_name.toLowerCase().includes(searchBookings.toLowerCase())) ||
      (b.user_email && b.user_email.toLowerCase().includes(searchBookings.toLowerCase())) ||
      (b.trip_title && b.trip_title.toLowerCase().includes(searchBookings.toLowerCase()));

    const matchesTrip = manifestTripFilter === 'all' || String(b.trip_id) === manifestTripFilter;
    const matchesStatus = manifestStatusFilter === 'all' || b.booking_status === manifestStatusFilter;

    return matchesSearch && matchesTrip && matchesStatus;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fadeIn">
      {/* Filter Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search booking ref, traveler name, or email..."
            value={searchBookings}
            onChange={(e) => setSearchBookings(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F1D36] placeholder:text-slate-400 focus:outline-none focus:border-[#15803D]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={manifestTripFilter}
            onChange={(e) => setManifestTripFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1D36]"
          >
            <option value="all">All Safari Expeditions</option>
            {trips.map((t) => (
              <option key={t.id} value={String(t.id)}>
                {t.title}
              </option>
            ))}
          </select>

          <select
            value={manifestStatusFilter}
            onChange={(e) => setManifestStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1D36]"
          >
            <option value="all">All Payment Statuses</option>
            <option value="fully_paid">Fully Paid</option>
            <option value="deposit_paid">Deposit Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              <th className="py-3">Booking Ref</th>
              <th className="py-3">Traveler Details</th>
              <th className="py-3">Expedition Title</th>
              <th className="py-3">Financial Settlement</th>
              <th className="py-3">Payment Status</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                  No client bookings found matching your filters.
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => {
                const balanceDue = (b.outstanding_balance ?? (b.total_amount - (b.amount_paid || 0))) || 0;
                return (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#0F1D36]">
                      {b.booking_reference}
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-[#0F1D36]">{b.user_name || 'Safari Traveler'}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{b.user_email}</span>
                        {b.user_phone && <span>• {b.user_phone}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 font-medium text-slate-700 line-clamp-1">{b.trip_title}</td>
                    <td className="py-3.5">
                      <div className="font-mono text-xs font-bold text-[#0F1D36]">
                        <span className="text-[#15803D]">KES {b.amount_paid?.toLocaleString()}</span>
                        <span className="text-slate-400 font-normal"> / KES {b.total_amount?.toLocaleString()}</span>
                      </div>
                      {balanceDue > 0 && (
                        <div className="text-[10px] font-bold text-rose-600 font-mono">
                          Due: KES {balanceDue.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          b.booking_status === 'fully_paid'
                            ? 'bg-emerald-50 text-[#15803D] border border-emerald-200'
                            : b.booking_status === 'deposit_paid'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {b.booking_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {balanceDue > 0 && (
                          <button
                            onClick={() => handleOpenRecordPaymentModal(b)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#15803D] font-bold text-[11px] border border-emerald-200 transition-all flex items-center gap-1"
                            title="Record Offline Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Record Pay</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AdminPaginationBar
        currentPage={bookingsPage}
        totalPages={bookingsTotalPages}
        totalItems={bookingsTotal}
        onPageChange={setBookingsPage}
        itemsLabel="bookings"
      />
    </div>
  );
}
