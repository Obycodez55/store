"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MarketSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MarketSelect({ value, onChange }: MarketSelectProps) {
  const [markets, setMarkets] = useState<{ id: string; name: string }[]>([
    { id: "1", name: "Farmers Market" },
    { id: "2", name: "Grocery Store" },
    { id: "3", name: "Online Marketplace" },
    { id: "4", name: "Other" },
  ]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Market" />
      </SelectTrigger>
      <SelectContent>
        {markets.map((market) => (
          <SelectItem key={market.id} value={market.id}>
            {market.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
