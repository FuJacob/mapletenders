import { DatabaseService } from "./databaseService";
import { MlService } from "./mlService";
import { AiService } from "./aiService";
import { ScrapingService } from "./scrapingService";

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
    closing_date: parseCanadianDate(
      row["tenderClosingDate-dateFermetureSoumission"]
    ),
    contract_start_date: parseCanadianDate(
      row["expectedContractStartDate-dateDebutPrevueContrat"]
    ),

    contracting_entity_name: row["contractingEntityName-nomEntiteContractante"],
    contracting_entity_city:
      row["contractingEntityCity-villeEntiteContractante"],
    contracting_entity_province:
      row["contractingEntityProvince-provinceEntiteContractante"],
    contracting_entity_country:
      row["contractingEntityCountry-paysEntiteContractante"] || "CA",

    delivery_location: row["regionsOfDelivery-regionsLivraison"],
    category_primary: row["procurementCategory-categorieDapprovisionnement"],
    procurement_type: row["noticeType-typeAvis"]?.toLowerCase().includes("rfp")
      ? "rfp"
      : "tender",
    procurement_method:
      row["procurementMethod-methodeDapprovisionnement"]?.toLowerCase(),

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

    last_scraped_at: new Date().toISOString(),
  };
}

export class TenderService {
  constructor(
    private dbService: DatabaseService,
    private mlService: MlService,
    private aiService: AiService,
    private scrapingService: ScrapingService
  ) {}

  async getTendersFromBookmarkIds(bookmarkIds: string[]) {
    const { data, error } =
      await this.dbService.getTendersFromBookmarkIds(bookmarkIds);
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

  async getAllTenders() {
    const { data, error } = await this.dbService.getAllTenders();
    if (error) {
      throw new Error(`Failed to fetch tender notices: ${error.message}`);
    }
    return data;
  }

  async getTendersPaginated(params: {
    offset: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: string;
    filters: {
      status?: string;
      category?: string;
      region?: string;
      entity?: string;
    };
  }) {
    const { data, error, total } = await this.dbService.getTendersPaginated({
      page: Math.floor(params.offset / params.limit) + 1,
      limit: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder as "asc" | "desc",
      filters: params.filters,
    });
    if (error) {
      throw new Error(`Failed to fetch paginated tenders: ${error}`);
    }
    return { data, total };
  }

  async getTenderStatistics() {
    const { data, error } = await this.dbService.getTenderStatistics();
    if (error) {
      throw new Error(`Failed to fetch tender statistics: ${error}`);
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

  async searchTendersByVector(query: string) {
    if (!query) {
      throw new Error("Query is required");
    }

    console.log(`Processing vector search for query: "${query}"`);

    try {
      // 1. Generate query embedding
      const embeddingResponse =
        await this.mlService.generateQueryEmbedding(query);
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

      // first let's delete expired tenders
      const { error: delError } = await this.dbService.removeExpiredTenders();
      if (delError) {
        throw new Error(
          `Failed to remove expired tenders: ${delError.message}`
        );
      }

      const scrapers = [
        this.scrapingService.importCanadianTenders(),
        this.scrapingService.importTorontoTenders(),
        this.scrapingService.importOntarioTenders(),
        this.scrapingService.importMississaugaTenders(),
        this.scrapingService.importBramptonTenders(),
        this.scrapingService.importHamiltonTenders(),
        this.scrapingService.importLondonTenders(),
        this.scrapingService.importQuebecTenders(),
      ];

      const importResult = await Promise.allSettled(scrapers);
      let importedCount = 0;
      let index = 0;
      for (const result of importResult) {
        if (result.status === "rejected") {
          console.error(
            `Failed to import tenders from ${index} source:`,
            result.reason
          );
        }
        if (result.status === "fulfilled") {
          importedCount += result.value.count;
        }
        index++;
      }
      console.log(`Imported ${importedCount} tenders`);
      // 4. Update last refresh timestamp
      await this.dbService.resetTenderLastRefreshDate();

      return {
        message: "Tenders refreshed successfully",
        importedCount: importedCount,
        refreshedAt: new Date().toISOString(),
      };
    } finally {
      // 6. Always release the lock, even if refresh fails
      await this.dbService.setRefreshInProgress(false);
      console.log("Refresh lock released");
    }
  }
}
