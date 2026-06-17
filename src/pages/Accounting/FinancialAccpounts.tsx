// pages/admin/FinancialAccountsPage.tsx
import { useEffect, useState } from 'react';
import { Api, FinancialAccountDto, TotalFinancialAccountResponseDto, TransferRequestDto, DepositRequestDto, WithdrawalAccountRequest, AccountChangeStatusDto } from '../../lib/client';
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
  Plus,
  Minus,
  ArrowRightLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  Copy,
  Download,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const ACCOUNT_STATUS_MAP: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' | 'info' | 'neutral' }> = {
  ACV: { label: 'فعال', variant: 'success' },
  DAT: { label: 'غیرفعال', variant: 'danger' },
  SYBLC: { label: 'بلاک سیستم', variant: 'danger' },
  BLC: { label: 'مسدود', variant: 'warning' },
  BABLC: { label: 'مسدود بانک', variant: 'danger' },
};

const ACCOUNT_TYPES = [
  { code: '', label: 'همه' },
  { code: 'WAL', label: 'کیف پول' },
  { code: 'FEWAL', label: 'کارمزد' },
  { code: 'CASH', label: 'صندوق' },
  { code: 'MARGINWAL', label: 'تعهدی' },
  { code: 'CREDITWAL', label: 'اعتباری' },
];

const ASSET_TYPES = [
  { code: '', label: 'همه ارزها' },
  { code: 'GOLD', label: 'طلا' },
  { code: 'SILVER', label: 'نقره' },
  { code: 'TMN', label: 'تومان' },
  { code: 'USDT', label: 'تتر' },
  { code: 'BTC', label: 'بیت‌کوین' },
  { code: 'ETH', label: 'اتریوم' },
];

const STATUS_TYPES = [
  { code: '', label: 'همه وضعیت‌ها' },
  { code: 'ACV', label: 'فعال' },
  { code: 'DAT', label: 'غیرفعال' },
  { code: 'SYBLC', label: 'بلاک سیستم' },
  { code: 'BLC', label: 'مسدود' },
  { code: 'BABLC', label: 'مسدود بانک' },
];

// ===== Export to CSV =====
function exportToCSV(accounts: FinancialAccountDto[]) {
  if (accounts.length === 0) return;

  const headers = ['شماره حساب', 'نام حساب', 'نوع', 'ارز', 'موجودی', 'موجودی قابل استفاده', 'مسدود', 'وضعیت'];
  const rows = accounts.map(item => [
    item.accountNumber || '',
    item.name || '',
    item.type?.description || '',
    item.currency?.name || '',
    item.balances?.balance || 0,
    item.balances?.availableBalance || 0,
    item.balances?.blockBalance || 0,
    item.status?.description || ''
  ]);

  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];
  link.download = `financial_accounts_${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// ===== Account Detail Drawer =====
function AccountDetailDrawer({ 
  account, 
  onClose,
  onDeposit,
  onWithdraw,
  onTransfer,
  onChangeStatus
}: { 
  account: FinancialAccountDto | null; 
  onClose: () => void;
  onDeposit: (data: DepositRequestDto) => Promise<void>;
  onWithdraw: (data: WithdrawalAccountRequest) => Promise<void>;
  onTransfer: (data: TransferRequestDto) => Promise<void>;
  onChangeStatus: (data: AccountChangeStatusDto) => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState<'info' | 'deposit' | 'withdraw' | 'transfer'>('info');
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  // Deposit form
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDesc, setDepositDesc] = useState('');
  
  // Withdraw form
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawToAccount, setWithdrawToAccount] = useState('');
  
  // Transfer form
  const [transferAmount, setTransferAmount] = useState('');
  const [transferToAccount, setTransferToAccount] = useState('');
  const [transferDesc, setTransferDesc] = useState('');

  if (!account) return null;

  const status = account.status?.code ? ACCOUNT_STATUS_MAP[account.status.code] : null;

  const handleDeposit = async () => {
    if (!depositAmount || !account.accountNumber) return;
    setLoading(true);
    try {
      await onDeposit({
        accountNumber: account.accountNumber,
        amount: parseFloat(depositAmount),
        description: depositDesc || undefined,
        currency: account.currency?.code
      });
      setDepositAmount('');
      setDepositDesc('');
      setActiveTab('info');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !account.accountNumber) return;
    setLoading(true);
    try {
      await onWithdraw({
        fromAccount: account.accountNumber,
        description: withdrawToAccount || undefined,
        amount: parseFloat(withdrawAmount)
      });
      setWithdrawAmount('');
      setWithdrawToAccount('');
      setActiveTab('info');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || !account.accountNumber || !transferToAccount) return;
    setLoading(true);
    try {
      await onTransfer({
        fromAccountNumber: account.accountNumber,
        toAccountNumber: transferToAccount,
        amount: parseFloat(transferAmount),
        description: transferDesc || undefined
      });
      setTransferAmount('');
      setTransferToAccount('');
      setTransferDesc('');
      setActiveTab('info');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus || !account.accountNumber) return;
    setLoading(true);
    try {
      await onChangeStatus({
        accountNumber: account.accountNumber,
        statusCode: newStatus
      });
      setNewStatus('');
      setActiveTab('info');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'info', label: 'اطلاعات' },
    { id: 'deposit', label: 'واریز', icon: <Plus className="w-3.5 h-3.5" /> },
    { id: 'withdraw', label: 'برداشت', icon: <Minus className="w-3.5 h-3.5" /> },
    { id: 'transfer', label: 'انتقال', icon: <ArrowRightLeft className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark shadow-2xl border-l border-border-light dark:border-border-dark overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Wallet className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{account.name || account.accountNumber}</h3>
              <p className="text-[10px] text-slate-400 truncate">{account.accountNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-light dark:border-border-dark overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Balance */}
              <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-4 border border-primary/10">
                <p className="text-xs text-slate-400">موجودی</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {account.balances?.balance?.toLocaleString('fa-IR') ?? '---'}
                  <span className="text-sm font-normal text-slate-400 mr-1">{account.currency?.name}</span>
                </p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span>قابل استفاده: <strong>{account.balances?.availableBalance?.toLocaleString('fa-IR') ?? '---'}</strong></span>
                  <span>مسدود: <strong>{account.balances?.blockBalance?.toLocaleString('fa-IR') ?? '---'}</strong></span>
                </div>
              </div>

              {/* Details */}
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">نوع حساب</span>
                  <span className="font-medium">{account.type?.description || '---'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">ارز</span>
                  <span className="font-medium">{account.currency?.name || '---'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">وضعیت</span>
                  {status && <Badge variant={status.variant} size="sm">{status.label}</Badge>}
                </div>
                {/* {account.provider && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">ارائه‌دهنده</span>
                    <span className="font-medium">{account.provider.name}</span>
                  </div>
                )} */}
                {account.createdJalaliDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">تاریخ ایجاد</span>
                    <span className="font-medium">{account.createdJalaliDate}</span>
                  </div>
                )}
                {account.description && (
                  <div className="text-sm">
                    <span className="text-slate-400">توضیحات</span>
                    <p className="mt-1 text-slate-700 dark:text-slate-300">{account.description}</p>
                  </div>
                )}
              </div>

              {/* Change Status */}
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">تغییر وضعیت</p>
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                    className="flex-1 rounded-lg border border-amber-200 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm"
                  >
                    <option value="">انتخاب وضعیت...</option>
                    {STATUS_TYPES.filter(s => s.code).map(s => (
                      <option key={s.code} value={s.code}>{s.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusChange}
                    disabled={!newStatus || loading}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'اعمال'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deposit' && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-200">
                <p className="text-xs text-green-600 dark:text-green-400">واریز به حساب {account.accountNumber}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">مبلغ</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  placeholder="مبلغ را وارد کنید..."
                  className="w-full rounded-lg border border-border-light bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">توضیحات</label>
                <input
                  type="text"
                  value={depositDesc}
                  onChange={e => setDepositDesc(e.target.value)}
                  placeholder="توضیحات (اختیاری)..."
                  className="w-full rounded-lg border border-border-light bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={handleDeposit}
                disabled={!depositAmount || loading}
                className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'واریز'}
              </button>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200">
                <p className="text-xs text-red-600 dark:text-red-400">برداشت از حساب {account.accountNumber}</p>
                <p className="text-xs text-red-400 mt-1">موجودی قابل استفاده: {account.balances?.availableBalance?.toLocaleString('fa-IR') ?? '---'}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">مبلغ</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="مبلغ را وارد کنید..."
                  className="w-full rounded-lg border border-border-light bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">حساب مقصد</label>
                <input
                  type="text"
                  value={withdrawToAccount}
                  onChange={e => setWithdrawToAccount(e.target.value)}
                  placeholder="شماره حساب مقصد..."
                  className="w-full rounded-lg border border-border-light bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={handleWithdraw}
                disabled={!withdrawAmount || loading}
                className="w-full py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'برداشت'}
              </button>
            </div>
          )}

          {activeTab === 'transfer' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-200">
                <p className="text-xs text-blue-600 dark:text-blue-400">انتقال از {account.accountNumber}</p>
                <p className="text-xs text-blue-400 mt-1">موجودی قابل استفاده: {account.balances?.availableBalance?.toLocaleString('fa-IR') ?? '---'}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">حساب مقصد</label>
                <input
                  type="text"
                  value={transferToAccount}
                  onChange={e => setTransferToAccount(e.target.value)}
                  placeholder="شماره حساب مقصد..."
                  className="w-full rounded-lg border border-border-light bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">مبلغ</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={e => setTransferAmount(e.target.value)}
                  placeholder="مبلغ را وارد کنید..."
                  className="w-full rounded-lg border border-border-light bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">توضیحات</label>
                <input
                  type="text"
                  value={transferDesc}
                  onChange={e => setTransferDesc(e.target.value)}
                  placeholder="توضیحات (اختیاری)..."
                  className="w-full rounded-lg border border-border-light bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={handleTransfer}
                disabled={!transferAmount || !transferToAccount || loading}
                className="w-full py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'انتقال'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Advanced Filter Popup =====
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
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-light">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">جستجوی پیشرفته</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">شماره حساب</label>
            <input
              type="text"
              placeholder="شماره حساب..."
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              className="w-full rounded-lg border border-border-light bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">ارز</label>
            <select
              value={assetTypeCode}
              onChange={e => setAssetTypeCode(e.target.value)}
              className="w-full rounded-lg border border-border-light bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {ASSET_TYPES.map(asset => (
                <option key={asset.code} value={asset.code}>{asset.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">وضعیت</label>
            <select
              value={accountStatusCode}
              onChange={e => setAccountStatusCode(e.target.value)}
              className="w-full rounded-lg border border-border-light bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {STATUS_TYPES.map(status => (
                <option key={status.code} value={status.code}>{status.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 px-5 py-3 border-t border-border-light bg-slate-50 dark:bg-slate-800/20">
          <button
            onClick={() => { onApply(); onClose(); }}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90"
          >
            اعمال فیلترها
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Main Component =====
export default function FinancialAccountsPage() {
  const [accounts, setAccounts] = useState<FinancialAccountDto[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [asset, setAsset] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<FinancialAccountDto | null>(null);
  const [accountTypeCode, setAccountTypeCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [assetTypeCode, setAssetTypeCode] = useState('');
  const [accountStatusCode, setAccountStatusCode] = useState('');
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const pageSize = 15;

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
    setAdvancedFilterOpen(false);
  };

  const handleDeposit = async (data: DepositRequestDto) => {
    setActionLoading(true);
    try {
      await client.api.walletDeposit(data);
      await fetchAccounts();
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async (data: WithdrawalAccountRequest) => {
    setActionLoading(true);
    try {
      await client.api.walletWithdrawal(data);
      await fetchAccounts();
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransfer = async (data: TransferRequestDto) => {
    setActionLoading(true);
    try {
      await client.api.walletTransfer(data);
      await fetchAccounts();
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeStatus = async (data: AccountChangeStatusDto) => {
    setActionLoading(true);
    try {
      await client.api.walletChangeStatus(data);
      await fetchAccounts();
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(accounts);
  };

  const hasAdvancedFilters = accountNumber !== '' || assetTypeCode !== '' || accountStatusCode !== '';

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-white dark:bg-background-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
      {/* Tab Header - بدون تایتل */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-light dark:border-border-dark bg-slate-50/30 dark:bg-slate-800/10">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-slate-900 dark:text-white border-b-2 border-primary pb-2">
            حساب‌های مالی
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{totalCount.toLocaleString('fa-IR')} حساب</span>
          {asset && <Badge variant="info" size="sm">{asset}</Badge>}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 p-4 border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-800/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Account Type Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {ACCOUNT_TYPES.map(type => (
              <button
                key={type.code}
                onClick={() => {
                  setAccountTypeCode(type.code);
                  setPageNumber(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  accountTypeCode === type.code
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-border-light'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdvancedFilterOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                hasAdvancedFilters
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              فیلتر
              {hasAdvancedFilters && (
                <span className="w-4 h-4 text-[10px] bg-white/20 rounded-full flex items-center justify-center">
                  {[accountNumber, assetTypeCode, accountStatusCode].filter(v => v).length}
                </span>
              )}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
            >
              <Download className="w-4 h-4" />
              خروجی
            </button>
            <button
              onClick={fetchAccounts}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {hasAdvancedFilters && (
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

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
          </div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-20">
            <Wallet className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-base text-slate-400">حسابی یافت نشد</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">شماره حساب</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">نام حساب</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">نوع</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">ارز</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">موجودی</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">وضعیت</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {accounts.map(account => {
                const status = account.status?.code ? ACCOUNT_STATUS_MAP[account.status.code] : null;
                return (
                  <tr
                    key={account.id ?? account.accountId}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                    onClick={() => setSelected(account)}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {account.accountNumber || '---'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {account.name || account.description || '---'}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {account.type?.description || '---'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {account.currency?.name || '---'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {account.balances?.balance?.toLocaleString('fa-IR') ?? '---'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {status && <Badge variant={status.variant} size="sm">{status.label}</Badge>}
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setSelected(account)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                        >
                          <Eye className="w-4 h-4" />
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

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="px-4 py-3 border-t border-border-light bg-slate-50/50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              نمایش {pageNumber * pageSize + 1} تا {Math.min((pageNumber + 1) * pageSize, totalCount)} از {totalCount.toLocaleString('fa-IR')} حساب
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={pageNumber === 0}
                onClick={() => setPageNumber(p => Math.max(0, p - 1))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-border-light text-slate-600 disabled:opacity-30 hover:bg-slate-50"
              >
                <ChevronRight className="w-3.5 h-3.5" />
                قبلی
              </button>
              <button
                disabled={pageNumber >= totalPages - 1}
                onClick={() => setPageNumber(p => Math.min(totalPages - 1, p + 1))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white disabled:opacity-30 hover:bg-primary/90"
              >
                بعدی
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      <AccountDetailDrawer
        account={selected}
        onClose={() => setSelected(null)}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
        onTransfer={handleTransfer}
        onChangeStatus={handleChangeStatus}
      />

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