import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  params = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const product = await prisma.product.findFirst({
      where: {
        id: params.productId,
        vendor: {
          user: {
            id: session.user.id,
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
    console.log([...formData.keys()]);

    // Check if product exists and belongs to the vendor
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.productId,
        vendor: {
          user: {
            id: session.user.id,
          },
        },
      },
    });

    if (!existingProduct) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Upload new image if provided
    let imageUrl = existingProduct.image;
    const image = formData.get("image");
    let imageFile = formData.get("image") as string;
    // Handle image upload
    // Check if the image is a base64 string
    // * NB: imageFile starts with data:
    // Use the base64 data URI directly
    const uploadResult = await cloudinary.uploader.upload(imageFile, {
      folder: "products",
    });
    imageUrl = uploadResult.secure_url;

    // Get tag from form data
    const tag = formData.get("tag");
    const tags = tag ? [tag as string] : existingProduct.tags;

    // Update product
    const product = await prisma.product.update({
      where: { id: params.productId },
      data: {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: parseFloat(formData.get("price") as string),
        image: imageUrl,
        tags: tags,
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
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  params = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if product exists and belongs to the vendor
    const product = await prisma.product.findFirst({
      where: {
        id: params.productId, // Changed from id to productId
        vendor: {
          user: {
            id: session.user.id,
          },
        },
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Delete product
    await prisma.product.delete({
      where: { id: params.productId }, // Changed from id to productId
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting product:", JSON.stringify(error));
    return new NextResponse("Internal error", { status: 500 });
  }
}
