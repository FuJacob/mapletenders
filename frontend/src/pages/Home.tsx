import TableViewHome from "./views/TableViewHome";
import SearchViewHome from "./views/SearchViewHome";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view") || "search";
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto p-6 py-36">
        {view === "table" ? <TableViewHome /> : <SearchViewHome />}
      </div>
    </div>
  );
}
