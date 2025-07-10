import { useNavigate, Link, useLocation } from "react-router-dom";
import { LogoTitle } from "../ui/LogoTitle";
import { ViewSwitcher } from "../ui";
import { useAuth } from "../../hooks/auth";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { signOut } from "../../features/auth/authThunks";
import { User, Gear, SignOut, Bell, CaretDown } from "@phosphor-icons/react";
import type { AppDispatch } from "../../app/configureStore";

interface HeaderProps {
  transparent?: boolean;
  className?: string;
}
export default function Header({
  transparent = false,
  className = "",
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"search" | "table">("search");
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if we're on the home page to show view switcher
  const isHomePage = location.pathname === "/home";

  // Memoize click outside handler
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleSignOut = useCallback(async () => {
    await dispatch(signOut());
    navigate("/");
  }, [dispatch, navigate]);

  return (
    <header
      className={`flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-border ${
        transparent ? "bg-transparent" : "bg-surface"
      } ${className}`}
    >
      {/* Left Section - Logo */}
      <div className="flex-shrink-0">
        <Link to={user ? "/home" : "/"}>
          <LogoTitle />
        </Link>
      </div>

      {/* Center Section - Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {!user && (
          // Guest navigation
          <>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/about"
                  ? "text-primary"
                  : "text-text hover:text-primary"
              }`}
            >
              About
            </Link>
            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/pricing"
                  ? "text-primary"
                  : "text-text hover:text-primary"
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/contact"
                  ? "text-primary"
                  : "text-text hover:text-primary"
              }`}
            >
              Contact
            </Link>
            <Link
              to="/help"
              className={`text-sm font-medium transition-colors ${
                location.pathname === "/help"
                  ? "text-primary"
                  : "text-text hover:text-primary"
              }`}
            >
              Help
            </Link>
          </>
        )}
      </nav>

      {/* View Switcher for Home Page */}
      {user && isHomePage && (
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <ViewSwitcher
            currentView={currentView}
            onViewChange={(view) => {
              setCurrentView(view);
              window.dispatchEvent(
                new CustomEvent("viewChange", { detail: view })
              );
            }}
          />
        </div>
      )}

      {/* Right Section - User Menu / Auth Buttons */}
      <div className="flex items-center gap-4">
        {user ? (
          // Logged in user menu
          <>
            <button className="p-2 text-text-light hover:text-primary transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></span>
            </button>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-border transition-colors"
              >
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {user.company_name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm text-text hidden sm:block">
                  {user.company_name || "User"}
                </span>
                <CaretDown className="w-4 h-4 text-text-light" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium text-text">
                      {user.company_name || "Your Company"}
                    </p>
                    {user.industry && (
                      <p className="text-xs text-text-light">{user.industry}</p>
                    )}
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:bg-border transition-colors text-left"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate("/settings");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:bg-border transition-colors text-left"
                    >
                      <Gear className="w-4 h-4" />
                      Settings
                    </button>
                    <hr className="my-1 border-border" />
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <SignOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // Guest buttons - Enhanced styling
          <>
            <button
              onClick={() => navigate("/sign-in")}
              className="px-4 py-2 text-sm text-text hover:text-primary transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/sign-up")}
              className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
            >
              Start Free Trial
            </button>
          </>
        )}
      </div>
    </header>
  );
}
