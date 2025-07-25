import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  selectBookmarkedTenders,
  selectBookmarksLoading,
} from "../features/bookmarks/bookmarksSelectors";
import { loadBookmarks } from "../features/bookmarks/bookmarksThunks";
import { useAuth } from "../hooks/auth";
import { Bookmark } from "@phosphor-icons/react";
import BookmarkedTenders from "../components/dashboard/BookmarkedTenders";
import { PageHeader } from "../components/ui";

export default function BookmarksPage() {
  const dispatch = useAppDispatch();
  const { profile } = useAuth();
  const bookmarkedTenders = useAppSelector(selectBookmarkedTenders);
  const bookmarksLoading = useAppSelector(selectBookmarksLoading);

  // Load bookmarks when component mounts
  useEffect(() => {
    if (profile?.id) {
      dispatch(loadBookmarks(profile.id));
    }
  }, [dispatch, profile?.id]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        {/* Header Section */}
        <PageHeader
          icon={<Bookmark className="w-10 h-10 text-primary" />}
          title="Bookmarked Tenders"
          description="All your saved procurement opportunities in one place"
        />
      </div>

      <div className="flex-1 min-h-0">
        {/* Bookmarks Content */}
        <BookmarkedTenders
          bookmarks={bookmarkedTenders}
          loading={bookmarksLoading}
        />
      </div>
    </div>
  );
}
