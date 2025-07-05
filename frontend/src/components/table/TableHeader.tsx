import { type ReactNode } from "react";

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className = "" }: TableHeaderProps) {
  return <thead className={`bg-surface-muted ${className}`}>{children}</thead>;
}
