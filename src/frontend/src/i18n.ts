import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enTranslation from "./locales/en/translation.json";
import idTranslation from "./locales/id/translation.json";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      id: {
        translation: idTranslation,
      },
    },
    lng: "en", // default language
    fallbackLng: "en", // fallback language if translation is not found
    interpolation: {
      escapeValue: false, // react already escapes by default
    },
  });

export default i18n;
