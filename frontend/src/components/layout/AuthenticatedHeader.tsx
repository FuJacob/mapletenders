import { useLocation, Link } from "react-router-dom";
import {
  MagnifyingGlass,
  GearIcon,
  CreditCardIcon,
  Users,
  SignOut,
} from "@phosphor-icons/react";
import { NotificationButton } from "./";
import { useAppDispatch } from "../../app/hooks";
import { signOut } from "../../features/auth/authThunks";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../../features/auth/authSlice";

interface AuthenticatedHeaderProps {
  className?: string;
  user: User;
  profile: Profile;
}

export default function AuthenticatedHeader({
  className = "",
  user,
  profile,
}: AuthenticatedHeaderProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  // Check if we're on an app page (authenticated pages that show sidebar)
  const isAppPage = [
    "/home",
    "/search",
    "/table",
    "/rfp-analysis",
    "/calendar",
    "/bookmarks",
    "/analytics",
  ].includes(location.pathname);

  return (
    <header className={`${className} z-50`} role="banner">
      <div className="flex border-b border-border items-center justify-between p-5 bg-surface">
        {/* Logo/Brand Section */}
        <div className="flex items-center gap-6">
          {/* Search Bar for App Pages */}
          {isAppPage && (
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlass className="h-5 w-5 text-text-muted" />
              </div>
              <input
                type="text"
                placeholder="Search tenders, RFPs, contractors..."
                className="block w-[500px] pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Individual Navigation Links */}
          <Link
            to="/settings"
            className="flex items-center gap-2 px-3 py-2 font-medium text-text-muted hover:text-text hover:bg-background rounded-lg transition-colors"
          >
            <GearIcon className="w-5 h-5" />
            <span>Settings</span>
          </Link>

          <Link
            to="/plans"
            className="flex items-center gap-2 px-3 py-2 font-medium text-text-muted hover:text-text hover:bg-background rounded-lg transition-colors"
          >
            <CreditCardIcon className="w-5 h-5" />
            <span>Plans</span>
          </Link>

          <Link
            to="/team"
            className="flex items-center gap-2 px-3 py-2 font-medium text-text-muted hover:text-text hover:bg-background rounded-lg transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Team</span>
          </Link>

          {/* Notifications */}
          <NotificationButton />

          {/* User Avatar - Simple Link */}
          <Link
            to="/profile"
            className="flex items-center gap-2 px-3 py-2 font-medium text-text-muted hover:text-text hover:bg-background rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center font-medium">
              {profile?.company_name?.charAt(0).toUpperCase() ||
                user.email?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:block">
              {profile?.company_name || user.email?.split("@")[0]}
            </span>
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 font-medium text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            <SignOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
