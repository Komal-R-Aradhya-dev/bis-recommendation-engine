import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  applyTheme: () => void;
}

function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",

      setTheme: (theme) => {
        applyThemeClass(theme);
        set({ theme });
      },

      toggleTheme: () => {
        const nextTheme = get().theme === "light" ? "dark" : "light";

        applyThemeClass(nextTheme);
        set({ theme: nextTheme });
      },

      applyTheme: () => {
        applyThemeClass(get().theme);
      },
    }),
    {
      name: "bis-theme",
    },
  ),
);
