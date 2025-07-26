import LoadingSpinner from "../common/LoadingSpinner";

interface TableLoadingStateProps {
  message?: string;
  rowCount?: number;
}

export function TableLoadingState({
  message = "Loading data...",
  rowCount = 5,
}: TableLoadingStateProps) {
  return (
    <LoadingSpinner 
      variant="table" 
      message={message} 
      rowCount={rowCount} 
      size="sm"
    />
  );
}
