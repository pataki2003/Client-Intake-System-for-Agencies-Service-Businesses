export const THEME_STORAGE_KEY = "client-intake-theme";

export type ThemeMode = "light" | "dark";

export function getThemeInitScript() {
  return `
    (function() {
      var storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
      var root = document.documentElement;
      var storedTheme = null;

      try {
        storedTheme = window.localStorage.getItem(storageKey);
      } catch (error) {
        storedTheme = null;
      }

      var theme =
        storedTheme === "light" || storedTheme === "dark"
          ? storedTheme
          : window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";

      root.dataset.theme = theme;
      root.dataset.themePreference =
        storedTheme === "light" || storedTheme === "dark" ? storedTheme : "system";
      root.style.colorScheme = theme;
      root.classList.toggle("dark", theme === "dark");
    })();
  `;
}
