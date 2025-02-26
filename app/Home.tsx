"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import MarketCard from "./components/MarketCard";
import { MarketSearch } from "./components/MarketSearch";
import { useRouter } from "next/navigation";
import { SuggestMarketModal } from "./components/MarketSuggestModal";
import { useMarkets } from "./hooks/useMarkets";
import { Market } from "@/types/market";
import { PageTransition } from "./components/PageTransition";
import { UserMenu } from "./components/UserMenu";
import { LoadingGrid } from "./components/LoadingGrid";
import Link from "next/link";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="top-0 z-50 sticky bg-card shadow-sm border-b border-border w-full"
        >
          {/* Desktop Navigation */}
          <div className="md:flex justify-between items-center hidden mx-auto px-6 py-4 w-full max-w-7xl">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 cursor-pointer"
            >
              <h1 className="font-bold font-display text-2xl">
                Market<span className="text-primary">Place</span>
              </h1>
            </motion.div>

            <div className="flex-grow mx-8 max-w-2xl">
              <MarketSearch
                markets={Array.isArray(markets) ? markets : []}
                onMarketSelect={handleMarketSelect}
                onSuggestMarket={() => setShowSuggestionModal(true)}
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mr-4"
            >
              <Link href="/products" className="btn-secondary">
                Browse Products
              </Link>
            </motion.div>

            <UserMenu />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex justify-between items-center p-4">
              <h1 className="font-bold font-display text-xl">
                Market<span className="text-primary">Place</span>
              </h1>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 btn-secondary"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 px-4 pb-4 border-t border-border w-full overflow-hidden"
                >
                  <div className="w-full">
                    <MarketSearch
                      markets={Array.isArray(markets) ? markets : []}
                      onMarketSelect={handleMarketSelect}
                      onSuggestMarket={() => setShowSuggestionModal(true)}
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full"
                  >
                    <Link
                      href="/products"
                      className="justify-center w-full btn-secondary"
                    >
                      Browse Products
                    </Link>
                  </motion.div>
                  <div className="w-full">
                    <UserMenu />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-b from-primary-50 dark:from-primary-950/10 to-background dark:to-background py-12"
        >
          <div className="mx-auto px-4 text-center container">
            <h1 className="mb-4 font-bold font-display text-4xl text-primary-950 md:text-5xl lg:text-6xl dark:text-primary-50">
              Discover Local Markets
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
              Find and explore the best local markets in your area. From fresh
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
