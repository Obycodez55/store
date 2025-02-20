import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: {
    template: "%s Market",
    default: "Market Details"
  },
  description: "View market details, schedule, and available products."
};

export default function MarketLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return {children};
}
