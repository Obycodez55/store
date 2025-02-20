import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: any
) {
  try {
    // Ensure marketId is valid
    if (!params.marketId) {
      return NextResponse.json(
        { error: "Market ID is required" },
        { status: 400 }
      );
    }

    const market = await prisma.market.findUnique({
      where: { id: params.marketId },
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
      return NextResponse.json(
        { error: "Market not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(market, { status: 200 });
  } catch (error) {
    console.error("Error fetching market:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
