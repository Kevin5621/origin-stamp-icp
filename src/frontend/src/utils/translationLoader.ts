/**
 * Translation Loader Utility
 * Mengelola translation modular berdasarkan component/page
 */

// Import semua translation modules
import commonEn from "../locales/en/common.json";
import dashboardEn from "../locales/en/dashboard.json";
import sessionEn from "../locales/en/session.json";
import certificatesEn from "../locales/en/certificates.json";
import analyticsEn from "../locales/en/analytics.json";
import landingEn from "../locales/en/landing.json";
import authEn from "../locales/en/auth.json";
import navigationEn from "../locales/en/navigation.json";
import howItWorksEn from "../locales/en/how-it-works.json";

import commonId from "../locales/id/common.json";
import dashboardId from "../locales/id/dashboard.json";
import sessionId from "../locales/id/session.json";
import certificatesId from "../locales/id/certificates.json";
import analyticsId from "../locales/id/analytics.json";
import landingId from "../locales/id/landing.json";
import authId from "../locales/id/auth.json";
import navigationId from "../locales/id/navigation.json";
import howItWorksId from "../locales/id/how-it-works.json";

// Type untuk translation modules
export type TranslationModule =
  | "common"
  | "dashboard"
  | "session"
  | "certificates"
  | "analytics"
  | "landing"
  | "auth"
  | "navigation"
  | "howitworks";

// Translation resources
const resources = {
  en: {
    common: commonEn,
    dashboard: dashboardEn,
    session: sessionEn,
    certificates: certificatesEn,
    analytics: analyticsEn,
    landing: landingEn,
    auth: authEn,
    navigation: navigationEn,
    howitworks: howItWorksEn,
  },
  id: {
    common: commonId,
    dashboard: dashboardId,
    session: sessionId,
    certificates: certificatesId,
    analytics: analyticsId,
    landing: landingId,
    auth: authId,
    navigation: navigationId,
    howitworks: howItWorksId,
  },
};

/**
 * Load translation untuk language dan module tertentu
 */
export const loadTranslation = (
  language: string,
  module: TranslationModule,
) => {
  return resources[language as keyof typeof resources]?.[module] || {};
};

/**
 * Load semua translation untuk language tertentu
 */
export const loadAllTranslations = (language: string) => {
  const langResources = resources[language as keyof typeof resources];
  if (!langResources) return {};

  // Merge semua modules
  return Object.keys(langResources).reduce(
    (acc, module) => {
      return { ...acc, ...langResources[module as TranslationModule] };
    },
    {} as Record<string, string>,
  );
};

/**
 * Get available languages
 */
export const getAvailableLanguages = () => {
  return Object.keys(resources);
};

/**
 * Get available modules
 */
export const getAvailableModules = (): TranslationModule[] => {
  return [
    "common",
    "dashboard",
    "session",
    "certificates",
    "analytics",
    "landing",
    "auth",
    "navigation",
    "howitworks",
  ];
};

/**
 * Check if translation key exists
 */
export const hasTranslation = (
  language: string,
  module: TranslationModule,
  key: string,
) => {
  const moduleTranslations = loadTranslation(language, module);
  return key in moduleTranslations;
};

/**
 * Get translation value
 */
export const getTranslation = (
  language: string,
  module: TranslationModule,
  key: string,
) => {
  const moduleTranslations = loadTranslation(language, module);
  return (moduleTranslations as Record<string, string>)[key] || key;
};

export default {
  loadTranslation,
  loadAllTranslations,
  getAvailableLanguages,
  getAvailableModules,
  hasTranslation,
  getTranslation,
};
