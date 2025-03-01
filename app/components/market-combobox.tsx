"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";

interface MarketOption {
  id: string;
  name: string;
}

interface MarketComboBoxProps {
  markets: MarketOption[];
  value?: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function MarketComboBox({
  markets = [], // provide default empty array
  value,
  onSelect,
  disabled,
  isLoading,
}: MarketComboBoxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || isLoading}
          className="justify-between pl-10 w-full"
        >
          {isLoading
            ? "Loading markets..."
            : value
            ? markets.find((market) => market.id === value)?.name
            : "Select a market"}
          <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full">
        <Command>
          <CommandInput placeholder="Search markets..." />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No market found."}
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {markets.map((market) => {
                return (
                  <CommandItem
                    key={market.id}
                    value={market.name}
                    onSelect={() => {
                      onSelect(market.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === market.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {market.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
