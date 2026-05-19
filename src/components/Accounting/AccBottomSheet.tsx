import type { ReactNode } from 'react';

interface AccBottomSheetProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AccBottomSheet({ open, title, onClose, children, footer }: AccBottomSheetProps) {
  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={onClose} style={{ zIndex: 55 }} />
      <div
        className={`fixed left-0 right-0 bottom-0 bg-white dark:bg-surface-dark flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]`}
        style={{
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '1.5rem',
          zIndex: 60,
          maxHeight: '88vh',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark shrink-0">
          <div className="w-12 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto absolute top-3 left-1/2 -translate-x-1/2" />
          <h3 className="font-bold">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-border-light dark:border-border-dark p-5">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
