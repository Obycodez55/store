const ProductCardSkeleton = () => (
  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
    {/* Image skeleton */}
    <div className="h-48 bg-muted animate-pulse" />

    {/* Content skeleton */}
    <div className="p-4 space-y-4">
      {/* Title and price */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-muted rounded w-2/3 animate-pulse" />
        <div className="h-6 bg-muted rounded w-16 animate-pulse" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full animate-pulse" />
        <div className="h-4 bg-muted rounded w-4/5 animate-pulse" />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
        <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
        <div className="h-6 w-14 bg-muted rounded-full animate-pulse" />
      </div>

      {/* Vendor */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;
