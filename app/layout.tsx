import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/components/auth-provider";
import { TanstackProvider } from "@/components/tanstack-provider";
import HeaderClientWrapper from "./components/HeaderClientWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Local Marketplace",
  description: "Find and explore local markets and vendors",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch markets server-side for the initial header state
  const markets = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/markets`
  )
    .then((res) => (res.ok ? res.json() : []))
    .catch(() => []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background font-sans antialiased ${inter.variable} ${poppins.variable}`}
      >
        <ThemeProvider
          attribute="class"
          // defaultTheme="system"
          // enableSystem
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <AuthProvider>
            <TanstackProvider>
              <HeaderClientWrapper initialMarkets={markets} />
              {children}
              <Toaster position="top-center" />
            </TanstackProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
