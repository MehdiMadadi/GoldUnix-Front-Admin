import { FiEye } from 'react-icons/fi';
import { OrderDto, UserAccountDto } from '../../lib/client';
import Badge from '../UI/Badge';

interface OrdersTableProps {
  orders?: OrderDto[];
  onRowClick?: (order: OrderDto) => void;
}

function SideBadge({ side }: { side?: OrderDto['side'] }) {
  return side === 'BUY'
    ? <Badge variant="success">خرید</Badge>
    : <Badge variant="danger">فروش</Badge>;
}

function StatusBadge({ status }: { status?: OrderDto['status'] }) {
  if (status === 'PENDING') return <Badge variant="primary">باز</Badge>;
  if (status === 'PARTIALLY_FILLED') return <Badge variant="warning">جزئی</Badge>;
  return <Badge variant="neutral">لغو</Badge>;
}

function UserTypeBadge({ type }: { type?: UserAccountDto['type'] }) {
  return type === 'trade'
    ? <Badge variant="info">صنف</Badge>
    : <Badge variant="neutral">عادی</Badge>;
}

function fmt(n?: number) {
  return n?.toLocaleString('fa-IR') || '۰';
}

export default function OrdersTable({ orders, onRowClick }: OrdersTableProps) {
  return (
    <div className="table-container">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500">
          <tr>
            <th className="px-4 py-3 text-right font-medium">کاربر</th>
            <th className="px-4 py-3 text-right font-medium">نوع</th>
            <th className="px-4 py-3 text-right font-medium">جهت</th>
            <th className="px-4 py-3 text-right font-medium">دارایی</th>
            <th className="px-4 py-3 text-right font-medium">نوع سفارش</th>
            <th className="px-4 py-3 text-right font-medium">مقدار</th>
            <th className="px-4 py-3 text-right font-medium">قیمت (ریال)</th>
            <th className="px-4 py-3 text-right font-medium">وضعیت</th>
            <th className="px-4 py-3 text-right font-medium">زمان ثبت</th>
            <th className="px-4 py-3 text-center font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-light dark:divide-border-dark">
          {orders?.map(order => (
            <tr key={order.orderId} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors cursor-pointer" onClick={() => onRowClick?.(order)}>
              <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                {order.user?.firstName} {order.user?.lastName}
              </td>
              <td className="px-4 py-3.5"><UserTypeBadge type={order.user?.type} /></td>
              <td className="px-4 py-3.5"><SideBadge side={order.side} /></td>
              <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{order.asset}</td>
              <td className="px-4 py-3.5">
                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                  order.orderType === 'MARKET' 
                    ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {order.orderType === 'MARKET' ? 'بازار' : 'محدود'}
                </span>
              </td>
              <td className="px-4 py-3.5 ">{fmt(order.quantity)}</td>
              <td className="px-4 py-3.5  text-slate-700 dark:text-slate-300">{fmt(order.unitPrice)}</td>
              <td className="px-4 py-3.5"><StatusBadge status={order.status} /></td>
              <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : '—'}
              </td>
              <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-center gap-1">
                  <button 
                    onClick={() => onRowClick?.(order)} 
                    title="مشاهده جزئیات" 
                    className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 flex items-center justify-center transition-colors"
                  >
                    <FiEye size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}