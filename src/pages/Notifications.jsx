import { useState } from 'react';
import { useLang } from '../context/LanguageContext';
import { mockReminders } from '../data/mockData';

const typeIcons = { medication: '', tracking: '', exercise: '', general: '' };

const inputCls = "px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors bg-white";

export default function Notifications() {
  const { t } = useLang();
  const [reminders, setReminders] = useState(mockReminders);
  const [form, setForm] = useState({ title: '', time: '', type: 'medication' });
  const [showForm, setShowForm] = useState(false);

  const toggle = (id) => setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  const remove = (id) => setReminders(prev => prev.filter(r => r.id !== id));

  const addReminder = (e) => {
    e.preventDefault();
    setReminders(prev => [...prev, { ...form, id: Date.now(), active: true }]);
    setForm({ title: '', time: '', type: 'medication' });
    setShowForm(false);
  };

  const active = reminders.filter(r => r.active);
  const inactive = reminders.filter(r => !r.active);

  const ReminderCard = ({ r, isActive }) => (
    <div className={`flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 shadow-sm border-l-4 transition-opacity
      ${isActive ? 'border-l-emerald-600' : 'border-l-gray-300 opacity-60'}`}>
      <span className="text-2xl shrink-0">{typeIcons[r.type] || ''}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800">{r.title}</div>
        <div className="text-xs text-gray-400 mt-0.5"> {r.time}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => toggle(r.id)}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors border
            ${isActive
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
          {isActive ? t('pause') : t('activate')}
        </button>
        <button onClick={() => remove(r.id)}
          className="text-gray-300 hover:text-red-500 text-base cursor-pointer bg-transparent border-0 px-1 transition-colors">
          ✕
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">{t('remindersTitle')}</h1>
          <p className="text-sm text-gray-400 m-0">{t('remindersSubtitle')}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer transition-colors border-0 whitespace-nowrap">
          {t('addReminder')}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addReminder} className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">{t('reminderTitle')}</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder={t('reminderTitlePlaceholder')} required className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">{t('time')}</label>
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">{t('type')}</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputCls}>
                <option value="medication">{t('typeMedication')}</option>
                <option value="tracking">{t('typeTracking')}</option>
                <option value="exercise">{t('typeExercise')}</option>
                <option value="general">{t('typeGeneral')}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer transition-colors border-0">
              {t('cancel')}
            </button>
            <button type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors border-0">
              {t('saveReminder')}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('active')} ({active.length})</h2>
        {active.length === 0
          ? <p className="text-sm text-gray-400">{t('noActiveReminders')}</p>
          : active.map(r => <ReminderCard key={r.id} r={r} isActive={true} />)
        }
      </div>

      {inactive.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('paused')} ({inactive.length})</h2>
          {inactive.map(r => <ReminderCard key={r.id} r={r} isActive={false} />)}
        </div>
      )}
    </div>
  );
}
