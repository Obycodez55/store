"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProductSearch } from "@/app/hooks/useProductSearch";
import { Product } from "@/types/market";
import debounce from "lodash/debounce";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { ProductGrid } from "./ProductGrid";

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
  className?: string;
}

export const ProductSearch = ({
  onProductSelect,
  className,
}: ProductSearchProps) => {
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useProductSearch(query);
  const searchRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(searchRef as React.RefObject<HTMLElement>, () =>
    setIsOpen(false)
  );

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setQuery(value);
    }, 300),
    [setQuery]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
    setIsOpen(true);
  };

  const handleClear = () => {
    setInputValue("");
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Input
          value={inputValue}
          placeholder="Search products..."
          onChange={handleInputChange}
          className="pr-10 pl-10 w-full"
          onFocus={() => setIsOpen(true)}
        />
        <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
        {inputValue && (
          <Button
            variant="ghost"
            size="sm"
            className="top-1/2 right-1 absolute p-0 w-7 h-7 -translate-y-1/2"
            onClick={handleClear}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (inputValue.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="top-full z-50 absolute bg-card shadow-lg mt-2 border border-border rounded-lg w-full overflow-hidden"
          >
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                <Loader2 className="mx-auto mb-2 w-6 h-6 animate-spin" />
                <p>Searching products...</p>
              </div>
            ) : !data?.products.length ? (
              <div className="p-8 text-center">
                <p className="mb-1 text-muted-foreground">No products found</p>
                <p className="text-muted-foreground text-sm">
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              <div className="p-4 max-h-[80vh] overflow-y-auto">
                <ProductGrid
                  products={data.products}
                  onProductSelect={onProductSelect}
                  variant="search"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
