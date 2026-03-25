import { Users, Activity, Stethoscope, MessageSquare, ClipboardList, Heart, BookOpen, Bell, UserPlus, TrendingUp } from 'lucide-react';

const platformStats = [
  { label: 'Total Users',       value: '1,284', Icon: Users,         change: '+12 this week' },
  { label: 'Active Patients',   value: '987',   Icon: Activity,      change: '+8 this week' },
  { label: 'Caregivers',        value: '143',   Icon: Stethoscope,   change: '+3 this week' },
  { label: 'Community Posts',   value: '342',   Icon: MessageSquare, change: '+24 this week' },
  { label: 'Health Logs Today', value: '218',   Icon: ClipboardList, change: '+18% vs yesterday' },
  { label: 'Check-ins Today',   value: '176',   Icon: Heart,         change: '+5% vs yesterday' },
];

const conditionBreakdown = [
  { condition: 'Diabetes',       count: 412, pct: 42 },
  { condition: 'Hypertension',   count: 298, pct: 30 },
  { condition: 'Asthma',         count: 147, pct: 15 },
  { condition: 'Cardiovascular', count: 89,  pct: 9 },
  { condition: 'Other',          count: 41,  pct: 4 },
];

const weeklyActivity = [
  { label: 'Health logs submitted',  value: '1,526', Icon: ClipboardList },
  { label: 'Well-being check-ins',   value: '892',   Icon: Heart },
  { label: 'Articles read',          value: '2,341', Icon: BookOpen },
  { label: 'Community interactions', value: '487',   Icon: MessageSquare },
  { label: 'Reminders triggered',    value: '3,102', Icon: Bell },
  { label: 'New registrations',      value: '47',    Icon: UserPlus },
];

export default function AdminDashboard() {
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
        {platformStats.map(({ label, value, Icon, change }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <Icon size={18} className="text-emerald-600" />
              <span className="text-green-500 text-xs font-bold flex items-center gap-0.5"><TrendingUp size={11} /> up</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            <div className="text-[11px] text-green-500 font-medium mt-1">{change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Users by Condition</h3>
          <div className="flex flex-col gap-3">
            {conditionBreakdown.map(c => (
              <div key={c.condition} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-28 shrink-0">{c.condition}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-gray-700 w-8 text-right">{c.count}</span>
                <span className="text-xs text-gray-400 w-8 text-right">{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Platform Activity (This Week)</h3>
          <div className="flex flex-col divide-y divide-gray-50">
            {weeklyActivity.map(({ label, value, Icon }) => (
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
