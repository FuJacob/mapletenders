import { BookmarkSimple, MagnifyingGlass } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export default function CalendarEmptyState() {
  return (
    <div className="bg-surface rounded-lg border border-border shadow-sm p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-surface-muted rounded-lg flex items-center justify-center mx-auto mb-6">
          <BookmarkSimple className="w-10 h-10 text-text-light" />
        </div>

        <h3 className="text-xl font-semibold text-text mb-4">
          No Bookmarked Tender Deadlines
        </h3>

        <p className="text-text-muted mb-8 leading-relaxed">
          Your calendar will show important deadlines from your bookmarked
          tenders. Start by bookmarking tenders you're interested in to track
          their closing dates here.
        </p>

        <div className="space-y-4">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <MagnifyingGlass className="w-5 h-5" />
            Search Tenders
          </Link>

          <div className="text-sm text-text-light">
            <p>
              Tip: Click the bookmark icon on any tender to add it to your
              calendar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
