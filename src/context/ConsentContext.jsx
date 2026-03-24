import { createContext, useContext, useState } from 'react';

const ConsentContext = createContext(null);

const DEFAULT_CONSENT = {
  vitals:    true,  // caregiver can see vitals
  mood:      true,  // caregiver can see emotional well-being
  symptoms:  true,  // caregiver can see reported symptoms
  insights:  true,  // caregiver can see AI health insights
  reminders: true,  // caregiver gets nudge reminders about this patient
};

export function ConsentProvider({ children }) {
  // keyed by patient id so it works for multiple patients
  const [consentMap, setConsentMap] = useState({});

  const getConsent = (patientId) => consentMap[patientId] ?? DEFAULT_CONSENT;

  const updateConsent = (patientId, key, value) => {
    setConsentMap(prev => ({
      ...prev,
      [patientId]: { ...(prev[patientId] ?? DEFAULT_CONSENT), [key]: value },
    }));
  };

  return (
    <ConsentContext.Provider value={{ getConsent, updateConsent }}>
      {children}
    </ConsentContext.Provider>
  );
}

export const useConsent = () => useContext(ConsentContext);
