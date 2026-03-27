import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HealthProvider } from './context/HealthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ConsentProvider } from './context/ConsentContext';
import { InviteProvider } from './context/InviteContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Privacy from './pages/Privacy';
import CareTeam from './pages/CareTeam';
import RedeemInvite from './pages/RedeemInvite';
import Tracker from './pages/Tracker';
import Education from './pages/Education';
import Wellbeing from './pages/Wellbeing';
import Community from './pages/Community';
import Notifications from './pages/Notifications';
import CaregiverDashboard from './pages/CaregiverDashboard';
import CaregiverMessages from './pages/CaregiverMessages';
import CaregiverResources from './pages/CaregiverResources';
import AdminUsers from './pages/AdminUsers';
import AdminContent from './pages/AdminContent';
import AdminReports from './pages/AdminReports';
import AdminSystem from './pages/AdminSystem';

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/redeem-invite" element={<RedeemInvite />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/care-team" element={<CareTeam />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/education" element={<Education />} />
        <Route path="/wellbeing" element={<Wellbeing />} />
        <Route path="/community" element={<Community />} />
        <Route path="/caregiver/patients" element={<CaregiverDashboard />} />
        <Route path="/caregiver/messages" element={<CaregiverMessages />} />
        <Route path="/caregiver/resources" element={<CaregiverResources />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/content" element={<AdminContent />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/system" element={<AdminSystem />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HealthProvider>
          <ConsentProvider>
            <InviteProvider>
              <AppRoutes />
            </InviteProvider>
          </ConsentProvider>
        </HealthProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
