import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { defaultTranslations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  translations: Record<string, { bn: string; en: string }>;
  updateTranslation: (key: string, bn: string, en: string) => void;
  resetTranslations: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('se_language');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  const [translations, setTranslations] = useState<Record<string, { bn: string; en: string }>>(() => {
    const saved = localStorage.getItem('se_custom_translations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultTranslations, ...parsed };
      } catch (e) {
        console.error('Failed to parse translations', e);
      }
    }
    return defaultTranslations;
  });

  useEffect(() => {
    localStorage.setItem('se_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const t = (key: string, fallback?: string): string => {
    const item = translations[key];
    if (item && item[language]) {
      return item[language];
    }
    if (item) {
      return item.bn || item.en || fallback || key;
    }
    return fallback || key;
  };

  const updateTranslation = (key: string, bn: string, en: string) => {
    setTranslations(prev => {
      const updated = { ...prev, [key]: { bn, en } };
      localStorage.setItem('se_custom_translations', JSON.stringify(updated));
      return updated;
    });
  };

  const resetTranslations = () => {
    setTranslations(defaultTranslations);
    localStorage.removeItem('se_custom_translations');
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        translations,
        updateTranslation,
        resetTranslations
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
