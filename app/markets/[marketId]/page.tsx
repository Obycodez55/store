"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { getMarketDays } from "@/app/utils/getMarketDays";
import moment from "moment";
import { subscribe } from "@/app/utils/subscribe";
import { MarketDaysDisplay } from "@/app/components/MarketDays";
import { useMarkets, useProducts } from "@/app/hooks/useMarkets";
import ProductCard from "@/app/components/ProductCard";
import { MapPin, Calendar, Info, Package } from "lucide-react";
import { PageTransition } from "@/app/components/PageTransition";
import { UserMenu } from "@/app/components/UserMenu";
import ProductCardSkeleton from "@/app/components/ProductCardSkeleton";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4
    }
  }
};

const Market = () => {
  const { marketId } = useParams();
  const { data: market, isLoading: marketLoading } = useQuery({
    queryKey: ["market", marketId],
    queryFn: async () => {
      const response = await fetch(`/api/markets/${marketId}`);
      if (!response.ok) throw new Error("Failed to fetch market");
      return response.json();
    }
  });
  const { data: products, isLoading: productsLoading } = useProducts();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter products for this market
  const marketProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => product.vendor.market.id === marketId);
  }, [products, marketId]);

  // Market days calculation
  const {
    interval,
    lastMarketDay,
    nextMarketDay,
    formattedLastMarketDay,
    formattedNextMarketDay
  } = useMemo(() => {
    if (!market?.prevDate || !market?.nextDate)
      return {
        lastMarketDay: null,
        nextMarketDay: null,
        formattedLastMarketDay: "",
        formattedNextMarketDay: ""
      };

    const { lastMarketDay, nextMarketDay, interval } = getMarketDays(
      moment(market.prevDate).format("YYYY-MM-DD"),
      moment(market.nextDate).format("YYYY-MM-DD")
    );

    return {
      interval,
      lastMarketDay,
      nextMarketDay,
      formattedLastMarketDay: moment(lastMarketDay).format("MMMM DD, YYYY"),
      formattedNextMarketDay: moment(nextMarketDay).format("MMMM DD, YYYY")
    };
  }, [market]);

  const subscribeToMarketDays = useCallback(() => {
    if (!market) return;
    subscribe({
      prevDate: lastMarketDay || "",
      nextDate: nextMarketDay || "",
      summary: `${market.name} Market Event`,
      description: market.description || "No description available"
    });
  }, [lastMarketDay, nextMarketDay, market]);

  // Image slideshow
  useEffect(() => {
    if (!market?.images?.length) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % market.images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [market?.images?.length]);

  if (marketLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-muted" />
            <div className="container mx-auto px-4 space-y-8">
              <div className="h-8 bg-muted w-1/3 rounded" />
              <div className="space-y-4">
                <div className="h-4 bg-muted w-1/4 rounded" />
                <div className="h-4 bg-muted w-1/2 rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!market) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Market not found
          </h1>
          <p className="text-muted-foreground">
            The market you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/" className="btn-primary inline-flex">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Hero Section with Image Slider */}
        <div className="relative h-[60vh] md:h-[70vh]">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <motion.a
                  href="/"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <span className="text-xl font-display font-bold">
                    Market<span className="text-primary-300">Place</span>
                  </span>
                </motion.a>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="order-last md:order-none"
                >
                  <Link
                    href="/products"
                    className="btn-secondary bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    Browse Products
                  </Link>
                </motion.div>
                <UserMenu />
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={market.images[currentImageIndex]?.url}
              alt={market.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30">
            <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-white space-y-4"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
                  {market.name}
                </h1>
                <div className="flex items-center gap-4 text-white/80">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {market.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Every {interval} days
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Market Information */}
        <section className="py-12 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Info className="h-5 w-5" />
                  <h2 className="text-2xl font-display font-semibold">
                    About the Market
                  </h2>
                </div>
                <p className="text-muted-foreground">{market.description}</p>
              </div>

              <MarketDaysDisplay
                interval={interval!}
                lastMarketDay={formattedLastMarketDay}
                nextMarketDay={formattedNextMarketDay}
                onSubscribe={subscribeToMarketDays}
              />
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary">
                  <Package className="h-5 w-5" />
                  <h2 className="text-2xl font-display font-semibold">
                    Available Products
                  </h2>
                </div>
                {/* Add filters/search here if needed */}
              </div>

              {productsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <motion.div
                        key={i}
                        variants={itemVariants}
                        className="animate-pulse"
                      >
                        <ProductCardSkeleton />
                      </motion.div>
                    ))}
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {marketProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      className="h-full"
                    >
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        description={product.description || ""}
                        price={product.price}
                        image={product.image || ""}
                        category={product.tags}
                        vendor={{
                          name: product.vendor.name,
                          email: product.vendor.email ?? undefined,
                          phone: product.vendor.phone ?? undefined,
                          website: product.vendor.website ?? undefined,
                          market: {
                            name: market.name,
                            location: market.location
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Market;
