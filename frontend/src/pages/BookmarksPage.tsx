import { useState } from "react";
import { BookmarkIcon } from "@phosphor-icons/react";
import BookmarkedTenders from "../components/dashboard/BookmarkedTenders";
import { PageHeader } from "../components/ui";
import { TenderNoticeFullContent } from "../components/tenderNotice/TenderNoticeFullContent";

export default function BookmarksPage() {
  const [selectedTender, setSelectedTender] = useState<string | null>("");

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header Section with Search History - Fixed Height */}
      <div className="flex-shrink-0 mb-3">
        <div className="flex items-start justify-between gap-6 mb-3">
          <PageHeader
            icon={<BookmarkIcon className="w-10 h-10 text-primary" />}
            title="Bookmarks"
            description="Discover opportunities using AI"
          />
          {/* Search History - Horizontal beside header */}
        </div>
      </div>

      {/* Main Content: 2/5 and 3/5 Layout - Takes remaining height */}
      <div className="flex gap-4 flex-1 min-h-0 overflow-hidden">
        {/* Left Side - Tender Details (2/5) */}
        <div className="w-2/5 flex flex-col min-h-0">
          <TenderNoticeFullContent tenderId={selectedTender} compact={true} />
        </div>

        {/* Right Side - Search Results (3/5) */}
        <div className="w-3/5 flex flex-col min-h-0">
          <BookmarkedTenders
            setSelectedTender={setSelectedTender}
          />
        </div>
      </div>
    </div>
  );
}
