export interface TenderSearchResult {
  // Core identifiers
  id: string;
  reference_number?: string;
  solicitation_number?: string;
  
  // Main content
  title?: string;
  tender_description?: string;
  precomputed_summary?: string;
  
  // Dates
  publication_date?: string;
  tender_closing_date?: string;
  expected_contract_start_date?: string;
  expected_contract_end_date?: string;
  amendment_date?: string;
  
  // Status and classification
  tender_status?: string;
  notice_type?: string;
  procurement_method?: string;
  procurement_category?: string;
  
  // Geographic information
  regions_of_delivery?: string;
  regions_of_opportunity?: string;
  contracting_entity_province?: string;
  contracting_entity_city?: string;
  contracting_entity_country?: string;
  
  // Organization details
  contracting_entity_name?: string;
  end_user_entities_name?: string;
  
  // Contact information
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_province?: string;
  contact_city?: string;
  
  // Classification codes
  gsin?: string;
  gsin_description?: string;
  unspsc?: string;
  unspsc_description?: string;
  
  // Additional details
  trade_agreements?: string;
  selection_criteria?: string;
  limited_tendering_reason?: string;
  amendment_number?: string;
  attachments?: string;
  notice_url?: string;
  
  // Search-specific metadata
  search_score?: number;
  match_explanation?: string;
}

export interface SearchTendersRequest {
  q: string;
  regions?: string[];
  procurement_method?: string;
  procurement_category?: string[];
  notice_type?: string[];
  tender_status?: string[];
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