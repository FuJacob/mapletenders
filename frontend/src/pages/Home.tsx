import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();

  // Redirect to search page by default
  useEffect(() => {
    navigate("/search");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto p-6 py-36">
        <div className="text-center">
          <p className="text-text-light">Redirecting to search...</p>
        </div>
      </div>
    </div>
  );
}
