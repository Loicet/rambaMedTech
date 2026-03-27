import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInvite } from '../context/InviteContext';
import { ShieldCheck, KeyRound, CheckCircle, ArrowRight } from 'lucide-react';
import RambaLogo from '../components/RambaLogo';

export default function RedeemInvite() {
  const { user } = useAuth();
  const { redeemInvite, getCaregiverPatients } = useInvite();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [accepted, setAccepted] = useState(null);

  const linkedPatients = getCaregiverPatients();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await redeemInvite(code);
    if (result.success) setAccepted(result.invite);
    else setError(result.error);
  };

  if (accepted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 m-0">You're now linked!</h2>
          <p className="text-sm text-gray-500 m-0 leading-relaxed">
            You have been successfully connected to <strong className="text-gray-800">{accepted.patientName}</strong> as their caregiver.
            You can now monitor their health data from your dashboard.
          </p>
          <button onClick={() => navigate('/dashboard')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-xl text-sm cursor-pointer transition-colors border-0 flex items-center gap-2 mt-2">
            Go to Dashboard <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl flex flex-col gap-5">

        <div className="text-center">
          <div className="flex justify-center mb-3">
            <RambaLogo size={44} leafColor="#047857" crossColor="#ffffff" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 m-0 mb-1">Enter Your Invite Code</h1>
          <p className="text-sm text-gray-400 m-0 leading-relaxed">
            A patient has shared an invite code with you. Enter it below to link your account and start monitoring their health.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-700 m-0 leading-relaxed">
            The patient controls what data you can see. They can revoke your access at any time from their Privacy settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-600">Invite Code</label>
            <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg px-3 focus-within:border-emerald-600 transition-colors">
              <KeyRound size={15} className="text-gray-400 shrink-0" />
              <input
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
                placeholder="RAMBA-XXXXX"
                required
                className="flex-1 py-2.5 text-sm outline-none bg-transparent font-mono tracking-widest uppercase"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 m-0">{error}</p>}

          <button type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer transition-colors border-0">
            Link to Patient
          </button>
        </form>

        {/* Already linked patients */}
        {linkedPatients.length > 0 && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400 mb-2 font-medium">Already linked patients:</p>
            {linkedPatients.map(inv => (
              <div key={inv.code} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={13} className="text-emerald-500" />
                {inv.patientName}
              </div>
            ))}
          </div>
        )}

        <button onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer text-center transition-colors">
          Skip for now — go to dashboard
        </button>
      </div>
    </div>
  );
}
