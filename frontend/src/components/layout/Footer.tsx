import { EnvelopeSimple, Leaf } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { LogoTitle } from "../ui/LogoTitle";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface px-6 py-8 text-sm text-text-muted">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        {/* Logo and Contact */}
        <div className="text-center md:text-left">
          <LogoTitle size="text-lg" />
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
            <EnvelopeSimple className="w-4 h-4 text-primary" />
            <a
              href="mailto:info@mapletenders.com"
              className="hover:text-primary transition-colors"
            >
              info@mapletenders.com
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row gap-8 text-center md:text-right">
          <div>
            <h3 className="font-semibold text-text mb-2">Quick Links</h3>
            <Link to="/about" className="block hover:text-primary">About</Link>
            <Link to="/pricing" className="block hover:text-primary">Pricing</Link>
            <Link to="/contact" className="block hover:text-primary">Contact</Link>
          </div>
          <div>
            <h3 className="font-semibold text-text mb-2">Legal</h3>
            <Link to="/privacy" className="block hover:text-primary">Privacy</Link>
            <Link to="/terms" className="block hover:text-primary">Terms</Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="pt-6 text-center text-xs text-text-muted">
        © {currentYear} Mapletenders. All rights reserved.
      </div>
    </footer>
  );
}
