import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '../api';
import RambaLogo from '../components/RambaLogo';
import { Eye, EyeOff, Check, X, ShieldCheck } from 'lucide-react';

const passwordRules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$...)', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const isStrong = passwordRules.every(r => r.test(password));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStrong) return setError('Password does not meet the requirements.');
    if (password !== confirm) return setError('Passwords do not match.');
    if (!token) return setError('Invalid reset link.');
    setLoading(true);
    setError('');
    try {
      await api.resetPassword({ token, password });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors w-full pr-11";

  if (!token) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-500 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-2xl text-center">
        <p className="text-red-500 font-medium">Invalid or missing reset link.</p>
        <Link to="/forgot-password" className="text-emerald-700 text-sm font-medium no-underline mt-4 block">Request a new one</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-500 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-2xl">
        <div className="text-center mb-7">
          <div className="flex justify-center mb-2"><RambaLogo size={52} leafColor="#047857" crossColor="#ffffff" /></div>
          <h1 className="text-2xl font-bold text-emerald-800 mb-1">RambaMedTech</h1>
        </div>

        {!done ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 text-center mb-2">
              <ShieldCheck size={32} className="text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-800 m-0">Set new password</h2>
              <p className="text-sm text-gray-400 m-0">Choose a strong password for your account.</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg text-sm">{error}</div>}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">New Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="New password" required className={inputCls} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-0">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && (
                <div className="flex flex-col gap-1 mt-1">
                  {passwordRules.map(rule => (
                    <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.test(password) ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {rule.test(password) ? <Check size={12} /> : <X size={12} />}
                      {rule.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Confirm Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={confirm}
                  onChange={e => setConfirm(e.target.value)} placeholder="Confirm password" required className={inputCls} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-0">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirm && password !== confirm && (
                <p className="text-xs text-red-500 mt-0.5">Passwords do not match</p>
              )}
            </div>

            <button type="submit" disabled={loading || !isStrong || password !== confirm}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer transition-colors">
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
              <ShieldCheck size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 m-0">Password reset!</h2>
            <p className="text-sm text-gray-500">Your password has been updated. Redirecting you to login...</p>
          </div>
        )}
      </div>
    </div>
  );
}
