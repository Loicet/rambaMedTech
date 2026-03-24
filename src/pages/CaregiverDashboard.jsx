import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useConsent } from '../context/ConsentContext';
import { useInvite } from '../context/InviteContext';
import { AlertTriangle, CheckCircle, AlertCircle, Activity, Flame, EyeOff, ShieldCheck, UserPlus } from 'lucide-react';
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

const patients = [
  {
    id: 1, name: 'Amara Kamara', age: 34, condition: 'Diabetes',
    lastSeen: 'Today, 8:42 AM', streak: 12, mood: { label: 'Good' },
    vitals: [
      { type: 'Blood Sugar', value: '112', unit: 'mg/dL', time: '8:30 AM', status: 'normal' },
      { type: 'Blood Pressure', value: '118/76', unit: 'mmHg', time: 'Yesterday', status: 'normal' },
      { type: 'Weight', value: '68', unit: 'kg', time: '2 days ago', status: 'normal' },
    ],
    insights: [
      { type: 'positive', text: { en: 'Blood sugar has been within target range for 5 consecutive days.', rw: "Isukari mu maraso yari mu rugero rw'intego iminsi 5 ikurikirana." } },
      { type: 'positive', text: { en: 'Logging streak of 12 days — excellent consistency.', rw: "Inyandiko z'iminsi 12 ikurikirana — gukomeza neza cyane." } },
      { type: 'warning', text: { en: 'Reported fatigue in last 2 well-being check-ins.', rw: "Umunaniro watangajwe mu birebwa 2 by'ubuzima bw'umutima bya nyuma." } },
    ],
    suggestions: {
      en: ['Encourage Amara to discuss fatigue with her physician — may indicate anemia or medication side effects.', 'Reinforce current dietary habits as blood sugar control is improving.', 'Consider scheduling a virtual check-in this week given the fatigue reports.'],
      rw: ["Shishikariza Amara kuganira n'umuganga we ku munaniro — bishobora kwerekana anemia cyangwa ingaruka z'imiti.", 'Shyigikira imirire isanzwe kuko kugenzura isukari bitera imbere.', "Tekereza guteganiriza igenzura kuri interineti iki cyumweru bitewe n'umunaniro watangajwe."],
    },
    emotionalStatus: {
      recentMoods: ['great', 'good', 'good', 'okay', 'good'],
      note: { en: 'Generally positive mood trend. One "Okay" day mid-week — monitor for patterns.', rw: "Imyumvire myiza muri rusange. Umunsi umwe \"Bisanzwe\" hagati y'icyumweru — kurikirana imiterere." },
      symptoms: { en: ['Fatigue', 'Mild headache'], rw: ["Umunaniro", "Ububabare bw'umutwe buke"] },
    },
  },
  {
    id: 2, name: 'Kwame Asante', age: 52, condition: 'Hypertension',
    lastSeen: 'Yesterday, 6:15 PM', streak: 3, mood: { label: 'Okay' },
    vitals: [
      { type: 'Blood Pressure', value: '148/92', unit: 'mmHg', time: 'Yesterday', status: 'high' },
      { type: 'Heart Rate', value: '88', unit: 'bpm', time: 'Yesterday', status: 'normal' },
    ],
    insights: [
      { type: 'alert', text: { en: 'Blood pressure reading of 148/92 is above target range.', rw: "Umuvuduko w'amaraso wa 148/92 uri hejuru y'intego." } },
      { type: 'warning', text: { en: 'Logging streak dropped — only 3 days this week.', rw: 'Inyandiko zagabanutse — iminsi 3 gusa iki cyumweru.' } },
      { type: 'warning', text: { en: 'Reported stress and poor sleep in recent check-ins.', rw: "Ingaruka z'umunaniro no kuryama nabi byatangajwe mu birebwa bya vuba." } },
    ],
    suggestions: {
      en: ['Urgent: Follow up on elevated BP reading — consider medication review.', 'Discuss stress management techniques and sleep hygiene.', 'Encourage daily logging to re-establish consistency.'],
      rw: ["Byihutirwa: Kurikirana umuvuduko w'amaraso mwinshi — tekereza gusuzuma imiti.", "Ganira ku buryo bwo gucunga ingaruka z'umunaniro no kwitwara neza mu kuryama.", 'Shishikariza kwandika buri munsi kugira ngo usubire mu gukomeza.'],
    },
    emotionalStatus: {
      recentMoods: ['okay', 'low', 'okay', 'okay', 'good'],
      note: { en: 'Mood has been lower than usual. Stress and sleep issues reported. Emotional support recommended.', rw: "Imyumvire yari munsi y'isanzwe. Ingaruka z'umunaniro no kuryama nabi byatangajwe. Inkunga y'umutima irasabwa." },
      symptoms: { en: ['Stress', 'Poor sleep', 'Dizziness'], rw: ["Ingaruka z'umunaniro", 'Kuryama nabi', 'Isereri'] },
    },
  },
  {
    id: 3, name: 'Fatima Mensah', age: 28, condition: 'Asthma',
    lastSeen: 'Today, 10:00 AM', streak: 7, mood: { label: 'Great' },
    vitals: [
      { type: 'Peak Flow', value: '460', unit: 'L/min', time: 'This morning', status: 'normal' },
      { type: 'Oxygen Saturation', value: '98', unit: '%', time: 'This morning', status: 'normal' },
    ],
    insights: [
      { type: 'positive', text: { en: 'Peak flow readings are consistently within personal best range.', rw: "Ibipimo by'umwuka biri mu rugero rw'ibyiza bya buri wese buri gihe." } },
      { type: 'positive', text: { en: 'No rescue inhaler use reported this week.', rw: "Nta gukoresha inhaleri y'ubufasha byatangajwe iki cyumweru." } },
      { type: 'positive', text: { en: 'Mood has been excellent — great emotional well-being.', rw: "Imyumvire yari nziza cyane — ubuzima bwiza bw'umutima." } },
    ],
    suggestions: {
      en: ['Continue current management plan — patient is doing very well.', 'Remind Fatima to carry her rescue inhaler during the rainy season.', 'Positive reinforcement: acknowledge her 7-day logging streak.'],
      rw: ["Komeza gahunda isanzwe y'ubuvuzi — umurwayi akora neza cyane.", "Bwira Fatima gutwara inhaleri ye y'ubufasha mu gihe cy'imvura.", "Shishikariza: menya inyandiko ze z'iminsi 7 ikurikirana."],
    },
    emotionalStatus: {
      recentMoods: ['great', 'great', 'good', 'great', 'great'],
      note: { en: 'Excellent emotional well-being. Fatima is engaged and motivated in her health journey.', rw: "Ubuzima bwiza bw'umutima. Fatima afite ubushake kandi ashishikajwe mu rugendo rwe rw'ubuzima." },
      symptoms: { en: [], rw: [] },
    },
  },
];

const vitalColor = { normal: 'text-green-600', high: 'text-red-500', low: 'text-orange-500' };
const insightStyle = { positive: 'bg-emerald-50 text-emerald-800', warning: 'bg-yellow-50 text-yellow-800', alert: 'bg-red-50 text-red-800' };
const InsightIcon = { positive: CheckCircle, warning: AlertTriangle, alert: AlertCircle };

export default function CaregiverDashboard() {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const { getConsent } = useConsent();
  const { getCaregiverPatients } = useInvite();

  // Merge linked patient ids with the mock patient data
  const linkedInvites = getCaregiverPatients(user.id, user.email);
  const linkedPatients = patients.filter(p => linkedInvites.some(inv => inv.patientId === p.id));

  const [selected, setSelected] = useState(linkedPatients[0] || null);
  const hasAlert = linkedPatients.some(p => p.insights.some(i => i.type === 'alert'));
  const consent = selected ? getConsent(selected.id) : {};

  // No linked patients yet
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

      {/* ── Header ── */}
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

      {/* ── Alert banner ── */}
      {hasAlert && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-red-800">
          <AlertCircle size={20} className="text-red-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <strong>{t('attentionNeeded')}:</strong> Kwame Asante — 148/92 mmHg.
          </div>
          <button onClick={() => setSelected(linkedPatients.find(p => p.name === 'Kwame Asante'))}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition-colors whitespace-nowrap border-0 shrink-0">
            {lang === 'rw' ? 'Reba →' : 'View →'}
          </button>
        </div>
      )}

      {/* ── Layout: sidebar + detail on desktop, stacked on mobile ── */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* Patient list — horizontal scroll on mobile, vertical sidebar on desktop */}
        <div className="w-full lg:w-56 shrink-0">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('yourPatients')}</h2>

          {/* Mobile: pill row */}
          <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {linkedPatients.map(p => (
              <button key={p.id} onClick={() => setSelected(p)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 cursor-pointer transition-all shrink-0 bg-white
                  ${selected.id === p.id ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200'}
                  ${p.insights.some(i => i.type === 'alert') ? '!border-l-4 !border-l-red-400' : ''}`}>
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">{p.name[0]}</div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-gray-900 whitespace-nowrap">{p.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-gray-400">{p.condition}</div>
                </div>
                <Activity size={14} className="text-emerald-500" />
              </button>
            ))}
          </div>

          {/* Desktop: vertical list */}
          <div className="hidden lg:flex flex-col gap-2">
            {linkedPatients.map(p => (
              <div key={p.id} onClick={() => setSelected(p)}
                className={`flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer border-2 transition-all shadow-sm
                  ${selected.id === p.id ? 'border-emerald-600 bg-emerald-50' : 'border-transparent hover:border-emerald-200'}
                  ${p.insights.some(i => i.type === 'alert') ? 'border-l-4 border-l-red-400' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">{p.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.condition}</div>
                  <div className="text-[10px] text-gray-300 mt-0.5">{p.lastSeen}</div>
                </div>
                <Activity size={16} className="text-emerald-500" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Patient detail panel ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Patient header card */}
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shrink-0">{selected.name[0]}</div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 m-0 mb-0.5">{selected.name}{t('patientDay')}</h2>
              <p className="text-xs text-gray-400 m-0 flex items-center gap-1">{selected.condition} · {t('age')} {selected.age} · <Flame size={12} className="text-orange-400" />{selected.streak}{t('loggingStreak')}</p>
            </div>
          </div>

          {/* Consent notice if anything is restricted */}
          {!Object.values(consent).every(Boolean) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2.5 text-xs text-amber-700">
              <ShieldCheck size={15} className="text-amber-500 shrink-0" />
              This patient has restricted some data categories. Restricted sections are shown below.
            </div>
          )}

          {/* 2-col grid on desktop: vitals | emotional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Vitals */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">{t('latestVitals')}</h3>
              {consent.vitals ? (
                <div className="flex flex-col gap-2">
                  {selected.vitals.map(v => (
                    <div key={v.type} className="bg-gray-50 rounded-xl p-3 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">{v.type}</div>
                        <div className={`text-base font-bold mt-0.5 ${vitalColor[v.status]}`}>
                          {v.value} <span className="text-xs font-normal text-gray-400">{v.unit}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-300">{v.time}</div>
                        <div className={`text-[10px] font-semibold mt-0.5 ${vitalColor[v.status]}`}>● {t(v.status)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <Restricted label="vitals" />}
            </div>

            {/* Emotional wellbeing */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">{t('emotionalWellbeing')}</h3>
              {consent.mood ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-400">{t('last5Checkins')}</span>
                    <div className="flex gap-1">{selected.emotionalStatus.recentMoods.map((m, i) => <span key={i} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${m === 'great' ? 'bg-emerald-100 text-emerald-700' : m === 'good' ? 'bg-green-100 text-green-700' : m === 'okay' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>{m}</span>)}</div>
                  </div>
                  <p className="text-sm text-gray-600 m-0 leading-relaxed">{selected.emotionalStatus.note[lang] || selected.emotionalStatus.note.en}</p>
                  {consent.symptoms && selected.emotionalStatus.symptoms[lang]?.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400">{t('reportedSymptoms')}</span>
                      {selected.emotionalStatus.symptoms[lang].map(s => (
                        <span key={s} className="bg-yellow-100 text-yellow-800 text-xs px-2.5 py-0.5 rounded-full font-medium">{s}</span>
                      ))}
                    </div>
                  )}
                  {!consent.symptoms && <Restricted label="reported symptoms" />}
                </div>
              ) : <Restricted label="emotional well-being" />}
            </div>

          </div>

          {/* 2-col grid on desktop: insights | suggested actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Health insights */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">{t('healthInsights')}</h3>
              {consent.insights ? (
                <div className="flex flex-col gap-2">
                  {selected.insights.map((ins, i) => {
                    const Icon = InsightIcon[ins.type];
                    return (
                      <div key={i} className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-sm leading-relaxed ${insightStyle[ins.type]}`}>
                        <Icon size={15} className="shrink-0 mt-0.5" />
                        <span>{ins.text[lang] || ins.text.en}</span>
                      </div>
                    );
                  })}
                </div>
              ) : <Restricted label="health insights" />}
            </div>

            {/* Suggested actions */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">{t('suggestedActions')}</h3>
              <div className="flex flex-col gap-2">
                {(selected.suggestions[lang] || selected.suggestions.en).map((s, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-700 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
