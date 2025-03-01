import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/market";

interface SearchResponse {
  products: Product[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export function useProductSearch(
  searchQuery?: string,
  page?: number,
  marketId?: string
) {
  const queryKey = ["products", searchQuery, page, marketId];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (searchQuery) searchParams.set("q", searchQuery);
      if (page) searchParams.set("page", String(page));
      if (marketId) searchParams.set("marketId", marketId);

      const response = await fetch(`/api/products?${searchParams.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch products");

      const products = await response.json();
      return products;
    },
    select: (data) => ({
      ...data,
      products: data.products.map((product: any) => ({
        ...product,
        images: product.images || [], // Ensure images is always an array
      })),
    }),
  });
}
