import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {

        const products = await prisma.product.findMany({
            include: {
                vendor: {
                    include: {
                        market: true
                    }
                }
            }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
