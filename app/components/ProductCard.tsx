"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tag, Store } from "lucide-react";
import { ProductDetailsModal } from "./ProductDetailsModal";
import Image from "next/image";

type Props = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string[];
  vendor: {
    name: string;
    email?: string;
    phone?: string;
    website?: string;
    market: {
      name: string;
      location: string;
    };
  };
};

const ProductCard = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col h-full bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="relative h-48">
            <Image
              src={props.image || "/placeholder.png"}
              alt={props.name}
              width={300}
              height={300}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="p-4 flex-grow flex flex-col">
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-semibold text-lg line-clamp-1">
                  {props.name}
                </h3>
                <span className="text-primary font-medium">
                  ${props.price.toFixed(2)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {props.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {props.category.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto">
                <Store className="h-4 w-4" />
                <span className="truncate">{props.vendor.name}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{ ...props, tags: props.category }}
      />
    </>
  );
};

export default ProductCard;
