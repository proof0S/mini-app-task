'use client';

import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: number) => void;
}

const toastStyles = {
  success: {
    bg: 'bg-green-500/90',
    icon: '✅',
  },
  error: {
    bg: 'bg-red-500/90',
    icon: '❌',
  },
  info: {
    bg: 'bg-blue-500/90',
    icon: '💡',
  },
  warning: {
    bg: 'bg-yellow-500/90',
    icon: '⚠️',
  },
};

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: number) => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);

    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const style = toastStyles[toast.type];

  return (
    <div
      className={`${style.bg} backdrop-blur-xl px-4 py-3 rounded-xl shadow-lg border border-white/20 flex items-center gap-3 transition-all duration-300 ${
        isVisible && !isLeaving
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4'
      }`}
    >
      <span className="text-xl">{style.icon}</span>
      <p className="text-white font-medium flex-1">{toast.message}</p>
      <button
        onClick={() => {
          setIsLeaving(true);
          setTimeout(() => onRemove(toast.id), 300);
        }}
        className="text-white/60 hover:text-white transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
