import { Router } from "express";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const router = Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: process.env.GEMINI_BASE_URL,
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generates AI completions based on a predefined prompt
 * @route POST /generateLeads
 * @param {string} req.body.prompt - The prompt to generate completion for
 * @returns {string} AI generated completion
 */
router.post("/generateLeads", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.GEMINI_AI_MODEL_ID || "",
      messages: [
        { role: "developer", content: "You are a helpful assistant." },
        { role: "user", content: req.body.prompt },
      ],
    });
    res.json(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error generating leads:", error);
    res.status(500).json({ error: "Failed to generate leads" });
  }
});

/**
 * Analyzes RFP data using AI and stores the analysis
 * @route POST /getRfpAnalysis
 * @param {Object} req.body - The RFP data to analyze
 * @returns {string} AI generated analysis
 */
router.post("/getRfpAnalysis", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.GEMINI_AI_MODEL_ID || "",
      messages: [
        { role: "assistant", content: "You are an AI that summarizes data" },
        { role: "user", content: JSON.stringify(req.body) },
      ],
    });

    const response = completion.choices[0].message.content;
    const { error } = await supabase
      .from("rfp_analysis")
      .insert({ data: response });

    if (error) {
      console.error("Error storing RFP analysis:", error);
      res.status(500).json({ error });
      return;
    }

    res.json(response || "{}");
  } catch (error) {
    console.error("Error analyzing RFP:", error);
    res.status(500).json({ error: "Failed to analyze RFP" });
  }
});

/**
 * Filters tenders using AI based on a prompt
 * @route POST /filterTendersWithAI
 * @param {string} req.body.prompt - The filtering criteria
 * @param {Object[]} req.body.data - The tender data to filter
 * @returns {Object} JSON object containing matching reference IDs
 */
router.post("/filterTendersWithAI", async (req, res) => {
  try {
    const { prompt, data } = req.body;
    const completion = await openai.chat.completions.create({
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
        { role: "user", content: JSON.stringify(data) },
      ],
      response_format: { type: "json_object" },
    });
    res.json(completion.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error filtering tenders:", error);
    res.status(500).json({ error: "Failed to filter tenders" });
  }
});

export default router;
