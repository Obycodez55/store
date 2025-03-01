import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, password, marketId, website, shopName } = body;

    if (!phone || !password || !name || !marketId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if phone is already registered
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Phone number already in use" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use a transaction to ensure both user and vendor are created properly
    const result = await prisma.$transaction(async (tx) => {
      // Create vendor first
      const vendor = await tx.vendor.create({
        data: {
          name,
          marketId,
          phone,
          website,
          goodsSold: [],
        },
      });

      console.log("Created vendor:", vendor);

      // Create user with reference to vendor
      const user = await tx.user.create({
        data: {
          name,
          phone,
          password: hashedPassword,
          shopName,
          vendorId: vendor.id, // Ensure this is set properly
        },
        include: {
          vendor: true, // Include vendor to verify relationship
        },
      });

      console.log("Created user with vendor:", user);

      return { user, vendor };
    });

    // Return only necessary user information
    return NextResponse.json(
      {
        user: {
          id: result.user.id,
          name: result.user.name,
          phone: result.user.phone,
          shopName: result.user.shopName,
          vendorId: result.user.vendorId,
        },
        vendor: {
          id: result.vendor.id,
          name: result.vendor.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Registration error:", JSON.stringify(error));
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
