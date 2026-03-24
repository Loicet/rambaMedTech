import { useState } from 'react';
import { articles } from '../data/mockData';

const platformStats = [
  { label: 'Total Users', value: '1,284', icon: '', change: '+12 this week' },
  { label: 'Active Patients', value: '987', icon: '', change: '+8 this week' },
  { label: 'Caregivers', value: '143', icon: '', change: '+3 this week' },
  { label: 'Community Posts', value: '342', icon: '', change: '+24 this week' },
  { label: 'Health Logs Today', value: '218', icon: '', change: '+18% vs yesterday' },
  { label: 'Check-ins Today', value: '176', icon: '', change: '+5% vs yesterday' },
];

const conditionBreakdown = [
  { condition: 'Diabetes', count: 412, pct: 42 },
  { condition: 'Hypertension', count: 298, pct: 30 },
  { condition: 'Asthma', count: 147, pct: 15 },
  { condition: 'Cardiovascular', count: 89, pct: 9 },
  { condition: 'Other', count: 41, pct: 4 },
];

const recentUsers = [
  { name: 'Amara Kamara', role: 'patient', condition: 'Diabetes', joined: 'Today', status: 'Active' },
  { name: 'Dr. Chidi Obi', role: 'caregiver', condition: '—', joined: 'Today', status: 'Active' },
  { name: 'Fatima Mensah', role: 'patient', condition: 'Asthma', joined: 'Yesterday', status: 'Active' },
  { name: 'Kwame Asante', role: 'patient', condition: 'Hypertension', joined: '2 days ago', status: 'Active' },
  { name: 'Ngozi Adeyemi', role: 'patient', condition: 'Cardiovascular', joined: '3 days ago', status: 'Inactive' },
];

const systemServices = [
  { name: 'Authentication Service', status: 'Operational', uptime: '99.9%' },
  { name: 'Health Data API', status: 'Operational', uptime: '99.7%' },
  { name: 'Notification Service', status: 'Operational', uptime: '99.5%' },
  { name: 'Content Delivery', status: 'Operational', uptime: '100%' },
];

const weeklyActivity = [
  { label: 'Health logs submitted', value: '1,526', icon: '' },
  { label: 'Well-being check-ins', value: '892', icon: '' },
  { label: 'Articles read', value: '2,341', icon: '' },
  { label: 'Community interactions', value: '487', icon: '' },
  { label: 'Reminders triggered', value: '3,102', icon: '' },
  { label: 'New registrations', value: '47', icon: '' },
];

const systemActions = [
  { icon: '', label: 'Send Platform Announcement' },
  { icon: '', label: 'Export User Data Report' },
  { icon: '', label: 'Sync Content Library' },
  { icon: '', label: 'Review Security Logs' },
  { icon: '', label: 'Push Notification Broadcast' },
];

const tabs = [
  { key: 'overview', label: ' Overview' },
  { key: 'users', label: ' Users' },
  { key: 'content', label: ' Content' },
  { key: 'system', label: ' System' },
];

const inputCls = "px-3 py-2 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors bg-white";
const thCls = "text-left px-3 py-2.5 bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wide font-semibold border-b border-gray-200";
const tdCls = "px-3 py-3 border-b border-gray-50 text-sm text-gray-700 align-middle";

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">Admin Dashboard </h1>
          <p className="text-sm text-gray-400 m-0">Platform overview · RambaMedTech</p>
        </div>
        <span className="text-sm text-gray-400 pt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b-2 border-gray-200 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-0.5 transition-colors whitespace-nowrap cursor-pointer bg-transparent border-x-0 border-t-0
              ${tab === t.key ? 'border-b-emerald-700 text-emerald-700' : 'border-b-transparent text-gray-400 hover:text-emerald-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {platformStats.map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-green-500 text-xs font-bold">↑</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                <div className="text-[11px] text-green-500 font-medium mt-1">{s.change}</div>
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
                {weeklyActivity.map(a => (
                  <div key={a.label} className="flex items-center gap-2.5 py-2.5">
                    <span className="text-base">{a.icon}</span>
                    <span className="flex-1 text-sm text-gray-500">{a.label}</span>
                    <span className="text-sm font-bold text-gray-800">{a.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <h3 className="text-sm font-semibold text-gray-700 m-0">Recent Users</h3>
            <div className="flex gap-2 items-center">
              <input className={inputCls} placeholder="Search users..." />
              <button className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors border-0 whitespace-nowrap">
                + Invite User
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {['Name', 'Role', 'Condition', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className={thCls}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(u => (
                  <tr key={u.name} className="hover:bg-gray-50 transition-colors">
                    <td className={tdCls}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name[0]}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td className={tdCls}>
                      <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium capitalize">{u.role}</span>
                    </td>
                    <td className={tdCls}>{u.condition}</td>
                    <td className={`${tdCls} text-gray-400`}>{u.joined}</td>
                    <td className={tdCls}>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className={tdCls}>
                      <button className="text-emerald-700 text-xs font-medium hover:underline cursor-pointer bg-transparent border-0 mr-2">View</button>
                      <button className="text-emerald-700 text-xs font-medium hover:underline cursor-pointer bg-transparent border-0">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content */}
      {tab === 'content' && (
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <h3 className="text-sm font-semibold text-gray-700 m-0">Published Articles ({articles.length})</h3>
            <button className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors border-0">
              + New Article
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>{['Title', 'Condition', 'Read Time', 'Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className={tdCls}>{a.title}</td>
                    <td className={tdCls}>
                      <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">{a.condition}</span>
                    </td>
                    <td className={`${tdCls} text-gray-400`}>{a.readTime}</td>
                    <td className={tdCls}>
                      <button className="text-emerald-700 text-xs font-medium hover:underline cursor-pointer bg-transparent border-0 mr-2">Edit</button>
                      <button className="text-red-500 text-xs font-medium hover:underline cursor-pointer bg-transparent border-0">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System */}
      {tab === 'system' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Service Status</h3>
            <div className="flex flex-col divide-y divide-gray-50">
              {systemServices.map(s => (
                <div key={s.name} className="flex justify-between items-center py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700">{s.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Uptime: {s.uptime}</div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">{s.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              {systemActions.map(a => (
                <button key={a.label}
                  className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-gray-100 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm text-gray-600 cursor-pointer transition-all text-left font-inherit">
                  <span>{a.icon}</span> {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
