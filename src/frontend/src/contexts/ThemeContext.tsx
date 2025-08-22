import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create a context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Try to get the theme from localStorage, default to "light"
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if we're in the browser and localStorage is available
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("originstamp-theme") as Theme;
      // Check if there's a saved theme preference
      if (savedTheme) return savedTheme;
      // Check for OS preference for dark mode
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        return "dark";
    }
    return "light";
  });

  // Effect to update the data-theme attribute on the document and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("originstamp-theme", theme);
  }, [theme]);

  // Function to toggle between light and dark theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
