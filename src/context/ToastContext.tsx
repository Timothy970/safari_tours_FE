'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  showToast: () => {},
  removeToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration: number = 4500) => {
      const id = `${Date.now()}-${Math.random()}`;
      const newToast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep max 4 toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-emerald-200 shrink-0 mt-0.5" />;
    }
  };

  const getGradient = (type: ToastType) => {
    switch (type) {
      case 'error':
        return 'bg-gradient-to-br from-[#1c080b] via-[#330f14] to-[#4c121a] border-rose-500/40 shadow-[0_12px_36px_rgba(76,18,26,0.45)]';
      case 'warning':
        return 'bg-gradient-to-br from-[#1c1305] via-[#332209] to-[#4d330d] border-amber-500/40 shadow-[0_12px_36px_rgba(77,51,13,0.45)]';
      case 'info':
      case 'success':
      default:
        return 'bg-gradient-to-br from-[#051f12] via-[#0b3820] to-[#15803D] border-emerald-400/40 shadow-[0_12px_36px_rgba(11,56,32,0.5)]';
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto ${getGradient(
              toast.type
            )} text-white backdrop-blur-xl border p-4 rounded-2xl shadow-2xl flex items-start gap-3.5 transition-all transform animate-in slide-in-from-bottom-5 duration-300`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <h4 className="font-serif text-sm font-bold text-white tracking-wide">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-emerald-100/90 mt-0.5 leading-relaxed font-sans">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-emerald-200/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
