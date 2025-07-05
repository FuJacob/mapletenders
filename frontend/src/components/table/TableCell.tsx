import { type ReactNode } from "react";

interface TableCellProps {
  children: ReactNode;
  className?: string;
  isHeader?: boolean;
}

export function TableCell({
  children,
  className = "",
  isHeader = false,
}: TableCellProps) {
  const baseClasses = isHeader
    ? "px-6 py-4 text-left text-sm font-semibold text-text tracking-wider uppercase"
    : "px-6 py-4 text-sm text-text whitespace-nowrap";

  if (isHeader) {
    return <th className={`${baseClasses} ${className}`}>{children}</th>;
  }

  return <td className={`${baseClasses} ${className}`}>{children}</td>;
}
