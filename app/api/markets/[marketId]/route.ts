import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: any // Correct way to extract params
) {
  try {
    const context = await params;
    const marketId = context.marketId;
    // Ensure marketId is valid
    if (!marketId) {
      return NextResponse.json(
        { error: "Market ID is required" },
        { status: 400 }
      );
    }

    const market = await prisma.market.findFirst({
      where: { id: marketId }, // Ensure it's correctly formatted
      include: {
        images: true,
        vendors: {
          include: {
            products: true,
          },
        },
      },
    });
    if (!market) {
      return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }
    return NextResponse.json(JSON.stringify(market));
  } catch (error) {
    console.error("Error fetching market:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
