import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { api } from '../api';
import LangToggle from './LangToggle';
import {
  LayoutDashboard, BarChart2, BookOpen, Heart, Users, Bell,
  Stethoscope, ClipboardList, FileText,
  TrendingUp, Wrench, ChevronDown, ChevronUp, LogOut, ShieldCheck, UserPlus, KeyRound, Settings, UserCircle
} from 'lucide-react';
import RambaLogo from './RambaLogo';

const patientNav = [
  { to: '/dashboard',     icon: LayoutDashboard, key: 'navDashboard' },
  { to: '/tracker',       icon: BarChart2,        key: 'navTracker' },
  { to: '/education',     icon: BookOpen,         key: 'navEducation' },
  { to: '/wellbeing',     icon: Heart,            key: 'navWellbeing' },
  { to: '/community',     icon: Users,            key: 'navCommunityApp' },
  { to: '/notifications', icon: Bell,             key: 'navReminders' },
];

const caregiverNav = [
  { to: '/dashboard',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/caregiver/patients',  icon: Stethoscope,     label: 'My Patients' },
  { to: '/caregiver/resources', icon: ClipboardList,   label: 'Resources' },
  { to: '/notifications',       icon: Bell,            label: 'Reminders' },
];

const adminNav = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/users',   icon: Users,           label: 'Users' },
  { to: '/admin/content', icon: FileText,        label: 'Content' },
  { to: '/admin/reports', icon: TrendingUp,      label: 'Reports' },
  { to: '/admin/system',  icon: Wrench,          label: 'System' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropRef = useRef(null);
  const mobileDropRef = useRef(null);

  const handleLogout = () => { logout(); navigate('/login'); };

  // Fetch unread notification count for patients
  useEffect(() => {
    if (user?.role !== 'patient') return;
    api.getNotifications()
      .then(({ notifications }) => setUnreadCount(notifications.filter(n => !n.isRead).length))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
      if (mobileDropRef.current && !mobileDropRef.current.contains(e.target)) setMobileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'caregiver' ? caregiverNav : patientNav;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const getLabel = (item) => {
    if (user?.role === 'patient') return t(item.key) || item.label;
    return item.label;
  };

  return (
    <>
      {/* ── DESKTOP: slim top bar ── */}
      <header className="hidden md:flex items-center justify-between bg-white border-b border-gray-200 px-6 h-14 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <RambaLogo size={28} leafColor="#047857" crossColor="#ffffff" />
          <span className="text-emerald-800 font-bold text-lg tracking-wide">RambaMedTech</span>
        </div>

        <div className="relative" ref={dropRef}>
          <button onClick={() => setOpen(o => !o)}
            className="flex items-center gap-2.5 cursor-pointer bg-transparent border-0">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-sm font-bold">
              {initials}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-sm font-semibold text-gray-800 leading-tight">{user?.name}</div>
              <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
            </div>
            {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 mb-1">
                <div className="text-sm font-semibold text-gray-800">{user?.name}</div>
                <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
              </div>
              {user?.role !== 'admin' && (
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{t('language')}</span>
                  <LangToggle />
                </div>
              )}
              {user?.role === 'patient' && (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer no-underline flex items-center gap-2 transition-colors">
                    <UserCircle size={14} className="text-emerald-600" /> My Profile
                  </Link>
                  <Link to="/settings" onClick={() => setOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer no-underline flex items-center gap-2 transition-colors">
                    <Settings size={14} className="text-emerald-600" /> Settings
                  </Link>
                  <Link to="/care-team" onClick={() => setOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer no-underline flex items-center gap-2 transition-colors">
                    <UserPlus size={14} className="text-emerald-600" /> My Care Team
                  </Link>
                  <Link to="/privacy" onClick={() => setOpen(false)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer no-underline flex items-center gap-2 transition-colors">
                    <ShieldCheck size={14} className="text-emerald-600" /> Data Privacy
                  </Link>
                </>
              )}
              {user?.role === 'caregiver' && (
                <Link to="/redeem-invite" onClick={() => setOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer no-underline flex items-center gap-2 transition-colors">
                  <KeyRound size={14} className="text-emerald-600" /> Enter Invite Code
                </Link>
              )}
              <button onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 cursor-pointer bg-transparent border-0 transition-colors flex items-center gap-2 mt-1">
                <LogOut size={14} /> {t('logout')}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── DESKTOP: left sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 fixed top-14 left-0 bottom-0 z-40 py-5 px-3">
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isBell = item.icon === Bell;
            return (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium no-underline transition-all
                  ${isActive ? 'bg-emerald-700 text-white' : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                <span className="relative">
                  <Icon size={17} />
                  {isBell && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </span>
                {getLabel(item)}
              </NavLink>
            );
          })}
        </nav>
        <div className="text-[10px] text-gray-300 text-center px-2">RambaMedTech © 2025</div>
      </aside>

      {/* ── MOBILE: top bar + dropdown (same ref wrapper) ── */}
      <div className="relative md:hidden" ref={mobileDropRef}>
        <nav className="flex items-center justify-between bg-emerald-800 px-4 h-14 sticky top-0 z-50 shadow-md">
          <div className="flex items-center gap-2">
            <RambaLogo size={24} leafColor="#ffffff" crossColor="#047857" />
            <span className="text-white font-bold text-base">RambaMedTech</span>
          </div>
          <div className="flex items-center gap-2">
            {user?.role !== 'admin' && <LangToggle light />}
            <button onClick={() => setMobileOpen(o => !o)}
              className="flex items-center gap-1.5 bg-transparent border-0 cursor-pointer p-0">
              <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              {mobileOpen ? <ChevronUp size={13} className="text-white/70" /> : <ChevronDown size={13} className="text-white/70" />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown — inside same ref so outside-click works correctly */}
        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 py-2">
            <div className="px-4 py-2 border-b border-gray-100 mb-1">
              <div className="text-sm font-semibold text-gray-800">{user?.name}</div>
              <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
            </div>
            {user?.role !== 'admin' && (
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">{t('language')}</span>
                <LangToggle />
              </div>
            )}
            {user?.role === 'patient' && (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 no-underline flex items-center gap-2 transition-colors">
                  <UserCircle size={15} className="text-emerald-600" /> My Profile
                </Link>
                <Link to="/settings" onClick={() => setMobileOpen(false)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 no-underline flex items-center gap-2 transition-colors">
                  <Settings size={15} className="text-emerald-600" /> Settings
                </Link>
                <Link to="/care-team" onClick={() => setMobileOpen(false)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 no-underline flex items-center gap-2 transition-colors">
                  <UserPlus size={15} className="text-emerald-600" /> My Care Team
                </Link>
                <Link to="/privacy" onClick={() => setMobileOpen(false)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 no-underline flex items-center gap-2 transition-colors">
                  <ShieldCheck size={15} className="text-emerald-600" /> Data Privacy
                </Link>
              </>
            )}
            {user?.role === 'caregiver' && (
              <Link to="/redeem-invite" onClick={() => setMobileOpen(false)}
                className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 no-underline flex items-center gap-2 transition-colors">
                <KeyRound size={15} className="text-emerald-600" /> Enter Invite Code
              </Link>
            )}
            <button onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 cursor-pointer bg-transparent border-0 flex items-center gap-2">
              <LogOut size={15} /> {t('logout')}
            </button>
          </div>
        )}
      </div>

      {/* ── MOBILE: bottom tab bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex shadow-lg">
        {navItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isBell = item.icon === Bell;
          return (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 py-2.5 flex-1 no-underline transition-colors ${
                  isActive ? 'text-emerald-700' : 'text-gray-400'
                }`}>
              <span className="relative">
                <Icon size={20} />
                {isBell && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-medium">{getLabel(item)}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
