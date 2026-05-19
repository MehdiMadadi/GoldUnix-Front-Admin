import { useState } from 'react';
import { FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import Badge from '../../UI/Badge';
import ProgressBar from '../../UI/ProgressBar';
import { Api, UserAccountDto } from '../../../lib/client';

interface InfoTabProps {
  user: UserAccountDto;
  onUserUpdate?: (updatedUser: UserAccountDto) => void;
}

function marginColor(ratio: number) {
  if (ratio < 30) return 'rose';
  if (ratio < 60) return 'amber';
  return 'emerald';
}

function marginLabel(ratio: number) {
  if (ratio < 30) return 'بحرانی';
  if (ratio < 60) return 'هشدار';
  return 'ایمن';
}

export default function InfoTab({ user, onUserUpdate }: InfoTabProps) {
  const [status, setStatus] = useState(user.status);
  const [statusPending, setStatusPending] = useState<UserAccountDto['status'] | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = new Api();

  const applyStatus = async () => {
    if (!statusPending) return;
    
    setIsUpdating(true);
    setError(null);
    
    try {
      await client.api.changeUserStatus(user.id!, { status: statusPending });
      setStatus(statusPending);
      setStatusPending(null);
      if (onUserUpdate) {
        onUserUpdate({ ...user, status: statusPending });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('خطا در بروزرسانی وضعیت');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fa-IR');
  };

  return (
    <div className="space-y-5 p-5">
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-xl p-3 text-rose-600 text-sm flex items-center gap-2">
          <FiAlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-slate-50 dark:bg-background-dark rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">نام و نام خانوادگی</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {user.firstName} {user.lastName}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">کد ملی</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 ">
            {user.nationalId || '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">موبایل</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 " dir="ltr">
            {user.phoneNumber || '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">ایمیل</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200" dir="ltr">
            {user.email || '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">تاریخ عضویت</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {formatDate(user.joinDate)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">سطح کاربری</span>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {user.userLevel === 'VIP' ? 'ویژه' : user.userLevel === 'COLLEAGUE' ? 'همکار' : 'عادی'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">احراز هویت</span>
          <Badge variant={user.isKycVerified ? 'success' : 'warning'} small>
            {user.isKycVerified ? 'تایید شده' : 'در انتظار'}
          </Badge>
        </div>
      </div>

      <div className="border border-border-light dark:border-border-dark rounded-2xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 dark:bg-background-dark border-b border-border-light dark:border-border-dark">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">عملیات سریع</h4>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1.5 block">وضعیت حساب</label>
            <div className="flex items-center gap-2">
              <select
                value={statusPending ?? status}
                onChange={e => setStatusPending(e.target.value as UserAccountDto['status'])}
                disabled={isUpdating}
                className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100 disabled:opacity-50"
              >
                <option value="ACTIVE">فعال</option>
                <option value="BLOCKED">مسدود</option>
                <option value="SUSPENDED">تعلیق</option>
              </select>
              {statusPending && statusPending !== status && (
                <div className="flex gap-1">
                  <button
                    onClick={applyStatus}
                    disabled={isUpdating}
                    className="px-3 py-2 bg-emerald-500 text-white text-xs rounded-lg hover:bg-emerald-600 transition-colors font-semibold disabled:opacity-50 flex items-center gap-1"
                  >
                    <FiCheck size={14} />
                    تایید
                  </button>
                  <button
                    onClick={() => setStatusPending(null)}
                    disabled={isUpdating}
                    className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-1"
                  >
                    <FiX size={14} />
                    لغو
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}