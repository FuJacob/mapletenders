import { Link } from "react-router-dom";
import { LogoTitle } from "../ui/LogoTitle";
import { GuestNavigation, GuestAuthButtons } from "./";

interface GuestHeaderProps {
  className?: string;
}

export default function GuestHeader({ className = "" }: GuestHeaderProps) {
  return (
    <div className={`${className} max-w-7xl mx-auto flex items-center justify-between px-6 pt-10`}>
      {/* Logo/Brand Section */}
      <div className="flex-shrink-0">
        <Link
          to="/"
          aria-label="Home"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <span className="sr-only">Mapletenders Home</span>
          <LogoTitle />
        </Link>
      </div>

      {/* Right Section - Navigation & Auth */}
      <div className="flex items-center gap-8">
        <GuestNavigation />
        <span className="text-accent">|</span>
        <GuestAuthButtons />
      </div>
    </div>
  );
}
