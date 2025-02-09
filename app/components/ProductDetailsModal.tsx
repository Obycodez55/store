"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { X, Copy, MapPin, Phone, Mail, Globe, Store } from "lucide-react";
import { toast } from "sonner";

export interface ModalProduct{
  name: string;
  description: string;
  price: number;
  image: string;
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
  product: ModalProduct
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
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
      bounce: 0.3
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied to clipboard`);
};

export const ProductDetailsModal = ({
  isOpen,
  onClose,
  product
}: ProductDetailsModalProps) => {
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
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel>
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-card rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Product image */}
                <div className="relative h-48 md:h-64 w-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-display font-bold">
                      {product.name}
                    </h3>
                    <p className="text-white/80 text-sm">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Vendor section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Store className="h-5 w-5" />
                      <h4 className="font-display font-semibold">
                        Vendor Details
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <p className="text-lg font-semibold">
                        {product.vendor.name}
                      </p>

                      {/* Contact details */}
                      <div className="space-y-2">
                        {product.vendor.email && (
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-4 w-4" />
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
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        {product.vendor.phone && (
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-4 w-4" />
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
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        {product.vendor.website && (
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Globe className="h-4 w-4" />
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
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Market location */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <MapPin className="h-5 w-5" />
                      <h4 className="font-display font-semibold">
                        Market Location
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium">
                        {product.vendor.market.name}
                      </p>
                      <div className="flex items-center justify-between group">
                        <p className="text-sm text-muted-foreground">
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
                          <Copy className="h-4 w-4" />
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
