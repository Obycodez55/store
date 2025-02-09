import { NextResponse } from "next/server";
import { searchProducts } from "./product.repository";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        console.log({ query });

        const { products, total } = await searchProducts(query, page, limit);


        return NextResponse.json({
            products: products || [],
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        });
    } catch (error) {
        console.error("Product search error:", error);
        return NextResponse.json(
            { error: "Failed to search products", products: [] },
            { status: 500 }
        );
    }
} 