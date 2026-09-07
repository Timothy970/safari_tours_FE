'use client';

import React from 'react';
import { X, CreditCard, Loader2 } from 'lucide-react';
import { Booking } from '../../types';

export interface AdminManualPaymentModalProps {
  booking: Booking | null;
  onClose: () => void;
  manualPaymentForm: {
    amount: number;
    payment_method: string;
    payment_type: string;
    transaction_reference: string;
    notes: string;
  };
  setManualPaymentForm: React.Dispatch<
    React.SetStateAction<{
      amount: number;
      payment_method: string;
      payment_type: string;
      transaction_reference: string;
      notes: string;
    }>
  >;
  isRecordingPayment: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminManualPaymentModal({
  booking,
  onClose,
  manualPaymentForm,
  setManualPaymentForm,
  isRecordingPayment,
  onSubmit,
}: AdminManualPaymentModalProps) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-[#15803D] rounded-2xl flex items-center justify-center border border-emerald-200">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Record Manual Offline Payment</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Booking: {booking.booking_reference}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passenger & Financial Context */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Traveler:</span>
            <span className="font-bold text-[#0F1D36]">{booking.user_name || 'Safari Passenger'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Expedition:</span>
            <span className="font-bold text-[#0F1D36] line-clamp-1">{booking.trip_title}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center">
            <div className="bg-white p-2 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
              <span className="font-mono font-bold text-[#0F1D36]">
                KES {booking.total_amount?.toLocaleString()}
              </span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Amount Paid</span>
              <span className="font-mono font-bold text-[#15803D]">
                KES {booking.amount_paid?.toLocaleString()}
              </span>
            </div>
            <div className="bg-white p-2 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <span className="text-[10px] text-emerald-700 uppercase font-black block">Balance Due</span>
              <span className="font-mono font-black text-rose-600">
                KES {(
                  (booking.outstanding_balance ?? (booking.total_amount - (booking.amount_paid || 0))) || 0
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 pt-1">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36]">
                Payment Amount (KES) *
              </label>
              <button
                type="button"
                onClick={() => {
                  const due =
                    booking.outstanding_balance ??
                    (booking.total_amount - (booking.amount_paid || 0));
                  setManualPaymentForm((prev) => ({ ...prev, amount: due > 0 ? due : 0 }));
                }}
                className="text-[10px] text-[#15803D] font-bold hover:underline"
              >
                Pay Full Remaining Balance
              </button>
            </div>
            <input
              type="number"
              required
              min={1}
              step="any"
              value={manualPaymentForm.amount || ''}
              onChange={(e) =>
                setManualPaymentForm((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value) || 0,
                }))
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-mono font-bold text-[#0F1D36] focus:outline-none focus:border-[#15803D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Payment Method *
              </label>
              <select
                value={manualPaymentForm.payment_method}
                onChange={(e) =>
                  setManualPaymentForm((prev) => ({ ...prev, payment_method: e.target.value }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1D36]"
              >
                <option value="cash">Cash in Office</option>
                <option value="bank_transfer">Bank Wire / EFT Transfer</option>
                <option value="mpesa_manual">Manual M-Pesa (Till/Paybill)</option>
                <option value="pos_card">POS Terminal (Visa/Mastercard)</option>
                <option value="cheque">Bank Cheque / Draft</option>
                <option value="other">Other Manual Settlement</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
                Settlement Type
              </label>
              <select
                value={manualPaymentForm.payment_type}
                onChange={(e) =>
                  setManualPaymentForm((prev) => ({ ...prev, payment_type: e.target.value }))
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#0F1D36]"
              >
                <option value="full_balance">Full Balance Clearance</option>
                <option value="deposit">Deposit Commitment</option>
                <option value="installment">Installment Milestone</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
              Receipt / Transaction Reference (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. REC-2026-0041 or BANK-REF-99201"
              value={manualPaymentForm.transaction_reference}
              onChange={(e) =>
                setManualPaymentForm((prev) => ({
                  ...prev,
                  transaction_reference: e.target.value,
                }))
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs uppercase font-mono text-[#0F1D36]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[#0F1D36] mb-1">
              Admin Memo / Internal Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Received at Nairobi HQ reception by Evans"
              value={manualPaymentForm.notes}
              onChange={(e) =>
                setManualPaymentForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-[#0F1D36]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold uppercase transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRecordingPayment || manualPaymentForm.amount <= 0}
              className="px-6 py-2.5 bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md glow-green transition-all flex items-center gap-1.5"
            >
              {isRecordingPayment ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Recording...</span>
                </>
              ) : (
                <span>Record & Update Ticket</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
