import { Request, Response } from "express";
import { TenderService } from "../services";
import { AiService } from "../services";

export class TenderController {
  constructor(
    private tenderService: TenderService,
    private aiService: AiService
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

  filterByVector = async (req: Request, res: Response) => {
    try {
      const { q } = req.body || {};

      if (!q) {
        res.status(400).json({ error: "Query is required" });
        return;
      }

      const { tenders } = await this.tenderService.searchTendersByVector(q);
      console.log("tenders", tenders);
      const tenderSummaries = tenders.map((tender) => {
        return {
          id: tender.id,
          precomputed_summary: tender.precomputed_summary,
        };
      });

      try {
        const filteredTenders = await this.aiService.filterTendersBySummary(
          tenderSummaries,
          q
        );
        res.json(filteredTenders);
      } catch (error: any) {
        console.error("Error in /filterByVector:", error);
        res.status(500).json({ error: "Failed to filter by vector" });
      }
    } catch (error: any) {
      console.error("Error in /filterByVector:", error);
      if (error.message.includes("ML service unavailable")) {
        res
          .status(503)
          .json({ error: "ML service unavailable", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to filter by vector" });
      }
    }
  };
}
