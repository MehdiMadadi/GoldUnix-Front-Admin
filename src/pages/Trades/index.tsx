import { useState, useMemo, useEffect } from 'react';
import { 
  FiFileText, 
  FiRefreshCw, 
  FiTrendingUp, 
  FiBarChart2, 
  FiFilter, 
  FiDownload 
} from 'react-icons/fi';
import Header from '../../components/Layout/Header';
import KpiCard from '../../components/UI/KpiCard';
import Pagination from '../../components/UI/Pagination';
import RiskAlertBar from '../../components/Trades/RiskAlertBar';
import FilterDrawer from '../../components/Trades/FilterDrawer';
import StatsDrawer from '../../components/Trades/StatsDrawer';
import OrdersTable from '../../components/Trades/OrdersTable';
import OrdersCard from '../../components/Trades/OrdersCard';
import TradesTable from '../../components/Trades/TradesTable';
import TradesCard from '../../components/Trades/TradesCard';
import PositionsTable from '../../components/Trades/PositionsTable';
import PositionsCard from '../../components/Trades/PositionsCard';
import OrderDetailDrawer from '../../components/Trades/OrderDetailDrawer';
import TradeDetailDrawer from '../../components/Trades/TradeDetailDrawer';
import PositionDetailDrawer from '../../components/Trades/PositionDetailDrawer';
import MarginAdjustDrawer from '../../components/Trades/MarginAdjustDrawer';
import { ORDER_STATS } from '../../data/orders';
import { TRADE_STATS } from '../../data/trades';
import { POSITION_STATS } from '../../data/positions';
import type { Order } from '../../data/orders';
import type { Trade } from '../../data/trades';
import type { Position } from '../../data/positions';
import type {
  MainTab, TradeFiltersState,
  OrderSubTab, TradeSubTab, PositionSubTab,
} from '../../components/Trades/types';
import {
  DEFAULT_TRADE_FILTERS,
  ORDER_SUB_TABS, TRADE_SUB_TABS, POSITION_SUB_TABS,
} from '../../components/Trades/types';
import { Api, OrderDto, TradeDto, PositionDetailsResponse } from '../../lib/client';

const ITEMS_PER_PAGE = 8;

function formatBig(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

const MAIN_TAB_ICONS = {
  orders: FiFileText,
  trades: FiRefreshCw,
  positions: FiTrendingUp,
};

const MAIN_TAB_DEFS: { key: MainTab; label: string; icon: keyof typeof MAIN_TAB_ICONS }[] = [
  { key: 'orders', label: 'سفارشات', icon: 'orders' },
  { key: 'trades', label: 'معاملات', icon: 'trades' },
  { key: 'positions', label: 'پوزیشن‌ها', icon: 'positions' },
];

const SUB_TAB_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  open: FiFileText,
  partially_filled: FiFileText,
  cancelled: FiFileText,
  cash: FiRefreshCw,
  tomorrow: FiRefreshCw,
  day_after: FiRefreshCw,
  commitment: FiRefreshCw,
  all: FiTrendingUp,
  green: FiTrendingUp,
  yellow: FiTrendingUp,
  red: FiTrendingUp,
};

function SubTabBar<T extends string>({
  tabs,
  active,
  onChange,
  counts,
}: {
  tabs: { key: T; label: string; icon: string; color?: string }[];
  active: T;
  onChange: (t: T) => void;
  counts?: Partial<Record<T, number>>;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {tabs.map(tab => {
        const IconComponent = SUB_TAB_ICONS[tab.icon] || FiFileText;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              active === tab.key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <IconComponent size={14} className={active === tab.key ? '' : (tab.color ?? '')} />
            {tab.label}
            {counts && counts[tab.key] != null && (
              <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-full font-bold ${
                active === tab.key 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {(counts[tab.key] as number).toLocaleString('fa-IR')}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function TradesPage() {
  const [activeTab, setActiveTab] = useState<MainTab>('orders');
  const [orderSubTab, setOrderSubTab] = useState<OrderSubTab>('OPEN');
  const [tradeSubTab, setTradeSubTab] = useState<TradeSubTab>('cash');
  const [positionSubTab, setPositionSubTab] = useState<PositionSubTab>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const [filters, setFilters] = useState<TradeFiltersState>(DEFAULT_TRADE_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<TradeFiltersState>(DEFAULT_TRADE_FILTERS);

  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<TradeDto | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<PositionDetailsResponse | null>(null);
  const [marginPosition, setMarginPosition] = useState<Position | null>(null);
  const [marginMode, setMarginMode] = useState<'increase' | 'decrease'>('increase');

  const [paginatedOrders, setPaginatedOrders] = useState<OrderDto[]>([]);
  const [paginatedOrdersCount, setPaginatedOrdersCount] = useState<number>(0);
  const [orderCounts, setOrderCounts] = useState<Partial<Record<OrderSubTab, number>>>({});
  const [showcase, setShowcase] = useState<ShowcaseDto>();

  const [paginatedTrades, setPaginatedTrades] = useState<TradeDto[]>([]);
  const [paginatedTradesCount, setPaginatedTradesCount] = useState<number>(0);
  const [tradeCounts, setTradeCounts] = useState<Partial<Record<TradeSubTab, number>>>({});

  const [paginatedPositions, setPaginatedPositions] = useState<PositionDetailsResponse[]>([]);
  const [paginatedPositionsCount, setPaginatedPositionsCount] = useState<number>(0);
  const [positionCounts, setPositionCounts] = useState<Partial<Record<PositionSubTab, number>>>({});

  const client = new Api();

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setPage(1);
    setFilters(DEFAULT_TRADE_FILTERS);
    setAppliedFilters(DEFAULT_TRADE_FILTERS);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const from = (page - 1) * ITEMS_PER_PAGE;
      const response = await client.api.getOrders({
        from,
        size: ITEMS_PER_PAGE,
        status: orderSubTab === 'open' ? 'OPEN' : orderSubTab === 'partially_filled' ? 'PARTIALLY_FILLED' : orderSubTab === 'cancelled' ? 'CANCELLED' : undefined,
      });
      setPaginatedOrders(response.data.orders || []);
      setPaginatedOrdersCount(response.data.count || 0);

      // Fetch counts for all statuses
      const [openRes, partialRes, cancelledRes] = await Promise.all([
        client.api.getOrders({ from: 0, size: 1, status: 'OPEN' }),
        client.api.getOrders({ from: 0, size: 1, status: 'PARTIALLY_FILLED' }),
        client.api.getOrders({ from: 0, size: 1, status: 'CANCELLED' }),
      ]);
      setOrderCounts({
        open: openRes.data.count || 0,
        partially_filled: partialRes.data.count || 0,
        cancelled: cancelledRes.data.count || 0,
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const from = (page - 1) * ITEMS_PER_PAGE;
      const response = await client.api.getTrades({
        from,
        size: ITEMS_PER_PAGE,
      });
      setPaginatedTrades(response.data.trades || []);
      setPaginatedTradesCount(response.data.count || 0);
      setTradeCounts({ cash: response.data.count || 0 });
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchShowcase = async () => {
    try {
      setLoading(true);
      const from = (page - 1) * ITEMS_PER_PAGE;
      const response = await client.api.showcase();
      setShowcase(response.data!);
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await client.api.getOpenPositions();
      const positions = response.data || [];
      const start = (page - 1) * ITEMS_PER_PAGE;
      setPaginatedPositions(positions.slice(start, start + ITEMS_PER_PAGE));
      setPaginatedPositionsCount(positions.length);
      
      setPositionCounts({
        all: positions.length,
        green: positions.filter(p => p.riskLevel === 'SAFE').length,
        yellow: positions.filter(p => p.riskLevel === 'WARNING').length,
        red: positions.filter(p => p.riskLevel === 'CRITICAL' || p.riskLevel === 'LIQUIDATION').length,
      });
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowcase();
    if (activeTab === 'orders') fetchOrders();
    else if (activeTab === 'trades') fetchTrades();
    else if (activeTab === 'positions') fetchPositions();
  }, [activeTab, page, orderSubTab, tradeSubTab, positionSubTab]);

  const totalCount =
    activeTab === 'orders' ? paginatedOrdersCount :
    activeTab === 'trades' ? paginatedTradesCount :
    paginatedPositionsCount;

  const tabLabel =
    activeTab === 'orders' ? 'سفارش' :
    activeTab === 'trades' ? 'معامله' : 'پوزیشن';

  const activeFilterCount = [
    appliedFilters.search !== '',
    appliedFilters.asset !== 'all',
    appliedFilters.userType !== 'all',
    appliedFilters.status !== 'all',
    appliedFilters.tradeType !== 'all',
    appliedFilters.physicalOnly,
    appliedFilters.commitmentOnly,
  ].filter(Boolean).length;

  return (
    <>
      <Header title="معاملات" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto space-y-5">

          <RiskAlertBar />

          {activeTab === 'orders' && (
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {/* <KpiCard label="سفارشات باز" value={(showcase?.openMarginCount || 0).toLocaleString('fa-IR')} unit="سفارش" change="+۳" changePositive /> */}
              {/* <KpiCard label="ارزش کل سفارشات" value={formatBig(ORDER_STATS.totalOrderValue)} unit="ریال" /> */}
              {/* <KpiCard label="میانگین حجم سفارش" value={ORDER_STATS.avgOrderSize.toLocaleString('fa-IR')} /> */}
              {/* <KpiCard label="نرخ لغو" value={`${ORDER_STATS.cancelRate.toLocaleString('fa-IR')}٪`} changePositive={false} change="بالا" /> */}
            </section>
          )}

          {activeTab === 'trades' && (
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {/* <KpiCard label="حجم معاملات امروز" value={TRADE_STATS.totalVolumeTodayCoin} unit="سکه" change="+۸٪" changePositive /> */}
              {/* <KpiCard label="درآمد امروز" value={formatBig(TRADE_STATS.spreadProfit)} unit="ریال" change="+۵٪" changePositive /> */}
              {/* <KpiCard label="میانگین اسپرد" value={formatBig(TRADE_STATS.avgSpread)} unit="ریال" /> */}
              {/* <KpiCard label="معامله‌گران فعال" value={TRADE_STATS.activeTraders.toLocaleString('fa-IR')} unit="نفر" change="+۳٪" changePositive /> */}
            </section>
          )}

          {activeTab === 'positions' && (
            <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
              {/* <KpiCard label="کل تعهد باز" value={formatBig(POSITION_STATS.totalOpenCommitment)} unit="ریال" />
              <KpiCard
                label="سود/زیان باز"
                value={`${POSITION_STATS.totalUnrealizedPnl >= 0 ? '+' : ''}${formatBig(POSITION_STATS.totalUnrealizedPnl)}`}
                unit="ریال"
                change={POSITION_STATS.totalUnrealizedPnl >= 0 ? 'مثبت' : 'منفی'}
                changePositive={POSITION_STATS.totalUnrealizedPnl >= 0}
              />
              <KpiCard
                label="پوشش مارجین"
                value={`${POSITION_STATS.marginCoveragePct.toLocaleString('fa-IR')}٪`}
                changePositive={POSITION_STATS.marginCoveragePct >= 130}
                change={POSITION_STATS.marginCoveragePct >= 130 ? 'کافی' : 'هشدار'}
              />
              <KpiCard label="پوزیشن‌های در ریسک" value={(positionCounts.red || 0).toLocaleString('fa-IR')} unit="پوزیشن" changePositive={false} change="نیاز به بررسی" />
              <KpiCard label="بیشترین اکسپوژر" value={POSITION_STATS.largestExposureUser} /> */}
            </section>
          )}

          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl overflow-hidden">
            <div className="flex flex-col gap-3 p-4 md:p-5 border-b border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">مدیریت معاملات</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{totalCount.toLocaleString('fa-IR')} {tabLabel}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* <button
                    onClick={() => setShowStats(true)}
                    className="icon-btn bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="آمار"
                  >
                    <FiBarChart2 size={20} />
                  </button>
                  <button
                    onClick={() => setShowFilters(true)}
                    className={`icon-btn relative transition-all ${
                      activeFilterCount > 0
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title="فیلترها"
                  >
                    <FiFilter size={20} />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[0.5rem] flex items-center justify-center font-bold">
                        {activeFilterCount.toLocaleString('fa-IR')}
                      </span>
                    )}
                  </button>
                  <button className="icon-btn bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700" title="خروجی">
                    <FiDownload size={20} />
                  </button> */}
                </div>
              </div>

              <div className="flex gap-1 bg-slate-100 dark:bg-background-dark rounded-2xl p-1">
                {MAIN_TAB_DEFS.map(tab => {
                  const IconComponent = MAIN_TAB_ICONS[tab.icon];
                  return (
                    <button
                      key={tab.key}
                      onClick={() => handleTabChange(tab.key)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        activeTab === tab.key
                          ? 'bg-white dark:bg-surface-dark text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                    >
                      <IconComponent size={16} />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                {activeTab === 'orders' && (
                  <SubTabBar
                    tabs={ORDER_SUB_TABS}
                    active={orderSubTab}
                    onChange={t => { setOrderSubTab(t); setPage(1); }}
                    counts={orderCounts}
                  />
                )}
                {activeTab === 'trades' && (
                  <SubTabBar
                    tabs={TRADE_SUB_TABS}
                    active={tradeSubTab}
                    onChange={t => { setTradeSubTab(t); setPage(1); }}
                    counts={tradeCounts}
                  />
                )}
                {activeTab === 'positions' && (
                  <SubTabBar
                    tabs={POSITION_SUB_TABS}
                    active={positionSubTab}
                    onChange={t => { setPositionSubTab(t); setPage(1); }}
                    counts={positionCounts}
                  />
                )}
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {!loading && activeTab === 'orders' && (
              <>
                <div className="desktop-view">
                  <OrdersTable orders={paginatedOrders} onRowClick={setSelectedOrder} />
                </div>
                <div className="mobile-view">
                  <OrdersCard orders={paginatedOrders} onRowClick={setSelectedOrder} />
                </div>
              </>
            )}

            {!loading && activeTab === 'trades' && (
              <>
                <div className="desktop-view">
                  <TradesTable trades={paginatedTrades} onRowClick={setSelectedTrade} />
                </div>
                <div className="mobile-view">
                  <TradesCard trades={paginatedTrades} onRowClick={setSelectedTrade} />
                </div>
              </>
            )}

            {!loading && activeTab === 'positions' && (
              <>
                <div className="desktop-view">
                  <PositionsTable
                    positions={paginatedPositions}
                    onRowClick={setSelectedPosition}
                    onMarginIncrease={pos => { setMarginPosition(pos as any); setMarginMode('increase'); }}
                    onMarginDecrease={pos => { setMarginPosition(pos as any); setMarginMode('decrease'); }}
                  />
                </div>
                <div className="mobile-view">
                  <PositionsCard positions={paginatedPositions} onRowClick={setSelectedPosition} />
                </div>
              </>
            )}

            <Pagination total={totalCount} page={page} perPage={ITEMS_PER_PAGE} onChange={setPage} />
          </section>
        </div>
      </div>

      <FilterDrawer
        open={showFilters}
        filters={filters}
        onChange={setFilters}
        onApply={() => { setAppliedFilters(filters); setPage(1); }}
        onReset={() => { setFilters(DEFAULT_TRADE_FILTERS); setAppliedFilters(DEFAULT_TRADE_FILTERS); setPage(1); }}
        onClose={() => setShowFilters(false)}
        activeTab={activeTab}
      />

      <StatsDrawer
        open={showStats}
        onClose={() => setShowStats(false)}
        activeTab={activeTab}
      />

      <OrderDetailDrawer
        open={selectedOrder !== null}
        order={selectedOrder as any}
        onClose={() => setSelectedOrder(null)}
      />

      <TradeDetailDrawer
        open={selectedTrade !== null}
        trade={selectedTrade as any}
        onClose={() => setSelectedTrade(null)}
      />

      <PositionDetailDrawer
        open={selectedPosition !== null}
        position={selectedPosition as any}
        onClose={() => setSelectedPosition(null)}
      />

      <MarginAdjustDrawer
        open={marginPosition !== null}
        position={marginPosition}
        mode={marginMode}
        onClose={() => setMarginPosition(null)}
        onConfirm={() => setMarginPosition(null)}
      />
    </>
  );
}