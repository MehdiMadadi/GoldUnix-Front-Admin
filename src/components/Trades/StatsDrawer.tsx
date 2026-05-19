import { FiBarChart2, FiX, FiPieChart, FiRefreshCw, FiDollarSign, FiUsers, FiShield, FiMaximize, FiDatabase, FiTruck, FiLayers } from 'react-icons/fi';
import { ORDERS, ORDER_STATS } from '../../data/orders';
import { TRADES, TRADE_STATS } from '../../data/trades';
import { POSITIONS, POSITION_STATS } from '../../data/positions';
import type { MainTab } from './types';

interface StatsDrawerProps {
  open: boolean;
  onClose: () => void;
  activeTab: MainTab;
}

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

function StatRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <div className="text-left">
        <span className="font-bold text-slate-900 dark:text-white">{value}</span>
        {sub && <span className="text-xs text-slate-400 mr-1">{sub}</span>}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className="text-primary" />
        <h4 className="font-bold text-sm">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function OrdersStats() {
  const byStatus = {
    open: ORDERS.filter(o => o.status === 'open').length,
    partial: ORDERS.filter(o => o.status === 'partially_filled').length,
    cancelled: ORDERS.filter(o => o.status === 'cancelled').length,
  };
  const buyOrders = ORDERS.filter(o => o.side === 'buy').length;
  const sellOrders = ORDERS.filter(o => o.side === 'sell').length;
  const tradeOrders = ORDERS.filter(o => o.userType === 'trade').length;
  const normalOrders = ORDERS.filter(o => o.userType === 'normal').length;

  return (
    <div className="space-y-4">
      <Section title="توزیع وضعیت" icon={FiPieChart}>
        <StatRow label="باز" value={byStatus.open} sub="سفارش" />
        <StatRow label="جزئی انجام شده" value={byStatus.partial.toLocaleString('fa-IR')} sub="سفارش" />
        <StatRow label="لغو شده" value={byStatus.cancelled.toLocaleString('fa-IR')} sub="سفارش" />
      </Section>
      <Section title="توزیع جهت" icon={FiRefreshCw}>
        <StatRow label="خرید" value={buyOrders.toLocaleString('fa-IR')} />
        <StatRow label="فروش" value={sellOrders.toLocaleString('fa-IR')} />
      </Section>
      <Section title="ارزش مالی" icon={FiDollarSign}>
        <StatRow label="ارزش کل سفارشات" value={fmt(ORDER_STATS.totalOrderValue)} sub="ریال" />
        <StatRow label="میانگین حجم سفارش" value={ORDER_STATS.avgOrderSize.toLocaleString('fa-IR')} />
        <StatRow label="نرخ لغو" value={`${ORDER_STATS.cancelRate.toLocaleString('fa-IR')}٪`} />
      </Section>
      <Section title="ترکیب کاربران" icon={FiUsers}>
        <StatRow label="کاربران صنف" value={tradeOrders.toLocaleString('fa-IR')} sub="سفارش" />
        <StatRow label="کاربران عادی" value={normalOrders.toLocaleString('fa-IR')} sub="سفارش" />
      </Section>
    </div>
  );
}

function TradesStats() {
  const types = {
    cash: TRADES.filter(t => t.type === 'cash').length,
    tomorrow: TRADES.filter(t => t.type === 'tomorrow').length,
    day_after: TRADES.filter(t => t.type === 'day_after').length,
    commitment: TRADES.filter(t => t.type === 'commitment').length,
  };
  const totalSpread = TRADES.reduce((s, t) => s + t.spread, 0);
  const totalFee = TRADES.reduce((s, t) => s + t.fee, 0);
  const totalNetRevenue = TRADES.reduce((s, t) => s + t.netRevenue, 0);
  const physicalCount = TRADES.filter(t => t.physicalDelivery).length;

  return (
    <div className="space-y-4">
      <Section title="توزیع نوع معامله" icon={FiLayers}>
        <StatRow label="نقدی" value={types.cash.toLocaleString('fa-IR')} />
        <StatRow label="فردایی" value={types.tomorrow.toLocaleString('fa-IR')} />
        <StatRow label="پسفردایی" value={types.day_after.toLocaleString('fa-IR')} />
        <StatRow label="تعهدی" value={types.commitment.toLocaleString('fa-IR')} />
      </Section>
      <Section title="درآمد پلتفرم" icon={FiDollarSign}>
        <StatRow label="جمع اسپرد" value={fmt(totalSpread)} sub="ریال" />
        <StatRow label="جمع کارمزد" value={fmt(totalFee)} sub="ریال" />
        <StatRow label="درآمد خالص" value={fmt(totalNetRevenue)} sub="ریال" />
        <StatRow label="میانگین اسپرد" value={fmt(TRADE_STATS.avgSpread)} sub="ریال" />
      </Section>
      <Section title="تحویل" icon={FiTruck}>
        <StatRow label="تحویل فیزیکی" value={physicalCount.toLocaleString('fa-IR')} sub="معامله" />
        <StatRow label="تحویل نقدی" value={(TRADES.length - physicalCount).toLocaleString('fa-IR')} sub="معامله" />
      </Section>
    </div>
  );
}

function PositionsStats() {
  const riskGroups = {
    green: POSITIONS.filter(p => p.riskLevel === 'green').length,
    yellow: POSITIONS.filter(p => p.riskLevel === 'yellow').length,
    red: POSITIONS.filter(p => p.riskLevel === 'red').length,
  };
  const longPositions = POSITIONS.filter(p => p.side === 'buy').length;
  const shortPositions = POSITIONS.filter(p => p.side === 'sell').length;
  const totalMargin = POSITIONS.reduce((s, p) => s + p.marginPosted, 0);

  return (
    <div className="space-y-4">
      <Section title="توزیع ریسک" icon={FiShield}>
        <StatRow label="ایمن (مارجین بالای ۱۳۰٪)" value={riskGroups.green} />
        <StatRow label="هشدار (مارجین ۱۱۰–۱۳۰٪)" value={riskGroups.yellow.toLocaleString('fa-IR')} />
        <StatRow label="بحرانی (مارجین زیر ۱۱۰٪)" value={riskGroups.red.toLocaleString('fa-IR')} />
      </Section>
      <Section title="موقعیت‌های باز" icon={FiMaximize}>
        <StatRow label="موقعیت خرید" value={longPositions.toLocaleString('fa-IR')} />
        <StatRow label="موقعیت فروش" value={shortPositions.toLocaleString('fa-IR')} />
      </Section>
      <Section title="مارجین و ریسک" icon={FiDatabase}>
        <StatRow label="کل مارجین گذاشته شده" value={fmt(totalMargin)} sub="ریال" />
        <StatRow label="کل تعهد باز" value={fmt(POSITION_STATS.totalOpenCommitment)} sub="ریال" />
        <StatRow label="پوشش مارجین" value={`${POSITION_STATS.marginCoveragePct.toLocaleString('fa-IR')}٪`} />
        <StatRow
          label="سود/زیان تحقق‌نیافته"
          value={`${POSITION_STATS.totalUnrealizedPnl >= 0 ? '+' : ''}${fmt(POSITION_STATS.totalUnrealizedPnl)}`}
          sub="ریال"
        />
      </Section>
    </div>
  );
}

const TAB_TITLE: Record<MainTab, string> = {
  orders: 'آمار سفارشات',
  trades: 'آمار معاملات',
  positions: 'آمار پوزیشن‌ها',
};

export default function StatsDrawer({ open, onClose, activeTab }: StatsDrawerProps) {
  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={onClose} style={{ zIndex: 55 }} />
      <div
        className="fixed top-0 right-0 bottom-0 flex flex-col bg-white dark:bg-surface-dark border-l border-border-light dark:border-border-dark transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          width: 'min(420px, 100vw)',
          zIndex: 60,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark shrink-0">
          <div className="flex items-center gap-2">
            <FiBarChart2 size={20} className="text-primary" />
            <h3 className="font-bold">{TAB_TITLE[activeTab]}</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'orders' && <OrdersStats />}
          {activeTab === 'trades' && <TradesStats />}
          {activeTab === 'positions' && <PositionsStats />}
        </div>
      </div>
    </>
  );
}