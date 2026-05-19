import { useState } from 'react';
import Header from '../../components/Layout/Header';
import KpiCard from '../../components/UI/KpiCard';

interface SpreadRow {
  asset: string;
  basePrice: number;
  buySpread: number;
  sellSpread: number;
  buyPrice: number;
  sellPrice: number;
  lastUpdated: string;
}

const SPREAD_DATA: SpreadRow[] = [
  { asset: 'طلای ۱۸ عیار', basePrice: 32_500_000, buySpread: 0.5, sellSpread: 0.5, buyPrice: 32_662_500, sellPrice: 32_337_500, lastUpdated: '۱۴۰۳/۱۱/۲۸ - ۱۱:۳۰' },
  { asset: 'طلای ۲۴ عیار', basePrice: 38_500_000, buySpread: 0.5, sellSpread: 0.5, buyPrice: 38_692_500, sellPrice: 38_307_500, lastUpdated: '۱۴۰۳/۱۱/۲۸ - ۱۱:۳۰' },
  { asset: 'سکه تمام بهار', basePrice: 42_000_000, buySpread: 0.8, sellSpread: 0.8, buyPrice: 42_336_000, sellPrice: 41_664_000, lastUpdated: '۱۴۰۳/۱۱/۲۸ - ۱۱:۳۰' },
  { asset: 'نیم سکه', basePrice: 22_500_000, buySpread: 1.0, sellSpread: 1.0, buyPrice: 22_725_000, sellPrice: 22_275_000, lastUpdated: '۱۴۰۳/۱۱/۲۸ - ۱۱:۳۰' },
  { asset: 'ربع سکه', basePrice: 12_800_000, buySpread: 1.2, sellSpread: 1.2, buyPrice: 12_953_600, sellPrice: 12_646_400, lastUpdated: '۱۴۰۳/۱۱/۲۸ - ۱۱:۳۰' },
];

const SETTLEMENT_FEES = [
  { type: 'نقدی', fee: 0.5, minFee: 10_000 },
  { type: 'فردایی', fee: 0.6, minFee: 15_000 },
  { type: 'پسفردایی', fee: 0.7, minFee: 20_000 },
  { type: 'تعهدی', fee: 1.0, minFee: 50_000 },
];

function formatNumber(n: number) {
  return n;
}

export default function PricingPage() {
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <Header title="قیمت‌گذاری" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto space-y-6">

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
            <KpiCard label="قیمت پایه طلا" value="۳۲,۵۰۰,۰۰۰" unit="ریال/گرم" change="+۱.۲%" changePositive />
            <KpiCard label="اسپرد میانگین" value="۰.۷" unit="درصد" />
            <KpiCard label="آخرین بروزرسانی" value="۱۱:۳۰" unit="امروز" />
            <KpiCard label="کارمزد میانگین" value="۰.۷" unit="درصد" change="+۰.۱%" changePositive={false} />
          </section>

          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border-light dark:border-border-dark">
              <h3 className="font-bold text-lg">جدول اسپرد و قیمت‌گذاری</h3>
              <div className="flex items-center gap-2">
                {editMode ? (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl px-4 py-2 text-sm font-semibold"
                    >
                      انصراف
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="bg-primary text-white rounded-xl px-4 py-2 text-sm font-semibold"
                    >
                      ذخیره
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="icon-btn bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                )}
              </div>
            </div>

            <div className="desktop-view">
              <div className="table-container">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark text-slate-500">
                    <tr>
                      <th className="px-5 py-3 text-right font-medium">دارایی</th>
                      <th className="px-5 py-3 text-right font-medium">قیمت پایه (ریال)</th>
                      <th className="px-5 py-3 text-right font-medium">اسپرد خرید ٪</th>
                      <th className="px-5 py-3 text-right font-medium">اسپرد فروش ٪</th>
                      <th className="px-5 py-3 text-right font-medium">قیمت خرید</th>
                      <th className="px-5 py-3 text-right font-medium">قیمت فروش</th>
                      <th className="px-5 py-3 text-right font-medium">آخرین بروزرسانی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light dark:divide-border-dark">
                    {SPREAD_DATA.map(row => (
                      <tr key={row.asset} className="hover:bg-slate-50 dark:hover:bg-background-dark/40 transition-colors">
                        <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{row.asset}</td>
                        <td className="px-5 py-4  text-slate-700 dark:text-slate-300">{formatNumber(row.basePrice)}</td>
                        <td className="px-5 py-4">
                          {editMode ? (
                            <input
                              type="number"
                              defaultValue={row.buySpread}
                              className="w-16 border border-border-light dark:border-border-dark rounded-lg px-2 py-1 text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{row.buySpread}٪</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {editMode ? (
                            <input
                              type="number"
                              defaultValue={row.sellSpread}
                              className="w-16 border border-border-light dark:border-border-dark rounded-lg px-2 py-1 text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400 font-bold">{row.sellSpread}٪</span>
                          )}
                        </td>
                        <td className="px-5 py-4  font-bold text-emerald-600 dark:text-emerald-400">{formatNumber(row.buyPrice)}</td>
                        <td className="px-5 py-4  font-bold text-rose-600 dark:text-rose-400">{formatNumber(row.sellPrice)}</td>
                        <td className="px-5 py-4 text-xs text-slate-500">{row.lastUpdated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mobile-view p-4 space-y-4">
              {SPREAD_DATA.map(row => (
                <div key={row.asset} className="user-card">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-slate-900 dark:text-white">{row.asset}</h4>
                    <span className="text-xs text-slate-500">{row.lastUpdated}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">قیمت خرید</p>
                      <p className=" font-bold text-xs text-emerald-600 dark:text-emerald-400">{formatNumber(row.buyPrice)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">قیمت فروش</p>
                      <p className=" font-bold text-xs text-rose-600 dark:text-rose-400">{formatNumber(row.sellPrice)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">اسپرد خرید</p>
                      <p className="font-bold text-emerald-600">{row.buySpread}٪</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">اسپرد فروش</p>
                      <p className="font-bold text-rose-600">{row.sellSpread}٪</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-border-light dark:border-border-dark">
              <h3 className="font-bold text-lg">کارمزد انواع معاملات</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
              {SETTLEMENT_FEES.map(f => (
                <div key={f.type} className="bg-slate-50 dark:bg-background-dark rounded-2xl p-4 border border-border-light dark:border-border-dark">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-lg">percent</span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">معامله {f.type}</p>
                  </div>
                  <p className="text-3xl font-extrabold text-primary mb-1">{f.fee}٪</p>
                  <p className="text-xs text-slate-500">حداقل کارمزد: {formatNumber(f.minFee)} ریال</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
