import { useEffect, useLayoutEffect, useState } from "react";
import {
  applyThemeToDocument,
  DEFAULT_THEME_ID,
  getCounterpartThemeId,
  getThemeById,
  isValidTheme,
  ThemeContext,
} from "./theme";

const STORAGE_KEY = "theme";

function getSystemThemeId() {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : DEFAULT_THEME_ID;
}

function readStoredThemeId() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidTheme(stored)) return stored;
  } catch {
    // localStorage can be unavailable (private mode etc.)
  }
  return getSystemThemeId();
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeIdState] = useState(readStoredThemeId);

  // applies data-theme attribute + light/dark class
  useLayoutEffect(() => {
    applyThemeToDocument(themeId);
  }, [themeId]);

  // remembers the choice
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
      // ignore
    }
  }, [themeId]);

  const setTheme = (next) => {
    setThemeIdState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      return isValidTheme(resolved) ? resolved : DEFAULT_THEME_ID;
    });
  };

  const toggleTheme = () => setThemeIdState((prev) => getCounterpartThemeId(prev));

  const theme = getThemeById(themeId);

  const value = {
    themeId, // e.g. "ocean-dark"
    theme, // full entry from data/herotheme.js
    mode: theme.mode, // "light" | "dark"
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
