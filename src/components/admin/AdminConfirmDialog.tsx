'use client';

import React from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert, Check, Loader2 } from 'lucide-react';

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => Promise<void> | void;
}

export interface AdminConfirmDialogProps {
  dialog: ConfirmDialogState | null;
  onClose: () => void;
  isProcessing?: boolean;
}

export default function AdminConfirmDialog({ dialog, onClose, isProcessing }: AdminConfirmDialogProps) {
  if (!dialog || !dialog.isOpen) return null;

  const variant = dialog.variant || dialog.confirmVariant || 'primary';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-scaleUp">
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              variant === 'danger'
                ? 'bg-rose-50 text-rose-600'
                : variant === 'warning'
                ? 'bg-amber-50 text-amber-600'
                : 'bg-emerald-50 text-[#15803D]'
            }`}
          >
            {variant === 'danger' ? (
              <AlertTriangle className="w-6 h-6" />
            ) : variant === 'warning' ? (
              <AlertCircle className="w-6 h-6" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0F1D36]">{dialog.title}</h3>
            <p className="text-xs text-slate-400 font-medium">Please review this action</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">{dialog.message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {dialog.cancelText || 'Cancel'}
          </button>
          <button
            type="button"
            onClick={async () => {
              await dialog.onConfirm();
              onClose();
            }}
            disabled={isProcessing}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
              variant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : variant === 'warning'
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                : 'bg-[#15803D] hover:bg-[#166534] shadow-emerald-900/20'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{dialog.confirmText || 'Confirm Action'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
