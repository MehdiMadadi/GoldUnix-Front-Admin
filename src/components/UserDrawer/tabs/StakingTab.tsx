// StakingTab.tsx - جمع و جورتر
import { useState, useMemo, useEffect } from 'react';
import { FiPackage, FiTrendingUp } from 'react-icons/fi';
import { Api, InvestmentAccountDto } from '../../../lib/client';

interface StakingTabProps {
  userId: number;
}

function progressPercent(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();
  if (now >= end) return 100;
  if (now <= start) return 0;
  return Math.round(((now - start) / (end - start)) * 100);
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

export default function StakingTab({ userId }: StakingTabProps) {
  const [investments, setInvestments] = useState<InvestmentAccountDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: 'all', status: 'all' });

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
      <div className="px-4 py-3 border-b border-border-light dark:border-border-dark space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            <span className="font-bold text-slate-800 dark:text-slate-200">{filtered.length.toLocaleString('fa-IR')}</span> قرارداد
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] text-slate-400 flex-shrink-0">نوع:</span>
            <FilterChip label="همه" active={filters.type === 'all'} onClick={() => setFilters(f => ({ ...f, type: 'all' }))} />
            {types.map(t => (
              <FilterChip key={t} label={t} active={filters.type === t} onClick={() => setFilters(f => ({ ...f, type: t! }))} />
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
            <FiPackage size={32} className="mb-2" />
            <p className="text-xs">قراردادی یافت نشد</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {filtered.map(inv => {
              const isActive = inv.statusCode === 'ACTIVE';
              const isGrowth = inv.accountTypeCode === 'GROWTH';
              const IconComponent = isGrowth ? FiTrendingUp : FiPackage;
              const progress = progressPercent(inv.startDate, inv.endDate);
              
              return (
                <div 
                  key={inv.accountNumber} 
                  className={`border rounded-xl p-3 ${
                    isActive 
                      ? 'border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/10' 
                      : 'border-border-light dark:border-border-dark bg-white dark:bg-surface-dark'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <IconComponent size={16} className={isGrowth ? 'text-emerald-500' : 'text-blue-500'} />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {inv.accountType || 'سرمایه‌گذاری'}
                      </span>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {inv.status || 'نامشخص'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px]">دارایی</span>
                      <p className="font-medium text-slate-700 dark:text-slate-300">{inv.assetType}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">مقدار</span>
                      <p className="font-medium">{inv.quantity?.toLocaleString('fa-IR') || '۰'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">نرخ سالانه</span>
                      <p className="font-medium text-emerald-600 dark:text-emerald-400">{inv.annualRate || '—'}٪</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">ارزش فعلی</span>
                      <p className="font-medium">{inv.currentValue?.toLocaleString('fa-IR') || '۰'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">شروع</span>
                      <p className="font-medium">
                        {inv.startDate ? new Date(inv.startDate).toLocaleDateString('fa-IR') : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">پایان</span>
                      <p className="font-medium">
                        {inv.endDate ? new Date(inv.endDate).toLocaleDateString('fa-IR') : '—'}
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400">پیشرفت</span>
                        <span className="text-[10px] font-bold text-emerald-500">{progress}٪</span>
                      </div>
                      <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
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