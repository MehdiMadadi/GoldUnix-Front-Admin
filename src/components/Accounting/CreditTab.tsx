import { useState } from 'react';
import { CREDIT_ACCOUNTS } from '../../data/accounting';
import type { CreditAccount } from '../../data/accounting';
import Badge from '../UI/Badge';
import AccDrawer from './AccDrawer';

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

const HISTORY_TYPE_LABELS: Record<string, string> = {
  allocation: 'تخصیص اعتبار',
  repayment: 'بازپرداخت',
  interest: 'سود',
  penalty: 'جریمه',
};
const HISTORY_TYPE_COLOR: Record<string, string> = {
  allocation: 'text-blue-600 dark:text-blue-400',
  repayment: 'text-emerald-600 dark:text-emerald-400',
  interest: 'text-amber-600 dark:text-amber-400',
  penalty: 'text-rose-600 dark:text-rose-400',
};
const HISTORY_SIGN: Record<string, string> = {
  allocation: '+',
  repayment: '-',
  interest: '-',
  penalty: '-',
};

function CreditDrawer({ account, onClose }: { account: CreditAccount | null; onClose: () => void }) {
  if (!account) return null;
  const usePct = account.limit > 0 ? Math.round((account.used / account.limit) * 100) : 0;

  return (
    <AccDrawer open icon="credit_score" title="جزئیات اعتبار" subtitle={account.userName} onClose={onClose}>
      <div className="p-5 space-y-5">
        <div className="flex items-center gap-2">
          {account.status === 'active' && <Badge variant="success">فعال</Badge>}
          {account.status === 'overdue' && <Badge variant="danger">معوقه</Badge>}
          {account.status === 'suspended' && <Badge variant="warning">تعلیق</Badge>}
          {account.status === 'cleared' && <Badge variant="neutral">تسویه</Badge>}
          {account.userType === 'trade' && <Badge variant="info">صنف</Badge>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">سقف اعتبار</p>
            <p className="font-bold  text-sm">{fmt(account.limit)}</p>
          </div>
          <div className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">استفاده‌شده</p>
            <p className="font-bold  text-sm text-rose-600 dark:text-rose-400">{fmt(account.used)}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-3 text-center">
            <p className="text-xs text-slate-400 mb-1">در دسترس</p>
            <p className="font-bold  text-sm text-emerald-600 dark:text-emerald-400">{fmt(account.available)}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>میزان استفاده</span>
            <span>{usePct.toLocaleString('fa-IR')}٪</span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${usePct >= 90 ? 'bg-rose-500' : usePct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${usePct}%` }}
            />
          </div>
        </div>

        {account.overdueAmount > 0 && (
          <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800">
            <span className="material-symbols-outlined text-rose-600 text-sm mt-0.5">warning</span>
            <div>
              <p className="text-xs font-bold text-rose-700 dark:text-rose-300">مبلغ معوقه</p>
              <p className=" font-extrabold text-rose-700 dark:text-rose-300">{fmt(account.overdueAmount)} ریال</p>
            </div>
          </div>
        )}

        <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">نرخ بهره ماهانه</span>
            <span className=" font-bold">{account.interestRate.toLocaleString('fa-IR')}٪</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">سررسید</span>
            <span className="font-semibold">{account.dueDate}</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">تاریخچه اعتبار</p>
          <div className="space-y-2">
            {account.history.map(h => (
              <div key={h.id} className="flex items-start justify-between p-3 bg-slate-50 dark:bg-background-dark/60 rounded-xl gap-3">
                <div className="flex-1">
                  <p className={`text-xs font-bold ${HISTORY_TYPE_COLOR[h.type]}`}>{HISTORY_TYPE_LABELS[h.type]}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{h.note}</p>
                  <p className="text-[0.6rem] text-slate-400 mt-0.5">{h.date}</p>
                </div>
                <span className={` font-bold text-sm ${HISTORY_TYPE_COLOR[h.type]}`}>
                  {HISTORY_SIGN[h.type]}{fmt(h.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AccDrawer>
  );
}

export default function CreditTab() {
  const [selected, setSelected] = useState<CreditAccount | null>(null);

  return (
    <>
      <div className="desktop-view table-container">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500 text-xs">
            <tr>
              <th className="px-4 py-3 text-right font-medium">کاربر</th>
              <th className="px-4 py-3 text-right font-medium">سقف اعتبار</th>
              <th className="px-4 py-3 text-right font-medium">استفاده‌شده</th>
              <th className="px-4 py-3 text-right font-medium">در دسترس</th>
              <th className="px-4 py-3 text-right font-medium">معوقه</th>
              <th className="px-4 py-3 text-right font-medium">سررسید</th>
              <th className="px-4 py-3 text-right font-medium">وضعیت</th>
              <th className="px-4 py-3 text-center font-medium">جزئیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {CREDIT_ACCOUNTS.map(acc => (
              <tr key={acc.userId} className={`hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors cursor-pointer ${acc.status === 'overdue' ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''}`} onClick={() => setSelected(acc)}>
                <td className="px-4 py-3.5">
                  <div className="font-semibold text-slate-900 dark:text-white">{acc.userName}</div>
                  <div className="text-xs text-slate-400">{acc.userType === 'trade' ? 'صنف' : 'عادی'}</div>
                </td>
                <td className="px-4 py-3.5  text-slate-700 dark:text-slate-300">{fmt(acc.limit)}</td>
                <td className="px-4 py-3.5  font-bold text-rose-600 dark:text-rose-400">{fmt(acc.used)}</td>
                <td className="px-4 py-3.5  text-emerald-600 dark:text-emerald-400">{fmt(acc.available)}</td>
                <td className="px-4 py-3.5 ">
                  {acc.overdueAmount > 0 ? <span className="text-rose-600 dark:text-rose-400 font-bold">{fmt(acc.overdueAmount)}</span> : <span className="text-slate-400">—</span>}
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{acc.dueDate}</td>
                <td className="px-4 py-3.5">
                  {acc.status === 'active' && <Badge variant="success">فعال</Badge>}
                  {acc.status === 'overdue' && <Badge variant="danger">معوقه</Badge>}
                  {acc.status === 'suspended' && <Badge variant="warning">تعلیق</Badge>}
                  {acc.status === 'cleared' && <Badge variant="neutral">تسویه</Badge>}
                </td>
                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-center">
                    <button onClick={() => setSelected(acc)} className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-view p-4 space-y-3">
        {CREDIT_ACCOUNTS.map(acc => (
          <div key={acc.userId} className={`user-card cursor-pointer ${acc.status === 'overdue' ? 'border-rose-200 dark:border-rose-800' : ''}`} onClick={() => setSelected(acc)}>
            <div className="flex items-start justify-between mb-3">
              <p className="font-bold text-sm text-slate-900 dark:text-white">{acc.userName}</p>
              {acc.status === 'active' && <Badge variant="success">فعال</Badge>}
              {acc.status === 'overdue' && <Badge variant="danger">معوقه</Badge>}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-slate-400">سقف</p>
                <p className=" font-bold">{fmt(acc.limit)}</p>
              </div>
              <div>
                <p className="text-slate-400">استفاده</p>
                <p className=" font-bold text-rose-600">{fmt(acc.used)}</p>
              </div>
              <div>
                <p className="text-slate-400">موجود</p>
                <p className=" font-bold text-emerald-600">{fmt(acc.available)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreditDrawer account={selected} onClose={() => setSelected(null)} />
    </>
  );
}
