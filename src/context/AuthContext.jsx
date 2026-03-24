import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = [
  { id: 1, name: 'Amara Kamara', email: 'amara@example.com', password: 'password123', role: 'patient', condition: 'Diabetes' },
  { id: 2, name: 'Dr. Chidi Obi', email: 'chidi@example.com', password: 'password123', role: 'caregiver', condition: null },
  { id: 3, name: 'Admin User', email: 'admin@ramba.com', password: 'admin123', role: 'admin', condition: null },
];

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null); // { userData, otp }

  const login = (email, password) => {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (found) { setUser(found); return { success: true }; }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (name, email, password, role, condition) => {
    const exists = MOCK_USERS.find(u => u.email === email);
    if (exists) return { success: false, error: 'Email already registered' };
    const otp = generateOtp();
    setPendingUser({ userData: { id: Date.now(), name, email, password, role, condition }, otp });
    return { success: true, otp };
  };

  const verifyOtp = (inputOtp) => {
    if (!pendingUser) return { success: false, error: 'Session expired. Please register again.' };
    if (inputOtp !== pendingUser.otp) return { success: false, error: 'Incorrect code. Please try again.' };
    MOCK_USERS.push(pendingUser.userData);
    setUser(pendingUser.userData);
    setPendingUser(null);
    return { success: true };
  };

  const resendOtp = () => {
    if (!pendingUser) return null;
    const otp = generateOtp();
    setPendingUser(prev => ({ ...prev, otp }));
    return otp;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, pendingUser, login, register, verifyOtp, resendOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
