import { useState, useEffect } from "react";

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const detectTheme = () => {
      const dataTheme = document.documentElement.getAttribute("data-theme");
      const savedTheme = localStorage.getItem("originstamp-theme");

      const theme = dataTheme || savedTheme || "light";
      setCurrentTheme(theme as "light" | "dark");
    };

    // Deteksi tema awal
    detectTheme();

    // Observer untuk perubahan data-theme
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          detectTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Listen untuk perubahan localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "originstamp-theme") {
        detectTheme();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return currentTheme;
};
