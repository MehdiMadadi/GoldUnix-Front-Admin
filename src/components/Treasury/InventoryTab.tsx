import { useState } from 'react';
import type { InventoryItem } from '../../data/treasury';
import AccDrawer from '../Accounting/AccDrawer';
import AccBottomSheet from '../Accounting/AccBottomSheet';
import InventoryDrawerContent from './InventoryDrawer';
import ConfirmDialog from '../Trades/ConfirmDialog';
import { FinancialAccountDto } from '../../lib/client';

function CoverageChip({ ratio }: { ratio: number }) {
  if (ratio >= 1.3) return <span className="inline-flex items-center gap-1 text-xs font-bold  text-emerald-600 dark:text-emerald-400"><span className="material-symbols-outlined text-sm">check_circle</span>{ratio.toFixed(2)}</span>;
  if (ratio >= 1.1) return <span className="inline-flex items-center gap-1 text-xs font-bold  text-amber-600 dark:text-amber-400"><span className="material-symbols-outlined text-sm">warning</span>{ratio.toFixed(2)}</span>;
  return <span className="inline-flex items-center gap-1 text-xs font-bold  text-rose-600 dark:text-rose-400"><span className="material-symbols-outlined text-sm">dangerous</span>{ratio.toFixed(2)}</span>;
}

type ActionType = 'in' | 'out' | 'transfer' | 'adjust';

const ACTION_CONFIG: Record<ActionType, { label: string; icon: string; btnClass: string; confirmVariant: 'info' | 'warning' | 'danger'; confirmLabel: string; confirmDesc: string }> = {
  in: { label: 'ثبت ورود', icon: 'add_circle', btnClass: 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20', confirmVariant: 'info', confirmLabel: 'ثبت ورود', confirmDesc: 'آیا از ثبت ورود موجودی مطمئن هستید؟' },
  out: { label: 'ثبت خروج', icon: 'remove_circle', btnClass: 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20', confirmVariant: 'danger', confirmLabel: 'ثبت خروج', confirmDesc: 'آیا از ثبت خروج موجودی مطمئن هستید؟' },
  transfer: { label: 'انتقال', icon: 'swap_horiz', btnClass: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20', confirmVariant: 'info', confirmLabel: 'انتقال', confirmDesc: 'آیا از انتقال موجودی مطمئن هستید؟' },
  adjust: { label: 'اصلاح موجودی', icon: 'tune', btnClass: 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20', confirmVariant: 'warning', confirmLabel: 'اصلاح', confirmDesc: 'آیا از اصلاح موجودی مطمئن هستید؟' },
};

interface Props {
  items: FinancialAccountDto[];
  isMobile: boolean;
}

export default function InventoryTab({ items, isMobile }: Props) {
  const [selected, setSelected] = useState<FinancialAccountDto | null>(null);
  const [confirm, setConfirm] = useState<{ item: FinancialAccountDto; action: ActionType } | null>(null);

  const handleAction = (item: FinancialAccountDto, action: ActionType) => setConfirm({ item, action });

  const mobileCards = (
    <div className="space-y-3">
      {items?.map(item => (
        <div key={item.id} className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.currency?.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{item.currency?.code}</p>
            </div>
            {/* <CoverageChip ratio={item.coverageRatio} /> */}
          </div>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'کل', value: item.balances?.balance, color: '' },
              { label: 'آزاد', value: item.balances?.balance, color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'مسدود', value: item.balances?.blockBalance, color: 'text-amber-600 dark:text-amber-400' },
            ].map(c => (
              <div key={c.label} className="bg-slate-50 dark:bg-background-dark rounded-xl p-2 text-center">
                <p className="text-[0.6rem] text-slate-400">{c.label}</p>
                <p className={` font-bold text-xs ${c.color}`}>{item.balances?.balance > 1000 ? `${(c.value / 1000).toFixed(1)}k` : c.value.toLocaleString('fa-IR')}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSelected(item)} className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">visibility</span>
              جزئیات
            </button>
            <button onClick={() => handleAction(item, 'in')} className="flex-1 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">add</span>
              ورود
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const desktopTable = (
    <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500">
          <tr>
            <th className="px-5 py-3.5 text-right font-medium">دارایی</th>
            <th className="px-5 py-3.5 text-right font-medium">کل</th>
            <th className="px-5 py-3.5 text-right font-medium">مسدود</th>
            <th className="px-5 py-3.5 text-right font-medium">آزاد</th>
            {/* <th className="px-5 py-3.5 text-right font-medium">میانگین بهای</th> */}
            <th className="px-5 py-3.5 text-right font-medium">خزانه</th>
            {/* <th className="px-5 py-3.5 text-right font-medium">پوشش</th> */}
            <th className="px-5 py-3.5 text-right font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light dark:divide-border-dark">
          {items?.map(item => (
            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors">
              <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{item.currency?.name}</td>
              <td className="px-5 py-4  font-bold">{item.balances?.balance.toLocaleString('fa-IR')} <span className="text-xs text-slate-400">{item.currency?.code}</span></td>
              <td className="px-5 py-4  text-amber-600 dark:text-amber-400">{item.balances?.blockBalance.toLocaleString('fa-IR')}</td>
              <td className="px-5 py-4  text-emerald-600 dark:text-emerald-400">{item.balances?.balance.toLocaleString('fa-IR')}</td>
              {/* <td className="px-5 py-4  text-xs text-slate-500">{item.avgCostPerUnit.toLocaleString('fa-IR')}</td> */}
              <td className="px-5 py-4 text-slate-600 dark:text-slate-400 text-xs">{item.type?.description}</td>
              {/* <td className="px-5 py-4"><CoverageChip ratio={item.coverageRatio} /></td> */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-1">
                  <button onClick={() => setSelected(item)} title="جزئیات" className="w-8 h-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 flex items-center justify-center transition-colors text-blue-600">
                    <span className="material-symbols-outlined text-base">visibility</span>
                  </button>
                  {(['in', 'out', 'transfer', 'adjust'] as ActionType[]).map(action => (
                    <button key={action} onClick={() => handleAction(item, action)} title={ACTION_CONFIG[action].label} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${ACTION_CONFIG[action].btnClass}`}>
                      <span className="material-symbols-outlined text-base">{ACTION_CONFIG[action].icon}</span>
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="desktop-view">{desktopTable}</div>
      <div className="mobile-view">{mobileCards}</div>

      {isMobile ? (
        <AccBottomSheet open={selected !== null} title="جزئیات موجودی" onClose={() => setSelected(null)}>
          {selected && <InventoryDrawerContent item={selected} />}
        </AccBottomSheet>
      ) : (
        <AccDrawer open={selected !== null} title="جزئیات موجودی" icon="inventory_2" onClose={() => setSelected(null)}>
          {selected && <InventoryDrawerContent item={selected} />}
        </AccDrawer>
      )}

      {confirm && (
        <ConfirmDialog
          open
          title={ACTION_CONFIG[confirm.action].label}
          description={`${ACTION_CONFIG[confirm.action].confirmDesc}\nدارایی: ${confirm.item.asset}`}
          confirmLabel={ACTION_CONFIG[confirm.action].confirmLabel}
          variant={ACTION_CONFIG[confirm.action].confirmVariant}
          onConfirm={() => setConfirm(null)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}
