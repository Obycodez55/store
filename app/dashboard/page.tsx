"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Store, Package, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PageTransition } from "@/app/components/PageTransition";

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
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [newItem, setNewItem] = useState("");

  const { data: vendorData, refetch } = useQuery<VendorDashboardData>({
    queryKey: ["vendor-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/vendor/dashboard");
      if (!response.ok) throw new Error("Failed to fetch vendor data");
      return response.json();
    }
  });

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    try {
      const response = await fetch("/api/vendor/goods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: newItem.trim() })
      });

      if (!response.ok) throw new Error("Failed to add item");

      toast.success("Item added successfully");
      setNewItem("");
      refetch();
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const handleRemoveItem = async (item: string) => {
    try {
      const response = await fetch("/api/vendor/goods", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item })
      });

      if (!response.ok) throw new Error("Failed to remove item");

      toast.success("Item removed successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Market Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg border border-border p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Store className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Your Market</h2>
              </div>
              {vendorData?.market && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">{vendorData.market.name}</h3>
                    <p className="text-sm text-muted-foreground">
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
              className="bg-card rounded-lg border border-border p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Store className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Your Details</h2>
              </div>
              {vendorData && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">{vendorData.name}</h3>
                    <p className="text-sm text-muted-foreground">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 bg-card rounded-lg border border-border p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Goods You Sell</h2>
              </div>

              <div className="space-y-4">
                {/* Add new item */}
                <div className="flex gap-2">
                  <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add new item..."
                    onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                  />
                  <Button onClick={handleAddItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Items list */}
                <div className="grid gap-2">
                  {vendorData?.goodsSold.map((item) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-background rounded-md border border-border"
                    >
                      <span>{item}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
