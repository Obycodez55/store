import prisma from "@/lib/prisma";

export async function searchProducts(
  query: string,
  page: number,
  limit: number,
  marketId?: string
) {
  const skip = (page - 1) * limit;

  // Base query conditions
  const where = {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ],
    vendor: marketId
      ? {
          marketId: marketId,
        }
      : undefined,
  };

  // Get total count
  const total = await prisma.product.count({ where });

  // Get paginated products with vendor and market information
  const products = await prisma.product.findMany({
    where,
    include: {
      vendor: {
        select: {
          name: true,
          email: true,
          phone: true,
          website: true,
          market: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  return { products, total };
}
