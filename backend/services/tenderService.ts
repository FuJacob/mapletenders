import { DatabaseService } from "./databaseService";
import { CsvService } from "./csvService";
import { MlService } from "./mlService";
import { DataTransformationService } from "./dataTransformationService";
import { AiService } from "./aiService";
import type { Database } from "../database.types";

export class TenderService {
  constructor(
    private dbService: DatabaseService,
    private csvService: CsvService,
    private mlService: MlService,
    private dataTransformService: DataTransformationService,
    private aiService: AiService
  ) {}

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

  async importTendersFromCsv() {
    // 1. Download CSV data (no longer clearing first to preserve bookmarks)
    const csvResponse = await this.csvService.downloadTendersCsvData();

    // 2. Parse and transform data
    const parsedData = await this.csvService.parseCsvData(csvResponse.data);
    const transformedData = this.dataTransformService.transformTenderData(
      parsedData.data
    );

    // 3. Generate embeddings
    console.log("Generating embeddings for filtered data...");
    const embeddingsData = await this.mlService.generateEmbeddings(
      transformedData
    );
    console.log("Embeddings response:", embeddingsData);

    // 4. Combine data with embeddings
    const finalData = this.dataTransformService.combineDataWithEmbeddings(
      transformedData,
      embeddingsData
    );

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
      for (let i = 0; i < finalData.length; i++) {
        const tender = finalData[i];
        console.log(
          `Generating summary for tender ${i + 1}/${finalData.length}: ${
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
      .map((tender) => tender.reference_number)
      .filter((ref) => ref !== null) as string[];

    if (currentReferenceNumbers.length > 0) {
      console.log("Removing stale tenders...");
      await this.dbService.removeStaleTemders(currentReferenceNumbers);
    }

    return { message: "Data imported successfully!", count: finalData.length };
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
