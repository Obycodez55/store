"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { ProductSearch } from "../components/ProductSearch";
import { ProductGrid } from "../components/ProductGrid";
import { ProductPagination } from "../components/ProductPagination";
import {
  ModalProduct,
  ProductDetailsModal,
} from "../components/ProductDetailsModal";
import { useProductSearch } from "../hooks/useProductSearch";
import { Product } from "@/types/market";
import { Package } from "lucide-react";
import { LoadingScreen } from "@/app/components/LoadingScreen";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data } = useProductSearch(searchQuery, currentPage);
  const products = useMemo(() => data?.products || [], [data?.products]);
  const pagination = data?.pagination;

  // Handle URL-based modal state
  useEffect(() => {
    const productId = searchParams.get("product");
    if (productId && products) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [searchParams, products]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Update URL without navigation
    const newUrl = `/products?product=${product.id}`;
    window.history.pushState({}, "", newUrl);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    // Remove product param from URL
    const newUrl = "/products";
    window.history.pushState({}, "", newUrl);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="top-0 z-50 sticky bg-background/80 backdrop-blur-sm border-b w-full">
        <div className="mx-auto px-4 container">
          <div className="flex justify-between items-center h-16">
            <motion.a
              href="/"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold font-display text-xl"
            >
              Market<span className="text-primary">Place</span>
            </motion.a>
            <div className="mx-4 w-full max-w-xl">
              <Suspense fallback={<LoadingScreen />}>
                <ProductSearch onProductSelect={handleProductSelect} />
              </Suspense>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4 py-8 container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-2 text-primary">
            <Package className="w-5 h-5" />
            <h1 className="font-display font-semibold text-2xl">
              Available Products
            </h1>
          </div>

          <ProductGrid
            products={products}
            onProductSelect={handleProductSelect}
          />

          {pagination && pagination.pages > 1 && (
            <ProductPagination
              currentPage={currentPage}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </motion.div>
      </main>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
          product={selectedProduct as ModalProduct}
        />
      )}
    </div>
  );
}

// Wrap the main component with Suspense
export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ProductsPageContent />
    </Suspense>
  );
}
