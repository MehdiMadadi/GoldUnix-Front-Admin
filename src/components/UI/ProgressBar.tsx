type BarColor = 'primary' | 'blue' | 'emerald' | 'amber' | 'rose';

interface ProgressBarProps {
  label: string;
  value: string;
  percent: number;
  color?: BarColor;
}

const COLOR_CLASSES: Record<BarColor, string> = {
  primary: 'bg-primary',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
};

export default function ProgressBar({ label, value, percent, color = 'primary' }: ProgressBarProps) {
  return (
    <div>
      <div className="flex justify-between text-xs md:text-sm mb-1">
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-bold text-slate-900 dark:text-white">{value}</span>
      </div>
      <div className="w-full h-2 md:h-3 bg-slate-200 dark:bg-border-dark rounded-full overflow-hidden">
        <div
          className={`h-full ${COLOR_CLASSES[color]} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}
