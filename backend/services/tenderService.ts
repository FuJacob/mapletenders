import { DatabaseService } from "./databaseService";
import { CsvService } from "./csvService";
import { MlService } from "./mlService";
import { DataTransformationService } from "./dataTransformationService";
import { AiService } from "./aiService";

export class TenderService {
  constructor(
    private dbService: DatabaseService,
    private csvService: CsvService,
    private mlService: MlService,
    private dataTransformService: DataTransformationService,
    private aiService: AiService
  ) {}

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
    // 1. Clear existing data
    const { error: deleteError } = await this.dbService.clearTenders();
    if (deleteError) {
      throw new Error(
        `Failed to clear existing notices: ${deleteError.message}`
      );
    }

    // 2. Download CSV data
    const csvResponse = await this.csvService.downloadTendersCsvData();

    // 3. Parse and transform data
    const parsedData = await this.csvService.parseCsvData(csvResponse.data);
    const transformedData = this.dataTransformService.transformTenderData(
      parsedData.data
    );

    // 4. Generate embeddings
    console.log("Generating embeddings for filtered data...");
    const embeddingsData = await this.mlService.generateEmbeddings(
      transformedData
    );
    console.log("Embeddings response:", embeddingsData);

    // 5. Combine data with embeddings
    const finalData = this.dataTransformService.combineDataWithEmbeddings(
      transformedData,
      embeddingsData
    );

    // 6. Save to database
    const { error: insertError } = await this.dbService.insertTenders(
      finalData
    );
    if (insertError) {
      throw new Error(`Failed to insert notices: ${insertError.message}`);
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

  async filterOpenTenderNotices(search: string) {
    // Clear existing filtered notices
    const { error: deleteError } =
      await this.dbService.clearFilteredTenderNotices();
    if (!search) {
      return [];
    }

    if (deleteError) {
      console.error("Failed to delete existing filtered notices:", deleteError);
    }

    // Fetch tender notices for AI filtering
    const { data, error } = await this.dbService.getTendersForAiFiltering();
    if (error) {
      throw new Error(`Failed to fetch tender notices: ${error.message}`);
    }

    // Filter tenders using AI
    const aiFilterResult = await this.filterTendersWithAi(search, data);
    const filteredIDs = JSON.parse(aiFilterResult).matches;

    // Get full data for matched tenders
    const { data: matchedData, error: matchError } =
      await this.dbService.getTendersByReferenceNumbers(filteredIDs);
    if (matchError) {
      throw new Error(`Failed to fetch matched data: ${matchError.message}`);
    }

    // Insert filtered results
    const { error: insertError } =
      await this.dbService.insertFilteredTenderNotices(matchedData);
    if (insertError) {
      throw new Error(`Failed to insert filtered data: ${insertError.message}`);
    }

    // Return filtered results
    const { data: fetchFilteredData, error: fetchFilteredDataError } =
      await this.dbService.getFilteredTenderNotices();
    if (fetchFilteredDataError) {
      throw new Error(
        `Failed to fetch filtered data: ${fetchFilteredDataError.message}`
      );
    }

    return fetchFilteredData;
  }

  async getFilteredTenderNotices() {
    const { data, error } = await this.dbService.getFilteredTenderNotices();
    if (error) {
      throw new Error(`Failed to fetch filtered notices: ${error.message}`);
    }
    return data;
  }

  /**
   * Refresh tenders by clearing existing data and importing fresh data
   * Silently skips if refreshed within last 24 hours
   * @returns {Promise<any>} Operation result
   */
  async refreshTendersIfNeeded() {
    console.log("Checking if tender refresh is needed...");

    // 1. Check rate limiting
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

    // 2. Clear existing tenders
    await this.dbService.clearTenders();

    // 3. Import fresh tender data
    const importResult = await this.importTendersFromCsv();

    // 4. Update last refresh timestamp
    await this.dbService.resetTenderLastRefreshDate();

    return {
      message: "Tenders refreshed successfully",
      importedCount: importResult?.count || 0,
      refreshedAt: new Date().toISOString(),
    };
  }
}
