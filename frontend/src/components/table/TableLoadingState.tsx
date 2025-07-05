import { CircleNotch } from "@phosphor-icons/react";

interface TableLoadingStateProps {
  message?: string;
  rowCount?: number;
}

export function TableLoadingState({ 
  message = "Loading data...", 
  rowCount = 5 
}: TableLoadingStateProps) {
  return (
    <div className="w-full">
      {/* Loading message */}
      <div className="flex items-center justify-center py-8 text-center">
        <CircleNotch size={20} className="text-primary animate-spin mr-3" />
        <span className="text-text-muted">{message}</span>
      </div>
      
      {/* Skeleton rows */}
      <div className="space-y-3 px-6 pb-6">
        {Array.from({ length: rowCount }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex space-x-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-muted rounded w-3/4"></div>
                <div className="h-4 bg-surface-muted rounded w-1/2"></div>
              </div>
              <div className="w-20 h-4 bg-surface-muted rounded"></div>
              <div className="w-24 h-4 bg-surface-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
