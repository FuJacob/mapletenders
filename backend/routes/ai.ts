import { Router } from "express";
import { aiController } from "../container";

const router = Router();

/**
 * Generates AI completions based on a predefined prompt
 * @route POST /generateLeads
 * @param {string} req.body.prompt - The prompt to generate completion for
 * @returns {string} AI generated completion
 */
router.post("/generateLeads", (req, res) =>
  aiController.generateLeads(req, res)
);

/**
 * Analyzes RFP data using AI and stores the analysis
 * @route POST /getRfpAnalysis
 * @param {Object} req.body - The RFP data to analyze
 * @returns {string} AI generated analysis
 */
router.post("/getRfpAnalysis", (req, res) =>
  aiController.getRfpAnalysis(req, res)
);

/**
 * Filters tenders using AI based on a prompt
 * @route POST /filterTendersWithAI
 * @param {string} req.body.prompt - The filtering criteria
 * @param {Object[]} req.body.data - The tender data to filter
 * @returns {Object} JSON object containing matching reference IDs
 */
router.post("/filterTendersWithAI", (req, res) =>
  aiController.filterTendersWithAI(req, res)
);

/**
 * Generates AI summary for tender data
 * @route POST /generateTenderSummary
 * @param {string} req.body.tenderData - The tender data as a string to summarize
 * @returns {string} AI generated summary
 */
router.post("/generateTenderSummary", (req, res) => {
  aiController.generateTenderSummary(req, res);
});

export default router;
