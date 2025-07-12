import axios from "axios";
import { handleApiError, API_BASE_URL } from "./config";
import {
  type Tender,
  type RefreshTendersResponse,
  type ImportTendersResponse,
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



/**
 * Search tenders using vector similarity
 * @param {string} q - The search query
 * @returns {Promise<Tender[]>} Array of matching tender notices
 */
export const filterByVector = async (q: string): Promise<Tender[]> => {
  try {
    const response = await axios.post("/tenders/filterByVector", { q });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Filter by vector search");
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
