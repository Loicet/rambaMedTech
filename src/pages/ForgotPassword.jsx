import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import RambaLogo from '../components/RambaLogo';
import { Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-500 flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-2xl">
        <div className="text-center mb-7">
          <div className="flex justify-center mb-2"><RambaLogo size={52} leafColor="#047857" crossColor="#ffffff" /></div>
          <h1 className="text-2xl font-bold text-emerald-800 mb-1">RambaMedTech</h1>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 text-center mb-2">
              <Mail size={32} className="text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-800 m-0">Forgot your password?</h2>
              <p className="text-sm text-gray-400 m-0">Enter your email and we'll send you a reset link.</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg text-sm">{error}</div>}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className="px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors" />
            </div>

            <button type="submit" disabled={loading}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer transition-colors">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="text-center text-sm text-gray-500">
              <Link to="/login" className="text-emerald-700 font-medium no-underline">← Back to Sign In</Link>
            </p>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
              <Mail size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 m-0">Check your inbox</h2>
            <p className="text-sm text-gray-500">
              If <strong>{email}</strong> is registered, you'll receive a password reset link shortly. Check your spam folder if you don't see it.
            </p>
            <Link to="/login" className="text-emerald-700 font-medium text-sm no-underline">← Back to Sign In</Link>
          </div>
        )}
      </div>
    </div>
  );
}
