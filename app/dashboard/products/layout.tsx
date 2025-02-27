import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Management",
  description: "Manage your market products",
};

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <div className="bg-background min-h-screen">{children}</div>;
}
