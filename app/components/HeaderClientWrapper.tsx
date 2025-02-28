"use client";

import dynamic from "next/dynamic";
import { Market } from "@/types/market";
import Header from "@/app/components/Header";
export default function HeaderClientWrapper({
  initialMarkets = [],
}: {
  initialMarkets: Market[];
}) {
  return <Header markets={initialMarkets} />;
}
