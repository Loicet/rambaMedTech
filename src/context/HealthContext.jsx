import { createContext, useContext, useState } from 'react';

const HealthContext = createContext(null);

const initialLogs = [
  { id: 1, date: '2025-07-10', type: 'Blood Sugar', value: '112', unit: 'mg/dL', note: 'After breakfast' },
  { id: 2, date: '2025-07-11', type: 'Blood Pressure', value: '128/82', unit: 'mmHg', note: 'Morning reading' },
  { id: 3, date: '2025-07-12', type: 'Blood Sugar', value: '98', unit: 'mg/dL', note: 'Fasting' },
];

export function HealthProvider({ children }) {
  const [logs, setLogs] = useState(initialLogs);
  const [wellbeingLogs, setWellbeingLogs] = useState([]);

  const addLog = (log) => setLogs(prev => [{ ...log, id: Date.now() }, ...prev]);

  const addWellbeingLog = (entry) => setWellbeingLogs(prev => [{ ...entry, id: Date.now() }, ...prev]);

  return (
    <HealthContext.Provider value={{ logs, addLog, wellbeingLogs, addWellbeingLog }}>
      {children}
    </HealthContext.Provider>
  );
}

export const useHealth = () => useContext(HealthContext);
