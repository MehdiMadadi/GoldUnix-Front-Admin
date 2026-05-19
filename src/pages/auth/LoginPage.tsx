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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-background-dark dark:to-surface-dark">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-xl border border-border-light dark:border-border-dark">
          <div className="text-center mb-6">
            <div className="inline-flex size-14 items-center justify-center rounded-full bg-primary/10 mb-4">
              <FiLogIn className="text-primary" size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">ورود به حساب کاربری</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {serverError && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-xl p-3 text-rose-600 text-sm flex items-center gap-2">
                <FiAlertCircle size={18} />
                <span>{serverError}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">شماره موبایل</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FiPhone className="text-slate-400" size={18} />
                </div>
                <input
                  type="tel"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pr-10 pl-4 py-3 rounded-xl bg-slate-50 dark:bg-background-dark border text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.username ? 'border-rose-500' : 'border-border-light dark:border-border-dark'
                  }`}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {errors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">رمز عبور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FiLock className="text-slate-400" size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pr-10 pl-12 py-3 rounded-xl bg-slate-50 dark:bg-background-dark border text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.password ? 'border-rose-500' : 'border-border-light dark:border-border-dark'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>در حال ورود...</span>
                </>
              ) : (
                <>
                  <FiLogIn size={18} />
                  <span>ورود به حساب</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}