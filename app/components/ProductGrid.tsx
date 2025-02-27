"use client";

import { Product } from "@/types/market";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

export const ProductGrid = ({
  products,
  onProductSelect,
}: ProductGridProps) => {
  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[minmax(0,20rem)]">
      {products.map((product) => (
        <Card
          key={product.id}
          className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
          onClick={() => onProductSelect(product)}
        >
          <div className="relative aspect-square">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="aspect-2 object-cover"
              />
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
};
