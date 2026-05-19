import type { UserFilters } from './types';

interface UserFilterPanelProps {
  filters: UserFilters;
  onChange: (filters: UserFilters) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
  variant: 'desktop' | 'mobile';
}

export default function UserFilterPanel({
  filters,
  onChange,
  onApply,
  onReset,
  onClose,
  variant,
}: UserFilterPanelProps) {
  const content = (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">filter_list</span>
          فیلترهای جستجو
        </h3>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-500 mb-1 block">جستجو</label>
          <input
            type="text"
            placeholder="نام یا موبایل..."
            value={filters.search}
            onChange={e => onChange({ ...filters, search: e.target.value })}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100"
          />
        </div>

        <div>
          <label className="text-sm text-slate-500 mb-1 block">نوع کاربر</label>
          <select
            value={filters.userType}
            onChange={e => onChange({ ...filters, userType: e.target.value })}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100"
          >
            <option value="all">همه نوع کاربران</option>
            <option value="normal">عادی</option>
            <option value="trade">صنف</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-500 mb-1 block">وضعیت</label>
          <select
            value={filters.status}
            onChange={e => onChange({ ...filters, status: e.target.value })}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="blocked">مسدود</option>
            <option value="pending">در انتظار</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-500 mb-1 block">سطح ریسک</label>
          <select
            value={filters.riskLevel}
            onChange={e => onChange({ ...filters, riskLevel: e.target.value })}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100"
          >
            <option value="all">همه سطوح ریسک</option>
            <option value="low">پایین</option>
            <option value="medium">متوسط</option>
            <option value="high">بالا</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-500 mb-1 block">وضعیت تعهد</label>
          <select
            value={filters.obligation}
            onChange={e => onChange({ ...filters, obligation: e.target.value })}
            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100"
          >
            <option value="all">وضعیت تعهد</option>
            <option value="open">دارای تعهد باز</option>
            <option value="none">بدون تعهد</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onReset}
            className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            پاک کردن
          </button>
          <button
            onClick={onApply}
            className="bg-primary text-white rounded-xl px-4 py-3 text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            اعمال فیلتر
          </button>
        </div>
      </div>
    </div>
  );

  if (variant === 'desktop') {
    return <div className="modal-desktop open">{content}</div>;
  }

  return <div className="modal-mobile open">{content}</div>;
}
