export interface TenderSearchResult {
  // Core identifiers
  id: string;
  source_reference?: string;
  source?: string;
  
  // Main content
  title?: string;
  description?: string;
  summary?: string;
  
  // Dates
  published_date?: string;
  closing_date?: string;
  contract_start_date?: string;
  last_scraped_at?: string;
  
  // Status and classification
  status?: string;
  procurement_type?: string;
  procurement_method?: string;
  category_primary?: string;
  
  // Geographic information
  delivery_location?: string;
  contracting_entity_province?: string;
  contracting_entity_city?: string;
  contracting_entity_country?: string;
  
  // Organization details
  contracting_entity_name?: string;
  
  // Contact information
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  
  // Financial information
  estimated_value_min?: number;
  currency?: string;
  
  // Classification codes
  gsin?: string;
  unspsc?: string;
  
  // Additional details
  plan_takers_count?: number;
  submissions_count?: number;
  source_url?: string;
  
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