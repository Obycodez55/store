// "use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ReactNode } from "react";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
      <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
}
