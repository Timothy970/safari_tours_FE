'use client';

import React from 'react';
import { X, Luggage } from 'lucide-react';
import { Trip } from '../../types';

export interface AdminTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripForm: Partial<Trip>;
  setTripForm: React.Dispatch<React.SetStateAction<Partial<Trip>>>;
  editingTripId: number | null;
  onSave: (e: React.FormEvent) => void;
}

export default function AdminTripModal({
  isOpen,
  onClose,
  tripForm,
  setTripForm,
  editingTripId,
  onSave,
}: AdminTripModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 border border-slate-200 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#0F1D36]">
              {editingTripId ? 'Edit Safari Expedition & Seat Quota' : 'Create New Safari Expedition'}
            </h3>
            <p className="text-xs text-slate-500">Configure departure details, seats allocation, and pricing.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Trip Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Amboseli Kilimanjaro 3-Day Wildlife Odyssey"
              value={tripForm.title || ''}
              onChange={(e) => setTripForm({ ...tripForm, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-[#0F1D36]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Destination Park</label>
              <input
                type="text"
                required
                placeholder="e.g. Amboseli"
                value={tripForm.destination || ''}
                onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#0F1D36]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Country</label>
              <input
                type="text"
                required
                value={tripForm.country || 'Kenya'}
                onChange={(e) => setTripForm({ ...tripForm, country: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#0F1D36]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Short Tagline</label>
              <input
                type="text"
                placeholder="e.g. Giants of Africa beneath Kilimanjaro"
                value={tripForm.tagline || ''}
                onChange={(e) => setTripForm({ ...tripForm, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#0F1D36]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Difficulty Tier</label>
              <select
                value={tripForm.difficulty || 'moderate'}
                onChange={(e) => setTripForm({ ...tripForm, difficulty: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F1D36] font-bold"
              >
                <option value="easy">Easy (Leisure Safari)</option>
                <option value="moderate">Moderate (Game Drives & Light Treks)</option>
                <option value="challenging">Challenging (Summit Hike)</option>
                <option value="extreme">Extreme (Multi-day Expedition)</option>
              </select>
            </div>
          </div>

          {/* SEAT QUOTA & RESERVATION STATUS */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#15803D] flex items-center gap-1.5">
              <Luggage className="w-4 h-4" />
              <span>Seat Capacity & Availability Settings</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#0F1D36] mb-1">Total Seats Quota *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={tripForm.total_seats || 14}
                  onChange={(e) => setTripForm({ ...tripForm, total_seats: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-[#0F1D36]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#0F1D36] mb-1">Booked Seats</label>
                <input
                  type="number"
                  min={0}
                  value={tripForm.booked_seats || 0}
                  onChange={(e) => setTripForm({ ...tripForm, booked_seats: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-[#0F1D36]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#0F1D36] mb-1">Expedition Status</label>
                <select
                  value={tripForm.status || 'published'}
                  onChange={(e) => setTripForm({ ...tripForm, status: e.target.value as any })}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-2 py-1.5 text-xs font-bold text-[#0F1D36]"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="completed">Completed / Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#0F1D36] mb-1">Booking Open</label>
                <select
                  value={tripForm.booking_open ? 'open' : 'closed'}
                  onChange={(e) => setTripForm({ ...tripForm, booking_open: e.target.value === 'open' })}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-2 py-1.5 text-xs font-bold text-[#0F1D36]"
                >
                  <option value="open">Open for Bookings</option>
                  <option value="closed">Closed / Standby</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates & Schedule */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Total Days</label>
              <input
                type="number"
                value={tripForm.total_days || 1}
                onChange={(e) => setTripForm({ ...tripForm, total_days: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F1D36]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Total Nights</label>
              <input
                type="number"
                value={tripForm.total_nights || 0}
                onChange={(e) => setTripForm({ ...tripForm, total_nights: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0F1D36]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Departure Date</label>
              <input
                type="date"
                required
                value={tripForm.departure_date ? String(tripForm.departure_date).substring(0, 10) : ''}
                onChange={(e) => setTripForm({ ...tripForm, departure_date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs text-[#0F1D36]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Return Date</label>
              <input
                type="date"
                required
                value={tripForm.return_date ? String(tripForm.return_date).substring(0, 10) : ''}
                onChange={(e) => setTripForm({ ...tripForm, return_date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs text-[#0F1D36]"
              />
            </div>
          </div>

          {/* Pricing (KES & USD) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Price (KES) *</label>
              <input
                type="number"
                required
                value={tripForm.base_price_kes || 0}
                onChange={(e) => setTripForm({ ...tripForm, base_price_kes: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#0F1D36]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Deposit (KES) *</label>
              <input
                type="number"
                required
                value={tripForm.deposit_required_kes || 0}
                onChange={(e) => setTripForm({ ...tripForm, deposit_required_kes: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#0F1D36]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Price (USD)</label>
              <input
                type="number"
                value={tripForm.base_price_usd || 0}
                onChange={(e) => setTripForm({ ...tripForm, base_price_usd: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-[#0F1D36]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Deposit (USD)</label>
              <input
                type="number"
                value={tripForm.deposit_required_usd || 0}
                onChange={(e) => setTripForm({ ...tripForm, deposit_required_usd: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-[#0F1D36]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Expedition Overview</label>
            <textarea
              rows={3}
              required
              placeholder="Detailed safari itinerary summary..."
              value={tripForm.overview || ''}
              onChange={(e) => setTripForm({ ...tripForm, overview: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-[#0F1D36]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">Featured Card Image URL</label>
            <input
              type="text"
              required
              value={tripForm.featured_image_url || ''}
              onChange={(e) => setTripForm({ ...tripForm, featured_image_url: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#0F1D36]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md glow-green"
            >
              Save Expedition & Seats
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
