import { useState, useEffect } from 'react';
import { Users, Activity, Stethoscope, ClipboardList, Heart, BookOpen, MessageSquare, UserPlus, TrendingUp } from 'lucide-react';
import { api } from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [conditionBreakdown, setConditionBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminStats().then(({ stats, conditionBreakdown }) => {
      setStats(stats);
      setConditionBreakdown(conditionBreakdown);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const platformStats = [
    { label: 'Total Users',      value: stats?.totalUsers ?? 0,      Icon: Users },
    { label: 'Patients',         value: stats?.totalPatients ?? 0,    Icon: Activity },
    { label: 'Caregivers',       value: stats?.totalCaregivers ?? 0,  Icon: Stethoscope },
    { label: 'Health Logs',      value: stats?.totalHealthLogs ?? 0,  Icon: ClipboardList },
    { label: 'Well-being Check-ins', value: stats?.totalCheckIns ?? 0, Icon: Heart },
    { label: 'Community Posts',  value: stats?.totalPosts ?? 0,       Icon: MessageSquare },
  ];

  const activityItems = [
    { label: 'Health logs submitted',    value: stats?.totalHealthLogs ?? 0,  Icon: ClipboardList },
    { label: 'Well-being check-ins',     value: stats?.totalCheckIns ?? 0,    Icon: Heart },
    { label: 'Educational articles',     value: stats?.totalContent ?? 0,     Icon: BookOpen },
    { label: 'Community posts',          value: stats?.totalPosts ?? 0,       Icon: MessageSquare },
    { label: 'Registered users',         value: stats?.totalUsers ?? 0,       Icon: UserPlus },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 m-0">Platform overview · RambaMedTech</p>
        </div>
        <span className="text-sm text-gray-400 pt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {platformStats.map(({ label, value, Icon }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <Icon size={18} className="text-emerald-600" />
              <TrendingUp size={13} className="text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Users by Condition</h3>
          {conditionBreakdown.length === 0
            ? <p className="text-sm text-gray-400">No condition data yet.</p>
            : <div className="flex flex-col gap-3">
                {conditionBreakdown.map(c => (
                  <div key={c.condition} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-32 shrink-0 truncate">{c.condition}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${c.pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-8 text-right">{c.count}</span>
                    <span className="text-xs text-gray-400 w-8 text-right">{c.pct}%</span>
                  </div>
                ))}
              </div>
          }
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Platform Activity (All Time)</h3>
          <div className="flex flex-col divide-y divide-gray-50">
            {activityItems.map(({ label, value, Icon }) => (
              <div key={label} className="flex items-center gap-2.5 py-2.5">
                <Icon size={15} className="text-emerald-500 shrink-0" />
                <span className="flex-1 text-sm text-gray-500">{label}</span>
                <span className="text-sm font-bold text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
