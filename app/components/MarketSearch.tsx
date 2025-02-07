import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus } from 'lucide-react';
import { Markets } from '../data/markets';


export type Market = typeof Markets[0]; 

interface MarketSearchProps {
  markets: Market[];
  onMarketSelect: (market: Market) => void;
  onSuggestMarket: () => void;
}

export const MarketSearch: React.FC<MarketSearchProps> = ({
  markets,
  onMarketSelect,
  onSuggestMarket
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter markets based on search term
  useEffect(() => {
    const filtered = markets.filter(market =>
      market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      market.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMarkets(filtered);
  }, [searchTerm, markets]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleMarketClick = (market: Market) => {
    onMarketSelect(market);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleSuggestMarket = () => {
    onSuggestMarket();
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="Search markets..."
          className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {filteredMarkets.length > 0 ? (
            <div className="py-2">
              {filteredMarkets.map((market) => (
                <button
                  key={market.id}
                  onClick={() => handleMarketClick(market)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                >
                  <div className="font-medium">{market.name}</div>
                  <div className="text-sm text-gray-500">{market.location}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-2">
              <div className="px-4 py-2 text-sm text-gray-500">
                No markets found
              </div>
              <button
                onClick={handleSuggestMarket}
                className="w-full px-4 py-2 text-left text-indigo-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Suggest a new market</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
