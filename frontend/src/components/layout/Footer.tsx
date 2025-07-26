import { EnvelopeSimple } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { LogoTitle } from "../ui/LogoTitle";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface px-6 py-6 text-sm text-text-muted">
      <div className="max-w-7xl mx-auto flex flex-row justify-between flex-wrap items-center gap-6 text-center">
        <div className="flex items-center  gap-2">
          <LogoTitle size="text-lg" />
          <span className="hidden md:inline">|</span>
          <a
            href="mailto:info@mapletenders.com"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <EnvelopeSimple className="w-4 h-4 text-primary" />
            info@mapletenders.com
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/about" className="hover:text-primary">
            About
          </Link>
          <Link to="/pricing" className="hover:text-primary">
            Pricing
          </Link>
          <Link to="/contact" className="hover:text-primary">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-primary">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-primary">
            Terms
          </Link>
        </div>
      </div>
      <div className="pt-4 text-center text-xs text-text-muted">
        © {currentYear} Mapletenders. All rights reserved.
      </div>
    </footer>
  );
}
