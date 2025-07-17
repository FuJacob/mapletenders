import OpenAI from "openai";
import { GoogleGenAI, Type } from "@google/genai";
import { Database } from "../database.types";

type Tender = Database["public"]["Tables"]["tenders_new"]["Row"];
type TenderSummaries = {
  id: string;
  summary: string | null;
}[];

export class AiService {
  private openai: OpenAI;
  private genAI: GoogleGenAI;

  // Chat sessions storage (in-memory for now)
  private chatSessions = new Map<string, any>();

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

  async filterTendersBySummary(tenders: TenderSummaries, query: string) {
    console.log("tenders", tenders);
    console.log("query", query);
    const tendersToAnalyze = tenders
      .map((tender) => {
        return `id: ${tender.id} + summary: ${tender.summary}`;
      })
      .join("\n");

    try {
      const response = await this.genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are a helpful assistant tasked with filtering government tenders based on a user query.

Given a list of tenders in the format:
id: <ID> + summary: <SUMMARY>

Return a JSON array of IDs that match the following query:
"${query}"

Tenders:
${tendersToAnalyze}

Return only a valid JSON array of IDs, like ["abc123", "def456"].`,
        config: {
          systemInstruction: `You are an expert in government tenders. Your task is to find which tenders match the given query based on their summaries. Return only a JSON array of IDs.`,
          responseMimeType: "application/json",
        },
      });
      console.log("response", response.text);
      return JSON.parse(response.text || "[]");
    } catch (error) {
      console.error("Error generating tender summary with Gemini:", error);
      throw new Error("Failed to generate tender summary");
    }
  }
  async filterTenders(prompt: string, tenderData: any[]) {
    console.log("tenderData", tenderData);
    console.log("prompt", prompt);
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

  async generatePrecomputedSummary(tender: Tender): Promise<string> {
    try {
      // Extract key information from tender (updated for tenders_new schema)
      const keyInfo = {
        title: tender.title,
        description: tender.description,
        category: tender.category_primary,
        entity: tender.contracting_entity_name,
        closing_date: tender.closing_date,
        regions: tender.delivery_location,
      };

      const prompt = `Summarize this government tender in 3 sentences focusing on the MOST important information for businesses:

Title: ${keyInfo.title}
Description: ${keyInfo.description}
Category: ${keyInfo.category}
Entity: ${keyInfo.entity}
Closing Date: ${keyInfo.closing_date}
Regions: ${keyInfo.regions}

Return ONLY the summary text, no JSON, no formatting. Focus on what they're buying, from which organization, and key constraints like deadline or location.`;

      const response = await this.genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are an expert at creating concise, business-focused summaries of government tenders. Your summaries help businesses quickly understand opportunities. Be direct and factual.",
        },
      });
      console.log("Precomputed summary:", response.text);
      return response.text?.trim() || "No summary available";
    } catch (error) {
      console.error("Error generating precomputed summary:", error);
      return "Summary generation failed";
    }
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

      return { summary: response.text };
    } catch (error) {
      console.error("Error generating tender summary with Gemini:", error);
      throw new Error("Failed to generate tender summary");
    }
  }

  async createChatSession(sessionId: string) {
    const chat = this.genAI.chats.create({
      model: "gemini-2.5-flash",
      history: [
        {
          role: "user",
          parts: [
            {
              text: "Hello! I'm looking for help with government tenders and procurement opportunities.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hello! I'm here to help you with government tenders and procurement opportunities. I can answer questions about tender processes, requirements, deadlines, and help you understand specific opportunities. What would you like to know?",
            },
          ],
        },
      ],
    });

    this.chatSessions.set(sessionId, chat);
    return chat;
  }

  async sendChatMessage(sessionId: string, message: string) {
    try {
      let chat = this.chatSessions.get(sessionId);

      if (!chat) {
        // Create new chat session if it doesn't exist
        chat = await this.createChatSession(sessionId);
      }

      const response = await chat.sendMessage({
        message: message,
      });

      return {
        message: response.text,
        sessionId: sessionId,
      };
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw new Error("Failed to send chat message");
    }
  }

  getChatSession(sessionId: string) {
    return this.chatSessions.get(sessionId);
  }

  deleteChatSession(sessionId: string) {
    return this.chatSessions.delete(sessionId);
  }
}
