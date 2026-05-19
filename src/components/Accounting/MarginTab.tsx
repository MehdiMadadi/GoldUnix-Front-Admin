import { useState } from 'react';
import { USERS } from '../../data/users';
import type { User } from '../../data/users';
import Badge from '../UI/Badge';
import AccDrawer from './AccDrawer';

function fmt(n: number) {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} م`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 0 })} م`;
  return n;
}

function getRatioBadge(ratio: number) {
  if (ratio >= 150) return <Badge variant="success">{ratio.toLocaleString('fa-IR')}٪</Badge>;
  if (ratio >= 120) return <Badge variant="warning">{ratio.toLocaleString('fa-IR')}٪</Badge>;
  return <Badge variant="danger">{ratio.toLocaleString('fa-IR')}٪</Badge>;
}

function getRatioColor(ratio: number) {
  if (ratio >= 150) return 'text-emerald-600 dark:text-emerald-400';
  if (ratio >= 120) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
}

const MARGIN_INPUT_CLS = 'w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100 placeholder:text-slate-400';

function MarginActionDrawer({ user, onClose }: { user: User | null; onClose: () => void }) {
  const [mode, setMode] = useState<'add' | 'reduce'>('add');
  const [amount, setAmount] = useState('');
  const [done, setDone] = useState(false);

  if (!user) return null;

  const equity = user.balance + user.blockedBalance;
  const num = parseInt(amount, 10) || 0;
  const newMargin = mode === 'add' ? user.blockedBalance + num : Math.max(0, user.blockedBalance - num);
  const newRatio = equity > 0 ? Math.round((newMargin / equity) * 100) : 0;

  return (
    <AccDrawer
      open
      title="مدیریت مارجین"
      subtitle={user.name}
      icon="account_balance"
      onClose={() => { setDone(false); setAmount(''); onClose(); }}
    >
      <div className="p-5 space-y-5">
        {done && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">مارجین با موفقیت به‌روزرسانی شد.</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-3 text-center">
            <p className="text-xs text-slate-400">موجودی</p>
            <p className="font-bold text-sm mt-0.5 ">{fmt(user.balance)}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-3 text-center">
            <p className="text-xs text-slate-400">مارجین فعلی</p>
            <p className="font-bold text-sm mt-0.5  text-amber-700 dark:text-amber-300">{fmt(user.blockedBalance)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-background-dark/60 rounded-2xl p-3 text-center">
            <p className="text-xs text-slate-400">نسبت</p>
            <p className={`font-bold text-sm mt-0.5  ${getRatioColor(user.marginRatio)}`}>{user.marginRatio.toLocaleString('fa-IR')}٪</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMode('add')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${mode === 'add' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            افزایش مارجین
          </button>
          <button
            onClick={() => setMode('reduce')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${mode === 'reduce' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            کاهش مارجین
          </button>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-2 block">مبلغ (ریال)</label>
          <input type="number" placeholder="۰" value={amount} onChange={e => setAmount(e.target.value)} className={MARGIN_INPUT_CLS} />
        </div>

        {num > 0 && (
          <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-sm">preview</span>
              <p className="text-sm font-semibold">پیش‌نمایش</p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">مارجین جدید</span>
              <span className=" font-bold">{fmt(newMargin)} ریال</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">نسبت قبلی</span>
              <span className={` font-bold ${getRatioColor(user.marginRatio)}`}>{user.marginRatio.toLocaleString('fa-IR')}٪</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">نسبت جدید</span>
              <span className={` font-bold text-lg ${getRatioColor(newRatio)}`}>{newRatio.toLocaleString('fa-IR')}٪</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => { setDone(false); setAmount(''); onClose(); }} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 transition-colors">
            انصراف
          </button>
          <button
            disabled={!num}
            onClick={() => { setDone(true); setAmount(''); }}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${num ? (mode === 'add' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white') : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'}`}
          >
            تأیید
          </button>
        </div>
      </div>
    </AccDrawer>
  );
}

export default function MarginTab() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const usersWithMargin = USERS.filter(u => u.blockedBalance > 0 || u.openObligation > 0);

  return (
    <>
      <div className="desktop-view table-container">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500 text-xs">
            <tr>
              <th className="px-4 py-3 text-right font-medium">کاربر</th>
              <th className="px-4 py-3 text-right font-medium">مارجین گذاشته‌شده</th>
              <th className="px-4 py-3 text-right font-medium">سود/زیان باز</th>
              <th className="px-4 py-3 text-right font-medium">ارزش خالص</th>
              <th className="px-4 py-3 text-right font-medium">نسبت مارجین</th>
              <th className="px-4 py-3 text-center font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {usersWithMargin.map(u => {
              const equity = u.balance + u.blockedBalance;
              const pnl = (u.marginRatio - 100) * u.blockedBalance / 100;
              return (
                <tr key={u.id} className={`transition-colors ${
                  u.marginRatio < 120 ? 'bg-rose-50/40 dark:bg-rose-950/10' :
                  u.marginRatio < 150 ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''
                }`}>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{u.name}</div>
                    <div className="text-xs text-slate-400">{u.type === 'trade' ? 'صنف' : 'عادی'}</div>
                  </td>
                  <td className="px-4 py-3.5  font-bold text-amber-600 dark:text-amber-400">{fmt(u.blockedBalance)}</td>
                  <td className={`px-4 py-3.5  font-bold ${pnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {pnl >= 0 ? '+' : ''}{fmt(pnl)}
                  </td>
                  <td className="px-4 py-3.5  text-slate-700 dark:text-slate-300">{fmt(equity)}</td>
                  <td className="px-4 py-3.5">{getRatioBadge(u.marginRatio)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setSelectedUser(u)} title="افزایش/کاهش مارجین" className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                        <span className="material-symbols-outlined text-sm">add_circle</span>
                      </button>
                      <button onClick={() => setSelectedUser(u)} title="کاهش مارجین" className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors">
                        <span className="material-symbols-outlined text-sm">remove_circle</span>
                      </button>
                      <button title="مشاهده موقعیت‌ها" className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                        <span className="material-symbols-outlined text-sm">trending_up</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mobile-view p-4 space-y-3">
        {usersWithMargin.map(u => {
          const pnl = (u.marginRatio - 100) * u.blockedBalance / 100;
          return (
            <div key={u.id} className={`rounded-2xl border p-4 space-y-3 ${
              u.marginRatio < 120 ? 'border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/10' :
              u.marginRatio < 150 ? 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/10' :
              'border-border-light dark:border-border-dark bg-white dark:bg-surface-dark'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{u.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{u.type === 'trade' ? 'صنف' : 'عادی'}</p>
                </div>
                {getRatioBadge(u.marginRatio)}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-slate-400">مارجین</p>
                  <p className=" font-bold text-amber-600 dark:text-amber-400">{fmt(u.blockedBalance)}</p>
                </div>
                <div>
                  <p className="text-slate-400">P&L</p>
                  <p className={` font-bold ${pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{pnl >= 0 ? '+' : ''}{fmt(pnl)}</p>
                </div>
                <div>
                  <p className="text-slate-400">نسبت</p>
                  <p className={` font-bold ${getRatioColor(u.marginRatio)}`}>{u.marginRatio.toLocaleString('fa-IR')}٪</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(u)} className="w-full py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
                مدیریت مارجین
              </button>
            </div>
          );
        })}
      </div>

      <MarginActionDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  );
}
