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

    // Handle multiple images
    const images = formData.getAll("images") as string[];
    let primaryImage = existingProduct.image;
    const imageUrls: string[] = [];

    // Upload all images to Cloudinary
    if (images.length > 0) {
      const uploadPromises = images.map((imageFile) =>
        cloudinary.uploader.upload(imageFile, {
          folder: "products",
        })
      );

      const uploadResults = await Promise.all(uploadPromises);

      // Set first image as primary if it exists
      if (uploadResults[0]) {
        primaryImage = uploadResults[0].secure_url;
      }

      // Store remaining images
      imageUrls.push(
        ...uploadResults.slice(1).map((result) => result.secure_url)
      );
    }

    // Get tag from form data
    const tag = formData.get("tag");
    const tags = tag ? [tag as Tags] : existingProduct.tags;

    // Delete old images from Cloudinary if new images are uploaded
    if (images.length > 0) {
      const oldImageUrls = [
        existingProduct.image,
        ...existingProduct.images.map((img) => img.url),
      ].filter(Boolean);

      for (const url of oldImageUrls) {
        try {
          const publicId = url?.split("/").pop()?.split(".")[0];
          if (publicId) {
            await cloudinary.uploader.destroy(`products/${publicId}`);
          }
        } catch (error) {
          console.error("Failed to delete old image from Cloudinary:", error);
        }
      }
    }

    // Update product with new images
    const product = await prisma.product.update({
      where: { id: params.productId },
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        image: primaryImage,
        tags: tags,
        images:
          images.length > 0
            ? {
                deleteMany: {}, // Delete all existing images
                create: imageUrls.map((url) => ({
                  url,
                })),
              }
            : undefined,
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
