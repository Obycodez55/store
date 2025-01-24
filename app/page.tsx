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
    <div className="min-h-screen w-full">
      <div className="flex w-full h-[70px] bg-white shadow-sm justify-between"> 
        <div className="w-[25%] text-black flex items-center pl-4">
          <h1 className="text-[24px] font-semibold">Market<span className="text-blue-950">Place</span></h1>
        </div>
        {/* Search Box */}
        <div className="flex w-[50%] h-full items-center">
          <input
            type="text"
            className="w-full p-2 text-lg border h-[70%] border-gray-300 rounded-lg"
            placeholder="Search for a Market"
            value={searchItem}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-[25%] flex items-center justify-end gap-4 pr-4">
          <a href="/auth" className="bg-blue-950 text-white rounded-md px-4 py-2 font-semibold text-[18px] ">Login as a Merchant</a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
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
