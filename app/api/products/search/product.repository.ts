import prisma from "@/lib/prisma";
import { Tags } from "@prisma/client";

export const searchProducts = async (query: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const products = await prisma.product.findMany({
        where: {
            ...(query ? {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { tags: { hasSome: query.split(" ") as Tags[] } },
                    { vendor: { name: { contains: query, mode: "insensitive" } } }
                ]
            } : {})
        },
        include: {
            vendor: {
                include: {
                    market: {
                        select: {
                            id: true,
                            name: true,
                            location: true
                        }
                    }
                }
            }
        },
        skip,
        take: limit,
        orderBy: {
            createdAt: "desc"
        }
    });

    const total = await prisma.product.count({
        where: {
            ...(query ? {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { tags: { hasSome: query.split(" ") as Tags[] } },
                    { vendor: { name: { contains: query, mode: "insensitive" } } }
                ]
            } : {})
        }
    });

    return { products, total };
}