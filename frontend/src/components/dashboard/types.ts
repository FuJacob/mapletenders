import type { Database } from "../../../database.types";

// Use new centralized schema as source of truth
export type Tender = Database["public"]["Tables"]["tenders_new"]["Row"] & {
  relevanceScore?: number; // Custom field for dashboard
};

// Minimal tender data for components and mock data
export type TenderSummary = Pick<
  Database["public"]["Tables"]["tenders_new"]["Row"],
  | "id"
  | "title"
  | "closing_date"
  | "delivery_location"
  | "procurement_type"
  | "status"
  | "published_date"
  | "category_primary"
  | "source_url"
  | "contracting_entity"
> & {
  relevanceScore?: number;
};

// Display interface using utility types to transform database fields to friendly names
export type TenderDisplay = {
  id: string;
  title: NonNullable<Database["public"]["Tables"]["tenders_new"]["Row"]["title"]>;
  organization: string; // Extracted from contracting_entity JSON
  location: string; // From delivery_location
  deadline: NonNullable<
    Database["public"]["Tables"]["tenders_new"]["Row"]["closing_date"]
  >;
  publishDate: NonNullable<
    Database["public"]["Tables"]["tenders_new"]["Row"]["published_date"]
  >;
  category: NonNullable<
    Database["public"]["Tables"]["tenders_new"]["Row"]["category_primary"]
  >;
  status: NonNullable<
    Database["public"]["Tables"]["tenders_new"]["Row"]["status"]
  >;
  noticeUrl: NonNullable<
    Database["public"]["Tables"]["tenders_new"]["Row"]["source_url"]
  >;
  description?: Database["public"]["Tables"]["tenders_new"]["Row"]["description"];
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
export const mapTenderToDisplay = (tender: Tender): TenderDisplay => ({
  id: tender.id || "",
  title: tender.title || "Untitled",
  organization: typeof tender.contracting_entity === 'object' && tender.contracting_entity !== null 
    ? (tender.contracting_entity as any)?.name || "Unknown Organization"
    : "Unknown Organization",
  location: tender.delivery_location || "Location TBD",
  deadline: tender.closing_date || "",
  publishDate: tender.published_date || "",
  category: tender.category_primary || "General",
  status: tender.status || "Unknown",
  noticeUrl: tender.source_url || "",
  description: tender.description || undefined,
  relevanceScore: tender.relevanceScore || 0,
});
