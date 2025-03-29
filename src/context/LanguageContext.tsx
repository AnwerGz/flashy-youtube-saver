
import React, { createContext, useContext, useState, useEffect } from "react";
import { en, id, es } from "../locales";

export type LanguageKey = "en" | "id" | "es";

export interface Language {
  code: LanguageKey;
  name: string;
  nativeName: string;
}

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "es", name: "Spanish", nativeName: "Español" }
];

interface TranslationsType {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: TranslationsType = {
  en,
  id,
  es
};

interface LanguageContextType {
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
  t: (key: string) => string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageKey>(() => {
    const savedLanguage = localStorage.getItem("language") as LanguageKey;
    return savedLanguage || "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (lang: LanguageKey) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    if (!translations[language]) {
      return key;
    }
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t, 
        availableLanguages: languages 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
