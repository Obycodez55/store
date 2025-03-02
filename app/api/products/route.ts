import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Prisma, Tags } from "@prisma/client";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const marketId = searchParams.get("marketId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const query = searchParams.get("q") || "";

    const where = {
      ...(marketId
        ? {
            vendor: {
              market: {
                id: marketId,
              },
            },
          }
        : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
              {
                description: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          vendor: {
            include: {
              market: true,
            },
          },
          images: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", JSON.stringify(error));
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
    const tag = formData.get("tag") as Tags;
    const imageFiles = formData.getAll("imageFiles");

    if (!imageFiles.length) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }
    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.findFirst({
      where: { user: { phone: session.user.phone } },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor account not found" },
        { status: 404 }
      );
    }

    // Convert files to base64 for Cloudinary
    const imagePromises = imageFiles.map(async (file: File) => {
      // Convert File object to Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Convert to base64 string for Cloudinary
      const base64Image = `data:${file.type};base64,${buffer.toString(
        "base64"
      )}`;

      // Upload to Cloudinary
      return cloudinary.uploader.upload(base64Image, {
        folder: "products",
      });
    });

    const uploadResults = await Promise.all(imagePromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    // Create product with the first image as primary
    const product = await prisma.product.create({
      data: {
        name,
        description,
        tags: [tag || Tags.OTHER],
        image: imageUrls[0], // Set first image as primary
        vendorId: vendor.id,
        images: {
          create: imageUrls.map((url, index) => ({
            // Create entries for all images including the primary one
            url,
          })),
        },
      },
      include: {
        images: true,
        vendor: {
          include: {
            market: true,
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product", cause: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
