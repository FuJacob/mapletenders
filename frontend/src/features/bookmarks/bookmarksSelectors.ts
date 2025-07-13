import { createSelector } from "@reduxjs/toolkit";
import { type RootState } from "../../app/configureStore";
import { type Database } from "../../../database.types";
// Assume these interfaces exist and are correct
type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];

// Basic selectors
export const selectBookmarksState = (state: RootState) => state.bookmarks;
export const selectBookmarks = (state: RootState) => state.bookmarks.bookmarks;
export const selectBookmarksLoading = (state: RootState) =>
  state.bookmarks.loading;
export const selectBookmarksError = (state: RootState) => state.bookmarks.error;

// Derived selectors
export const selectBookmarksCount = createSelector(
  [selectBookmarks],
  (bookmarks: Bookmark[]) => bookmarks.length
);

export const selectBookmarksByStatus = createSelector(
  [selectBookmarks],
  (bookmarks: Bookmark[]) => ({
    active: bookmarks.filter(
      (bookmark: Bookmark) => bookmark.status === "active"
    ),
    archived: bookmarks.filter(
      (bookmark: Bookmark) => bookmark.status === "archived"
    ),
  })
);

export const selectBookmarkedTenders = createSelector(
  [selectBookmarks],
  (bookmarks: Bookmark[]) => bookmarks.map((bookmark: Bookmark) => bookmark)
);

export const selectIsBookmarked = (tenderNoticeId: string) =>
  createSelector([selectBookmarks], (bookmarks: Bookmark[]) =>
    bookmarks.some(
      (bookmark: Bookmark) => bookmark.tender_notice_id === tenderNoticeId
    )
  );

export const selectBookmarkByTenderId = (tenderNoticeId: string) =>
  createSelector([selectBookmarks], (bookmarks: Bookmark[]) =>
    bookmarks.find(
      (bookmark: Bookmark) => bookmark.tender_notice_id === tenderNoticeId
    )
  );
