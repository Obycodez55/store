import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Tag, Store } from "lucide-react";

type Props = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string[];
  vendor: {
    name: string;
  };
};

const ProductCard = (props: Props) => {
  return (
    <motion.div whileHover={{ y: -5 }} className="h-full group">
      <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <a
          href={`/products/${props.id}`}
          className="relative w-full pt-[100%] overflow-hidden bg-muted"
        >
          <img
            src={props.image}
            alt={props.name}
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
          {/* Category badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {props.category.map((cat, index) => (
              <span key={index} className="px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full text-xs text-white flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {cat}
              </span>
            ))}
          </div>
          {/* Price badge */}
          <span className="absolute bottom-3 right-3 px-3 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
            ${props.price.toFixed(2)}
          </span>
        </a>

        <div className="flex flex-col flex-grow p-4">
          {/* Vendor info */}
          <div className="flex items-center gap-2 mb-3">
            <Store className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {props.vendor.name}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-display font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {props.name}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2">
              {props.description}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary group flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
