import axios from "axios";
import { type Tender } from "./features/tenders/types";
import type { TenderNoticeInterface } from "./features/tenders/types";
/**
 * Base URL for API endpoints
 * @constant {string}
 */
const API_BASE_URL = "http://localhost:4000";
const PDF_ANALYSIS_URL = "http://localhost:4500";

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Add response interceptor for global error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const operation = error.config?.url || "Unknown operation";
    console.error(
      `API Error [${operation}]:`,
      error.response?.data || error.message
    );

    // You can add global error notifications here
    // toast.error(`Failed to ${operation}`);

    return Promise.reject(error);
  }
);

/**
 * Generic error handler for API operations
 * @param error - The error object
 * @param operation - Description of the operation that failed
 */
const handleApiError = (error: unknown, operation: string): never => {
  console.error(`${operation} failed:`, error);
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  const responseError = (error as { response?: { data?: { error?: string } } })
    ?.response?.data?.error;
  throw new Error(`${operation} failed: ${responseError || errorMessage}`);
};

/**
 * Get AI completion - DEPRECATED: This endpoint no longer exists
 * @returns {Promise<any>} Completion response data
 */
// export const getCompletion = async () => {
//   const response = await axios.post(`${API_BASE_URL}/api/completion`);
//   return response.data;
// };

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

export interface LeadGenerationFormData {
  [key: string]: string | number | boolean | string[];
}

export interface LeadGenerationResponse {
  leads: unknown[];
  success: boolean;
  message?: string;
}

/**
 * Generate leads based on form data
 * @param {LeadGenerationFormData} formData - Form data for lead generation
 * @returns {Promise<LeadGenerationResponse>} Generated leads data
 */
export const generateLeads = async (
  formData: LeadGenerationFormData
): Promise<LeadGenerationResponse> => {
  try {
    const response = await axios.post("/ai/generateLeads", formData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Generate leads");
  }
};

/**
 * Redirect to open tender notices page
 */
export const getOpenTenderNotices = () => {
  window.location.href = `${API_BASE_URL}/tenders/getOpenTenderNotices`;
};

/**
 * Get filtered tender notices from database
 * @returns {Promise<Tender[]>} Filtered tender notices
 */
export const getFilteredTenderNoticesFromDB = async (): Promise<Tender[]> => {
  try {
    const response = await axios.get("/tenders/getFilteredTenderNoticesFromDB");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Fetch filtered tender notices");
  }
};

/**
 * Filter open tender notices based on search criteria
 * @param {string} search - Filter criteria
 * @returns {Promise<Tender[]>} Filtered tender notices
 */
export const filterOpenTenderNotices = async (
  search: string
): Promise<Tender[]> => {
  try {
    const response = await axios.get(
      `/tenders/filterOpenTenderNotices?search=${search}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Filter tender notices");
  }
};

/**
 * Save open tender notices to database
 * @returns {Promise<any>} Operation result
 */
export const getOpenTenderNoticesToDB = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post("/tenders/getOpenTenderNoticesToDB");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Import tender notices to database");
  }
};

/**
 * Analyze PDF document
 * @param {FormData} formData - Form data containing PDF file
 * @returns {Promise<any>} Analysis results
 */
export const analyzePdf = async (formData: FormData): Promise<{ analysis: Record<string, unknown>; success: boolean; message?: string }> => {
  try {
    const response = await axios.post(
      `${PDF_ANALYSIS_URL}/analyze_pdf`,
      formData
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "Analyze PDF");
  }
};

export interface RfpAnalysisData {
  [key: string]: unknown;
}

export interface RfpAnalysisResponse {
  analysis: unknown;
  success: boolean;
  message?: string;
}

/**
 * Get RFP analysis
 * @param {RfpAnalysisData} rfpData - RFP data to analyze
 * @returns {Promise<RfpAnalysisResponse>} Analysis results
 */
export const getRfpAnalysis = async (
  rfpData: RfpAnalysisData
): Promise<RfpAnalysisResponse> => {
  try {
    const response = await axios.post("/ai/getRfpAnalysis", rfpData);
    return response.data;
  } catch (error) {
    return handleApiError(error, "Get RFP analysis");
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
    // Fixed: Return response.data directly instead of response.data.tenders for consistency
    return response.data;
  } catch (error) {
    return handleApiError(error, "Filter by vector search");
  }
};

/**
 * Get individual tender notice details
 * @param {string} tenderId - The tender ID
 * @returns {Promise<TenderNoticeInterface>} Tender notice details
 */
export const getTenderNotice = async (
  tenderId: string
): Promise<TenderNoticeInterface> => {
  try {
    const response = await axios.get(`/tender-notice/${tenderId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `Fetch tender notice ${tenderId}`);
  }
};

/**
 * Refresh tender data (rate limited to once per 24 hours)
 * @returns {Promise<any>} Refresh operation result
 */
export const refreshTenders = async (): Promise<{ success: boolean; updatedCount: number }> => {
  try {
    const response = await axios.post("/tenders/refreshTenders");
    return response.data;
  } catch (error) {
    return handleApiError(error, "Refresh tenders");
  }
};
