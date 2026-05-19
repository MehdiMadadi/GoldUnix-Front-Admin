import type { Trade } from '../../data/trades';
import { TRADE_TYPE_LABELS } from '../../data/trades';
import Badge from '../UI/Badge';

interface TradesCardProps {
  trades: Trade[];
  onRowClick?: (trade: Trade) => void;
}

function SideBadge({ side }: { side: Trade['side'] }) {
  return side === 'buy'
    ? <Badge variant="success">خرید</Badge>
    : <Badge variant="danger">فروش</Badge>;
}

function StatusBadge({ status }: { status: Trade['status'] }) {
  if (status === 'settled') return <Badge variant="success">تسویه</Badge>;
  if (status === 'pending') return <Badge variant="warning">در انتظار</Badge>;
  if (status === 'open') return <Badge variant="primary">باز</Badge>;
  return <Badge variant="neutral">لغو</Badge>;
}

function fmt(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} م`;
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)} م`;
  return n;
}

export default function TradesCard({ trades, onRowClick }: TradesCardProps) {
  return (
    <div className="p-4 space-y-3">
      {trades.map(trade => (
        <div key={trade.id} className="user-card space-y-3 cursor-pointer active:scale-[0.99] transition-transform" onClick={() => onRowClick?.(trade)}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{trade.userName}</h4>
                <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-full font-medium ${trade.userType === 'trade' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {trade.userType === 'trade' ? 'صنف' : 'عادی'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{trade.createdAt}</p>
            </div>
            <StatusBadge status={trade.status} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-50 dark:bg-background-dark/60 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">{trade.asset}</p>
              <div className="flex items-center gap-1">
                <SideBadge side={trade.side} />
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-background-dark/60 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">مقدار</p>
              <p className=" font-bold text-slate-800 dark:text-slate-200">{trade.quantity.toLocaleString('fa-IR')} {trade.unit}</p>
            </div>
            <div className="bg-slate-50 dark:bg-background-dark/60 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">قیمت ورود</p>
              <p className=" font-bold text-slate-800 dark:text-slate-200">{fmt(trade.entryPrice)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">اسپرد</p>
              <p className=" font-bold text-emerald-600 dark:text-emerald-400">{fmt(trade.spread)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-background-dark/60 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">کارمزد</p>
              <p className=" font-bold text-slate-700 dark:text-slate-300">{fmt(trade.fee)}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">درآمد خالص</p>
              <p className=" font-bold text-blue-600 dark:text-blue-400">{fmt(trade.netRevenue)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-border-light dark:border-border-dark text-xs text-slate-500">
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full font-medium">
              {TRADE_TYPE_LABELS[trade.type]}
            </span>
            <span>{trade.settlementDate}</span>
            {trade.deliveryType === 'physical'
              ? <Badge variant="info" small>فیزیکی</Badge>
              : <Badge variant="neutral" small>نقدی</Badge>}
          </div>
        </div>
      ))}
    </div>
  );
}
