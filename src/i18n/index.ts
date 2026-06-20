import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import es from "./locales/es.json";

export const defaultNS = "translation";

export const resources = {
  en: { translation: en },
  es: { translation: es },
} as const;

i18n
  .use(LanguageDetector) // detects language from localStorage/navigator and persists it
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    defaultNS,
    fallbackLng: "en", // used when no stored/navigator language matches
    load: "languageOnly", // "es-AR" -> "es" so region variants match base resources

    detection: {
      order: ["localStorage", "navigator"], // explicit user choice wins over browser language
      caches: ["localStorage"], // persist changeLanguage() automatically
    },

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
