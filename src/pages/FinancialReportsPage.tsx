// pages/admin/FinancialReportsPage.tsx
import { useEffect, useState, useMemo } from 'react';
import { Api, TradeDto, BreakevenResponse, TradeSummaryByCurrencyDto } from '../lib/client';
import Badge from '../components/UI/Badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  RefreshCw, 
  Loader2,
  CheckCircle,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  DollarSign,
  Percent,
  PieChart,
  Activity,
  Clock,
  AlertCircle,
  Check,
  Minus,
  Target,
  Zap,
  Eye
} from 'lucide-react';

// Date Range Presets
type DatePreset = 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'thisYear' | 'custom';

const datePresets: { value: DatePreset; label: string }[] = [
  { value: 'today', label: 'امروز' },
  { value: 'yesterday', label: 'دیروز' },
  { value: 'thisWeek', label: 'این هفته' },
  { value: 'thisMonth', label: 'این ماه' },
  { value: 'thisYear', label: 'امسال' },
  { value: 'custom', label: 'سفارشی' },
];

// Helper functions
function getDateRange(preset: DatePreset): { startDate: string; endDate: string } {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (preset) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'thisWeek':
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'thisMonth':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'thisYear':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    default:
      break;
  }

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

// Format number
function formatNumber(num?: number, decimals: number = 0): string {
  if (num === undefined || num === null) return '---';
  return num.toLocaleString('fa-IR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

// Format price
function formatPrice(num?: number): string {
  if (num === undefined || num === null) return '---';
  return num.toLocaleString('fa-IR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Side Badge
function SideBadge({ side }: { side?: 'BUY' | 'SELL' | 'LONG' | 'SHORT' }) {
  const config = {
    BUY: { label: 'خرید', variant: 'success' as const, icon: TrendingUp },
    SELL: { label: 'فروش', variant: 'danger' as const, icon: TrendingDown },
    LONG: { label: 'لانگ', variant: 'success' as const, icon: TrendingUp },
    SHORT: { label: 'شورت', variant: 'danger' as const, icon: TrendingDown },
  };
  const c = config[side || 'BUY'];
  return (
    <Badge variant={c.variant} size="sm">
      <span className="items-center gap-1">
        {c.label}
      </span>
    </Badge>
  );
}

// Summary Card Component
function SummaryCard({ title, value, icon: Icon, variant, change }: any) {
  return (
    <div className={`bg-gradient-to-br ${variant === 'success' ? 'from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200' : variant === 'danger' ? 'from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-red-200' : 'from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/30 border-slate-200'} rounded-2xl p-4 border`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">{title}</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <Icon className={`w-8 h-8 ${variant === 'success' ? 'text-green-500' : variant === 'danger' ? 'text-red-500' : 'text-primary/50'}`} />
      </div>
    </div>
  );
}

// Main Component
export default function FinancialReportsPage() {
  const [activeTab, setActiveTab] = useState<'summary' | 'breakeven'>('summary');
  const [datePreset, setDatePreset] = useState<DatePreset>('thisWeek');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBreakeven, setLoadingBreakeven] = useState(false);
  
  // Summary Data
  const [summaryData, setSummaryData] = useState<TradeSummaryByCurrencyDto[]>([]);
  
  // Breakeven Data
  const [trades, setTrades] = useState<TradeDto[]>([]);
  const [selectedTradeIds, setSelectedTradeIds] = useState<Set<number>>(new Set());
  const [breakevenResult, setBreakevenResult] = useState<BreakevenResponse | null>(null);
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [filterSide, setFilterSide] = useState<string>('all');
  
  // Pagination for trades
  const [pageNumber, setPageNumber] = useState(0);
  const [totalTrades, setTotalTrades] = useState(0);
  const pageSize = 20;

  const client = new Api();

  const getCurrentDateRange = () => {
    if (datePreset === 'custom') {
      return { startDate: customStartDate, endDate: customEndDate };
    }
    return getDateRange(datePreset);
  };

  // Fetch Summary Data
  const fetchSummary = async () => {
    const { startDate, endDate } = getCurrentDateRange();
    if (!startDate || !endDate) return;
    
    setLoading(true);
    try {
      const response = await client.api.getTradesSummary({ startDate, endDate });
      setSummaryData(response.data || []);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Trades for Breakeven
  const fetchTrades = async () => {
    const { startDate, endDate } = getCurrentDateRange();
    if (!startDate || !endDate) return;
    
    setLoadingBreakeven(true);
    try {
      const response = await client.api.getTrades1({
        fromDate: startDate,
        toDate: endDate,
        from: pageNumber * pageSize,
        size: pageSize,
        ...(filterProduct !== 'all' && { productCode: filterProduct }),
        ...(filterSide !== 'all' && { side: filterSide as any }),
      });
      setTrades(response.data?.trades || []);
      setTotalTrades(response.data?.count || 0);
      
      // Initialize selected trades (all by default)
      if (pageNumber === 0 && selectedTradeIds.size === 0) {
        const allIds = new Set((response.data?.trades || []).map(t => t.id).filter(Boolean) as number[]);
        setSelectedTradeIds(allIds);
      }
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    } finally {
      setLoadingBreakeven(false);
    }
  };

  // Fetch Breakeven Calculation
  const fetchBreakeven = async () => {
    const { startDate, endDate } = getCurrentDateRange();
    if (!startDate || !endDate) return;
    
    setLoading(true);
    try {
      // Note: The API uses 'onlyIncluded' but we're doing client-side filtering
      // For server-side filtering, we would need to toggle include status via API
      const response = await client.api.calculateBreakevenPrice({
        startDate,
        endDate,
        onlyIncluded: false, // We'll filter client-side based on selected trades
      });
      setBreakevenResult(response.data || null);
    } catch (error) {
      console.error('Failed to fetch breakeven:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'summary') {
      fetchSummary();
    } else {
      fetchTrades();
      fetchBreakeven();
    }
  }, [activeTab, datePreset, customStartDate, customEndDate, pageNumber, filterProduct, filterSide]);

  const handleToggleTrade = (tradeId: number) => {
    const newSet = new Set(selectedTradeIds);
    if (newSet.has(tradeId)) {
      newSet.delete(tradeId);
    } else {
      newSet.add(tradeId);
    }
    setSelectedTradeIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedTradeIds.size === trades.length) {
      setSelectedTradeIds(new Set());
    } else {
      const allIds = new Set(trades.map(t => t.id).filter(Boolean) as number[]);
      setSelectedTradeIds(allIds);
    }
  };

  const handleSelectBuyOnly = () => {
    const buyIds = trades.filter(t => t.order?.side === 'BUY' || t.order?.side === 'LONG').map(t => t.id).filter(Boolean) as number[];
    setSelectedTradeIds(new Set(buyIds));
  };

  const handleSelectSellOnly = () => {
    const sellIds = trades.filter(t => t.order?.side === 'SELL' || t.order?.side === 'SHORT').map(t => t.id).filter(Boolean) as number[];
    setSelectedTradeIds(new Set(sellIds));
  };

  // Calculate client-side breakeven based on selected trades
  const calculatedBreakeven = useMemo(() => {
    const selectedTrades = trades.filter(t => t.id && selectedTradeIds.has(t.id));
    
    if (selectedTrades.length === 0) return null;
    
    let totalBuyQuantity = 0;
    let totalBuyValue = 0;
    let totalSellQuantity = 0;
    let totalSellValue = 0;
    
    selectedTrades.forEach(trade => {
      const side = trade.order?.side;
      const quantity = trade.quantity || 0;
      const price = trade.executionPrice || 0;
      const value = quantity * price;
      
      if (side === 'BUY' || side === 'LONG') {
        totalBuyQuantity += quantity;
        totalBuyValue += value;
      } else if (side === 'SELL' || side === 'SHORT') {
        totalSellQuantity += quantity;
        totalSellValue += value;
      }
    });
    
    const avgBuyPrice = totalBuyQuantity > 0 ? totalBuyValue / totalBuyQuantity : 0;
    const avgSellPrice = totalSellQuantity > 0 ? totalSellValue / totalSellQuantity : 0;
    const netQuantity = totalBuyQuantity - totalSellQuantity;
    const netValue = totalBuyValue - totalSellValue;
    const breakevenPrice = netQuantity !== 0 ? netValue / netQuantity : 0;
    
    return {
      totalBuyQuantity,
      totalBuyValue,
      avgBuyPrice,
      totalSellQuantity,
      totalSellValue,
      avgSellPrice,
      netRequiredQuantity: netQuantity,
      breakevenPrice,
      currentMarketPrice: breakevenResult?.currentMarketPrice || 0,
      selectedCount: selectedTrades.length,
      totalCount: trades.length,
    };
  }, [trades, selectedTradeIds, breakevenResult]);

  const { startDate, endDate } = getCurrentDateRange();
  const hasValidDate = datePreset !== 'custom' || (customStartDate && customEndDate);

  // Summary totals
  const summaryTotals = useMemo(() => {
    let totalBuyNotional = 0;
    let totalSellNotional = 0;
    let totalFee = 0;
    let totalTradeCount = 0;
    
    summaryData.forEach(item => {
      if (item.side === 'BUY' || item.side === 'LONG') {
        totalBuyNotional += item.totalNotional || 0;
      } else {
        totalSellNotional += item.totalNotional || 0;
      }
      totalFee += item.totalFee || 0;
      totalTradeCount += item.tradeCount || 0;
    });
    
    return { totalBuyNotional, totalSellNotional, totalFee, totalTradeCount };
  }, [summaryData]);

  return (
    <div className="bg-white dark:bg-background-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border-light dark:border-border-dark">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              گزارشات مالی
            </h2>
            <p className="text-xs text-slate-500 mt-1">مشاهده خلاصه معاملات و تحلیل Breakeven</p>
          </div>
          <button
            onClick={() => activeTab === 'summary' ? fetchSummary() : fetchTrades()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            بروزرسانی
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-light dark:border-border-dark px-6">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'summary'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <PieChart className="w-4 h-4" />
          خلاصه معاملات
        </button>
        <button
          onClick={() => setActiveTab('breakeven')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'breakeven'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Target className="w-4 h-4" />
          آنالیز Breakeven
        </button>
      </div>

      {/* Date Filter */}
      <div className="px-6 py-4 border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-800/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {datePresets.map(preset => (
              <button
                key={preset.value}
                onClick={() => setDatePreset(preset.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  datePreset === preset.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-border-light'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          
          {datePreset === 'custom' && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={customStartDate}
                  onChange={e => setCustomStartDate(e.target.value)}
                  className="pr-10 pl-3 py-2 rounded-lg border border-border-light bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <span className="text-slate-400">تا</span>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={customEndDate}
                  onChange={e => setCustomEndDate(e.target.value)}
                  className="pr-10 pl-3 py-2 rounded-lg border border-border-light bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          )}

          <div className="text-xs text-slate-400">
            بازه: {startDate} تا {endDate}
          </div>
        </div>
      </div>

      {/* Tab: Summary */}
      {activeTab === 'summary' && (
        <div>
          {/* Summary Cards */}
          <div className="p-6 pb-0">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <SummaryCard
                title="کل خرید"
                value={`${formatNumber(summaryTotals.totalBuyNotional)} تومان`}
                icon={TrendingUp}
                variant="success"
              />
              <SummaryCard
                title="کل فروش"
                value={`${formatNumber(summaryTotals.totalSellNotional)} تومان`}
                icon={TrendingDown}
                variant="danger"
              />
              <SummaryCard
                title="کل کارمزد"
                value={`${formatNumber(summaryTotals.totalFee)} تومان`}
                icon={DollarSign}
                variant="default"
              />
              <SummaryCard
                title="تعداد معاملات"
                value={summaryTotals.totalTradeCount.toLocaleString()}
                icon={Activity}
                variant="default"
              />
            </div>
          </div>

          {/* Summary Table */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : summaryData.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                داده‌ای برای نمایش وجود ندارد
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-light bg-slate-50 dark:bg-slate-800/50">
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">محصول</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">سمت</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">تعداد معاملات</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">حجم کل</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">کارمزد کل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {summaryData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm font-semibold">{item.productCode}</span>
                        </td>
                        <td className="px-4 py-3">
                          <SideBadge side={item.side} />
                        </td>
                        <td className="px-4 py-3 text-sm">{item.tradeCount?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {formatNumber(item.totalNotional)} تومان
                        </td>
                        <td className="px-4 py-3 text-sm">{formatNumber(item.totalFee)} تومان</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Breakeven */}
      {activeTab === 'breakeven' && (
        <div>
          {/* Filter Bar */}
          <div className="px-6 pt-4 flex flex-wrap items-center gap-3">
            <select
              value={filterProduct}
              onChange={e => setFilterProduct(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-border-light bg-white dark:bg-slate-800 text-sm"
            >
              <option value="all">همه محصولات</option>
              <option value="GOLD">طلا</option>
              <option value="USDT">USDT</option>
              <option value="BTC">بیت‌کوین</option>
              <option value="ETH">اتریوم</option>
            </select>
            
            <select
              value={filterSide}
              onChange={e => setFilterSide(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-border-light bg-white dark:bg-slate-800 text-sm"
            >
              <option value="all">همه سمت‌ها</option>
              <option value="BUY">خرید</option>
              <option value="SELL">فروش</option>
              <option value="LONG">لانگ</option>
              <option value="SHORT">شورت</option>
            </select>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
              >
                {selectedTradeIds.size === trades.length ? 'عدم انتخاب همه' : 'انتخاب همه'}
              </button>
              <button
                onClick={handleSelectBuyOnly}
                className="px-3 py-1.5 rounded-lg text-xs bg-green-50 text-green-600 hover:bg-green-100"
              >
                فقط خریدها
              </button>
              <button
                onClick={handleSelectSellOnly}
                className="px-3 py-1.5 rounded-lg text-xs bg-red-50 text-red-600 hover:bg-red-100"
              >
                فقط فروش‌ها
              </button>
            </div>
          </div>

          {/* Breakeven Result Card */}
          {calculatedBreakeven && (
            <div className="px-6 pt-6">
              <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-2xl p-5 border border-primary/20">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        قیمت سربه‌سر
                      </h3>
                      <Badge variant="info" size="sm">
                        بر اساس {calculatedBreakeven.selectedCount} معامله از {calculatedBreakeven.totalCount}
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold text-primary mt-2">
                      {formatPrice(calculatedBreakeven.breakevenPrice)}
                      <span className="text-sm font-normal text-slate-400 mr-1">تومان</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-400">میانگین خرید</p>
                      <p className="text-sm font-semibold text-green-600">{formatPrice(calculatedBreakeven.avgBuyPrice)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">میانگین فروش</p>
                      <p className="text-sm font-semibold text-red-600">{formatPrice(calculatedBreakeven.avgSellPrice)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400">قیمت بازار</p>
                      <p className="text-sm font-semibold">{formatPrice(calculatedBreakeven.currentMarketPrice)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>سربه‌سر</span>
                    <span>قیمت فعلی</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (calculatedBreakeven.currentMarketPrice / calculatedBreakeven.breakevenPrice) * 100)}%` 
                      }}
                    />
                  </div>
                  <p className={`text-xs mt-2 ${calculatedBreakeven.currentMarketPrice > calculatedBreakeven.breakevenPrice ? 'text-green-600' : 'text-red-600'}`}>
                    {calculatedBreakeven.currentMarketPrice > calculatedBreakeven.breakevenPrice 
                      ? `سود ${((calculatedBreakeven.currentMarketPrice - calculatedBreakeven.breakevenPrice) / calculatedBreakeven.breakevenPrice * 100).toFixed(2)}% نسبت به قیمت سربه‌سر`
                      : `ضرر ${((calculatedBreakeven.breakevenPrice - calculatedBreakeven.currentMarketPrice) / calculatedBreakeven.breakevenPrice * 100).toFixed(2)}% نسبت به قیمت سربه‌سر`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Trades List with Checkboxes */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">لیست معاملات</h3>
              <p className="text-xs text-slate-400">
                {selectedTradeIds.size} از {trades.length} معامله انتخاب شده
              </p>
            </div>

            {loadingBreakeven ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : trades.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                معامله‌ای در بازه زمانی انتخاب شده وجود ندارد
              </div>
            ) : (
              <div className="space-y-2">
                {trades.map(trade => (
                  <div
                    key={trade.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      trade.id && selectedTradeIds.has(trade.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border-light dark:border-border-dark hover:bg-slate-50'
                    }`}
                    onClick={() => trade.id && handleToggleTrade(trade.id)}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        trade.id && selectedTradeIds.has(trade.id)
                          ? 'bg-primary border-primary'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {trade.id && selectedTradeIds.has(trade.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <SideBadge side={trade.order?.side} />
                        <span className="font-mono text-xs text-slate-400">#{trade.id}</span>
                        <span className="text-xs text-slate-400">{trade.product}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                        <span>مقدار: {trade.quantity?.toLocaleString()}</span>
                        <span>قیمت: {formatPrice(trade.executionPrice)}</span>
                        <span>ارزش: {formatNumber(trade.notional)}</span>
                        <span>کارمزد: {formatNumber(trade.feeAmount)}</span>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-slate-400">
                        {trade.executedAt ? new Date(trade.executedAt).toLocaleDateString('fa-IR') : '---'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalTrades > pageSize && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
                <p className="text-xs text-slate-500">
                  نمایش {pageNumber * pageSize + 1} تا {Math.min((pageNumber + 1) * pageSize, totalTrades)} از {totalTrades.toLocaleString()} معامله
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={pageNumber === 0}
                    onClick={() => setPageNumber(p => p - 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-border-light text-slate-600 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    قبلی
                  </button>
                  <button
                    disabled={(pageNumber + 1) * pageSize >= totalTrades}
                    onClick={() => setPageNumber(p => p + 1)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white disabled:opacity-30"
                  >
                    بعدی
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}