import { Request, Response } from "express";
import {
  RfpService,
  TenderService,
  DatabaseService,
  AiService,
} from "../services";
export class AiController {
  constructor(
    private rfpService: RfpService,
    private tenderService: TenderService,
    private databaseService: DatabaseService,
    private aiService: AiService
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

  generateTenderSummary = async (req: Request, res: Response) => {
    try {
      const { tenderId, tenderData } = req.body;

      if (!tenderId || !tenderData) {
        return res.status(400).json({
          error: "tenderId and tenderData are required"
        });
      }

      // Check if summary already exists
      const existingSummary = await this.databaseService.getTenderAiSummary(tenderId);
      if (existingSummary) {
        console.log(`Using cached summary for tender ${tenderId}`);
        return res.json({ summary: existingSummary });
      }

      // Generate new summary
      console.log(`Generating new summary for tender ${tenderId}`);
      const result = await this.aiService.generateTenderSummary(tenderId, tenderData);
      
      // Parse the summary from the result
      let parsedSummary;
      try {
        if (!result.summary) {
          throw new Error("No summary returned from AI service");
        }
        parsedSummary = JSON.parse(result.summary);
      } catch (error) {
        console.error("Failed to parse AI summary JSON:", error);
        return res.status(500).json({ error: "Failed to parse AI summary" });
      }
      
      // Save to database
      if (parsedSummary) {
        await this.databaseService.saveTenderAiSummary(tenderId, parsedSummary);
        console.log(`Saved AI summary for tender ${tenderId}`);
      }

      res.json({ summary: parsedSummary });
    } catch (error: any) {
      console.error("Error generating tender summary:", error);
      res.status(500).json({ error: "Failed to generate tender summary" });
    }
  };
}
