import axios from "axios";
import { handleApiError } from "./config";
import type { Database } from "../../database.types";

type BookmarkRow = Database["public"]["Tables"]["bookmarks"]["Row"];
type TenderNoticeRow = Database["public"]["Tables"]["tenders_new"]["Row"];

export interface BookmarkWithTender extends BookmarkRow {
  tender_notice: TenderNoticeRow;
}

export interface CreateBookmarkRequest {
  userId: string;
  tenderNoticeId: string;
  notes?: string;
}

export interface UpdateBookmarkNotesRequest {
  notes: string;
}

export interface BookmarkResponse {
  success: boolean;
  bookmark?: BookmarkRow;
  error?: string;
}

export interface BookmarksResponse {
  bookmarks: BookmarkWithTender[];
  error?: string;
}

export interface BookmarkStatusResponse {
  isBookmarked: boolean;
  error?: string;
}

/**
 * Create a new bookmark
 */
export const createBookmark = async (
  data: CreateBookmarkRequest
): Promise<BookmarkResponse> => {
  try {
    const response = await axios.post("/bookmarks", data);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Create bookmark");
  }
};

/**
 * Get all bookmarks for a user with tender details
 */
export const getUserBookmarks = async (
  userId: string
): Promise<BookmarksResponse> => {
  try {
    const response = await axios.get(`/bookmarks/user/${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get user bookmarks");
  }
};

/**
 * Remove a bookmark
 */
export const removeBookmark = async (
  userId: string,
  tenderNoticeId: string
): Promise<{ success: boolean; removed: boolean; error?: string }> => {
  try {
    const response = await axios.delete(
      `/bookmarks/${userId}/${tenderNoticeId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Remove bookmark");
  }
};

/**
 * Update bookmark notes
 */
export const updateBookmarkNotes = async (
  userId: string,
  tenderNoticeId: string,
  data: UpdateBookmarkNotesRequest
): Promise<BookmarkResponse> => {
  try {
    const response = await axios.put(
      `/bookmarks/${userId}/${tenderNoticeId}/notes`,
      data
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Update bookmark notes");
  }
};

/**
 * Check if a tender is bookmarked by the user
 */
export const checkBookmarkStatus = async (
  userId: string,
  tenderNoticeId: string
): Promise<BookmarkStatusResponse> => {
  try {
    const response = await axios.get(
      `/bookmarks/${userId}/${tenderNoticeId}/status`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Check bookmark status");
  }
};
