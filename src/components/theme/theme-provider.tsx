"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

import { THEME_STORAGE_KEY, type ThemeMode } from "@/lib/theme";

type ThemePreference = ThemeMode | null;

type ThemeContextValue = {
  mounted: boolean;
  preference: ThemePreference;
  effectiveTheme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredThemePreference(): ThemePreference {
  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return storedTheme === "light" || storedTheme === "dark" ? storedTheme : null;
  } catch {
    return null;
  }
}

function getSystemTheme(): ThemeMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: ThemeMode, preference: ThemePreference) {
  const root = document.documentElement;

  root.dataset.theme = theme;
  root.dataset.themePreference = preference ?? "system";
  root.dataset.themeReady = "true";
  root.style.colorScheme = theme;
  root.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [preference, setPreference] = useState<ThemePreference>(null);
  const [effectiveTheme, setEffectiveTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const storedPreference = getStoredThemePreference();
    const initialTheme = storedPreference ?? getSystemTheme();

    setPreference(storedPreference);
    setEffectiveTheme(initialTheme);
    applyTheme(initialTheme, storedPreference);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      if (preference !== null) {
        return;
      }

      const nextTheme = event.matches ? "dark" : "light";
      setEffectiveTheme(nextTheme);
      applyTheme(nextTheme, null);
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, [mounted, preference]);

  const setTheme = (theme: ThemeMode) => {
    setPreference(theme);
    setEffectiveTheme(theme);
    applyTheme(theme, theme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage write failures and continue using the in-memory selection.
    }
  };

  const toggleTheme = () => {
    setTheme(effectiveTheme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{
        mounted,
        preference,
        effectiveTheme,
        setTheme,
        toggleTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }

  return context;
}
