import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useInvite } from '../context/InviteContext';
import { useConsent } from '../context/ConsentContext';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Activity, Flame, UserPlus, Bell, Users, ArrowRight } from 'lucide-react';

// patients mock — same data as CaregiverDashboard
const patients = [
  {
    id: 1, name: 'Amara Kamara', condition: 'Diabetes', streak: 12,
    vitals: [{ type: 'Blood Sugar', value: '112', unit: 'mg/dL', status: 'normal' }],
    insights: [{ type: 'positive' }, { type: 'positive' }, { type: 'warning' }],
    lastSeen: 'Today, 8:42 AM',
  },
  {
    id: 2, name: 'Kwame Asante', condition: 'Hypertension', streak: 3,
    vitals: [{ type: 'Blood Pressure', value: '148/92', unit: 'mmHg', status: 'high' }],
    insights: [{ type: 'alert' }, { type: 'warning' }, { type: 'warning' }],
    lastSeen: 'Yesterday, 6:15 PM',
  },
  {
    id: 3, name: 'Fatima Mensah', condition: 'Asthma', streak: 7,
    vitals: [{ type: 'Peak Flow', value: '460', unit: 'L/min', status: 'normal' }],
    insights: [{ type: 'positive' }, { type: 'positive' }, { type: 'positive' }],
    lastSeen: 'Today, 10:00 AM',
  },
];

const vitalColor = { normal: 'text-green-600', high: 'text-red-500', low: 'text-orange-500' };
const statusBadge = {
  normal: 'bg-green-50 text-green-700',
  high:   'bg-red-50 text-red-600',
  low:    'bg-orange-50 text-orange-600',
};

export default function CaregiverOverview() {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const { getCaregiverPatients } = useInvite();

  const linkedInvites = getCaregiverPatients(user.id, user.email);
  const linkedPatients = patients.filter(p => linkedInvites.some(inv => inv.patientId === p.id));

  const alerts  = linkedPatients.filter(p => p.insights.some(i => i.type === 'alert'));
  const warnings = linkedPatients.filter(p => !p.insights.some(i => i.type === 'alert') && p.insights.some(i => i.type === 'warning'));
  const healthy  = linkedPatients.filter(p => p.insights.every(i => i.type === 'positive'));

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

      {/* Summary stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-1 items-center text-center">
          <Users size={20} className="text-emerald-600" />
          <span className="text-2xl font-bold text-gray-900">{linkedPatients.length}</span>
          <span className="text-xs text-gray-400">Patients</span>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-1 items-center text-center">
          <AlertCircle size={20} className="text-red-500" />
          <span className="text-2xl font-bold text-gray-900">{alerts.length}</span>
          <span className="text-xs text-gray-400">Alerts</span>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-1 items-center text-center">
          <CheckCircle size={20} className="text-green-500" />
          <span className="text-2xl font-bold text-gray-900">{healthy.length}</span>
          <span className="text-xs text-gray-400">On Track</span>
        </div>
      </div>

      {/* Alert banner */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-red-800">
          <AlertCircle size={18} className="text-red-500 shrink-0" />
          <p className="flex-1 m-0">
            <strong>{alerts.map(p => p.name.split(' ')[0]).join(', ')}</strong> — urgent readings need your attention.
          </p>
          <Link to="/caregiver/patients"
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg no-underline transition-colors shrink-0">
            View →
          </Link>
        </div>
      )}

      {/* Patient summary cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider m-0">{t('yourPatients')}</h2>
          <Link to="/caregiver/patients" className="text-xs text-emerald-700 font-medium no-underline flex items-center gap-1 hover:underline">
            Full view <ArrowRight size={12} />
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {linkedPatients.map(p => {
            const topVital = p.vitals[0];
            const hasAlert = p.insights.some(i => i.type === 'alert');
            const hasWarning = p.insights.some(i => i.type === 'warning');
            const statusIcon = hasAlert
              ? <AlertCircle size={14} className="text-red-500" />
              : hasWarning
              ? <AlertCircle size={14} className="text-amber-500" />
              : <CheckCircle size={14} className="text-green-500" />;

            return (
              <div key={p.id} className={`bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 border-l-4
                ${hasAlert ? 'border-l-red-400' : hasWarning ? 'border-l-amber-400' : 'border-l-emerald-400'}`}>
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                    {statusIcon}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{p.condition} · Last seen {p.lastSeen}</div>
                </div>
                {/* Top vital */}
                <div className="text-right shrink-0 hidden sm:block">
                  <div className="text-xs text-gray-400">{topVital.type}</div>
                  <div className={`text-sm font-bold ${vitalColor[topVital.status]}`}>
                    {topVital.value} <span className="text-xs font-normal text-gray-400">{topVital.unit}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusBadge[topVital.status]}`}>
                    {topVital.status}
                  </span>
                </div>
                {/* Streak */}
                <div className="text-right shrink-0 hidden md:flex flex-col items-center gap-0.5">
                  <Flame size={14} className="text-orange-400" />
                  <span className="text-xs font-bold text-gray-700">{p.streak}</span>
                  <span className="text-[10px] text-gray-400">streak</span>
                </div>
                <Link to="/caregiver/patients"
                  className="text-emerald-600 hover:text-emerald-800 transition-colors shrink-0">
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/notifications"
          className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 no-underline hover:shadow-md transition-shadow">
          <Bell size={18} className="text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-800 m-0">Patient Reminders</p>
            <p className="text-xs text-gray-400 m-0">Follow-up nudges</p>
          </div>
        </Link>
        <Link to="/caregiver/resources"
          className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 no-underline hover:shadow-md transition-shadow">
          <Activity size={18} className="text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-800 m-0">Clinical Resources</p>
            <p className="text-xs text-gray-400 m-0">Guidelines & tools</p>
          </div>
        </Link>
      </div>

    </div>
  );
}
