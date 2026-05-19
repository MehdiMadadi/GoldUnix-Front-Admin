import { FiFilter, FiX, FiCheck } from 'react-icons/fi';
import type { TradeFiltersState, MainTab } from './types';

interface FilterDrawerProps {
  open: boolean;
  filters: TradeFiltersState;
  onChange: (f: TradeFiltersState) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
  activeTab: MainTab;
}

const ASSETS = ['همه دارایی‌ها', 'طلای ۱۸ عیار', 'سکه تمام بهار', 'طلای ۲۴ عیار', 'مس'];

const STATUS_OPTIONS: Record<MainTab, { value: string; label: string }[]> = {
  orders: [
    { value: 'all', label: 'همه وضعیت‌ها' },
    { value: 'open', label: 'باز' },
    { value: 'partially_filled', label: 'جزئی انجام شده' },
    { value: 'cancelled', label: 'لغو شده' },
  ],
  trades: [
    { value: 'all', label: 'همه وضعیت‌ها' },
    { value: 'settled', label: 'تسویه شده' },
    { value: 'open', label: 'باز' },
    { value: 'pending', label: 'در انتظار' },
    { value: 'cancelled', label: 'لغو شده' },
  ],
  positions: [
    { value: 'all', label: 'همه سطوح ریسک' },
    { value: 'green', label: 'ریسک پایین' },
    { value: 'yellow', label: 'ریسک متوسط' },
    { value: 'red', label: 'ریسک بالا' },
  ],
};

const inputCls = 'w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100 placeholder:text-slate-400';
const selectCls = 'w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100';

export default function FilterDrawer({ open, filters, onChange, onApply, onReset, onClose, activeTab }: FilterDrawerProps) {
  const set = (partial: Partial<TradeFiltersState>) => onChange({ ...filters, ...partial });

  const activeCount = [
    filters.search !== '',
    filters.asset !== 'all',
    filters.userType !== 'all',
    filters.status !== 'all',
    filters.tradeType !== 'all',
    filters.physicalOnly,
    filters.commitmentOnly,
    filters.dateFrom !== '',
    filters.dateTo !== '',
    filters.minAmount !== '',
  ].filter(Boolean).length;

  return (
    <>
      <div
        className={`overlay ${open ? 'show' : ''}`}
        onClick={onClose}
        style={{ zIndex: 55 }}
      />
      <div
        className={`fixed top-0 right-0 bottom-0 flex flex-col bg-white dark:bg-surface-dark border-l border-border-light dark:border-border-dark transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]`}
        style={{
          width: 'min(420px, 100vw)',
          zIndex: 60,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark shrink-0">
          <div className="flex items-center gap-2">
            <FiFilter size={20} className="text-primary" />
            <h3 className="font-bold">فیلترها</h3>
            {activeCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{activeCount.toLocaleString('fa-IR')}</span>
            )}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors">
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">جستجوی کاربر</label>
            <input
              type="text"
              placeholder="نام کاربر..."
              value={filters.search}
              onChange={e => set({ search: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">دارایی</label>
            <select value={filters.asset} onChange={e => set({ asset: e.target.value })} className={selectCls}>
              {ASSETS.map(a => (
                <option key={a} value={a === 'همه دارایی‌ها' ? 'all' : a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">نوع کاربر</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ v: 'all', l: 'همه' }, { v: 'normal', l: 'عادی' }, { v: 'trade', l: 'صنف' }].map(o => (
                <button
                  key={o.v}
                  onClick={() => set({ userType: o.v })}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${filters.userType === o.v ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">وضعیت</label>
            <div className="space-y-1.5">
              {STATUS_OPTIONS[activeTab].map(o => (
                <button
                  key={o.value}
                  onClick={() => set({ status: o.value })}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${filters.status === o.value ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}`}
                >
                  {o.label}
                  {filters.status === o.value && <FiCheck size={14} />}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'trades' && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">نوع معامله</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: 'all', l: 'همه' },
                  { v: 'cash', l: 'نقدی' },
                  { v: 'tomorrow', l: 'فردایی' },
                  { v: 'day_after', l: 'پسفردایی' },
                  { v: 'commitment', l: 'تعهدی' },
                ].map(o => (
                  <button
                    key={o.v}
                    onClick={() => set({ tradeType: o.v as TradeFiltersState['tradeType'] })}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-colors ${filters.tradeType === o.v ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">بازه تاریخ</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-400 mb-1.5">از تاریخ</p>
                <input type="text" placeholder="۱۴۰۳/۱۱/۰۱" value={filters.dateFrom} onChange={e => set({ dateFrom: e.target.value })} className={inputCls} />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1.5">تا تاریخ</p>
                <input type="text" placeholder="۱۴۰۳/۱۱/۳۰" value={filters.dateTo} onChange={e => set({ dateTo: e.target.value })} className={inputCls} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">حداقل مبلغ (ریال)</label>
            <input type="number" placeholder="۰" value={filters.minAmount} onChange={e => set({ minAmount: e.target.value })} className={inputCls} />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block">گزینه‌های خاص</label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-border-light dark:border-border-dark cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={filters.physicalOnly}
                onChange={e => set({ physicalOnly: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">فقط تحویل فیزیکی</span>
            </label>
            {activeTab !== 'orders' && (
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border-light dark:border-border-dark cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.commitmentOnly}
                  onChange={e => set({ commitmentOnly: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">فقط تعهدی باز</span>
              </label>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3 p-5 border-t border-border-light dark:border-border-dark">
          <button onClick={onReset} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            پاک کردن
          </button>
          <button onClick={() => { onApply(); onClose(); }} className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            اعمال فیلتر
          </button>
        </div>
      </div>
    </>
  );
}