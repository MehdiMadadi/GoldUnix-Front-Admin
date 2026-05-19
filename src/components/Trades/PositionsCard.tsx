import type { Position } from '../../data/positions';
import Badge from '../UI/Badge';

interface PositionsCardProps {
  positions: Position[];
  onRowClick?: (position: Position) => void;
}

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} م`;
  if (Math.abs(n) >= 1_000_000) return `${Math.round(n / 1_000_000)} م`;
  return n;
}

export default function PositionsCard({ positions, onRowClick }: PositionsCardProps) {
  return (
    <div className="p-4 space-y-3">
      {positions.map(pos => (
        <div
          key={pos.id}
          className={`rounded-2xl border p-4 space-y-3 cursor-pointer active:scale-[0.99] transition-transform ${
            pos.riskLevel === 'red'
              ? 'border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/10'
              : pos.riskLevel === 'yellow'
              ? 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/10'
              : 'border-border-light dark:border-border-dark bg-white dark:bg-surface-dark'
          }`}
          onClick={() => onRowClick?.(pos)}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{pos.userName}</h4>
                <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-full font-medium ${pos.userType === 'trade' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {pos.userType === 'trade' ? 'صنف' : 'عادی'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{pos.asset} — انقضا: {pos.expiryDate}</p>
            </div>
            {pos.riskLevel === 'red'
              ? <Badge variant="danger">بحرانی</Badge>
              : pos.riskLevel === 'yellow'
              ? <Badge variant="warning">هشدار</Badge>
              : <Badge variant="success">ایمن</Badge>}
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white/70 dark:bg-background-dark/40 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">جهت / مقدار</p>
              <div className="flex items-center gap-1">
                {pos.side === 'buy'
                  ? <Badge variant="success" small>خرید</Badge>
                  : <Badge variant="danger" small>فروش</Badge>}
                <span className=" font-bold text-slate-800 dark:text-slate-200">{pos.quantityOpen}</span>
              </div>
            </div>
            <div className="bg-white/70 dark:bg-background-dark/40 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">قیمت ورود</p>
              <p className=" font-bold text-slate-800 dark:text-slate-200">{fmt(pos.avgEntryPrice)}</p>
            </div>
            <div className="bg-white/70 dark:bg-background-dark/40 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">قیمت بازار</p>
              <p className=" font-bold text-slate-800 dark:text-slate-200">{fmt(pos.currentMarketPrice)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className={`rounded-xl p-2.5 ${pos.unrealizedPnl >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-rose-50 dark:bg-rose-950/20'}`}>
              <p className="text-slate-400 mb-1">سود/زیان باز</p>
              <p className={` font-bold ${pos.unrealizedPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {pos.unrealizedPnl >= 0 ? '+' : ''}{fmt(pos.unrealizedPnl)}
              </p>
            </div>
            <div className="bg-white/70 dark:bg-background-dark/40 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">مارجین</p>
              <p className=" font-bold text-slate-700 dark:text-slate-300">{fmt(pos.marginPosted)}</p>
            </div>
            <div className="bg-white/70 dark:bg-background-dark/40 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">نسبت مارجین</p>
              <p className={` font-bold ${
                pos.marginRatio >= 130 ? 'text-emerald-600 dark:text-emerald-400' :
                pos.marginRatio >= 110 ? 'text-amber-600 dark:text-amber-400' :
                'text-rose-600 dark:text-rose-400'
              }`}>{pos?.marginRatio?.toLocaleString('fa-IR')}٪</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-border-light dark:border-border-dark">
            <span className="text-xs text-slate-500">تسویه اجباری: <span className=" font-medium text-slate-700 dark:text-slate-300">{fmt(pos.liquidationPrice)}</span></span>
            <div className="flex items-center gap-1.5">
              <button title="بستن پوزیشن" className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <button title="افزایش مارجین" className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
              <button title="کاهش مارجین" className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <button title="تبدیل به فیزیکی" className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">swap_horiz</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
