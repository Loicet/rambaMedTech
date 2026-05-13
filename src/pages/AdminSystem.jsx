import { useState, useEffect } from 'react';
import { Wrench, Mail, BarChart2, RefreshCw, ShieldCheck, Smartphone, Shield } from 'lucide-react';
import { api } from '../api';

const systemServices = [
  { name: 'Authentication Service', status: 'Operational', uptime: '99.9%' },
  { name: 'Health Data API',        status: 'Operational', uptime: '99.7%' },
  { name: 'Notification Service',   status: 'Operational', uptime: '99.5%' },
  { name: 'Content Delivery',       status: 'Operational', uptime: '100%' },
];

const systemActions = [
  { Icon: Mail,        label: 'Send Platform Announcement' },
  { Icon: BarChart2,   label: 'Export User Data Report' },
  { Icon: RefreshCw,   label: 'Sync Content Library' },
  { Icon: ShieldCheck, label: 'Review Security Logs' },
  { Icon: Smartphone,  label: 'Push Notification Broadcast' },
];

const actionColors = {
  LOGIN_SUCCESS:        'bg-emerald-50 text-emerald-700',
  LOGIN_FAILED:         'bg-red-50 text-red-600',
  PATIENT_DATA_ACCESSED:'bg-blue-50 text-blue-700',
};

export default function AdminSystem() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const query = filter ? `?action=${filter}` : '';
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/audit-logs${query}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('ramba_token')}` },
    })
      .then(r => r.json())
      .then(({ logs, total }) => { setLogs(logs || []); setTotal(total || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1 flex items-center gap-2">
          <Wrench size={22} className="text-emerald-600" /> System
        </h1>
        <p className="text-sm text-gray-400 m-0">Service health, security, and platform controls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Service Status</h3>
          <div className="flex flex-col divide-y divide-gray-50">
            {systemServices.map(s => (
              <div key={s.name} className="flex justify-between items-center py-3">
                <div>
                  <div className="text-sm font-medium text-gray-700">{s.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Uptime: {s.uptime}</div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            {systemActions.map(({ Icon, label }) => (
              <button key={label}
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-gray-100 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm text-gray-600 cursor-pointer transition-all text-left">
                <Icon size={16} className="shrink-0" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Shield size={16} className="text-emerald-600" /> Audit Logs ({total})
          </h3>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="text-xs border-2 border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-600">
            <option value="">All Actions</option>
            <option value="LOGIN_SUCCESS">Login Success</option>
            <option value="LOGIN_FAILED">Login Failed</option>
            <option value="PATIENT_DATA_ACCESSED">Patient Data Accessed</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No audit logs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left py-2 pr-4 font-semibold">Action</th>
                  <th className="text-left py-2 pr-4 font-semibold">User</th>
                  <th className="text-left py-2 pr-4 font-semibold">Details</th>
                  <th className="text-left py-2 pr-4 font-semibold">IP</th>
                  <th className="text-left py-2 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${actionColors[log.action] || 'bg-gray-100 text-gray-600'}`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="text-xs font-medium text-gray-700">{log.user?.name || '—'}</div>
                      <div className="text-xs text-gray-400">{log.user?.email || 'Unknown'}</div>
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-gray-500 max-w-[200px] truncate">{log.details || '—'}</td>
                    <td className="py-2.5 pr-4 text-xs text-gray-400">{log.ipAddress || '—'}</td>
                    <td className="py-2.5 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
