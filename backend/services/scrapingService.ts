import { DatabaseService } from "./databaseService";
import { MlService } from "./mlService";
import { AiService } from "./aiService";
import * as puppeteer from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import {
  mapBidsAndTendersTender,
  mapOntarioTender,
  mapTorontoTender,
  mapCanadianTender,
  mapQuebecTender,
} from "./utils/scrapingColumnsMapper";
import { URLS } from "./utils/scrapingUrls";
// Configure puppeteer-extra with stealth plugin
puppeteerExtra.use(StealthPlugin());

export class ScrapingService {
  constructor(
    private dbService: DatabaseService,
    private mlService: MlService,
    private aiService: AiService
  ) {}
  /**
   * Import Canadian government tenders from CSV (existing logic from TenderService)
   */
  async importCanadianTenders() {
    console.log("Importing Canadian tenders from CSV...");

    const tenders = await this.scrapeCanadianTenders();
    // 3. Generate embeddings
    const mappedTenders = tenders.map((tender) => mapCanadianTender(tender));

    console.log("Generating embeddings for Canadian tenders...");
    const embeddingsData = await this.mlService.generateEmbeddings(
      mappedTenders
    );

    // 4. Combine data with embeddings
    const finalData = mappedTenders.map((tender, index) => ({
      ...tender,
      embedding: embeddingsData.embeddings?.[index] || null,
      embedding_input: embeddingsData.embedding_inputs?.[index] || null,
    }));

    // 5. Upsert to database
    console.log("Upserting Canadian tenders to preserve bookmarks...");
    await this.dbService.upsertTenders(finalData);

    // // 6. Generate precomputed summaries for first 10 tenders
    // console.log("Generating precomputed summaries for first 10 tenders...");
    // try {
    //   for (let i = 0; i < Math.min(finalData.length, 10); i++) {
    //     const tender = finalData[i];
    //     try {
    //       const summary = await this.aiService.generatePrecomputedSummary(
    //         tender
    //       );
    //       await this.dbService.updateTenderSummary(tender.id!, summary);
    //       console.log(`✓ Summary generated for ${tender.id}`);
    //     } catch (summaryError: any) {
    //       console.error(
    //         `Failed to generate summary for ${tender.id}:`,
    //         summaryError.message
    //       );
    //     }
    //     await new Promise((resolve) => setTimeout(resolve, 100));
    //   }
    // } catch (error: any) {
    //   console.error("Error during summary generation:", error.message);
    // }

    // 7. Remove stale tenders
    const currentReferenceNumbers = finalData
      .map((tender) => tender.source_reference)
      .filter((ref) => ref !== null) as string[];

    if (currentReferenceNumbers.length > 0) {
      console.log("Removing stale tenders...");
      await this.dbService.removeStaleTemders(currentReferenceNumbers);
    }

    // 8. Sync to Elasticsearch
    console.log("🔄 Syncing tenders to Elasticsearch...");
    try {
      const syncResult = await this.mlService.syncTendersToElasticsearch();
      console.log("✅ Elasticsearch sync completed:", syncResult);
    } catch (error: any) {
      console.error(
        "⚠️ Elasticsearch sync failed (non-blocking):",
        error.message
      );
    }

    return {
      message: "Canadian tenders imported successfully!",
      count: finalData.length,
      elasticsearch_synced: true,
    };
  }

  /**
   * Import Toronto tenders from City API (existing logic from TorontoTenderService)
   */
  async importTorontoTenders() {
    console.log("Importing Toronto tenders...");

    // 1. Scrape tender data
    const rawTenders = await this.scrapeTorontoTenders();

    if (rawTenders.length === 0) {
      return {
        message: "No Toronto tenders found",
        count: 0,
      };
    }

    // 2. Transform to canonical schema
    const mappedTenders = rawTenders.map((tender) => mapTorontoTender(tender));

    // 3. Generate embeddings
    console.log("Generating embeddings for Toronto tenders...");
    try {
      const embeddingsData = await this.mlService.generateEmbeddings(
        mappedTenders
      );

      const tendersWithEmbeddings = mappedTenders.map((tender, index) => ({
        ...tender,
        embedding: embeddingsData.embeddings?.[index] || null,
      }));

      // 4. Upsert to database
      console.log("Upserting Toronto tenders to database...");
      await this.dbService.upsertTenders(tendersWithEmbeddings);

      return {
        message: "Toronto tenders imported successfully",
        count: mappedTenders.length,
      };
    } catch (error: any) {
      console.error("Error generating embeddings for Toronto tenders:", error);

      // Fallback: import without embeddings
      console.log(
        "Importing Toronto tenders without embeddings as fallback..."
      );
      await this.dbService.upsertTenders(mappedTenders);

      return {
        message: "Toronto tenders imported successfully (without embeddings)",
        count: mappedTenders.length,
        warning: "Embeddings generation failed",
      };
    }
  }

  async scrapeCanadianTenders() {
    // 1. Download CSV data
    const csvResponse = await fetch(URLS.CANADA.BASE, {
      headers: {
        "User-Agent": URLS.CANADA.USER_AGENT,
      },
    });
    const csvData = await csvResponse.text();

    // 2. Parse and transform data using new mapping
    const parsedData = await Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });
    console.log(`Scraped ${parsedData.data.length} Canadian tenders`);
    return parsedData.data;
  }

  /**
   * Scrape Toronto tender data using Puppeteer
   */
  async scrapeTorontoTenders(): Promise<any[]> {
    console.log("Starting Toronto tender scraping...");

    const tenderUrl = URLS.TORONTO.API;
    const browser = await puppeteer.launch({ headless: true });

    try {
      const page = await browser.newPage();
      await page.goto(tenderUrl, { waitUntil: "networkidle0" });

      const content = await page.evaluate(() => {
        return document.body.innerText;
      });

      const json = JSON.parse(content);
      const tenders = Array.isArray(json.value) ? json.value : [];

      console.log(`Scraped ${tenders.length} Toronto tenders`);
      return tenders;
    } finally {
      await browser.close();
    }
  }

  /**
   * Generic rate limiting check for tender imports
   * TODO: Add separate rate limiting for different sources
   */
  private async getGenericImportStatus() {
    const { data: refreshData, error } =
      await this.dbService.getLastRefreshDate();

    if (error || !refreshData?.value) {
      return {
        canImport: true,
        message: "No previous import found",
      };
    }

    const lastRefresh = Number(refreshData.value);
    const currentTime = new Date().getTime();
    const timeSinceLastRefresh = currentTime - lastRefresh;
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (timeSinceLastRefresh < twentyFourHours) {
      const hoursRemaining = Math.ceil(
        (twentyFourHours - timeSinceLastRefresh) / (60 * 60 * 1000)
      );

      return {
        canImport: false,
        message: `Rate limited - wait ${hoursRemaining} hours`,
        hoursRemaining,
        lastImportAt: new Date(lastRefresh).toISOString(),
      };
    }

    return {
      canImport: true,
      message: "Ready to import",
    };
  }

  /**
   * Check rate limiting for Canadian tender imports
   */
  async getCanadianImportStatus() {
    return this.getGenericImportStatus();
  }

  /**
   * Import Quebec tenders from SEAO API
   */
  async importQuebecTenders() {
    console.log("Importing Quebec tenders...");

    // 1. Scrape tender data
    const rawTenders = await this.scrapeQuebecTenders();

    if (rawTenders.length === 0) {
      return {
        message: "No Quebec tenders found",
        count: 0,
      };
    }

    // 2. Transform to canonical schema
    const mappedTenders = rawTenders.map((tender) => mapQuebecTender(tender));

    // 3. Generate embeddings
    console.log("Generating embeddings for Quebec tenders...");
    try {
      const embeddingsData = await this.mlService.generateEmbeddings(
        mappedTenders
      );

      const tendersWithEmbeddings = mappedTenders.map((tender, index) => ({
        ...tender,
        embedding: embeddingsData.embeddings?.[index] || null,
      }));

      // 4. Upsert to database
      console.log("Upserting Quebec tenders to database...");
      await this.dbService.upsertTenders(tendersWithEmbeddings);

      return {
        message: "Quebec tenders imported successfully",
        count: mappedTenders.length,
      };
    } catch (error: any) {
      console.error("Error generating embeddings for Quebec tenders:", error);

      // Fallback: import without embeddings
      console.log("Importing Quebec tenders without embeddings as fallback...");
      await this.dbService.upsertTenders(mappedTenders);

      return {
        message: "Quebec tenders imported successfully (without embeddings)",
        count: mappedTenders.length,
        warning: "Embeddings generation failed",
      };
    }
  }

  /**
   * Import Ontario tenders from Jaggaer Excel export
   */
  async importOntarioTenders() {
    console.log("Importing Ontario tenders...");

    // 1. Download and parse Excel data
    const rawTenders = await this.scrapeOntarioTenders();

    if (rawTenders.length === 0) {
      return {
        message: "No Ontario tenders found",
        count: 0,
      };
    }

    // Step 1: Deduplicate and concatenate Project Category for each Project Code
    const tenderMap: Record<string, any> = {};

    for (const tender of rawTenders) {
      const code = tender["Project Code"];
      const category = tender["Project Category"];
      if (!code) continue;

      if (!tenderMap[code]) {
        // First occurrence: copy tender and set Project Category as initial string
        tenderMap[code] = { ...tender };
      } else {
        // Append new category if not already present (comma-separated, no duplicates)
        const categories = tenderMap[code]["Project Category"]
          ? tenderMap[code]["Project Category"]
              .split(",")
              .map((c: string) => c.trim())
          : [];
        if (category && !categories.includes(category)) {
          tenderMap[code]["Project Category"] = categories.join(", ");
          categories.push(category);
        }
      }
    }

    const uniqueTenders = Object.values(tenderMap);

    // 2. Transform to canonical schema
    const mappedTenders = uniqueTenders.map((tender: any) =>
      mapOntarioTender(tender)
    );

    console.log("Generating embeddings for Ontario tenders...");
    try {
      const embeddingsData = await this.mlService.generateEmbeddings(
        mappedTenders
      );
      const tendersWithEmbeddings = mappedTenders.map(
        (tender: any, index: number) => ({
          ...tender,
          embedding: embeddingsData.embeddings?.[index] || null,
        })
      );

      // 4. Upsert to database
      console.log("Upserting Ontario tenders to database...");
      await this.dbService.upsertTenders(tendersWithEmbeddings);
      return {
        message: "Ontario tenders imported successfully",
        count: mappedTenders.length,
      };
    } catch (error: any) {
      console.error("Error generating embeddings for Ontario tenders:", error);

      // Fallback: import without embeddings
      console.log(
        "Importing Ontario tenders without embeddings as fallback..."
      );
      await this.dbService.upsertTenders(mappedTenders);

      return {
        message: "Ontario tenders imported successfully (without embeddings)",
        count: mappedTenders.length,
        warning: "Embeddings generation failed",
      };
    }
  }
  /**
   * Scrape Quebec tender data from SEAO API
   */
  async scrapeQuebecTenders(): Promise<any[]> {
    console.log("Starting Quebec tender scraping...");

    const tenderUrl = URLS.QUEBEC.BASE;
    try {
      const response = await fetch(tenderUrl);
      const data = await response.json();
      const tenders = data.apiData.results;
      console.log(`Scraped ${tenders.length} Quebec tenders`);
      return tenders;
    } catch (error: any) {
      console.error("Error scraping Quebec tenders:", error);
      return [];
    }
  }

  /**
   * Scrape Ontario tender data by downloading Excel file
   */
  async scrapeOntarioTenders(): Promise<any[]> {
    console.log("Starting Ontario tender scraping...");

    const downloadDir =
      process.env.DOWNLOAD_DIR || path.resolve(__dirname, "../downloads");

    // Ensure download directory exists
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    const sourceUrl = URLS.ONTARIO.JAGGAER;
    const browser = await puppeteer.launch({ headless: true });

    try {
      const page = await browser.newPage();

      await page.goto(sourceUrl, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      const client = await page.target().createCDPSession();
      await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadDir,
      });

      // Click the 3-dot menu
      await page.waitForSelector("button[aria-label='Other Action Menu']", {
        visible: true,
      });
      await page.click("button[aria-label='Other Action Menu']");

      // Click the export option in the dropdown
      await page.waitForSelector(
        "a[aria-label='Export the contents of the list in MS Excel format.']",
        { visible: true }
      );
      await page.click(
        "a[aria-label='Export the contents of the list in MS Excel format.']"
      );

      // Wait for the Excel file to download
      await new Promise((resolve) => setTimeout(resolve, 10000));

      // Find the downloaded Excel file
      const downloadedFile = fs
        .readdirSync(downloadDir)
        .find((f) => f.endsWith(".xlsx"));

      if (!downloadedFile) {
        throw new Error("Excel download failed - no .xlsx file found");
      }

      const filePath = path.join(downloadDir, downloadedFile);
      console.log("Downloaded Excel file:", filePath);

      // Parse the Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Use first sheet
      const worksheet = workbook.Sheets[sheetName];

      // Find the row where actual table data starts by looking for "Project Code" column
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:Z1000");
      let headerRowIndex = -1;

      for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex++) {
        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 0 }); // Check column A
        const cell = worksheet[cellAddress];

        if (cell && cell.v && typeof cell.v === "string") {
          // Look for the first column header "Project Code"
          if (
            cell.v.trim().toLowerCase().includes("project code") ||
            cell.v.trim().toLowerCase().includes("tender_")
          ) {
            headerRowIndex = rowIndex;
            break;
          }
        }
      }

      let data: any[] = [];

      if (headerRowIndex >= 0) {
        // Parse starting from the header row
        const tableRange = {
          s: { r: headerRowIndex, c: range.s.c },
          e: { r: range.e.r, c: range.e.c },
        };

        // Update worksheet range to only include table data
        worksheet["!ref"] = XLSX.utils.encode_range(tableRange);

        // Convert to JSON with headers
        data = XLSX.utils.sheet_to_json(worksheet);

        console.log(
          `Found table headers at row ${headerRowIndex + 1}, parsed ${
            data.length
          } Ontario tenders`
        );
      } else {
        // Fallback: try to extract data starting from row 7 (0-indexed = 6)
        console.log("Could not find header row, trying fallback at row 7");
        const tableRange = {
          s: { r: 6, c: range.s.c },
          e: { r: range.e.r, c: range.e.c },
        };

        worksheet["!ref"] = XLSX.utils.encode_range(tableRange);
        data = XLSX.utils.sheet_to_json(worksheet);

        console.log(
          `Fallback: parsed ${data.length} Ontario tenders from row 7`
        );
      }

      // Clean up downloaded file
      fs.unlinkSync(filePath);

      return data;
    } finally {
      await browser.close();
    }
  }

  /**
   * Check rate limiting for Ontario tender imports
   */
  async getOntarioImportStatus() {
    return this.getGenericImportStatus();
  }

  /**
   * Check rate limiting for Quebec tender imports
   */
  async getQuebecImportStatus() {
    return this.getGenericImportStatus();
  }

  /**
   * Check rate limiting for Toronto tender imports
   */
  async getTorontoImportStatus() {
    return this.getGenericImportStatus();
  }

  /**
   * Import BidsAndTenders tenders (Mississauga, Brampton, Hamilton, London)
   */
  async importBidsAndTendersTenders(
    city: "mississauga" | "brampton" | "hamilton" | "london"
  ) {
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    console.log(`Importing ${cityName} tenders...`);

    // 1. Scrape tender data
    const rawTenders = await this.scrapeBidsAndTendersTenders(city);

    if (rawTenders.length === 0) {
      return {
        message: `No ${cityName} tenders found`,
        count: 0,
      };
    }

    // 2. Transform to canonical schema
    const mappedTenders = rawTenders.map((tender) =>
      mapBidsAndTendersTender(tender, city)
    );

    // 3. Generate embeddings
    console.log(`Generating embeddings for ${cityName} tenders...`);
    try {
      const embeddingsData = await this.mlService.generateEmbeddings(
        mappedTenders
      );

      const tendersWithEmbeddings = mappedTenders.map((tender, index) => ({
        ...tender,
        embedding: embeddingsData.embeddings?.[index] || null,
      }));

      // 4. Upsert to database
      console.log(`Upserting ${cityName} tenders to database...`);
      await this.dbService.upsertTenders(tendersWithEmbeddings);

      return {
        message: `${cityName} tenders imported successfully`,
        count: mappedTenders.length,
      };
    } catch (error: any) {
      console.error(
        `Error generating embeddings for ${cityName} tenders:`,
        error
      );

      // Fallback: import without embeddings
      console.log(
        `Importing ${cityName} tenders without embeddings as fallback...`
      );
      await this.dbService.upsertTenders(mappedTenders);

      return {
        message: `${cityName} tenders imported successfully (without embeddings)`,
        count: mappedTenders.length,
        warning: "Embeddings generation failed",
      };
    }
  }

  // Legacy methods for backward compatibility
  async importMississaugaTenders() {
    return this.importBidsAndTendersTenders("mississauga");
  }

  async importBramptonTenders() {
    return this.importBidsAndTendersTenders("brampton");
  }

  async importHamiltonTenders() {
    return this.importBidsAndTendersTenders("hamilton");
  }

  async importLondonTenders() {
    return this.importBidsAndTendersTenders("london");
  }

  /**
   * Scrape BidsAndTenders tender data using stealth puppeteer
   * Works for Mississauga, Brampton, Hamilton, and London
   */
  async scrapeBidsAndTendersTenders(
    city: "mississauga" | "brampton" | "hamilton" | "london"
  ): Promise<any[]> {
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    console.log(`Starting ${cityName} tender scraping...`);

    const browser = await puppeteerExtra.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--window-size=1920,1080",
      ],
    });

    try {
      const page = await browser.newPage();

      // Spoof browser fingerprint
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setExtraHTTPHeaders({
        "Accept-Language": "en-US,en;q=0.9",
      });

      let tenderData: any = null;

      // Helper function to check if URL is a search request
      const isSearchRequest = (url: string) => {
        return url.includes("/Module/Tenders/en/Tender/Search/");
      };

      // Listen for API responses
      page.on("response", async (response) => {
        try {
          const req = response.request();
          if (
            req.method() === "POST" &&
            isSearchRequest(response.url()) &&
            response.headers()["content-type"]?.includes("application/json")
          ) {
            tenderData = await response.json();
          }
        } catch (err) {
          // Ignore errors in response parsing
        }
      });

      // Navigate to the appropriate city's tenders page
      const baseUrl =
        URLS.BIDSANDTENDERS[
          city.toUpperCase() as keyof typeof URLS.BIDSANDTENDERS
        ].BASE;
      await page.goto(baseUrl, {
        waitUntil: "networkidle2",
        timeout: 45000,
      });

      // Wait for tender data to be captured
      let maxTries = 25;
      let interval = 500;
      let tries = 0;

      while (!tenderData && tries < maxTries) {
        await new Promise((resolve) => setTimeout(resolve, interval));
        tries++;
      }

      if (!tenderData || !tenderData.data) {
        throw new Error("No tender data found in API responses");
      }

      const tenders = Array.isArray(tenderData.data) ? tenderData.data : [];
      console.log(`Scraped ${tenders.length} ${cityName} tenders`);

      return tenders;
    } finally {
      await browser.close();
    }
  }

  // Legacy methods for backward compatibility
  async scrapeMississaugaTenders(): Promise<any[]> {
    return this.scrapeBidsAndTendersTenders("mississauga");
  }

  async scrapeBramptonTenders(): Promise<any[]> {
    return this.scrapeBidsAndTendersTenders("brampton");
  }

  async scrapeHamiltonTenders(): Promise<any[]> {
    return this.scrapeBidsAndTendersTenders("hamilton");
  }

  async scrapeLondonTenders(): Promise<any[]> {
    return this.scrapeBidsAndTendersTenders("london");
  }

  /**
   * Check rate limiting for Mississauga tender imports
   */
  async getMississaugaImportStatus() {
    return this.getGenericImportStatus();
  }

  /**
   * Check rate limiting for Brampton tender imports
   */
  async getBramptonImportStatus() {
    return this.getGenericImportStatus();
  }

  async getHamiltonImportStatus() {
    return this.getGenericImportStatus();
  }

  async getLondonImportStatus() {
    return this.getGenericImportStatus();
  }
  /**
   * Test scraping methods that return limited data without importing
   */

  async testScrapeBidsAndTenders(
    city: "mississauga" | "brampton" | "hamilton" | "london",
    limit: number = 5
  ): Promise<any[]> {
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    console.log(`Test scraping ${cityName} tenders (limit: ${limit})...`);

    // Scrape all tenders and limit the results
    const tenders = await this.scrapeBidsAndTendersTenders(city);
    const limitedTenders = tenders.slice(0, limit);

    // Map to our schema
    const mappedTenders = limitedTenders.map((tender) =>
      mapBidsAndTendersTender(tender, city)
    );

    return mappedTenders;
  }

  async testScrapeCanadian(limit: number = 5): Promise<any[]> {
    console.log(`Test scraping Canadian tenders (limit: ${limit})...`);

    // Scrape all Toronto tenders and limit the results
    const tenders = await this.scrapeCanadianTenders();
    const limitedTenders = tenders.slice(0, limit);

    // Map to our schema
    const mappedTenders = limitedTenders.map((tender) =>
      mapTorontoTender(tender)
    );

    return mappedTenders;
  }

  async testScrapeToronto(limit: number = 5): Promise<any[]> {
    console.log(`Test scraping Toronto tenders (limit: ${limit})...`);

    // Scrape all Toronto tenders and limit the results
    const tenders = await this.scrapeTorontoTenders();
    const limitedTenders = tenders.slice(0, limit);

    // Map to our schema
    const mappedTenders = limitedTenders.map((tender) =>
      mapTorontoTender(tender)
    );

    return mappedTenders;
  }

  async testScrapeQuebec(limit: number = 5): Promise<any[]> {
    console.log(`Test scraping Quebec tenders (limit: ${limit})...`);

    // Scrape all Toronto tenders and limit the results
    const tenders = await this.scrapeQuebecTenders();
    const limitedTenders = tenders.slice(0, limit);

    // Map to our schema
    const mappedTenders = limitedTenders.map((tender) =>
      mapQuebecTender(tender)
    );

    return mappedTenders;
  }

  async testScrapeOntario(limit: number = 5): Promise<any[]> {
    console.log(`Test scraping Ontario tenders (limit: ${limit})...`);

    // Scrape all Ontario tenders and limit the results
    const tenders = await this.scrapeOntarioTenders();
    const limitedTenders = tenders.slice(0, limit);

    // Map to our schema
    const mappedTenders = limitedTenders.map((tender: any) =>
      mapOntarioTender(tender)
    );

    return mappedTenders;
  }

  // Legacy test methods for backward compatibility
  async testScrapeMississauga(limit: number = 5): Promise<any[]> {
    return this.testScrapeBidsAndTenders("mississauga", limit);
  }

  async testScrapeBrampton(limit: number = 5): Promise<any[]> {
    return this.testScrapeBidsAndTenders("brampton", limit);
  }

  async testScrapeHamilton(limit: number = 5): Promise<any[]> {
    return this.testScrapeBidsAndTenders("hamilton", limit);
  }

  async testScrapeLondon(limit: number = 5): Promise<any[]> {
    return this.testScrapeBidsAndTenders("london", limit);
  }
}
