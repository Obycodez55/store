import moment from "moment";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Bell } from "lucide-react";

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
      <div className="bg-primary/5 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Clock className="h-5 w-5" />
          <h3 className="text-lg font-display font-semibold">
            Next Market Day
          </h3>
        </div>
        <div className="text-3xl font-display font-bold text-foreground">
          {timeLeft}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSubscribe}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Bell className="h-4 w-4" />
          Subscribe to Updates
        </motion.button>
      </div>

      {/* Market Schedule */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex flex-col items-center text-center space-y-2">
            <span className="text-muted-foreground text-sm">Interval</span>
            <span className="text-2xl font-display font-bold text-foreground">
              {interval} Days
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex flex-col items-center text-center space-y-2">
            <span className="text-muted-foreground text-sm">Last Market</span>
            <span className="text-lg font-medium text-foreground">
              {moment(lastMarketDay).format("MMM DD")}
            </span>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex flex-col items-center text-center space-y-2">
            <span className="text-muted-foreground text-sm">Next Market</span>
            <span className="text-lg font-medium text-foreground">
              {moment(nextMarketDay).format("MMM DD")}
            </span>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-display font-semibold">
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
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <span className="text-foreground">{date}</span>
                <span className="text-sm text-muted-foreground">
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
