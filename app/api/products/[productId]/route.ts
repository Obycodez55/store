import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { Tags } from "@prisma/client";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  request: NextRequest,
  { params }: { params: any }
): Promise<NextResponse> {
  try {
    params = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const product = await prisma.product.findFirst({
      where: {
        id: params.productId,
        vendor: {
          user: {
            phone: session.user.phone,
          },
        },
      },
      include: {
        images: true,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// PUT /api/products/[productId] - Update a product
export async function PUT(request: NextRequest, { params }: any) {
  try {
    params = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();

    // Check if product exists and belongs to the vendor
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.productId,
        vendor: {
          user: {
            phone: session.user.phone,
          },
        },
      },
      include: {
        images: true,
      },
    });

    if (!existingProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Parse existing images to keep from the form data
    const existingImages = JSON.parse(
      (formData.get("existingImages") as string) || "[]"
    );

    // Upload new images to Cloudinary if provided
    const imageFiles = formData.getAll("imageFiles") as File[];
    const newImageUrls: string[] = [];

    if (imageFiles.length > 0) {
      const imagePromises = imageFiles.map(async (file: File) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = `data:${file.type};base64,${buffer.toString(
          "base64"
        )}`;
        return cloudinary.uploader.upload(base64Image, {
          folder: "products",
        });
      });

      const uploadResults = await Promise.all(imagePromises);
      newImageUrls.push(...uploadResults.map((result) => result.secure_url));
    }

    // Determine primary image - first existing image or first new image if no existing
    const primaryImage =
      existingImages.length > 0
        ? existingImages[0]
        : newImageUrls.length > 0
        ? newImageUrls[0]
        : existingProduct.image;

    // Get all current image URLs from the database
    const currentImageUrls = [
      existingProduct.image,
      ...existingProduct.images.map((img) => img.url),
    ].filter(Boolean);

    // Find images to delete - images that were in the database but not in the existingImages list
    const imagesToDelete = currentImageUrls.filter(
      (url) => !existingImages.includes(url)
    );

    // Delete removed images from Cloudinary
    for (const url of imagesToDelete) {
      try {
        const publicId = url?.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`products/${publicId}`);
        }
      } catch (error) {
        console.error("Failed to delete old image from Cloudinary:", error);
      }
    }

    // Get tag from form data
    const tag = formData.get("tag");
    const tags = tag ? [tag as Tags] : existingProduct.tags;

    // Calculate final image URLs (excluding duplicates)
    const allFinalImages = [...existingImages, ...newImageUrls];
    const uniqueImages = [...new Set(allFinalImages)];

    // Update product
    const product = await prisma.product.update({
      where: { id: params.productId },
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        image: primaryImage,
        tags: tags,
        images: {
          deleteMany: {}, // Delete all existing image records
          create: uniqueImages
            .filter((url) => url !== primaryImage) // Exclude primary image to avoid duplication
            .map((url) => ({ url })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", JSON.stringify(error));
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/products/[productId] - Delete a product
export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { productId } = params;
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Get the product with its images before deletion
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete images from Cloudinary
    const imageUrls = [
      product.image,
      ...product.images.map((img) => img.url),
    ].filter(Boolean);

    for (const url of imageUrls) {
      try {
        const publicId = url?.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`products/${publicId}`);
        }
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }

    // Delete the product (this will cascade delete the images due to onDelete: Cascade in schema)
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
