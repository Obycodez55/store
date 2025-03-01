import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/market";
import axios from "axios";

interface SearchResponse {
  products: Product[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export function useProductSearch(query: string, page = 1, marketId?: string) {
  return useQuery<SearchResponse>({
    queryKey: ["products", "search", query, page, marketId],
    queryFn: async () => {
      try {
        const response = await axios.get(`/api/products/search`, {
          params: {
            q: query,
            page,
            limit: 20,
            marketId,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Product search error:", error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
