"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { MarketSearch } from "./MarketSearch";
import { useRouter } from "next/navigation";
import { Market } from "@/types/market";
import { UserMenu } from "./UserMenu";
import Link from "next/link";

export default function Header({ markets = [] }: { markets: Market[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleMarketSelect = (market: Market) => {
    router.push(`/markets/${market.id}`);
  };

  return (
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
          <Link href="/">
            <h1 className="font-bold font-display text-2xl">
              Market<span className="text-primary">Place</span>
            </h1>
          </Link>
        </motion.div>

        <div className="flex-grow mx-8 max-w-2xl">
          <MarketSearch
            markets={Array.isArray(markets) ? markets : []}
            onMarketSelect={handleMarketSelect}
            onSuggestMarket={() => {}}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 mr-4"
        >
          <Link href="/products" className="btn-secondary">
            Browse Products
          </Link>
          <Link href="/dashboard" className="btn-secondary">
            Dashboard
          </Link>
        </motion.div>

        <UserMenu />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex justify-between items-center p-4">
          <Link href="/">
            <h1 className="font-bold font-display text-xl">
              Market<span className="text-primary">Place</span>
            </h1>
          </Link>
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
                  onSuggestMarket={() => {}}
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-2 w-full"
              >
                <Link
                  href="/products"
                  className="justify-center w-full btn-secondary"
                >
                  Browse Products
                </Link>
                <Link
                  href="/dashboard"
                  className="justify-center w-full btn-secondary"
                >
                  Dashboard
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
  );
}
