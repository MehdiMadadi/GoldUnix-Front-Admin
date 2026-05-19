import { USER_STATS } from '../../data/users';
import { RISK_DISTRIBUTION } from '../../data/risk';
import ProgressBar from '../UI/ProgressBar';
import { 
  FiBarChart2, 
  FiUsers, 
  FiCheckCircle, 
  FiBriefcase, 
  FiAlertTriangle, 
  FiX 
} from 'react-icons/fi';

interface UserStatsPanelProps {
  onClose: () => void;
  variant: 'desktop' | 'mobile';
}

export default function UserStatsPanel({ onClose, variant }: UserStatsPanelProps) {
  const content = (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <FiBarChart2 className="text-primary" size={20} />
          آمار کاربران
        </h3>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
        >
          <FiX size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiUsers className="text-primary" size={20} />
              <p className="text-xs text-slate-500">کل کاربران</p>
            </div>
            <p className="text-2xl font-bold">{USER_STATS.total.toLocaleString('fa-IR')}</p>
            <p className="text-xs text-emerald-500 mt-1">+۱۲٪</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiCheckCircle className="text-emerald-500" size={20} />
              <p className="text-xs text-slate-500">فعال امروز</p>
            </div>
            <p className="text-2xl font-bold text-emerald-500">{USER_STATS.activeToday.toLocaleString('fa-IR')}</p>
            <p className="text-xs text-slate-500 mt-1">۱۰٪ از کل</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiBriefcase className="text-blue-500" size={20} />
              <p className="text-xs text-slate-500">کاربران صنف</p>
            </div>
            <p className="text-2xl font-bold text-blue-500">{USER_STATS.tradeType.toLocaleString('fa-IR')}</p>
            <p className="text-xs text-slate-500">۲.۶٪</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiAlertTriangle className="text-amber-500" size={20} />
              <p className="text-xs text-slate-500">هشدار مارجین</p>
            </div>
            <p className="text-2xl font-bold text-rose-500">{USER_STATS.marginAlert}</p>
            <p className="text-xs text-rose-500">فوری</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
          <p className="font-bold text-slate-900 dark:text-white mb-4">توزیع سطح ریسک</p>
          <ProgressBar label="پایین" value={`${RISK_DISTRIBUTION.low}٪`} percent={RISK_DISTRIBUTION.low} color="emerald" />
          <ProgressBar label="متوسط" value={`${RISK_DISTRIBUTION.medium}٪`} percent={RISK_DISTRIBUTION.medium} color="amber" />
          <ProgressBar label="بالا" value={`${RISK_DISTRIBUTION.high}٪`} percent={RISK_DISTRIBUTION.high} color="rose" />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
          <p className="font-bold text-slate-900 dark:text-white mb-3">تعهدات باز</p>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-amber-500">{USER_STATS.openObligation}</p>
              <p className="text-xs text-slate-500 mt-1">دارای تعهد</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-rose-500">{USER_STATS.marginAlert}</p>
              <p className="text-xs text-slate-500 mt-1">هشدار فوری</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (variant === 'desktop') {
    return <div className="modal-desktop open">{content}</div>;
  }

  return <div className="modal-mobile open">{content}</div>;
}