import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useConsent } from '../context/ConsentContext';
import { useInvite } from '../context/InviteContext';
import { AlertCircle, Activity, EyeOff, ShieldCheck, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

function Restricted({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
      <EyeOff size={22} className="text-gray-300" />
      <p className="text-sm text-gray-400 m-0">Patient has restricted access to <strong>{label}</strong>.</p>
      <p className="text-xs text-gray-300 m-0">They can update this in their Privacy settings.</p>
    </div>
  );
}

const vitalColor = { normal: 'text-green-600', high: 'text-red-500', low: 'text-orange-500' };

function getVitalStatus(metric, value) {
  const v = parseFloat(value);
  if (metric === 'Blood Sugar') return v < 70 ? 'low' : v <= 140 ? 'normal' : 'high';
  if (metric === 'Blood Pressure') { const sys = parseFloat(value); return sys >= 140 ? 'high' : 'normal'; }
  return 'normal';
}

export default function CaregiverDashboard() {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const { getConsentSync, getConsent } = useConsent();
  const { patients: linkedPatients, loading: inviteLoading } = useInvite();

  const [selected, setSelected] = useState(null);
  const [patientData, setPatientData] = useState({}); // { [patientId]: { logs, emotions } }

  // Set first patient as selected when list loads
  useEffect(() => {
    if (linkedPatients.length > 0 && !selected) {
      setSelected(linkedPatients[0]);
    }
  }, [linkedPatients]);

  // Load consent + health data when selected patient changes
  useEffect(() => {
    if (!selected) return;
    getConsent(selected.id);
    if (patientData[selected.id]) return;
    fetch(`${import.meta.env.VITE_API_URL}/community/caregiver/patient/${selected.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('ramba_token')}` }
    })
      .then(r => r.ok ? r.json() : {})
      .then(summary => setPatientData(prev => ({ ...prev, [selected.id]: summary })))
      .catch(() => setPatientData(prev => ({ ...prev, [selected.id]: {} })));
  }, [selected]);

  const consent = selected ? getConsentSync(selected.id) : {};
  const summary = selected ? (patientData[selected.id] || {}) : {};
  const recentLogs = summary.recentLogs || [];
  const recentEmotions = summary.recentEmotions || [];

  if (inviteLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // DEBUG — remove after fix
  console.log('linkedPatients:', linkedPatients, 'inviteLoading:', inviteLoading);

  if (linkedPatients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <UserPlus size={40} className="text-emerald-300" />
        <h2 className="text-lg font-bold text-gray-700 m-0">No patients linked yet</h2>
        <p className="text-sm text-gray-400 m-0 max-w-xs leading-relaxed">
          Ask your patient to send you an invite code from their Care Team page, then enter it here.
        </p>
        <Link to="/redeem-invite"
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl no-underline transition-colors">
          Enter Invite Code
        </Link>
      </div>
    );
  }

  if (!selected) return null;

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">
            {t('welcomeCaregiver')}, {user.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-500 m-0">
            {t('caregiverSubtitle')} · {linkedPatients.length} {t('patientsUnderCare')}
          </p>
        </div>
        <span className="text-xs text-gray-400 pt-1">
          {new Date().toLocaleDateString(lang === 'rw' ? 'fr-RW' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* Patient list sidebar */}
        <div className="w-full lg:w-56 shrink-0">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('yourPatients')}</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {linkedPatients.map(p => (
              <button key={p.id} onClick={() => setSelected(p)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 cursor-pointer transition-all shrink-0 bg-white
                  ${selected?.id === p.id ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}`}>
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">{p.name[0]}</div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-gray-900 whitespace-nowrap">{p.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-gray-400">{p.condition || '—'}</div>
                </div>
                <Activity size={14} className="text-emerald-500" />
              </button>
            ))}
          </div>
          <div className="hidden lg:flex flex-col gap-2">
            {linkedPatients.map(p => (
              <div key={p.id} onClick={() => setSelected(p)}
                className={`flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer border-2 transition-all shadow-sm
                  ${selected?.id === p.id ? 'border-emerald-600 bg-emerald-50' : 'border-transparent hover:border-emerald-200'}`}>
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">{p.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.condition || '—'}</div>
                </div>
                <Activity size={16} className="text-emerald-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Patient detail panel */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Patient header */}
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shrink-0">{selected.name[0]}</div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 m-0 mb-0.5">{selected.name}</h2>
              <p className="text-xs text-gray-400 m-0">{selected.condition || '—'}</p>
            </div>
          </div>

          {/* Consent notice */}
          {Object.keys(consent).length > 0 && !Object.values(consent).every(Boolean) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-xs text-amber-700">
              <ShieldCheck size={15} className="text-amber-500 shrink-0" />
              This patient has restricted some data categories.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Latest vitals */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">{t('latestVitals')}</h3>
              {consent.vitals === false ? <Restricted label="vitals" /> : (
                recentLogs.length === 0
                  ? <p className="text-sm text-gray-400">No health logs yet.</p>
                  : <div className="flex flex-col gap-2">
                      {recentLogs.map(v => {
                        const status = getVitalStatus(v.metric, v.value);
                        return (
                          <div key={v.id} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between gap-2">
                            <div>
                              <div className="text-[10px] text-gray-400 uppercase tracking-wide">{v.metric}</div>
                              <div className={`text-base font-bold mt-0.5 ${vitalColor[status]}`}>
                                {v.value} <span className="text-xs font-normal text-gray-400">{v.unit}</span>
                              </div>
                            </div>
                            <div className="text-[10px] text-gray-300 text-right">
                              {new Date(v.loggedAt).toLocaleDateString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
              )}
            </div>

            {/* Emotional wellbeing */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">{t('emotionalWellbeing')}</h3>
              {consent.mood === false ? <Restricted label="emotional well-being" /> : (
                recentEmotions.length === 0
                  ? <p className="text-sm text-gray-400">No check-ins yet.</p>
                  : <div className="flex flex-col gap-2">
                      {recentEmotions.map(e => (
                        <div key={e.id} className="bg-emerald-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                            ${e.emotion === 'GREAT' ? 'bg-emerald-100 text-emerald-700'
                            : e.emotion === 'GOOD' ? 'bg-green-100 text-green-700'
                            : e.emotion === 'OKAY' ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-600'}`}>
                            {e.emotion.toLowerCase()}
                          </span>
                          <span className="text-[10px] text-gray-300">{new Date(e.checkedAt).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
