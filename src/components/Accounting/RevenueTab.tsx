import { REVENUE_ENTRIES, REVENUE_STATS, REVENUE_TYPE_LABELS } from '../../data/accounting';
import type { RevenueType } from '../../data/accounting';
import Badge from '../UI/Badge';
import KpiCard from '../UI/KpiCard';
import ProgressBar from '../UI/ProgressBar';

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

const TYPE_BADGE_MAP: Partial<Record<RevenueType, JSX.Element>> = {
  spread: <Badge variant="primary">اسپرد</Badge>,
  fee: <Badge variant="success">کارمزد</Badge>,
  liquidation_fee: <Badge variant="danger">تسویه اجباری</Badge>,
  credit_interest: <Badge variant="info">سود اعتبار</Badge>,
  deposit_income: <Badge variant="neutral">سپرده</Badge>,
};

const totalByType = Object.entries(REVENUE_TYPE_LABELS).map(([key, label]) => {
  const total = REVENUE_ENTRIES.filter(r => r.type === (key as RevenueType)).reduce((s, r) => s + r.amount, 0);
  return { key, label, total };
}).filter(r => r.total > 0);

const grandTotal = totalByType.reduce((s, r) => s + r.total, 0);

const PROGRESS_COLORS: ('primary' | 'blue' | 'emerald' | 'amber')[] = ['primary', 'emerald', 'blue', 'amber'];

export default function RevenueTab() {
  return (
    <div>
      <div className="p-5 grid grid-cols-2 lg:grid-cols-4 gap-3 border-b border-border-light dark:border-border-dark">
        <KpiCard label="درآمد امروز" value={fmt(REVENUE_STATS.today)} unit="ریال" change="+۵٪" changePositive />
        <KpiCard label="درآمد ماه" value={fmt(REVENUE_STATS.month)} unit="ریال" change="+۱۲٪" changePositive />
        <KpiCard label="جمع اسپرد" value={fmt(REVENUE_STATS.totalSpread)} unit="ریال" />
        <KpiCard label="کارمزد تسویه اجباری" value={fmt(REVENUE_STATS.liquidationFee)} unit="ریال" />
      </div>

      <div className="p-5 border-b border-border-light dark:border-border-dark">
        <h4 className="font-bold mb-4">توزیع درآمد بر اساس نوع</h4>
        <div className="space-y-3">
          {totalByType.map((r, i) => (
            <ProgressBar
              key={r.key}
              label={r.label}
              value={`${fmt(r.total)} ریال`}
              percent={grandTotal > 0 ? Math.round((r.total / grandTotal) * 100) : 0}
              color={PROGRESS_COLORS[i % PROGRESS_COLORS.length]}
            />
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark flex justify-between items-center">
          <span className="font-bold">جمع کل</span>
          <span className="font-extrabold text-primary ">{fmt(grandTotal)} ریال</span>
        </div>
      </div>

      <div className="desktop-view table-container">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500 text-xs">
            <tr>
              <th className="px-4 py-3 text-right font-medium">تاریخ</th>
              <th className="px-4 py-3 text-right font-medium">نوع درآمد</th>
              <th className="px-4 py-3 text-right font-medium">دارایی</th>
              <th className="px-4 py-3 text-right font-medium">مبلغ</th>
              <th className="px-4 py-3 text-right font-medium">مرجع معامله</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {REVENUE_ENTRIES.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors">
                <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{r.date}</td>
                <td className="px-4 py-3.5">{TYPE_BADGE_MAP[r.type]}</td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 text-xs">{r.asset}</td>
                <td className="px-4 py-3.5  font-bold text-emerald-600 dark:text-emerald-400">+{fmt(r.amount)}</td>
                <td className="px-4 py-3.5  text-primary text-xs">{r.referenceId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-view p-4 space-y-3">
        {REVENUE_ENTRIES.map(r => (
          <div key={r.id} className="user-card space-y-2">
            <div className="flex items-start justify-between">
              {TYPE_BADGE_MAP[r.type]}
              <span className=" font-bold text-emerald-600 dark:text-emerald-400">+{fmt(r.amount)} ریال</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{r.asset}</span>
              <span>{r.date}</span>
            </div>
            <p className=" text-xs text-primary">{r.referenceId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
