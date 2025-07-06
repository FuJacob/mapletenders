import { type ReactNode } from "react";

interface TableCellProps {
  children: ReactNode;
  className?: string;
  isHeader?: boolean;
  width?: string;
  truncate?: boolean;
  align?: "left" | "center" | "right";
}

export function TableCell({
  children,
  className = "",
  isHeader = false,
  width,
  truncate = false,
  align = "left",
}: TableCellProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const baseClasses = isHeader
    ? `px-6 py-4 ${alignClasses[align]} text-sm font-semibold text-text tracking-wider uppercase`
    : `px-6 py-4 text-sm text-text ${
        truncate
          ? "whitespace-nowrap overflow-hidden overflow-ellipsis"
          : "break-words"
      }`;

  const styleProps = width ? { style: { width, minWidth: width } } : {};

  if (isHeader) {
    return (
      <th className={`${baseClasses} ${className}`} {...styleProps}>
        {children}
      </th>
    );
  }

  return (
    <td className={`${baseClasses} ${className}`} {...styleProps}>
      {children}
    </td>
  );
}
