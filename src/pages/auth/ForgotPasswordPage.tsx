import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/common/Button';

type ForgotPasswordStep = 'phone' | 'reset';

export function ForgotPasswordPage() {
  const { locale } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<ForgotPasswordStep>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [captcha, setCaptcha] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const validatePassword = (pwd: string) => {
    const hasMinLength = pwd.length >= 8;
    const hasLetterAndNumber = /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd);
    return { hasMinLength, hasLetterAndNumber };
  };

  const passwordValidation = validatePassword(newPassword);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep('reset');
      setResendTimer(120);
    } catch (err) {
      setError(locale === 'fa' ? 'خطا در ارسال کد تایید' : 'Error sending verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/login');
    } catch (err) {
      setError(locale === 'fa' ? 'کد تایید نادرست است' : 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setResendTimer(120);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 shadow-lg border border-border-light dark:border-border-dark">
          <div className="text-center mb-8">
            <div className="inline-flex size-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <span className="material-symbols-outlined text-[40px] text-primary">
                lock_reset
              </span>
            </div>
            <h1 className="text-2xl font-bold text-content-primary dark:text-white mb-2">
              {locale === 'fa' ? 'بازیابی رمز عبور' : 'Reset Password'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {step === 'phone' && (locale === 'fa' ? 'شماره موبایل خود را وارد کنید' : 'Enter your phone number')}
              {step === 'reset' && (locale === 'fa' ? 'رمز عبور جدید خود را وارد کنید' : 'Enter your new password')}
            </p>
          </div>

          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              {error && (
                <div className="bg-accent-rose/10 border border-accent-rose/20 rounded-lg p-3 text-accent-rose text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {locale === 'fa' ? 'شماره موبایل' : 'Phone Number'}
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-white/10 text-content-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder={locale === 'fa' ? '09123456789' : '09123456789'}
                  required
                  dir="ltr"
                />
              </div>

              <div>
                <label htmlFor="captcha" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {locale === 'fa' ? 'کد امنیتی' : 'Captcha'}
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 h-12 bg-slate-100 dark:bg-background-dark rounded-lg flex items-center justify-center text-content-secondary dark:text-content-secondary  text-lg tracking-widest border border-slate-200 dark:border-white/10">
                    ABCD123
                  </div>
                  <button
                    type="button"
                    className="size-12 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-surface-lighter border border-slate-200 dark:border-white/10 text-content-secondary dark:text-content-secondary hover:bg-slate-200 dark:hover:bg-surface-lighter/80 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                  </button>
                </div>
                <input
                  id="captcha"
                  type="text"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-white/10 text-content-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 mt-2"
                  placeholder={locale === 'fa' ? 'کد امنیتی را وارد کنید' : 'Enter captcha'}
                  required
                />
              </div>

              <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                {locale === 'fa' ? 'ارسال کد تایید' : 'Send Verification Code'}
              </Button>

              <div className="text-center">
                <Link to="/login" className="text-sm text-content-secondary dark:text-content-secondary hover:text-slate-900 dark:hover:text-white transition-colors">
                  {locale === 'fa' ? 'بازگشت به صفحه ورود' : 'Back to Sign In'}
                </Link>
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-6">
              {error && (
                <div className="bg-accent-rose/10 border border-accent-rose/20 rounded-lg p-3 text-accent-rose text-sm text-center">
                  {error}
                </div>
              )}

              <div className="text-center text-sm text-content-secondary dark:text-content-secondary mb-4">
                {locale === 'fa' ? `کد تایید به شماره ${phoneNumber} ارسال شد` : `Verification code sent to ${phoneNumber}`}
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span className="text-accent-rose">*</span> {locale === 'fa' ? 'رمز عبور جدید' : 'New Password'}
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-white/10 text-content-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder={locale === 'fa' ? 'رمز عبور جدید خود را وارد کنید.' : 'Enter your new password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-3 space-y-2 text-xs">
                    <div className={`flex items-center gap-2 ${passwordValidation.hasMinLength ? 'text-accent-green' : 'text-slate-500'}`}>
                      <span className="material-symbols-outlined text-[16px]">
                        {passwordValidation.hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>{locale === 'fa' ? 'رمز عبور باید حداقل ۸ کاراکتر باشد.' : 'Password must be at least 8 characters'}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.hasLetterAndNumber ? 'text-accent-green' : 'text-slate-500'}`}>
                      <span className="material-symbols-outlined text-[16px]">
                        {passwordValidation.hasLetterAndNumber ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>{locale === 'fa' ? 'رمز عبور باید شامل حروف و عدد باشد.' : 'Password must contain letters and numbers'}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  <span className="text-accent-rose">*</span> {locale === 'fa' ? 'کد تایید ارسال شده به شماره' : 'Verification code sent to'} {phoneNumber}
                </label>
                <div className="flex gap-2 justify-center" dir="ltr">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-lg font-bold rounded-lg bg-background-light dark:bg-background-dark border border-slate-200 dark:border-white/10 text-content-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-primary">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                    <span>{formatTime(resendTimer)}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                    <span>{locale === 'fa' ? 'ارسال مجدد' : 'Resend Code'}</span>
                  </button>
                )}
              </div>

              <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                {locale === 'fa' ? 'ثبت و ادامه' : 'Save and Continue'}
              </Button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-content-secondary dark:text-content-secondary hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {locale === 'fa' ? 'بازگشت' : 'Go Back'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
