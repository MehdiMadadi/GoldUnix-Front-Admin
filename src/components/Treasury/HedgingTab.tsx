import { useState } from 'react';
import type { HedgeItem } from '../../data/treasury';
import AccDrawer from '../Accounting/AccDrawer';
import AccBottomSheet from '../Accounting/AccBottomSheet';

function CoverageChip({ ratio }: { ratio: number }) {
  if (ratio >= 1.3) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold  bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">
        <span className="material-symbols-outlined text-sm">check_circle</span>{ratio.toFixed(2)}
      </span>
    );
  }
  if (ratio >= 1.1) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold  bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
        <span className="material-symbols-outlined text-sm">warning</span>{ratio.toFixed(2)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold  bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400">
      <span className="material-symbols-outlined text-sm">dangerous</span>{ratio.toFixed(2)}
    </span>
  );
}

function HedgeSuggestion({ qty, unit }: { qty: number; unit: string }) {
  if (qty <= 0) return <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">پوشش کافی</span>;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400">
      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
      پیشنهاد خرید {qty.toLocaleString('fa-IR')} {unit}
    </span>
  );
}

function ExposureDetail({ item }: { item: HedgeItem }) {
  const totalLong = item.longPosition;
  const totalShort = item.shortPosition;
  const net = item.netExposure;
  const physical = item.physical;

  const maxVal = Math.max(totalLong, totalShort, physical);
  const barWidth = (v: number) => `${Math.min((v / maxVal) * 100, 100)}%`;

  return (
    <div className="p-5 space-y-6">
      <div className="bg-gradient-to-br from-amber-50 to-slate-50 dark:from-amber-950/20 dark:to-background-dark rounded-2xl p-4 border border-amber-100 dark:border-amber-900/30">
        <p className="text-xs text-slate-500 mb-1">دارایی</p>
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{item.asset}</h3>
        <div className="mt-2">
          <CoverageChip ratio={item.coverageRatio} />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">پوزیشن‌ها</h4>
        <div className="space-y-3">
          {[
            { label: 'Long کل', value: totalLong, color: 'bg-emerald-500', textColor: 'text-emerald-700 dark:text-emerald-400' },
            { label: 'Short کل', value: totalShort, color: 'bg-rose-500', textColor: 'text-rose-700 dark:text-rose-400' },
            { label: 'Physical', value: physical, color: 'bg-blue-500', textColor: 'text-blue-700 dark:text-blue-400' },
          ].map(row => (
            <div key={row.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-500">{row.label}</span>
                <span className={`text-xs  font-bold ${row.textColor}`}>{row.value.toLocaleString('fa-IR')} {item.unit}</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${row.color}`} style={{ width: barWidth(row.value) }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3">
          <p className="text-[0.65rem] text-slate-400 mb-1">خالص Exposure</p>
          <p className={` font-bold text-sm ${net > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {net > 0 ? '+' : ''}{net.toLocaleString('fa-IR')} {item.unit}
          </p>
        </div>
        <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3">
          <p className="text-[0.65rem] text-slate-400 mb-1">پوشش تعهدات</p>
          <CoverageChip ratio={item.coverageRatio} />
        </div>
      </div>

      {item.hedgeSuggestion > 0 && (
        <div className="flex items-center gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <span className="material-symbols-outlined text-amber-600">campaign</span>
          <div>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">پیشنهاد پوشش ریسک</p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">خرید {item.hedgeSuggestion} {item.unit} برای رسیدن به coverage ≥ 1.3</p>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">بزرگ‌ترین کاربران</h4>
        <div className="space-y-2">
          {item.topUsers.map((u, i) => (
            <div key={u.name} className="flex items-center justify-between py-2.5 border-b border-border-light dark:border-border-dark">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-[0.6rem] font-bold text-blue-600">
                  {i + 1}
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">{u.name}</span>
              </div>
              <span className=" text-sm font-bold text-slate-900 dark:text-white">{u.qty.toLocaleString('fa-IR')} {item.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface Props {
  items: HedgeItem[];
  isMobile: boolean;
}

export default function HedgingTab({ items, isMobile }: Props) {
  const [selected, setSelected] = useState<HedgeItem | null>(null);

  const mobileCards = (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item.id} className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.asset}</h4>
            <CoverageChip ratio={item.coverageRatio} />
          </div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { label: 'Long', value: item.longPosition, color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Short', value: item.shortPosition, color: 'text-rose-600 dark:text-rose-400' },
              { label: 'Net', value: item.netExposure, color: 'text-amber-600 dark:text-amber-400' },
              { label: 'فیزیکی', value: item.physical, color: 'text-blue-600 dark:text-blue-400' },
            ].map(col => (
              <div key={col.label} className="bg-slate-50 dark:bg-background-dark rounded-xl p-2 text-center">
                <p className="text-[0.6rem] text-slate-400">{col.label}</p>
                <p className={` font-bold text-xs ${col.color}`}>{col.value > 1000 ? `${(col.value / 1000).toFixed(0)}k` : col.value.toLocaleString('fa-IR')}</p>
              </div>
            ))}
          </div>
          {item.hedgeSuggestion > 0 && (
            <div className="mb-2">
              <HedgeSuggestion qty={item.hedgeSuggestion} unit={item.unit} />
            </div>
          )}
          <button onClick={() => setSelected(item)} className="w-full py-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">visibility</span>
            جزئیات
          </button>
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
            <th className="px-5 py-3.5 text-right font-medium">Long</th>
            <th className="px-5 py-3.5 text-right font-medium">Short</th>
            <th className="px-5 py-3.5 text-right font-medium">Net Exposure</th>
            <th className="px-5 py-3.5 text-right font-medium">Physical</th>
            <th className="px-5 py-3.5 text-right font-medium">Coverage</th>
            <th className="px-5 py-3.5 text-right font-medium">پیشنهاد Hedge</th>
            <th className="px-5 py-3.5 text-right font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light dark:divide-border-dark">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors">
              <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{item.asset}</td>
              <td className="px-5 py-4  text-emerald-600 dark:text-emerald-400">{item.longPosition}</td>
              <td className="px-5 py-4  text-rose-600 dark:text-rose-400">{item.shortPosition}</td>
              <td className="px-5 py-4  font-bold text-amber-600 dark:text-amber-400">+{item.netExposure.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-400">{item.unit}</span></td>
              <td className="px-5 py-4  text-blue-600 dark:text-blue-400">{item.physical.toLocaleString('fa-IR')}</td>
              <td className="px-5 py-4"><CoverageChip ratio={item.coverageRatio} /></td>
              <td className="px-5 py-4"><HedgeSuggestion qty={item.hedgeSuggestion} unit={item.unit} /></td>
              <td className="px-5 py-4">
                <button onClick={() => setSelected(item)} className="w-8 h-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 flex items-center justify-center transition-colors text-blue-600">
                  <span className="material-symbols-outlined text-base">visibility</span>
                </button>
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
        <AccBottomSheet open={selected !== null} title="جزئیات Exposure" onClose={() => setSelected(null)}>
          {selected && <ExposureDetail item={selected} />}
        </AccBottomSheet>
      ) : (
        <AccDrawer open={selected !== null} title="جزئیات Exposure" icon="trending_up" onClose={() => setSelected(null)}>
          {selected && <ExposureDetail item={selected} />}
        </AccDrawer>
      )}
    </>
  );
}
