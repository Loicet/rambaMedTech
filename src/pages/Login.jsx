import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import LangToggle from '../components/LangToggle';
import RambaLogo from '../components/RambaLogo';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate(from, { replace: true });
    else setError(result.error);
  };

  const inputCls = "px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors w-full";

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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-800 m-0">{t('welcomeBack')}</h2>

          {error && <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg text-sm">{error}</div>}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">{t('emailLabel')}</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder={t('emailPlaceholder')} required className={inputCls} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">{t('passwordLabel')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder={t('passwordPlaceholder')} required
                className={inputCls + ' pr-11'} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-0">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end -mt-2">
            <Link to="/forgot-password" className="text-sm text-emerald-700 font-medium no-underline hover:underline">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer transition-colors mt-1">
            {loading ? 'Signing in...' : t('signInBtn')}
          </button>

          <p className="text-center text-sm text-gray-500 mt-1">
            {t('noAccount')}{' '}
            <Link to="/register" className="text-emerald-700 font-medium no-underline">{t('registerLink')}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
