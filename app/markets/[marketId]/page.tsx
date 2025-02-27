"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { getMarketDays } from "@/app/utils/getMarketDays";
import moment from "moment";
import { subscribe } from "@/app/utils/subscribe";
import { MarketDaysDisplay } from "@/app/components/MarketDays";
import { ProductCard } from "@/app/components/ProductCard";
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
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
    },
  },
};

const Market = () => {
  // New state to prevent hydration issues

  const { marketId } = useParams();
  const { data: market, isLoading: marketLoading } = useQuery({
    queryKey: ["market", marketId],
    queryFn: async () => {
      if (!marketId) return null;
      const response = await fetch(`/api/markets/${marketId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch market");
      return data;
    },
    retry: false, // Prevent infinite retries
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });

  useEffect(() => {
    console.log({ market });
  }, [market]);

  const productsLoading = false;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter products for this market
  const marketProducts = useMemo(() => {
    if (!market) {
      return [];
    }
    return market.vendors.flatMap((vendor: any) => {
      return vendor.products.map((product: any) => ({
        ...product,
        vendor: {
          name: vendor.name,
          email: vendor.email,
          phone: vendor.phone,
          website: vendor.website,
        },
      }));
    });
  }, [market]);
  // Market days calculation
  const marketDays = useMemo(() => {
    if (!market?.prevDate || !market?.nextDate) {
      return {
        interval: null,
        lastMarketDay: null,
        nextMarketDay: null,
        formattedLastMarketDay: "",
        formattedNextMarketDay: "",
      };
    }

    // Use current date if the dates are invalid (1970)
    const prevDate = new Date(market.prevDate);
    const nextDate = new Date(market.nextDate);

    const useCurrentDate =
      prevDate.getFullYear() === 1970 || nextDate.getFullYear() === 1970;

    if (useCurrentDate) {
      const today = new Date();
      return {
        interval: 7, // default to weekly
        lastMarketDay: today,
        nextMarketDay: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        formattedLastMarketDay: moment(today).format("MMMM DD, YYYY"),
        formattedNextMarketDay: moment(today)
          .add(7, "days")
          .format("MMMM DD, YYYY"),
      };
    }

    const { lastMarketDay, nextMarketDay, interval } = getMarketDays(
      moment(prevDate).format("YYYY-MM-DD"),
      moment(nextDate).format("YYYY-MM-DD")
    );

    return {
      interval,
      lastMarketDay,
      nextMarketDay,
      formattedLastMarketDay: moment(lastMarketDay).format("MMMM DD, YYYY"),
      formattedNextMarketDay: moment(nextMarketDay).format("MMMM DD, YYYY"),
    };
  }, [market?.prevDate, market?.nextDate]);

  const subscribeToMarketDays = useCallback(() => {
    if (!market) return;
    subscribe({
      prevDate: marketDays.lastMarketDay?.toString() || "",
      nextDate: marketDays.nextMarketDay?.toString() || "",
      summary: `${market.name} Market Event`,
      description: market.description || "No description available",
    });
  }, [marketDays.lastMarketDay, marketDays.nextMarketDay, market]);

  // Image slideshow
  useEffect(() => {
    if (!market?.images?.length || market.images.length <= 1) return;

    const imageCount = market.images.length;
    let timeoutId: NodeJS.Timeout;

    const rotateImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % imageCount);
      timeoutId = setTimeout(rotateImage, 5000);
    };

    timeoutId = setTimeout(rotateImage, 5000);
    return () => clearTimeout(timeoutId);
  }, [market?.images?.length]);

  if (marketLoading) {
    return (
      <PageTransition>
        <div className="bg-background min-h-screen">
          <div className="space-y-8 animate-pulse">
            <div className="bg-muted h-96" />
            <div className="space-y-8 mx-auto px-4 container">
              <div className="bg-muted rounded w-1/3 h-8" />
              <div className="space-y-4">
                <div className="bg-muted rounded w-1/4 h-4" />
                <div className="bg-muted rounded w-1/2 h-4" />
              </div>
              <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="space-y-4 text-center">
          <h1 className="font-bold font-display text-2xl text-foreground">
            Market not found
          </h1>
          <p className="text-muted-foreground">
            The market you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/" className="inline-flex btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="bg-background min-h-screen">
        {/* Hero Section with Image Slider */}
        <div className="relative h-[60vh] md:h-[70vh]">
          {/* Header */}
          {/* <div className="top-0 right-0 left-0 z-10 absolute bg-gradient-to-b from-black/60 to-transparent">
            <div className="mx-auto px-4 py-4 container">
              <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4">
                <motion.a
                  href="/"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <span className="font-bold font-display text-xl">
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
                    className="border-white/20 bg-white/10 hover:bg-white/20 text-white btn-secondary"
                  >
                    Browse Products
                  </Link>
                </motion.div>
                <UserMenu />
              </div>
            </div>
          </div> */}

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
            <div className="flex flex-col justify-end mx-auto px-4 pb-12 h-full container">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="space-y-4 text-white"
              >
                <h1 className="font-bold font-display text-4xl md:text-5xl lg:text-6xl">
                  {market.name}
                </h1>
                <div className="flex items-center gap-4 text-white/80">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {market.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Every {marketDays.interval} days
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Market Information */}
        <section className="border-y bg-card py-12 border-border">
          <div className="mx-auto px-4 container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="gap-8 grid md:grid-cols-2"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Info className="w-5 h-5" />
                  <h2 className="font-display font-semibold text-2xl">
                    About the Market
                  </h2>
                </div>
                <p className="text-muted-foreground">{market.description}</p>
              </div>

              <MarketDaysDisplay
                interval={marketDays.interval!}
                lastMarketDay={marketDays.formattedLastMarketDay}
                nextMarketDay={marketDays.formattedNextMarketDay}
                onSubscribe={subscribeToMarketDays}
              />
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="mx-auto px-4 container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-primary">
                  <Package className="w-5 h-5" />
                  <h2 className="font-display font-semibold text-2xl">
                    Available Products
                  </h2>
                </div>
                {/* Add filters/search here if needed */}
              </div>

              {productsLoading ? (
                <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                  className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {marketProducts.map((product: any) => (
                    <motion.div
                      key={product.id}
                      variants={itemVariants}
                      className="h-full"
                    >
                      <ProductCard product={product} />
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
