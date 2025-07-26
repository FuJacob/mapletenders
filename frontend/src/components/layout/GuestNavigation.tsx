import { Link, useLocation } from "react-router-dom";

const navigationItems = [
  { path: "/pricing", label: "Pricing" },
  { path: "/about", label: "About" },
];

export default function GuestNavigation() {
  const location = useLocation();

  return (
    <nav aria-label="Main" className="hidden md:flex items-center gap-8">
      <ul className="flex items-center gap-8">
        {navigationItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-text hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}