import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

// Patient pages
import Tracker from './pages/Tracker';
import Education from './pages/Education';
import Wellbeing from './pages/Wellbeing';
import Community from './pages/Community';
import Notifications from './pages/Notifications';

// Caregiver pages
import CaregiverDashboard from './pages/CaregiverDashboard';
import CaregiverMessages from './pages/CaregiverMessages';
import CaregiverResources from './pages/CaregiverResources';

// Admin pages
import AdminUsers from './pages/AdminUsers';
import AdminContent from './pages/AdminContent';
import AdminReports from './pages/AdminReports';
import AdminSystem from './pages/AdminSystem';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HealthProvider>
          <ConsentProvider>
          <InviteProvider>
          <BrowserRouter>
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
          </BrowserRouter>
          </InviteProvider>
          </ConsentProvider>
        </HealthProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
