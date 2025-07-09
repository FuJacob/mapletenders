import type { Database } from "../../../database.types";

// Base database types
type TenderRow = Database["public"]["Tables"]["tenders"]["Row"];

// Dashboard-specific tender interface using database column names
export interface Tender extends Partial<TenderRow> {
  relevanceScore?: number; // Custom field for dashboard
}

// Alternative interface with friendly names for easier component usage
export interface TenderDisplay {
  id: string;
  title: string;
  organization: string;
  location: string;
  deadline: string;
  publishDate: string;
  category: string;
  status: string;
  noticeUrl: string;
  description?: string;
  relevanceScore?: number;
}

export interface Activity {
  id: number;
  action: string;
  title: string;
  time: string;
  description?: string;
  location?: string;
  publishDate?: string;
  closingDate?: string;
}

// Helper function to convert database tender to display format
export const mapTenderToDisplay = (
  tender: Partial<TenderRow> & { relevanceScore?: number }
): TenderDisplay => ({
  id: tender.id || "",
  title: tender.title || "Untitled",
  organization: tender.contracting_entity_name || "Unknown Organization",
  location: tender.regions_of_delivery || "Location TBD",
  deadline: tender.tender_closing_date || "",
  publishDate: tender.publication_date || "",
  category: tender.procurement_category || "General",
  status: tender.tender_status || "Unknown",
  noticeUrl: tender.notice_url || "",
  description: tender.tender_description || undefined,
  relevanceScore: tender.relevanceScore || 0,
});
