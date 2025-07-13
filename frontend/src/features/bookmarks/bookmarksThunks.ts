import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserBookmarks,
  createBookmark as createBookmarkAPI,
  removeBookmark as removeBookmarkAPI,
  updateBookmarkNotes as updateBookmarkNotesAPI,
  type CreateBookmarkRequest,
} from "../../api/bookmarks";
import {
  setBookmarksLoading,
  setBookmarksError,
  setBookmarks,
  removeBookmark,
  updateBookmarkNotes,
} from "./bookmarksSlice";

// Load user's bookmarks
export const loadBookmarks = createAsyncThunk(
  "bookmarks/loadBookmarks",
  async (userId: string, { dispatch }) => {
    try {
      dispatch(setBookmarksLoading(true));
      const response = await getUserBookmarks(userId);
      
      if (response.error) {
        dispatch(setBookmarksError(response.error));
        return;
      }
      
      dispatch(setBookmarks(response.bookmarks));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load bookmarks";
      dispatch(setBookmarksError(errorMessage));
    }
  }
);

// Create a new bookmark
export const createBookmark = createAsyncThunk(
  "bookmarks/createBookmark",
  async (data: CreateBookmarkRequest, { dispatch }) => {
    try {
      const response = await createBookmarkAPI(data);
      
      if (response.error || !response.bookmark) {
        dispatch(setBookmarksError(response.error || "Failed to create bookmark"));
        return;
      }
      
      // We need to fetch the complete bookmark with tender data
      // Since the create API only returns the bookmark without tender details
      dispatch(loadBookmarks(data.userId));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create bookmark";
      dispatch(setBookmarksError(errorMessage));
    }
  }
);

// Remove a bookmark
export const removeBookmarkThunk = createAsyncThunk(
  "bookmarks/removeBookmark",
  async ({ userId, tenderNoticeId }: { userId: string; tenderNoticeId: string }, { dispatch }) => {
    try {
      const response = await removeBookmarkAPI(userId, tenderNoticeId);
      
      if (response.error || !response.success) {
        dispatch(setBookmarksError(response.error || "Failed to remove bookmark"));
        return;
      }
      
      dispatch(removeBookmark(tenderNoticeId));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to remove bookmark";
      dispatch(setBookmarksError(errorMessage));
    }
  }
);

// Update bookmark notes
export const updateBookmarkNotesThunk = createAsyncThunk(
  "bookmarks/updateBookmarkNotes",
  async (
    { userId, tenderNoticeId, notes }: { userId: string; tenderNoticeId: string; notes: string },
    { dispatch }
  ) => {
    try {
      const response = await updateBookmarkNotesAPI(userId, tenderNoticeId, { notes });
      
      if (response.error || !response.bookmark) {
        dispatch(setBookmarksError(response.error || "Failed to update bookmark notes"));
        return;
      }
      
      dispatch(updateBookmarkNotes({ tenderNoticeId, notes }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update bookmark notes";
      dispatch(setBookmarksError(errorMessage));
    }
  }
);