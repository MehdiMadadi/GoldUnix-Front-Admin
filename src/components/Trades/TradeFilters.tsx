import type { TradeFiltersState, MainTab } from './types';

interface TradeFiltersProps {
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

const selectCls = 'w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100';
const inputCls = 'w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100';

export default function TradeFilters({ filters, onChange, onApply, onReset, onClose, activeTab }: TradeFiltersProps) {
  const set = (partial: Partial<TradeFiltersState>) => onChange({ ...filters, ...partial });

  return (
    <div className="border border-border-light dark:border-border-dark rounded-2xl bg-white dark:bg-surface-dark overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark">
        <h3 className="font-bold flex items-center gap-2 text-sm">
          <span className="material-symbols-outlined text-primary text-base">filter_list</span>
          فیلترهای جستجو
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div>
          <label className="text-xs text-slate-500 mb-1.5 block">جستجو</label>
          <input
            type="text"
            placeholder="نام کاربر..."
            value={filters.search}
            onChange={e => set({ search: e.target.value })}
            className={inputCls}
          />
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1.5 block">دارایی</label>
          <select value={filters.asset} onChange={e => set({ asset: e.target.value })} className={selectCls}>
            {ASSETS.map(a => (
              <option key={a} value={a === 'همه دارایی‌ها' ? 'all' : a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1.5 block">نوع کاربر</label>
          <select value={filters.userType} onChange={e => set({ userType: e.target.value })} className={selectCls}>
            <option value="all">همه نوع کاربران</option>
            <option value="normal">عادی</option>
            <option value="trade">صنف</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1.5 block">وضعیت</label>
          <select value={filters.status} onChange={e => set({ status: e.target.value })} className={selectCls}>
            {STATUS_OPTIONS[activeTab].map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {activeTab === 'trades' && (
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">نوع معامله</label>
            <select value={filters.tradeType} onChange={e => set({ tradeType: e.target.value as TradeFiltersState['tradeType'] })} className={selectCls}>
              <option value="all">همه نوع معاملات</option>
              <option value="cash">نقدی</option>
              <option value="tomorrow">فردایی</option>
              <option value="day_after">پسفردایی</option>
              <option value="commitment">تعهدی</option>
            </select>
          </div>
        )}

        <div>
          <label className="text-xs text-slate-500 mb-1.5 block">تاریخ از</label>
          <input type="text" placeholder="۱۴۰۳/۱۱/۰۱" value={filters.dateFrom} onChange={e => set({ dateFrom: e.target.value })} className={inputCls} />
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1.5 block">تاریخ تا</label>
          <input type="text" placeholder="۱۴۰۳/۱۱/۳۰" value={filters.dateTo} onChange={e => set({ dateTo: e.target.value })} className={inputCls} />
        </div>

        <div>
          <label className="text-xs text-slate-500 mb-1.5 block">حداقل مبلغ (ریال)</label>
          <input type="number" placeholder="۰" value={filters.minAmount} onChange={e => set({ minAmount: e.target.value })} className={inputCls} />
        </div>

        <div className="sm:col-span-2 lg:col-span-1 flex flex-col justify-end gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.physicalOnly}
              onChange={e => set({ physicalOnly: e.target.checked })}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">فقط تحویل فیزیکی</span>
          </label>
          {activeTab !== 'orders' && (
            <label className="flex items-center gap-2 cursor-pointer">
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

      <div className="flex items-center justify-end gap-3 px-5 pb-5">
        <button onClick={onReset} className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          پاک کردن
        </button>
        <button onClick={onApply} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          اعمال فیلتر
        </button>
      </div>
    </div>
  );
}
