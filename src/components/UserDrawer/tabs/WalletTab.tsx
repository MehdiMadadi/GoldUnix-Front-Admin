import { useState, useMemo, useEffect } from 'react';
import { 
  FiArrowDown, 
  FiArrowUp, 
  FiLock, 
  FiUnlock, 
  FiBarChart2, 
  FiFileText 
} from 'react-icons/fi';
import { Api, UserWalletDto, AccountTransactionsDto } from '../../../lib/client';

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
  const [userInfo, setUserInfo] = useState<UserWalletDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showStats, setShowStats] = useState(false);

  const client = new Api();

  useEffect(() => {
    fetchWalletData();
  }, [userId]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const response = await client.api.getUserWalletByUserId(userId);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!userInfo?.walletTransactions) return [];
    if (filter === 'all') return userInfo.walletTransactions;
    return userInfo.walletTransactions.filter(t => 
      t.transactionType?.code?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [userInfo?.walletTransactions, filter]);

  const freeBalance = (userInfo?.balance || 0) - (userInfo?.blockedBalance || 0);
  
  const transactionTypes = useMemo(() => {
    const types = new Set<string>();
    userInfo?.walletTransactions?.forEach(t => {
      if (t.transactionType?.code) types.add(t.transactionType.code);
    });
    return Array.from(types);
  }, [userInfo?.walletTransactions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">خلاصه کیف پول</h4>
          <button
            onClick={() => setShowStats(v => !v)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              showStats ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <FiBarChart2 size={18} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-3 text-center">
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mb-1">موجودی آزاد</p>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{fmt(freeBalance)}</p>
            <p className="text-[10px] text-emerald-500 mt-0.5">ریال</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-3 text-center">
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mb-1">بلوک‌شده</p>
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">{fmt(userInfo?.blockedBalance)}</p>
            <p className="text-[10px] text-amber-500 mt-0.5">ریال</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-3 text-center">
            <p className="text-[10px] text-blue-600 dark:text-blue-400 mb-1">اعتبار</p>
            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{fmt(userInfo?.creditBalance)}</p>
            <p className="text-[10px] text-blue-500 mt-0.5">ریال</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 py-3 border-b border-border-light dark:border-border-dark overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'all' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          همه
        </button>
        {transactionTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === type ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {TX_CONFIG[type]?.label || type}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <FiFileText size={40} className="mb-2" />
            <p className="text-sm">تراکنشی یافت نشد</p>
          </div>
        ) : (
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {filtered.map(tx => {
              const config = TX_CONFIG[tx.transactionType?.code || ''] || DEFAULT_TX_CONFIG;
              const IconComponent = config.icon;
              const isNegative = tx.amount! < 0 || tx.transactionType?.code === 'WITHDRAW';
              
              return (
                <div key={tx.id} className="flex items-center gap-3 px-5 py-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                    <IconComponent size={18} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${config.color}`}>{config.label}</span>
                      <span className={`text-sm font-bold  ${isNegative ? 'text-rose-500' : 'text-emerald-600'}`}>
                        {isNegative ? '−' : '+'}{fmt(Math.abs(tx.amount || 0))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[11px] text-slate-400 truncate">{tx.description || '—'}</span>
                      <span className="text-[11px] text-slate-400  mr-2 flex-shrink-0">
                        {tx.jalaliDateTime || new Date(tx.dateTime!).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] text-slate-400">موجودی:</span>
                      <span className="text-[10px]  text-slate-500">{fmt(tx.balance)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}