import { Market, Product } from "@/types/market";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchMarkets = async () => {
  const res = await axios.get("/api/markets");
  if (res.status !== 200) throw new Error("Failed to fetch markets");
  return res.data;
};

const fetchById = async (id: string) => {
  const res = await axios.get(`/api/markets/${id}`);
  if (res.status !== 200) throw new Error("Failed to fetch market");
  return res.data;
};

export function useMarkets(): ReturnType<typeof useQuery<Market[]>>;
export function useMarkets(id: string): ReturnType<typeof useQuery<Market>>;
export function useMarkets(id?: string) {
  return useQuery({
    queryKey: id ? ["market", id] : ["markets"],
    queryFn: id ? () => fetchById(id) : fetchMarkets,
    staleTime: 10 * 60 * 1000, // 10 min caching
    retry: 2, // Retry up to 2 times
  });
}

const fetchProducts = async () => {
  const res = await axios.get("/api/products");
  if (res.status !== 200) throw new Error("Failed to fetch products");
  return res.data;
};


export function useProducts(): ReturnType<typeof useQuery<Product[]>>;
export function useProducts(id: string): ReturnType<typeof useQuery<Product>>;
export function useProducts(id?: string) {
  return useQuery({
    queryKey: id ? ["product", id] : ["products"],
    queryFn: id ? () => fetchById(id) : fetchProducts,
    staleTime: 10 * 60 * 1000, // 10 min caching
    retry: 2, // Retry up to 2 times
  });
}
