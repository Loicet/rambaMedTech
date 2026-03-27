import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

const InviteContext = createContext(null);

export function InviteProvider({ children }) {
  const { user } = useAuth();
  const [invites, setInvites] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setInvites([]); setPatients([]); setLoading(false); return; }
    if (user.role === 'patient') {
      api.getMyInvites().then(({ invites }) => setInvites(invites)).catch(() => {}).finally(() => setLoading(false));
    }
    if (user.role === 'caregiver') {
      api.getMyPatients().then(({ patients }) => setPatients(patients)).catch(() => {}).finally(() => setLoading(false));
    }
    if (user.role === 'admin') setLoading(false);
  }, [user]);

  const sendInvite = async (caregiverEmail) => {
    try {
      const data = await api.sendInvite({ caregiverEmail });
      await api.getMyInvites().then(({ invites }) => setInvites(invites));
      return { success: true, code: data.code };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const redeemInvite = async (code) => {
    try {
      const data = await api.redeemInvite({ code });
      await api.getMyPatients().then(({ patients }) => setPatients(patients));
      return { success: true, invite: data.invite };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const revokeInvite = async (code) => {
    try {
      await api.revokeInvite(code);
      setInvites(prev => prev.filter(i => i.code !== code));
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Keep same interface as before for components that use these
  const getPatientInvites = () => invites;
  const getCaregiverPatients = () => patients;

  return (
    <InviteContext.Provider value={{ invites, patients, loading, sendInvite, redeemInvite, revokeInvite, getPatientInvites, getCaregiverPatients }}>
      {children}
    </InviteContext.Provider>
  );
}

export const useInvite = () => useContext(InviteContext);
