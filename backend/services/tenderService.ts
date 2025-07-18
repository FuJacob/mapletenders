import { DatabaseService } from "./databaseService";
import { CsvService } from "./csvService";
import { MlService } from "./mlService";
import { AiService } from "./aiService";
import type { Database } from "../database.types";

/**
 * Parse Canadian date string format and return ISO string or null
 */
function parseCanadianDate(dateString: string): string | null {
  if (!dateString || dateString.trim() === "") return null;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
}

/**
 * Convert a raw Canadian CSV row to the new simplified schema.
 */
function mapCanadianTender(row: any): any {
  return {
    id: row["referenceNumber-numeroReference"] || row.id,
    source: "canadian",
    source_reference: row["referenceNumber-numeroReference"],
    source_url: row["noticeURL-URLavis-eng"],
    
    title: row["title-titre-eng"],
    description: row["tenderDescription-descriptionAppelOffres-eng"],
    status: row["tenderStatus-statutSollicitation"]?.toLowerCase(),
    
    published_date: parseCanadianDate(row["publicationDate-datePublication"]),
    closing_date: parseCanadianDate(row["tenderClosingDate-dateFermetureSoumission"]),
    contract_start_date: parseCanadianDate(row["expectedContractStartDate-dateDebutPrevueContrat"]),
    
    contracting_entity_name: row["contractingEntityName-nomEntiteContractante"],
    contracting_entity_city: row["contractingEntityCity-villeEntiteContractante"],
    contracting_entity_province: row["contractingEntityProvince-provinceEntiteContractante"],
    contracting_entity_country: row["contractingEntityCountry-paysEntiteContractante"] || "CA",
    
    delivery_location: row["regionsOfDelivery-regionsLivraison"],
    category_primary: row["procurementCategory-categorieDapprovisionnement"],
    procurement_type: row["noticeType-typeAvis"]?.toLowerCase().includes("rfp") ? "rfp" : "tender",
    procurement_method: row["procurementMethod-methodeDapprovisionnement"]?.toLowerCase(),
    
    estimated_value_min: null,
    currency: "CAD",
    
    contact_name: row["contactName-nomPersonneRessource"],
    contact_email: row["contactEmail-courrielPersonneRessource"],
    contact_phone: row["contactPhone-telephonePersonneRessource"],
    
    gsin: row["gsin-nisp"],
    unspsc: row["unspsc"],
    
    plan_takers_count: null,
    submissions_count: null,
    
    embedding: null,
    summary: null,
    
    last_scraped_at: new Date().toISOString()
  };
}

export class TenderService {
  constructor(
    private dbService: DatabaseService,
    private csvService: CsvService,
    private mlService: MlService,
    private aiService: AiService
  ) {}

  async getTendersFromBookmarkIds(bookmarkIds: string[]) {
    const { data, error } = await this.dbService.getTendersFromBookmarkIds(
      bookmarkIds
    );
    if (error) {
      throw new Error(
        `Failed to fetch tenders from bookmark ids: ${error.message}`
      );
    }
    return data;
  }
  async getAllBookmarks() {
    const { data, error } = await this.dbService.getAllBookmarks();
    if (error) {
      throw new Error(`Failed to fetch tender notices: ${error.message}`);
    }
    return data;
  }

  async downloadTendersCsv() {
    return await this.csvService.downloadTendersCsvStream();
  }

  async getAllTenders() {
    const { data, error } = await this.dbService.getAllTenders();
    if (error) {
      throw new Error(`Failed to fetch tender notices: ${error.message}`);
    }
    return data;
  }

  async getTenderById(id: string) {
    const { data, error } = await this.dbService.getTenderById(id);
    if (error) {
      throw new Error(`Failed to fetch tender notice: ${error.message}`);
    }
    return data;
  }

  async getTendersByIds(ids: string[]) {
    const { data, error } = await this.dbService.getTendersByIds(ids);
    if (error) {
      throw new Error(`Failed to fetch tenders by IDs: ${error.message}`);
    }
    return data;
  }

  async importTendersFromCsv() {
    // 1. Download CSV data (no longer clearing first to preserve bookmarks)
    const csvResponse = await this.csvService.downloadTendersCsvData();

    // 2. Parse and transform data using new mapping
    const parsedData = await this.csvService.parseCsvData(csvResponse.data);
    const transformedData = parsedData.data.map(row => mapCanadianTender(row));

    // 3. Generate embeddings
    console.log("Generating embeddings for Canadian tenders...");
    const embeddingsData = await this.mlService.generateEmbeddings(transformedData);

    // 4. Combine data with embeddings
    const finalData = transformedData.map((tender, index) => ({
      ...tender,
      embedding: embeddingsData.embeddings?.[index] || null,
    }));

    // 5. Upsert to database to preserve existing tender IDs and bookmarks
    console.log("Upserting tenders to preserve bookmarks...");
    try {
      await this.dbService.upsertTenders(finalData);
    } catch (error: any) {
      throw new Error(`Failed to upsert tenders: ${error.message}`);
    }

    // 6. Generate precomputed summaries for first 10 tenders (rate limit protection)
    console.log("Generating precomputed summaries for first 10 tenders...");
    try {
      for (let i = 0; i < Math.min(finalData.length, 10); i++) {
        const tender = finalData[i];
        console.log(
          `Generating summary for tender ${i + 1}/${Math.min(finalData.length, 10)}: ${
            tender.id
          }`
        );

        try {
          const summary = await this.aiService.generatePrecomputedSummary(
            tender
          );

          // Update the tender with the precomputed summary
          await this.dbService.updateTenderSummary(tender.id!, summary);

          console.log(`✓ Summary generated for ${tender.id}`);
        } catch (summaryError: any) {
          console.error(
            `Failed to generate summary for ${tender.id}:`,
            summaryError.message
          );
          // Continue with next tender even if one fails
        }

        // Small delay to avoid hitting rate limits too hard
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log("Precomputed summaries generation completed");
    } catch (error: any) {
      console.error("Error during summary generation:", error.message);
      // Don't fail the entire import if summaries fail
    }

    // 7. Remove tenders that are no longer in the dataset
    const currentReferenceNumbers = finalData
      .map((tender) => tender.source_reference)
      .filter((ref) => ref !== null) as string[];

    if (currentReferenceNumbers.length > 0) {
      console.log("Removing stale tenders...");
      await this.dbService.removeStaleTemders(currentReferenceNumbers);
    }

    // 8. Sync to Elasticsearch for AI-powered search
    console.log("🔄 Syncing tenders to Elasticsearch...");
    try {
      const syncResult = await this.mlService.syncTendersToElasticsearch();
      console.log("✅ Elasticsearch sync completed:", syncResult);
    } catch (error: any) {
      console.error(
        "⚠️ Elasticsearch sync failed (non-blocking):",
        error.message
      );
      // Don't fail the import if Elasticsearch sync fails
      // This allows the system to continue working even if search is temporarily unavailable
    }

    return {
      message: "Data imported successfully!",
      count: finalData.length,
      elasticsearch_synced: true,
    };
  }

  async searchTendersByVector(query: string) {
    if (!query) {
      throw new Error("Query is required");
    }

    console.log(`Processing vector search for query: "${query}"`);

    try {
      // 1. Generate query embedding
      const embeddingResponse = await this.mlService.generateQueryEmbedding(
        query
      );
      const vector = embeddingResponse.embedded_query;

      // 2. Validate vector
      if (!this.mlService.validateEmbeddingVector(vector)) {
        throw new Error("Invalid embedding vector returned from ML service");
      }

      // 3. Search using vector similarity
      const { data: tenders, error } =
        await this.dbService.searchTendersByVector(vector);
      if (error) {
        throw new Error(`Failed to match tenders: ${error.message}`);
      }

      console.log(`Found ${tenders?.length || 0} matching tenders`);

      return { tenders: tenders || [] };
    } catch (mlError: any) {
      console.error("Error connecting to ML service:", mlError.message);
      throw new Error(`ML service unavailable: ${mlError.message}`);
    }
  }

  async filterTendersWithAi(prompt: string, data: any[]) {
    return await this.aiService.filterTenders(prompt, data);
  }

  /**
   * Refresh tenders by clearing existing data and importing fresh data
   * Silently skips if refreshed within last 24 hours
   * @returns {Promise<any>} Operation result
   */
  async refreshTendersIfNeeded() {
    console.log("Checking if tender refresh is needed...");

    // 1. Atomically try to acquire the refresh lock
    const lockAcquired = await this.dbService.tryAcquireRefreshLock();
    if (!lockAcquired) {
      console.log("Refresh already in progress, skipping...");
      return {
        message: "Refresh already in progress",
        status: "skipped",
      };
    }

    try {
      console.log("Lock acquired, checking rate limiting...");

      // 2. Check rate limiting
      const currentDate = new Date().getTime();
      const { data: refreshData, error } =
        await this.dbService.getLastRefreshDate();

      if (!error && refreshData?.value) {
        const lastRefresh = Number(refreshData.value);
        const timeSinceLastRefresh = currentDate - lastRefresh;
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (timeSinceLastRefresh < twentyFourHours) {
          const hoursRemaining = Math.ceil(
            (twentyFourHours - timeSinceLastRefresh) / (60 * 60 * 1000)
          );
          console.log(`Refresh not needed - ${hoursRemaining} hours remaining`);
          return {
            message: "Refresh skipped - too soon",
            hoursUntilNextRefresh: hoursRemaining,
            lastRefreshAt: new Date(lastRefresh).toISOString(),
          };
        }
      }

      console.log("Starting tender refresh...");

      // 3. Import fresh tender data (using upsert to preserve bookmarks)
      const importResult = await this.importTendersFromCsv();

      // 4. Update last refresh timestamp
      await this.dbService.resetTenderLastRefreshDate();

      return {
        message: "Tenders refreshed successfully",
        importedCount: importResult?.count || 0,
        refreshedAt: new Date().toISOString(),
      };
    } finally {
      // 6. Always release the lock, even if refresh fails
      await this.dbService.setRefreshInProgress(false);
      console.log("Refresh lock released");
    }
  }
}
