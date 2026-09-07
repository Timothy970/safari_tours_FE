'use client';

import React from 'react';
import { QrCode, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

export interface AdminScannerTabProps {
  qrTokenInput: string;
  setQrTokenInput: (val: string) => void;
  scanResult: any;
  isScanning: boolean;
  handleVerifyQR: () => Promise<void>;
}

export default function AdminScannerTab({
  qrTokenInput,
  setQrTokenInput,
  scanResult,
  isScanning,
  handleVerifyQR,
}: AdminScannerTabProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-fadeIn">
      <div className="text-center space-y-2 pb-4 border-b border-slate-100">
        <div className="w-14 h-14 rounded-3xl bg-emerald-50 text-[#15803D] flex items-center justify-center mx-auto shadow-inner">
          <QrCode className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-xl font-bold text-[#0F1D36]">Ranger Departure Gate Scanner</h3>
        <p className="text-xs text-slate-500">
          Enter passenger QR tokens or scan tickets to verify boarding status and record check-in.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-[#0F1D36] mb-1.5">
            Boarding Pass QR Token
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. QR_KBL-SAF-99201"
              value={qrTokenInput}
              onChange={(e) => setQrTokenInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-[#0F1D36] focus:outline-none focus:border-[#15803D]"
            />
            <button
              onClick={handleVerifyQR}
              disabled={isScanning || !qrTokenInput.trim()}
              className="px-6 py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
            >
              {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Verify Pass</span>
            </button>
          </div>
        </div>

        {scanResult && (
          <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3 animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
              <span>Valid Boarding Pass Verified!</span>
            </div>
            <div className="text-xs space-y-1 text-slate-700">
              <div><strong>Passenger:</strong> {scanResult.user_name || 'Safari Adventurer'}</div>
              <div><strong>Expedition:</strong> {scanResult.trip_title}</div>
              <div><strong>Booking Ref:</strong> <span className="font-mono">{scanResult.booking_reference}</span></div>
              <div><strong>Payment Status:</strong> <span className="uppercase font-bold text-[#15803D]">{scanResult.booking_status}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
