import { useState, useEffect } from 'react';
import { ClipboardList, Heart, BookOpen, Users, UserPlus, TrendingUp } from 'lucide-react';
import { api } from '../api';

const barColors = ['bg-blue-500', 'bg-red-400', 'bg-purple-400', 'bg-orange-400', 'bg-teal-400', 'bg-gray-300'];

export default function AdminReports() {
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

  const activityItems = [
    { label: 'Health logs submitted',   value: stats?.totalHealthLogs ?? 0, icon: ClipboardList },
    { label: 'Well-being check-ins',    value: stats?.totalCheckIns ?? 0,   icon: Heart },
    { label: 'Educational articles',    value: stats?.totalContent ?? 0,    icon: BookOpen },
    { label: 'Community posts',         value: stats?.totalPosts ?? 0,      icon: Users },
    { label: 'Registered users',        value: stats?.totalUsers ?? 0,      icon: UserPlus },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1 flex items-center gap-2">
          <TrendingUp size={22} className="text-emerald-600" /> Reports & Analytics
        </h1>
        <p className="text-sm text-gray-400 m-0">Platform usage and health engagement metrics.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {activityItems.map(a => {
          const Icon = a.icon;
          return (
            <div key={a.label} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <Icon size={18} className="text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{a.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{a.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Users by Condition</h3>
          {conditionBreakdown.length === 0
            ? <p className="text-sm text-gray-400">No condition data yet.</p>
            : <div className="flex flex-col gap-3">
                {conditionBreakdown.map((c, i) => (
                  <div key={c.condition} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-32 shrink-0 truncate">{c.condition}</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${barColors[i] || 'bg-gray-400'}`} style={{ width: `${c.pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-8 text-right">{c.count}</span>
                    <span className="text-xs text-gray-400 w-8 text-right">{c.pct}%</span>
                  </div>
                ))}
              </div>
          }
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Platform Totals</h3>
          <div className="flex flex-col divide-y divide-gray-50">
            {activityItems.map(a => {
              const Icon = a.icon;
              return (
                <div key={a.label} className="flex items-center gap-2.5 py-2.5">
                  <Icon size={15} className="text-emerald-500 shrink-0" />
                  <span className="flex-1 text-sm text-gray-500">{a.label}</span>
                  <span className="text-sm font-bold text-gray-800">{a.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
