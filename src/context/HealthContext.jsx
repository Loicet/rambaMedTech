import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

const HealthContext = createContext(null);

export function HealthProvider({ children }) {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [wellbeingLogs, setWellbeingLogs] = useState([]);

  useEffect(() => {
    if (!user) { setLogs([]); setWellbeingLogs([]); return; }
    api.getLogs().then(({ logs }) => setLogs(logs)).catch(() => {});
    api.getEmotions().then(({ emotions }) => setWellbeingLogs(emotions)).catch(() => {});
  }, [user]);

  const addLog = async (log) => {
    try {
      const { log: created } = await api.addLog(log);
      setLogs(prev => [created, ...prev]);
    } catch (err) {
      throw err;
    }
  };

  const addWellbeingLog = async (entry) => {
    try {
      const { emotion } = await api.addEmotion(entry);
      setWellbeingLogs(prev => [emotion, ...prev]);
    } catch (err) {
      throw err;
    }
  };

  return (
    <HealthContext.Provider value={{ logs, addLog, wellbeingLogs, addWellbeingLog }}>
      {children}
    </HealthContext.Provider>
  );
}

export const useHealth = () => useContext(HealthContext);
