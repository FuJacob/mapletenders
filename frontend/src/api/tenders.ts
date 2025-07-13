import axios from "axios";
import { handleApiError, API_BASE_URL } from "./config";
import {
  type Tender,
  type RefreshTendersResponse,
  type ImportTendersResponse,
  type SearchTendersRequest,
  type SearchTendersResponse,
} from "./types";

/**
 * Retrieve open tender notices from database
 * @returns {Promise<Tender[]>} Array of tender notices
 */
export const getOpenTenderNoticesFromDB = async (): Promise<Tender[]> => {
  try {
    const response = await axios.get("/tenders/getOpenTenderNoticesFromDB");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Fetch tender notices");
  }
};

export const getTenderById = async (id: string): Promise<Tender> => {
  try {
    const response = await axios.get(`/tenders/getTenderById/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Fetch tender by id");
  }
};

export const getTendersFromBookmarkIds = async (
  bookmarkIds: string[]
): Promise<Tender[]> => {
  try {
    const response = await axios.post("/tenders/getTendersFromBookmarkIds", {
      bookmarkIds,
    });
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
    const response = await axios.post("/tenders/searchTenders", searchParams);
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
    const response = await axios.get(`/tender-notice/${tenderId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `Fetch tender notice ${tenderId}`);
  }
};

/**
 * Save open tender notices to database
 * @returns {Promise<ImportTendersResponse>} Operation result
 */
export const getOpenTenderNoticesToDB =
  async (): Promise<ImportTendersResponse> => {
    try {
      const response = await axios.post("/tenders/getOpenTenderNoticesToDB");
      return response.data;
    } catch (error) {
      return handleApiError(error, "Import tender notices to database");
    }
  };

/**
 * Refresh tender data (rate limited to once per 24 hours)
 * @returns {Promise<RefreshTendersResponse>} Refresh operation result
 */
export const refreshTenders = async (): Promise<RefreshTendersResponse> => {
  try {
    const response = await axios.post("/tenders/refreshTenders");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Refresh tenders");
  }
};

/**
 * Redirect to open tender notices page
 */
export const getOpenTenderNotices = () => {
  window.location.href = `${API_BASE_URL}/tenders/getOpenTenderNotices`;
};
