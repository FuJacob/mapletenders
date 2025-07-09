import React from "react";
import { CaretDown } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

interface FilterButtonProps {
  icon: Icon;
  label: string;
  onClick?: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  icon: IconComponent,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 text-sm font-medium border border-border rounded-lg hover:bg-border transition-colors"
    >
      <IconComponent className="w-4 h-4" />
      {label}
      <CaretDown className="w-3 h-3" />
    </button>
  );
};

export default FilterButton;
