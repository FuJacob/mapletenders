import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BookmarkWithTender } from "../../api/bookmarks";

interface BookmarksState {
  bookmarks: BookmarkWithTender[];
  loading: boolean;
  error: string | null;
}

const initialState: BookmarksState = {
  bookmarks: [],
  loading: false,
  error: null,
};

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    setBookmarksLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setBookmarksError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setBookmarks: (state, action: PayloadAction<BookmarkWithTender[]>) => {
      state.bookmarks = action.payload;
      state.loading = false;
      state.error = null;
    },
    addBookmark: (state, action: PayloadAction<BookmarkWithTender>) => {
      // Check if bookmark already exists
      const existingIndex = state.bookmarks.findIndex(
        (bookmark) =>
          bookmark.tender_notice_id === action.payload.tender_notice_id
      );

      if (existingIndex === -1) {
        state.bookmarks.unshift(action.payload); // Add to beginning
      } else {
        state.bookmarks[existingIndex] = action.payload; // Update existing
      }
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarks = state.bookmarks.filter(
        (bookmark) => bookmark.tender_notice_id !== action.payload
      );
    },
    updateBookmarkNotes: (
      state,
      action: PayloadAction<{ tenderNoticeId: string; notes: string }>
    ) => {
      const bookmark = state.bookmarks.find(
        (b) => b.tender_notice_id === action.payload.tenderNoticeId
      );
      if (bookmark) {
        bookmark.notes = action.payload.notes;
        bookmark.updated_at = new Date().toISOString();
      }
    },
    clearBookmarks: (state) => {
      state.bookmarks = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setBookmarksLoading,
  setBookmarksError,
  setBookmarks,
  addBookmark,
  removeBookmark,
  updateBookmarkNotes,
  clearBookmarks,
} = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
