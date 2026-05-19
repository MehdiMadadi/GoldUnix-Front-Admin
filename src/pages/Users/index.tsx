import { useState, useMemo, useCallback, useEffect } from 'react';
import { FiBarChart2, FiFilter, FiDownload, FiExternalLink } from 'react-icons/fi';
import Header from '../../components/Layout/Header';
import Badge from '../../components/UI/Badge';
import Pagination from '../../components/UI/Pagination';
import UserFilterPanel from '../../components/Users/UserFilterPanel';
import UserStatsPanel from '../../components/Users/UserStatsPanel';
import UserDrawer from '../../components/UserDrawer';
import { DEFAULT_FILTERS, type UserFilters } from '../../components/Users/types';
import { USERS, USER_STATS, type User } from '../../data/users';
import { Api, UserAccountDto, UserAccountShowcase, PriceQuoteRequest, ApiResponsePriceQuote } from '../../lib/client';

type PanelType = 'filter' | 'stats' | null;

const ITEMS_PER_PAGE = 8;

function getRiskBadge(level: User['riskLevel']) {
  if (level === 'low') return <Badge variant="success">پایین</Badge>;
  if (level === 'medium') return <Badge variant="warning">متوسط</Badge>;
  return <Badge variant="danger">بالا</Badge>;
}

function getStatusBadge(status: UserAccountDto['status']) {
  if (status === 'ACTIVE') return <Badge variant="success">فعال</Badge>;
  if (status === 'BLOCKED') return <Badge variant="danger">مسدود</Badge>;
  return <Badge variant="neutral">در انتظار</Badge>;
}

function getTypeBadge(type: UserAccountDto['type']) {
  if (type === 'trade') return <Badge variant="primary">صنف</Badge>;
  return <Badge variant="neutral">عادی</Badge>;
}

function formatNumber(n: number) {
  return n;
}

export default function UsersPage() {
  const [panel, setPanel] = useState<PanelType>(null);
  const [pendingFilters, setPendingFilters] = useState<UserFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<UserFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserAccountDto | null>(null);
  const [users, setUsers] = useState<UserAccountDto[] | null>(null);
  const [userCount, setUserCount] = useState<number>(0);
  const [showcase, setShowcase] = useState<UserAccountShowcase>();
  const [goldBuyPrice, setGoldBuyPrice] = useState<number | null>(null);
  const [goldSellPrice, setGoldSellPrice] = useState<number | null>(null);

  const isDesktop = () => window.innerWidth >= 1024;

  const openFilter = useCallback(() => setPanel('filter'), []);
  const openStats = useCallback(() => setPanel('stats'), []);
  const closePanel = useCallback(() => setPanel(null), []);

  const handleApply = useCallback(() => {
    setAppliedFilters(pendingFilters);
    setPage(1);
    closePanel();
  }, [pendingFilters, closePanel]);

  const handleReset = useCallback(() => {
    setPendingFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  const openDrawer = useCallback((user: UserAccountDto) => {
    setPanel(null);
    setSelectedUser(user);
  }, []);

  const closeDrawer = useCallback(() => setSelectedUser(null), []);

  const filtered = useMemo(() => {
    return USERS.filter(u => {
      if (appliedFilters.search) {
        const q = appliedFilters.search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.mobile.includes(q)) return false;
      }
      if (appliedFilters.userType !== 'all' && u.type !== appliedFilters.userType) return false;
      if (appliedFilters.status !== 'all' && u.status !== appliedFilters.status) return false;
      if (appliedFilters.riskLevel !== 'all' && u.riskLevel !== appliedFilters.riskLevel) return false;
      if (appliedFilters.obligation === 'open' && u.openObligation === 0) return false;
      if (appliedFilters.obligation === 'none' && u.openObligation > 0) return false;
      return true;
    });
  }, [appliedFilters]);

  const client = new Api();

  const fetchUsers = async (start: number, size: number) => {
    // await client.rest.authenticate({username:'09372689372', password:'Milad@102030'})
    const response = await client.api.getUsers({ pageNumber: start, pageSize: size });
    setUsers(response.data?.users);
    setUserCount(response.data?.count);
  }

  const fetchShowcase = async () => {
    const response = await client.api.userShowcase();
    setShowcase(response.data);
  }

  const fetchGoldPrices = async () => {
    try {
      const buyRequest: PriceQuoteRequest = { assetCode: 'GOLD', amount: 1 };
      const sellRequest: PriceQuoteRequest = { assetCode: 'GOLD', amount: 1 };
      const buyRes = await client.api.getBuyPriceQuote(buyRequest);
      const sellRes = await client.api.getSellPriceQuote(sellRequest);
      if (buyRes.data?.data?.finalPrice) setGoldBuyPrice(buyRes.data.data.finalPrice);
      if (sellRes.data?.data?.finalPrice) setGoldSellPrice(sellRes.data.data.finalPrice);
    } catch (error) {
      console.error('Failed to fetch gold prices', error);
    }
  };

  useEffect(() => {
    fetchUsers(0, 10);
    fetchShowcase();
    fetchGoldPrices();
  }, []);

  useEffect(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const size = ITEMS_PER_PAGE;
    fetchUsers(start, size);
  }, [page]);

  return (
    <>
      {panel && (
        <div className="overlay show" onClick={closePanel} />
      )}

      {panel === 'filter' && (
        <UserFilterPanel
          filters={pendingFilters}
          onChange={setPendingFilters}
          onApply={handleApply}
          onReset={handleReset}
          onClose={closePanel}
          variant={isDesktop() ? 'desktop' : 'mobile'}
        />
      )}

      {panel === 'stats' && (
        <UserStatsPanel
          onClose={closePanel}
          variant={isDesktop() ? 'desktop' : 'mobile'}
        />
      )}

      <UserDrawer user={selectedUser} onClose={closeDrawer} />

      <Header title="کاربران" />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">

          <div className="kpi-section">
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: 'کل کاربران', value: showcase?.userCount?.toLocaleString('fa-IR'), color: '' },
                { label: 'فعال امروز', value: showcase?.userActiveCount?.toLocaleString('fa-IR'), color: 'text-emerald-500' },
                { label: 'کاربران صنف', value: showcase?.userTradeCount?.toLocaleString('fa-IR'), color: 'text-primary' },
                { label: 'تعهد باز', value: showcase?.openMarginCount?.toLocaleString('fa-IR'), color: 'text-amber-500' },
                { label: 'هشدار مارجین', value: showcase?.warningMarginCount?.toString(), color: 'text-rose-500' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-5">
                  <p className="text-sm text-slate-500">{kpi.label}</p>
                  <p className={`text-2xl font-extrabold mt-2 ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>
          </div>

          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border-light dark:border-border-dark">
              <div>
                <h3 className="font-bold text-lg">لیست کاربران</h3>
                <p className="text-xs text-slate-500 mt-0.5">{filtered.length.toLocaleString('fa-IR')} کاربر یافت شد</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={openStats}
                  className="icon-btn bg-gradient-to-br from-primary to-blue-500 text-white shadow-md hover:shadow-lg"
                >
                  <FiBarChart2 size={20} />
                </button>
                <button
                  onClick={openFilter}
                  className="icon-btn bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <FiFilter size={20} />
                </button>
                <button className="icon-btn bg-primary/10 text-primary hover:bg-primary/20">
                  <FiDownload size={20} />
                </button>
              </div>
            </div>

            <div className="desktop-view">
              <div className="table-container">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500">
                    <tr>
                      <th className="px-5 py-3 text-right font-medium">نام</th>
                      <th className="px-5 py-3 text-right font-medium">موبایل</th>
                      <th className="px-5 py-3 text-right font-medium">نوع</th>
                      <th className="px-5 py-3 text-right font-medium">وضعیت</th>
                      <th className="px-5 py-3 text-right font-medium">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {users?.map(user => (
                      <tr
                        key={user.id}
                        className={`hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors cursor-pointer ${selectedUser?.id === user.id ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                        onClick={() => openDrawer(user)}
                      >
                        <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{user.firstName} {user.lastName}</td>
                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400  text-xs">{user.phoneNumber}</td>
                        <td className="px-5 py-4">{getTypeBadge(user.type)}</td>
                        <td className="px-5 py-4">{getStatusBadge(user.status)}</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={e => { e.stopPropagation(); openDrawer(user); }}
                            className="flex items-center gap-1 text-primary hover:underline text-xs font-semibold"
                          >
                            <FiExternalLink size={14} />
                            مشاهده
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mobile-view p-4 space-y-4">
              {users?.map(user => (
                <div
                  key={user.id}
                  className={`user-card cursor-pointer transition-shadow hover:shadow-md ${selectedUser?.id === user.id ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                  onClick={() => openDrawer(user)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</h4>
                      <p className="text-xs text-slate-500 mt-1 ">{user.phoneNumber}</p>
                    </div>
                    {getTypeBadge(user.type)}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">وضعیت</p>
                      {getStatusBadge(user.status)}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark flex justify-between items-center">
                    <span className="text-xs text-slate-400">آخرین فعالیت: {user.lastActivity}</span>
                    <button
                      onClick={e => { e.stopPropagation(); openDrawer(user); }}
                      className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline"
                    >
                      <FiExternalLink size={14} />
                      مشاهده
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              total={userCount}
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