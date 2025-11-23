import { handleApiError } from "./config";
import {
  type LeadGenerationFormData,
  type LeadGenerationResponse,
  type RfpAnalysisData,
  type RfpAnalysisResponse,
  type TenderSummaryResponse,
} from "./types";
import apiClient from "../client/apiClient";

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
 * Generate AI summary for tender data
 * @param {string} tenderData - The tender data as a string to summarize
 * @returns {Promise<TenderSummaryResponse>} AI generated summary
 */
export const generateTenderSummary = async (
  tenderId: string,
  tenderData: string
): Promise<TenderSummaryResponse> => {
  try {
    const response = await apiClient.post("/ai/generateTenderSummary", {
      tenderId,
      tenderData,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, "Generate tender summary");
  }
};
