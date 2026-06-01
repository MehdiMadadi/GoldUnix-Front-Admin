import { useState, useEffect } from 'react';
import { FiDatabase, FiInfo, FiBarChart2, FiCalendar, FiUsers, FiActivity, FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import KpiCard from '../../components/UI/KpiCard';
import ProgressBar from '../../components/UI/ProgressBar';
import { OBLIGATION_BREAKDOWN } from '../../data/risk';
import { Api, ShowcaseDto, TradeSummaryByCurrencyDto, FinancialAccountDto } from '../../lib/client';
import { Wallet } from 'lucide-react';

function AssetStatusBadge({ status }: { status: string }) {
  if (status === 'active')
    return <span className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[0.6rem] md:text-xs">فعال</span>;
  if (status === 'semi')
    return <span className="bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[0.6rem] md:text-xs">نیمه فعال</span>;
  return <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[0.6rem] md:text-xs">کم‌فعال</span>;
}

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
    <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[0.6rem] md:text-xs font-bold ${styles[side] || 'bg-slate-100 text-slate-600'}`}>
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
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodType>('day');

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const { startDate, endDate } = getDateRange(period);
        
        const [showcaseRes, tradeSummaryRes, treasuryRes] = await Promise.all([
          client.api.showcase(),
          client.api.getTradesSummary({ startDate, endDate }).catch(() => ({ data: [] })),
          client.api.treasuryWallets().catch(() => ({ data: [] }))
        ]);

        setShowcase(showcaseRes.data);
        
        if (tradeSummaryRes.data) {
          setTradeSummary(tradeSummaryRes.data);
        }
        
        if (treasuryRes.data) {
          setTreasuryWallets(treasuryRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [period]);

  // مقادیر از showcase
  const volumeOfTransaction = showcase?.volumeOfTransaction || 0;
  const allUserCount = showcase?.allUserCount || 0;
  const openMarginCount = showcase?.openMarginCount || 0;
  const feeCount = showcase?.feeCount || 0;
  const alarmMarginCount = showcase?.alarmMarginCount || 0;
  const goldBuyPrice = showcase?.goldBuyPrice || 0;
  const goldSellPrice = showcase?.goldSellPrice || 0;

  // محاسبات معاملات
  const buyTrades = tradeSummary.filter(item => item.side === 'BUY' || item.side === 'LONG');
  const sellTrades = tradeSummary.filter(item => item.side === 'SELL' || item.side === 'SHORT');

  const totalBuyNotional = buyTrades.reduce((sum, item) => sum + (item.totalNotional || 0), 0);
  const totalSellNotional = sellTrades.reduce((sum, item) => sum + (item.totalNotional || 0), 0);
  const totalBuyQuantity = buyTrades.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
  const totalSellQuantity = sellTrades.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
  const totalTradesCount = tradeSummary.reduce((sum, item) => sum + (item.tradeCount || 0), 0);
  const totalFeeAll = tradeSummary.reduce((sum, item) => sum + (item.totalFee || 0), 0);
  const netRequired = totalBuyQuantity - totalSellQuantity;

  // محاسبات خزانه
  const totalBalance = treasuryWallets.reduce((sum, wallet) => sum + (wallet.balances?.balance || 0), 0);
  const totalAvailable = treasuryWallets.reduce((sum, wallet) => sum + (wallet.balances?.availableBalance || 0), 0);
  const totalBlocked = treasuryWallets.reduce((sum, wallet) => sum + (wallet.balances?.blockBalance || 0), 0);
  
  // گروه‌بندی بر اساس ارز
  const walletsByCurrency = treasuryWallets.reduce((acc, wallet) => {
    const currencyCode = wallet.currency?.code || 'نامشخص';
    if (!acc[currencyCode]) {
      acc[currencyCode] = {
        currencyName: wallet.currency?.name || currencyCode,
        symbol: wallet.currency?.symbol || '',
        unit: wallet.currency?.unit || '',
        totalBalance: 0,
        totalAvailable: 0,
        totalBlocked: 0,
        accounts: []
      };
    }
    acc[currencyCode].totalBalance += wallet.balances?.balance || 0;
    acc[currencyCode].totalAvailable += wallet.balances?.availableBalance || 0;
    acc[currencyCode].totalBlocked += wallet.balances?.blockBalance || 0;
    acc[currencyCode].accounts.push(wallet);
    return acc;
  }, {} as Record<string, {
    currencyName: string;
    symbol: string;
    unit: string;
    totalBalance: number;
    totalAvailable: number;
    totalBlocked: number;
    accounts: FinancialAccountDto[];
  }>);

  // Format numbers
  const formatNumber = (num: number): string => {
    return num.toLocaleString('fa-IR');
  };

  const formatCurrency = (num: number): string => {
    return (num / 1000000).toLocaleString('fa-IR');
  };

  const formatDecimal = (num: number, decimals: number = 4): string => {
    return num.toLocaleString('fa-IR', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  const formatBalance = (num: number): string => {
    if (num >= 1000000000000) {
      return `${(num).toLocaleString('fa-IR', { maximumFractionDigits: 2 })} هزار میلیارد`;
    }
    if (num >= 1000000000) {
      return `${(num).toLocaleString('fa-IR', { maximumFractionDigits: 2 })} میلیارد`;
    }
    if (num >= 1000000) {
      return `${(num).toLocaleString('fa-IR', { maximumFractionDigits: 2 })} میلیون`;
    }
    return num.toLocaleString('fa-IR');
  };

  const getProductColor = (code: string): string => {
    const colors: Record<string, string> = {
      'SPOT': '#0d59f2',
      'FORWARD_T1': '#f59e0b',
      'FORWARD_T2': '#10b981',
      'PERP': '#8b5cf6',
    };
    return colors[code] || '#6b7280';
  };

  const periodTitle = period === 'day' ? 'امروز' : period === 'week' ? 'این هفته' : 'این ماه';

  const getProductLabel = (code: string): string => {
    const labels: Record<string, string> = {
      'SPOT': 'نقدی',
      'FORWARD_T1': 'فردایی T+1',
      'FORWARD_T2': 'فردایی T+2',
      'PERP': 'دائمی',
    };
    return labels[code] || code;
  };

  const getAccountTypeLabel = (type?: string): string => {
    const labels: Record<string, string> = {
      'OPERATIONAL': 'عملیاتی',
      'RESERVE': 'ذخیره',
      'TRADING': 'معاملاتی',
    };
    return labels[type || ''] || type || 'عمومی';
  };

  const getAccountStatusBadge = (status?: string) => {
    if (status === 'ACTIVE') {
      return <span className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[0.6rem]">فعال</span>;
    }
    return <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-[0.6rem]">{status}</span>;
  };

  return (
    <>
      <Header title="داشبورد" showMarketStatus />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px] space-y-5 md:space-y-7">

          {/* KPI Cards */}
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            <KpiCard 
              label="حجم معاملات" 
              value={formatCurrency(volumeOfTransaction)} 
              unit="میلیون ریال" 
            />
            <KpiCard 
              label="معامله‌گران" 
              value={formatNumber(allUserCount)} 
              unit="نفر" 
              onClick={() => navigate('/users')}
              clickable
            />
            <KpiCard 
              label="تعهدات باز" 
              value={formatNumber(openMarginCount)} 
              unit="پوزیشن"
            />
            {/* <KpiCard 
              label="مجموع کارمزد" 
              value={formatCurrency(feeCount)} 
              unit="میلیون ریال" 
            /> */}
            <KpiCard 
              label="قیمت طلا (خرید)" 
              value={goldBuyPrice ? formatNumber(Math.round(goldBuyPrice)) : '---'} 
              unit="ریال" 
            />
            <KpiCard 
              label="قیمت طلا (فروش)" 
              value={goldSellPrice ? formatNumber(Math.round(goldSellPrice)) : '---'} 
              unit="ریال" 
            />
            <KpiCard 
              label="هشدار مارجین" 
              value={formatNumber(alarmMarginCount)} 
              unit="حساب" 
            />
          </section>

          {/* گزارش معاملات */}
          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <FiActivity className="text-primary text-xl md:text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                    گزارش معاملات
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    تفکیک بر اساس محصول و جهت معامله
                  </p>
                </div>
              </div>
              
              <div className="flex gap-1 bg-slate-100 dark:bg-background-dark p-1 rounded-xl border border-border-light dark:border-border-dark self-start">
                {[
                  { key: 'day', label: 'امروز' },
                  { key: 'week', label: 'هفتگی' },
                  { key: 'month', label: 'ماهانه' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setPeriod(key as PeriodType)}
                    className={`px-4 py-1.5 md:py-2 text-xs font-bold rounded-lg transition-all ${
                      period === key 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-border-dark'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* کارت نیاز به تامین */}
            {tradeSummary.length > 0 && (
              <div className={`p-4 rounded-xl mb-5 border ${
                netRequired > 0 
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' 
                  : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {netRequired > 0 ? (
                    <FiTrendingUp className="text-amber-600 text-lg" />
                  ) : (
                    <FiTrendingDown className="text-emerald-600 text-lg" />
                  )}
                  <span className="font-bold text-slate-900 dark:text-white">
                    وضعیت تامین {periodTitle}
                  </span>
                </div>
                {netRequired > 0 ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    شما باید{' '}
                    <span className="font-black text-amber-600 dark:text-amber-400 text-base">
                      {formatDecimal(netRequired, 4)}
                    </span>
                    {' '}واحد طلا <strong>تامین</strong> کنید
                    <span className="text-xs text-slate-500 block mt-1.5">
                      خرید: {formatDecimal(totalBuyQuantity, 4)} | فروش: {formatDecimal(totalSellQuantity, 4)}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    موجودی کافی است.{' '}
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                      {formatDecimal(Math.abs(netRequired), 4)}
                    </span>
                    {' '}واحد <strong>مازاد</strong> دارید
                    <span className="text-xs text-slate-500 block mt-1.5">
                      خرید: {formatDecimal(totalBuyQuantity, 4)} | فروش: {formatDecimal(totalSellQuantity, 4)}
                    </span>
                  </p>
                )}
              </div>
            )}

            {tradeSummary.length > 0 ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3 text-center">
                    <div className="text-xs text-slate-500 mb-1">تعداد معاملات</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                      {formatNumber(totalTradesCount)}
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3 text-center">
                    <div className="text-xs text-slate-500 mb-1">حجم خرید</div>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {formatDecimal(totalBuyQuantity, 4)}
                    </div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-3 text-center">
                    <div className="text-xs text-slate-500 mb-1">حجم فروش</div>
                    <div className="text-lg font-black text-red-600 dark:text-red-400">
                      {formatDecimal(totalSellQuantity, 4)}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3 text-center">
                    <div className="text-xs text-slate-500 mb-1">اختلاف</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">
                      {formatDecimal((totalBuyQuantity - totalSellQuantity))}
                      <span className="text-xs font-normal mr-1">م.ر</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-border-light dark:border-border-dark">
                  <table className="w-full text-right text-xs md:text-sm">
                    <thead className="bg-slate-50 dark:bg-background-dark/50 text-slate-500">
                      <tr>
                        <th className="px-3 md:px-4 py-2.5 font-medium">محصول</th>
                        <th className="px-3 md:px-4 py-2.5 font-medium">جهت</th>
                        <th className="px-3 md:px-4 py-2.5 font-medium">تعداد</th>
                        <th className="px-3 md:px-4 py-2.5 font-medium">حجم کل</th>
                        <th className="px-3 md:px-4 py-2.5 font-medium">ارزش کل (م.ریال)</th>
                        <th className="px-3 md:px-4 py-2.5 font-medium">میانگین قیمت</th>
                        <th className="px-3 md:px-4 py-2.5 font-medium">کارمزد (م.ریال)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light dark:divide-border-dark">
                      {tradeSummary.map((item, index) => {
                        const avgPrice = item.totalQuantity && item.totalQuantity > 0 
                          ? (item.totalNotional || 0) / (item.totalQuantity || 1) 
                          : 0;
                        
                        return (
                          <tr key={index} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors">
                            <td className="px-3 md:px-4 py-3 font-medium text-slate-900 dark:text-white">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
                                  style={{ backgroundColor: getProductColor(item.productCode || '') }}
                                />
                                <span>{getProductLabel(item.productCode || '')}</span>
                              </div>
                            </td>
                            <td className="px-3 md:px-4 py-3">
                              <TradeSideBadge side={item.side || ''} />
                            </td>
                            <td className="px-3 md:px-4 py-3 text-slate-700 dark:text-slate-300">
                              {formatNumber(item.tradeCount || 0)}
                            </td>
                            <td className="px-3 md:px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                              {formatDecimal(item.totalQuantity || 0, 4)}
                            </td>
                            <td className="px-3 md:px-4 py-3 font-bold text-slate-900 dark:text-white">
                              {formatCurrency(item.totalNotional || 0)}
                            </td>
                            <td className="px-3 md:px-4 py-3 text-slate-600 dark:text-slate-400 text-xs">
                              {formatNumber(Math.round(avgPrice))}
                            </td>
                            <td className="px-3 md:px-4 py-3 text-slate-700 dark:text-slate-300 text-xs">
                              {formatCurrency(item.totalFee || 0)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border-light dark:border-border-dark bg-slate-50 dark:bg-background-dark/50 font-bold">
                        <td className="px-3 md:px-4 py-3 text-slate-900 dark:text-white" colSpan={3}>جمع کل</td>
                        <td className="px-3 md:px-4 py-3 text-slate-900 dark:text-white">
                          {formatDecimal(totalBuyQuantity + totalSellQuantity, 4)}
                        </td>
                        <td className="px-3 md:px-4 py-3 text-slate-900 dark:text-white">
                          {formatCurrency(totalBuyNotional + totalSellNotional)}
                        </td>
                        <td className="px-3 md:px-4 py-3 text-slate-900 dark:text-white">-</td>
                        <td className="px-3 md:px-4 py-3 text-slate-900 dark:text-white">
                          {formatCurrency(totalFeeAll)}
                        </td>
                      </tr>
                      <tr className="bg-emerald-50/50 dark:bg-emerald-950/10 font-bold">
                        <td className="px-3 md:px-4 py-2 text-emerald-600 dark:text-emerald-400" colSpan={3}>
                          جمع خرید (BUY + LONG)
                        </td>
                        <td className="px-3 md:px-4 py-2 text-emerald-600 dark:text-emerald-400">
                          {formatDecimal(totalBuyQuantity, 4)}
                        </td>
                        <td className="px-3 md:px-4 py-2 text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(totalBuyNotional)}
                        </td>
                        <td className="px-3 md:px-4 py-2" colSpan={2}></td>
                      </tr>
                      <tr className="bg-red-50/50 dark:bg-red-950/10 font-bold">
                        <td className="px-3 md:px-4 py-2 text-red-600 dark:text-red-400" colSpan={3}>
                          جمع فروش (SELL + SHORT)
                        </td>
                        <td className="px-3 md:px-4 py-2 text-red-600 dark:text-red-400">
                          {formatDecimal(totalSellQuantity, 4)}
                        </td>
                        <td className="px-3 md:px-4 py-2 text-red-600 dark:text-red-400">
                          {formatCurrency(totalSellNotional)}
                        </td>
                        <td className="px-3 md:px-4 py-2" colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <FiBarChart2 className="text-5xl mx-auto mb-4 opacity-30" />
                <p className="text-sm font-medium">در این بازه معامله‌ای ثبت نشده است</p>
                <p className="text-xs mt-1 opacity-70">با تغییر بازه زمانی، داده‌های بیشتری مشاهده کنید</p>
              </div>
            )}
          </section>

          {/* خزانه و ریسک تعهدات */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
            {/* موجودی خزانه */}
            <div className="lg:col-span-7 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-4 md:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-5">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Wallet className="text-primary text-xl md:text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">موجودی خزانه</h3>
                  <p className="text-xs text-slate-500 mt-0.5">وضعیت کیف پول‌های بانکی</p>
                </div>
              </div>

              {treasuryWallets.length > 0 ? (
                <div className="space-y-4">
                  {/* خلاصه کلی */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3 text-center">
                      <div className="text-xs text-slate-500 mb-1">موجودی کل</div>
                      <div className="text-base font-black text-slate-900 dark:text-white">
                        {formatBalance(totalBalance)}
                      </div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3 text-center">
                      <div className="text-xs text-slate-500 mb-1">قابل برداشت</div>
                      <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                        {formatBalance(totalAvailable)}
                      </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3 text-center">
                      <div className="text-xs text-slate-500 mb-1">مسدود شده</div>
                      <div className="text-base font-black text-amber-600 dark:text-amber-400">
                        {formatBalance(totalBlocked)}
                      </div>
                    </div>
                  </div>

                  {/* تفکیک بر اساس ارز */}
                  <div className="space-y-3">
                    {Object.entries(walletsByCurrency).map(([currencyCode, data]) => (
                      <div key={currencyCode} className="border border-border-light dark:border-border-dark rounded-xl overflow-hidden">
                        <div className="bg-slate-50 dark:bg-background-dark/50 px-4 py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                              {data.currencyName}
                            </span>
                            {data.symbol && (
                              <span className="text-xs text-slate-500">({data.symbol})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-slate-600 dark:text-slate-400">
                              موجودی: <strong>{formatBalance(data.totalBalance)}</strong>
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400">
                              قابل برداشت: <strong>{formatBalance(data.totalAvailable)}</strong>
                            </span>
                          </div>
                        </div>
                        <div className="divide-y divide-border-light dark:divide-border-dark">
                          {data.accounts.map((account, idx) => (
                            <div key={account.id || idx} className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-background-dark/30 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {account.name || account.description || 'بدون نام'}
                                  </span>
                                  {account.accountNumber && (
                                    <span className="text-[0.6rem] text-slate-400 bg-slate-100 dark:bg-background-dark px-1.5 py-0.5 rounded">
                                      {account.accountNumber}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {account.type && (
                                    <span className="text-[0.6rem] text-slate-500 bg-slate-100 dark:bg-background-dark px-1.5 py-0.5 rounded">
                                      {account.type.description}
                                    </span>
                                  )}
                                  {account.status?.description}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-xs">
                                <span className="text-slate-700 dark:text-slate-300">
                                  {formatBalance(account.balances?.balance || 0)}
                                </span>
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  {formatBalance(account.balances?.availableBalance || 0)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <FiDatabase className="text-4xl mx-auto mb-3 opacity-50" />
                  <p className="text-sm">اطلاعات خزانه در دسترس نیست</p>
                </div>
              )}
            </div>

            {/* ریسک تعهدات */}
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