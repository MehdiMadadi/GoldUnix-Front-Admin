import { useState } from 'react';
import Header from '../../components/Layout/Header';
import KpiCard from '../../components/UI/KpiCard';
import GoldDepositTab from '../../components/Deposits/GoldDepositTab';
import InternalCollateralTab from '../../components/Deposits/InternalCollateralTab';
import LoanCollateralTab from '../../components/Deposits/LoanCollateralTab';
import {
  GOLD_DEPOSIT_STATS,
  INTERNAL_COLLATERAL_STATS,
  LOAN_COLLATERAL_STATS,
} from '../../data/collateral';

type DepositSection = 'gold' | 'internal' | 'loan';

const SECTIONS: { key: DepositSection; label: string; sublabel: string; icon: string }[] = [
  { key: 'gold', label: 'سپرده طلا', sublabel: 'Gold Lock / Staking', icon: 'savings' },
  { key: 'internal', label: 'وثیقه اعتبار داخلی', sublabel: 'Margin Credit Collateral', icon: 'lock' },
  { key: 'loan', label: 'وثیقه تسهیلات', sublabel: 'Loan Provider Collateral', icon: 'corporate_fare' },
];

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

const KPI_CONFIG: Record<DepositSection, { label: string; value: string; unit: string; change?: string; changePositive?: boolean }[]> = {
  gold: [
    { label: 'مجموع طلای سپرده‌شده', value: GOLD_DEPOSIT_STATS.totalGrams.toLocaleString('fa-IR'), unit: 'گرم' },
    { label: 'سود انباشته امروز', value: fmt(GOLD_DEPOSIT_STATS.todayProfit), unit: 'ریال', change: '+۵٪', changePositive: true },
    { label: 'سپرده‌های فعال', value: GOLD_DEPOSIT_STATS.activeCount.toLocaleString('fa-IR'), unit: 'قرارداد' },
    { label: 'قابل استفاده به عنوان وثیقه', value: GOLD_DEPOSIT_STATS.collateralUsable.toLocaleString('fa-IR'), unit: 'گرم' },
  ],
  internal: [
    { label: 'کل وثیقه فعال', value: fmt(INTERNAL_COLLATERAL_STATS.totalCollateralValue), unit: 'ریال' },
    { label: 'اعتبار صادرشده', value: fmt(INTERNAL_COLLATERAL_STATS.totalCreditIssued), unit: 'ریال' },
    { label: 'LTV میانگین', value: INTERNAL_COLLATERAL_STATS.avgLtv.toLocaleString('fa-IR'), unit: '٪', change: 'متوسط', changePositive: false },
    { label: 'وثیقه در ریسک', value: INTERNAL_COLLATERAL_STATS.atRiskCount.toLocaleString('fa-IR'), unit: 'مورد', change: INTERNAL_COLLATERAL_STATS.atRiskCount > 0 ? 'نیاز به پیگیری' : 'سالم', changePositive: INTERNAL_COLLATERAL_STATS.atRiskCount === 0 },
  ],
  loan: [
    { label: 'کل وثیقه نزد پرووایدرها', value: fmt(LOAN_COLLATERAL_STATS.totalCollateralValue), unit: 'ریال' },
    { label: 'تسهیلات فعال', value: fmt(LOAN_COLLATERAL_STATS.totalActiveLoan), unit: 'ریال' },
    { label: 'میانگین LTV', value: LOAN_COLLATERAL_STATS.avgLtv.toLocaleString('fa-IR'), unit: '٪' },
    { label: 'تسهیلات در ریسک', value: LOAN_COLLATERAL_STATS.atRiskCount.toLocaleString('fa-IR'), unit: 'مورد', change: LOAN_COLLATERAL_STATS.atRiskCount > 0 ? 'نیاز به بررسی' : 'سالم', changePositive: LOAN_COLLATERAL_STATS.atRiskCount === 0 },
  ],
};

export default function DepositsPage() {
  const [activeSection, setActiveSection] = useState<DepositSection>('gold');
  const kpis = KPI_CONFIG[activeSection];

  return (
    <>
      <Header title="سپرده‌ها و وثایق" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto space-y-5">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SECTIONS.map(s => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`relative group text-right p-4 rounded-2xl border transition-all duration-200 ${
                  activeSection === s.key
                    ? 'border-primary/40 bg-primary/5 dark:bg-primary/10 shadow-sm'
                    : 'border-border-light dark:border-border-dark bg-white dark:bg-surface-dark hover:border-primary/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    activeSection === s.key ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-lg">{s.icon}</span>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm transition-colors ${activeSection === s.key ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{s.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.sublabel}</p>
                  </div>
                </div>
                {activeSection === s.key && (
                  <span className="absolute top-3 left-3 w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {kpis.map(kpi => (
              <KpiCard
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                unit={kpi.unit}
                change={kpi.change}
                changePositive={kpi.changePositive}
              />
            ))}
          </section>

          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-border-light dark:border-border-dark">
              <div>
                <h3 className="font-bold text-lg">{SECTIONS.find(s => s.key === activeSection)?.label}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{SECTIONS.find(s => s.key === activeSection)?.sublabel}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="icon-btn bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700" title="خروجی">
                  <span className="material-symbols-outlined">download</span>
                </button>
                <button className="icon-btn bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700" title="بارگذاری مجدد">
                  <span className="material-symbols-outlined">refresh</span>
                </button>
                {activeSection === 'gold' && (
                  <button className="icon-btn bg-primary/10 text-primary hover:bg-primary/20" title="سپرده جدید">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                )}
              </div>
            </div>

            {activeSection === 'gold' && <GoldDepositTab />}
            {activeSection === 'internal' && <InternalCollateralTab />}
            {activeSection === 'loan' && <LoanCollateralTab />}
          </section>
        </div>
      </div>
    </>
  );
}
