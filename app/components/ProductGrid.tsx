"use client";

import { motion } from "framer-motion";
import { Product } from "@/types/market";
import { ProductCard } from "./ProductCard";
import { LoadingGrid } from "./LoadingGrid";

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  isLoading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.4,
    },
  },
};

export const ProductGrid = ({
  products,
  onProductClick,
  isLoading,
}: ProductGridProps) => {
  if (isLoading) {
    return <LoadingGrid />;
  }

  if (!products.length) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-2 font-semibold text-xl">No Products Found</h2>
        <p className="text-muted-foreground">
          Try adjusting your search or browse all products
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={itemVariants}
          onClick={() => onProductClick(product)}
          className="cursor-pointer"
        >
          <ProductCard
            id={product.id}
            name={product.name}
            description={product.description || ""}
            price={product.price}
            image={product.image || ""}
            category={product.tags}
            vendor={{
              name: product.vendor.name,
              email: product.vendor.email ?? undefined,
              phone: product.vendor.phone ?? undefined,
              website: product.vendor.website ?? undefined,
              market: {
                name: product.vendor.market.name,
                location: product.vendor.market.location,
              },
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
