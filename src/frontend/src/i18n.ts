import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { loadAllTranslations } from "./utils/translationLoader";

// Initialize i18n dengan sistem modular
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: loadAllTranslations("en"),
      },
      id: {
        translation: loadAllTranslations("id"),
      },
    },
    lng: "en", // default language
    fallbackLng: "en", // fallback language if translation is not found
    interpolation: {
      escapeValue: false, // react already escapes by default
    },
    debug: process.env.NODE_ENV === "development",
  });

export default i18n;
