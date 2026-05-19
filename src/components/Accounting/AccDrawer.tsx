import type { ReactNode } from 'react';

interface AccDrawerProps {
  open: boolean;
  title: string;
  subtitle?: string;
  icon?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}

export default function AccDrawer({ open, title, subtitle, icon = 'article', onClose, children, footer, width = 480 }: AccDrawerProps) {
  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={onClose} style={{ zIndex: 55 }} />
      <div
        className="fixed top-0 left-0 bottom-0 flex flex-col bg-white dark:bg-surface-dark border-r border-border-light dark:border-border-dark transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          width: `min(${width}px, 100vw)`,
          zIndex: 60,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary">{icon}</span>
            <div>
              <h3 className="font-bold">{title}</h3>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
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
