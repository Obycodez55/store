import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  try {
    // Ensure marketId is valid
    if (!params.marketId) {
      return NextResponse.json(
        { error: "Market ID is required" },
        { status: 400 }
      );
    }

    const marketProducts = await prisma.product.findMany({
      where: {
        vendor: {
          market: {
            id: params.marketId,
          },
        },
      },
      include: {
        vendor: {
          include: {
            market: true,
          },
        },
      },
    });
    if (!marketProducts) {
      return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }

    return NextResponse.json(marketProducts, { status: 200 });
  } catch (error) {
    console.error("Error fetching market products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
