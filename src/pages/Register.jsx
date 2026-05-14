import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { api } from '../api';
import LangToggle from '../components/LangToggle';
import RambaLogo from '../components/RambaLogo';
import { ShieldCheck, Eye, EyeOff, Check, X, ChevronRight, ChevronLeft, Heart, Activity, User, Scale, Leaf, Stethoscope, Shield, Users } from 'lucide-react';

const INTENTS = [
  { id: 'habits',     label: 'I want to build healthier habits',    icon: Leaf },
  { id: 'condition',  label: "I'm managing a health condition",      icon: Stethoscope },
  { id: 'preventive', label: 'I want preventive health support',     icon: Shield },
  { id: 'caregiver',  label: "I'm supporting someone I care about", icon: Users },
];

const CONDITIONS = [
  'Asthma', 'Diabetes', 'Hypertension', 'Cardiovascular Disease',
  'Kidney Disease', 'Sickle Cell Disease', 'Cancer', 'Epilepsy',
];

const GENDERS = ['Male', 'Female', 'Prefer not to say'];

const passwordRules = [
  { label: 'At least 8 characters',          test: (p) => p.length >= 8 },
  { label: 'One uppercase letter',            test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter',            test: (p) => /[a-z]/.test(p) },
  { label: 'One number',                      test: (p) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$...)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const isStrongPassword = (p) => passwordRules.every(r => r.test(p));

// Left panel illustration
function LeftPanel({ step }) {
  const messages = [
    { title: 'Your health journey starts here', sub: 'Track, learn, and thrive with RambaMedTech.' },
    { title: 'Verify your identity', sub: 'We sent a code to your email to keep your account secure.' },
    { title: 'Welcome to RambaMedTech', sub: 'Your personalized companion for healthier living.' },
    { title: 'How can Ramba support you?', sub: "Everyone's journey is different — tell us a little about yours." },
    { title: 'Tell us about yourself', sub: 'Help us personalize your experience.' },
    { title: 'Your conditions', sub: 'Select all that apply so we can tailor your care.' },
  ];
  const msg = messages[Math.min(step - 1, messages.length - 1)];
  return (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-emerald-800 to-emerald-600 text-white p-10 rounded-l-2xl">
      <div className="flex items-center gap-2">
        <RambaLogo size={36} leafColor="#ffffff" crossColor="#047857" />
        <span className="font-bold text-xl">RambaMedTech</span>
      </div>
      <div className="flex flex-col gap-6">
        <div className="w-48 h-48 mx-auto">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.1)" />
            <circle cx="100" cy="100" r="55" fill="rgba(255,255,255,0.15)" />
            <path d="M100 60 C80 60 65 75 65 95 C65 120 100 140 100 140 C100 140 135 120 135 95 C135 75 120 60 100 60Z" fill="rgba(255,255,255,0.9)" />
            <path d="M85 95 L95 105 L115 85" stroke="#065f46" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">{msg.title}</h2>
          <p className="text-emerald-100 text-sm leading-relaxed">{msg.sub}</p>
        </div>
        <div className="flex gap-2">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'bg-white w-6' : 'bg-white/30 w-3'}`} />
          ))}
        </div>
      </div>
      <p className="text-emerald-200 text-xs">© 2025 RambaMedTech · Built for African communities</p>
    </div>
  );
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    birthYear: '', gender: '', height: '', weight: '',
    conditions: [],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const inputRefs = useRef([]);
  const { register, verifyOtp, resendOtp, updateUser } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const inputCls = 'px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors bg-white w-full';

  const toggleCondition = (c) => {
    setForm(prev => ({
      ...prev,
      conditions: prev.conditions.includes(c)
        ? prev.conditions.filter(x => x !== c)
        : [...prev.conditions, c],
    }));
  };

  // Step 1 — basic info
  const handleStep1 = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(form.password)) {
      setError('Password does not meet the requirements below.');
      return;
    }
    setError('');
    await handleRegister(); // call directly — no useEffect needed
  };

  // Step 2 — OTP verify (after register API call)
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

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    const result = await register(form.name, form.email, form.password, null);
    setLoading(false);
    if (result.success) setStep(2);
    else setError(result.error);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOtpError('');
    const result = await verifyOtp(otp.join(''));
    setLoading(false);
    if (result.success) setStep(3); // go to welcome
    else setOtpError(result.error);
  };

  const handleResend = async () => {
    await resendOtp();
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl grid lg:grid-cols-2 overflow-hidden">

        <LeftPanel step={step} />

        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <div className="flex items-center gap-2">
              <RambaLogo size={28} leafColor="#047857" crossColor="#ffffff" />
              <span className="font-bold text-emerald-800">RambaMedTech</span>
            </div>
            <LangToggle />
          </div>
          <div className="hidden lg:flex justify-end mb-4"><LangToggle /></div>

          {/* ── Step 1: Basic info ── */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 m-0 mb-1">Create your account</h2>
                <p className="text-sm text-gray-400 m-0">Join thousands managing their health with RambaMedTech</p>
              </div>

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
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password} onChange={set('password')}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="Min. 8 characters" required className={inputCls + ' pr-11'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-0">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {(passwordFocused || form.password) && (
                  <div className="flex flex-col gap-1 mt-1">
                    {passwordRules.map(rule => (
                      <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.test(form.password) ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {rule.test(form.password) ? <Check size={12} /> : <X size={12} />}
                        {rule.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer transition-colors flex items-center justify-center gap-2">
                Continue <ChevronRight size={16} />
              </button>
              <p className="text-center text-sm text-gray-500">
                {t('alreadyHaveAccount')}{' '}
                <Link to="/login" className="text-emerald-700 font-medium no-underline">{t('signInLink')}</Link>
              </p>
            </form>
          )}

          {/* ── Step 2: OTP ── */}
          {step === 2 && (
            <form onSubmit={handleVerify} className="flex flex-col gap-5">
              <div className="flex flex-col items-center gap-2 text-center">
                <ShieldCheck size={40} className="text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-800 m-0">Verify your email</h2>
                <p className="text-sm text-gray-400 m-0">
                  We sent a 6-digit code to <strong className="text-gray-600">{form.email}</strong>
                </p>
              </div>

              {otpError && <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg text-sm text-center">{otpError}</div>}

              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input key={i} ref={el => inputRefs.current[i] = el}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-lg outline-none focus:border-emerald-600 transition-colors bg-white" />
                ))}
              </div>

              <button type="submit" disabled={otp.join('').length < 6 || loading}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm cursor-pointer transition-colors">
                {loading ? 'Verifying...' : 'Verify & Continue'}
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

          {/* ── Step 3: Welcome ── */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                <Heart size={40} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-emerald-800 m-0 mb-3">Welcome to RambaMedTech!</h2>
                <p className="text-gray-500 text-sm leading-relaxed m-0">
                  Your personalized companion for healthier living, wellness tracking, and chronic care support.
                </p>
              </div>
              <button onClick={() => setStep(4)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-8 rounded-lg text-sm cursor-pointer transition-colors flex items-center gap-2">
                Get Started <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ── Step 4: Intent ── */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800 m-0 mb-1">How can Ramba support you?</h2>
                <p className="text-sm text-gray-400 m-0">Everyone's journey is different — tell us a little about yours.</p>
              </div>
              <div className="flex flex-col gap-3">
                {INTENTS.map(({ id, label, icon: Icon }) => (
                  <button key={id} type="button" onClick={() => setIntent(id)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all text-left
                      ${intent === id ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 bg-white hover:border-emerald-300'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all
                      ${intent === id ? 'bg-emerald-600' : 'bg-gray-100'}`}>
                      <Icon size={18} className={intent === id ? 'text-white' : 'text-gray-500'} />
                    </div>
                    <span className={`text-sm font-medium ${intent === id ? 'text-emerald-800' : 'text-gray-700'}`}>{label}</span>
                    {intent === id && <Check size={16} className="text-emerald-600 ml-auto" />}
                  </button>
                ))}
              </div>
              <button
                disabled={!intent}
                onClick={async () => {
                  const result = await api.updateProfile({ intent }).catch(() => null);
                  if (result?.user) updateUser(result.user);
                  if (intent === 'caregiver') navigate('/dashboard');
                  else setStep(5);
                }}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg text-sm cursor-pointer transition-colors flex items-center justify-center gap-2 border-0">
                Continue <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* ── Step 5: Health onboarding ── */}
          {step === 5 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800 m-0 mb-1">Tell us about yourself</h2>
                <p className="text-sm text-gray-400 m-0">This helps us calculate your BMI and personalize recommendations.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                    <User size={14} className="text-emerald-600" /> Birth Year
                  </label>
                  <input type="number" value={form.birthYear} onChange={set('birthYear')}
                    placeholder="e.g. 1990" min="1920" max={new Date().getFullYear()}
                    className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                    <User size={14} className="text-emerald-600" /> Gender (Optional)
                  </label>
                  <select value={form.gender} onChange={set('gender')} className={inputCls}>
                    <option value="">Select</option>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                    <Activity size={14} className="text-emerald-600" /> Height (cm)
                  </label>
                  <input type="number" value={form.height} onChange={set('height')}
                    placeholder="e.g. 170" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                    <Scale size={14} className="text-emerald-600" /> Weight (kg)
                  </label>
                  <input type="number" value={form.weight} onChange={set('weight')}
                    placeholder="e.g. 70" className={inputCls} />
                </div>
              </div>

              {/* BMI preview */}
              {form.height && form.weight && (() => {
                const bmi = (form.weight / ((form.height / 100) ** 2)).toFixed(1);
                const status = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
                const color = bmi < 18.5 ? 'text-blue-600' : bmi < 25 ? 'text-emerald-600' : bmi < 30 ? 'text-yellow-600' : 'text-red-600';
                return (
                  <div className="bg-emerald-50 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Your BMI</span>
                    <span className={`text-lg font-bold ${color}`}>{bmi} <span className="text-xs font-normal">({status})</span></span>
                  </div>
                );
              })()}

              <div className="flex gap-3">
                <button onClick={() => setStep(4)}
                  className="px-4 py-2.5 border-2 border-gray-200 text-gray-600 text-sm font-medium rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-white flex items-center gap-1">
                  <ChevronLeft size={16} /> Back
                </button>
                <button onClick={async () => {
                  if (form.birthYear || form.gender || form.height || form.weight) {
                    await api.updateProfile({
                      birthYear: form.birthYear || undefined,
                      gender: form.gender || undefined,
                      height: form.height || undefined,
                      weight: form.weight || undefined,
                    }).catch(() => {});
                  }
                  if (intent === 'habits' || intent === 'preventive') navigate('/dashboard');
                  else setStep(6);
                }}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer transition-colors border-0 flex items-center justify-center gap-2">
                  Continue <ChevronRight size={16} />
                </button>
              </div>
              <button onClick={() => navigate('/dashboard')}
                className="text-sm text-gray-400 bg-transparent border-0 cursor-pointer text-center hover:text-gray-600">
                Skip for now
              </button>
            </div>
          )}

          {/* ── Step 6: Condition selection ── */}
          {step === 6 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800 m-0 mb-1">
                  {intent === 'condition' ? 'Which condition are you managing?' : 'Would you like to monitor any health conditions?'}
                </h2>
                <p className="text-sm text-gray-400 m-0">
                  {intent === 'condition' ? 'Select all that apply. You can update this later.' : 'This is completely optional — you can always add this later.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {CONDITIONS.map(c => {
                  const selected = form.conditions.includes(c);
                  return (
                    <button key={c} type="button" onClick={() => toggleCondition(c)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 cursor-pointer transition-all text-left text-sm font-medium
                        ${selected ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                        ${selected ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300'}`}>
                        {selected && <Check size={11} className="text-white" />}
                      </div>
                      {c}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(5)}
                  className="px-4 py-2.5 border-2 border-gray-200 text-gray-600 text-sm font-medium rounded-lg cursor-pointer hover:border-gray-300 transition-colors bg-white flex items-center gap-1">
                  <ChevronLeft size={16} /> Back
                </button>
                <button onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer transition-colors border-0">
                  {form.conditions.length > 0 ? `Continue with ${form.conditions.length} condition${form.conditions.length > 1 ? 's' : ''}` : 'Skip & Go to Dashboard'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
