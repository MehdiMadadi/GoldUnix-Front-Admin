// pages/admin/UsersPage.tsx
import { useEffect, useState } from 'react';
import { Api, UserAccountDto, UserWalletDto, FinancialAccountDto, AccountTransactionsDto, OrderDto, TradeDto, UserChangeStatusDto } from '../lib/client';
import Badge from '../components/UI/Badge';
import {
    Users,
    Search,
    ChevronRight,
    ChevronLeft,
    Eye,
    Wallet,
    Filter,
    X,
    RefreshCw,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    User,
    CreditCard,
    History,
    ShoppingBag,
    TrendingUp,
    MoreHorizontal,
    Edit,
    Ban,
    Check,
    Loader2,
    Calendar,
    Phone,
    Mail,
    Fingerprint,
    Award,
    Coins,
    ArrowLeft,
    Home,
    Activity,
    FileText,
    ExternalLink
} from 'lucide-react';

// Status Badge
const getUserStatusBadge = (status?: string) => {
    switch (status) {
        case 'ACTIVE':
            return { label: 'فعال', variant: 'success' as const, icon: CheckCircle };
        case 'BLOCKED':
            return { label: 'مسدود', variant: 'danger' as const, icon: Ban };
        case 'SUSPENDED':
            return { label: 'معلق', variant: 'warning' as const, icon: Clock };
        default:
            return { label: 'نامشخص', variant: 'neutral' as const, icon: AlertCircle };
    }
};

const getUserLevelBadge = (level?: string) => {
    switch (level) {
        case 'VIP':
            return { label: 'VIP', variant: 'gold' as const };
        case 'COLLEAGUE':
            return { label: 'همکار', variant: 'info' as const };
        default:
            return { label: 'عادی', variant: 'neutral' as const };
    }
};

// Transaction Type Badge
const getTransactionTypeBadge = (type?: string) => {
    switch (type?.toLowerCase()) {
        case 'deposit':
            return { label: 'واریز', variant: 'success' as const };
        case 'withdrawal':
            return { label: 'برداشت', variant: 'danger' as const };
        case 'buy':
            return { label: 'خرید', variant: 'primary' as const };
        case 'sell':
            return { label: 'فروش', variant: 'warning' as const };
        default:
            return { label: type || '---', variant: 'neutral' as const };
    }
};

// Sidebar Component for User Details
function UserDetailSidebar({
    user,
    onClose,
    onStatusChange
}: {
    user: UserAccountDto | null;
    onClose: () => void;
    onStatusChange: (userId: number, status: string) => void;
}) {
    const [activeTab, setActiveTab] = useState<'info' | 'wallets' | 'orders' | 'trades'>('info');
    const [wallets, setWallets] = useState<FinancialAccountDto[]>([]);
    const [selectedWallet, setSelectedWallet] = useState<FinancialAccountDto | null>(null);
    const [transactions, setTransactions] = useState<AccountTransactionsDto[]>([]);
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [trades, setTrades] = useState<TradeDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [changingStatus, setChangingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    const client = new Api();

    useEffect(() => {
        setActiveTab('info');
    }, [])

    if (!user) return null;

    const statusBadge = getUserStatusBadge(user.status);
    const levelBadge = getUserLevelBadge(user.userLevel);
    const StatusIcon = statusBadge.icon;

    const fetchWallets = async () => {
        if (!user.id) return;
        setLoading(true);
        try {
            const response = await client.api.getWalletsPreUsers(user.id);
            setWallets(response.data || []);
        } catch (error) {
            console.error('Failed to fetch wallets:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWalletTransactions = async (accountNumber: string) => {
        setLoading(true);
        try {
            const response = await client.api.getWalletTransactions({
                accountNumber,
                from: 0,
                size: 50
            });
            setTransactions(response.data?.transactions || []);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        if (!user.username) return;
        setLoading(true);
        try {
            const response = await client.api.getOrders({
                username: user.username,
                from: 0,
                size: 50
            });
            setOrders(response.data?.orders || []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrades = async () => {
        if (!user.username) return;
        setLoading(true);
        try {
            const response = await client.api.getTrades1({
                username: user.username,
                from: 0,
                size: 50
            });
            setTrades(response.data?.trades || []);
        } catch (error) {
            console.error('Failed to fetch trades:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'wallets') {
            fetchWallets();
        } else if (activeTab === 'orders') {
            fetchOrders();
        } else if (activeTab === 'trades') {
            fetchTrades();
        }
    }, [activeTab, user.id]);

    const handleWalletClick = (wallet: FinancialAccountDto) => {
        setSelectedWallet(wallet);
        if (wallet.accountNumber) {
            fetchWalletTransactions(wallet.accountNumber);
        }
    };

    const handleStatusChange = async () => {
        if (!user.id || !newStatus) return;
        setChangingStatus(true);
        try {
            await onStatusChange(user.id, newStatus);
            setNewStatus('');
        } finally {
            setChangingStatus(false);
        }
    };

    const tabs = [
        { id: 'info', label: 'اطلاعات کاربر', icon: User },
        { id: 'wallets', label: 'کیف پول‌ها', icon: Wallet, count: wallets.length },
        { id: 'orders', label: 'سفارشات', icon: ShoppingBag, count: orders.length },
        { id: 'trades', label: 'معاملات', icon: TrendingUp, count: trades.length },
    ];

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white dark:bg-surface-dark shadow-2xl border-l border-border-light dark:border-border-dark overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark px-5 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                            <ArrowLeft className="w-4 h-4 text-slate-500" />
                        </button>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">
                                {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-xs text-slate-400">{user.username || user.mobileNumber}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant={statusBadge.variant}>
                            <span className="flex items-center gap-1">
                                <StatusIcon className="w-3 h-3" />
                                {statusBadge.label}
                            </span>
                        </Badge>
                        <Badge variant={levelBadge.variant as any}>{levelBadge.label}</Badge>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border-light dark:border-border-dark overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as any);
                                setSelectedWallet(null);
                            }}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-5">
                    {/* Info Tab */}
                    {activeTab === 'info' && (
                        <div className="space-y-5">
                            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">اطلاعات شخصی</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-400">نام</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{user.firstName || '---'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">نام خانوادگی</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{user.lastName || '---'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            شماره موبایل
                                        </p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1" dir="ltr">{user.phoneNumber || '---'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            ایمیل
                                        </p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{user.email || '---'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Fingerprint className="w-3 h-3" />
                                            کد ملی
                                        </p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">{user.nationalId || '---'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            تاریخ تولد
                                        </p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white mt-1">
                                            {user.birthDate ? new Date(user.birthDate).toLocaleDateString('fa-IR') : '---'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">اطلاعات حساب</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-400">کد معرف</p>
                                        <p className="text-sm font-mono text-slate-900 dark:text-white mt-1">{user.referralCode || '---'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">تاریخ ثبت نام</p>
                                        <p className="text-sm text-slate-900 dark:text-white mt-1">
                                            {user.joinDate ? new Date(user.joinDate).toLocaleDateString('fa-IR') : '---'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">احراز هویت</p>
                                        <Badge variant={user.isKycVerified ? 'success' : 'warning'} size="sm">
                                            {user.isKycVerified ? 'تایید شده' : 'تایید نشده'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Change Status */}
                            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/30">
                                <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-3">تغییر وضعیت کاربر</h4>
                                <div className="flex gap-3">
                                    <select
                                        value={newStatus}
                                        onChange={e => setNewStatus(e.target.value)}
                                        className="flex-1 rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                                    >
                                        <option value="">انتخاب وضعیت جدید...</option>
                                        <option value="ACTIVE">فعال</option>
                                        <option value="BLOCKED">مسدود</option>
                                        <option value="SUSPENDED">معلق</option>
                                    </select>
                                    <button
                                        onClick={handleStatusChange}
                                        disabled={!newStatus || changingStatus}
                                        className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 disabled:opacity-50"
                                    >
                                        {changingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : 'اعمال'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Wallets Tab */}
                    {activeTab === 'wallets' && (
                        <div>
                            {selectedWallet ? (
                                <div>
                                    <button
                                        onClick={() => setSelectedWallet(null)}
                                        className="flex items-center gap-1 text-xs text-primary mb-4 hover:underline"
                                    >
                                        <ArrowLeft className="w-3 h-3" />
                                        بازگشت به لیست کیف پول‌ها
                                    </button>

                                    <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-xl p-4 mb-4 border border-primary/10">
                                        <h4 className="font-bold text-slate-900 dark:text-white">{selectedWallet.description || selectedWallet.name}</h4>
                                        <p className="text-xs text-slate-400">شماره حساب: {selectedWallet.accountNumber}</p>
                                        <div className="mt-3 flex items-center gap-4">
                                            <div>
                                                <p className="text-xs text-slate-400">موجودی</p>
                                                <p className="text-xl font-bold text-primary">
                                                    {selectedWallet.balances?.balance?.toLocaleString() ?? '0'}
                                                    <span className="text-xs font-normal"> {selectedWallet.currency?.name}</span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400">موجودی قابل استفاده</p>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {selectedWallet.balances?.availableBalance?.toLocaleString() ?? '0'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transactions */}
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">تراکنش‌ها</h4>
                                    {loading ? (
                                        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                                    ) : transactions.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400">تراکنشی یافت نشد</div>
                                    ) : (
                                        <div className="space-y-2">
                                            {transactions.map(tx => {
                                                const typeBadge = getTransactionTypeBadge(tx.transactionType?.code);
                                                return (
                                                    <div key={tx.id} className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-3">
                                                        <div className="flex items-center justify-between">
                                                            <Badge variant={typeBadge.variant} size="sm">{typeBadge.label}</Badge>
                                                            <span className="text-xs text-slate-400">
                                                                {tx.dateTime ? new Date(tx.dateTime).toLocaleString('fa-IR') : '---'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-sm text-slate-600 dark:text-slate-400">{tx.description || tx.note || '---'}</span>
                                                            <span className={`text-sm font-bold ${tx.amount && tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {tx.amount?.toLocaleString()} {tx.currencyType}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {loading ? (
                                        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                                    ) : wallets.length === 0 ? (
                                        <div className="text-center py-8 text-slate-400">کیف پولی یافت نشد</div>
                                    ) : (
                                        wallets.map(wallet => (
                                            <div
                                                key={wallet.id}
                                                onClick={() => handleWalletClick(wallet)}
                                                className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-slate-900 dark:text-white">{wallet.description || wallet.name}</h4>
                                                        <p className="text-xs text-slate-400">{wallet.accountNumber}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-primary">
                                                            {wallet.balances?.balance?.toLocaleString() ?? '0'}
                                                        </p>
                                                        <p className="text-xs text-slate-400">{wallet.currency?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                                                    <span>نوع: {wallet.type?.description}</span>
                                                    <span>وضعیت: {wallet.status?.description}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div>
                            {loading ? (
                                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">سفارشی یافت نشد</div>
                            ) : (
                                <div className="space-y-3">
                                    {orders.map(order => (
                                        <div key={order.orderId} className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={order.side === 'BUY' ? 'success' : 'danger'} size="sm">
                                                        {order.side === 'BUY' ? 'خرید' : 'فروش'}
                                                    </Badge>
                                                    <span className="text-xs text-slate-400">#{order.orderId}</span>
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleString('fa-IR') : '---'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                                                <div>
                                                    <p className="text-xs text-slate-400">مقدار</p>
                                                    <p className="text-sm font-semibold">{order.quantity?.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400">قیمت واحد</p>
                                                    <p className="text-sm font-semibold">{order.unitPrice?.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400">جمع کل</p>
                                                    <p className="text-sm font-bold text-primary">{order.totalAmount?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-slate-400">
                                                وضعیت: {order.status || '---'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Trades Tab */}
                    {activeTab === 'trades' && (
                        <div>
                            {loading ? (
                                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                            ) : trades.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">معامله‌ای یافت نشد</div>
                            ) : (
                                <div className="space-y-3">
                                    {trades.map(trade => (
                                        <div key={trade.id} className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4">
                                            <div className="flex items-center justify-between">
                                                <Badge variant={trade.order?.side === 'BUY' ? 'success' : 'danger'} size="sm">
                                                    {trade.order?.side === 'BUY' ? 'خرید' : 'فروش'}
                                                </Badge>
                                                <span className="text-xs text-slate-400">
                                                    {trade.executedAt ? new Date(trade.executedAt).toLocaleString('fa-IR') : '---'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-3 mt-3 text-center">
                                                <div>
                                                    <p className="text-xs text-slate-400">محصول</p>
                                                    <p className="text-sm font-semibold">{trade.productCode}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400">مقدار</p>
                                                    <p className="text-sm font-semibold">{trade.quantity?.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400">قیمت اجرا</p>
                                                    <p className="text-sm font-semibold">{trade.executionPrice?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between text-xs">
                                                <span className="text-slate-400">کارمزد: {trade.feeAmount?.toLocaleString()}</span>
                                                <span className="text-slate-400">اسپرد: {trade.spread}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Main Component
export default function UsersPage() {
    const [users, setUsers] = useState<UserAccountDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedUser, setSelectedUser] = useState<UserAccountDto | null>(null);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 15;

    const client = new Api();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const filter: any = {
                pageNumber,
                pageSize,
            };
            if (searchQuery) {
                if (searchQuery.match(/^\d+$/)) {
                    filter.userId = parseInt(searchQuery);
                } else if (searchQuery.match(/^09\d{9}$/)) {
                    filter.mobileNumber = searchQuery;
                } else {
                    filter.username = searchQuery;
                }
            }
            const response = await client.api.getUsers(filter);
            setUsers(response.data?.users || []);
            setTotalCount(response.data?.count || 0);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [pageNumber]);

    const handleSearch = () => {
        setPageNumber(0);
        fetchUsers();
    };

    const handleStatusChange = async (userId: number, status: string) => {
        try {
            await client.api.changeUserStatus(userId, { status });
            fetchUsers();
            setSelectedUser(null);
        } catch (error) {
            console.error('Failed to change user status:', error);
        }
    };

    const handleReset = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setPageNumber(0);
    };

    const stats = {
        total: totalCount,
        active: users.filter(u => u.status === 'ACTIVE').length,
        blocked: users.filter(u => u.status === 'BLOCKED').length,
    };

    const statusOptions = [
        { value: 'all', label: 'همه' },
        { value: 'ACTIVE', label: 'فعال' },
        { value: 'BLOCKED', label: 'مسدود' },
        { value: 'SUSPENDED', label: 'معلق' },
    ];

    const filteredUsers = statusFilter === 'all'
        ? users
        : users.filter(u => u.status === statusFilter);

    return (
        <div className="bg-white dark:bg-background-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-border-light dark:border-border-dark">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            مدیریت کاربران
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">مشاهده، جستجو و مدیریت کاربران سیستم</p>
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        بروزرسانی
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="px-6 pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-2xl p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400">کل کاربران</p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total.toLocaleString()}</p>
                            </div>
                            <Users className="w-10 h-10 text-blue-500/50" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 rounded-2xl p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-green-600 dark:text-green-400">کاربران فعال</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.active.toLocaleString()}</p>
                            </div>
                            <CheckCircle className="w-10 h-10 text-green-500/50" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 rounded-2xl p-4 border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-red-600 dark:text-red-400">کاربران مسدود</p>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.blocked.toLocaleString()}</p>
                            </div>
                            <Ban className="w-10 h-10 text-red-500/50" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 border-b border-border-light dark:border-border-dark bg-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="جستجو بر اساس نام، شماره موبایل، یا شناسه کاربری..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            className="w-full rounded-xl border border-border-light bg-white dark:bg-background-dark pr-11 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="bg-white dark:bg-slate-800 border border-border-light rounded-xl px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleSearch}
                            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all"
                        >
                            جستجو
                        </button>

                        {(searchQuery || statusFilter !== 'all') && (
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-white border border-border-light text-slate-600 hover:text-red-500"
                            >
                                <X className="w-4 h-4" />
                                حذف فیلتر
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-20">
                        <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-base text-slate-400">کاربری یافت نشد</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border-light bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600">شناسه</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600">نام و نام خانوادگی</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600">شماره موبایل</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600">سطح</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600">احراز هویت</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600">وضعیت</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light">
                            {filteredUsers.map(user => {
                                const statusBadge = getUserStatusBadge(user.status);
                                const levelBadge = getUserLevelBadge(user.userLevel);
                                const StatusIcon = statusBadge.icon;
                                return (
                                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                {user.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className="text-xs text-slate-400">{user.username}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono text-slate-600 dark:text-slate-400" dir="ltr">
                                                {user.phoneNumber || '---'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={levelBadge.variant as any} size="sm">{levelBadge.label}</Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={user.isKycVerified ? 'success' : 'warning'} size="sm">
                                                {user.isKycVerified ? 'تایید شده' : 'تایید نشده'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={statusBadge.variant}>
                                                <span className="flex items-center gap-1">
                                                    <StatusIcon className="w-3 h-3" />
                                                    {statusBadge.label}
                                                </span>
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                                                    title="مشاهده جزئیات"
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
            {!loading && totalCount > pageSize && (
                <div className="px-6 py-4 border-t border-border-light bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                            نمایش {pageNumber * pageSize + 1} تا {Math.min((pageNumber + 1) * pageSize, totalCount)} از {totalCount.toLocaleString()} کاربر
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={pageNumber === 0}
                                onClick={() => setPageNumber(p => p - 1)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-border-light text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                                قبلی
                            </button>
                            <button
                                disabled={(pageNumber + 1) * pageSize >= totalCount}
                                onClick={() => setPageNumber(p => p + 1)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90"
                            >
                                بعدی
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Detail Sidebar */}
            <UserDetailSidebar
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
}