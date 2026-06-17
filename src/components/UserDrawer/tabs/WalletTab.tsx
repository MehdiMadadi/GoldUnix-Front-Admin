// WalletTab.tsx
import { useState, useEffect } from 'react';
import { 
  FiArrowDown, 
  FiArrowUp, 
  FiLock, 
  FiUnlock, 
  FiBarChart2, 
  FiFileText,
  FiChevronDown,
  FiChevronLeft,
  FiCreditCard
} from 'react-icons/fi';
import { Api, FinancialAccountDto } from '../../../lib/client';

interface WalletTabProps {
  userId: number;
}

const TX_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof FiArrowDown }> = {
  DEPOSIT: { label: 'واریز', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-950/30', icon: FiArrowDown },
  WITHDRAW: { label: 'برداشت', color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-950/30', icon: FiArrowUp },
  BLOCK: { label: 'بلوک', color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-950/30', icon: FiLock },
  RELEASE: { label: 'آزادسازی', color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-950/30', icon: FiUnlock },
  FEE: { label: 'کارمزد', color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-950/30', icon: FiFileText },
  TRADE: { label: 'معامله', color: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-950/30', icon: FiBarChart2 },
};

const DEFAULT_TX_CONFIG = { label: 'تراکنش', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', icon: FiFileText };

function fmt(n?: number) {
  return n?.toLocaleString('fa-IR') || '۰';
}

export default function WalletTab({ userId }: WalletTabProps) {
  const [wallets, setWallets] = useState<FinancialAccountDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWallet, setExpandedWallet] = useState<number | null>(null);

  const client = new Api();

  useEffect(() => {
    fetchWallets();
  }, [userId]);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await client.api.getWalletsPreUsers(userId);
      setWallets(response.data || []);
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <FiCreditCard size={40} className="mb-2" />
        <p className="text-sm">کیف پولی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {wallets.map(wallet => (
          <div 
            key={wallet.id} 
            className="border border-border-light dark:border-border-dark rounded-xl overflow-hidden bg-white dark:bg-surface-dark"
          >
            {/* Wallet Header */}
            <div 
              onClick={() => setExpandedWallet(expandedWallet === wallet.id ? null : wallet.id!)}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FiCreditCard size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {wallet.name || 'کیف پول'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {wallet.currency?.name || wallet.currency?.code || 'ریال'}
                    {wallet.accountNumber && ` • ${wallet.accountNumber}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {fmt(wallet.balances?.availableBalance || wallet.balances?.balance)}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {wallet.currency?.symbol || 'ریال'}
                  </p>
                </div>
                {expandedWallet === wallet.id ? (
                  <FiChevronDown size={18} className="text-slate-400" />
                ) : (
                  <FiChevronLeft size={18} className="text-slate-400" />
                )}
              </div>
            </div>

            {/* Wallet Details - Expanded */}
            {expandedWallet === wallet.id && (
              <div className="border-t border-border-light dark:border-border-dark p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/20">
                {/* Balance Details */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white dark:bg-surface-dark rounded-lg p-2.5 text-center border border-border-light dark:border-border-dark">
                    <p className="text-[10px] text-slate-400 mb-0.5">موجودی کل</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {fmt(wallet.balances?.balance)}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-surface-dark rounded-lg p-2.5 text-center border border-border-light dark:border-border-dark">
                    <p className="text-[10px] text-slate-400 mb-0.5">قابل برداشت</p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {fmt(wallet.balances?.availableBalance)}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-surface-dark rounded-lg p-2.5 text-center border border-border-light dark:border-border-dark">
                    <p className="text-[10px] text-slate-400 mb-0.5">مسدود</p>
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {fmt(wallet.balances?.blockBalance)}
                    </p>
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">نوع حساب</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {wallet.type?.description || wallet.type?.code || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">وضعیت</span>
                    <span className={`font-medium ${
                      wallet.status?.code === 'ACTIVE' 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {wallet.status?.description || wallet.status?.code || '—'}
                    </span>
                  </div>
                  {wallet.createdJalaliDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">تاریخ ایجاد</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {wallet.createdJalaliDate}
                      </span>
                    </div>
                  )}
                  {wallet.description && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">توضیحات</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                        {wallet.description}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                  <FiFileText size={14} />
                  مشاهده تراکنش‌ها
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}