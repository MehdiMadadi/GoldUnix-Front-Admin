import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiFilter, FiDownload, FiExternalLink, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Badge from '../../components/UI/Badge';
import Pagination from '../../components/UI/Pagination';
import UserDrawer from '../../components/UserDrawer';
import { Api, UserAccountDto, UserAccountShowcase } from '../../lib/client';

const ITEMS_PER_PAGE = 10;

// Filter Types
type UserType = 'all' | 'trade' | 'normal';
type UserStatus = 'all' | 'ACTIVE' | 'BLOCKED' | 'SUSPENDED';
type UserLevel = 'all' | 'NORMAL' | 'VIP' | 'COLLEAGUE';
type KycStatus = 'all' | 'verified' | 'unverified';

interface Filters {
  search: string;
  userType: UserType;
  status: UserStatus;
  level: UserLevel;
  kyc: KycStatus;
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  userType: 'all',
  status: 'all',
  level: 'all',
  kyc: 'all',
};

function getStatusBadge(status?: UserAccountDto['status']) {
  if (status === 'ACTIVE') return <Badge variant="success">فعال</Badge>;
  if (status === 'BLOCKED') return <Badge variant="danger">مسدود</Badge>;
  if (status === 'SUSPENDED') return <Badge variant="warning">معلق</Badge>;
  return <Badge variant="neutral">نامشخص</Badge>;
}

function getTypeBadge(type?: string) {
  if (type === 'trade') return <Badge variant="primary">صنف</Badge>;
  return <Badge variant="neutral">عادی</Badge>;
}

function getLevelBadge(level?: string) {
  if (level === 'VIP') return <Badge variant="gold">VIP</Badge>;
  if (level === 'COLLEAGUE') return <Badge variant="info">همکار</Badge>;
  return <Badge variant="neutral">عادی</Badge>;
}

function formatNumber(num?: number): string {
  if (!num && num !== 0) return '---';
  return num.toLocaleString('fa-IR');
}

// Export to CSV
function exportToCSV(users: UserAccountDto[]) {
  if (users.length === 0) return;

  const headers = ['شناسه', 'نام', 'نام خانوادگی', 'شماره موبایل', 'کد ملی', 'ایمیل', 'نوع کاربر', 'سطح', 'وضعیت', 'احراز هویت'];
  const rows = users.map(user => [
    user.id || '',
    user.firstName || '',
    user.lastName || '',
    user.phoneNumber || '',
    user.nationalId || '',
    user.email || '',
    user.type || 'عادی',
    user.userLevel || 'NORMAL',
    user.status || '',
    user.isKycVerified ? 'تایید شده' : 'تایید نشده'
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export default function UsersPage() {
  const navigate = useNavigate();
  const client = new Api();

  const [users, setUsers] = useState<UserAccountDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccountDto | null>(null);
  const [showcase, setShowcase] = useState<UserAccountShowcase | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const filter: any = {
        pageNumber: start,
        pageSize: ITEMS_PER_PAGE,
      };

      // Search
      if (filters.search) {
        if (filters.search.match(/^\d+$/)) {
          filter.userId = parseInt(filters.search);
        } else if (filters.search.match(/^09\d{9}$/)) {
          filter.mobileNumber = filters.search;
        } else {
          filter.username = filters.search;
        }
      }

      // Filters
      if (filters.userType !== 'all') {
        filter.typeCode = filters.userType === 'trade' ? 'trade' : 'normal';
      }
      if (filters.status !== 'all') {
        filter.status = filters.status;
      }

      const response = await client.api.getUsers(filter);
      
      // Apply client-side filters for level and kyc (since API might not support them)
      let filteredUsers = response.data?.users || [];
      
      if (filters.level !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.userLevel === filters.level);
      }
      if (filters.kyc !== 'all') {
        filteredUsers = filteredUsers.filter(u => 
          filters.kyc === 'verified' ? u.isKycVerified : !u.isKycVerified
        );
      }

      setUsers(filteredUsers);
      setTotalCount(filteredUsers.length);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const fetchShowcase = async () => {
    try {
      const response = await client.api.userShowcase();
      setShowcase(response.data);
    } catch (error) {
      console.error('Failed to fetch showcase:', error);
    }
  };

  useEffect(() => {
    fetchShowcase();
  }, []);

  useEffect(() => {
    const delay = setTimeout(fetchUsers, 300);
    return () => clearTimeout(delay);
  }, [fetchUsers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setPage(1);
  };

  const clearSearch = () => {
    setFilters(prev => ({ ...prev, search: '' }));
    setPage(1);
  };

  const handleFilterChange = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    setShowFilters(false);
  };

  const openDrawer = (user: UserAccountDto) => {
    setSelectedUser(user);
  };

  const closeDrawer = () => {
    setSelectedUser(null);
  };

  const handleExport = () => {
    exportToCSV(users);
  };

  const hasActiveFilters = filters.userType !== 'all' || filters.status !== 'all' || 
                           filters.level !== 'all' || filters.kyc !== 'all';

  return (
    <>
      <UserDrawer user={selectedUser} onClose={closeDrawer} />

      <Header title="مدیریت کاربران" showMarketStatus />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto space-y-5">

          {/* Simple Stats Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              کل کاربران: <span className="font-bold text-slate-900 dark:text-white">{formatNumber(showcase?.userCount)}</span>
            </span>
            <span className="w-px h-4 bg-border-light dark:bg-border-dark" />
            <span>
              فعال: <span className="font-bold text-emerald-600">{formatNumber(showcase?.userActiveCount)}</span>
            </span>
            <span className="w-px h-4 bg-border-light dark:bg-border-dark" />
            {/* <span>
              صنف: <span className="font-bold text-primary">{formatNumber(showcase?.userTradeCount)}</span>
            </span>
            <span className="w-px h-4 bg-border-light dark:bg-border-dark" />
            <span>
              تعهد باز: <span className="font-bold text-amber-500">{formatNumber(showcase?.openMarginCount)}</span>
            </span> */}
            {hasActiveFilters && (
              <>
                <span className="w-px h-4 bg-border-light dark:bg-border-dark" />
                <button
                  onClick={resetFilters}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <FiX className="w-3 h-3" />
                  حذف فیلترها
                </button>
              </>
            )}
          </div>

          {/* Users Table */}
          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 p-4 border-b border-border-light dark:border-border-dark">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={handleSearch}
                    placeholder="جستجو بر اساس نام، موبایل یا شناسه..."
                    className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-background-dark pr-10 pl-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-slate-100"
                  />
                  {filters.search && (
                    <button
                      onClick={clearSearch}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      showFilters || hasActiveFilters
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <FiFilter className="w-4 h-4" />
                    فیلتر
                    {hasActiveFilters && (
                      <span className="w-4 h-4 text-[10px] bg-white/20 rounded-full flex items-center justify-center">
                        {Object.values({ userType: filters.userType, status: filters.status, level: filters.level, kyc: filters.kyc }).filter(v => v !== 'all').length}
                      </span>
                    )}
                    {showFilters ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all"
                    title="خروجی اکسل"
                  >
                    <FiDownload className="w-4 h-4" />
                    خروجی
                  </button>
                  <span className="text-xs text-slate-400 mr-2">
                    {totalCount.toLocaleString('fa-IR')} کاربر
                  </span>
                </div>
              </div>

              {/* Filters Panel - Collapsible */}
              {showFilters && (
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border-light dark:border-border-dark">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">نوع کاربر:</span>
                    <select
                      value={filters.userType}
                      onChange={e => handleFilterChange('userType', e.target.value as UserType)}
                      className="rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">همه</option>
                      <option value="trade">صنف</option>
                      <option value="normal">عادی</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">وضعیت:</span>
                    <select
                      value={filters.status}
                      onChange={e => handleFilterChange('status', e.target.value as UserStatus)}
                      className="rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">همه</option>
                      <option value="ACTIVE">فعال</option>
                      <option value="BLOCKED">مسدود</option>
                      <option value="SUSPENDED">معلق</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">سطح:</span>
                    <select
                      value={filters.level}
                      onChange={e => handleFilterChange('level', e.target.value as UserLevel)}
                      className="rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">همه</option>
                      <option value="NORMAL">عادی</option>
                      <option value="VIP">VIP</option>
                      <option value="COLLEAGUE">همکار</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">احراز هویت:</span>
                    <select
                      value={filters.kyc}
                      onChange={e => handleFilterChange('kyc', e.target.value as KycStatus)}
                      className="rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-slate-800 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="all">همه</option>
                      <option value="verified">تایید شده</option>
                      <option value="unverified">تایید نشده</option>
                    </select>
                  </div>

                  <button
                    onClick={resetFilters}
                    className="text-xs text-red-500 hover:text-red-600 px-2 py-1"
                  >
                    حذف همه
                  </button>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <p className="text-sm">کاربری یافت نشد</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-border-light dark:border-border-dark">
                    <tr>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">شناسه</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">نام و نام خانوادگی</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">شماره موبایل</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">نوع</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">سطح</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">احراز هویت</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">وضعیت</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {users.map(user => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer"
                        onClick={() => openDrawer(user)}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {user.id}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                          {user.firstName} {user.lastName}
                          {user.username && (
                            <span className="block text-xs text-slate-400 font-normal">{user.username}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 font-mono" dir="ltr">
                          {user.phoneNumber || '---'}
                        </td>
                        <td className="px-4 py-3">{getTypeBadge(user.type)}</td>
                        <td className="px-4 py-3">{getLevelBadge(user.userLevel)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={user.isKycVerified ? 'success' : 'warning'} size="sm">
                            {user.isKycVerified ? 'تایید شده' : 'تایید نشده'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={e => { e.stopPropagation(); openDrawer(user); }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-all"
                            >
                              <FiExternalLink size={14} />
                              جزئیات
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <Pagination
              total={totalCount}
              page={page}
              perPage={ITEMS_PER_PAGE}
              onChange={setPage}
            />
          </section>
        </div>
      </div>
    </>
  );
}