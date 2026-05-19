import { FiEye, FiXCircle, FiPlay } from 'react-icons/fi';
import { OrderDto } from '../../lib/client';
import Badge from '../UI/Badge';

interface OrdersCardProps {
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

function fmt(n?: number) {
  return n?.toLocaleString('fa-IR') || '۰';
}

export default function OrdersCard({ orders, onRowClick }: OrdersCardProps) {
  return (
    <div className="p-4 space-y-3">
      {orders?.map(order => (
        <div 
          key={order.orderId} 
          className="user-card space-y-3 cursor-pointer active:scale-[0.99] transition-transform" 
          onClick={() => onRowClick?.(order)}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {order.user?.firstName} {order.user?.lastName}
                </h4>
                <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-full font-medium ${
                  order.user?.typeCode === 'trade' 
                    ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {order.user?.typeCode === 'trade' ? 'صنف' : 'عادی'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : '—'}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-50 dark:bg-background-dark/60 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">{order.asset}</p>
              <div className="flex items-center gap-1">
                <SideBadge side={order.side} />
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-background-dark/60 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">مقدار</p>
              <p className=" font-bold text-slate-800 dark:text-slate-200">{fmt(order.quantity)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-background-dark/60 rounded-xl p-2.5">
              <p className="text-slate-400 mb-1">قیمت</p>
              <p className=" font-bold text-slate-800 dark:text-slate-200">{fmt(order.unitPrice)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-border-light dark:border-border-dark">
            <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
              order.orderType === 'MARKET' 
                ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}>
              {order.orderType === 'MARKET' ? 'بازار' : 'محدود'}
            </span>
            <div className="flex items-center gap-1.5">
              <button title="مشاهده" className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center">
                <FiEye size={14} />
              </button>
              {order.status !== 'CANCELLED' && (
                <button title="لغو" className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center">
                  <FiXCircle size={14} />
                </button>
              )}
              <button title="اجرای اجباری" className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center">
                <FiPlay size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}