import { Metadata, Viewport } from "next/types";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Page Not Found | Ibadan MarketPlace",
  description: "The page you are looking for could not be found.",
};

export const viewport: Viewport = {
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  //   { media: "(prefers-color-scheme: dark)", color: "#000000" },
  // ],
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function NotFound() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="mb-4 font-bold text-4xl">404</h1>
        <p className="mb-4 text-xl">Page Not Found</p>
        <Link href="/" className="text-primary hover:underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
