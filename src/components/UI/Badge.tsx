import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  small?: boolean;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
  warning: 'bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
  danger: 'bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400',
  info: 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
  neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
  primary: 'bg-primary/10 text-primary',
};

export default function Badge({ variant, children, small }: BadgeProps) {
  return (
    <span className={`${VARIANT_CLASSES[variant]} ${small ? 'px-2 py-0.5 text-[0.6rem]' : 'px-3 py-1 text-xs'} rounded-full font-medium`}>
      {children}
    </span>
  );
}
