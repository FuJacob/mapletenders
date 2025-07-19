import type { Database } from "../../database.types";

// Base tender type from database
export type Tender = Database["public"]["Tables"]["tenders"]["Row"];

// Extended tender with search-specific properties
export interface TenderSearchResult extends Tender {
  search_score?: number;
  match_explanation?: string;
  is_bookmarked: boolean;
}

// Minimal tender summary for dashboard components
export interface TenderSummary {
  id: string;
  title: string;
  closing_date: string | null;
  delivery_location: string | null;
  procurement_type: string | null;
  status: string | null;
  published_date: string | null;
  category_primary: string | null;
  source_url: string | null;
  contracting_entity_name: string | null;
  contracting_entity_city?: string | null;
  contracting_entity_province?: string | null;
  procurement_method?: string | null;
  description?: string | null;
  source_reference?: string | null;
  relevanceScore?: number;
}

// Union type for all tender display variants
export type TenderDisplayData = Tender | TenderSearchResult | TenderSummary;

// Type guards
export function isTenderSearchResult(tender: TenderDisplayData): tender is TenderSearchResult {
  return 'search_score' in tender || 'match_explanation' in tender || 'is_bookmarked' in tender;
}

export function isTenderSummary(tender: TenderDisplayData): tender is TenderSummary {
  return 'relevanceScore' in tender && !('embedding' in tender);
}

export function isBaseTender(tender: TenderDisplayData): tender is Tender {
  return !isTenderSearchResult(tender) && !isTenderSummary(tender);
}

// Helper functions for safe property access
export function getTenderProperty<K extends keyof Tender>(
  tender: TenderDisplayData,
  key: K,
  fallback: Tender[K] = null as Tender[K]
): Tender[K] {
  if (key in tender) {
    return (tender as Tender)[key];
  }
  return fallback;
}

export function getOptionalTenderProperty<T = string>(
  tender: TenderDisplayData,
  key: string,
  fallback: T | null = null
): T | null {
  if (key in tender) {
    return (tender as Record<string, unknown>)[key] as T | null;
  }
  return fallback;
}

// Type-safe property accessors
export const TenderAccessors = {
  // Always available properties
  getId: (tender: TenderDisplayData): string => tender.id,
  getTitle: (tender: TenderDisplayData): string => tender.title,
  getClosingDate: (tender: TenderDisplayData): string | null => tender.closing_date,
  getProcurementType: (tender: TenderDisplayData): string | null => tender.procurement_type,
  getCategoryPrimary: (tender: TenderDisplayData): string | null => tender.category_primary,
  getContractingEntityName: (tender: TenderDisplayData): string | null => tender.contracting_entity_name,
  
  // Conditionally available properties
  getProcurementMethod: (tender: TenderDisplayData): string | null => {
    return getTenderProperty(tender, 'procurement_method');
  },
  
  getContractingEntityCity: (tender: TenderDisplayData): string | null => {
    return getTenderProperty(tender, 'contracting_entity_city');
  },
  
  getContractingEntityProvince: (tender: TenderDisplayData): string | null => {
    return getTenderProperty(tender, 'contracting_entity_province');
  },
  
  getDeliveryLocation: (tender: TenderDisplayData): string | null => {
    return getTenderProperty(tender, 'delivery_location');
  },
  
  getDescription: (tender: TenderDisplayData): string | null => {
    return getTenderProperty(tender, 'description');
  },
  
  getSourceReference: (tender: TenderDisplayData): string | null => {
    return getTenderProperty(tender, 'source_reference');
  },
  
  // Search result specific properties
  getSearchScore: (tender: TenderDisplayData): number | null => {
    return isTenderSearchResult(tender) ? tender.search_score || null : null;
  },
  
  getMatchExplanation: (tender: TenderDisplayData): string | null => {
    return isTenderSearchResult(tender) ? tender.match_explanation || null : null;
  },
  
  getIsBookmarked: (tender: TenderDisplayData): boolean => {
    return isTenderSearchResult(tender) ? tender.is_bookmarked : false;
  },
  
  // Summary specific properties
  getRelevanceScore: (tender: TenderDisplayData): number | null => {
    return isTenderSummary(tender) ? tender.relevanceScore || null : null;
  }
};