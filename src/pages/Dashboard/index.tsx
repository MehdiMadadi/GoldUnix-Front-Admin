import { useState, useEffect } from 'react';
import { FiDatabase, FiInfo, FiBarChart2, FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';
import Header from '../../components/Layout/Header';
import KpiCard from '../../components/UI/KpiCard';
import ProgressBar from '../../components/UI/ProgressBar';
import { TREASURY } from '../../data/treasury';
import { OBLIGATION_BREAKDOWN } from '../../data/risk';
import { Api, PriceQuoteRequest, ShowcaseDto, TradeSummaryByCurrencyDto } from '../../lib/client';

const ASSET_TABLE = [
  { name: 'طلا (۱۸ عیار)', volume: '۲,۵۰۰ گرم', value: '۸۱,۲۵۰,۰۰۰,۰۰۰', status: 'active' },
  { name: 'مس کاتد', volume: '۱۵ تن', value: '۶,۳۰۰,۰۰۰,۰۰۰', status: 'active' },
  { name: 'سکه تمام', volume: '۱۲۵ عدد', value: '۵,۰۰۰,۰۰۰,۰۰۰', status: 'semi' },
  { name: 'نقره', volume: '۳۵۰ کیلو', value: '۲,۸۰۰,۰۰۰,۰۰۰', status: 'low' },
];

function AssetStatusBadge({ status }: { status: string }) {
  if (status === 'active')
    return <span className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[0.6rem] md:text-xs">فعال</span>;
  if (status === 'semi')
    return <span className="bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[0.6rem] md:text-xs">نیمه فعال</span>;
  return <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[0.6rem] md:text-xs">کم‌فعال</span>;
}

function TradeSideBadge({ side }: { side: string }) {
  const styles = {
    BUY: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
    SELL: 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400',
    LONG: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
    SHORT: 'bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400',
  };
  
  const labels = {
    BUY: 'خرید',
    SELL: 'فروش',
    LONG: 'لانگ',
    SHORT: 'شورت',
  };
  
  return (
    <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[0.6rem] md:text-xs font-bold ${styles[side as keyof typeof styles] || 'bg-slate-100 text-slate-600'}`}>
      {labels[side as keyof typeof labels] || side}
    </span>
  );
}

export default function DashboardPage() {
  const [showcase, setShowcase] = useState<ShowcaseDto | null>(null);
  const [goldBuyPrice, setGoldBuyPrice] = useState<number | null>(null);
  const [goldSellPrice, setGoldSellPrice] = useState<number | null>(null);
  const [tradeSummary, setTradeSummary] = useState<TradeSummaryByCurrencyDto[]>([]);
  const [loading, setLoading] = useState(true);

  const client = new Api();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Authenticate first if needed
        // await client.rest.authenticate({ 
        //   username: '09372689372', 
        //   password: 'Milad@102030' 
        // });

        // Fetch showcase data
        const showcaseRes = await client.api.showcase();
        setShowcase(showcaseRes.data);

        // Fetch gold prices
        const buyRequest: PriceQuoteRequest = { assetCode: 'GOLD', amount: 1 };
        const sellRequest: PriceQuoteRequest = { assetCode: 'GOLD', amount: 1 };
        
        const [buyRes, sellRes, tradeSummaryRes] = await Promise.all([
          client.api.getBuyPriceQuote(buyRequest),
          client.api.getSellPriceQuote(sellRequest),
          client.api.getTodayTradesSummary().catch(() => ({ data: [] }))
        ]);

        if (buyRes.data?.data?.finalPrice) {
          setGoldBuyPrice(buyRes.data.data.finalPrice);
        }
        if (sellRes.data?.data?.finalPrice) {
          setGoldSellPrice(sellRes.data.data.finalPrice);
        }
        if (tradeSummaryRes.data) {
          setTradeSummary(tradeSummaryRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh prices every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const treasuryTotal = TREASURY.totalLiquidity;
  const reservedPercent = Math.round((TREASURY.reserved / treasuryTotal) * 100);
  const availablePercent = Math.round((TREASURY.available / treasuryTotal) * 100);
  const alertPercent = Math.round((TREASURY.alertThreshold / treasuryTotal) * 100);

  // Calculate dynamic values from API
  const volumeOfTransaction = showcase?.volumeOfTransaction || 0;
  const spreedAmount = showcase?.spreedAmount || 0;
  const allUserCount = showcase?.allUserCount || 0;
  const openMarginCount = showcase?.openMarginCount || 0;
  const feeCount = showcase?.feeCount || 0;
  const alarmMarginCount = showcase?.alarmMarginCount || 0;

  // Calculate trade summary totals
  const totalTradesToday = tradeSummary.reduce((sum, item) => sum + (item.tradeCount || 0), 0);
  const totalVolumeToday = tradeSummary.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
  const totalNotionalToday = tradeSummary.reduce((sum, item) => sum + (item.totalNotional || 0), 0);
  const totalFeeToday = tradeSummary.reduce((sum, item) => sum + (item.totalFee || 0), 0);

  // Format numbers to Persian
  const formatNumber = (num: number) => {
    return num.toLocaleString('fa-IR');
  };

  const formatCurrency = (num: number) => {
    return (num).toLocaleString('fa-IR');
  };

  const formatDecimal = (num: number, decimals: number = 2) => {
    return num.toLocaleString('fa-IR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  // Calculate price change (mock - you can implement real calculation)
  const calculateChange = (current: number | null) => {
    if (!current) return { value: '۰٪', positive: true };
    // This is a placeholder - you should compare with previous price
    return { value: '+۱.۲٪', positive: true };
  };

  const goldChange = calculateChange(goldBuyPrice);

  // Get color based on product code
  const getProductColor = (code: string) => {
    const colors: { [key: string]: string } = {
      'SPOT': '#0d59f2',
      'FORWARD_T1': '#f59e0b',
      'FORWARD_T2': '#10b981',
      'PERP': '#8b5cf6',
    };
    return colors[code] || '#6b7280';
  };

  // Calculate max notional for bar chart scaling
  const maxNotional = Math.max(...tradeSummary.map(item => item.totalNotional || 0), 1);

  return (
    <>
      <Header title="داشبورد" showMarketStatus />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-[1600px] space-y-5 md:space-y-7">

          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            <KpiCard 
              label="حجم معاملات" 
              value={formatCurrency(volumeOfTransaction)} 
              unit="میلیون ریال" 
            />
            <KpiCard 
              label="سود اسپرد" 
              value={formatCurrency(spreedAmount)} 
              unit="میلیون ریال" 
              change="-۵%" 
              changePositive={false} 
            />
            <KpiCard 
              label="معامله‌گران" 
              value={formatNumber(allUserCount)} 
              unit="نفر" 
              change="+۳%" 
              changePositive 
            />
            <KpiCard 
              label="تعهد باز" 
              value={formatNumber(openMarginCount)} 
              change="+۸%" 
              changePositive 
            />
            <KpiCard 
              label="مجموع کارمزد" 
              value={formatCurrency(feeCount)} 
              unit="میلیون ریال" 
              change="+۱۵%" 
              changePositive 
            />
            <KpiCard 
              label="قیمت طلا (خرید)" 
              value={goldBuyPrice ? formatNumber(Math.round(goldBuyPrice)) : '---'} 
              unit="ریال" 
              change={goldChange.value} 
              changePositive={goldChange.positive} 
            />
            <KpiCard 
              label="قیمت طلا (فروش)" 
              value={goldSellPrice ? formatNumber(Math.round(goldSellPrice)) : '---'} 
              unit="ریال" 
              change="-۰.۵٪" 
              changePositive={false} 
            />
            <KpiCard 
              label="هشدار مارجین" 
              value={formatNumber(alarmMarginCount)} 
              unit="حساب" 
              change="+۲ مورد" 
              changePositive={false} 
            />
          </section>

          {/* New Section: Today's Trades Summary */}
          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <FiActivity className="text-primary text-2xl md:text-3xl" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                    گزارش معاملات امروز
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    تفکیک بر اساس محصول و جهت معامله
                  </p>
                </div>
              </div>
              
              {/* Summary Cards */}
              <div className="hidden md:flex gap-4">
                <div className="text-center">
                  <div className="text-sm text-slate-500">کل معاملات</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {formatNumber(totalTradesToday)}
                  </div>
                </div>
                <div className="w-px bg-border-light dark:bg-border-dark" />
                <div className="text-center">
                  <div className="text-sm text-slate-500">حجم کل</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {formatDecimal(totalVolumeToday, 4)}
                  </div>
                </div>
                <div className="w-px bg-border-light dark:bg-border-dark" />
                <div className="text-center">
                  <div className="text-sm text-slate-500">ارزش کل (میلیون ریال)</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {formatCurrency(totalNotionalToday)}
                  </div>
                </div>
                <div className="w-px bg-border-light dark:bg-border-dark" />
                <div className="text-center">
                  <div className="text-sm text-slate-500">کارمزد کل</div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totalFeeToday)}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Summary */}
            <div className="grid grid-cols-2 gap-3 mb-4 md:hidden">
              <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">کل معاملات</div>
                <div className="text-base font-black text-slate-900 dark:text-white">
                  {formatNumber(totalTradesToday)}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">حجم کل</div>
                <div className="text-base font-black text-slate-900 dark:text-white">
                  {formatDecimal(totalVolumeToday, 4)}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">ارزش کل (م. ریال)</div>
                <div className="text-base font-black text-slate-900 dark:text-white">
                  {formatCurrency(totalNotionalToday)}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">کارمزد کل</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(totalFeeToday)}
                </div>
              </div>
            </div>

            {/* Trade Summary Table & Chart */}
            {tradeSummary.length > 0 ? (
              <div className="space-y-4">
                {/* Horizontal Bar Chart */}
                <div className="space-y-3">
                  {tradeSummary.map((item, index) => {
                    const percentWidth = maxNotional > 0 ? ((item.totalNotional || 0) / maxNotional) * 100 : 0;
                    const productColor = getProductColor(item.productCode || '');
                    
                    return (
                      <div key={index} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              {item.productCode}
                            </span>
                            <TradeSideBadge side={item.side || ''} />
                          </div>
                          <span className="text-xs text-slate-500">
                            {formatCurrency(item.totalNotional || 0)} م.ریال
                          </span>
                        </div>
                        <div className="relative h-8 bg-slate-100 dark:bg-background-dark rounded-lg overflow-hidden">
                          <div 
                            className="h-full rounded-lg transition-all duration-500 ease-out group-hover:opacity-80"
                            style={{ 
                              width: `${percentWidth}%`,
                              backgroundColor: productColor,
                              opacity: 0.8
                            }}
                          />
                          <div className="absolute inset-0 flex items-center px-3 text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-200">
                              {formatDecimal(item.totalQuantity || 0, 4)} 
                              <span className="font-normal text-slate-500 mr-2">
                                | {formatNumber(item.tradeCount || 0)} معامله
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Table */}
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-right text-xs md:text-sm">
                    <thead className="border-b border-border-light dark:border-border-dark text-slate-500">
                      <tr>
                        <th className="px-3 md:px-4 py-2 font-medium">محصول</th>
                        <th className="px-3 md:px-4 py-2 font-medium">جهت</th>
                        <th className="px-3 md:px-4 py-2 font-medium">تعداد معاملات</th>
                        <th className="px-3 md:px-4 py-2 font-medium">حجم کل</th>
                        <th className="px-3 md:px-4 py-2 font-medium">ارزش کل (م.ریال)</th>
                        <th className="px-3 md:px-4 py-2 font-medium">کارمزد (م.ریال)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light dark:divide-border-dark">
                      {tradeSummary.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors">
                          <td className="px-3 md:px-4 py-3 font-medium text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: getProductColor(item.productCode || '') }}
                              />
                              {item.productCode}
                            </div>
                          </td>
                          <td className="px-3 md:px-4 py-3">
                            <TradeSideBadge side={item.side || ''} />
                          </td>
                          <td className="px-3 md:px-4 py-3 text-slate-700 dark:text-slate-300">
                            {formatNumber(item.tradeCount || 0)}
                          </td>
                          <td className="px-3 md:px-4 py-3 text-slate-700 dark:text-slate-300">
                            {formatDecimal(item.totalQuantity || 0, 4)}
                          </td>
                          <td className="px-3 md:px-4 py-3 font-bold text-slate-900 dark:text-white">
                            {formatCurrency(item.totalNotional || 0)}
                          </td>
                          <td className="px-3 md:px-4 py-3 text-emerald-600 dark:text-emerald-400 font-medium">
                            {formatCurrency(item.totalFee || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-border-light dark:border-border-dark">
                      <tr className="bg-slate-50 dark:bg-background-dark/50 font-bold">
                        <td className="px-3 md:px-4 py-3 text-slate-900 dark:text-white" colSpan={2}>
                          جمع کل
                        </td>
                        <td className="px-3 md:px-4 py-3 text-slate-900 dark:text-white">
                          {formatNumber(totalTradesToday)}
                        </td>
                        <td className="px-3 md:px-4 py-3 text-slate-900 dark:text-white">
                          {formatDecimal(totalVolumeToday, 4)}
                        </td>
                        <td className="px-3 md:px-4 py-3 text-slate-900 dark:text-white">
                          {formatCurrency(totalNotionalToday)}
                        </td>
                        <td className="px-3 md:px-4 py-3 text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(totalFeeToday)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <FiBarChart2 className="text-4xl mx-auto mb-3 opacity-50" />
                <p className="text-sm">امروز معامله‌ای ثبت نشده است</p>
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
            <div className="lg:col-span-8 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-4 md:p-5 flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">
                  روند حجم و درآمد
                  <span className="text-xs md:text-sm font-normal text-slate-500 mr-2">طلا / مس</span>
                </h3>
                <div className="flex gap-1 bg-slate-100 dark:bg-background-dark p-1 rounded-xl border border-border-light dark:border-border-dark">
                  {['روزانه', 'هفتگی', 'ماهانه'].map((label, i) => (
                    <button
                      key={label}
                      className={`px-3 md:px-4 py-1 md:py-1.5 text-xs font-bold rounded-lg transition-all ${
                        i === 0 ? 'bg-primary text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-border-dark'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative w-full h-[180px] md:h-[240px] mt-2">
                <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="gradChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0d59f2" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#0d59f2" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,160 Q80,120 160,140 T320,80 T480,100 T620,30 L620,200 L0,200 Z" fill="url(#gradChart)" />
                  <path d="M0,160 Q80,120 160,140 T320,80 T480,100 T620,30" stroke="#0d59f2" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M0,180 Q100,150 220,170 T420,120 T620,80" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeDasharray="5 3" opacity="0.9" />
                  {[40, 90, 140].map(y => (
                    <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
                  ))}
                </svg>
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-4 h-1 rounded-full bg-primary" />
                  طلا
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-4 h-0.5 rounded-full bg-amber-500" style={{ borderTop: '2px dashed #f59e0b', background: 'none' }} />
                  مس
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-6 md:p-8 flex flex-col">
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

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl overflow-hidden">
              <div className="flex items-center justify-between p-4 md:p-5">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">تفکیک معاملات بر اساس دارایی</h3>
                <button className="text-xs bg-primary/10 text-primary px-3 md:px-4 py-1.5 md:py-2 rounded-xl font-semibold hover:bg-primary/20 transition-colors">
                  خروجی اکسل
                </button>
              </div>
              <div className="overflow-x-auto px-2 pb-2">
                <table className="w-full text-right text-xs md:text-sm">
                  <thead className="border-b border-border-light dark:border-border-dark text-slate-500">
                    <tr>
                      <th className="px-3 md:px-5 py-2 md:py-3 font-medium">نام دارایی</th>
                      <th className="px-3 md:px-5 py-2 md:py-3 font-medium">حجم</th>
                      <th className="px-3 md:px-5 py-2 md:py-3 font-medium">ارزش کل (ریال)</th>
                      <th className="px-3 md:px-5 py-2 md:py-3 font-medium">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {ASSET_TABLE.map(row => (
                      <tr key={row.name} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors">
                        <td className="px-3 md:px-5 py-3 md:py-4 font-medium text-slate-900 dark:text-white">{row.name}</td>
                        <td className="px-3 md:px-5 py-3 md:py-4 text-slate-600 dark:text-slate-300">{row.volume}</td>
                        <td className="px-3 md:px-5 py-3 md:py-4 text-xs text-slate-700 dark:text-slate-300">{row.value}</td>
                        <td className="px-3 md:px-5 py-3 md:py-4"><AssetStatusBadge status={row.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-4 md:p-6">
              <div className="flex items-center gap-2 md:gap-3 mb-5">
                <FiDatabase className="text-primary text-2xl md:text-3xl" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base md:text-lg">موجودی خزانه</h3>
              </div>
              <div className="space-y-4 md:space-y-5">
                <ProgressBar label="نقدینگی کل" value="۲۵۰,۰۰۰ میلیارد" percent={100} color="primary" />
                <ProgressBar label="رزرو شده" value="۴۵,۰۰۰ میلیارد" percent={reservedPercent} color="blue" />
                <ProgressBar label="قابل برداشت" value="۱۸۵,۰۰۰ میلیارد" percent={availablePercent} color="emerald" />
                <ProgressBar label="حد هشدار" value="۲۰,۰۰۰ میلیارد" percent={alertPercent} color="rose" />
              </div>
              <div className="mt-5 flex items-center gap-2 md:gap-3 text-xs md:text-sm bg-primary/10 p-2 md:p-3 rounded-xl">
                <FiInfo className="text-primary text-lg md:text-xl" />
                <span className="text-slate-700 dark:text-slate-200">
                  نسبت پوشش ریسک: {TREASURY.riskCoverageRatio.toLocaleString('fa-IR')} (ایمن)
                </span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}