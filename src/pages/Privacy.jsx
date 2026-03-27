import { useAuth } from '../context/AuthContext';
import { useConsent } from '../context/ConsentContext';
import { ShieldCheck, Activity, Heart, Thermometer, Lightbulb, Lock, Eye, EyeOff, Bell } from 'lucide-react';

const CONSENT_ITEMS = [
  {
    key: 'vitals',
    icon: Activity,
    title: 'Health Vitals',
    desc: 'Blood sugar, blood pressure, heart rate, weight and other logged measurements.',
  },
  {
    key: 'mood',
    icon: Heart,
    title: 'Emotional Well-being',
    desc: 'Your mood check-in history and emotional status trends.',
  },
  {
    key: 'symptoms',
    icon: Thermometer,
    title: 'Reported Symptoms',
    desc: 'Symptoms you report during well-being check-ins such as fatigue, headache, or dizziness.',
  },
  {
    key: 'insights',
    icon: Lightbulb,
    title: 'Health Insights',
    desc: 'AI-generated observations and suggested actions based on your health data.',
  },
  {
    key: 'reminders',
    icon: Bell,
    title: 'Caregiver Nudges',
    desc: 'Allow your caregiver to receive reminders prompting them to follow up on your medication and check-ins.',
  },
];

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer border-0 shrink-0
        ${enabled ? 'bg-emerald-600' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
        ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

export default function Privacy() {
  const { user } = useAuth();
  const { getConsentSync, updateConsent } = useConsent();
  const consent = getConsentSync(user.id);

  const allEnabled = Object.values(consent).every(Boolean);
  const allDisabled = Object.values(consent).every(v => !v);

  return (
    <div className="flex flex-col gap-5 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">Data Privacy</h1>
        <p className="text-sm text-gray-500 m-0">
          Control exactly what your care team can see. You can change these settings at any time.
        </p>
      </div>

      {/* Trust badge */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-start gap-3">
        <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-emerald-800 m-0 mb-0.5">Protected by RambaMedTech</p>
          <p className="text-xs text-emerald-700 m-0 leading-relaxed">
            Your health data is private by default. Caregivers can only access the categories you explicitly allow below. No data is ever shared with third parties.
          </p>
        </div>
      </div>

      {/* Caregiver access section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-800 m-0">Caregiver Access</h2>
            <p className="text-xs text-gray-400 m-0 mt-0.5">What your assigned caregiver can view on their dashboard</p>
          </div>
          <button
            onClick={() => CONSENT_ITEMS.forEach(item => updateConsent(item.key, allEnabled ? false : true))}
            className="text-xs text-emerald-700 font-medium bg-transparent border-0 cursor-pointer hover:underline"
          >
            {allEnabled ? 'Restrict all' : 'Allow all'}
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {CONSENT_ITEMS.map(({ key, icon: Icon, title, desc }) => {
            const enabled = consent[key];
            return (
              <div key={key} className="px-5 py-4 flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors
                  ${enabled ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                  <Icon size={17} className={enabled ? 'text-emerald-600' : 'text-gray-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{title}</span>
                    {enabled
                      ? <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold"><Eye size={10} /> Visible</span>
                      : <span className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold"><EyeOff size={10} /> Hidden</span>
                    }
                  </div>
                  <p className="text-xs text-gray-400 m-0 mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <Toggle enabled={enabled} onChange={(val) => updateConsent(key, val)} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Restricted notice */}
      {allDisabled && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <Lock size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 m-0 leading-relaxed">
            <strong>All data is currently hidden from your caregiver.</strong> They will see a restricted notice on their dashboard. Consider allowing at least vitals so your care team can support you effectively.
          </p>
        </div>
      )}

      {/* Info footer */}
      <div className="bg-gray-50 rounded-xl px-4 py-3">
        <p className="text-xs text-gray-400 m-0 leading-relaxed">
          <strong className="text-gray-500">Note:</strong> These settings apply to your currently assigned caregiver. Emergency health alerts may still be visible to your care team regardless of these settings to ensure your safety.
        </p>
      </div>
    </div>
  );
}
