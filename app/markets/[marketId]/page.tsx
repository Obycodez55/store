"use client";
import { Markets } from "@/data/markets";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { getMarketDays } from "@/app/utils/getMarketDays";
import moment from "moment";
import { subscribe } from "@/app/utils/subscribe";
import { MarketDaysDisplay } from "@/app/components/MarketDays";

const Market = () => {
  const { marketId } = useParams();
  // Read specific parameters

  const market = Markets.find((market) => market.id === marketId);
  const { lastMarketDay, nextMarketDay } = getMarketDays(
    market!.prevDate,
    market!.nextDate
  );
  // Format the dates using moment.js
  const formattedLastMarketDay = moment(lastMarketDay).format("MMMM DD, YYYY");
  const formattedNextMarketDay = moment(nextMarketDay).format("MMMM DD, YYYY");

  const subscribeToMarketDays = () => {
    subscribe({
      prevDate: lastMarketDay,
      nextDate: nextMarketDay,
      summary: `${market!.name} Market Event`,
      description: market!.description || "No description available"
    });
  };

  //slideshow images
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % market!.images!.length!);
    }, 5000); // 1 second interval

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [market]);

  return (
    <div className="h-screen">
      <div className="h-[80%]">
        <div className="relative w-full h-full mx-auto overflow-hidden">
          <AnimatePresence>
            <motion.img
              key={market?.images![currentIndex]}
              src={market?.images![currentIndex]}
              alt={`Slide ${currentIndex}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>
        <div className="absolute flex flex-col justify-center items-center top-0 w-full h-[80%] mx-auto overflow-hidden text-white bg-[#292727] opacity-65">
          <h1 className="text-[3rem] font-sans font-bold">{market?.name}</h1>
          <h1>{market?.description}</h1>
        </div>
      </div>

      <MarketDaysDisplay
        interval={7}
        lastMarketDay={formattedLastMarketDay}
        nextMarketDay={formattedNextMarketDay}
        onSubscribe={subscribeToMarketDays}
      />
    </div>
  );
};

export default Market;
