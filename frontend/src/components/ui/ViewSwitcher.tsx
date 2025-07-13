import React from "react";
import { MagnifyingGlass, Table, FileText } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

interface ViewSwitcherProps {
  currentView: string;
  className?: string;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  currentView,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleViewChange = (view: string) => {
    if (view === "rfp") {
      navigate("/rfp-analysis");
    } else {
      navigate(`/home?view=${view}`);
    }
  };
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
        onClick={() => handleViewChange("search")}
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
        onClick={() => handleViewChange("table")}
      >
        <Table className="w-4 h-4" />
        Table
      </button>
      <button
        className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm ${
          currentView === "rfp"
            ? "bg-primary text-white"
            : "text-text-light hover:bg-border"
        }`}
        onClick={() => handleViewChange("rfp")}
      >
        <FileText className="w-4 h-4" />
        RFP Analysis
      </button>
    </div>
  );
};

export default ViewSwitcher;
