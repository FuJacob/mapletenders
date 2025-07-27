import { memo } from "react";

interface TenderCardSkeletonProps {
  compact?: boolean;
  className?: string;
}

const TenderCardSkeleton = memo(function TenderCardSkeleton({
  compact = false,
  className = "",
}: TenderCardSkeletonProps) {
  if (compact) {
    return (
      <div
        className={`bg-surface border border-border rounded-xl p-5 animate-pulse ${className}`}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-16 h-6 bg-surface-muted rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-surface-muted rounded w-full"></div>
            <div className="h-5 bg-surface-muted rounded w-3/4"></div>
          </div>
          <div className="w-8 h-8 bg-surface-muted rounded-full flex-shrink-0"></div>
        </div>

        {/* Info */}
        <div className="flex items-center justify-between text-xs mb-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="h-4 bg-surface-muted rounded w-24"></div>
            <div className="h-4 bg-surface-muted rounded w-16"></div>
          </div>
          <div className="h-4 bg-surface-muted rounded w-20"></div>
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-surface-muted rounded w-full"></div>
          <div className="h-4 bg-surface-muted rounded w-5/6"></div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="h-5 bg-surface-muted rounded-full w-16"></div>
            <div className="h-5 bg-surface-muted rounded-full w-12"></div>
          </div>
          <div className="h-4 bg-surface-muted rounded w-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-surface border border-border rounded-xl p-8 animate-pulse ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1 pr-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-24 h-7 bg-surface-muted rounded-full"></div>
            <div className="h-4 bg-surface-muted rounded w-32"></div>
          </div>
          <div className="space-y-3 mb-3">
            <div className="h-7 bg-surface-muted rounded w-full"></div>
            <div className="h-7 bg-surface-muted rounded w-4/5"></div>
          </div>
          <div className="h-4 bg-surface-muted rounded w-48"></div>
        </div>
        <div className="w-11 h-11 bg-surface-muted rounded-full"></div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-surface-muted rounded w-20"></div>
            <div className="h-5 bg-surface-muted rounded w-full"></div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mb-8">
        <div className="h-3 bg-surface-muted rounded w-32 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-surface-muted rounded w-full"></div>
          <div className="h-4 bg-surface-muted rounded w-full"></div>
          <div className="h-4 bg-surface-muted rounded w-3/4"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-border/50">
        <div className="flex items-center gap-4">
          <div className="h-6 bg-surface-muted rounded-full w-20"></div>
          <div className="h-6 bg-surface-muted rounded-full w-16"></div>
        </div>
        <div className="h-4 bg-surface-muted rounded w-16"></div>
      </div>
    </div>
  );
});

export { TenderCardSkeleton };