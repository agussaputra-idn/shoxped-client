import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './locales/en/translation.json';
import translationID from './locales/id/translation.json';

// Konfigurasi i18next
i18n
  // Mendeteksi bahasa browser pengguna
  .use(LanguageDetector)
  // Mengirim i18n ke react-i18next
  .use(initReactI18next)
  .init({
    // Sumber daya (kamus) kita
    resources: {
      en: {
        translation: translationEN
      },
      id: {
        translation: translationID
      }
    },
    // Bahasa default jika bahasa browser tidak terdeteksi
    fallbackLng: 'id',
    debug: true, // Nyalakan debug (hapus ini nanti saat sudah production)
    interpolation: {
      escapeValue: false // React sudah aman dari XSS
    }
  });

export default i18n;