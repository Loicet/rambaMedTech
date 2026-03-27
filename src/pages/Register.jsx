import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { conditions } from '../data/mockData';
import LangToggle from '../components/LangToggle';
import RambaLogo from '../components/RambaLogo';
import { ShieldCheck } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', condition: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [devOtp, setDevOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const inputRefs = useRef([]);
  const { register, verifyOtp, resendOtp } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await register(form.name, form.email, form.password, form.role, form.condition || null);
    setLoading(false);
    if (result.success) {
      if (result.otp) setDevOtp(result.otp);
      setOtpStep(true);
    } else {
      setError(result.error);
    }
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOtpError('');
    const result = await verifyOtp(otp.join(''));
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setOtpError(result.error);
  };

  const handleResend = async () => {
    const newOtp = await resendOtp();
    if (newOtp) { setDevOtp(newOtp); setOtp(['', '', '', '', '', '']); setOtpError(''); inputRefs.current[0]?.focus(); }
  };

  const inputCls = "px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors bg-white";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-500 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-2xl">
        <div className="flex justify-end mb-2">
          <LangToggle />
        </div>
        <div className="text-center mb-7">
          <div className="flex justify-center mb-2"><RambaLogo size={52} leafColor="#047857" crossColor="#ffffff" /></div>
          <h1 className="text-2xl font-bold text-emerald-800 mb-1">{t('appName')}</h1>
          <p className="text-gray-400 text-sm">{t('tagline')}</p>
        </div>

        {!otpStep ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800 m-0">{t('createAccount')}</h2>

            {error && <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg text-sm">{error}</div>}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">{t('fullNameLabel')}</label>
              <input value={form.name} onChange={set('name')} placeholder={t('fullNamePlaceholder')} required className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">{t('emailLabel')}</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder={t('emailPlaceholder')} required className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">{t('passwordLabel')}</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder={t('passwordMinLabel')} minLength={8} required className={inputCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">{t('iAmA')}</label>
              <select value={form.role} onChange={set('role')} className={inputCls}>
                <option value="patient">{t('rolePatient')}</option>
                <option value="caregiver">{t('roleCaregiver')}</option>
              </select>
            </div>

            {form.role === 'patient' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-600">{t('primaryCondition')}</label>
                <select value={form.condition} onChange={set('condition')} className={inputCls}>
                  <option value="">{t('selectCondition')}</option>
                  {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            <button type="submit"
              disabled={loading}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer transition-colors mt-1">
              {loading ? 'Please wait...' : t('createAccountBtn')}
            </button>

            <p className="text-center text-sm text-gray-500 mt-1">
              {t('alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-emerald-700 font-medium no-underline">{t('signInLink')}</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-2 text-center">
              <ShieldCheck size={36} className="text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-800 m-0">Verify your email</h2>
              <p className="text-sm text-gray-400 m-0">
                We sent a 6-digit code to <strong className="text-gray-600">{form.email}</strong>
              </p>
              {/* Dev helper — remove in production */}
              <p className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg">
                Demo code: <strong>{devOtp}</strong>
              </p>
            </div>

            {otpError && <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg text-sm text-center">{otpError}</div>}

            <div className="flex justify-center gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text" inputMode="numeric" maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className="w-11 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-lg outline-none focus:border-emerald-600 transition-colors bg-white"
                />
              ))}
            </div>

            <button type="submit" disabled={otp.join('').length < 6}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm cursor-pointer transition-colors">
              Verify & Continue
            </button>

            <p className="text-center text-sm text-gray-400">
              Didn't receive it?{' '}
              <button type="button" onClick={handleResend}
                className="text-emerald-700 font-medium bg-transparent border-0 cursor-pointer p-0">
                Resend code
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
