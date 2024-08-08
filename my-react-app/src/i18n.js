// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json'
import he from './he.json'
i18n
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass the i18n instance to react-i18next.
  .init({
    resources: {
      en: { translation: en },
      he: { translation: he }
    },
    fallbackLng: 'en', // use en if detected lng is not available
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
