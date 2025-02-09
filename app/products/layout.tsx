import { Metadata, Viewport } from "next/types";

export const metadata: Metadata = {
  title: "Products | MarketPlace",
  description: "Browse all available products in our marketplace"
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
  width: "device-width",
  initialScale: 1
};

export default function ProductsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
