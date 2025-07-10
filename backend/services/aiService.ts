import OpenAI from "openai";
import { GoogleGenAI, Type } from "@google/genai";

export class AiService {
  private openai: OpenAI;
  private genAI: GoogleGenAI;

  constructor() {
    this.openai = new OpenAI({
      baseURL: process.env.GEMINI_BASE_URL,
      apiKey: process.env.GEMINI_API_KEY,
    });

    this.genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  }

  async generateLeads(prompt: string) {
    const completion = await this.openai.chat.completions.create({
      model: process.env.GEMINI_AI_MODEL_ID || "",
      messages: [
        { role: "developer", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });
    return completion.choices[0].message.content;
  }

  async analyzeRfp(rfpData: any) {
    const completion = await this.openai.chat.completions.create({
      model: process.env.GEMINI_AI_MODEL_ID || "",
      messages: [
        { role: "assistant", content: "You are an AI that summarizes data" },
        { role: "user", content: JSON.stringify(rfpData) },
      ],
    });
    return completion.choices[0].message.content;
  }

  async filterTenders(prompt: string, tenderData: any[]) {
    const completion = await this.openai.chat.completions.create({
      model: process.env.GEMINI_AI_MODEL_ID || "",
      messages: [
        {
          role: "assistant",
          content: `You are an AI that helps users filter a database of government tenders. 
You MUST return a valid JSON response matching this exact format:
{
  "matches": ["REF1", "REF2"]
}

You are provided with tender objects containing:
- 'referenceNumber-numeroReference' (the ID)
- 'tenderDescription-descriptionAppelOffres-eng' (the description)

Your task:
1. Read each tender description
2. Find matches for this request: "${prompt}"
3. Return ONLY valid JSON with matching reference IDs

The tender data to analyze is: `,
        },
        { role: "user", content: JSON.stringify(tenderData) },
      ],
      response_format: { type: "json_object" },
    });
    return completion.choices[0].message.content || "{}";
  }

  async generateTenderSummary(tenderId: string, tenderData: string) {
    try {
      const response = await this.genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze this government tender data and provide a concise, actionable summary: ${tenderData}`,
        config: {
          systemInstruction: `You are BreezeAI, an expert AI assistant specialized in analyzing government procurement tenders. Create a concise, business-focused summary that helps companies quickly understand if this opportunity is worth pursuing.

Focus on the most important information that drives business decisions.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description:
                  "2-3 sentence executive summary of the opportunity",
              },
              keyDetails: {
                type: Type.OBJECT,
                properties: {
                  objective: {
                    type: Type.STRING,
                    description: "What they're buying/seeking",
                  },
                  category: {
                    type: Type.STRING,
                    description: "Procurement category",
                  },
                  value: {
                    type: Type.STRING,
                    description: "Estimated value or budget range",
                  },
                },
                propertyOrdering: ["objective", "category", "value"],
              },
              requirements: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
                description: "Top 3-5 key requirements",
              },
              recommendation: {
                type: Type.OBJECT,
                properties: {
                  priority: {
                    type: Type.STRING,
                    description: "High, Medium, Low, or Skip",
                  },
                  reason: {
                    type: Type.STRING,
                    description: "Brief reason for the recommendation",
                  },
                },
                propertyOrdering: ["priority", "reason"],
              },
            },
            propertyOrdering: [
              "summary",
              "keyDetails",
              "requirements",
              "recommendation",
            ],
          },
        },
      });

      return { tenderId, summary: response.text };
    } catch (error) {
      console.error("Error generating tender summary with Gemini:", error);
      throw new Error("Failed to generate tender summary");
    }
  }
}
