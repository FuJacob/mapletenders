import { Link } from "react-router-dom";
import { Bookmark } from "@phosphor-icons/react";
import TenderCard from "./TenderCard.tsx";
import { type Database } from "../../../database.types";
import { useEffect, useState } from "react";
import type { Tender } from "../../features/tenders/types";
type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
import { getTendersFromBookmarkIds } from "../../api/tenders";
interface BookmarkedTendersProps {
  bookmarks: Bookmark[];
  loading?: boolean;
}

export default function BookmarkedTenders({
  bookmarks,
  loading = false,
}: BookmarkedTendersProps) {
  const [tenders, setTenders] = useState<Tender[]>([]);

  useEffect(() => {
    const fetchTenders = async () => {
      const tenders = await getTendersFromBookmarkIds(
        bookmarks
          .map((bookmark) => bookmark.tender_notice_id)
          .filter(Boolean) as string[]
      );
      setTenders(tenders);
    };
    fetchTenders();
  }, [bookmarks]);
  return (
    <div className="bg-surface border border-border rounded-xl p-6 h-[1200px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text">Bookmarked Tenders</h2>
        <Link
          to="/bookmarks"
          className="text-primary hover:text-primary-dark text-sm font-medium"
        >
          View all →
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4">
              <Bookmark className="w-16 h-16 text-text-light mx-auto animate-pulse" />
            </div>
            <p className="text-text-light text-lg">Loading bookmarks...</p>
          </div>
        ) : tenders.length > 0 ? (
          tenders.map((tender) => (
            <TenderCard key={tender.id} tender={tender} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4">
              <Bookmark className="w-16 h-16 text-text-light mx-auto" />
            </div>
            <p className="text-text-light text-lg mb-2">No bookmarks yet</p>
            <p className="text-text-light text-sm">
              Start bookmarking tenders to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
