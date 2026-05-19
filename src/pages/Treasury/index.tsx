import { useState, useEffect } from 'react';
import Header from '../../components/Layout/Header';
import KpiCard from '../../components/UI/KpiCard';
import { INVENTORY_ITEMS, DELIVERIES, HEDGE_ITEMS } from '../../data/treasury';
import OverviewTab from '../../components/Treasury/OverviewTab';
import InventoryTab from '../../components/Treasury/InventoryTab';
import DeliveriesTab from '../../components/Treasury/DeliveriesTab';
import HedgingTab from '../../components/Treasury/HedgingTab';
import { Api, FinancialAccountDto, PhysicalDeliveryResponseDto } from '../../lib/client';

type Tab = 'overview' | 'inventory' | 'deliveries' | 'hedging';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'نمای کلی', icon: 'dashboard' },
  { id: 'inventory', label: 'موجودی', icon: 'inventory_2' },
  { id: 'deliveries', label: 'تحویل‌ها', icon: 'local_shipping' },
  { id: 'hedging', label: 'پوشش تعهدات', icon: 'shield' },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

function fmtGold(n: number, unit: string) {
  if (n >= 1000) return `${(n / 1000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}k ${unit}`;
  return `${n} ${unit}`;
}

export default function TreasuryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const isMobile = useIsMobile();

  const totalGold = INVENTORY_ITEMS.reduce((s, i) => s + (i.unit === 'گرم' ? i.total : 0), 0);
  const freeGold = INVENTORY_ITEMS.reduce((s, i) => s + (i.unit === 'گرم' ? i.available : 0), 0);
  const reservedGold = INVENTORY_ITEMS.reduce((s, i) => s + (i.unit === 'گرم' ? i.reserved : 0), 0);
  const netExposure = HEDGE_ITEMS.reduce((s, h) => s + h.netExposure, 0);
  const avgCoverage = HEDGE_ITEMS.reduce((s, h) => s + h.coverageRatio, 0) / HEDGE_ITEMS.length;
  const pendingDeliveries = DELIVERIES.filter(d => d.status === 'pending' || d.status === 'ready').length;

  const criticalCoverage = HEDGE_ITEMS.some(h => h.coverageRatio < 1.1);
  const warnCoverage = !criticalCoverage && HEDGE_ITEMS.some(h => h.coverageRatio < 1.3);

  const coverageBadge = avgCoverage >= 1.3 ? 'ایمن' : avgCoverage >= 1.1 ? 'هشدار' : 'بحرانی';
  const coveragePositive = avgCoverage >= 1.3;

  const [treasury, setTreasury] = useState<FinancialAccountDto[]>();
  const client = new Api();
  const fetchTreasury = async () => {
    const response = await client.api.treasuryWallets();
    setTreasury(response.data);
  }

  const [delivers, setDelivers] = useState<PhysicalDeliveryResponseDto[]>();
  const fetchDelivers = async () => {
    const response = await client.api.deliverRequests();
    setDelivers(response.data);
  }

  useEffect(() => {
    fetchTreasury();
    fetchDelivers();
  }, []);

  return (
    <>
      <Header title="خزانه" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto space-y-5">

          {criticalCoverage && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-400">
              <span className="material-symbols-outlined">dangerous</span>
              <div>
                <p className="font-bold text-sm">نسبت پوشش پایین‌تر از حد امن است</p>
                <p className="text-xs mt-0.5 opacity-80">یک یا چند دارایی دارای coverage کمتر از ۱.۱ هستند. اقدام فوری لازم است.</p>
              </div>
            </div>
          )}
          {warnCoverage && !criticalCoverage && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 rounded-2xl text-amber-700 dark:text-amber-400">
              <span className="material-symbols-outlined">warning</span>
              <p className="text-sm font-medium">برخی دارایی‌ها در محدوده هشدار پوشش قرار دارند (۱.۱ تا ۱.۳)</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-slate-900 dark:text-white font-bold text-lg hidden md:block">وضعیت خزانه</h2>
            <div className="flex gap-2 mr-auto">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-border-dark text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <span className="material-symbols-outlined text-base">refresh</span>
                <span className="hidden sm:inline">بروزرسانی</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                <span className="material-symbols-outlined text-base">download</span>
                <span className="hidden sm:inline">خروجی</span>
              </button>
            </div>
          </div>

          <div className={`${isMobile ? 'flex gap-3 overflow-x-auto pb-1 scrollbar-hide' : 'grid grid-cols-2 lg:grid-cols-6 gap-3'}`}>
            {isMobile ? (
              <>
                {[
                  { label: 'موجودی کل طلا', value: fmtGold(totalGold, 'گرم'), change: undefined, changePositive: undefined },
                  { label: 'موجودی آزاد', value: fmtGold(freeGold, 'گرم'), change: undefined, changePositive: undefined },
                  { label: 'موجودی رزرو', value: fmtGold(reservedGold, 'گرم'), change: undefined, changePositive: undefined },
                  { label: 'تعهد باز', value: fmtGold(netExposure, 'گرم'), change: undefined, changePositive: undefined },
                  { label: 'Coverage Ratio', value: avgCoverage.toFixed(2), change: coverageBadge, changePositive: coveragePositive },
                  { label: 'تحویل در انتظار', value: pendingDeliveries.toLocaleString('fa-IR'), unit: 'سفارش', change: undefined, changePositive: undefined },
                ].map(kpi => (
                  <div key={kpi.label} className="shrink-0 w-36">
                    <KpiCard label={kpi.label} value={kpi.value} change={kpi.change} changePositive={kpi.changePositive} />
                  </div>
                ))}
              </>
            ) : (
              <>
                <KpiCard label="موجودی کل طلا" value={totalGold.toLocaleString('fa-IR')} unit="گرم" />
                <KpiCard label="موجودی آزاد" value={freeGold.toLocaleString('fa-IR')} unit="گرم" />
                <KpiCard label="موجودی رزرو" value={reservedGold.toLocaleString('fa-IR')} unit="گرم" />
                <KpiCard label="تعهد باز" value={netExposure.toLocaleString('fa-IR')} unit="گرم" />
                <KpiCard
                  label="Coverage Ratio"
                  value={avgCoverage.toFixed(2)}
                  change={coverageBadge}
                  changePositive={coveragePositive}
                />
                <KpiCard label="تحویل در انتظار" value={pendingDeliveries.toLocaleString('fa-IR')} unit="سفارش" />
              </>
            )}
          </div>

          <div className="flex gap-1 bg-slate-100 dark:bg-border-dark p-1 rounded-2xl overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
                  ? 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div>
            {activeTab === 'overview' && <OverviewTab inventory={INVENTORY_ITEMS} hedge={HEDGE_ITEMS} isMobile={isMobile} />}
            {activeTab === 'inventory' && <InventoryTab items={treasury} isMobile={isMobile} />}
            {activeTab === 'deliveries' && <DeliveriesTab items={delivers} isMobile={isMobile} />}
            {activeTab === 'hedging' && <HedgingTab items={HEDGE_ITEMS} isMobile={isMobile} />}
          </div>

        </div>
      </div>
    </>
  );
}
