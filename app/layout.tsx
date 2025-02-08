import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Providers from "./Providers";
import { ToasterProvider } from "./components/Toaster";

// Initialize Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Your modern, accessible marketplace platform",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" }
  ],
  // Improve SEO and social sharing
  openGraph: {
    type: 'website',
    title: 'Marketplace',
    description: 'Your modern, accessible marketplace platform',
    siteName: 'Marketplace',
  },
  // Basic manifest for PWA support
  // manifest: '/manifest.json',
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} h-full scroll-smooth`}
      suppressHydrationWarning // Prevents dark mode flicker
    >
      <head>
        {/* Preload critical assets */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
      </head>
      <body 
        className={`
          min-h-full
          antialiased
          bg-slate-50 
          text-slate-900
          transition-colors
          duration-200
          selection:bg-primary-200 
          selection:text-primary-900
          dark:bg-dark-bg
          dark:text-dark-text-primary
          dark:selection:bg-primary-800
          dark:selection:text-primary-50
        `}
      >
        <Providers>
          {/* Skip to main content link for accessibility */}
          <a 
            href="#main-content" 
            className="skip-to-content"
          >
            Skip to main content
          </a>
          
          {/* Main content wrapper */}
          <div id="main-content">
            {children}
          </div>
          
          {/* Toast notifications */}
          <ToasterProvider />
        </Providers>
      </body>
    </html>
  );
}