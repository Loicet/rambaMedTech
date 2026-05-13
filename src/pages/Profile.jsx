import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Camera, Check, Pencil, X, Loader, User, Activity, Scale, Calendar, ShieldCheck } from 'lucide-react';

const GENDERS = ['Male', 'Female', 'Prefer not to say'];
const inputCls = 'px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-emerald-600 transition-colors bg-white w-full';

function InfoRow({ label, value, placeholder = 'Not set' }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-gray-400">{label}</span>
      <span className={`text-sm font-medium ${value ? 'text-gray-800' : 'text-gray-300 italic'}`}>
        {value || placeholder}
      </span>
    </div>
  );
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [status, setStatus] = useState(null); // 'saving' | 'saved' | 'error'

  // When user loads or editing starts, sync form
  useEffect(() => {
    if (user) {
      setForm({
        name:      user.name      || '',
        birthYear: user.birthYear || '',
        gender:    user.gender    || '',
        height:    user.height    || '',
        weight:    user.weight    || '',
      });
    }
  }, [user?.id, editing]);

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      const { user: updated } = await api.updateProfile(form);
      updateUser(updated);
      setStatus('saved');
      setEditing(false);
      setTimeout(() => setStatus(null), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(null), 2500);
    }
  };

  const bmi = (user?.height && user?.weight)
    ? (Number(user.weight) / ((Number(user.height) / 100) ** 2)).toFixed(1)
    : null;
  const bmiInfo = bmi
    ? bmi < 18.5 ? { label: 'Underweight', color: 'text-blue-600',    bg: 'bg-blue-50' }
    : bmi < 25   ? { label: 'Normal',       color: 'text-emerald-700', bg: 'bg-emerald-50' }
    : bmi < 30   ? { label: 'Overweight',   color: 'text-yellow-600',  bg: 'bg-yellow-50' }
    :              { label: 'Obese',         color: 'text-red-600',     bg: 'bg-red-50' }
    : null;

  const age = user?.birthYear ? new Date().getFullYear() - Number(user.birthYear) : null;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">My Profile</h1>
          <p className="text-sm text-gray-400 m-0">Your personal information and health details.</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-lg border-0 cursor-pointer transition-colors">
            <Pencil size={14} /> Edit Profile
          </button>
        ) : (
          <button onClick={() => setEditing(false)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-lg border-0 cursor-pointer transition-colors">
            <X size={14} /> Cancel
          </button>
        )}
      </div>

      {status === 'saved' && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-lg">
          <Check size={15} /> Profile saved successfully!
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg">
          Failed to save. Please try again.
        </div>
      )}

      {/* ── Avatar card ── */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 flex-wrap">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full bg-emerald-700 text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
            {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : initials}
          </div>
          {editing && (
            <>
              <button type="button" onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer border-2 border-white">
                <Camera size={13} className="text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-800 text-lg">{user?.name}</div>
          <div className="text-sm text-gray-400 capitalize mt-0.5">{user?.role}</div>
          <div className="text-xs text-gray-300 mt-0.5">{user?.email}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {user?.condition && (
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {user.condition}
              </span>
            )}
            {age && (
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Age {age}
              </span>
            )}
            {user?.gender && (
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {user.gender}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── VIEW MODE ── */}
      {!editing && (
        <>
          {/* Personal info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-gray-700 m-0 flex items-center gap-2">
              <User size={15} className="text-emerald-600" /> Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <InfoRow label="Full Name"  value={user?.name} />
              <InfoRow label="Email"      value={user?.email} />
              <InfoRow label="Birth Year" value={user?.birthYear} />
              <InfoRow label="Gender"     value={user?.gender} />
            </div>
          </div>

          {/* Health metrics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-gray-700 m-0 flex items-center gap-2">
              <Activity size={15} className="text-emerald-600" /> Health Metrics
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <InfoRow label="Height" value={user?.height ? `${user.height} cm` : null} />
              <InfoRow label="Weight" value={user?.weight ? `${user.weight} kg` : null} />
            </div>
            {bmi ? (
              <div className={`${bmiInfo.bg} rounded-xl px-4 py-3 flex items-center justify-between`}>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Body Mass Index (BMI)</div>
                  <div className={`text-2xl font-bold ${bmiInfo.color}`}>
                    {bmi} <span className="text-sm font-normal">({bmiInfo.label})</span>
                  </div>
                </div>
                <Scale size={28} className={`${bmiInfo.color} opacity-30`} />
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Add your height and weight to see your BMI.</p>
            )}
          </div>

          {/* Condition */}
          {user?.condition && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-gray-700 m-0 flex items-center gap-2">
                <ShieldCheck size={15} className="text-emerald-600" /> My Condition
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} className="text-emerald-700" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{user.condition}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Your community and content are tailored to this condition.</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── EDIT MODE ── */}
      {editing && (
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          {/* Personal info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-gray-700 m-0 flex items-center gap-2">
              <User size={15} className="text-emerald-600" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Full Name</label>
                <input value={form.name} onChange={set('name')} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Email</label>
                <input value={user?.email || ''} disabled
                  className={inputCls + ' opacity-40 cursor-not-allowed'} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <Calendar size={11} /> Birth Year
                </label>
                <input type="number" value={form.birthYear} onChange={set('birthYear')}
                  placeholder="e.g. 1990" min="1920" max={new Date().getFullYear()} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Gender</label>
                <select value={form.gender} onChange={set('gender')} className={inputCls}>
                  <option value="">Select</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Health metrics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-gray-700 m-0 flex items-center gap-2">
              <Activity size={15} className="text-emerald-600" /> Health Metrics
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <Activity size={11} /> Height (cm)
                </label>
                <input type="number" value={form.height} onChange={set('height')}
                  placeholder="e.g. 170" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <Scale size={11} /> Weight (kg)
                </label>
                <input type="number" value={form.weight} onChange={set('weight')}
                  placeholder="e.g. 70" className={inputCls} />
              </div>
            </div>
            {/* Live BMI preview while editing */}
            {form.height && form.weight && (() => {
              const b = (Number(form.weight) / ((Number(form.height) / 100) ** 2)).toFixed(1);
              const info = b < 18.5 ? { label: 'Underweight', color: 'text-blue-600' }
                : b < 25 ? { label: 'Normal', color: 'text-emerald-700' }
                : b < 30 ? { label: 'Overweight', color: 'text-yellow-600' }
                : { label: 'Obese', color: 'text-red-600' };
              return (
                <div className="bg-emerald-50 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm text-gray-600">BMI Preview</span>
                  <span className={`text-lg font-bold ${info.color}`}>
                    {b} <span className="text-xs font-normal">({info.label})</span>
                  </span>
                </div>
              );
            })()}
          </div>

          <button type="submit" disabled={status === 'saving'}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm cursor-pointer transition-colors flex items-center justify-center gap-2">
            {status === 'saving'
              ? <><Loader size={15} className="animate-spin" /> Saving...</>
              : <><Check size={15} /> Save Changes</>}
          </button>
        </form>
      )}
    </div>
  );
}
