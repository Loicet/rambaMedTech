import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

export default function Layout() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* mobile: pt-14 clears the sticky top bar, pb-24 clears the bottom tab bar */}
      {/* desktop: ml-56 clears the sidebar, pt-14 clears the top bar */}
      <main className="pt-14 pb-24 md:ml-56 md:pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
