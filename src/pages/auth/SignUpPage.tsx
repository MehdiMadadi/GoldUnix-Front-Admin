import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getAuthenticatedApi } from '@/lib/axiosInterceptor';
import { Button } from '@/components/common/Button';
import { BottomModal } from '@/components/common/BottomModal';
import type { RegisterUserRequestDto } from '@/lib/client';

type SignUpStep = 'credentials' | 'otp' | 'personal-info';
type UserType = 'normal' | 'colleague';

export function SignUpPage() {
  const { locale } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<SignUpStep>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  // مرحله ۱: اعتبارسنجی
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>('normal');
  const [hasReferralCode, setHasReferralCode] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaKey, setCaptchaKey] = useState('');

  // مرحله ۲: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [referenceCode, setReferenceCode] = useState(''); // ذخیره referenceCode دریافتی

  // مرحله ۳: اطلاعات شخصی
  const [nationalId, setNationalId] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // تایمر ارسال مجدد
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // دریافت کپچا در شروع
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const api = getAuthenticatedApi();
      // const response = await api.api.getCaptcha();
      // setCaptchaImage(response.data.image);
      // setCaptchaKey(response.data.key);
      
      // موقت
      setCaptchaImage('ABCD123');
    } catch (error) {
      console.error('Failed to fetch captcha:', error);
    }
  };

  const validatePassword = (pwd: string) => {
    const hasMinLength = pwd.length >= 8;
    const hasLetterAndNumber = /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd);
    return { hasMinLength, hasLetterAndNumber };
  };

  const passwordValidation = validatePassword(password);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const api = getAuthenticatedApi();
      
      // ارسال OTP به شماره موبایل
      const response = await api.api.sendOtpByPhoneNumber(phoneNumber);
      
      // ذخیره referenceCode دریافتی
      setReferenceCode(response.data?.referenceCode || '');
      
      setStep('otp');
      setResendTimer(120); // تایمر 2 دقیقه
      
    } catch (err: any) {
      setError(err.response?.data?.message || (locale === 'fa' ? 'خطا در ارسال کد تایید' : 'Error sending verification code'));
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

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const api = getAuthenticatedApi();
      const otpCode = otp.join('');
      
      // تایید کد با referenceCode دریافتی
      // اینجا باید متد verify رو فراخوانی کنی
      // await api.api.verifyOtp({
      //   referenceCode: referenceCode,
      //   code: otpCode
      // });
      
      // موقت
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setStep('personal-info');
    } catch (err: any) {
      setError(err.response?.data?.message || (locale === 'fa' ? 'کد تایید نادرست است' : 'Invalid verification code'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const api = getAuthenticatedApi();
      
      // ثبت‌نام نهایی با referenceCode و کد تایید
      const request: RegisterUserRequestDto = {
        mobileNumber: phoneNumber,
        password: password,
        nationalCode: nationalId,
        birthDate: birthDate,
        referralCode: hasReferralCode ? referralCode : undefined,
        isColleague: userType === 'colleague',
        // ارسال referenceCode و کد تایید به register
        referenceCode: referenceCode,
        code: otp.join(''),
      };

      await api.api.register(request);
      
      // ثبت‌نام موفق - هدایت به صفحه ورود
      navigate('/login', { 
        state: { 
          message: locale === 'fa' ? 'ثبت‌نام با موفقیت انجام شد. لطفاً وارد شوید.' : 'Registration successful. Please login.' 
        }
      });
      
    } catch (err: any) {
      setError(err.response?.data?.message || (locale === 'fa' ? 'اطلاعات وارد شده صحیح نیست' : 'Invalid information'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    try {
      const api = getAuthenticatedApi();
      const response = await api.api.sendOtpByPhoneNumber(phoneNumber);
      setReferenceCode(response.data?.referenceCode || '');
      setResendTimer(120);
    } catch (error) {
      console.error('Failed to resend code:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="text-center mb-8">
              <div className="inline-flex size-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
                <span className="material-symbols-outlined text-[40px] text-amber-600 dark:text-amber-400">
                  person_add
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {locale === 'fa' ? 'ثبت نام' : 'Sign Up'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {step === 'credentials' && (locale === 'fa' ? 'اطلاعات ورود خود را وارد کنید' : 'Enter your credentials')}
                {step === 'otp' && (locale === 'fa' ? 'کد تایید را وارد کنید' : 'Enter verification code')}
                {step === 'personal-info' && (locale === 'fa' ? 'اطلاعات شخصی خود را وارد کنید' : 'Enter your personal information')}
              </p>
            </div>

            {step === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 text-red-600 dark:text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* نوع کاربر */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
                    {locale === 'fa' ? 'نوع کاربر' : 'User Type'}
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setUserType('normal')}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                        userType === 'normal'
                          ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {locale === 'fa' ? 'کاربر عادی' : 'Normal User'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserType('colleague')}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                        userType === 'colleague'
                          ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {locale === 'fa' ? 'همکار' : 'Colleague'}
                    </button>
                  </div>
                  {userType === 'colleague' && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      {locale === 'fa' 
                        ? 'همکاران گرامی، پس از ثبت‌نام مدارک همکاری برای شما ارسال خواهد شد'
                        : 'Dear colleagues, collaboration documents will be sent after registration'}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {locale === 'fa' ? 'شماره موبایل' : 'Phone Number'}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    placeholder="09123456789"
                    required
                    dir="ltr"
                    maxLength={11}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {locale === 'fa' ? 'رمز عبور' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      placeholder="••••••••"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 -translate-y-1/2 ltr:right-3 rtl:left-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2 space-y-1 text-xs">
                      <div className={`flex items-center gap-1 ${passwordValidation.hasMinLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {passwordValidation.hasMinLength ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <span>{locale === 'fa' ? 'حداقل ۸ کاراکتر' : 'At least 8 characters'}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidation.hasLetterAndNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                        <span className="material-symbols-outlined text-[16px]">
                          {passwordValidation.hasLetterAndNumber ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <span>{locale === 'fa' ? 'شامل حروف و اعداد' : 'Contains letters and numbers'}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="has-referral"
                    checked={hasReferralCode}
                    onChange={(e) => setHasReferralCode(e.target.checked)}
                    className="size-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500/20"
                  />
                  <label htmlFor="has-referral" className="text-sm text-gray-700 dark:text-gray-300">
                    {locale === 'fa' ? 'دارای کد دعوت هستم' : 'I have a referral code'}
                  </label>
                </div>

                {hasReferralCode && (
                  <div>
                    <label htmlFor="referral" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {locale === 'fa' ? 'کد دعوت' : 'Referral Code'}
                    </label>
                    <input
                      id="referral"
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      placeholder={locale === 'fa' ? 'کد دعوت را وارد کنید' : 'Enter referral code'}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="captcha" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {locale === 'fa' ? 'کد امنیتی' : 'Captcha'}
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300  text-lg tracking-widest border border-gray-200 dark:border-gray-700">
                      {captchaImage}
                    </div>
                    <button
                      type="button"
                      onClick={fetchCaptcha}
                      className="size-12 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">refresh</span>
                    </button>
                  </div>
                  <input
                    id="captcha"
                    type="text"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 mt-2"
                    placeholder={locale === 'fa' ? 'کد امنیتی را وارد کنید' : 'Enter captcha'}
                    required
                  />
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {locale === 'fa' ? 'با ورود/ثبت نام، شما با' : 'By signing up, you agree to our'}{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-amber-600 dark:text-amber-400 font-medium hover:underline"
                  >
                    {locale === 'fa' ? 'قوانین و مقررات' : 'Terms and Conditions'}
                  </button>{' '}
                  {locale === 'fa' ? 'موافقت نموده‌اید' : ''}
                </div>

                <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                  {locale === 'fa' ? 'ارسال کد تایید' : 'Send Verification Code'}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {locale === 'fa' ? 'حساب کاربری دارید؟' : 'Already have an account?'}{' '}
                    <Link to="/login" className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
                      {locale === 'fa' ? 'ورود' : 'Sign In'}
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 text-red-600 dark:text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {locale === 'fa' ? `کد تایید به شماره ${phoneNumber} ارسال شد` : `Verification code sent to ${phoneNumber}`}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 text-center">
                    {locale === 'fa' ? 'کد تایید' : 'Verification Code'}
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
                        className="w-12 h-14 text-center text-lg font-bold rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-[20px] text-amber-600">schedule</span>
                      <span>{formatTime(resendTimer)}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-sm text-amber-600 dark:text-amber-400 font-medium hover:underline inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[20px]">refresh</span>
                      <span>{locale === 'fa' ? 'ارسال مجدد کد' : 'Resend Code'}</span>
                    </button>
                  )}
                </div>

                <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                  {locale === 'fa' ? 'تایید و ادامه' : 'Verify and Continue'}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {locale === 'fa' ? 'بازگشت' : 'Go Back'}
                </button>
              </form>
            )}

            {step === 'personal-info' && (
              <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 text-red-600 dark:text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {locale === 'fa' ? 'نام' : 'First Name'}
                    </label>
                    <input
                      id="first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      placeholder={locale === 'fa' ? 'علی' : 'Ali'}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {locale === 'fa' ? 'نام خانوادگی' : 'Last Name'}
                    </label>
                    <input
                      id="last-name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      placeholder={locale === 'fa' ? 'محمدی' : 'Mohammadi'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="national-id" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {locale === 'fa' ? 'کد ملی' : 'National ID'}
                  </label>
                  <input
                    id="national-id"
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    placeholder={locale === 'fa' ? '۱۲۳۴۵۶۷۸۹۰' : '1234567890'}
                    required
                    dir="ltr"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label htmlFor="birth-date" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {locale === 'fa' ? 'تاریخ تولد' : 'Birth Date'}
                  </label>
                  <input
                    id="birth-date"
                    type="text"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    placeholder={locale === 'fa' ? '۱۳۷۰/۰۱/۰۱' : '1991/03/21'}
                    required
                    dir="ltr"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-3 text-xs text-blue-800 dark:text-blue-300">
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-[18px] flex-shrink-0">info</span>
                    <span>
                      {locale === 'fa'
                        ? 'مالکیت شماره موبایل باید با کد ملی وارد شده مطابقت داشته باشد'
                        : 'Phone number ownership must match the provided National ID'}
                    </span>
                  </div>
                </div>

                <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                  {locale === 'fa' ? 'تکمیل ثبت نام' : 'Complete Sign Up'}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {locale === 'fa' ? 'بازگشت' : 'Go Back'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <BottomModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title={locale === 'fa' ? 'قوانین و مقررات' : 'Terms and Conditions'}
      >
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 max-h-[60vh] overflow-y-auto">
          <p>
            {locale === 'fa'
              ? 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.'
              : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
          </p>
          <p>
            {locale === 'fa'
              ? 'چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است.'
              : 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
          </p>
          <p>
            {locale === 'fa'
              ? 'و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.'
              : 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'}
          </p>
        </div>
      </BottomModal>
    </>
  );
}