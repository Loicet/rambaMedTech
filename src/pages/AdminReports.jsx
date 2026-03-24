import { ClipboardList, Heart, BookOpen, Users, Bell, UserPlus, TrendingUp } from 'lucide-react';

const weeklyActivity = [
  { label: 'Health logs submitted', value: '1,526', icon: ClipboardList, change: '+12%' },
  { label: 'Well-being check-ins',  value: '892',   icon: Heart,          change: '+8%' },
  { label: 'Articles read',         value: '2,341', icon: BookOpen,       change: '+21%' },
  { label: 'Community interactions',value: '487',   icon: Users,          change: '+5%' },
  { label: 'Reminders triggered',   value: '3,102', icon: Bell,           change: '+3%' },
  { label: 'New registrations',     value: '47',    icon: UserPlus,       change: '+18%' },
];

const conditionBreakdown = [
  { condition: 'Diabetes',       count: 412, pct: 42 },
  { condition: 'Hypertension',   count: 298, pct: 30 },
  { condition: 'Asthma',         count: 147, pct: 15 },
  { condition: 'Cardiovascular', count: 89,  pct: 9 },
  { condition: 'Other',          count: 41,  pct: 4 },
];

const barColors = ['bg-blue-500', 'bg-red-400', 'bg-purple-400', 'bg-orange-400', 'bg-gray-300'];

export default function AdminReports() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1 flex items-center gap-2">
          <TrendingUp size={22} className="text-emerald-600" /> Reports & Analytics
        </h1>
        <p className="text-sm text-gray-400 m-0">Platform usage and health engagement metrics.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {weeklyActivity.map(a => {
          const Icon = a.icon;
          return (
            <div key={a.label} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <Icon size={18} className="text-emerald-600" />
                <span className="text-green-500 text-xs font-bold">{a.change}</span>
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
          <div className="flex flex-col gap-3">
            {conditionBreakdown.map((c, i) => (
              <div key={c.condition} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-28 shrink-0">{c.condition}</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColors[i]}`} style={{ width: `${c.pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-8 text-right">{c.count}</span>
                <span className="text-xs text-gray-400 w-8 text-right">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Engagement This Week</h3>
          <div className="flex flex-col divide-y divide-gray-50">
            {weeklyActivity.map(a => {
              const Icon = a.icon;
              return (
                <div key={a.label} className="flex items-center gap-2.5 py-2.5">
                  <Icon size={15} className="text-emerald-500 shrink-0" />
                  <span className="flex-1 text-sm text-gray-500">{a.label}</span>
                  <span className="text-sm font-bold text-gray-800">{a.value}</span>
                  <span className="text-xs text-green-500 font-semibold w-10 text-right">{a.change}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
