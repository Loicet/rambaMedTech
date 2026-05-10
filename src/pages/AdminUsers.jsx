import { useState, useEffect } from 'react';
import { Users, Building2, UserCheck, Sparkles, UserPlus, Eye, X } from 'lucide-react';
import { api } from '../api';

const thCls = 'text-left px-3 py-2.5 bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wide font-semibold border-b border-gray-200';
const tdCls = 'px-3 py-3 border-b border-gray-50 text-sm text-gray-700 align-middle';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewingUser, setViewingUser] = useState(null);

  useEffect(() => {
    api.getAdminUsers().then(({ users }) => setUsers(users)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.role === filter;
    return matchSearch && matchFilter;
  });

  const totalPatients   = users.filter(u => u.role === 'patient').length;
  const totalCaregivers = users.filter(u => u.role === 'caregiver').length;

  const summaryCards = [
    { label: 'Total Users',   value: users.length,    Icon: Users },
    { label: 'Patients',      value: totalPatients,   Icon: Building2 },
    { label: 'Caregivers',    value: totalCaregivers, Icon: UserCheck },
    { label: 'New This Week', value: users.filter(u => {
        const d = new Date(u.createdAt);
        return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
      }).length, Icon: Sparkles },
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col gap-5">

      {viewingUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewingUser(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-gray-900">User Details</h3>
              <button onClick={() => setViewingUser(null)} className="bg-transparent border-0 cursor-pointer text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shrink-0">{viewingUser.name[0]}</div>
              <div>
                <div className="font-semibold text-gray-900">{viewingUser.name}</div>
                <div className="text-xs text-gray-400">{viewingUser.email}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Role</span><span className="font-medium capitalize text-gray-700">{viewingUser.role}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Joined</span><span className="font-medium text-gray-700">{new Date(viewingUser.createdAt).toLocaleDateString()}</span></div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1 flex items-center gap-2">
          <Users size={22} className="text-emerald-600" /> User Management
        </h1>
        <p className="text-sm text-gray-400 m-0">Manage patients, caregivers, and platform access.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryCards.map(({ label, value, Icon }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="flex justify-center mb-2"><Icon size={20} className="text-emerald-600" /></div>
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
              <tr>{['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => <th key={h} className={thCls}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className={tdCls}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">{u.name[0]}</div>
                      {u.name}
                    </div>
                  </td>
                  <td className={`${tdCls} text-gray-400 text-xs`}>{u.email}</td>
                  <td className={tdCls}><span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium capitalize">{u.role}</span></td>
                  <td className={`${tdCls} text-gray-400`}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className={tdCls}>
                    <button onClick={() => setViewingUser(u)} className="text-gray-400 hover:text-emerald-700 cursor-pointer bg-transparent border-0 transition-colors"><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-sm text-gray-400">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
