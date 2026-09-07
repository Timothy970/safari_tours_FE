'use client';

import React from 'react';
import Link from 'next/link';
import { DollarSign, Users, Luggage, Calendar, Clock, ArrowRight, TrendingUp, Receipt, Sparkles, RefreshCw, Plus, CheckCircle2, AlertTriangle, QrCode } from 'lucide-react';
import { PaymentBreakdown, OccupancyItem, Trip, Booking } from '../../types';

export interface AdminOverviewTabProps {
  timeHorizon: '7d' | '30d' | 'quarter' | 'ytd' | 'all';
  setTimeHorizon: (val: '7d' | '30d' | 'quarter' | 'ytd' | 'all') => void;
  summary: any;
  paymentBreakdowns: PaymentBreakdown[];
  occupancyReport: OccupancyItem[];
  trips: Trip[];
  bookings: Booking[];
  setActiveTab: (tab: any) => void;
  setIsTripModalOpen: (open: boolean) => void;
  setEditingTripId: (id: number | null) => void;
  setTripForm: (form: any) => void;
  loadAdminData: () => void;
  isPopulatingCuratedMedia: boolean;
  handlePopulateCuratedMedia: () => void;
}

export default function AdminOverviewTab({
  summary,
  paymentBreakdowns,
  occupancyReport,
  bookings,
  setActiveTab,
  setIsTripModalOpen,
  setEditingTripId,
  setTripForm,
  loadAdminData,
  isPopulatingCuratedMedia,
  handlePopulateCuratedMedia,
}: AdminOverviewTabProps) {
  const totalRevenue = summary?.total_revenue_collected ?? summary?.total_revenue ?? 0;
  const totalCollected = summary?.total_paid ?? summary?.total_revenue_collected ?? 0;
  const totalPending = summary?.total_outstanding_balance ?? summary?.total_pending ?? 0;
  const totalBookings = summary?.total_bookings_count ?? summary?.total_bookings ?? 0;
  const totalTravelers = summary?.total_travelers ?? summary?.total_booking_volume ?? 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. TOP EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Gross Booked</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#15803D] flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-serif font-black text-[#0F1D36] tracking-tight mb-1">
            KES {totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>{totalBookings} total expedition bookings</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Collected</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-serif font-black text-[#0F1D36] tracking-tight mb-1">
            KES {totalCollected.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settled via M-Pesa & Card</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Outstanding Balance</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-serif font-black text-rose-600 tracking-tight mb-1">
            KES {totalPending.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Pending departure clearance</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Travelers</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl lg:text-3xl font-serif font-black text-[#0F1D36] tracking-tight mb-1">
            {totalTravelers}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-purple-600 font-semibold">
            <Luggage className="w-4 h-4" />
            <span>Across all safari departures</span>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="bg-gradient-to-r from-[#0F1D36] to-[#162746] rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h3 className="text-lg font-serif font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Quick Operations Launcher</span>
          </h3>
          <p className="text-xs text-slate-300 mt-1">Direct shortcuts to dispatch, ticket scanning, and catalog curation.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setEditingTripId(null);
              setTripForm({
                title: '',
                destination: '',
                country: 'Kenya',
                tagline: '',
                difficulty: 'moderate',
                total_seats: 14,
                booked_seats: 0,
                status: 'published',
                booking_open: true,
                total_days: 1,
                total_nights: 0,
                departure_date: new Date().toISOString().substring(0, 10),
                return_date: new Date().toISOString().substring(0, 10),
                base_price_kes: 4500,
                deposit_required_kes: 1500,
                base_price_usd: 45,
                deposit_required_usd: 15,
                overview: '',
                featured_image_url: '',
              });
              setIsTripModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Safari Expedition</span>
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-sm border border-white/10 transition-colors"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Open Ranger Scanner</span>
          </button>
          <button
            onClick={handlePopulateCuratedMedia}
            disabled={isPopulatingCuratedMedia}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 backdrop-blur-sm border border-white/10 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isPopulatingCuratedMedia ? 'Seeding Media...' : 'Seed High-Res Media'}</span>
          </button>
          <button
            onClick={loadAdminData}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10 transition-colors"
            title="Refresh Analytics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* EXPEDITIONS OCCUPANCY & PAYMENT GATEWAY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0F1D36] flex items-center gap-2">
                <Luggage className="w-5 h-5 text-[#15803D]" />
                <span>Expeditions Capacity & Occupancy</span>
              </h3>
              <p className="text-xs text-slate-400">Live seat bookings per departure</p>
            </div>
            <button
              onClick={() => setActiveTab('trips')}
              className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1"
            >
              <span>Manage Expeditions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 space-y-3 pt-1">
            {occupancyReport.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">No active expeditions found.</div>
            ) : (
              occupancyReport.slice(0, 5).map((occ) => {
                const totalSeats = occ.total_seats || 14;
                const bookedSeats = occ.booked_seats || 0;
                const percentage = Math.min(Math.round((bookedSeats / totalSeats) * 100), 100);
                return (
                  <div key={occ.trip_id} className="pt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0F1D36]">{occ.title}</span>
                      <span className="font-mono text-slate-500 font-medium">
                        {bookedSeats} / {totalSeats} seats ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentage >= 90
                            ? 'bg-rose-500'
                            : percentage >= 60
                            ? 'bg-amber-500'
                            : 'bg-[#15803D]'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Payment Channels Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-serif text-lg font-bold text-[#0F1D36] flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#15803D]" />
              <span>Payment Gateways</span>
            </h3>
            <p className="text-xs text-slate-400">Revenue distribution by channel</p>
          </div>

          <div className="space-y-3 pt-2">
            {paymentBreakdowns.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">No transactions recorded yet.</div>
            ) : (
              paymentBreakdowns.map((pb) => (
                <div
                  key={pb.gateway}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-[#0F1D36] uppercase block">
                      {pb.gateway === 'mpesa_stk' ? 'M-Pesa STK Push' : pb.gateway === 'pesapal' ? 'Pesapal Card / Bank' : pb.gateway}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{pb.transaction_count} successful payments</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#15803D] block">
                      KES {pb.total_amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RECENT BOOKINGS MANIFEST PREVIEW */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0F1D36] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#15803D]" />
              <span>Recent Client Bookings Feed</span>
            </h3>
            <p className="text-xs text-slate-400">Latest reservations across all expeditions</p>
          </div>
          <button
            onClick={() => setActiveTab('bookings')}
            className="text-xs font-bold text-[#15803D] hover:underline flex items-center gap-1"
          >
            <span>View Full Booking Manifest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                <th className="py-2.5">Reference</th>
                <th className="py-2.5">Traveler</th>
                <th className="py-2.5">Expedition</th>
                <th className="py-2.5">Paid / Total</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-mono font-bold text-[#0F1D36]">{b.booking_reference}</td>
                  <td className="py-3">
                    <div className="font-semibold text-[#0F1D36]">{b.user_name || 'Safari Traveler'}</div>
                    <div className="text-[10px] text-slate-400">{b.user_email}</div>
                  </td>
                  <td className="py-3 font-medium text-slate-700 line-clamp-1">{b.trip_title}</td>
                  <td className="py-3 font-mono font-bold">
                    <span className="text-[#15803D]">KES {b.amount_paid?.toLocaleString()}</span>
                    <span className="text-slate-400 font-normal"> / KES {b.total_amount?.toLocaleString()}</span>
                  </td>
                  <td className="py-3">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
