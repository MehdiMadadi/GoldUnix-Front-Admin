interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  change?: string;
  changePositive?: boolean;
  onClick?: () => void;
}

export default function KpiCard({ label, value, unit, change, changePositive, onClick }: KpiCardProps) {
  return (
    <div
      className="card-hover bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-3 md:p-5 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <span className="text-slate-500 dark:text-slate-400 text-[0.7rem] md:text-sm">{label}</span>
        {change && (
          <span className={`text-[0.6rem] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full ${
            changePositive
              ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
          }`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-slate-900 dark:text-white text-base md:text-3xl font-extrabold mt-1 md:mt-2">
        {value}
        {unit && <span className="text-[0.6rem] md:text-sm font-medium text-slate-500 mr-1">{unit}</span>}
      </p>
    </div>
  );
}
