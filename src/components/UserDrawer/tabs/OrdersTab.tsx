import { useState, useMemo, useEffect } from 'react';
import { FiBarChart2, FiFileText } from 'react-icons/fi';
import Badge from '../../UI/Badge';
import { Api, OrderDto, OrderFilter } from '../../../lib/client';

interface OrdersTabProps {
  userId: string;
}

interface Filters {
  side: 'BUY' | 'SELL' | 'all';
  status: string;
}

const DEFAULT_FILTERS: Filters = { side: 'all', status: 'all' };

function statusBadge(status?: string) {
  const statusMap: Record<string, { variant: 'warning' | 'success' | 'info' | 'neutral'; label: string }> = {
    OPEN: { variant: 'warning', label: 'باز' },
    FILLED: { variant: 'success', label: 'پر شده' },
    PARTIALLY_FILLED: { variant: 'info', label: 'بخشی پر شده' },
    CANCELLED: { variant: 'neutral', label: 'لغو' },
    EXPIRED: { variant: 'neutral', label: 'منقضی' },
  };
  const config = statusMap[status || ''] || { variant: 'neutral' as const, label: status || 'نامشخص' };
  return <Badge variant={config.variant} small>{config.label}</Badge>;
}

function sideBadge(side?: string) {
  if (side === 'BUY') return <Badge variant="success" small>خرید</Badge>;
  if (side === 'SELL') return <Badge variant="danger" small>فروش</Badge>;
  return <Badge variant="neutral" small>{side}</Badge>;
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
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
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
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showStats, setShowStats] = useState(false);

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

  const openCount = orders.filter(o => o.status === 'OPEN').length;
  const totalFee = filtered.reduce((s, o) => s + (o.fee || 0), 0);
  const totalValue = filtered.reduce((s, o) => s + (o.totalAmount || 0), 0);
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
      <div className="px-5 pt-4 pb-3 border-b border-border-light dark:border-border-dark space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            <span className="font-bold text-slate-800 dark:text-slate-200">{filtered.length.toLocaleString('fa-IR')}</span> سفارش
            {openCount > 0 && (
              <span className="mr-2 text-amber-500 font-semibold">({openCount.toLocaleString('fa-IR')} باز)</span>
            )}
          </p>
          <button
            onClick={() => setShowStats(v => !v)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              showStats ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <FiBarChart2 size={18} />
          </button>
        </div>

        {showStats && (
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3 text-center">
              <p className="text-[10px] text-slate-400 mb-1">ارزش کل</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 ">{fmt(totalValue)}</p>
            </div>
            <div className="bg-slate-50 dark:bg-background-dark rounded-xl p-3 text-center">
              <p className="text-[10px] text-slate-400 mb-1">کارمزد کل</p>
              <p className="text-xs font-bold text-amber-500 ">{fmt(totalFee)}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3 text-center">
              <p className="text-[10px] text-amber-500 mb-1">سفارشات باز</p>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{openCount.toLocaleString('fa-IR')}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 flex-shrink-0">جهت:</span>
            {([['all', 'همه'], ['BUY', 'خرید'], ['SELL', 'فروش']] as const).map(([v, l]) => (
              <FilterChip key={v} label={l} active={filters.side === v} onClick={() => setFilters(f => ({ ...f, side: v }))} />
            ))}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
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
            <FiFileText size={40} className="mb-2" />
            <p className="text-sm">سفارشی یافت نشد</p>
          </div>
        ) : (
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {filtered.map(order => (
              <div key={order.orderId} className={`px-5 py-4 ${order.status === 'OPEN' ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {sideBadge(order.side)}
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{order.asset}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                      {order.orderType || 'CASH'}
                    </span>
                    {statusBadge(order.status)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
                  <div>
                    <p className="text-[10px] text-slate-400">مقدار</p>
                    <p className="text-xs  font-semibold">{fmt(order.quantity)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">قیمت واحد</p>
                    <p className="text-xs  font-semibold">{fmt(order.unitPrice)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">ارزش کل</p>
                    <p className="text-xs  font-bold text-slate-800 dark:text-slate-200">{fmt(order.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">کارمزد</p>
                    <p className="text-xs  text-amber-500">{fmt(order.fee)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">تاریخ</p>
                    <p className="text-[11px] text-slate-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">تنور</p>
                    <p className="text-[11px] text-slate-500">{order.tenor || '—'}</p>
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