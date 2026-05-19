import { useState, useMemo, useEffect } from 'react';
import { FiBarChart2, FiPackage, FiTrendingUp } from 'react-icons/fi';
import { Api, InvestmentAccountDto } from '../../../lib/client';

interface StakingTabProps {
  userId: number;
}

const TYPE_CONFIG: Record<string, { text: string; bg: string; icon: typeof FiPackage }> = {
  LEASE: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30', icon: FiPackage },
  GROWTH: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/30', icon: FiTrendingUp },
  DEFAULT: { text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700', icon: FiPackage },
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20',
  EXPIRED: 'text-slate-500 bg-slate-100 dark:bg-slate-800',
  PENDING: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20',
  TERMINATED: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20',
};

function progressPercent(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();
  if (now >= end) return 100;
  if (now <= start) return 0;
  return Math.round(((now - start) / (end - start)) * 100);
}

interface Filters {
  type: string;
  status: string;
}

const DEFAULT_FILTERS: Filters = { type: 'all', status: 'all' };

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

export default function StakingTab({ userId }: StakingTabProps) {
  const [investments, setInvestments] = useState<InvestmentAccountDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showStats, setShowStats] = useState(false);

  const client = new Api();

  useEffect(() => {
    fetchInvestments();
  }, [userId]);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const response = await client.api.investmentAccountsByUserId(userId);
      setInvestments(response.data || []);
    } catch (error) {
      console.error('Failed to fetch investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return investments.filter(i => {
      if (filters.type !== 'all' && i.accountTypeCode !== filters.type) return false;
      if (filters.status !== 'all' && i.statusCode !== filters.status) return false;
      return true;
    });
  }, [investments, filters]);

  const activeInvestments = investments.filter(i => i.statusCode === 'ACTIVE');
  const totalValue = activeInvestments.reduce((s, i) => s + (i.currentValue || 0), 0);
  const types = useMemo(() => [...new Set(investments.map(i => i.accountTypeCode).filter(Boolean))], [investments]);
  const statuses = useMemo(() => [...new Set(investments.map(i => i.statusCode).filter(Boolean))], [investments]);

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
            <span className="font-bold text-slate-800 dark:text-slate-200">{filtered.length.toLocaleString('fa-IR')}</span> قرارداد
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
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-xl p-3 text-center">
              <p className="text-[10px] text-blue-500 mb-1">قراردادهای فعال</p>
              <p className="text-sm font-bold text-blue-700 dark:text-blue-300 ">
                {activeInvestments.length.toLocaleString('fa-IR')}
              </p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-3 text-center">
              <p className="text-[10px] text-emerald-500 mb-1">ارزش کل (فعال)</p>
              <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 ">
                {totalValue.toLocaleString('fa-IR')}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-[10px] text-slate-400 flex-shrink-0">نوع:</span>
            <FilterChip label="همه" active={filters.type === 'all'} onClick={() => setFilters(f => ({ ...f, type: 'all' }))} />
            {types.map(t => (
              <FilterChip key={t} label={t} active={filters.type === t} onClick={() => setFilters(f => ({ ...f, type: t! }))} />
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
            <FiPackage size={40} className="mb-2" />
            <p className="text-sm">قراردادی یافت نشد</p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {filtered.map(inv => {
              const config = TYPE_CONFIG[inv.accountTypeCode || ''] || TYPE_CONFIG.DEFAULT;
              const IconComponent = config.icon;
              const progress = progressPercent(inv.startDate, inv.endDate);
              
              return (
                <div key={inv.accountNumber} className={`border rounded-2xl p-4 ${config.bg}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg}`}>
                        <IconComponent size={18} className={config.text} />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${config.text}`}>{inv.accountType || 'سرمایه‌گذاری'}</p>
                        <p className="text-[10px] text-slate-400 ">{inv.accountNumber}</p>
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[inv.statusCode || ''] || STATUS_COLORS.PENDING}`}>
                      {inv.status || 'نامشخص'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
                    <div>
                      <p className="text-[10px] text-slate-400">دارایی</p>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{inv.assetType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">مقدار</p>
                      <p className="text-xs font-bold ">{inv.quantity?.toLocaleString('fa-IR') || '۰'} {inv.assetType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">نرخ سالانه</p>
                      <p className={`text-xs font-bold ${config.text}`}>{inv.annualRate || '—'}٪</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">ارزش فعلی</p>
                      <p className="text-xs font-bold ">{inv.currentValue?.toLocaleString('fa-IR') || '۰'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">شروع</p>
                      <p className="text-[11px] text-slate-500">
                        {inv.startDate ? new Date(inv.startDate).toLocaleDateString('fa-IR') : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400">پایان</p>
                      <p className="text-[11px] text-slate-500">
                        {inv.endDate ? new Date(inv.endDate).toLocaleDateString('fa-IR') : '—'}
                      </p>
                    </div>
                  </div>

                  {inv.statusCode === 'ACTIVE' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400">پیشرفت دوره</span>
                        <span className={`text-[10px] font-bold ${config.text}`}>{progress}٪</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/60 dark:bg-background-dark/60 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-current"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}