import { Bookmark } from "@phosphor-icons/react";
import { TenderCard } from "../tenders";
import { useEffect, useState } from "react";
import type { Tender } from "../../api/types";
import { useAuth } from "../../hooks/auth";
import { getUserBookmarks, type BookmarkWithTender } from "../../api/bookmarks";

interface BookmarkedTendersProps {
  setSelectedTender: (tenderId: string) => void;
}

export default function BookmarkedTenders({
  setSelectedTender,
}: BookmarkedTendersProps) {
  const { profile } = useAuth();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookmarkTenders = async () => {
      if (!profile?.id) {
        setTenders([]);
        return;
      }

      setLoading(true);
      try {
        const response = await getUserBookmarks(profile.id);
        
        if (response.bookmarks) {
          const tenderData = response.bookmarks.map((bookmark: BookmarkWithTender) => bookmark.tender_notice);
          setTenders(tenderData);
        } else {
          setTenders([]);
        }
      } catch (error) {
        console.error("Error fetching bookmarked tenders:", error);
        setTenders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkTenders();
  }, [profile?.id]);
  return (
    <div className="bg-surface border border-border rounded-lg p-6 flex flex-col h-full overflow-y-auto">
      <h2 className="text-xl font-semibold text-text mb-6">
        Bookmarked Tenders
      </h2>
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
            <TenderCard
              key={tender.id}
              tender={tender}
              setSelectedTender={() => setSelectedTender(tender.id)}
            />
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
