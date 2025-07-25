import React from "react";
import {
  MagnifyingGlass,
  Table,
  FileText,
  CreditCardIcon,
  Calendar,
  Bookmark,
  House,
} from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";

interface ViewSwitcherProps {
  className?: string;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ className = "" }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`flex gap-1 rounded-lg p-1 bg-background border border-border ${className}`}
    >
      <Link
        to="/home"
        className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm ${
          isActive("/home")
            ? "bg-primary text-white"
            : "text-text-light hover:bg-border"
        }`}
      >
        <House className="w-4 h-4" />
        Dashboard
      </Link>
      <Link
        to="/search"
        className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm ${
          isActive("/search")
            ? "bg-primary text-white"
            : "text-text-light hover:bg-border"
        }`}
      >
        <MagnifyingGlass className="w-4 h-4" />
        Search
      </Link>
      <Link
        to="/table"
        className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm ${
          isActive("/table")
            ? "bg-primary text-white"
            : "text-text-light hover:bg-border"
        }`}
      >
        <Table className="w-4 h-4" />
        Table
      </Link>
      <Link
        to="/rfp-analysis"
        className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm ${
          isActive("/rfp-analysis")
            ? "bg-primary text-white"
            : "text-text-light hover:bg-border"
        }`}
      >
        <FileText className="w-4 h-4" />
        RFP Analysis
      </Link>
      <Link
        to="/calendar"
        className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm ${
          isActive("/calendar")
            ? "bg-primary text-white"
            : "text-text-light hover:bg-border"
        }`}
      >
        <Calendar className="w-4 h-4" />
        Calendar
      </Link>
      <Link
        to="/bookmarks"
        className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm ${
          isActive("/bookmarks")
            ? "bg-primary text-white"
            : "text-text-light hover:bg-border"
        }`}
      >
        <Bookmark className="w-4 h-4" />
        Bookmarks
      </Link>
      <Link
        to="/plans"
        className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 text-sm ${
          isActive("/plans")
            ? "bg-primary text-white"
            : "text-text-light hover:bg-border"
        }`}
      >
        <CreditCardIcon className="w-4 h-4" />
        Plans
      </Link>
    </div>
  );
};

export default ViewSwitcher;
