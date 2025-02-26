import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, password, marketId, website } = body;

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

    // Create a new vendor
    const vendor = await prisma.vendor.create({
      data: {
        name,
        marketId,
        phone,
        website,
        goodsSold: [],
      },
    });

    // Create a new user connected to the vendor
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        vendorId: vendor.id,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
