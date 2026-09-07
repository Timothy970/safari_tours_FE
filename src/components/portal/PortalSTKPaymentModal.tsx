'use client';

import React from 'react';
import { X, Phone } from 'lucide-react';
import { Booking } from '../../types';

export interface PortalSTKPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  stkTargetBooking: Booking | null;
  stkPhoneNumber: string;
  setStkPhoneNumber: (phone: string) => void;
  stkAmount: number;
  setStkAmount: (amt: number) => void;
  isTriggeringSTK: boolean;
  handleTriggerSTKPayment: (e: React.FormEvent) => Promise<void>;
}

export default function PortalSTKPaymentModal({
  isOpen,
  onClose,
  stkTargetBooking,
  stkPhoneNumber,
  setStkPhoneNumber,
  stkAmount,
  setStkAmount,
  isTriggeringSTK,
  handleTriggerSTKPayment,
}: PortalSTKPaymentModalProps) {
  if (!isOpen || !stkTargetBooking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#15803D]" />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0F1D36]">M-Pesa STK Settle Balance</h3>
              <p className="text-xs text-slate-500">{stkTargetBooking.trip_title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleTriggerSTKPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Safaricom Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="07XXXXXXXX or 2547XXXXXXXX"
              value={stkPhoneNumber}
              onChange={(e) => setStkPhoneNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#0F1D36]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">Amount to Pay (KES) *</label>
            <input
              type="number"
              required
              min={1}
              value={stkAmount}
              onChange={(e) => setStkAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#0F1D36]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isTriggeringSTK || stkAmount <= 0}
              className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow"
            >
              {isTriggeringSTK ? 'Sending Prompt...' : 'Send M-Pesa STK Push'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
