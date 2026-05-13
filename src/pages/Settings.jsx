import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Bell, Shield, Globe, LogOut, ChevronRight, Moon, Trash2 } from 'lucide-react';
import LangToggle from '../components/LangToggle';

function SettingRow({ icon: Icon, label, sub, action, danger }) {
  return (
    <button onClick={action}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors cursor-pointer bg-transparent border-0 text-left
        ${danger ? 'hover:bg-red-50' : 'hover:bg-gray-50'}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-50' : 'bg-emerald-50'}`}>
        <Icon size={17} className={danger ? 'text-red-500' : 'text-emerald-600'} />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${danger ? 'text-red-500' : 'text-gray-800'}`}>{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
      <ChevronRight size={15} className="text-gray-300 shrink-0" />
    </button>
  );
}

export default function Settings() {
  const { logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex flex-col gap-5 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 m-0 mb-1">Settings</h1>
        <p className="text-sm text-gray-400 m-0">Manage your preferences and account.</p>
      </div>

      {/* Account */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</span>
        </div>
        <SettingRow icon={Shield} label="My Profile" sub="Edit your personal information"
          action={() => navigate('/profile')} />
        <SettingRow icon={Shield} label="Data Privacy" sub="Manage what your caregiver can see"
          action={() => navigate('/privacy')} />
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preferences</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Bell size={17} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">Notifications</div>
            <div className="text-xs text-gray-400 mt-0.5">Reminders and health alerts</div>
          </div>
          <button onClick={() => setNotifications(!notifications)}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer border-0 relative ${notifications ? 'bg-emerald-600' : 'bg-gray-200'}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
        <div className="flex items-center gap-3 px-4 py-3.5 border-t border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Globe size={17} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">{t('language')}</div>
            <div className="text-xs text-gray-400 mt-0.5">English / Kinyarwanda</div>
          </div>
          <LangToggle />
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Actions</span>
        </div>
        <SettingRow icon={LogOut} label="Sign Out" sub="Log out of your account"
          action={handleLogout} danger />
      </div>

      <p className="text-center text-xs text-gray-300">RambaMedTech © 2025 · Built for African communities</p>
    </div>
  );
}
