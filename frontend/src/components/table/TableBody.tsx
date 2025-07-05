import { type ReactNode } from "react";

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className = "" }: TableBodyProps) {
  return (
    <tbody className={`divide-y divide-border ${className}`}>
      {children}
    </tbody>
  );
}
