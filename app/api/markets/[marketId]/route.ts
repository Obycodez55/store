import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const marketId = params.marketId;
    console.log("Fetching market with ID:", marketId); // Debug log

    // Validate marketId
    if (!marketId) {
      console.log("No marketId provided");
      return NextResponse.json(
        { error: "Market ID is required" },
        { status: 400 }
      );
    }

    // Test database connection
    await prisma.$connect();

    // Add debug query
    const marketCount = await prisma.market.count();
    console.log("Total markets in database:", marketCount);

    const market = await prisma.market.findFirst({
      where: {
        id: marketId,
      },
      include: {
        images: true,
        vendors: {
          include: {
            products: true,
          },
        },
      },
    });

    console.log("Found market:", market); // Debug log

    if (!market) {
      console.log("Market not found");
      return NextResponse.json({ error: "Market not found" }, { status: 404 });
    }

    // Ensure we're actually sending data
    // return new NextResponse(JSON.stringify(market), {
    //   status: 200,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    return NextResponse.json(market);
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
