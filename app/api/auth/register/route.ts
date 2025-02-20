import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, marketId, website, phone } = body

    // Validate input
    if (!email || !password || !marketId) {
      return NextResponse.json(
        { message: "Email, password and market ID are required" },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      )
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Verify market exists
    const market = await prisma.market.findUnique({
      where: { id: marketId }
    })

    if (!market) {
      return NextResponse.json(
        { message: "Market not found" },
        { status: 404 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with vendor relationship
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        vendor: {
          create: {
            name,
            email,
            website,
            phone,
            market: {
              connect: {
                id: marketId
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      id: user.id,
      email: user.email
    }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}