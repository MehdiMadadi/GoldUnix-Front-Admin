// pages/admin/ProductsPage.tsx
import { useEffect, useState } from 'react';
import { Api, Product } from '../lib/client';
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
    Package,
    Zap,
    Calendar,
    Wallet,
    BarChart3,
    AlertCircle,
    Loader2,
    ToggleLeft,
    ToggleRight,
    Filter,
    Clock,
    ArrowUpDown,
    Copy
} from 'lucide-react';

// Status Badge
const getActiveBadge = (active: boolean) => {
    if (active) {
        return { label: 'فعال', variant: 'success' as const, icon: Check };
    }
    return { label: 'غیرفعال', variant: 'danger' as const, icon: X };
};

// Feature Badge Component
function FeatureBadge({ label, icon: Icon }: { label: string; icon?: React.ElementType }) {
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
            {Icon && <Icon className="w-3 h-3" />}
            {label}
        </span>
    );
}

// ===== Export to CSV =====
function exportToCSV(products: Product[]) {
    if (products.length === 0) return;

    const headers = ['شناسه', 'کد محصول', 'توضیحات', 'نوع کیف پول', 'روزهای تسویه', 'زمان تسویه', 'اهرم دار', 'کارمزد تامین مالی', 'انقضا', 'وضعیت', 'حداقل معامله', 'حداکثر معامله'];
    const rows = products.map(item => [
        item.id || '',
        item.code || '',
        item.description || '',
        item.walletTypeCode || '',
        item.settlementDays || 0,
        item.settlementTime || '',
        item.allowsLeverage ? 'بله' : 'خیر',
        item.hasFunding ? 'بله' : 'خیر',
        item.hasExpiry ? 'بله' : 'خیر',
        item.active ? 'فعال' : 'غیرفعال',
        item.minTradeQuantity || 0,
        item.maxTradeQuantity || 0
    ]);

    const BOM = '\uFEFF';
    const csvContent = BOM + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `products_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// Product Detail Modal
function ProductDetailModal({
    product,
    onClose,
    onEdit
}: {
    product: Product | null;
    onClose: () => void;
    onEdit: (p: Product) => void;
}) {
    if (!product) return null;

    const activeStatus = getActiveBadge(product.active || false);
    const StatusIcon = activeStatus.icon;

    const InfoRow = ({ label, value, icon: Icon }: { label: string; value: string | number | undefined | null; icon?: React.ElementType }) => (
        <div className="flex items-center justify-between py-3 border-b border-border-light dark:border-border-dark last:border-0">
            <span className="text-sm text-slate-500 flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-slate-400" />}
                {label}
            </span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
                {value !== undefined && value !== null ? (typeof value === 'number' ? value.toLocaleString() : value) : '---'}
            </span>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-primary/5 to-transparent">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                            {product.description || product.code}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                {product.code}
                            </span>
                            <Badge variant={activeStatus.variant} size="sm">
                                <span className="flex items-center gap-1">
                                    <StatusIcon className="w-3 h-3" />
                                    {activeStatus.label}
                                </span>
                            </Badge>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <X className="w-4.5 h-4.5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold text-primary">{product.settlementDays ?? '---'}</p>
                            <p className="text-[10px] text-slate-400">روز تسویه</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold text-primary">{product.minTradeQuantity?.toLocaleString() ?? '---'}</p>
                            <p className="text-[10px] text-slate-400">حداقل معامله</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-3 text-center">
                            <p className="text-2xl font-bold text-primary">{product.maxTradeQuantity?.toLocaleString() ?? '---'}</p>
                            <p className="text-[10px] text-slate-400">حداکثر معامله</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <InfoRow label="شناسه" value={product.id} icon={Package} />
                        <InfoRow label="کد محصول" value={product.code} icon={Copy} />
                        <InfoRow label="توضیحات" value={product.description} />
                        <InfoRow label="نوع کیف پول" value={product.walletTypeCode} icon={Wallet} />
                        <InfoRow label="زمان تسویه" value={product.settlementTime} icon={Clock} />
                        <InfoRow label="حداکثر ارزش هر سفارش" value={product.maxSingleOrderValue?.toLocaleString()} icon={BarChart3} />
                        <InfoRow label="حداکثر حجم روزانه" value={product.maxDailyVolumePerUser?.toLocaleString()} />
                        <InfoRow label="حداکثر سفارش روزانه" value={product.maxDailyOrdersPerUser} />
                        <InfoRow label="تاریخ ایجاد" value={product.createdAt ? new Date(product.createdAt).toLocaleString('fa-IR') : '---'} />
                    </div>

                    <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark flex gap-3">
                        <button
                            onClick={() => {
                                onClose();
                                onEdit(product);
                            }}
                            className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            ویرایش محصول
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Product Form Modal
function ProductFormModal({
    product,
    onClose,
    onSave,
    isSaving
}: {
    product: Product | null;
    onClose: () => void;
    onSave: (data: Partial<Product>) => Promise<void>;
    isSaving: boolean;
}) {
    const [formData, setFormData] = useState<Partial<Product>>({
        code: '',
        description: '',
        walletTypeCode: '',
        settlementDays: 0,
        allowsLeverage: false,
        hasExpiry: false,
        hasFunding: false,
        active: true,
        minTradeQuantity: 0,
        maxTradeQuantity: 0,
        maxSingleOrderValue: 0,
        maxDailyVolumePerUser: 0,
        maxDailyOrdersPerUser: 0,
        settlementTime: '',
        ...product
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    const InputField = ({ label, name, type = 'text', required, step, placeholder }: any) => (
        <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                value={formData[name] ?? ''}
                onChange={e => setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(e.target.value) : e.target.value }))}
                step={step}
                placeholder={placeholder}
                className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 transition-all"
            />
        </div>
    );

    const CheckboxField = ({ label, name }: { label: string; name: string }) => (
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={!!formData[name]}
                onChange={e => setFormData(prev => ({ ...prev, [name]: e.target.checked }))}
                className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary/20"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
        </label>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark animate-in fade-in zoom-in duration-200">
                <div className="sticky top-0 bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-6 py-4 flex items-center justify-between z-10">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                        {product?.id ? 'ویرایش محصول' : 'محصول جدید'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <X className="w-4.5 h-4.5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-5 space-y-4">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary" />
                            اطلاعات پایه
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="کد محصول" name="code" required placeholder="مثال: GOLD" />
                            <InputField label="توضیحات" name="description" placeholder="نام نمایشی محصول" />
                            <InputField label="نوع کیف پول" name="walletTypeCode" placeholder="مثال: MAIN, MARGIN" />
                            <InputField label="روزهای تسویه" name="settlementDays" type="number" />
                            <InputField label="زمان تسویه" name="settlementTime" placeholder="مثال: 14:30" />
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-5 space-y-4">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            محدودیت‌های معاملاتی
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="حداقل مقدار معامله" name="minTradeQuantity" type="number" step="0.0001" />
                            <InputField label="حداکثر مقدار معامله" name="maxTradeQuantity" type="number" step="0.0001" />
                            <InputField label="حداکثر ارزش هر سفارش" name="maxSingleOrderValue" type="number" />
                            <InputField label="حداکثر حجم روزانه هر کاربر" name="maxDailyVolumePerUser" type="number" />
                            <InputField label="حداکثر سفارش روزانه هر کاربر" name="maxDailyOrdersPerUser" type="number" />
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-5 space-y-4">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">ویژگی‌های محصول</h4>
                        <div className="flex flex-wrap gap-6">
                            <CheckboxField label="قابل استفاده با اهرم (مارجین)" name="allowsLeverage" />
                            <CheckboxField label="دارای تاریخ انقضا" name="hasExpiry" />
                            <CheckboxField label="دارای کارمزد تامین مالی" name="hasFunding" />
                            <CheckboxField label="فعال" name="active" />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            {product?.id ? 'ویرایش محصول' : 'ایجاد محصول'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
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
    product,
    onClose,
    onConfirm,
    isDeleting
}: {
    product: Product | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isDeleting: boolean;
}) {
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 text-center">
                    <div className="w-14 h-14 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">حذف محصول</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        آیا از حذف محصول <span className="font-semibold text-slate-800 dark:text-slate-200">{product.code || product.description}</span> مطمئن هستید؟
                        <br />
                        <span className="text-xs text-red-500">این عمل غیرقابل بازگشت است!</span>
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            حذف
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            انصراف
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Toggle Status Confirm Modal
function ToggleStatusModal({
    product,
    onClose,
    onConfirm,
    isToggling
}: {
    product: Product | null;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isToggling: boolean;
}) {
    if (!product) return null;

    const newStatus = !product.active;
    const statusText = newStatus ? 'فعال' : 'غیرفعال';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 text-center">
                    <div className={`w-14 h-14 ${newStatus ? 'bg-green-100 dark:bg-green-950/30' : 'bg-amber-100 dark:bg-amber-950/30'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {newStatus ? <ToggleRight className="w-7 h-7 text-green-500" /> : <ToggleLeft className="w-7 h-7 text-amber-500" />}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        تغییر وضعیت محصول
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                        آیا از {newStatus ? 'فعال' : 'غیرفعال'} کردن محصول{' '}
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{product.code || product.description}</span> مطمئن هستید؟
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={isToggling}
                            className={`flex-1 px-4 py-2.5 ${newStatus ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'} text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isToggling ? <Loader2 className="w-4 h-4 animate-spin" /> : (newStatus ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />)}
                            {newStatus ? 'فعال کردن' : 'غیرفعال کردن'}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            انصراف
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main Component
export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showToggleModal, setShowToggleModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isToggling, setIsToggling] = useState(false);
    const [sortField, setSortField] = useState<'id' | 'code' | 'settlementDays' | 'active'>('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

    const client = new Api();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await client.api.getAll();
            setProducts(response.data || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = [...products];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.code?.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query) ||
                p.walletTypeCode?.toLowerCase().includes(query) ||
                p.id?.toString().includes(query)
            );
        }

        if (statusFilter === 'active') {
            filtered = filtered.filter(p => p.active === true);
        } else if (statusFilter === 'inactive') {
            filtered = filtered.filter(p => p.active === false);
        }

        filtered.sort((a, b) => {
            let aVal: any = a[sortField];
            let bVal: any = b[sortField];

            if (sortField === 'active') {
                aVal = a.active ? 1 : 0;
                bVal = b.active ? 1 : 0;
            }

            if (aVal === undefined) aVal = '';
            if (bVal === undefined) bVal = '';

            if (typeof aVal === 'string') aVal = aVal.toLowerCase();
            if (typeof bVal === 'string') bVal = bVal.toLowerCase();

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredProducts(filtered);
    }, [products, searchQuery, statusFilter, sortField, sortDirection]);

    const handleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const SortIcon = ({ field }: { field: typeof sortField }) => {
        if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />;
        return <ArrowUpDown className={`w-3.5 h-3.5 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'} text-primary`} />;
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setShowFormModal(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setShowFormModal(true);
        setShowDetailModal(false);
    };

    const handleDelete = (product: Product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleToggleActive = (product: Product) => {
        setSelectedProduct(product);
        setShowToggleModal(true);
    };

    const handleView = (product: Product) => {
        setSelectedProduct(product);
        setShowDetailModal(true);
    };

    const handleSave = async (data: Partial<Product>) => {
        setIsSaving(true);
        try {
            if (selectedProduct?.id) {
                await client.api.update(selectedProduct.id, data as Product);
            } else {
                await client.api.create1(data as Product);
            }
            await fetchProducts();
            setShowFormModal(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error('Failed to save product:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedProduct?.id) return;
        setIsDeleting(true);
        try {
            await client.api.delete(selectedProduct.id);
            await fetchProducts();
            setShowDeleteModal(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error('Failed to delete product:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleConfirmToggle = async () => {
        if (!selectedProduct?.id) return;
        setIsToggling(true);
        try {
            const updated = { ...selectedProduct, active: !selectedProduct.active };
            await client.api.update(selectedProduct.id, updated as Product);
            await fetchProducts();
            setShowToggleModal(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error('Failed to toggle product status:', error);
        } finally {
            setIsToggling(false);
        }
    };

    const handleExport = () => {
        exportToCSV(filteredProducts);
    };

    const handleReset = () => {
        setSearchQuery('');
        setStatusFilter('all');
    };

    const hasFilters = searchQuery !== '' || statusFilter !== 'all';

    const stats = {
        total: products.length,
        active: products.filter(p => p.active).length,
        inactive: products.filter(p => !p.active).length
    };

    return (
        <div className="bg-white dark:bg-background-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
            {/* فقط تب - بدون تایتل */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border-light dark:border-border-dark bg-slate-50/30 dark:bg-slate-800/10">
                <div className="flex items-center gap-6">
                    <span className="text-sm font-bold text-slate-900 dark:text-white border-b-2 border-primary pb-2">
                        محصولات
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{stats.total} محصول</span>
                </div>
            </div>

            {/* Filter Bar - مینیمال */}
            <div className="flex flex-col gap-3 p-4 border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* جستجو */}
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="جستجو..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100 placeholder:text-slate-400 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => { setSearchQuery(''); }}
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
                                    {(searchQuery ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0)}
                                </span>
                            )}
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
                            onClick={fetchProducts}
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

                {/* Advanced Filter - Collapsible */}
                {showAdvancedFilter && (
                    <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border-light dark:border-border-dark">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">وضعیت:</span>
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value as any)}
                                className="rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="all">همه</option>
                                <option value="active">فعال</option>
                                <option value="inactive">غیرفعال</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-base text-slate-400">محصولی یافت نشد</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800/50">
                                <th
                                    className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => handleSort('id')}
                                >
                                    <div className="flex items-center gap-1.5">
                                        شناسه
                                        <SortIcon field="id" />
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => handleSort('code')}
                                >
                                    <div className="flex items-center gap-1.5">
                                        کد
                                        <SortIcon field="code" />
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">توضیحات</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">نوع کیف پول</th>
                                <th
                                    className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => handleSort('settlementDays')}
                                >
                                    <div className="flex items-center gap-1.5">
                                        روز تسویه
                                        <SortIcon field="settlementDays" />
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400">ویژگی‌ها</th>
                                <th
                                    className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => handleSort('active')}
                                >
                                    <div className="flex items-center gap-1.5">
                                        وضعیت
                                        <SortIcon field="active" />
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {filteredProducts.map(product => {
                                const activeStatus = getActiveBadge(product.active || false);
                                const StatusIcon = activeStatus.icon;
                                return (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group"
                                    >
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                                {product.id}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                                                {product.code || '---'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-slate-600 dark:text-slate-400 max-w-xs block truncate" title={product.description}>
                                                {product.description || '---'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                                                {product.walletTypeCode || '---'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                {product.settlementDays ?? '---'} روز
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1.5">
                                                {product.allowsLeverage && <FeatureBadge label="اهرم" icon={Zap} />}
                                                {product.hasFunding && <FeatureBadge label="تامین مالی" icon={Clock} />}
                                                {product.hasExpiry && <FeatureBadge label="انقضا" icon={AlertCircle} />}
                                                {!product.allowsLeverage && !product.hasFunding && !product.hasExpiry && (
                                                    <span className="text-xs text-slate-400">---</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={activeStatus.variant} size="sm">
                                                {activeStatus.label}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => handleView(product)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                                                    title="مشاهده"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all"
                                                    title="ویرایش"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(product)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                                                    title={product.active ? 'غیرفعال' : 'فعال'}
                                                >
                                                    {product.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product)}
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
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => { setShowDetailModal(false); setSelectedProduct(null); }}
                    onEdit={handleEdit}
                />
            )}

            {showFormModal && (
                <ProductFormModal
                    product={selectedProduct}
                    onClose={() => { setShowFormModal(false); setSelectedProduct(null); }}
                    onSave={handleSave}
                    isSaving={isSaving}
                />
            )}

            {showDeleteModal && (
                <DeleteConfirmModal
                    product={selectedProduct}
                    onClose={() => { setShowDeleteModal(false); setSelectedProduct(null); }}
                    onConfirm={handleConfirmDelete}
                    isDeleting={isDeleting}
                />
            )}

            {showToggleModal && (
                <ToggleStatusModal
                    product={selectedProduct}
                    onClose={() => { setShowToggleModal(false); setSelectedProduct(null); }}
                    onConfirm={handleConfirmToggle}
                    isToggling={isToggling}
                />
            )}
        </div>
    );
}