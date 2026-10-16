import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getTheme, updateTheme } from "../services/todoApi";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Apply theme to <html> whenever it changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // On app load / page refresh: if user is logged in, load saved theme from DB
  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    getTheme()
      .then((theme) => setDarkMode(theme === "dark"))
      .catch((error) => console.error("Failed to load theme:", error));
  }, []);

  // Call this right after login, with the theme returned by the server
  const applyTheme = useCallback((theme) => {
    setDarkMode(theme === "dark");
  }, []);

  // Call this on logout (only resets the screen, DB is untouched)
  const resetTheme = useCallback(() => {
    setDarkMode(false);
  }, []);

  // Toggle button: update screen immediately, then save to DB
  async function toggleTheme() {
    const next = !darkMode;
    setDarkMode(next);

    if (!localStorage.getItem("token")) return;

    try {
      await updateTheme(next ? "dark" : "light");
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  }

  return (
    <ThemeContext.Provider
      value={{ darkMode, toggleTheme, applyTheme, resetTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}