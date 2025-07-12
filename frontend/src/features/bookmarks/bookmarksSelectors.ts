import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Basic selectors
export const selectBookmarksState = (state: RootState) => state.bookmarks;
export const selectBookmarks = (state: RootState) => state.bookmarks.bookmarks;
export const selectBookmarksLoading = (state: RootState) => state.bookmarks.loading;
export const selectBookmarksError = (state: RootState) => state.bookmarks.error;

// Derived selectors
export const selectBookmarksCount = createSelector(
  [selectBookmarks],
  (bookmarks) => bookmarks.length
);

export const selectBookmarksByStatus = createSelector(
  [selectBookmarks],
  (bookmarks) => ({
    active: bookmarks.filter((bookmark) => bookmark.status === "active"),
    archived: bookmarks.filter((bookmark) => bookmark.status === "archived"),
  })
);

export const selectBookmarkedTenders = createSelector(
  [selectBookmarks],
  (bookmarks) => bookmarks.map((bookmark) => bookmark.tender_notice)
);

export const selectIsBookmarked = (tenderNoticeId: string) =>
  createSelector([selectBookmarks], (bookmarks) =>
    bookmarks.some((bookmark) => bookmark.tender_notice_id === tenderNoticeId)
  );

export const selectBookmarkByTenderId = (tenderNoticeId: string) =>
  createSelector([selectBookmarks], (bookmarks) =>
    bookmarks.find((bookmark) => bookmark.tender_notice_id === tenderNoticeId)
  );