import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../../features/auth/authThunks";
import {
  User,
  Gear,
  SignOut,
  CaretDown,
  CreditCard,
} from "@phosphor-icons/react";
import type { AppDispatch } from "../../app/configureStore";

interface ProfileDropdownProps {
  user: { email?: string | null } | null | undefined;
  profile:
    | { company_name?: string | null; industry?: string | null }
    | null
    | undefined;
}

const menuItems = [
  { path: "/profile", label: "Profile", icon: User },
  { path: "/plans", label: "Plans & Billing", icon: CreditCard },
  { path: "/settings", label: "Settings", icon: Gear },
];

export default function ProfileDropdown({
  user,
  profile,
}: ProfileDropdownProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleSignOut = useCallback(async () => {
    await dispatch(signOut());
    navigate("/");
  }, [dispatch, navigate]);

  const handleMenuItemClick = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const displayName = profile?.company_name || user?.email || "User";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-border transition-colors"
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        aria-label="User menu"
      >
        <span className="flex flex-col items-start">
          <span className="text-sm text-text-light leading-none">
            Welcome back
          </span>
          <span className="text-lg text-text font-bold">{displayName}</span>
        </span>
        <CaretDown className="w-4 h-4 text-text-light ml-2" />
      </button>

      {isMenuOpen && (
        <nav
          className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-50"
          aria-label="User menu"
        >
          <div className="p-3 border-b border-border">
            <span className="text-sm text-text-light block mb-1">
              Welcome back
            </span>
            <span className="text-lg font-bold text-text block">
              {profile?.company_name || "User"}
            </span>
            {profile?.industry && (
              <p className="text-xs text-text-light mt-1">{profile.industry}</p>
            )}
          </div>
          <ul className="py-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => handleMenuItemClick(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text hover:bg-border transition-colors text-left"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              </li>
            ))}
            <li>
              <hr className="my-1 border-border" />
            </li>
            <li>
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
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
