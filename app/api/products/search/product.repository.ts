import prisma from "@/lib/prisma";
import { Tags } from "@prisma/client";

export const searchProducts = async (query: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;

    // Helper function to validate if a string is a valid Tag
    const isValidTag = (tag: string): tag is Tags => {
        return Object.values(Tags).includes(tag as Tags);
    };

    // Filter and validate tags from the query
    const queryTags = query
        .split(" ")
        .filter(isValidTag);

    const products = await prisma.product.findMany({
        where: {
            ...(query ? {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    ...(queryTags.length > 0 ? [{ tags: { hasSome: queryTags } }] : []),
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
                    ...(queryTags.length > 0 ? [{ tags: { hasSome: queryTags } }] : []),
                    { vendor: { name: { contains: query, mode: "insensitive" } } }
                ]
            } : {})
        }
    });

    return { products, total };
}