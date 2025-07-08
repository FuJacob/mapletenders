import { Request, Response } from "express";
import { TenderService } from "../services";

export class TenderController {
  constructor(private tenderService: TenderService) {}

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

  filterOpenTenderNotices = async (req: Request, res: Response) => {
    try {
      const search = req.query.search as string || "";
      const result = await this.tenderService.filterOpenTenderNotices(search);
      res.json(result);
    } catch (error: any) {
      console.error("Error filtering open tender notices:", error);
      res.status(500).json({ error: error.message });
    }
  };

  getFilteredTenderNoticesFromDB = async (req: Request, res: Response) => {
    try {
      const result = await this.tenderService.getFilteredTenderNotices();
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching filtered notices:", error);
      res.status(500).json({ error: error.message });
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

      const result = await this.tenderService.searchTendersByVector(q);
      res.json(result);
    } catch (error: any) {
      console.error("Error in /filterByVector:", error);
      if (error.message.includes("ML service unavailable")) {
        res.status(503).json({ error: "ML service unavailable", details: error.message });
      } else {
        res.status(500).json({ error: "Failed to filter by vector" });
      }
    }
  };
}
