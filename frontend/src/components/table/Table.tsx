import { type ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface max-w-7xl mx-auto">
      <div className="overflow-x-auto">
        <table className={`w-full border-collapse ${className}`}>
          {children}
        </table>
      </div>
    </div>
  );
}
