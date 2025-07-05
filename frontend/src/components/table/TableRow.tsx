import { type ReactNode } from "react";

interface TableRowProps {
  children: ReactNode;
  className?: string;
  isHeader?: boolean;
}

export function TableRow({
  children,
  className = "",
  isHeader = false,
}: TableRowProps) {
  const baseClasses = isHeader
    ? "border-b border-border"
    : "hover:bg-surface-muted transition-colors duration-150";

  return <tr className={`${baseClasses} ${className}`}>{children}</tr>;
}
