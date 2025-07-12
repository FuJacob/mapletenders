import { type ReactNode } from "react";

interface TableRowProps {
  children: ReactNode;
  className?: string;
  isHeader?: boolean;
  style?: React.CSSProperties;
}

export function TableRow({
  children,
  className = "",
  isHeader = false,
  style,
}: TableRowProps) {
  const baseClasses = isHeader
    ? "border-b border-border"
    : "hover:bg-surface-muted transition-colors duration-150";

  return (
    <tr className={`${baseClasses} ${className}`} style={style}>
      {children}
    </tr>
  );
}
