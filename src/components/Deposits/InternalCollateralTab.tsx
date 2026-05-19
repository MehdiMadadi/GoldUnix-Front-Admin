import { useState } from 'react';
import { INTERNAL_COLLATERALS } from '../../data/collateral';
import type { InternalCollateral } from '../../data/collateral';
import Badge from '../UI/Badge';
import AccDrawer from '../Accounting/AccDrawer';
import AccBottomSheet from '../Accounting/AccBottomSheet';
import ConfirmDialog from '../Trades/ConfirmDialog';

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

function StatusBadge({ status }: { status: InternalCollateral['status'] }) {
  if (status === 'healthy') return <Badge variant="success">سالم</Badge>;
  if (status === 'margin_warning') return <Badge variant="warning">هشدار مارجین</Badge>;
  if (status === 'margin_call') return <Badge variant="danger">مارجین کال</Badge>;
  return <Badge variant="neutral">تسویه اجباری</Badge>;
}

function LtvBar({ ltv, warn, liquidate }: { ltv: number; warn: number; liquidate: number }) {
  const color = ltv >= liquidate ? 'bg-rose-500' : ltv >= warn ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className={` font-bold ${ltv >= liquidate ? 'text-rose-600 dark:text-rose-400' : ltv >= warn ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
          {ltv.toLocaleString('fa-IR')}٪
        </span>
        <span className="text-slate-400 text-[0.6rem]">حد: {warn}٪ / {liquidate.toLocaleString('fa-IR')}٪</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(100, ltv)}%` }} />
        <div className="absolute top-0 bottom-0 w-px bg-amber-400" style={{ left: `${warn}%` }} />
        <div className="absolute top-0 bottom-0 w-px bg-rose-500" style={{ left: `${liquidate}%` }} />
      </div>
    </div>
  );
}

function CollateralDetail({ item, onClose, isMobile }: { item: InternalCollateral; onClose: () => void; isMobile?: boolean }) {
  const [confirm, setConfirm] = useState<'add' | 'settle' | null>(null);
  const [addAmount, setAddAmount] = useState('');

  const content = (
    <div className="p-5 space-y-5 overflow-y-auto">
      <div className="flex items-center gap-2">
        <StatusBadge status={item.status} />
        {item.depositId && <Badge variant="info" small>سپرده طلا</Badge>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">نوع دارایی</p>
          <p className="font-bold text-sm">{item.assetType}</p>
        </div>
        <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">مقدار وثیقه</p>
          <p className="font-bold  text-sm">{item.quantityGrams.toLocaleString('fa-IR')} گرم</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">ارزش روز</p>
          <p className="font-bold  text-sm text-emerald-700 dark:text-emerald-300">{fmt(item.currentValue)}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">اعتبار داده‌شده</p>
          <p className="font-bold  text-sm text-blue-700 dark:text-blue-300">{fmt(item.creditGranted)}</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">LTV فعلی</p>
        <LtvBar ltv={item.ltv} warn={item.marginCallThreshold} liquidate={item.liquidationThreshold} />
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            Margin Call: {item.marginCallThreshold.toLocaleString('fa-IR')}٪
          </div>
          <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            Liquidation: {item.liquidationThreshold.toLocaleString('fa-IR')}٪
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">تاریخ فعال‌سازی</span>
          <span className="font-medium">{item.activationDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">قیمت هر گرم</span>
          <span className="">{fmt(item.currentPricePerGram)}</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">سوابق تغییر LTV</p>
        <div className="space-y-2">
          {item.ltvHistory.map((h, i) => (
            <div key={i} className="flex items-start justify-between p-3 bg-slate-50 dark:bg-background-dark/60 rounded-xl gap-3">
              <div className="flex-1">
                <p className="text-xs text-slate-500">{h.note}</p>
                <p className="text-[0.6rem] text-slate-400 mt-0.5">{h.date}</p>
              </div>
              <span className={` font-bold text-sm ${h.ltv >= item.marginCallThreshold ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {h.ltv.toLocaleString('fa-IR')}٪
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">افزایش وثیقه</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="مقدار (گرم)"
            value={addAmount}
            onChange={e => setAddAmount(e.target.value)}
            className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100 placeholder:text-slate-400"
          />
          <button
            onClick={() => setConfirm('add')}
            disabled={!addAmount}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            افزودن
          </button>
        </div>
      </div>

      <button onClick={() => setConfirm('settle')} className="w-full py-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-sm font-semibold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-sm">account_balance</span>
        تسویه اعتبار
      </button>

      <ConfirmDialog
        open={confirm === 'add'}
        title="افزایش وثیقه"
        description={`آیا می‌خواهید ${addAmount} گرم طلا به وثیقه اضافه کنید؟`}
        confirmLabel="تأیید"
        variant="info"
        onConfirm={() => { setConfirm(null); setAddAmount(''); }}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === 'settle'}
        title="تسویه اعتبار"
        description="آیا می‌خواهید اعتبار فعال را تسویه و وثیقه را آزاد کنید؟"
        confirmLabel="تسویه"
        variant="warning"
        onConfirm={() => setConfirm(null)}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );

  if (isMobile) return <div className="overflow-y-auto">{content}</div>;
  return content;
}

export default function InternalCollateralTab() {
  const [selected, setSelected] = useState<InternalCollateral | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      <div className="desktop-view table-container">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500 text-xs">
            <tr>
              <th className="px-4 py-3 text-right font-medium">کاربر</th>
              <th className="px-4 py-3 text-right font-medium">نوع دارایی</th>
              <th className="px-4 py-3 text-right font-medium">مقدار (گرم)</th>
              <th className="px-4 py-3 text-right font-medium">ارزش روز</th>
              <th className="px-4 py-3 text-right font-medium">اعتبار داده‌شده</th>
              <th className="px-4 py-3 text-right font-medium" style={{ minWidth: 180 }}>LTV</th>
              <th className="px-4 py-3 text-right font-medium">وضعیت</th>
              <th className="px-4 py-3 text-center font-medium w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {INTERNAL_COLLATERALS.map(item => (
              <tr
                key={item.id}
                className={`transition-colors cursor-pointer ${
                  item.status === 'margin_call' ? 'bg-rose-50/40 dark:bg-rose-950/10' :
                  item.status === 'margin_warning' ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''
                } hover:bg-slate-50 dark:hover:bg-background-dark/40`}
                onClick={() => setSelected(item)}
              >
                <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white">{item.userName}</td>
                <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300">{item.assetType}</td>
                <td className="px-4 py-3.5  font-bold">{item.quantityGrams.toLocaleString('fa-IR')}</td>
                <td className="px-4 py-3.5  text-slate-700 dark:text-slate-300">{fmt(item.currentValue)}</td>
                <td className="px-4 py-3.5  text-blue-600 dark:text-blue-400 font-bold">{fmt(item.creditGranted)}</td>
                <td className="px-4 py-3.5 min-w-[180px]">
                  <LtvBar ltv={item.ltv} warn={item.marginCallThreshold} liquidate={item.liquidationThreshold} />
                </td>
                <td className="px-4 py-3.5"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setSelected(item)} className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-view p-4 space-y-3">
        {INTERNAL_COLLATERALS.map(item => (
          <div
            key={item.id}
            className={`user-card cursor-pointer ${
              item.status === 'margin_call' ? 'border-rose-200 dark:border-rose-800' :
              item.status === 'margin_warning' ? 'border-amber-200 dark:border-amber-800' : ''
            }`}
            onClick={() => setSelected(item)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{item.userName}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.assetType} · {item.quantityGrams.toLocaleString('fa-IR')} گرم</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div className="mb-3">
              <LtvBar ltv={item.ltv} warn={item.marginCallThreshold} liquidate={item.liquidationThreshold} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">ارزش: <span className=" font-bold text-slate-700 dark:text-slate-300">{fmt(item.currentValue)}</span></span>
              <span className="text-slate-400">اعتبار: <span className=" font-bold text-blue-600">{fmt(item.creditGranted)}</span></span>
            </div>
          </div>
        ))}
      </div>

      {!isMobile ? (
        <AccDrawer open={selected !== null} title="جزئیات وثیقه اعتبار" subtitle={selected?.userName} icon="lock" onClose={() => setSelected(null)}>
          {selected && <CollateralDetail item={selected} onClose={() => setSelected(null)} />}
        </AccDrawer>
      ) : (
        <AccBottomSheet open={selected !== null} title="جزئیات وثیقه اعتبار" onClose={() => setSelected(null)}>
          {selected && <CollateralDetail item={selected} onClose={() => setSelected(null)} isMobile />}
        </AccBottomSheet>
      )}
    </>
  );
}
