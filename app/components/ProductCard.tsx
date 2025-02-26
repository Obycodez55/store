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
        className="cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col bg-card shadow-sm hover:shadow-md border border-border rounded-lg h-full transition-shadow duration-200 overflow-hidden">
          <div className="relative h-48">
            <Image
              src={props.image || "/placeholder.png"}
              alt={props.name}
              width={300}
              height={300}
              className="w-full h-full object-center object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex flex-col flex-grow p-4">
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="line-clamp-1 font-display font-semibold text-lg">
                  {props.name}
                </h3>
                <span className="font-medium text-primary">
                  ${props.price.toFixed(2)}
                </span>
              </div>

              <p className="mb-3 line-clamp-2 text-muted-foreground text-sm">
                {props.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {props.category.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full text-primary text-xs"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-auto text-muted-foreground text-sm">
                <Store className="w-4 h-4" />
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
