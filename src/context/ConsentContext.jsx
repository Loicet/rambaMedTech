import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

const ConsentContext = createContext(null);

const DEFAULT_CONSENT = { vitals: true, mood: true, symptoms: true, insights: true, reminders: true };

export function ConsentProvider({ children }) {
  const { user } = useAuth();
  const [consentCache, setConsentCache] = useState({});

  // Load own consent on login
  useEffect(() => {
    if (!user) return;
    api.getConsent().then(({ consent }) => {
      setConsentCache(prev => ({ ...prev, [user.id]: consent }));
    }).catch(() => {});
  }, [user]);

  const getConsent = async (patientId) => {
    if (consentCache[patientId]) return consentCache[patientId];
    try {
      const { consent } = await api.getConsent(patientId);
      setConsentCache(prev => ({ ...prev, [patientId]: consent }));
      return consent;
    } catch {
      return DEFAULT_CONSENT;
    }
  };

  const updateConsent = async (key, value) => {
    try {
      const { consent } = await api.updateConsent({ [key]: value });
      setConsentCache(prev => ({ ...prev, [consent.patientId]: consent }));
      return consent;
    } catch (err) {
      throw err;
    }
  };

  // Sync version for components that call getConsent() without await
  const getConsentSync = (patientId) => consentCache[patientId] ?? DEFAULT_CONSENT;

  return (
    <ConsentContext.Provider value={{ getConsent, getConsentSync, updateConsent, consentCache }}>
      {children}
    </ConsentContext.Provider>
  );
}

export const useConsent = () => useContext(ConsentContext);
