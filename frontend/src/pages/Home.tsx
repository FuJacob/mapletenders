import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AppPageContainer } from "../components/layout";

export default function Home() {
  const navigate = useNavigate();

  // Redirect to search page by default
  useEffect(() => {
    navigate("/search");
  }, [navigate]);

  return (
    <AppPageContainer>
      <div className="text-center py-36">
        <p className="text-text-light">Redirecting to search...</p>
      </div>
    </AppPageContainer>
  );
}
