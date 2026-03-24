import { Wrench, Mail, BarChart2, RefreshCw, ShieldCheck, Smartphone } from 'lucide-react';

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

export default function AdminSystem() {
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
    </div>
  );
}
