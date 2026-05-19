import { useState } from 'react';
import Header from '../../components/Layout/Header';
import KpiCard from '../../components/UI/KpiCard';
import GeneralLedgerTab from '../../components/Accounting/GeneralLedgerTab';
import UserWalletsTab from '../../components/Accounting/UserWalletsTab';
import MarginTab from '../../components/Accounting/MarginTab';
import CreditTab from '../../components/Accounting/CreditTab';
import RevenueTab from '../../components/Accounting/RevenueTab';
import SettlementsTab from '../../components/Accounting/SettlementsTab';
import { ACCOUNTING_KPI, SETTLEMENTS } from '../../data/accounting';

type AccTab = 'ledger' | 'wallets' | 'margin' | 'credit' | 'revenue' | 'settlements';

const TABS: { key: AccTab; label: string; icon: string }[] = [
  { key: 'ledger', label: 'دفتر کل', icon: 'menu_book' },
  { key: 'wallets', label: 'کیف پول کاربران', icon: 'account_balance_wallet' },
  { key: 'margin', label: 'مارجین', icon: 'account_balance' },
  { key: 'credit', label: 'اعتبار', icon: 'credit_score' },
  { key: 'revenue', label: 'درآمد', icon: 'monetization_on' },
  { key: 'settlements', label: 'تسویه‌ها', icon: 'swap_horiz' },
];

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

const pendingSettlements = SETTLEMENTS.filter(s => s.status === 'pending').length;
const failedSettlements = SETTLEMENTS.filter(s => s.status === 'failed').length;

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<AccTab>('ledger');

  return (
    <>
      <Header title="حسابداری" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto space-y-5">

          {ACCOUNTING_KPI.activeDiscrepancy > 0 && (
            <div className="flex items-start gap-3 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-2xl">
              <span className="material-symbols-outlined text-rose-600 dark:text-rose-400 mt-0.5 shrink-0">warning</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
                  مغایرت فعال: {fmt(ACCOUNTING_KPI.activeDiscrepancy)} ریال
                </p>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                  مغایرت بین جمع کیف پول‌های کاربران و حساب بانکی نیاز به بررسی دارد.
                </p>
              </div>
              <button className="shrink-0 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 transition-colors whitespace-nowrap">
                بررسی مغایرت
              </button>
            </div>
          )}

          {(pendingSettlements > 0 || failedSettlements > 0) && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 mt-0.5 shrink-0">pending_actions</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                  {pendingSettlements > 0 && `${pendingSettlements.toLocaleString('fa-IR')} تسویه در انتظار تأیید`}
                  {pendingSettlements > 0 && failedSettlements > 0 && ' — '}
                  {failedSettlements > 0 && <span className="text-rose-600 dark:text-rose-400">{failedSettlements.toLocaleString('fa-IR')} تسویه ناموفق</span>}
                </p>
              </div>
              <button onClick={() => setActiveTab('settlements')} className="shrink-0 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors whitespace-nowrap">
                مشاهده تسویه‌ها
              </button>
            </div>
          )}

          <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            <KpiCard label="مانده کل ریالی کاربران" value={fmt(ACCOUNTING_KPI.totalUserWalletBalance)} unit="ریال" />
            <KpiCard label="مجموع مارجین قفل‌شده" value={fmt(ACCOUNTING_KPI.totalLockedMargin)} unit="ریال" change="ریسک متوسط" changePositive={false} />
            <KpiCard label="اعتبار استفاده‌شده" value={fmt(ACCOUNTING_KPI.totalCreditUsed)} unit="ریال" />
            <KpiCard label="درآمد امروز" value={fmt(ACCOUNTING_KPI.revenueToday)} unit="ریال" change="+۵٪" changePositive />
            <KpiCard
              label="مغایرت فعال"
              value={fmt(ACCOUNTING_KPI.activeDiscrepancy)}
              unit="ریال"
              change={ACCOUNTING_KPI.activeDiscrepancy > 0 ? 'نیاز به بررسی' : 'تراز'}
              changePositive={ACCOUNTING_KPI.activeDiscrepancy === 0}
            />
          </section>

          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl overflow-hidden">
            <div className="flex flex-col gap-3 p-4 md:p-5 border-b border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">سیستم حسابداری</h3>
                  <p className="text-xs text-slate-500 mt-0.5">دفتر کل دوبل‌انتری</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="icon-btn bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700" title="Reconcile">
                    <span className="material-symbols-outlined">sync</span>
                  </button>
                  <button className="icon-btn bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700" title="خروجی">
                    <span className="material-symbols-outlined">download</span>
                  </button>
                  <button className="icon-btn bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700" title="بارگذاری مجدد">
                    <span className="material-symbols-outlined">refresh</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                    <span className="hidden md:inline">{tab.label}</span>
                    {tab.key === 'settlements' && (pendingSettlements + failedSettlements > 0) && (
                      <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'}`}>
                        {(pendingSettlements + failedSettlements).toLocaleString('fa-IR')}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'ledger' && <GeneralLedgerTab />}
            {activeTab === 'wallets' && <UserWalletsTab />}
            {activeTab === 'margin' && <MarginTab />}
            {activeTab === 'credit' && <CreditTab />}
            {activeTab === 'revenue' && <RevenueTab />}
            {activeTab === 'settlements' && <SettlementsTab />}
          </section>
        </div>
      </div>
    </>
  );
}
