"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Image from "next/image";
import { Product } from "@prisma/client";
import axios, { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image: FileList;
}

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { register, handleSubmit, reset, setValue } =
    useForm<ProductFormData>();
  const { data: session } = useSession();

  // Fetch vendor's products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `/api/products?userId=${session?.user?.id}`
        );
        setProducts(response.data);
      } catch (err) {
        toast.error(
          "Failed to fetch products: " +
            (err instanceof Error ? err.message : "Unknown error")
        );
      }
    };

    if (session?.user?.id) {
      fetchProducts();
    }
  }, [session?.user?.id]);

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
        setEditingProduct(null);
        reset();
      }
    }

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      if (data.image[0]) {
        formData.append("image", data.image[0]);
      }

      let response: AxiosResponse;
      if (editingProduct) {
        // Update existing product
        formData.append("id", editingProduct.id);
        response = await axios.put(
          `/api/products/${editingProduct.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? response.data : p))
        );
        toast.success("Product updated successfully");
      } else {
        // Create new product
        response = await axios.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setProducts([...products, response.data]);
        toast.success("Product created successfully");
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      reset();
    } catch (error) {
      console.log(error);
      toast.error(
        editingProduct ? "Failed to update product" : "Failed to create product"
      );
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setValue("name", product.name);
    setValue("description", product.description || "");
    setValue("price", product.price.toString());
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/api/products/${productId}`);
        setProducts(products.filter((p) => p.id !== productId));
        toast.success("Product deleted successfully");
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete product");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Products</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary text-white px-6 py-2 rounded-lg shadow-md"
          onClick={() => {
            setEditingProduct(null);
            reset();
            setIsModalOpen(true);
          }}
        >
          Add New Product
        </motion.button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-4">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    {...register("name")}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("price")}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingProduct(null);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProduct ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg overflow-hidden shadow-md"
          >
            <div className="relative h-48">
              <Image
                src={product.image || "/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <p className="text-primary font-bold mt-2">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
