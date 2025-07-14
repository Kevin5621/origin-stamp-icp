import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface LanguageToggleProps {
  className?: string;
}

/**
 * Language Toggle Component with semantic design
 */
export function LanguageToggle({ className = "" }: LanguageToggleProps) {
  const { i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === "en");

  useEffect(() => {
    setIsEnglish(i18n.language === "en");
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = isEnglish ? "id" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`language-toggle ${className}`.trim()}
      aria-label={`Switch to ${isEnglish ? "Indonesian" : "English"} language`}
      title={`Switch to ${isEnglish ? "Indonesian" : "English"} language`}
    >
      {isEnglish ? (
        // Indonesian Flag icon for English
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 900 600"
          width="24"
          height="24"
          className="rounded-full"
        >
          <rect width="900" height="300" fill="#ff0000" />
          <rect y="300" width="900" height="300" fill="#fff" />
        </svg>
      ) : (
        // UK Flag icon for Indonesian
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 60 30"
          width="24"
          height="24"
          className="rounded-full"
        >
          <clipPath id="a">
            <path d="M0 0v30h60V0z" />
          </clipPath>
          <clipPath id="b">
            <path d="M30 15h30v15zv15h-30zH0z" />
          </clipPath>
          <g clip-path="url(#a)">
            <path d="M0 0v30h60V0z" fill="#012169" />
            <path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6" />
            <path
              d="M0 0l60 30m0-30L0 30"
              clip-path="url(#b)"
              stroke="#C8102E"
              stroke-width="4"
            />
            <path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10" />
            <path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6" />
          </g>
        </svg>
      )}
    </button>
  );
}

export default LanguageToggle;
