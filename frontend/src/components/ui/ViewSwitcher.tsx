import React from "react";
import { MagnifyingGlass, Table } from "@phosphor-icons/react";
import { useSearchParams } from "react-router-dom";

interface ViewSwitcherProps {
  currentView: string;
  className?: string;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  currentView,
  className = "",
}) => {
  const [, setSearchParams] = useSearchParams();
  return (
    <div
      className={`flex gap-1 rounded-lg p-1 bg-background border border-border ${className}`}
    >
      <button
        className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm ${
          currentView === "search"
            ? "bg-primary text-white"
            : "text-text-light hover:bg-border"
        }`}
        onClick={() => setSearchParams({ view: "search" })}
      >
        <MagnifyingGlass className="w-4 h-4" />
        Search
      </button>
      <button
        className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm ${
          currentView === "table"
            ? "bg-primary text-white"
            : "text-text-light hover:bg-border"
        }`}
        onClick={() => setSearchParams({ view: "table" })}
      >
        <Table className="w-4 h-4" />
        Table
      </button>
    </div>
  );
};

export default ViewSwitcher;
