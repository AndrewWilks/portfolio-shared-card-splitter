import React from "react";

export enum Themes {
  Light = "light",
  Dark = "dark",
}

function getInitialTheme(): Themes {
  if (typeof window !== "undefined" && localStorage) {
    const storedTheme = localStorage.getItem("theme");
    if (typeof storedTheme === "string") {
      return storedTheme as Themes;
    }
    const userMedia = globalThis.matchMedia("(prefers-color-scheme: dark)");
    if (userMedia.matches) {
      return Themes.Dark;
    }
  }
  return Themes.Light;
}

export const ThemeContext = React.createContext<{
  theme: Themes;
  setTheme: (theme: Themes) => void;
  Themes: typeof Themes;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Themes>(getInitialTheme);

  const rawSetTheme = (theme: Themes) => {
    const root = globalThis.document.documentElement;
    const isDark = theme === Themes.Dark;
    root.classList.remove(isDark ? Themes.Light : Themes.Dark);
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  };

  React.useEffect(() => {
    rawSetTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, Themes: Themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
