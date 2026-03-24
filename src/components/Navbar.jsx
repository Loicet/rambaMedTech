import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import LangToggle from './LangToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/dashboard', icon: '', key: 'navDashboard' },
    { to: '/tracker', icon: '', key: 'navTracker' },
    { to: '/education', icon: '', key: 'navEducation' },
    { to: '/wellbeing', icon: '', key: 'navWellbeing' },
    { to: '/community', icon: '', key: 'navCommunityApp' },
    { to: '/notifications', icon: '', key: 'navReminders' },
  ];

  return (
    <>
      {/* Desktop top navbar */}
      <nav className="hidden md:flex items-center bg-emerald-800 px-6 h-15 gap-5 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xl"></span>
          <span className="text-white font-bold text-lg tracking-wide">RambaMedTech</span>
        </div>
        <ul className="flex list-none m-0 p-0 gap-1 flex-1">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink to={item.to}
                className={({ isActive }) =>
                  `text-sm px-3 py-1.5 rounded-md transition-all no-underline whitespace-nowrap block ${
                    isActive ? 'bg-white/20 text-white' : 'text-white/75 hover:bg-white/15 hover:text-white'
                  }`}>
                {item.icon} {t(item.key)}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3 shrink-0">
          <LangToggle light />
          <span className="text-white text-sm font-medium">{user?.name}</span>
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
          <button onClick={handleLogout}
            className="bg-white/15 text-white border border-white/30 px-3 py-1 rounded-md text-xs cursor-pointer hover:bg-white/25 transition-colors">
            {t('logout')}
          </button>
        </div>
      </nav>

      {/* Mobile top bar */}
      <nav className="flex md:hidden items-center justify-between bg-emerald-800 px-4 h-14 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xl"></span>
          <span className="text-white font-bold text-base">RambaMedTech</span>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle light />
          <span className="text-white/80 text-xs">{user?.name?.split(' ')[0]}</span>
          <button onClick={handleLogout}
            className="bg-white/15 text-white border border-white/30 px-2.5 py-1 rounded-md text-xs cursor-pointer">
            {t('logout')}
          </button>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex shadow-lg">
        {navItems.slice(0, 5).map(item => (
          <NavLink key={item.to} to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 py-2.5 flex-1 no-underline transition-colors ${
                isActive ? 'text-emerald-700' : 'text-gray-400'
              }`}>
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-[10px] font-medium">{t(item.key)}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
