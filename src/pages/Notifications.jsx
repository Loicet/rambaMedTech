import { useState, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useInvite } from '../context/InviteContext';
import { api } from '../api';
import {
  Heart, AlertCircle, Calendar, MessageCircle, CheckCircle,
  Pill, BarChart2, PersonStanding, Bell, Users, UserCheck, Stethoscope,
} from 'lucide-react';

const patientTypeIcon = { medication: Pill, tracking: BarChart2, exercise: PersonStanding, general: Bell, checkin: MessageCircle };
const inputCls = 'px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors bg-white';

// Pick an icon based on notification title keywords
function notifIcon(title = '') {
  const t = title.toLowerCase();
  if (t.includes('caregiver') || t.includes('assigned') || t.includes('assignment')) return UserCheck;
  if (t.includes('patient') || t.includes('accepted')) return Stethoscope;
  if (t.includes('community') || t.includes('post') || t.includes('comment') || t.includes('liked')) return Users;
  return Bell;
}

function notifBorderColor(title = '') {
  const t = title.toLowerCase();
  if (t.includes('caregiver') || t.includes('assigned') || t.includes('assignment') || t.includes('accepted')) return 'border-l-blue-400';
  if (t.includes('community') || t.includes('post') || t.includes('comment') || t.includes('liked')) return 'border-l-emerald-400';
  return 'border-l-gray-300';
}

// ── Shared notifications panel used by both roles ──────────────────────────
function NotificationsPanel({ title, subtitle }) {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNotifications()
      .then(({ notifications }) => setNotifs(notifications))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await api.markRead(id).catch(() => {});
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = async () => {
    await api.markAllRead().catch(() => {});
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unread = notifs.filter(n => !n.isRead);
  const read   = notifs.filter(n => n.isRead);

  if (loading) return (
    <div className="flex items-center justify-center py-10">
      <div className="w-7 h-7 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bell size={13} /> {title}
            {unread.length > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread.length}</span>
            )}
          </h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {unread.length > 0 && (
          <button onClick={markAllRead}
            className="text-xs text-emerald-700 bg-transparent border-0 cursor-pointer hover:underline p-0">
            Mark all read
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <p className="text-sm text-gray-400">No notifications yet.</p>
      ) : (
        <>
          {unread.map(n => {
            const Icon = notifIcon(n.title);
            return (
              <div key={n.id} className={`flex items-start gap-3 bg-white rounded-xl px-4 py-3.5 shadow-sm border-l-4 ${notifBorderColor(n.title)}`}>
                <Icon size={16} className="text-gray-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-800">{n.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5 break-words leading-relaxed">{n.message}</div>
                  <div className="text-[10px] text-gray-300 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <button onClick={() => markRead(n.id)}
                  className="text-gray-300 hover:text-emerald-600 bg-transparent border-0 cursor-pointer shrink-0 text-sm p-0">
                  ✓
                </button>
              </div>
            );
          })}
          {read.length > 0 && (
            <details className="cursor-pointer">
              <summary className="text-xs text-gray-400 select-none">
                Show {read.length} read notification{read.length > 1 ? 's' : ''}
              </summary>
              <div className="flex flex-col gap-2 mt-2">
                {read.map(n => {
                  const Icon = notifIcon(n.title);
                  return (
                    <div key={n.id} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border-l-4 border-l-gray-200 opacity-50">
                      <Icon size={14} className="text-gray-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-600">{n.title}</div>
                        <div className="text-xs text-gray-400 break-words">{n.message}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          )}
        </>
      )}
    </div>
  );
}

// ── Caregiver patient nudges ───────────────────────────────────────────────
const nudgeIcon = {
  wellbeing: Heart, appointment: Calendar, support: MessageCircle,
  alert: AlertCircle, medication: CheckCircle, tracking: CheckCircle,
  checkin: MessageCircle, general: Heart,
};
const nudgeBg = {
  alert:      'border-l-red-400 bg-red-50',
  wellbeing:  'border-l-pink-400 bg-pink-50',
  support:    'border-l-purple-400 bg-purple-50',
  medication: 'border-l-emerald-400 bg-emerald-50',
  tracking:   'border-l-amber-400 bg-amber-50',
  checkin:    'border-l-indigo-400 bg-indigo-50',
  general:    'border-l-gray-300 bg-gray-50',
};

function generateNudges(patients, summaries) {
  const nudges = [];
  patients.forEach(p => {
    const data = summaries[p.id] || {};
    const emotions = data.recentEmotions || [];
    const logs = data.recentLogs || [];
    const latest = emotions[0];
    if (latest && ['LOW', 'BAD'].includes(latest.emotion)) {
      nudges.push({
        id: `emotion-${p.id}`,
        type: latest.emotion === 'BAD' ? 'alert' : 'wellbeing',
        patientName: p.name,
        text: `${p.name} reported feeling "${latest.emotion.toLowerCase()}" in their latest well-being check-in. Consider reaching out.`,
        time: new Date(latest.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        done: false,
      });
    }
    if (logs.length === 0) {
      nudges.push({
        id: `nolog-${p.id}`,
        type: 'tracking',
        patientName: p.name,
        text: `${p.name} hasn't logged any health data yet. Follow up if needed.`,
        time: 'Today',
        done: false,
      });
    }
  });
  return nudges;
}

function CaregiverNotifications({ patients }) {
  const [summaries, setSummaries] = useState({});
  const [nudges, setNudges] = useState([]);
  const [loadingNudges, setLoadingNudges] = useState(true);

  useEffect(() => {
    if (patients.length === 0) { setLoadingNudges(false); return; }
    const token = localStorage.getItem('ramba_token');
    const base = import.meta.env.VITE_API_URL + '/api';
    Promise.all(
      patients.map(p =>
        fetch(`${base}/community/caregiver/patient/${p.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(r => r.ok ? r.json() : {}).then(data => ({ id: p.id, data }))
      )
    ).then(results => {
      const map = {};
      results.forEach(({ id, data }) => { map[id] = data; });
      setSummaries(map);
      setNudges(generateNudges(patients, map));
    }).catch(() => {}).finally(() => setLoadingNudges(false));
  }, [patients]);

  const markDone = (id) => setNudges(prev => prev.map(n => n.id === id ? { ...n, done: true } : n));
  const dismiss  = (id) => setNudges(prev => prev.filter(n => n.id !== id));
  const pending  = nudges.filter(n => !n.done);
  const done     = nudges.filter(n => n.done);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">Notifications</h1>
        <p className="text-sm text-gray-400 m-0">Your assignments and patient activity alerts.</p>
      </div>

      {/* In-app notifications (assignment alerts, etc.) */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <NotificationsPanel
          title="Your Notifications"
          subtitle="Assignment alerts and updates from patients."
        />
      </div>

      {/* Patient nudges */}
      {patients.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Stethoscope size={13} /> Patient Activity
            {pending.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pending.length}</span>
            )}
          </h2>
          <p className="text-xs text-gray-400 -mt-1">Nudges based on what your patients have logged.</p>

          {loadingNudges ? (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : pending.length === 0 ? (
            <p className="text-sm text-gray-400">All caught up — no pending nudges.</p>
          ) : (
            pending.map(n => {
              const Icon = nudgeIcon[n.type] || Heart;
              return (
                <div key={n.id} className={`flex items-start gap-3 rounded-xl px-4 py-3.5 shadow-sm border-l-4 ${nudgeBg[n.type] || nudgeBg.general}`}>
                  <Icon size={18} className="shrink-0 mt-0.5 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-500 mb-0.5">{n.patientName} · {n.time}</div>
                    <div className="text-sm text-gray-800 leading-relaxed">{n.text}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => markDone(n.id)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors border bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                      Done
                    </button>
                    <button onClick={() => dismiss(n.id)}
                      className="text-gray-300 hover:text-red-500 text-base cursor-pointer bg-transparent border-0 px-1 transition-colors">
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {done.length > 0 && (
            <details className="cursor-pointer">
              <summary className="text-xs text-gray-400 select-none">Completed ({done.length})</summary>
              <div className="flex flex-col gap-2 mt-2">
                {done.map(n => (
                  <div key={n.id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border-l-4 border-l-gray-200 opacity-50">
                    <CheckCircle size={16} className="text-green-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400">{n.patientName}</div>
                      <div className="text-sm text-gray-600 line-through">{n.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

// ── Patient view ───────────────────────────────────────────────────────────
export default function Notifications() {
  const { t } = useLang();
  const { user } = useAuth();
  const { patients } = useInvite();

  if (user?.role === 'caregiver') {
    return <CaregiverNotifications patients={patients} />;
  }

  // Patient
  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [form, setForm] = useState({ title: '', time: '', type: 'medication' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.getReminders()
      .then(({ reminders }) => setReminders(reminders))
      .catch(() => {})
      .finally(() => setLoadingReminders(false));
  }, []);

  const toggle = async (id) => {
    const { reminder } = await api.toggleReminder(id);
    setReminders(prev => prev.map(r => r.id === id ? reminder : r));
  };

  const remove = async (id) => {
    await api.deleteReminder(id);
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const addReminder = async (e) => {
    e.preventDefault();
    const { reminder } = await api.createReminder(form);
    setReminders(prev => [reminder, ...prev]);
    setForm({ title: '', time: '', type: 'medication' });
    setShowForm(false);
  };

  const active   = reminders.filter(r => r.active);
  const inactive = reminders.filter(r => !r.active);

  const ReminderCard = ({ r, isActive }) => (
    <div className={`flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 shadow-sm border-l-4 transition-opacity
      ${isActive ? 'border-l-emerald-600' : 'border-l-gray-300 opacity-60'}`}>
      {(() => { const Icon = patientTypeIcon[r.type] || Bell; return <Icon size={18} className="text-emerald-600 shrink-0" />; })()}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800">{r.title}</div>
        <div className="text-xs text-gray-400 mt-0.5">{r.time}</div>
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">{t('remindersTitle')}</h1>
        <p className="text-sm text-gray-400 m-0">{t('remindersSubtitle')}</p>
      </div>

      {/* In-app notifications for patients (community activity, caregiver accepted, etc.) */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <NotificationsPanel title="Notifications" />
      </div>

      {/* Reminders */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Bell size={13} /> {t('active')} Reminders ({active.length})
        </h2>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors border-0 whitespace-nowrap">
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

      {loadingReminders ? (
        <div className="flex justify-center py-6">
          <div className="w-7 h-7 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
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
        </>
      )}
    </div>
  );
}
