// pages/admin/FaqPage.tsx
import { useEffect, useState } from 'react';
import { Api, Faq } from '../lib/client';
import Badge from '../components/UI/Badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw, 
  X, 
  Check, 
  MessageCircle, 
  HelpCircle, 
  Loader2,
  Filter,
  Calendar,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Status Badge
const getStatusBadge = (faq: Faq) => {
  if (faq.targetUserAccount) {
    return { label: 'اختصاصی', variant: 'info' as const, icon: User };
  }
  return { label: 'عمومی', variant: 'success' as const, icon: MessageCircle };
};

// ===== Export to CSV =====
function exportToCSV(faqs: Faq[]) {
  if (faqs.length === 0) return;

  const headers = ['شناسه', 'عنوان', 'پاسخ', 'نوع', 'کاربر', 'تاریخ ایجاد'];
  const rows = faqs.map(item => [
    item.id || '',
    item.title || '',
    item.description || '',
    item.targetUserAccount ? 'اختصاصی' : 'عمومی',
    item.targetUserAccount ? `${item.targetUserAccount.firstName || ''} ${item.targetUserAccount.lastName || ''}`.trim() : '---',
    item.createdAt ? new Date(item.createdAt).toLocaleString('fa-IR') : '---'
  ]);

  const BOM = '\uFEFF';
  const csvContent = BOM + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];
  link.download = `faq_${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// FAQ Detail Modal
function FaqDetailModal({
  faq,
  onClose,
  onEdit
}: {
  faq: Faq | null;
  onClose: () => void;
  onEdit: (f: Faq) => void;
}) {
  if (!faq) return null;

  const status = getStatusBadge(faq);
  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-light bg-slate-50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">جزئیات سوال</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={status.variant} size="sm">
                  <span className="flex items-center gap-1">
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </Badge>
                {faq.targetUserAccount && (
                  <span className="text-xs text-slate-400">
                    {faq.targetUserAccount.firstName} {faq.targetUserAccount.lastName}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400">عنوان سوال</label>
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{faq.title || '---'}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">پاسخ</label>
            <div className="mt-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {faq.description || '---'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-light">
            {faq.id && (
              <div>
                <label className="text-xs text-slate-400">شناسه</label>
                <p className="text-sm font-mono text-slate-700 dark:text-slate-300 mt-0.5">{faq.id}</p>
              </div>
            )}
            {faq.createdAt && (
              <div>
                <label className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  تاریخ ایجاد
                </label>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">
                  {new Date(faq.createdAt).toLocaleString('fa-IR')}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => { onClose(); onEdit(faq); }}
            className="w-full px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            ویرایش سوال
          </button>
        </div>
      </div>
    </div>
  );
}

// FAQ Form Modal
function FaqFormModal({
  faq,
  onClose,
  onSave,
  isSaving
}: {
  faq: Faq | null;
  onClose: () => void;
  onSave: (data: Partial<Faq>) => Promise<void>;
  isSaving: boolean;
}) {
  const [formData, setFormData] = useState<Partial<Faq>>({
    title: '',
    description: '',
    targetUserAccount: undefined,
    ...faq
  });

  const [isSpecific, setIsSpecific] = useState(!!faq?.targetUserAccount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('لطفا عنوان سوال را وارد کنید');
      return;
    }
    if (!formData.description?.trim()) {
      alert('لطفا پاسخ سوال را وارد کنید');
      return;
    }
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light">
        <div className="sticky top-0 bg-white dark:bg-surface-dark border-b border-border-light px-5 py-3 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            {faq?.id ? 'ویرایش سوال' : 'سوال جدید'}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* نوع سوال */}
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase mb-3">نوع سوال</h4>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!isSpecific}
                  onChange={() => {
                    setIsSpecific(false);
                    setFormData(prev => ({ ...prev, targetUserAccount: undefined }));
                  }}
                  className="w-4 h-4 text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">عمومی</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isSpecific}
                  onChange={() => setIsSpecific(true)}
                  className="w-4 h-4 text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">اختصاصی</span>
              </label>
            </div>
          </div>

          {/* عنوان */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              عنوان سوال <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="مثال: چگونه می‌توانم حساب کاربری خود را فعال کنم؟"
              className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100"
            />
          </div>

          {/* پاسخ */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              پاسخ <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description || ''}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={5}
              placeholder="پاسخ سوال را با جزئیات کامل بنویسید..."
              className="w-full rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-3 border-t border-border-light">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {faq?.id ? 'ویرایش سوال' : 'ایجاد سوال'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirm Modal
function DeleteConfirmModal({
  faq,
  onClose,
  onConfirm,
  isDeleting
}: {
  faq: Faq | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}) {
  if (!faq) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">حذف سوال</h3>
          <p className="text-sm text-slate-500 mb-5">
            آیا از حذف سوال{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-1 truncate max-w-[250px] mx-auto">
              "{faq.title}"
            </span>
            مطمئن هستید؟
          </p>
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              حذف
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Main Component =====
export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'public' | 'specific'>('all');
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const client = new Api();

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const response = await client.api.getAll2();
      setFaqs(response.data || []);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    let filtered = [...faqs];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f => 
        f.title?.toLowerCase().includes(query) ||
        f.description?.toLowerCase().includes(query)
      );
    }
    
    if (typeFilter === 'public') {
      filtered = filtered.filter(f => !f.targetUserAccount);
    } else if (typeFilter === 'specific') {
      filtered = filtered.filter(f => f.targetUserAccount);
    }
    
    setFilteredFaqs(filtered);
  }, [faqs, searchQuery, typeFilter]);

  const handleCreate = () => {
    setSelectedFaq(null);
    setShowFormModal(true);
  };

  const handleEdit = (faq: Faq) => {
    setSelectedFaq(faq);
    setShowFormModal(true);
    setShowDetailModal(false);
  };

  const handleDelete = (faq: Faq) => {
    setSelectedFaq(faq);
    setShowDeleteModal(true);
  };

  const handleView = (faq: Faq) => {
    setSelectedFaq(faq);
    setShowDetailModal(true);
  };

  const handleSave = async (data: Partial<Faq>) => {
    setIsSaving(true);
    try {
      if (selectedFaq?.id) {
        await client.api.update2(selectedFaq.id, data as Faq);
      } else {
        await client.api.create3(data as Faq);
      }
      await fetchFaqs();
      setShowFormModal(false);
      setSelectedFaq(null);
    } catch (error) {
      console.error('Failed to save FAQ:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedFaq?.id) return;
    setIsDeleting(true);
    try {
      await client.api.delete2(selectedFaq.id);
      await fetchFaqs();
      setShowDeleteModal(false);
      setSelectedFaq(null);
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    exportToCSV(filteredFaqs);
  };

  const handleReset = () => {
    setSearchQuery('');
    setTypeFilter('all');
  };

  const hasFilters = searchQuery !== '' || typeFilter !== 'all';

  const stats = {
    total: faqs.length,
    public: faqs.filter(f => !f.targetUserAccount).length,
    specific: faqs.filter(f => f.targetUserAccount).length
  };

  return (
    <div className="bg-white dark:bg-background-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
      {/* Tab Header - بدون تایتل */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-light dark:border-border-dark bg-slate-50/30 dark:bg-slate-800/10">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-slate-900 dark:text-white border-b-2 border-primary pb-2">
            سوالات متداول
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{stats.total} سوال</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 p-4 border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-800/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="جستجو در سوالات..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                hasFilters
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              فیلتر
              {hasFilters && (
                <span className="w-4 h-4 text-[10px] bg-white/20 rounded-full flex items-center justify-center">
                  {(searchQuery ? 1 : 0) + (typeFilter !== 'all' ? 1 : 0)}
                </span>
              )}
              {showAdvancedFilter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
              title="خروجی اکسل"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              خروجی
            </button>
            <button
              onClick={fetchFaqs}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-all"
            >
              <Plus className="w-4 h-4" />
              جدید
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

        {/* Advanced Filter */}
        {showAdvancedFilter && (
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border-light dark:border-border-dark">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">نوع سوال:</span>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as any)}
                className="rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">همه</option>
                <option value="public">عمومی</option>
                <option value="specific">اختصاصی</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* FAQ Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-20">
            <HelpCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-base text-slate-400">سوالی یافت نشد</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light bg-slate-50 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">شناسه</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">عنوان</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">نوع</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">کاربر</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">تاریخ ایجاد</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filteredFaqs.map(faq => {
                const status = getStatusBadge(faq);
                const StatusIcon = status.icon;
                return (
                  <tr key={faq.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {faq.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-1" title={faq.title}>
                        {faq.title || '---'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={status.variant} size="sm">
                        <span className="items-center gap-1">
                          {status.label}
                        </span>
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                      {faq.targetUserAccount ? (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {faq.targetUserAccount.firstName} {faq.targetUserAccount.lastName}
                        </span>
                      ) : (
                        '---'
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {faq.createdAt ? new Date(faq.createdAt).toLocaleDateString('fa-IR') : '---'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleView(faq)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                          title="مشاهده"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(faq)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all"
                          title="ویرایش"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modals */}
      {showDetailModal && (
        <FaqDetailModal
          faq={selectedFaq}
          onClose={() => { setShowDetailModal(false); setSelectedFaq(null); }}
          onEdit={handleEdit}
        />
      )}
      
      {showFormModal && (
        <FaqFormModal
          faq={selectedFaq}
          onClose={() => { setShowFormModal(false); setSelectedFaq(null); }}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
      
      {showDeleteModal && (
        <DeleteConfirmModal
          faq={selectedFaq}
          onClose={() => { setShowDeleteModal(false); setSelectedFaq(null); }}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}