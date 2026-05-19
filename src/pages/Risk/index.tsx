import { useState, useEffect } from 'react';
import { FiAlertCircle, FiActivity, FiPieChart } from 'react-icons/fi';
import Header from '../../components/Layout/Header';
import Badge from '../../components/UI/Badge';
import ProgressBar from '../../components/UI/ProgressBar';
import KpiCard from '../../components/UI/KpiCard';
import { MARGIN_ALERTS, RISK_DISTRIBUTION, OBLIGATION_BREAKDOWN } from '../../data/risk';
import { Api, ShowcaseDto, PositionDetailsResponse, UserAccountShowcase } from '../../lib/client';

interface RiskMetrics {
  criticalAlerts: number;
  warningAlerts: number;
  openObligations: number;
  riskCoverage: number;
  marginAlerts: MarginAlert[];
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  obligationBreakdown: {
    cash: number;
    tomorrow: number;
    overdue: number;
    coveragePercent: number;
  };
}

interface MarginAlert {
  id: number;
  userName: string;
  userType: string;
  currentMargin: number;
  requiredMargin: number;
  marginRatio: number;
  alertLevel: 'critical' | 'warning' | 'info';
  createdAt: string;
  asset: string;
  positionId: number;
}

function AlertLevelBadge({ level }: { level: 'critical' | 'warning' | 'info' }) {
  if (level === 'critical') return <Badge variant="danger">بحرانی</Badge>;
  if (level === 'warning') return <Badge variant="warning">هشدار</Badge>;
  return <Badge variant="info">اطلاع</Badge>;
}

function formatNumber(n: number) {
  return n;
}

export default function RiskPage() {
  const [loading, setLoading] = useState(true);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    criticalAlerts: 0,
    warningAlerts: 0,
    openObligations: 0,
    riskCoverage: 0,
    marginAlerts: [],
    riskDistribution: {
      low: 0,
      medium: 0,
      high: 0,
    },
    obligationBreakdown: {
      cash: 0,
      tomorrow: 0,
      overdue: 0,
      coveragePercent: 0,
    },
  });

  const client = new Api();

  useEffect(() => {
    fetchRiskData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchRiskData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      
      // Authenticate
      // await client.rest.authenticate({
      //   username: '09372689372',
      //   password: 'Milad@102030'
      // });

      // Fetch showcase data for general metrics
      const showcaseRes = await client.api.showcase();
      const showcase = showcaseRes.data;

      // Fetch open margin positions
      const positionsRes = await client.api.getOpenPositions();
      const positions = positionsRes.data || [];

      // Process margin alerts from positions
      const alerts = processMarginAlerts(positions);

      // Calculate risk distribution
      const riskDist = calculateRiskDistribution(positions);

      // Calculate obligation breakdown
      const obligationBreakdown = calculateObligationBreakdown(positions);

      // Update metrics
      setRiskMetrics({
        criticalAlerts: alerts.filter(a => a.alertLevel === 'critical').length,
        warningAlerts: alerts.filter(a => a.alertLevel === 'warning').length,
        openObligations: showcase?.openMarginCount || 0,
        riskCoverage: obligationBreakdown.coveragePercent,
        marginAlerts: alerts,
        riskDistribution: riskDist,
        obligationBreakdown: obligationBreakdown,
      });

    } catch (error) {
      console.error('Failed to fetch risk data:', error);
      // Fallback to mock data
      setRiskMetrics({
        criticalAlerts: 2,
        warningAlerts: 2,
        openObligations: 5400,
        riskCoverage: OBLIGATION_BREAKDOWN.coveragePercent,
        marginAlerts: MARGIN_ALERTS.map(alert => ({
          ...alert,
          asset: 'GOLD',
          positionId: alert.id,
        })),
        riskDistribution: RISK_DISTRIBUTION,
        obligationBreakdown: OBLIGATION_BREAKDOWN,
      });
    } finally {
      setLoading(false);
    }
  };

  const processMarginAlerts = (positions: PositionDetailsResponse[]): MarginAlert[] => {
    const alerts: MarginAlert[] = [];
    
    positions.forEach((position, index) => {
      const marginLevel = position.marginLevel || 0;
      const riskLevel = position.riskLevel || 'SAFE';
      
      let alertLevel: 'critical' | 'warning' | 'info' = 'info';
      if (riskLevel === 'CRITICAL' || marginLevel < 50) {
        alertLevel = 'critical';
      } else if (riskLevel === 'WARNING' || marginLevel < 80) {
        alertLevel = 'warning';
      }

      // Only add positions that need attention
      if (alertLevel !== 'info') {
        alerts.push({
          id: position.positionId || index,
          userName: `کاربر ${position.positionId}`,
          userType: 'trade',
          currentMargin: position.maintenanceMargin || 0,
          requiredMargin: position.initialMargin || 0,
          marginRatio: marginLevel,
          alertLevel,
          createdAt: position.openedAt || new Date().toISOString(),
          asset: position.asset || 'GOLD',
          positionId: position.positionId || 0,
        });
      }
    });

    return alerts.sort((a, b) => {
      const priority = { critical: 3, warning: 2, info: 1 };
      return priority[b.alertLevel] - priority[a.alertLevel];
    });
  };

  const calculateRiskDistribution = (positions: PositionDetailsResponse[]) => {
    const total = positions.length || 1;
    const counts = {
      low: 0,
      medium: 0,
      high: 0,
    };

    positions.forEach(position => {
      const riskLevel = position.riskLevel;
      if (riskLevel === 'SAFE') counts.low++;
      else if (riskLevel === 'WARNING') counts.medium++;
      else if (riskLevel === 'CRITICAL' || riskLevel === 'LIQUIDATION') counts.high++;
    });

    return {
      low: Math.round((counts.low / total) * 100),
      medium: Math.round((counts.medium / total) * 100),
      high: Math.round((counts.high / total) * 100),
    };
  };

  const calculateObligationBreakdown = (positions: PositionDetailsResponse[]) => {
    const breakdown = {
      cash: 0,
      tomorrow: 0,
      overdue: 0,
      coveragePercent: 0,
    };

    positions.forEach(position => {
      const tenor = position.tradeTerm;
      const quantity = position.quantity || 0;
      
      if (tenor === 'T_PLUS_0') breakdown.cash += quantity;
      else if (tenor === 'T_PLUS_1') breakdown.tomorrow += quantity;
      else if (tenor === 'T_PLUS_2') breakdown.overdue += quantity;
    });

    const total = breakdown.cash + breakdown.tomorrow + breakdown.overdue || 1;
    const safePositions = positions.filter(p => p.riskLevel === 'SAFE').length;
    breakdown.coveragePercent = Math.round((safePositions / (positions.length || 1)) * 100);

    // Convert to percentages
    breakdown.cash = Math.round((breakdown.cash / total) * 100);
    breakdown.tomorrow = Math.round((breakdown.tomorrow / total) * 100);
    breakdown.overdue = Math.round((breakdown.overdue / total) * 100);

    return breakdown;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <>
      <Header title="مدیریت ریسک" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">

          {loading && (
            <div className="flex items-center justify-center py-8">
              <FiActivity className="animate-spin text-primary" size={32} />
            </div>
          )}

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            <KpiCard 
              label="هشدار بحرانی" 
              value={formatNumber(riskMetrics.criticalAlerts)} 
              unit="مورد" 
              change="فوری" 
              changePositive={false} 
            />
            <KpiCard 
              label="هشدار متوسط" 
              value={formatNumber(riskMetrics.warningAlerts)} 
              unit="مورد" 
            />
            <KpiCard 
              label="تعهدات باز" 
              value={formatNumber(riskMetrics.openObligations)} 
            />
            <KpiCard 
              label="پوشش ریسک" 
              value={`${riskMetrics.riskCoverage}٪`} 
              change="+۲٪" 
              changePositive 
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
            <div className="lg:col-span-8 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border-light dark:border-border-dark">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FiAlertCircle className="text-rose-500" size={20} />
                  هشدارهای مارجین فعال
                </h3>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-red-500 font-semibold">
                    {riskMetrics.marginAlerts.length.toLocaleString('fa-IR')} هشدار فعال
                  </span>
                </div>
              </div>

              <div className="desktop-view">
                <div className="table-container">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500">
                      <tr>
                        <th className="px-5 py-3 text-right font-medium">کاربر</th>
                        <th className="px-5 py-3 text-right font-medium">نوع</th>
                        <th className="px-5 py-3 text-right font-medium">مارجین فعلی</th>
                        <th className="px-5 py-3 text-right font-medium">مارجین مورد نیاز</th>
                        <th className="px-5 py-3 text-right font-medium">نسبت</th>
                        <th className="px-5 py-3 text-right font-medium">دارایی</th>
                        <th className="px-5 py-3 text-right font-medium">سطح</th>
                        <th className="px-5 py-3 text-right font-medium">زمان</th>
                        <th className="px-5 py-3 text-right font-medium">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light dark:divide-border-dark">
                      {riskMetrics.marginAlerts.map(alert => (
                        <tr 
                          key={alert.id} 
                          className={`transition-colors ${
                            alert.alertLevel === 'critical' 
                              ? 'bg-rose-50/50 dark:bg-rose-950/10' 
                              : 'hover:bg-slate-50 dark:hover:bg-background-dark/40'
                          }`}
                        >
                          <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                            {alert.userName}
                          </td>
                          <td className="px-5 py-4">
                            {alert.userType === 'trade' 
                              ? <Badge variant="primary">صنف</Badge> 
                              : <Badge variant="neutral">عادی</Badge>
                            }
                          </td>
                          <td className="px-5 py-4  text-slate-700 dark:text-slate-300">
                            {formatNumber(alert.currentMargin)}
                          </td>
                          <td className="px-5 py-4  text-slate-700 dark:text-slate-300">
                            {formatNumber(alert.requiredMargin)}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-slate-200 dark:bg-border-dark rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    alert.marginRatio < 35 ? 'bg-rose-500' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${Math.min(alert.marginRatio, 100)}%` }}
                                />
                              </div>
                              <span className={`text-xs font-bold ${
                                alert.marginRatio < 35 ? 'text-rose-500' : 'text-amber-500'
                              }`}>
                                {alert.marginRatio.toLocaleString('fa-IR')}٪
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-400">
                            {alert.asset}
                          </td>
                          <td className="px-5 py-4">
                            <AlertLevelBadge level={alert.alertLevel} />
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-500">
                            {formatDateTime(alert.createdAt)}
                          </td>
                          <td className="px-5 py-4">
                            <button className="text-primary hover:underline text-xs font-semibold">
                              اقدام
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mobile-view p-4 space-y-4">
                {riskMetrics.marginAlerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={`user-card ${
                      alert.alertLevel === 'critical' ? 'border-rose-300 dark:border-rose-800' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{alert.userName}</h4>
                        <p className="text-xs text-slate-500 mt-1">{formatDateTime(alert.createdAt)}</p>
                      </div>
                      <AlertLevelBadge level={alert.alertLevel} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs mb-1">مارجین فعلی</p>
                        <p className=" font-bold text-xs">{formatNumber(alert.currentMargin)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">مارجین نیاز</p>
                        <p className=" font-bold text-xs">{formatNumber(alert.requiredMargin)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">دارایی</p>
                        <p className="font-bold text-xs">{alert.asset}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">پوزیشن</p>
                        <p className=" text-xs">#{alert.positionId}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-500 text-xs mb-1">نسبت پوشش</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-border-dark rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                alert.marginRatio < 35 ? 'bg-rose-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(alert.marginRatio, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${
                            alert.marginRatio < 35 ? 'text-rose-500' : 'text-amber-500'
                          }`}>
                            {alert.marginRatio.toLocaleString('fa-IR')}٪
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-5">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiPieChart className="text-primary" size={18} />
                  توزیع سطح ریسک کاربران
                </h3>
                <div className="space-y-3">
                  <ProgressBar 
                    label="پایین" 
                    value={`${riskMetrics.riskDistribution.low}٪`} 
                    percent={riskMetrics.riskDistribution.low} 
                    color="emerald" 
                  />
                  <ProgressBar 
                    label="متوسط" 
                    value={`${riskMetrics.riskDistribution.medium}٪`} 
                    percent={riskMetrics.riskDistribution.medium} 
                    color="amber" 
                  />
                  <ProgressBar 
                    label="بالا" 
                    value={`${riskMetrics.riskDistribution.high}٪`} 
                    percent={riskMetrics.riskDistribution.high} 
                    color="rose" 
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-5">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">وضعیت پوشش تعهدات</h3>
                <div className="flex flex-col items-center">
                  <div
                    className="relative size-[120px] rounded-full flex items-center justify-center mb-5"
                    style={{ 
                      background: `conic-gradient(#10b981 0% ${riskMetrics.obligationBreakdown.coveragePercent}%, #e2e8f0 ${riskMetrics.obligationBreakdown.coveragePercent}% 100%)` 
                    }}
                  >
                    <div className="absolute inset-3 rounded-full bg-white dark:bg-surface-dark flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {riskMetrics.obligationBreakdown.coveragePercent}٪
                      </span>
                      <span className="text-[0.6rem] text-slate-500">پوشش</span>
                    </div>
                  </div>
                  <div className="w-full space-y-2 text-sm">
                    {[
                      { 
                        label: 'نقدی', 
                        value: `${riskMetrics.obligationBreakdown.cash}٪`, 
                        color: 'text-primary' 
                      },
                      { 
                        label: 'فردایی', 
                        value: `${riskMetrics.obligationBreakdown.tomorrow}٪`, 
                        color: 'text-amber-500' 
                      },
                      { 
                        label: 'معوق', 
                        value: `${riskMetrics.obligationBreakdown.overdue}٪`, 
                        color: 'text-emerald-500' 
                      },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-slate-500">{item.label}</span>
                        <span className={`font-bold ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}