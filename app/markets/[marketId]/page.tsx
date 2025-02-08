"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { getMarketDays } from "@/app/utils/getMarketDays";
import moment from "moment";
import { subscribe } from "@/app/utils/subscribe";
import { MarketDaysDisplay } from "@/app/components/MarketDays";
import { useMarkets } from "@/app/hooks/useMarkets";

const Market = () => {
  const { marketId } = useParams();
  console.log(marketId);
  const { data: market, isLoading } = useMarkets(marketId as string);

  // Derived market days
  const {interval, lastMarketDay, nextMarketDay, formattedLastMarketDay, formattedNextMarketDay } = useMemo(() => {
    if (!market?.prevDate || !market?.nextDate) return { lastMarketDay: null, nextMarketDay: null, formattedLastMarketDay: "", formattedNextMarketDay: "" };
    
    const { lastMarketDay, nextMarketDay, interval } = getMarketDays(
      moment(market.prevDate).format("YYYY-MM-DD"),
      moment(market.nextDate).format("YYYY-MM-DD")
    );
    
    return {
      interval,
      lastMarketDay,
      nextMarketDay,
      formattedLastMarketDay: moment(lastMarketDay).format("MMMM DD, YYYY"),
      formattedNextMarketDay: moment(nextMarketDay).format("MMMM DD, YYYY"),
    };
  }, [market]);
  const subscribeToMarketDays = useCallback(() => {
    if (!market) return;
    subscribe({
      prevDate: lastMarketDay || "",
      nextDate: nextMarketDay || "",
      summary: `${market.name} Market Event`,
      description: market.description || "No description available",
    });
  }, [lastMarketDay, nextMarketDay, market]);

  // Slideshow state and logic
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!market?.images?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % market.images.length);
    }, 5000); // 5-second interval

    return () => clearInterval(interval);
  }, [market?.images?.length]);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!market) {
    return <div className="h-screen flex items-center justify-center">Market not found</div>;
  }

  return (
    <div className="h-screen">
      <div className="h-[80%] relative">
        {market?.images?.length > 0 && (
          <div className="relative w-full h-full mx-auto overflow-hidden">
            <AnimatePresence>
              <motion.img
                key={market.images[currentIndex]?.id}
                src={market.images[currentIndex]?.url}
                alt={`Slide ${currentIndex}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>
        )}
        <div className="absolute flex flex-col justify-center items-center top-0 w-full h-[80%] mx-auto overflow-hidden text-white bg-[#292727] opacity-65">
          <h1 className="text-[3rem] font-sans font-bold">{market.name}</h1>
          <h1>{market.description}</h1>
        </div>
      </div>

      <MarketDaysDisplay
        interval={interval!}
        lastMarketDay={formattedLastMarketDay}
        nextMarketDay={formattedNextMarketDay}
        onSubscribe={subscribeToMarketDays}
      />
    </div>
  );
};

export default Market;
