import { DatabaseService } from "./databaseService";
import { CsvService } from "./csvService";
import { MlService } from "./mlService";
import { DataTransformationService } from "./dataTransformationService";
import { AiService } from "./aiService";
import * as puppeteer from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

// Configure puppeteer-extra with stealth plugin
puppeteerExtra.use(StealthPlugin());

/**
 * Parse Mississauga date format "/Date(1749216600000)/" to ISO string
 */
function parseMississaugaDate(dateStr: string): string | null {
  if (!dateStr || !dateStr.includes("/Date(")) return null;
  
  const match = dateStr.match(/\/Date\((\d+)\)\//);
  if (!match) return null;
  
  const timestamp = parseInt(match[1]);
  return new Date(timestamp).toISOString();
}

/**
 * Clean HTML tags from description
 */
function cleanHtmlDescription(html: string): string | null {
  if (!html) return null;
  
  // Remove HTML tags and decode entities
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim() || null;
}

/**
 * Convert a raw Mississauga tender row to the canonical Mapletenders schema.
 */
function mapMississaugaTender(row: any) {
  return {
    id: row.Id ?? null,
    title: row.Title ?? null,
    reference_number: row.Title?.match(/^([A-Z]+\d+)/)?.[1] ?? row.Id ?? null,
    amendment_number: null,
    solicitation_number: row.Title?.match(/^([A-Z]+\d+)/)?.[1] ?? null,
    publication_date: parseMississaugaDate(row.DateAvailable),
    tender_closing_date: parseMississaugaDate(row.DateClosing),
    amendment_date: null,
    expected_contract_start_date: null,
    expected_contract_end_date: null,
    tender_status: row.Status ?? null,
    gsin: null,
    gsin_description: null,
    unspsc: null,
    unspsc_description: null,
    procurement_category: row.Scope ?? null,
    notice_type: "RFP", // Mississauga appears to be primarily RFPs
    procurement_method: "Open", // Based on status being "Open"
    selection_criteria: null,
    limited_tendering_reason: null,
    trade_agreements: null,
    regions_of_opportunity: "City of Mississauga",
    regions_of_delivery: "Mississauga, ON",
    contracting_entity_name: "City of Mississauga",
    contracting_entity_address_line: null,
    contracting_entity_city: "Mississauga",
    contracting_entity_province: "ON",
    contracting_entity_postal_code: null,
    contracting_entity_country: "CA",
    end_user_entities_name: "City of Mississauga",
    end_user_entities_address: null,
    contact_name: null,
    contact_email: null,
    contact_phone: null,
    contact_fax: null,
    contact_address_line: null,
    contact_city: null,
    contact_province: null,
    contact_postal_code: null,
    contact_country: null,
    notice_url: `https://mississauga.bidsandtenders.ca/Module/Tenders/en/Tender/Detail/${row.Id}`,
    attachments: row.Documents ? `${row.Documents} documents, ${row.Addendums} addendums` : null,
    tender_description: cleanHtmlDescription(row.Description),
    source: "mississauga",
  };
}

/**
 * Convert a raw Ontario Excel row to the canonical Mapletenders schema.
 */
function mapOntarioTender(row: any) {
  return {
    id: row["Project Code"] ?? null,
    title: row["Project Title"] ?? null,
    reference_number: row["Project Reference"] ?? row["Project Code"] ?? null,
    amendment_number: null,
    solicitation_number:
      row["Project Reference"] ?? row["Project Code"] ?? null,
    publication_date: row["Publication Date"] ?? null,
    tender_closing_date: row["Listing Expiry Date (dd/mm/yyyy hh:mm)"] ?? null,
    amendment_date: null,
    expected_contract_start_date:
      row["Estimated Contract Start Date (dd/mm/yyyy)"] ?? null,
    expected_contract_end_date: null,
    tender_status: "Open", // Ontario data doesn't specify status, assume open
    gsin: null,
    gsin_description: null,
    unspsc: row["Project Categories"] ?? null,
    unspsc_description: null,
    procurement_category: row["Work Category"] ?? null,
    notice_type: row["Project Type"] ?? null,
    procurement_method: row["Procurement Route"] ?? null,
    selection_criteria: null,
    limited_tendering_reason: null,
    trade_agreements: null,
    regions_of_opportunity: "Province of Ontario",
    regions_of_delivery: "Ontario, CA",
    contracting_entity_name: row["Buyer Organization"] ?? null,
    contracting_entity_address_line: null,
    contracting_entity_city: null,
    contracting_entity_province: "ON",
    contracting_entity_postal_code: null,
    contracting_entity_country: "CA",
    end_user_entities_name: row["Buyer Organization"] ?? null,
    end_user_entities_address: null,
    contact_name: row["Contact"] ?? null,
    contact_email: row["Email"] ?? null,
    contact_phone: null,
    contact_fax: null,
    contact_address_line: null,
    contact_city: null,
    contact_province: null,
    contact_postal_code: null,
    contact_country: null,
    notice_url: row["Web Link"] ?? null,
    attachments: row["Number of Attachments"]
      ? `${row["Number of Attachments"]} attachments`
      : null,
    tender_description:
      [row["Detailed Description"], row["Scope of Work"]]
        .filter(Boolean)
        .join("\n\n") || null,
    source: "ontario",
  };
}

/**
 * Convert a raw Toronto OData tender row to the canonical Mapletenders schema.
 */
function mapTorontoTender(row: any) {
  return {
    id: row.id,
    title: row.Posting_Title ?? null,
    reference_number: row.Solicitation_Document_Number ?? null,
    amendment_number: null,
    solicitation_number: row.Solicitation_Document_Number ?? null,
    publication_date: row.Publish_Date ?? null,
    tender_closing_date: row.Closing_Date_Formatted ?? null,
    amendment_date: row.__ModifiedOn ?? null,
    expected_contract_start_date: null,
    expected_contract_end_date: null,
    tender_status: row.Status ?? null,
    gsin: null,
    gsin_description: null,
    unspsc: null,
    unspsc_description: null,
    procurement_category: row.High_Level_Category ?? null,
    notice_type: row.Solicitation_Form_Type ?? null,
    procurement_method: row.Solicitation_Document_Type ?? null,
    selection_criteria: row.Specific_Conditions ?? null,
    limited_tendering_reason:
      row.Limited_Suppliers_Info ??
      (row.Limited_Suppliers === "Yes" ? "Limited Suppliers" : null),
    trade_agreements: Array.isArray(row.Applicable_Trade_Agreement)
      ? row.Applicable_Trade_Agreement.join(",")
      : null,
    regions_of_opportunity: "City of Toronto",
    regions_of_delivery: Array.isArray(row.Client_Division)
      ? row.Client_Division.join(",")
      : "Toronto, ON",
    contracting_entity_name: Array.isArray(row.Client_Division)
      ? row.Client_Division[0]
      : null,
    contracting_entity_address_line: null,
    contracting_entity_city: "Toronto",
    contracting_entity_province: "ON",
    contracting_entity_postal_code: null,
    contracting_entity_country: "CA",
    end_user_entities_name: Array.isArray(row.Client_Division)
      ? row.Client_Division.join(",")
      : null,
    end_user_entities_address: null,
    contact_name: row.Buyer_Name ?? null,
    contact_email: row.Buyer_Email ?? null,
    contact_phone: row.Buyer_Phone_Number ?? null,
    contact_fax: null,
    contact_address_line: null,
    contact_city: null,
    contact_province: null,
    contact_postal_code: null,
    contact_country: null,
    notice_url: (row.Ariba_Discovery_Posting_Link ?? "").trim(),
    attachments:
      row.uploadedFilesStaff && row.uploadedFilesStaff.length
        ? JSON.stringify(row.uploadedFilesStaff)
        : null,
    tender_description: row.Solicitation_Document_Description ?? null,
    source: "toronto",
  };
}

export class ScrapingService {
  constructor(
    private dbService: DatabaseService,
    private csvService: CsvService,
    private mlService: MlService,
    private dataTransformService: DataTransformationService,
    private aiService: AiService
  ) {}

  /**
   * Import Canadian government tenders from CSV (existing logic from TenderService)
   */
  async importCanadianTenders() {
    console.log("Importing Canadian tenders from CSV...");

    // 1. Download CSV data
    const csvResponse = await this.csvService.downloadTendersCsvData();

    // 2. Parse and transform data
    const parsedData = await this.csvService.parseCsvData(csvResponse.data);
    const transformedData = this.dataTransformService.transformTenderData(
      parsedData.data
    );

    // 3. Generate embeddings
    console.log("Generating embeddings for Canadian tenders...");
    const embeddingsData = await this.mlService.generateEmbeddings(
      transformedData
    );

    // 4. Add source field to Canadian tenders
    const canadianTendersWithSource = transformedData.map(tender => ({
      ...tender,
      source: "canadian"
    }));

    // 5. Combine data with embeddings
    const finalData = this.dataTransformService.combineDataWithEmbeddings(
      canadianTendersWithSource,
      embeddingsData
    );

    // 6. Upsert to database
    console.log("Upserting Canadian tenders to preserve bookmarks...");
    await this.dbService.upsertTenders(finalData);

    // 7. Generate precomputed summaries for first 10 tenders
    console.log("Generating precomputed summaries for first 10 tenders...");
    try {
      for (let i = 0; i < Math.min(finalData.length, 10); i++) {
        const tender = finalData[i];
        try {
          const summary = await this.aiService.generatePrecomputedSummary(
            tender
          );
          await this.dbService.updateTenderSummary(tender.id!, summary);
          console.log(`✓ Summary generated for ${tender.id}`);
        } catch (summaryError: any) {
          console.error(
            `Failed to generate summary for ${tender.id}:`,
            summaryError.message
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error: any) {
      console.error("Error during summary generation:", error.message);
    }

    // 8. Remove stale tenders
    const currentReferenceNumbers = finalData
      .map((tender) => tender.reference_number)
      .filter((ref) => ref !== null) as string[];

    if (currentReferenceNumbers.length > 0) {
      console.log("Removing stale tenders...");
      await this.dbService.removeStaleTemders(currentReferenceNumbers);
    }

    // 9. Sync to Elasticsearch
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

  /**
   * Scrape Toronto tender data using Puppeteer
   */
  async scrapeTorontoTenders(): Promise<any[]> {
    console.log("Starting Toronto tender scraping...");

    const tenderUrl =
      "https://secure.toronto.ca/c3api_data/v2/DataAccess.svc/pmmd_solicitations/feis_solicitation?$format=application/json;odata.metadata=none&$count=true&$skip=0&$orderby=Closing_Date%20desc,Issue_Date%20desc";
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
   * Check rate limiting for Canadian tender imports
   */
  async getCanadianImportStatus() {
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

    // 2. Transform to canonical schema
    const mappedTenders = rawTenders.map((tender) => mapOntarioTender(tender));

    // 3. Generate embeddings
    console.log("Generating embeddings for Ontario tenders...");
    try {
      const embeddingsData = await this.mlService.generateEmbeddings(
        mappedTenders
      );

      const tendersWithEmbeddings = mappedTenders.map((tender, index) => ({
        ...tender,
        embedding: embeddingsData.embeddings?.[index] || null,
      }));

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

    const sourceUrl =
      "https://ontariotenders.app.jaggaer.com/esop/guest/go/public/opportunity/current?locale=en_CA&customLoginPage=/esop/nac-host/public/web/login.html&customGuest=";
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

      // Convert to JSON
      const data = XLSX.utils.sheet_to_json(worksheet);

      console.log(`Parsed ${data.length} Ontario tenders from Excel`);

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
    // For now, use the same refresh date as other sources
    // TODO: Add separate rate limiting for different sources
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
   * Check rate limiting for Toronto tender imports
   */
  async getTorontoImportStatus() {
    // For now, use the same refresh date as Canadian tenders
    // TODO: Add separate rate limiting for different sources
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
   * Import Mississauga tenders from bidsandtenders.ca API
   */
  async importMississaugaTenders() {
    console.log("Importing Mississauga tenders...");

    // 1. Scrape tender data
    const rawTenders = await this.scrapeMississaugaTenders();
    
    if (rawTenders.length === 0) {
      return {
        message: "No Mississauga tenders found",
        count: 0,
      };
    }

    // 2. Transform to canonical schema
    const mappedTenders = rawTenders.map(tender => mapMississaugaTender(tender));

    // 3. Generate embeddings
    console.log("Generating embeddings for Mississauga tenders...");
    try {
      const embeddingsData = await this.mlService.generateEmbeddings(mappedTenders);
      
      const tendersWithEmbeddings = mappedTenders.map((tender, index) => ({
        ...tender,
        embedding: embeddingsData.embeddings?.[index] || null,
      }));

      // 4. Upsert to database
      console.log("Upserting Mississauga tenders to database...");
      await this.dbService.upsertTenders(tendersWithEmbeddings);

      return {
        message: "Mississauga tenders imported successfully",
        count: mappedTenders.length,
      };
    } catch (error: any) {
      console.error("Error generating embeddings for Mississauga tenders:", error);
      
      // Fallback: import without embeddings
      console.log("Importing Mississauga tenders without embeddings as fallback...");
      await this.dbService.upsertTenders(mappedTenders);
      
      return {
        message: "Mississauga tenders imported successfully (without embeddings)",
        count: mappedTenders.length,
        warning: "Embeddings generation failed",
      };
    }
  }

  /**
   * Scrape Mississauga tender data using stealth puppeteer
   */
  async scrapeMississaugaTenders(): Promise<any[]> {
    console.log("Starting Mississauga tender scraping...");
    
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

      // Navigate to the tenders page
      await page.goto("https://mississauga.bidsandtenders.ca/Module/Tenders/en", {
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
      console.log(`Scraped ${tenders.length} Mississauga tenders`);
      
      return tenders;
    } finally {
      await browser.close();
    }
  }

  /**
   * Check rate limiting for Mississauga tender imports
   */
  async getMississaugaImportStatus() {
    // For now, use the same refresh date as other sources
    // TODO: Add separate rate limiting for different sources
    const { data: refreshData, error } = await this.dbService.getLastRefreshDate();
    
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
}
