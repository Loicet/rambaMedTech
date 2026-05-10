import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount — read user from localStorage directly, no extra API call
  useEffect(() => {
    const token = localStorage.getItem('ramba_token');
    const stored = localStorage.getItem('ramba_user');
    if (!token || !stored) { setLoading(false); return; }
    try {
      setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem('ramba_token');
      localStorage.removeItem('ramba_user');
    } finally {
      setLoading(false);
    }
    // Restore pending OTP email if user refreshed mid-registration
    const savedEmail = localStorage.getItem('ramba_pending_email');
    if (savedEmail) setPendingEmail(savedEmail);
  }, []);

  const login = async (email, password) => {
    try {
      const { token, user } = await api.login({ email, password });
      localStorage.setItem('ramba_token', token);
      localStorage.setItem('ramba_user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, role, condition) => {
    try {
      await api.register({ name, email, password, role, condition });
      setPendingEmail(email);
      localStorage.setItem('ramba_pending_email', email);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const verifyOtp = async (otp) => {
    try {
      const { token, user } = await api.verifyOtp({ email: pendingEmail, otp });
      localStorage.setItem('ramba_token', token);
      localStorage.setItem('ramba_user', JSON.stringify(user));
      localStorage.removeItem('ramba_pending_email');
      setUser(user);
      setPendingEmail(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const resendOtp = async () => {
    try {
      const data = await api.resendOtp({ email: pendingEmail });
      return data.otp;
    } catch {
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('ramba_token');
    localStorage.removeItem('ramba_user');
    localStorage.removeItem('ramba_pending_email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, pendingEmail, login, register, verifyOtp, resendOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
