import { useState } from 'react';
import type { GoldDeposit } from '../../data/collateral';
import { PLAN_LABELS, PLAN_RATES } from '../../data/collateral';
import Badge from '../UI/Badge';
import ConfirmDialog from '../Trades/ConfirmDialog';

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

function StatusBadge({ status }: { status: GoldDeposit['status'] }) {
  if (status === 'active') return <Badge variant="success">فعال</Badge>;
  if (status === 'matured') return <Badge variant="info">سررسید</Badge>;
  if (status === 'early_unlock') return <Badge variant="warning">آزادسازی زودهنگام</Badge>;
  return <Badge variant="neutral">وثیقه شده</Badge>;
}

function ProgressRing({ days, total }: { days: number; total: number }) {
  const pct = Math.max(0, Math.min(100, ((total - days) / total) * 100));
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="64" height="64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="5" />
        <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" className="text-primary" strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <span className="text-[0.6rem] font-bold text-slate-700 dark:text-slate-200 relative z-10">{days.toLocaleString('fa-IR')}r</span>
    </div>
  );
}

interface GoldDepositDrawerProps {
  deposit: GoldDeposit | null;
  onClose: () => void;
  isMobile?: boolean;
}

export default function GoldDepositDrawer({ deposit, onClose, isMobile = false }: GoldDepositDrawerProps) {
  const [confirm, setConfirm] = useState<'collateral' | 'unlock' | null>(null);

  if (!deposit) return null;

  const currentValue = deposit.quantityGrams * deposit.currentPricePerGram;
  const profitValue = deposit.accruedProfitGrams * deposit.currentPricePerGram;
  const pnl = currentValue - (deposit.quantityGrams * deposit.entryPricePerGram);
  const planDays = deposit.plan === '30d' ? 30 : deposit.plan === '90d' ? 90 : deposit.plan === '180d' ? 180 : 365;

  const content = (
    <div className="p-5 space-y-5 overflow-y-auto flex-1">
      <div className="flex items-center justify-between">
        <StatusBadge status={deposit.status} />
        <span className=" text-xs text-primary">{deposit.contractNumber}</span>
      </div>

      <div className="flex items-center gap-4">
        <ProgressRing days={deposit.remainingDays} total={planDays} />
        <div>
          <p className="text-xs text-slate-400 mb-0.5">پلن</p>
          <p className="font-bold">{PLAN_LABELS[deposit.plan]}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
            نرخ سالانه: {PLAN_RATES[deposit.plan].toLocaleString('fa-IR')}٪
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">مقدار طلا</p>
          <p className="font-bold ">{deposit.quantityGrams.toLocaleString('fa-IR')} گرم</p>
          <p className="text-xs text-slate-400 mt-0.5">{deposit.assetType}</p>
        </div>
        <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">روزهای باقیمانده</p>
          <p className="font-bold  text-primary">{deposit.remainingDays.toLocaleString('fa-IR')}</p>
          <p className="text-xs text-slate-400 mt-0.5">تا {deposit.endDate}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">قیمت ورود (هر گرم)</p>
          <p className="font-bold  text-sm">{fmt(deposit.entryPricePerGram)}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-3">
          <p className="text-xs text-slate-400 mb-0.5">ارزش فعلی (هر گرم)</p>
          <p className="font-bold  text-sm text-emerald-700 dark:text-emerald-300">{fmt(deposit.currentPricePerGram)}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-background-dark/80 dark:to-background-dark/40 rounded-2xl p-4 space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">ارزش روز کل</span>
          <span className=" font-bold text-slate-900 dark:text-white">{fmt(currentValue)} ریال</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">سود/زیان از ورود</span>
          <span className={` font-bold ${pnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {pnl >= 0 ? '+' : ''}{fmt(pnl)} ریال
          </span>
        </div>
        <div className="flex justify-between text-sm border-t border-border-light dark:border-border-dark pt-2.5 mt-1">
          <span className="text-slate-500">سود تا امروز</span>
          <div className="text-left">
            <span className=" font-bold text-emerald-600 dark:text-emerald-400">
              +{deposit.accruedProfitGrams.toLocaleString('fa-IR', { maximumFractionDigits: 2 })} گرم
            </span>
            <span className="text-xs text-slate-400 block">(≈ {fmt(profitValue)} ریال)</span>
          </div>
        </div>
      </div>

      {deposit.usableAsCollateral && (
        <div className="flex items-start gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5">verified</span>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">این سپرده قابل استفاده به عنوان وثیقه است.</p>
        </div>
      )}

      <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">شروع</span>
          <span className="font-medium">{deposit.startDate}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">سررسید</span>
          <span className="font-medium">{deposit.endDate}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {deposit.usableAsCollateral && deposit.status !== 'used_as_collateral' && (
          <button
            onClick={() => setConfirm('collateral')}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">lock</span>
            تبدیل به وثیقه
          </button>
        )}
        {deposit.status === 'active' && (
          <button
            onClick={() => setConfirm('unlock')}
            className="w-full py-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">lock_open</span>
            آزادسازی زودهنگام
          </button>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div className="overflow-y-auto flex-1">{content}</div>
        <ConfirmDialog
          open={confirm === 'collateral'}
          title="تبدیل به وثیقه"
          description="آیا می‌خواهید این سپرده را به عنوان وثیقه اعتبار فعال کنید؟"
          confirmLabel="تبدیل به وثیقه"
          variant="info"
          onConfirm={() => setConfirm(null)}
          onCancel={() => setConfirm(null)}
        />
        <ConfirmDialog
          open={confirm === 'unlock'}
          title="آزادسازی زودهنگام"
          description="آزادسازی زودهنگام ممکن است مشمول جریمه شود. آیا ادامه می‌دهید؟"
          confirmLabel="آزادسازی"
          variant="warning"
          onConfirm={() => setConfirm(null)}
          onCancel={() => setConfirm(null)}
        />
      </>
    );
  }

  return (
    <>
      {content}
      <ConfirmDialog
        open={confirm === 'collateral'}
        title="تبدیل به وثیقه"
        description="آیا می‌خواهید این سپرده را به عنوان وثیقه اعتبار فعال کنید؟"
        confirmLabel="تبدیل به وثیقه"
        variant="info"
        onConfirm={() => setConfirm(null)}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmDialog
        open={confirm === 'unlock'}
        title="آزادسازی زودهنگام"
        description="آزادسازی زودهنگام ممکن است مشمول جریمه شود. آیا ادامه می‌دهید؟"
        confirmLabel="آزادسازی"
        variant="warning"
        onConfirm={() => setConfirm(null)}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}
