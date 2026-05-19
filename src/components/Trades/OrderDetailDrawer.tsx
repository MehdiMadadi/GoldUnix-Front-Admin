import { useState } from 'react';
import { FiFileText, FiX, FiTrendingUp, FiTrendingDown, FiXCircle, FiPlay, FiUserX, FiCheckCircle } from 'react-icons/fi';
import type { Order } from '../../data/orders';
import Badge from '../UI/Badge';
import ConfirmDialog from './ConfirmDialog';

interface OrderDetailDrawerProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
}

type ConfirmAction = 'cancel' | 'force_execute' | 'suspend_user' | null;

function fmt(n: number) {
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
  cancel: {
    title: 'لغو سفارش',
    description: 'آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟ این عملیات قابل بازگشت نیست.',
    confirmLabel: 'لغو سفارش',
    variant: 'danger',
  },
  force_execute: {
    title: 'اجرای اجباری سفارش',
    description: 'آیا مطمئن هستید که می‌خواهید این سفارش را به صورت اجباری اجرا کنید؟',
    confirmLabel: 'اجرای اجباری',
    variant: 'warning',
  },
  suspend_user: {
    title: 'تعلیق کاربر',
    description: 'آیا مطمئن هستید که می‌خواهید کاربر را تعلیق کنید؟ تمام سفارشات فعال کاربر لغو خواهد شد.',
    confirmLabel: 'تعلیق کاربر',
    variant: 'danger',
  },
};

function FillBar({ filled, total }: { filled: number; total: number }) {
  const pct = total > 0 ? (filled / total) * 100 : 0;
  return (
    <div className="mt-1">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>پر شده: {fmt(filled)}</span>
        <span>{Math.round(pct).toLocaleString('fa-IR')}٪</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-slate-400 mt-1">باقیمانده: {fmt(total - filled)}</div>
    </div>
  );
}

export default function OrderDetailDrawer({ open, order, onClose }: OrderDetailDrawerProps) {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [actionDone, setActionDone] = useState<ConfirmAction>(null);

  const handleConfirm = () => {
    setActionDone(confirmAction);
    setConfirmAction(null);
  };

  const isCancellable = order && order.status !== 'cancelled';

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
            <FiFileText size={20} className="text-primary" />
            <h3 className="font-bold">جزئیات سفارش</h3>
            {order && <span className="text-xs text-slate-400 ">#{order.id}</span>}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
            <FiX size={20} />
          </button>
        </div>

        {order && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-5">
              {actionDone && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <FiCheckCircle size={14} className="text-emerald-600" />
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    {actionDone === 'cancel' ? 'سفارش با موفقیت لغو شد.' : actionDone === 'force_execute' ? 'سفارش با موفقیت اجرا شد.' : 'کاربر با موفقیت تعلیق شد.'}
                  </p>
                </div>
              )}

              <div className={`flex items-center gap-4 p-4 rounded-2xl ${
                order.side === 'buy' ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-rose-50 dark:bg-rose-950/20'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  order.side === 'buy' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}>
                  {order.side === 'buy' ? (
                    <FiTrendingUp size={24} className="text-white" />
                  ) : (
                    <FiTrendingDown size={24} className="text-white" />
                  )}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white">{order.asset}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {order.side === 'buy'
                      ? <Badge variant="success">خرید</Badge>
                      : <Badge variant="danger">فروش</Badge>}
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full font-medium text-slate-600 dark:text-slate-300">
                      {order.orderType === 'market' ? 'بازار' : 'محدود'}
                    </span>
                    {order.status === 'open' && <Badge variant="primary">باز</Badge>}
                    {order.status === 'partially_filled' && <Badge variant="warning">جزئی</Badge>}
                    {order.status === 'cancelled' && <Badge variant="neutral">لغو</Badge>}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
                <h4 className="font-bold text-sm mb-3">اطلاعات کاربر</h4>
                <Row label="نام">{order.userName}</Row>
                <Row label="نوع">
                  {order.userType === 'trade' ? <Badge variant="info">صنف</Badge> : <Badge variant="neutral">عادی</Badge>}
                </Row>
                <Row label="شناسه کاربر"><span className=" text-slate-500">{order.userId}</span></Row>
              </div>

              <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
                <h4 className="font-bold text-sm mb-3">جزئیات سفارش</h4>
                <Row label="مقدار کل"><span className="">{fmt(order.quantity)} {order.unit}</span></Row>
                <Row label="قیمت محدود"><span className="">{fmt(order.price)} ریال</span></Row>
                <Row label="ارزش کل"><span className=" font-bold">{fmt(order.price * order.quantity)} ریال</span></Row>
                <Row label="زمان ثبت">{order.createdAt}</Row>
              </div>

              <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-4">
                <h4 className="font-bold text-sm mb-3">وضعیت اجرا</h4>
                <FillBar filled={order.filledQty} total={order.quantity} />
              </div>
            </div>
          </div>
        )}

        {order && (
          <div className="shrink-0 border-t border-border-light dark:border-border-dark p-5 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">عملیات مدیریتی</p>
            <div className="grid grid-cols-2 gap-2">
              {isCancellable && (
                <button
                  onClick={() => setConfirmAction('cancel')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm font-semibold hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors border border-rose-200 dark:border-rose-800"
                >
                  <FiXCircle size={14} />
                  لغو سفارش
                </button>
              )}
              <button
                onClick={() => setConfirmAction('force_execute')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors border border-emerald-200 dark:border-emerald-800"
              >
                <FiPlay size={14} />
                اجرای اجباری
              </button>
              <button
                onClick={() => setConfirmAction('suspend_user')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-sm font-semibold hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors border border-amber-200 dark:border-amber-800 col-span-full"
              >
                <FiUserX size={14} />
                تعلیق کاربر ({order.userName})
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
    </>
  );
}