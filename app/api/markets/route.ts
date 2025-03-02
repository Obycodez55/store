import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        vendors: {
          include: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json(markets);
  } catch (error) {
    console.error("Error fetching markets:", JSON.stringify(error));
    return new NextResponse("Internal error", { status: 500 });
  }
}
