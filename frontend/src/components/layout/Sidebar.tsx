import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  MagnifyingGlass,
  Table,
  FileText,
  Calendar,
  Bookmark,
  House,
  ChartLineUp,
  List,
  X,
} from "@phosphor-icons/react";
import { LogoTitle } from "../ui";

export default function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const bookmarkItem = {
    label: "Bookmarks",
    path: "/bookmarks",
    icon: Bookmark,
  };

  const navigationItems = [
    {
      label: "Home",
      path: "/home",
      icon: House,
    },
    {
      label: "Search",
      path: "/search",
      icon: MagnifyingGlass,
    },
    {
      label: "Table View",
      path: "/table",
      icon: Table,
    },
    {
      label: "RFP Analysis",
      path: "/rfp-analysis",
      icon: FileText,
    },
    {
      label: "Calendar",
      path: "/calendar",
      icon: Calendar,
    },
    {
      label: "Analytics",
      path: "/analytics",
      icon: ChartLineUp,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface border border-border rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 text-text" />
        ) : (
          <List className="w-5 h-5 text-text" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 w-64 h-screen bg-surface border-border transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:h-full ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-7.5 border-b border-border ">
          <div className="flex items-center justify-between">
            <LogoTitle size="text-xl" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1 hover:bg-background rounded"
            >
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>
        </div>
        <div className="border-r border-border">
          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {/* Bookmarks - First Item */}
            <Link
              to={bookmarkItem.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive(bookmarkItem.path)
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-muted hover:text-text hover:bg-background"
              }`}
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isActive(bookmarkItem.path)
                    ? "text-white"
                    : "text-text-muted group-hover:text-primary"
                }`}
              />
              <span className="font-medium">{bookmarkItem.label}</span>
            </Link>

            {/* Divider */}
            <div className="border-t border-border mx-2 my-3" />

            {/* Main Navigation Items */}
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-6 px-4 py-5 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-muted hover:text-text hover:bg-background"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive(item.path)
                        ? "text-white"
                        : "text-text-muted group-hover:text-primary"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-3">
              <div className="text-sm font-medium text-text mb-1">
                Pro Features
              </div>
              <div className="text-xs text-text-muted mb-2">
                Unlock advanced analytics and AI insights
              </div>
              <Link
                to="/plans"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
