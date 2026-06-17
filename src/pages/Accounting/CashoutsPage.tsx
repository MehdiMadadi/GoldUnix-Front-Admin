// CashoutsPage.tsx
import { useEffect, useState } from 'react';
import { Api, CashoutDto, CashoutFilterDto } from '../../lib/client';
import Badge from '../../components/UI/Badge';
import { 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  Wallet, 
  Filter, 
  X, 
  RefreshCw, 
  ArrowUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  RotateCcw, 
  Ban,
  Download,
  Hash
} from 'lucide-react';

const CASHOUT_STATUS_MAP: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'danger' | 'neutral'; icon: typeof Clock }> = {
    Requested: { label: 'درخواست شده', variant: 'warning', icon: Clock },
    InProcessing: { label: 'در حال پردازش', variant: 'info', icon: AlertCircle },
    SentBank: { label: 'ارسال به بانک', variant: 'info', icon: ArrowUp },
    Completed: { label: 'تکمیل شده', variant: 'success', icon: CheckCircle },
    Reject: { label: 'رد شده', variant: 'danger', icon: XCircle },
    Reverse: { label: 'برگشت خورده', variant: 'danger', icon: RotateCcw },
    Cancelled: { label: 'لغو شده', variant: 'neutral', icon: Ban },
};

const STATUS_FILTERS = [
    { code: '', label: 'همه' },
    { code: 'Requested', label: 'درخواست شده' },
    { code: 'InProcessing', label: 'در حال پردازش' },
    { code: 'SentBank', label: 'ارسال به بانک' },
    { code: 'Completed', label: 'تکمیل شده' },
    { code: 'Reject', label: 'رد شده' },
    { code: 'Reverse', label: 'برگشت خورده' },
    { code: 'Cancelled', label: 'لغو شده' },
];

const CHANGE_STATUS_OPTIONS = [
    { value: 'InProcessing', label: 'در حال پردازش' },
    { value: 'SentBank', label: 'ارسال به بانک' },
    { value: 'Completed', label: 'تکمیل شده' },
    { value: 'Reject', label: 'رد شده' },
    { value: 'Reverse', label: 'برگشت خورده' },
    { value: 'Cancelled', label: 'لغو شده' },
];

// ===== Export to CSV =====
function exportToCSV(cashouts: CashoutDto[]) {
  if (cashouts.length === 0) return;

  const headers = ['شناسه', 'شماره مقصد', 'نام مقصد', 'مبلغ (ریال)', 'وضعیت', 'کد پیگیری خارجی', 'STAN', 'تاریخ ثبت', 'تاریخ ارسال'];
  const rows = cashouts.map(item => [
    item.id || '',
    item.destinationNumber || '',
    item.destinationName || '',
    item.amount || 0,
    item.statusType || '',
    item.externalReference || '',
    item.stan || '',
    item.entryDate ? new Date(item.entryDate).toLocaleString('fa-IR') : '',
    item.postDate ? new Date(item.postDate).toLocaleString('fa-IR') : ''
  ]);

  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];
  link.download = `cashouts_${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// ===== Advanced Filter Popup =====
function AdvancedFilterPopup({
  open,
  onClose,
  idFilter,
  setIdFilter,
  statusType,
  setStatusType,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  idFilter: string;
  setIdFilter: (v: string) => void;
  statusType: string;
  setStatusType: (v: string) => void;
  onApply: () => void;
}) {
  if (!open) return null;

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
            <label className="block text-xs font-semibold text-slate-500 mb-2">شناسه پیگیری</label>
            <div className="relative">
              <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="شماره پیگیری..."
                value={idFilter}
                onChange={e => setIdFilter(e.target.value)}
                className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">وضعیت</label>
            <select
              value={statusType}
              onChange={e => setStatusType(e.target.value)}
              className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 transition-all cursor-pointer"
            >
              {STATUS_FILTERS.map(status => (
                <option key={status.code} value={status.code}>{status.label}</option>
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

// ===== Cashout Detail Drawer =====
function CashoutDetailDrawer({
    cashout,
    onClose,
    onStatusChange
}: {
    cashout: CashoutDto | null;
    onClose: () => void;
    onStatusChange: (id: number, status: string) => void;
}) {
    const [newStatus, setNewStatus] = useState('');
    const [changing, setChanging] = useState(false);

    if (!cashout) return null;

    const status = cashout.statusType ? CASHOUT_STATUS_MAP[cashout.statusType] : null;
    const StatusIcon = status?.icon || Clock;

    const handleChangeStatus = async () => {
        if (!newStatus || !cashout.id) return;
        setChanging(true);
        try {
            await onStatusChange(cashout.id, newStatus);
            setNewStatus('');
        } finally {
            setChanging(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-surface-dark shadow-2xl border-l border-border-light dark:border-border-dark overflow-y-auto">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">جزئیات برداشت وجه</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 transition-colors">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    <div className="flex items-center gap-2">
                        {status && (
                            <Badge variant={status.variant}>
                                <span className="flex items-center gap-1">
                                    <StatusIcon className="w-3 h-3" />
                                    {status.label}
                                </span>
                            </Badge>
                        )}
                        <span className="text-[11px] text-slate-400">کد پیگیری: {cashout.id}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 text-center">
                        <p className="text-xs text-slate-500 mb-2">مبلغ برداشت</p>
                        <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                            {cashout.amount?.toLocaleString('fa-IR') ?? '---'}
                            <span className="text-sm font-normal text-slate-400 mr-2">ریال</span>
                        </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 space-y-4">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">اطلاعات برداشت</h4>
                        <div className="grid grid-cols-1 gap-4 text-sm">
                            <div>
                                <span className="text-slate-400 text-xs block mb-1">شماره مقصد</span>
                                <span className="font-medium text-slate-900 dark:text-white font-mono" dir="ltr">
                                    {cashout.destinationNumber || '---'}
                                </span>
                            </div>
                            {cashout.destinationName && (
                                <div>
                                    <span className="text-slate-400 text-xs block mb-1">نام مقصد</span>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {cashout.destinationName}
                                    </span>
                                </div>
                            )}
                            {cashout.externalReference && (
                                <div>
                                    <span className="text-slate-400 text-xs block mb-1">کد پیگیری خارجی</span>
                                    <span className="font-medium text-slate-900 dark:text-white font-mono" dir="ltr">
                                        {cashout.externalReference}
                                    </span>
                                </div>
                            )}
                            {cashout.stan && (
                                <div>
                                    <span className="text-slate-400 text-xs block mb-1">شماره STAN</span>
                                    <span className="font-medium text-slate-900 dark:text-white font-mono" dir="ltr">
                                        {cashout.stan}
                                    </span>
                                </div>
                            )}
                            <div>
                                <span className="text-slate-400 text-xs block mb-1">تاریخ ثبت</span>
                                <span className="font-medium text-slate-900 dark:text-white">
                                    {cashout.entryDate ? new Date(cashout.entryDate).toLocaleString('fa-IR') : '---'}
                                </span>
                            </div>
                            {cashout.postDate && (
                                <div>
                                    <span className="text-slate-400 text-xs block mb-1">تاریخ ارسال</span>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {new Date(cashout.postDate).toLocaleString('fa-IR')}
                                    </span>
                                </div>
                            )}
                            {cashout.reverseReference && (
                                <div>
                                    <span className="text-slate-400 text-xs block mb-1">کد پیگیری برگشت</span>
                                    <span className="font-medium text-slate-900 dark:text-white font-mono" dir="ltr">
                                        {cashout.reverseReference}
                                    </span>
                                </div>
                            )}
                            {cashout.reverseDateTime && (
                                <div>
                                    <span className="text-slate-400 text-xs block mb-1">تاریخ برگشت</span>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {new Date(cashout.reverseDateTime).toLocaleString('fa-IR')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400">تغییر وضعیت</h4>
                        <select
                            value={newStatus}
                            onChange={e => setNewStatus(e.target.value)}
                            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 transition-all cursor-pointer"
                        >
                            <option value="">انتخاب وضعیت جدید...</option>
                            {CHANGE_STATUS_OPTIONS.filter(opt => opt.value !== cashout.statusType).map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleChangeStatus}
                            disabled={!newStatus || changing}
                            className="w-full px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {changing ? 'در حال اعمال...' : 'اعمال تغییر'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===== Main Component =====
export default function CashoutsPage() {
    const [cashouts, setCashouts] = useState<CashoutDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<CashoutDto | null>(null);
    const [statusType, setStatusType] = useState('');
    const [idFilter, setIdFilter] = useState('');
    const [pageNumber, setPageNumber] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
    const pageSize = 10;

    const client = new Api();

    const fetchCashouts = async () => {
        setLoading(true);
        try {
            const filter: CashoutFilterDto = {
                statusType: statusType || undefined,
                id: idFilter ? parseInt(idFilter) : undefined,
                from: pageNumber,
                size: pageSize,
            };
            const response = await client.api.getCashouts(filter);
            setCashouts(response.data || []);
            setTotalCount(response.data?.length === pageSize ? (pageNumber + 2) * pageSize : (pageNumber + 1) * pageSize);
        } catch (error) {
            console.error('Failed to fetch cashouts:', error);
            setCashouts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCashouts();
    }, [pageNumber, statusType, idFilter]);

    const handleSearch = () => {
        setPageNumber(0);
        fetchCashouts();
    };

    const handleStatusChange = async (id: number, status: string) => {
        try {
            await client.api.cashoutsChangeStatus({ id, statusType: status as any });
            fetchCashouts();
            setSelected(null);
        } catch (error) {
            console.error('Failed to change status:', error);
        }
    };

    const handleReset = () => {
        setStatusType('');
        setIdFilter('');
        setPageNumber(0);
        setShowAdvancedFilter(false);
    };

    const handleExport = () => {
        exportToCSV(cashouts);
    };

    const hasFilters = statusType !== '' || idFilter !== '';
    const hasActiveFilterValues = statusType !== '' || idFilter !== '';

    return (
        <div className="bg-white dark:bg-background-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
            {/* فقط تب‌ها - بدون تایتل */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border-light dark:border-border-dark bg-slate-50/30 dark:bg-slate-800/10">
                <div className="flex items-center gap-6">
                    <span className="text-sm font-bold text-slate-900 dark:text-white border-b-2 border-primary pb-2">
                        درخواست‌های برداشت
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{totalCount} درخواست</span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col gap-3 p-4 border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* جستجوی شماره پیگیری - بیرون */}
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="جستجوی شماره پیگیری..."
                            value={idFilter}
                            onChange={e => setIdFilter(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 placeholder:text-slate-400 transition-all"
                        />
                        {idFilter && (
                            <button
                                onClick={() => { setIdFilter(''); setPageNumber(0); }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
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
                                    {[statusType, idFilter].filter(v => v).length}
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
                            onClick={fetchCashouts}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                            بروزرسانی
                        </button>
                        {hasFilters && (
                            <button
                                onClick={handleReset}
                                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 px-2 py-1"
                            >
                                <X className="w-3 h-3" />
                                حذف فیلترها
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Advanced Filter Popup */}
            <AdvancedFilterPopup
                open={showAdvancedFilter}
                onClose={() => setShowAdvancedFilter(false)}
                idFilter={idFilter}
                setIdFilter={setIdFilter}
                statusType={statusType}
                setStatusType={setStatusType}
                onApply={() => { setPageNumber(0); fetchCashouts(); }}
            />

            {/* Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">شناسه</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">شماره مقصد</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">نام مقصد</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">مبلغ (ریال)</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">وضعیت</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">تاریخ ثبت</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {cashouts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-16 text-center">
                                        <Wallet className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                        <p className="text-sm text-slate-400">درخواست برداشتی یافت نشد</p>
                                    </td>
                                </tr>
                            ) : (
                                cashouts.map(cashout => {
                                    const status = cashout.statusType ? CASHOUT_STATUS_MAP[cashout.statusType] : null;
                                    const StatusIcon = status?.icon || Clock;
                                    return (
                                        <tr
                                            key={cashout.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                                            onClick={() => setSelected(cashout)}
                                        >
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                    {cashout.id || '---'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-mono text-slate-600 dark:text-slate-400" dir="ltr">
                                                    {cashout.destinationNumber || '---'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm text-slate-700 dark:text-slate-300">
                                                    {cashout.destinationName || '---'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {cashout.amount?.toLocaleString('fa-IR') ?? '---'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {status && (
                                                    <Badge variant={status.variant} size="sm">
                                                        <span className="items-center gap-1">
                                                            {status.label}
                                                        </span>
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    {cashout.entryDate ? new Date(cashout.entryDate).toLocaleString('fa-IR') : '---'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        onClick={() => setSelected(cashout)}
                                                        title="مشاهده جزئیات"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {!loading && cashouts.length > 0 && (
                <div className="px-4 py-3 border-t border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-800/20">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            صفحه {pageNumber + 1}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={pageNumber === 0}
                                onClick={() => setPageNumber(p => Math.max(0, p - 1))}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                                قبلی
                            </button>
                            <button
                                disabled={cashouts.length < pageSize}
                                onClick={() => setPageNumber(p => p + 1)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
                            >
                                بعدی
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Drawer */}
            <CashoutDetailDrawer
                cashout={selected}
                onClose={() => setSelected(null)}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
}