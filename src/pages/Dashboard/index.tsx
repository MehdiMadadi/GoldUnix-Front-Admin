import { useState, useEffect, useCallback } from 'react';
import { FiBarChart2, FiTrendingDown, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import KpiCard from '../../components/UI/KpiCard';
import Badge from '../../components/UI/Badge';
import { OBLIGATION_BREAKDOWN } from '../../data/risk';
import { Api, ShowcaseDto, TradeSummaryByCurrencyDto, FinancialAccountDto, BreakevenResponse, TradeDto } from '../../lib/client';
import { Wallet, Calculator, TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

type PeriodType = 'day' | 'week' | 'month';

// Helper: Get date range
const getDateRange = (selectedPeriod: PeriodType): { startDate: string; endDate: string } => {
  const now = new Date();
  const start = new Date(now);

  switch (selectedPeriod) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week': {
      const currentDay = now.getDay();
      const daysFromSaturday = currentDay === 6 ? 0 : (currentDay + 1) % 7;
      start.setDate(now.getDate() - daysFromSaturday);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
  }

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatDate(start),
    endDate: formatDate(now),
  };
};

// Format helpers
const formatNumber = (num?: number): string => {
  if (!num && num !== 0) return '---';
  return num.toLocaleString('fa-IR');
};

const formatCurrency = (num?: number): string => {
  if (!num && num !== 0) return '---';
  return (num / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 2 });
};

const formatBalance = (num?: number): string => {
  if (!num && num !== 0) return '---';
  if (num >= 1_000_000_000_000) return `${(num / 1_000_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 2 })} همت`;
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 2 })} میلیارد`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 2 })} میلیون`;
  return num.toLocaleString('fa-IR');
};

const formatDecimal = (num?: number, decimals: number = 4): string => {
  if (!num && num !== 0) return '---';
  return num.toLocaleString('fa-IR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

// Trade Side Badge
function TradeSideBadge({ side }: { side?: string }) {
  const config: Record<string, { label: string; variant: 'success' | 'danger' | 'info' | 'warning' }> = {
    BUY: { label: 'خرید', variant: 'success' },
    SELL: { label: 'فروش', variant: 'danger' },
    LONG: { label: 'لانگ', variant: 'info' },
    SHORT: { label: 'شورت', variant: 'warning' },
  };
  const c = config[side || ''] || { label: side || '---', variant: 'neutral' as any };
  return <Badge variant={c.variant} size="sm">{c.label}</Badge>;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const client = new Api();

  const [showcase, setShowcase] = useState<ShowcaseDto | null>(null);
  const [tradeSummary, setTradeSummary] = useState<TradeSummaryByCurrencyDto[]>([]);
  const [treasuryWallets, setTreasuryWallets] = useState<FinancialAccountDto[]>([]);
  const [breakeven, setBreakeven] = useState<BreakevenResponse | null>(null);
  const [tradesList, setTradesList] = useState<TradeDto[]>([]);
  const [selectedTradeIds, setSelectedTradeIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodType>('day');
  const [includeMode, setIncludeMode] = useState<'included' | 'all'>('included');

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    const { startDate, endDate } = getDateRange(period);

    try {
      const [showcaseRes, tradeSummaryRes, treasuryRes, breakevenRes, tradesRes] = await Promise.all([
        client.api.showcase(),
        client.api.getTradesSummary({ startDate, endDate }),
        client.api.treasuryWallets(),
        client.api.calculateBreakevenPrice({ startDate, endDate, onlyIncluded: includeMode === 'included' }),
        client.api.getTrades1({ fromDate: startDate, toDate: endDate, from: 0, size: 100, sortDate: 'DESC' }),
      ]);

      setShowcase(showcaseRes.data || null);
      setTradeSummary(tradeSummaryRes.data || []);
      setTreasuryWallets(treasuryRes.data || []);
      setBreakeven(breakevenRes.data || null);
      setTradesList(tradesRes.data?.trades || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [period, includeMode, client]);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleTradeSelection = async (tradeId: number) => {
    const newSelected = new Set(selectedTradeIds);
    if (newSelected.has(tradeId)) {
      newSelected.delete(tradeId);
    } else {
      newSelected.add(tradeId);
    }
    setSelectedTradeIds(newSelected);

    try {
      await client.api.toggleIncludeInCalculation(tradeId);
      const { startDate, endDate } = getDateRange(period);
      const newBreakeven = await client.api.calculateBreakevenPrice({
        startDate,
        endDate,
        onlyIncluded: includeMode === 'included'
      });
      setBreakeven(newBreakeven.data || null);
    } catch (error) {
      console.error('Failed to toggle trade inclusion:', error);
    }
  };

  const selectAllTrades = async () => {
    const allIds = tradesList.map(t => t.id).filter((id): id is number => id !== undefined);
    setSelectedTradeIds(new Set(allIds));
    try {
      await client.api.batchToggleInclude({ included: true }, allIds);
      const { startDate, endDate } = getDateRange(period);
      const newBreakeven = await client.api.calculateBreakevenPrice({
        startDate,
        endDate,
        onlyIncluded: includeMode === 'included'
      });
      setBreakeven(newBreakeven.data || null);
    } catch (error) {
      console.error('Failed to select all trades:', error);
    }
  };

  const deselectAllTrades = async () => {
    setSelectedTradeIds(new Set());
    try {
      await client.api.batchToggleInclude({ included: false }, Array.from(selectedTradeIds));
      const { startDate, endDate } = getDateRange(period);
      const newBreakeven = await client.api.calculateBreakevenPrice({
        startDate,
        endDate,
        onlyIncluded: includeMode === 'included'
      });
      setBreakeven(newBreakeven.data || null);
    } catch (error) {
      console.error('Failed to deselect all trades:', error);
    }
  };

  // Computed values
  const volumeOfTransaction = showcase?.volumeOfTransaction || 0;
  const allUserCount = showcase?.allUserCount || 0;
  const openMarginCount = showcase?.openMarginCount || 0;
  const alarmMarginCount = showcase?.alarmMarginCount || 0;
  const goldBuyPrice = showcase?.goldBuyPrice || 0;
  const goldSellPrice = showcase?.goldSellPrice || 0;
  const feeCount = showcase?.feeCount || 0;

  const totalBuyQuantity = tradeSummary
    .filter(item => item.side === 'BUY' || item.side === 'LONG')
    .reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
  const totalSellQuantity = tradeSummary
    .filter(item => item.side === 'SELL' || item.side === 'SHORT')
    .reduce((sum, item) => sum + (item.totalQuantity || 0), 0);

  const totalTreasuryBalance = treasuryWallets.reduce((sum, w) => sum + (w.balances?.balance || 0), 0);
  const totalTreasuryAvailable = treasuryWallets.reduce((sum, w) => sum + (w.balances?.availableBalance || 0), 0);

  const breakevenPrice = breakeven?.breakevenPrice || 0;
  const netRequired = breakeven?.netRequiredQuantity || (totalBuyQuantity - totalSellQuantity);
  const avgBuyPrice = breakeven?.avgBuyPrice || 0;
  const avgSellPrice = breakeven?.avgSellPrice || 0;

  const periodTitle = period === 'day' ? 'امروز' : period === 'week' ? 'این هفته' : 'این ماه';

  return (
    <>
      <Header title="داشبورد" showMarketStatus />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-[1600px] space-y-4">

          {/* KPI Cards - 4 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KpiCard
              label="حجم معاملات"
              value={formatCurrency(volumeOfTransaction)}
              unit="م.تومان"
              icon={<TrendingUp className="w-4 h-4" />}
            />
            <KpiCard
              label="معامله‌گران"
              value={formatNumber(allUserCount)}
              unit="نفر"
              onClick={() => navigate('/users')}
              clickable
              icon={<FiBarChart2 className="w-4 h-4" />}
            />
            <KpiCard
              label="تعهدات مارجین"
              value={formatNumber(openMarginCount)}
              unit="پوزیشن"
              icon={<AlertCircle className="w-4 h-4" />}
            />
            <KpiCard
              label="کارمزد کل"
              value={formatCurrency(feeCount)}
              unit="م.تومان"
              icon={<Wallet className="w-4 h-4" />}
            />
          </div>

          {/* Breakeven Card with Period Selector on top */}
          <div className="bg-white dark:bg-surface-dark border border-border-light rounded-xl overflow-hidden">
            {/* Period Selector - بالای کارت سربه‌سر */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-light bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">سربه‌سر</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-border-light">
                  {[
                    { key: 'day', label: 'امروز' },
                    { key: 'week', label: 'هفته' },
                    { key: 'month', label: 'ماه' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setPeriod(key as PeriodType)}
                      className={`px-2.5 py-0.5 text-[11px] font-medium rounded transition-all ${
                        period === key ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={fetchAllData}
                  className="p-1 rounded-lg hover:bg-slate-100 transition-all"
                >
                  <FiRefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Include Mode & Content */}
            <div className="p-4">
              <div className="flex items-center justify-end gap-4 mb-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={includeMode === 'included'}
                    onChange={() => setIncludeMode('included')}
                    className="w-3.5 h-3.5 text-primary"
                  />
                  <span className="text-slate-500">فقط انتخاب‌شده</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    checked={includeMode === 'all'}
                    onChange={() => setIncludeMode('all')}
                    className="w-3.5 h-3.5 text-primary"
                  />
                  <span className="text-slate-500">همه معاملات</span>
                </label>
                {includeMode === 'included' && tradesList.length > 0 && (
                  <div className="flex items-center gap-1">
                    <button onClick={selectAllTrades} className="px-2 py-0.5 text-[10px] rounded bg-slate-100 hover:bg-slate-200">همه</button>
                    <button onClick={deselectAllTrades} className="px-2 py-0.5 text-[10px] rounded bg-slate-100 hover:bg-slate-200">حذف</button>
                  </div>
                )}
              </div>

              {breakeven ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className={`p-3 rounded-lg border ${netRequired > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <p className="text-xs text-slate-500">{netRequired > 0 ? 'نیاز به تامین' : 'موجودی اضافی'}</p>
                    <p className={`text-lg font-bold ${netRequired > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {formatDecimal(Math.abs(netRequired), 4)}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      خرید: {formatDecimal(totalBuyQuantity, 4)} | فروش: {formatDecimal(totalSellQuantity, 4)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
                    <p className="text-xs text-slate-500">قیمت سربه‌سر</p>
                    <p className="text-lg font-bold text-blue-600">{formatNumber(Math.round(breakevenPrice))} تومان</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      میانگین خرید: {formatNumber(Math.round(avgBuyPrice))} | فروش: {formatNumber(Math.round(avgSellPrice))}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border bg-slate-50">
                    <p className="text-xs text-slate-500">وضعیت بازار</p>
                    <p className="text-base font-bold">
                      {goldBuyPrice > breakevenPrice ? '🟢 سود' : '🔴 زیان'}
                    </p>
                    <p className="text-xs">
                      قیمت فعلی: {formatNumber(Math.round(goldBuyPrice))}
                      <span className={`mr-2 ${goldBuyPrice > breakevenPrice ? 'text-green-600' : 'text-red-600'}`}>
                        ({goldBuyPrice > breakevenPrice ? '+' : ''}{formatNumber(Math.round(goldBuyPrice - breakevenPrice))})
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {selectedTradeIds.size} از {tradesList.length} معامله انتخاب شده
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm">
                  <Calculator className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>داده‌ای برای محاسبه وجود ندارد</p>
                </div>
              )}
            </div>
          </div>

          {/* Treasury */}
          <div className="bg-white dark:bg-surface-dark border border-border-light rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">خزانه</h3>
              <span className="text-xs text-slate-400 mr-auto">قابل برداشت: {formatBalance(totalTreasuryAvailable)}</span>
            </div>
            {treasuryWallets.length > 0 ? (
              <div className="space-y-2">
                {treasuryWallets.slice(0, 3).map((wallet, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{wallet.currency?.name || wallet.description}</span>
                    <span className="font-bold">{formatBalance(wallet.balances?.balance)}</span>
                  </div>
                ))}
                {treasuryWallets.length > 3 && (
                  <p className="text-xs text-slate-400">+ {treasuryWallets.length - 3} مورد دیگر</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400">کیف پولی یافت نشد</p>
            )}
          </div>

          {/* Trades Summary */}
          <div className="bg-white dark:bg-surface-dark border border-border-light rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-light bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex items-center gap-2">
                <FiBarChart2 className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">خلاصه معاملات - {periodTitle}</h3>
              </div>
            </div>

            {tradeSummary.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/30">
                    <tr>
                      {includeMode === 'included' && <th className="px-3 py-2 w-8"></th>}
                      <th className="px-3 py-2 text-right text-slate-500">محصول</th>
                      <th className="px-3 py-2 text-right text-slate-500">جهت</th>
                      <th className="px-3 py-2 text-right text-slate-500">تعداد</th>
                      <th className="px-3 py-2 text-right text-slate-500">مقدار</th>
                      <th className="px-3 py-2 text-right text-slate-500">ارزش (م.ت)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {tradeSummary.slice(0, 5).map((item, idx) => {
                      const avgPrice = item.totalQuantity && item.totalQuantity > 0
                        ? (item.totalNotional || 0) / (item.totalQuantity || 1) : 0;
                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          {includeMode === 'included' && <td className="px-3 py-2"></td>}
                          <td className="px-3 py-2 font-medium">{item.productCode || '---'}</td>
                          <td className="px-3 py-2"><TradeSideBadge side={item.side} /></td>
                          <td className="px-3 py-2">{formatNumber(item.tradeCount)}</td>
                          <td className="px-3 py-2">{formatDecimal(item.totalQuantity, 4)}</td>
                          <td className="px-3 py-2 font-bold">{formatCurrency(item.totalNotional)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {tradeSummary.length > 5 && (
                  <p className="text-xs text-slate-400 px-4 py-2 border-t border-border-light">+ {tradeSummary.length - 5} مورد دیگر</p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                <FiBarChart2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>معامله‌ای ثبت نشده است</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}