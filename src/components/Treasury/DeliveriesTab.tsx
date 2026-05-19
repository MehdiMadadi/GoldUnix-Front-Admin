import { useState } from 'react';
import type { DeliveryItem, DeliveryStatus } from '../../data/treasury';
import Badge from '../UI/Badge';
import AccDrawer from '../Accounting/AccDrawer';
import AccBottomSheet from '../Accounting/AccBottomSheet';
import ConfirmDialog from '../Trades/ConfirmDialog';
import { Api, PhysicalDeliveryResponseDto } from '../../lib/client';
import { it } from 'node:test';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

const STATUS_CONFIG: Record<any, { label: string; variant: BadgeVariant }> = {
  REQUESTED: { label: 'در انتظار', variant: 'warning' },
  APPROVED: { label: 'قبول شده', variant: 'info' },
  SCHEDULED: { label: 'آماده سازی', variant: 'info' },
  READY_FOR_PICKUP: { label: 'آماده تحویل', variant: 'info' },
  DELIVERED: { label: 'تحویل داده شد', variant: 'success' },
  REJECTED: { label: 'رد شده', variant: 'danger' },
  CANCELED: { label: 'لغو شده', variant: 'danger' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

function PaymentBadge({ status }: { status: 'paid' | 'pending' }) {
  return <Badge variant={status === 'paid' ? 'success' : 'neutral'} small>{status === 'paid' ? 'پرداخت شده' : 'در انتظار'}</Badge>;
}

type ActionType = 'REQUESTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SCHEDULED' | 'READY_FOR_PICKUP' | 'DELIVERED' | 'CANCELED';

const ACTION_CONFIG: Record<ActionType, { label: string; icon: string; btnClass: string; confirmVariant?: 'info' | 'warning' | 'danger'; showConfirm: boolean }> = {
  APPROVED: { label: 'قبول شده', icon: 'check_circle', btnClass: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20', confirmVariant: 'info', showConfirm: true },
  READY_FOR_PICKUP: { label: 'آماده تحویل', icon: 'check_circle', btnClass: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20', confirmVariant: 'info', showConfirm: true },
  DELIVERED: { label: 'ثبت تحویل', icon: 'local_shipping', btnClass: 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20', confirmVariant: 'info', showConfirm: true },
  CANCELED: { label: 'لغو', icon: 'cancel', btnClass: 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20', confirmVariant: 'danger', showConfirm: true },
  REJECTED: { label: 'بال', icon: 'cancel', btnClass: 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20', confirmVariant: 'danger', showConfirm: true },
  print: { label: 'چاپ رسید', icon: 'print', btnClass: 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800', showConfirm: false },
};

function DeliveryDetail({ item }: { item: PhysicalDeliveryResponseDto }) {
  return (
    <div className="p-5 space-y-5">
      <div className="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/20 dark:to-background-dark rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-slate-500">کد تحویل</p>
            <p className=" font-bold text-blue-600 dark:text-blue-400 text-lg">{item.id}</p>
          </div>
          <StatusBadge status={item.status} />
        </div>
        <p className="font-bold text-slate-900 dark:text-white">{item.customer?.firstName} {item.customer?.lastName}</p>
        <p className="text-xs text-slate-400 mt-0.5">شناسه: {item.customer?.id}</p>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">جزئیات سفارش</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'دارایی', value: item.assetType },
            { label: 'مقدار', value: `${item.requestedQuantity.toLocaleString('fa-IR')} ${item.unit}` },
            { label: 'انبار', value: item?.warehouse },
            // { label: 'وضعیت پرداخت', custom: <PaymentBadge status={item.paymentStatus} /> },
            { label: 'تاریخ درخواست', value: item?.requestDate },
            { label: 'تاریخ آماده‌سازی', value: item?.readyDate },
          ].map(row => (
            <div key={row.label} className="bg-slate-50 dark:bg-background-dark rounded-xl p-3">
              <p className="text-[0.65rem] text-slate-400 mb-1">{row.label}</p>
              {row.custom ?? <p className="font-medium text-sm text-slate-900 dark:text-white">{row.value}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-background-dark rounded-xl">
        <span className="material-symbols-outlined text-sm text-slate-400 mt-0.5">location_on</span>
        <div>
          <p className="text-xs text-slate-400 mb-0.5">آدرس تحویل</p>
          <p className="text-sm text-slate-700 dark:text-slate-300">{item.deliveryLocation}</p>
        </div>
      </div>
    </div>
  );
}

interface Props {
  items: PhysicalDeliveryResponseDto[];
  isMobile: boolean;
}

export default function DeliveriesTab({ items, isMobile }: Props) {
  const [selected, setSelected] = useState<PhysicalDeliveryResponseDto | null>(null);
  const [confirm, setConfirm] = useState<{ item: PhysicalDeliveryResponseDto; action: ActionType } | null>(null);

  const client = new Api();

  // type ActionType = 'ready' | 'deliver' | 'cancel' | 'print';
  const handleAction = async (item: PhysicalDeliveryResponseDto, action: ActionType) => {
    if (ACTION_CONFIG[action].showConfirm) setConfirm({ item, action });

    // if (action === 'APPROVED') {
      await client.api.changeStatus(item.id!, { status: action })
    // }
  };

  const mobileCards = (
    <div className="space-y-3">
      {items?.map(item => (
        <div key={item.id} className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className=" text-xs text-blue-600 dark:text-blue-400">{item.id}</p>
              <p className="font-bold text-slate-900 dark:text-white text-sm">{item.customer?.firstName} {item.customer?.lastName}</p>
            </div>
            <StatusBadge status={item.status} />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
            <span>{item.asset}</span>
            <span>•</span>
            <span className=" font-bold">{item.requestedQuantity.toLocaleString('fa-IR')} {item.unit}</span>
            <span>•</span>
            <span>{item?.warehouse}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSelected(item)} className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">visibility</span>
              جزئیات
            </button>
            {item.status === 'APPROVED' && (
              <button onClick={() => handleAction(item, 'READY_FOR_PICKUP')} className="flex-1 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                آماده
              </button>
            )}
            {item.status === 'REQUESTED' && (
              <button onClick={() => handleAction(item, 'APPROVED')} className="flex-1 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1">
                {/* <span className="material-symbols-outlined text-sm">check_circle</span> */}
                قبول درخواست
              </button>
            )}
            {item.status === 'READY_FOR_PICKUP' && (
              <button onClick={() => handleAction(item, 'DELIVERED')} className="flex-1 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                تحویل
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const desktopTable = (
    <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500">
          <tr>
            <th className="px-5 py-3.5 text-right font-medium">کد تحویل</th>
            <th className="px-5 py-3.5 text-right font-medium">کاربر</th>
            <th className="px-5 py-3.5 text-right font-medium">دارایی</th>
            <th className="px-5 py-3.5 text-right font-medium">مقدار</th>
            <th className="px-5 py-3.5 text-right font-medium">وضعیت</th>
            <th className="px-5 py-3.5 text-right font-medium">انبار</th>
            {/* <th className="px-5 py-3.5 text-right font-medium">پرداخت</th> */}
            <th className="px-5 py-3.5 text-right font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light dark:divide-border-dark">
          {items?.map(item => (
            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors">
              <td className="px-5 py-4  text-blue-600 dark:text-blue-400 text-xs">{item.id}</td>
              <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{item.customer?.firstName} {item.customer?.lastName}</td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{item.assetType}</td>
              <td className="px-5 py-4  font-bold">{item.requestedQuantity.toLocaleString('fa-IR')} <span className="text-xs text-slate-400">{item.unit}</span></td>
              <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
              <td className="px-5 py-4 text-slate-500 text-xs">{item?.warehouse}</td>
              {/* <td className="px-5 py-4"><PaymentBadge status={item.paymentStatus} /></td> */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-1">
                  <button onClick={() => setSelected(item)} title="جزئیات" className="w-8 h-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 flex items-center justify-center transition-colors text-blue-600">
                    {/* <span className="material-symbols-outlined text-base">visibility</span> */}
                    مشاهده
                  </button>
                  {item.status === 'REQUESTED' && (
                    <button onClick={() => handleAction(item, 'APPROVED')} title="قبول شده" className="w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 flex items-center justify-center transition-colors">
                      {/* <span className="material-symbols-outlined text-base">check_circle</span> */}
                      قبول شد
                    </button>
                  )}
                  {item.status === 'APPROVED' && (
                    <button onClick={() => handleAction(item, 'READY_FOR_PICKUP')} title="آماده تحویل" className="w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 flex items-center justify-center transition-colors">
                      {/* <span className="material-symbols-outlined text-base">check_circle</span> */}
                      آماده تحویل
                    </button>
                  )}
                  {item.status === 'APPROVED' && (
                    <button onClick={() => handleAction(item, 'SCHEDULED')} title="آماده سازی" className="w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 flex items-center justify-center transition-colors">
                      {/* <span className="material-symbols-outlined text-base">check_circle</span> */}
                      آماده سازی
                    </button>
                  )}
                  {item.status === 'READY_FOR_PICKUP' && (
                    <button onClick={() => handleAction(item, 'DELIVERED')} title="ثبت تحویل" className="w-8 h-8 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 flex items-center justify-center transition-colors">
                      {/* <span className="material-symbols-outlined text-base">local_shipping</span> */}
                      ثبت تحویل
                    </button>
                  )}
                  {(item.status === 'REQUESTED' || item.status === 'READY_FOR_PICKUP') && (
                    <button onClick={() => handleAction(item, 'CANCELED')} title="لغو" className="w-8 h-8 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center justify-center transition-colors">
                      {/* <span className="material-symbols-outlined text-base">cancel</span> */}
                      لغو
                    </button>
                  )}
                  {(item.status !== 'DELIVERED' || item.status === 'REJECTED') && (
                    <button onClick={() => handleAction(item, 'REJECTED')} title="باطل" className="w-8 h-8 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center justify-center transition-colors">
                      {/* <span className="material-symbols-outlined text-base">cancel</span> */}
                      باطل
                    </button>
                  )}
                  {/* <button onClick={() => handleAction(item, 'print')} title="چاپ رسید" className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-base">print</span>
                  </button> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="desktop-view">{desktopTable}</div>
      <div className="mobile-view">{mobileCards}</div>

      {isMobile ? (
        <AccBottomSheet open={selected !== null} title="جزئیات تحویل" onClose={() => setSelected(null)}>
          {selected && <DeliveryDetail item={selected} />}
        </AccBottomSheet>
      ) : (
        <AccDrawer open={selected !== null} title="جزئیات تحویل" icon="local_shipping" onClose={() => setSelected(null)}>
          {selected && <DeliveryDetail item={selected} />}
        </AccDrawer>
      )}

      {confirm && ACTION_CONFIG[confirm.action].confirmVariant && (
        <ConfirmDialog
          open
          title={ACTION_CONFIG[confirm.action].label}
          description={`کاربر: ${confirm.item.user} | کد: ${confirm.item.deliveryId}`}
          confirmLabel={ACTION_CONFIG[confirm.action].label}
          variant={ACTION_CONFIG[confirm.action].confirmVariant}
          onConfirm={() => setConfirm(null)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}
