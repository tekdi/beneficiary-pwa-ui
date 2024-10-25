// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import en from '../../locales/en.json';
import hn from '../../locales/hn.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    hn: {
      translation: hn,
    },
  },
  lng: 'en', // default language
  fallbackLng: 'en', // fallback language
  interpolation: {
    escapeValue: false, // React already escapes content
  },
});

export default i18n;
