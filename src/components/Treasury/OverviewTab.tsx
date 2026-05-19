import { useState } from 'react';
import type { InventoryItem, HedgeItem } from '../../data/treasury';
import { NET_EXPOSURE_CHART } from '../../data/treasury';
import AccDrawer from '../Accounting/AccDrawer';
import AccBottomSheet from '../Accounting/AccBottomSheet';

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}م`;
  return n;
}

function CoverageIndicator({ ratio }: { ratio: number }) {
  const color = ratio >= 1.3 ? 'text-emerald-600 dark:text-emerald-400' : ratio >= 1.1 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400';
  const icon = ratio >= 1.3 ? 'check_circle' : ratio >= 1.1 ? 'warning' : 'dangerous';
  return (
    <span className={`flex items-center gap-1  font-bold ${color}`}>
      <span className="material-symbols-outlined text-base">{icon}</span>
      {ratio.toFixed(2)}
    </span>
  );
}

function MiniLineChart() {
  const data = NET_EXPOSURE_CHART;
  const min = Math.min(...data.map(d => d.value));
  const max = Math.max(...data.map(d => d.value));
  const range = max - min || 1;
  const w = 100 / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * w;
    const y = 100 - ((d.value - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-32 md:h-48">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(59 130 246)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polyline
          points={`${points} 100,100 0,100`}
          fill="url(#chartGradient)"
          stroke="none"
        />
        <polyline
          points={points}
          fill="none"
          stroke="rgb(59 130 246)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((d, i) => {
          const x = i * w;
          const y = 100 - ((d.value - min) / range) * 80 - 10;
          return (
            <circle key={d.label} cx={x} cy={y} r="1.5" fill="rgb(59 130 246)" vectorEffect="non-scaling-stroke" />
          );
        })}
      </svg>
      <div className="flex justify-between mt-1">
        {data.map(d => (
          <span key={d.label} className="text-[0.55rem] text-slate-400">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

interface Props {
  inventory: InventoryItem[];
  hedge: HedgeItem[];
  isMobile: boolean;
}

export default function OverviewTab({ inventory, hedge, isMobile }: Props) {
  const [drawerItem, setDrawerItem] = useState<'inventory' | 'exposure' | null>(null);

  const totalInventory = inventory.reduce((s, i) => s + i.total, 0);
  const totalAvailable = inventory.reduce((s, i) => s + i.available, 0);
  const totalReserved = inventory.reduce((s, i) => s + i.reserved, 0);
  const totalNetExposure = hedge.reduce((s, h) => s + h.netExposure, 0);
  const avgCoverage = hedge.reduce((s, h) => s + h.coverageRatio, 0) / hedge.length;

  const drawerTitle = drawerItem === 'inventory' ? 'جزئیات موجودی' : 'جزئیات ریسک';

  const drawerContent = (
    <div className="p-5 space-y-4">
      {drawerItem === 'inventory' ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">موجودی کل</p>
              <p className=" font-bold text-slate-900 dark:text-white">{fmt(totalInventory)} گرم</p>
            </div>
            <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">موجودی آزاد</p>
              <p className=" font-bold text-emerald-600 dark:text-emerald-400">{fmt(totalAvailable)} گرم</p>
            </div>
            <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">رزرو شده</p>
              <p className=" font-bold text-amber-600 dark:text-amber-400">{fmt(totalReserved)} گرم</p>
            </div>
          </div>
          <div className="space-y-2">
            {inventory.map(item => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.asset}</span>
                <div className="text-left">
                  <p className=" text-sm font-bold">{item.total.toLocaleString('fa-IR')} {item.unit}</p>
                  <p className="text-xs text-slate-400">{item.vault}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">خالص Exposure</p>
              <p className=" font-bold text-slate-900 dark:text-white">{fmt(totalNetExposure)} گرم</p>
            </div>
            <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">میانگین پوشش</p>
              <CoverageIndicator ratio={avgCoverage} />
            </div>
          </div>
          <div className="space-y-2">
            {hedge.map(h => (
              <div key={h.id} className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark">
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{h.asset}</span>
                <div className="flex items-center gap-3">
                  <span className=" text-xs text-slate-500">Net: {h.netExposure.toLocaleString('fa-IR')}</span>
                  <CoverageIndicator ratio={h.coverageRatio} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const cards = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      <button
        onClick={() => setDrawerItem('inventory')}
        className="text-right bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-5 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-md group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">inventory_2</span>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-400 transition-colors">open_in_new</span>
        </div>
        <p className="text-xs text-slate-500 mb-1">موجودی فیزیکی</p>
        <p className=" font-extrabold text-2xl text-slate-900 dark:text-white">{fmt(totalInventory)} <span className="text-sm font-medium text-slate-400">گرم</span></p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <p className="text-[0.65rem] text-slate-400">آزاد</p>
            <p className=" text-sm font-bold text-emerald-600">{fmt(totalAvailable)}</p>
          </div>
          <div>
            <p className="text-[0.65rem] text-slate-400">رزرو</p>
            <p className=" text-sm font-bold text-amber-600">{fmt(totalReserved)}</p>
          </div>
        </div>
      </button>

      <button
        onClick={() => setDrawerItem('exposure')}
        className="text-right bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-5 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-md group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">trending_up</span>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-400 transition-colors">open_in_new</span>
        </div>
        <p className="text-xs text-slate-500 mb-1">خالص Exposure</p>
        <p className=" font-extrabold text-2xl text-slate-900 dark:text-white">{fmt(totalNetExposure)} <span className="text-sm font-medium text-slate-400">گرم</span></p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {hedge.slice(0, 2).map(h => (
            <div key={h.id}>
              <p className="text-[0.65rem] text-slate-400 truncate">{h.asset}</p>
              <CoverageIndicator ratio={h.coverageRatio} />
            </div>
          ))}
        </div>
      </button>
    </div>
  );

  return (
    <div>
      <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-blue-500">show_chart</span>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">روند Net Exposure (گرم)</h3>
        </div>
        <MiniLineChart />
      </div>

      {cards}

      {isMobile ? (
        <AccBottomSheet open={drawerItem !== null} title={drawerTitle} onClose={() => setDrawerItem(null)}>
          {drawerContent}
        </AccBottomSheet>
      ) : (
        <AccDrawer open={drawerItem !== null} title={drawerTitle} icon={drawerItem === 'inventory' ? 'inventory_2' : 'trending_up'} onClose={() => setDrawerItem(null)}>
          {drawerContent}
        </AccDrawer>
      )}
    </div>
  );
}
