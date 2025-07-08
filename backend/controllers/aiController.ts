import { Request, Response } from "express";
import { RfpService, TenderService } from "../services";

export class AiController {
  constructor(
    private rfpService: RfpService,
    private tenderService: TenderService
  ) {}

  generateLeads = async (req: Request, res: Response) => {
    try {
      const result = await this.rfpService.generateLeads(req.body.prompt);
      res.json(result);
    } catch (error: any) {
      console.error("Error generating leads:", error);
      res.status(500).json({ error: "Failed to generate leads" });
    }
  };

  getRfpAnalysis = async (req: Request, res: Response) => {
    try {
      const result = await this.rfpService.analyzeRfp(req.body);
      res.json(result);
    } catch (error: any) {
      console.error("Error analyzing RFP:", error);
      res.status(500).json({ error: "Failed to analyze RFP" });
    }
  };

  filterTendersWithAI = async (req: Request, res: Response) => {
    try {
      const { prompt, data } = req.body;
      const result = await this.tenderService.filterTendersWithAi(prompt, data);
      res.json(result);
    } catch (error: any) {
      console.error("Error filtering tenders:", error);
      res.status(500).json({ error: "Failed to filter tenders" });
    }
  };
}
