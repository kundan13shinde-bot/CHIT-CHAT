import { createContext, useContext } from "react";
import { heroTheme } from "../data/herotheme";

export const ThemeContext = createContext(null);

export const DEFAULT_THEME_ID = "default";

const THEME_IDS = new Set(heroTheme.map((t) => t.id));

export function isValidTheme(themeId) {
  return THEME_IDS.has(themeId);
}

export function getThemeById(themeId) {
  return heroTheme.find((t) => t.id === themeId) ?? heroTheme.find((t) => t.id === DEFAULT_THEME_ID);
}

/** Applies a theme to <html> right away so colours update before paint. */
export function applyThemeToDocument(themeId) {
  const theme = getThemeById(themeId);
  const root = document.documentElement;
  root.setAttribute("data-theme", theme.id);
  root.classList.toggle("dark", theme.mode === "dark");
  root.classList.toggle("light", theme.mode !== "dark");
}

/** Light <-> dark counterpart of a theme (ocean <-> ocean-dark). Falls back to default/dark. */
export function getCounterpartThemeId(themeId) {
  const theme = getThemeById(themeId);
  const candidates =
    theme.mode === "dark"
      ? [themeId.replace(/-dark$/, ""), DEFAULT_THEME_ID]
      : [`${themeId}-dark`, "dark"];

  return candidates.find((id) => id !== themeId && isValidTheme(id)) ?? themeId;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
