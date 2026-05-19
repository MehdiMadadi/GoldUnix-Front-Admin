import { useEffect, useState } from 'react';
import { USERS } from '../../data/users';
import type { User, WalletTransaction } from '../../data/users';
import Badge from '../UI/Badge';
import AccDrawer from './AccDrawer';
import { Api, TransactionTypeDto, UserWalletDto } from '../../lib/client';

type WalletSection = 'spot' | 'tomorrow' | 'day_after' | 'margin' | 'credit';

const WALLET_SECTIONS: { key: WalletSection; label: string }[] = [
  { key: 'spot', label: 'نقدی (Spot)' },
  { key: 'tomorrow', label: 'فردایی' },
  { key: 'day_after', label: 'پسفردایی' },
  { key: 'margin', label: 'مارجین' },
  { key: 'credit', label: 'اعتبار' },
];

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

const TX_TYPE_LABELS: Record<string, string> = {
  deposit: 'واریز',
  withdraw: 'برداشت',
  block: 'مسدود',
  release: 'آزادسازی',
};

const TX_TYPE_COLOR: Record<string, string> = {
  DPS: 'text-emerald-600 dark:text-emerald-400',
  DPI: 'text-emerald-600 dark:text-emerald-400',
  WTW: 'text-rose-600 dark:text-rose-400',
  block: 'text-amber-600 dark:text-amber-400',
  REV: 'text-blue-600 dark:text-blue-400',
};

function TxSign({ type }: { type: TransactionTypeDto }) {
  if (type.code === 'DPI' || type.code === 'REV') return <span className="text-emerald-600 dark:text-emerald-400 font-bold">+</span>;
  return <span className="text-rose-600 dark:text-rose-400 font-bold">-</span>;
}

function WalletDrawer({ user, onClose }: { user: UserWalletDto | null; onClose: () => void }) {
  const [activeSection, setActiveSection] = useState<WalletSection>('spot');
  if (!user) return null;

  const transactions = user.walletTransactions;

  const sectionBalances: Record<WalletSection, { balance: number; blocked: number }> = {
    spot: { balance: user.balance, blocked: user.blockedBalance },
    tomorrow: { balance: user.goldTomorrowDayAfter * 32_500_000, blocked: 0 },
    day_after: { balance: user.goldTomorrowDayAfter * 32_300_000, blocked: 0 },
    margin: { balance: user.marginBalance, blocked: 0 },
    credit: { balance: user.creditBalance, blocked: user.openObligation },
  };

  const bal = sectionBalances[activeSection];

  return (
    <AccDrawer
      open={user !== null}
      title={user.firstName + ' ' + user.lastName}
      // subtitle={user.type === 'trade' ? 'کاربر صنف' : 'کاربر عادی'}
      icon="account_balance_wallet"
      onClose={onClose}
    >
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          {user.status === 'ACTIVE' && <Badge variant="success">فعال</Badge>}
          {user.status === 'BLOCKED' && <Badge variant="danger">مسدود</Badge>}
          {user.status === 'SUSPENDED' && <Badge variant="warning">در انتظار</Badge>}
          {/* {user.type === 'trade' && <Badge variant="info">صنف</Badge>} */}
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {WALLET_SECTIONS.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${activeSection === s.key ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-4">
            <p className="text-xs text-slate-500 mb-1">موجودی</p>
            <p className="font-extrabold text-emerald-700 dark:text-emerald-300 ">{bal.balance}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4">
            <p className="text-xs text-slate-500 mb-1">مسدود/استفاده‌شده</p>
            <p className="font-extrabold text-amber-700 dark:text-amber-300 ">{bal.blocked}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">تراکنش‌ها</p>
          <div className="space-y-2">
            {transactions?.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">تراکنشی ثبت نشده</p>
            ) : (
              transactions?.map(tx => (
                <div key={tx.id} className="flex items-start justify-between p-3 bg-slate-50 dark:bg-background-dark/60 rounded-xl gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-bold ${TX_TYPE_COLOR[tx?.transactionType?.code!]}`}>{tx?.transactionType?.description!}</span>
                      <span className="text-[0.6rem] text-slate-400 ">{tx.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{tx.description}</p>
                    <p className="text-[0.6rem] text-slate-400 mt-0.5">{tx.jalaliDateTime}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className={` font-bold text-sm ${(tx?.transactionType?.code === 'DPI' || tx?.transactionType?.code === 'REV') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      <TxSign type={tx?.transactionType!} />{tx.amount}
                    </p>
                    <p className="text-[0.6rem] text-slate-400 mt-0.5">مانده: {tx.balance}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AccDrawer>
  );
}

export default function UserWalletsTab() {
  const [selected, setSelected] = useState<UserWalletDto | null>(null);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserWalletDto[]>();

  const client = new Api();

  useEffect(()=>{
    filtered();
  }, []);

  const filtered = async () => {
    try {
      const response = await client.api.getUserWallets({ assetCode: 'IRR', pageNumber: 0, pageSize: 10 });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  // const filtered = USERS.filter(u =>
  //   !search || u.name.includes(search) || u.mobile.includes(search)
  // );

  return (
    <>
      <div className="p-4 border-b border-border-light dark:border-border-dark">
        <input
          type="text"
          placeholder="جستجو بر اساس نام یا شماره موبایل..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>

      <div className="desktop-view table-container">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500 text-xs">
            <tr>
              <th className="px-4 py-3 text-right font-medium">کاربر</th>
              <th className="px-4 py-3 text-right font-medium">Spot</th>
              <th className="px-4 py-3 text-right font-medium">فردایی</th>
              <th className="px-4 py-3 text-right font-medium">پسفردایی</th>
              <th className="px-4 py-3 text-right font-medium">مارجین</th>
              <th className="px-4 py-3 text-right font-medium">موجودی اعتباری</th>
              <th className="px-4 py-3 text-right font-medium">وضعیت</th>
              <th className="px-4 py-3 text-center font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {users?.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors cursor-pointer" onClick={() => setSelected(u)}>
                <td className="px-4 py-3.5">
                  <div className="font-semibold text-slate-900 dark:text-white">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-slate-400">{u.phoneNumber}</div>
                </td>
                <td className="px-4 py-3.5  text-sm text-slate-700 dark:text-slate-300">{u.balance?.toLocaleString("fa-IR")} ریال</td>
                <td className="px-4 py-3.5  text-sm text-slate-700 dark:text-slate-300">{u.goldTomorrowDayAfter * 32_500_000}</td>
                <td className="px-4 py-3.5  text-sm text-slate-700 dark:text-slate-300">{u.goldTomorrowDayAfter * 32_300_000}</td>
                <td className="px-4 py-3.5  text-sm text-amber-600 dark:text-amber-400">{u.marginBalance?.toLocaleString("fa-IR")}</td>
                <td className="px-4 py-3.5  text-sm text-rose-600 dark:text-rose-400">{u.creditBalance?.toLocaleString("fa-IR")}</td>
                <td className="px-4 py-3.5">
                  {u.status === 'ACTIVE' && <Badge variant="success">فعال</Badge>}
                  {u.status === 'BLOCKED' && <Badge variant="danger">مسدود</Badge>}
                  {u.status === 'SUSPENDED' && <Badge variant="warning">در انتظار</Badge>}
                </td>
                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => setSelected(u)} title="جزئیات" className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </button>
                    <button title="مسدودسازی" className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors">
                      <span className="material-symbols-outlined text-sm">block</span>
                    </button>
                    <button title="تراکنش‌ها" className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                      <span className="material-symbols-outlined text-sm">receipt</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-view p-4 space-y-3">
        {users?.map(u => (
          <div key={u.id} className="user-card cursor-pointer" onClick={() => setSelected(u)}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{u.firstName} {u.lastName}</p>
                <p className="text-xs text-slate-400">{u.phoneNumber}</p>
              </div>
              <div className="flex items-center gap-1">
                {u.status === 'ACTIVE' && <Badge variant="success">فعال</Badge>}
                  {u.status === 'BLOCKED' && <Badge variant="danger">مسدود</Badge>}
                  {u.status === 'SUSPENDED' && <Badge variant="warning">در انتظار</Badge>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 dark:bg-background-dark/60 rounded-xl p-2">
                <p className="text-[0.6rem] text-slate-400 mb-0.5">Spot</p>
                <p className="font-bold text-xs ">{u.balance}</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-2">
                <p className="text-[0.6rem] text-slate-400 mb-0.5">مارجین</p>
                <p className="font-bold text-xs  text-amber-700 dark:text-amber-300">{u.blockedBalance}</p>
              </div>
              <div className="bg-rose-50 dark:bg-rose-950/20 rounded-xl p-2">
                <p className="text-[0.6rem] text-slate-400 mb-0.5">اعتبار</p>
                <p className="font-bold text-xs  text-rose-700 dark:text-rose-300">{u.openObligation}</p>
              </div>
            </div>
            <button className="mt-3 w-full py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
              جزئیات کیف پول
            </button>
          </div>
        ))}
      </div>

      <WalletDrawer user={selected} onClose={() => setSelected(null)} />
    </>
  );
}
