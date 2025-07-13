import { Request, Response } from "express";
import { TenderService, MlService } from "../services";
import { SearchTendersRequest, SearchTendersResponse, TenderSearchResult } from "../types/search";

export class TenderController {
  constructor(
    private tenderService: TenderService,
    private mlService: MlService
  ) {}

  getAllBookmarks = async (req: Request, res: Response) => {
    try {
      const result = await this.tenderService.getAllBookmarks();
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({ error: error.message });
    }
  };

  refreshTenders = async (req: Request, res: Response) => {
    try {
      console.log("Attempting to refresh tenders...");

      // Let the service handle all the business logic including rate limiting
      const result = await this.tenderService.refreshTendersIfNeeded();

      console.log("Tenders refreshed successfully:", result);
      res.json(result);
    } catch (error: any) {
      console.error("Error refreshing tenders:", error);

      // Handle rate limiting error specifically
      if (error.message.includes("24 hours")) {
        res.status(429).json({
          error: error.message,
          code: "RATE_LIMITED",
        });
      } else {
        res.status(500).json({ error: "Failed to refresh tenders" });
      }
    }
  };

  getOpenTenderNotices = async (req: Request, res: Response) => {
    try {
      const response = await this.tenderService.downloadTendersCsv();
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=newTenderNotice.csv"
      );
      response.data.pipe(res);
      console.log("Successfully downloaded newest tender notice!");
    } catch (error: any) {
      console.error("Error downloading tender notices:", error);
      res.status(500).json({ error: "Failed to download tender notices" });
    }
  };

  getOpenTenderNoticesToDB = async (req: Request, res: Response) => {
    try {
      const result = await this.tenderService.importTendersFromCsv();
      res.json(result);
    } catch (error: any) {
      console.error("Error importing tender notices:", error);
      res.status(500).json({ error: error.message });
    }
  };

  getOpenTenderNoticesFromDB = async (req: Request, res: Response) => {
    try {
      const result = await this.tenderService.getAllTenders();
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching tender notices:", error);
      res.status(500).json({ error: error.message });
    }
  };

  searchTenders = async (req: Request, res: Response) => {
    try {
      const searchRequest: SearchTendersRequest = req.body || {};
      const { 
        q, 
        regions, 
        procurement_method, 
        procurement_category,
        notice_type,
        tender_status,
        contracting_entity_name,
        closing_date_after, 
        closing_date_before,
        publication_date_after,
        publication_date_before,
        limit 
      } = searchRequest;

      if (!q) {
        res.status(400).json({ error: "Query is required" });
        return;
      }

      // Prepare search parameters with defaults
      const searchParams = {
        query: q,
        regions: regions || undefined,
        procurement_method: procurement_method || undefined,
        procurement_category: procurement_category || undefined,
        notice_type: notice_type || undefined,
        tender_status: tender_status || undefined,
        contracting_entity_name: contracting_entity_name || undefined,
        closing_date_after: closing_date_after || new Date().toISOString().split("T")[0], // Default to today for active tenders
        closing_date_before: closing_date_before || undefined,
        publication_date_after: publication_date_after || undefined,
        publication_date_before: publication_date_before || undefined,
        limit: limit || 20,
      };

      console.log("Elasticsearch search params:", searchParams);

      // Use ML service layer for Elasticsearch search
      const searchResults: TenderSearchResult[] = await this.mlService.searchTendersWithElasticsearch(
        searchParams
      );

      console.log(
        `Found ${searchResults.length} tenders matching query: "${q}"`
      );

      // Log search score and match explanation details
      if (searchResults.length > 0) {
        console.log("Top result details:");
        console.log(`- Search Score: ${searchResults[0].search_score}`);
        console.log(`- Match Explanation: ${searchResults[0].match_explanation}`);
      }

      const response: SearchTendersResponse = {
        results: searchResults,
        total_results: searchResults.length,
        query: q,
        search_metadata: {
          max_score: searchResults.length > 0 ? searchResults[0].search_score : 0
        }
      };

      res.json(response);
    } catch (error: any) {
      console.error("Error in /searchTenders:", error);

      if (error.message.includes("ML service unavailable")) {
        res.status(503).json({
          error: "Elasticsearch service unavailable",
          details: error.message,
          suggestion: "Ensure ML backend is running on port 8000",
        });
      } else {
        res.status(500).json({
          error: "Failed to search tenders",
          details: error.message,
        });
      }
    }
  };

  syncToElasticsearch = async (req: Request, res: Response) => {
    try {
      console.log("Manual Elasticsearch sync triggered");
      const syncResult = await this.mlService.syncTendersToElasticsearch();
      
      res.json({
        message: "Elasticsearch sync completed successfully",
        result: syncResult
      });
    } catch (error: any) {
      console.error("Error in Elasticsearch sync:", error);
      
      if (error.message.includes("ML service unavailable")) {
        res.status(503).json({
          error: "Elasticsearch service unavailable",
          details: error.message,
          suggestion: "Ensure ML backend is running on port 8000"
        });
      } else {
        res.status(500).json({
          error: "Failed to sync to Elasticsearch",
          details: error.message
        });
      }
    }
  };

  syncSingleTenderToElasticsearch = async (req: Request, res: Response) => {
    try {
      const { tenderId } = req.params;
      
      if (!tenderId) {
        res.status(400).json({ error: "Tender ID is required" });
        return;
      }

      console.log(`Manual sync of tender ${tenderId} to Elasticsearch`);
      const syncResult = await this.mlService.syncSingleTenderToElasticsearch(tenderId);
      
      res.json({
        message: `Tender ${tenderId} synced to Elasticsearch successfully`,
        result: syncResult
      });
    } catch (error: any) {
      console.error(`Error syncing tender ${req.params.tenderId}:`, error);
      
      if (error.message.includes("ML service unavailable")) {
        res.status(503).json({
          error: "Elasticsearch service unavailable",
          details: error.message,
          suggestion: "Ensure ML backend is running on port 8000"
        });
      } else {
        res.status(500).json({
          error: "Failed to sync tender to Elasticsearch",
          details: error.message
        });
      }
    }
  };
}
