import type { Database } from "../../../database.types";

// Use database types as source of truth
export type Tender = Database["public"]["Tables"]["tenders"]["Row"] & {
  relevanceScore?: number; // Custom field for dashboard
};

// Minimal tender data for components and mock data
export type TenderSummary = Pick<
  Database["public"]["Tables"]["tenders"]["Row"], 
  "id" | "title" | "contracting_entity_name" | "tender_closing_date" | "regions_of_delivery" | 
  "notice_type" | "tender_status" | "publication_date" | "procurement_category"
> & {
  relevanceScore?: number;
};

// Display interface using utility types to transform database fields to friendly names
export type TenderDisplay = {
  id: string;
  title: NonNullable<Database["public"]["Tables"]["tenders"]["Row"]["title"]>;
  organization: NonNullable<Database["public"]["Tables"]["tenders"]["Row"]["contracting_entity_name"]>;
  location: string; // Computed from multiple address fields
  deadline: NonNullable<Database["public"]["Tables"]["tenders"]["Row"]["tender_closing_date"]>;
  publishDate: NonNullable<Database["public"]["Tables"]["tenders"]["Row"]["publication_date"]>;
  category: NonNullable<Database["public"]["Tables"]["tenders"]["Row"]["procurement_category"]>;
  status: NonNullable<Database["public"]["Tables"]["tenders"]["Row"]["tender_status"]>;
  noticeUrl: NonNullable<Database["public"]["Tables"]["tenders"]["Row"]["notice_url"]>;
  description?: Database["public"]["Tables"]["tenders"]["Row"]["tender_description"];
  relevanceScore?: number;
};

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
  tender: Tender
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
