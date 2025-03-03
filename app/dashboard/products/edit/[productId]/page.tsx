"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { PageTransition } from "@/app/components/PageTransition";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import { Product, Tags } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImageWithType {
  url: string;
  isExisting: boolean;
  file?: File;
}

export default function EditProduct({ params }: { params: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageWithType[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tags>(Tags.OTHER);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`/api/products/${params.productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setSelectedTag(data.tags[0] || Tags.OTHER);

        // Set up initial images from product
        const existingImages: ImageWithType[] = [];

        // Add primary image first
        if (data.image) {
          existingImages.push({ url: data.image, isExisting: true });
        }

        // Then add other images, avoiding duplicates
        if (data.images && data.images.length > 0) {
          data.images.forEach((img: any) => {
            // Only add if not already the primary image
            if (img.url !== data.image) {
              existingImages.push({ url: img.url, isExisting: true });
            }
          });
        }

        setImages(existingImages);
      }
    };
    fetchProduct();
  }, [params.productId]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files);
    const newImageObjects: ImageWithType[] = [];

    // Process each new file
    for (const file of newFiles) {
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          newImageObjects.push({
            url: reader.result as string,
            isExisting: false,
            file,
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    // Add new images to the current set
    setImages((prev) => [...prev, ...newImageObjects]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("tag", selectedTag);

      // Add existing image URLs that weren't removed
      const existingImageUrls = images
        .filter((img) => img.isExisting)
        .map((img) => img.url);
      formData.append("existingImages", JSON.stringify(existingImageUrls));

      // Add only new image files
      const newImageFiles = images
        .filter((img) => !img.isExisting && img.file)
        .map((img) => img.file!);

      newImageFiles.forEach((file) => {
        formData.append("imageFiles", file);
      });

      const response = await fetch(`/api/products/${params.productId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update product");

      toast.success("Product updated successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Main Content */}
      <div className="m-4 mx-auto py-8 max-w-5xl">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-2xl">Edit Product</h1>
        </div>

        <div className="gap-8 grid md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium text-sm">
                      Product Name
                    </label>
                    <Input
                      name="name"
                      required
                      placeholder="Enter product name"
                      defaultValue={product.name}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-sm">
                      Description
                    </label>
                    <Textarea
                      name="description"
                      required
                      placeholder="Describe your product"
                      rows={4}
                      defaultValue={product.description || ""}
                    />
                  </div>

                  <div className="gap-4 grid grid-cols-2">
                    <div>
                      <label className="block mb-1 font-medium text-sm">
                        Category
                      </label>
                      <Select
                        value={selectedTag}
                        onValueChange={(value) => setSelectedTag(value as Tags)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Tags).map((tag) => (
                            <SelectItem key={tag} value={tag}>
                              {tag.charAt(0) + tag.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Product"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Image Upload Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-medium text-lg">Product Images</h2>
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex justify-center items-center border-2 hover:border-primary/50 bg-muted/50 p-4 border-dashed rounded-lg transition cursor-pointer aspect-square">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <div className="text-center">
                      <ImagePlus className="mx-auto w-12 h-12 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground text-sm">
                        Click or drag to upload product images
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="gap-2 grid grid-cols-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Preview ${index + 1}`}
                          className="rounded-md w-full aspect-square object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="top-2 right-2 absolute opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {index === 0 && (
                          <span className="bottom-2 left-2 absolute bg-black/50 px-2 py-1 rounded text-white text-xs">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-muted-foreground text-sm">
                    Upload high-quality images of your product. The first image
                    will be used as the primary image. Recommended size:
                    1000x1000px.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
