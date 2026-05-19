import { useState } from 'react';
import { FiRefreshCw, FiX, FiTrendingUp, FiTrendingDown, FiPackage, FiXCircle } from 'react-icons/fi';
import type { Trade } from '../../data/trades';
import { TRADE_TYPE_LABELS } from '../../data/trades';
import Badge from '../UI/Badge';
import ConfirmDialog from './ConfirmDialog';
import { TradeDto } from '../../lib/client';

interface TradeDetailDrawerProps {
  open: boolean;
  trade: TradeDto | null;
  onClose: () => void;
}

type ConfirmAction = 'mark_delivered' | 'cancel_delivery' | null;

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

const CONFIRM_CONFIGS: Record<NonNullable<ConfirmAction>, { title: string; description: string; confirmLabel: string; variant: 'danger' | 'warning' | 'info' }> = {
  mark_delivered: {
    title: 'تأیید تحویل فیزیکی',
    description: 'آیا تحویل فیزیکی این معامله انجام شده است؟ این عملیات وضعیت تحویل را به "تحویل شد" تغییر می‌دهد.',
    confirmLabel: 'تأیید تحویل',
    variant: 'info',
  },
  cancel_delivery: {
    title: 'لغو تحویل',
    description: 'آیا مطمئن هستید که می‌خواهید تحویل این معامله را لغو کنید؟',
    confirmLabel: 'لغو تحویل',
    variant: 'danger',
  },
};

export default function TradeDetailDrawer({ open, trade, onClose }: TradeDetailDrawerProps) {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [deliveryOverride, setDeliveryOverride] = useState<string | null>(null);

  const effectiveDeliveryStatus = deliveryOverride ?? (trade?.deliveryStatus ?? 'pending');

  const handleConfirm = () => {
    if (confirmAction === 'mark_delivered') setDeliveryOverride('delivered');
    if (confirmAction === 'cancel_delivery') setDeliveryOverride('cancelled');
    setConfirmAction(null);
  };

  return (
    <>
      <div className={`overlay ${open ? 'show' : ''}`} onClick={onClose} style={{ zIndex: 55 }} />
      <div
        className="fixed top-0 left-0 bottom-0 flex flex-col bg-white dark:bg-surface-dark border-r border-border-light dark:border-border-dark transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          width: 'min(480px, 100vw)',
          zIndex: 60,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark shrink-0">
          <div className="flex items-center gap-2">
            <FiRefreshCw size={20} className="text-primary" />
            <h3 className="font-bold">جزئیات معامله</h3>
            {trade && <span className="text-xs text-slate-400 ">#{trade.id}</span>}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {trade && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-5">
              <div className={`flex items-center gap-4 p-4 rounded-2xl ${
                trade?.order?.side === 'BUY' ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-rose-50 dark:bg-rose-950/20'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  trade?.order?.side === 'BUY' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}>
                  {trade?.order?.side === 'BUY' ? (
                    <FiTrendingUp size={24} className="text-white" />
                  ) : (
                    <FiTrendingDown size={24} className="text-white" />
                  )}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white">{trade?.order?.asset}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {trade?.order?.side === 'BUY' ? <Badge variant="success">خرید</Badge> : <Badge variant="danger">فروش</Badge>}
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full font-medium text-slate-600 dark:text-slate-300">
                      {trade.product}
                    </span>
                    {trade?.order?.status === 'settled' && <Badge variant="success">تسویه</Badge>}
                    {trade?.order?.status === 'open' && <Badge variant="primary">باز</Badge>}
                    {trade?.order?.status === 'pending' && <Badge variant="warning">در انتظار</Badge>}
                    {trade?.order?.status === 'cancelled' && <Badge variant="neutral">لغو</Badge>}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
                <h4 className="font-bold text-sm mb-3">اطلاعات کاربر</h4>
                <Row label="نام">{trade?.user?.firstName} {trade?.user?.lastName}</Row>
                <Row label="نوع">
                  {trade?.order?.orderType}
                </Row>
              </div>

              <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
                <h4 className="font-bold text-sm mb-3">جزئیات مالی</h4>
                <Row label="مقدار"><span className="">{trade?.quantity?.toLocaleString('fa-IR')} {trade.order?.unitPrice}</span></Row>
                <Row label="قیمت ورود"><span className="">{trade.executionPrice?.toLocaleString("fa-IR")} ریال</span></Row>
                <Row label="قیمت بازار"><span className="">{trade.marketPrice?.toLocaleString("fa-IR")} ریال</span></Row>
                <Row label="ارزش کل"><span className=" font-bold">{(trade.executionPrice * trade.quantity).toLocaleString("fa-IR")} ریال</span></Row>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-3 text-center">
                  <p className="text-xs text-slate-500 mb-1">اسپرد</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{trade.spread}</p>
                </div>
                <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-3 text-center">
                  <p className="text-xs text-slate-500 mb-1">کارمزد</p>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">{trade.feeAmount}</p>
                </div>
                {/* <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-3 text-center">
                  <p className="text-xs text-slate-500 mb-1">درآمد خالص</p>
                  <p className="font-bold text-blue-600 dark:text-blue-400 text-sm">{fmt(trade.netRevenue)}</p>
                </div> */}
              </div>

              <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
                <h4 className="font-bold text-sm mb-3">تسویه و تحویل</h4>
                <Row label="تاریخ تسویه">{new Date(trade?.executedAt/1).toLocaleDateString("fa-IR")}</Row>
                <Row label="نوع درخواست">
                  {trade.product}
                </Row>
                {/* <Row label="وضعیت تحویل">
                  {effectiveDeliveryStatus === 'delivered' && <Badge variant="success">تحویل شد</Badge>}
                  {effectiveDeliveryStatus === 'pending' && <Badge variant="warning">در انتظار</Badge>}
                  {effectiveDeliveryStatus === 'cancelled' && <Badge variant="danger">لغو شده</Badge>}
                </Row> */}
              </div>
            </div>
          </div>
        )}

        {trade && trade.deliveryType === 'physical' && (
          <div className="shrink-0 border-t border-border-light dark:border-border-dark p-5 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">عملیات تحویل</p>
            <div className="grid grid-cols-2 gap-2">
              {effectiveDeliveryStatus !== 'delivered' && (
                <button
                  onClick={() => setConfirmAction('mark_delivered')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100 transition-colors border border-emerald-200 dark:border-emerald-800"
                >
                  <FiPackage size={14} />
                  تأیید تحویل
                </button>
              )}
              {effectiveDeliveryStatus === 'pending' && (
                <button
                  onClick={() => setConfirmAction('cancel_delivery')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm font-semibold hover:bg-rose-100 transition-colors border border-rose-200 dark:border-rose-800"
                >
                  <FiXCircle size={14} />
                  لغو تحویل
                </button>
              )}
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
    </>
  );
}