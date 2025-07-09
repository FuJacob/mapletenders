import React from "react";
import { X } from "@phosphor-icons/react";

interface FilterTagProps {
  id: number;
  label: string;
  onRemove: (id: number) => void;
}

const FilterTag: React.FC<FilterTagProps> = ({ id, label, onRemove }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20">
      <span>{label}</span>
      <button
        onClick={() => onRemove(id)}
        className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export default FilterTag;
