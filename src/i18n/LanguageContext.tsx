import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Lang } from '../types';
import translations from './translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (section: string, key: string) => string;
  tRaw: typeof translations['en'];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('wk_lang');
    if (saved && ['en', 'de', 'it', 'fr'].includes(saved)) return saved as Lang;
    const browser = navigator.language.split('-')[0];
    if (['de', 'it', 'fr'].includes(browser)) return browser as Lang;
    return 'en';
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('wk_lang', l);
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (section: string, key: string): string => {
    const sectionData = (translations[lang] as Record<string, Record<string, string>>)[section];
    if (!sectionData) return key;
    return sectionData[key] ?? (translations['en'] as Record<string, Record<string, string>>)[section]?.[key] ?? key;
  };

  const tRaw = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tRaw }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export function useLang() {
  return useLanguage().lang;
}
