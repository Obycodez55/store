"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tag, Store } from "lucide-react";
import { ProductDetailsModal } from "./ProductDetailsModal";
import Image from "next/image";
import { Product } from "@prisma/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  isManageable?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export function ProductCard({
  product,
  isManageable,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/products/edit/${product.id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast.success("Product deleted successfully");
      if (onDelete) {
        onDelete(product.id);
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (!product) return <div>null</div>;
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="aspect-2 object-cover"
          />
        ) : (
          <div className="flex justify-center items-center bg-muted/50 w-full h-full">
            No image
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-muted-foreground text-sm">
          {product.description}
        </p>
      </CardContent>
      {isManageable && (
        <CardFooter className="gap-2 p-4 pt-0">
          <Button variant="outline" size="icon" onClick={handleEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
