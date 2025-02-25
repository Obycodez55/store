"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMarketDays } from "@/app/utils/getMarketDays";
import moment from "moment";
import { subscribe } from "@/app/utils/subscribe";
import { MarketDaysDisplay } from "@/app/components/MarketDays";
import ProductCard from "@/app/components/ProductCard";
import { MapPin, Calendar, Info, Package } from "lucide-react";
import { PageTransition } from "@/app/components/PageTransition";
import { UserMenu } from "@/app/components/UserMenu";
import Link from "next/link";
import { Market, Product, Vendor } from "@prisma/client";

type ExtendedMarket = Market & {
  images: { url: string }[];
  vendors: (Vendor & {
    products: Product[];
  })[];
};

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

export function MarketContent({
  initialMarket,
}: {
  initialMarket: ExtendedMarket;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Market days calculation
  const {
    interval,
    lastMarketDay,
    nextMarketDay,
    formattedLastMarketDay,
    formattedNextMarketDay,
  } = useMemo(() => {
    if (!initialMarket?.prevDate || !initialMarket?.nextDate)
      return {
        lastMarketDay: null,
        nextMarketDay: null,
        formattedLastMarketDay: "",
        formattedNextMarketDay: "",
      };

    const { lastMarketDay, nextMarketDay, interval } = getMarketDays(
      moment(initialMarket.prevDate).format("YYYY-MM-DD"),
      moment(initialMarket.nextDate).format("YYYY-MM-DD")
    );

    return {
      interval,
      lastMarketDay,
      nextMarketDay,
      formattedLastMarketDay: moment(lastMarketDay).format("MMMM DD, YYYY"),
      formattedNextMarketDay: moment(nextMarketDay).format("MMMM DD, YYYY"),
    };
  }, [initialMarket]);

  const subscribeToMarketDays = useCallback(() => {
    if (!initialMarket) return;
    subscribe({
      prevDate: lastMarketDay || "",
      nextDate: nextMarketDay || "",
      summary: `${initialMarket.name} Market Event`,
      description: initialMarket.description || "No description available",
    });
  }, [lastMarketDay, nextMarketDay, initialMarket]);

  // Image slideshow
  useEffect(() => {
    if (!initialMarket?.images?.length) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % initialMarket.images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [initialMarket?.images?.length]);

  // Flatten products from vendors
  const products = useMemo(() => {
    return initialMarket.vendors.flatMap((vendor) =>
      vendor.products.map((product) => ({
        ...product,
        vendor: {
          ...vendor,
          market: {
            id: initialMarket.id,
            name: initialMarket.name,
            location: initialMarket.location,
          },
        },
      }))
    );
  }, [initialMarket]);

  return (
    <PageTransition>
      {/* Rest of your component JSX remains the same, just use initialMarket instead of market */}
      {/* ... existing JSX code ... */}
    </PageTransition>
  );
}
