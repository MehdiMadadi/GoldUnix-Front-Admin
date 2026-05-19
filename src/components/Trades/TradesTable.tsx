import type { Trade } from '../../data/trades';
import { TRADE_TYPE_LABELS } from '../../data/trades';
import { OrderDto, TradeDto } from '../../lib/client';
import Badge from '../UI/Badge';

interface TradesTableProps {
  trades: TradeDto[];
  onRowClick?: (trade: TradeDto) => void;
}

function SideBadge({ side }: { side: OrderDto['side'] }) {
  return side === 'BUY'
    ? <Badge variant="success">خرید</Badge>
    : <Badge variant="danger">فروش</Badge>;
}

function StatusBadge({ status }: { status: OrderDto['status'] }) {
  if (status === 'FILLED') return <Badge variant="success">تسویه</Badge>;
  if (status === 'PENDING') return <Badge variant="warning">در انتظار</Badge>;
  if (status === 'ACCEPTED') return <Badge variant="primary">باز</Badge>;
  return <Badge variant="neutral">لغو</Badge>;
}

// function DeliveryStatusBadge({ status }: { status: Trade['deliveryStatus'] }) {
//   if (status === 'delivered') return <Badge variant="success">تحویل شد</Badge>;
//   if (status === 'cancelled') return <Badge variant="danger">لغو</Badge>;
//   return <Badge variant="warning">در انتظار</Badge>;
// }

function fmt(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

export default function TradesTable({ trades, onRowClick }: TradesTableProps) {
  return (
    <div className="table-container">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500">
          <tr>
            <th className="px-4 py-3 text-right font-medium">کاربر</th>
            {/* <th className="px-4 py-3 text-right font-medium">نوع</th> */}
            <th className="px-4 py-3 text-right font-medium">جهت</th>
            <th className="px-4 py-3 text-right font-medium">نوع معامله</th>
            <th className="px-4 py-3 text-right font-medium">دارایی</th>
            <th className="px-4 py-3 text-right font-medium">مقدار</th>
            <th className="px-4 py-3 text-right font-medium">قیمت ورود</th>
            <th className="px-4 py-3 text-right font-medium">قیمت بازار</th>
            <th className="px-4 py-3 text-right font-medium text-emerald-600 dark:text-emerald-400">اسپرد</th>
            <th className="px-4 py-3 text-right font-medium">کارمزد</th>
            {/* <th className="px-4 py-3 text-right font-medium text-blue-600 dark:text-blue-400">درآمد خالص</th> */}
            <th className="px-4 py-3 text-right font-medium">تسویه</th>
            {/* <th className="px-4 py-3 text-right font-medium">تحویل</th> */}
            {/* <th className="px-4 py-3 text-right font-medium">وضعیت تحویل</th> */}
            <th className="px-4 py-3 text-right font-medium">وضعیت</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light dark:divide-border-dark">
          {trades.map(trade => (
            <tr key={trade.id} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors cursor-pointer" onClick={() => onRowClick?.(trade)}>
              <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">{trade.user?.phoneNumber}</td>
              {/* <td className="px-4 py-3.5">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trade.userType === 'trade' ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {trade.product}
                </span>
              </td> */}
              <td className="px-4 py-3.5"><SideBadge side={trade.order?.side} /></td>
              <td className="px-4 py-3.5">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {trade.product}
                </span>
              </td>
              <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{trade.order?.asset}</td>
              <td className="px-4 py-3.5 ">{trade?.quantity?.toLocaleString('fa-IR')} {trade.unit}</td>
              <td className="px-4 py-3.5  text-slate-700 dark:text-slate-300">{trade?.executionPrice?.toLocaleString("fa-IR")}</td>
              <td className="px-4 py-3.5  text-slate-500">{trade?.marketPrice?.toLocaleString("fa-IR")}</td>
              <td className="px-4 py-3.5  font-bold text-emerald-600 dark:text-emerald-400">{fmt(trade.spread)}</td>
              <td className="px-4 py-3.5  text-slate-600 dark:text-slate-400">{trade.feeAmount || 0}</td>
              {/* <td className="px-4 py-3.5  font-bold text-blue-600 dark:text-blue-400">{fmt(trade.netRevenue)}</td> */}
              <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{new Date(trade.executedAt/1).toLocaleDateString('fa-IR')}</td>
              {/* <td className="px-4 py-3.5">
                {trade.deliveryType === 'physical'
                  ? <Badge variant="info">فیزیکی</Badge>
                  : <Badge variant="neutral">نقدی</Badge>}
              </td> */}
              {/* <td className="px-4 py-3.5"><DeliveryStatusBadge status={trade.deliveryStatus} /></td> */}
              <td className="px-4 py-3.5"><StatusBadge status={trade.order?.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
