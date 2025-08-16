import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { loadAllTranslations } from "./utils/translationLoader";

// Import translation files untuk namespace modular
import commonEn from "./locales/en/common.json";
import authEn from "./locales/en/auth.json";
import dashboardEn from "./locales/en/dashboard.json";
import sessionEn from "./locales/en/session.json";
import certificatesEn from "./locales/en/certificates.json";
import analyticsEn from "./locales/en/analytics.json";
import landingEn from "./locales/en/landing.json";
import navigationEn from "./locales/en/navigation.json";
import howItWorksEn from "./locales/en/how-it-works.json";
import settingsEn from "./locales/en/settings.json";
import marketplaceEn from "./locales/en/marketplace.json";

import commonId from "./locales/id/common.json";
import authId from "./locales/id/auth.json";
import dashboardId from "./locales/id/dashboard.json";
import sessionId from "./locales/id/session.json";
import certificatesId from "./locales/id/certificates.json";
import analyticsId from "./locales/id/analytics.json";
import landingId from "./locales/id/landing.json";
import navigationId from "./locales/id/navigation.json";
import howItWorksId from "./locales/id/how-it-works.json";
import settingsId from "./locales/id/settings.json";
import marketplaceId from "./locales/id/marketplace.json";

// Initialize i18n dengan sistem modular
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: loadAllTranslations("en"),
        common: commonEn,
        auth: authEn,
        dashboard: dashboardEn,
        session: sessionEn,
        certificates: certificatesEn,
        analytics: analyticsEn,
        landing: landingEn,
        navigation: navigationEn,
        howitworks: howItWorksEn,
        settings: settingsEn,
        marketplace: marketplaceEn,
      },
      id: {
        translation: loadAllTranslations("id"),
        common: commonId,
        auth: authId,
        dashboard: dashboardId,
        session: sessionId,
        certificates: certificatesId,
        analytics: analyticsId,
        landing: landingId,
        navigation: navigationId,
        howitworks: howItWorksId,
        settings: settingsId,
        marketplace: marketplaceId,
      },
    },
    lng: "id", // default language
    fallbackLng: "id", // fallback language if translation is not found
    interpolation: {
      escapeValue: false, // react already escapes by default
    },
    debug: process.env.NODE_ENV === "development",
  });

export default i18n;
