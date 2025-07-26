import { MagnifyingGlass } from "@phosphor-icons/react";

interface TableEmptyStateProps {
  message?: string;
  description?: string;
}

export function TableEmptyState({
  message = "No data available",
  description = "There are no items to display at this time.",
}: TableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-surface-muted rounded-lg flex items-center justify-center mb-4">
        <MagnifyingGlass size={24} className="text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text mb-2">{message}</h3>
      <p className="text-text-muted max-w-sm">{description}</p>
    </div>
  );
}
