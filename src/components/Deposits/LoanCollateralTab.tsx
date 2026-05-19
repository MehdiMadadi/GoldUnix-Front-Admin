import { useState } from 'react';
import { LOAN_COLLATERALS, PROVIDER_LABELS } from '../../data/collateral';
import type { LoanCollateral, LoanProvider, LoanStatus } from '../../data/collateral';
import Badge from '../UI/Badge';
import AccDrawer from '../Accounting/AccDrawer';
import AccBottomSheet from '../Accounting/AccBottomSheet';
import ConfirmDialog from '../Trades/ConfirmDialog';

type FilterState = { provider: LoanProvider | ''; status: LoanStatus | ''; };

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

function StatusBadge({ status }: { status: LoanStatus }) {
  if (status === 'active') return <Badge variant="success">فعال</Badge>;
  if (status === 'overdue') return <Badge variant="warning">معوقه</Badge>;
  if (status === 'margin_call') return <Badge variant="danger">مارجین کال</Badge>;
  if (status === 'closed') return <Badge variant="neutral">بسته</Badge>;
  return <Badge variant="danger">نکول</Badge>;
}

function LtvBar({ ltv, warn }: { ltv: number; warn: number }) {
  const color = ltv >= warn ? 'bg-rose-500' : ltv >= warn - 10 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className={` font-bold ${ltv >= warn ? 'text-rose-600 dark:text-rose-400' : ltv >= warn - 10 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
          {ltv.toLocaleString('fa-IR')}٪
        </span>
        <span className="text-slate-400 text-[0.6rem]">حد هشدار: {warn}٪</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(100, ltv)}%` }} />
        <div className="absolute top-0 bottom-0 w-px bg-rose-400" style={{ left: `${warn}%` }} />
      </div>
    </div>
  );
}


function FilterDrawer({ open, filters, onChange, onClose, isMobile }: {
  open: boolean; filters: FilterState; onChange: (f: FilterState) => void; onClose: () => void; isMobile?: boolean;
}) {
  const [local, setLocal] = useState<FilterState>(filters);

  const inner = (
    <div className="p-5 space-y-5">
      <div>
        <label className="text-xs font-semibold text-slate-500 block mb-2">پرووایدر</label>
        <div className="flex flex-wrap gap-2">
          {(['', ...Object.keys(PROVIDER_LABELS)] as Array<LoanProvider | ''>).map(p => (
            <button
              key={p}
              onClick={() => setLocal(f => ({ ...f, provider: p }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${local.provider === p ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
            >
              {p === '' ? 'همه' : PROVIDER_LABELS[p as LoanProvider]}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 block mb-2">وضعیت</label>
        <div className="flex flex-wrap gap-2">
          {(['', 'active', 'overdue', 'margin_call', 'closed', 'default'] as Array<LoanStatus | ''>).map(s => (
            <button
              key={s}
              onClick={() => setLocal(f => ({ ...f, status: s }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${local.status === s ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
            >
              {s === '' ? 'همه' : s === 'active' ? 'فعال' : s === 'overdue' ? 'معوقه' : s === 'margin_call' ? 'مارجین کال' : s === 'closed' ? 'بسته' : 'نکول'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => setLocal({ provider: '', status: '' })} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition-colors">
          پاک‌سازی
        </button>
        <button onClick={() => { onChange(local); onClose(); }} className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors">
          اعمال
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AccBottomSheet open={open} title="فیلترها" onClose={onClose}>
        {inner}
      </AccBottomSheet>
    );
  }

  return (
    <AccDrawer open={open} title="فیلترها" icon="filter_list" onClose={onClose} width={360}>
      {inner}
    </AccDrawer>
  );
}

function LoanDetail({ loan, onClose, isMobile }: { loan: LoanCollateral; onClose: () => void; isMobile?: boolean }) {
  const [confirm, setConfirm] = useState<'add' | 'prepay' | null>(null);
  const [addAmount, setAddAmount] = useState('');

  const remainingLoan = loan.installments.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);

  const content = (
    <div className="p-5 space-y-5 overflow-y-auto">
      <div className="flex items-center gap-2">
        <StatusBadge status={loan.status} />
        <Badge variant="info">{PROVIDER_LABELS[loan.provider]}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">دارایی وثیقه</p>
          <p className="font-bold text-sm">{loan.assetType}</p>
          <p className="text-xs text-slate-500 mt-0.5">{loan.collateralGrams.toLocaleString('fa-IR')} گرم</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">ارزش روز وثیقه</p>
          <p className="font-bold  text-sm text-emerald-700 dark:text-emerald-300">{fmt(loan.collateralValue)}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">مبلغ وام</p>
          <p className="font-bold  text-sm text-blue-700 dark:text-blue-300">{fmt(loan.loanAmount)}</p>
        </div>
        <div className="bg-rose-50 dark:bg-rose-950/20 rounded-2xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">باقی‌مانده</p>
          <p className="font-bold  text-sm text-rose-700 dark:text-rose-300">{fmt(remainingLoan)}</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">نرخ سود سالانه</span>
          <span className=" font-bold">{loan.interestRate.toLocaleString('fa-IR')}٪</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">مدت</span>
          <span>{loan.durationMonths.toLocaleString('fa-IR')} ماه</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">قسط ماهانه</span>
          <span className=" font-bold">{fmt(loan.monthlyInstallment)}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-border-light dark:border-border-dark pt-3">
          <span className="text-slate-500">اقساط باقیمانده</span>
          <span className="font-bold text-primary">{loan.remainingInstallments.toLocaleString('fa-IR')} قسط</span>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">LTV فعلی</p>
        <LtvBar ltv={loan.ltv} warn={loan.warningThreshold} />
        <div className="mt-2 flex justify-between text-xs">
          <span className="text-slate-400">شروع: {loan.startDate}</span>
          <span className="text-slate-400">سررسید: {loan.endDate}</span>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">وثیقه نزد</p>
        <p className="font-medium text-sm">{loan.collateralHeldBy}</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">سوابق اقساط</p>
        <div className="space-y-2">
          {loan.installments.map(inst => (
            <div key={inst.number} className={`flex items-center justify-between p-3 rounded-xl gap-3 ${
              inst.status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-950/20' :
              inst.status === 'overdue' ? 'bg-rose-50 dark:bg-rose-950/20' :
              'bg-slate-50 dark:bg-background-dark/60'
            }`}>
              <div>
                <p className="text-xs font-semibold">قسط {inst.number.toLocaleString('fa-IR')}</p>
                <p className="text-[0.6rem] text-slate-400 mt-0.5">{inst.paidDate ? `پرداخت: ${inst.paidDate}` : `سررسید: ${inst.dueDate}`}</p>
              </div>
              <div className="text-left">
                <p className=" font-bold text-sm">{fmt(inst.amount)}</p>
                <p className={`text-[0.6rem] font-bold ${inst.status === 'paid' ? 'text-emerald-600 dark:text-emerald-400' : inst.status === 'overdue' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {inst.status === 'paid' ? 'پرداخت‌شده' : inst.status === 'overdue' ? 'معوقه' : 'در انتظار'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">سوابق تغییر ارزش وثیقه</p>
        <div className="space-y-2">
          {loan.collateralValueHistory.map((h, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-background-dark/60 rounded-xl">
              <span className="text-xs text-slate-400">{h.date}</span>
              <div className="text-left">
                <span className=" font-bold text-sm">{fmt(h.value)}</span>
                <span className={`text-xs mr-2 ${h.ltv >= loan.warningThreshold ? 'text-rose-500' : 'text-slate-400'}`}>LTV: {h.ltv.toLocaleString('fa-IR')}٪</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">افزایش وثیقه</p>
        <div className="flex gap-2 mb-4">
          <input
            type="number"
            placeholder="مقدار (گرم)"
            value={addAmount}
            onChange={e => setAddAmount(e.target.value)}
            className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100 placeholder:text-slate-400"
          />
          <button onClick={() => setConfirm('add')} disabled={!addAmount} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-50">
            افزودن
          </button>
        </div>
        <button onClick={() => setConfirm('prepay')} className="w-full py-3 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">payments</span>
          بازپرداخت زودهنگام
        </button>
      </div>

      <ConfirmDialog open={confirm === 'add'} title="افزایش وثیقه" description={`افزودن ${addAmount} گرم طلا به عنوان وثیقه پیش ${PROVIDER_LABELS[loan.provider]}`} confirmLabel="تأیید" variant="info" onConfirm={() => { setConfirm(null); setAddAmount(''); }} onCancel={() => setConfirm(null)} />
      <ConfirmDialog open={confirm === 'prepay'} title="بازپرداخت زودهنگام" description="آیا می‌خواهید باقیمانده وام را زودتر از موعد تسویه کنید؟" confirmLabel="بازپرداخت" variant="info" onConfirm={() => setConfirm(null)} onCancel={() => setConfirm(null)} />
    </div>
  );

  if (isMobile) return <div className="overflow-y-auto">{content}</div>;
  return content;
}

export default function LoanCollateralTab() {
  const [selected, setSelected] = useState<LoanCollateral | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ provider: '', status: '' });
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const filtered = LOAN_COLLATERALS.filter(l =>
    (!filters.provider || l.provider === filters.provider) &&
    (!filters.status || l.status === filters.status)
  );

  const activeFilters = (filters.provider ? 1 : 0) + (filters.status ? 1 : 0);

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
        <p className="text-xs text-slate-500">{filtered.length.toLocaleString('fa-IR')} تسهیلات</p>
        <button
          onClick={() => setFilterOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${activeFilters > 0 ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
        >
          <span className="material-symbols-outlined text-sm">filter_list</span>
          فیلتر
          {activeFilters > 0 && <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">{activeFilters.toLocaleString('fa-IR')}</span>}
        </button>
      </div>

      <div className="desktop-view table-container">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500 text-xs">
            <tr>
              <th className="px-4 py-3 text-right font-medium">کاربر</th>
              <th className="px-4 py-3 text-right font-medium">پرووایدر</th>
              <th className="px-4 py-3 text-right font-medium">دارایی وثیقه</th>
              <th className="px-4 py-3 text-right font-medium">ارزش وثیقه</th>
              <th className="px-4 py-3 text-right font-medium">مبلغ وام</th>
              <th className="px-4 py-3 text-right font-medium">نرخ</th>
              <th className="px-4 py-3 text-right font-medium" style={{ minWidth: 160 }}>LTV</th>
              <th className="px-4 py-3 text-right font-medium">سررسید</th>
              <th className="px-4 py-3 text-right font-medium">وضعیت</th>
              <th className="px-4 py-3 text-center font-medium w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {filtered.map(l => (
              <tr
                key={l.id}
                className={`transition-colors cursor-pointer ${
                  l.status === 'margin_call' || l.status === 'default' ? 'bg-rose-50/40 dark:bg-rose-950/10' :
                  l.status === 'overdue' ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''
                } hover:bg-slate-50 dark:hover:bg-background-dark/40`}
                onClick={() => setSelected(l)}
              >
                <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white">{l.userName}</td>
                <td className="px-4 py-3.5">
                  <Badge variant="info">{PROVIDER_LABELS[l.provider]}</Badge>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                  {l.assetType}
                  <span className="text-slate-400 mr-1">({l.collateralGrams.toLocaleString('fa-IR')}g)</span>
                </td>
                <td className="px-4 py-3.5  text-slate-700 dark:text-slate-300">{fmt(l.collateralValue)}</td>
                <td className="px-4 py-3.5  font-bold text-blue-600 dark:text-blue-400">{fmt(l.loanAmount)}</td>
                <td className="px-4 py-3.5  text-slate-600 dark:text-slate-300">{l.interestRate.toLocaleString('fa-IR')}٪</td>
                <td className="px-4 py-3.5 min-w-[160px]">
                  <LtvBar ltv={l.ltv} warn={l.warningThreshold} />
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{l.endDate}</td>
                <td className="px-4 py-3.5"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setSelected(l)} className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-view p-4 space-y-3">
        {filtered.map(l => (
          <div
            key={l.id}
            className={`user-card cursor-pointer ${
              l.status === 'margin_call' ? 'border-rose-200 dark:border-rose-800' :
              l.status === 'overdue' ? 'border-amber-200 dark:border-amber-800' : ''
            }`}
            onClick={() => setSelected(l)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{l.userName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Badge variant="info">{PROVIDER_LABELS[l.provider]}</Badge>
                </div>
              </div>
              <StatusBadge status={l.status} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
              <div>
                <p className="text-slate-400">وثیقه</p>
                <p className=" font-bold">{l.collateralGrams.toLocaleString('fa-IR')}g</p>
              </div>
              <div>
                <p className="text-slate-400">وام</p>
                <p className=" font-bold text-blue-600">{fmt(l.loanAmount)}</p>
              </div>
              <div>
                <p className="text-slate-400">LTV</p>
                <p className={` font-bold ${l.ltv >= l.warningThreshold ? 'text-rose-600' : 'text-emerald-600'}`}>{l.ltv.toLocaleString('fa-IR')}٪</p>
              </div>
            </div>
            <p className="text-xs text-slate-400">سررسید: {l.endDate} · {l.remainingInstallments.toLocaleString('fa-IR')} قسط باقیمانده</p>
          </div>
        ))}
      </div>

      <FilterDrawer open={filterOpen} filters={filters} onChange={setFilters} onClose={() => setFilterOpen(false)} isMobile={isMobile} />

      {!isMobile ? (
        <AccDrawer open={selected !== null} title="جزئیات تسهیلات" subtitle={selected?.userName} icon="corporate_fare" onClose={() => setSelected(null)}>
          {selected && <LoanDetail loan={selected} onClose={() => setSelected(null)} />}
        </AccDrawer>
      ) : (
        <AccBottomSheet open={selected !== null} title="جزئیات تسهیلات" onClose={() => setSelected(null)}>
          {selected && <LoanDetail loan={selected} onClose={() => setSelected(null)} isMobile />}
        </AccBottomSheet>
      )}
    </>
  );
}
