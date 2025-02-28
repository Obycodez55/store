import { Metadata, Viewport } from "next/types";

export const metadata: Metadata = {
  title: "Browse Products",
  description: "Browse all available products from local markets in your area.",
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

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
