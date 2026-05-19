import { useState } from 'react';
import { FiPlusCircle, FiMinusCircle, FiX, FiEye, FiArrowDown, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';
import type { Position } from '../../data/positions';

type Mode = 'increase' | 'decrease';

interface MarginAdjustDrawerProps {
  open: boolean;
  position: Position | null;
  mode: Mode;
  onClose: () => void;
  onConfirm: (positionId: string, amount: number, mode: Mode) => void;
}

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 2 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

function computeNewMarginRatio(pos: Position, amount: number, mode: Mode): number {
  const positionValue = pos.quantityOpen * pos.currentMarketPrice;
  const newMargin = mode === 'increase'
    ? pos.marginPosted + amount
    : Math.max(0, pos.marginPosted - amount);
  return positionValue > 0 ? Math.round((newMargin / positionValue) * 100) : 0;
}

function getRatioColor(ratio: number) {
  if (ratio >= 130) return 'text-emerald-600 dark:text-emerald-400';
  if (ratio >= 110) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
}

const QUICK_AMOUNTS = [10_000_000, 50_000_000, 100_000_000, 500_000_000];

export default function MarginAdjustDrawer({ open, position: pos, mode, onClose, onConfirm }: MarginAdjustDrawerProps) {
  const [rawAmount, setRawAmount] = useState('');

  const amount = parseInt(rawAmount.replace(/,/g, ''), 10) || 0;
  const previewRatio = pos ? computeNewMarginRatio(pos, amount, mode) : 0;

  const handleClose = () => {
    setRawAmount('');
    onClose();
  };

  const handleConfirm = () => {
    if (!pos || amount <= 0) return;
    onConfirm(pos.id, amount, mode);
    setRawAmount('');
    onClose();
  };

  const isValid = amount > 0 && pos != null && (mode === 'increase' || amount < (pos.marginPosted));

  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={handleClose} style={{ zIndex: 65 }} />
      <div
        className="fixed top-0 right-0 bottom-0 flex flex-col bg-white dark:bg-surface-dark border-l border-border-light dark:border-border-dark transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          width: 'min(420px, 100vw)',
          zIndex: 70,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark shrink-0">
          <div className="flex items-center gap-2">
            {mode === 'increase' ? (
              <FiPlusCircle size={20} className="text-emerald-500" />
            ) : (
              <FiMinusCircle size={20} className="text-amber-500" />
            )}
            <h3 className="font-bold">{mode === 'increase' ? 'افزایش مارجین' : 'کاهش مارجین'}</h3>
          </div>
          <button onClick={handleClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {pos && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4 space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">{pos.userName}</p>
              <p className="text-sm text-slate-500">{pos.asset} — {pos.side === 'buy' ? 'خرید' : 'فروش'} {pos.quantityOpen} {pos.unit}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
                <p className="text-xs text-slate-500 mb-1">مارجین فعلی</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{fmt(pos.marginPosted)}</p>
              </div>
              <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
                <p className="text-xs text-slate-500 mb-1">ارزش موقعیت</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{fmt(pos.quantityOpen * pos.currentMarketPrice)}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 block">
                مبلغ {mode === 'increase' ? 'افزایش' : 'کاهش'} (ریال)
              </label>
              <input
                type="number"
                placeholder="مبلغ را وارد کنید"
                value={rawAmount}
                onChange={e => setRawAmount(e.target.value)}
                className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100 placeholder:text-slate-400  text-lg"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {QUICK_AMOUNTS.map(a => (
                  <button
                    key={a}
                    onClick={() => setRawAmount(String(a))}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                  >
                    {fmt(a)}
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border-2 p-4 transition-all ${amount > 0 ? 'border-primary/30 bg-primary/5' : 'border-border-light dark:border-border-dark bg-slate-50 dark:bg-background-dark/40'}`}>
              <div className="flex items-center gap-2 mb-4">
                <FiEye size={16} className="text-primary" />
                <h4 className="font-semibold text-sm">پیش‌نمایش تغییر</h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">نسبت مارجین قبل</span>
                  <span className={`font-bold  ${getRatioColor(pos.marginRatio)}`}>
                    {pos?.marginRatio?.toLocaleString('fa-IR')}٪
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-0.5 bg-border-light dark:bg-border-dark" />
                  <FiArrowDown size={14} className="text-slate-400" />
                  <div className="flex-1 h-0.5 bg-border-light dark:bg-border-dark" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">نسبت مارجین بعد</span>
                  <span className={`font-bold  text-lg ${amount > 0 ? getRatioColor(previewRatio) : 'text-slate-400'}`}>
                    {amount > 0 ? `${previewRatio.toLocaleString('fa-IR')}٪` : '—'}
                  </span>
                </div>

                {amount > 0 && (
                  <>
                    <div className="h-px bg-border-light dark:bg-border-dark" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">مارجین {mode === 'increase' ? 'جدید' : 'باقیمانده'}</span>
                      <span className="font-bold text-slate-900 dark:text-white ">
                        {fmt(mode === 'increase' ? pos.marginPosted + amount : Math.max(0, pos.marginPosted - amount))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">تغییر نسبت</span>
                      <span className={`font-bold  ${mode === 'increase' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {mode === 'increase' ? '+' : '-'}{Math.abs(previewRatio - pos.marginRatio).toLocaleString('fa-IR')} واحد
                      </span>
                    </div>

                    {previewRatio < 110 && (
                      <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800 mt-2">
                        <FiAlertTriangle size={14} className="text-rose-600 mt-0.5" />
                        <p className="text-xs text-rose-700 dark:text-rose-300">نسبت مارجین پس از این تغییر به زیر ۱۱۰٪ می‌رسد و پوزیشن در وضعیت بحرانی قرار می‌گیرد.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {mode === 'decrease' && amount >= pos.marginPosted && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800">
                <FiAlertCircle size={14} className="text-rose-600 mt-0.5" />
                <p className="text-xs text-rose-700 dark:text-rose-300">مبلغ کاهش نمی‌تواند بیشتر از مارجین فعلی باشد.</p>
              </div>
            )}
          </div>
        )}

        <div className="shrink-0 flex items-center gap-3 p-5 border-t border-border-light dark:border-border-dark">
          <button onClick={handleClose} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            انصراف
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
              isValid
                ? mode === 'increase'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            تأیید {mode === 'increase' ? 'افزایش' : 'کاهش'} مارجین
          </button>
        </div>
      </div>
    </>
  );
}