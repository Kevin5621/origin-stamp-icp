import { useTranslation } from "react-i18next";
import { TranslationModule } from "../utils/translationLoader";

/**
 * Custom hook untuk menggunakan translation modular
 * Memungkinkan penggunaan translation berdasarkan module/component
 */
export const useTranslationModule = (module: TranslationModule) => {
  const { t, i18n } = useTranslation();

  /**
   * Translate dengan namespace module
   */
  const tModule = (key: string, options?: any) => {
    // Coba translate dengan namespace module terlebih dahulu
    const moduleKey = `${module}:${key}`;
    const moduleTranslation = t(moduleKey, options);

    // Jika tidak ditemukan, coba tanpa namespace
    if (moduleTranslation === moduleKey) {
      return t(key, options);
    }

    return moduleTranslation;
  };

  /**
   * Change language
   */
  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  /**
   * Get current language
   */
  const currentLanguage = i18n.language;

  return {
    t: tModule,
    tGlobal: t, // Untuk translation global
    changeLanguage,
    currentLanguage,
    i18n,
  };
};

export default useTranslationModule;
