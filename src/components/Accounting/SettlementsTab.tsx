import { useEffect, useState } from 'react';
import { SETTLEMENTS, SETTLEMENT_TYPE_LABELS } from '../../data/accounting';
import type { Settlement } from '../../data/accounting';
import Badge from '../UI/Badge';
import ConfirmDialog from '../Trades/ConfirmDialog';
import { Api, CashoutDto } from '../../lib/client';

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

type ConfirmType = 'approve' | 'reject' | 'retry' | null;

const CONFIRM_CONFIG: Record<NonNullable<ConfirmType>, { title: string; description: string; confirmLabel: string; variant: 'danger' | 'warning' | 'info' }> = {
  approve: { title: 'تأیید تسویه', description: 'آیا این تسویه را تأیید می‌کنید؟', confirmLabel: 'تأیید', variant: 'info' },
  reject: { title: 'رد تسویه', description: 'آیا این تسویه را رد می‌کنید؟ این عملیات قابل بازگشت نیست.', confirmLabel: 'رد تسویه', variant: 'danger' },
  retry: { title: 'تلاش مجدد', description: 'آیا می‌خواهید این تسویه را دوباره پردازش کنید؟', confirmLabel: 'تلاش مجدد', variant: 'warning' },
};

function StatusBadge({ status }: { status: CashoutDto["statusType"] }) {
  if (status === 'Completed') return <Badge variant="success">تکمیل‌شده</Badge>;
  if (status === 'Requested') return <Badge variant="warning">در انتظار</Badge>;
  return <Badge variant="danger">ناموفق</Badge>;
}

export default function SettlementsTab() {
  const [settlements, setSettlements] = useState<CashoutDto[]>();
  const [actionTarget, setActionTarget] = useState<{ id: number; type: ConfirmType } | null>(null);

  const client = new Api();

  const handleConfirm = async () => {
    if (!actionTarget || !actionTarget.type) return;

    const response = await client.api.getCashouts({ from: 0, size: 10 });

    setSettlements(response.data);
    setActionTarget(null);
  };

  useEffect(()=>{
    setDate();
  }, [])

  const setDate = async () => {
    const response = await client.api.getCashouts({ from: 0, size: 10 });

    setSettlements(response.data);
    setActionTarget(null);
  };

  return (
    <>
      <div className="desktop-view table-container">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500 text-xs">
            <tr>
              <th className="px-4 py-3 text-right font-medium">شناسه تسویه</th>
              <th className="px-4 py-3 text-right font-medium">مقصد</th>
              <th className="px-4 py-3 text-right font-medium">نوع</th>
              <th className="px-4 py-3 text-right font-medium">مبلغ</th>
              <th className="px-4 py-3 text-right font-medium">مرجع بانک</th>
              <th className="px-4 py-3 text-right font-medium">تاریخ درخواست</th>
              <th className="px-4 py-3 text-right font-medium">وضعیت</th>
              <th className="px-4 py-3 text-center font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {settlements?.map(s => (
              <tr key={s.id} className={`transition-colors ${s.statusType === 'Reject' ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''
                } hover:bg-slate-50 dark:hover:bg-background-dark/40`}>
                <td className="px-4 py-3.5 text-xs text-primary">{s.id}</td>
                <td className="px-4 py-3.5 text-slate-900 dark:text-white">
                  <span className='text-gray'>{s.destinationName}</span>
                  <br />
                  <span className='text-gray'>{s.destinationNumber}</span>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300">{SETTLEMENT_TYPE_LABELS['withdrawal']}</td>
                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">{s.amount?.toLocaleString("fa-IR")}</td>
                <td className="px-4 py-3.5 text-xs text-slate-400 truncate max-w-[120px]" title={s.externalReference}>{s.externalReference || '—'}</td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{new Date(s.entryDate).toLocaleDateString("fa-IR")}</td>
                <td className="px-4 py-3.5"><StatusBadge status={s.statusType} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-1">
                    {s.statusType === 'Requested' && (
                      <>
                        <button onClick={() => setActionTarget({ id: s.id!, type: 'approve' })} title="تأیید" className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                          <span className="material-symbols-outlined text-sm">check</span>
                        </button>
                        <button onClick={() => setActionTarget({ id: s.id!, type: 'reject' })} title="رد" className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </>
                    )}
                    {s.statusType === 'Reject' && (
                      <button onClick={() => setActionTarget({ id: s.id!, type: 'retry' })} title="تلاش مجدد" className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors">
                        <span className="material-symbols-outlined text-sm">refresh</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-view p-4 space-y-3">
        {settlements?.map(s => (
          <div key={s.id} className={`user-card space-y-3 ${s.statusType === 'Reject' ? 'border-rose-200 dark:border-rose-800' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{s.destinationName}</p>
                <p className="text-xs text-slate-400 mt-0.5 ">{s.id}</p>
              </div>
              <StatusBadge status={s.statusType} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">{SETTLEMENT_TYPE_LABELS['withdrawal']}</span>
              <span className=" font-bold">{s.amount} ریال</span>
            </div>
            <p className="text-xs text-slate-400">تاریخ درخواست: {s.entryDate}</p>
            {s.note && <p className="text-xs text-amber-600 dark:text-amber-400">{s.note}</p>}
            {(s.statusType === 'Requested' || s.statusType === 'Reject') && (
              <div className="flex gap-2">
                {s.statusType === 'Requested' && (
                  <>
                    <button onClick={() => setActionTarget({ id: s.id!, type: 'approve' })} className="flex-1 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors">
                      تأیید
                    </button>
                    <button onClick={() => setActionTarget({ id: s.id!, type: 'reject' })} className="flex-1 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 text-xs font-semibold border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors">
                      رد
                    </button>
                  </>
                )}
                {s.statusType === 'Reject' && (
                  <button onClick={() => setActionTarget({ id: s.id!, type: 'retry' })} className="flex-1 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 text-xs font-semibold border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors">
                    تلاش مجدد
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {actionTarget && actionTarget.type && (
        <ConfirmDialog
          open
          title={CONFIRM_CONFIG[actionTarget.type].title}
          description={CONFIRM_CONFIG[actionTarget.type].description}
          confirmLabel={CONFIRM_CONFIG[actionTarget.type].confirmLabel}
          variant={CONFIRM_CONFIG[actionTarget.type].variant}
          onConfirm={handleConfirm}
          onCancel={() => setActionTarget(null)}
        />
      )}
    </>
  );
}
