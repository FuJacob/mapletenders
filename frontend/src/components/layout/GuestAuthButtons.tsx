import { useNavigate } from "react-router-dom";

export default function GuestAuthButtons() {
  const navigate = useNavigate();

  return (
    <nav aria-label="Account">
      <ul className="flex items-center gap-4">
        <li>
          <button
            onClick={() => navigate("/sign-in")}
            className="px-4 py-2 text-sm text-text hover:text-primary transition-colors font-medium"
          >
            Sign In
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/sign-up")}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm"
          >
            Sign Up
          </button>
        </li>
      </ul>
    </nav>
  );
}
