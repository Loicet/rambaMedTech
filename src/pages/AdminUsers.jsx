import { useState } from 'react';
import { Users, Building2, UserCheck, Sparkles, UserPlus, Eye, Pencil, X } from 'lucide-react';

const initialUsers = [
  { name: 'Amara Kamara',     role: 'patient',   condition: 'Diabetes',       joined: 'Today',      status: 'Active' },
  { name: 'Dr. Chidi Obi',    role: 'caregiver', condition: '—',              joined: 'Today',      status: 'Active' },
  { name: 'Fatima Mensah',    role: 'patient',   condition: 'Asthma',         joined: 'Yesterday',  status: 'Active' },
  { name: 'Kwame Asante',     role: 'patient',   condition: 'Hypertension',   joined: '2 days ago', status: 'Active' },
  { name: 'Ngozi Adeyemi',    role: 'patient',   condition: 'Cardiovascular', joined: '3 days ago', status: 'Inactive' },
  { name: 'Dr. Amina Diallo', role: 'caregiver', condition: '—',              joined: '4 days ago', status: 'Active' },
  { name: 'Kofi Mensah',      role: 'patient',   condition: 'Diabetes',       joined: '5 days ago', status: 'Active' },
];

const summaryCards = [
  { label: 'Total Users',   value: '1,284', Icon: Users },
  { label: 'Patients',      value: '987',   Icon: Building2 },
  { label: 'Caregivers',    value: '143',   Icon: UserCheck },
  { label: 'New This Week', value: '47',    Icon: Sparkles },
];

const inputCls = 'px-3 py-2 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors bg-white';
const thCls = 'text-left px-3 py-2.5 bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wide font-semibold border-b border-gray-200';
const tdCls = 'px-3 py-3 border-b border-gray-50 text-sm text-gray-700 align-middle';

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.role === filter;
    return matchSearch && matchFilter;
  });

  const saveUser = (updated) => {
    setUsers(prev => prev.map(u => u.name === editingUser.name ? updated : u));
    setEditingUser(null);
  };

  return (
    <div className="flex flex-col gap-5">

      {/* View Modal */}
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
                <div className="text-xs text-gray-400 capitalize">{viewingUser.role} · {viewingUser.condition}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Joined</span><span className="font-medium text-gray-700">{viewingUser.joined}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Status</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${viewingUser.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{viewingUser.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (() => {
        const u = editingUser;
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditingUser(null)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-900">Edit User</h3>
                <button onClick={() => setEditingUser(null)} className="bg-transparent border-0 cursor-pointer text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <div className="flex flex-col gap-3">
                {[['Name', 'name'], ['Condition', 'condition']].map(([label, field]) => (
                  <div key={field} className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-500">{label}</label>
                    <input value={u[field]} onChange={e => setEditingUser({ ...u, [field]: e.target.value })} className={inputCls} />
                  </div>
                ))}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500">Status</label>
                  <select value={u.status} onChange={e => setEditingUser({ ...u, status: e.target.value })} className={inputCls}>
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg border-0 cursor-pointer">Cancel</button>
                <button onClick={() => saveUser(u)} className="px-4 py-2 text-sm bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg border-0 cursor-pointer">Save</button>
              </div>
            </div>
          </div>
        );
      })()}

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
                  <td className={tdCls}><span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium capitalize">{u.role}</span></td>
                  <td className={tdCls}>{u.condition}</td>
                  <td className={`${tdCls} text-gray-400`}>{u.joined}</td>
                  <td className={tdCls}>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>{u.status}</span>
                  </td>
                  <td className={tdCls}>
                    <button onClick={() => setViewingUser(u)} className="text-gray-400 hover:text-emerald-700 cursor-pointer bg-transparent border-0 mr-3 transition-colors"><Eye size={14} /></button>
                    <button onClick={() => setEditingUser(u)} className="text-gray-400 hover:text-emerald-700 cursor-pointer bg-transparent border-0 transition-colors"><Pencil size={14} /></button>
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
