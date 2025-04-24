"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import useUserPreferences from "@/store/useUserPreferences";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useUserPreferences();

  // Set the theme from Zustand store
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider {...props} forcedTheme={theme === 'system' ? undefined : theme}>
      {children}
    </NextThemesProvider>
  );
}