import { useState } from 'react';
import { JOURNAL_ENTRIES, JOURNAL_TYPE_LABELS, ACCOUNT_LABELS } from '../../data/accounting';
import type { JournalEntry } from '../../data/accounting';
import Badge from '../UI/Badge';
import AccDrawer from './AccDrawer';

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

const TYPE_BADGE: Record<string, JSX.Element> = {
  trade: <Badge variant="primary">معامله</Badge>,
  deposit: <Badge variant="success">واریز</Badge>,
  withdrawal: <Badge variant="warning">برداشت</Badge>,
  margin_call: <Badge variant="danger">مارجین کال</Badge>,
  margin_release: <Badge variant="info">آزادسازی</Badge>,
  fee: <Badge variant="neutral">کارمزد</Badge>,
  credit_alloc: <Badge variant="info">اعتبار</Badge>,
  credit_repay: <Badge variant="success">بازپرداخت</Badge>,
  liquidation: <Badge variant="danger">تسویه اجباری</Badge>,
  adjustment: <Badge variant="warning">تعدیل</Badge>,
};

function JournalEntryDrawer({ entry, onClose }: { entry: JournalEntry | null; onClose: () => void }) {
  if (!entry) return null;
  return (
    <AccDrawer
      open={entry !== null}
      title={`سند شماره: ${entry.id}`}
      subtitle={entry.date}
      icon="receipt_long"
      onClose={onClose}
    >
      <div className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 mb-1">نوع رویداد</p>
            <div>{TYPE_BADGE[entry.type] ?? <Badge variant="neutral">{JOURNAL_TYPE_LABELS[entry.type]}</Badge>}</div>
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-500 mb-1">مرجع</p>
            <span className=" text-sm text-primary font-bold">{entry.referenceId}</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">دارایی</p>
          <p className="font-bold text-slate-900 dark:text-white">{entry.asset}</p>
        </div>

        <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border-light dark:border-border-dark">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">ردیف‌های سند</p>
          </div>
          {entry.lines.map((line, i) => (
            <div key={i} className={`flex items-start justify-between px-4 py-3 border-b border-border-light dark:border-border-dark last:border-0 ${
              line.type === 'debit' ? 'bg-rose-50/40 dark:bg-rose-950/10' : 'bg-emerald-50/40 dark:bg-emerald-950/10'
            }`}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-0.5">
                  {line.type === 'debit'
                    ? <span className="text-rose-600 dark:text-rose-400">بدهکار</span>
                    : <span className="text-emerald-600 dark:text-emerald-400">بستانکار</span>}
                </p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{ACCOUNT_LABELS[line.account]}</p>
                <p className="text-xs text-slate-400 mt-0.5">{line.description}</p>
              </div>
              <span className={` font-bold text-sm mt-1 ${line.type === 'debit' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {line.type === 'debit' ? '-' : '+'}{fmt(line.amount)}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
          <div className="flex items-center justify-between py-2 border-b border-border-light dark:border-border-dark">
            <span className="text-sm text-slate-500">حساب بدهکار</span>
            <span className="font-semibold text-sm">{ACCOUNT_LABELS[entry.debitAccount]}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border-light dark:border-border-dark">
            <span className="text-sm text-slate-500">حساب بستانکار</span>
            <span className="font-semibold text-sm">{ACCOUNT_LABELS[entry.creditAccount]}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border-light dark:border-border-dark">
            <span className="text-sm text-slate-500">مبلغ کل</span>
            <span className=" font-extrabold text-slate-900 dark:text-white">{fmt(entry.amount)} ریال</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border-light dark:border-border-dark">
            <span className="text-sm text-slate-500">تاریخ و ساعت</span>
            <span className="text-sm text-slate-700 dark:text-slate-300">{entry.date}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-500">ثبت‌کننده</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{entry.createdBy}</span>
          </div>
        </div>
      </div>
    </AccDrawer>
  );
}

export default function GeneralLedgerTab() {
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const [search, setSearch] = useState('');

  const filtered = JOURNAL_ENTRIES.filter(je =>
    !search || je.referenceId.includes(search) || je.id.includes(search) || je.asset.includes(search)
  );

  return (
    <>
      <div className="p-4 border-b border-border-light dark:border-border-dark">
        <input
          type="text"
          placeholder="جستجو بر اساس شناسه سند یا مرجع..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>

      <div className="desktop-view table-container">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500 text-xs">
            <tr>
              <th className="px-4 py-3 text-right font-medium">تاریخ</th>
              <th className="px-4 py-3 text-right font-medium">نوع رویداد</th>
              <th className="px-4 py-3 text-right font-medium">حساب بدهکار</th>
              <th className="px-4 py-3 text-right font-medium">حساب بستانکار</th>
              <th className="px-4 py-3 text-right font-medium">دارایی</th>
              <th className="px-4 py-3 text-right font-medium">مبلغ</th>
              <th className="px-4 py-3 text-right font-medium">مرجع</th>
              <th className="px-4 py-3 text-right font-medium">ثبت‌کننده</th>
              <th className="px-4 py-3 text-center font-medium w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {filtered.map(je => (
              <tr key={je.id} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors cursor-pointer" onClick={() => setSelected(je)}>
                <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{je.date}</td>
                <td className="px-4 py-3.5">{TYPE_BADGE[je.type]}</td>
                <td className="px-4 py-3.5 text-xs text-rose-600 dark:text-rose-400 font-medium">{ACCOUNT_LABELS[je.debitAccount]}</td>
                <td className="px-4 py-3.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">{ACCOUNT_LABELS[je.creditAccount]}</td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 text-xs">{je.asset}</td>
                <td className="px-4 py-3.5  font-bold text-slate-900 dark:text-white">{fmt(je.amount)}</td>
                <td className="px-4 py-3.5  text-primary text-xs">{je.referenceId}</td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{je.createdBy}</td>
                <td className="px-4 py-3.5">
                  <button onClick={e => { e.stopPropagation(); setSelected(je); }} className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-view p-4 space-y-3">
        {filtered.map(je => (
          <div key={je.id} className="user-card space-y-3 cursor-pointer" onClick={() => setSelected(je)}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className=" text-xs text-primary font-bold">{je.id}</p>
                <p className="text-xs text-slate-400 mt-0.5">{je.date}</p>
              </div>
              {TYPE_BADGE[je.type]}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{je.asset}</span>
              <span className=" font-bold text-slate-900 dark:text-white">{fmt(je.amount)} ریال</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-rose-500 dark:text-rose-400">بد: {ACCOUNT_LABELS[je.debitAccount]}</span>
              <span className="text-slate-400">←</span>
              <span className="text-emerald-500 dark:text-emerald-400">بس: {ACCOUNT_LABELS[je.creditAccount]}</span>
            </div>
          </div>
        ))}
      </div>

      <JournalEntryDrawer entry={selected} onClose={() => setSelected(null)} />
    </>
  );
}
