import React from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
};

const MarketCard = (props: Props) => {
  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <a
          href={`/markets/${props.id}`}
          className="relative w-full pt-[66.67%] overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-200" />
          <Image
            src={props.image}
            alt={props.name}
            width={400}
            height={300}
            className="absolute inset-0 w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
          />
          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
          {/* Location badge */}
          <span className="absolute top-3 right-3 px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {props.location}
          </span>
        </a>

        <div className="flex flex-col flex-grow p-4">
          <div className="space-y-2">
            <h2 className="text-lg font-display font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {props.name}
            </h2>
            <p className="text-muted-foreground text-sm line-clamp-3">
              {props.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-secondary group"
            >
              <span className="group-hover:text-primary transition-colors">
                View Details
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketCard;
