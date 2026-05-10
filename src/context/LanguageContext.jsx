import { createContext, useContext, useState } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('ramba_lang') || 'en');

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('ramba_lang', l);
  };

  // Called after login/OTP verify to restore the user's saved language
  const restoreLang = (userLang) => {
    if (userLang && userLang !== lang) switchLang(userLang);
  };

  const t = (key) => translations[lang]?.[key] ?? translations['en'][key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, switchLang, restoreLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
