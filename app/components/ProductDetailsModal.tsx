"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import {
  X,
  Copy,
  MapPin,
  Phone,
  Mail,
  Globe,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";

export interface ModalProduct {
  name: string;
  description: string;
  price: number;
  image: string;
  images: { id: string; url: string }[];
  tags: string[];
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
}
interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ModalProduct;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied to clipboard`);
};

export const ProductDetailsModal = ({
  isOpen,
  onClose,
  product,
}: ProductDetailsModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const allImages = [
    product.image,
    ...product.images.map((img) => img.url),
  ].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={onClose}
          className="relative z-50"
        >
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex justify-center items-center p-4">
            <Dialog.Panel>
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-card shadow-lg rounded-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="top-4 right-4 z-10 absolute text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Product image carousel */}
                <div className="relative w-full h-48 md:h-72 lg:h-96">
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    width={800}
                    height={800}
                    className="rounded-t-lg w-full h-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Navigation arrows */}
                  {allImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevImage}
                        className="top-1/2 left-2 absolute bg-black/20 hover:bg-black/40 -translate-y-1/2"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextImage}
                        className="top-1/2 right-2 absolute bg-black/20 hover:bg-black/40 -translate-y-1/2"
                      >
                        <ChevronRight className="w-6 h-6 text-white" />
                      </Button>
                    </>
                  )}

                  {/* Image counter */}
                  <div className="top-4 left-4 absolute bg-black/50 px-2 py-1 rounded text-sm text-white">
                    {currentImageIndex + 1} / {allImages.length}
                  </div>

                  {/* Product name */}
                  <div className="bottom-6 left-6 absolute text-white">
                    <h3 className="font-bold font-display text-xl md:text-2xl lg:text-3xl">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Image thumbnails */}
                {allImages.length > 1 && (
                  <div className="right-0 -bottom-12 left-0 absolute">
                    <div className="flex justify-center gap-2 px-4">
                      <div className="flex gap-2 bg-black/50 p-2 rounded-full">
                        {allImages.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex
                                ? "bg-white scale-125"
                                : "bg-white/50 hover:bg-white/75"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-6 p-6 md:p-8">
                  {/* Vendor section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Store className="w-5 h-5" />
                      <h4 className="font-display font-semibold">
                        Vendor Details
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <p className="font-semibold text-lg">
                        {product.vendor.name}
                      </p>

                      {/* Contact details */}
                      <div className="space-y-2">
                        {product.vendor.email && (
                          <div className="flex justify-between items-center group">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <Mail className="w-4 h-4" />
                              <span>{product.vendor.email}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(product.vendor.email!, "Email")
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {product.vendor.phone && (
                          <div className="flex justify-between items-center group">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <Phone className="w-4 h-4" />
                              <span>{product.vendor.phone}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(product.vendor.phone!, "Phone")
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        )}

                        {product.vendor.website && (
                          <div className="flex justify-between items-center group">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <Globe className="w-4 h-4" />
                              <a
                                href={product.vendor.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary transition-colors"
                              >
                                {product.vendor.website}
                              </a>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  product.vendor.website!,
                                  "Website"
                                )
                              }
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Market location */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <MapPin className="w-5 h-5" />
                      <h4 className="font-display font-semibold">
                        Market Location
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">
                        {product.vendor.market.name}
                      </p>
                      <div className="flex justify-between items-center group">
                        <p className="text-muted-foreground text-sm">
                          {product.vendor.market.location}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(
                              product.vendor.market.location,
                              "Address"
                            )
                          }
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
