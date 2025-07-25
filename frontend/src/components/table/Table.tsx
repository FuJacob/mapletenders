import { type ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function Table({
  children,
  className = "",
  fullWidth = true,
}: TableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <table
          className={`${
            fullWidth ? "w-full" : "min-w-full"
          } table-fixed border-collapse ${className}`}
        >
          {children}
        </table>
      </div>
    </div>
  );
}
