import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Tags } from "@prisma/client";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const marketId = searchParams.get("marketId");
    console.log({ marketId });
    const products = await prisma.product.findMany({
      where: marketId
        ? {
            vendor: {
              market: {
                id: marketId,
              },
            },
          }
        : undefined,
      include: {
        vendor: {
          include: {
            market: true,
          },
        },
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();

    // Validate required fields
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const tag = formData.get("tag") as Tags;
    const imageFile = formData.get("image") as Blob | null;

    if (!imageFile) {
      console.log([...formData.keys()]);
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }
    if (!name || !description || !priceStr) {
      return NextResponse.json(
        { error: "Name, description, and price are required" },
        { status: 400 }
      );
    }

    const price = parseFloat(priceStr);
    if (isNaN(price)) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    // Find the vendor associated with the user
    const vendor = await prisma.vendor.findFirst({
      where: { user: { id: session.user.id } },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor account not found" },
        { status: 404 }
      );
    }

    // Handle image upload
    let imageUrl = null;
    // Check if the image is a base64 string
    // * NB: imageFile starts with data:
    // Use the base64 data URI directly
    const uploadResult = await cloudinary.uploader.upload(imageFile, {
      folder: "products",
    });
    imageUrl = uploadResult.secure_url;

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags: [tag || Tags.OTHER],
        image: imageUrl,
        vendorId: vendor.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log("Error creating product:", JSON.stringify(error));
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
