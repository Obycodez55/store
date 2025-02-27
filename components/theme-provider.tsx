"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Ensure light theme is forced regardless of other props
  return (
    <NextThemesProvider {...props} defaultTheme="light" forcedTheme="light">
      {children}
    </NextThemesProvider>
  );
}
