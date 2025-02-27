"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MarketCard from "./components/MarketCard";
import { useRouter } from "next/navigation";
import { SuggestMarketModal } from "./components/MarketSuggestModal";
import { useMarkets } from "./hooks/useMarkets";
import { Market } from "@/types/market";
import { PageTransition } from "./components/PageTransition";
import { LoadingGrid } from "./components/LoadingGrid";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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

// Types
type MarketData = {
  name: string;
  description: string;
  location: string;
  prevDate: string;
  nextDate: string;
};

export default function Home() {
  const { data: markets, isLoading: marketsIsLoading } = useMarkets();
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const router = useRouter();

  const handleMarketSelect = (market: Market) => {
    router.push(`/markets/${market.id}`);
  };

  const handleSubmitMarket = (marketData: MarketData) => {
    console.log(marketData);
  };

  return (
    <PageTransition>
      <div className="bg-background w-full min-h-screen">
        <AnimatePresence>
          {showSuggestionModal && (
            <SuggestMarketModal
              isOpen={showSuggestionModal}
              onClose={() => setShowSuggestionModal(false)}
              onSubmit={handleSubmitMarket}
            />
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-b from-primary-50 dark:from-primary-950/10 to-background dark:to-background py-12"
        >
          <div className="mx-auto px-4 text-center container">
            <h1 className="mb-4 font-bold font-display text-4xl text-primary-950 md:text-5xl lg:text-6xl dark:text-primary-50">
              Discover Local Markets In Ibadan
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              Find and explore the best local markets in Ibadan. From fresh
              produce to handmade crafts.
            </p>
          </div>
        </motion.section>

        {/* Main Content */}
        <main className="mx-auto px-4 py-8 container">
          {/* Filters Section */}
          <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 mb-8">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-display font-semibold text-2xl text-foreground"
            >
              Featured Markets
            </motion.h2>
          </div>

          {/* Markets Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
          >
            {marketsIsLoading ? (
              <LoadingGrid />
            ) : (
              markets?.map((market: any) => (
                <motion.div
                  key={market.id}
                  variants={itemVariants}
                  className="h-full"
                >
                  <MarketCard
                    id={market.id}
                    name={market.name}
                    description={market.description}
                    image={market.image}
                    location={market.location}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
