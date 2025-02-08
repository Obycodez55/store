import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const markets = await prisma.market.findMany({
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
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch markets" }, { status: 500 });
    }
}
