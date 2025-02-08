"use client";

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const shimmer = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear"
    }
  }
};

export const LoadingGrid = () => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <motion.div
            key={index}
            variants={item}
            className="relative overflow-hidden"
          >
            <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
              {/* Image placeholder */}
              <div className="relative h-48 bg-muted/20 overflow-hidden">
                <motion.div
                  variants={shimmer}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
              </div>

              {/* Content placeholder */}
              <div className="p-4 space-y-4">
                {/* Title */}
                <div className="relative overflow-hidden">
                  <div className="h-7 bg-muted/20 rounded w-3/4">
                    <motion.div
                      variants={shimmer}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="relative overflow-hidden">
                    <div className="h-4 bg-muted/20 rounded w-full">
                      <motion.div
                        variants={shimmer}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      />
                    </div>
                  </div>
                  <div className="relative overflow-hidden">
                    <div className="h-4 bg-muted/20 rounded w-4/5">
                      <motion.div
                        variants={shimmer}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2">
                  <div className="relative overflow-hidden">
                    <div className="h-4 w-4 bg-muted/20 rounded">
                      <motion.div
                        variants={shimmer}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      />
                    </div>
                  </div>
                  <div className="relative overflow-hidden flex-grow">
                    <div className="h-4 bg-muted/20 rounded w-32">
                      <motion.div
                        variants={shimmer}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
    </motion.div>
  );
};
