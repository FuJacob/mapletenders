import { useEffect, useState } from "react";
import { loadTenders } from "../features/tenders/tendersThunk";
import { useAppDispatch } from "../app/hooks";

import SetViewHeader from "../components/ui/SetViewHeader";
import TableViewHome from "./views/TableViewHome";
import SearchViewHome from "./views/SearchViewHome";
export default function Home() {
  const dispatch = useAppDispatch();

  const [view, setView] = useState<"search" | "table">("search"); // Default view
  
  useEffect(() => {
    dispatch(loadTenders());
  }, [dispatch]);
  
  return (
    <div className="min-h-screen bg-background">
      <div className=" mx-auto p-6 py-36 text-center">
        <SetViewHeader setView={setView} view={view} />
        {view === "search" ? <SearchViewHome /> : <TableViewHome />}
      </div>
    </div>
  );
}
