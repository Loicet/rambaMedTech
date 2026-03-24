import { useState } from 'react';
import { Users, Building2, UserCheck, Sparkles, UserPlus } from 'lucide-react';

const recentUsers = [
  { name: 'Amara Kamara',    role: 'patient',   condition: 'Diabetes',       joined: 'Today',      status: 'Active' },
  { name: 'Dr. Chidi Obi',   role: 'caregiver', condition: '—',              joined: 'Today',      status: 'Active' },
  { name: 'Fatima Mensah',   role: 'patient',   condition: 'Asthma',         joined: 'Yesterday',  status: 'Active' },
  { name: 'Kwame Asante',    role: 'patient',   condition: 'Hypertension',   joined: '2 days ago', status: 'Active' },
  { name: 'Ngozi Adeyemi',   role: 'patient',   condition: 'Cardiovascular', joined: '3 days ago', status: 'Inactive' },
  { name: 'Dr. Amina Diallo',role: 'caregiver', condition: '—',              joined: '4 days ago', status: 'Active' },
  { name: 'Kofi Mensah',     role: 'patient',   condition: 'Diabetes',       joined: '5 days ago', status: 'Active' },
];

const summaryCards = [
  { label: 'Total Users',    value: '1,284', Icon: Users },
  { label: 'Patients',       value: '987',   Icon: Building2 },
  { label: 'Caregivers',     value: '143',   Icon: UserCheck },
  { label: 'New This Week',  value: '47',    Icon: Sparkles },
];

const thCls = 'text-left px-3 py-2.5 bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wide font-semibold border-b border-gray-200';
const tdCls = 'px-3 py-3 border-b border-gray-50 text-sm text-gray-700 align-middle';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = recentUsers.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.role === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1 flex items-center gap-2">
          <Users size={22} className="text-emerald-600" /> User Management
        </h1>
        <p className="text-sm text-gray-400 m-0">Manage patients, caregivers, and platform access.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryCards.map(({ label, value, Icon }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="flex justify-center mb-2">
              <Icon size={20} className="text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <div className="flex gap-1">
            {['all', 'patient', 'caregiver'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border-0 transition-colors capitalize
                  ${filter === f ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {f === 'all' ? 'All' : f + 's'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors w-44" />
            <button className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors border-0 whitespace-nowrap flex items-center gap-1">
              <UserPlus size={13} /> Invite User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[540px]">
            <thead>
              <tr>{['Name', 'Role', 'Condition', 'Joined', 'Status', 'Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.name} className="hover:bg-gray-50 transition-colors">
                  <td className={tdCls}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">{u.name[0]}</div>
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
    </div>
  );
}