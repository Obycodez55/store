import { prisma } from "@/lib/prisma";
import { Market } from "@/types/market";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const markets: Market[] = await prisma.market.findMany({
            include: {
                images: true,
                vendors: {
                    include: {
                        products: true
                    }
                }
            }
        });
        return NextResponse.json(markets);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch markets" }, { status: 500 });
    }
}
