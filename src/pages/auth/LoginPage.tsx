import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiEye, FiEyeOff, FiAlertCircle, FiLock, FiPhone } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const validate = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};
    
    if (!username.trim()) {
      newErrors.username = 'شماره موبایل الزامی است';
    }
    
    if (!password) {
      newErrors.password = 'رمز عبور الزامی است';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await login(username, password);
    } catch (error: any) {
      setServerError(error?.message || 'خطا در ورود به سیستم');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-background-dark">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-border-light dark:border-border-dark">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
              <FiLogIn className="text-primary" size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">ورود</h2>
            <p className="text-xs text-slate-400 mt-0.5">به پنل مدیریت</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Server Error */}
            {serverError && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-lg p-2.5 text-rose-600 text-sm flex items-center gap-2">
                <FiAlertCircle size={16} />
                <span>{serverError}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">شماره موبایل</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FiPhone className="text-slate-400" size={16} />
                </div>
                <input
                  type="tel"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pr-10 pl-3 py-2.5 rounded-lg bg-slate-50 dark:bg-background-dark border text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    errors.username ? 'border-rose-500' : 'border-border-light dark:border-border-dark'
                  }`}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {errors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">رمز عبور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FiLock className="text-slate-400" size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pr-10 pl-10 py-2.5 rounded-lg bg-slate-50 dark:bg-background-dark border text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    errors.password ? 'border-rose-500' : 'border-border-light dark:border-border-dark'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>در حال ورود...</span>
                </>
              ) : (
                <>
                  <FiLogIn size={16} />
                  <span>ورود</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}