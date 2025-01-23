"use client";
import { useCallback, useState } from "react";
import MarketCard from "./components/MarketCard";
import { Markets } from "./data/markets";

export default function Home() {
  const [searchItem, setSearchItem] = useState("");
  const [filteredMarkets, setFilteredMarkets] = useState(Markets);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchItem(e.target.value);
    setFilteredMarkets(
      Markets.filter((market) =>
      market.name.toLowerCase().includes(searchItem.toLowerCase()) ||
      market.description.toLowerCase().includes(searchItem.toLowerCase()) ||
      market.location.toLowerCase().includes(searchItem.toLowerCase())
      )
    );
  },[searchItem]);


  return (
    <div className="min-h-screen my-8">
      {/* Search Box */}
      <div className="flex flex-col items-center justify-center w-full">
        <input
          type="text"
          className="w-1/2 p-2 text-lg border border-gray-300 rounded-lg"
          placeholder="Search for a Market"
          value={searchItem}
          onChange={handleSearchChange}
        />
      </div>
      <div className="grid grid-cols-3 gap-6 p-4">
        {/* Market List */}
        {filteredMarkets.map((market) => (
          <MarketCard
            key={market.id}
            id={market.id}
            name={market.name}
            description={market.description}
            image={market.image}
            location={market.location}
          />
        ))}
      </div>
    </div>
  );
}
