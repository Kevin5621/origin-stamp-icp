import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'id' : 'en');
  };

  return (
    <button onClick={toggleLanguage}>
      {i18n.language === 'en' ? 'Bahasa Indonesia' : 'English'}
    </button>
  );
};

export default LanguageToggle;
