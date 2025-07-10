import axios from "axios";
import { handleApiError, PDF_ANALYSIS_URL } from "./config";
import { type PdfAnalysisResponse } from "./types";

/**
 * Analyze PDF document
 * @param {FormData} formData - Form data containing PDF file
 * @returns {Promise<PdfAnalysisResponse>} Analysis results
 */
export const analyzePdf = async (
  formData: FormData
): Promise<PdfAnalysisResponse> => {
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
