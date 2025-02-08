import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { marketId: string } }) {
    try {
        const market = await prisma.market.findUnique({
            where: { id: params.marketId },
            include: {
                images: true,
                vendors: {
                    include: {
                        products: true
                    }
                }
            }
        });

        if (!market) {
            return NextResponse.json({ error: "Market not found" }, { status: 404 });
        }

        return NextResponse.json(market);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch market" }, { status: 500 });
    }
}
