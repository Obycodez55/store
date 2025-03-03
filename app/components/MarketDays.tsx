import moment from "moment";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Bell } from "lucide-react";

interface MarketDaysDisplayProps {
  interval: number;
  lastMarketDay: string;
  nextMarketDay: string;
  intervalDisplay: string;
  onSubscribe: () => void;
}

export const MarketDaysDisplay: React.FC<MarketDaysDisplayProps> = ({
  interval,
  lastMarketDay,
  nextMarketDay,
  intervalDisplay,
  onSubscribe,
}) => {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference =
        new Date(nextMarketDay).getTime() - new Date().getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft("Market Day is here!");
      }
    };

    calculateTimeLeft();
    // Update every second instead of every minute
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [nextMarketDay]);

  return (
    <div className="space-y-6">
      {/* Countdown Timer */}
      <div className="space-y-4 bg-primary/5 p-6 rounded-lg">
        <div className="flex items-center gap-2 text-primary">
          <Clock className="w-5 h-5" />
          <h3 className="font-display font-semibold text-lg">
            Next Market Day
          </h3>
        </div>
        <div className="font-bold font-display text-3xl text-foreground">
          {timeLeft}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSubscribe}
          className="flex justify-center items-center gap-2 w-full btn-primary"
        >
          <Bell className="w-4 h-4" />
          Subscribe to Updates
        </motion.button>
      </div>

      {/* Market Schedule */}
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-3">
        <div className="bg-card p-4 border border-border rounded-lg">
          <div className="flex flex-col items-center space-y-2 text-center">
            <span className="text-muted-foreground text-sm">Interval</span>
            <span className="font-bold font-display text-2xl text-foreground">
              {intervalDisplay} Days
            </span>
          </div>
        </div>

        <div className="bg-card p-4 border border-border rounded-lg">
          <div className="flex flex-col items-center space-y-2 text-center">
            <span className="text-muted-foreground text-sm">Last Market</span>
            <span className="font-medium text-foreground text-lg">
              {moment(lastMarketDay).format("MMM DD")}
            </span>
          </div>
        </div>

        <div className="bg-card p-4 border border-border rounded-lg">
          <div className="flex flex-col items-center space-y-2 text-center">
            <span className="text-muted-foreground text-sm">Next Market</span>
            <span className="font-medium text-foreground text-lg">
              {moment(nextMarketDay).format("MMM DD")}
            </span>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-card p-4 border border-border rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-lg">
            Upcoming Market Days
          </h3>
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => {
            const date = moment(nextMarketDay)
              .add(i * interval, "days")
              .format("MMMM DD, YYYY");
            return (
              <div
                key={i}
                className="flex justify-between items-center last:border-0 py-2 border-b border-border"
              >
                <span className="text-foreground">{date}</span>
                <span className="text-muted-foreground text-sm">
                  {moment(date).format("dddd")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketDaysDisplay;
