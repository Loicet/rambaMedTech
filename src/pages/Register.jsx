import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { conditions } from '../data/mockData';
import LangToggle from '../components/LangToggle';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', condition: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = register(form.name, form.email, form.password, form.role, form.condition || null);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  const inputCls = "px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors bg-white";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-500 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-2xl">
        <div className="flex justify-end mb-2">
          <LangToggle />
        </div>
        <div className="text-center mb-7">
          <div className="text-5xl mb-2"></div>
          <h1 className="text-2xl font-bold text-emerald-800 mb-1">{t('appName')}</h1>
          <p className="text-gray-400 text-sm">{t('tagline')}</p>
        </div>

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
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer transition-colors mt-1">
            {t('createAccountBtn')}
          </button>

          <p className="text-center text-sm text-gray-500 mt-1">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-emerald-700 font-medium no-underline">{t('signInLink')}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
