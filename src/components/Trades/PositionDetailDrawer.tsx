import { useState } from 'react';
import { FiTrendingUp, FiX, FiPlusCircle, FiMinusCircle, FiRefreshCw, FiXCircle, FiCheckCircle } from 'react-icons/fi';
import type { Position } from '../../data/positions';
import Badge from '../UI/Badge';
import ConfirmDialog from './ConfirmDialog';
import MarginAdjustDrawer from './MarginAdjustDrawer';

interface PositionDetailDrawerProps {
  open: boolean;
  position: Position | null;
  onClose: () => void;
}

type MarginMode = 'increase' | 'decrease';
type ConfirmAction = 'close_position' | 'convert_physical' | null;

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-border-light dark:border-border-dark last:border-0 gap-4">
      <span className="text-sm text-slate-500 shrink-0">{label}</span>
      <div className="text-sm font-medium text-slate-900 dark:text-white text-left">{children}</div>
    </div>
  );
}

function getRatioColor(ratio: number) {
  if (ratio >= 130) return 'text-emerald-600 dark:text-emerald-400';
  if (ratio >= 110) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
}

const CONFIRM_CONFIGS: Record<NonNullable<ConfirmAction>, { title: string; description: string; confirmLabel: string; variant: 'danger' | 'warning' | 'info' }> = {
  close_position: {
    title: 'بستن موقعیت',
    description: 'آیا مطمئن هستید که می‌خواهید این موقعیت را ببندید؟ سود یا زیان تحقق‌نیافته نهایی خواهد شد.',
    confirmLabel: 'بستن موقعیت',
    variant: 'danger',
  },
  convert_physical: {
    title: 'تبدیل به تحویل فیزیکی',
    description: 'آیا مطمئن هستید که می‌خواهید این موقعیت را به تحویل فیزیکی تبدیل کنید؟',
    confirmLabel: 'تأیید تبدیل',
    variant: 'warning',
  },
};

export default function PositionDetailDrawer({ open, position: pos, onClose }: PositionDetailDrawerProps) {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [marginMode, setMarginMode] = useState<MarginMode | null>(null);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const handleConfirm = () => {
    setActionDone(confirmAction === 'close_position' ? 'موقعیت با موفقیت بسته شد.' : 'موقعیت به تحویل فیزیکی تبدیل شد.');
    setConfirmAction(null);
  };

  const handleMarginConfirm = (_id: string, _amount: number, mode: MarginMode) => {
    setActionDone(`مارجین با موفقیت ${mode === 'increase' ? 'افزایش' : 'کاهش'} یافت.`);
  };

  const positionValue = pos ? pos.quantityOpen * pos.currentMarketPrice : 0;

  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={onClose} style={{ zIndex: 55 }} />
      <div
        className="fixed top-0 left-0 bottom-0 flex flex-col bg-white dark:bg-surface-dark border-r border-border-light dark:border-border-dark transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          width: 'min(500px, 100vw)',
          zIndex: 60,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark shrink-0">
          <div className="flex items-center gap-2">
            <FiTrendingUp size={20} className="text-primary" />
            <h3 className="font-bold">جزئیات موقعیت</h3>
            {pos && <span className="text-xs text-slate-400 ">#{pos.id}</span>}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {pos && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-5">
              {actionDone && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <FiCheckCircle size={14} className="text-emerald-600" />
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">{actionDone}</p>
                </div>
              )}

              <div className={`p-4 rounded-2xl border-2 ${
                pos.riskLevel === 'red' ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/20' :
                pos.riskLevel === 'yellow' ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20' :
                'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/10'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-white">{pos.asset}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{pos.userName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {pos.side === 'buy' ? <Badge variant="success">خرید</Badge> : <Badge variant="danger">فروش</Badge>}
                    {pos.riskLevel === 'red' ? <Badge variant="danger">بحرانی</Badge> :
                     pos.riskLevel === 'yellow' ? <Badge variant="warning">هشدار</Badge> :
                     <Badge variant="success">ایمن</Badge>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-slate-500">مقدار باز</p>
                    <p className="font-bold text-sm mt-0.5">{pos.quantityOpen} {pos.unit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">انقضا</p>
                    <p className="font-bold text-sm mt-0.5">{pos.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">نسبت مارجین</p>
                    <p className={`font-bold text-sm mt-0.5 ${getRatioColor(pos.marginRatio)}`}>{pos?.marginRatio?.toLocaleString('fa-IR')}٪</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-2xl p-4 ${pos.unrealizedPnl >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-rose-50 dark:bg-rose-950/20'}`}>
                  <p className="text-xs text-slate-500 mb-1">سود/زیان باز</p>
                  <p className={`font-extrabold text-lg ${pos.unrealizedPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {pos.unrealizedPnl >= 0 ? '+' : ''}{fmt(pos.unrealizedPnl)}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">ریال</p>
                </div>
                <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
                  <p className="text-xs text-slate-500 mb-1">ارزش موقعیت</p>
                  <p className="font-extrabold text-lg text-slate-900 dark:text-white">{fmt(positionValue)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">ریال</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
                <h4 className="font-bold text-sm mb-3">اطلاعات قیمت</h4>
                <Row label="قیمت ورود (میانگین)"><span className="">{fmt(pos.avgEntryPrice)} ریال</span></Row>
                <Row label="قیمت بازار فعلی"><span className="">{fmt(pos.currentMarketPrice)} ریال</span></Row>
                <Row label="قیمت تسویه اجباری">
                  <span className=" text-rose-600 dark:text-rose-400">{fmt(pos.liquidationPrice)} ریال</span>
                </Row>
              </div>

              <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
                <h4 className="font-bold text-sm mb-3">اطلاعات مارجین</h4>
                <Row label="مارجین گذاشته شده"><span className="">{fmt(pos.marginPosted)} ریال</span></Row>
                <Row label="نسبت مارجین">
                  <span className={` font-bold ${getRatioColor(pos.marginRatio)}`}>{pos?.marginRatio?.toLocaleString('fa-IR')}٪</span>
                </Row>

                <div className="mt-3">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pos.marginRatio >= 130 ? 'bg-emerald-500' :
                        pos.marginRatio >= 110 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(pos.marginRatio, 200) / 2}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>۰٪</span>
                    <span>هشدار ۱۱۰٪</span>
                    <span>ایمن ۱۳۰٪</span>
                    <span>۲۰۰٪</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
                <h4 className="font-bold text-sm mb-3">اطلاعات کاربر</h4>
                <Row label="نام">{pos.userName}</Row>
                <Row label="نوع">
                  {pos.userType === 'trade' ? <Badge variant="info">صنف</Badge> : <Badge variant="neutral">عادی</Badge>}
                </Row>
              </div>
            </div>
          </div>
        )}

        {pos && (
          <div className="shrink-0 border-t border-border-light dark:border-border-dark p-5 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">عملیات مدیریتی</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMarginMode('increase')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100 transition-colors border border-emerald-200 dark:border-emerald-800"
              >
                <FiPlusCircle size={14} />
                افزایش مارجین
              </button>
              <button
                onClick={() => setMarginMode('decrease')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-sm font-semibold hover:bg-amber-100 transition-colors border border-amber-200 dark:border-amber-800"
              >
                <FiMinusCircle size={14} />
                کاهش مارجین
              </button>
              <button
                onClick={() => setConfirmAction('convert_physical')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 transition-colors border border-blue-200 dark:border-blue-800"
              >
                <FiRefreshCw size={14} />
                تبدیل به فیزیکی
              </button>
              <button
                onClick={() => setConfirmAction('close_position')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm font-semibold hover:bg-rose-100 transition-colors border border-rose-200 dark:border-rose-800"
              >
                <FiXCircle size={14} />
                بستن موقعیت
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmAction && (
        <ConfirmDialog
          open
          title={CONFIRM_CONFIGS[confirmAction].title}
          description={CONFIRM_CONFIGS[confirmAction].description}
          confirmLabel={CONFIRM_CONFIGS[confirmAction].confirmLabel}
          variant={CONFIRM_CONFIGS[confirmAction].variant}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <MarginAdjustDrawer
        open={marginMode !== null}
        position={pos}
        mode={marginMode ?? 'increase'}
        onClose={() => setMarginMode(null)}
        onConfirm={handleMarginConfirm}
      />
    </>
  );
}