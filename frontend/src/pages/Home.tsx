import TableViewHome from "./views/TableViewHome";
import SearchViewHome from "./views/SearchViewHome";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const view = searchParams.get("view") || "search";

  // Redirect to RFP analysis page if RFP view is selected
  useEffect(() => {
    if (view === "rfp") {
      navigate("/rfp-analysis");
    }
  }, [view, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto p-6 py-36">
        {view === "table" ? <TableViewHome /> : <SearchViewHome />}
      </div>
    </div>
  );
}
