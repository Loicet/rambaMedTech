import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { useLang } from '../context/LanguageContext';

const trackingTypes = [
  { label: 'Blood Sugar', unit: 'mg/dL', placeholder: 'e.g. 110' },
  { label: 'Blood Pressure', unit: 'mmHg', placeholder: 'e.g. 120/80' },
  { label: 'Heart Rate', unit: 'bpm', placeholder: 'e.g. 72' },
  { label: 'Weight', unit: 'kg', placeholder: 'e.g. 70' },
  { label: 'Peak Flow', unit: 'L/min', placeholder: 'e.g. 450' },
  { label: 'Oxygen Saturation', unit: '%', placeholder: 'e.g. 98' },
];

const emptyForm = { type: 'Blood Sugar', value: '', unit: 'mg/dL', date: new Date().toISOString().split('T')[0], note: '' };

const inputCls = "px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors bg-white w-full";

export default function Tracker() {
  const { logs, addLog } = useHealth();
  const { t } = useLang();
  const [form, setForm] = useState(emptyForm);
  const [success, setSuccess] = useState(false);

  const set = (field) => (e) => {
    const updated = { ...form, [field]: e.target.value };
    if (field === 'type') updated.unit = trackingTypes.find(t => t.label === e.target.value)?.unit || '';
    setForm(updated);
  };

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await addLog({ metric: form.type, value: form.value, unit: form.unit, notes: form.note });
      setSuccess(true);
      setForm(emptyForm);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">{t('trackerTitle')}</h1>
        <p className="text-sm text-gray-400 m-0">{t('trackerSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-5 items-start">
        {/* Form */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">{t('addNewLog')}</h2>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-lg text-sm mb-4">
              {t('logSaved')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">{t('metricType')}</label>
              <select value={form.type} onChange={set('type')} className={inputCls}>
                {trackingTypes.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">{t('value')}</label>
                <input value={form.value} onChange={set('value')}
                  placeholder={trackingTypes.find(t => t.label === form.type)?.placeholder}
                  required className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">{t('unit')}</label>
                <input value={form.unit} readOnly className={`${inputCls} bg-gray-50 text-gray-400 cursor-default`} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">{t('date')}</label>
              <input type="date" value={form.date} onChange={set('date')} required className={inputCls} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">{t('noteOptional')}</label>
              <textarea value={form.note} onChange={set('note')}
                placeholder={t('notePlaceholder')} rows={2}
                className={`${inputCls} resize-none font-inherit`} />
            </div>

            <button type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer transition-colors border-0 mt-1">
              {t('saveLog')}
            </button>
          </form>
        </div>

        {/* Log history */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">{t('logHistory')} ({logs.length})</h2>
          {logs.length === 0 ? (
            <p className="text-gray-400 text-sm">{t('noLogsEntry')}</p>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-[520px] overflow-y-auto pr-1">
              {logs.map(log => (
                <div key={log.id} className="p-3.5 bg-gray-50 rounded-xl border-l-4 border-l-emerald-600">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wide">{log.metric || log.type}</span>
                    <span className="text-[11px] text-gray-300">{log.loggedAt ? new Date(log.loggedAt).toLocaleDateString() : log.date}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {log.value} <span className="text-xs font-normal text-gray-400">{log.unit}</span>
                  </div>
                  {(log.notes || log.note) && <div className="text-xs text-gray-400 mt-1">{log.notes || log.note}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
