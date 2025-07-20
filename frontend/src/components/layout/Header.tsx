import { Link, useLocation } from "react-router-dom";
import { LogoTitle } from "../ui/LogoTitle";
import { ViewSwitcher } from "../ui";
import { useAuth } from "../../hooks/auth";
import {
  GuestNavigation,
  NotificationButton,
  ProfileDropdown,
  GuestAuthButtons,
} from "./";

interface HeaderProps {
  transparent?: boolean;
  className?: string;
}
export default function Header({
  transparent = false,
  className = "",
}: HeaderProps) {
  const location = useLocation();
  const { user, profile, isAuthenticated } = useAuth();

  const showViewSwitcher = [
    "/search",
    "/table",
    "/rfp-analysis",
    "/calendar",
    "/bookmarks",
    "/plans",
  ].includes(location.pathname);

  return (
    <header
      className={` border-b border-border ${
        transparent ? "bg-transparent" : "bg-surface"
      } ${className}`}
      role="banner"
    >
      <div className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        {/* Logo/Brand Section */}
        <div className="flex-shrink-0">
          <Link
            to={isAuthenticated ? "/home" : "/"}
            aria-label="Home"
            className="flex items-center"
          >
            <span className="sr-only">Procuroo Home</span>
            <LogoTitle />
          </Link>
        </div>

        {/* Center Navigation for Guests */}
        {!isAuthenticated && <GuestNavigation />}

        {/* Center ViewSwitcher for Authenticated Users */}
        {isAuthenticated && showViewSwitcher && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <ViewSwitcher />
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Authenticated User Menu */}
          {isAuthenticated && (
            <>
              <NotificationButton />
              <ProfileDropdown user={user} profile={profile} />
            </>
          )}

          {/* Guest Auth Buttons */}
          {!isAuthenticated && <GuestAuthButtons />}
        </div>
      </div>
    </header>
  );
}
