"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, ArrowLeft, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { PageTransition } from "@/app/components/PageTransition";
import { Tags } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function AddProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tags>(Tags.OTHER);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setErrorMessage(null);

    // Validate file sizes
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setErrorMessage(
        `Some images exceed the 5MB size limit: ${oversizedFiles
          .map((f) => f.name)
          .join(", ")}`
      );
      return;
    }

    // Store the actual file objects
    setImageFiles((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("tag", selectedTag);

      if (imageFiles.length === 0) {
        toast.error("At least one image is required");
        setIsLoading(false);
        return;
      }

      // Add actual image files instead of base64 strings
      imageFiles.forEach((file, index) => {
        formData.append("imageFiles", file);
      });

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      toast.success("Product created successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="font-bold text-2xl">Add New Product</h1>
        </div>

        <div className="gap-8 grid md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="gap-2 grid grid-cols-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
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
                    {isLoading ? "Creating..." : "Create Product"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Image Upload Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-medium text-lg">Product Images</h2>
              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
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

                <div className="mt-4">
                  <p className="text-muted-foreground text-sm">
                    Upload high-quality images of your product (max 5MB each).
                    The first image will be used as the primary image.
                    Recommended size: 1000x1000px.
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
