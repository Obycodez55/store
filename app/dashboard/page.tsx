"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Store, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/app/components/PageTransition";
import Link from "next/link";
import { ProductCard } from "@/app/components/ProductCard";
import { Product } from "@prisma/client";

interface VendorDashboardData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  market: {
    id: string;
    name: string;
    location: string;
    description: string;
  };
  goodsSold: string[];
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  }[];
}

export default function Dashboard() {
  const { data: session } = useSession();
  const { data: vendorData, refetch } = useQuery<VendorDashboardData>({
    queryKey: ["vendor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/vendor/dashboard");
      if (!response.ok) throw new Error("Failed to fetch vendor data");
      return response.json();
    },
  });

  // const handleAddItem = async () => {
  //   if (!newItem.trim()) return;

  //   try {
  //     const response = await fetch("/api/vendor/goods", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ item: newItem.trim() }),
  //     });

  //     if (!response.ok) throw new Error("Failed to add item");

  //     toast.success("Item added successfully");
  //     setNewItem("");
  //     refetch();
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed to add item");
  //   }
  // };

  // const handleRemoveItem = async (item: string) => {
  //   try {
  //     const response = await fetch("/api/vendor/goods", {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ item }),
  //     });

  //     if (!response.ok) throw new Error("Failed to remove item");

  //     toast.success("Item removed successfully");
  //     refetch();
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Failed to remove item");
  //   }
  // };

  if (!session?.user) {
    return null;
  }

  return (
    <PageTransition>
      <div className="bg-background min-h-screen">
        <main className="mx-auto px-4 py-8 container">
          <div className="gap-6 grid md:grid-cols-2">
            {/* Market Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card p-6 border border-border rounded-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <Store className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-xl">Your Market</h2>
              </div>
              {vendorData?.market && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">{vendorData.market.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {vendorData.market.location}
                    </p>
                  </div>
                  <p className="text-sm">{vendorData.market.description}</p>
                </div>
              )}
            </motion.div>

            {/* Vendor Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card p-6 border border-border rounded-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <Store className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-xl">Your Details</h2>
              </div>
              {vendorData && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">{vendorData.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {vendorData.email}
                    </p>
                  </div>
                  {vendorData.phone && (
                    <p className="text-sm">Phone: {vendorData.phone}</p>
                  )}
                  {vendorData.website && (
                    <p className="text-sm">Website: {vendorData.website}</p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Goods Sold */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 bg-card p-6 border border-border rounded-lg"
            >
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-xl">Goods You Sell</h2>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add new item..."
                    onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                  />
                  <Button onClick={handleAddItem}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="gap-2 grid">
                  {vendorData?.goodsSold.map((item) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between items-center bg-background p-3 border border-border rounded-md"
                    >
                      <span>{item}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div> */}

            {/* Products Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 bg-card p-6 border border-border rounded-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-xl">Your Products</h2>
                </div>
                <Link href="/dashboard/products/add">
                  <Button>
                    <Plus className="mr-2 w-4 h-4" />
                    Add Product
                  </Button>
                </Link>
              </div>

              <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
                {vendorData?.products?.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product as any}
                    isManageable
                    onDelete={() => refetch()}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
