import { type ReactNode } from "react";

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className = "" }: TableHeaderProps) {
  return (
    <thead className={`bg-surface-muted border-b border-border sticky top-0 z-10 ${className}`}
    >
      {children}
    </thead>
  );
}
