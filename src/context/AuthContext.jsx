import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';
import { useLang } from './LanguageContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const { restoreLang, lang } = useLang();

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('ramba_token');
    if (!token) { setLoading(false); return; }
    api.me()
      .then(({ user }) => { setUser(user); restoreLang(user.lang); })
      .catch(() => localStorage.removeItem('ramba_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const { token, user } = await api.login({ email, password });
      localStorage.setItem('ramba_token', token);
      setUser(user);
      restoreLang(user.lang);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, role, condition) => {
    try {
      const data = await api.register({ name, email, password, role, condition, lang });
      setPendingEmail(email);
      return { success: true, otp: data.otp };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const verifyOtp = async (otp) => {
    try {
      const { token, user } = await api.verifyOtp({ email: pendingEmail, otp });
      localStorage.setItem('ramba_token', token);
      setUser(user);
      restoreLang(user.lang);
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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, pendingEmail, login, register, verifyOtp, resendOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
