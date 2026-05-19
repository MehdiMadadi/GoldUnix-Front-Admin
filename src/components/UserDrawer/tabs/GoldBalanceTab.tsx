import { FiCalendar, FiInfo, FiDollarSign, FiClock, FiPhoneIncoming } from 'react-icons/fi';
import { UserWalletDto } from '../../../lib/client';

interface GoldBalanceTabProps {
  userInfo: UserWalletDto;
}

const GOLD_PRICE_PER_GRAM = 32_500_000;

interface GoldCardProps {
  title: string;
  subtitle: string;
  grams: number;
  icon: typeof FiDollarSign;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  note?: string;
  settlement?: string;
  coveragePercent?: number;
}

function GoldCard({ title, subtitle, grams, icon: Icon, colorClass, bgClass, borderClass, note, settlement, coveragePercent }: GoldCardProps) {
  const rialValue = grams * GOLD_PRICE_PER_GRAM;

  return (
    <div className={`${bgClass} ${borderClass} border rounded-2xl p-4`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className={`text-xs font-semibold ${colorClass}`}>{title}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgClass}`}>
          <Icon size={22} className={colorClass} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className={`text-2xl font-extrabold ${colorClass} `}>
            {grams.toLocaleString('fa-IR')}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">گرم</p>
        </div>
        {grams > 0 && (
          <div className="text-left">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 ">
              {rialValue.toLocaleString('fa-IR')}
            </p>
            <p className="text-[10px] text-slate-400">معادل ریالی</p>
          </div>
        )}
      </div>

      {settlement && (
        <div className="mt-3 pt-3 border-t border-current/10 flex items-center gap-1">
          <FiCalendar size={14} className="text-slate-400" />
          <span className="text-[11px] text-slate-500">تسویه: {settlement}</span>
        </div>
      )}

      {coveragePercent !== undefined && grams > 0 && (
        <div className="mt-3 pt-3 border-t border-current/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-slate-500">پوشش مارجین</span>
            <span className={`text-[11px] font-bold ${colorClass}`}>{coveragePercent}٪</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-border-dark rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                coveragePercent > 70 ? 'bg-emerald-500' : coveragePercent > 40 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(coveragePercent, 100)}%` }}
            />
          </div>
        </div>
      )}

      {note && (
        <div className="mt-3 pt-3 border-t border-current/10 flex items-start gap-1.5">
          <FiInfo size={14} className="text-slate-400 flex-shrink-0" />
          <p className="text-[10px] text-slate-400 leading-relaxed">{note}</p>
        </div>
      )}
    </div>
  );
}

export default function GoldBalanceTab({ userInfo }: GoldBalanceTabProps) {
  const goldCash = parseFloat(userInfo.goldCash || '0');
  const goldTomorrowDayAfter = parseFloat(userInfo.goldTomorrowDayAfter || '0');
  const goldCommitment = parseFloat(userInfo.goldCommitment || '0');
  const totalGold = goldCash + goldTomorrowDayAfter + goldCommitment;
  const marginRatio = parseFloat(userInfo.marginRatio || '0');

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between bg-slate-50 dark:bg-background-dark rounded-2xl px-4 py-3">
        <span className="text-sm text-slate-600 dark:text-slate-400">جمع کل موجودی طلا</span>
        <div className="text-left">
          <span className="text-lg font-extrabold text-slate-900 dark:text-white ">
            {totalGold.toLocaleString('fa-IR')}
          </span>
          <span className="text-xs text-slate-500 mr-1">گرم</span>
        </div>
      </div>

      <GoldCard
        title="موجودی نقدی"
        subtitle="بازار نقد — تسویه همان روز"
        grams={goldCash}
        icon={FiDollarSign}
        colorClass="text-blue-600 dark:text-blue-400"
        bgClass="bg-blue-50 dark:bg-blue-950/20"
        borderClass="border-blue-200 dark:border-blue-800/30"
      />

      <GoldCard
        title="موجودی فردایی / پسفردایی"
        subtitle="موجودی مشترک دو بازار"
        grams={goldTomorrowDayAfter}
        icon={FiClock}
        colorClass="text-amber-600 dark:text-amber-400"
        bgClass="bg-amber-50 dark:bg-amber-950/20"
        borderClass="border-amber-200 dark:border-amber-800/30"
        settlement="۱۴۰۳/۱۱/۲۹ (فردایی) / ۱۴۰۳/۱۱/۳۰ (پسفردایی)"
        note="موجودی فردایی و پسفردایی از یک مخزن مشترک تأمین می‌شوند. انجام معامله در هر یک از این دو بازار، موجودی دیگری را کاهش می‌دهد."
      />

      <GoldCard
        title="موجودی تعهدی ایزوله"
        subtitle="بازار تعهدی — تسویه آتی"
        grams={goldCommitment}
        icon={FiPhoneIncoming}
        colorClass="text-emerald-600 dark:text-emerald-400"
        bgClass="bg-emerald-50 dark:bg-emerald-950/20"
        borderClass="border-emerald-200 dark:border-emerald-800/30"
        coveragePercent={marginRatio}
        note="موجودی تعهدی کاملاً ایزوله است و با سایر بازارها تداخل ندارد."
      />
    </div>
  );
}