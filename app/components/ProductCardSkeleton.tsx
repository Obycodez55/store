export function ProductCardSkeleton() {
  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="relative aspect-square">
        {/* Image skeleton */}
        <div className="bg-muted w-full h-full animate-pulse" />

        {/* Multiple images indicator skeleton */}
        <div className="top-2 right-2 absolute bg-muted rounded-full w-16 h-6 animate-pulse" />
      </div>
      <div className="space-y-2 p-4">
        {/* Title skeleton */}
        <div className="bg-muted rounded w-3/4 h-4 animate-pulse" />

        {/* Description skeleton */}
        <div className="space-y-1">
          <div className="bg-muted rounded w-full h-3 animate-pulse" />
          <div className="bg-muted rounded w-4/5 h-3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
