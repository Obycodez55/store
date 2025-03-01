"use client";

import { Product } from "@/types/market";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  images: { id: string; url: string }[];
  vendor: {
    name: string;
    market: {
      name: string;
    };
  };
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  isManageable?: boolean;
  onDelete?: (productId: string) => void;
  onProductSelect: (product: Product) => void;
  variant?: "default" | "search";
}

export function ProductGrid({
  products = [],
  isLoading,
  isManageable,
  onDelete,
  onProductSelect,
  variant = "default",
}: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const gridClass =
    variant === "search"
      ? "gap-3 grid grid-cols-1 sm:grid-cols-2 auto-rows-[minmax(0,15rem)]"
      : "gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[minmax(0,20rem)]";

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <Card
          key={product.id}
          className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
          onClick={() => onProductSelect(product)}
        >
          <div className="relative aspect-square">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="aspect-2 object-cover"
              />
            ) : (
              product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="aspect-2 object-cover"
                />
              )
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium truncate">{product.name}</h3>
            <div className="flex justify-between items-center mt-2">
              <p className="text-muted-foreground text-sm truncate">
                {product.vendor.name}
              </p>
              {product.price && (
                <p className="font-semibold">{formatPrice(product.price)}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
