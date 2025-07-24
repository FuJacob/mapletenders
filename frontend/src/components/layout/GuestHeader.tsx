import { Link } from "react-router-dom";
import { LogoTitle } from "../ui/LogoTitle";
import { GuestNavigation, GuestAuthButtons } from "./";

interface GuestHeaderProps {
  className?: string;
}

export default function GuestHeader({ className = "" }: GuestHeaderProps) {
  return (
    <header className={`${className} sticky top-0 z-50`} role="banner">
      <div className="flex border-b border-border items-center justify-between p-6 bg-surface">
        {/* Logo/Brand Section */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            aria-label="Home"
            className="flex items-center"
          >
            <span className="sr-only">Procuroo Home</span>
            <LogoTitle />
          </Link>
        </div>

        {/* Center Navigation */}
        <GuestNavigation />

        {/* Right Section - Auth Buttons */}
        <GuestAuthButtons />
      </div>
    </header>
  );
}