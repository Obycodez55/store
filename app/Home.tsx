"use client";
import { useCallback, useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown, Menu, X, MapPin } from "lucide-react";
import MarketCard from "./components/MarketCard";
import { signOut } from "next-auth/react";
import { MarketSearch } from "./components/MarketSearch";
import { useRouter } from "next/navigation";
import { SuggestMarketModal } from "./components/MarketSuggestModal";
import debounce from "lodash/debounce";
import { useMarkets } from "./hooks/useMarkets";
import { Market } from "@/types/market";
import moment from "moment";
import { PageTransition } from "./components/PageTransition";
import { UserMenu } from "./components/UserMenu";
import { LoadingGrid } from "./components/LoadingGrid";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
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

// Types
type MarketData = {
  name: string;
  description: string;
  location: string;
  prevDate: string;
  nextDate: string;
};

type FilterOption = {
  id: string;
  name: string;
  value: string;
};

const sortOptions: FilterOption[] = [
  { id: "1", name: "Newest First", value: "newest" },
  { id: "2", name: "Oldest First", value: "oldest" },
  { id: "3", name: "A-Z", value: "alphabetical" },
  { id: "4", name: "Location", value: "location" }
];

export function Home() {
  const { data: markets, isLoading } = useMarkets();
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const router = useRouter();

  // Debounced sort function
  const sortMarkets = useCallback(
    debounce((option: FilterOption) => {
      let sorted = Array.isArray(markets) ? [...markets] : [];
      switch (option.value) {
        case "newest":
          sorted = sorted.sort(
            (a, b) =>
              moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
          );
          break;
        case "oldest":
          sorted = sorted.sort(
            (a, b) =>
              moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf()
          );
          break;
        case "alphabetical":
          sorted = sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "location":
          sorted = sorted.sort((a, b) => a.location.localeCompare(b.location));
          break;
      }
      setFilteredMarkets(sorted);
    }, 300),
    [markets]
  );

  useEffect(() => {
    sortMarkets(selectedSort);
  }, [selectedSort, sortMarkets]);

  const handleMarketSelect = (market: Market) => {
    router.push(`/markets/${market.id}`);
  };

  const handleSubmitMarket = (marketData: MarketData) => {
    console.log(marketData);
  };

  return (
    <PageTransition>
      <div className="min-h-screen w-full bg-background">
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
          className="w-full bg-card shadow-sm sticky top-0 z-50 border-b border-border"
        >
          {/* Desktop Navigation */}
          <div className="hidden md:flex w-full items-center justify-between py-4 px-6 max-w-7xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 cursor-pointer"
            >
              <h1 className="text-2xl font-display font-bold">
                Market<span className="text-primary">Place</span>
              </h1>
            </motion.div>

            <div className="flex-grow max-w-2xl mx-8">
              <MarketSearch
                markets={Array.isArray(markets) ? markets : []}
                onMarketSelect={handleMarketSelect}
                onSuggestMarket={() => setShowSuggestionModal(true)}
              />
            </div>

            <UserMenu />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-xl font-display font-bold">
                Market<span className="text-primary">Place</span>
              </h1>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="btn-secondary p-2"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
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
                  className="px-4 pb-4 space-y-4 overflow-hidden border-t border-border w-full"
                >
                  <div className="w-full">
                    <MarketSearch
                      markets={Array.isArray(markets) ? markets : []}
                      onMarketSelect={handleMarketSelect}
                      onSuggestMarket={() => setShowSuggestionModal(true)}
                    />
                  </div>
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
          className="bg-gradient-to-b from-primary-50 to-background dark:from-primary-950/10 dark:to-background py-12"
        >
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-950 dark:text-primary-50 mb-4">
              Discover Local Markets
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Find and explore the best local markets in your area. From fresh
              produce to handmade crafts.
            </p>
          </div>
        </motion.section>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Filters Section */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-display font-semibold text-foreground"
            >
              Featured Markets
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative w-full sm:w-64"
            >
              <Listbox value={selectedSort} onChange={setSelectedSort}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-card py-2 pl-3 pr-10 text-left shadow-sm border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:text-sm">
                    <span className="block truncate">{selectedSort.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-card py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                      {sortOptions.map((option) => (
                        <Listbox.Option
                          key={option.id}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-primary/10 text-primary"
                                : "text-foreground"
                            }`
                          }
                          value={option}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {option.name}
                              </span>
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </motion.div>
          </div>

          {/* Markets Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
          >
            {isLoading ? (
              <LoadingGrid />
            ) : (
              filteredMarkets.map((market) => (
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
