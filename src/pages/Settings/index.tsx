import { useState, useEffect } from 'react';
import { 
  FiSettings, 
  FiShield, 
  FiBell, 
  FiLock, 
  FiInfo, 
  FiCheck,
  FiUser
} from 'react-icons/fi';
import Header from '../../components/Layout/Header';
import { ROLES, type Role } from '../../data/auth';
import { useAuth } from '../../contexts/AuthContext';
import { Api, UserAccountDto } from '../../lib/client';

const ROLE_KEYS = Object.keys(ROLES) as Role[];

const SECTION_ICONS = {
  general: FiSettings,
  roles: FiShield,
  notifications: FiBell,
  security: FiLock,
};

export default function SettingsPage() {
  const { user, switchRole } = useAuth();
  const [activeSection, setActiveSection] = useState('general');
  const [userInfo, setUserInfo] = useState<UserAccountDto | null>(null);
  const [loading, setLoading] = useState(false);

  const sections = [
    { id: 'general', label: 'عمومی', icon: 'general' },
    { id: 'roles', label: 'نقش‌ها و دسترسی', icon: 'roles' },
    { id: 'notifications', label: 'اعلان‌ها', icon: 'notifications' },
    { id: 'security', label: 'امنیت', icon: 'security' },
  ];

  const client = new Api();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      
      const response = await client.api.getMe();
      setUserInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneralSettings = async () => {
    try {
      // Implement save logic here
      console.log('Saving general settings...');
      // You can use client.api.updateProfile() here
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <>
      <Header title="تنظیمات" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <div className="lg:col-span-3">
              <nav className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl overflow-hidden">
                {sections.map(s => {
                  const IconComponent = SECTION_ICONS[s.icon as keyof typeof SECTION_ICONS];
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSection(s.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors border-b border-border-light dark:border-border-dark last:border-0 ${
                        activeSection === s.id
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-background-dark/40'
                      }`}
                    >
                      <IconComponent size={20} />
                      {s.label}
                    </button>
                  );
                })}
              </nav>

              {/* User Info Card */}
              {userInfo && (
                <div className="mt-4 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white">
                      <FiUser size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {userInfo.firstName} {userInfo.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{userInfo.email || userInfo.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">سطح کاربری:</span>
                      <span className="font-semibold text-primary">{userInfo.userLevel || 'NORMAL'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-slate-500">وضعیت:</span>
                      <span className={`font-semibold ${userInfo.status === 'ACTIVE' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {userInfo.status === 'ACTIVE' ? 'فعال' : 'غیرفعال'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-9">
              {activeSection === 'general' && (
                <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-6 space-y-6">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <FiSettings size={20} className="text-primary" />
                    تنظیمات عمومی
                  </h3>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-slate-500 mb-1 block">نام</label>
                          <input
                            type="text"
                            defaultValue={userInfo?.firstName || ''}
                            placeholder="نام"
                            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-500 mb-1 block">نام خانوادگی</label>
                          <input
                            type="text"
                            defaultValue={userInfo?.lastName || ''}
                            placeholder="نام خانوادگی"
                            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-500 mb-1 block">شماره موبایل</label>
                          <input
                            type="text"
                            defaultValue={userInfo?.phoneNumber || ''}
                            placeholder="شماره موبایل"
                            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-500 mb-1 block">ایمیل</label>
                          <input
                            type="email"
                            defaultValue={userInfo?.email || ''}
                            placeholder="ایمیل"
                            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-500 mb-1 block">کد ملی</label>
                          <input
                            type="text"
                            defaultValue={userInfo?.nationalId || ''}
                            placeholder="کد ملی"
                            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-500 mb-1 block">تاریخ تولد</label>
                          <input
                            type="text"
                            defaultValue={userInfo?.birthDate ? new Date(userInfo.birthDate).toLocaleDateString('fa-IR') : ''}
                            placeholder="تاریخ تولد"
                            className="w-full rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-slate-100"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button 
                          onClick={handleSaveGeneralSettings}
                          className="bg-primary text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-primary-600 transition-colors"
                        >
                          ذخیره تغییرات
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeSection === 'roles' && (
                <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <FiShield size={20} className="text-primary" />
                      نقش‌ها و دسترسی‌ها
                    </h3>
                    <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-3 py-2">
                      <span className="text-xs text-primary font-semibold">نقش فعلی شما:</span>
                      <span className="text-xs font-bold text-primary">
                        {userInfo?.userLevel ? ROLES[userInfo.userLevel.toLowerCase() as Role]?.label || userInfo.userLevel : ROLES[user.role].label}
                      </span>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center gap-2">
                    <FiInfo size={18} className="text-amber-500" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">برای آزمایش داشبورد با نقش‌های مختلف، یک نقش انتخاب کنید.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ROLE_KEYS.map(role => (
                      <div
                        key={role}
                        className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                          user.role === role
                            ? 'border-primary bg-primary/5'
                            : 'border-border-light dark:border-border-dark hover:border-primary/50'
                        }`}
                        onClick={() => switchRole(role)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-bold text-slate-900 dark:text-white">{ROLES[role].label}</p>
                          {user.role === role && (
                            <span className="size-5 rounded-full bg-primary flex items-center justify-center">
                              <FiCheck size={12} className="text-white" />
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {ROLES[role].permissions.map(p => (
                            <span key={p} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md text-[0.65rem]">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-6 space-y-4">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <FiBell size={20} className="text-primary" />
                    تنظیمات اعلان‌ها
                  </h3>
                  {[
                    { label: 'هشدار مارجین بحرانی', desc: 'اعلان فوری برای حساب‌های در معرض خطر', enabled: true },
                    { label: 'معاملات جدید', desc: 'اطلاع از ثبت معاملات جدید', enabled: false },
                    { label: 'تسویه معاملات', desc: 'اطلاع از تسویه معاملات تعهدی', enabled: true },
                    { label: 'وضعیت خزانه', desc: 'هشدار رسیدن به حد آستانه خزانه', enabled: true },
                    { label: 'گزارش روزانه', desc: 'ارسال خلاصه معاملات روزانه', enabled: false },
                  ].map(n => (
                    <div key={n.label} className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-xl">
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{n.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full transition-colors ${n.enabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}>
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${n.enabled ? 'translate-x-6' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === 'security' && (
                <div className="bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-3xl p-6 space-y-5">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <FiLock size={20} className="text-primary" />
                    تنظیمات امنیتی
                  </h3>
                  {[
                    { label: 'احراز هویت دو مرحله‌ای', desc: 'افزایش امنیت ورود با OTP', status: 'فعال', statusColor: 'text-emerald-500' },
                    { label: 'محدودیت IP', desc: 'دسترسی فقط از IPهای مجاز', status: 'غیرفعال', statusColor: 'text-slate-400' },
                    { label: 'ثبت لاگ فعالیت‌ها', desc: 'ذخیره تمام اقدامات کاربران', status: 'فعال', statusColor: 'text-emerald-500' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-xl">
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{s.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold ${s.statusColor}`}>{s.status}</span>
                        <button className="text-primary text-xs hover:underline">تغییر</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}