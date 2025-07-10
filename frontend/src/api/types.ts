import { type Tender } from "../features/tenders/types";

export interface LeadGenerationFormData {
  [key: string]: string | number | boolean | string[];
}

export interface LeadGenerationResponse {
  leads: unknown[];
  success: boolean;
  message?: string;
}

export interface RfpAnalysisData {
  [key: string]: unknown;
}

export interface RfpAnalysisResponse {
  analysis: unknown;
  success: boolean;
  message?: string;
}

export interface TenderSummaryRequest {
  tenderData: string;
}

// API response structure - what we get from the backend
export interface TenderSummaryResponse {
  summary: TenderSummaryData;
}

// The actual structure of the summary data
export interface TenderSummaryData {
  summary: string;
  keyDetails?: {
    objective?: string;
    category?: string;
    value?: string;
  };
  requirements?: string[];
  recommendation?: {
    priority?: string;
    reason?: string;
  };
}

export interface RefreshTendersResponse {
  success: boolean;
  updatedCount: number;
}

export interface ImportTendersResponse {
  success: boolean;
  message: string;
}

export interface PdfAnalysisResponse {
  analysis: Record<string, unknown>;
  success: boolean;
  message?: string;
}

export { type Tender };
