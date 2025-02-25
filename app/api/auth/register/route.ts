import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log({ body });
    const { phone, password, name, marketId, website } = body;

    // Validate input
    if (!phone || !password || !marketId) {
      return NextResponse.json(
        { message: "Phone, password and market ID are required" },
        { status: 400 }
      );
    }

    // Phone number validation (international format)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        {
          message:
            "Invalid phone number format. Please use international format (e.g., +1234567890)",
        },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }
    console.log("Body:", body);
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { vendor: { phone } },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this phone number already exists" },
        { status: 400 }
      );
    }
    console.log("Market ID:", marketId);

    // Verify market exists
    const market = await prisma.market.findUnique({
      where: { id: marketId },
    });

    console.log("Market:", market);
    if (!market) {
      return NextResponse.json(
        { message: "Market not found" },
        { status: 404 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password", hashedPassword);
    // Create user with vendor relationship
    console.log("Database URL:", process.env.DATABASE_URL);
    const user = await prisma.user.create({
      data: {
        password: hashedPassword,
        name,
        email: body.email,
        vendor: {
          create: {
            name,
            phone,
            website,
            market: {
              connect: {
                id: marketId,
              },
            },
          },
        },
      },
      include: {
        vendor: true,
      },
    });

    return NextResponse.json({
      id: user.id,
      phone: user.vendor?.phone,
      name: user.name,
    });
  } catch (error) {
    console.error("Registration error:", JSON.stringify(error));
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
