"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Markets } from "@/app/data/markets";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { getMarketDays } from "@/app/utils/getMarketDays";
import useAuth from "@/app/hooks/useAuth";
import moment from "moment";
import { subscribe } from "@/app/utils/subscribe";

const Market = () => {
  useAuth();
  const { data: session } = useSession();
  const { marketId } = useParams();
  // Read specific parameters



  const market = Markets.find((market) => market.id === marketId);
  const {interval, lastMarketDay, nextMarketDay} = getMarketDays(market!.prevDate, market!.nextDate);
  // Format the dates using moment.js
  const formattedLastMarketDay = moment(lastMarketDay).format("MMMM DD, YYYY");
  const formattedNextMarketDay = moment(nextMarketDay).format("MMMM DD, YYYY");

const subscribeToMarketDays = () => {
    subscribe({
      prevDate: market!.prevDate,
      nextDate: market!.nextDate,
      summary: `${market!.name} Market Event`,
      description: market!.description || 'No description available'
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
  }, []);

  return (
    <div className="">
      <div className="h-screen">
        <div className="relative w-full h-[80%] mx-auto overflow-hidden">
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
      <div className="grid h-screen place-items-center bg-gray-100">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-2">📅 Market Days</h2>
        <p className="text-gray-600">Trading occurs every <strong>{interval} days</strong>.</p>

        <div className="mt-4 space-y-2">
          <p className="text-green-600 font-medium">
            ✅ Last Market Day: {formattedLastMarketDay}
          </p>
          <p className="text-blue-600 font-medium">
            🔜 Next Market Day: {formattedNextMarketDay}
          </p>
        </div>

        <div className="mt-6">
          {!session ? (
            <button
              onClick={() => signIn("google")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Sign in to Subscribe
            </button>
          ) : (
            <button
              onClick={subscribeToMarketDays}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Subscribe to Market Days
            </button>
          )}
        </div>

        {session && (
          <button onClick={() => signOut()} className="text-red-500 mt-4">
            Sign Out
          </button>
        )}
      </div>
    </div>


    </div>
  );
};

export default Market;
