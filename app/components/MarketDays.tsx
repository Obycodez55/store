import moment from 'moment';
import React, { useState, useEffect } from 'react';

interface MarketDaysDisplayProps {
  interval: number;
  lastMarketDay: string;
  nextMarketDay: string;
  onSubscribe: () => void;
}

export const MarketDaysDisplay: React.FC<MarketDaysDisplayProps> = ({ 
  interval, 
  lastMarketDay, 
  nextMarketDay,
  onSubscribe
}) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(nextMarketDay).getTime() - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('Market Day is here!');
      }
    };

    calculateTimeLeft();
    // Update every second instead of every minute
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [nextMarketDay]);

  return (
    <div className="w-full bg-gray-50 pt-24 pb-36 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Market Interval */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-medium text-gray-900">Trading Interval</h3>
            <p className="mt-2 text-2xl font-bold text-indigo-600">
              Every {interval} Days
            </p>
          </div>

          {/* Last Market Day */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-medium text-gray-900">Last Market Day</h3>
            <p className="mt-2 text-2xl font-bold text-green-600">
                {moment(lastMarketDay).format('MMMM Do YYYY')}
            </p>
          </div>

          {/* Next Market Day */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-medium text-gray-900">Next Market Day</h3>
            <p className="mt-2 text-2xl font-bold text-blue-600">
                {moment(nextMarketDay).format('MMMM Do YYYY')}
            </p>
          </div>

          {/* Subscribe Button */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col justify-center">
           <button
              onClick={onSubscribe}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Subscribe to Market Days
            </button>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-4">Time Until Next Market Day</h3>
          <div className="text-4xl font-bold text-indigo-600">
            {timeLeft}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDaysDisplay;