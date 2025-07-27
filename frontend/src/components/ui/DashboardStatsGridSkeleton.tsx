import { memo } from "react";

const DashboardStatsGridSkeleton = memo(function DashboardStatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-surface border border-border rounded-lg animate-pulse"
        >
          <div className="bg-surface-muted/50 h-12 w-full rounded-t-lg flex items-center justify-center">
            <div className="w-5 h-5 bg-surface-muted rounded"></div>
          </div>
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-surface-muted rounded"></div>
              <div className="w-8 h-8 bg-surface-muted rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 bg-surface-muted rounded w-24"></div>
              <div className="h-3 bg-surface-muted rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export { DashboardStatsGridSkeleton };