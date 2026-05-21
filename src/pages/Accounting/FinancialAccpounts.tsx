import { useEffect, useState } from 'react';
import { Api, FinancialAccountDto, TotalFinancialAccountResponseDto } from '../../lib/client';
import Badge from '../../components/UI/Badge';
import AccDrawer from '../../components/Accounting/AccDrawer';
import { Search, ChevronRight, ChevronLeft, Eye, Wallet, Banknote, RefreshCw, X, Filter, ChevronDown } from 'lucide-react';

const ACCOUNT_STATUS_MAP: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' | 'info' }> = {
  ACV: { label: 'فعال', variant: 'success' },
  DAT: { label: 'غیر فعال', variant: 'danger' },
  SYBLC: { label: 'بلاک شده توسط سیستم', variant: 'danger' },
  BLC: { label: 'مسدود شده کاربر', variant: 'warning' },
  BABLC: { label: 'مسدود شده توسط بانک', variant: 'danger' },
};

const ACCOUNT_TYPES = [
  { code: '', label: 'همه نوع‌ها' },
  { code: 'WAL', label: 'کیف پول' },
  { code: 'FEWAL', label: 'کیف پول کارمزد' },
  { code: 'CASH', label: 'صندوق نقدی' },
  { code: 'MARGINWAL', label: 'کیف پول تعهدی' },
  { code: 'CREDITWAL', label: 'کیف پول اعتباری' },
];

const ASSET_TYPES = [
  { code: '', label: 'همه ارزها' },
  { code: 'GOLD', label: 'طلا (GOLD)' },
  { code: 'SILVER', label: 'نقره (SILVER)' },
  { code: 'TMN', label: 'تومان (TMN)' },
];

const STATUS_TYPES = [
  { code: '', label: 'همه وضعیت‌ها' },
  { code: 'ACV', label: 'فعال' },
  { code: 'DAT', label: 'غیر فعال' },
  { code: 'SYBLC', label: 'بلاک شده توسط سیستم' },
  { code: 'BLC', label: 'مسدود شده کاربر' },
  { code: 'BABLC', label: 'مسدود شده توسط بانک' },
];

function AccountDetailDrawer({ account, onClose }: { account: FinancialAccountDto | null; onClose: () => void }) {
  if (!account) return null;

  const status = account.status?.code ? ACCOUNT_STATUS_MAP[account.status.code] : null;

  return (
    <AccDrawer
      open={account !== null}
      title={account.name || 'جزئیات حساب'}
      subtitle={account.accountNumber}
      icon="account_balance"
      onClose={onClose}
    >
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-2 flex-wrap">
          {status && <Badge variant={status.variant}>{status.label}</Badge>}
          {account.type?.description && <Badge variant="info">{account.type.description}</Badge>}
          {account.currency?.name && <Badge variant="default">{account.currency.name}</Badge>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-5">
            <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" />
              موجودی
            </p>
            <p className="font-extrabold text-emerald-700 dark:text-emerald-300 text-xl">
              {account.balances?.balance?.toLocaleString('fa-IR') ?? '---'}
              <span className="text-sm font-normal text-slate-400 mr-1.5">{account.currency?.name}</span>
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-5">
            <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
              <Banknote className="w-3.5 h-3.5" />
              مسدود
            </p>
            <p className="font-extrabold text-amber-700 dark:text-amber-300 text-xl">
              {account.balances?.blockBalance?.toLocaleString('fa-IR') ?? '---'}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">اطلاعات حساب</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <span className="text-slate-400 text-xs block mb-1">نوع حساب</span>
              <span className="font-medium text-slate-900 dark:text-white">{account.type?.description || '---'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block mb-1">کد نوع حساب</span>
              <span className="font-medium text-slate-900 dark:text-white">{account.type?.code || '---'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block mb-1">ارز</span>
              <span className="font-medium text-slate-900 dark:text-white">{account.currency?.name || '---'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-xs block mb-1">کد ارز</span>
              <span className="font-medium text-slate-900 dark:text-white">{account.currency?.code || '---'}</span>
            </div>
            {account.provider && (
              <>
                <div>
                  <span className="text-slate-400 text-xs block mb-1">ارائه‌دهنده</span>
                  <span className="font-medium text-slate-900 dark:text-white">{account.provider.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block mb-1">کد ارائه‌دهنده</span>
                  <span className="font-medium text-slate-900 dark:text-white">{account.provider.code}</span>
                </div>
              </>
            )}
            {account.createdJalaliDate && (
              <div className="col-span-2">
                <span className="text-slate-400 text-xs block mb-1">تاریخ ایجاد</span>
                <span className="font-medium text-slate-900 dark:text-white">{account.createdJalaliDate}</span>
              </div>
            )}
          </div>
          {account.description && (
            <div>
              <span className="text-slate-400 text-xs block mb-1">توضیحات</span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{account.description}</p>
            </div>
          )}
        </div>
      </div>
    </AccDrawer>
  );
}

// Advanced Filter Popup
function AdvancedFilterPopup({
  open,
  onClose,
  assetTypeCode,
  setAssetTypeCode,
  accountStatusCode,
  setAccountStatusCode,
  accountNumber,
  setAccountNumber,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  assetTypeCode: string;
  setAssetTypeCode: (v: string) => void;
  accountStatusCode: string;
  setAccountStatusCode: (v: string) => void;
  accountNumber: string;
  setAccountNumber: (v: string) => void;
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
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">شماره حساب</label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="جستجوی شماره حساب..."
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">ارز</label>
            <select
              value={assetTypeCode}
              onChange={e => setAssetTypeCode(e.target.value)}
              className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 transition-all cursor-pointer"
            >
              {ASSET_TYPES.map(asset => (
                <option key={asset.code} value={asset.code}>{asset.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">وضعیت</label>
            <select
              value={accountStatusCode}
              onChange={e => setAccountStatusCode(e.target.value)}
              className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 transition-all cursor-pointer"
            >
              {STATUS_TYPES.map(status => (
                <option key={status.code} value={status.code}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border-light dark:border-border-dark bg-slate-50 dark:bg-background-dark/50">
          <button
            onClick={() => { onApply(); onClose(); }}
            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95"
          >
            اعمال فیلترها
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FinancialAccountsPage() {
  const [accounts, setAccounts] = useState<FinancialAccountDto[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [asset, setAsset] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<FinancialAccountDto | null>(null);

  // Filters
  const [accountTypeCode, setAccountTypeCode] = useState('');
  
  // Advanced filters (inside popup)
  const [accountNumber, setAccountNumber] = useState('');
  const [assetTypeCode, setAssetTypeCode] = useState('');
  const [accountStatusCode, setAccountStatusCode] = useState('');
  
  // Popup state
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  
  // Track if advanced filters are active
  const hasAdvancedFilters = accountNumber !== '' || assetTypeCode !== '' || accountStatusCode !== '';

  // Pagination
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 10;

  const client = new Api();

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await client.api.getTotalWallets({
        accountNumber: accountNumber || undefined,
        accountTypeCode: accountTypeCode || undefined,
        accountStatusCode: accountStatusCode || undefined,
        assetTypeCode: assetTypeCode || undefined,
        pageNumber: pageNumber,
        pageSize: pageSize,
      });

      const data = response.data as TotalFinancialAccountResponseDto;
      setAccounts(data.accounts || []);
      setTotalBalance(data.totalBalance || 0);
      setTotalCount(data.totalCountAccount || 0);
      setAsset(data.asset || '');
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      setAccounts([]);
      setTotalBalance(0);
      setTotalCount(0);
      setAsset('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [pageNumber, accountTypeCode]);

  const handleSearch = () => {
    setPageNumber(0);
    fetchAccounts();
  };

  const handleReset = () => {
    setAccountTypeCode('');
    setAccountNumber('');
    setAssetTypeCode('');
    setAccountStatusCode('');
    setPageNumber(0);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="max-w-full mx-auto">
      {/* Summary Box */}
      <div className="px-6 py-5 border-b border-border-light dark:border-border-dark">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent rounded-2xl p-6 flex items-center justify-between border border-primary/10">
          <div>
            <p className="text-xs text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Wallet className="w-4 h-4" />
              جمع موجودی حساب‌ها
              {asset && <span className="text-[10px] text-slate-400">({asset})</span>}
            </p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalBalance.toLocaleString('fa-IR')}
            </p>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{totalCount.toLocaleString('fa-IR')}</p>
            <p className="text-xs text-slate-400">تعداد حساب</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs + Advanced Button */}
      <div className="px-6 py-4 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center gap-3">
          {/* Account Type Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto flex-1 pb-1">
            {ACCOUNT_TYPES.map(type => {
              const isActive = accountTypeCode === type.code;
              return (
                <button
                  key={type.code}
                  onClick={() => {
                    setAccountTypeCode(type.code);
                    setPageNumber(0);
                  }}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Advanced Filter Button */}
          <button
            onClick={() => setAdvancedFilterOpen(true)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              hasAdvancedFilters
                ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            جستجوی پیشرفته
            {hasAdvancedFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Reset Button */}
          {hasAdvancedFilters && (
            <button
              onClick={handleReset}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
              title="حذف فیلترها"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-border-light dark:border-border-dark">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                    <th className="px-6 py-4 text-right font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">شماره حساب</th>
                    <th className="px-6 py-4 text-right font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">نام حساب</th>
                    <th className="px-6 py-4 text-right font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">نوع</th>
                    <th className="px-6 py-4 text-right font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">ارز</th>
                    <th className="px-6 py-4 text-right font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">موجودی</th>
                    <th className="px-6 py-4 text-right font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">ارائه‌دهنده</th>
                    <th className="px-6 py-4 text-right font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">وضعیت</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center">
                        <Wallet className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">حسابی یافت نشد</p>
                      </td>
                    </tr>
                  ) : (
                    accounts.map(account => {
                      const status = account.status?.code ? ACCOUNT_STATUS_MAP[account.status.code] : null;
                      return (
                        <tr
                          key={account.id ?? account.accountId}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group"
                          onClick={() => setSelected(account)}
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                              {account.accountNumber || '---'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                              {account.name || '---'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              {account.type?.description || '---'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                              {account.currency?.name || '---'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {account.balances?.balance?.toLocaleString('fa-IR') ?? '---'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {account.provider?.name || '---'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {status && <Badge variant={status.variant}>{status.label}</Badge>}
                          </td>
                          <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => setSelected(account)}
                                title="مشاهده جزئیات"
                                className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-all hover:scale-110 active:scale-95"
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
            </div>

            {/* Desktop Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 px-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  نمایش {(pageNumber * pageSize) + 1} تا {Math.min((pageNumber + 1) * pageSize, totalCount)} از {totalCount.toLocaleString('fa-IR')} حساب
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={pageNumber === 0}
                    onClick={() => setPageNumber(p => Math.max(0, p - 1))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    قبلی
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageToShow: number;
                      if (totalPages <= 5) {
                        pageToShow = i;
                      } else if (pageNumber < 3) {
                        pageToShow = i;
                      } else if (pageNumber > totalPages - 4) {
                        pageToShow = totalPages - 5 + i;
                      } else {
                        pageToShow = pageNumber - 2 + i;
                      }
                      return (
                        <button
                          key={pageToShow}
                          onClick={() => setPageNumber(pageToShow)}
                          className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${pageNumber === pageToShow
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                        >
                          {pageToShow + 1}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    disabled={pageNumber >= totalPages - 1}
                    onClick={() => setPageNumber(p => Math.min(totalPages - 1, p + 1))}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
                  >
                    بعدی
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-16">
            <Wallet className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">حسابی یافت نشد</p>
          </div>
        ) : (
          <>
            {accounts.map(account => {
              const status = account.status?.code ? ACCOUNT_STATUS_MAP[account.status.code] : null;
              return (
                <div
                  key={account.id ?? account.accountId}
                  className="bg-white dark:bg-background-dark border border-border-light dark:border-border-dark rounded-2xl p-4 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all active:scale-[0.98]"
                  onClick={() => setSelected(account)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {account.name || '---'}
                      </p>
                      <p className="font-mono text-xs text-slate-400 mt-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md inline-block">
                        {account.accountNumber || '---'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {status && <Badge variant={status.variant}>{status.label}</Badge>}
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-600 dark:text-slate-400">
                        {account.currency?.name || '---'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-2.5">
                      <p className="text-[0.6rem] text-slate-500 mb-0.5">موجودی</p>
                      <p className="font-bold text-xs text-emerald-700 dark:text-emerald-300">
                        {account.balances?.balance?.toLocaleString('fa-IR') ?? '---'}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5">
                      <p className="text-[0.6rem] text-slate-500 mb-0.5">نوع</p>
                      <p className="font-bold text-xs text-slate-700 dark:text-slate-300">
                        {account.type?.description || '---'}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5">
                      <p className="text-[0.6rem] text-slate-500 mb-0.5">ارائه‌دهنده</p>
                      <p className="font-bold text-xs text-slate-700 dark:text-slate-300 truncate">
                        {account.provider?.name || '---'}
                      </p>
                    </div>
                  </div>

                  <button className="w-full py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all flex items-center justify-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    مشاهده جزئیات
                  </button>
                </div>
              );
            })}

            {/* Mobile Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 bg-white dark:bg-background-dark rounded-2xl p-3 border border-border-light dark:border-border-dark">
                <button
                  disabled={pageNumber === 0}
                  onClick={() => setPageNumber(p => Math.max(0, p - 1))}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 disabled:opacity-30"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  قبلی
                </button>
                <span className="text-xs text-slate-500">
                  {pageNumber + 1} از {totalPages}
                </span>
                <button
                  disabled={pageNumber >= totalPages - 1}
                  onClick={() => setPageNumber(p => Math.min(totalPages - 1, p + 1))}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-primary text-white disabled:opacity-30"
                >
                  بعدی
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Drawer */}
      <AccountDetailDrawer account={selected} onClose={() => setSelected(null)} />

      {/* Advanced Filter Popup */}
      <AdvancedFilterPopup
        open={advancedFilterOpen}
        onClose={() => setAdvancedFilterOpen(false)}
        assetTypeCode={assetTypeCode}
        setAssetTypeCode={setAssetTypeCode}
        accountStatusCode={accountStatusCode}
        setAccountStatusCode={setAccountStatusCode}
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
        onApply={handleSearch}
      />
    </div>
  );
}