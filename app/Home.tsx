"use client";
import { useCallback, useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown, Menu, X } from "lucide-react";
import MarketCard from "./components/MarketCard";
import { signOut } from "next-auth/react";
import { MarketSearch } from "./components/MarketSearch";
import { useRouter } from "next/navigation";
import { SuggestMarketModal } from "./components/MarketSuggestModal";
import debounce from "lodash/debounce";
import { useMarkets } from "./hooks/useMarkets";
import { Market } from "@/types/market";
import moment from "moment";

// Types
type MarketData = {
  name: string;
  description: string;
  location: string;
  prevDate: string;
  nextDate: string;
}

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

// Skeleton Component for loading state
const MarketCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 h-[300px] animate-pulse">
    <div className="w-full h-40 bg-gray-200 rounded-lg mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
    <div className="h-4 bg-gray-200 rounded w-full" />
  </div>
);

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
          sorted = sorted.sort((a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf());
          break;
        case "oldest":
          sorted = sorted.sort((a, b) => moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf());
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
    <div className="min-h-screen w-full bg-gray-50">
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
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full bg-white shadow-sm sticky top-0 z-50"
      >
        {/* Desktop Navigation */}
        <div className="hidden md:flex w-full items-center justify-between py-4 px-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 cursor-pointer"
          >
            <h1 className="text-2xl font-semibold">
              Market<span className="text-blue-950">Place</span>
            </h1>
          </motion.div>

          <div className="flex-grow max-w-2xl mx-8">
            <MarketSearch
              markets={Array.isArray(markets) ? markets : []}
              onMarketSelect={handleMarketSelect}
              onSuggestMarket={() => setShowSuggestionModal(true)}
            />
          </div>

          <div className="flex items-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/auth"
              className="bg-blue-950 text-white rounded-md px-4 py-2 font-semibold text-base hover:bg-blue-900 transition-colors"
            >
              Login
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut({ callbackUrl: "/auth" })}
              className="bg-blue-950 text-white rounded-md px-4 py-2 font-semibold text-base hover:bg-blue-900 transition-colors"
            >
              Logout
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold">
              Market<span className="text-blue-950">Place</span>
            </h1>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
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
                className="px-4 pb-4 space-y-4 overflow-hidden"
              >
                <div className="w-full">
                  <MarketSearch
                    markets={Array.isArray(markets) ? markets : []}
                    onMarketSelect={handleMarketSelect}
                    onSuggestMarket={() => setShowSuggestionModal(true)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <motion.a
                    whileTap={{ scale: 0.95 }}
                    href="/auth"
                    className="bg-blue-950 text-white rounded-md px-4 py-2 font-semibold text-base text-center"
                  >
                    Login
                  </motion.a>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => signOut({ callbackUrl: "/auth" })}
                    className="bg-blue-950 text-white rounded-md px-4 py-2 font-semibold text-base text-center"
                  >
                    Logout
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Filters Section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Discover Markets
          </h2>
          <div className="relative w-full sm:w-64">
            <Listbox value={selectedSort} onChange={setSelectedSort}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedSort.name}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                    {sortOptions.map((option) => (
                      <Listbox.Option
                        key={option.id}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-blue-100 text-blue-900"
                              : "text-gray-900"
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
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(6)
                .fill(0)
                .map((_, index) => <MarketCardSkeleton key={index} />)
            : filteredMarkets.map((market) => (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Number(market.id) * 0.1 }}
                >
                  <MarketCard
                    id={market.id}
                    name={market.name}
                    description={market.description}
                    image={market.image}
                    location={market.location}
                  />
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  );
}
