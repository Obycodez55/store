import React from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
      <div className="flex flex-col bg-card shadow-sm hover:shadow-md border border-border rounded-lg h-full transition-shadow duration-200 overflow-hidden">
        <Link
          href={`/markets/${props.id}`}
          className="relative pt-[66.67%] w-full overflow-hidden"
        >
          <div className="group-hover:bg-black/20 absolute inset-0 bg-black/5 transition-colors duration-200" />
          <Image
            src={props.image}
            alt={props.name}
            width={400}
            height={300}
            className="absolute inset-0 w-full h-full transform transition-transform duration-300 hover:scale-110 object-cover"
          />
          {/* Gradient overlay for better text visibility */}
          <div className="bottom-0 absolute inset-x-0 bg-gradient-to-t from-black/60 to-transparent h-24" />
          {/* Location badge */}
          <span className="top-3 right-3 absolute flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full text-white text-xs">
            <MapPin className="w-3 h-3" />
            {props.location}
          </span>
        </Link>

        <div className="flex flex-col flex-grow p-4">
          <div className="space-y-2">
            <h2 className="group-hover:text-primary line-clamp-1 font-display font-semibold text-foreground text-lg transition-colors">
              {props.name}
            </h2>
            <p className="line-clamp-3 text-muted-foreground text-sm">
              {props.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <Link href={`/markets/${props.id}`} className="w-full">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-secondary group"
              >
                <span className="group-hover:text-primary transition-colors">
                  View Details
                </span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketCard;
