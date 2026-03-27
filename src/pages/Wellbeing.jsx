import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { useLang } from '../context/LanguageContext';
import { SmilePlus, Smile, Meh, Frown, CloudRain, CheckCircle, Clock } from 'lucide-react';

const moodKeys = [
  { Icon: SmilePlus, labelKey: 'moodGreat',      ring: 'ring-green-400',  bg: 'bg-green-50',  color: 'text-green-500' },
  { Icon: Smile,     labelKey: 'moodGood',       ring: 'ring-lime-400',   bg: 'bg-lime-50',   color: 'text-lime-500' },
  { Icon: Meh,       labelKey: 'moodOkay',       ring: 'ring-yellow-400', bg: 'bg-yellow-50', color: 'text-yellow-500' },
  { Icon: Frown,     labelKey: 'moodLow',        ring: 'ring-orange-400', bg: 'bg-orange-50', color: 'text-orange-500' },
  { Icon: CloudRain, labelKey: 'moodStruggling', ring: 'ring-red-400',    bg: 'bg-red-50',    color: 'text-red-500' },
];

const symptomKeys = ['symptomFatigue','symptomHeadache','symptomDizziness','symptomBreath','symptomChest','symptomNausea','symptomJoint','symptomAnxiety'];

function WellbeingHistory({ logs, t }) {
  if (logs.length === 0) return null;
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('recentCheckins')}</h3>
      <div className="flex flex-col divide-y divide-gray-100">
        {logs.slice(0, 5).map(log => (
          <div key={log.id} className="flex items-center gap-3 py-2.5">
            <CheckCircle size={20} className="text-emerald-500 shrink-0" />
            <div>
              <div className="text-sm font-medium text-gray-800">{log.mood}</div>
              <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <Clock size={10} /> {log.date}{log.symptoms?.length > 0 && ` · ${log.symptoms.join(', ')}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Wellbeing() {
  const { wellbeingLogs, addWellbeingLog } = useHealth();
  const { t } = useLang();
  const moods = moodKeys.map(m => ({ ...m, label: t(m.labelKey) }));
  const symptoms = symptomKeys.map(k => t(k));
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);
  const [checkedSymptoms, setCheckedSymptoms] = useState([]);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  const toggleSymptom = (s) => setCheckedSymptoms(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  );

  const handleSubmit = async () => {
    try {
      await addWellbeingLog({ emotion: selected.labelKey.replace('mood', '').toUpperCase(), notes: [checkedSymptoms.join(', '), note].filter(Boolean).join(' | ') });
      setDone(true);
    } catch (err) {
      console.error(err);
    }
  };

  const reset = () => { setStep(1); setSelected(null); setCheckedSymptoms([]); setNote(''); setDone(false); };

  if (done) {
    const DoneIcon = selected.Icon;
    return (
      <div className="flex flex-col gap-5">
        <div className="bg-white rounded-xl p-8 sm:p-10 text-center shadow-sm mx-auto w-full max-w-sm">
          <div className="flex justify-center mb-3">
            <DoneIcon size={56} className={selected.color} />
          </div>
          <h2 className="text-xl font-bold text-emerald-700 mb-2">{t('checkinComplete')}</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">{t('checkinThanks')}</p>
          <button onClick={reset}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 rounded-lg text-sm cursor-pointer transition-colors border-0 w-full sm:w-auto">
            {t('newCheckin')}
          </button>
        </div>
        <WellbeingHistory logs={wellbeingLogs} t={t} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">{t('wellbeingTitle')}</h1>
        <p className="text-sm text-gray-400 m-0">{t('wellbeingSubtitle')}</p>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-base font-semibold text-gray-800 m-0">{t('howFeelingToday')}</h2>
            <div className="grid grid-cols-5 gap-2">
              {moods.map(m => {
                const Icon = m.Icon;
                return (
                  <button key={m.labelKey} onClick={() => setSelected(m)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border-2 cursor-pointer transition-all
                      ${selected?.labelKey === m.labelKey
                        ? `${m.bg} ring-2 ${m.ring} border-transparent`
                        : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                    <Icon size={28} className={m.color} />
                    <span className="text-[10px] sm:text-xs text-gray-600 font-medium leading-tight text-center">{m.label}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setStep(2)} disabled={!selected}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer transition-colors border-0 w-full">
              {t('nextBtn')}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-800 m-0 mb-1">{t('anySymptomsToday')}</h2>
              <p className="text-xs text-gray-400 m-0">{t('selectAllApply')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {symptoms.map(s => (
                <button key={s} onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-sm border-2 cursor-pointer transition-all font-medium flex items-center gap-1
                    ${checkedSymptoms.includes(s)
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-600 hover:text-emerald-700'}`}>
                  {checkedSymptoms.includes(s) && <CheckCircle size={12} />}{s}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">{t('additionalNotes')}</label>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder={t('additionalNotesPlaceholder')} rows={3}
                className="px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2.5 rounded-lg text-sm cursor-pointer transition-colors border-0">
                {t('backBtn')}
              </button>
              <button onClick={handleSubmit}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer transition-colors border-0">
                {t('submitCheckin')}
              </button>
            </div>
          </div>
        )}
      </div>

      <WellbeingHistory logs={wellbeingLogs} t={t} />
    </div>
  );
}
