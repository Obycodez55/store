import { ProtectedRoute } from "@/app/components/ProtectedRoute";

export default function MarketLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
