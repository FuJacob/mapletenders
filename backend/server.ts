import * as path from "path";
import express from "express";
import OpenAI from "openai";
import cors from "cors";
import axios from "axios";
import Papa from "papaparse";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config(); // Load environment variables from .env file
// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

// Define the target columns to filter the tender notices
// We need to do this because in our database, the names are forcefully truncated
// So we define the actual database column names here
const targetColumns: { [key: string]: string } = {
  "title-titre-eng": "title",
  "referenceNumber-numeroReference": "reference_number",
  "amendmentNumber-numeroModification": "amendment_number",
  "solicitationNumber-numeroSollicitation": "solicitation_number",
  "publicationDate-datePublication": "publication_date",
  "tenderClosingDate-appelOffresDateCloture": "tender_closing_date",
  "amendmentDate-dateModification": "amendment_date",
  "expectedContractStartDate-dateDebutContratPrevue":
    "expected_contract_start_date",
  "expectedContractEndDate-dateFinContratPrevue": "expected_contract_end_date",
  "tenderStatus-appelOffresStatut-eng": "tender_status",
  "gsin-nibs": "gsin",
  "gsinDescription-nibsDescription-eng": "gsin_description",
  unspsc: "unspsc",
  "unspscDescription-eng": "unspsc_description",
  "procurementCategory-categorieApprovisionnement": "procurement_category",
  "noticeType-avisType-eng": "notice_type",
  "procurementMethod-methodeApprovisionnement-eng": "procurement_method",
  "selectionCriteria-criteresSelection-eng": "selection_criteria",
  "limitedTenderingReason-raisonAppelOffresLimite-eng":
    "limited_tendering_reason",
  "tradeAgreements-accordsCommerciaux-eng": "trade_agreements",
  "regionsOfOpportunity-regionAppelOffres-eng": "regions_of_opportunity",
  "regionsOfDelivery-regionsLivraison-eng": "regions_of_delivery",
  "contractingEntityName-nomEntitContractante-eng": "contracting_entity_name",
  "contractingEntityAddressLine-ligneAdresseEntiteContractante-eng":
    "contracting_entity_address_line",
  "contractingEntityAddressCity-entiteContractanteAdresseVille-eng":
    "contracting_entity_city",
  "contractingEntityAddressProvince-entiteContractanteAdresseProvince-eng":
    "contracting_entity_province",
  "contractingEntityAddressPostalCode-entiteContractanteAdresseCodePostal":
    "contracting_entity_postal_code",
  "contractingEntityAddressCountry-entiteContractanteAdressePays-eng":
    "contracting_entity_country",
  "endUserEntitiesName-nomEntitesUtilisateurFinal-eng":
    "end_user_entities_name",
  "endUserEntitiesAddress-adresseEntitesUtilisateurFinal-eng":
    "end_user_entities_address",
  "contactInfoName-informationsContactNom": "contact_name",
  "contactInfoEmail-informationsContactCourriel": "contact_email",
  "contactInfoPhone-contactInfoTelephone": "contact_phone",
  contactInfoFax: "contact_fax",
  "contactInfoAddressLine-contactInfoAdresseLigne-eng": "contact_address_line",
  "contactInfoCity-contacterInfoVille-eng": "contact_city",
  "contactInfoProvince-contacterInfoProvince-eng": "contact_province",
  contactInfoPostalcode: "contact_postal_code",
  "contactInfoCountry-contactInfoPays-eng": "contact_country",
  "noticeURL-URLavis-eng": "notice_url",
  "attachment-piecesJointes-eng": "attachments",
  "tenderDescription-descriptionAppelOffres-eng": "tender_description",
};

const app = express();
app.use(cors({ origin: "*" })); // Allow all origins
app.use(express.json({ limit: "10mb" })); // Limit is 1mb so can parse more tenders

// Initialize OpenAI client
const openai = new OpenAI({
  baseURL: process.env.GEMINI_BASE_URL,
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Root endpoint
 * @route GET /
 * @returns {Object} Welcome message
 */
app.get("/", (req, res) => {
  res.send({ message: "Welcome to TDP BACKEND." });
});

/**
 * Generates AI completions based on a predefined prompt
 * @route POST /generateLeads
 * @param {string} req.body.prompt - The prompt to generate completion for
 * @returns {string} AI generated completion
 */
app.post("/generateLeads", async (req, res) => {
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
app.post("/getRfpAnalysis", async (req, res) => {
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
app.post("/filterTendersWithAI", async (req, res) => {
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

/**
 * Downloads open tender notices as CSV
 * @route GET /getOpenTenderNotices
 * @returns {File} CSV file containing tender notices
 */
app.get("/getOpenTenderNotices", async (req, res) => {
  try {
    const openTenderNoticesURL = process.env.OPEN_TENDER_NOTICES_URL || "";
    const response = await axios.get(openTenderNoticesURL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      responseType: "stream",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=newTenderNotice.csv"
    );
    response.data.pipe(res);
    console.log("Successfully downloaded newest tender notice!");
  } catch (error) {
    console.error("Error downloading tender notices:", error);
    res.status(500).json({ error: "Failed to download tender notices" });
  }
});

/**
 * Filters open tender notices and saves to database
 * @route POST /filterOpenTenderNotices
 * @param {string} req.body.prompt - The filtering criteria
 * @returns {Object[]} Filtered tender notices
 */
app.post("/filterOpenTenderNotices", async (req, res) => {
  try {
    const search = req.query.search || "";
    // Clear existing filtered notices
    const { error: deleteError } = await supabase
      .from("filtered_open_tender_notices")
      .delete()
      .neq("referenceNumber-numeroReference", 0);

    if (!search) {
      res.json([]);
      return;
    }

    if (deleteError) {
      console.error("Failed to delete existing filtered notices:", deleteError);
    }

    // Fetch tender notices
    const { data, error } = await supabase
      .from("tenders")
      .select(
        "referenceNumber-numeroReference, tenderDescription-descriptionAppelOffres-eng"
      )
      .limit(5);

    if (error) {
      throw new Error(`Failed to fetch tender notices: ${error.message}`);
    }

    // Filter tenders using AI
    const response = await axios.post(
      "http://localhost:4000/filterTendersWithAI",
      {
        prompt: search,
        data: data,
      }
    );

    const filteredIDs = JSON.parse(response.data).matches;

    // Get full data for matched tenders
    const { data: matchedData, error: matchError } = await supabase
      .from("tenders")
      .select("*")
      .in("referenceNumber-numeroReference", filteredIDs);

    if (matchError) {
      throw new Error(`Failed to fetch matched data: ${matchError.message}`);
    }

    // Insert filtered results
    const { error: insertError } = await supabase
      .from("filtered_open_tender_notices")
      .insert(matchedData);

    if (insertError) {
      throw new Error(`Failed to insert filtered data: ${insertError.message}`);
    }

    // Return filtered results
    const { data: fetchFilteredData, error: fetchFilteredDataError } =
      await supabase.from("filtered_open_tender_notices").select("*");

    if (fetchFilteredDataError) {
      throw new Error(
        `Failed to fetch filtered data: ${fetchFilteredDataError.message}`
      );
    }

    res.json(fetchFilteredData);
  } catch (error: any) {
    console.error("Error filtering open tender notices:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Fetches filtered tender notices from the database
 * @route GET /getFilteredTenderNoticesFromDB
 * @returns {Object[]} Array of filtered tender notices
 */
app.get("/getFilteredTenderNoticesFromDB", async (req, res) => {
  try {
    const { data, error: fetchError } = await supabase
      .from("filtered_open_tender_notices")
      .select("*");

    if (fetchError) {
      throw new Error(
        `Failed to fetch filtered notices: ${fetchError.message}`
      );
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error fetching filtered notices:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Downloads and imports tender notices CSV into database
 * @route POST /getOpenTenderNoticesToDB
 * @returns {string} Success message
 */
app.post("/getOpenTenderNoticesToDB", async (req, res) => {
  const openTenderNoticesURL = process.env.OPEN_TENDER_NOTICES_URL || "";

  const filterToTargetColumns = (row: any) =>
    Object.entries(row).reduce((acc, [csvKey, value]) => {
      // Try to find an exact match for the CSV key in targetColumns
      if (!targetColumns[csvKey]) {
        return acc;
      }

      let match = targetColumns[csvKey];
      if (match) {
        acc[match] = value;
      }
      return acc;
    }, {} as Record<string, any>);

  try {
    // Clear existing notices
    const { error: deleteError } = await supabase
      .from("tenders")
      .delete()
      .neq("title", 0);

    if (deleteError) {
      throw new Error(
        `Failed to clear existing notices: ${deleteError.message}`
      );
    }

    // Download CSV
    const response = await axios.get(openTenderNoticesURL, {
      headers: {
        "User-Agent": process.env.USER_AGENT || "",
      },
    });

    // Parse CSV and filter columns
    const results = await Papa.parse(response.data, {
      header: true,
      skipEmptyLines: true,
    });

    const filteredData = results.data.map(filterToTargetColumns);

    /**
     *
     * NOW WE ARE CREATING THE EMBEDDINGS
     *
     */
    console.log("Generating embeddings for filtered data...");

    const embeddingsResponse = await axios.post(
      "http://127.0.0.1:8000/embeddings/generate/data",
      filteredData
    );
    console.log("Embeddings response:", embeddingsResponse.data);
    if (embeddingsResponse.status !== 200) {
      throw new Error(
        `Failed to generate embeddings: ${embeddingsResponse.statusText}`
      );
    }
    for (let i = 0; i < filteredData.length; i++) {
      // Add embeddings to each row
      filteredData[i].embedding = embeddingsResponse.data.embeddings[i];
      filteredData[i].embedding_input =
        embeddingsResponse.data.embedding_inputs[i];
    }
    const { error: insertError } = await supabase
      .from("tenders")
      .insert(filteredData);

    if (insertError) {
      throw new Error(`Failed to insert notices: ${insertError.message}`);
    }

    res.json({ message: "Data imported successfully!" });
  } catch (error: any) {
    console.error("Error importing tender notices:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Fetches all open tender notices from database
 * @route GET /getOpenTenderNoticesFromDB
 * @returns {Object[]} Array of all tender notices
 */
app.get("/getOpenTenderNoticesFromDB", async (req, res) => {
  try {
    const { data, error } = await supabase.from("tenders").select("*");

    if (error) {
      throw new Error(`Failed to fetch tender notices: ${error.message}`);
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error fetching tender notices:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Search tenders using vector similarity
 * @route POST /filterByVector
 * @param {string} req.body.query - The search query
 * @returns {Object[]} Array of matching tender notices
 */
app.post("/filterByVector", async (req, res) => {
  try {
console.log(req.body);
    const { q } = req.body || {};

    if (!q) {
      res.status(400).json({ error: "Query is required" });
    }

    console.log(`Processing vector search for query: "${q}"`);

    try {
      // Get embedding from ML endpoint
      const embeddingResponse = await axios.post(
        "http://127.0.0.1:8000/embeddings/generate/query",
        {
          q,
        }
      );

      const vector = embeddingResponse.data.embedded_query;

      // Validate vector
      if (!Array.isArray(vector) || vector.length === 0) {
        res
          .status(400)
          .json({ error: "Invalid embedding vector returned from ML service" });
      }

      // Query Supabase for matching tenders using vector similarity
      const { data: tenders, error } = await supabase.rpc(
        "match_tenders_by_vector",
        {
          query_embedding: vector,
          match_threshold: 0.78,
          match_count: 10,
        }
      );

      if (error) {
        throw new Error(`Failed to match tenders: ${error.message}`);
      }

      console.log(`Found ${tenders?.length || 0} matching tenders`);
      res.json({ tenders: tenders || [] });
    } catch (mlError: any) {
      console.error("Error connecting to ML service:", mlError.message);
      res
        .status(503)
        .json({ error: "ML service unavailable", details: mlError.message });
    }
  } catch (error: any) {
    console.error("Error in /filterByVector:", error);
    res.status(500).json({ error: "Failed to filter by vector" });
  }
});

// Serve static files from the 'assets' folder
app.use("/assets", express.static(path.join(__dirname, "assets")));

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
server.on("error", console.error);
