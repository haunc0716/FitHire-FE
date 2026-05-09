import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);
const DEFAULT_DURATION_MS = 4000;

const toastStyles = {
  success: {
    icon: CheckCircle2,
    ring: 'border-emerald-200',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50/80'
  },
  error: {
    icon: AlertCircle,
    ring: 'border-rose-200',
    text: 'text-rose-700',
    bg: 'bg-rose-50/80'
  },
  warning: {
    icon: AlertTriangle,
    ring: 'border-amber-200',
    text: 'text-amber-700',
    bg: 'bg-amber-50/80'
  },
  info: {
    icon: Info,
    ring: 'border-sky-200',
    text: 'text-sky-700',
    bg: 'bg-sky-50/80'
  }
};

function buildId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback((payload) => {
    const id = payload?.id ?? buildId();
    const toast = {
      id,
      type: payload?.type ?? 'info',
      title: payload?.title ?? '',
      message: payload?.message ?? '',
      duration: Number.isFinite(payload?.duration) ? payload.duration : DEFAULT_DURATION_MS
    };

    setToasts((prev) => [...prev, toast]);

    if (toast.duration > 0) {
      const timer = setTimeout(() => removeToast(id), toast.duration);
      timersRef.current.set(id, timer);
    }

    return id;
  }, [removeToast]);

  const value = useMemo(() => ({ showToast, removeToast }), [showToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-6 top-6 z-[9999] flex w-[360px] max-w-[90vw] flex-col gap-3">
        {toasts.map((toast) => {
          const styles = toastStyles[toast.type] ?? toastStyles.info;
          const Icon = styles.icon;

          return (
            <div
              key={toast.id}
              className={`rounded-2xl border ${styles.ring} ${styles.bg} px-4 py-3 shadow-lg shadow-black/5 backdrop-blur-sm`}
              role="status"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white ${styles.text}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  {toast.title ? (
                    <p className="text-sm font-bold text-slate-900">{toast.title}</p>
                  ) : null}
                  {toast.message ? (
                    <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
