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
  query: string,
  page?: number,
  marketId?: string
) {
  return useQuery({
    queryKey: ["products", query, page, marketId],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (query) searchParams.set("q", query);
      if (page) searchParams.set("page", String(page));
      if (marketId) searchParams.set("marketId", marketId);

      const response = await fetch(`/api/products?${searchParams.toString()}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    enabled: query !== undefined,
  });
}
