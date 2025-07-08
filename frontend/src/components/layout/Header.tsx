import { useNavigate, Link } from "react-router-dom";
import { LogoTitle } from "../ui/LogoTitle";
import { useAuth } from "../../hooks/auth";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { signOut } from "../../features/auth/authThunks";
import { User, Gear, SignOut, Bell, CaretDown } from "@phosphor-icons/react";

interface HeaderProps {
  showNavigation?: boolean;
  transparent?: boolean;
  className?: string;
}
export default function Header({
  showNavigation = true,
  transparent = false,
  className = "",
}: HeaderProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await dispatch(signOut() as any);
    navigate("/");
  };

  return (
    <header
      className={`flex justify-between items-center p-6 border-b border-border ${
        transparent ? "bg-transparent" : "bg-surface"
      } ${className}`}
    >
      <Link to={user ? "/home" : "/"}>
        <LogoTitle />
      </Link>

      {showNavigation && (
        <nav className="hidden md:flex items-center gap-8">
          {user ? (
            // Logged in navigation
            <>
              <Link
                to="/search"
                className="text-sm text-text hover:text-primary transition-colors"
              >
                Search
              </Link>
              <Link
                to="/saved"
                className="text-sm text-text hover:text-primary transition-colors"
              >
                Saved
              </Link>
              <Link
                to="/alerts"
                className="text-sm text-text hover:text-primary transition-colors"
              >
                Alerts
              </Link>
            </>
          ) : (
            // Guest navigation
            <>
              <Link
                to="/pricing"
                className="text-sm text-text hover:text-primary transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="text-sm text-text hover:text-primary transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-sm text-text hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </>
          )}
        </nav>
      )}

      <div className="flex items-center gap-4">
        {user ? (
          // Logged in user menu
          <>
            <button className="p-2 text-text-light hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
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
                        // TODO: Navigate to settings when page exists
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
          // Guest buttons
          <>
            <button
              onClick={() => navigate("/sign-in")}
              className="px-4 py-2 text-sm text-text hover:text-primary transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/sign-up")}
              className="px-4 py-2 bg-primary text-white border rounded text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </header>
  );
}
