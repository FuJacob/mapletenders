import { createClient } from "@supabase/supabase-js";

export class DatabaseService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_KEY || ""
    );
  }

  async clearTenders() {
    return await this.supabase
      .from("tenders")
      .delete()
      .neq("title", 0);
  }

  async insertTenders(tenderData: any[]) {
    return await this.supabase
      .from("tenders")
      .insert(tenderData);
  }

  async getTenderById(id: string) {
    return await this.supabase
      .from("tenders")
      .select("*")
      .eq("id", id)
      .single();
  }

  async getAllTenders() {
    return await this.supabase.from("tenders").select("*");
  }

  async getTendersForAiFiltering(limit: number = 5) {
    return await this.supabase
      .from("tenders")
      .select(
        "referenceNumber-numeroReference, tenderDescription-descriptionAppelOffres-eng"
      )
      .limit(limit);
  }

  async getTendersByReferenceNumbers(referenceNumbers: string[]) {
    return await this.supabase
      .from("tenders")
      .select("*")
      .in("referenceNumber-numeroReference", referenceNumbers);
  }

  async clearFilteredTenderNotices() {
    return await this.supabase
      .from("filtered_open_tender_notices")
      .delete()
      .neq("referenceNumber-numeroReference", 0);
  }

  async insertFilteredTenderNotices(data: any[]) {
    return await this.supabase
      .from("filtered_open_tender_notices")
      .insert(data);
  }

  async getFilteredTenderNotices() {
    return await this.supabase.from("filtered_open_tender_notices").select("*");
  }

  async insertRfpAnalysis(data: string) {
    return await this.supabase
      .from("rfp_analysis")
      .insert({ data });
  }

  async searchTendersByVector(queryEmbedding: number[], matchThreshold: number = 0.78, matchCount: number = 30) {
    return await this.supabase.rpc(
      "match_tenders_by_vector",
      {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
      }
    );
  }
}
