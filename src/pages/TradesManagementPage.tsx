// pages/admin/TradesManagementPage.tsx
import { useEffect, useState, useCallback } from 'react';
import { Api, OrderDto, TradeDto, OrderFilter, TradeFilter } from '../lib/client';
import Badge from '../components/UI/Badge';
import { 
  ShoppingBag, 
  TrendingUp, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  RefreshCw, 
  X, 
  Loader2,
  Calendar,
  User,
  MinusCircle,
  PlusCircle,
  RotateCcw,
  Filter,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// ===== Status Badges =====
const getOrderStatusBadge = (status?: string) => {
  const statusMap: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' | 'info' | 'neutral' }> = {
    PENDING: { label: 'در انتظار', variant: 'warning' },
    ACCEPTED: { label: 'تایید شده', variant: 'info' },
    PARTIALLY_FILLED: { label: 'بخشی اجرا شده', variant: 'warning' },
    FILLED: { label: 'کامل اجرا شده', variant: 'success' },
    CANCELLED: { label: 'لغو شده', variant: 'neutral' },
    REJECTED: { label: 'رد شده', variant: 'danger' },
    EXPIRED: { label: 'منقضی شده', variant: 'neutral' },
    FAILED: { label: 'ناموفق', variant: 'danger' },
  };
  return statusMap[status || ''] || { label: status || 'نامشخص', variant: 'neutral' };
};

const getSideBadge = (side?: string) => {
  if (side === 'BUY' || side === 'LONG') {
    return { label: side === 'BUY' ? 'خرید' : 'لانگ', variant: 'success' as const, icon: PlusCircle };
  }
  return { label: side === 'SELL' ? 'فروش' : 'شورت', variant: 'danger' as const, icon: MinusCircle };
};

// ===== Date Helpers =====
type DatePreset = 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'custom';
const datePresets: { value: DatePreset; label: string }[] = [
  { value: 'today', label: 'امروز' },
  { value: 'yesterday', label: 'دیروز' },
  { value: 'thisWeek', label: 'این هفته' },
  { value: 'thisMonth', label: 'این ماه' },
  { value: 'custom', label: 'سفارشی' },
];

function getDateRange(preset: DatePreset): { fromDate: Date; toDate: Date } {
  const now = new Date();
  const from = new Date(now);
  const to = new Date(now);

  switch (preset) {
    case 'today':
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      from.setDate(now.getDate() - 1);
      from.setHours(0, 0, 0, 0);
      to.setDate(now.getDate() - 1);
      to.setHours(23, 59, 59, 999);
      break;
    case 'thisWeek': {
      const day = now.getDay();
      const diff = day === 6 ? 0 : (day + 1) % 7;
      from.setDate(now.getDate() - diff);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    }
    case 'thisMonth':
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    default:
      break;
  }
  return { fromDate: from, toDate: to };
}

// ===== Format Helpers =====
function formatNumber(num?: number, decimals: number = 0): string {
  if (num === undefined || num === null) return '---';
  return num.toLocaleString('fa-IR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '---';
  try {
    return new Date(dateStr).toLocaleString('fa-IR');
  } catch {
    return '---';
  }
}

// ===== Export to CSV =====
function exportToCSV(data: any[], type: 'orders' | 'trades') {
  if (data.length === 0) return;

  let headers: string[];
  let rows: any[][];

  if (type === 'orders') {
    headers = ['شناسه سفارش', 'کاربر', 'محصول', 'سمت', 'مقدار', 'قیمت واحد', 'جمع کل', 'وضعیت', 'تاریخ ایجاد'];
    rows = data.map((order: OrderDto) => [
      order.orderId || '',
      order.user?.username || order.user?.mobileNumber || '---',
      order.orderProductCode || order.asset || '---',
      order.side === 'BUY' ? 'خرید' : order.side === 'SELL' ? 'فروش' : order.side || '---',
      order.quantity || 0,
      order.unitPrice || 0,
      order.totalAmount || 0,
      order.status || '---',
      order.createdAt ? new Date(order.createdAt).toLocaleString('fa-IR') : '---'
    ]);
  } else {
    headers = ['شناسه معامله', 'کاربر', 'محصول', 'سمت', 'مقدار', 'قیمت اجرا', 'ارزش کل', 'کارمزد', 'تاریخ اجرا'];
    rows = data.map((trade: TradeDto) => [
      trade.id || '',
      trade.user?.username || trade.user?.mobileNumber || '---',
      trade.productCode || trade.product || '---',
      trade.order?.side === 'BUY' ? 'خرید' : trade.order?.side === 'SELL' ? 'فروش' : trade.order?.side || '---',
      trade.quantity || 0,
      trade.executionPrice || 0,
      trade.notional || 0,
      trade.feeAmount || 0,
      trade.executedAt ? new Date(trade.executedAt).toLocaleString('fa-IR') : '---'
    ]);
  }

  // BOM for UTF-8 Persian support
  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];
  link.download = `${type}_${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// ===== Advanced Filter Popup =====
function AdvancedFilterPopup({
  open,
  onClose,
  username,
  setUsername,
  productCode,
  setProductCode,
  side,
  setSide,
  status,
  setStatus,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  username: string;
  setUsername: (v: string) => void;
  productCode: string;
  setProductCode: (v: string) => void;
  side: string;
  setSide: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  onApply: () => void;
}) {
  if (!open) return null;

  const sideOptions = [
    { value: '', label: 'همه' },
    { value: 'BUY', label: 'خرید' },
    { value: 'SELL', label: 'فروش' },
    { value: 'LONG', label: 'لانگ' },
    { value: 'SHORT', label: 'شورت' },
  ];

  const statusOptions = [
    { value: '', label: 'همه' },
    { value: 'PENDING', label: 'در انتظار' },
    { value: 'ACCEPTED', label: 'تایید شده' },
    { value: 'PARTIALLY_FILLED', label: 'بخشی اجرا شده' },
    { value: 'FILLED', label: 'کامل اجرا شده' },
    { value: 'CANCELLED', label: 'لغو شده' },
    { value: 'REJECTED', label: 'رد شده' },
    { value: 'EXPIRED', label: 'منقضی شده' },
    { value: 'FAILED', label: 'ناموفق' },
  ];

  const productOptions = [
    { value: '', label: 'همه محصولات' },
    { value: 'GOLD', label: 'طلا' },
    { value: 'USDT', label: 'تتر' },
    { value: 'BTC', label: 'بیت‌کوین' },
    { value: 'ETH', label: 'اتریوم' },
    { value: 'GOLD_18', label: 'طلای ۱۸ عیار' },
    { value: 'GOLD_24', label: 'طلای ۲۴ عیار' },
    { value: 'SILVER', label: 'نقره' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark w-full max-w-md mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">جستجوی پیشرفته</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">نام کاربری</label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="نام کاربری یا شماره موبایل..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">محصول</label>
            <select
              value={productCode}
              onChange={e => setProductCode(e.target.value)}
              className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 transition-all cursor-pointer"
            >
              {productOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">سمت</label>
            <select
              value={side}
              onChange={e => setSide(e.target.value)}
              className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 transition-all cursor-pointer"
            >
              {sideOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">وضعیت</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 transition-all cursor-pointer"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border-light dark:border-border-dark bg-slate-50 dark:bg-background-dark/50">
          <button
            onClick={() => { onApply(); onClose(); }}
            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all"
          >
            اعمال فیلترها
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Order Detail Modal =====
function OrderDetailModal({ order, onClose }: { order: OrderDto | null; onClose: () => void }) {
  if (!order) return null;

  const statusBadge = getOrderStatusBadge(order.status);
  const sideBadge = getSideBadge(order.side);

  const DetailRow = ({ label, value }: any) => (
    <div className="flex items-center justify-between py-2 border-b border-border-light dark:border-border-dark last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-white">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">جزئیات سفارش</h3>
              <p className="text-xs text-slate-400">شناسه: #{order.orderId}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 text-center">
              <Badge variant={sideBadge.variant} size="sm">{sideBadge.label}</Badge>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">{formatNumber(order.quantity)}</p>
              <p className="text-[10px] text-slate-400">مقدار</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 text-center">
              <Badge variant={statusBadge.variant} size="sm">{statusBadge.label}</Badge>
              <p className="text-lg font-bold text-primary mt-2">{formatNumber(order.totalAmount)}</p>
              <p className="text-[10px] text-slate-400">جمع کل (تومان)</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
            <DetailRow label="محصول" value={order.orderProductCode || order.asset || '---'} />
            <DetailRow label="قیمت واحد" value={`${formatNumber(order.unitPrice)} تومان`} />
            <DetailRow label="اسپرد" value={`${order.spread || 0}%`} />
            <DetailRow label="کارمزد" value={`${formatNumber(order.feeAmount || order.fee)} تومان`} />
            <DetailRow label="نوع سفارش" value={order.orderType || '---'} />
            <DetailRow label="سررسید" value={order.tenor || '---'} />
            <DetailRow label="شناسه رزرو" value={order.reservationId || '---'} />
            <DetailRow label="تاریخ ایجاد" value={formatDateTime(order.createdAt)} />
          </div>

          {order.user && (
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-slate-400 mb-2">اطلاعات کاربر</h4>
              <DetailRow label="نام کاربری" value={order.user.username || '---'} />
              <DetailRow label="نام و نام خانوادگی" value={`${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || '---'} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Trade Detail Modal =====
function TradeDetailModal({ trade, onClose, onToggleInclude }: { trade: TradeDto | null; onClose: () => void; onToggleInclude: (tradeId: number) => void }) {
  if (!trade) return null;

  const sideBadge = getSideBadge(trade.order?.side);

  const DetailRow = ({ label, value }: any) => (
    <div className="flex items-center justify-between py-2 border-b border-border-light dark:border-border-dark last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-white">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">جزئیات معامله</h3>
              <p className="text-xs text-slate-400">شناسه: #{trade.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 text-center">
              <Badge variant={sideBadge.variant} size="sm">{sideBadge.label}</Badge>
              <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">{formatNumber(trade.quantity)}</p>
              <p className="text-[10px] text-slate-400">مقدار</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-primary">{formatNumber(trade.executionPrice)}</p>
              <p className="text-[10px] text-slate-400">قیمت اجرا</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-slate-900 dark:text-white">{formatNumber(trade.notional)}</p>
              <p className="text-[10px] text-slate-400">ارزش کل</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
            <DetailRow label="محصول" value={trade.productCode || trade.product || '---'} />
            <DetailRow label="قیمت بازار" value={`${formatNumber(trade.marketPrice)} تومان`} />
            <DetailRow label="اسپرد" value={`${trade.spread || 0}%`} />
            <DetailRow label="نرخ کارمزد" value={`${trade.feeRate || 0}%`} />
            <DetailRow label="کارمزد" value={`${formatNumber(trade.feeAmount)} تومان`} />
            <DetailRow label="شناسه سفارش" value={`#${trade.order?.orderId || '---'}`} />
            <DetailRow label="تاریخ اجرا" value={formatDateTime(trade.executedAt)} />
          </div>

          {trade.position && (
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-slate-400 mb-2">اطلاعات پوزیشن</h4>
              <DetailRow label="شناسه پوزیشن" value={`#${trade.position.positionId}`} />
              <DetailRow label="قیمت ورود" value={`${formatNumber(trade.position.entryPrice)} تومان`} />
              <DetailRow label="اهرم" value={`${trade.position.leverage || 0}x`} />
              <DetailRow label="سود/زیان محقق نشده" value={`${formatNumber(trade.position.unrealizedPnl)} تومان`} />
            </div>
          )}

          {trade.user && (
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-slate-400 mb-2">اطلاعات کاربر</h4>
              <DetailRow label="نام کاربری" value={trade.user.username || '---'} />
              <DetailRow label="نام و نام خانوادگی" value={`${trade.user.firstName || ''} ${trade.user.lastName || ''}`.trim() || '---'} />
            </div>
          )}

          <button
            onClick={() => trade.id && onToggleInclude(trade.id)}
            className="w-full px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            تغییر وضعیت Include در محاسبات Breakeven
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Main Component =====
export default function TradesManagementPage() {
  const client = new Api();
  
  // Tab - Default to 'trades'
  const [activeTab, setActiveTab] = useState<'orders' | 'trades'>('trades');
  
  // Filters
  const [datePreset, setDatePreset] = useState<DatePreset>('today');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [username, setUsername] = useState('');
  const [productCode, setProductCode] = useState('');
  const [side, setSide] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  
  // Pagination
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(20);
  
  // Data
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [trades, setTrades] = useState<TradeDto[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalTrades, setTotalTrades] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Selected item for modal
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<TradeDto | null>(null);
  
  // Toggling include state
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const getDateFilter = useCallback(() => {
    if (datePreset === 'custom') {
      if (customStartDate && customEndDate) {
        return { fromDate: new Date(customStartDate), toDate: new Date(customEndDate) };
      }
      return { fromDate: undefined, toDate: undefined };
    }
    return getDateRange(datePreset);
  }, [datePreset, customStartDate, customEndDate]);

  const fetchOrders = async () => {
    setLoading(true);
    const { fromDate, toDate } = getDateFilter();
    
    const filter: OrderFilter = {
      from: pageNumber,
      size: pageSize,
      ...(username && { username }),
      ...(productCode && { productCode }),
      ...(side && { side: side as any }),
      ...(status && { status: status as any }),
      ...(fromDate && { fromDate: fromDate.toISOString() }),
      ...(toDate && { toDate: toDate.toISOString() }),
    };
    
    try {
      const response = await client.api.getOrders(filter);
      setOrders(response.data?.orders || []);
      setTotalOrders(response.data?.count || 0);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrades = async () => {
    setLoading(true);
    const { fromDate, toDate } = getDateFilter();
    
    const filter: TradeFilter = {
      from: pageNumber,
      size: pageSize,
      ...(username && { username }),
      ...(productCode && { productCode }),
      ...(side && { side: side as any }),
      ...(status && { status: status as any }),
      ...(fromDate && { fromDate: fromDate.toISOString() }),
      ...(toDate && { toDate: toDate.toISOString() }),
      sortDate: 'DESC',
    };
    
    try {
      const response = await client.api.getTrades1(filter);
      setTrades(response.data?.trades || []);
      setTotalTrades(response.data?.count || 0);
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else {
      fetchTrades();
    }
  }, [activeTab, pageNumber, username, productCode, side, status, datePreset, customStartDate, customEndDate]);

  const handleToggleInclude = async (tradeId: number) => {
    setTogglingId(tradeId);
    try {
      await client.api.toggleIncludeInCalculation(tradeId);
      await fetchTrades();
    } catch (error) {
      console.error('Failed to toggle include:', error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleBatchToggleInclude = async (included: boolean) => {
    const selectedIds = trades.filter(t => t.id).map(t => t.id).filter(Boolean) as number[];
    if (selectedIds.length === 0) return;
    
    try {
      await client.api.batchToggleInclude({ included }, selectedIds);
      await fetchTrades();
    } catch (error) {
      console.error('Failed to batch toggle:', error);
    }
  };

  const handleResetFilters = () => {
    setUsername('');
    setProductCode('');
    setSide('');
    setStatus('');
    setDatePreset('today');
    setCustomStartDate('');
    setCustomEndDate('');
    setPageNumber(0);
    setShowAdvancedFilter(false);
  };

  const handleExport = () => {
    if (activeTab === 'orders') {
      exportToCSV(orders, 'orders');
    } else {
      exportToCSV(trades, 'trades');
    }
  };

  const hasFilters = username || productCode || side || status || datePreset !== 'today';

  const hasActiveFilterValues = username || productCode || side || status;

  return (
    <div className="bg-white dark:bg-background-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
      {/* Tabs - بدون تایتل */}
      <div className="flex border-b border-border-light dark:border-border-dark px-6">
        <button
          onClick={() => {
            setActiveTab('orders');
            setPageNumber(0);
          }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'orders'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          سفارشات
          {totalOrders > 0 && (
            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
              {totalOrders.toLocaleString()}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab('trades');
            setPageNumber(0);
          }}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${
            activeTab === 'trades'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          معاملات اجرا شده
          {totalTrades > 0 && (
            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
              {totalTrades.toLocaleString()}
            </span>
          )}
        </button>
      </div>

      {/* Filter Bar - شبیه صفحه کاربران */}
      <div className="flex flex-col gap-3 p-4 border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-800/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Date Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            {datePresets.map(preset => (
              <button
                key={preset.value}
                onClick={() => setDatePreset(preset.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  datePreset === preset.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-border-light'
                }`}
              >
                {preset.label}
              </button>
            ))}
            {datePreset === 'custom' && (
              <div className="flex items-center gap-2 mr-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={e => setCustomStartDate(e.target.value)}
                  className="rounded-lg border border-border-light bg-white dark:bg-slate-800 px-2 py-1 text-xs"
                />
                <span className="text-xs text-slate-400">تا</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={e => setCustomEndDate(e.target.value)}
                  className="rounded-lg border border-border-light bg-white dark:bg-slate-800 px-2 py-1 text-xs"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilter(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                hasActiveFilterValues
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              فیلتر
              {hasActiveFilterValues && (
                <span className="w-4 h-4 text-[10px] bg-white/20 rounded-full flex items-center justify-center">
                  {[username, productCode, side, status].filter(v => v).length}
                </span>
              )}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
              title="خروجی اکسل"
            >
              <Download className="w-4 h-4" />
              خروجی
            </button>
            <button
              onClick={() => activeTab === 'orders' ? fetchOrders() : fetchTrades()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              بروزرسانی
            </button>
            {hasFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 px-2 py-1"
              >
                <X className="w-3 h-3" />
                حذف فیلترها
              </button>
            )}
            <span className="text-xs text-slate-400 mr-2">
              {activeTab === 'orders' ? totalOrders : totalTrades} مورد
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Filter Popup */}
      <AdvancedFilterPopup
        open={showAdvancedFilter}
        onClose={() => setShowAdvancedFilter(false)}
        username={username}
        setUsername={setUsername}
        productCode={productCode}
        setProductCode={setProductCode}
        side={side}
        setSide={setSide}
        status={status}
        setStatus={setStatus}
        onApply={() => { setPageNumber(0); }}
      />

      {/* Batch Actions - فقط برای تب معاملات */}
      {activeTab === 'trades' && trades.length > 0 && (
        <div className="px-4 py-2 border-b border-border-light dark:border-border-dark bg-amber-50/50 dark:bg-amber-950/10 flex flex-wrap items-center gap-2">
          <span className="text-xs text-amber-600 dark:text-amber-400">عملیات گروهی Breakeven:</span>
          <button
            onClick={() => handleBatchToggleInclude(true)}
            className="px-3 py-1 rounded-lg text-xs bg-green-100 text-green-700 hover:bg-green-200 transition-all"
          >
            شامل کردن همه
          </button>
          <button
            onClick={() => handleBatchToggleInclude(false)}
            className="px-3 py-1 rounded-lg text-xs bg-red-100 text-red-700 hover:bg-red-200 transition-all"
          >
            خارج کردن همه
          </button>
        </div>
      )}

      {/* Orders Table */}
      {activeTab === 'orders' && (
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-base text-slate-400">سفارشی یافت نشد</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">شناسه</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">کاربر</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">محصول</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">سمت</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">مقدار</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">جمع کل</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">وضعیت</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">تاریخ</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {orders.map(order => {
                  const statusBadge = getOrderStatusBadge(order.status);
                  const sideBadge = getSideBadge(order.side);
                  return (
                    <tr key={order.orderId} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {order.orderId}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                        {order.user?.username || order.user?.mobileNumber || '---'}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">{order.orderProductCode || order.asset || '---'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={sideBadge.variant} size="sm">{sideBadge.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{formatNumber(order.quantity)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary">{formatNumber(order.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadge.variant} size="sm">{statusBadge.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDateTime(order.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Trades Table */}
      {activeTab === 'trades' && (
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : trades.length === 0 ? (
            <div className="text-center py-20">
              <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-base text-slate-400">معامله‌ای یافت نشد</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light bg-slate-50 dark:bg-slate-800/50">
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">شناسه</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">کاربر</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">محصول</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">سمت</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">مقدار</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">قیمت اجرا</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">ارزش کل</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">کارمزد</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">تاریخ</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {trades.map(trade => {
                  const sideBadge = getSideBadge(trade.order?.side);
                  return (
                    <tr key={trade.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {trade.id}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                        {trade.user?.username || trade.user?.mobileNumber || '---'}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono">{trade.productCode || trade.product || '---'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={sideBadge.variant} size="sm">{sideBadge.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{formatNumber(trade.quantity)}</td>
                      <td className="px-4 py-3 text-sm">{formatNumber(trade.executionPrice)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary">{formatNumber(trade.notional)}</td>
                      <td className="px-4 py-3 text-sm">{formatNumber(trade.feeAmount)}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{formatDateTime(trade.executedAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedTrade(trade)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => trade.id && handleToggleInclude(trade.id)}
                            disabled={togglingId === trade.id}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all disabled:opacity-50"
                          >
                            {togglingId === trade.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RotateCcw className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && ((activeTab === 'orders' && totalOrders > pageSize) || (activeTab === 'trades' && totalTrades > pageSize)) && (
        <div className="px-6 py-4 border-t border-border-light bg-slate-50/50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              نمایش {pageNumber * pageSize + 1} تا {Math.min((pageNumber + 1) * pageSize, activeTab === 'orders' ? totalOrders : totalTrades)} از {(activeTab === 'orders' ? totalOrders : totalTrades).toLocaleString()} {activeTab === 'orders' ? 'سفارش' : 'معامله'}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={pageNumber === 0}
                onClick={() => setPageNumber(p => p - 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-border-light text-slate-600 disabled:opacity-30 hover:bg-slate-50"
              >
                <ChevronRight className="w-3.5 h-3.5" />
                قبلی
              </button>
              <button
                disabled={(pageNumber + 1) * pageSize >= (activeTab === 'orders' ? totalOrders : totalTrades)}
                onClick={() => setPageNumber(p => p + 1)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white disabled:opacity-30 hover:bg-primary/90"
              >
                بعدی
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
      {selectedTrade && (
        <TradeDetailModal 
          trade={selectedTrade} 
          onClose={() => setSelectedTrade(null)} 
          onToggleInclude={handleToggleInclude}
        />
      )}
    </div>
  );
}