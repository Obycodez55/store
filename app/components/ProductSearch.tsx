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

interface ProductSearchProps {
  onProductSelect: (product: Product) => void;
  className?: string;
}

export const ProductSearch = ({
  onProductSelect,
  className
}: ProductSearchProps) => {
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useProductSearch(query);
  const searchRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(searchRef as React.RefObject<HTMLElement>, () => setIsOpen(false));

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setQuery(value);
    }, 300),
    []
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
          className="w-full pl-10 pr-10"
          onFocus={() => setIsOpen(true)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {inputValue && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (inputValue.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-card rounded-lg border border-border shadow-lg overflow-hidden z-50"
          >
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p>Searching products...</p>
              </div>
            ) : !data?.products.length ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground mb-1">No products found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                {data.products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => onProductSelect(product)}
                    className="w-full px-4 py-3 text-left hover:bg-muted/50 focus:bg-muted/50 focus:outline-none transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-md object-cover bg-muted"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="truncate">
                            {product.vendor.name}
                          </span>
                          <span>•</span>
                          <span className="text-primary font-medium">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
