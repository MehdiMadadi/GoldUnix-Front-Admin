import type { InventoryItem } from '../../data/treasury';
import Badge from '../UI/Badge';

function TxTypeBadge({ type }: { type: 'IN' | 'OUT' | 'ADJUST' }) {
  if (type === 'IN') return <Badge variant="success" small>ورود</Badge>;
  if (type === 'OUT') return <Badge variant="danger" small>خروج</Badge>;
  return <Badge variant="warning" small>اصلاح</Badge>;
}

function CoverageBar({ ratio }: { ratio: number }) {
  const pct = Math.min((ratio / 2) * 100, 100);
  const color = ratio >= 1.3 ? 'bg-emerald-500' : ratio >= 1.1 ? 'bg-amber-500' : 'bg-rose-500';
  const textColor = ratio >= 1.3 ? 'text-emerald-600 dark:text-emerald-400' : ratio >= 1.1 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400';
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-slate-500">نسبت پوشش</span>
        <span className={`text-xs font-bold  ${textColor}`}>{ratio.toFixed(2)}</span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface Props {
  item: InventoryItem;
}

export default function InventoryDrawerContent({ item }: Props) {
  return (
    <div className="p-5 space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/20 dark:to-background-dark rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30">
        <p className="text-xs text-slate-500 mb-1">دارایی</p>
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{item.asset}</h3>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">location_on</span>
          {item.vault}
        </p>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">اطلاعات کلی</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'موجودی کل', value: item.total, color: 'text-slate-900 dark:text-white' },
            { label: 'موجودی آزاد', value: item.available, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'رزرو شده', value: item.reserved, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'میانگین بهای تمام‌شده', value: item.avgCostPerUnit, color: 'text-blue-600 dark:text-blue-400' },
          ].map(row => (
            <div key={row.label} className="bg-slate-50 dark:bg-background-dark rounded-xl p-3">
              <p className="text-[0.65rem] text-slate-400 mb-1">{row.label}</p>
              <p className={` font-bold text-sm ${row.color}`}>
                {row.value.toLocaleString('fa-IR')} <span className="text-[0.6rem] font-normal">{row.label === 'میانگین بهای تمام‌شده' ? 'ریال' : item.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <CoverageBar ratio={item.coverageRatio} />

      {item.coverageRatio < 1.1 && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-400 text-xs">
          <span className="material-symbols-outlined text-sm">warning</span>
          نسبت پوشش پایین‌تر از حد امن است
        </div>
      )}
      {item.coverageRatio >= 1.1 && item.coverageRatio < 1.3 && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-400 text-xs">
          <span className="material-symbols-outlined text-sm">info</span>
          نسبت پوشش در محدوده هشدار است
        </div>
      )}

      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">تاریخچه تراکنش‌ها</h4>
        <div className="space-y-2">
          {item.transactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-border-light dark:border-border-dark">
              <div className="flex items-center gap-2.5">
                <TxTypeBadge type={tx.type} />
                <span className="text-sm text-slate-700 dark:text-slate-300">{tx.label}</span>
              </div>
              <div className="text-left">
                <p className={` text-sm font-bold ${tx.type === 'IN' ? 'text-emerald-600' : tx.type === 'OUT' ? 'text-rose-600' : 'text-amber-600'}`}>
                  {tx.type === 'OUT' ? '-' : tx.qty > 0 ? '+' : ''}{tx.qty.toLocaleString('fa-IR')} {item.unit}
                </p>
                <p className="text-[0.65rem] text-slate-400">{tx.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
