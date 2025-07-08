import { DatabaseService } from "./databaseService";
import { AiService } from "./aiService";

export class RfpService {
  constructor(
    private dbService: DatabaseService,
    private aiService: AiService
  ) {}

  async generateLeads(prompt: string) {
    return await this.aiService.generateLeads(prompt);
  }

  async analyzeRfp(rfpData: any) {
    // 1. Analyze RFP with AI
    const analysisResult = await this.aiService.analyzeRfp(rfpData);

    // 2. Store the analysis
    const { error } = await this.dbService.insertRfpAnalysis(
      analysisResult || "{}"
    );
    if (error) {
      console.error("Error storing RFP analysis:", error);
      throw new Error("Failed to store RFP analysis");
    }

    return analysisResult || "{}";
  }
}
