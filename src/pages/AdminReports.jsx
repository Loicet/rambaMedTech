import { useState, useEffect } from 'react';
import { TrendingUp, Users, Activity, Heart } from 'lucide-react';
import { api } from '../api';

const MOOD_LABEL = { 5: 'Great', 4: 'Good', 3: 'Okay', 2: 'Low', 1: 'Struggling' };
const moodColor = (score) => {
  if (!score) return 'text-gray-400';
  if (score >= 4) return 'text-emerald-600';
  if (score >= 3) return 'text-amber-500';
  return 'text-red-500';
};
const improvementColor = (v) => {
  if (v === null) return 'text-gray-400';
  if (v > 0) return 'text-emerald-600';
  if (v < 0) return 'text-red-500';
  return 'text-gray-500';
};

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminReports().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const { growthData = [], moodCohorts = [], engagement = {} } = data || {};
  const maxGrowth = Math.max(...growthData.map(d => d.count), 1);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1 flex items-center gap-2">
          <TrendingUp size={22} className="text-emerald-600" /> Reports & Analytics
        </h1>
        <p className="text-sm text-gray-400 m-0">Aggregated platform insights — no individual patient data.</p>
      </div>

      {/* Engagement summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Patients',       value: engagement.totalPatients ?? 0,      Icon: Users },
          { label: 'Active (last 30 days)', value: engagement.activePatients ?? 0,     Icon: Activity },
          { label: 'Inactive',              value: engagement.inactivePatients ?? 0,   Icon: Users },
          { label: 'Avg Logs / Patient',    value: engagement.avgLogsPerPatient ?? 0,  Icon: Heart },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <Icon size={18} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Mood improvement by condition */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Mood Improvement by Condition</h3>
          <p className="text-xs text-gray-400 mb-4">Avg well-being score at join vs last 30 days (1–5 scale)</p>
          {moodCohorts.length === 0
            ? <p className="text-sm text-gray-400">Not enough check-in data yet.</p>
            : <div className="flex flex-col gap-3">
                <div className="grid grid-cols-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wide pb-1 border-b border-gray-100">
                  <span className="col-span-2">Condition</span>
                  <span className="text-center">At Join</span>
                  <span className="text-center">Recent</span>
                </div>
                {moodCohorts.map(c => (
                  <div key={c.condition} className="grid grid-cols-4 items-center gap-1">
                    <div className="col-span-2">
                      <div className="text-xs font-medium text-gray-700 truncate">{c.condition}</div>
                      <div className="text-[10px] text-gray-400">{c.patientCount} patient{c.patientCount !== 1 ? 's' : ''}</div>
                    </div>
                    <div className={`text-center text-sm font-bold ${moodColor(c.avgMoodAtJoin)}`}>
                      {c.avgMoodAtJoin ?? '—'}
                      {c.avgMoodAtJoin && <div className="text-[9px] font-normal">{MOOD_LABEL[Math.round(c.avgMoodAtJoin)]}</div>}
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-bold ${moodColor(c.avgMoodRecent)}`}>
                        {c.avgMoodRecent ?? '—'}
                      </div>
                      {c.improvement !== null && (
                        <div className={`text-[10px] font-semibold ${improvementColor(c.improvement)}`}>
                          {c.improvement > 0 ? `+${c.improvement}` : c.improvement} {c.improvement > 0 ? '↑' : c.improvement < 0 ? '↓' : '→'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Monthly patient growth */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">New Patients — Last 6 Months</h3>
          <p className="text-xs text-gray-400 mb-4">Monthly patient registrations</p>
          {growthData.length === 0
            ? <p className="text-sm text-gray-400">No registration data yet.</p>
            : <div className="flex flex-col gap-2.5">
                {growthData.map(d => (
                  <div key={d.month} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-16 shrink-0">
                      {new Date(d.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                    </span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full transition-all"
                        style={{ width: `${(d.count / maxGrowth) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-6 text-right">{d.count}</span>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-4 text-xs text-emerald-700">
        All data shown is aggregated across patient cohorts. No individual patient names, vitals, or personal records are accessible from this view.
      </div>
    </div>
  );
}
