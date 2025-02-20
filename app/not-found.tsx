import { Metadata, Viewport } from "next/types";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Page Not Found | MarketPlace",
  description: "The page you are looking for could not be found."
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
  width: "device-width",
  initialScale: 1
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-4">Page Not Found</p>
        <Link href="/" className="text-primary hover:underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
