import { useState, useEffect } from 'react';
import { FiDatabase, FiInfo, FiBarChart2, FiCalendar, FiUsers, FiActivity, FiTrendingDown, FiTrendingUp, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import KpiCard from '../../components/UI/KpiCard';
import { OBLIGATION_BREAKDOWN } from '../../data/risk';
import { Api, ShowcaseDto, TradeSummaryByCurrencyDto, FinancialAccountDto, BreakevenResponse } from '../../lib/client';
import { Wallet, Calculator, CheckSquare } from 'lucide-react';

function TradeSideBadge({ side }: { side: string }) {
  const styles: Record<string, string> = {
    BUY: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
    SELL: 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400',
    LONG: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
    SHORT: 'bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400',
  };

  const labels: Record<string, string> = {
    BUY: 'خرید',
    SELL: 'فروش',
    LONG: 'لانگ',
    SHORT: 'شورت',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[0.6rem] md:text-xs font-bold ${styles[side] || 'bg-slate-100 text-slate-600'}`}>
      {labels[side] || side}
    </span>
  );
}

type PeriodType = 'day' | 'week' | 'month';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [showcase, setShowcase] = useState<ShowcaseDto | null>(null);
  const [tradeSummary, setTradeSummary] = useState<TradeSummaryByCurrencyDto[]>([]);
  const [treasuryWallets, setTreasuryWallets] = useState<FinancialAccountDto[]>([]);
  const [breakeven, setBreakeven] = useState<BreakevenResponse | null>(null);
  const [selectedTrades, setSelectedTrades] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodType>('day');
  const [showAllTrades, setShowAllTrades] = useState(false);

  const client = new Api();

  const getDateRange = (selectedPeriod: PeriodType): { startDate: string; endDate: string } => {
    const now = new Date();
    const start = new Date();

    switch (selectedPeriod) {
      case 'day':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        const currentDay = now.getDay();
        const daysFromSaturday = currentDay === 6 ? 0 : (currentDay + 1) % 7;
        start.setDate(now.getDate() - daysFromSaturday);
        start.setHours(0, 0, 0, 0);
        break;
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

    const end = new Date(now);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);

    return {
      startDate: formatDate(start),
      endDate: formatDate(end)
    };
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const { startDate, endDate } = getDateRange(period);

      const [showcaseRes, tradeSummaryRes, treasuryRes, breakevenRes] = await Promise.all([
        client.api.showcase(),
        client.api.getTradesSummary({ startDate, endDate }).catch(() => ({ data: [] })),
        client.api.treasuryWallets().catch(() => ({ data: [] })),
        client.api.calculateBreakevenPrice({
          startDate,
          endDate,
          onlyIncluded: showAllTrades ? false : true
        }).catch(() => ({ data: null }))
      ]);

      setShowcase(showcaseRes.data);

      if (tradeSummaryRes.data) {
        setTradeSummary(tradeSummaryRes.data);
      }

      if (treasuryRes.data) {
        setTreasuryWallets(treasuryRes.data);
      }

      if (breakevenRes.data) {
        setBreakeven(breakevenRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [period, showAllTrades]);

  // Toggle trade selection
  const toggleTradeSelection = async (tradeKey: string) => {
    const newSelected = new Set(selectedTrades);
    if (newSelected.has(tradeKey)) {
      newSelected.delete(tradeKey);
    } else {
      newSelected.add(tradeKey);
    }
    setSelectedTrades(newSelected);

    // Call API to update inclusion status
    try {
      await client.api.batchToggleInclude({ included: true },
        Array.from(newSelected).map(id => parseInt(id)));
    } catch (error) {
      console.error('Failed to update trade selection:', error);
    }
  };

  const selectAll = async () => {
    const allKeys = tradeSummary.flatMap(item =>
      Array.from({ length: item.tradeCount || 0 }, (_, i) => `${item.productCode}_${item.side}_${i}`)
    );
    setSelectedTrades(new Set(allKeys));
  };

  const deselectAll = async () => {
    setSelectedTrades(new Set());
  };

  // مقادیر از showcase
  const volumeOfTransaction = showcase?.volumeOfTransaction || 0;
  const allUserCount = showcase?.allUserCount || 0;
  const openMarginCount = showcase?.openMarginCount || 0;
  const alarmMarginCount = showcase?.alarmMarginCount || 0;
  const goldBuyPrice = showcase?.goldBuyPrice || 0;
  const goldSellPrice = showcase?.goldSellPrice || 0;

  // محاسبات معاملات
  const buyTrades = tradeSummary.filter(item => item.side === 'BUY' || item.side === 'LONG');
  const sellTrades = tradeSummary.filter(item => item.side === 'SELL' || item.side === 'SHORT');
  const totalBuyQuantity = buyTrades.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
  const totalSellQuantity = sellTrades.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
  const totalTradesCount = tradeSummary.reduce((sum, item) => sum + (item.tradeCount || 0), 0);

  // قیمت سر به سر
  const breakevenPrice = breakeven?.breakevenPrice || 0;
  const netRequired = breakeven?.netRequiredQuantity || (totalBuyQuantity - totalSellQuantity);
  const avgBuyPrice = breakeven?.avgBuyPrice || 0;
  const avgSellPrice = breakeven?.avgSellPrice || 0;

  // محاسبات خزانه
  const totalBalance = treasuryWallets.reduce((sum, wallet) => sum + (wallet.balances?.balance || 0), 0);
  const totalAvailable = treasuryWallets.reduce((sum, wallet) => sum + (wallet.balances?.availableBalance || 0), 0);

  // Format numbers
  const formatNumber = (num: number): string => num.toLocaleString('fa-IR');
  const formatCurrency = (num: number): string => (num / 1000000).toLocaleString('fa-IR');
  const formatDecimal = (num: number, decimals: number = 4): string =>
    num.toLocaleString('fa-IR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const formatBalance = (num: number): string => {
    if (num >= 1000000000000) return `${(num / 1000000000000).toLocaleString('fa-IR', { maximumFractionDigits: 2 })} همت`;
    if (num >= 1000000000) return `${(num / 1000000000).toLocaleString('fa-IR', { maximumFractionDigits: 2 })} میلیارد`;
    if (num >= 1000000) return `${(num / 1000000).toLocaleString('fa-IR', { maximumFractionDigits: 2 })} میلیون`;
    return num.toLocaleString('fa-IR');
  };

  const getProductColor = (code: string): string => {
    const colors: Record<string, string> = {
      'SPOT': '#0d59f2', 'FORWARD_T1': '#f59e0b', 'FORWARD_T2': '#10b981', 'PERP': '#8b5cf6',
    };
    return colors[code] || '#6b7280';
  };

  const periodTitle = period === 'day' ? 'امروز' : period === 'week' ? 'این هفته' : 'این ماه';

  const getProductLabel = (code: string): string => {
    const labels: Record<string, string> = {
      'SPOT': 'نقدی', 'FORWARD_T1': 'فردایی T+1', 'FORWARD_T2': 'فردایی T+2', 'PERP': 'دائمی',
    };
    return labels[code] || code;
  };

  return (
    <>
      <Header title="داشبورد" showMarketStatus />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px] space-y-5 md:space-y-7">

          {/* KPI Cards */}
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            <KpiCard label="حجم معاملات" value={formatCurrency(volumeOfTransaction)} unit="میلیون ریال" />
            <KpiCard label="معامله‌گران" value={formatNumber(allUserCount)} unit="نفر" onClick={() => navigate('/users')} clickable />
            <KpiCard label="تعهدات باز" value={formatNumber(openMarginCount)} unit="پوزیشن" />
            <KpiCard label="قیمت طلا (خرید)" value={goldBuyPrice ? formatNumber(Math.round(goldBuyPrice)) : '---'} unit="ریال" />
            <KpiCard label="قیمت طلا (فروش)" value={goldSellPrice ? formatNumber(Math.round(goldSellPrice)) : '---'} unit="ریال" />
            <KpiCard label="هشدار مارجین" value={formatNumber(alarmMarginCount)} unit="حساب" />
          </section>

          {/* 🎯 کارت قیمت سر به سر - مهمترین بخش */}
          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Calculator className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                    محاسبه قیمت سر به سر - {periodTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    قیمتی که با تامین طلا، سربه‌سر می‌شوید
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAllTrades}
                  onChange={e => setShowAllTrades(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {showAllTrades ? 'همه معاملات' : `فقط انتخاب‌شده (${selectedTrades.size})`}
                </span>
              </label>
            </div>

            {breakeven ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* نیاز به تامین */}
                <div className={`p-4 rounded-xl border ${netRequired > 0
                    ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                  }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {netRequired > 0 ? <FiTrendingUp className="text-amber-600" /> : <FiTrendingDown className="text-emerald-600" />}
                    <span className="font-bold text-sm text-slate-900 dark:text-white">نیاز به تامین</span>
                  </div>
                  <p className={`text-2xl font-black ${netRequired > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {formatDecimal(Math.abs(netRequired), 4)}
                    <span className="text-sm font-normal mr-1">واحد</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    خرید: {formatDecimal(totalBuyQuantity, 4)} | فروش: {formatDecimal(totalSellQuantity, 4)}
                  </p>
                </div>

                {/* قیمت سر به سر */}
                <div className="p-4 rounded-xl border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <FiActivity className="text-blue-600" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">قیمت سر به سر</span>
                  </div>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {formatNumber(Math.round(breakevenPrice))}
                    <span className="text-sm font-normal mr-1">ریال</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    میانگین خرید: {formatNumber(Math.round(avgBuyPrice))} | میانگین فروش: {formatNumber(Math.round(avgSellPrice))}
                  </p>
                </div>

                {/* وضعیت بازار */}
                <div className="p-4 rounded-xl border bg-slate-50 dark:bg-background-dark border-border-light dark:border-border-dark">
                  <div className="flex items-center gap-2 mb-2">
                    <FiInfo className="text-slate-500" />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">خلاصه</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">قیمت فعلی بازار:</span>
                      <span className="font-bold">{formatNumber(Math.round(goldBuyPrice))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">اختلاف با سر به سر:</span>
                      <span className={`font-bold ${goldBuyPrice > breakevenPrice ? 'text-red-600' : 'text-emerald-600'}`}>
                        {goldBuyPrice > breakevenPrice ? '+' : ''}{formatNumber(Math.round(goldBuyPrice - breakevenPrice))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">معاملات انتخاب شده:</span>
                      <span className="font-bold">{selectedTrades.size} از {breakeven?.totalTradeCount || totalTradesCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Calculator className="text-3xl mx-auto mb-2 opacity-50" />
                <p className="text-sm">داده‌ای برای محاسبه قیمت سر به سر موجود نیست</p>
              </div>
            )}
          </section>

          {/* گزارش معاملات با قابلیت انتخاب */}
          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <CheckSquare className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                    انتخاب معاملات برای محاسبه
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    معاملاتی که در محاسبه قیمت سر به سر لحاظ می‌شوند
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex gap-1 bg-slate-100 dark:bg-background-dark p-1 rounded-xl border border-border-light dark:border-border-dark">
                  {[
                    { key: 'day', label: 'امروز' },
                    { key: 'week', label: 'هفتگی' },
                    { key: 'month', label: 'ماهانه' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setPeriod(key as PeriodType)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${period === key ? 'bg-primary text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <button onClick={selectAll} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200">
                  انتخاب همه
                </button>
                <button onClick={deselectAll} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200">
                  حذف انتخاب
                </button>
              </div>
            </div>

            {tradeSummary.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-border-light dark:border-border-dark">
                <table className="w-full text-right text-xs md:text-sm">
                  <thead className="bg-slate-50 dark:bg-background-dark/50 text-slate-500">
                    <tr>
                      <th className="px-3 py-2.5 w-10">
                        <input
                          type="checkbox"
                          checked={selectedTrades.size === totalTradesCount && totalTradesCount > 0}
                          onChange={e => e.target.checked ? selectAll() : deselectAll()}
                          className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                        />
                      </th>
                      <th className="px-3 py-2.5 font-medium">محصول</th>
                      <th className="px-3 py-2.5 font-medium">جهت</th>
                      <th className="px-3 py-2.5 font-medium">تعداد</th>
                      <th className="px-3 py-2.5 font-medium">حجم کل</th>
                      <th className="px-3 py-2.5 font-medium">ارزش کل (م.ریال)</th>
                      <th className="px-3 py-2.5 font-medium">میانگین قیمت</th>
                      <th className="px-3 py-2.5 font-medium">کارمزد (م.ریال)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {tradeSummary.map((item, index) => {
                      const tradeKey = `${item.productCode}_${item.side}_${index}`;
                      const isSelected = selectedTrades.has(tradeKey);
                      const avgPrice = item.totalQuantity && item.totalQuantity > 0
                        ? (item.totalNotional || 0) / (item.totalQuantity || 1) : 0;

                      return (
                        <tr
                          key={index}
                          className={`hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors cursor-pointer ${isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                          onClick={() => toggleTradeSelection(tradeKey)}
                        >
                          <td className="px-3 py-3">
                            {isSelected ? (
                              <FiCheckSquare className="text-primary w-5 h-5" />
                            ) : (
                              <FiSquare className="text-slate-400 w-5 h-5" />
                            )}
                          </td>
                          <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getProductColor(item.productCode || '') }} />
                              {getProductLabel(item.productCode || '')}
                            </div>
                          </td>
                          <td className="px-3 py-3"><TradeSideBadge side={item.side || ''} /></td>
                          <td className="px-3 py-3">{formatNumber(item.tradeCount || 0)}</td>
                          <td className="px-3 py-3 font-medium">{formatDecimal(item.totalQuantity || 0, 4)}</td>
                          <td className="px-3 py-3 font-bold">{formatCurrency(item.totalNotional || 0)}</td>
                          <td className="px-3 py-3 text-xs">{formatNumber(Math.round(avgPrice))}</td>
                          <td className="px-3 py-3 text-xs">{formatCurrency(item.totalFee || 0)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <FiBarChart2 className="text-5xl mx-auto mb-4 opacity-30" />
                <p className="text-sm font-medium">در این بازه معامله‌ای ثبت نشده است</p>
              </div>
            )}
          </section>

          {/* خزانه و ریسک */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-4 md:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Wallet className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">موجودی خزانه</h3>
                  <p className="text-xs text-slate-500 mt-0.5">قابل برداشت: {formatBalance(totalAvailable)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-500 mb-1">موجودی کل</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">{formatBalance(totalBalance)}</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-500 mb-1">قابل برداشت</div>
                  <div className="text-lg font-black text-emerald-600">{formatBalance(totalAvailable)}</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 text-center">
                  <div className="text-xs text-slate-500 mb-1">مسدود</div>
                  <div className="text-lg font-black text-amber-600">{formatBalance(totalBalance - totalAvailable)}</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-6 md:p-8 flex flex-col">
              <h3 className="font-black text-slate-900 dark:text-white text-base md:text-lg mb-6">وضعیت ریسک تعهدات</h3>
              <div className="flex flex-col items-center justify-center flex-1 space-y-6">
                <div
                  className="relative size-[130px] sm:size-[150px] rounded-full flex items-center justify-center"
                  style={{ background: `conic-gradient(#0d59f2 0% ${OBLIGATION_BREAKDOWN.cash}%, #f59e0b ${OBLIGATION_BREAKDOWN.cash}% ${OBLIGATION_BREAKDOWN.cash + OBLIGATION_BREAKDOWN.tomorrow}%, #10b981 ${OBLIGATION_BREAKDOWN.cash + OBLIGATION_BREAKDOWN.tomorrow}% ${OBLIGATION_BREAKDOWN.cash + OBLIGATION_BREAKDOWN.tomorrow + OBLIGATION_BREAKDOWN.overdue}%, #94a3b8 ${OBLIGATION_BREAKDOWN.cash + OBLIGATION_BREAKDOWN.tomorrow + OBLIGATION_BREAKDOWN.overdue}% 100%)` }}
                >
                  <div className="absolute inset-4 rounded-full bg-white dark:bg-surface-dark flex flex-col items-center justify-center shadow-xl">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {OBLIGATION_BREAKDOWN.coveragePercent.toLocaleString('fa-IR')}٪
                    </span>
                    <span className="text-[0.6rem] text-slate-500 font-bold mt-0.5">پوشش</span>
                  </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-y-4 gap-x-4">
                  {[
                    { label: 'نقدی', value: `${OBLIGATION_BREAKDOWN.cash}٪`, color: 'border-primary' },
                    { label: 'فردایی', value: `${OBLIGATION_BREAKDOWN.tomorrow}٪`, color: 'border-amber-500' },
                    { label: 'معوق', value: `${OBLIGATION_BREAKDOWN.overdue}٪`, color: 'border-emerald-500' },
                    { label: 'سایر', value: `${OBLIGATION_BREAKDOWN.other}٪`, color: 'border-slate-400' },
                  ].map(item => (
                    <div key={item.label} className={`flex items-center justify-between border-r-4 ${item.color} px-3`}>
                      <span className="text-xs text-slate-500 font-bold">{item.label}</span>
                      <span className="text-sm font-black">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}