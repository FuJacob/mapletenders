import { type ReactNode } from "react";

interface TableBodyProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function TableBody({ children, className = "", style }: TableBodyProps) {
  return (
    <tbody className={`divide-y divide-border ${className}`} style={style}>
      {children}
    </tbody>
  );
}
