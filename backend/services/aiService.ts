import OpenAI from "openai";

export class AiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      baseURL: process.env.GEMINI_BASE_URL,
      apiKey: process.env.GEMINI_API_KEY,
    });
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
}
