'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Search, ToggleLeft, ToggleRight, Edit, Trash2, Eye } from 'lucide-react';
import { Trip } from '../../types';
import AdminPaginationBar from './AdminPaginationBar';

export interface AdminTripsTabProps {
  trips: Trip[];
  searchTrips: string;
  setSearchTrips: (val: string) => void;
  tripStatusFilter: string;
  setTripStatusFilter: (val: string) => void;
  tripsPage: number;
  tripsTotalPages: number;
  tripsTotal: number;
  setTripsPage: (page: number) => void;
  setIsTripModalOpen: (open: boolean) => void;
  setEditingTripId: (id: number | null) => void;
  setTripForm: (form: any) => void;
  handleDeleteTrip: (id: number, title: string) => void;
  handleToggleTripBooking: (id: number, current: boolean, title: string) => void;
}

export default function AdminTripsTab({
  trips,
  searchTrips,
  setSearchTrips,
  tripStatusFilter,
  setTripStatusFilter,
  tripsPage,
  tripsTotalPages,
  tripsTotal,
  setTripsPage,
  setIsTripModalOpen,
  setEditingTripId,
  setTripForm,
  handleDeleteTrip,
  handleToggleTripBooking,
}: AdminTripsTabProps) {
  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTrips.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchTrips.toLowerCase());
    if (tripStatusFilter === 'all') return matchesSearch;
    if (tripStatusFilter === 'upcoming') return matchesSearch && t.status === 'published';
    return matchesSearch && t.status === tripStatusFilter;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fadeIn">
      {/* Search & Actions Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by expedition title or park destination..."
            value={searchTrips}
            onChange={(e) => setSearchTrips(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0F1D36] placeholder:text-slate-400 focus:outline-none focus:border-[#15803D]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={tripStatusFilter}
            onChange={(e) => setTripStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1D36]"
          >
            <option value="all">All Expeditions</option>
            <option value="upcoming">Published / Active</option>
            <option value="draft">Drafts</option>
            <option value="sold_out">Sold Out</option>
            <option value="completed">Completed</option>
          </select>

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
            className="px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Expedition</span>
          </button>
        </div>
      </div>

      {/* Expeditions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              <th className="py-3">Expedition Title</th>
              <th className="py-3">Departure Date</th>
              <th className="py-3">Price (KES)</th>
              <th className="py-3">Seat Quota</th>
              <th className="py-3">Booking Status</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTrips.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                  No safari expeditions found matching your filters.
                </td>
              </tr>
            ) : (
              filteredTrips.map((t) => {
                const bookedPct = Math.round(((t.booked_seats || 0) / (t.total_seats || 1)) * 100);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5">
                      <div className="font-bold text-[#0F1D36] group-hover:text-[#15803D] transition-colors">
                        {t.title}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{t.destination}, {t.country}</span>
                        <span>•</span>
                        <span className="capitalize">{t.difficulty}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-medium text-slate-700">
                      {t.departure_date ? String(t.departure_date).substring(0, 10) : 'TBD'}
                    </td>
                    <td className="py-3.5 font-mono font-bold text-[#0F1D36]">
                      KES {t.base_price_kes?.toLocaleString()}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0F1D36]">
                          {t.booked_seats || 0}/{t.total_seats || 14}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">({bookedPct}%)</span>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <button
                        onClick={() => handleToggleTripBooking(t.id, t.booking_open, t.title)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                          t.booking_open
                            ? 'bg-emerald-50 text-[#15803D] border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {t.booking_open ? (
                          <>
                            <ToggleRight className="w-3.5 h-3.5 text-[#15803D]" />
                            <span>Open</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-3.5 h-3.5 text-rose-600" />
                            <span>Closed</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/trips/${t.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                          title="View Live Public Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => {
                            setEditingTripId(t.id);
                            setTripForm({ ...t });
                            setIsTripModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                          title="Edit Expedition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrip(t.id, t.title)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-rose-600"
                          title="Delete Expedition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
        currentPage={tripsPage}
        totalPages={tripsTotalPages}
        totalItems={tripsTotal}
        onPageChange={setTripsPage}
        itemsLabel="expeditions"
      />
    </div>
  );
}
