import { useQuery } from "@tanstack/react-query";

export function useMarkets() {
  return useQuery({
    queryKey: ["markets"],
    queryFn: async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch("/api/markets", {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch markets: ${response.status}`);
        }

        return await response.json();
      } catch (err) {
        console.error("Error fetching markets:", err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProducts(marketId: string) {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        console.log("Fetching products data");
        const controller = new AbortController();
        // const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`/api/products?marketId=${marketId}`, {
          signal: controller.signal,
        });

        // clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        console.log("Products received:", data.length);
        return data;
      } catch (err) {
        console.error("Error fetching products:", err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
