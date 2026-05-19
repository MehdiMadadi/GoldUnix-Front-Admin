import { useState } from 'react';
import { GOLD_DEPOSITS, PLAN_LABELS } from '../../data/collateral';
import type { GoldDeposit } from '../../data/collateral';
import Badge from '../UI/Badge';
import AccDrawer from '../Accounting/AccDrawer';
import AccBottomSheet from '../Accounting/AccBottomSheet';
import GoldDepositDrawer from './GoldDepositDrawer';

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

function StatusBadge({ status }: { status: GoldDeposit['status'] }) {
  if (status === 'active') return <Badge variant="success">فعال</Badge>;
  if (status === 'matured') return <Badge variant="info">سررسید</Badge>;
  if (status === 'early_unlock') return <Badge variant="warning">زودهنگام</Badge>;
  return <Badge variant="neutral">وثیقه شده</Badge>;
}

export default function GoldDepositTab() {
  const [selected, setSelected] = useState<GoldDeposit | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const currentValue = (d: GoldDeposit) => d.quantityGrams * d.currentPricePerGram;

  return (
    <>
      <div className="desktop-view table-container">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500 text-xs">
            <tr>
              <th className="px-4 py-3 text-right font-medium">کاربر</th>
              <th className="px-4 py-3 text-right font-medium">پلن</th>
              <th className="px-4 py-3 text-right font-medium">مقدار (گرم)</th>
              <th className="px-4 py-3 text-right font-medium">ارزش روز</th>
              <th className="px-4 py-3 text-right font-medium">سود انباشته</th>
              <th className="px-4 py-3 text-right font-medium">شروع</th>
              <th className="px-4 py-3 text-right font-medium">سررسید</th>
              <th className="px-4 py-3 text-right font-medium">وثیقه‌پذیر</th>
              <th className="px-4 py-3 text-right font-medium">وضعیت</th>
              <th className="px-4 py-3 text-center font-medium w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {GOLD_DEPOSITS.map(d => (
              <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors cursor-pointer" onClick={() => setSelected(d)}>
                <td className="px-4 py-3.5">
                  <p className="font-semibold text-slate-900 dark:text-white">{d.userName}</p>
                  <p className="text-xs text-primary  mt-0.5">{d.contractNumber}</p>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300">{PLAN_LABELS[d.plan]}</td>
                <td className="px-4 py-3.5  font-bold text-slate-900 dark:text-white">{d.quantityGrams.toLocaleString('fa-IR')}</td>
                <td className="px-4 py-3.5  text-slate-700 dark:text-slate-300">{fmt(currentValue(d))}</td>
                <td className="px-4 py-3.5">
                  <p className=" font-bold text-emerald-600 dark:text-emerald-400">
                    +{d.accruedProfitGrams.toLocaleString('fa-IR', { maximumFractionDigits: 2 })} گرم
                  </p>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{d.startDate}</td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{d.endDate}</td>
                <td className="px-4 py-3.5">
                  {d.usableAsCollateral
                    ? <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"><span className="material-symbols-outlined text-sm">check_circle</span>بله</span>
                    : <span className="text-xs text-slate-400">خیر</span>}
                </td>
                <td className="px-4 py-3.5"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setSelected(d)} className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-view p-4 space-y-3">
        {GOLD_DEPOSITS.map(d => {
          const val = currentValue(d);
          const pnl = val - d.quantityGrams * d.entryPricePerGram;
          return (
            <div key={d.id} className="user-card cursor-pointer" onClick={() => setSelected(d)}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{d.userName}</p>
                  <p className="text-xs text-primary  mt-0.5">{d.contractNumber}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                <div className="bg-slate-50 dark:bg-background-dark/60 rounded-xl p-2">
                  <p className="text-slate-400">مقدار</p>
                  <p className="font-bold ">{d.quantityGrams.toLocaleString('fa-IR')}g</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-2">
                  <p className="text-slate-400">سود</p>
                  <p className="font-bold  text-emerald-600">+{d.accruedProfitGrams.toFixed(1)}g</p>
                </div>
                <div className={`rounded-xl p-2 ${pnl >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-rose-50 dark:bg-rose-950/20'}`}>
                  <p className="text-slate-400">P&L</p>
                  <p className={`font-bold  text-xs ${pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pnl >= 0 ? '+' : ''}{fmt(pnl)}</p>
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{PLAN_LABELS[d.plan]}</span>
                <span>{d.remainingDays.toLocaleString('fa-IR')} روز باقی</span>
              </div>
            </div>
          );
        })}
      </div>

      {!isMobile ? (
        <AccDrawer open={selected !== null} title="جزئیات سپرده طلا" subtitle={selected?.userName} icon="savings" onClose={() => setSelected(null)}>
          <GoldDepositDrawer deposit={selected} onClose={() => setSelected(null)} />
        </AccDrawer>
      ) : (
        <AccBottomSheet open={selected !== null} title="جزئیات سپرده طلا" onClose={() => setSelected(null)}>
          <GoldDepositDrawer deposit={selected} onClose={() => setSelected(null)} isMobile />
        </AccBottomSheet>
      )}
    </>
  );
}
