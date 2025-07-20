import apiClient from "../client/apiClient";
import { handleApiError } from "./config";
import {
  type Tender,
  type RefreshTendersResponse,
  type SearchTendersRequest,
  type SearchTendersResponse,
} from "./types";

export const getTenderById = async (id: string): Promise<Tender> => {
  try {
    const response = await apiClient.get(`/tenders/getTenderById/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Fetch tender by id");
  }
};

export const getTendersFromBookmarkIds = async (
  bookmarkIds: string[]
): Promise<Tender[]> => {
  try {
    const response = await apiClient.post(
      "/tenders/getTendersFromBookmarkIds",
      {
        bookmarkIds,
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Fetch tenders from bookmark ids");
  }
};

/**
 * Search tenders using AI-powered Elasticsearch with vector similarity
 * @param {SearchTendersRequest} searchParams - The search parameters
 * @returns {Promise<SearchTendersResponse>} Search results with metadata
 */
export const searchTenders = async (
  searchParams: SearchTendersRequest
): Promise<SearchTendersResponse> => {
  try {
    const response = await apiClient.post(
      "/tenders/searchTenders",
      searchParams
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Search tenders");
  }
};

/**
 * Get individual tender notice details
 * @param {string} tenderId - The tender ID
 * @returns {Promise<Tender>} Tender notice details
 */
export const getTenderNotice = async (tenderId: string): Promise<Tender> => {
  try {
    const response = await apiClient.get(`/tender-notice/${tenderId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `Fetch tender notice ${tenderId}`);
  }
};

/**
 * Get recommended tenders based on user profile
 * @returns {Promise<SearchTendersResponse>} Recommended tenders for the authenticated user
 */
export const getRecommendedTenders =
  async (): Promise<SearchTendersResponse> => {
    try {
      const response = await apiClient.get("/tenders/recommended");
      return response.data;
    } catch (error) {
      return handleApiError(error, "Get recommended tenders");
    }
  };

/**
 * Refresh tender data (rate limited to once per 24 hours)
 * @returns {Promise<RefreshTendersResponse>} Refresh operation result
 */
export const refreshTenders = async (): Promise<RefreshTendersResponse> => {
  try {
    const response = await apiClient.post("/tenders/refreshTenders");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Refresh tenders");
  }
};
