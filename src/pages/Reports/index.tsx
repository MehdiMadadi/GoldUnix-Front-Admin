import { useState } from 'react';
import Header from '../../components/Layout/Header';
import Badge from '../../components/UI/Badge';
import KpiCard from '../../components/UI/KpiCard';

const REPORT_TYPES = [
  { id: 'trades', title: 'گزارش معاملات', icon: 'sync_alt', desc: 'خلاصه معاملات نقدی، فردایی، پسفردایی و تعهدی' },
  { id: 'users', title: 'گزارش کاربران', icon: 'group', desc: 'وضعیت کاربران، تعهدات و ریسک' },
  { id: 'treasury', title: 'گزارش خزانه', icon: 'account_balance', desc: 'موجودی، واریز و برداشت خزانه' },
  { id: 'deposits', title: 'گزارش سپرده‌ها', icon: 'payments', desc: 'اجاره طلا و قراردادهای رشد ثروت' },
  { id: 'risk', title: 'گزارش ریسک', icon: 'security', desc: 'هشدارهای مارجین و پوشش تعهدات' },
  { id: 'accounting', title: 'گزارش مالی', icon: 'calculate', desc: 'کارمزدها، سود اسپرد و تسویه‌ها' },
];

const RECENT_REPORTS = [
  { id: 'r1', title: 'گزارش هفتگی معاملات', type: 'معاملات', generatedAt: '۱۴۰۳/۱۱/۲۵', status: 'ready', size: '۲.۴ مگابایت' },
  { id: 'r2', title: 'گزارش ماهانه ریسک', type: 'ریسک', generatedAt: '۱۴۰۳/۱۱/۰۱', status: 'ready', size: '۱.۱ مگابایت' },
  { id: 'r3', title: 'گزارش سپرده‌های فعال', type: 'سپرده', generatedAt: '۱۴۰۳/۱۱/۲۸', status: 'generating', size: '—' },
  { id: 'r4', title: 'گزارش مالی سه‌ماهه', type: 'مالی', generatedAt: '۱۴۰۳/۱۰/۰۱', status: 'ready', size: '۵.۸ مگابایت' },
];

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  return (
    <>
      <Header title="گزارش‌ها" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            <KpiCard label="گزارش‌های امروز" value="۳" unit="مورد" />
            <KpiCard label="آماده دانلود" value="۱۲" unit="گزارش" />
            <KpiCard label="در حال تولید" value="۱" unit="گزارش" />
            <KpiCard label="کل گزارش‌ها" value="۱۴۸" unit="گزارش" />
          </section>

          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-5">
            <h3 className="font-bold text-lg mb-4">تولید گزارش جدید</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="text-sm text-slate-500 mb-1 block">از تاریخ</label>
                <input
                  type="text"
                  placeholder="۱۴۰۳/۱۱/۰۱"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 mb-1 block">تا تاریخ</label>
                <input
                  type="text"
                  placeholder="۱۴۰۳/۱۱/۲۸"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500 mb-1 block">فرمت خروجی</label>
                <select className="w-full rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100">
                  <option>Excel (.xlsx)</option>
                  <option>PDF</option>
                  <option>CSV</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {REPORT_TYPES.map(rt => (
                <button
                  key={rt.id}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-border-light dark:border-border-dark hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-primary group-hover:text-white text-xl">{rt.icon}</span>
                  </div>
                  <p className="text-xs font-semibold text-center text-slate-700 dark:text-slate-300">{rt.title}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-border-light dark:border-border-dark">
              <h3 className="font-bold text-lg">گزارش‌های اخیر</h3>
            </div>
            <div className="desktop-view">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500">
                  <tr>
                    <th className="px-5 py-3 text-right font-medium">عنوان گزارش</th>
                    <th className="px-5 py-3 text-right font-medium">دسته‌بندی</th>
                    <th className="px-5 py-3 text-right font-medium">تاریخ تولید</th>
                    <th className="px-5 py-3 text-right font-medium">حجم</th>
                    <th className="px-5 py-3 text-right font-medium">وضعیت</th>
                    <th className="px-5 py-3 text-right font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {RECENT_REPORTS.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{r.title}</td>
                      <td className="px-5 py-4"><Badge variant="neutral">{r.type}</Badge></td>
                      <td className="px-5 py-4 text-slate-500">{r.generatedAt}</td>
                      <td className="px-5 py-4 text-slate-500">{r.size}</td>
                      <td className="px-5 py-4">
                        {r.status === 'ready'
                          ? <Badge variant="success">آماده</Badge>
                          : <Badge variant="warning">در حال تولید</Badge>}
                      </td>
                      <td className="px-5 py-4">
                        {r.status === 'ready' && (
                          <button className="text-primary hover:underline text-xs font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">download</span>
                            دانلود
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mobile-view p-4 space-y-3">
              {RECENT_REPORTS.map(r => (
                <div key={r.id} className="user-card">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{r.title}</p>
                    {r.status === 'ready'
                      ? <Badge variant="success">آماده</Badge>
                      : <Badge variant="warning">در حال تولید</Badge>}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{r.generatedAt}</span>
                    <span>{r.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
