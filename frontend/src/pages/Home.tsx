import { useEffect, useState } from "react";
import { loadTenders } from "../features/tenders/tendersThunk";
import { useAppDispatch } from "../app/hooks";

import TableViewHome from "./views/TableViewHome";
import SearchViewHome from "./views/SearchViewHome";
export default function Home() {
  const dispatch = useAppDispatch();

  const [view, setView] = useState<"search" | "table">("search"); // Default view

  useEffect(() => {
    dispatch(loadTenders());

    // Listen for view changes from Header
    const handleViewChange = (event: CustomEvent) => {
      setView(event.detail);
    };

    window.addEventListener("viewChange", handleViewChange as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener(
        "viewChange",
        handleViewChange as EventListener
      );
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto p-6 py-36">
        {view === "search" ? <SearchViewHome /> : <TableViewHome />}
      </div>
    </div>
  );
}
