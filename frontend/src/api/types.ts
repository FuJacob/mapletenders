// Re-export types from centralized location
export type { Tender, TenderSearchResult, TenderSummary, TenderDisplayData } from "../types/tender";
import type { TenderSearchResult } from "../types/tender";

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
  analysis: string;
  keyRequirements?: string[];
  timeline?: {
    proposalDeadline?: string;
    projectStart?: string;
    projectEnd?: string;
    keyMilestones?: Array<{
      date: string;
      description: string;
    }>;
  };
  evaluation?: {
    criteria: Array<{
      criterion: string;
      weight: number;
      description: string;
    }>;
    scoringMethod: string;
  };
  budgetInfo?: {
    estimatedValue: string;
    paymentTerms: string;
    budgetConstraints: string[];
  };
  complianceRequirements?: string[];
  riskFactors?: string[];
  recommendations?: string[];
  success?: boolean;
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

export interface SearchTendersRequest {
  q: string;
  regions?: string[];
  procurement_method?: string;
  procurement_category?: string[];
  notice_type?: string[];
  status?: string[];
  contracting_entity_name?: string[];
  closing_date_after?: string;
  closing_date_before?: string;
  publication_date_after?: string;
  publication_date_before?: string;
  limit?: number;
}

export interface SearchTendersResponse {
  results: TenderSearchResult[];
  total_results: number;
  query: string;
  search_metadata?: {
    elasticsearch_took_ms?: number;
    max_score?: number;
  };
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
