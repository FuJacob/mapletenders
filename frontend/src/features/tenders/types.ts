import type { Database } from "../../../database.types";

// Use new centralized schema as the primary types
export type Tender = Database["public"]["Tables"]["tenders"]["Row"];
export type TenderInsert = Database["public"]["Tables"]["tenders"]["Insert"];
export type TenderUpdate = Database["public"]["Tables"]["tenders"]["Update"];

// Legacy interface - DEPRECATED: Use Tender type instead
/** @deprecated Use Tender type instead */
export type TenderNoticeInterface = Tender;
