import { useAuth } from '../context/AuthContext';
import PatientDashboard from './PatientDashboard';
import CaregiverOverview from './CaregiverOverview';
import AdminDashboard from './AdminDashboard';
import WellnessDashboard from './WellnessDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'caregiver') return <CaregiverOverview />;
  if (user?.intent === 'habits' || user?.intent === 'preventive') return <WellnessDashboard />;
  return <PatientDashboard />;
}
