import { Request, Response } from "express";
import { TenderService, MlService, DatabaseService } from "../services";
import {
  SearchTendersRequest,
  SearchTendersResponse,
  TenderSearchResult,
} from "../types/search";

export class TenderController {
  constructor(
    private tenderService: TenderService,
    private mlService: MlService,
    private databaseService: DatabaseService
  ) {}

  getRecommendedTenders = async (req: Request, res: Response) => {
    try {
      const userId = req.headers.userId as string;
      if (!userId) {
        res.status(401).json({ error: "User ID is required" });
      }

      // Get user profile to build query from user info
      const userProfile = await this.databaseService.getProfile(userId);

      if (!userProfile) {
        res.status(404).json({ error: "User profile not found" });
        return;
      }

      // Build query from user profile information (using available fields)
      let query = "";
      if (userProfile.company_name) query += userProfile.company_name + " ";
      if (userProfile.industry) query += userProfile.industry + " ";
      if (
        userProfile.primary_services &&
        Array.isArray(userProfile.primary_services)
      ) {
        query += userProfile.primary_services.join(" ") + " ";
      }
      if (userProfile.government_experience)
        query += userProfile.government_experience + " ";

      // Fallback to basic query if no profile data
      if (!query.trim()) {
        query = "government procurement opportunities";
      }

      const elasticsearchResults =
        await this.mlService.searchTendersWithElasticsearch({
          query: query.trim(),
          limit: 10,
        });

      // Get all bookmarks
      const bookmarks = await this.tenderService.getAllBookmarks();
      const bookmarkIds = bookmarks.map(
        (bookmark) => bookmark.tender_notice_id
      );

      // Extract IDs and search metadata
      const tenderIds = elasticsearchResults.map((result) => result.id);
      console.log("tenderIds", tenderIds);
      // Fetch full tender data from database
      const fullTenderData: TenderSearchResult[] = [];

      if (tenderIds.length > 0) {
        const tenders = await this.tenderService.getTendersByIds(tenderIds);

        // Combine database data with search metadata, preserving search order
        for (const result of elasticsearchResults) {
          const tender = tenders.find((t) => t.id === result.id);
          if (tender) {
            fullTenderData.push({
              ...tender,
              search_score: result.search_score,
              match_explanation: result.match_explanation,
              is_bookmarked: bookmarkIds.includes(result.id),
            } as TenderSearchResult);
          }
        }
      }
       // Log search score and match explanation details
      if (fullTenderData.length > 0) {
        console.log("Top result details:");
        console.log(`- Search Score: ${fullTenderData[0].search_score}`);
        console.log(
          `- Match Explanation: ${fullTenderData[0].match_explanation}`
        );
      }

      const response: SearchTendersResponse = {
        results: fullTenderData,
        total_results: fullTenderData.length,
        query: query,
        search_metadata: {
          max_score:
            fullTenderData.length > 0 ? fullTenderData[0].search_score : 0,
        },
      };
      console.log(response);
      res.json(response);
    } catch (error: any) {
      console.error("Error getting recommended tenders:", error);
      res.status(500).json({ error: error.message });
    }
  };

  getTendersFromBookmarkIds = async (req: Request, res: Response) => {
    try {
      const result = await this.tenderService.getTendersFromBookmarkIds(
        req.body.bookmarkIds
      );
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching tenders from bookmark ids:", error);
      res.status(500).json({ error: error.message });
    }
  };

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

  getTenderById = async (req: Request, res: Response) => {
    try {
      const result = await this.databaseService.getTenderById(req.params.id);
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching tender by id:", error);
      res.status(500).json({ error: error.message });
    }
  };

  getAllTenders = async (req: Request, res: Response) => {
    try {
      const result = await this.tenderService.getAllTenders();
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching all tenders:", error);
      res.status(500).json({ error: error.message });
    }
  };

  searchTenders = async (req: Request, res: Response) => {
    const requestStartTime = Date.now();
    const requestId = Math.random().toString(36).substr(2, 9);

    console.log(`🔍 [${requestId}] SEARCH REQUEST RECEIVED`);
    console.log(
      `📝 [${requestId}] Request body:`,
      JSON.stringify(req.body, null, 2)
    );
    console.log(`🌐 [${requestId}] User Agent: ${req.get("User-Agent")}`);
    console.log(`📍 [${requestId}] IP: ${req.ip}`);

    try {
      const searchRequest: SearchTendersRequest = req.body || {};
      const {
        q,
        regions,
        procurement_method,
        procurement_category,
        notice_type,
        status,
        contracting_entity_name,
        closing_date_after,
        closing_date_before,
        publication_date_after,
        publication_date_before,
        limit,
      } = searchRequest;

      console.log(`📋 [${requestId}] Parsed request parameters:`, {
        query: q,
        regions,
        procurement_method,
        procurement_category,
        notice_type,
        status,
        contracting_entity_name,
        closing_date_after,
        closing_date_before,
        publication_date_after,
        publication_date_before,
        limit,
      });

      if (!q) {
        console.log(
          `❌ [${requestId}] Search rejected: Missing query parameter`
        );
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
        status: status || undefined,
        contracting_entity_name: contracting_entity_name || undefined,
        closing_date_after: closing_date_after || undefined, // Don't default to today - let users see all results
        closing_date_before: closing_date_before || undefined,
        publication_date_after: publication_date_after || undefined,
        publication_date_before: publication_date_before || undefined,
        limit: limit || 100,
      };

      console.log(
        `🔧 [${requestId}] Final Elasticsearch search params:`,
        searchParams
      );

      // Use ML service layer for Elasticsearch search (returns minimal data)
      const elasticsearchResults: any[] =
        await this.mlService.searchTendersWithElasticsearch(searchParams);
      console.log(
        `Found ${elasticsearchResults.length} tenders matching query: "${q}"`
      );

      // Get all bookmarks
      const bookmarks = await this.tenderService.getAllBookmarks();
      const bookmarkIds = bookmarks.map(
        (bookmark) => bookmark.tender_notice_id
      );

      // Extract IDs and search metadata
      const tenderIds = elasticsearchResults.map((result) => result.id);
      // Fetch full tender data from database
      const fullTenderData: TenderSearchResult[] = [];

      if (tenderIds.length > 0) {
        const tenders = await this.tenderService.getTendersByIds(tenderIds);

        // Combine database data with search metadata, preserving search order
        for (const result of elasticsearchResults) {
          const tender = tenders.find((t) => t.id === result.id);
          if (tender) {
            fullTenderData.push({
              ...tender,
              search_score: result.search_score,
              match_explanation: result.match_explanation,
              is_bookmarked: bookmarkIds.includes(result.id),
            } as TenderSearchResult);
          }
        }
      }

      // Log search score and match explanation details
      if (fullTenderData.length > 0) {
        console.log("Top result details:");
        console.log(`- Search Score: ${fullTenderData[0].search_score}`);
        console.log(
          `- Match Explanation: ${fullTenderData[0].match_explanation}`
        );
      }

      const response: SearchTendersResponse = {
        results: fullTenderData,
        total_results: fullTenderData.length,
        query: q,
        search_metadata: {
          max_score:
            fullTenderData.length > 0 ? fullTenderData[0].search_score : 0,
        },
      };
      console.log(response);
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
        result: syncResult,
      });
    } catch (error: any) {
      console.error("Error in Elasticsearch sync:", error);

      if (error.message.includes("ML service unavailable")) {
        res.status(503).json({
          error: "Elasticsearch service unavailable",
          details: error.message,
          suggestion: "Ensure ML backend is running on port 8000",
        });
      } else {
        res.status(500).json({
          error: "Failed to sync to Elasticsearch",
          details: error.message,
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
      const syncResult = await this.mlService.syncSingleTenderToElasticsearch(
        tenderId
      );

      res.json({
        message: `Tender ${tenderId} synced to Elasticsearch successfully`,
        result: syncResult,
      });
    } catch (error: any) {
      console.error(`Error syncing tender ${req.params.tenderId}:`, error);

      if (error.message.includes("ML service unavailable")) {
        res.status(503).json({
          error: "Elasticsearch service unavailable",
          details: error.message,
          suggestion: "Ensure ML backend is running on port 8000",
        });
      } else {
        res.status(500).json({
          error: "Failed to sync tender to Elasticsearch",
          details: error.message,
        });
      }
    }
  };
}
