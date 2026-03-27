import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInvite } from '../context/InviteContext';
import { UserPlus, Mail, Clock, CheckCircle, Trash2, Copy, ShieldCheck, Users } from 'lucide-react';

export default function CareTeam() {
  const { user } = useAuth();
  const { sendInvite, getPatientInvites, revokeInvite } = useInvite();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null); // { code, email }
  const [copied, setCopied] = useState('');

  const [loading, setLoading] = useState(false);
  const invites = getPatientInvites();
  const accepted = invites.filter(i => i.status === 'accepted');
  const pending  = invites.filter(i => i.status === 'pending');

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setLoading(true);
    const result = await sendInvite(email.trim().toLowerCase());
    setLoading(false);
    if (result.success) {
      setSuccess({ code: result.code, email: email.trim() });
      setEmail('');
    } else {
      setError(result.error);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="flex flex-col gap-5 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">My Care Team</h1>
        <p className="text-sm text-gray-500 m-0">Invite a caregiver to monitor your health. You stay in control of what they can see.</p>
      </div>

      {/* Trust note */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-sm text-emerald-800 m-0 leading-relaxed">
          Your caregiver will only see data you allow in your <strong>Privacy settings</strong>. You can revoke access at any time.
        </p>
      </div>

      {/* Invite form */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800 m-0 flex items-center gap-2">
            <UserPlus size={16} className="text-emerald-600" /> Invite a Caregiver
          </h2>
          <p className="text-xs text-gray-400 m-0 mt-0.5">Enter their email — they'll receive an invite code to link their account to yours.</p>
        </div>
        <form onSubmit={handleInvite} className="px-5 py-4 flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 border-2 border-gray-200 rounded-lg px-3 focus-within:border-emerald-600 transition-colors bg-white">
              <Mail size={15} className="text-gray-400 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); setSuccess(null); }}
                placeholder="caregiver@email.com"
                required
                className="flex-1 py-2.5 text-sm outline-none bg-transparent"
              />
            </div>
            <button type="submit"
              disabled={loading}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer transition-colors border-0 whitespace-nowrap">
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-500 m-0">{error}</p>
          )}

          {/* Success — show the generated code */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col gap-2">
              <p className="text-sm text-emerald-800 font-semibold m-0">Invite created for {success.email}</p>
              <p className="text-xs text-emerald-700 m-0">Share this code with your caregiver — they'll enter it after signing up or logging in:</p>
              <div className="flex items-center gap-2 bg-white border border-emerald-200 rounded-lg px-3 py-2">
                <span className="flex-1 font-mono font-bold text-emerald-800 tracking-widest text-sm">{success.code}</span>
                <button type="button" onClick={() => handleCopy(success.code)}
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-800 bg-transparent border-0 cursor-pointer transition-colors">
                  <Copy size={13} /> {copied === success.code ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-gray-400 m-0">In production, this code would be sent automatically to their email.</p>
            </div>
          )}
        </form>
      </div>

      {/* Active caregivers */}
      {accepted.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800 m-0 flex items-center gap-2">
              <Users size={16} className="text-emerald-600" /> Active Caregivers
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {accepted.map(inv => (
              <div key={inv.code} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {inv.caregiverEmail[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 m-0 truncate">{inv.caregiverEmail}</p>
                  <p className="text-xs text-gray-400 m-0 flex items-center gap-1 mt-0.5">
                    <CheckCircle size={10} className="text-emerald-500" /> Access granted
                  </p>
                </div>
                <button onClick={() => revokeInvite(inv.code)}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 bg-transparent border-0 cursor-pointer transition-colors">
                  <Trash2 size={13} /> Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending invites */}
      {pending.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800 m-0 flex items-center gap-2">
              <Clock size={16} className="text-amber-500" /> Pending Invites
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {pending.map(inv => (
              <div key={inv.code} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-sm shrink-0">
                  {inv.caregiverEmail[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 m-0 truncate">{inv.caregiverEmail}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs text-gray-400 tracking-wider">{inv.code}</span>
                    <button onClick={() => handleCopy(inv.code)}
                      className="flex items-center gap-0.5 text-[10px] text-emerald-600 hover:text-emerald-800 bg-transparent border-0 cursor-pointer">
                      <Copy size={10} /> {copied === inv.code ? 'Copied!' : 'Copy code'}
                    </button>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Pending</span>
                <button onClick={() => revokeInvite(inv.code)}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 bg-transparent border-0 cursor-pointer transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {accepted.length === 0 && pending.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm">
          No caregivers linked yet. Send an invite above to get started.
        </div>
      )}
    </div>
  );
}
