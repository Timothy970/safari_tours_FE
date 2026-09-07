'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Printer, MessageSquare, ShieldCheck } from 'lucide-react';
import { Booking } from '../../types';
import { useToast } from '../../context/ToastContext';

interface BoardingPassCardProps {
  booking: Booking;
}

export const BoardingPassCard: React.FC<BoardingPassCardProps> = ({ booking }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.booking_reference);
    setCopied(true);
    showToast('success', 'Reference Copied!', `Booking Reference ${booking.booking_reference} saved to clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#1B5E20]/30 overflow-hidden relative print:shadow-none print:border-none">
      {/* Top Brand Header */}
      <div className="bg-gradient-to-r from-[#051F12] via-[#0D4124] to-[#15803D] text-white p-6 relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white p-0.5 flex items-center justify-center border border-white/40 shadow-md">
              <img
                src="/images/logo.png"
                alt="Kibali Africa Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-wide text-white">KIBALI AFRICA</span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300">Expedition Boarding Pass</p>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                booking.checked_in
                  ? 'bg-emerald-900/90 text-emerald-300 border border-emerald-400/50'
                  : 'bg-amber-900/90 text-amber-300 border border-amber-400/50'
              }`}
            >
              {booking.checked_in ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5" /> Gate Open
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Main Boarding Pass Body */}
      <div className="p-6 md:p-8 bg-[#F7FBF1]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Traveler & Trip Details */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Lead Adventurer</span>
              <h3 className="font-serif text-xl font-bold text-[#0F1D36]">{booking.user_name || 'Valued Safari Guest'}</h3>
              <p className="text-xs text-stone-500">{booking.user_phone || '+254 7XX XXX XXX'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-200">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Destination</span>
                <p className="font-serif font-bold text-sm text-[#0F1D36]">{booking.trip_destination || booking.trip_title}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Party Size</span>
                <p className="font-sans font-bold text-sm text-[#1B5E20]">{booking.number_of_guests} Guests (Guaranteed Window)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-200">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Departure Date</span>
                <p className="font-mono font-bold text-sm text-[#1B5E20]">{booking.trip_departure || '2026-09-18'}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Vehicle Dispatch</span>
                <p className="font-mono font-bold text-xs text-[#0F1D36]">4x4 Cruiser #KBL-04</p>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Booking Reference</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-[#0F1D36]">{booking.booking_reference}</span>
                  <button
                    onClick={handleCopyRef}
                    className="text-[11px] text-[#1B5E20] hover:underline font-bold"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Status</span>
                <p className="text-xs font-bold text-emerald-800 capitalize">{booking.booking_status.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* QR Code Section & Scan Stamp */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-stone-200 shadow-sm text-center">
            {/* SVG QR Code Simulation */}
            <div className="w-36 h-36 bg-stone-900 rounded-xl p-2.5 flex items-center justify-center shadow-inner relative group">
              <div className="w-full h-full bg-white p-2 rounded flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-4 border-black bg-black/20" />
                  <div className="w-6 h-6 border-4 border-black bg-black/20" />
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-600">
                    <img src="/images/logo.png" alt="QR Emblem" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-4 border-black bg-black/20" />
                  <div className="w-3 h-3 bg-black" />
                </div>
              </div>
            </div>

            <p className="font-mono text-[10px] text-stone-600 font-bold mt-2 tracking-wider">
              {booking.qr_token || `QR_${booking.booking_reference}`}
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5">Scan at gate / Land Cruiser boarding</p>
          </div>
        </div>
      </div>

      {/* Perforated Notches for Boarding Pass Realism */}
      <div className="relative border-t-2 border-dashed border-stone-300 bg-[#F7FBF1] py-4 px-6 md:px-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Verified KPSGA Expedition Document</span>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <Link
            href={`/portal/chat/${booking.trip_id || 1}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B5E20] text-white rounded-lg text-xs font-semibold hover:bg-[#00450D] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Trip Group Chat</span>
          </Link>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors border border-stone-300"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardingPassCard;
