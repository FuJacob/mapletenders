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
import { AppContainer } from "../components/layout";

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
    <AppContainer>
      {/* Header Section */}
      <PageHeader
        icon={<Bookmark className="w-10 h-10 text-primary" />}
        title="Bookmarked Tenders"
        description="All your saved procurement opportunities in one place"
      />

      {/* Bookmarks Content */}
      <BookmarkedTenders
        bookmarks={bookmarkedTenders}
        loading={bookmarksLoading}
      />
    </AppContainer>
  );
}
