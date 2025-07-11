import type { Database } from "../../../database.types";

// Use database types as source of truth
export type Tender = Database["public"]["Tables"]["tenders"]["Row"];
export type TenderInsert = Database["public"]["Tables"]["tenders"]["Insert"];
export type TenderUpdate = Database["public"]["Tables"]["tenders"]["Update"];

// For open tender notices (the main view table)
export type OpenTenderNotice =
  Database["public"]["Tables"]["open_tender_notices"]["Row"];
export type FilteredOpenTenderNotice =
  Database["public"]["Tables"]["filtered_open_tender_notices"]["Row"];

// Legacy interface - DEPRECATED: Use Tender type instead
/** @deprecated Use Tender type instead */
export type TenderNoticeInterface = Tender;
