import { useNavigate, Link } from "react-router-dom";

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

  return (
    <header
      className={`flex justify-between items-center p-6 border-b border-border ${
        transparent ? "bg-transparent" : "bg-surface"
      } ${className}`}
    >
      <Link to="/" className="text-2xl font-bold text-primary">
        Procuroo
      </Link>

      {showNavigation && (
        <nav className="hidden md:flex items-center gap-8">
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
        </nav>
      )}

      <div className="flex gap-4">
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
      </div>
    </header>
  );
}
