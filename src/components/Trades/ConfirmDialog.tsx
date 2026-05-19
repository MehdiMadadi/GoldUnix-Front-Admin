import { useEffect } from 'react';

export type ConfirmVariant = 'danger' | 'warning' | 'info';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
}

const VARIANT_CONFIG: Record<ConfirmVariant, { icon: string; iconBg: string; iconColor: string; btnClass: string }> = {
  danger: {
    icon: 'delete_forever',
    iconBg: 'bg-rose-100 dark:bg-rose-950/30',
    iconColor: 'text-rose-600 dark:text-rose-400',
    btnClass: 'bg-rose-600 hover:bg-rose-700 text-white',
  },
  warning: {
    icon: 'warning',
    iconBg: 'bg-amber-100 dark:bg-amber-950/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    btnClass: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  info: {
    icon: 'info',
    iconBg: 'bg-blue-100 dark:bg-blue-950/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    btnClass: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'تأیید',
  cancelLabel = 'انصراف',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cfg = VARIANT_CONFIG[variant];

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 90 }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border border-border-light dark:border-border-dark w-[min(420px,calc(100vw-2rem))] mx-4 overflow-hidden animate-fade-in">
        <div className="p-6 flex flex-col items-center text-center gap-4">
          <div className={`w-16 h-16 rounded-full ${cfg.iconBg} flex items-center justify-center`}>
            <span className={`material-symbols-outlined text-3xl ${cfg.iconColor}`}>{cfg.icon}</span>
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="flex gap-3 p-5 pt-0">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); }}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${cfg.btnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
