"use client";

import dynamic from "next/dynamic";
import { Market } from "@/types/market";

// Dynamically import the Header to avoid SSR issues with authentication state
const Header = dynamic(() => import("./Header"), { ssr: false });

export default function HeaderClientWrapper({
  initialMarkets = [],
}: {
  initialMarkets: Market[];
}) {
  return <Header markets={initialMarkets} />;
}
