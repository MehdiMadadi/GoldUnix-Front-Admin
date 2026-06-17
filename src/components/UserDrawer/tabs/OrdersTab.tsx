// OrdersTab.tsx - جمع و جورتر
import { useState, useMemo, useEffect } from 'react';
import { FiFileText } from 'react-icons/fi';
import Badge from '../../UI/Badge';
import { Api, OrderDto, OrderFilter } from '../../../lib/client';

interface OrdersTabProps {
  userId: string;
}

function statusBadge(status?: string) {
  const statusMap: Record<string, { variant: 'warning' | 'success' | 'info' | 'neutral'; label: string }> = {
    OPEN: { variant: 'warning', label: 'باز' },
    FILLED: { variant: 'success', label: 'پر شده' },
    PARTIALLY_FILLED: { variant: 'info', label: 'بخشی پر' },
    CANCELLED: { variant: 'neutral', label: 'لغو' },
    EXPIRED: { variant: 'neutral', label: 'منقضی' },
  };
  const config = statusMap[status || ''] || { variant: 'neutral' as const, label: status || 'نامشخص' };
  return <Badge variant={config.variant} small>{config.label}</Badge>;
}

function fmt(n?: number) {
  return n?.toLocaleString('fa-IR') || '۰';
}

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {label}
    </button>
  );
}

export default function OrdersTab({ userId }: OrdersTabProps) {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ side: 'all', status: 'all' });

  const client = new Api();

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const filter: OrderFilter = {
        username: userId.toString(),
        from: 0,
        size: 100,
      };
      const response = await client.api.getCurrentOrders(filter);
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return orders.filter(o => {
      if (filters.side !== 'all' && o.side !== filters.side) return false;
      if (filters.status !== 'all' && o.status !== filters.status) return false;
      return true;
    });
  }, [orders, filters]);

  const statuses = useMemo(() => [...new Set(orders.map(o => o.status).filter(Boolean))], [orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border-light dark:border-border-dark space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            <span className="font-bold text-slate-800 dark:text-slate-200">{filtered.length.toLocaleString('fa-IR')}</span> سفارش
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] text-slate-400 flex-shrink-0">جهت:</span>
            {([['all', 'همه'], ['BUY', 'خرید'], ['SELL', 'فروش']] as const).map(([v, l]) => (
              <FilterChip key={v} label={l} active={filters.side === v} onClick={() => setFilters(f => ({ ...f, side: v }))} />
            ))}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] text-slate-400 flex-shrink-0">وضعیت:</span>
            <FilterChip label="همه" active={filters.status === 'all'} onClick={() => setFilters(f => ({ ...f, status: 'all' }))} />
            {statuses.map(s => (
              <FilterChip key={s} label={s} active={filters.status === s} onClick={() => setFilters(f => ({ ...f, status: s! }))} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <FiFileText size={32} className="mb-2" />
            <p className="text-xs">سفارشی یافت نشد</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filtered.map(order => (
              <div 
                key={order.orderId} 
                className={`border rounded-xl p-3 ${
                  order.status === 'OPEN' 
                    ? 'border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/10' 
                    : 'border-border-light dark:border-border-dark bg-white dark:bg-surface-dark'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={order.side === 'BUY' ? 'success' : 'danger'} small>
                      {order.side === 'BUY' ? 'خرید' : 'فروش'}
                    </Badge>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{order.asset}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {order.orderType || 'CASH'}
                    </span>
                    {statusBadge(order.status)}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 text-[10px]">مقدار</span>
                    <p className="font-medium">{fmt(order.quantity)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">قیمت</span>
                    <p className="font-medium">{fmt(order.unitPrice)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">ارزش</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{fmt(order.totalAmount)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">کارمزد</span>
                    <p className="font-medium text-amber-500">{fmt(order.fee)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}