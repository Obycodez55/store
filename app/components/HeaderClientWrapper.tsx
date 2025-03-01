"use client";

import { Market } from "@/types/market";
import Header from "@/app/components/Header";
import { useMarkets } from "@/app/hooks/useMarkets";
export default function HeaderClientWrapper({
  initialMarkets = [],
}: {
  initialMarkets: Market[];
}) {
  const { data: markets } = useMarkets();
  return <Header markets={markets || initialMarkets} />;
}
