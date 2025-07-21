import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { loadAllTranslations } from "./utils/translationLoader";

// Import translation files
import commonEn from "./locales/en/common.json";
import settingsEn from "./locales/en/settings.json";
import commonId from "./locales/id/common.json";
import settingsId from "./locales/id/settings.json";

// Initialize i18n dengan sistem modular
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: loadAllTranslations("en"),
        common: commonEn,
        settings: settingsEn,
      },
      id: {
        translation: loadAllTranslations("id"),
        common: commonId,
        settings: settingsId,
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
