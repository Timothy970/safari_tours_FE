'use client';

import React from 'react';
import { Phone, ShieldCheck, Tag, Loader2, Sparkles, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';
import { Trip } from '../../types';

export interface BookingPaymentStepProps {
  trip: Trip;
  paymentPlan: 'deposit' | 'custom' | 'full';
  setPaymentPlan: (plan: 'deposit' | 'custom' | 'full') => void;
  depositTotalKES: number;
  customAmount: number;
  setCustomAmount: (amount: number) => void;
  totalPayableKES: number;
  minDepositAllowedKES: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoDiscount: number;
  promoApplied: boolean;
  isValidatingPromo: boolean;
  handleApplyPromo: () => Promise<void>;
  paymentMethod: 'mpesa' | 'pesapal';
  setPaymentMethod: (method: 'mpesa' | 'pesapal') => void;
  mpesaPhone: string;
  setMpesaPhone: (phone: string) => void;
  isProcessingPayment: boolean;
  stkPromptSent: boolean;
  stkCountdown: number;
  handleInitiatePayment: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
}

export default function BookingPaymentStep({
  trip,
  paymentPlan,
  setPaymentPlan,
  depositTotalKES,
  customAmount,
  setCustomAmount,
  totalPayableKES,
  minDepositAllowedKES,
  promoCode,
  setPromoCode,
  promoDiscount,
  promoApplied,
  isValidatingPromo,
  handleApplyPromo,
  paymentMethod,
  setPaymentMethod,
  mpesaPhone,
  setMpesaPhone,
  isProcessingPayment,
  stkPromptSent,
  stkCountdown,
  handleInitiatePayment,
  onBack,
}: BookingPaymentStepProps) {
  const amountDueToday = paymentPlan === 'deposit'
    ? Math.min(depositTotalKES, totalPayableKES)
    : paymentPlan === 'custom'
    ? Math.max(minDepositAllowedKES, Math.min(customAmount || minDepositAllowedKES, totalPayableKES))
    : totalPayableKES;

  return (
    <div className="space-y-6">
      {/* Back to Step 1 */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#15803D]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Edit Adventurer Information</span>
      </button>

      {/* 1. FLEXIBLE PAYMENT PLAN SELECTOR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Select How Much to Pay Today</h3>
          <p className="text-xs text-slate-500">Choose deposit, custom amount, or full payment. You decide what works best.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Plan 1: Minimum Deposit */}
          <button
            type="button"
            onClick={() => setPaymentPlan('deposit')}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              paymentPlan === 'deposit'
                ? 'border-[#15803D] bg-emerald-50/60 shadow-sm ring-1 ring-[#15803D]'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mb-2">
              Lock Spot
            </span>
            <span className="font-bold text-xs text-[#0F1D36] block">Minimum Deposit</span>
            <span className="font-serif text-lg font-bold text-[#15803D] block mt-1">
              KES {depositTotalKES.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Settle balance before departure</span>
          </button>

          {/* Plan 2: Custom Amount */}
          <button
            type="button"
            onClick={() => {
              setPaymentPlan('custom');
              if (!customAmount || customAmount < depositTotalKES) {
                setCustomAmount(depositTotalKES);
              }
            }}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              paymentPlan === 'custom'
                ? 'border-[#15803D] bg-emerald-50/60 shadow-sm ring-1 ring-[#15803D]'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F1D36] bg-slate-100 px-2 py-0.5 rounded-full inline-block mb-2">
              Flexible
            </span>
            <span className="font-bold text-xs text-[#0F1D36] block">Custom Amount</span>
            <span className="font-serif text-lg font-bold text-[#0F1D36] block mt-1">
              KES {(customAmount || depositTotalKES).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Min KES {depositTotalKES.toLocaleString()}</span>
          </button>

          {/* Plan 3: Full Payment */}
          <button
            type="button"
            onClick={() => setPaymentPlan('full')}
            className={`p-4 rounded-2xl border text-left transition-all relative ${
              paymentPlan === 'full'
                ? 'border-[#15803D] bg-emerald-50/60 shadow-sm ring-1 ring-[#15803D]'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full inline-block mb-2">
              Instant Pass
            </span>
            <span className="font-bold text-xs text-[#0F1D36] block">Pay Full Amount</span>
            <span className="font-serif text-lg font-bold text-[#15803D] block mt-1">
              KES {totalPayableKES.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">Unlocks QR Pass Instantly</span>
          </button>
        </div>

        {/* If Custom Selected, Show Input */}
        {paymentPlan === 'custom' && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in duration-200">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Enter Custom Deposit Amount (KES)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">KES</span>
              <input
                type="number"
                min={depositTotalKES}
                max={totalPayableKES}
                step={500}
                value={customAmount || ''}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#15803D] text-sm font-bold text-[#0F1D36] focus:outline-none bg-white"
                placeholder={depositTotalKES.toString()}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              Minimum acceptable deposit for this group size is KES {depositTotalKES.toLocaleString()}.
            </p>
          </div>
        )}
      </div>

      {/* 2. PROMO CODE SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-serif text-sm font-bold text-[#0F1D36] flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#15803D]" />
          <span>Have an Explorer Promo Code or Voucher?</span>
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. KIBALI10 or KILIMA5"
            value={promoCode}
            disabled={promoApplied}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs uppercase font-bold text-[#0F1D36] focus:outline-none focus:border-[#15803D]"
          />
          <button
            type="button"
            disabled={!promoCode.trim() || isValidatingPromo || promoApplied}
            onClick={handleApplyPromo}
            className="px-5 py-2.5 rounded-2xl bg-[#0F1D36] hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold uppercase transition-all"
          >
            {isValidatingPromo ? 'Checking...' : promoApplied ? 'Applied' : 'Apply'}
          </button>
        </div>
        {promoApplied && (
          <p className="text-xs font-bold text-[#15803D] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discount voucher verified! KES {promoDiscount.toLocaleString()} deducted.</span>
          </p>
        )}
      </div>

      {/* 3. PAYMENT METHOD GATEWAYS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0F1D36]">Select Payment Method</h3>
          <p className="text-xs text-slate-500">Official verified Kenyan and international travel payment processors.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* M-Pesa Gateway */}
          <button
            type="button"
            onClick={() => setPaymentMethod('mpesa')}
            className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
              paymentMethod === 'mpesa'
                ? 'border-[#15803D] bg-emerald-50/50 shadow-md ring-2 ring-[#15803D]'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-24 bg-white p-1 rounded-lg border border-slate-200/80 shadow-xs flex items-center justify-center overflow-hidden">
                <img
                  src="https://pbs.twimg.com/ext_tw_video_thumb/1181852139011936256/pu/img/1UCUl2bSj2RCyq6H.jpg"
                  alt="Safaricom M-Pesa"
                  className="h-full w-full object-contain"
                />
              </div>
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'mpesa' ? 'border-[#15803D] bg-[#15803D] text-white' : 'border-slate-300'
                }`}
              >
                {paymentMethod === 'mpesa' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </span>
            </div>

            <div>
              <span className="font-bold text-xs text-[#0F1D36] block">Safaricom Lipa Na M-Pesa</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Instant STK push notification directly to your phone.
              </span>
            </div>
          </button>

          {/* Pesapal Gateway */}
          <button
            type="button"
            disabled
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 text-left transition-all flex flex-col justify-between opacity-60 cursor-not-allowed select-none"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-28 bg-white p-1 rounded-lg border border-slate-200/80 shadow-xs flex items-center justify-center overflow-hidden grayscale">
                <img
                  src="https://www.pesapal.com/media/1350/pesapal-share.png"
                  alt="Pesapal Gateway"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                Temporarily Unavailable
              </span>
            </div>

            <div>
              <span className="font-bold text-xs text-slate-600 block">Pesapal Secure Gateway</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Credit / Debit Card (Visa, Mastercard) & Mobile Money (Coming soon).
              </span>
            </div>
          </button>
        </div>

        {/* If M-Pesa Selected: Phone Number Input */}
        {paymentMethod === 'mpesa' && (
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2 animate-in fade-in duration-200">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-900">
              Enter M-Pesa Phone Number for Instant STK Push *
            </label>
            <div className="flex items-center gap-2 bg-white rounded-xl border border-emerald-300 px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#15803D]">
              <Phone className="w-4 h-4 text-[#15803D] shrink-0" />
              <input
                type="tel"
                required
                placeholder="0712345678 or 254712345678"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                className="w-full text-xs font-bold text-[#0F1D36] focus:outline-none bg-transparent"
              />
            </div>
            <p className="text-[10px] text-emerald-800">
              When you click Pay, a prompt will appear on this phone screen. Enter your M-Pesa PIN to complete.
            </p>
          </div>
        )}
      </div>

      {/* 4. EXECUTE PAYMENT BUTTON */}
      <div className="space-y-3">
        <button
          type="button"
          disabled={isProcessingPayment}
          onClick={handleInitiatePayment}
          className="w-full py-4 bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 shadow-xl glow-green disabled:opacity-50"
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>
                {stkPromptSent
                  ? `Awaiting M-Pesa PIN Entry (${stkCountdown}s)...`
                  : 'Processing Transaction...'}
              </span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>
                Confirm & Pay KES {amountDueToday.toLocaleString()} via{' '}
                {paymentMethod === 'mpesa' ? 'M-Pesa' : 'Pesapal'}
              </span>
            </>
          )}
        </button>

        <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
          <span>256-Bit SSL Encrypted & Official Kibali Africa Booking Guarantee</span>
        </p>
      </div>
    </div>
  );
}
